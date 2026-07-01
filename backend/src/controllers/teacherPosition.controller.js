const TeacherPosition = require('../models/teacherPosition.model');
const asyncHandler = require('../middlewares/asyncHandler');
const ApiError = require('../utils/ApiError');

exports.listPositions = asyncHandler(async (req, res) => {
  const positions = await TeacherPosition.find({})
    .select('name code des isActive')
    .sort({ createdAt: 1, _id: 1 })
    .lean();

  res.json({ data: positions });
});

exports.createPosition = asyncHandler(async (req, res) => {
  const { name, code, des, isActive } = req.body;

  const missing = [];
  if (!name) missing.push('name');
  if (!code) missing.push('code');
  if (missing.length) {
    throw new ApiError(400, `Missing required fields: ${missing.join(', ')}`);
  }

  const trimmedCode = String(code).trim();
  const exists = await TeacherPosition.findOne({ code: trimmedCode }).lean();
  if (exists) throw new ApiError(409, 'Position code already exists');

  try {
    const created = await TeacherPosition.create({
      name: String(name).trim(),
      code: trimmedCode,
      des: des ? String(des).trim() : '',
      isActive: typeof isActive === 'boolean' ? isActive : true,
      isDeleted: false,
    });
    res.status(201).json({ data: created });
  } catch (err) {
    if (err && err.code === 11000) {
      throw new ApiError(409, 'Position code already exists');
    }
    throw err;
  }
});
