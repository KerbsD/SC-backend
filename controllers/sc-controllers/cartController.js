const Shoe = require('../../model/Shoe');
const Cart = require('../../model/Cart');
const mongoose = require("mongoose");

const handleCartItems = async (req, res) => {
    const { user_id, items } = req.body;

    if (!items?.length) return res.status(400).json({ message: "no bueno" });
    if (!user_id) return res.status(400).json({ message: "User ID is required." });

    const detailsArray = [];
    let isStockAvailable;
    let isSizeAvailable = true;
    let deets

    try {
        for (const item of items) {
            const { product_id } = item;
            const { size } = item;

            // Validate product_id
            if (!mongoose.Types.ObjectId.isValid(product_id)) {
                return res.status(400).json({ message: `Invalid product ID: ${product_id}` });
            }

            // Find product
            const product = await Shoe.findOne({ _id: product_id }).exec();
            if (!product) {
                return res.status(404).json({ message: `Product not found with ID: ${product_id}` });
            }

            const details = {
                brand: product.brand,
                model: product.model,
                color: product.color,
                price: product.price,
            }

            const availableSizes = product.size;
            const availability = availableSizes.includes(size) ? details.size = size : isSizeAvailable = false;

            const stocks = product.stocks.map(stockMap => Object.fromEntries(stockMap));
            const sizeStock = stocks.find(stock => stock.size === availability);

            if (sizeStock === undefined) {
                console.log(`Size ${availability} is not in the list.`);
            } else if (sizeStock.stock === 0) {
                console.log(`Size ${availability} is out of stock.`);
                isStockAvailable = false;
            } else {
                console.log(`Size ${availability} has stock: ${sizeStock.stock}.`);
                isStockAvailable = true;
            }

            detailsArray.push(details);
        }

        for (const details of detailsArray) {
            deets = details
        }

        if (!isSizeAvailable) return res.status(400).json({ message: `Size not available.` });

        if (!isStockAvailable) return res.status(400).json({ message: `Stock not available.` });

        const result = await Cart.create({
            user_id,
            items: items.map(item => ({
                product_id: item.product_id,
                size: item.size,
                quantity: item.quantity,
                details: deets
            })),
        });

        res.status(201).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
};

module.exports = {
    handleCartItems
}