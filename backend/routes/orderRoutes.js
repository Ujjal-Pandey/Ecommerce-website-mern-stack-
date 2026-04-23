import express from "express";
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,        // ← Add this
  updateOrderStatus,
  updatePaymentStatus,
  cancelOrder,         // ← Optional: add cancel order
} from "../controllers/orderController.js";

import protect, { admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create order (authenticated users)
router.post("/", protect, createOrder);

// Get logged-in user's orders (authenticated users)
router.get("/myorders", protect, getMyOrders);

// Get single order by ID
router.get("/:id", protect, getOrderById);  // ← Add this route

// Get all orders (Admin only)
router.get("/admin/all", protect, admin, getAllOrders);

// Update order status (Admin only)
router.put("/:id/status", protect, admin, updateOrderStatus);

// Update payment status (after payment verification)
router.put("/:id/payment-status", updatePaymentStatus);

// Cancel order (User or Admin)
router.put("/:id/cancel", protect, cancelOrder);  // ← Optional

export default router;