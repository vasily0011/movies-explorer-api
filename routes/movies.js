const movieRoutes = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');
const auth = require('../middlewares/auth');
const { regexUrl } = require('../constants/regexUrl');

movieRoutes.use(auth);
movieRoutes.get('/movies', getMovies);

movieRoutes.post(
  '/movies',
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.string().required(),
      description: Joi.string().required(),
      image: Joi.string().required().regex(regexUrl),
      trailerLink: Joi.string().required().regex(regexUrl),
      thumbnail: Joi.string().required().regex(regexUrl),
      movieId: Joi.number().required(),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
    }),
  }),
  createMovie,
);

movieRoutes.delete(
  '/movies/:id',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().hex().length(24),
    }),
  }),
  deleteMovie,
);

module.exports = movieRoutes;
