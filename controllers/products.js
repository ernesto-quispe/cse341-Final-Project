const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;


const getAll = async (req, res) => {
  /* #swagger.tags = ['Products']
   #swagger.description = 'Retrieve all products from the collection' */
    try {
      const result = await mongodb.getDb().db().collection('products').find();
      result.toArray().then((products) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(products);
      }).catch(err => {
        res.status(500).json({ error: 'Failed to convert documents to array' });
      });
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while retrieving products' });
    }
  };


const getSingle = async (req, res) => {
  /* #swagger.tags = ['Products']
   #swagger.description = 'Retrieve a single product by its ID' */
    try {
      const productId = new ObjectId(req.params.id); 
      const result = await mongodb.getDb().db().collection('products').find({ _id: productId });
      result.toArray().then((products) => {
        if (products.length === 0) {
          res.status(404).json({ error: 'Product not found' });
        } else {
          res.setHeader('Content-Type', 'application/json');
          res.status(200).json(products[0]);
        }
      }).catch(err => {
        res.status(500).json({ error: 'Failed to convert document to array' });
      });
    } catch (error) {
      if (error.kind === 'ObjectId') {
        res.status(400).json({ error: 'Invalid product ID format' });
      } else {
        res.status(500).json({ error: 'An error occurred while retrieving the product' });
      }
    }
  };


const updateProduct = async (req, res) => {
  /* #swagger.tags = ['Products']
   #swagger.description = 'Update a product by its ID' */
  const productId = new ObjectId(req.params.id);
  const result  = await mongodb.getDb().db().collection('products').findOneAndUpdate({ _id: productId }, { $set: req.body })
  .then(data => {
    if (!data) {
      res.status(404).send({
        message: `Cannot update product with id=${productId}. Maybe product was not found!`
      });
    } else res.status(204).send();
  })
  .catch(err => {
    res.status(500).send({
      message: "Error updating Product with id=" + productId
    });
  });
};

const createProduct = async (req, res) => {
  /* #swagger.tags = ['Products']
   #swagger.description = 'Create a new product' */
  const productId = new ObjectId(req.params.id);
  const result  = await mongodb.getDb().db().collection('products').insertOne(req.body)
  .then(data => {
    if (!data) {
      res.status(404).send({
        message: `Cannot create product`
      });
    } else res.send({ message: "Product was created successfully." });
  })
  .catch(err => {
    res.status(500).send({
      message: "Error creating Product "
    });
  });
};

const deleteProduct = async (req, res) => {
  /* #swagger.tags = ['Products']
   #swagger.description = 'Delete a product by its ID' */
  const productId = new ObjectId(req.params.id);
  const result = await mongodb.getDb().db().collection('products').findOneAndDelete({ _id: productId })
  .then(data => {
    if (!data) {
      res.status(404).send({
        message: `Cannot delete product`
      });
    } else res.status(204).send();
  })
  .catch(err => {
    res.status(500).send({
      message: "Error deleting Product "
    });
  });
};

module.exports = {
    getAll,
    getSingle,
    updateProduct,
    deleteProduct, 
    createProduct
};
