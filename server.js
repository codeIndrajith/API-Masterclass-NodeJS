const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/errorMiddleware');
const fileUploader = require('express-fileupload');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const ErrorResponse = require('./utils/errorResponse');
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

// Sanitize data
app.use(mongoSanitize());

// Prevent XSS attacks
app.use(xss());

// Set the security headers
app.use(helmet());

// Rate limiting (That is mean 100 per request under 10 minites)
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100,
  handler: (req, res, next) => {
    next(new ErrorResponse('Too many request, please try again later', 429));
  },
});

app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Enable CORS
app.use(cors());

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
