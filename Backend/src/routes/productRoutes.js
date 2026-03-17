import express from "express";
import {
  getProducts,
  getProductById,
} from "../controllers/adminProductController.js";

const router = express.Router();

// Public product listing – only active products
router.get("/", (req, res, next) => {
  // Force status=active so the controller filters by isActive
  if (!req.query.status) {
    req.query.status = "active";
  }
  return getProducts(req, res, next);
});

// Public single-product endpoint
router.get("/:id", getProductById);

export default router;

