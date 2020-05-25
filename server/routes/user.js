const router                            = require('express').Router();

const bcrypt                            = require('bcryptjs');

//Import user model
const { userModelInstance }             = require('../models/usermodel');

//Import Joi Validation
const { User }                          = require('../validation');

/**
 * create new user for access our application
 * @async
 * @returns {object} created user
 * @param {object} userDetails name, email, password
 */
router.post('/register', async (req, res) => {

  //create user instance for userModel class
  const userInstance = userModelInstance();

  //Validation applied here
  const validate = User.register(req.body);

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

        return res.status(200).send({ error: req.body.email + ' is already exist' });

      }

      const newUser = await userInstance.createUser(userData);

      res.status(200).send({ success: newUser.email + ' is added sucessfully' })

    } catch (err) {

      if (err) {

        res.status(400).send({ error: err })

      }
    }

  } else {

    res.status(200).send({ error: validate.error.message });

  }
});

/**
 * Login in to our app
 * @returns jwt token for authorised user
 * @param {object} userDetails
 * @async
 */
router.post('/login', async (req, res) => {

  //create user instance for userModel class
  const userInstance = userModelInstance();

  //Joi validation for user inputs
  const validate = User.login(req.body);

  if (validate.error == null) {

    //Find existing user
    const user = await searchUser(req.body.email)

    if (!user) {

      return res.status(200).send({ error: req.body.email + " doesn't exist" });

    }

    const userData = {

      name: user.name,

      email: user.email,

      existingPassword: user.password,

      password: req.body.password

    }

    //Check password
    const password = await userInstance.verifyUser(userData);

    if (!password) {

      return res.status(200).send({ error: "Invalid Password" });

    }

    const token = await userInstance.tokenGenerator(userData);

    // res.cookie('token', token, { maxAge: 3600 * 1000 });
    res.status(200).send({success: 'Successfully loged in', token: token})

    // res.end()
  } else {
    console.log(validate.error.message)
    // res.status(400).send(validate.error.message)
    res.status(200).send({ error: validate.error.message });
  }

});

/**
 * This fuction help to find a existing user
 * @async
 * @param {string} email
 * @returns user
 */
async function searchUser(email) {

  const userInstance = userModelInstance();

  const searchedUser = userInstance.searchUser(email)

  return searchedUser;
  
}

module.exports = router;
