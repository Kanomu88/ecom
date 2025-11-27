-- ============================================
-- Database: dollwebapp
-- Exported from MongoDB Atlas
-- Date: 21/11/2568 17:55:16
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

-- ข้อมูล Admins (2 คน)
INSERT INTO admins (id, username, password, firstName, lastName, email, role, createdAt, updatedAt) VALUES
('691e21e4129b8f8e4ce30e0a', 'admin02', '', 'สมหญิงd', 'รักสวย', 'admin02@dollshop.com', 'admin', '2025-11-19 20:00:36', '2025-11-20 13:47:07');
INSERT INTO admins (id, username, password, firstName, lastName, email, role, createdAt, updatedAt) VALUES
('691e21e4129b8f8e4ce30e09', 'admin01', '', 'สมชาย', 'ใจดี', 'admin01@dollshop.com', 'admin', '2025-11-19 20:00:36', '2025-11-19 20:00:36');

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

-- ข้อมูล Products (13 รายการ)
INSERT INTO products (id, name, brand, category, price, rating, ratingCount, description, imageUrl, inStock, createdAt, updatedAt) VALUES
('691e21e4129b8f8e4ce30e0d', 'Bashful Bunnye', 'Jellycat', 'กระต่าย', 1140, 5, 27, 'ตุ๊กตากระต่ายนุ่มนิ่มจาก Jellycat ขนาด 31 ซม. เหมาะสำหรับทุกวัย', 'https://m.media-amazon.com/images/I/51v3LQwn3lL.jpg', TRUE, '2025-11-19 20:00:36', '2025-11-20 13:46:50');
INSERT INTO products (id, name, brand, category, price, rating, ratingCount, description, imageUrl, inStock, createdAt, updatedAt) VALUES
('691e21e4129b8f8e4ce30e10', 'Blossom Tulip Bunny', 'Jellycat', 'กระต่าย', 1590, 5, 22, 'กระต่ายดอกทิวลิป สีชมพูหวาน Limited Edition', 'https://placehold.co/400x500/FFE5EC/8B6B7B?text=Tulip+Bunny', FALSE, '2025-11-19 20:00:36', '2025-11-19 20:00:36');
INSERT INTO products (id, name, brand, category, price, rating, ratingCount, description, imageUrl, inStock, createdAt, updatedAt) VALUES
('691e21e4129b8f8e4ce30e15', 'Funshine Bear', 'Care Bear', 'หมี', 890, 4.9, 33, 'หมีสีเหลือง สัญลักษณ์ดวงอาทิตย์ สดใส', 'https://playnation.com.sg/cdn/shop/files/Festive2024CataloguePart3_FunshineBear45cm_1200x.jpg?v=1727322424', TRUE, '2025-11-19 20:00:36', '2025-11-19 20:00:36');
INSERT INTO products (id, name, brand, category, price, rating, ratingCount, description, imageUrl, inStock, createdAt, updatedAt) VALUES
('691e21e4129b8f8e4ce30e1b', 'Gund Pusheen Cat', 'Gund', 'แมว', 990, 4.9, 89, 'แมวพูชีน ตัวอ้วนน่ารัก ดังในโซเชียล', 'https://turnertoys.com/cdn/shop/files/6072925.jpg?v=1730288423', TRUE, '2025-11-19 20:00:36', '2025-11-19 20:00:36');
INSERT INTO products (id, name, brand, category, price, rating, ratingCount, description, imageUrl, inStock, createdAt, updatedAt) VALUES
('691e21e4129b8f8e4ce30e16', 'Steiff Classic Teddy Bear', 'Steiff', 'หมี', 3500, 5, 12, 'หมีเท็ดดี้แบรนด์ดังจากเยอรมนี คุณภาพพรีเมียม', 'data:image/jpeg;base64,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', TRUE, '2025-11-19 20:00:36', '2025-11-19 20:00:36');
INSERT INTO products (id, name, brand, category, price, rating, ratingCount, description, imageUrl, inStock, createdAt, updatedAt) VALUES
('691e21e4129b8f8e4ce30e17', 'Steiff Fynn Teddy Bear', 'Steiff', 'หมี', 2890, 5, 8, 'หมีสีน้ำตาลทอง ขนนุ่ม ทำด้วยมือ', 'https://www.steiff.com/img/1800/2232/resize/catalog/product/f/y/fynn-teddybaer-111327-24.jpg', TRUE, '2025-11-19 20:00:36', '2025-11-19 20:00:36');
INSERT INTO products (id, name, brand, category, price, rating, ratingCount, description, imageUrl, inStock, createdAt, updatedAt) VALUES
('691e21e4129b8f8e4ce30e1d', 'Squishmallow Cam the Cat', 'Squishmallows', 'แมว', 690, 5, 124, 'แมวสีเทา นุ่มมาก กอดสบาย', 'https://m.media-amazon.com/images/I/51cfs5WdQOL.jpg', TRUE, '2025-11-19 20:00:36', '2025-11-19 20:00:36');
INSERT INTO products (id, name, brand, category, price, rating, ratingCount, description, imageUrl, inStock, createdAt, updatedAt) VALUES
('691e21e4129b8f8e4ce30e1e', 'Squishmallow Wendy the Frog', 'Squishmallows', 'กบ', 690, 5, 156, 'กบเขียว ยอดนิยม ขายดีที่สุด', 'https://m.media-amazon.com/images/I/810wcw4kGNL.jpg', TRUE, '2025-11-19 20:00:36', '2025-11-19 20:00:36');
INSERT INTO products (id, name, brand, category, price, rating, ratingCount, description, imageUrl, inStock, createdAt, updatedAt) VALUES
('691e21e4129b8f8e4ce30e0f', 'Odell Octopus', 'Jellycat', 'สัตว์ทะเล', 1450, 4.8, 15, 'ปลาหมึกยักษ์สีชมพู 8 ขา น่ากอด', 'https://m.media-amazon.com/images/I/71hapzD9BbL._AC_UF894,1000_QL80_.jpg', TRUE, '2025-11-19 20:00:36', '2025-11-19 20:00:36');
INSERT INTO products (id, name, brand, category, price, rating, ratingCount, description, imageUrl, inStock, createdAt, updatedAt) VALUES
('699fdceb561ce2cc1cffff8b', 'Love a Lot', 'Care Bear', 'หมี', 1250, 4.8, 15, 'หมีนุ่ม ขนฟู น่ารัก', '../img/carebare.png', TRUE, '2025-11-19 20:00:36', '2025-11-19 20:00:36');
INSERT INTO products (id, name, brand, category, price, rating, ratingCount, description, imageUrl, inStock, createdAt, updatedAt) VALUES
('691fdd60561ce2cc1cffff8c', 'Three Things', 'Gund', 'กวาง', 1140, 4.9, 15, 'กวาง น่ารัก ทัชใจ', '../img/dear1.png', TRUE, '2025-11-19 20:00:36', '2025-11-19 20:00:36');
INSERT INTO products (id, name, brand, category, price, rating, ratingCount, description, imageUrl, inStock, createdAt, updatedAt) VALUES
('391fdd9b561ce2cc1cffff8d', 'Yummy Mouse', 'Jellycat', 'หนู', 1140, 5.5, 15, 'หมูนุ่มฟู น่ารัก', '../img/mouse.png', TRUE, '2025-11-19 20:00:36', '2025-11-19 20:00:36');
INSERT INTO products (id, name, brand, category, price, rating, ratingCount, description, imageUrl, inStock, createdAt, updatedAt) VALUES
('692002b138810c26bcf1f611', 'Fluffy Bunny', 'Jellycat', 'กระต่าย', 1200, 5, 0, 'กระต่ายนุ่มนิ่ม', 'https://placehold.co/400x500', TRUE, '2025-11-21 06:12:01', '2025-11-21 06:12:01');

-- ============================================
-- สรุปข้อมูล
-- ============================================
-- Admins: 2 คน
-- Products: 13 รายการ
--   - Jellycat: 5 รายการ
--   - Care Bear: 2 รายการ
--   - Steiff: 2 รายการ
--   - Gund: 2 รายการ
--   - Squishmallows: 2 รายการ

-- ============================================
-- ข้อมูล Login สำหรับทดสอบ
-- ============================================
-- Username: admin02 | Email: admin02@dollshop.com
-- Username: admin01 | Email: admin01@dollshop.com

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
