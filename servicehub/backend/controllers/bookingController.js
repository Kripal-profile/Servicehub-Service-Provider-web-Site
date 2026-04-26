const asyncHandler = require('express-async-handler');
const Booking = require('../models/Booking');
const Service = require('../models/Service');

// @desc    Create booking
// @route   POST /api/bookings
const createBooking = asyncHandler(async (req, res) => {
  const { serviceId, scheduledDate, scheduledTime, address, notes } = req.body;
  if (!serviceId || !scheduledDate || !scheduledTime || !address) {
    res.status(400); throw new Error('Please provide all required booking details');
  }
  const service = await Service.findById(serviceId);
  if (!service) { res.status(404); throw new Error('Service not found'); }
  if (!service.isActive) { res.status(400); throw new Error('Service is not available'); }
  if (service.provider.toString() === req.user._id.toString()) {
    res.status(400); throw new Error('You cannot book your own service');
  }

  const booking = await Booking.create({
    service: serviceId, client: req.user._id, provider: service.provider,
    scheduledDate, scheduledTime, address, notes: notes || '',
    totalPrice: service.price, status: 'pending',
  });

  const populated = await Booking.findById(booking._id)
    .populate('service', 'title category image price')
    .populate('client', 'name email phone')
    .populate('provider', 'name email phone');

  res.status(201).json(populated);
});

// @desc    Get client's bookings
// @route   GET /api/bookings/my-bookings
const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ client: req.user._id })
    .populate('service', 'title category image price location')
    .populate('provider', 'name email phone avatar')
    .sort({ createdAt: -1 });
  res.json(bookings);
});

// @desc    Get provider's received bookings
// @route   GET /api/bookings/provider-bookings
const getProviderBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ provider: req.user._id })
    .populate('service', 'title category image price')
    .populate('client', 'name email phone avatar')
    .sort({ createdAt: -1 });
  res.json(bookings);
});

// @desc    Update booking status (provider)
// @route   PUT /api/bookings/:id/status
const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status, providerNote } = req.body;
  const allowed = ['accepted', 'rejected', 'completed'];
  if (!allowed.includes(status)) { res.status(400); throw new Error('Invalid status value'); }

  const booking = await Booking.findById(req.params.id);
  if (!booking) { res.status(404); throw new Error('Booking not found'); }
  if (booking.provider.toString() !== req.user._id.toString()) {
    res.status(403); throw new Error('Not authorized to update this booking');
  }

  booking.status = status;
  if (providerNote) booking.providerNote = providerNote;
  await booking.save();

  const updated = await Booking.findById(booking._id)
    .populate('service', 'title category image price')
    .populate('client', 'name email phone')
    .populate('provider', 'name email phone');
  res.json(updated);
});

// @desc    Cancel booking (client)
// @route   PUT /api/bookings/:id/cancel
const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) { res.status(404); throw new Error('Booking not found'); }
  if (booking.client.toString() !== req.user._id.toString()) {
    res.status(403); throw new Error('Not authorized to cancel this booking');
  }
  if (!['pending', 'accepted'].includes(booking.status)) {
    res.status(400); throw new Error('Cannot cancel this booking');
  }
  booking.status = 'cancelled';
  await booking.save();
  res.json({ message: 'Booking cancelled', booking });
});

// @desc    Get single booking
// @route   GET /api/bookings/:id
const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('service', 'title category image price location description')
    .populate('client', 'name email phone avatar')
    .populate('provider', 'name email phone avatar');
  if (!booking) { res.status(404); throw new Error('Booking not found'); }
  const isClient = booking.client._id.toString() === req.user._id.toString();
  const isProvider = booking.provider._id.toString() === req.user._id.toString();
  if (!isClient && !isProvider) { res.status(403); throw new Error('Not authorized'); }
  res.json(booking);
});

module.exports = { createBooking, getMyBookings, getProviderBookings, updateBookingStatus, cancelBooking, getBookingById };
