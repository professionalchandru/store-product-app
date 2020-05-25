const mongoose                          = require('mongoose');
/**
 * Schema model for Users collection in Mongo DB
 */
const userSchema = new mongoose.Schema({

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
});

/**
 * Users collection schema model
 */
module.exports.userModel = userSchema
