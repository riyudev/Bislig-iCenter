import express from "express";
import { adminProtect } from "../middleware/authMiddleware.js";
import { requireAdmin } from "../middleware/adminMiddleware.js";
import * as productController from "../controllers/adminProductController.js";
import * as orderController from "../controllers/adminOrderController.js";
import * as userController from "../controllers/adminUserController.js";

const router = express.Router();

router.use(adminProtect);
router.use(requireAdmin);

router.get("/dashboard/stats", orderController.getDashboardStats);

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
