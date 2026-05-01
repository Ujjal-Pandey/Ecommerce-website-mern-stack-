import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import orderService from '../../services/orderService';
import PaymentButton from '../../components/PaymentButton';
import { ShoppingCart, Loader, AlertCircle, CheckCircle2, MapPin } from 'lucide-react';

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

  // Check stock before creating order
  const validateStock = () => {
    for (let item of cartItems) {
      if (item.quantity > (item.countInStock || 0)) {
        return {
          valid: false,
          message: `Insufficient stock for "${item.name}". Available: ${item.countInStock || 0}, Requested: ${item.quantity}`
        };
      }
    }
    return { valid: true };
  };

  const handleCreateOrder = async () => {
    // Validate form fields
    if (!formData.fullName || !formData.email || !formData.phone || !formData.address || !formData.city) {
      setError('Please fill in all required fields');
      return;
    }

    // Email validation
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Phone validation
    if (!formData.phone || formData.phone.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }

    // ✅ Check stock availability
    const stockCheck = validateStock();
    if (!stockCheck.valid) {
      setError(stockCheck.message);
      return;
    }

    setIsCreatingOrder(true);
    setError(null);

    try {
      const orderData = {
        items: cartItems.map(item => ({ 
          product: item._id, 
          quantity: item.quantity
        })),
        total: total,
        shippingAddress: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode || '',
        },
      };

      console.log('📦 Sending order data:', JSON.stringify(orderData, null, 2));

      const response = await orderService.createOrder(orderData);
      
      console.log('✅ Order created successfully:', response);
      
      setOrderId(response._id || response.id);
      setError(null);
    } catch (err) {
      console.error('❌ Order creation error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          'Failed to create order. Please try again.';
      
      setError(errorMessage);
    } finally {
      setIsCreatingOrder(false);
    }
  };

  // Display stock warning if any item exceeds available stock
  const getStockWarning = () => {
    const outOfStockItems = cartItems.filter(item => item.quantity > (item.countInStock || 0));
    if (outOfStockItems.length > 0) {
      return (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm font-semibold">⚠️ Stock Issues:</p>
          {outOfStockItems.map(item => (
            <p key={item._id} className="text-red-600 text-xs mt-1">
              {item.name}: Requested {item.quantity}, Available {item.countInStock || 0}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 pt-24 md:pt-32 pb-12 md:pb-20 px-4 flex items-center justify-center">
        <div className="text-center max-w-md">
          <ShoppingCart className="w-12 md:w-16 h-12 md:h-16 text-amber-400 mx-auto mb-3 md:mb-4" />
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">No items to checkout</h2>
          <p className="text-sm md:text-base text-gray-600 mb-6">Add products to your cart to proceed with checkout</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-6 md:px-8 py-2.5 md:py-3 bg-amber-600 text-white font-bold rounded-lg md:rounded-xl hover:bg-amber-700 transition-colors text-sm md:text-base"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 md:pt-24 pb-12 md:pb-16 px-4 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl md:text-4xl font-black text-gray-900 mb-8 md:mb-12 text-center">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl md:rounded-3xl shadow-lg border-2 border-amber-100 p-4 md:p-8">
              <h2 className="text-lg md:text-2xl font-bold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
                <ShoppingCart className="w-5 md:w-6 h-5 md:h-6 text-amber-600" /> Order Details
              </h2>
              
              {/* Stock Warning */}
              {getStockWarning()}
              
              <div className="space-y-2 md:space-y-4 mb-6 md:mb-8 bg-amber-50 p-3 md:p-4 rounded-lg md:rounded-xl border border-amber-200 max-h-72 md:max-h-96 overflow-y-auto">
                {cartItems.map(item => (
                  <div key={item._id} className="flex justify-between items-start md:items-center py-2 border-b border-amber-200 last:border-0 text-sm md:text-base">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{item.name}</p>
                      <p className="text-xs md:text-sm text-amber-700">
                        Qty: {item.quantity}
                        {item.quantity > (item.countInStock || 0) && (
                          <span className="text-red-600 ml-2">(Insufficient stock!)</span>
                        )}
                      </p>
                    </div>
                    <span className="font-bold text-gray-900 ml-2">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              {/* Order Summary Card */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg md:rounded-xl p-4 md:p-6 border-2 border-amber-200">
                <div className="space-y-2 md:space-y-3 mb-3 md:mb-4 pb-3 md:pb-4 border-b-2 border-amber-300 text-sm md:text-base">
                  <div className="flex justify-between text-gray-700">
                    <span className="font-medium">Subtotal</span>
                    <span className="font-semibold">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span className="font-medium">Shipping</span>
                    <span className={`font-semibold ${shipping === 0 ? 'text-emerald-600' : ''}`}>
                      {shipping === 0 ? '✓ Free' : formatPrice(shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span className="font-medium">Tax (10%)</span>
                    <span className="font-semibold">{formatPrice(tax)}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-base md:text-lg font-bold text-gray-900">Total Amount</span>
                  <span className="text-2xl md:text-3xl font-black text-amber-600">{formatPrice(total)}</span>
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white rounded-2xl md:rounded-3xl shadow-lg border-2 border-amber-100 p-4 md:p-8">
              <h2 className="text-lg md:text-2xl font-bold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
                <MapPin className="w-5 md:w-6 h-5 md:h-6 text-amber-600" /> Shipping Information
              </h2>

              {error && (
                <div className="flex items-start gap-2 md:gap-3 p-3 md:p-4 bg-red-50 border-2 border-red-200 rounded-lg mb-4 md:mb-6">
                  <AlertCircle className="w-4 md:w-5 h-4 md:h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="text-xs md:text-sm">
                    <p className="font-semibold text-red-800">Error</p>
                    <p className="text-red-700">{error}</p>
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-3 md:gap-6 mb-4 md:mb-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-gray-200 rounded-lg md:rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none bg-gray-50 focus:bg-white transition-all text-sm md:text-base"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-gray-200 rounded-lg md:rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none bg-gray-50 focus:bg-white transition-all text-sm md:text-base"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+977 1234567890"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-gray-200 rounded-lg md:rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none bg-gray-50 focus:bg-white transition-all text-sm md:text-base"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    placeholder="Kathmandu"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-gray-200 rounded-lg md:rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none bg-gray-50 focus:bg-white transition-all text-sm md:text-base"
                    required
                  />
                </div>
              </div>

              <div className="mb-4 md:mb-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                  Street Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  placeholder="123 Main Street"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-gray-200 rounded-lg md:rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none bg-gray-50 focus:bg-white transition-all text-sm md:text-base"
                  required
                />
              </div>

              <div className="mb-4 md:mb-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                  Postal Code <span className="text-gray-400">(Optional)</span>
                </label>
                <input
                  type="text"
                  name="postalCode"
                  placeholder="12345"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-gray-200 rounded-lg md:rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none bg-gray-50 focus:bg-white transition-all text-sm md:text-base"
                />
              </div>

              <button
                onClick={handleCreateOrder}
                disabled={isCreatingOrder}
                className="w-full mt-6 md:mt-8 px-4 md:px-6 py-3 md:py-4 bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-700 hover:to-orange-600 text-white font-bold rounded-lg md:rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm md:text-base"
              >
                {isCreatingOrder ? (
                  <>
                    <Loader className="w-4 md:w-5 h-4 md:h-5 animate-spin" />
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
            <div className="bg-white rounded-2xl md:rounded-3xl shadow-lg border-2 border-amber-100 p-4 md:p-8 sticky top-20 md:top-24">
              <h2 className="text-lg md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Payment</h2>

              <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-3 md:p-4 rounded-lg md:rounded-xl mb-4 md:mb-6 border-2 border-amber-200">
                <p className="text-xs md:text-sm text-gray-600 mb-1 md:mb-2 font-medium">Amount to Pay</p>
                <p className="text-2xl md:text-3xl font-black text-amber-600">{formatPrice(total)}</p>
              </div>

              {orderId ? (
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-emerald-50 border-2 border-emerald-200 rounded-lg mb-6">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-emerald-800">Order Created ✓</p>
                      <p className="text-emerald-700 text-xs mt-1">ID: {orderId.slice(0, 8)}...</p>
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
                <div className="p-4 bg-amber-50 border-2 border-amber-200 rounded-lg text-center">
                  <p className="text-sm text-amber-700 font-medium">
                    👉 Fill shipping info and click "Continue to Payment" to proceed
                  </p>
                </div>
              )}

              <div className="mt-6 pt-6 border-t-2 border-amber-200">
                <p className="text-xs text-gray-500 text-center">
                  🔒 Your payment information is secure and encrypted
                </p>
                <p className="text-xs text-gray-400 text-center mt-2">
                  By proceeding, you agree to our Terms of Service
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