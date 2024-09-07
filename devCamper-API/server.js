const express = require('express');
const dotenv = require('dotenv');
const bootcampRouter = require('../devCamper-API/routes/bootcamp');

// load the env
dotenv.config({ path: './config/config.env' });

const app = express();
const PORT = process.env.PORT || 5000;

// Mount routes
app.use('/api/v1/bootcamp', bootcampRouter);

app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
