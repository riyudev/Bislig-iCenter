import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { adminProtect } from "../middleware/authMiddleware.js";
import { requireAdmin } from "../middleware/adminMiddleware.js";
import * as productController from "../controllers/adminProductController.js";
import * as orderController from "../controllers/adminOrderController.js";
import * as userController from "../controllers/adminUserController.js";

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const safeName = file.originalname.replace(/\s+/g, "-");
    cb(null, `${unique}-${safeName}`);
  },
});

const upload = multer({ storage });

router.use(adminProtect);
router.use(requireAdmin);

router.get("/dashboard/stats", orderController.getDashboardStats);

// Upload product image
router.post("/products/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  const urlPath = `/uploads/${req.file.filename}`;
  res.status(201).json({ url: urlPath });
});

router.get("/products", productController.getProducts);
router.get("/products/low-stock", productController.getLowStockProducts);
router.get("/products/:id", productController.getProductById);
router.post("/products", productController.createProduct);
router.put("/products/:id", productController.updateProduct);
router.delete("/products/:id", productController.deleteProduct);
router.post("/products/:id/adjust-stock", productController.adjustStock);

router.get("/orders", orderController.getOrders);
router.get("/orders/:id", orderController.getOrderById);
router.post("/orders", orderController.createOrder);
router.put("/orders/:id/status", orderController.updateOrderStatus);
router.post("/orders/:id/cancel", orderController.cancelOrder);

router.get("/users", userController.getUsers);
router.get("/users/:id", userController.getUserById);
router.put("/users/:id", userController.updateUser);
router.delete("/users/:id", userController.deleteUser);

export default router;
