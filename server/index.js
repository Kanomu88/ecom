require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const backendRoutes = require('./back');

const app = express();

connectDB();

app.use(cors({
  origin: '*'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.use('/api', backendRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'เกิดข้อผิดพลาด'
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🔌 API: http://localhost:${PORT}/api`);
});
