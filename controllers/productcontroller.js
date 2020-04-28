// Import data model for products collection from mongodb schema
const { productModel } = require('../models/productmodel');

/**
 * Data store class for product collection
 * @class ProductModel
 */
class ProductModel {

    /**
     * This constructor will create _productModel instance
     * @constructor
     */
    constructor() {
        this._productModel = productModel;
    }

    /**
     * This fuction will create new product
     * @param {object} _productObj 
     * @returns {promise} new product
     * @memberof ProductModel
     * @async
     */
    async createProduct(_productObj) {
        try {
            let productRecord = this._productModel.create(_productObj);
            return productRecord
        } catch (err) {
            console.log(err)
        }
    }

    /**
     * This fuction can used for edit already existing product
     * @param {object} _productObj 
     * @returns {promise} update product
     * @memberof ProductModel
     * @async
     */
    async editProduct(_productObj) {
        try {
            let productRecord = this._productModel.updateOne({ name: _productObj.oldName }, { $set: { name: _productObj.name, category: _productObj.category, quantity: _productObj.quantity, price: _productObj.price, description: _productObj.description } });
            return productRecord
        } catch (err) {
            console.log(err)
        }
    }

    /**
     * This fuction will delete existing product
     * @param {object} _deleteObj 
     * @returns {promise} delete product
     * @memberof ProductModel
     * @async
     */
    async deleteProduct(_deleteObj) {
        try {
            let productRecord = this._productModel.deleteOne({ name: _deleteObj.name });
            return productRecord
        } catch (err) {
            console.log(err)
        }
    }

    /**
     * This fuction uses to search existing product
     * @param {object} _searchObjj 
     * @returns {promise} searched product
     * @memberof ProductModel
     * @async
     */
    async searchProduct(_searchObjj) {
        try {
            let productRecord = this._productModel.findOne({ name: _searchObjj.name });
            return productRecord
        } catch (err) {
            console.log(err)
        }
    }

    /**
     * This fuction uses to search existing product by email to change the likedUser array on mongodb
     * @param {object} _emailObj 
     * @returns {promise} 
     * @memberof ProductModel
     */
    async searchProductByEmail(_emailObj) {
        try {
            let productRecord = this._productModel.findOne({ name: _emailObj.name, likedBy: _emailObj.email });
            return productRecord
        } catch (err) {
            console.log(err)
        }
    }

    /**
     * This fuction uses to like existing product 
     * @param {object} _emailObj 
     * @returns {promise} 
     * @memberof ProductModel
     */
    async updateLikes(_emailObj) {
        try {
            let productRecord = this._productModel.updateOne({ name: _emailObj.name }, { $push: { likedBy: _emailObj.email } });
            return productRecord
        } catch (err) {
            console.log(err)
        }
    }
}


let _productModelInstance = null;

/**
 * Instance of ProductModel
 * @param {object} name of the product
 * @returns {Promise} CURD operation of Products collection
 */
exports.productModelInstance = function() {
    if (!_productModelInstance) _productModelInstance = new ProductModel()
    return _productModelInstance;
}