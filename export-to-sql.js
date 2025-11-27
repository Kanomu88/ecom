require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const Admin = require('./server/models/Admin');
const Product = require('./server/models/Product');

// ฟังก์ชัน escape string สำหรับ SQL
function escapeSql(str) {
  if (!str) return '';
  return str.replace(/'/g, "''").replace(/\\/g, '\\\\');
}

// ฟังก์ชันแปลง Date เป็น SQL format
function formatDate(date) {
  if (!date) return 'NOW()';
  const d = new Date(date);
  return `'${d.toISOString().slice(0, 19).replace('T', ' ')}'`;
}

async function exportToSQL() {
  try {
    console.log('🔄 กำลังเชื่อมต่อ MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ เชื่อมต่อสำเร็จ\n');

    // ดึงข้อมูล
    console.log('📥 กำลังดึงข้อมูล...');
    const admins = await Admin.find({});
    const products = await Product.find({});
    console.log(`✅ พบ ${admins.length} admins และ ${products.length} products\n`);

    // สร้าง SQL
    let sql = `-- ============================================
-- Database: dollwebapp
-- Exported from MongoDB Atlas
-- Date: ${new Date().toLocaleString('th-TH')}
-- ============================================

-- ============================================
-- Table: admins
-- ============================================
CREATE TABLE IF NOT EXISTS admins (
  id VARCHAR(255) PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL COMMENT 'Hashed with bcrypt',
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ข้อมูล Admins (${admins.length} คน)
`;

    // Insert Admins
    admins.forEach((admin, index) => {
      sql += `INSERT INTO admins (id, username, password, firstName, lastName, email, role, createdAt, updatedAt) VALUES
('${admin._id}', '${escapeSql(admin.username)}', '${escapeSql(admin.password)}', '${escapeSql(admin.firstName)}', '${escapeSql(admin.lastName)}', '${escapeSql(admin.email)}', '${admin.role}', ${formatDate(admin.createdAt)}, ${formatDate(admin.updatedAt)});\n`;
    });

    sql += `
-- ============================================
-- Table: products
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  brand VARCHAR(100) NOT NULL,
  category VARCHAR(100),
  price DECIMAL(10,2) NOT NULL,
  rating DECIMAL(2,1) DEFAULT 5.0,
  ratingCount INT DEFAULT 0,
  description TEXT,
  imageUrl VARCHAR(500),
  inStock BOOLEAN DEFAULT TRUE,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ข้อมูล Products (${products.length} รายการ)
`;

    // Insert Products
    products.forEach((product, index) => {
      sql += `INSERT INTO products (id, name, brand, category, price, rating, ratingCount, description, imageUrl, inStock, createdAt, updatedAt) VALUES
('${product._id}', '${escapeSql(product.name)}', '${escapeSql(product.brand)}', '${escapeSql(product.category)}', ${product.price}, ${product.rating}, ${product.ratingCount}, '${escapeSql(product.description)}', '${escapeSql(product.imageUrl)}', ${product.inStock ? 'TRUE' : 'FALSE'}, ${formatDate(product.createdAt)}, ${formatDate(product.updatedAt)});\n`;
    });

    // สรุป
    sql += `
-- ============================================
-- สรุปข้อมูล
-- ============================================
-- Admins: ${admins.length} คน
-- Products: ${products.length} รายการ
`;

    // นับตามแบรนด์
    const brands = ['Jellycat', 'Care Bear', 'Steiff', 'Gund', 'Squishmallows'];
    brands.forEach(brand => {
      const count = products.filter(p => p.brand === brand).length;
      if (count > 0) {
        sql += `--   - ${brand}: ${count} รายการ\n`;
      }
    });

    sql += `
-- ============================================
-- ข้อมูล Login สำหรับทดสอบ
-- ============================================
`;

    admins.forEach(admin => {
      sql += `-- Username: ${admin.username} | Email: ${admin.email}\n`;
    });

    sql += `
-- ============================================
-- หมายเหตุ
-- ============================================
-- 1. โปรเจคนี้ใช้ MongoDB ในการพัฒนาจริง
-- 2. ไฟล์ SQL นี้ export จาก MongoDB Atlas
-- 3. สำหรับการใช้งานจริง กรุณารันคำสั่ง: npm run seed
-- 4. หรือเชื่อมต่อกับ MongoDB Atlas โดยตรง

-- ============================================
-- END OF FILE
-- ============================================
`;

    // บันทึกไฟล์
    fs.writeFileSync('sec1_gr5_database.sql', sql, 'utf8');
    console.log('✅ สร้างไฟล์ sec1_gr5_database.sql สำเร็จ!');
    console.log(`📊 สรุป:`);
    console.log(`   - Admins: ${admins.length} คน`);
    console.log(`   - Products: ${products.length} รายการ`);
    
    // แสดงรายละเอียดแบรนด์
    console.log(`\n📦 สินค้าแยกตามแบรนด์:`);
    brands.forEach(brand => {
      const count = products.filter(p => p.brand === brand).length;
      if (count > 0) {
        console.log(`   - ${brand}: ${count} รายการ`);
      }
    });

  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 ปิดการเชื่อมต่อ MongoDB แล้ว');
    process.exit(0);
  }
}

// รัน
exportToSQL();
