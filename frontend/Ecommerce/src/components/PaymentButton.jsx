import React, { useState } from "react";
import { Loader, AlertCircle, CheckCircle2 } from "lucide-react";
import paymentService from "../services/paymentService";


const PaymentButton = ({ orderId, customerName, customerEmail, customerPhone, amount }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await paymentService.initiatePayment({
        orderId: orderId || "ORD-" + Date.now(),
        productName: "E-Commerce Order",
        amount: amount || 0,
        customerName: customerName || "Customer",
        customerEmail: customerEmail || "",
        customerPhone: customerPhone || "",
      });

      if (response.payment_url) {
        // Add orderId to the return URL so PaymentSuccess can track it
        const paymentUrl = new URL(response.payment_url);
        const returnUrl = new URL(window.location.origin + "/payment-success");
        returnUrl.searchParams.set('orderId', orderId);
        
        // Store orderId temporarily for reference
        sessionStorage.setItem('lastOrderId', orderId);
        
        // Redirect to Khalti payment page
        window.location.href = response.payment_url;
      } else {
        setError("Failed to initiate payment. Please try again.");
      }
    } catch (err) {
      console.error("Payment error:", err);
      setError(err.message || "Payment initiation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-100 text-emerald-700 rounded-lg border border-emerald-300">
        <CheckCircle2 className="w-5 h-5" />
        <span className="font-medium">Payment Initiated</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={handlePayment}
        disabled={loading || !amount || amount <= 0}
        className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-600/40"
      >
        {loading ? (
          <>
            <Loader className="w-5 h-5 animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            <span>💳 Pay with Khalti</span>
            <span className="text-sm opacity-90">Rs. {Number(amount || 0).toLocaleString("en-IN")}</span>
          </>
        )}
      </button>

      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-800">Payment Error</p>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentButton;
