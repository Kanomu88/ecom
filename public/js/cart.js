// Cart Page JavaScript

// Render cart items
function renderCart() {
    const cart = getCart();
    const emptyCart = document.getElementById('empty-cart');
    const cartContent = document.getElementById('cart-content');
    const cartItems = document.getElementById('cart-items');
    const cartCountText = document.getElementById('cart-count-text');

    if (cart.length === 0) {
        emptyCart.style.display = 'block';
        cartContent.style.display = 'none';
        cartCountText.textContent = '';
        return;
    }

    emptyCart.style.display = 'none';
    cartContent.style.display = 'grid';

    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountText.textContent = `${itemCount} รายการ`;

    // Render items
    cartItems.innerHTML = cart.map(item => {
        const imageUrl = item.imageUrl && item.imageUrl.trim() !== ''
            ? item.imageUrl
            : `https://placehold.co/100x100/FFE5EC/8B6B7B?text=${encodeURIComponent(item.name)}`;

        return `
        <div class="cart-item" data-product-id="${item.productId}">
            <img src="${imageUrl}" 
                 alt="${item.name}" 
                 class="cart-item-image"
                 onerror="this.src='https://placehold.co/100x100/FFE5EC/8B6B7B?text=${encodeURIComponent(item.name)}'">
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-brand">${item.brand}</div>
                <div class="cart-item-price">฿${item.price.toLocaleString()} x ${item.quantity} = ฿${(item.price * item.quantity).toLocaleString()}</div>
            </div>
            <div class="cart-item-actions">
                <div class="quantity-control">
                    <button class="quantity-btn" onclick="decreaseQuantity('${item.productId}')">-</button>
                    <input type="number" 
                           class="quantity-input" 
                           value="${item.quantity}" 
                           min="1" 
                           onchange="changeQuantity('${item.productId}', this.value)"
                           readonly>
                    <button class="quantity-btn" onclick="increaseQuantity('${item.productId}')">+</button>
                </div>
                <button class="remove-btn" onclick="confirmRemove('${item.productId}', '${item.name}')">
                    🗑️ ลบ
                </button>
            </div>
        </div>
        `;
    }).join('');

    updateSummary();
}

// Update summary
function updateSummary() {
    const cart = getCart();
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const total = calculateTotal();

    document.getElementById('summary-count').textContent = `${itemCount} รายการ`;
    document.getElementById('summary-total').textContent = `฿${total.toLocaleString()}`;
}

// Increase quantity
function increaseQuantity(productId) {
    const cart = getCart();
    const item = cart.find(i => i.productId === productId);
    if (item) {
        updateQuantity(productId, item.quantity + 1);
        renderCart();
    }
}

// Decrease quantity
function decreaseQuantity(productId) {
    const cart = getCart();
    const item = cart.find(i => i.productId === productId);
    if (item && item.quantity > 1) {
        updateQuantity(productId, item.quantity - 1);
        renderCart();
    }
}

// Change quantity
function changeQuantity(productId, newQuantity) {
    const quantity = parseInt(newQuantity);
    if (quantity > 0) {
        updateQuantity(productId, quantity);
        renderCart();
    }
}

// Confirm remove
function confirmRemove(productId, productName) {
    if (confirm(`ต้องการลบ "${productName}" ออกจากตะกร้าหรือไม่?`)) {
        removeFromCart(productId);
        renderCart();

        // Show notification
        const toast = document.createElement('div');
        toast.className = 'cart-toast';
        toast.innerHTML = '✓ ลบสินค้าออกจากตะกร้าแล้ว';
        toast.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: #F44336;
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
            font-weight: 600;
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }
}

// Listen to cart updates
window.addEventListener('cartUpdated', renderCart);

// Initial render
renderCart();
