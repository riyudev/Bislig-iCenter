import express from "express";
import {
  getCart,
  addToCart,
  removeOneFromCart,
  removeFromCart,
  toggleItemCheck,
  toggleAllChecks,
  clearCart,
  clearCheckedItems,
} from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All cart routes require authentication
router.use(protect);

router.get("/", getCart);
router.post("/add", addToCart);
router.post("/remove-one", removeOneFromCart);
router.post("/remove", removeFromCart);
router.post("/toggle-check", toggleItemCheck);
router.post("/toggle-all-checks", toggleAllChecks);
router.post("/clear", clearCart);
router.post("/clear-checked", clearCheckedItems);

export default router;
