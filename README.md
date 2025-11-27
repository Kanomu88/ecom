# 🧸 Doll Pre-Order

เว็บไซต์พรีออเดอร์ตุ๊กตาจากแบรนด์ดังทั่วโลก ทำเป็นโปรเจกต์วิชา Web Programming

## เกี่ยวกับโปรเจกต์

เว็บไซต์ PINKORY ถูกจัดตั้งขึ้นโดยกลุ่มนักศึกษาที่เล็งเห็นถึงความซับซ้อนของตลาดพรีออเดอร์ตุ๊กตา พวกเราจึงได้พัฒนาแพลตฟอร์มออนไลน์นี้เพื่อแก้ไขปัญหาและอำนวยความสะดวกแก่ผู้ที่ชื่นชอบตุ๊กตา โดยแพลตฟอร์มออนไลน์นี้ได้ทำหน้าที่เป็นตัวกลางอำนวยความสะดวกในการซื้อและพรีออเดอร์ตุ๊กตาจากแบรนด์ดังและตุ๊กตาลิมิเต็ดเอดิชั่นจากแต่ละแบรนด์ PINKORY มีจุดเด่นในด้านการคัดสรรสินค้าที่มีคุณภาพสูงและระบบการสั่งซื้อที่ใช้งานง่าย ขอบเขตการดำเนินงานมุ่งเน้นการสร้างความเชื่อมั่นและอำนวยความสะดวกให้แก่นักสะสมที่มีใจรักในตุ๊กตา โดยมีเป้าหมายสูงสุดคือการได้เป็นศูนย์กลางที่น่าเชื่อถือและเข้าถึงง่ายสำหรับนักสะสมตุ๊กตา

รองรับตุ๊กตาจาก 5 แบรนด์:
- **Jellycat** - ตุ๊กตานุ่มๆ จากอังกฤษ
- **Care Bear** - หมีแคร์แบร์คลาสสิก
- **Steiff** - แบรนด์เยอรมันคุณภาพพรีเมียม
- **Gund** - ตุ๊กตาจากอเมริกา
- **Squishmallows** - ตุ๊กตานุ่มฟูที่กำลังฮิต

## ฟีเจอร์หลัก

**สำหรับผู้ใช้ทั่วไป:**
- หน้าแรกมีวิดีโอสวยๆ กับสินค้าแนะนำ
- ค้นหาสินค้าได้หลายแบบ (ชื่อ, แบรนด์, เรตติ้ง)
- ดูรายละเอียดสินค้าพร้อมรูปภาพ
- แปลงราคาเป็นสกุลเงินต่างประเทศ (USD, EUR, JPY, GBP)
- **🛒 ระบบตะกร้าสินค้า** - เพิ่ม ลบ แก้ไขจำนวนสินค้า
- **💳 ชำระเงินด้วย QR Code PromptPay** - สะดวก รวดเร็ว ปลอดภัย
- **📦 ติดตามคำสั่งซื้อ** - ตรวจสอบสถานะสินค้าได้ตลอดเวลา
- หน้า About Us แสดงข้อมูลทีม

**สำหรับ Admin:**
- Login ด้วย JWT (ปลอดภัย)
- จัดการสินค้า - เพิ่ม ลบ แก้ไข ค้นหา
- จัดการ admin คนอื่นๆ
- **📊 จัดการคำสั่งซื้อ** - ดู กรอง อัพเดทสถานะ
- **📈 Dashboard สถิติ** - ยอดขาย คำสั่งซื้อ
- Modal สำหรับแก้ไขข้อมูล
- Confirmation dialog ก่อนลบ

## เทคโนโลยีที่ใช้

- **Frontend:** HTML, CSS, JavaScript 
- **Backend:** Node.js, Express.js
- **Database:** MongoDB + Mongoose
- **Authentication:** JWT + bcrypt
- **Payment:** PromptPay QR Code (promptpay-qr, qrcode)
- **API:** Exchange Rate API

## ข้อกำหนดระบบ

ก่อนเริ่มต้อง install สิ่งเหล่านี้ก่อน:

1. **Node.js** (v18 ขึ้นไป)
   - ดาวน์โหลด: https://nodejs.org/
   - ตรวจสอบเวอร์ชัน: `node --version`

2. **MongoDB** (v6.0 ขึ้นไป)
   - ดาวน์โหลด: https://www.mongodb.com/try/download/community
   - หรือใช้ MongoDB Atlas (cloud) ก็ได้

3. **Git** (สำหรับ clone โปรเจกต์)
   - ดาวน์โหลด: https://git-scm.com/

## วิธีติดตั้งและรัน

### ขั้นตอนที่ 1: Clone โปรเจกต์

```bash
git clone <repository-url>
cd doll-preorder-webapp
```

### ขั้นตอนที่ 2: ติดตั้ง Dependencies

```bash
npm install
```

คำสั่งนี้จะติดตั้ง packages ทั้งหมดที่จำเป็น (ประมาณ 2-3 นาที)

### ขั้นตอนที่ 3: ตั้งค่า Environment Variables

สร้างไฟล์ `.env` ที่ root ของโปรเจกต์:

```env
PORT=3000
MONGODB_URI=mongodb+srv://testuser:1111@dollwebapp.odnz0q4.mongodb.net/dollwebapp?retryWrites=true&w=majority&appName=dollwebapp
```

**หมายเหตุ:**
- ถ้าใช้ MongoDB Atlas ให้เปลี่ยน `MONGODB_URI` เป็น connection string ของคุณ
- `JWT_SECRET` ควรเป็นข้อความยาวๆ ที่เดายาก

### ขั้นตอนที่ 4: เริ่ม MongoDB

**ถ้าใช้ MongoDB ในเครื่อง:**

```bash
# Windows (เปิด Command Prompt แบบ Administrator)
net start MongoDB

# Mac/Linux
sudo systemctl start mongod
# หรือ
brew services start mongodb-community
```

**ถ้าใช้ MongoDB Atlas:**
- ไม่ต้องทำอะไร แค่ใส่ connection string ใน `.env`

### ขั้นตอนที่ 5: ใส่ข้อมูลตัวอย่าง

```bash
npm run seed
```

คำสั่งนี้จะสร้างข้อมูลตัวอย่าง:
- **Admin 2 คน** สำหรับทดสอบ login
- **สินค้า 20 รายการ** จาก 5 แบรนด์

**ข้อมูล Admin สำหรับ Login:**
- Username: `admin01` | Password: `admin123`
- Username: `admin02` | Password: `admin456`

### ขั้นตอนที่ 6: รัน Server

```bash
npm start
```

หรือถ้าอยากให้ auto-reload เมื่อแก้ไขโค้ด:

```bash
npm run dev
```

เมื่อเห็นข้อความนี้แสดงว่าสำเร็จ:
```
🚀 Server running on port 3000
🔌 API: http://localhost:3000/api
```

### ขั้นตอนที่ 7: เปิดเว็บไซต์


**ใช้ Live Server Extension ใน VS Code:**
1. ติดตั้ง Live Server Extension
2. คลิกขวาที่ `public/pages/index.html`
3. เลือก "Open with Live Server"
4. จะเปิดที่ `http://localhost:5500` หรือ `http://127.0.0.1:5500`

## โครงสร้างโปรเจกต์

```
doll-preorder-webapp/
├── public/                      # Frontend
│   ├── css/                     # ไฟล์ CSS
│   │   ├── common.css          # สไตล์ทั่วไป
│   │   ├── index.css           # หน้าแรก
│   │   ├── search.css          # หน้าค้นหา
│   │   ├── product-detail.css  # หน้ารายละเอียด
│   │   ├── login.css           # หน้า login
│   │   ├── admin.css           # สไตล์ admin ทั่วไป
│   │   ├── admin-products.css  # หน้าจัดการสินค้า
│   │   ├── admin-users.css     # หน้าจัดการ admin
│   │   ├── team.css            # หน้าทีม
│   │   └── footer.css          # footer
│   ├── img/                     # รูปภาพ
│   ├── js/                      # JavaScript
│   │   ├── cart-utils.js       # Cart utilities
│   │   ├── cart.js             # Cart page
│   │   └── checkout.js         # Checkout page
│   └── pages/                   # ไฟล์ HTML
│       ├── index.html          # หน้าแรก
│       ├── search.html         # ค้นหาสินค้า
│       ├── product-detail.html # รายละเอียดสินค้า
│       ├── cart.html           # ตะกร้าสินค้า
│       ├── checkout.html       # กรอกข้อมูลจัดส่ง
│       ├── payment.html        # ชำระเงิน QR Code
│       ├── order-success.html  # ยืนยันคำสั่งซื้อ
│       ├── order-track.html    # ติดตามคำสั่งซื้อ
│       ├── login.html          # เข้าสู่ระบบ
│       ├── admin-products.html # จัดการสินค้า
│       ├── admin-users.html    # จัดการ admin
│       ├── admin-orders.html   # จัดการคำสั่งซื้อ
│       └── team.html           # เกี่ยวกับเรา
├── server/                      # Backend
│   ├── config/
│   │   └── database.js         # เชื่อมต่อ MongoDB
│   ├── models/
│   │   ├── Admin.js            # Schema admin
│   │   ├── Product.js          # Schema product
│   │   └── Order.js            # Schema order
│   ├── services/
│   │   └── payment.js          # PromptPay QR generation
│   ├── back.js                 # API routes
│   ├── index.js                # Server หลัก
│   ├── token_manager.js        # จัดการ JWT
│   └── seed.js                 # ใส่ข้อมูลตัวอย่าง
├── .env                         # ตั้งค่า (ห้าม commit!)
├── .env.example                # ตัวอย่างการตั้งค่า
├── .gitignore                  # ไฟล์ที่ไม่ต้อง commit
├── package.json                # Dependencies
└── README.md                   # ไฟล์นี้
```

## วิธีใช้งาน

### สำหรับผู้ใช้ทั่วไป

1. **เข้าหน้าแรก** - ดูสินค้าแนะนำ
2. **ค้นหาสินค้า** - กดปุ่ม "🔍 ค้นหาสินค้า"
3. **ดูรายละเอียด** - กดปุ่ม "ดูรายละเอียด" ในสินค้าที่สนใจ
4. **แปลงสกุลเงิน** - เลือกสกุลเงินที่ต้องการในหน้ารายละเอียด

### สำหรับ Admin

1. **Login** - กดปุ่ม "เข้าสู่ระบบ" แล้วใส่ username/password
2. **จัดการสินค้า:**
   - เพิ่มสินค้าใหม่ด้วยฟอร์มด้านบน
   - ค้นหาสินค้าด้วยชื่อ
   - กดปุ่ม "แก้ไข" เพื่อแก้ไขข้อมูล
   - กดปุ่ม "ลบ" เพื่อลบสินค้า (จะมี confirmation)
3. **จัดการ Admin:**
   - เข้าหน้า "จัดการผู้ดูแลระบบ"
   - เพิ่ม/แก้ไข/ลบ admin ได้
4. **Logout** - กดปุ่ม "ออกจากระบบ" เมื่อใช้งานเสร็จ

## API Endpoints

### User APIs (ไม่ต้อง login)

```
GET  /api/public/products              # ดูสินค้าทั้งหมด
GET  /api/public/products?name=xxx     # ค้นหาตามชื่อ
GET  /api/public/products?brand=xxx    # ค้นหาตามแบรนด์
GET  /api/public/products?rating=4.5   # ค้นหาตามเรตติ้ง
GET  /api/public/products/:id          # ดูสินค้า 1 ชิ้น
POST /api/auth/login                   # เข้าสู่ระบบ
```

### Admin APIs (ต้อง login)

```
GET    /api/products           # ดูสินค้าทั้งหมด
GET    /api/products/:id       # ดูสินค้า 1 ชิ้น
POST   /api/products           # เพิ่มสินค้า
PUT    /api/products/:id       # แก้ไขสินค้า
DELETE /api/products/:id       # ลบสินค้า

GET    /api/admins             # ดู admin ทั้งหมด
GET    /api/admins/:id         # ดู admin 1 คน
POST   /api/admins             # เพิ่ม admin
PUT    /api/admins/:id         # แก้ไข admin
DELETE /api/admins/:id         # ลบ admin
```

**การใช้ Token:**
```javascript
fetch('http://localhost:3000/api/products', {
  headers: {
    'Authorization': 'Bearer <your-token-here>'
  }
})
```

## Database Schema

### Collection: admins

```javascript
{
  _id: ObjectId,
  username: String,        // unique
  password: String,        // bcrypt hashed
  firstName: String,
  lastName: String,
  email: String,          // unique
  role: String,           // 'admin' or 'superadmin'
  createdAt: Date,
  updatedAt: Date
}
```

### Collection: products

```javascript
{
  _id: ObjectId,
  name: String,
  brand: String,          // Jellycat, Care Bear, Steiff, Gund, Squishmallows
  category: String,
  price: Number,
  rating: Number,         // 0-5
  ratingCount: Number,
  description: String,
  imageUrl: String,
  inStock: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## ปัญหาที่เจอระหว่างทำ

- JWT ไม่ work ตอนแรกเพราะลืมใส่ secret key
- CSS responsive ใช้เวลานาน ต้องลองหลายรอบ
- MongoDB connection บางทีหลุด ต้อง handle error
- CORS error ตอนแรกงง แต่พอเข้าใจแล้วโอเค

## สิ่งที่อยากพัฒนาต่อ

- [ ] ระบบตะกร้าสินค้า
- [ ] ระบบชำระเงินจริง
- [ ] Upload รูปได้แทนที่จะใส่ URL
- [ ] ระบบแจ้งเตือนเมื่อสินค้ามาถึง
- [ ] Dashboard สถิติสำหรับ admin

## ทีมพัฒนา

- **Kirakorn Lumlerd** - Frontend Developer
- **สมหญิง รักดี** - Backend Developer
- **Nitchakan Sookphaeth** - Report & Documentation
- **Chananchida Chongkhum** - Report & Documentation

---


"# ecom" 
