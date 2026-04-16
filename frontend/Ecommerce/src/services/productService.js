import api from "./api";

const productService = {
  // Fetch all products
  async getAllProducts() {
    try {
      const res = await api.get("/products");
      return res.data || [];
    } catch {
      throw new Error("Failed to fetch products");
    }
  },

  // Fetch a single product by ID
  async getProductById(id) {
    try {
      const res = await api.get(`/products/${id}`);
      return res.data;
    } catch (error) {
      const msg =
        error.response?.data?.message || "Failed to fetch product details";
      throw new Error(msg);
    }
  },

  // Create product (Admin only, with image upload)
  async createProduct(productData, config = {}) {
    try {
      const res = await api.post("/products", productData, config);
      return res.data;
    } catch (error) {
      throw error.response
        ? error.response.data
        : new Error("Failed to create product");
    }
  },

  // Update product (Admin only, with image upload)
  async updateProduct(id, productData, config = {}) {
    try {
      const res = await api.put(`/products/${id}`, productData, config);
      return res.data;
    } catch (error) {
      throw error.response
        ? error.response.data
        : new Error("Failed to update product");
    }
  },

  // Delete product (Admin only)
  async deleteProduct(id) {
    try {
      const res = await api.delete(`/products/${id}`);
      return res.data;
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete product";
      throw new Error(msg);
    }
  },
};

export default productService;
