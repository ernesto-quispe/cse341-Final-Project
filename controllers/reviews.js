const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {  
  /* 
    #swagger.tags = ['Reviews']
    #swagger.description = 'Retrieve all reviews from the collection'
    #swagger.responses[200] = {
      description: 'Successful retrieval of all reviews',
      schema: {
        type: 'array',
        items: { $ref: '#/definitions/Reviews' }
      }
    }
  */ 
  try {
    const result = await mongodb.getDb().db().collection('reviews').find();
    result.toArray().then((reviews) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(reviews);
    }).catch(err => {
      res.status(500).json({ error: 'Failed to convert documents to array' });
    });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while retrieving reviews' });
  }
};

const getSingle = async (req, res) => {  
  /* 
    #swagger.tags = ['Reviews']
    #swagger.description = 'Retrieve a single review by its ID'
    #swagger.parameters['id'] = { description: 'Review ID', type: 'string' }
    #swagger.responses[200] = {
      description: 'Successful retrieval of the review',
      schema: { $ref: '#/definitions/Reviews' }
    }
  */ 
  try {
    const reviewId = new ObjectId(req.params.id);
    const result = await mongodb.getDb().db().collection('reviews').find({ _id: reviewId });
    result.toArray().then((reviews) => {
      if (reviews.length === 0) {
        res.status(404).json({ error: 'Review not found' });
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(reviews[0]);
      }
    }).catch(err => {
      res.status(500).json({ error: 'Failed to convert document to array' });
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      res.status(400).json({ error: 'Invalid review ID format' });
    } else {
      res.status(500).json({ error: 'An error occurred while retrieving the review' });
    }
  }
};

const updateReview = async (req, res) => {  
  /* 
    #swagger.tags = ['Reviews']
    #swagger.description = 'Update an existing review by its ID'
    #swagger.parameters['id'] = { description: 'Review ID', type: 'string' }
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Review data',
      required: true,
      schema: { $ref: '#/definitions/Reviews' }
    }
    #swagger.responses[204] = { description: 'No Content' }
  */
  try {
    const reviewId = new ObjectId(req.params.id);
    const result = await mongodb.getDb().db().collection('reviews').findOneAndUpdate(
      { _id: reviewId }, 
      { $set: req.body }
    );
    if (!result) {
      res.status(404).send({ message: `Cannot update review with id=${reviewId}. Maybe review was not found!` });
    } else {
      res.status(204).send();
    }
  } catch (error) {
    res.status(500).send({ message: 'Error updating Review with id=' + reviewId });
  }
};

const createReview = async (req, res) => {  
  /* 
    #swagger.tags = ['Reviews']
    #swagger.description = 'Create a new Review'
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Review data',
      required: true,
      schema: { $ref: '#/definitions/Reviews' }
    }
    #swagger.responses[201] = {
      description: 'Review created successfully',
      schema: { $ref: '#/definitions/Reviews' }
    }
  */
  try {
    const result = await mongodb.getDb().db().collection('reviews').insertOne(req.body);
    res.status(201).send(result);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while creating the review' });
  }
};

const deleteReview = async (req, res) => {  
  /* 
    #swagger.tags = ['Reviews']
    #swagger.description = 'Delete an existing review by its ID'
    #swagger.parameters['id'] = { description: 'Review ID', type: 'string' }
    #swagger.responses[204] = { description: 'No Content' }
  */
  try {
    const reviewId = new ObjectId(req.params.id);
    const result = await mongodb.getDb().db().collection('reviews').findOneAndDelete({ _id: reviewId });
    if (!result) {
      res.status(404).json({ error: 'Review not found' });
    } else {
      res.status(204).send();
    }
  } catch (error) {
    if (error.kind === 'ObjectId') {
      res.status(400).json({ error: 'Invalid review ID format' });
    } else {
      res.status(500).json({ error: 'An error occurred while deleting the review' });
    }
  }
};

module.exports = {
  getAll,
  getSingle,
  updateReview,
  createReview,
  deleteReview
};
