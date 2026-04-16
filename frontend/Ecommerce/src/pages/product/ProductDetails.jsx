import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import productService from "../../services/productService";
import { ArrowLeft, ShoppingCart, CreditCard, AlertCircle } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productService.getProductById(id);
        setProduct(data);
        setError("");
      } catch (err) {
        setError(err.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addToCart(product);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/cart");
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
    </div>
  );

  if (error || !product) return (
    <div className="text-center py-32">
      <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
      <h2 className="text-2xl font-black text-slate-800 mb-2">Product Not Found</h2>
      <p className="text-slate-600 mb-6">{error || "The product you're looking for doesn't exist."}</p>
      <Link to="/products" className="text-primary-600 font-bold hover:underline flex items-center justify-center gap-2">
         <ArrowLeft className="w-4 h-4"/> Back to Products
      </Link>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-slate-500 mb-8 font-medium">
        <Link to="/" className="hover:text-primary-600">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-primary-600">Products</Link>
        <span>/</span>
        <span className="text-slate-900">{product.name}</span>
      </div>

      {/* Product Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Image */}
          <div className="bg-slate-50 flex items-center justify-center p-8 lg:p-12 lg:border-r border-slate-100">
            {product.image ? (
              <img src={product.image} alt={product.name} className="w-full max-w-md h-auto object-contain rounded-2xl shadow-xl hover:scale-105 transition-transform duration-500" />
            ) : (
              <div className="w-64 h-64 bg-slate-200 rounded-2xl flex items-center justify-center text-slate-400">No Image</div>
            )}
          </div>

          {/* Details */}
          <div className="p-8 lg:p-12 flex flex-col justify-between">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-primary-600 mb-2 block">{product.category || 'Product'}</span>
              <h1 className="text-4xl font-black text-slate-900 leading-tight mb-4">{product.name}</h1>
              <p className="text-3xl font-bold tracking-tight text-slate-900 mb-6">
                 Rs. {Number(product.price).toLocaleString("en-IN")}
              </p>
              
              <div className="mb-6">
                {product.countInStock > 0 ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-bold border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span> In Stock ({product.countInStock} available)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-sm font-bold border border-red-200">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span> Out of Stock
                  </span>
                )}
              </div>
              
              <div className="prose prose-slate max-w-none mb-10">
                <h3 className="text-lg font-bold">About this item</h3>
                <p className="text-slate-600 leading-relaxed">{product.description || "No description available."}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-6">
                <span className="font-bold text-slate-700">Quantity:</span>
                <div className="flex items-center bg-white border border-slate-200 rounded-lg shadow-sm">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2 hover:bg-slate-50 rounded-l-lg text-slate-600 font-bold transition-colors">−</button>
                  <span className="px-4 py-2 font-black text-slate-900 w-12 text-center border-x border-slate-200">{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(product.countInStock, quantity + 1))} disabled={quantity >= product.countInStock} className="px-4 py-2 hover:bg-slate-50 rounded-r-lg text-slate-600 font-bold disabled:opacity-50 transition-colors">+</button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.countInStock === 0}
                  className={`flex-1 py-4 rounded-xl font-bold flex justify-center items-center gap-2 transition-all shadow-sm hover:shadow ${
                    addedToCart ? "bg-emerald-600 text-white" : product.countInStock === 0 ? "bg-slate-200 text-slate-400 cursor-not-allowed" : "bg-white border-2 border-primary-600 text-primary-600 hover:bg-primary-50"
                  }`}
                >
                  <ShoppingCart className="w-5 h-5"/> {addedToCart ? "Added!" : "Add to Cart"}
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={product.countInStock === 0}
                  className={`flex-1 py-4 rounded-xl font-bold flex justify-center items-center gap-2 transition-all shadow-md hover:shadow-lg ${
                    product.countInStock === 0 ? "bg-slate-300 text-slate-500 cursor-not-allowed" : "bg-primary-600 text-white hover:bg-primary-500 hover:-translate-y-0.5"
                  }`}
                >
                   <CreditCard className="w-5 h-5"/> Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
