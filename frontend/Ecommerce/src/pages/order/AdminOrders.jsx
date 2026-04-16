import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Calendar, Activity, Check, CheckCircle2, Truck, Box, AlertCircle, X } from 'lucide-react';
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
    'Pending': 'bg-gray-100 text-gray-700 border-gray-300',
    'Confirmed': 'bg-blue-100 text-blue-700 border-blue-300',
    'Shipped': 'bg-indigo-100 text-indigo-700 border-indigo-300',
    'Out for Delivery': 'bg-purple-100 text-purple-700 border-purple-300',
    'Delivered': 'bg-emerald-100 text-emerald-700 border-emerald-300',
    'Cancelled': 'bg-red-100 text-red-700 border-red-300',
  };
  
  const STATUS_ICONS = {
    'Pending': Box,
    'Confirmed': Check,
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

  const getAvailableStatuses = (currentStatus) => {
    // Admin can change to any status at any time
    return STATUS_FLOW.filter(status => status !== currentStatus);
  };

  const getStatusProgress = (status) => {
    const index = STATUS_FLOW.indexOf(status);
    return index === -1 ? 0 : index + 1;
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    setLoading(true);
    try {
      const response = await orderService.updateOrderStatus(orderId, newStatus);
      setSuccess(`✓ Order updated to ${newStatus} status`);
      setTimeout(() => setSuccess(''), 4000);
      // Refetch orders to show the updated status
      await fetchOrders();
    } catch (err) {
      console.error('Failed to update order status:', err);
      setError('❌ Failed to update order status. Please try again.');
      setTimeout(() => setError(''), 4000);
    } finally {
      setLoading(false);
    }
  };

  // Get status color and badge
  if (loading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-semibold">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-100 rounded-xl">
              <ShieldCheck className="w-8 h-8 text-indigo-700" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Manage Orders</h1>
              <p className="text-indigo-600 font-semibold tracking-wide text-sm">ADMINISTRATION PANEL</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-600">Total Orders: <span className="font-bold text-indigo-700">{orders.length}</span></p>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 mb-6 font-medium shadow-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 mb-6 font-bold shadow-sm flex items-center gap-2">
            <Check className="w-5 h-5 text-emerald-600" /> {success}
          </div>
        )}

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-200">
            <Activity className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-xl font-bold text-slate-500 mb-2">No orders found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {orders.map(order => {
              const availableStatuses = getAvailableStatuses(order.status);
              const progress = getStatusProgress(order.status);

              return (
                <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                  {/* Header */}
                  <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4 pb-6 border-b border-slate-200">
                    <div>
                      <p className="text-xs uppercase font-extrabold text-slate-500 tracking-wider mb-1">Order ID</p>
                      <p className="font-mono text-sm font-bold text-indigo-900">{order._id.slice(-8)}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase font-extrabold text-slate-500 tracking-wider mb-1">Customer</p>
                      <p className="text-sm font-bold text-slate-800">{order.user?.name || 'Unknown'}</p>
                      <p className="text-xs text-slate-500">{order.user?.email}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase font-extrabold text-slate-500 tracking-wider mb-1">Date</p>
                      <p className="text-sm font-bold text-slate-700">
                        <Calendar className="w-3 h-3 inline mr-1 text-slate-400" />
                        {new Date(order.createdAt).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs uppercase font-extrabold text-slate-500 tracking-wider mb-1">Total Value</p>
                      <p className="text-xl font-black text-slate-900">Rs. {Number(order.total).toLocaleString('en-IN')}</p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="mb-6">
                    <h4 className="text-xs uppercase font-extrabold text-slate-500 tracking-wider mb-3">Order Items</h4>
                    <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center py-2 border-b border-slate-200 last:border-0">
                          <span className="font-semibold text-slate-800">{item.qty}x {item.product?.name || 'Unnamed'}</span>
                          <span className="font-mono text-sm text-slate-600">Rs. {Number(item.product?.price || 0).toLocaleString('en-IN')}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Status Workflow */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xs uppercase font-extrabold text-slate-500 tracking-wider">Current Status</h4>
                      <span className={`px-3 py-1 text-xs font-black uppercase rounded-full border flex items-center gap-1 ${STATUS_COLORS[order.status]}`}>
                        {(() => {
                          const IconComponent = STATUS_ICONS[order.status];
                          return <IconComponent className="w-4 h-4" />;
                        })()}
                        {order.status}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between gap-0">
                        {STATUS_FLOW.map((status, idx) => {
                          const isCompleted = idx < progress;
                          const isCurrent = idx === progress - 1;
                          const IconComponent = STATUS_ICONS[status];

                          return (
                            <div key={status} className="flex-1 flex flex-col items-center">
                              <div className={`rounded-full p-2 border-2 flex items-center justify-center transition-all ${
                                isCompleted || isCurrent 
                                  ? 'bg-indigo-600 border-indigo-600' 
                                  : 'bg-slate-200 border-slate-300'
                              }`}>
                                <IconComponent className={`w-5 h-5 ${isCompleted || isCurrent ? 'text-white' : 'text-slate-600'}`} />
                              </div>
                              <p className={`text-xs font-bold mt-2 text-center leading-tight ${
                                isCurrent ? 'text-indigo-700 font-black' : isCompleted ? 'text-slate-700' : 'text-slate-500'
                              }`}>
                                {status}
                              </p>
                              {idx < STATUS_FLOW.length - 1 && (
                                <div className={`w-0.5 h-6 my-1 ${isCompleted ? 'bg-indigo-600' : 'bg-slate-300'}`} />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Status Management */}
                  <div className="bg-linear-to-r from-indigo-50 to-blue-50 rounded-xl p-6 border-2 border-indigo-300 shadow-md">
                    <h4 className="text-sm uppercase font-black text-indigo-900 tracking-wider mb-5 flex items-center gap-2">
                      <Check className="w-5 h-5" /> ⚡ Change Order Status
                    </h4>
                    
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                        {/* All Status Buttons - Admin Can Change To Any Status */}
                        {STATUS_FLOW.map(status => {
                          if (status === order.status) return null; // Skip current status
                          
                          const colors = STATUS_COLORS[status];
                          const IconComponent = STATUS_ICONS[status];
                          
                          return (
                            <button
                              key={status}
                              onClick={() => handleStatusUpdate(order._id, status)}
                              type="button"
                              className={`px-3 py-3 font-bold text-xs uppercase rounded-lg transition-all border-2 flex items-center justify-center gap-1 hover:shadow-lg active:scale-95 cursor-pointer ${colors}`}
                              title={`Change status to ${status}`}
                            >
                              <IconComponent className="w-4 h-4" />
                              <span className="hidden sm:inline">{status}</span>
                            </button>
                          );
                        })}
                        
                        {/* Cancel Button - Always Available */}
                        {order.status !== 'Cancelled' && (
                          <button
                            onClick={() => handleStatusUpdate(order._id, 'Cancelled')}
                            type="button"
                            className="px-3 py-3 bg-red-200 hover:bg-red-300 text-red-800 font-bold text-xs uppercase rounded-lg transition-all border-2 border-red-400 flex items-center justify-center gap-1 active:scale-95 cursor-pointer shadow-sm hover:shadow-lg"
                            title="Cancel this order"
                          >
                            <X className="w-4 h-4" />
                            <span className="hidden sm:inline">Cancel</span>
                          </button>
                        )}
                      </div>
                      
                      {/* Quick Update Hints */}
                      <div className="bg-white p-3 rounded-lg border border-indigo-200 text-xs text-slate-600 mt-3">
                        💡 <strong>How to use:</strong> Click any status button to update immediately. Updates are saved to database and visible to customers in real-time.
                      </div>
                    </div>
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
