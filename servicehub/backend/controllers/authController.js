const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '30d' });

// @desc    Register user
// @route   POST /api/auth/register
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone, location } = req.body;
  if (!name || !email || !password) {
    res.status(400); throw new Error('Please provide name, email and password');
  }
  const exists = await User.findOne({ email });
  if (exists) { res.status(400); throw new Error('Email already registered'); }

  const user = await User.create({ name, email, password, role: role || 'client', phone, location });
  res.status(201).json({
    _id: user._id, name: user.name, email: user.email, role: user.role,
    phone: user.phone, location: user.location, avatar: user.avatar,
    token: generateToken(user._id),
  });
});

// @desc    Login user
// @route   POST /api/auth/login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) { res.status(400); throw new Error('Please provide email and password'); }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    res.status(401); throw new Error('Invalid email or password');
  }
  res.json({
    _id: user._id, name: user.name, email: user.email, role: user.role,
    phone: user.phone, location: user.location, avatar: user.avatar, bio: user.bio,
    token: generateToken(user._id),
  });
});

// @desc    Get current user
// @route   GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json(user);
});

module.exports = { registerUser, loginUser, getMe };
