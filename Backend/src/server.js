import express from "express";

import dotenv from "dotenv";

import cors from "cors";

import cookieParser from "cookie-parser";

import morgan from "morgan";

import { connectDB } from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";

import cartRoutes from "./routes/cartRoutes.js";

import adminRoutes from "./routes/adminRoutes.js";



dotenv.config();



const app = express();



const isProduction = process.env.NODE_ENV === "production";

const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";



app.use(morgan("dev"));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(

  cors({

    origin: clientUrl,

    credentials: true,

  })

);



app.use("/api/auth", authRoutes);

app.use("/api/cart", cartRoutes);

app.use("/api/admin", adminRoutes);



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

  .then(() => {

    app.listen(PORT, () => {

      console.log(`Server running on port ${PORT}`);

    });

  })

  .catch((err) => {

    console.error("Failed to connect to database", err);

    process.exit(1);

  });

