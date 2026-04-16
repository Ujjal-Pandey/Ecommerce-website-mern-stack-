import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingBag } from 'lucide-react';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <Link to={`/product/${product._id || product.id}`} className="group block h-full">
      <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500 border border-slate-100 flex flex-col relative overflow-hidden group-hover:-translate-y-2 h-full">
        
        {/* Dynamic Edge-to-Edge Image Section */}
        <div className="w-full h-56 bg-slate-50 overflow-hidden relative">
          {/* Subtle overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-slate-400 font-bold tracking-widest uppercase text-xs">No Image</span>
            </div>
          )}
          
          {/* Status Badges */}
          <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
            {product.countInStock === 0 ? (
              <span className="bg-white/90 backdrop-blur-md text-slate-800 text-[10px] font-black uppercase px-3 py-1.5 rounded-full shadow-sm">
                Sold Out
              </span>
            ) : product.countInStock <= 5 ? (
              <span className="bg-rose-500/90 backdrop-blur-md text-white text-[10px] font-black uppercase px-3 py-1.5 rounded-full shadow-sm animate-pulse">
                Only {product.countInStock} Left
              </span>
            ) : null}
          </div>
        </div>

        {/* Product Info Section */}
        <div className="p-6 flex-1 flex flex-col bg-white relative z-20">
          <div className="flex-1">
            <h3 className="font-extrabold text-slate-900 line-clamp-1 text-xl group-hover:text-indigo-600 transition-colors duration-300 mb-2">
              {product.name}
            </h3>
            <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed font-medium">
              {product.description}
            </p>
          </div>

          <div className="mt-6 flex items-end justify-between items-center pb-2">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Price</span>
              <span className="font-black text-2xl text-slate-900 tracking-tight">
                Rs. {Number(product.price).toLocaleString('en-IN')}
              </span>
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
                ? 'bg-slate-50 text-slate-400 cursor-not-allowed border border-slate-100'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-[0_8px_20px_rgb(79,70,229,0.3)] hover:-translate-y-0.5'
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