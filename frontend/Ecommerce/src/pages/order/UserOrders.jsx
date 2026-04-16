import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Package, Truck, CheckCircle, XCircle, ShoppingBag, Box, Check, RefreshCw } from 'lucide-react';
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
    'Pending': { bg: 'bg-gray-100', text: 'text-gray-700' },
    'Confirmed': { bg: 'bg-blue-100', text: 'text-blue-700' },
    'Shipped': { bg: 'bg-indigo-100', text: 'text-indigo-700' },
    'Out for Delivery': { bg: 'bg-purple-100', text: 'text-purple-700' },
    'Delivered': { bg: 'bg-emerald-100', text: 'text-emerald-700' },
    'Cancelled': { bg: 'bg-red-100', text: 'text-red-700' },
  };

  const STATUS_ICONS = {
    'Pending': Box,
    'Confirmed': Check,
    'Shipped': Truck,
    'Out for Delivery': Truck,
    'Delivered': CheckCircle,
    'Cancelled': XCircle,
  };

  // Auto-refresh orders every 6 seconds and when page comes to focus
  useEffect(() => {
    if (!isAuthenticated) return;
    
    // Initial fetch
    fetchOrders();

    // Auto-refresh every 6 seconds
    const interval = setInterval(() => {
      if (autoRefreshActive) {
        fetchOrders();
      }
    }, 6000);

    // Refresh when page comes to focus
    const handleFocus = () => {
      fetchOrders();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [isAuthenticated, autoRefreshActive]);

  // Pause auto-refresh on hover, resume on leave
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
      <div className="mb-8 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <ShoppingBag className="w-8 h-8 text-primary-600" />
          <div>
            <h1 className="text-3xl font-black text-slate-900">My Orders</h1>
            <p className="text-slate-600">Track and manage your recent purchases</p>
          </div>
        </div>
        
        {/* Auto-Refresh Indicator */}
        {orders.length > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
            <RefreshCw className={`w-4 h-4 text-blue-600 ${autoRefreshActive ? 'animate-spin' : ''}`} />
            <span className="text-xs font-semibold text-blue-700">
              {autoRefreshActive ? 'Live Updates' : 'Updates Paused'}
            </span>
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 mb-6 flex items-center gap-2">
          <XCircle className="w-5 h-5" /> {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white shadow-sm border border-slate-100 rounded-2xl">
          <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-xl font-bold text-slate-700 mb-2">No orders placed yet</p>
          <p className="text-slate-500 mb-6">Explore our products and start shopping!</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-bold rounded-lg hover:bg-primary-500 transition-colors shadow-sm"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => {
            const progress = getStatusProgress(order.status);
            
            // Determine notification message and color
            const getNotification = () => {
              switch(order.status) {
                case 'Confirmed':
                  return { bg: 'bg-blue-50', border: 'border-blue-300', icon: '✓', text: 'Your order has been confirmed!', color: 'text-blue-700' };
                case 'Shipped':
                  return { bg: 'bg-indigo-50', border: 'border-indigo-300', icon: '📦', text: 'Your order has been shipped!', color: 'text-indigo-700' };
                case 'Out for Delivery':
                  return { bg: 'bg-purple-50', border: 'border-purple-300', icon: '🚚', text: 'Your order is out for delivery!', color: 'text-purple-700' };
                case 'Delivered':
                  return { bg: 'bg-emerald-50', border: 'border-emerald-300', icon: '✓✓', text: 'Your order has been delivered!', color: 'text-emerald-700' };
                case 'Cancelled':
                  return { bg: 'bg-red-50', border: 'border-red-300', icon: '✕', text: 'Your order has been cancelled.', color: 'text-red-700' };
                default:
                  return { bg: 'bg-gray-50', border: 'border-gray-300', icon: '⧗', text: 'Your order is pending confirmation...', color: 'text-gray-700' };
              }
            };

            const notification = getNotification();

            return (
              <div 
                key={order._id} 
                className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {/* Status Notification */}
                <div className={`${notification.bg} border-b-2 ${notification.border} px-6 py-3`}>
                  <p className={`text-sm font-bold ${notification.color} flex items-center gap-2`}>
                    <span className="text-lg">{notification.icon}</span>
                    {notification.text}
                  </p>
                </div>

                {/* Header */}
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Order ID</p>
                      <p className="font-mono text-sm font-bold text-slate-800">{order._id.slice(-8)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Order Date</p>
                      <p className="text-sm font-bold text-slate-700">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Total Amount</p>
                      <p className="text-lg font-black text-slate-900">Rs. {Number(order.total).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                  {/* Order Items */}
                  <div>
                    <h4 className="text-xs uppercase font-extrabold text-slate-500 tracking-wider mb-3">Order Items</h4>
                    <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center py-2 border-b border-slate-200 last:border-0">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-300 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                              {item.product?.image ? (
                                <img src={item.product.image} className="w-full h-full object-cover" />
                              ) : (
                                <Package className="w-5 h-5 text-slate-500" />
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-slate-800 text-sm line-clamp-1">{item.product?.name || 'Product'}</p>
                              <p className="text-xs text-slate-500">Qty: {item.qty}</p>
                            </div>
                          </div>
                          <span className="font-bold text-slate-700 text-sm">Rs. {(item.qty * (item.product?.price || 0)).toLocaleString('en-IN')}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Workflow */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-xs uppercase font-extrabold text-slate-500 tracking-wider">Delivery Progress</h4>
                        <p className="text-xs text-slate-400 mt-1">Auto-refreshes every 6 seconds</p>
                      </div>
                      <span className={`px-3 py-1 text-xs font-black uppercase rounded-full border flex items-center gap-1 ${STATUS_COLORS[order.status].bg} ${STATUS_COLORS[order.status].text}`}>
                        {(() => {
                          const IconComponent = STATUS_ICONS[order.status];
                          return <IconComponent className="w-4 h-4" />;
                        })()}
                        {order.status}
                      </span>
                    </div>

                    {/* Progress Timeline */}
                    <div className="flex items-center justify-between gap-1">
                      {STATUS_FLOW.map((status, idx) => {
                        const isCompleted = idx < progress;
                        const isCurrent = idx === progress - 1;
                        const IconComponent = STATUS_ICONS[status];

                        return (
                          <div key={status} className="flex-1 flex flex-col items-center relative">
                            {/* Connecting Line */}
                            {idx < STATUS_FLOW.length - 1 && (
                              <div className={`absolute top-6 left-1/2 w-full h-1 ${isCompleted ? 'bg-indigo-600' : 'bg-slate-300'}`} />
                            )}
                            
                            {/* Status Dot */}
                            <div className={`rounded-full p-2 border-3 flex items-center justify-center transition-all relative z-10 ${
                              isCompleted || isCurrent 
                                ? 'bg-indigo-600 border-indigo-600 shadow-lg' 
                                : 'bg-white border-slate-300'
                            }`}>
                              <IconComponent className={`w-5 h-5 ${isCompleted || isCurrent ? 'text-white' : 'text-slate-600'}`} />
                            </div>
                            
                            {/* Status Label */}
                            <p className={`text-xs font-bold mt-3 text-center leading-tight line-clamp-2 ${
                              isCurrent ? 'text-indigo-700 font-black text-sm' : isCompleted ? 'text-slate-700' : 'text-slate-500'
                            }`}>
                              {status}
                            </p>
                            
                            {/* Current Status Badge */}
                            {isCurrent && (
                              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white text-xs font-black px-2 py-1 rounded-full whitespace-nowrap">
                                Current
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserOrders;
