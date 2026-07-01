const mongoose = require('mongoose');

const degreeSchema = new mongoose.Schema(
  {
    type: { type: String, trim: true },
    school: { type: String, trim: true },
    major: { type: String, trim: true },
    year: { type: Number },
    isGraduated: { type: Boolean, default: false },
  },
  { _id: true }
);

const teacherSchema = new mongoose.Schema(
  {
    code: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, default: null },
    teacherPositionsId: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'TeacherPosition' },
    ],
    degrees: [degreeSchema],
  },
  { timestamps: true, strict: false, collection: 'teachers' }
);

teacherSchema.index({ code: 1 }, { unique: true });

module.exports = mongoose.model('Teacher', teacherSchema);
