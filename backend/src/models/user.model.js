const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phoneNumber: { type: String, trim: true },
    address: { type: String, trim: true },
    identity: { type: String, trim: true },
    dob: { type: Date },
    role: {
      type: String,
      enum: ['STUDENT', 'TEACHER', 'ADMIN'],
      default: 'TEACHER',
    },
    isDeleted: { type: Boolean, default: false },
    accountId: { type: mongoose.Schema.Types.ObjectId },
  },
  { timestamps: true, strict: false, collection: 'users' }
);

userSchema.index(
  { email: 1 },
  { unique: true, partialFilterExpression: { email: { $type: 'string' } } }
);

module.exports = mongoose.model('User', userSchema);
