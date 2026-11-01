const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  studentCode: { type: String, required: true, unique: true, trim: true },
  name: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, lowercase: true, trim: true, index: true },
  phone: { type: String, trim: true, default: '', maxlength: 25 },
  course: { type: String, required: true, trim: true, maxlength: 80 },
  year: { type: String, required: true, trim: true, maxlength: 30 },
  enrollmentStatus: { type: String, enum: ['Active', 'Completed', 'On hold'], default: 'Active' },
}, { timestamps: true });

studentSchema.index({ userId: 1 }, { unique: true, sparse: true });
studentSchema.index({ name: 'text', email: 'text', course: 'text', studentCode: 'text' });
module.exports = mongoose.model('Student', studentSchema);
