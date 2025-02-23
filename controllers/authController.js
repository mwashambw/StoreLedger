const { promisify } = require('util');
const crypto = require('crypto');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/email');
const { readHtmlFile } = require('../utils/readHTML');

const createSendToken = (user, res, statusCode) => {
  const token = user.generateAuthToken();

  res.cookie('token', token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    // ...(process.env.NODE_ENV === 'production' ? { secure: true } : {}),
  });

  // Remove password from the output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.getLoggedInUser = catchAsync(async (req, res, next) => {
  const { token } = req.params;

  // 1) Varification the token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 2) Check if user still exists
  const currentUser = await User.findById(decoded.id).populate('projects');
  if (!currentUser)
    return next(
      new AppError('The user belonging to this token does not exist.', 401)
    );

  // 4) Check if the user have changed the password since the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }

  // 5) Grant access to the protected route
  res.status(200).json({
    status: 'success',
    data: {
      user: currentUser,
    },
  });
});

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;

  // Create user
  const newUser = await User.create({ name, email, password, passwordConfirm });
  // Log in user
  createSendToken(newUser, res, 201);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // 1) Check if email and password exists
  if (!email || !password)
    return next(new AppError('Please provide email and password', 400));

  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');
  const correct = user && (await user.correctPassword(password, user.password));
  if (!user || !correct)
    return next(new AppError('Incorrect email or password', 401));

  // 3) Send token to the client
  createSendToken(user, res, 200);
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Get token and check if i exists
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token)
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );

  // 2) Varification the token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser)
    return next(
      new AppError('The user belonging to this token does not exist.', 401)
    );

  // 4) Check if the user have changed the password since the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }

  // 5) Grant access to the protected route

  req.user = currentUser;
  next();
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // console.log(req.get('host'));
  // console.log(req.headers.referer);
  // 1) Get user based on provided email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('No user with this email address', 404));
  }
  // 2) Generate random  reset token

  const resetToken = await user.generateResetToken();

  await user.save({ validateBeforeSave: false });

  // 3) Send reset token user email
  // const resetUrl = `${req.protocol}://${req.get(
  //   'host'
  // )}/api/v1/users/resetpassword/${resetToken}`;

  // const resetURL = `${req.protocol}://${req.get(
  //   'host'
  // )}/resetPassword/${resetToken}`;
  const resetURL = `${req.headers.referer}resetPassword/${resetToken}`;

  const firstName = user.name.split(' ')[0];
  const subject = 'Your password reset token (Valid for 1 day)';

  // const message = `Forgot password ? Submit the patch request with new password to: ${resetUrl} \n If you did'nt forget your email, Please ignore this email.`;
  const emailHtml = readHtmlFile('passwordReset', {
    firstName,
    subject,
    resetURL,
  });
  try {
    await sendEmail({
      email: user.email,
      subject,
      emailHtml,
    });

    res.status(200).json({
      status: 'success',
      message: `Password reset link is successfully sent to your email (${user.email})`,
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending email. Try again later!', 500)
    );
  }
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get the reset token from the url and hash it
  const resetToken = req.params.token;
  const hashedToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // 2) Get the user basing on the hashed token and token not expired
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: {
      $gt: Date.now(),
    },
  });

  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  // 3) Update the password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  // 4) Change the passwordChangedAt
  // This is done by pre save midleware in user model
  // 5) Log in the user(Send JWT)
  createSendToken(user, res, 200);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, password, passwordConfirm } = req.body;
  if (!currentPassword || !password || !passwordConfirm) {
    return next(
      new AppError(
        'Please provide current password, new password and new password confirm.',
        400
      )
    );
  }
  // 1) Get the user
  const user = await User.findById(req.user.id).select('+password');

  // 2) Compare password
  if (!(await user.correctPassword(currentPassword, user.password))) {
    return next(new AppError('Your current password is wrong', 401));
  }

  // 3) Update the password
  user.password = password;
  user.passwordConfirm = passwordConfirm;

  await user.save();

  // 4) Log in user (Send the token)
  createSendToken(user, res, 200);
});
