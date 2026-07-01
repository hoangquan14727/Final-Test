const mongoose = require('mongoose');
const Teacher = require('../models/teacher.model');
const User = require('../models/user.model');
const TeacherPosition = require('../models/teacherPosition.model');
const asyncHandler = require('../middlewares/asyncHandler');
const ApiError = require('../utils/ApiError');
const generateUniqueCode = require('../utils/generateUniqueCode');
const { parsePagination } = require('../utils/pagination');

function toTeacherDTO(t) {
  const u = t.userId || {};
  return {
    _id: t._id,
    code: t.code,
    name: u.name || '',
    email: u.email || '',
    phoneNumber: u.phoneNumber || '',
    address: u.address || '',
    isActive: t.isActive,
    positions: (t.teacherPositionsId || []).map((p) => ({
      _id: p._id,
      name: p.name,
      code: p.code,
    })),
    degrees: (t.degrees || []).map((d) => ({
      type: d.type,
      school: d.school,
      major: d.major,
      year: d.year,
      isGraduated: d.isGraduated,
    })),
  };
}

exports.listTeachers = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const validUserIds = await User.distinct('_id');
  const filter = { userId: { $in: validUserIds } };

  const [items, total] = await Promise.all([
    Teacher.find(filter)
      .sort({ createdAt: -1, _id: -1 })
      .skip(skip)
      .limit(limit)
      .populate({ path: 'userId', select: 'name email phoneNumber address' })
      .populate({ path: 'teacherPositionsId', select: 'name code' })
      .lean(),
    Teacher.countDocuments(filter),
  ]);

  res.json({
    data: items.map(toTeacherDTO),
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  });
});

exports.createTeacher = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    phoneNumber,
    address,
    identity,
    dob,
    teacherPositionsId = [],
    degrees = [],
    startDate,
  } = req.body;

  const missing = [];
  if (!name) missing.push('name');
  if (!email) missing.push('email');
  if (!phoneNumber) missing.push('phoneNumber');
  if (!address) missing.push('address');
  if (!identity) missing.push('identity');
  if (!dob) missing.push('dob');
  if (missing.length) {
    throw new ApiError(400, `Missing required fields: ${missing.join(', ')}`);
  }
  if (!Array.isArray(teacherPositionsId) || teacherPositionsId.length === 0) {
    throw new ApiError(400, 'At least one work position (teacherPositionsId) is required');
  }

  const uniquePositionIds = [...new Set(teacherPositionsId.map(String))];
  const validCount = await TeacherPosition.countDocuments({
    _id: { $in: uniquePositionIds },
  });
  if (validCount !== uniquePositionIds.length) {
    throw new ApiError(400, 'One or more teacherPositionsId are invalid');
  }

  const emailTaken = await User.findOne({ email: email.toLowerCase() }).lean();
  if (emailTaken) throw new ApiError(409, 'Email already exists');

  const session = await mongoose.startSession();
  let createdTeacherId;
  try {
    await session.withTransaction(async () => {
      const code = await generateUniqueCode({ session });

      const [user] = await User.create(
        [
          {
            name,
            email: email.toLowerCase(),
            phoneNumber,
            address,
            identity,
            dob: new Date(dob),
            role: 'TEACHER',
            isDeleted: false,
          },
        ],
        { session }
      );

      const [teacher] = await Teacher.create(
        [
          {
            code,
            userId: user._id,
            isActive: true,
            isDeleted: false,
            startDate: startDate ? new Date(startDate) : new Date(),
            teacherPositionsId: uniquePositionIds,
            degrees,
          },
        ],
        { session }
      );

      createdTeacherId = teacher._id;
    });
  } catch (err) {
    if (err && err.code === 11000) {
      const field = Object.keys(err.keyPattern || {})[0] || 'field';
      if (field === 'email') throw new ApiError(409, 'Email already exists');
      if (field === 'code') {
        throw new ApiError(503, 'Could not allocate a unique teacher code, please retry');
      }
      throw new ApiError(409, `Duplicate ${field}`);
    }
    throw err;
  } finally {
    session.endSession();
  }

  const created = await Teacher.findById(createdTeacherId)
    .populate({ path: 'userId', select: 'name email phoneNumber address' })
    .populate({ path: 'teacherPositionsId', select: 'name code' })
    .lean();

  res.status(201).json({ data: toTeacherDTO(created) });
});
