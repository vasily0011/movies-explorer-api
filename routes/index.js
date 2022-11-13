const router = require('express').Router();
const userRoutes = require('./users');
const movieRoutes = require('./movies');
const { validationCreateUser, validationLogin } = require('../middlewares/validation');
const { login, createUser } = require('../controllers/users');
const NotFoundError = require('../errors/NotFoundError');

router.post('/signin', validationLogin, login);
router.post('/signup', validationCreateUser, createUser);

router.use(userRoutes);
router.use(movieRoutes);
router.use((req, res, next) => next(new NotFoundError('Страница не найдена.')));

module.exports = router;
