require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const Product = require('./models/Product');
const Admin = require('./models/Admin');

// ข้อมูล Admin (2 คน)
const admins = [
  {
    username: 'admin01',
    password: 'admin123',
    firstName: 'สมชาย',
    lastName: 'ใจดี',
    email: 'admin01@dollshop.com',
    role: 'admin'
  },
  {
    username: 'admin02',
    password: 'admin456',
    firstName: 'สมหญิงd',
    lastName: 'รักสวย',
    email: 'admin02@dollshop.com',
    role: 'admin'
  }
];

// ข้อมูล Products (13 รายการ)
const products = [
  // Jellycat (5 รายการ)
  {
    name: 'Bashful Bunnye',
    brand: 'Jellycat',
    category: 'กระต่าย',
    price: 1140,
    rating: 5,
    ratingCount: 27,
    description: 'ตุ๊กตากระต่ายนุ่มนิ่มจาก Jellycat ขนาด 31 ซม. เหมาะสำหรับทุกวัย',
    imageUrl: 'https://m.media-amazon.com/images/I/51v3LQwn3lL.jpg',
    inStock: true
  },
  {
    name: 'Blossom Tulip Bunny',
    brand: 'Jellycat',
    category: 'กระต่าย',
    price: 1590,
    rating: 5,
    ratingCount: 22,
    description: 'กระต่ายดอกทิวลิป สีชมพูหวาน Limited Edition',
    imageUrl: 'https://placehold.co/400x500/FFE5EC/8B6B7B?text=Tulip+Bunny',
    inStock: false
  },
  {
    name: 'Odell Octopus',
    brand: 'Jellycat',
    category: 'สัตว์ทะเล',
    price: 1450,
    rating: 4.8,
    ratingCount: 15,
    description: 'ปลาหมึกยักษ์สีชมพู 8 ขา น่ากอด',
    imageUrl: 'https://m.media-amazon.com/images/I/71hapzD9BbL._AC_UF894,1000_QL80_.jpg',
    inStock: true
  },
  {
    name: 'Yummy Mouse',
    brand: 'Jellycat',
    category: 'หนู',
    price: 1140,
    rating: 5,
    ratingCount: 15,
    description: 'หมูนุ่มฟู น่ารัก',
    imageUrl: '../img/mouse.png',
    inStock: true
  },
  {
    name: 'Fluffy Bunny',
    brand: 'Jellycat',
    category: 'กระต่าย',
    price: 1200,
    rating: 5,
    ratingCount: 0,
    description: 'กระต่ายนุ่มนิ่ม',
    imageUrl: 'https://placehold.co/400x500',
    inStock: true
  },

  // Care Bear (2 รายการ)
  {
    name: 'Funshine Bear',
    brand: 'Care Bear',
    category: 'หมี',
    price: 890,
    rating: 4.9,
    ratingCount: 33,
    description: 'หมีสีเหลือง สัญลักษณ์ดวงอาทิตย์ สดใส',
    imageUrl: 'https://playnation.com.sg/cdn/shop/files/Festive2024CataloguePart3_FunshineBear45cm_1200x.jpg?v=1727322424',
    inStock: true
  },
  {
    name: 'Love a Lot',
    brand: 'Care Bear',
    category: 'หมี',
    price: 1250,
    rating: 4.8,
    ratingCount: 15,
    description: 'หมีนุ่ม ขนฟู น่ารัก',
    imageUrl: '../img/carebare.png',
    inStock: true
  },

  // Steiff (2 รายการ)
  {
    name: 'Steiff Classic Teddy Bear',
    brand: 'Steiff',
    category: 'หมี',
    price: 3500,
    rating: 5,
    ratingCount: 12,
    description: 'หมีเท็ดดี้แบรนด์ดังจากเยอรมนี คุณภาพพรีเมียม',
    imageUrl: 'data:image/jpeg;base64,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',
    inStock: true
  },
  {
    name: 'Steiff Fynn Teddy Bear',
    brand: 'Steiff',
    category: 'หมี',
    price: 2890,
    rating: 5,
    ratingCount: 8,
    description: 'หมีสีน้ำตาลทอง ขนนุ่ม ทำด้วยมือ',
    imageUrl: 'https://www.steiff.com/img/1800/2232/resize/catalog/product/f/y/fynn-teddybaer-111327-24.jpg',
    inStock: true
  },

  // Gund (2 รายการ)
  {
    name: 'Gund Pusheen Cat',
    brand: 'Gund',
    category: 'แมว',
    price: 990,
    rating: 4.9,
    ratingCount: 89,
    description: 'แมวพูชีน ตัวอ้วนน่ารัก ดังในโซเชียล',
    imageUrl: 'https://turnertoys.com/cdn/shop/files/6072925.jpg?v=1730288423',
    inStock: true
  },
  {
    name: 'Three Things',
    brand: 'Gund',
    category: 'กวาง',
    price: 1140,
    rating: 4.9,
    ratingCount: 15,
    description: 'กวาง น่ารัก ทัชใจ',
    imageUrl: '../img/dear1.png',
    inStock: true
  },

  // Squishmallows (2 รายการ)
  {
    name: 'Squishmallow Cam the Cat',
    brand: 'Squishmallows',
    category: 'แมว',
    price: 690,
    rating: 5,
    ratingCount: 124,
    description: 'แมวสีเทา นุ่มมาก กอดสบาย',
    imageUrl: 'https://m.media-amazon.com/images/I/51cfs5WdQOL.jpg',
    inStock: true
  },
  {
    name: 'Squishmallow Wendy the Frog',
    brand: 'Squishmallows',
    category: 'กบ',
    price: 690,
    rating: 5,
    ratingCount: 156,
    description: 'กบเขียว ยอดนิยม ขายดีที่สุด',
    imageUrl: 'https://m.media-amazon.com/images/I/810wcw4kGNL.jpg',
    inStock: true
  }
];

// ฟังก์ชัน Seed
const seedDatabase = async () => {
  try {
    console.log('🔄 กำลังเชื่อมต่อ MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ เชื่อมต่อ MongoDB สำเร็จ\n');

    // ลบข้อมูลเก่าทั้งหมด
    console.log('🗑️  กำลังลบข้อมูลเก่า...');
    await Product.deleteMany({});
    await Admin.deleteMany({});
    console.log('✅ ลบข้อมูลเก่าเรียบร้อย\n');

    // เพิ่ม Admins
    console.log('👤 กำลังสร้าง Admins...');
    const createdAdmins = await Admin.create(admins);
    console.log(`✅ สร้าง ${createdAdmins.length} Admins สำเร็จ`);
    createdAdmins.forEach(admin => {
      console.log(`   - ${admin.username} (${admin.email})`);
    });
    console.log('');

    // เพิ่ม Products
    console.log('📦 กำลังสร้าง Products...');
    const createdProducts = await Product.insertMany(products);
    console.log(`✅ สร้าง ${createdProducts.length} Products สำเร็จ`);

    // แสดงสรุปตามแบรนด์
    const brands = ['Jellycat', 'Care Bear', 'Steiff', 'Gund', 'Squishmallows'];
    brands.forEach(brand => {
      const count = createdProducts.filter(p => p.brand === brand).length;
      console.log(`   - ${brand}: ${count} รายการ`);
    });
    console.log('');

    console.log('🎉 Seed Database สำเร็จทั้งหมด!');
    console.log('\n📊 สรุป:');
    console.log(`   - Admins: ${createdAdmins.length} คน`);
    console.log(`   - Products: ${createdProducts.length} รายการ`);
    console.log('\n🔐 ข้อมูล Login:');
    console.log('   Username: admin01 | Password: admin123');
    console.log('   Username: admin02 | Password: admin456');

  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 ปิดการเชื่อมต่อ MongoDB แล้ว');
    process.exit(0);
  }
};

// รัน Seed
seedDatabase();
