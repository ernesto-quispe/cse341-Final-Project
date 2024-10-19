const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
  /* 
    #swagger.tags = ['Movies']
    #swagger.description = 'Retrieve all movies from the collection'
    #swagger.responses[200] = {
      description: 'Successful retrieval of all movies',
      schema: {
        type: 'array',
        items: { $ref: '#/definitions/Movies' }
      }
    }
  */
  try {
    const result = await mongodb.getDb().db().collection('movies').find();
    result.toArray().then((movies) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(movies);
    }).catch(err => {
      res.status(500).json({ error: 'Failed to convert documents to array' });
    });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while retrieving movies' });
  }
};

const getSingle = async (req, res) => {
  /* 
    #swagger.tags = ['Movies']
    #swagger.description = 'Retrieve a single movie by its ID'
    #swagger.parameters['id'] = { description: 'Movie ID', type: 'string' }
    #swagger.responses[200] = {
      description: 'Successful retrieval of the movie',
      schema: { $ref: '#/definitions/Movies' }
    }
  */
  try {
    const movieId = new ObjectId(req.params.id);
    const result = await mongodb.getDb().db().collection('movies').find({ _id: movieId });
    result.toArray().then((movies) => {
      if (movies.length === 0) {
        res.status(404).json({ error: 'Movie not found' });
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(movies[0]);
      }
    }).catch(err => {
      res.status(500).json({ error: 'Failed to convert document to array' });
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      res.status(400).json({ error: 'Invalid movie ID format' });
    } else {
      res.status(500).json({ error: 'An error occurred while retrieving the movie' });
    }
  }
};

const updateMovie = async (req, res) => {
  /* 
    #swagger.tags = ['Movies']
    #swagger.description = 'Update a movie by its ID'
    #swagger.parameters['id'] = { description: 'Movie ID', type: 'string' }
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Movie data',
      required: true,
      schema: { $ref: '#/definitions/Movies' }
    }
    #swagger.responses[204] = { description: 'No Content' }
  */
  const movieId = new ObjectId(req.params.id);
  const result = await mongodb.getDb().db().collection('movies').findOneAndUpdate(
    { _id: movieId }, 
    { $set: req.body }
  ).then(data => {
    if (!data) {
      res.status(404).send({ message: `Cannot update the movie with id=${movieId}. Maybe the movie was not found!` });
    } else {
      res.status(204).send();
    }
  }).catch(err => {
    res.status(500).send({ message: "Error updating the Movie with id=" + movieId });
  });
};

const createMovie = async (req, res) => {
  /* 
    #swagger.tags = ['Movies']
    #swagger.description = 'Create a new movie'
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Movie data',
      required: true,
      schema: { $ref: '#/definitions/Movies' }
    }
    #swagger.responses[201] = {
      description: 'Movie created successfully',
      schema: { $ref: '#/definitions/Movies' }
    }
  */
  const result = await mongodb.getDb().db().collection('movies').insertOne(req.body)
  .then(data => {
    res.status(201).send({ message: "Movie was created successfully." });
  })
  .catch(err => {
    res.status(500).send({ message: "Error creating movie" });
  });
};

const deleteMovie = async (req, res) => {
  /* 
    #swagger.tags = ['Movies']
    #swagger.description = 'Delete a movie by its ID'
    #swagger.parameters['id'] = { description: 'Movie ID', type: 'string' }
    #swagger.responses[204] = { description: 'No Content' }
  */
  const movieId = new ObjectId(req.params.id);
  const result = await mongodb.getDb().db().collection('movies').findOneAndDelete({ _id: movieId })
  .then(data => {
    if (!data) {
      res.status(404).send({ message: `Cannot delete the movie` });
    } else {
      res.status(204).send();
    }
  })
  .catch(err => {
    res.status(500).send({ message: "Error deleting the movie" });
  });
};

module.exports = {
  getAll,
  getSingle,
  updateMovie,
  deleteMovie,
  createMovie
};