const AppError = require('../utils/appError');
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map(
    (el) => `${el.path} - ${el.value || el.message}`
  );
  const message = `Invalid inputs: ${errors.join('. ')}`;

  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const message = `Duplicate field value: "${
    Object.values(err.keyValue)[0]
  }". Please use another value`;

  return new AppError(message, 400);
};

const handleFileBusyError = () => {
  // const message = `File is opened: "${err.path}". Please close it first.`;
  const message = `Store ledger file for this project is opened. Please close it first.`;
  return new AppError(message, 400);
};
const handleJWTError = () => {
  const message = 'Invalid token! Please log in again.';
  return new AppError(message, 401);
};
const handleTokenExpiredError = () => {
  const message = 'Your token has expired! Please log in again.';
  return new AppError(message, 401);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    err,
    message: err.message,
    stack: err.stack,
  });
};
const sendErrorProd = (err, res) => {
  // Operational error: Trusted we can send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    // Programming error: Dont send details to client
  } else {
    // 1) Log errors
    console.error('ERROR', err);

    // 2) Send a generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  }

  if (process.env.NODE_ENV === 'production') {
    let error = { ...err };

    if (err.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (err.name === 'JsonWebTokenError') error = handleJWTError(error);
    if (err.name === 'TokenExpiredError')
      error = handleTokenExpiredError(error);
    if (err.code === 11000) error = handleDuplicateFieldsDB(error);
    if (err.message.includes('EBUSY')) error = handleFileBusyError(error);
    sendErrorProd(error, res);
  }
};
