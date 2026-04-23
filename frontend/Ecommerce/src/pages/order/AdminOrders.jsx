import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Calendar, Activity, Check, CheckCircle2, Truck, Box, AlertCircle, X, Package, DollarSign, User, Clock } from 'lucide-react';
import orderService from '../../services/orderService';

const AdminOrders = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
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
    'Pending': Box,
    'Confirmed': CheckCircle2,
    'Shipped': Truck,
    'Out for Delivery': Truck,
    'Delivered': CheckCircle2,
    'Cancelled': X,
  };

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) return;
    fetchOrders();
  }, [isAuthenticated, isAdmin]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await orderService.getAllOrders();
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

  const handleStatusUpdate = async (orderId, newStatus) => {
    setLoading(true);
    try {
      const response = await orderService.updateOrderStatus(orderId, newStatus);
      setSuccess(`✓ Order status updated to ${newStatus}`);
      setTimeout(() => setSuccess(''), 4000);
      await fetchOrders();
    } catch (err) {
      console.error('Failed to update order status:', err);
      setError('❌ Failed to update order status. Please try again.');
      setTimeout(() => setError(''), 4000);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-28 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl shadow-lg">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight">Manage Orders</h1>
              <p className="text-amber-600 font-semibold tracking-wide text-sm">ADMINISTRATION PANEL</p>
            </div>
          </div>
          <div className="text-right">
            <div className="bg-white rounded-2xl px-6 py-3 shadow-md border border-amber-100">
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-3xl font-black text-amber-600">{orders.length}</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 text-red-700 rounded-xl font-medium flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-emerald-50 border-2 border-emerald-200 text-emerald-800 rounded-xl font-bold flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-lg border-2 border-amber-100">
            <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <p className="text-xl font-bold text-gray-500 mb-2">No orders found</p>
            <p className="text-gray-400">Orders will appear here once customers make purchases</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {orders.map(order => {
              const progress = getStatusProgress(order.status);
              const isCompleted = order.status === 'Delivered';
              const isCancelled = order.status === 'Cancelled';

              return (
                <div key={order._id} className="bg-white rounded-3xl shadow-lg border-2 border-amber-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                  {/* Order Header */}
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 border-b-2 border-amber-100">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <div className="flex items-center gap-2 text-amber-600 text-xs font-bold uppercase tracking-wider mb-1">
                          <Package className="w-4 h-4" />
                          Order ID
                        </div>
                        <p className="font-mono text-sm font-bold text-gray-900">{order._id.slice(-12)}</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-amber-600 text-xs font-bold uppercase tracking-wider mb-1">
                          <User className="w-4 h-4" />
                          Customer
                        </div>
                        <p className="text-sm font-bold text-gray-900">{order.user?.name || 'Guest User'}</p>
                        <p className="text-xs text-gray-500">{order.user?.email || 'No email'}</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-amber-600 text-xs font-bold uppercase tracking-wider mb-1">
                          <Calendar className="w-4 h-4" />
                          Date
                        </div>
                        <p className="text-sm font-semibold text-gray-700">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-amber-600 text-xs font-bold uppercase tracking-wider mb-1">
                          <DollarSign className="w-4 h-4" />
                          Total Amount
                        </div>
                        <p className="text-2xl font-black text-amber-600">
                          Rs. {Number(order.total).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6 border-b border-amber-100">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-2">
                      <Box className="w-4 h-4" />
                      Order Items
                    </h4>
                    <div className="space-y-2 bg-amber-50/30 p-4 rounded-xl border border-amber-100">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center py-2 border-b border-amber-100 last:border-0">
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-amber-600 text-sm">{item.qty}x</span>
                            <span className="font-semibold text-gray-800">{item.product?.name || 'Unknown Product'}</span>
                          </div>
                          <span className="font-mono font-bold text-gray-700">
                            Rs. {Number(item.product?.price || 0).toLocaleString('en-IN')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Status Section */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        Order Status
                      </h4>
                      <span className={`px-4 py-2 text-sm font-black uppercase rounded-full border-2 flex items-center gap-2 shadow-sm ${STATUS_COLORS[order.status]}`}>
                        {(() => {
                          const IconComponent = STATUS_ICONS[order.status];
                          return <IconComponent className="w-4 h-4" />;
                        })()}
                        {order.status}
                      </span>
                    </div>

                    {/* Status Progress Bar */}
                    {!isCancelled && (
                      <div className="mb-8">
                        <div className="relative flex justify-between">
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
                                      <CheckCircle2 className="w-5 h-5 text-white" />
                                    ) : (
                                      <div className={`w-2 h-2 rounded-full ${isCurrent ? 'bg-amber-500' : 'bg-gray-400'}`} />
                                    )}
                                  </div>
                                  <p className={`text-xs font-bold mt-2 ${
                                    isActive ? 'text-amber-600' : 'text-gray-500'
                                  }`}>
                                    {status}
                                  </p>
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
                    )}

                    {/* Status Management */}
                    {!isCompleted && !isCancelled ? (
                      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-amber-200">
                        <h4 className="text-sm font-black text-amber-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-amber-600" />
                          Update Order Status
                        </h4>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                          {STATUS_FLOW.map(status => {
                            if (status === order.status) return null;
                            if (status === 'Delivered' && order.status !== 'Out for Delivery') return null;
                            
                            const colors = STATUS_COLORS[status];
                            const IconComponent = STATUS_ICONS[status];
                            
                            return (
                              <button
                                key={status}
                                onClick={() => handleStatusUpdate(order._id, status)}
                                className={`px-4 py-3 font-bold text-xs uppercase rounded-xl transition-all border-2 flex items-center justify-center gap-2 hover:shadow-lg hover:-translate-y-0.5 active:scale-95 cursor-pointer ${colors}`}
                              >
                                <IconComponent className="w-4 h-4" />
                                <span>{status}</span>
                              </button>
                            );
                          })}
                          
                          {/* Cancel Button */}
                          <button
                            onClick={() => handleStatusUpdate(order._id, 'Cancelled')}
                            className="px-4 py-3 bg-red-100 hover:bg-red-200 text-red-800 font-bold text-xs uppercase rounded-xl transition-all border-2 border-red-300 flex items-center justify-center gap-2 hover:shadow-lg hover:-translate-y-0.5 active:scale-95 cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                            <span>Cancel</span>
                          </button>
                        </div>
                        
                        <div className="mt-4 p-3 bg-white rounded-xl border border-amber-200 text-xs text-gray-600 flex items-start gap-2">
                          <Clock className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                          <span>Status updates are saved instantly and visible to customers in real-time.</span>
                        </div>
                      </div>
                    ) : isCancelled ? (
                      <div className="bg-red-50 rounded-2xl p-6 border-2 border-red-200 text-center">
                        <X className="w-12 h-12 text-red-500 mx-auto mb-2" />
                        <p className="text-red-800 font-bold">This order has been cancelled</p>
                        <p className="text-red-600 text-sm mt-1">No further status changes allowed</p>
                      </div>
                    ) : (
                      <div className="bg-emerald-50 rounded-2xl p-6 border-2 border-emerald-200 text-center">
                        <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
                        <p className="text-emerald-800 font-bold">Order Completed</p>
                        <p className="text-emerald-600 text-sm mt-1">This order has been delivered successfully</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;