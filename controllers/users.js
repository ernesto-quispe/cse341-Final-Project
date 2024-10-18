const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;


const getAll = async (req, res) => {
  /* #swagger.tags = ['Users']
   #swagger.description = 'Retrieve all users from the collection' */
  try {
    const result = await mongodb.getDb().db().collection('users').find();
    result.toArray().then((users) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(users);
    }).catch(err => {
      res.status(500).json({ error: 'Failed to convert documents to array' });
    });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while retrieving users' });
  }
};


const getSingle = async (req, res) => {
  /* #swagger.tags = ['Users']
   #swagger.description = 'Retrieve a single user by their ID' */
  try {
    const userId = new ObjectId(req.params.id);
    const result = await mongodb.getDb().db().collection('users').find({ _id: userId });
    result.toArray().then((users) => {
      if (users.length === 0) {
        res.status(404).json({ error: 'User not found' });
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(users[0]);
      }
    }).catch(err => {
      res.status(500).json({ error: 'Failed to convert document to array' });
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      res.status(400).json({ error: 'Invalid user ID format' });
    } else {
      res.status(500).json({ error: 'An error occurred while retrieving the user' });
    }
  }
};


const updateUser = async (req, res) => {
  /* #swagger.tags = ['Users']
   #swagger.description = 'Update an existing user by their ID' */
  try {
    const userId = new ObjectId(req.params.id);
    const result = await mongodb.getDb().db().collection('users').findOneAndUpdate(
      { _id: userId },
      { $set: req.body }
    );
    if (!result) {
      res.status(404).send({ message: `Cannot update user with id=${userId}. Maybe user was not found!` });
    } else {
      res.status(204).send();
    }
  } catch (error) {
    res.status(500).send({ message: 'Error updating User with id=' + userId });
  }
};

const createUser = async (req, res) => {
  /* #swagger.tags = ['Users']
   #swagger.description = 'Create a new user' */
  try {
    const result = await mongodb.getDb().db().collection('users').insertOne(req.body);
    res.send(result);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while creating the user' });
  }
};

const deleteUser = async (req, res) => {
  /* #swagger.tags = ['Users']
   #swagger.description = 'Delete an existing user by their ID' */
  try {
    const userId = new ObjectId(req.params.id);
    const result = await mongodb.getDb().db().collection('users').findOneAndDelete({ _id: userId });
    if (!result) {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.status(204).send();
    }
  } catch (error) {
    if (error.kind === 'ObjectId') {
      res.status(400).json({ error: 'Invalid user ID format' });
    } else {
      res.status(500).json({ error: 'An error occurred while deleting the user' });
    }
  }
};

module.exports = {
  getAll,
  getSingle,
  updateUser,
  createUser,
  deleteUser
};
