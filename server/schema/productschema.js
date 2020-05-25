const mongoose                          = require('mongoose');

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
    
    likes: {
        type: Number,
        default: 0
    },

    likedBy: {

        type: Array

    }
});

/**
 * Product collection schema model
 */
module.exports.productModel = productSchema
