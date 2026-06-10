const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Le nom de l'hôtel est obligatoire"],
    trim: true
  },
  address: {
    type: String,
    required: [true, "L'adresse est obligatoire"],
    trim: true
  },
  email: {
    type: String,
    required: [true, "L'email est obligatoire"],
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Le numéro de téléphone est obligatoire']
  },
  pricePerNight: {
    type: Number,
    required: [true, 'Le prix par nuit est obligatoire'],
    min: 0
  },
  currency: {
    type: String,
    enum: ['XOF', 'EUR', 'USD'],
    default: 'XOF'
  },
  image: {
    type: String,
    default: ''
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Hotel', hotelSchema);
