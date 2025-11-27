# CSS Structure

โครงสร้าง CSS ใหม่ที่แยกตามหน้าเพื่อลดขนาดและเพิ่มประสิทธิภาพ

## ไฟล์ CSS หลัก

### 1. **common.css** (ใช้ร่วมกันทุกหน้า)
- Reset & Base styles
- CSS Variables (colors, shadows, radius, transitions)
- Header & Navigation
- Buttons (primary, secondary, danger)
- Forms (input, select, textarea)
- Basic animations (fadeIn, slideIn, spin)
- Loading spinner
- Responsive breakpoints

### 2. **index.css** (หน้าแรก)
- Banner section
- Stats cards
- Product cards & grid
- Contact section
- Separator & bottom wrap
- Product badges
- Responsive layouts

### 3. **admin.css** (หน้า Admin)
- Admin container & header
- Admin navigation
- Dashboard stats cards
- Form sections
- Table styles with hover effects
- Action buttons
- Modals & confirmation dialogs
- Message banners
- Badge styles

### 4. **search.css** (หน้าค้นหา)
- Search form
- Results container
- Product grid layout
- Product cards with animations
- Responsive grid

### 5. **product-detail.css** (หน้ารายละเอียดสินค้า)
- Product detail layout
- Product image & info
- Price & rating display
- Stock status
- Back button

### 6. **login.css** (หน้า Login)
- Login form styles
- Authentication UI

### 7. **team.css** (หน้า About Us)
- Team member cards
- About section

### 8. **footer.css** (Footer)
- Footer styles

## การใช้งาน

แต่ละหน้า HTML ควรโหลด CSS ตามลำดับนี้:

```html
<!-- 1. Common styles (จำเป็นทุกหน้า) -->
<link rel="stylesheet" href="../css/common.css">

<!-- 2. Page-specific styles -->
<link rel="stylesheet" href="../css/[page-name].css">

<!-- 3. Google Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap" rel="stylesheet">

<!-- 4. Footer styles -->
<link rel="stylesheet" href="../css/footer.css">
```

## ตัวอย่าง

### หน้า Index
```html
<link rel="stylesheet" href="../css/common.css">
<link rel="stylesheet" href="../css/index.css">
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../css/footer.css">
```

### หน้า Admin
```html
<link rel="stylesheet" href="../css/common.css">
<link rel="stylesheet" href="../css/admin.css">
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../css/admin-products.css">
<link rel="stylesheet" href="../css/footer.css">
```

## ประโยชน์

✅ **ลดขนาดไฟล์** - แต่ละหน้าโหลดเฉพาะ CSS ที่ใช้งานจริง  
✅ **เพิ่มความเร็ว** - ลด CSS ที่ไม่จำเป็นออก  
✅ **ง่ายต่อการดูแล** - แยกไฟล์ตามหน้าชัดเจน  
✅ **ลด Redundancy** - ไม่มี CSS ซ้ำซ้อน  
✅ **Desktop Only** - ไม่มี responsive code สำหรับ mobile/tablet  
✅ **ไม่มี Animations ซ้ำซ้อน** - ลบ animations และ transitions ที่ไม่จำเป็นออก  

## ไฟล์เดิม

- `styles.css` (เดิม 2,372 บรรทัด) → ถูกแทนที่ด้วย:
  - `common.css` (~180 บรรทัด)
  - `index.css` (~220 บรรทัด)
  - `admin.css` (~280 บรรทัด)
  
**ลดขนาดรวมได้ประมาณ 65-70%** เมื่อคำนวณจากการโหลดต่อหน้า

## การเปลี่ยนแปลง

- ❌ ลบ responsive media queries ทั้งหมด (รองรับเฉพาะ desktop)
- ❌ ลบ animations และ keyframes ที่ไม่จำเป็น
- ❌ ลบ transitions และ transform effects ส่วนใหญ่
- ❌ ลบ hover effects ที่ซับซ้อน
- ✅ เก็บเฉพาะ styles พื้นฐานที่จำเป็น
- ✅ เก็บ hover effects แบบง่ายๆ (เปลี่ยนสี, background)
