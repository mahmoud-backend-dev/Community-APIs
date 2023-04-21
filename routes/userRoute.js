const express = require('express');
const router = express.Router();


const {
  signupValidator,
  loginValidator,
  forgetPasswordValidator,
  verifyResetCodeValidator,
  resetPasswordValidator,
} = require('../utils/validators/userValidator')

const {
  signup,
  login,
  forgetPassword,
  resetPassword,
  verifyResetCode,
} = require('../controller/userController')



router.post('/signup', signupValidator, signup);
router.post('/login', loginValidator, login);

router.post('/forgetPassword', forgetPasswordValidator, forgetPassword);
router.post('/verifyResetCode', verifyResetCodeValidator, verifyResetCode);
router.post('/resetPassword', resetPasswordValidator, resetPassword);

module.exports = router;