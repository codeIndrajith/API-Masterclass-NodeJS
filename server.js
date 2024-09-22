const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/errorMiddleware');
const fileUploader = require('express-fileupload');
// load the env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const morgan = require('morgan');

// Body parser
app.use(express.json());

// Cookie Parser
app.use(cookieParser());

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

// File Uploading
app.use(fileUploader());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const bootcampRouter = require('./routes/bootcampRoutes');
const courseRouter = require('./routes/courseRoutes');
const auth = require('./routes/authRoutes');
const users = require('./routes/userRoutes');
const reviews = require('./routes/reviewRoutes');
// Mount routes
app.use('/api/v1/bootcamps', bootcampRouter);
app.use('/api/v1/courses', courseRouter);
app.use('/api/v1/auth', auth);
app.use('/api/v1/admin/users', users);
app.use('/api/v1/reviews', reviews);

app.use(errorHandler);

app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
