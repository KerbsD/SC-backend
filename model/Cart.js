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
        ref: "shoes", // Reference to Products Collection
        required: true,
      },
      size: {
        type: Number,
        required: true
      },
      quantity: {
        type: Number,
        required: true
      },
      details: {
        brand: {
          type: String,
          required: true
        },
        model: {
          type: String,
          required: true
        },
        color: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
          min: 0
        },
        image: {
          type: String,
          required: true
        }
      }
    },
  ],
  created_at: {
    type: Date,
    default: Date.now, // Automatically set current date
  }
});

module.exports = mongoose.model("Cart", CartSchema);
