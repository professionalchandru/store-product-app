const mongoose = require('mongoose');

/**
 * Schema model for Products collection in Mongo DB
 */
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    description: {
        type: String
    },
    created_dt: {
        type: Date,
        default: Date.now
    },
    likedBy: {
        type: Array
    }
});

/**
 * Product collection schema structure model
 */
module.exports.productModel = mongoose.model('Products', productSchema);