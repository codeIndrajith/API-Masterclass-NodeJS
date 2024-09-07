const express = require('express');
const dotenv = require('dotenv');
const bootcampRouter = require('../devCamper-API/routes/bootcamp');
const morgan = require('morgan');

// load the env
dotenv.config({ path: './config/config.env' });

const app = express();
const PORT = process.env.PORT || 5000;

const logger = (req, res, next) => {
  req.hello = 'Hello world'; // can create variable or something during the request
  console.log('Middleware ran');
  next();
};

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount routes
app.use('/api/v1/bootcamp', bootcampRouter);

app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
