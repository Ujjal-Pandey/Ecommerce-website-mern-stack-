import express from "express";
import { initiatePayment, lookupPayment } from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Initiate payment
router.post("/initiate", protect, initiatePayment);

// Lookup payment status
router.post("/lookup", protect, lookupPayment);

export default router;
