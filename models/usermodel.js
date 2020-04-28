const mongoose = require('mongoose');

/**
 * Schema model for Users collection in Mongo DB
 */
const userSchema = {
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
}

/**
 * Users collection schema structure model
 */
module.exports.userModel = mongoose.model('Users', userSchema);