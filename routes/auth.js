const express = require('express');
const validator = require('validator');
const passport = require('passport');
const User = require('../models/users')
const router = new express.Router();
var jwt = require('jsonwebtoken');

/**
 * Validate the sign up form
 *
 * @param {object} payload - the HTTP body message
 * @returns {object} The result of validation. Object contains a boolean validation result,
 *                   errors tips, and a global message for the whole form.
 */
function validateSignupForm(payload) {
  const errors = {};
  let isFormValid = true;
  let message = '';

  if (!payload || typeof payload.username !== 'string' || !validator.isEmail(payload.email)) {
    isFormValid = false;
    errors.email = 'Please provide a correct email address.';
  }

  if (!payload || typeof payload.password !== 'string' || payload.password.trim().length < 8) {
    isFormValid = false;
    errors.password = 'Password must have at least 8 characters.';
  }

  if (!payload || typeof payload.name !== 'string' || payload.name.trim().length === 0) {
    isFormValid = false;
    errors.name = 'Please provide your name.';
  }

  if (!isFormValid) {
    message = 'Check the form for errors.';
  }

  return {
    success: isFormValid,
    message,
    errors
  };
}

/**
 * Validate the login form
 *
 * @param {object} payload - the HTTP body message
 * @returns {object} The result of validation. Object contains a boolean validation result,
 *                   errors tips, and a global message for the whole form.
 */
function validateLoginForm(payload) {
  const errors = {};
  let isFormValid = true;
  let message = '';

  if (!payload || typeof payload["username"] !== 'string' || payload.email.trim().length === 0) {
    isFormValid = false;
    errors.email = 'Please provide your email address.';
  }

  if (!payload || typeof payload["password"] !== 'string' || payload.password.trim().length === 0) {
    isFormValid = false;
    errors.password = 'Please provide your password.';
  }

  if (!isFormValid) {
    message = 'Check the form for errors.';
  }

  return {
    success: isFormValid,
    message,
    errors
  };
}

router.post('/signup', (req, res, next) => {
  const validationResult = validateSignupForm(req.body);
  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: validationResult.message,
      errors: validationResult.errors
    });
  }
  User.register(new User({ username: req.body.username }), req.body.password, function (
    err, user
  ) {
    if (err) {
      console.log(err.message);
    }
    else {
      user.token =
        user.type = req.body.type;
      user.isVerified = false;
      user.first_name = req.body.first_name;
      user.last_name = req.body.last_name;
      user.save();
      res.status(200).send('created new user');

    }
  })
});


router.post('/login', (req, res, next) => {
  console.log(req.body)
  return passport.authenticate('local', (err, user, info) => {
    if (err) {
      if (err.name === 'IncorrectCredentialsError') {
        return res.status(400).json({
          success: false,
          message: err.message
        });
      }

      return res.status(400).json({
        success: false,
        message: 'Could not process the form.'
      });
    }
    User.findById(user._id, function (err, foundUser) {
      if (err) {
        res.status(400).json({
          err: err.message
        });
      }
      foundUser.token = jwt.sign({ foo: 'bar' }, 'secretPhrase');
      foundUser.save();
      return res.json({
        success: true,
        message: 'You have successfully logged in!',
        user: user,
        token: user.token

      });

    });


  })(req, res, next);
});

module.exports = router;