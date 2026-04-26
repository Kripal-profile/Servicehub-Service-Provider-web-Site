const asyncHandler = require('express-async-handler');
const Service = require('../models/Service');

// @desc    Get all services (with filters)
// @route   GET /api/services
const getServices = asyncHandler(async (req, res) => {
  const { category, location, search, minPrice, maxPrice, page = 1, limit = 10 } = req.query;
  const query = { isActive: true };

  if (category) query.category = category;
  if (location) query.location = { $regex: location, $options: 'i' };
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }
  if (search) query.$text = { $search: search };

  const total = await Service.countDocuments(query);
  const services = await Service.find(query)
    .populate('provider', 'name email avatar location phone')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json({ services, total, page: Number(page), pages: Math.ceil(total / limit) });
});

// @desc    Get single service
// @route   GET /api/services/:id
const getServiceById = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id).populate('provider', 'name email avatar location phone bio');
  if (!service) { res.status(404); throw new Error('Service not found'); }
  res.json(service);
});

// @desc    Create service
// @route   POST /api/services
const createService = asyncHandler(async (req, res) => {
  const { title, description, category, price, priceType, location, tags } = req.body;
  if (!title || !description || !category || !price || !location) {
    res.status(400); throw new Error('Please fill all required fields');
  }
  const image = req.file ? req.file.path : '';
  const service = await Service.create({
    title, description, category, price: Number(price), priceType, location,
    image, provider: req.user._id,
    tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())) : [],
  });
  const populated = await service.populate('provider', 'name email avatar');
  res.status(201).json(populated);
});

// @desc    Update service
// @route   PUT /api/services/:id
const updateService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) { res.status(404); throw new Error('Service not found'); }
  if (service.provider.toString() !== req.user._id.toString()) {
    res.status(403); throw new Error('Not authorized to update this service');
  }
  const { title, description, category, price, priceType, location, isActive, tags } = req.body;
  if (title) service.title = title;
  if (description) service.description = description;
  if (category) service.category = category;
  if (price) service.price = Number(price);
  if (priceType) service.priceType = priceType;
  if (location) service.location = location;
  if (isActive !== undefined) service.isActive = isActive;
  if (tags) service.tags = Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim());
  if (req.file) service.image = req.file.path;

  const updated = await service.save();
  res.json(updated);
});

// @desc    Delete service
// @route   DELETE /api/services/:id
const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) { res.status(404); throw new Error('Service not found'); }
  if (service.provider.toString() !== req.user._id.toString()) {
    res.status(403); throw new Error('Not authorized to delete this service');
  }
  await service.deleteOne();
  res.json({ message: 'Service deleted successfully' });
});

// @desc    Get provider's own services
// @route   GET /api/services/my-services
const getMyServices = asyncHandler(async (req, res) => {
  const services = await Service.find({ provider: req.user._id }).sort({ createdAt: -1 });
  res.json(services);
});

module.exports = { getServices, getServiceById, createService, updateService, deleteService, getMyServices };
