const mongoose = require('mongoose');

const shoeSchema = new mongoose.Schema({
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
        required: true
    },
    size: {
        type: [Number],
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    available: {
        type: Boolean,
        default: true
    },
    description: {
        type: String,
        maxlength: 500, // Limit description length to 500 characters
        default: null
    },
    // images: {
    //     type: [String], // Array of image URLs or paths
    // },
    stocks: [{
        type: Map,
        of: Number // Maps sizes to stock quantities
    }]
});

module.exports = mongoose.model('Shoe', shoeSchema);