const Order = require("../../model/Order");

const handleNewOrder = async (req, res) => {
    const { ordered_by, items, total_amount, payment_method } = req.body;

    if (!items?.length) return res.status(400).json({ message: "Invalid Item" });
    if (!ordered_by) return res.status(400).json({ message: "Missing customer details." });
    if (!total_amount) return res.status(400).json({ messgae: "Order Total Missing." })
    if (!payment_method) return res.status(400).json({ messgae: "Payment Method is Missing." })

    try {
        const result = await Order.create({
            ordered_by,
            items: items,
            total_amount,   
            payment_method
        })

        res.status(201).json(result)
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
}

module.exports = {
    handleNewOrder
}