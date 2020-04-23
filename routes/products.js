const router = require('express').Router();

//Import product model for mongoose schema
const productModel = require('../models/productmodel');

//import validatation for products
const { insertProductValidation, editProductValidation, editProductLikeValidation } = require('../validation');

//Import JWT tokens as authentication middleware
const auth = require('../middlewares/auth');


//Insert products
router.post('/insert', auth, async(req, res) => {
    const product = new productModel({
        name: req.body.name,
        category: req.body.category,
        price: req.body.price,
        quantity: req.body.quantity,
        description: req.body.description
    });

    //Validate products
    const validate = insertProductValidation(product.toObject());

    if (validate.error == null) {
        try {
            const newProduct = await product.save();
            res.status(200).send(newProduct);
        } catch (err) {
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
        }
    } else {
        console.log(validate.error.message);
        res.status(400).send(validate.error.message);
    }

});

//View Products(list)
router.get('/view', auth, async(req, res) => {
    try {
        const viewProducts = await productModel.find().sort({ name: 1 })
        if (!viewProducts) return res.status(200).send('No product is available');
        res.status(200).json(viewProducts);
    } catch (err) {
        if (err) {
            console.log(err)
            res.json({ message: err })
        }
    }
});

//Edit Product
router.patch('/:name', auth, async(req, res) => {
    //Validate product
    const validate = editProductValidation(req.body);
    if (validate.error == null) {
        try {
            const product = await productModel.findOne({ name: req.params.name });
            if (!product) return res.status(400).send(req.params.name + ' is Invalid product');

            const editProduct = await productModel.updateOne({ name: req.params.name }, { $set: { name: req.body.name, category: req.body.category, price: req.body.price, quantity: req.body.quantity, description: req.body.description } });
            res.send(req.params.name + ' Modified successfully');
        } catch (err) {
            if (err) {
                console.log(err);
                res.json(err)
            }
        }
    } else {
        console.log(validate.error.message);
        res.status(400).json({ message: validate.error.message });
    }
});

//Edit Product Likes
router.patch('/:name/:like', auth, async(req, res) => {
    //Validate product
    const validate = editProductLikeValidation(req.body);
    if (validate.error == null) {
        try {

            //Check if product is avaliable
            const product = await productModel.findOne({ name: req.params.name });
            if (!product) return res.status(400).send(req.params.name + ' is Invalid product');

            //Check user if already liked
            const email = req.user.email
            const likedUser = await productModel.findOne({ likedBy: email });

            if (likedUser) {
                return res.status(400).send('You are already liked')
            }

            if (likedUser == null) {
                const like = await productModel.updateOne({ name: req.params.name }, { $push: { likedBy: req.user.email }, $inc: { likes: 1 } });
                res.send('Likes added for ' + req.params.name + ' successfully.');
            }
        } catch (err) {
            if (err) {
                console.log(err);
                res.json(err)
            }
        }
    } else {
        console.log(validate.error.message);
        res.status(400).json({ message: validate.error.message });
    }
});

// Delete the product
router.delete('/:name', auth, async(req, res) => {
    try {
        const product = await productModel.findOne({ name: req.params.name });
        if (!product) return res.status(400).send(req.params.name + ' is Invalid product');

        const deleteProduct = await productModel.deleteOne({ name: req.params.name });
        res.send(req.params.name + ' is deleted successfully');
        // res.json(deleteProduct);
    } catch (err) {
        if (err) {
            console.log(err)
            res.json({ message: err });
        }
    }
});

module.exports = router;