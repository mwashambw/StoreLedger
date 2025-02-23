const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const projectRouter = require('./routes/projectRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) GLOBAL MIDDLEWARES
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Set security http headers
app.use(helmet());

// Limit too many request from same IP
// const limiter = rateLimit({
//   max: 100,
//   windowMs: 60 * 60 * 1000,
//   message: 'Too many requests from this IP, Please try again in an hour.',
// });

// app.use('/api', limiter);

// Body parser, Reading data into req.body
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// CORS policy
app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'production'
        ? 'https://store-ledger.vercel.app'
        : 'http://localhost:5173',

    credentials: true, // Allow credentials (cookies) from the client.
  })
);

// 3) ROUTES

app.use('/api/v1/projects', projectRouter);
app.use('/api/v1/users', userRouter);

// 4) Error
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// Global error handler
app.use(globalErrorHandler);

module.exports = app;
