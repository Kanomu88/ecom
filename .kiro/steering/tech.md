# Tech Stack

## Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose ODM)
- **Authentication**: JWT (jsonwebtoken) + bcrypt

## Frontend
- **Type**: Static HTML/CSS/JS (Vanilla)
- **Styling**: Custom CSS with CSS Variables
- **Fonts**: Google Fonts (Playfair Display, Lato)

## Key Libraries
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `jsonwebtoken` - JWT authentication
- `bcrypt` - Password hashing
- `promptpay-qr` + `qrcode` - PromptPay QR generation
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variables

## Development Tools
- `nodemon` - Auto-restart server
- `live-server` - Frontend dev server

## Common Commands

```bash
# Start production server
npm start

# Start development server (with auto-reload)
npm run dev

# Start frontend dev server
npm run client

# Seed database
node server/seed.js
```

## API Base URL
- Backend: `http://localhost:3000/api`
- Frontend: `http://localhost:8080`

## Environment Variables
ดู `.env.example` สำหรับ configuration ที่จำเป็น:
- `PORT`, `MONGODB_URI`, `JWT_SECRET`, `PROMPTPAY_ID`
