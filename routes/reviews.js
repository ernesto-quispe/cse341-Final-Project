const express = require('express');
const router = express.Router();
const { validateReviewId, validateCreateReview } = require('../validator');
const reviewsController = require('../controllers/reviews');
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

router.get('/', reviewsController.getAll);
router.get('/:id', validateReviewId, validate, reviewsController.getSingle);
router.put('/:id', isAuthenticated, validateReviewId, validateCreateReview, validate, reviewsController.updateReview);
router.post('/', isAuthenticated, validateCreateReview, validate, reviewsController.createReview);
router.delete('/:id', isAuthenticated, validateReviewId, validate, reviewsController.deleteReview);

module.exports = router;
