'use strict';
const User = require('../models/user');
const Joi = require('@hapi/joi');

const Accounts = {
  index: {
    auth: false,
    handler: function(request, h) {
      return h.view("main", { title: "Welcome to Donations" });
    }
  },
  showSignup: {
    auth: false,
    handler: function(request, h) {
      return h.view('signup', { title: 'Sign up for Donations' });
    }
  },
  signup: {
    auth: false,
    validate: {
      payload: {
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
      },
      options: {
        abortEarly: false,
      },
      failAction: function (request, h, error) {
        return h
          .view("signup", {
            title: "Sign up error",
            errors: error.details,
          })
          .takeover()
          .code(400);
      },
    },
    handler: async function(request, h) {
      const payload = request.payload;
      const newUser = new User({
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        password: payload.password
      });
      const user = await newUser.save();
      request.cookieAuth.set({ id: user.id });
      return h.redirect("/home");
    }
  },
  showLogin: {
    auth: false,
    handler: function(request, h) {
      return h.view('login', { title: 'Login to Donations' });
    }
  },
  login: {
    auth: false,
    validate: {
      payload: {
        email: Joi.string().email().required(),
        password: Joi.string().required(),
      },
      options: {
        abortEarly: false,
      },
      failAction: function (request, h, error) {
        return h
          .view("login", {
            title: "Sign in error",
            errors: error.details,
          })
          .takeover()
          .code(400);
      },
    },
    handler: async function(request, h) {
      const { email, password } = request.payload;
      let user = await User.findByEmail(email);
      if (user) {
        if (user.comparePassword(password)) {
          request.cookieAuth.set({ id: user.id });
          return h.redirect("/home");
        }
      }
      return h.view("login", {
        title: "Unsuccessful",
        errors: [{ message: "Incorrect username or password." }],
      })
    }
  },
  logout: {
    auth: false,
    handler: function(request, h) {
      request.cookieAuth.clear();
      return h.redirect('/');
    }
  }
};

module.exports = Accounts;