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

module.exports = {
    handleAddShoe,
    getAllShoe,
}