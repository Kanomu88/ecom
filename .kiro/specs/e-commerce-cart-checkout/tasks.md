# Implementation Plan

- [x] 1. สร้าง Order Model และ Backend API

  - สร้าง Order schema ใน MongoDB พร้อม validation
  - สร้าง method สำหรับ generateOrderNumber และ calculateTotal
  - เพิ่ม API endpoints สำหรับสร้างและจัดการคำสั่งซื้อ
  - _Requirements: 2.2, 2.5, 3.1, 3.4_

- [x] 1.1 สร้าง Order Model


  - สร้างไฟล์ `server/models/Order.js` พร้อม schema ตาม design
  - เพิ่ม validation สำหรับ customer info และ shipping address
  - สร้าง method `generateOrderNumber()` ที่สร้างหมายเลขไม่ซ้ำ (format: ORD-YYYYMMDD-XXX)
  - สร้าง method `addStatusHistory(status, note)` สำหรับบันทึกประวัติสถานะ
  - สร้าง pre-save hook สำหรับคำนวณ totalAmount อัตโนมัติ
  - _Requirements: 3.1, 3.4, 3.5_

- [x] 1.2 สร้าง Order API Endpoints (Public)


  - เพิ่ม POST `/api/orders` สำหรับสร้างคำสั่งซื้อใหม่
  - ตรวจสอบ inStock ของสินค้าทั้งหมดก่อนสร้างคำสั่งซื้อ
  - เพิ่ม GET `/api/orders/track` สำหรับค้นหาคำสั่งซื้อด้วย orderNumber และ email
  - เพิ่ม GET `/api/orders/:id` สำหรับดูรายละเอียดคำสั่งซื้อ
  - เพิ่ม validation middleware สำหรับตรวจสอบข้อมูล
  - _Requirements: 2.1, 2.2, 2.5, 3.2, 6.2, 6.3_

- [x] 1.3 สร้าง Order API Endpoints (Admin)


  - เพิ่ม GET `/api/admin/orders` สำหรับดูคำสั่งซื้อทั้งหมด (with filters)
  - เพิ่ม GET `/api/admin/orders/stats` สำหรับดูสถิติคำสั่งซื้อ
  - เพิ่ม PUT `/api/admin/orders/:id/status` สำหรับอัพเดทสถานะ
  - เพิ่ม GET `/api/admin/orders/:id` สำหรับดูรายละเอียดแบบ admin
  - ใช้ verifyTokenMiddleware สำหรับ authentication
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_

- [ ]* 1.4 เขียน unit tests สำหรับ Order Model
  - ทดสอบ generateOrderNumber() ว่าสร้างหมายเลขไม่ซ้ำ
  - ทดสอบ calculateTotal() คำนวณถูกต้อง
  - ทดสอบ validation ของ customer และ shipping info
  - _Requirements: 3.1, 3.4_

- [x] 2. สร้าง Payment Service สำหรับ PromptPay QR Code

  - สร้าง service สำหรับ generate PromptPay QR Code
  - คำนวณ CRC checksum ตาม EMVCo standard
  - รวม QR generation เข้ากับ order creation API
  - _Requirements: 2.3, 2.4_

- [x] 2.1 ติดตั้ง QR Code library


  - ติดตั้ง `promptpay-qr` หรือ `qrcode` package
  - เพิ่ม dependency ใน package.json
  - _Requirements: 2.3_

- [x] 2.2 สร้าง Payment Service


  - สร้างไฟล์ `server/services/payment.js`
  - สร้าง function `generatePromptPayQR(phoneNumber, amount, orderNumber)`
  - ใช้ EMVCo format สำหรับ PromptPay
  - return QR code เป็น base64 string
  - เพิ่ม PROMPTPAY_ID ใน .env
  - _Requirements: 2.3, 2.4_

- [x] 2.3 รวม Payment Service เข้ากับ Order API


  - แก้ไข POST `/api/orders` ให้เรียก generatePromptPayQR
  - บันทึก QR code ใน order.paymentInfo.qrCode
  - return QR code ใน response
  - _Requirements: 2.3, 2.4, 2.5_

- [ ]* 2.4 เขียน unit tests สำหรับ Payment Service
  - ทดสอบ generatePromptPayQR() สร้าง QR ถูกต้อง
  - ทดสอบ CRC checksum calculation
  - _Requirements: 2.3_

- [x] 3. สร้าง Cart System (Frontend)

  - สร้างหน้าตะกร้าสินค้าพร้อม UI
  - สร้าง cart utilities สำหรับจัดการ localStorage
  - เพิ่มปุ่ม "เพิ่มลงตะกร้า" ในหน้ารายละเอียดสินค้า
  - เพิ่ม cart badge ที่ header ทุกหน้า
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 5.1, 5.2_

- [x] 3.1 สร้าง Cart Utilities


  - สร้างไฟล์ `public/js/cart-utils.js`
  - สร้าง functions: addToCart, removeFromCart, updateQuantity, getCart, clearCart, calculateTotal
  - ใช้ localStorage สำหรับเก็บข้อมูล
  - เพิ่ม event listener สำหรับ storage event (sync ระหว่าง tabs)
  - _Requirements: 1.1, 1.2, 1.5, 1.6, 1.7, 1.8_

- [x] 3.2 สร้างหน้าตะกร้าสินค้า


  - สร้างไฟล์ `public/pages/cart.html`
  - สร้างไฟล์ `public/css/cart.css`
  - สร้างไฟล์ `public/js/cart.js`
  - แสดงรายการสินค้าพร้อมรูปภาพ ชื่อ ราคา จำนวน
  - เพิ่มปุ่ม +/- สำหรับแก้ไขจำนวน
  - เพิ่มปุ่มลบสินค้า
  - แสดงราคารวมที่อัพเดทแบบ real-time
  - แสดงหน้าตะกร้าว่างเมื่อไม่มีสินค้า
  - เพิ่มปุ่ม "ช้อปปิ้งต่อ" และ "ชำระเงิน"
  - _Requirements: 1.4, 1.5, 1.6, 1.7, 5.3_

- [x] 3.3 เพิ่มปุ่ม "เพิ่มลงตะกร้า" ในหน้ารายละเอียดสินค้า


  - แก้ไข `public/pages/product-detail.html` เพิ่มปุ่ม
  - เพิ่ม input สำหรับเลือกจำนวน
  - เพิ่ม event listener เรียก addToCart()
  - แสดง animation เมื่อเพิ่มสำเร็จ
  - ตรวจสอบ inStock ก่อนอนุญาตให้เพิ่ม
  - _Requirements: 1.1, 1.2, 5.2, 6.1_

- [x] 3.4 เพิ่ม Cart Badge ที่ Header


  - แก้ไข `public/css/common.css` เพิ่มสไตล์ cart badge
  - แก้ไขทุกไฟล์ HTML เพิ่มไอคอนตะกร้าพร้อม badge
  - สร้าง function updateCartBadge() ใน cart-utils.js
  - เรียก updateCartBadge() เมื่อโหลดหน้าและเมื่อมีการเปลี่ยนแปลง
  - _Requirements: 1.3, 5.1_

- [x] 4. สร้าง Checkout System (Frontend)

  - สร้างหน้ากรอกข้อมูลการจัดส่ง
  - สร้างหน้าแสดง QR Code สำหรับชำระเงิน
  - สร้างหน้ายืนยันคำสั่งซื้อ
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.6, 2.7, 2.8, 5.4, 5.5, 5.8_

- [x] 4.1 สร้างหน้ากรอกข้อมูลการจัดส่ง


  - สร้างไฟล์ `public/pages/checkout.html`
  - สร้างไฟล์ `public/css/checkout.css`
  - สร้างไฟล์ `public/js/checkout.js`
  - สร้างฟอร์มกรอกข้อมูล (ชื่อ อีเมล เบอร์โทร ที่อยู่ จังหวัด รหัสไปรษณีย์)
  - เพิ่ม validation สำหรับทุก field
  - แสดงสรุปคำสั่งซื้อด้านข้าง
  - เพิ่มปุ่ม "กลับ" และ "ดำเนินการชำระเงิน"
  - _Requirements: 2.1, 2.2_

- [x] 4.2 สร้างหน้าแสดง QR Code


  - สร้างไฟล์ `public/pages/payment.html`
  - สร้างไฟล์ `public/css/payment.css`
  - สร้างไฟล์ `public/js/payment.js`
  - เรียก API สร้างคำสั่งซื้อเมื่อกด "ดำเนินการชำระเงิน"
  - แสดง QR Code ขนาดใหญ่และชัดเจน
  - แสดงหมายเลขคำสั่งซื้อและยอดเงิน
  - เพิ่มปุ่ม "ฉันชำระเงินแล้ว" ไปหน้ายืนยัน
  - แสดง loading indicator ขณะสร้างคำสั่งซื้อ
  - _Requirements: 2.3, 2.4, 2.5, 5.4, 5.8_

- [x] 4.3 สร้างหน้ายืนยันคำสั่งซื้อ


  - สร้างไฟล์ `public/pages/order-success.html`
  - สร้างไฟล์ `public/css/order-success.css`
  - แสดงข้อความขอบคุณ
  - แสดงหมายเลขคำสั่งซื้อ
  - เพิ่มลิงก์ไปหน้าติดตามคำสั่งซื้อ
  - ล้างตะกร้าสินค้าหลังแสดงหน้านี้
  - _Requirements: 2.7, 2.8, 5.5_

- [x] 5. สร้าง Order Tracking System (Frontend)

  - สร้างหน้าติดตามคำสั่งซื้อ
  - แสดงรายละเอียดและสถานะคำสั่งซื้อ
  - แสดง timeline ของสถานะ
  - _Requirements: 3.2, 3.3, 3.5_

- [x] 5.1 สร้างหน้าติดตามคำสั่งซื้อ


  - สร้างไฟล์ `public/pages/order-track.html`
  - สร้างไฟล์ `public/css/order-track.css`
  - สร้างไฟล์ `public/js/order-track.js`
  - สร้างฟอร์มค้นหา (หมายเลขคำสั่งซื้อ + อีเมล)
  - เรียก API `/api/orders/track` เมื่อกดค้นหา
  - แสดงรายละเอียดคำสั่งซื้อ (รายการสินค้า ที่อยู่ ยอดเงิน)
  - แสดง timeline สถานะแบบ step-by-step
  - แสดงหมายเลขพัสดุเมื่อมี
  - _Requirements: 3.2, 3.3, 3.5_

- [x] 6. สร้าง Admin Orders Management (Frontend)

  - สร้างหน้าจัดการคำสั่งซื้อสำหรับ admin
  - แสดงรายการคำสั่งซื้อทั้งหมด
  - เพิ่มฟีเจอร์กรองและค้นหา
  - เพิ่มฟีเจอร์อัพเดทสถานะ
  - แสดงสถิติ
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_

- [x] 6.1 สร้างหน้าจัดการคำสั่งซื้อ



  - สร้างไฟล์ `public/pages/admin-orders.html`
  - สร้างไฟล์ `public/css/admin-orders.css`
  - สร้างไฟล์ `public/js/admin-orders.js`
  - เพิ่มลิงก์ในเมนู admin
  - ตรวจสอบ JWT token ก่อนเข้าหน้า
  - แสดงสถิติด้านบน (คำสั่งซื้อวันนี้ ยอดขาย รอดำเนินการ)
  - _Requirements: 4.1, 4.7_

- [x] 6.2 สร้างรายการคำสั่งซื้อ

  - เรียก API `/api/admin/orders` เพื่อดึงข้อมูล
  - แสดงรายการคำสั่งซื้อในรูปแบบ table หรือ card
  - แสดงข้อมูลสำคัญ (หมายเลข ชื่อลูกค้า ยอดเงิน วันที่ สถานะ)
  - เพิ่มปุ่ม "ดูรายละเอียด" และ "เปลี่ยนสถานะ"
  - _Requirements: 4.1, 4.4_

- [x] 6.3 เพิ่มฟีเจอร์กรองและค้นหา

  - เพิ่ม dropdown กรองตามสถานะ
  - เพิ่ม search box ค้นหาด้วยหมายเลขหรืออีเมล
  - เรียก API พร้อม query parameters
  - อัพเดทรายการเมื่อกรองหรือค้นหา
  - _Requirements: 4.2, 4.3_

- [x] 6.4 สร้าง Modal อัพเดทสถานะ

  - สร้าง modal สำหรับเปลี่ยนสถานะ
  - แสดง dropdown เลือกสถานะใหม่
  - เพิ่ม input หมายเลขพัสดุ (แสดงเมื่อเลือก "shipped")
  - เพิ่ม textarea หมายเหตุ (optional)
  - เรียก API PUT `/api/admin/orders/:id/status`
  - แสดง confirmation dialog ก่อนอัพเดท
  - _Requirements: 4.5, 4.6_

- [x] 6.5 สร้าง Modal รายละเอียดคำสั่งซื้อ

  - สร้าง modal แสดงรายละเอียดเต็ม
  - แสดงข้อมูลลูกค้า ที่อยู่จัดส่ง
  - แสดงรายการสินค้าพร้อมรูปภาพ
  - แสดงประวัติการเปลี่ยนสถานะ
  - _Requirements: 4.4_

- [x] 7. ปรับปรุง UI/UX และ Responsive Design

  - ปรับแต่ง CSS ให้สวยงามและสอดคล้องกับ brand
  - ทำให้ responsive สำหรับมือถือและแท็บเล็ต
  - เพิ่ม animations และ transitions
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8_

- [x] 7.1 ปรับแต่ง CSS และ Animations

  - ใช้ color scheme จาก common.css
  - เพิ่ม hover effects สำหรับปุ่ม
  - เพิ่ม fade-in animation สำหรับ modal
  - เพิ่ม slide animation เมื่อเพิ่มสินค้าลงตะกร้า
  - เพิ่ม loading spinner animation
  - _Requirements: 5.2, 5.6, 5.8_

- [x] 7.2 ทำ Responsive Design

  - ใช้ media queries สำหรับ mobile (< 768px)
  - ปรับ layout ให้เหมาะกับหน้าจอเล็ก
  - ทดสอบบน mobile, tablet, desktop
  - ปรับขนาด QR Code ให้เหมาะกับหน้าจอ
  - _Requirements: 5.7_

- [x] 8. เพิ่มการตรวจสอบสต็อกสินค้า

  - ตรวจสอบ inStock ก่อนเพิ่มลงตะกร้า
  - ตรวจสอบ inStock ก่อนสร้างคำสั่งซื้อ
  - แสดงข้อความเมื่อสินค้าหมด
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [x] 8.1 เพิ่มการตรวจสอบ Frontend

  - ตรวจสอบ inStock ก่อนแสดงปุ่ม "เพิ่มลงตะกร้า"
  - แสดงป้าย "สินค้าหมด" แทนปุ่มเมื่อ inStock = false
  - ตรวจสอบ inStock ในหน้าตะกร้าและแสดงเตือน
  - ไม่อนุญาตให้ checkout ถ้ามีสินค้าหมด
  - _Requirements: 6.1, 6.4_

- [x] 8.2 เพิ่มการตรวจสอบ Backend

  - แก้ไข POST `/api/orders` เพิ่มการตรวจสอบ inStock
  - query products จาก database ตรวจสอบสถานะล่าสุด
  - return 400 พร้อมรายการสินค้าที่หมดถ้าพบ
  - _Requirements: 6.2, 6.3_

- [x] 9. เพิ่มลิงก์และ Navigation

  - เพิ่มลิงก์ตะกร้าสินค้าใน header ทุกหน้า
  - เพิ่มลิงก์ติดตามคำสั่งซื้อใน footer
  - เพิ่มลิงก์จัดการคำสั่งซื้อในเมนู admin
  - อัพเดท navigation flow ให้ลื่นไหล
  - _Requirements: 5.1_

- [x] 9.1 อัพเดท Header และ Footer

  - แก้ไขทุกไฟล์ HTML เพิ่มไอคอนตะกร้าที่ header
  - เพิ่มลิงก์ "ติดตามคำสั่งซื้อ" ใน footer
  - ทดสอบ navigation ระหว่างหน้า
  - _Requirements: 5.1_

- [x] 9.2 อัพเดทเมนู Admin


  - แก้ไข admin-products.html และ admin-users.html
  - เพิ่มลิงก์ "จัดการคำสั่งซื้อ" ในเมนู
  - ทำให้ active state ชัดเจน
  - _Requirements: 4.1_

- [x] 10. Testing และ Bug Fixes

  - ทดสอบ user flow ทั้งหมด
  - ทดสอบ admin flow
  - แก้ไข bugs ที่พบ
  - ทดสอบ edge cases
  - _Requirements: ทั้งหมด_

- [x] 10.1 ทดสอบ User Flow

  - ทดสอบเพิ่มสินค้าลงตะกร้า → ดูตะกร้า → checkout → ชำระเงิน → ติดตาม
  - ทดสอบแก้ไขจำนวนและลบสินค้าในตะกร้า
  - ทดสอบ validation ในฟอร์ม
  - ทดสอบกรณีตะกร้าว่าง
  - ทดสอบกรณีสินค้าหมด
  - _Requirements: 1.1-1.8, 2.1-2.8, 3.2-3.3, 6.1-6.4_

- [x] 10.2 ทดสอบ Admin Flow

  - ทดสอบ login → ดูคำสั่งซื้อ → กรอง → ค้นหา → อัพเดทสถานะ
  - ทดสอบการเพิ่มหมายเลขพัสดุ
  - ทดสอบ authorization (ต้อง login)
  - _Requirements: 4.1-4.7_

- [x] 10.3 ทดสอบ Responsive Design

  - ทดสอบบน mobile (iPhone, Android)
  - ทดสอบบน tablet (iPad)
  - ทดสอบบน desktop (Chrome, Firefox, Safari)
  - แก้ไข layout issues
  - _Requirements: 5.7_

- [x] 10.4 ทดสอบ Edge Cases

  - ทดสอบ network error ระหว่างสร้างคำสั่งซื้อ
  - ทดสอบ localStorage เต็ม
  - ทดสอบ QR Code ไม่โหลด
  - ทดสอบ concurrent updates (หลาย tabs)
  - ทดสอบ invalid order number/email
  - _Requirements: ทั้งหมด_

- [x] 11. Documentation และ Deployment


  - อัพเดท README.md
  - เพิ่ม API documentation
  - เพิ่ม environment variables ใน .env.example
  - สร้าง seed data สำหรับ orders (optional)
  - _Requirements: ทั้งหมด_

- [x] 11.1 อัพเดท Documentation


  - อัพเดท README.md เพิ่มฟีเจอร์ใหม่
  - เพิ่ม API endpoints ใหม่ใน documentation
  - เพิ่ม screenshots ของหน้าใหม่
  - อัพเดท installation instructions
  - _Requirements: ทั้งหมด_

- [x] 11.2 เตรียม Deployment

  - เพิ่ม PROMPTPAY_ID ใน .env.example
  - ตรวจสอบ dependencies ใน package.json
  - ทดสอบ production build
  - สร้าง migration script สำหรับ Order collection (ถ้าจำเป็น)
  - _Requirements: ทั้งหมด_
