import Order from "../models/Order.js";

export const createOrder = async (req, res) => {
  const { items, total } = req.body;

  const order = await Order.create({
    user: req.user._id,
    items,
    total,
  });

  res.json(order);
};

export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate("items.product");  //populate is used to get the product details in the order i items under the baisis of the product id stored in the order items. It replaces the product id with the actual product details from the Product collection.
  res.json(orders);
};

// admin get all orders done by all users
export const getAllOrders = async (req, res) => {
  const orders = await Order.find()
    .populate("user")
    .populate("items.product")
    .sort({ createdAt: -1 });
  res.json(orders);
};

//admin update order status as pending, shipped or delivered
export const updateOrderStatus = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.status = req.body.status || order.status;
    const updated = await order.save();
    res.json(updated);
  } else {
    res.status(404).json({ message: "Order not found" });
  }
};

// Update payment status after payment verification
export const updatePaymentStatus = async (req, res) => {
  const { orderId, paymentStatus, paymentId } = req.body;

  if (!orderId) {
    console.warn("⚠️ updatePaymentStatus: Order ID is required");
    return res.status(400).json({ 
      success: false, 
      message: "Order ID is required" 
    });
  }

  try {
    console.log(`💰 Updating Payment Status for Order: ${orderId}`);
    console.log(`   - Payment Status: ${paymentStatus}`);
    console.log(`   - Payment ID: ${paymentId}`);
    
    const order = await Order.findById(orderId).populate("user").populate("items.product");

    if (!order) {
      console.error(`❌ Order not found: ${orderId}`);
      return res.status(404).json({ 
        success: false, 
        message: "Order not found" 
      });
    }

    console.log(`✅ Order found - Current Status: ${order.status}, Payment Status: ${order.paymentStatus}`);

    order.paymentStatus = paymentStatus;
    if (paymentId) order.paymentId = paymentId;
    
    // When payment is completed, update order status to Confirmed
    if (paymentStatus === "Completed") {
      order.status = "Confirmed";
      console.log(`🔄 Order status updated: Pending → Confirmed`);
    }

    const updated = await order.save();
    
    console.log(`✅ Order Updated Successfully`);
    console.log(`   - Order ID: ${updated._id}`);
    console.log(`   - Payment Status: ${updated.paymentStatus}`);
    console.log(`   - Order Status: ${updated.status}`);
    
    res.json({
      success: true,
      message: `Order payment updated to ${paymentStatus} and order status to ${order.status}`,
      order: updated,
    });
  } catch (err) {
    console.error(`❌ Error updating payment status for Order ${orderId}:`, err);
    console.error(`   - Error Message: ${err.message}`);
    console.error(`   - Error Stack: ${err.stack}`);
    res.status(500).json({ 
      success: false, 
      message: "Failed to update payment status",
      error: err.message 
    });
  }
};