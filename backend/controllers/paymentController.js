import { khaltiPayment, khaltiLookup } from "../utils/khaltiAPI.js";

export const initiatePayment = async (req, res) => {
  try {
    // Validate environment variables
    if (!process.env.PAYMENT_RETURN_URL) {
      console.error("❌ PAYMENT_RETURN_URL is not set in environment variables");
      return res.status(500).json({
        success: false,
        message: "Payment configuration error. Please contact support.",
      });
    }

    if (!process.env.WEBSITE_URL) {
      console.error("❌ WEBSITE_URL is not set in environment variables");
      return res.status(500).json({
        success: false,
        message: "Payment configuration error. Please contact support.",
      });
    }

    const payload = {
      return_url: process.env.PAYMENT_RETURN_URL,
      website_url: process.env.WEBSITE_URL,
      amount: req.body.amount * 100,
      purchase_order_id: req.body.orderId,
      purchase_order_name: req.body.productName || "Order",
      customer_info: {
        name: req.body.customerName || "Customer",
        email: req.body.customerEmail || "",
        phone: req.body.customerPhone || "",
      },
    };

    console.log(`💳 Initiating Payment for Order: ${payload.purchase_order_id}`);
    console.log(`   - Amount: Rs. ${req.body.amount}`);
    console.log(`   - Customer: ${payload.customer_info.name}`);
    console.log(`   - Return URL: ${payload.return_url}`);
    
    const result = await khaltiPayment(payload);

    console.log(`✅ Payment Initiated Successfully`);
    console.log(`   - PIDX: ${result.pidx}`);
    console.log(`   - Payment URL: ${result.payment_url}`);

    res.json({
      pidx: result.pidx,
      payment_url: result.payment_url,
    });
  } catch (error) {
    console.error("❌ Payment initiation error:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: "Payment initiation failed",
      error: error.response?.data || error.message,
    });
  }
};

export const lookupPayment = async (req, res) => {
  try {
    const { pidx } = req.body;
    if (!pidx) {
      return res.status(400).json({ success: false, message: "PIDX is required" });
    }
    
    console.log(`🔍 Payment Lookup: Verifying PIDX: ${pidx}`);
    const result = await khaltiLookup(pidx);
    console.log(`✅ Payment Lookup Result:`, result);
    console.log(`   - Payment Status: ${result.payment_status}`);
    console.log(`   - Amount: ${result.amount}`);
    console.log(`   - Transaction ID: ${result.transaction_id}`);
    
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("❌ Payment lookup error:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: "Payment lookup failed",
      error: error.response?.data || error.message,
    });
  }
};
