const generatePayload = require('promptpay-qr');
const QRCode = require('qrcode');

/**
 * สร้าง PromptPay QR Code สำหรับชำระเงิน
 * @param {string} phoneNumber - หมายเลขพร้อมเพย์ (เบอร์โทร 10 หลัก)
 * @param {number} amount - จำนวนเงิน
 * @param {string} orderNumber - หมายเลขคำสั่งซื้อ
 * @returns {Promise<string>} QR Code เป็น base64 string
 */
async function generatePromptPayQR(phoneNumber, amount, orderNumber = '') {
    try {
        // สร้าง payload ตาม PromptPay format
        const payload = generatePayload(phoneNumber, { amount });
        
        // สร้าง QR Code เป็น base64
        const qrCodeDataURL = await QRCode.toDataURL(payload, {
            type: 'image/png',
            width: 400,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        });
        
        return qrCodeDataURL;
        
    } catch (error) {
        console.error('Generate PromptPay QR Error:', error);
        throw new Error('ไม่สามารถสร้าง QR Code ได้');
    }
}

/**
 * ตรวจสอบความถูกต้องของหมายเลขพร้อมเพย์
 * @param {string} phoneNumber - หมายเลขโทรศัพท์
 * @returns {boolean}
 */
function validatePromptPayNumber(phoneNumber) {
    // ตรวจสอบว่าเป็นเบอร์โทร 10 หลัก
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phoneNumber);
}

module.exports = {
    generatePromptPayQR,
    validatePromptPayNumber
};
