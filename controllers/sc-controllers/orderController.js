const Order = require("../../model/Order");
const Shoe = require('../../model/Shoe');
const Cart = require('../../model/Cart');
const mongoose = require("mongoose");

const handleNewOrder = async (req, res) => {
    const { ordered_by, items, total_amount, payment_method } = req.body;

    if (!items?.length) return res.status(400).json({ message: "Invalid Item" });
    if (!ordered_by) return res.status(400).json({ message: "Missing customer details." });
    if (!total_amount) return res.status(400).json({ messgae: "Order Total Missing." })
    if (!payment_method) return res.status(400).json({ messgae: "Payment Method is Missing." })

    console.log(ordered_by.user_id);

    try {
        await Promise.all(
            items.map(async item => {
                await Shoe.updateOne(
                    { _id: item.product_id, "stocks.size": item.size },
                    { $inc: { "stocks.$.stock": -item.quantity } }
                );
            })
        );

        const result = await Order.create({
            ordered_by,
            items: items,
            total_amount,
            payment_method
        })

        await Cart.deleteMany({ user_id: ordered_by.user_id });

        res.status(201).json(result)
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
}

module.exports = {
    handleNewOrder
}