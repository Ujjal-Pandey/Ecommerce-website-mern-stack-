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
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center py-32 px-4">
        <div className="text-center">
          <div className="w-32 h-32 bg-white border-2 border-amber-200 rounded-full flex items-center justify-center mx-auto mb-8 text-amber-400 shadow-lg">
            <ShoppingBag className="w-12 h-12" />
          </div>
          <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Your cart is empty</h2>
          <p className="text-lg font-medium text-gray-600 mb-8 max-w-md mx-auto">Start filling it up with our premium footwear collection.</p>
          <Link to="/products" className="inline-flex justify-center items-center gap-2 px-8 py-4 border border-transparent text-base font-bold rounded-xl text-white bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-700 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            Start Shopping <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = getCartTotal();
  const shipping = subtotal > 500 ? 0 : 50;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
        <div className="flex items-center gap-3 mb-10">
          <ShoppingCart className="w-10 h-10 text-amber-600" />
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Shopping Bag</h1>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="lg:w-2/3 space-y-6">
            {error && (
              <div className="p-4 flex items-center gap-2 bg-red-50 text-red-700 rounded-xl mb-6 font-bold border-2 border-red-200">
                <AlertCircle className="w-5 h-5"/>
                {error}
              </div>
            )}
            
            <div className="bg-white rounded-3xl shadow-lg border border-amber-100 overflow-hidden">
              <div className="p-6 sm:p-8">
                {cartItems.map((item) => (
                  <div key={item._id || item.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-6 border-b border-amber-100 last:border-0 last:pb-0 mb-6 last:mb-0">
                    <div className="w-24 h-24 bg-amber-50 rounded-2xl shrink-0 overflow-hidden border-2 border-amber-200">
                      {item.image ? (
                        <img src={item.image} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><ShoppingBag className="w-6 h-6 text-amber-400"/></div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{item.name}</h3>
                      <p className="text-xs uppercase tracking-wider font-bold text-amber-700 mb-2">{item.category || 'Premium Footwear'}</p>
                      <div className="flex items-center gap-3">
                        <span className="text-xl font-black text-gray-900">{formatPrice(item.price)}</span>
                        <span className="text-sm font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200">Qty: {item.quantity}</span>
                      </div>
                    </div>
                    
                    <button onClick={() => removeFromCart(item._id || item.id)} className="w-full sm:w-auto text-red-600 hover:text-red-700 font-bold text-sm flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 px-4 py-3 rounded-xl transition-colors border border-red-200">
                      <Trash2 className="w-4 h-4"/> Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="lg:w-1/3">
            <div className="bg-white text-gray-900 rounded-3xl shadow-lg border-2 border-amber-100 p-8 sticky top-24">
              <h2 className="text-2xl font-bold mb-6 border-b-2 border-amber-200 pb-4 text-gray-900">Order Summary</h2>
              <div className="space-y-4 mb-8 text-sm font-medium border-b-2 border-amber-200 pb-8">
                <div className="flex justify-between text-gray-700"><span>Subtotal</span><span className="font-bold">{formatPrice(subtotal)}</span></div>
                <div className="flex justify-between text-gray-700"><span>Shipping</span><span className={shipping === 0 ? 'text-emerald-600 font-bold' : 'font-bold'}>{shipping === 0 ? 'Free ✓' : formatPrice(shipping)}</span></div>
                <div className="flex justify-between text-gray-700"><span>Tax (10%)</span><span className="font-bold">{formatPrice(tax)}</span></div>
              </div>

              <div className="flex justify-between text-2xl font-black mb-8 text-gray-900 bg-amber-50 p-4 rounded-xl border-2 border-amber-200">
                <span>Total:</span>
                <span className="text-amber-600">{formatPrice(total)}</span>
              </div>

              {subtotal > 500 && (
                <div className="bg-emerald-50 text-emerald-700 px-4 py-3 rounded-xl text-xs font-bold mb-6 border-2 border-emerald-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" /> Free shipping activated!
                </div>
              )}

              <button 
                onClick={handleCheckout} 
                className="w-full py-4 px-6 rounded-xl text-base font-bold text-white bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-700 hover:to-orange-600 shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 hover:-translate-y-1 transform"
              >
                Proceed to Checkout <ArrowRight className="w-5 h-5"/>
              </button>

              <button 
                onClick={() => navigate('/products')} 
                className="w-full py-3 px-6 mt-4 rounded-xl text-base font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border-2 border-amber-200 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
