require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
const helmet = require('helmet');
const { errorHandler } = require('./middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const apiLimiter = require('./middlewares/rateLimit');
const routes = require('./routes');

const {
  NODE_ENV,
  PORT = 3002,
  DB_ADDRESS,
} = process.env;

const app = express();
app.use(helmet());
app.use(express.json());

const allowedCors = [
  'http://localhost:3002',
  'https://localhost:3002',
  'http://movies.vasily0011.nomoredomains.icu',
  'https://movies.vasily0011.nomoredomains.icu',
];

app.use(cors({
  origin: allowedCors,
  credentials: true,
}));

app.use(requestLogger);
app.use(apiLimiter);
app.use(routes);
app.use(errorLogger);
app.use(errorHandler);
app.use(errors());

mongoose.connect(`${NODE_ENV === 'production' ? DB_ADDRESS : 'mongodb://localhost:27017/moviesdb'}`, {
  // useNewUrlParser: true,
  // useUnifiedTopology: false,
});
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
