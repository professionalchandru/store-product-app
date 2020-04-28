const router = require('express').Router();
const bcrypt = require('bcryptjs');

//Import user controller
const { userModelInstance } = require('../controllers/usercontroller');

//Import Joi Validation
const { registerValidation, loginValidation } = require('../validation');

//Import Schema models
const userModel = require('../models/usermodel.js');

/**
 * Register user view engine user interface call
 * @async
 */
router.get('/register', async(req, res, next) => {
    res.render('register');
})

/**
 * create new user for access our application
 * @async
 * @returns {object} created user
 * @param {object} userDetails name, email, password
 */
router.post('/register', async(req, res) => {
    //create user instance for userModel class
    const userInstance = userModelInstance();

    //Validation applied here
    const validate = registerValidation(req.body);
    if (validate.error == null) {
        try {
            //Generate hash password
            const salt = await bcrypt.genSalt(12)
            const hashPassword = await bcrypt.hash(req.body.password, salt)

            const userData = {
                name: req.body.name,
                email: req.body.email,
                password: hashPassword
            };

            //Check existing user
            const userExist = await searchUser(req.body.email)
            if (userExist) {
                return res.status(400).render('register', { error: req.body.email + ' is already exist' });
            }

            const newUser = await userInstance.createUser(userData);
            res.status(200).render('register', { success: newUser.email + ' is added sucessfully' })
        } catch (err) {
            if (err) {
                res.status(400).render('register', { error: err })
            }
        }
    } else {
        res.status(400).render('register', { error: validate.error.message });
    }
});

/**
 * Login in to our app
 * @returns jwt token for authorised user
 * @param {object} userDetails
 * @async 
 */
router.post('/login', async(req, res) => {
    //create user instance for userModel class
    const userInstance = userModelInstance();

    //Joi validation for user inputs
    const validate = loginValidation(req.body);
    if (validate.error == null) {

        //Find existing user
        const user = await searchUser(req.body.email)
        if (!user) {
            return res.render('login', { error: req.body.email + " doesn't exist" });
        }

        const userData = {
            email: user.email,
            existingPassword: user.password,
            password: req.body.password
        }

        //Check password
        const password = await userInstance.verifyUser(userData);
        if (!password) {
            return res.render('login', { error: "Invalid Password" });
        }

        const token = await userInstance.tokenGenerator(userData);
        res.cookie('token', token, { maxAge: 3600 * 1000 });
        res.redirect('/api/products/search');
        res.end()
    } else {
        console.log(validate.error.message)
            // res.status(400).send(validate.error.message)
        res.status(400).render('login', { error: validate.error.message });
    }

});

/**
 * This fuction help to find a existing user
 * @async
 * @param {string} name
 * @returns user 
 */
async function searchUser(email) {
    const userInstance = userModelInstance();
    const searchedUser = userInstance.searchUser(email)
    return searchedUser;
}

module.exports = router;