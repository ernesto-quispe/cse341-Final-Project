const express = require('express');
const router = express.Router();
const { validateMovieId, validateCreateMovie, validateUpdateMovie } = require('../validator');
const moviesController = require('../controllers/movies');
const { validationResult } = require('express-validator');
const { isAuthenticated } = require("../middleware/authenticate");

// Error handling middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.get('/', moviesController.getAll);
router.get('/:id', validateMovieId, validate, moviesController.getSingle);
router.put('/:id', isAuthenticated, validateMovieId, validateUpdateMovie, validate, moviesController.updateMovie);
router.post('/', isAuthenticated, validateCreateMovie, validate, moviesController.createMovie);
router.delete('/:id', isAuthenticated, validateMovieId, validate, moviesController.deleteMovie);

module.exports = router;
