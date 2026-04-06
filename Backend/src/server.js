import express from "express";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import heroSlideRoutes from "./routes/heroSlideRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import newsletterRoutes from "./routes/newsletterRoutes.js";
import User from "./models/User.js";

dotenv.config();

const app = express();

const isProduction = process.env.NODE_ENV === "production";
const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const allowedOrigins = [
  clientUrl,
  process.env.CLIENT_URL,
  process.env.ADMIN_URL,
  "http://localhost:5173",
  "http://localhost:5174",
];

// Serve uploaded images — before cors so images are never blocked
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/hero-slides", heroSlideRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/newsletter", newsletterRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  res.status(status).json({
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;

connectDB()
  .then(async () => {
    // Auto-seed admin user based on environment variables
    try {
      const email = process.env.ADMIN_EMAIL || "admin@example.com";
      const username = (process.env.ADMIN_USERNAME || "admin").trim().toLowerCase();
      const password = process.env.ADMIN_PASSWORD || "admin123";

      let admin = await User.findOne({ username }).select("+password");
      if (!admin) {
        admin = await User.findOne({ email }).select("+password");
      }

      if (!admin) {
        admin = new User({
          name: "Admin",
          username,
          email,
          password,
          role: "admin",
        });
        await admin.save();
        console.log(`Auto-created admin user: ${username}`);
      } else {
        // Ensure admin has the correct env credentials in case they changed
        let needsUpdate = false;
        if (admin.role !== "admin") {
          admin.role = "admin";
          needsUpdate = true;
        }
        
        const isMatch = await admin.matchPassword(password);
        if (!isMatch) {
          admin.password = password;
          needsUpdate = true;
        }

        if (needsUpdate) {
          await admin.save();
          console.log(`Updated existing admin credentials for: ${username}`);
        }
      }
    } catch (err) {
      console.error("Failed to auto-seed admin user:", err);
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to database", err);
    process.exit(1);
  });
