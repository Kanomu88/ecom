const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  customer: {
    firstName: {
      type: String,
      required: [true, 'กรุณาระบุชื่อ'],
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
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'รูปแบบอีเมลไม่ถูกต้อง']
    },
    phone: {
      type: String,
      required: [true, 'กรุณาระบุเบอร์โทรศัพท์'],
      trim: true,
      match: [/^[0-9]{10}$/, 'เบอร์โทรต้องเป็นตัวเลข 10 หลัก']
    }
  },
  shippingAddress: {
    address: {
      type: String,
      required: [true, 'กรุณาระบุที่อยู่'],
      trim: true
    },
    province: {
      type: String,
      required: [true, 'กรุณาระบุจังหวัด'],
      trim: true
    },
    postalCode: {
      type: String,
      required: [true, 'กรุณาระบุรหัสไปรษณีย์'],
      trim: true,
      match: [/^[0-9]{5}$/, 'รหัสไปรษณีย์ต้องเป็นตัวเลข 5 หลัก']
    },
    note: {
      type: String,
      default: '',
      trim: true
    }
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    imageUrl: {
      type: String,
      default: ''
    }
  }],
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  paymentInfo: {
    method: {
      type: String,
      default: 'promptpay'
    },
    qrCode: {
      type: String,
      default: ''
    },
    paidAt: {
      type: Date,
      default: null
    }
  },
  trackingNumber: {
    type: String,
    default: '',
    trim: true
  },
  statusHistory: [{
    status: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    note: {
      type: String,
      default: '',
      trim: true
    }
  }]
}, {
  timestamps: true
});

// Method: สร้างหมายเลขคำสั่งซื้อที่ไม่ซ้ำ (format: ORD-YYYYMMDD-XXX)
OrderSchema.statics.generateOrderNumber = async function() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const datePrefix = `ORD-${year}${month}${day}`;
  
  // หาคำสั่งซื้อล่าสุดของวันนี้
  const lastOrder = await this.findOne({
    orderNumber: new RegExp(`^${datePrefix}`)
  }).sort({ orderNumber: -1 });
  
  let sequence = 1;
  if (lastOrder) {
    const lastSequence = parseInt(lastOrder.orderNumber.split('-')[2]);
    sequence = lastSequence + 1;
  }
  
  return `${datePrefix}-${String(sequence).padStart(3, '0')}`;
};

// Method: เพิ่มประวัติสถานะ
OrderSchema.methods.addStatusHistory = function(status, note = '') {
  this.statusHistory.push({
    status,
    timestamp: new Date(),
    note
  });
  this.status = status;
};

// Pre-save hook: คำนวณ totalAmount อัตโนมัติ
OrderSchema.pre('save', function(next) {
  if (this.items && this.items.length > 0) {
    this.totalAmount = this.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }
  
  // เพิ่มสถานะแรกใน statusHistory ถ้ายังไม่มี
  if (this.isNew && this.statusHistory.length === 0) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
      note: 'คำสั่งซื้อถูกสร้าง'
    });
  }
  
  next();
});

module.exports = mongoose.model('Order', OrderSchema);
