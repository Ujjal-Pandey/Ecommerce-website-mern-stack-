import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import productService from "../../services/productService";
import { ArrowLeft, ShoppingCart, CreditCard, AlertCircle, Minus, Plus, CheckCircle } from 'lucide-react';

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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
    </div>
  );

  if (error || !product) return (
    <div className="text-center py-32 bg-gradient-to-br from-amber-50 to-orange-50 min-h-screen flex items-center justify-center">
      <div>
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-black text-gray-900 mb-2">Product Not Found</h2>
        <p className="text-gray-600 mb-6">{error || "The product you're looking for doesn't exist."}</p>
        <Link to="/products" className="text-amber-600 font-bold hover:text-amber-700 flex items-center justify-center gap-2 transition-colors">
          <ArrowLeft className="w-4 h-4"/> Back to Products
        </Link>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-8 font-medium">
        <Link to="/" className="hover:text-amber-600 transition-colors">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-amber-600 transition-colors">Products</Link>
        <span>/</span>
        <span className="text-gray-900 font-bold">{product.name}</span>
      </div>

      {/* Product Section */}
      <div className="bg-white rounded-3xl shadow-lg border-2 border-amber-100 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Image */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center p-8 lg:p-12 lg:border-r-2 border-amber-200">
            {product.image ? (
              <img src={product.image} alt={product.name} className="w-full max-w-md h-auto object-contain rounded-2xl shadow-xl hover:scale-105 transition-transform duration-500" />
            ) : (
              <div className="w-64 h-64 bg-gray-300 rounded-2xl flex items-center justify-center text-gray-500 font-bold">No Image</div>
            )}
          </div>

          {/* Details */}
          <div className="p-8 lg:p-12 flex flex-col justify-between bg-white">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-amber-700 mb-2 block bg-amber-100 w-fit px-3 py-1 rounded-full">{product.category || 'Premium Footwear'}</span>
              <h1 className="text-4xl font-black text-gray-900 leading-tight mb-4">{product.name}</h1>
              <p className="text-3xl font-bold tracking-tight text-amber-600 mb-6">
                Rs. {Number(product.price).toLocaleString("en-IN")}
              </p>
              
              <div className="mb-6">
                {product.countInStock > 0 ? (
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-sm font-bold border-2 border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span> In Stock ({product.countInStock} available)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-red-50 text-red-700 text-sm font-bold border-2 border-red-200">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span> Out of Stock
                  </span>
                )}
              </div>
              
              <div className="mb-10">
                <h3 className="text-lg font-bold text-gray-900 mb-3">About this item</h3>
                <p className="text-gray-600 leading-relaxed">{product.description || "Premium footwear product with excellent quality and comfort."}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-6">
                <span className="font-bold text-gray-900">Quantity:</span>
                <div className="flex items-center bg-white border-2 border-amber-200 rounded-xl shadow-md">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                    className="px-4 py-2 hover:bg-amber-50 text-amber-600 font-bold transition-colors"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="px-4 py-2 font-black text-gray-900 w-12 text-center border-x-2 border-amber-200">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(Math.min(product.countInStock, quantity + 1))} 
                    disabled={quantity >= product.countInStock} 
                    className="px-4 py-2 hover:bg-amber-50 text-amber-600 font-bold disabled:opacity-50 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.countInStock === 0}
                  className={`flex-1 py-4 rounded-xl font-bold flex justify-center items-center gap-2 transition-all shadow-md hover:shadow-lg ${
                    addedToCart 
                      ? "bg-emerald-600 text-white" 
                      : product.countInStock === 0 
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                        : "bg-white border-2 border-amber-600 text-amber-600 hover:bg-amber-50 transform hover:-translate-y-1"
                  }`}
                >
                  {addedToCart ? (
                    <>
                      <CheckCircle className="w-5 h-5"/> Added!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5"/> Add to Cart
                    </>
                  )}
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={product.countInStock === 0}
                  className={`flex-1 py-4 rounded-xl font-bold flex justify-center items-center gap-2 transition-all shadow-lg hover:shadow-xl transform ${
                    product.countInStock === 0 
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                      : "bg-gradient-to-r from-amber-600 to-orange-500 text-white hover:from-amber-700 hover:to-orange-600 hover:-translate-y-1"
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
