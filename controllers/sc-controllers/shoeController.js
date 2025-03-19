const Shoe = require('../../model/Shoe');
const Cart = require('../../model/Cart');
const mongoose = require("mongoose");

const handleAddShoe = async (req, res) => {
    const requiredFields = ['brand', 'model', 'color', 'size', 'price', 'stocks'];

    for (const field of requiredFields) {
        if (!req.body?.[field]) {
            return res.status(401).json({ "message": `Shoe ${field} required.` });
        }
    }

    try {
        const { brand, model, color, size, price, stocks } = req.body;

        const result = await Shoe.create({
            brand,
            model,
            color,
            size,
            price,
            stocks
        });

        res.status(201).json(result);
    } catch (err) {
        console.error("Error creating shoe:", err);
    }
}

const getAllShoe = async (req, res) => {
    const shoes = await Shoe.find();
    if (!shoes) return res.status(204).json({ 'message': 'No shoes listed for now.' });
    res.json(shoes);
}

const handleCartItems = async (req, res) => {
    const { user_id, items } = req.body;

    if (!items?.length) return res.status(400).json({ message: "no bueno" });
    if (!user_id) return res.status(400).json({ message: "User ID is required." });

    try {
        for (const item of items) {
            const { product_id } = item;

            // Validate product_id
            if (!mongoose.Types.ObjectId.isValid(product_id)) {
                return res.status(400).json({ message: `Invalid product ID: ${product_id}` });
            }

            // Find product
            const product = await Shoe.findOne({ _id: product_id }).exec();
            if (!product) {
                return res.status(404).json({ message: `Product not found with ID: ${product_id}` });
            }
        }

        // Calculate total price
        const total_price = items.reduce((acc, item) => acc + item.quantity * item.price, 0);

        // Create cart
        const result = await Cart.create({
            user_id,
            items: items.map(item => ({
                product_id: item.product_id,
                brand: item.brand,
                size: item.size,
                color: item.color,
                quantity: item.quantity,
                price: item.price,
            })),
            total_price,
        });

        res.status(201).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
};


module.exports = {
    handleAddShoe,
    getAllShoe,
    handleCartItems
}