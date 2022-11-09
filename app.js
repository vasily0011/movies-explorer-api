require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const helmet = require('helmet');
const { auth } = require('./middlewares/auth');
const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');
const { createUser, login } = require('./controllers/users');
const NotFoundError = require('./errors/NotFoundError');
const { errorHandler } = require('./middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { validationLogin, validationCreateUser } = require('./middlewares/validation');

const { PORT = 3000 } = process.env;

const app = express();

const allowedCors = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://localhost:3000',
  'https://localhost:3001',
];

app.use(helmet());
app.use(cors({
  origin: allowedCors,
  credentials: true,
}));

mongoose.connect('mongodb://localhost:27017/moviesdb', {});

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);

app.post(
  '/signin',
  validationLogin,
  login,
);

app.post(
  '/signup',
  validationCreateUser,
  createUser,
);

app.use(auth);
app.use('/users', userRoutes);
app.use('/cards', cardRoutes);
app.use((req, res, next) => next(new NotFoundError('Страница не найдена.')));

app.use(errors());
app.use(errorHandler);
app.use(errorLogger);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
