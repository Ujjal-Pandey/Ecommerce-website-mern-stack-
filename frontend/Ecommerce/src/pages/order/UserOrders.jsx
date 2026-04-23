import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Package, Truck, CheckCircle, XCircle, ShoppingBag, Box, Check, RefreshCw, Clock, MapPin, Calendar, DollarSign } from 'lucide-react';
import orderService from '../../services/orderService';

const UserOrders = () => {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [autoRefreshActive, setAutoRefreshActive] = useState(true);

  // Order status workflow
  const STATUS_FLOW = ['Pending', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered'];
  const STATUS_COLORS = {
    'Pending': 'bg-amber-100 text-amber-700 border-amber-300',
    'Confirmed': 'bg-emerald-100 text-emerald-700 border-emerald-300',
    'Shipped': 'bg-blue-100 text-blue-700 border-blue-300',
    'Out for Delivery': 'bg-purple-100 text-purple-700 border-purple-300',
    'Delivered': 'bg-green-100 text-green-700 border-green-300',
    'Cancelled': 'bg-red-100 text-red-700 border-red-300',
  };

  const STATUS_ICONS = {
    'Pending': Clock,
    'Confirmed': CheckCircle,
    'Shipped': Truck,
    'Out for Delivery': Truck,
    'Delivered': CheckCircle,
    'Cancelled': XCircle,
  };

  // Auto-refresh orders every 10 seconds and when page comes to focus
  useEffect(() => {
    if (!isAuthenticated) return;
    
    fetchOrders();

    const interval = setInterval(() => {
      if (autoRefreshActive) {
        fetchOrders();
      }
    }, 10000);

    const handleFocus = () => {
      fetchOrders();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [isAuthenticated, autoRefreshActive]);

  const handleMouseEnter = () => setAutoRefreshActive(false);
  const handleMouseLeave = () => setAutoRefreshActive(true);

  const fetchOrders = async () => {
    try {
      const data = await orderService.getMyOrders();
      setOrders(data || []);
      setError('');
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusProgress = (status) => {
    const index = STATUS_FLOW.indexOf(status);
    return index === -1 ? 0 : index + 1;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-28 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl shadow-lg">
              <ShoppingBag className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight">My Orders</h1>
              <p className="text-amber-600 font-semibold tracking-wide text-sm">
                Track and manage your purchases
              </p>
            </div>
          </div>
          
          {/* Auto-Refresh Indicator */}
          {orders.length > 0 && (
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all ${
              autoRefreshActive 
                ? 'bg-amber-50 border-amber-200' 
                : 'bg-gray-50 border-gray-200'
            }`}>
              <RefreshCw className={`w-4 h-4 ${autoRefreshActive ? 'text-amber-600 animate-spin' : 'text-gray-500'}`} />
              <span className={`text-xs font-bold uppercase tracking-wider ${
                autoRefreshActive ? 'text-amber-700' : 'text-gray-600'
              }`}>
                {autoRefreshActive ? 'Live Updates ON' : 'Updates Paused'}
              </span>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 text-red-700 rounded-xl font-medium flex items-start gap-3">
            <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* No Orders State */}
        {orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-lg border-2 border-amber-100">
            <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <p className="text-2xl font-bold text-gray-700 mb-2">No orders yet</p>
            <p className="text-gray-500 mb-8">Looks like you haven't placed any orders yet</p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-700 hover:to-orange-600 text-white font-bold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <ShoppingBag className="w-5 h-5" />
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => {
              const progress = getStatusProgress(order.status);
              const isCompleted = order.status === 'Delivered';
              const isCancelled = order.status === 'Cancelled';
              
              return (
                <div 
                  key={order._id} 
                  className="bg-white rounded-3xl shadow-lg border-2 border-amber-100 overflow-hidden hover:shadow-xl transition-all duration-300"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  {/* Order Header */}
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 border-b-2 border-amber-100">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <div className="flex items-center gap-2 text-amber-600 text-xs font-bold uppercase tracking-wider mb-1">
                          <Package className="w-4 h-4" />
                          Order ID
                        </div>
                        <p className="font-mono text-sm font-bold text-gray-900">
                          #{order._id.slice(-12)}
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-amber-600 text-xs font-bold uppercase tracking-wider mb-1">
                          <Calendar className="w-4 h-4" />
                          Order Date
                        </div>
                        <p className="text-sm font-semibold text-gray-700">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="md:text-right">
                        <div className="flex items-center gap-2 text-amber-600 text-xs font-bold uppercase tracking-wider mb-1 justify-end">
                          <DollarSign className="w-4 h-4" />
                          Total Amount
                        </div>
                        <p className="text-2xl font-black text-amber-600">
                          Rs. {Number(order.total).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Status Badge */}
                  <div className="px-6 pt-4">
                    <div className="inline-flex items-center gap-2">
                      <span className={`px-4 py-2 text-sm font-black uppercase rounded-full border-2 flex items-center gap-2 shadow-sm ${STATUS_COLORS[order.status]}`}>
                        {(() => {
                          const IconComponent = STATUS_ICONS[order.status];
                          return <IconComponent className="w-4 h-4" />;
                        })()}
                        {order.status}
                      </span>
                      {autoRefreshActive && order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                        <span className="text-xs text-amber-600 animate-pulse flex items-center gap-1">
                          <RefreshCw className="w-3 h-3 animate-spin" />
                          Live tracking
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6 pt-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4" />
                      Items Ordered
                    </h4>
                    <div className="space-y-3 bg-amber-50/30 p-4 rounded-xl border border-amber-100">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center py-2 border-b border-amber-100 last:border-0">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center overflow-hidden shrink-0 border border-amber-200">
                              {item.product?.image ? (
                                <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                              ) : (
                                <Package className="w-6 h-6 text-amber-500" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-bold text-gray-800 text-sm line-clamp-1">
                                {item.product?.name || 'Product'}
                              </p>
                              <p className="text-xs text-amber-600 font-semibold">
                                Quantity: {item.qty}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-800">
                              Rs. {(item.qty * (item.product?.price || 0)).toLocaleString('en-IN')}
                            </p>
                            <p className="text-xs text-gray-500">
                              @ Rs. {Number(item.product?.price || 0).toLocaleString('en-IN')} each
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Progress Timeline */}
                  {!isCancelled && (
                    <div className="px-6 pb-6">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4 flex items-center gap-2">
                        <Truck className="w-4 h-4" />
                        Order Progress
                      </h4>
                      
                      <div className="relative">
                        <div className="flex justify-between">
                          {STATUS_FLOW.map((status, idx) => {
                            const isActive = idx < progress;
                            const isCurrent = idx === progress - 1;
                            
                            return (
                              <div key={status} className="flex-1 text-center">
                                <div className="relative">
                                  <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center border-2 transition-all ${
                                    isActive 
                                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 border-amber-500 shadow-lg' 
                                      : 'bg-gray-100 border-gray-300'
                                  }`}>
                                    {isActive ? (
                                      <Check className="w-5 h-5 text-white" />
                                    ) : (
                                      <div className={`w-2 h-2 rounded-full ${isCurrent ? 'bg-amber-500' : 'bg-gray-400'}`} />
                                    )}
                                  </div>
                                  <p className={`text-xs font-bold mt-2 ${
                                    isActive ? 'text-amber-600' : 'text-gray-500'
                                  }`}>
                                    {status}
                                  </p>
                                  {isCurrent && (
                                    <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-amber-600 text-white text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap shadow-lg">
                                      Current
                                    </span>
                                  )}
                                </div>
                                {idx < STATUS_FLOW.length - 1 && (
                                  <div className={`absolute top-5 left-1/2 w-full h-0.5 -z-10 ${
                                    isActive && idx < progress - 1 ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-gray-200'
                                  }`} />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Estimated Delivery */}
                      {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                        <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
                          <div className="flex items-center gap-3">
                            <Truck className="w-5 h-5 text-amber-600" />
                            <div>
                              <p className="text-xs text-amber-700 font-bold uppercase tracking-wider">Estimated Delivery</p>
                              <p className="text-sm font-semibold text-gray-800">
                                {order.status === 'Pending' && '3-5 business days after confirmation'}
                                {order.status === 'Confirmed' && '2-4 business days'}
                                {order.status === 'Shipped' && '1-3 business days'}
                                {order.status === 'Out for Delivery' && 'Today or tomorrow'}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Cancelled Order Message */}
                  {isCancelled && (
                    <div className="px-6 pb-6">
                      <div className="p-4 bg-red-50 rounded-xl border-2 border-red-200 text-center">
                        <XCircle className="w-12 h-12 text-red-500 mx-auto mb-2" />
                        <p className="text-red-800 font-bold">Order Cancelled</p>
                        <p className="text-red-600 text-sm mt-1">
                          This order has been cancelled. Contact support for more information.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Delivery Completed Message */}
                  {isCompleted && (
                    <div className="px-6 pb-6">
                      <div className="p-4 bg-emerald-50 rounded-xl border-2 border-emerald-200 text-center">
                        <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
                        <p className="text-emerald-800 font-bold">Order Delivered!</p>
                        <p className="text-emerald-600 text-sm mt-1">
                          Thank you for shopping with us! Hope you love your purchase.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Shipping Address */}
                  {order.shippingAddress && (
                    <div className="px-6 pb-6">
                      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <MapPin className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Shipping Address</p>
                          <p className="text-sm text-gray-800 font-medium">{order.shippingAddress.fullName}</p>
                          <p className="text-sm text-gray-600">{order.shippingAddress.address}</p>
                          <p className="text-sm text-gray-600">{order.shippingAddress.city} - {order.shippingAddress.postalCode}</p>
                          <p className="text-sm text-gray-600">Phone: {order.shippingAddress.phone}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOrders;