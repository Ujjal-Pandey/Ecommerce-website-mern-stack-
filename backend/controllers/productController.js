import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";
import path from "path";

// Validation helper functions
const validateProductInput = (name, description, price, countInStock) => {
  const errors = {};

  if (!name || name.trim().length === 0) {
    errors.name = "Product name is required";
  } else if (name.trim().length < 3) {
    errors.name = "Product name must be at least 3 characters";
  } else if (name.trim().length > 100) {
    errors.name = "Product name must not exceed 100 characters";
  }

  if (!description || description.trim().length === 0) {
    errors.description = "Product description is required";
  } else if (description.trim().length < 10) {
    errors.description = "Description must be at least 10 characters";
  } else if (description.trim().length > 1000) {
    errors.description = "Description must not exceed 1000 characters";
  }

  if (price === undefined || price === null) {
    errors.price = "Product price is required";
  } else if (isNaN(price) || Number(price) < 0) {
    errors.price = "Price must be a valid positive number";
  } else if (Number(price) > 1000000) {
    errors.price = "Price is too high";
  }

  if (countInStock === undefined || countInStock === null) {
    errors.countInStock = "Stock count is required";
  } else if (!Number.isInteger(Number(countInStock)) || Number(countInStock) < 0) {
    errors.countInStock = "Stock count must be a non-negative integer";
  } else if (Number(countInStock) > 999999) {
    errors.countInStock = "Stock count is too high";
  }

  return { isValid: Object.keys(errors).length === 0, errors };
};

// GET ALL
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch products" });
  }
};

// GET SINGLE
export const getProductById = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    res.status(500).json({ message: error.message || "Failed to fetch product" });
  }
};

// CREATE
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, countInStock, image } = req.body;

    // Validate input
    const { isValid, errors } = validateProductInput(name, description, price, countInStock);
    if (!isValid) {
      return res.status(400).json({ message: "Validation failed", errors });
    }

    let imageUrl = image || ""; // allow direct URL from body

    // Only upload if req.file exists
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
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      countInStock: Number(countInStock),
      image: imageUrl,
    });

    res.status(201).json({
      ...product.toObject(),
      message: "Product created successfully"
    });
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

    // Validate input - only if provided
    const { name, description, price, countInStock } = req.body;
    const dataToValidate = {
      name: name !== undefined ? name : product.name,
      description: description !== undefined ? description : product.description,
      price: price !== undefined ? price : product.price,
      countInStock: countInStock !== undefined ? countInStock : product.countInStock,
    };

    const { isValid, errors } = validateProductInput(
      dataToValidate.name,
      dataToValidate.description,
      dataToValidate.price,
      dataToValidate.countInStock
    );

    if (!isValid) {
      return res.status(400).json({ message: "Validation failed", errors });
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

    product.name = name ? name.trim() : product.name;
    product.description = description ? description.trim() : product.description;
    product.price = price !== undefined ? Number(price) : product.price;
    product.countInStock = countInStock !== undefined ? Number(countInStock) : product.countInStock;
    product.image = imageUrl;

    const updatedProduct = await product.save();
    res.json({
      ...updatedProduct.toObject(),
      message: "Product updated successfully"
    });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    res.status(500).json({ message: error.message || "Failed to update product" });
  }
};

// DELETE
export const deleteProduct = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ 
      message: "Product removed successfully",
      deletedProduct: product
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    console.error(error);
    res.status(500).json({ message: error.message || "Failed to delete product" });
  }
};

