const express = require('express');
const router = express.Router();
const { updateProfile, changePassword, getProviderProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

let upload;
try {
  const cloudinaryConfig = require('../config/cloudinary');
  upload = cloudinaryConfig.upload;
} catch {
  const multer = require('multer');
  const path = require('path');
  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
  });
  upload = multer({ storage });
}

router.put('/profile', protect, upload.single('avatar'), updateProfile);
router.put('/change-password', protect, changePassword);
router.get('/provider/:id', getProviderProfile);

module.exports = router;
