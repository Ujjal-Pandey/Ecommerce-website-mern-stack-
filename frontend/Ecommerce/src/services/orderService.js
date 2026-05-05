import api from "./api";

const orderService = {
  // Create order
  async createOrder(orderData) {
    const res = await api.post("/orders", orderData);
    return res.data;
  },

  // Get logged-in user's orders
  async getMyOrders() {
    const res = await api.get("/orders/myorders");
    return res.data;
  },

  // Get all orders (Admin only)
  async getAllOrders() {
    const res = await api.get("/orders/admin/all");
    return res.data;
  },

  // Update order status (Admin only)
  async updateOrderStatus(id, status) {
    const res = await api.put(`/orders/${id}/status`, { status });
    return res.data;
  },

  // Update payment status after payment verification
  async updatePaymentStatus(orderId, paymentStatus, paymentId) {
    console.log(`🔄 Calling updatePaymentStatus:`, {
      orderId,
      paymentStatus,
      paymentId,
      endpoint: `/orders/${orderId}/payment-status`
    });
    
    const res = await api.put(`/orders/${orderId}/payment-status`, { 
      paymentStatus, 
      paymentId,
      orderId // Include in body for double verification
    });
    return res.data;
  },
};

export default orderService;
