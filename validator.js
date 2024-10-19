const { body, param } = require('express-validator');
const ObjectId = require('mongodb').ObjectId;

const validateObjectId = (id) => {
  return ObjectId.isValid(id);
};

const validateMovieId = [
  param('id').custom((value) => {
    if (!validateObjectId(value)) {
      throw new Error('Invalid movie ID format');
    }
    return true;
  }),
];

const validateActorId = [
  param('id').custom((value) => {
    if (!validateObjectId(value)) {
      throw new Error('Invalid actor ID format');
    }
    return true;
  }),
];

const validateReviewId = [
  param('id').custom((value) => {
    if (!validateObjectId(value)) {
      throw new Error('Invalid review ID format');
    }
    return true;
  }),
];

const validateCriticId = [
  param('id').custom((value) => {
    if (!validateObjectId(value)) {
      throw new Error('Invalid critic ID format');
    }
    return true;
  }),
];

const validateCreateMovie = [
  body('title').isString().withMessage('Title must be a string'),
  body('releaseDate').isString().isISO8601().withMessage('Release Date must be a valid ISO 8601 date string (YYYY-MM-DD)'),
  body('genre').isString().withMessage('Genre must be a string'),
  body('director').isString().withMessage('Director must be a string'),
  body('language').isString().withMessage('Language must be a string'),
  body('synopsis').isString().withMessage('Synopsis must be a string'),
  body('duration').isInt({ gt: 0 }).withMessage('Duration must be a positive integer')
];

const validateCreateActor = [
  body('name').isString().withMessage('Name must be a string'),
  body('birthDate').isString().isISO8601().withMessage('Date of Birth must be a valid ISO 8601 date string (YYYY-MM-DD)'),
  body('awards_count').optional().isInt({ gt: 0 }).withMessage('Awards must be a positive integer'),
  body('nationality').optional().isString().withMessage('Nationality must be a string')
];

const validateCreateCritic = [
  body('name').isString().withMessage('Name must be a string'),
  body('affiliation').isString().withMessage('Affiliation must be a string'),
  body('biography').isString().withMessage('Biography must be a string')
];

const validateCreateReview = [
  body('movieName').optional().isString().withMessage('Review must be a string'),
  body('rating').isInt({ gt: 0, lt: 11 }).withMessage('Rating must be a positive integer between 1 and 10'),
  body('reviewText').optional().isString().withMessage('Review must be a string'),
  body('reviewDate').isString().isISO8601().withMessage('Review Date must be a valid ISO 8601 date string (YYYY-MM-DD)'),

];

module.exports = {
  validateMovieId,
  validateCreateMovie,
  validateCreateActor,
  validateCreateCritic,
  validateCreateReview,
  validateActorId,
  validateCriticId,
  validateReviewId
};
