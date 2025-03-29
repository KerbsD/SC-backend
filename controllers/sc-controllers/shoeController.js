const Shoe = require('../../model/Shoe');
const Cart = require('../../model/Cart');
const mongoose = require("mongoose");

const handleAddShoe = async (req, res) => {
    const requiredFields = ['brand', 'model', 'color', 'size', 'price', 'description', 'images', 'stocks'];

    for (const field of requiredFields) {
        if (!req.body?.[field]) {
            return res.status(401).json({ "message": `Shoe ${field} required.` });
        }
    }

    try {
        const { brand, model, color, size, price, description, images, stocks } = req.body;

        const result = await Shoe.create({
            brand,
            model,
            color,
            size,
            price,
            description,
            images,
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

const handleCurrentShoe = async (req, res) => {
    const { id } = req.params;
    const shoeDetails = await Shoe.findById(id);    
    if (!shoeDetails) return res.status(204).json({ 'message': 'No shoe found.' });
    res.json(shoeDetails);
}

module.exports = {
    handleAddShoe,
    getAllShoe,
    handleCurrentShoe
}