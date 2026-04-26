const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    scheduledDate: { type: Date, required: [true, 'Scheduled date is required'] },
    scheduledTime: { type: String, required: [true, 'Scheduled time is required'] },
    address: { type: String, required: [true, 'Service address is required'] },
    notes: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
      default: 'pending',
    },
    totalPrice: { type: Number, required: true },
    providerNote: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
