const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to Users Collection
    required: true,
  },
  items: [
    {
      product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", // Reference to Products Collection
        required: true,
      },
      brand: {
        type: String,
        required: true
      },
      size: {
        type: Number,
        required: true,
      },
      color: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      price: {
        type: Number,
        required: true,
        min: 0
      }
    },
  ],
  total_price: {
    type: Number,
    required: true,
    min: 0,
  },
  created_at: {
    type: Date,
    default: Date.now, // Automatically set current date
  },
  updated_at: {
    type: Date,
    default: Date.now, // Automatically set current date
  },
});

module.exports = mongoose.model("Cart", CartSchema);
