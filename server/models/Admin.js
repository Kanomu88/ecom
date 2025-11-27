const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const AdminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'กรุณาระบุ username'],
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'กรุณาระบุรหัสผ่าน'],
    minlength: 6,
    select: false 
  },
  firstName: {
    type: String,
    required: [true, 'กรุณาระบุชื่อจริง'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'กรุณาระบุนามสกุล'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'กรุณาระบุอีเมล'],
    unique: true,
    lowercase: true,
    trim: true
  },
  role: {
    type: String,
    default: 'admin',
    enum: ['admin', 'superadmin']
  }
}, {
  timestamps: true
});

// Hash password ก่อน save
AdminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  // Hash password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//  เปรียบเทียบ password
AdminSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Admin', AdminSchema);
