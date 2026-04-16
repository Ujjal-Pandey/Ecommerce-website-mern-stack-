import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";
import path from "path";

// GET ALL
export const getProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};

// GET SINGLE
export const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.json(product);
};

// CREATE
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, countInStock, image } = req.body;

    let imageUrl = image || ""; // allow direct URL from body

    // Only upload if req.file exists
    if (req.file) {
      const filePath = path.resolve(req.file.path); // resolve path
      try {
        const result = await cloudinary.uploader.upload(filePath, {
          folder: "products",
        });
        imageUrl = result.secure_url;
      } catch (uploadError) {
        console.error("Cloudinary Upload Error:", uploadError);
        return res.status(500).json({ message: "Image upload failed via Cloudinary" });
      } finally {
        // Always try to delete local temp file
        if (fs.existsSync(filePath)) {
          try {
            fs.unlinkSync(filePath);
          } catch (unlinkErr) {
            console.error("Could not delete temp file:", unlinkErr);
          }
        }
      }
    }

    const product = await Product.create({
      name,
      description,
      price,
      countInStock,
      image: imageUrl,
    });

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Failed to create product" });
  }
};

// UPDATE
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let imageUrl = product.image || "";

    if (req.file) {
      const filePath = path.resolve(req.file.path);
      try {
        const result = await cloudinary.uploader.upload(filePath, {
          folder: "products",
        });
        imageUrl = result.secure_url;
      } catch (uploadError) {
        console.error("Cloudinary Upload Error:", uploadError);
        return res.status(500).json({ message: "Image upload failed via Cloudinary" });
      } finally {
        if (fs.existsSync(filePath)) {
          try {
            fs.unlinkSync(filePath);
          } catch (unlinkErr) {
            console.error("Could not delete temp file:", unlinkErr);
          }
        }
      }
    }

    product.name = req.body.name || product.name;
    product.description = req.body.description !== undefined ? req.body.description : product.description;
    product.price = req.body.price || product.price;
    product.countInStock = req.body.countInStock !== undefined ? req.body.countInStock : product.countInStock;
    product.image = imageUrl;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Failed to update product" });
  }
};

// DELETE
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: "Product removed" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete product" });
  }
};

