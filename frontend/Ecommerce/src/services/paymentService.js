import api from "./api";

const paymentService = {
  initiatePayment: async (paymentData) => {
    try {
      const response = await api.post("/payment/initiate", {
        orderId: paymentData.orderId,
        productName: paymentData.productName,
        amount: paymentData.amount,
        customerName: paymentData.customerName,
        customerEmail: paymentData.customerEmail,
        customerPhone: paymentData.customerPhone,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  verifyPayment: async (pidx) => {
    try {
      const response = await api.post("/payment/lookup", { pidx });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default paymentService;
