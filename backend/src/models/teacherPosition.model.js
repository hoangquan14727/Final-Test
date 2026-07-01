const mongoose = require('mongoose');

const teacherPositionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, trim: true },
    des: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true, strict: false, collection: 'teacherpositions' }
);

teacherPositionSchema.index({ code: 1 }, { unique: true });

module.exports = mongoose.model('TeacherPosition', teacherPositionSchema);
