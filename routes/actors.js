const express = require('express');
const router = express.Router();
const { validateUserId, validateCreateUser, validateUpdateUser } = require('../validator');
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

router.get('/', usersController.getAll);
router.get('/:id', validateUserId, validate, actorsController.getSingle);
router.put('/:id', isAuthenticated, validateUserId, validateUpdateUser, validate, actorsController.updateActor);
router.post('/', isAuthenticated, validateCreateUser, validate, actorsController.createActor);
router.delete('/:id', isAuthenticated, validateUserId, validate, actorsController.deleteActor);

module.exports = router;