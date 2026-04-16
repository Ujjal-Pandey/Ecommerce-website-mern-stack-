import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import orderService from '../../services/orderService';
import PaymentButton from '../../components/PaymentButton';
import { ShoppingCart, Loader, AlertCircle, CheckCircle2 } from 'lucide-react';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [error, setError] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    postalCode: '',
  });

  const subtotal = getCartTotal();
  const shipping = subtotal > 500 ? 0 : 50;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  const formatPrice = (price) => `Rs. ${Number(price).toLocaleString('en-IN')}`;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateOrder = async () => {
    if (!formData.fullName || !formData.email || !formData.phone || !formData.address || !formData.city) {
      setError('Please fill in all required fields');
      return;
    }

    setIsCreatingOrder(true);
    setError(null);

    try {
      const orderData = {
        items: cartItems.map(item => ({ product: item._id, qty: item.quantity })),
        total: total,
        shippingAddress: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
        },
      };

      const response = await orderService.createOrder(orderData);
      setOrderId(response._id || response.id);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to create order');
      console.error('Order creation error:', err);
    } finally {
      setIsCreatingOrder(false);
    }
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">No items to checkout</h2>
          <p className="text-slate-600">Add products to your cart to proceed with checkout</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 bg-slate-50">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-black text-slate-900 mb-12 text-center">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Order Details</h2>
              
              <div className="space-y-4 mb-8 bg-slate-50 p-4 rounded-xl">
                {cartItems.map(item => (
                  <div key={item._id} className="flex justify-between items-center py-2 border-b border-slate-200 last:border-0">
                    <div>
                      <p className="font-semibold text-slate-900">{item.name}</p>
                      <p className="text-sm text-slate-600">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-bold text-slate-900">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              {/* Order Summary Card */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 mb-8">
                <div className="space-y-3 mb-4 pb-4 border-b border-slate-300">
                  <div className="flex justify-between text-slate-700">
                    <span>Subtotal</span>
                    <span className="font-semibold">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span>Shipping</span>
                    <span className={`font-semibold ${shipping === 0 ? 'text-emerald-600' : ''}`}>
                      {shipping === 0 ? 'Free' : formatPrice(shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span>Tax (10%)</span>
                    <span className="font-semibold">{formatPrice(tax)}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-slate-900">Total Amount</span>
                  <span className="text-3xl font-black text-purple-600">{formatPrice(total)}</span>
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Shipping Information</h2>

              {error && (
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-800">Error</p>
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                />
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                />
              </div>

              <input
                type="text"
                name="address"
                placeholder="Street Address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none mb-6"
              />

              <input
                type="text"
                name="postalCode"
                placeholder="Postal Code (Optional)"
                value={formData.postalCode}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              />

              <button
                onClick={handleCreateOrder}
                disabled={isCreatingOrder}
                className="w-full mt-8 px-6 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isCreatingOrder ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Creating Order...
                  </>
                ) : (
                  'Continue to Payment'
                )}
              </button>
            </div>
          </div>

          {/* Payment Section */}
          <div>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 sticky top-24">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Payment</h2>

              <div className="bg-purple-50 p-4 rounded-lg mb-6 border border-purple-200">
                <p className="text-sm text-slate-600 mb-2">Amount to Pay</p>
                <p className="text-3xl font-black text-purple-600">{formatPrice(total)}</p>
              </div>

              {orderId ? (
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-lg mb-6">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-emerald-800">Order Created</p>
                      <p className="text-emerald-700 text-xs mt-1">Order ID: {orderId}</p>
                    </div>
                  </div>

                  <PaymentButton
                    orderId={orderId}
                    customerName={formData.fullName}
                    customerEmail={formData.email}
                    customerPhone={formData.phone}
                    amount={total}
                  />
                </div>
              ) : (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                  <p className="text-sm text-blue-700 font-medium">Click "Continue to Payment" to proceed</p>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-slate-200">
                <p className="text-xs text-slate-500 text-center">
                  🔒 Your payment information is secure and encrypted
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
