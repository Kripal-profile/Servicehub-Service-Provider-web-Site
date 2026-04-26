const express = require('express');
const router = express.Router();
const {
  createBooking, getMyBookings, getProviderBookings,
  updateBookingStatus, cancelBooking, getBookingById
} = require('../controllers/bookingController');
const { protect, providerOnly, clientOnly } = require('../middleware/authMiddleware');

router.post('/', protect, createBooking);
router.get('/my-bookings', protect, getMyBookings);
router.get('/provider-bookings', protect, providerOnly, getProviderBookings);
router.get('/:id', protect, getBookingById);
router.put('/:id/status', protect, providerOnly, updateBookingStatus);
router.put('/:id/cancel', protect, cancelBooking);

module.exports = router;
