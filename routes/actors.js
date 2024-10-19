const express = require('express');
const router = express.Router();
const { validateActorId, validateCreateActor } = require('../validator');
const actorsController = require('../controllers/actors');
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

router.get('/', actorsController.getAll);
router.get('/:id', validateActorId, validate, actorsController.getSingle);
router.put('/:id', isAuthenticated, validateActorId, validateCreateActor, validate, actorsController.updateActor);
router.post('/', isAuthenticated, validateCreateActor, validate, actorsController.createActor);
router.delete('/:id', isAuthenticated, validateActorId, validate, actorsController.deleteActor);

module.exports = router;
