import Order from "../models/Order.js";
import Product from "../models/Product.js";

// Validation helper functions
const validateOrderItems = (items) => {
  if (!items || !Array.isArray(items) || items.length === 0) {
    return { isValid: false, error: "Order must contain at least one item" };
  }

  for (let item of items) {
    // Support both 'quantity' and 'qty' field names
    const quantity = item.quantity || item.qty;
    
    if (!item.product || !quantity) {
      return { isValid: false, error: "Each item must have a product ID and quantity" };
    }
    if (!Number.isInteger(quantity) || quantity <= 0) {
      return { isValid: false, error: "Item quantity must be a positive integer" };
    }
    if (quantity > 1000) {
      return { isValid: false, error: "Item quantity is too high" };
    }
  }

  return { isValid: true };
};

const validateOrderTotal = (total) => {
  if (total === undefined || total === null) {
    return { isValid: false, error: "Order total is required" };
  }
  if (isNaN(total) || Number(total) < 0) {
    return { isValid: false, error: "Order total must be a valid positive number" };
  }
  return { isValid: true };
};

const validateShippingAddress = (shippingAddress) => {
  if (!shippingAddress) {
    return { isValid: false, error: "Shipping address is required" };
  }
  
  const requiredFields = ['fullName', 'email', 'phone', 'address', 'city'];
  for (let field of requiredFields) {
    if (!shippingAddress[field]) {
      return { isValid: false, error: `${field} is required in shipping address` };
    }
  }
  
  // Email validation
  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(shippingAddress.email)) {
    return { isValid: false, error: "Please provide a valid email address" };
  }
  
  return { isValid: true };
};

const validOrderStatuses = ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];
const validPaymentStatuses = ["Pending", "Completed", "Failed"];

export const createOrder = async (req, res) => {
  try {
    const { items, total, shippingAddress } = req.body;

    // Validate items
    const itemsValidation = validateOrderItems(items);
    if (!itemsValidation.isValid) {
      return res.status(400).json({ message: itemsValidation.error });
    }

    // Validate total
    const totalValidation = validateOrderTotal(total);
    if (!totalValidation.isValid) {
      return res.status(400).json({ message: totalValidation.error });
    }

    // Validate shipping address
    const addressValidation = validateShippingAddress(shippingAddress);
    if (!addressValidation.isValid) {
      return res.status(400).json({ message: addressValidation.error });
    }

    // Check if products exist and have sufficient stock
    for (let item of items) {
      const quantity = item.quantity || item.qty;
      const product = await Product.findById(item.product);
      
      if (!product) {
        return res.status(404).json({ message: `Product ${item.product} not found` });
      }
      if (product.countInStock < quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${product.name}. Available: ${product.countInStock}, Requested: ${quantity}` 
        });
      }
    }

    // Format items for database (ensure consistent format with 'qty')
    const formattedItems = items.map(item => ({
      product: item.product,
      qty: item.quantity || item.qty
    }));

    // Create order with shipping address
    const order = await Order.create({
      user: req.user._id,
      items: formattedItems,
      total: Number(total),
      shippingAddress: {
        fullName: shippingAddress.fullName,
        email: shippingAddress.email,
        phone: shippingAddress.phone,
        address: shippingAddress.address,
        city: shippingAddress.city,
        postalCode: shippingAddress.postalCode || '',
      },
      status: "Pending",
      paymentStatus: "Pending",
    });

    res.status(201).json({
      ...order.toObject(),
      message: "Order created successfully"
    });
  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({ message: error.message || "Failed to create order" });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const orders = await Order.find({ user: req.user._id })
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("Get My Orders Error:", error);
    res.status(500).json({ message: error.message || "Failed to fetch orders" });
  }
};

// admin get all orders done by all users
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email") // Only select necessary user fields
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("Get All Orders Error:", error);
    res.status(500).json({ message: error.message || "Failed to fetch orders" });
  }
};

// Get single order by ID (useful for order details page)
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("items.product");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if user is authorized (admin or order owner)
    if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to view this order" });
    }

    res.json(order);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: "Invalid order ID" });
    }
    console.error("Get Order By ID Error:", error);
    res.status(500).json({ message: error.message || "Failed to fetch order" });
  }
};

//admin update order status as pending, shipped or delivered
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!req.params.id) {
      return res.status(400).json({ message: "Order ID is required" });
    }

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    if (!validOrderStatuses.includes(status)) {
      return res.status(400).json({ 
        message: `Invalid status. Valid statuses are: ${validOrderStatuses.join(", ")}` 
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    const updated = await order.save();

    res.json({
      ...updated.toObject(),
      message: "Order status updated successfully"
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: "Invalid order ID" });
    }
    console.error("Update Order Status Error:", error);
    res.status(500).json({ message: error.message || "Failed to update order status" });
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

  if (!paymentStatus) {
    return res.status(400).json({ 
      success: false, 
      message: "Payment status is required" 
    });
  }

  if (!validPaymentStatuses.includes(paymentStatus)) {
    return res.status(400).json({ 
      success: false, 
      message: `Invalid payment status. Valid statuses are: ${validPaymentStatuses.join(", ")}` 
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
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid order ID" 
      });
    }
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

// Cancel order (user or admin)
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if user is authorized (admin or order owner)
    if (req.user.role !== 'admin' && order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to cancel this order" });
    }

    // Check if order can be cancelled (only Pending or Confirmed orders)
    if (order.status !== "Pending" && order.status !== "Confirmed") {
      return res.status(400).json({ 
        message: `Order cannot be cancelled because it is already ${order.status}` 
      });
    }

    order.status = "Cancelled";
    const updated = await order.save();

    res.json({
      success: true,
      message: "Order cancelled successfully",
      order: updated
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: "Invalid order ID" });
    }
    console.error("Cancel Order Error:", error);
    res.status(500).json({ message: error.message || "Failed to cancel order" });
  }
};