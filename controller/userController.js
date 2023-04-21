
const crypto = require('crypto');
const asyncHandler = require('express-async-handler');
const { StatusCodes } = require('http-status-codes');
const { BadRequest, NotFoundError, CustomErrorAPI, UnauthenticatedError } = require('../errors');
const User = require('../models/User');
const { santizeData } = require('../utils/santizeData');
const { sendMail } = require('../utils/sendEmail');


const cryptoHashResetCode = (resetCode) => crypto.createHash('sha256').update(resetCode).digest('hex');


exports.allowTo = (...roles) => asyncHandler(async (req, res, next) => {
  if (!roles.includes(req.user.role))
    throw new UnauthenticatedError('You are not allowed to access this route')
  next();
});




// @decs Signup
// @route POST /api/v1/user/signup
// @ptotect Public
exports.signup = asyncHandler(async (req, res) => {
  const user = await User.create(req.body);
  user.specializations = undefined;
  user.experiences = undefined;
  user.qualifications = undefined;
  await user.hashPass();
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({ token, user: santizeData(user) });
});


// @decs Login
// @route POST /api/v1/user/login
// @ptotect Public
exports.login = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    throw new NotFoundError(`No such user for this id: ${req.body.email}`);
  const isMatch = await user.comparePassword(req.body.password);
  if (!user || !isMatch)
    throw new BadRequest('Password or E-mail incorrect');
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ status: "Success", token, user: santizeData(user) });
});

// @decs Forget Password
// @route POST /api/v1/user/forgetPassword
// @ptotect Public
exports.forgetPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    throw new NotFoundError(`No such user for this id: ${req.body.email}`);
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = cryptoHashResetCode(resetCode);
  user.hashedResetCode = hashedResetCode;
  user.expiredResetCode = Date.now() + 10 * 60 * 1000;
  user.verifiyResetCode = false;
  const text =
    `Hi ${user.name}
    G- ${resetCode} is reset code for reset password`;
  const mailOptions = { email: user.email, text };
  try {
    await sendMail(mailOptions);
    await user.save();
  } catch (error) {
    user.hashedResetCode = undefined;
    user.expiredResetCode = undefined;
    user.verifiyResetCode = undefined;
    await user.save();
    throw new CustomErrorAPI(`There is an error in sending email`, StatusCodes.INTERNAL_SERVER_ERROR);
  }
  res.status(StatusCodes.OK).json({ status: "Success", message: "Reset Code Sent To Email" });
});

// @decs Verify Reset Code
// @route POST /api/v1/user/verifyResetCode
// @ptotect Public
exports.verifyResetCode = asyncHandler(async (req, res) => {
  const hashedResetCode = cryptoHashResetCode(req.body.resetCode);
  const user = await User.findOne({
    email: req.body.email,
    hashedResetCode: hashedResetCode,
    expiredResetCode: { $gt: Date.now() }
  });
  if (!user)
    throw new BadRequest(`Reset code invalid or expired or no email for this: ${req.body.email} `);

  user.verifiyResetCode = true;
  await user.save();
  res.status(StatusCodes.OK).json({ status: "Success" });
});


// @decs Reset Password
// @route POST /api/v1/user/resetPassword
// @ptotect Public
exports.resetPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    throw new BadRequest(`No such email for this: ${req.body.email}`);
  if (!user.verifiyResetCode)
    throw new BadRequest('Reset code not verified')
  user.password = req.body.newPassword;
  user.hashedResetCode = undefined;
  user.expiredResetCode = undefined;
  user.verifiyResetCode = undefined;
  const token = user.createJWT();
  await user.hashPass();
  res.status(StatusCodes.OK).json({ status: "Success", token, user: santizeData(user) });
})