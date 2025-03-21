// const mongoose = require('mongoose');
// const Stripe = require("stripe");
// const dotenv = require("dotenv");
// const Order = require("../Model/Order.js");

// dotenv.config();
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// const createCheckoutSession = async (req, res) => {
//   try {
//     const { userId, cartItems } = req.body;

//     if (!cartItems || cartItems.length === 0) {
//       return res.status(400).json({ error: "Cart is empty" });
//     }

//     const line_items = cartItems.map((item) => ({
//       price_data: {
//         currency: "inr",
//         product_data: {
//           name: item.name,
//         },
//         unit_amount: item.price * 100,
//       },
//       quantity: item.quantity,
//     }));

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       line_items,
//       mode: "payment",
//       success_url: "http://localhost:3008/success",
//       cancel_url: "http://localhost:3008/cancel",
//     });

//     const newOrder = new Order({
//       userId,
//       products: cartItems,
//       totalAmount: cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
//       paymentStatus: "Pending",
//       paymentId: session.id,
//     });

//     await newOrder.save();

//     res.json({ id: session.id });
//   } catch (error) {
//     console.error("Stripe Checkout Error:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// module.exports = { createCheckoutSession };
