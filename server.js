process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT EXCEPTION: Shutting down...');
  process.exit(1);
});

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');
// const { default: mongoose } = require('mongoose');
const LOCAL_URL = process.env.DB_LOCAL_URL;
const HOSTED_URL = process.env.DB_HOSTED_URL.replace(
  '<PASSWORD>',
  process.env.DB_PASSWORD
);
if (process.env.NODE_ENV === 'development') {
  mongoose.connect(LOCAL_URL).then(() => {
    console.log('Successfull connected to the database');
  });
}
if (process.env.NODE_ENV === 'production') {
  mongoose.connect(HOSTED_URL).then(() => {
    // mongoose.connect(LOCAL_URL).then(() => {
    console.log('Successfull connected to the hosted database');
  });
}
const port = process.env.PORT || 8000;

const server = app.listen(8000, () =>
  console.log(`App is runing at port ${port}...`)
);

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION: Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
