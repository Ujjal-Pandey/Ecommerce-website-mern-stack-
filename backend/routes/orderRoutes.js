import express from "express";
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  updatePaymentStatus,
} from "../controllers/orderController.js";

import protect, { admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create order (authenticated users)
router.post("/", protect, createOrder);

// Get logged-in user's orders (authenticated users)
router.get("/myorders", protect, getMyOrders);

// Get all orders (Admin only)
router.get("/admin/all", protect, admin, getAllOrders);

// Update order status (Admin only)
router.put("/:id/status", protect, admin, updateOrderStatus);

// Update payment status (after payment verification)
router.put("/:id/payment-status", updatePaymentStatus);

export default router;
