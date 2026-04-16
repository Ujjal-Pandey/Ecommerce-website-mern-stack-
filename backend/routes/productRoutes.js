import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js"; // multer

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);

// with image upload
router.post("/", protect, admin, upload.single("image"), createProduct); //upload.single("image") it will look for a file in the request with the name "image" and process it using multer. The processed file will then be available in req.file for further handling in the createProduct controller.
router.put("/:id", protect, admin, upload.single("image"), updateProduct);

router.delete("/:id", protect, admin, deleteProduct);

export default router;