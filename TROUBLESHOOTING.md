# 🔧 คู่มือแก้ไขปัญหา Checkout

## ปัญหา: 400 Bad Request - "ข้อมูลไม่ถูกต้อง"

### สาเหตุที่เป็นไปได้

1. **สินค้าในตะกร้าไม่มี productId**
   - เกิดจากการเพิ่มสินค้าก่อนที่จะมีการแก้ไข code
   - ข้อมูลเก่าใน localStorage ไม่มี field `productId`

2. **ข้อมูลไม่ตรงกับ validation ของ Order model**
   - phone ต้องเป็นตัวเลข 10 หลัก
   - postalCode ต้องเป็นตัวเลข 5 หลัก
   - email ต้องเป็นรูปแบบที่ถูกต้อง
   - totalAmount ต้องมีค่าและเป็น number (ระบบคำนวณอัตโนมัติแล้ว)

3. **productId ไม่ถูกต้องหรือไม่มีในฐานข้อมูล**
   - สินค้าถูกลบออกจากฐานข้อมูลแล้ว
   - productId เป็น string ว่างหรือ undefined

### วิธีแก้ไข

#### วิธีที่ 1: ล้างตะกร้าและเพิ่มสินค้าใหม่ (แนะนำ)

1. เปิด Developer Console (F12)
2. พิมพ์คำสั่ง:
   ```javascript
   localStorage.removeItem('pinkory_cart')
   location.reload()
   ```
3. ไปที่หน้าค้นหาสินค้าและเพิ่มสินค้าใหม่

#### วิธีที่ 2: ใช้หน้า Debug

1. เปิด `http://localhost:3000/pages/test-cart.html`
2. ตรวจสอบข้อมูลในตะกร้า
3. ถ้ามีข้อผิดพลาด คลิก "ล้างตะกร้า"
4. เพิ่มสินค้าทดสอบด้วย Product ID ที่ถูกต้อง

#### วิธีที่ 3: แก้ไขข้อมูลใน localStorage

1. เปิด Developer Console (F12)
2. ไปที่ Application > Local Storage > http://localhost:3000
3. หา key `pinkory_cart`
4. ตรวจสอบว่าทุก item มี `productId` ที่ถูกต้อง
5. แก้ไขหรือลบข้อมูลที่ผิด

### ตรวจสอบข้อมูลในตะกร้า

เปิด Console และพิมพ์:
```javascript
const cart = JSON.parse(localStorage.getItem('pinkory_cart') || '[]');
console.table(cart);

// ตรวจสอบแต่ละ item
cart.forEach((item, i) => {
  console.log(`Item ${i}:`, {
    hasProductId: !!item.productId,
    productId: item.productId,
    name: item.name,
    price: item.price,
    quantity: item.quantity
  });
});
```

### ตรวจสอบว่า Product ID มีอยู่จริง

```javascript
async function checkProduct(productId) {
  const response = await fetch(`http://localhost:3000/api/public/products/${productId}`);
  const data = await response.json();
  console.log('Product exists:', data.success);
  console.log('Product data:', data.data);
}

// ใช้งาน
checkProduct('691e21e4129b8f8e4ce30e0d');
```

## ปัญหา: ปุ่มไม่สวยหรือไม่มี animation

### วิธีแก้ไข

1. ตรวจสอบว่า CSS ถูก load หรือไม่:
   - เปิด Developer Tools > Network
   - ดูว่าไฟล์ CSS ทั้งหมด load สำเร็จ (status 200)

2. Clear cache:
   - กด Ctrl+Shift+R (Windows) หรือ Cmd+Shift+R (Mac)
   - หรือเปิด DevTools > Network > Disable cache

3. ตรวจสอบ CSS:
   ```javascript
   // ตรวจสอบว่า CSS ถูก apply หรือไม่
   const btn = document.querySelector('.btn-primary');
   console.log(getComputedStyle(btn).background);
   ```

## ปัญหา: Toast notification ไม่แสดง

### วิธีแก้ไข

1. ตรวจสอบว่า animation ถูก define:
   ```javascript
   // ตรวจสอบ animation
   const style = document.createElement('style');
   style.textContent = `
     @keyframes slideIn {
       from { transform: translateX(100%); opacity: 0; }
       to { transform: translateX(0); opacity: 1; }
     }
   `;
   document.head.appendChild(style);
   ```

2. ทดสอบ toast:
   ```javascript
   showAddToCartAnimation();
   ```

## ปัญหา: Cart badge ไม่อัพเดท

### วิธีแก้ไข

```javascript
// Force update badge
function updateCartBadge() {
  const badge = document.getElementById('cart-badge');
  const cart = JSON.parse(localStorage.getItem('pinkory_cart') || '[]');
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }
}

updateCartBadge();
```

## ดึงข้อมูล Product ID ที่ถูกต้อง

### วิธีที่ 1: จาก API

```javascript
async function getAllProducts() {
  const response = await fetch('http://localhost:3000/api/public/products');
  const data = await response.json();
  
  if (data.success) {
    console.table(data.data.map(p => ({
      id: p._id,
      name: p.name,
      price: p.price,
      inStock: p.inStock
    })));
  }
}

getAllProducts();
```

### วิธีที่ 2: จาก Database

```sql
SELECT _id, name, price, inStock FROM products WHERE inStock = true;
```

## ติดต่อขอความช่วยเหลือ

หากยังแก้ไขไม่ได้ กรุณาส่งข้อมูลต่อไปนี้:

1. Screenshot ของ error ใน Console
2. ข้อมูลในตะกร้า (จาก test-cart.html)
3. Network request/response (จาก DevTools > Network)
4. Browser และ version ที่ใช้

## เครื่องมือที่มีให้

- **Debug Page**: `http://localhost:3000/pages/test-cart.html` - ตรวจสอบตะกร้า
- **API Test Page**: `http://localhost:3000/test-api.html` - ทดสอบ API โดยตรง
- **API Docs**: ดูใน `server/back.js` (มี comment ตัวอย่างการใช้งาน)
- **Order Model**: `server/models/Order.js` (ดู validation rules)
