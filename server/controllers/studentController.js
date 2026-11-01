const Student = require('../models/Student');
const User = require('../models/User');
const createStudentCode = require('../utils/createStudentCode');

async function listStudents(req, res, next) {
  try {
    const conditions = [];
    if (req.query.search) {
      const term = String(req.query.search).trim();
      const pattern = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      conditions.push({ $or: [{ name: pattern }, { email: pattern }, { course: pattern }, { studentCode: pattern }] });
    }
    if (req.query.status) conditions.push({ enrollmentStatus: req.query.status });
    if (req.query.course) conditions.push({ course: req.query.course });
    const filter = conditions.length ? { $and: conditions } : {};
    const students = await Student.find(filter).sort({ createdAt: -1 }).limit(200);
    res.json({ students, total: await Student.countDocuments(filter) });
  } catch (error) { next(error); }
}

async function createStudent(req, res, next) {
  try {
    const { name, email, phone = '', course, year, enrollmentStatus = 'Active' } = req.body;
    if (!name || !email || !course || !year) return res.status(400).json({ message: 'Name, email, course and year are required.' });
    const student = await Student.create({ studentCode: createStudentCode(), name, email, phone, course, year, enrollmentStatus });
    res.status(201).json({ message: 'Student added successfully.', student });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: 'A student with this email or code already exists.' });
    next(error);
  }
}

async function updateStudent(req, res, next) {
  try {
    const updates = { ...req.body };
    delete updates._id; delete updates.userId; delete updates.studentCode; delete updates.createdAt; delete updates.updatedAt;
    const student = await Student.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!student) return res.status(404).json({ message: 'Student not found.' });
    if (student.userId) await User.findByIdAndUpdate(student.userId, { name: student.name, email: student.email });
    res.json({ message: 'Student updated successfully.', student });
  } catch (error) { next(error); }
}

async function deleteStudent(req, res, next) {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found.' });
    if (student.userId) await User.findByIdAndDelete(student.userId);
    res.json({ message: 'Student and linked login account deleted.' });
  } catch (error) { next(error); }
}

async function bulkCreateStudents(req, res, next) {
  try {
    if (!Array.isArray(req.body.students) || req.body.students.length === 0) return res.status(400).json({ message: 'Send a non-empty students array.' });
    if (req.body.students.length > 100) return res.status(400).json({ message: 'You can insert up to 100 students at a time.' });
    const entries = req.body.students.map((student) => ({ studentCode: createStudentCode(), ...student }));
    const students = await Student.insertMany(entries, { ordered: true });
    res.status(201).json({ message: `${students.length} students inserted.`, students });
  } catch (error) { next(error); }
}

module.exports = { listStudents, createStudent, updateStudent, deleteStudent, bulkCreateStudents };
