
const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

// Load environment variables
dotenv.config();
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected toMongoDBcare (Default DB)"))
  .catch((err) => console.error("❌ Main DB error:", err));
// ✅ Route imports
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/adminRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const userRoutes = require("./routes/userRoutes");
const vendorRoutes = require("./routes/vendorRoutes");

const app = express();

// ✅ CORS Setup
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigin = process.env.REACT_APP_CLI_URL.replace(/\/$/, "");
      if (!origin || origin === allowedOrigin) {
        callback(null, true);
      } else {
        callback(new Error("CORS policy violation"));
      }
    },
    credentials: true,
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);
app.use((req, res, next) => {
  console.log("Request Origin:", req.headers.origin);
  next();
});

// ✅ Session & Cookie
app.use(
  session({
    secret: process.env.REFRESH_TOKEN_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
app.use(cookieParser());

// ✅ Body Parsers
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// ✅ Static File Serving
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Routes
app.use("/api/vendor", vendorRoutes);
app.use("/api/auth", authRoutes); // 🔐 Shared Login/Register from bbs-auth
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/users", userRoutes);

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// ✅ Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
