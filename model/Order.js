const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    ordered_by: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        address: { type: String, required: true },
        number: {type: Number, required: true}
    },
    items: [
        {
            product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'shoes', required: true },
            name: { type: String, required: true },
            size: { type: Number, required: true },
            quantity: { type: Number, required: true, min: 1 },
            price: { type: Number, required: true }
        }
    ],
    total_amount: { type: Number, required: true },
    payment_method: { type: String, require: true},
    order_status: { type: String, enum: ['Processing', 'Shipped', 'Delivered', 'Canceled'], default: 'Processing' },
    ordered_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', OrderSchema);
