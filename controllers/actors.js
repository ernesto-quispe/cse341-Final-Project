const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {  
  /* 
    #swagger.tags = ['Actors']
    #swagger.description = 'Retrieve all actors from the collection'
    #swagger.responses[200] = {
      description: 'Successful retrieval of all actors',
      schema: {
        type: 'array',
        items: { $ref: '#/definitions/Actors' }
      }
    }
  */ 
  try {
    const result = await mongodb.getDb().db().collection('actors').find();
    result.toArray().then((actors) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(actors);
    }).catch(err => {
      res.status(500).json({ error: 'Failed to convert documents to array' });
    });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while retrieving actors' });
  }
};

const getSingle = async (req, res) => {  
  /* 
    #swagger.tags = ['Actors']
    #swagger.description = 'Retrieve a single actor by their ID'
    #swagger.parameters['id'] = { description: 'Actor ID', type: 'string' }
    #swagger.responses[200] = {
      description: 'Successful retrieval of the actor',
      schema: { $ref: '#/definitions/Actors' }
    }
  */ 
  try {
    const actorId = new ObjectId(req.params.id);
    const result = await mongodb.getDb().db().collection('actors').find({ _id: actorId });
    result.toArray().then((actors) => {
      if (actors.length === 0) {
        res.status(404).json({ error: 'Actor not found' });
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(actors[0]);
      }
    }).catch(err => {
      res.status(500).json({ error: 'Failed to convert document to array' });
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      res.status(400).json({ error: 'Invalid actor ID format' });
    } else {
      res.status(500).json({ error: 'An error occurred while retrieving the actor' });
    }
  }
};

const updateActor = async (req, res) => {  
  /* 
    #swagger.tags = ['Actors']
    #swagger.description = 'Update an existing actor by their ID'
    #swagger.parameters['id'] = { description: 'Actor ID', type: 'string' }
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Actor data',
      required: true,
      schema: { $ref: '#/definitions/Actors' }
    }
    #swagger.responses[204] = { description: 'No Content' }
  */
  try {
    const actorId = new ObjectId(req.params.id);
    const result = await mongodb.getDb().db().collection('actors').findOneAndUpdate(
      { _id: actorId }, 
      { $set: req.body }
    );
    if (!result) {
      res.status(404).send({ message: `Cannot update actor with id=${actorId}. Maybe actor was not found!` });
    } else {
      res.status(204).send();
    }
  } catch (error) {
    res.status(500).send({ message: 'Error updating Actor with id=' + actorId });
  }
};

const createActor = async (req, res) => {  
  /* 
    #swagger.tags = ['Actors']
    #swagger.description = 'Create a new Actor'
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Actor data',
      required: true,
      schema: { $ref: '#/definitions/Actors' }
    }
    #swagger.responses[201] = {
      description: 'Actor created successfully',
      schema: { $ref: '#/definitions/Actors' }
    }
  */
  try {
    const result = await mongodb.getDb().db().collection('actors').insertOne(req.body);
    res.status(201).send(result);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while creating the actor' });
  }
};

const deleteActor = async (req, res) => {  
  /* 
    #swagger.tags = ['Actors']
    #swagger.description = 'Delete an existing actor by their ID'
    #swagger.parameters['id'] = { description: 'Actor ID', type: 'string' }
    #swagger.responses[204] = { description: 'No Content' }
  */
  try {
    const actorId = new ObjectId(req.params.id);
    const result = await mongodb.getDb().db().collection('actors').findOneAndDelete({ _id: actorId });
    if (!result) {
      res.status(404).json({ error: 'Actor not found' });
    } else {
      res.status(204).send();
    }
  } catch (error) {
    if (error.kind === 'ObjectId') {
      res.status(400).json({ error: 'Invalid actor ID format' });
    } else {
      res.status(500).json({ error: 'An error occurred while deleting the actor' });
    }
  }
};

module.exports = {
  getAll,
  getSingle,
  updateActor,
  createActor,
  deleteActor
};
