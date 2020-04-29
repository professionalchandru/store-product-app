const { userModel }                     = require('../schema/userschema');

const mongoose                          = require('mongoose');

const bcrypt                            = require('bcryptjs');

const jwt                               = require('jsonwebtoken');

const dotenv                            = require('dotenv').config();

/**
 * Data store class for Users collection
 * @class UserModel
 *
 */

class UserModel {

    /**
     * @constructor userModel
     */

    constructor() {

        this._userModel = mongoose.model('User', userModel)
    }

    /**
     * This function will create new user on User collection
     * @param {object} user_details name, email, password
     * @returns {Promise} created user
     * @async
     */

    async createUser(_userObj) {
        try {

            const userRecord = await this._userModel.create(_userObj)

            return userRecord

        } catch (err) {

            console.log(err)
            return err
        }
    }

    /**
     * This function will used to verify a user on User collection
     * @param {object} login_details email, password
     * @returns {Promise} verified user
     * @async
     */

    async verifyUser(_userObj) {
        try {

            const password = await bcrypt.compare(_userObj.password, _userObj.existingPassword)

            return password

        } catch (err) {

            console.log(err)
            return err
        }
    }

    /**
     * This function will used to search a user on User collection
     * @param {string} email
     * @returns user status
     * @async
     */

    async searchUser(_email) {
        try {

            const userRecord = await this._userModel.findOne({ email: _email })

            return userRecord

        } catch (err) {

            console.log(err)
            return err
        }
    }

    /**
     * This function will generate JWT token for authourised user
     * @param {object} user_details
     * @returns jwt token
     * @async
     */

    async tokenGenerator(_userObj) {
        try {

            const token = jwt.sign({ _id: _userObj._id, email: _userObj.email }, process.env.TOKEN_SECRET, { expiresIn: '5h' });

            return token;

        } catch (err) {

            console.log(err)
            return err
        }
    }
}

let _userModelInstance = null;

/**
 * Instance of userModel
 * @param {object} user_details
 * @returns {Promise} result of createUser and verifyUser
 */

exports.userModelInstance = function() {

    if (!_userModelInstance) _userModelInstance = new UserModel();

    return _userModelInstance;
}
