import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        qty: Number,
      },
    ],
    total: Number,
    status: { // Pending, Processing, Shipped, Delivered, Cancelled
      type: String,
      default: "Pending",
    },
    paymentStatus: { // Pending, Completed, Failed
      type: String,
      default: "Pending",
    },
    paymentId: { // Khalti PIDX
      type: String,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;