const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'กรุณาระบุชื่อสินค้า'],
    trim: true
  },
  brand: {
    type: String,
    required: [true, 'กรุณาระบุแบรนด์'],
    enum: ['Jellycat', 'Care Bear', 'Steiff', 'Gund', 'Squishmallows']
  },
  category: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'กรุณาระบุราคา'],
    min: 0
  },
  rating: {
    type: Number,
    default: 5,
    min: 0,
    max: 5
  },
  ratingCount: {
    type: Number,
    default: 0,
    min: 0
  },
  description: {
    type: String,
    default: ''
  },
  imageUrl: {
    type: String,
    default: ''
  },
  inStock: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', ProductSchema);
