const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// load the env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const morgan = require('morgan');

// Body parser
app.use(express.json());

// database connection
connectDB();

// const logger = (req, res, next) => {
//   req.hello = 'Hello world';
//   console.log('Middleware ran');
//   next();
// };

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const bootcampRouter = require('./routes/bootcampRoutes');
// Mount routes
app.use('/api/v1/bootcamps', bootcampRouter);

app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
