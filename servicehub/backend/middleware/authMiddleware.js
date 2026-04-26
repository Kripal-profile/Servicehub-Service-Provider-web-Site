const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        res.status(401);
        throw new Error('User not found');
      }
      next();
    } catch (error) {
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }
  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

const providerOnly = (req, res, next) => {
  if (req.user && req.user.role === 'provider') return next();
  res.status(403);
  throw new Error('Access denied: Service Providers only');
};

const clientOnly = (req, res, next) => {
  if (req.user && req.user.role === 'client') return next();
  res.status(403);
  throw new Error('Access denied: Clients only');
};

module.exports = { protect, providerOnly, clientOnly };
