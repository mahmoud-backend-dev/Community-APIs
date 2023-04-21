
const { body } = require('express-validator');
const validationErrorMiddleWare = require('../../middleware/validatorMiddleware');
const { BadRequest } = require('../../errors');
const User = require('../../models/User');






exports.signupValidator = [
  body('name').notEmpty().withMessage('Name required'),
  body('email').notEmpty().withMessage('E-mail required')
    .isEmail().withMessage('E-mail Invalid Format')
    .custom(async (val) => {
      const user = await User.findOne({ email: val });
      if (user)
        throw new BadRequest('E-mail already used choose anthor E-mail');
    }),
  body('password').notEmpty().withMessage('Password required')
    .isLength({ min: 6 }).withMessage('Too short password enter more than 6 characters'),
  validationErrorMiddleWare
];



exports.loginValidator = [
  body('email').notEmpty().withMessage('E-mail required')
    .isEmail().withMessage('E-mail Invalid Format'),
  body('password').notEmpty().withMessage('Password required'),
  validationErrorMiddleWare,
];

exports.forgetPasswordValidator = [
  body('email').notEmpty().withMessage('E-mail required'),
  validationErrorMiddleWare,
];

exports.verifyResetCodeValidator = [
  body('email').notEmpty().withMessage('E-mail Required'),
  body('resetCode').notEmpty().withMessage('Reset Code Required'),
  validationErrorMiddleWare
];

exports.resetPasswordValidator = [
  body('email').notEmpty().withMessage('E-mail Required'),
  body('newPassword').notEmpty().withMessage('New Password Required')
    .isLength({ min: 6 }).withMessage('Too short password enter more than 6 characters'), 
  validationErrorMiddleWare
];