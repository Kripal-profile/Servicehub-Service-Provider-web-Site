const express = require('express');
const router = express.Router();
const {
  getServices, getServiceById, createService,
  updateService, deleteService, getMyServices
} = require('../controllers/serviceController');
const { protect, providerOnly } = require('../middleware/authMiddleware');

// Try cloudinary upload, fallback to local multer
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

router.get('/', getServices);
router.get('/my-services', protect, providerOnly, getMyServices);
router.get('/:id', getServiceById);
router.post('/', protect, providerOnly, upload.single('image'), createService);
router.put('/:id', protect, providerOnly, upload.single('image'), updateService);
router.delete('/:id', protect, providerOnly, deleteService);

module.exports = router;
