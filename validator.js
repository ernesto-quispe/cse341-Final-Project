const { body, param } = require('express-validator');
const ObjectId = require('mongodb').ObjectId;

const validateObjectId = (id) => {
  return ObjectId.isValid(id);
};

const validateUserId = [
  param('id').custom((value) => {
    if (!validateObjectId(value)) {
      throw new Error('Invalid user ID format');
    }
    return true;
  }),
];

const validateProductId = [
  param('id').custom((value) => {
    if (!validateObjectId(value)) {
      throw new Error('Invalid product ID format');
    }
    return true;
  }),
];

const validateCreateUser = [
  body('name').isString().withMessage('Name must be a string'),
  body('email').isEmail().withMessage('Email must be valid'),
];

const validateUpdateUser = [
  body('name').optional().isString().withMessage('Name must be a string'),
  body('email').optional().isEmail().withMessage('Email must be valid'),
];

const validateCreateProduct = [
  body('name').isString().withMessage('Name must be a string'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
];

const validateUpdateProduct = [
  body('name').optional().isString().withMessage('Name must be a string'),
  body('price').optional().isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
];

module.exports = {
  validateUserId,
  validateProductId,
  validateCreateUser,
  validateUpdateUser,
  validateCreateProduct,
  validateUpdateProduct,
};
