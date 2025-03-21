const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  distributorId: { type: mongoose.Schema.Types.ObjectId, ref: "Distributor", required: true },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ["cash", "upi"], required: true },
  status: { type: String, enum: ["Pending", "Completed"], default: "Pending" },
}, { timestamps: true });

const Order=mongoose.model('Order',orderSchema);

module.exports = Order;