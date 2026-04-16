import express from "express";
import { createReview, getReviewsByProduct } from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public – anyone can read reviews
router.get("/", getReviewsByProduct);

// Protected – must be logged in to submit
router.post("/", protect, createReview);

export default router;
