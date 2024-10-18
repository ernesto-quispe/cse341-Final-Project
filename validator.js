const { body, param } = require('express-validator');
const ObjectId = require('mongodb').ObjectId;

const validateObjectId = (id) => {
  return ObjectId.isValid(id);
};

const validateMovieId =  [
  param('id').custom((value) => {
    if (!validateObjectId(value)) {
      throw new Error('Invalid movie ID format');
    }
    return true;
  }),
];

const validateCreateMovie = [
  body('title').isString().withMessage('Title must be a string'),
  body('releaseDate').isString().withMessage('Release Date must be a valid date'),
  body('genre').isString().withMessage('Genre must be a string'),
  body('director').isString().withMessage('Director must be a string'),
  body('synopsis').isString().withMessage('Synopsis must be a string'),
  body('runtime').isInt({ gt: 0 }).withMessage('Runtime must be a positive integer')
];

const validateUpdateMovie = [
  body('title').optional().isString().withMessage('Title must be a string'),
  body('releaseDate').isString().withMessage('Release Date must be a valid date'),
  body('genre').optional().isString().withMessage('Genre must be a string'),
  body('director').optional().isString().withMessage('Director must be a string'),
  body('synopsis').optional().isString().withMessage('Synopsis must be a string'),
  body('runtime').optional().isInt({ gt: 0 }).withMessage('Runtime must be a positive integer')
];

module.exports = {
  validateMovieId,
  validateCreateMovie,
  validateUpdateMovie
};