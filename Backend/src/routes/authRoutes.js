import express from "express";
import { rateLimit } from "express-rate-limit";

import { register, login, adminLogin, logout, getMe, updateProfile, sendOtp, forgotPassword, resetPassword } from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";



const router = express.Router();



const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: "Too many OTP requests from this IP, please try again after 15 minutes" },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/send-otp", otpLimiter, sendOtp);

router.post("/register", register);

router.post("/forgot-password", otpLimiter, forgotPassword);

router.post("/reset-password", resetPassword);



const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 login requests per `window` (here, per 15 minutes)
  message: { message: "Too many login attempts, please try again after 15 minutes" },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

router.post("/login", loginLimiter, login);

router.post("/admin-login", loginLimiter, adminLogin);

router.post("/logout", logout);

router.get("/me", protect, getMe);

router.put("/update-profile", protect, updateProfile);



export default router;

