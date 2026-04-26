const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// @desc    Update user profile
// @route   PUT /api/users/profile
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) { res.status(404); throw new Error('User not found'); }

  const { name, phone, location, bio } = req.body;
  if (name) user.name = name;
  if (phone) user.phone = phone;
  if (location) user.location = location;
  if (bio) user.bio = bio;
  if (req.file) user.avatar = req.file.path;

  const updated = await user.save();
  res.json({
    _id: updated._id, name: updated.name, email: updated.email,
    role: updated.role, phone: updated.phone, location: updated.location,
    avatar: updated.avatar, bio: updated.bio,
  });
});

// @desc    Change password
// @route   PUT /api/users/change-password
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');
  if (!(await user.matchPassword(currentPassword))) {
    res.status(400); throw new Error('Current password is incorrect');
  }
  user.password = newPassword;
  await user.save();
  res.json({ message: 'Password updated successfully' });
});

// @desc    Get provider public profile
// @route   GET /api/users/provider/:id
const getProviderProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user || user.role !== 'provider') { res.status(404); throw new Error('Provider not found'); }
  res.json(user);
});

module.exports = { updateProfile, changePassword, getProviderProfile };
