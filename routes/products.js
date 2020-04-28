const router = require('express').Router();
const redis = require('redis');
const client = redis.createClient();

//import controller class for new product model
const { productModelInstance } = require('../controllers/productcontroller');

//import validatation for products
const { insertProductValidation, editProductValidation, searchProductValidation } = require('../validation');

//Import JWT tokens as authentication middleware
const auth = require('../middlewares/auth');

/**
 * Add products view engine user interface call 
 * @async
 */
router.get('/insert', auth, async(req, res) => {
    res.render('addproducts')
})

/**
 * create new product and sotred in mongodb
 * @async
 * @returns {Promise} new product
 * @
 */
router.post('/insert', auth, async(req, res) => {
    //Validate products
    const validate = insertProductValidation(req.body);
    if (validate.error == null) {

        try {
            //Create Product insance for Product class
            const productInstance = productModelInstance();
            const verifyProductData = {
                name: req.body.name
            }

            //Get the products form DB using product class
            const searchProduct = await searchData(verifyProductData)
            if (searchProduct) return res.render('search', { error: verifyProductData.name + ' is already available' })

            let productData = {
                name: req.body.name,
                category: req.body.category,
                price: req.body.price,
                quantity: req.body.quantity,
                description: req.body.description
            }

            let insertedProduct = await productInstance.createProduct(productData)

            res.status(200).render('addproducts', { success: insertedProduct.name + ' is added successfully' })
        } catch (err) {
            if (err) {
                console.log(err);
                res.status(400).render('addproducts', { error: err })
            }
        }
    } else {
        console.log(validate.error.message);
        res.status(400).render('addproducts', { error: validate.error.message })
    }

});

/**
 * search products view engine userinterface call
 *@async  
 */
router.get('/search', auth, async(req, res) => {
    res.render('search')
});

/**
 * search products form Products collection
 * @async  
 * @returns {Promise} searched product
 */
router.post('/search', auth, async(req, res, next) => {

    //Validate proucts using joi
    const validate = searchProductValidation(req.body);
    if (validate.error == null) {
        const verifyProductData = {
            name: req.body.name
        }

        //Get the products form DB using product class
        const searchProduct = await searchData(verifyProductData)
        if (!searchProduct) return res.render('search', { error: verifyProductData.name + ' is not available' })

        //Data should fill in viewproducts handlebars
        let name = verifyProductData.name
        let product = searchProduct
        let pname = product.name
        let pcategory = product.category
        let pquantity = product.quantity
        let pprice = product.price
        let pdescription = product.description
        let plikedby = product.likedBy

        //Fill the view products handlebars
        client.get(name, (err, obj) => {
            if (err) return res.render('search', { error: err })
            else {
                res.render('viewproducts', {
                    pname: pname,
                    pcategory: pcategory,
                    pquantity: pquantity,
                    pprice: pprice,
                    pdescription: pdescription,
                    plikedby: plikedby,
                    likes: obj
                })
            }
        })
    } else {
        return res.render('search', { error: validate.error.message });
    }
})

/**
 * TODO WILL BE REMOVED IN PRODUCTION 
 * Search product directly without submit data. Developer purpose only
 */
router.get('/:name', auth, async(req, res) => {
    try {
        const verifyProductData = {
            name: req.params.name
        }

        //Get the products form DB using product class
        const searchProduct = await searchData(verifyProductData)
        if (!searchProduct) return res.render('search', { error: 'Product is not available' })

        // Data should fill in viewproducts handlebars
        let name = productData.name
        let product = searchProduct
        let pname = product.name
        let pcategory = product.category
        let pquantity = product.quantity
        let pprice = product.price
        let pdescription = product.description
        let plikedby = product.likedBy

        //fill in viewproducts handlebars
        client.get(name, (err, obj) => {
            if (err) console.log(err)
            else {
                res.render('viewproducts', {
                    pname: pname,
                    pcategory: pcategory,
                    pquantity: pquantity,
                    pprice: pprice,
                    pdescription: pdescription,
                    plikedby: plikedby,
                    likes: obj
                })
            }
        })
    } catch (err) {
        res.json(err)
    }
})


/**
 * TODO LIST THE PRODUCTS IN DASHBOARD SHOULD BE MODIFY IN FURTHER UPDATES
 * List the all products in dashabord, view engine user interface call
 * @async
 * @returns All products in collection
 */
router.get('/view', auth, async(req, res) => {
    try {
        const viewProducts = await productModel.find()
        const docCount = await productModel.find().countDocuments()
        if (!viewProducts) return res.status(200).send('No product is available');

        res.render('list', {
            product: viewProducts
        })

        // let products = {};
        // let key = 'product'
        // products[key] = [];

        // for (let i = 0; i < docCount; i++) {
        //     client.get(viewProducts[i].name, (err, obj) => {
        //         if (err) console.log(err)
        //         else {
        //             details = {
        //                 "product": viewProducts[i],
        //                 "likes": obj
        //             }
        //             products[key].push(details);
        //         }
        //     }), () => {
        //         console.log(products)
        //         res.render('list', {
        //             product: details
        //         })
        //     }
        // }
        // console.log(viewProducts)

    } catch (err) {
        if (err) {
            console.log(err)
            res.json({ message: err })
        }
    }
});

/**
 * Edit products view engine user interface call
 * @async
 */
router.get('/edit/:name', async(req, res) => {
    const verifyProductData = {
        name: req.params.name
    }

    //Get the products form DB using product class
    const product = await searchData(verifyProductData)

    //Data to be filled in textboxes
    pname = product.name
    category = product.category
    price = product.price
    quantity = product.quantity
    description = product.description

    //render the template
    res.render('editproducts', {
        pname: pname,
        category: category,
        price: price,
        quantity: quantity,
        description: description
    })
})

/**
 * Edit the product and store it again in Products collection
 * @async
 * @returns {Promise} updated product
 */
router.patch('/edit/:name', auth, async(req, res) => {
    //Validate product
    const validate = editProductValidation(req.body);
    if (validate.error == null) {
        try {
            //Create Product insance for Product class
            const productInstance = productModelInstance();
            const verifyProductData = {
                name: req.params.name
            }

            //Get the products form DB using product class
            const product = await searchData(verifyProductData)
            if (!product) return res.status(400).render('search', { error: verifyProductData.name + ' is Invalid product' });

            const productData = {
                oldName: req.params.name,
                name: req.body.name,
                category: req.body.category,
                price: req.body.price,
                quantity: req.body.quantity,
                description: req.body.description
            }

            const editProduct = await productInstance.editProduct(productData);

            //Update likes on new product name if product name changes
            if (productData.oldName != productData.name) {
                client.get(productData.oldName, (err, obj) => {
                        client.set(productData.name, obj)
                    })
                    //Delete likes on old productname
                client.del(productData.oldName)
            }
            res.render('editproducts', { success: req.params.name + ' Modified successfully to ' + req.body.name });
        } catch (err) {
            if (err) {
                console.log(err);
                res.json(err)
            }
        }
    } else {
        console.log(validate.error.message);
        res.status(400).render('editproducts', { error: validate.error.message });
    }
});

/**
 * Update likes by each click on userinterface
 * @async
 * @returns Like for purticular product on redis database
 */
router.patch('/like/:name', auth, async(req, res) => {
    try {
        //Create Product insance for Product class
        const productInstance = productModelInstance();
        const verifyProductData = {
            name: req.params.name
        }

        //Get the products form DB using product class
        const product = await searchData(verifyProductData)
        if (!product) return res.status(400).render('search', { error: verifyProductData.name + ' is Invalid product' });

        const emailData = {
            name: req.params.name,
            email: req.user.email
        }

        //Check user if already liked
        const likedUser = await productInstance.searchProductByEmail(emailData);
        // const likedUser = await productModel.findOne({ name: req.params.name, likedBy: email });
        if (likedUser) {
            res.status(400).render('viewproducts', { error: 'You are already liked' })
        }

        //Update likes on redis server
        if (likedUser == null) {
            let name = req.params.name
            const likes = client.incrby(name, 1, (err, reply) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log(reply)
                }
            })

            //Update liked users on mongodb           
            if (likes) {
                const likedby = await productInstance.updateLikes(emailData);
                // const likedby = await productModel.updateOne({ name: req.params.name }, { $push: { likedBy: req.user.email } });
                res.status(200).render('viewproducts', { success: 'You are liked this products' })
            } else {
                res.status(400).send('Some error occured')
            }

        }
    } catch (err) {
        if (err) {
            console.log(err);
            res.json(err)
        }
    }
});

/**
 * Delete the product in Products collection
 * @async
 * @returns {Promise} Deleted the product
 */
router.delete('/:name', auth, async(req, res) => {
    try {
        //Create Product insance for Product class
        const productInstance = productModelInstance();
        const productData = {
            name: req.params.name
        }

        //Get the products form DB using product class
        const product = await searchData(verifyProductData)
        if (!product) return res.status(400).render('search', { error: productData.name + ' is Invalid product' });

        //Delete products and likes
        const deleteProduct = await productInstance.deleteProduct(productData);
        client.del(productData.name);
        res.render('search', { success: productData.name + ' is deleted successfully' });
    } catch (err) {
        if (err) {
            res.status(400).render('viewproducts', { error: err });
        }
    }
});

/**
 * Search fucition for already avaliable data
 * @async
 * @param {String} name of the product
 * @returns searchProduct
 */
async function searchData(verifyProductData) {
    const productInstance = productModelInstance();
    const searchProduct = await productInstance.searchProduct(verifyProductData);
    return searchProduct
}

module.exports = router;