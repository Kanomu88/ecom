# Project Structure

```
doll-preorder-webapp/
├── server/                 # Backend (Express.js)
│   ├── index.js           # Entry point, Express setup
│   ├── back.js            # API routes (auth, products, orders, admins)
│   ├── token_manager.js   # JWT utilities
│   ├── seed.js            # Database seeder
│   ├── config/
│   │   └── database.js    # MongoDB connection
│   ├── models/
│   │   ├── Admin.js       # Admin schema
│   │   ├── Product.js     # Product schema
│   │   └── Order.js       # Order schema
│   └── services/
│       └── payment.js     # PromptPay QR generation
│
├── public/                 # Frontend (Static)
│   ├── pages/             # HTML pages
│   │   ├── index.html     # Homepage
│   │   ├── search.html    # Product search
│   │   ├── product-detail.html
│   │   ├── cart.html      # Shopping cart
│   │   ├── checkout.html  # Checkout form
│   │   ├── payment.html   # Payment (QR)
│   │   ├── order-success.html
│   │   ├── order-track.html
│   │   ├── login.html     # Admin login
│   │   ├── register.html
│   │   ├── team.html      # About us
│   │   └── admin-*.html   # Admin pages
│   ├── css/               # Stylesheets (per-page + common.css)
│   ├── js/                # JavaScript (cart-utils, cart, checkout)
│   └── img/               # Images, videos
│
├── .kiro/                  # Kiro configuration
│   ├── steering/          # Steering rules
│   └── specs/             # Feature specifications
│
└── package.json
```

## Conventions
- แต่ละ HTML page มี CSS file คู่กัน (e.g., `cart.html` → `cart.css`)
- `common.css` มี shared styles, CSS variables, header/footer
- API routes อยู่ใน `server/back.js` แบ่งเป็น sections (AUTH, PRODUCTS, ORDERS, ADMINS)
- Public routes ไม่ต้อง auth: `/api/public/*`
- Protected routes ต้อง JWT: `/api/products`, `/api/admins`, `/api/orders` (admin)
