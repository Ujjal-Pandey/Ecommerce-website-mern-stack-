import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingBag } from 'lucide-react';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <Link to={`/product/${product._id || product.id}`} className="group block h-full">
      <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-500 border border-amber-100 flex flex-col relative overflow-hidden group-hover:-translate-y-2 h-full">
        
        {/* Dynamic Edge-to-Edge Image Section */}
        <div className="w-full h-56 bg-gradient-to-br from-amber-50 to-orange-50 overflow-hidden relative">
          {/* Subtle overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-amber-900/20 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-amber-400 font-bold tracking-widest uppercase text-xs">No Image</span>
            </div>
          )}
          
          {/* Status Badges */}
          <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
            {product.countInStock === 0 ? (
              <span className="bg-white/90 backdrop-blur-md text-amber-800 text-[10px] font-black uppercase px-3 py-1.5 rounded-full shadow-sm">
                Sold Out
              </span>
            ) : product.countInStock <= 5 ? (
              <span className="bg-amber-600/90 backdrop-blur-md text-white text-[10px] font-black uppercase px-3 py-1.5 rounded-full shadow-sm animate-pulse">
                Only {product.countInStock} Left
              </span>
            ) : null}
          </div>
        </div>

        {/* Product Info Section */}
        <div className="p-6 flex-1 flex flex-col bg-white relative z-20">
          <div className="flex-1">
            <h3 className="font-extrabold text-gray-900 line-clamp-1 text-xl group-hover:text-amber-600 transition-colors duration-300 mb-2">
              {product.name}
            </h3>
            <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed font-medium">
              {product.description}
            </p>
          </div>

          <div className="mt-6 flex flex-col pb-2">
            <div className="flex justify-between items-end">
              <div className="flex flex-col">
                <span className="text-[10px] text-amber-600 uppercase font-black tracking-widest mb-1">Price</span>
                <span className="font-black text-2xl text-gray-900 tracking-tight">
                  Rs. {Number(product.price).toLocaleString('en-IN')}
                </span>
              </div>
              
              {/* Stock indicator */}
              {product.countInStock > 0 && product.countInStock <= 10 && (
                <span className="text-xs text-amber-600 font-semibold bg-amber-50 px-2 py-1 rounded-lg">
                  In Stock: {product.countInStock}
                </span>
              )}
            </div>
          </div>
          
          {/* Add to Cart Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              addToCart(product);
            }}
            disabled={product.countInStock === 0}
            className={`mt-5 w-full py-3.5 rounded-2xl font-bold uppercase text-xs tracking-wider transition-all duration-300 flex items-center justify-center gap-2 shadow-sm ${
              product.countInStock === 0
                ? 'bg-gray-50 text-gray-400 cursor-not-allowed border border-gray-100'
                : 'bg-gradient-to-r from-amber-600 to-orange-500 text-white hover:from-amber-700 hover:to-orange-600 hover:shadow-[0_8px_20px_rgba(245,158,11,0.3)] hover:-translate-y-0.5'
            }`}
          >
            <ShoppingBag className={`w-4 h-4 ${product.countInStock === 0 ? 'opacity-50' : ''}`} />
            {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;