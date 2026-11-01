const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Student = require('../models/Student');
const createStudentCode = require('../utils/createStudentCode');

function createToken(userId) {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) throw new Error('JWT_SECRET must contain at least 32 characters. Set it in server/.env.');
  return jwt.sign({ id: userId }, secret, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
}

function publicUser(user) {
  return { id: user._id, name: user.name, email: user.email, role: user.role };
}

async function register(req, res, next) {
  try {
    const { name, email, password, phone = '', course, year } = req.body;
    if (!name || !email || !password || !course || !year) {
      return res.status(400).json({ message: 'Name, email, password, course and year are required.' });
    }
    if (String(password).length < 8) return res.status(400).json({ message: 'Password must contain at least 8 characters.' });

    const normalizedEmail = String(email).trim().toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) return res.status(409).json({ message: 'An account with this email already exists. Please log in.' });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name: String(name).trim(), email: normalizedEmail, passwordHash });

    try {
      const student = await Student.create({
        userId: user._id,
        studentCode: createStudentCode(),
        name: String(name).trim(),
        email: normalizedEmail,
        phone: String(phone).trim(),
        course: String(course).trim(),
        year: String(year).trim(),
        enrollmentStatus: 'Active',
      });
      user.studentProfile = student._id;
      await user.save();

      return res.status(201).json({
        message: 'Account created. Your student details have been saved.',
        token: createToken(user._id),
        user: publicUser(user),
        student,
      });
    } catch (error) {
      await User.findByIdAndDelete(user._id);
      throw error;
    }
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: 'This email or student code is already registered. Please try again.' });
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required.' });

    const user = await User.findOne({ email: String(email).trim().toLowerCase() }).select('+passwordHash');
    if (!user) return res.status(401).json({ message: 'Invalid email or password.' });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password.' });

    const student = user.studentProfile
      ? await Student.findById(user.studentProfile)
      : await Student.findOne({ userId: user._id });

    return res.json({
      message: 'Login successful.',
      token: createToken(user._id),
      user: publicUser(user),
      student,
    });
  } catch (error) {
    next(error);
  }
}

async function me(req, res, next) {
  try {
    const student = req.user.studentProfile
      ? await Student.findById(req.user.studentProfile)
      : await Student.findOne({ userId: req.user._id });
    res.json({ user: publicUser(req.user), student });
  } catch (error) {
    next(error);
  }
}

module.exports = { register, login, me };
