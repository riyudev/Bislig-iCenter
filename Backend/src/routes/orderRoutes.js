import express from "express";
import { createOrder, getUserOrders, cancelOrder, confirmReceived } from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/", createOrder);
router.get("/", getUserOrders);
router.put("/:id/cancel", cancelOrder);
router.put("/:id/confirm-received", confirmReceived);

export default router;
