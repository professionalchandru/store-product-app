const jwt                               = require('jsonwebtoken');

/**
 * Authentication middleware to verify user using JWT token
 * @returns authorised user
 * @param {string} jwt_token
 */

module.exports = function auth(req, res, next) {

    // const token = req.cookies.token
    const token = req.headers.token

    if (!token) return res.status(401).send({ session: 'Access Denied... Please Login with valid user' });

    try {

        const verified = jwt.verify(token, process.env.TOKEN_SECRET)

        req.user = verified;

        next();

    } catch (err) {

        if (err) {

            console.log(err);

            return res.status(400).send({session:'Oops...! Session Expired. Please login again'});

        }
    }
}
