const Movie = require('../models/movie');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => {
      res.send(movies.map((element) => element));
    })
    .catch((err) => next(err));
};

module.exports.createMovie = (req, res, next) => {
  const owner = req.user._id;
  Movie.create({ owner, ...req.body })
    .then((movies) => {
      res.send(movies);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError('При создании карточки переданы некорректные данные'));
      }
      return next(err);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  const { id } = req.params;
  return Movie.findById(id)
    .then((movie) => {
      if (!movie) {
        return next(new NotFoundError('Карточка с указанным id не найдена'));
      }
      if (movie.owner.toString() !== req.user._id) {
        return next(new ForbiddenError('Отказано в доступе'));
      }
      return Movie.findByIdAndRemove(id)
        .then(() => {
          res.send(movie);
        });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ValidationError('Некорректные данные запроса'));
      }
      return next(err);
    });
};
