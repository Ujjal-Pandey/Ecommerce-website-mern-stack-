import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import orderService from '../../services/orderService';
import { ShoppingCart, ShoppingBag, ArrowRight, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';

const Cart = () => {
  const { cartItems, removeFromCart, getCartTotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [error, setError] = useState(null);

  const formatPrice = (price) => `Rs. ${Number(price).toLocaleString('en-IN')}`;

  const handleCheckout = async () => {
    if (!isAuthenticated) return navigate('/login');
    if (cartItems.length === 0) return;

    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="py-32 px-4 text-center">
        <div className="w-32 h-32 bg-slate-50 border-2 border-dashed border-slate-200 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-400">
           <ShoppingBag className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Your cart is empty</h2>
        <p className="text-lg font-medium text-slate-500 mb-8 max-w-md mx-auto">Start filling it up with some amazing products from our catalog.</p>
        <Link to="/products" className="inline-flex justify-center items-center gap-2 px-8 py-4 border border-transparent text-base font-bold rounded-xl text-white bg-primary-600 hover:bg-primary-500 transition-colors shadow-md">
           Start Shopping <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  const subtotal = getCartTotal();
  const shipping = subtotal > 500 ? 0 : 50;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
      <div className="flex items-center gap-3 mb-10">
        <ShoppingCart className="w-10 h-10 text-primary-600" />
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Shopping Bag</h1>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-10">
        <div className="lg:w-2/3 space-y-6">
          {error && <div className="p-4 flex items-center gap-2 bg-red-50 text-red-700 rounded-xl mb-6 font-bold border border-red-200"><AlertCircle className="w-5 h-5"/>{error}</div>}
          
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 sm:p-8">
              {cartItems.map((item) => (
                <div key={item._id || item.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-6 border-b border-slate-100 last:border-0 last:pb-0 mb-6 last:mb-0">
                  <div className="w-24 h-24 bg-slate-50 rounded-2xl shrink-0 overflow-hidden border border-slate-100">
                    {item.image ? (
                      <img src={item.image} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><ShoppingBag className="w-6 h-6 text-slate-400"/></div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-slate-900 line-clamp-1">{item.name}</h3>
                    <p className="text-xs uppercase tracking-wider font-bold text-slate-500 mb-2">{item.category || 'General'}</p>
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-black text-slate-900">{formatPrice(item.price)}</span>
                      <span className="text-sm font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">Qty: {item.quantity}</span>
                    </div>
                  </div>
                  
                  <button onClick={() => removeFromCart(item._id || item.id)} className="w-full sm:w-auto text-red-500 hover:text-red-700 font-bold text-sm flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 px-4 py-3 rounded-xl transition-colors">
                     <Trash2 className="w-4 h-4"/> Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="lg:w-1/3">
          <div className="bg-white text-slate-900 rounded-3xl shadow-sm border border-slate-200 p-8 sticky top-24">
            <h2 className="text-2xl font-bold mb-6 border-b border-slate-100 pb-4">Summary</h2>
            <div className="space-y-4 mb-8 text-sm font-medium border-b border-slate-100 pb-8">
              <div className="flex justify-between text-slate-600"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between text-slate-600"><span>Shipping</span><span className={shipping === 0 ? 'text-emerald-600 font-bold' : ''}>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span></div>
              <div className="flex justify-between text-slate-600"><span>Tax (10%)</span><span>{formatPrice(tax)}</span></div>
            </div>

            <div className="flex justify-between text-xl font-black mb-8 text-slate-900"><span>Total:</span><span>{formatPrice(total)}</span></div>

            {subtotal > 500 && (
              <div className="bg-emerald-500/20 text-emerald-100 px-4 py-3 rounded-lg text-xs font-bold mb-6 border border-emerald-500/30 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" /> Free shipping activated!
              </div>
            )}

            <button onClick={handleCheckout} disabled={false} className="w-full py-4 px-6 rounded-xl text-base font-bold bg-primary-600 hover:bg-primary-500 shadow-lg transition-all flex items-center justify-center gap-2 hover:-translate-y-1">
              Proceed to Checkout <ArrowRight className="w-5 h-5"/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
