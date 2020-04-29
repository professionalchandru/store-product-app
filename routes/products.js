const router                            = require('express').Router();

const redis                             = require('redis');

const client                            = redis.createClient();

const util                              = require('util');

const fs                                = require('fs');

//import product model
const { productModelInstance }          = require('../models/productmodel');

//import validatation for products
const { Product }                       = require('../validation');

//Import JWT tokens as authentication middleware
const auth                              = require('../middlewares/auth');

/**
 * End point for add products user interface
 * @async
 */

router.get('/insert', auth, async (req, res) => {

  res.render('addproducts')

})

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

      if (searchProduct) return res.render('addproducts', { error: verifyProductData.name + ' is already available' })

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
 * End point for search products userinterface
 *@async
 */

router.get('/search', auth, async (req, res) => {

  res.render('search')

});

/**
 * End point for search products form Products collection
 * @async
 * @returns {Promise} searched product
 */

router.post('/search', auth, async (req, res, next) => {

  //Validate proucts using joi
  const validate = Product.search(req.body);

  if (validate.error == null) {

    const verifyProductData = {

      name: req.body.name

    }

    //Get the products form DB using product class
    const searchProduct = await searchData(verifyProductData)

    if (!searchProduct) return res.render('search', { error: verifyProductData.name + ' is not available' })

    //Data should fill in viewproducts handlebars

    let product = searchProduct

    let _id = product._id

    let like = _id.toString()

    let pname = product.name

    let pcategory = product.category

    let pquantity = product.quantity

    let pprice = product.price

    let pdescription = product.description

    let plikedby = product.likedBy

    /**
     * TODO introduce util.promisify() to use redis promises
     * Fill the view products handlebars
     */
    client.get(like, (err, obj) => {

      if (err) return res.render('search', { error: err })

      else {

        res.render('viewproducts', {

          pid : _id,
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
 * End point for Search product directly without submit data. Developer purpose only
 */

router.get('/:name', auth, async (req, res) => {

  try {

    const verifyProductData = {

      name: req.params.name

    }

    //Get the products form DB using product class
    const searchProduct = await searchData(verifyProductData)

    if (!searchProduct) return res.render('search', { error: 'Product is not available' })

    // Data should fill in viewproducts handlebars
    let product = searchProduct

    let _id = product._id

    let like = _id.toString();

    let pname = product.name

    let pcategory = product.category

    let pquantity = product.quantity

    let pprice = product.price

    let pdescription = product.description

    let plikedby = product.likedBy

    /**
     * TODO REMOVE THIS IF WON'T USE PROMISIFY ON FURTHER UPDATES
     */
    // const stat = util.promisify(fs.stat);

    // async function callstat(){
    //   const stats  = await stat('.');
    //   console.log(`this directory is owned by ${stats.uid}`)
    // }

    //fill in viewproducts handlebars
    client.get(like, (err, obj) => {

      if (err) console.log(err)

      else {

        res.render('viewproducts', {

          pid : _id,
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
 * End point for list the all products in dashabord, view engine user interface call
 * @async
 * @returns All products in collection
 */

router.get('/', auth, async (req, res) => {

  try {

    const viewProducts = await productModelInstance().products()

    if (!viewProducts) return res.status(400).render('listview', {error: 'Sorry... No product is available...!'});

    res.render('listview',{

      products : viewProducts

    })

    // TODO ADD ITERATION FOR LIST PRODUCTS WITH LIKES WHICH IS LOCATED ON BACKUP.JS

  } catch (err) {

    if (err) {

      console.log(err)

      res.json({ message: err })

    }
  }
});

/**
 * End point for edit products user interface
 * @async
 */

router.get('/edit/:_id', async (req, res) => {

  const _id = req.params._id

  //Get the products form DB using product class
  const product = await productModelInstance().searchProductById(_id)

  //Data to be filled in textboxes
  let pname = product.name

  let category = product.category

  let price = product.price

  let quantity = product.quantity

  let description = product.description

  //render the template
  res.render('editproducts', {

    pid : _id,
    pname: pname,
    category: category,
    price: price,
    quantity: quantity,
    description: description

  })
})

/**
 * End point for edit the product and store it again in Products collection
 * @async
 * @returns {Promise} updated product
 */

router.patch('/edit/:_id', auth, async (req, res) => {

  //Validate product
  const validate = Product.edit(req.body);

  if (validate.error == null) {

    try {

      //Create Product insance for Product class
      const productInstance = productModelInstance();

      const _id = req.params._id

      //Get the products form DB using product class
      const product = await productInstance.searchProductById(_id)

      if (!product) return res.status(400).render('search', { error: 'Invalid product' });

      const productData = {

        _id: _id,
        name: req.body.name,
        category: req.body.category,
        price: req.body.price,
        quantity: req.body.quantity,
        description: req.body.description

      }

      const editProduct = await productInstance.editProduct(productData);

      res.render('editproducts', { success: product.name +' Modified successfully.' });

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

    if (!product) return res.status(400).render('search', { error: 'Invalid product' });

    const emailData = {

      _id: _id,
      email: req.user.email

    }

    //Check user if already liked
    const likedUser = await productInstance.searchProductByEmail(emailData);

    if (likedUser) {

      res.status(400).render('viewproducts', { error: 'You are already liked' })

    }

    //Update likes on redis server
    if (likedUser == null) {

      let _id = req.params._id

      const likes = client.incrby(_id, 1, (err, reply) => {

        if (err) {

          console.log(err)

        } else {

          console.log(reply)

        }
      })

      //Update liked users on mongodb
      if (likes) {

        const likedby = await productInstance.updateLikes(emailData);

        res.status(200).render('viewproducts', { success: 'You are liked this products' })

      } else {

        res.status(400).send('Some error occured')

      }

    }

  } catch (err) {

    if (err) {

      res.status(400).render('viewproducts',{error: err})

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

    if (!product) return res.status(400).render('search', { error:'Invalid product' });

    //Delete products and likes
    const deleteProduct = await productInstance.deleteProduct(_id);

    client.del(like);

    res.render('search', { success: product.name+ ' is deleted successfully' });

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
