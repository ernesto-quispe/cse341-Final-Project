const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;


const getAll = async (req, res) => {
  /* #swagger.tags = ['Movies']
   #swagger.description = 'Retrieve all movies from the collection' */
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
  /* #swagger.tags = ['Movies']
   #swagger.description = 'Retrieve a single movies by its ID' */
    try {
      const moviesId = new ObjectId(req.params.id); 
      const result = await mongodb.getDb().db().collection('movies').find({ _id: moviesId });
      result.toArray().then((movies) => {
        if (movies.length === 0) {
          res.status(404).json({ error: 'Movies not found' });
        } else {
          res.setHeader('Content-Type', 'application/json');
          res.status(200).json(products[0]);
        }
      }).catch(err => {
        res.status(500).json({ error: 'Failed to convert document to array' });
      });
    } catch (error) {
      if (error.kind === 'ObjectId') {
        res.status(400).json({ error: 'Invalid movies ID format' });
      } else {
        res.status(500).json({ error: 'An error occurred while retrieving the movies' });
      }
    }
  };


const updateMovie = async (req, res) => {
  /* #swagger.tags = ['Movies']
   #swagger.description = 'Update a product by its ID' */
  const moviesId = new ObjectId(req.params.id);
  const result  = await mongodb.getDb().db().collection('movies').findOneAndUpdate({ _id: moviesId }, { $set: req.body })
  .then(data => {
    if (!data) {
      res.status(404).send({
        message: `Cannot update the movie with id=${moviesId}. Maybe the movie was not found!`
      });
    } else res.status(204).send();
  })
  .catch(err => {
    res.status(500).send({
      message: "Error updating the Movie with id=" + moviesId
    });
  });
};

const createMovie = async (req, res) => {
  /* #swagger.tags = ['Movies']
   #swagger.description = 'Create a new movie' */
  const movieId = new ObjectId(req.params.id);
  const result  = await mongodb.getDb().db().collection('movies').insertOne(req.body)
  .then(data => {
    if (!data) {
      res.status(404).send({
        message: `Cannot create the movie`
      });
    } else res.send({ message: "Movies was created successfully." });
  })
  .catch(err => {
    res.status(500).send({
      message: "Error creating Movies "
    });
  });
};

const deleteMovie = async (req, res) => {
  /* #swagger.tags = ['Movies']
   #swagger.description = 'Delete a movie by its ID' */
  const movieId = new ObjectId(req.params.id);
  const result = await mongodb.getDb().db().collection('movies').findOneAndDelete({ _id: movieId })
  .then(data => {
    if (!data) {
      res.status(404).send({
        message: `Cannot delete the movie`
      });
    } else res.status(204).send();
  })
  .catch(err => {
    res.status(500).send({
      message: "Error deleting the movies "
    });
  });
};

module.exports = {
    getAll,
    getSingle,
    updateMovie,
    deleteMovie, 
    createMovie
};
