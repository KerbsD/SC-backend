const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true, // Ensure no duplicate emails in the database
        match: /.+\@.+\..+/ // Basic regex for email format validation
    },
    number: {
        type: String, // Using String to allow flexibility for phone numbers
        required: true,
        trim: true,
        match: /^\d+$/ // Regex to ensure only digits (no letters or special characters)
    },
    address: {
        type: String
    },
    roles: {
        User: {
            type: Number,
            default: 2001
        },
        Editor: Number,
        Admin: Number
    },
    password: {
        type: String,
        required: true
    },
    refreshToken: String
});

module.exports = mongoose.model('User', userSchema);