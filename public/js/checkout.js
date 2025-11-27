// Checkout Page JavaScript

// Check if cart is empty
const cart = getCart();
if (cart.length === 0) {
    alert('ตะกร้าสินค้าว่างเปล่า');
    window.location.href = 'cart.html';
}

// Render order summary
function renderSummary() {
    const summaryItems = document.getElementById('summary-items');
    const summaryTotal = document.getElementById('summary-total');
    
    summaryItems.innerHTML = cart.map(item => {
        const imageUrl = item.imageUrl && item.imageUrl.trim() !== '' 
            ? item.imageUrl 
            : `https://placehold.co/60x60/FFE5EC/8B6B7B?text=${encodeURIComponent(item.name)}`;
        
        return `
        <div class="summary-item">
            <img src="${imageUrl}" 
                 alt="${item.name}" 
                 class="summary-item-image"
                 onerror="this.src='https://placehold.co/60x60/FFE5EC/8B6B7B?text=${encodeURIComponent(item.name)}'">
            <div class="summary-item-details">
                <div class="summary-item-name">${item.name}</div>
                <div class="summary-item-price">฿${item.price.toLocaleString()} x ${item.quantity}</div>
            </div>
        </div>
        `;
    }).join('');
    
    const total = calculateTotal();
    summaryTotal.textContent = `฿${total.toLocaleString()}`;
}

// Validate form
function validateForm(formData) {
    const errors = {};
    
    // Validate firstName
    if (!formData.firstName || formData.firstName.trim().length < 2) {
        errors.firstName = 'กรุณาระบุชื่อ (อย่างน้อย 2 ตัวอักษร)';
    }
    
    // Validate lastName
    if (!formData.lastName || formData.lastName.trim().length < 2) {
        errors.lastName = 'กรุณาระบุนามสกุล (อย่างน้อย 2 ตัวอักษร)';
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
        errors.email = 'รูปแบบอีเมลไม่ถูกต้อง';
    }
    
    // Validate phone
    const phoneRegex = /^[0-9]{10}$/;
    if (!formData.phone || !phoneRegex.test(formData.phone.replace(/[-\s]/g, ''))) {
        errors.phone = 'เบอร์โทรต้องเป็นตัวเลข 10 หลัก';
    }
    
    // Validate address
    if (!formData.address || formData.address.trim().length < 10) {
        errors.address = 'กรุณาระบุที่อยู่ให้ครบถ้วน';
    }
    
    // Validate province
    if (!formData.province || formData.province.trim().length < 2) {
        errors.province = 'กรุณาระบุจังหวัด';
    }
    
    // Validate postalCode
    const postalCodeRegex = /^[0-9]{5}$/;
    if (!formData.postalCode || !postalCodeRegex.test(formData.postalCode)) {
        errors.postalCode = 'รหัสไปรษณีย์ต้องเป็นตัวเลข 5 หลัก';
    }
    
    return errors;
}

// Show validation errors
function showErrors(errors) {
    // Clear all errors first
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    document.querySelectorAll('.form-group').forEach(el => el.classList.remove('error'));
    
    // Show new errors
    Object.keys(errors).forEach(field => {
        const errorEl = document.getElementById(`${field}-error`);
        const formGroup = document.getElementById(field)?.closest('.form-group');
        
        if (errorEl) {
            errorEl.textContent = errors[field];
        }
        if (formGroup) {
            formGroup.classList.add('error');
        }
    });
}

// Handle form submission
document.getElementById('checkout-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        firstName: document.getElementById('firstName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim().replace(/[-\s]/g, ''),
        address: document.getElementById('address').value.trim(),
        province: document.getElementById('province').value.trim(),
        postalCode: document.getElementById('postalCode').value.trim(),
        note: document.getElementById('note').value.trim()
    };
    
    // Validate
    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
        showErrors(errors);
        return;
    }
    
    // Show loading
    document.getElementById('checkout-form').style.display = 'none';
    document.getElementById('loading').style.display = 'block';
    document.getElementById('submit-btn').disabled = true;
    
    try {
        // Debug: Check cart items
        console.log('Cart items:', cart);
        
        // Prepare items with correct structure - ensure productId is valid
        const orderItems = cart.map(item => {
            const productId = item.productId || item.id || item._id;
            console.log('Processing item:', { 
                name: item.name, 
                productId, 
                originalItem: item 
            });
            
            return {
                productId: productId,
                name: item.name,
                price: parseFloat(item.price),
                quantity: parseInt(item.quantity),
                imageUrl: item.imageUrl || ''
            };
        });
        
        // Validate all items have productId
        const invalidItems = orderItems.filter(item => !item.productId);
        if (invalidItems.length > 0) {
            console.error('Invalid items found:', invalidItems);
            throw new Error('ข้อมูลสินค้าไม่ครบถ้วน กรุณาลบสินค้าออกจากตะกร้าและเพิ่มใหม่อีกครั้ง');
        }
        
        // Calculate total amount
        const totalAmount = orderItems.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);
        
        const orderData = {
            customer: {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone
            },
            shippingAddress: {
                address: formData.address,
                province: formData.province,
                postalCode: formData.postalCode,
                note: formData.note || ''
            },
            items: orderItems,
            totalAmount: totalAmount
        };
        
        console.log('Order Data:', orderData);
        console.log('Total Amount:', totalAmount);
        console.log('Order Data JSON:', JSON.stringify(orderData, null, 2));
        
        // Validate totalAmount before sending
        if (!totalAmount || totalAmount <= 0) {
            throw new Error('ยอดรวมไม่ถูกต้อง กรุณาตรวจสอบราคาสินค้า');
        }
        
        // Create order
        const response = await fetch('http://localhost:3000/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });
        
        const data = await response.json();
        
        console.log('Response:', data);
        
        if (response.ok && data.success) {
            // Clear cart after successful order
            clearCart();
            
            // Save order info and customer email to sessionStorage
            sessionStorage.setItem('currentOrder', JSON.stringify(data.data));
            sessionStorage.setItem('customerEmail', formData.email);
            
            // Redirect to payment page
            window.location.href = 'payment.html';
        } else {
            // Show detailed error
            console.error('API Error Response:', data);
            
            let errorMsg = data.message || 'เกิดข้อผิดพลาด';
            
            // แสดง validation errors
            if (data.errors) {
                errorMsg = 'กรุณาตรวจสอบข้อมูล:\n\n';
                Object.keys(data.errors).forEach(key => {
                    errorMsg += `• ${data.errors[key]}\n`;
                });
            }
            
            // แสดงสินค้าที่หมด
            if (data.outOfStockItems && data.outOfStockItems.length > 0) {
                errorMsg += '\n\nสินค้าที่หมดแล้ว:\n';
                data.outOfStockItems.forEach(item => {
                    errorMsg += `• ${item}\n`;
                });
            }
            
            throw new Error(errorMsg);
        }
        
    } catch (error) {
        console.error('Checkout Error:', error);
        
        // Create better error display
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            z-index: 10000;
            max-width: 500px;
            width: 90%;
        `;
        
        errorDiv.innerHTML = `
            <h3 style="color: #F44336; margin-bottom: 15px;">❌ เกิดข้อผิดพลาด</h3>
            <p style="white-space: pre-line; line-height: 1.6; color: #666;">${error.message}</p>
            <div style="margin-top: 20px; display: flex; gap: 10px;">
                <button onclick="this.closest('div').remove()" style="flex: 1; padding: 12px; background: var(--accent-pink); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">ตกลง</button>
                <a href="test-cart.html" style="flex: 1; padding: 12px; background: #666; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; text-decoration: none; text-align: center; display: block;">🔧 Debug</a>
            </div>
        `;
        
        document.body.appendChild(errorDiv);
        
        // Show form again
        document.getElementById('checkout-form').style.display = 'block';
        document.getElementById('loading').style.display = 'none';
        document.getElementById('submit-btn').disabled = false;
    }
});

// Initial render
renderSummary();
