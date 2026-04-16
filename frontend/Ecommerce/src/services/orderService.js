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
  async updatePaymentStatus(id, paymentStatus, paymentId) {
    const res = await api.put(`/orders/${id}/payment-status`, { 
      paymentStatus, 
      paymentId 
    });
    return res.data;
  },
};

export default orderService;
