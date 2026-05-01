import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import productService from "../../services/productService";
import { Plus, Edit2, Trash2, Package, Image as ImageIcon, X } from "lucide-react";

const AdminProducts = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [previewImage, setPreviewImage] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    countInStock: "",
    image: null,
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) return;
    loadProducts();
  }, [isAuthenticated, isAdmin]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getAllProducts();
      setProducts(data || []);
    } catch {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      setError("Name and price are required");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const fd = new FormData();
      fd.append("name", formData.name);
      fd.append("price", formData.price);
      fd.append("description", formData.description);
      fd.append("category", formData.category);
      fd.append("countInStock", formData.countInStock || 0);
      if (formData.image) fd.append("image", formData.image);

      if (editingId) {
        await productService.updateProduct(editingId, fd);
        setSuccess("Product updated successfully");
        setEditingId(null);
      } else {
        await productService.createProduct(fd);
        setSuccess("Product added to catalog");
      }

      handleCancel();
      await loadProducts();
    } catch (err) {
      setError(err.message || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      price: product.price,
      description: product.description || "",
      category: product.category || "",
      countInStock: product.countInStock || "",
      image: null,
    });
    setPreviewImage(product.image || null);
    setEditingId(product._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product permanently?")) return;
    setLoading(true);
    try {
      await productService.deleteProduct(id);
      setSuccess("Product removed");
      await loadProducts();
    } catch {
      setError("Failed to delete product");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setPreviewImage(null);
    setFormData({
      name: "",
      price: "",
      description: "",
      category: "",
      countInStock: "",
      image: null,
    });
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-28 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 flex items-center gap-4">
          <div className="p-4 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl shadow-lg">
            <Package className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">
              Manage Inventory
            </h1>
            <p className="text-amber-600 font-semibold tracking-wide text-sm">
              ADMINISTRATION PANEL
            </p>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 text-red-700 rounded-xl font-medium flex items-start gap-3">
            <div className="w-1 h-full bg-red-500 rounded-full"></div>
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-emerald-50 border-2 border-emerald-200 text-emerald-800 rounded-xl font-bold flex items-start gap-3">
            <div className="w-1 h-full bg-emerald-500 rounded-full"></div>
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-lg border-2 border-amber-100 p-6 md:p-7 sticky top-24 max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3 border-b-2 border-amber-100 pb-4">
                <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex-shrink-0">
                  {editingId ? (
                    <Edit2 className="w-5 h-5 text-white" />
                  ) : (
                    <Plus className="w-5 h-5 text-white" />
                  )}
                </div>
                <span className="truncate">{editingId ? "Edit Product" : "Add New Product"}</span>
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 md:py-3 text-sm border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none bg-gray-50 focus:bg-white transition-all"
                    placeholder="Enter product name"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                      Price (Rs.) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      step="0.01"
                      className="w-full px-4 py-2.5 md:py-3 text-sm border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none bg-gray-50 focus:bg-white transition-all"
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                      Stock <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="countInStock"
                      value={formData.countInStock}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 md:py-3 text-sm border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none bg-gray-50 focus:bg-white transition-all"
                      placeholder="Qty"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 md:py-3 text-sm border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none bg-gray-50 focus:bg-white transition-all"
                    placeholder="e.g., Electronics, Fashion"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-2.5 md:py-3 text-sm border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none bg-gray-50 focus:bg-white transition-all resize-none"
                    placeholder="Product description..."
                    maxLength="200"
                  />
                  <p className="text-xs text-gray-500 mt-1">{formData.description.length}/200</p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                    Product Image
                  </label>
                  <div className="border-2 border-dashed border-amber-200 rounded-xl p-4 bg-amber-50/30 hover:bg-amber-50 transition-colors">
                    <input
                      type="file"
                      name="image"
                      onChange={handleFileChange}
                      accept="image/*"
                      className="w-full text-xs md:text-sm text-gray-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-100 file:text-amber-700 hover:file:bg-amber-200 cursor-pointer"
                    />
                    {previewImage && (
                      <div className="mt-3 relative flex justify-center">
                        <div className="relative">
                          <img 
                            src={previewImage} 
                            alt="Preview" 
                            className="w-24 h-24 md:w-28 md:h-28 object-cover rounded-lg border-2 border-amber-200"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setPreviewImage(null);
                              setFormData(prev => ({ ...prev, image: null }));
                            }}
                            className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition shadow-lg"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 pt-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-700 hover:to-orange-600 text-white font-bold py-2.5 md:py-3 px-4 rounded-xl transition-all duration-200 disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-xs md:text-sm uppercase tracking-wide"
                  >
                    {loading ? "Saving..." : editingId ? "Update" : "Add Product"}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="flex-1 bg-white border-2 border-gray-300 text-gray-700 font-bold py-2.5 md:py-3 px-4 rounded-xl hover:bg-gray-50 transition-all text-xs md:text-sm uppercase tracking-wide"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* List Section */}
          <div className="lg:col-span-2">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 md:gap-4 mb-6">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 truncate">Inventory List</h2>
                <p className="text-gray-600 text-xs md:text-sm mt-1">
                  Total: <span className="font-bold">{products.length}</span>
                </p>
              </div>
              <div className="bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 px-4 py-2 rounded-full text-sm font-bold border-2 border-amber-200 whitespace-nowrap">
                {products.filter(p => p.countInStock > 0).length} In Stock
              </div>
            </div>

            {loading && products.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border-2 border-amber-100">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-300 border-t-amber-600 mx-auto"></div>
                <p className="text-gray-600 mt-4">Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border-2 border-amber-100">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 font-medium text-lg">No products yet</p>
                <p className="text-gray-400 text-sm mt-2">Create your first product using the form</p>
              </div>
            ) : (
              <div className="space-y-3 md:space-y-4">
                {products.map((product) => (
                  <div
                    key={product._id}
                    className="bg-white rounded-2xl shadow-md hover:shadow-lg border-2 border-amber-100 p-4 md:p-5 hover:border-amber-200 transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start gap-3 md:gap-4">
                      {/* Product Image */}
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl overflow-hidden shrink-0 border-2 border-amber-200">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="w-6 md:w-8 h-6 md:h-8 text-amber-400" />
                          </div>
                        )}
                      </div>
                      
                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-base md:text-lg line-clamp-1 break-words">
                          {product.name}
                        </h3>
                        <p className="text-xl md:text-2xl font-black text-amber-600 mt-1">
                          Rs. {Number(product.price).toLocaleString("en-IN")}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          {product.category && (
                            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-lg font-semibold whitespace-nowrap">
                              {product.category}
                            </span>
                          )}
                          <span
                            className={`text-xs px-2 py-1 rounded-lg font-bold whitespace-nowrap ${
                              product.countInStock > 0 
                                ? "bg-emerald-100 text-emerald-700" 
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            Stock: {product.countInStock || 0}
                          </span>
                          {product.countInStock <= 5 && product.countInStock > 0 && (
                            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-lg font-semibold animate-pulse">
                              Low Stock
                            </span>
                          )}
                        </div>
                        {product.description && (
                          <p className="text-gray-500 text-xs md:text-sm mt-2 line-clamp-1 break-words">
                            {product.description}
                          </p>
                        )}
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-2 sm:flex-col lg:flex-row flex-shrink-0">
                        <button
                          onClick={() => handleEdit(product)}
                          className="flex-1 sm:flex-none p-2.5 md:p-3 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-100 transition-all duration-200 flex items-center justify-center gap-2 group"
                          title="Edit Product"
                        >
                          <Edit2 className="w-4 md:w-5 h-4 md:h-5 group-hover:scale-110 transition" />
                          <span className="hidden lg:inline text-xs md:text-sm font-bold">Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="flex-1 sm:flex-none p-2.5 md:p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all duration-200 flex items-center justify-center gap-2 group"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 md:w-5 h-4 md:h-5 group-hover:scale-110 transition" />
                          <span className="hidden lg:inline text-xs md:text-sm font-bold">Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;