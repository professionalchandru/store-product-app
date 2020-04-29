const mongoose                          = require('mongoose');

// Import data model for products collection from mongodb schema
const { productModel }                  = require('../schema/productschema');

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

        this._productModel = mongoose.model('Products', productModel);
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

            let productRecord = await this._productModel.create(_productObj);

            return productRecord

        } catch (err) {

            console.log(err)
            return err
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

            let productRecord = await this._productModel.updateOne({ _id: _productObj._id }, { $set: { name: _productObj.name, category: _productObj.category, quantity: _productObj.quantity, price: _productObj.price, description: _productObj.description } });

            return productRecord

        } catch (err) {

            console.log(err)
            return err
        }
    }

    /**
     * This fuction will delete existing product
     * @param {string} _id
     * @returns {promise} delete product
     * @memberof ProductModel
     * @async
     */

    async deleteProduct(_id) {
        try {

            let productRecord = await this._productModel.deleteOne({ _id: _id });

            return productRecord

        } catch (err) {

            console.log(err)
            return err
        }
    }

      /**
     * This fuction will return all products in collection
     * @returns {promise} All products in collection
     * @memberof ProductModel
     * @async
     */

    async products() {
      try {

          let productRecord = await this._productModel.find();

          return productRecord

      } catch (err) {

          console.log(err)
          return err
      }
  }

    /**
     * This fuction uses to search existing product
     * @param {object} _searchObj
     * @returns {promise} searched product
     * @memberof ProductModel
     * @async
     */

    async searchProduct(_searchObj) {
        try {

            let productRecord = await this._productModel.findOne({ name: _searchObj.name });

            return productRecord

        } catch (err) {

            console.log(err)
            return err
        }
    }

    /**
     * This fuction uses to search existing product
     * @param {string} _id
     * @returns {promise} searched product
     * @memberof ProductModel
     * @async
     */

    async searchProductById(_id) {
      try {

          let productRecord = await this._productModel.findOne({ _id: _id });

          return productRecord

      } catch (err) {

          console.log(err)
          return err
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

            let productRecord = await this._productModel.findOne({ _id: _emailObj._id, likedBy: _emailObj.email });

            return productRecord

        } catch (err) {

            console.log(err)
            return err
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

            let productRecord = await this._productModel.updateOne({ _id: _emailObj._id }, { $push: { likedBy: _emailObj.email } });

            return productRecord

        } catch (err) {

            console.log(err)
            return err
        }
    }
}


let _productModelInstance = null;

/**
 * Instance of ProductModel
 * @param {object} name of the product
 * @returns {Promise} CURD operation of Products collection
 */

exports.productModelInstance = function () {

    if (!_productModelInstance) _productModelInstance = new ProductModel()

    return _productModelInstance;
}
