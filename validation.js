const Joi = require('@hapi/joi');

/**
 * Register validation
 * @returns validated request
 * @param {object} user_details
 */
const registerValidation = data => {
    const schema = Joi.object().keys({
        name: Joi.string().min(3).max(255).required(),
        email: Joi.string().min(3).max(255).email().required(),
        password: Joi.string().min(6).required(),
    });
    return schema.validate(data);
}

/**
 * Login validation
 * @returns validated request
 * @param {object} user_details
 */
const loginValidation = data => {
    const schema = Joi.object().keys({
        email: Joi.string().min(3).max(255).email().required(),
        password: Joi.string().min(6).required()
    });
    return schema.validate(data);
}

/**
 * New product validation
 * @returns validated request
 * @param {object} product_details
 */
const insertProductValidation = data => {
    const schema = Joi.object().keys({
        name: Joi.string().min(3).max(255).required(),
        category: Joi.string().min(3).max(255).required(),
        price: Joi.number().min(1).required(),
        quantity: Joi.number().min(1).required(),
        description: Joi.string().min(3).max(255),
    });
    return schema.validate(data);
}

/**
 * Edit product validation for already available product
 * @returns validated request
 * @param {object} product_details
 */
const editProductValidation = data => {
    const schema = Joi.object().keys({
        name: Joi.string().min(3).max(255).required(),
        category: Joi.string().min(3).max(255).required(),
        price: Joi.number().min(1).required(),
        quantity: Joi.number().min(1).required(),
        description: Joi.string().min(3).max(255),
    });
    return schema.validate(data);
}

/**
 * Search already existing product validation
 * @returns validated request
 * @param {string} product_name
 */
const searchProductValidation = data => {
    const schema = Joi.object().keys({
        name: Joi.string().trim().min(3).max(255).required()
    })
    return schema.validate(data);
}

module.exports = { registerValidation, loginValidation, insertProductValidation, editProductValidation, searchProductValidation }