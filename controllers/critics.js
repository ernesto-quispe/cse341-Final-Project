const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {  
  /* 
    #swagger.tags = ['Critics']
    #swagger.description = 'Retrieve all critics from the collection'
    #swagger.responses[200] = {
      description: 'Successful retrieval of all critics',
      schema: {
        type: 'array',
        items: { $ref: '#/definitions/Critics' }
      }
    }
  */ 
  try {
    const result = await mongodb.getDb().db().collection('critics').find();
    result.toArray().then((critics) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(critics);
    }).catch(err => {
      res.status(500).json({ error: 'Failed to convert documents to array' });
    });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while retrieving critics' });
  }
};

const getSingle = async (req, res) => {  
  /* 
    #swagger.tags = ['Critics']
    #swagger.description = 'Retrieve a single critic by their ID'
    #swagger.parameters['id'] = { description: 'Critic ID', type: 'string' }
    #swagger.responses[200] = {
      description: 'Successful retrieval of the critic',
      schema: { $ref: '#/definitions/Critics' }
    }
  */ 
  try {
    const criticId = new ObjectId(req.params.id);
    const result = await mongodb.getDb().db().collection('critics').find({ _id: criticId });
    result.toArray().then((critics) => {
      if (critics.length === 0) {
        res.status(404).json({ error: 'Critic not found' });
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(critics[0]);
      }
    }).catch(err => {
      res.status(500).json({ error: 'Failed to convert document to array' });
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      res.status(400).json({ error: 'Invalid critic ID format' });
    } else {
      res.status(500).json({ error: 'An error occurred while retrieving the critic' });
    }
  }
};

const updateCritic = async (req, res) => {  
  /* 
    #swagger.tags = ['Critics']
    #swagger.description = 'Update an existing critic by their ID'
    #swagger.parameters['id'] = { description: 'Critic ID', type: 'string' }
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Critic data',
      required: true,
      schema: { $ref: '#/definitions/Critics' }
    }
    #swagger.responses[204] = { description: 'No Content' }
  */
  try {
    const criticId = new ObjectId(req.params.id);
    const result = await mongodb.getDb().db().collection('critics').findOneAndUpdate(
      { _id: criticId }, 
      { $set: req.body }
    );
    if (!result) {
      res.status(404).send({ message: `Cannot update critic with id=${criticId}. Maybe critic was not found!` });
    } else {
      res.status(204).send();
    }
  } catch (error) {
    res.status(500).send({ message: 'Error updating Critic with id=' + criticId });
  }
};

const createCritic = async (req, res) => {  
  /* 
    #swagger.tags = ['Critics']
    #swagger.description = 'Create a new Critic'
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Critic data',
      required: true,
      schema: { $ref: '#/definitions/Critics' }
    }
    #swagger.responses[201] = {
      description: 'Critic created successfully',
      schema: { $ref: '#/definitions/Critics' }
    }
  */
  try {
    const result = await mongodb.getDb().db().collection('critics').insertOne(req.body);
    res.status(201).send(result);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while creating the critic' });
  }
};

const deleteCritic = async (req, res) => {  
  /* 
    #swagger.tags = ['Critics']
    #swagger.description = 'Delete an existing critic by their ID'
    #swagger.parameters['id'] = { description: 'Critic ID', type: 'string' }
    #swagger.responses[204] = { description: 'No Content' }
  */
  try {
    const criticId = new ObjectId(req.params.id);
    const result = await mongodb.getDb().db().collection('critics').findOneAndDelete({ _id: criticId });
    if (!result) {
      res.status(404).json({ error: 'Critic not found' });
    } else {
      res.status(204).send();
    }
  } catch (error) {
    if (error.kind === 'ObjectId') {
      res.status(400).json({ error: 'Invalid critic ID format' });
    } else {
      res.status(500).json({ error: 'An error occurred while deleting the critic' });
    }
  }
};

module.exports = {
  getAll,
  getSingle,
  updateCritic,
  createCritic,
  deleteCritic
};
