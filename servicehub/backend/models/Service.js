const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true },
    description: { type: String, required: [true, 'Description is required'] },
    category: {
      type: String,
      required: true,
      enum: ['Electrical', 'Plumbing', 'Cleaning', 'Carpentry', 'Painting', 'Gardening', 'Moving', 'AC Repair', 'Other'],
    },
    price: { type: Number, required: [true, 'Price is required'], min: 0 },
    priceType: { type: String, enum: ['fixed', 'hourly'], default: 'fixed' },
    location: { type: String, required: [true, 'Location is required'] },
    image: { type: String, default: '' },
    provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isActive: { type: Boolean, default: true },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

serviceSchema.index({ category: 1, location: 1, title: 'text', description: 'text' });

module.exports = mongoose.model('Service', serviceSchema);
