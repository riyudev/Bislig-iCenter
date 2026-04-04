import express from "express";

import { register, login, adminLogin, logout, getMe, updateProfile } from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";



const router = express.Router();



router.post("/register", register);

router.post("/login", login);

router.post("/admin-login", adminLogin);

router.post("/logout", logout);

router.get("/me", protect, getMe);

router.put("/update-profile", protect, updateProfile);



export default router;

