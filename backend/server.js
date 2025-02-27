const express = require('express');
const session = require("express-session");
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/adminRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const variantRoutes = require('./routes/variantRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cartRoutes = require('./routes/cartRoutes');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');
const path = require('path');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ✅ Enable CORS Middleware
app.use(cors({
    origin: "http://localhost:5173", // Allow requests from frontend
    credentials: true, // Allow cookies/auth headers
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
}));

// ✅ Initialize session middleware
app.use(session({
  secret: process.env.REFRESH_TOKEN_SECRET, // Change this to a strong secret
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set `true` if using HTTPS
}));

// ✅ Serve static files from the 'uploads' folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Middleware
app.use(express.json({ extended: false }));

// Increase the request size limit
app.use(express.json({ limit: "50mb" })); 
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes); // FIXED: Correct API route
app.use('/api', categoryRoutes);
app.use('/api', variantRoutes);
app.use('/api/orders', orderRoutes); // FIXED: Correct API route
app.use('/api/cart', cartRoutes); // FIXED: Correct API route
app.use('/api/users', userRoutes); // FIXED: Correct API route

// ✅ Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
