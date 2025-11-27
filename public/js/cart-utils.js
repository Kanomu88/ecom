// Cart Utilities - จัดการตะกร้าสินค้าด้วย localStorage

const CART_KEY = 'pinkory_cart';

// ดึงข้อมูลตะกร้าจาก localStorage
function getCart() {
    try {
        const cart = localStorage.getItem(CART_KEY);
        return cart ? JSON.parse(cart) : [];
    } catch (error) {
        console.error('Error getting cart:', error);
        return [];
    }
}

// บันทึกตะกร้าลง localStorage
function saveCart(cart) {
    try {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
        updateCartBadge();
        // Trigger storage event สำหรับ sync ระหว่าง tabs
        window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
        console.error('Error saving cart:', error);
        if (error.name === 'QuotaExceededError') {
            alert('ตะกร้าสินค้าเต็ม กรุณาลบสินค้าบางรายการ');
        }
    }
}

// เพิ่มสินค้าลงตะกร้า
function addToCart(product) {
    const cart = getCart();
    
    // ตรวจสอบว่ามีสินค้านี้ในตะกร้าแล้วหรือไม่
    const existingItem = cart.find(item => item.productId === product.productId);
    
    if (existingItem) {
        // เพิ่มจำนวน
        existingItem.quantity += product.quantity || 1;
    } else {
        // เพิ่มสินค้าใหม่
        cart.push({
            productId: product.productId,
            name: product.name,
            price: product.price,
            quantity: product.quantity || 1,
            imageUrl: product.imageUrl || '',
            brand: product.brand || ''
        });
    }
    
    saveCart(cart);
    return true;
}

// ลบสินค้าออกจากตะกร้า
function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.productId !== productId);
    saveCart(cart);
}

// อัพเดทจำนวนสินค้า
function updateQuantity(productId, quantity) {
    const cart = getCart();
    const item = cart.find(item => item.productId === productId);
    
    if (item) {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = quantity;
            saveCart(cart);
        }
    }
}

// ล้างตะกร้า
function clearCart() {
    localStorage.removeItem(CART_KEY);
    updateCartBadge();
    window.dispatchEvent(new Event('cartUpdated'));
}

// คำนวณราคารวม
function calculateTotal() {
    const cart = getCart();
    return cart.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);
}

// นับจำนวนสินค้าทั้งหมด
function getCartCount() {
    const cart = getCart();
    return cart.reduce((count, item) => count + item.quantity, 0);
}

// อัพเดท cart badge
function updateCartBadge() {
    const badge = document.getElementById('cart-badge');
    if (badge) {
        const count = getCartCount();
        badge.textContent = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
    }
}

// แสดง animation เมื่อเพิ่มสินค้า
function showAddToCartAnimation() {
    // สร้าง toast notification
    const toast = document.createElement('div');
    toast.className = 'cart-toast';
    toast.innerHTML = '✓ เพิ่มสินค้าลงตะกร้าแล้ว';
    toast.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        font-weight: 600;
    `;
    
    document.body.appendChild(toast);
    
    // ลบหลัง 2 วินาที
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

// Listen to storage events (สำหรับ sync ระหว่าง tabs)
window.addEventListener('storage', (e) => {
    if (e.key === CART_KEY) {
        updateCartBadge();
    }
});

// อัพเดท badge เมื่อโหลดหน้า
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateCartBadge);
} else {
    updateCartBadge();
}
