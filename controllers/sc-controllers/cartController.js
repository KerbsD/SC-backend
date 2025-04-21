const Shoe = require('../../model/Shoe');
const Cart = require('../../model/Cart');
const mongoose = require("mongoose");

const handleCartItems = async (req, res) => {
    const { user_id, items } = req.body;

    if (!items?.length) return res.status(400).json({ message: "Invalid Item" });
    if (!user_id) return res.status(400).json({ message: "User ID is required." });

    const detailsArray = [];
    let isStockAvailable;
    let isSizeAvailable = true;
    let deets
    let stock

    try {
        for (const item of items) {
            const { product_id, size, quantity } = item;

            if (!mongoose.Types.ObjectId.isValid(product_id)) {
                return res.status(400).json({ message: `Invalid product ID: ${product_id}` });
            }

            const product = await Shoe.findOne({ _id: product_id }).exec();
            if (!product) {
                return res.status(404).json({ message: `Product not found with ID: ${product_id}` });
            }

            const details = {
                brand: product.brand,
                model: product.model,
                color: product.color,
                price: product.price,
                image: product.images[0]
            }

            const availableSizes = product.size;
            const availability = availableSizes.includes(size) ? details.size = size : isSizeAvailable = false;

            const stocks = product.stocks.map(stock => Object.fromEntries(stock));
            const sizeStock = stocks.find(stock => stock.size == availability);

            if (sizeStock === undefined) {
                console.log(`Size ${availability} is not in the list.`);
            } else if (sizeStock.stock === 0) {
                console.log(`Size ${availability} is out of stock.`);
                isStockAvailable = false;
            } else if (quantity > sizeStock.stock) {
                console.log(`Exceeds shoe quantity.`);
                isStockAvailable = false;
            } else {
                console.log(`Size ${availability} has stock: ${sizeStock.stock}.`);
                isStockAvailable = true;
            }

            detailsArray.push(details);
            stock = sizeStock.stock
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
                stock: stock,
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

const getAllCartItems = async (req, res) => {
    try {
        if (!req?.query?.id) return res.status(400).json({ "message": 'User ID required.' });

        const raw_cart = await Cart.find({ user_id: req.query.id }).exec();
        if (!raw_cart) {
            return res.status(404).json({ message: `Cart Items not found` });
        }

        console.log(raw_cart);

        const productID = raw_cart?.map(cart => cart.items[0]?.product_id);

        const product = await Shoe.find({ _id: productID }).exec();
        if (!product) {
            return res.status(404).json({ message: `Product not found with ID: ${product_id}` });
        }

        const cart = await Cart.aggregate([
            {
                $match: {
                    user_id: new mongoose.Types.ObjectId(req.query.id), // Cast to ObjectId if necessary
                }
            },
            { $unwind: "$items" },
            {
                $group: {
                    _id: { product_id: "$items.product_id", size: "$items.size" },
                    max_order: { $max: "$items.stock" },
                    total_quantity: { $sum: "$items.quantity" }, // Sum quantities
                    details: { $first: "$items.details" },
                }
            },
            {
                $addFields: {
                    exceeds_stock: {
                        $cond: {
                            if: { $gte: ["$total_quantity", "$max_order"] },
                            then: true,
                            else: false
                        }
                    }
                }
            }
        ]);

        if (!cart || cart?.length === 0) {
            return res.status(200).json({ "message": 'Your bag is empty.', cart: [] });
        }

        res.json(cart);
    } catch (error) {
        console.error("Error retrieving cart items:", error);
        res.status(500).json({ message: 'An error occurred while retrieving cart items.' });
    }
};

const handleDeleteCartItem = async (req, res) => {
    if (!req?.body?.id && !req.body?.size) return res.status(400).json({ "message": 'Cart Item ID required.' });

    const cart = await Cart.findOne({ "items.product_id": req.body.id }).exec();

    if (!cart) {
        return res.status(200).json({ 'message': `Cart Item ID ${req.body.id} not found` });
    }
    const result = await Cart.deleteMany(
        {
            "items.product_id": req.body.id,
            "items.size": req.body.size
        }
    );
    res.json({
        message: "Item removed",
        result: result
    });
}

module.exports = {
    handleCartItems,
    getAllCartItems,
    handleDeleteCartItem
}