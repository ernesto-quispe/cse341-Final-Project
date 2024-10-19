const express = require('express');
const router = express.Router();
const { validateCriticId, validateCreateCritic } = require('../validator');
const criticsController = require('../controllers/critics');
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

router.get('/', criticsController.getAll);
router.get('/:id', validateCriticId, validate, criticsController.getSingle);
router.put('/:id', isAuthenticated, validateCriticId, validateCreateCritic, validate, criticsController.updateCritic);
router.post('/', isAuthenticated, validateCreateCritic, validate, criticsController.createCritic);
router.delete('/:id', isAuthenticated, validateCriticId, validate, criticsController.deleteCritic);

module.exports = router;
