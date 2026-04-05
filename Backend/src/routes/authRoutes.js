import express from "express";

import { register, login, adminLogin, logout, getMe, updateProfile, sendOtp, forgotPassword, resetPassword } from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";



const router = express.Router();



router.post("/send-otp", sendOtp);

router.post("/register", register);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);

router.post("/login", login);

router.post("/admin-login", adminLogin);

router.post("/logout", logout);

router.get("/me", protect, getMe);

router.put("/update-profile", protect, updateProfile);



export default router;

