const User = require('../model/User');

const getAllUsers = async (req, res) => {
    const users = await User.find();
    if (!users) return res.status(204).json({ 'message': 'No users found' });
    res.json(users);
}

const deleteUser = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ "message": 'User ID required' });
    const user = await User.findOne({ _id: req.body.id }).exec();
    if (!user) {
        return res.status(204).json({ 'message': `User ID ${req.body.id} not found` });
    }
    const result = await user.deleteOne({ _id: req.body.id });
    res.json(result);
}

const getUser = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ "message": 'User ID required' });
    const user = await User.findOne({ _id: req.params.id }).exec();
    if (!user) {
        return res.status(204).json({ 'message': `User ID ${req.params.id} not found` });
    }
    res.json(user);
}

const handleUserAddress = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ "message": 'User ID required' });
    const requiredFields = ['lotNumber', 'street', 'brgy', 'city', 'zipCode', 'province'];

    for (const field of requiredFields) {
        if (!req.body?.[field]) {
            return res.status(401).json({ "message": `${field} required.` });
        }
    }

    const user = await User.findOne({ _id: req.params.id }).exec();
    if (!user) {
        return res.status(204).json({ 'message': `User ID ${req.params.id} not found` });
    }

    const { lotNumber, street, brgy, city, zipCode, province } = req.body;

    try {
        const address = `${lotNumber}, ${street} Street, ${brgy}, ${city}, ${zipCode}, ${province}`;

        const addAddress = await User.findByIdAndUpdate(
            { _id: req.params.id },
            { address },
            { new: true, runValidators: true }
        );

        if (!addAddress) {
            return res.status(204).json({ 'message': `User ID ${req.params.id} not found` });
        }

        res.status(201).json(addAddress);
    } catch (err) {
        console.error("Error creating address:", err);
    }
}


module.exports = {
    getAllUsers,
    deleteUser,
    getUser,
    handleUserAddress
}