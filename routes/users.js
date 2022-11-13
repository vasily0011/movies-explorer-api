const userRoutes = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getCurrentUser,
  editUserProfile,
} = require('../controllers/users');
const auth = require('../middlewares/auth');

userRoutes.use(auth);

userRoutes.get('/users/me', getCurrentUser);

userRoutes.patch(
  '/users/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      email: Joi.string().required().email(),
    }),
  }),
  editUserProfile,
);

module.exports = userRoutes;
