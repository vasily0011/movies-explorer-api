const Movie = require('../models/movie');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => {
      res.send({ movies });
    })
    .catch((err) => next(err));
};

module.exports.createMovie = (req, res, next) => {
  const { name, link, owner = req.user._id } = req.body;
  Movie.create({ name, link, owner })
    .then((movie) => {
      res.send(movie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError('При создании карточки переданы некорректные данные'));
      }
      return next(err);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.cardId)
    // eslint-disable-next-line consistent-return
    .then((movie) => {
      if (!movie) {
        return next(new NotFoundError('Карточка с указанным id не найдена'));
      }
      if (movie.owner.toString() !== req.user._id) {
        return next(new ForbiddenError('Отказано в доступе'));
      }
      return Movie.findByIdAndRemove(req.params.cardId)
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

module.exports.likeMovie = (req, res, next) => {
  Movie.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .then((movie) => {
      if (movie) {
        return res.send(movie);
      }
      return next(new NotFoundError('Такой карточки не существует'));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ValidationError('Данные переданы некорректно'));
      }
      return next(err);
    });
};
