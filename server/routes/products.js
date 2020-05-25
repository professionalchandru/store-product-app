const router                            = require('express').Router();

const redis                             = require('redis');

//import product model
const { productModelInstance }          = require('../models/productmodel');

//import validatation for products
const { Product }                       = require('../validation');

//Import JWT tokens as authentication middleware
const auth                              = require('../middlewares/auth');

/**
 * TODO LIST THE PRODUCTS IN DASHBOARD SHOULD BE MODIFY IN FURTHER UPDATES
 * End point for list the all products in dashabord, view engine user interface call
 * @async
 * @returns All products in collection
 */

router.get('/', auth, async (req, res) => {

  try {

    const viewProducts = await productModelInstance().products()

    if (!viewProducts) return res.status(200).send({error: 'Sorry... No product is available...!'});

    res.status(200).send(viewProducts);

  } catch (err) {

    if (err) {      

      res.status(400).send({ error: err })

    }
  }
});

/**
 * End point for create new product
 * @async
 * @returns {Promise} new product
 * @
 */

router.post('/insert', auth, async (req, res) => {

  //Validate products
  const validate = Product.add(req.body);

  if (validate.error == null) {

    try {

      //Create Product insance for Product class
      const productInstance = productModelInstance();

      const verifyProductData = {

        name: req.body.name

      }

      //Get the products form DB using product class
      const searchProduct = await searchData(verifyProductData)

      if (searchProduct) return res.status(200).send({ error: verifyProductData.name + ' is already available' })

      let productData = {

        name: req.body.name,
        category: req.body.category,
        price: req.body.price,
        quantity: req.body.quantity,
        description: req.body.description

      }

      let insertedProduct = await productInstance.createProduct(productData)

      return res.status(201).send({ success: insertedProduct.name + ' is added successfully' })

    } catch (err) {

      if (err) {

        console.log(err);

        return res.status(400).send({ error: err })
      }
    }
  } else {
    console.log(validate.error.message);
    return res.status(200).send({ error: validate.error.message })
  }

});

/**
 * End point for get product by id
 */

router.get('/:_id', auth, async (req, res) => {

  try {

    _id = req.params._id

    //Get the products form DB using product class
    const searchProduct = await productModelInstance().searchProductById(_id)

    if (!searchProduct) return res.status(200).send({ error: 'Product is not available' })

    // Data should fill in viewproducts handlebars
    let product = searchProduct

    res.status(200).send(product)

  } catch (err) {

    res.status(400).send(err)

  }
})

/**
 * End point for edit the product 
 * @async
 * @returns {Promise} updated product
 */

router.patch('/edit/:_id', auth, async (req, res) => {
  
  const validate = Product.edit(req.body);

  if (validate.error == null) {

    try {

      //Create Product insance for Product class
      const productInstance = productModelInstance();

      const _id = req.params._id

      //Get the products form DB using product class
      const product = await productInstance.searchProductById(_id)

      if (!product) return res.status(200).send({ error: 'Invalid product' });

      const productData = {

        _id: _id,
        name: req.body.name,
        category: req.body.category,
        price: req.body.price,
        quantity: req.body.quantity,
        description: req.body.description

      }

      const editProduct = await productInstance.editProduct(productData);

      res.status(200).send({ success: product.name +' Modified successfully.' });

    } catch (err) {

      if (err) {

        res.status(400).send(err)

      }
    }
  } else {

    console.log(validate.error.message);

    res.status(200).send({ error: validate.error.message });

  }
});

/**
 * End point for update likes by each click on userinterface
 * @async
 * @returns Like for purticular product on redis database
 */

router.patch('/like/:_id', auth, async (req, res) => {

  try {

    //Create Product insance for Product class
    const productInstance = productModelInstance();

    const  _id = req.params._id

    //Get the products form DB using product class
    const product = await productInstance.searchProductById(_id)

    if (!product) return res.status(200).send({ error: 'Invalid product' });

    const emailData = {

      _id: _id,
      email: req.user.email,
      newLike: req.body.likes

    }

    //Check user if already liked
    const likedUser = await productInstance.searchProductByEmail(emailData);

    if (likedUser) {

      return res.status(200).send({ error: 'You are already liked' })

    }

      //Update liked users on mongodb
      if (likedUser == null) {

        const likedby = await productInstance.updateLikes(emailData);

        res.status(200).send({ success: 'You are liked this products' })

      } else {

        res.status(200).send({error: 'Some error occured'})

      }

  } catch (err) {

    if (err) {

      res.status(400).send({error: 'errss'})

    }
  }
});

/**
 * End point for delete the product in Products collection
 * @async
 * @returns {Promise} Deleted the product
 */

router.delete('/:_id', auth, async (req, res) => {

  try {

    //Create Product insance for Product class
    const productInstance = productModelInstance();

    const _id = req.params._id

    const like = _id.toString();

    //Get the products form DB using product class
    const product = await productInstance.searchProductById(_id)

    if (!product) return res.status(200).send({ error:'Invalid product' });

    //Delete products and likes
    const deleteProduct = await productInstance.deleteProduct(_id);

    return res.status(200).send({ success: product.name+ ' is deleted successfully' });

  } catch (err) {

    if (err) {

     return res.status(400).send({ error: err });

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
