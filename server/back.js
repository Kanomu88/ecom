const express = require('express');
const { generateToken, verifyTokenMiddleware } = require('./token_manager');
const Admin = require('./models/Admin');
const Product = require('./models/Product');
const Order = require('./models/Order');
const { generatePromptPayQR } = require('./services/payment');

const router = express.Router();

// ==================== AUTH ROUTES ====================

// POST /api/auth/login - เข้าสู่ระบบ
// Testing: Login Authentication
// 
// ตัวอย่างที่ 1 - Login สำเร็จ
// method: POST
// URI: http://localhost:3000/api/auth/login
// body: raw JSON
// {
//   "username": "admin01",
//   "password": "admin123"
// }
// Expected Response: 200 OK
// {
//   "success": true,
//   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MWUyMWU0MTI5YjhmOGU0Y2UzMGUwOSIsInVzZXJuYW1lIjoiYWRtaW4wMSIsImVtYWlsIjoiYWRtaW4wMUBkb2xsc2hvcC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NjM2OTk4MDMsImV4cCI6MTc2NDMwNDYwM30.b22guT6rV77vrDw5p1Zuv8XqYcPQ3-ojYQwP5fr44lY",
//   "user": {
//     "_id": "...",
//     "username": "admin01",
//     "firstName": "สมชาย",
//     "lastName": "ใจดี",
//     "email": "admin01@dollshop.com",
//     "role": "admin",
//     "createdAt": "2025-11-19T20:00:36.632Z",
//     "updatedAt": "2025-11-19T20:00:36.632Z",
//     "__v": 0
//      }
// }
//
// ตัวอย่างที่ 2 - Login ไม่สำเร็จ (password ผิด)
// method: POST
// URI: http://localhost:3000/api/auth/login
// body: raw JSON
// {
//   "username": "admin01",
//   "password": "wrongpassword"
// }
// Expected Response: 401 Unauthorized
// {
//   "success": false,
//   "message": "Username หรือ Password ไม่ถูกต้อง"
// }

router.post('/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'กรุณาระบุ username และ password'
            });
        }

        const admin = await Admin.findOne({ username }).select('+password');

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: 'Username หรือ Password ไม่ถูกต้อง'
            });
        }

        const isPasswordValid = await admin.comparePassword(password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Username หรือ Password ไม่ถูกต้อง'
            });
        }

        const token = generateToken(admin);

        const adminData = admin.toObject();
        delete adminData.password;

        res.json({
            success: true,
            token,
            user: adminData
        });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ'
        });
    }
});

// ==================== PRODUCT ROUTES ====================
// TODO: เพิ่ม Product routes ในภายหลัง
// ==================== PRODUCT ROUTES ====================
// ==================== PUBLIC ROUTES (ไม่ต้อง login) ====================

// GET /api/public/products - ค้นหาสินค้าสำหรับผู้ใช้ทั่วไป
// Testing: Public Search Products
//
// ตัวอย่างที่ 1 - ดึงสินค้าทั้งหมด
// method: GET
// URI: http://localhost:3000/api/public/products
// Expected Response: 200 OK
// // {
//     "success": true,
//     "count": 12,
//     "data": [
//         {
//             "_id": "691e21e4129b8f8e4ce30e0d",
//             "name": "Bashful Bunnye",
//             "brand": "Jellycat",
//             "category": "กระต่าย",
//             "price": 1140,
//             "rating": 5,
//             "ratingCount": 27,
//             "description": "ตุ๊กตากระต่ายนุ่มนิ่มจาก Jellycat ขนาด 31 ซม. เหมาะสำหรับทุกวัย",
//             "imageUrl": "https://m.media-amazon.com/images/I/51v3LQwn3lL.jpg",
//             "inStock": true,
//             "__v": 0,
//             "createdAt": "2025-11-19T20:00:36.765Z",
//             "updatedAt": "2025-11-20T13:46:50.395Z"
//         } 
//     }
//
// ตัวอย่างที่ 2 - ค้นหาด้วยชื่อและแบรนด์
// method: GET
// URI: http://localhost:3000/api/public/products?name=bear&brand=Care Bear
// Expected Response: 200 OK
// {
//     "success": true,
//     "count": 1,
//     "data": [
//         {
//             "_id": "691e21e4129b8f8e4ce30e15",
//             "name": "Funshine Bear",
//             "brand": "Care Bear",
//             "category": "หมี",
//             "price": 890,
//             "rating": 4.9,
//             "ratingCount": 33,
//             "description": "หมีสีเหลือง สัญลักษณ์ดวงอาทิตย์ สดใส",
//             "imageUrl": "https://playnation.com.sg/cdn/shop/files/Festive2024CataloguePart3_FunshineBear45cm_1200x.jpg?v=1727322424",
//             "inStock": true,
//             "__v": 0,
//             "createdAt": "2025-11-19T20:00:36.766Z",
//             "updatedAt": "2025-11-19T20:00:36.766Z"
//         }
//     ]
// }

router.get('/public/products', async (req, res) => {
    try {
        const query = {};

        if (req.query.name) {
            query.name = { $regex: req.query.name, $options: 'i' };
        }

        if (req.query.brand) {
            query.brand = req.query.brand;
        }

        if (req.query.rating) {
            query.rating = { $gte: Number(req.query.rating) };
        }

        query.inStock = true;

        const products = await Product.find(query);

        res.json({
            success: true,
            count: products.length,
            data: products
        });

    } catch (error) {
        console.error('Public Search Error:', error);
        res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการค้นหา'
        });
    }
});

// GET /api/public/products/:id - ดูรายละเอียดสินค้าสำหรับผู้ใช้ทั่วไป
// Testing: View Public Product Detail
//
// ตัวอย่างที่ 1 - ดูสินค้าสำเร็จ
// method: GET
// URI: http://localhost:3000/api/public/products/691e21e4129b8f8e4ce30e11
// Expected Response: 200 OK
// {
//     "success": true,
//     "data": {
//         "_id": "691e21e4129b8f8e4ce30e11",
//         "name": "Amuseable Cloud",
//         "brand": "Jellycat",
//         "category": "อื่นๆ",
//         "price": 890,
//         "rating": 4.9,
//         "ratingCount": 31,
//         "description": "เมฆน้อยยิ้มแย้ม นุ่มฟู น่ารัก",
//         "imageUrl": "https://stoysnetcdn.com/jcat/jcata2cl/jcata2cl.jpg",
//         "inStock": true,
//         "__v": 0,
//         "createdAt": "2025-11-19T20:00:36.766Z",
//         "updatedAt": "2025-11-19T20:00:36.766Z"
//     }
// }
//
// ตัวอย่างที่ 2 - ไม่พบสินค้า
// method: GET
// URI: http://localhost:3000/api/public/products/000000000000000000000000
// Expected Response: 404 Not Found
// {
//   "success": false,
//   "message": "ไม่พบสินค้า"
// }

router.get('/public/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'ไม่พบสินค้า'
            });
        }

        res.json({
            success: true,
            data: product
        });

    } catch (error) {
        console.error('Get Public Product Error:', error);
        res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาด'
        });
    }
});


// GET /api/products - ค้นหาสินค้า (มี/ไม่มีเกณฑ์)
// Testing: Search Products
//
// ตัวอย่างที่ 1 - ดึงสินค้าทั้งหมด (ไม่มีเกณฑ์)
// method: GET
// URI: http://localhost:3000/api/products
// headers: Authorization: Bearer <token>
// Expected Response: 200 OK
// {
    // "success": true,
    // "count": 13,
    // "data": [
    // {
    // "success": true,
    // "count": 13,
    // "data": [
    //     {
    //         "_id": "691e21e4129b8f8e4ce30e0d",
    //         "name": "Bashful Bunnye",
    //         "brand": "Jellycat",
    //         "category": "กระต่าย",
    //         "price": 1140,
    //         "rating": 5,
    //         "ratingCount": 27,
    //         "description": "ตุ๊กตากระต่ายนุ่มนิ่มจาก Jellycat ขนาด 31 ซม. เหมาะสำหรับทุกวัย",
    //         "imageUrl": "https://m.media-amazon.com/images/I/51v3LQwn3lL.jpg",
    //         "inStock": true,
    //         "__v": 0,
    //         "createdAt": "2025-11-19T20:00:36.765Z",
    //         "updatedAt": "2025-11-20T13:46:50.395Z"
    //     }
//
// ตัวอย่างที่ 2 - ค้นหาด้วยชื่อ
// method: GET
// URI: http://localhost:3000/api/products?name=bear
// headers: Authorization: Bearer <token>
// Expected Response: 200 OK
// {
//   "success": true,
//   "count": 5,
//   "data": [...]
// }
//

router.get('/products', verifyTokenMiddleware, async (req, res) => {
    try {
        const query = {};

        if (req.query.name) {
            query.name = { $regex: req.query.name, $options: 'i' };
        }

        if (req.query.brand) {
            query.brand = req.query.brand;
        }

        if (req.query.rating) {
            query.rating = { $gte: Number(req.query.rating) };
        }

        if (req.query.inStock) {
            query.inStock = req.query.inStock === 'true';
        }

        const products = await Product.find(query);

        res.json({
            success: true,
            count: products.length,
            data: products
        });

    } catch (error) {
        console.error('Search Products Error:', error);
        res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการค้นหาสินค้า'
        });
    }
});

// GET /api/products/:id - ดูรายละเอียดสินค้า 1 รายการ
// Testing: View Product Detail
//
// ตัวอย่างที่ 1 - ดูสินค้าสำเร็จ
// method: GET
// URI: http://localhost:3000/api/products/691e21e4129b8f8e4ce30e11
// headers: Authorization: Bearer <token>
// Expected Response: 200 OK
// {
//     "success": true,
//     "data": {
//         "_id": "691e21e4129b8f8e4ce30e11",
//         "name": "Amuseable Cloud",
//         "brand": "Jellycat",
//         "category": "อื่นๆ",
//         "price": 890,
//         "rating": 4.9,
//         "ratingCount": 31,
//         "description": "เมฆน้อยยิ้มแย้ม นุ่มฟู น่ารัก",
//         "imageUrl": "https://stoysnetcdn.com/jcat/jcata2cl/jcata2cl.jpg",
//         "inStock": true,
//         "__v": 0,
//         "createdAt": "2025-11-19T20:00:36.766Z",
//         "updatedAt": "2025-11-19T20:00:36.766Z"
//     }
// }
//
// ตัวอย่างที่ 2 - ไม่พบสินค้า
// method: GET
// URI: http://localhost:3000/api/products/000000000000000000000000
// headers: Authorization: Bearer <token>
// Expected Response: 404 Not Found
// {
//   "success": false,
//   "message": "ไม่พบสินค้า"
// }

router.get('/products/:id', verifyTokenMiddleware, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'ไม่พบสินค้า'
            });
        }

        res.json({
            success: true,
            data: product
        });

    } catch (error) {
        console.error('Get Product Error:', error);
        res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า'
        });
    }
});
// POST /api/products - เพิ่มสินค้าใหม่
// Testing: Create Product
//
// ตัวอย่างที่ 1 - เพิ่มสินค้าสำเร็จ
// method: POST
// URI: http://localhost:3000/api/products
// headers: Authorization: Bearer <token>
// body: raw JSON
// {
//     "success": true,
//     "data": {
//         "name": "Fluffy Bunny",
//         "brand": "Jellycat",
//         "category": "กระต่าย",
//         "price": 1200,
//         "rating": 5,
//         "ratingCount": 0,
//         "description": "กระต่ายนุ่มนิ่ม",
//         "imageUrl": "https://placehold.co/400x500",
//         "inStock": true,
//         "_id": "692002b138810c26bcf1f611",
//         "createdAt": "2025-11-21T06:12:01.662Z",
//         "updatedAt": "2025-11-21T06:12:01.662Z",
//         "__v": 0
//     }
// }
// Expected Response: 201 Created
// {
//   "success": true,
//   "data": { ... }
// }
//
// ตัวอย่างที่ 2 - ข้อมูลไม่ครบ
// method: POST
// URI: http://localhost:3000/api/products
// headers: Authorization: Bearer <token>
// body: raw JSON
// {
//   "name": "Test"
// }
// Expected Response: 400 Bad Request
// {
//   "success": false,
//   "message": "กรุณาระบุข้อมูลให้ครบถ้วน"
// }
// PUT /api/products/:id - แก้ไขสินค้า
// Testing: Update Product
//
// ตัวอย่างที่ 1 - แก้ไขสำเร็จ
// method: PUT
// URI: http://localhost:3000/api/products/673c8f1234567890abcdef12
// headers: Authorization: Bearer <token>
// body: raw JSON
// {
//   "name": "Updated Bunny",
//   "price": 1500
// }
// Expected Response: 200 OK
// {
//   "success": true,
//   "data": { ... }
// }
//
// ตัวอย่างที่ 2 - ไม่พบสินค้า
// method: PUT
// URI: http://localhost:3000/api/products/000000000000000000000000
// headers: Authorization: Bearer <token>
// body: raw JSON
// {
//   "name": "Test"
// }
// Expected Response: 404 Not Found
// {
//   "success": false,
//   "message": "ไม่พบสินค้า"
// }

router.put('/products/:id', verifyTokenMiddleware, async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'ไม่พบสินค้า'
            });
        }

        res.json({
            success: true,
            data: product
        });

    } catch (error) {
        console.error('Update Product Error:', error);

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'ข้อมูลไม่ถูกต้อง'
            });
        }

        res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการแก้ไขสินค้า'
        });
    }
});

// PUT /api/admins/:id - แก้ไขผู้ดูแล
// Testing: Update Admin
//
// ตัวอย่างที่ 1 - แก้ไขสำเร็จ (ไม่เปลี่ยน password)
// method: PUT
// URI: http://localhost:3000/api/admins/691e21e4129b8f8e4ce30e11
// headers: Authorization: Bearer <token>
// body: raw JSON
// {
//   "firstName": "สมชาย",
//   "lastName": "ใจดีมาก"
// }
// Expected Response: 200 OK
// {
//     "success": true,
//     "data": {
//         "_id": "691e21e4129b8f8e4ce30e11",
//         "name": "Updated Bunny",
//         "brand": "Jellycat",
//         "category": "อื่นๆ",
//         "price": 1500,
//         "rating": 4.9,
//         "ratingCount": 31,
//         "description": "เมฆน้อยยิ้มแย้ม นุ่มฟู น่ารัก",
//         "imageUrl": "https://stoysnetcdn.com/jcat/jcata2cl/jcata2cl.jpg",
//         "inStock": true,
//         "__v": 0,
//         "createdAt": "2025-11-19T20:00:36.766Z",
//         "updatedAt": "2025-11-21T06:23:31.233Z"
//     }
// }
//
// ตัวอย่างที่ 2 - แก้ไขพร้อม password ใหม่
// method: PUT
// URI: http://localhost:3000/api/admins/673c8f1234567890abcdef12
// headers: Authorization: Bearer <token>
// body: raw JSON
// {
//   "password": "newpassword123"
// }
// Expected Response: 200 OK
// {
//   "success": true,
//   "data": { ... }
// }

router.put('/admins/:id', verifyTokenMiddleware, async (req, res) => {
    try {
        // ถ้ามี password ใหม่ ต้อง hash ก่อน
        if (req.body.password) {
            const bcrypt = require('bcrypt');
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }

        const admin = await Admin.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).select('-password');

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'ไม่พบผู้ดูแลระบบ'
            });
        }

        res.json({
            success: true,
            data: admin
        });

    } catch (error) {
        console.error('Update Admin Error:', error);

        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Username หรือ Email นี้มีอยู่แล้ว'
            });
        }

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'ข้อมูลไม่ถูกต้อง'
            });
        }

        res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการแก้ไขผู้ดูแล'
        });
    }
});

// DELETE /api/products/:id - ลบสินค้า
// Testing: Delete Product
//
// ตัวอย่างที่ 1 - ลบสำเร็จ
// method: DELETE
// URI: http://localhost:3000/api/products/691e21e4129b8f8e4ce30e11
// headers: Authorization: Bearer <token>
// Expected Response: 200 OK
// {
//   "success": true,
//   "message": "ลบสินค้าสำเร็จ"
// }
//
// ตัวอย่างที่ 2 - ไม่พบสินค้า
// method: DELETE
// URI: http://localhost:3000/api/products/000000000000000000000000
// headers: Authorization: Bearer <token>
// Expected Response: 404 Not Found
// {
//   "success": false,
//   "message": "ไม่พบสินค้า"
// }

router.delete('/products/:id', verifyTokenMiddleware, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'ไม่พบสินค้า'
            });
        }

        res.json({
            success: true,
            message: 'ลบสินค้าสำเร็จ'
        });

    } catch (error) {
        console.error('Delete Product Error:', error);
        res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการลบสินค้า'
        });
    }
});

// DELETE /api/admins/:id - ลบผู้ดูแล
// Testing: Delete Admin
//
// ตัวอย่างที่ 1 - ลบสำเร็จ
// method: DELETE
// URI: http://localhost:3000/api/admins/673c8f1234567890abcdef12
// headers: Authorization: Bearer <token>
// Expected Response: 200 OK
// {
//   "success": true,
//   "message": "ลบผู้ดูแลระบบสำเร็จ"
// }
//
// ตัวอย่างที่ 2 - ไม่พบผู้ดูแล
// method: DELETE
// URI: http://localhost:3000/api/admins/000000000000000000000000
// headers: Authorization: Bearer <token>
// Expected Response: 404 Not Found
// {
//   "success": false,
//   "message": "ไม่พบผู้ดูแลระบบ"
// }

router.delete('/admins/:id', verifyTokenMiddleware, async (req, res) => {
    try {
        const admin = await Admin.findByIdAndDelete(req.params.id);

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'ไม่พบผู้ดูแลระบบ'
            });
        }

        res.json({
            success: true,
            message: 'ลบผู้ดูแลระบบสำเร็จ'
        });

    } catch (error) {
        console.error('Delete Admin Error:', error);
        res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการลบผู้ดูแล'
        });
    }
});

router.post('/products', verifyTokenMiddleware, async (req, res) => {
    try {
        const product = await Product.create(req.body);

        res.status(201).json({
            success: true,
            data: product
        });

    } catch (error) {
        console.error('Create Product Error:', error);

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'กรุณาระบุข้อมูลให้ครบถ้วน'
            });
        }

        res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการเพิ่มสินค้า'
        });
    }
});

// POST /api/admins - เพิ่มผู้ดูแลใหม่
// Testing: Create Admin
//
// ตัวอย่างที่ 1 - เพิ่มผู้ดูแลสำเร็จ
// method: POST
// URI: http://localhost:3000/api/admins
// headers: Authorization: Bearer <token>
// body: raw JSON
// {
//   "username": "admin03",
//   "password": "admin789",
//   "firstName": "สมศรี",
//   "lastName": "ใจงาม",
//   "email": "admin03@dollshop.com",
//   "role": "admin"
// }
// Expected Response: 201 Created
// {
//     "success": true,
//     "data": {
//         "username": "admin03",
//         "firstName": "สมศรี",
//         "lastName": "ใจงาม",
//         "email": "admin03@dollshop.com",
//         "role": "admin",
//         "_id": "69200b782df2150aaa7cf13d",
//         "createdAt": "2025-11-21T06:49:28.211Z",
//         "updatedAt": "2025-11-21T06:49:28.211Z",
//         "__v": 0
//     }
// }
//
// ตัวอย่างที่ 2 - username ซ้ำ
// method: POST
// URI: http://localhost:3000/api/admins
// headers: Authorization: Bearer <token>
// body: raw JSON
// {
//   "username": "admin01",
//   "password": "test123",
//   "firstName": "Test",
//   "lastName": "User",
//   "email": "test@test.com"
// }
// Expected Response: 400 Bad Request
// {
//   "success": false,
//   "message": "Username หรือ Email นี้มีอยู่แล้ว"
// }

router.post('/admins', verifyTokenMiddleware, async (req, res) => {
    try {
        const admin = await Admin.create(req.body);

        // ลบ password ออกจาก response
        const adminData = admin.toObject();
        delete adminData.password;

        res.status(201).json({
            success: true,
            data: adminData
        });

    } catch (error) {
        console.error('Create Admin Error:', error);

        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Username หรือ Email นี้มีอยู่แล้ว'
            });
        }

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'กรุณาระบุข้อมูลให้ครบถ้วน'
            });
        }

        res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการเพิ่มผู้ดูแล'
        });
    }
});


// ==================== ADMIN ROUTES ====================
// TODO: เพิ่ม Admin routes ในภายหลัง
// ==================== ADMIN ROUTES ====================

// GET /api/admins - ค้นหาผู้ดูแลระบบ (มี/ไม่มีเกณฑ์)
// Testing: Search Admins
//
// ตัวอย่างที่ 1 - ดึงผู้ดูแลทั้งหมด (ไม่มีเกณฑ์)
// method: GET
// URI: http://localhost:3000/api/admins
// headers: Authorization: Bearer <token>
// Expected Response: 200 OK
// {
//     "success": true,
//     "count": 2,
//     "data": [
//         {
//             "_id": "691e21e4129b8f8e4ce30e0a",
//             "username": "admin02",
//             "firstName": "สมหญิงd",
//             "lastName": "รักสวย",
//             "email": "admin02@dollshop.com",
//             "role": "admin",
//             "createdAt": "2025-11-19T20:00:36.632Z",
//             "updatedAt": "2025-11-20T13:47:07.678Z",
//             "__v": 0
//         },
//         {
//             "_id": "691e21e4129b8f8e4ce30e09",
//             "username": "admin01",
//             "firstName": "สมชาย",
//             "lastName": "ใจดี",
//             "email": "admin01@dollshop.com",
//             "role": "admin",
//             "createdAt": "2025-11-19T20:00:36.632Z",
//             "updatedAt": "2025-11-19T20:00:36.632Z",
//             "__v": 0
//         }
//     ]
// }
// //
// ตัวอย่างที่ 2 - ค้นหาด้วย username
// method: GET
// URI: http://localhost:3000/api/admins?username=admin01
// headers: Authorization: Bearer <token>
// Expected Response: 200 OK
// {
//   "success": true,
//   "count": 1,
//   "data": [...]
// }
//
// ตัวอย่างที่ 3 - ค้นหาด้วยหลายเกณฑ์
// method: GET
// URI: http://localhost:3000/api/admins?role=admin&email=dollshop
// headers: Authorization: Bearer <token>
// Expected Response: 200 OK
// {
//   "success": true,
//   "count": 2,
//   "data": [...]
// }

router.get('/admins', verifyTokenMiddleware, async (req, res) => {
    try {
        const query = {};

        if (req.query.username) {
            query.username = { $regex: req.query.username, $options: 'i' };
        }

        if (req.query.email) {
            query.email = { $regex: req.query.email, $options: 'i' };
        }

        if (req.query.firstName) {
            query.firstName = { $regex: req.query.firstName, $options: 'i' };
        }

        if (req.query.role) {
            query.role = req.query.role;
        }

        const admins = await Admin.find(query).select('-password');

        res.json({
            success: true,
            count: admins.length,
            data: admins
        });

    } catch (error) {
        console.error('Search Admins Error:', error);
        res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการค้นหาผู้ดูแลระบบ'
        });
    }
});
// GET /api/admins/:id - ดูรายละเอียดผู้ดูแลระบบ 1 คน
// Testing: View Admin Detail
//
// ตัวอย่างที่ 1 - ดูผู้ดูแลสำเร็จ
// method: GET
// URI: http://localhost:3000/api/admins/673c8f1234567890abcdef12
// headers: Authorization: Bearer <token>
// Expected Response: 200 OK
// {
//   "success": true,
//   "data": {
//     "_id": "673c8f1234567890abcdef12",
//     "username": "admin01",
//     "firstName": "สมชาย",
//     "lastName": "ใจดี",
//     "email": "admin01@dollshop.com",
//     "role": "admin",
//     ...
//   }
// }
//
// ตัวอย่างที่ 2 - ไม่พบผู้ดูแล
// method: GET
// URI: http://localhost:3000/api/admins/000000000000000000000000
// headers: Authorization: Bearer <token>
// Expected Response: 404 Not Found
// {
//   "success": false,
//   "message": "ไม่พบผู้ดูแลระบบ"
// }

router.get('/admins/:id', verifyTokenMiddleware, async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id).select('-password');

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'ไม่พบผู้ดูแลระบบ'
            });
        }

        res.json({
            success: true,
            data: admin
        });

    } catch (error) {
        console.error('Get Admin Error:', error);
        res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ดูแลระบบ'
        });
    }
});

// ==================== ORDER ROUTES (PUBLIC) ====================

// POST /api/orders - สร้างคำสั่งซื้อใหม่
// Testing: Create Order
//
// ตัวอย่างที่ 1 - สร้างคำสั่งซื้อสำเร็จ
// method: POST
// URI: http://localhost:3000/api/orders
// body: raw JSON
// {
//   "customer": {
//     "firstName": "สมชาย",
//     "lastName": "ใจดี",
//     "email": "somchai@example.com",
//     "phone": "0812345678"
//   },
//   "shippingAddress": {
//     "address": "123 ถนนสุขุมวิท",
//     "province": "กรุงเทพมหานคร",
//     "postalCode": "10110",
//     "note": "โทรก่อนส่ง"
//   },
//   "items": [
//     {
//       "productId": "691e21e4129b8f8e4ce30e0d",
//       "name": "Bashful Bunny",
//       "price": 1140,
//       "quantity": 2,
//       "imageUrl": "https://..."
//     }
//   ]
// }
// Expected Response: 201 Created
// {
//   "success": true,
//   "data": {
//     "orderId": "...",
//     "orderNumber": "ORD-20251127-001",
//     "totalAmount": 2280,
//     "status": "pending"
//   }
// }

router.post('/orders', async (req, res) => {
    try {
        const { customer, shippingAddress, items, totalAmount } = req.body;

        // ตรวจสอบข้อมูลพื้นฐาน
        if (!customer || !shippingAddress || !items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'กรุณาระบุข้อมูลให้ครบถ้วน'
            });
        }
        
        // ตรวจสอบ totalAmount
        if (!totalAmount || totalAmount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'ยอดรวมไม่ถูกต้อง'
            });
        }

        // ตรวจสอบสต็อกสินค้าทั้งหมด
        const productIds = items.map(item => item.productId);
        const products = await Product.find({ _id: { $in: productIds } });

        const outOfStockItems = [];
        for (const item of items) {
            const product = products.find(p => p._id.toString() === item.productId);
            if (!product || !product.inStock) {
                outOfStockItems.push(item.name);
            }
        }

        if (outOfStockItems.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'สินค้าบางรายการหมดแล้ว',
                outOfStockItems
            });
        }

        // สร้างหมายเลขคำสั่งซื้อ
        const orderNumber = await Order.generateOrderNumber();

        // สร้าง PromptPay QR Code
        let qrCode = '';
        try {
            const promptpayId = process.env.PROMPTPAY_ID || '0812345678';
            qrCode = await generatePromptPayQR(
                promptpayId,
                0, // จำนวนเงินจะคำนวณจาก items
                orderNumber
            );
        } catch (qrError) {
            console.error('QR Generation Error:', qrError);
            // ถ้าสร้าง QR ไม่ได้ก็ยังสร้างคำสั่งซื้อได้
        }

        // สร้างคำสั่งซื้อ
        const order = await Order.create({
            orderNumber,
            customer,
            shippingAddress,
            items,
            totalAmount,
            status: 'pending',
            paymentInfo: {
                method: 'promptpay',
                qrCode: qrCode
            }
        });

        // คำนวณ totalAmount จาก pre-save hook
        // สร้าง QR Code ใหม่ด้วยยอดเงินที่ถูกต้อง
        if (qrCode) {
            try {
                const promptpayId = process.env.PROMPTPAY_ID || '0812345678';
                const updatedQR = await generatePromptPayQR(
                    promptpayId,
                    order.totalAmount,
                    orderNumber
                );
                order.paymentInfo.qrCode = updatedQR;
                await order.save();
            } catch (qrError) {
                console.error('QR Update Error:', qrError);
            }
        }

        res.status(201).json({
            success: true,
            data: {
                orderId: order._id,
                orderNumber: order.orderNumber,
                totalAmount: order.totalAmount,
                qrCode: order.paymentInfo.qrCode,
                status: order.status,
                createdAt: order.createdAt
            }
        });

    } catch (error) {
        console.error('Create Order Error:', error);

        if (error.name === 'ValidationError') {
            const errors = {};
            Object.keys(error.errors).forEach(key => {
                errors[key] = error.errors[key].message;
            });
            return res.status(400).json({
                success: false,
                message: 'ข้อมูลไม่ถูกต้อง',
                errors
            });
        }

        res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการสร้างคำสั่งซื้อ'
        });
    }
});

// GET /api/orders/track - ค้นหาคำสั่งซื้อ
// Testing: Track Order
//
// ตัวอย่างที่ 1 - ค้นหาสำเร็จ
// method: GET
// URI: http://localhost:3000/api/orders/track?orderNumber=ORD-20251127-001&email=somchai@example.com
// Expected Response: 200 OK
// {
//   "success": true,
//   "data": {
//     "orderNumber": "ORD-20251127-001",
//     "customer": {...},
//     "items": [...],
//     "totalAmount": 2280,
//     "status": "pending",
//     "statusHistory": [...]
//   }
// }

router.get('/orders/track', async (req, res) => {
    try {
        const { orderNumber, email } = req.query;

        if (!orderNumber || !email) {
            return res.status(400).json({
                success: false,
                message: 'กรุณาระบุหมายเลขคำสั่งซื้อและอีเมล'
            });
        }

        const order = await Order.findOne({
            orderNumber,
            'customer.email': email.toLowerCase()
        }).populate('items.productId', 'name brand imageUrl');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'ไม่พบคำสั่งซื้อ กรุณาตรวจสอบข้อมูล'
            });
        }

        res.json({
            success: true,
            data: order
        });

    } catch (error) {
        console.error('Track Order Error:', error);
        res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการค้นหาคำสั่งซื้อ'
        });
    }
});

// GET /api/orders/:id - ดูรายละเอียดคำสั่งซื้อ
// Testing: Get Order Detail
//
// ตัวอย่างที่ 1 - ดูสำเร็จ
// method: GET
// URI: http://localhost:3000/api/orders/692002b138810c26bcf1f611
// Expected Response: 200 OK

router.get('/orders/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('items.productId', 'name brand imageUrl');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'ไม่พบคำสั่งซื้อ'
            });
        }

        res.json({
            success: true,
            data: order
        });

    } catch (error) {
        console.error('Get Order Error:', error);
        res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการดึงข้อมูลคำสั่งซื้อ'
        });
    }
});

// ==================== ORDER ROUTES (ADMIN) ====================

// GET /api/admin/orders - ดูคำสั่งซื้อทั้งหมด (with filters)
// Testing: Get All Orders (Admin)
//
// ตัวอย่างที่ 1 - ดูทั้งหมด
// method: GET
// URI: http://localhost:3000/api/admin/orders
// headers: Authorization: Bearer <token>
// Expected Response: 200 OK
//
// ตัวอย่างที่ 2 - กรองตามสถานะ
// method: GET
// URI: http://localhost:3000/api/admin/orders?status=pending
// headers: Authorization: Bearer <token>

router.get('/admin/orders', verifyTokenMiddleware, async (req, res) => {
    try {
        const { status, search, page = 1, limit = 20 } = req.query;
        const query = {};

        // กรองตามสถานะ
        if (status) {
            query.status = status;
        }

        // ค้นหาด้วยหมายเลขคำสั่งซื้อหรืออีเมล
        if (search) {
            query.$or = [
                { orderNumber: { $regex: search, $options: 'i' } },
                { 'customer.email': { $regex: search, $options: 'i' } },
                { 'customer.firstName': { $regex: search, $options: 'i' } },
                { 'customer.lastName': { $regex: search, $options: 'i' } }
            ];
        }

        const skip = (page - 1) * limit;

        const orders = await Order.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .populate('items.productId', 'name brand');

        const total = await Order.countDocuments(query);

        res.json({
            success: true,
            count: orders.length,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / limit),
            data: orders
        });

    } catch (error) {
        console.error('Get Admin Orders Error:', error);
        res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการดึงข้อมูลคำสั่งซื้อ'
        });
    }
});

// GET /api/admin/orders/stats - ดูสถิติคำสั่งซื้อ
// Testing: Get Order Statistics
//
// method: GET
// URI: http://localhost:3000/api/admin/orders/stats
// headers: Authorization: Bearer <token>
// Expected Response: 200 OK
// {
//   "success": true,
//   "data": {
//     "todayOrders": 15,
//     "todaySales": 45600,
//     "pendingOrders": 3,
//     "paidOrders": 8,
//     "totalOrders": 150,
//     "totalSales": 456000
//   }
// }

router.get('/admin/orders/stats', verifyTokenMiddleware, async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // คำสั่งซื้อวันนี้
        const todayOrders = await Order.countDocuments({
            createdAt: { $gte: today }
        });

        // ยอดขายวันนี้
        const todaySalesResult = await Order.aggregate([
            { $match: { createdAt: { $gte: today } } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);
        const todaySales = todaySalesResult.length > 0 ? todaySalesResult[0].total : 0;

        // คำสั่งซื้อตามสถานะ
        const pendingOrders = await Order.countDocuments({ status: 'pending' });
        const paidOrders = await Order.countDocuments({ status: 'paid' });
        const confirmedOrders = await Order.countDocuments({ status: 'confirmed' });
        const shippedOrders = await Order.countDocuments({ status: 'shipped' });

        // ยอดรวมทั้งหมด
        const totalOrders = await Order.countDocuments();
        const totalSalesResult = await Order.aggregate([
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);
        const totalSales = totalSalesResult.length > 0 ? totalSalesResult[0].total : 0;

        res.json({
            success: true,
            data: {
                todayOrders,
                todaySales,
                pendingOrders,
                paidOrders,
                confirmedOrders,
                shippedOrders,
                totalOrders,
                totalSales
            }
        });

    } catch (error) {
        console.error('Get Order Stats Error:', error);
        res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการดึงสถิติ'
        });
    }
});

// PUT /api/admin/orders/:id/status - อัพเดทสถานะคำสั่งซื้อ
// Testing: Update Order Status
//
// ตัวอย่างที่ 1 - อัพเดทเป็น confirmed
// method: PUT
// URI: http://localhost:3000/api/admin/orders/692002b138810c26bcf1f611/status
// headers: Authorization: Bearer <token>
// body: raw JSON
// {
//   "status": "confirmed",
//   "note": "ยืนยันคำสั่งซื้อแล้ว"
// }
//
// ตัวอย่างที่ 2 - อัพเดทเป็น shipped พร้อมหมายเลขพัสดุ
// body: raw JSON
// {
//   "status": "shipped",
//   "trackingNumber": "TH1234567890",
//   "note": "จัดส่งแล้ว"
// }

router.put('/admin/orders/:id/status', verifyTokenMiddleware, async (req, res) => {
    try {
        const { status, trackingNumber, note } = req.body;

        if (!status) {
            return res.status(400).json({
                success: false,
                message: 'กรุณาระบุสถานะ'
            });
        }

        const validStatuses = ['pending', 'paid', 'confirmed', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'สถานะไม่ถูกต้อง'
            });
        }

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'ไม่พบคำสั่งซื้อ'
            });
        }

        // อัพเดทสถานะ
        order.addStatusHistory(status, note || '');

        // อัพเดทหมายเลขพัสดุถ้ามี
        if (trackingNumber) {
            order.trackingNumber = trackingNumber;
        }

        // อัพเดท paidAt ถ้าเปลี่ยนเป็น paid
        if (status === 'paid' && !order.paymentInfo.paidAt) {
            order.paymentInfo.paidAt = new Date();
        }

        await order.save();

        res.json({
            success: true,
            data: order
        });

    } catch (error) {
        console.error('Update Order Status Error:', error);
        res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการอัพเดทสถานะ'
        });
    }
});

// GET /api/admin/orders/:id - ดูรายละเอียดคำสั่งซื้อ (Admin)
router.get('/admin/orders/:id', verifyTokenMiddleware, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('items.productId', 'name brand imageUrl price');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'ไม่พบคำสั่งซื้อ'
            });
        }

        res.json({
            success: true,
            data: order
        });

    } catch (error) {
        console.error('Get Admin Order Detail Error:', error);
        res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการดึงข้อมูลคำสั่งซื้อ'
        });
    }
});

module.exports = router;
