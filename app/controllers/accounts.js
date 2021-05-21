'use strict';
const User = require('../models/user');
const Joi = require('@hapi/joi');
const bcrypt = require('bcrypt');
const sanitize = require('../utils/sanitize-html');
const saltRounds = 10;

const Accounts = {
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
        firstName: Joi.string().required().regex(/^[a-zA-Z]+$/).min(2).max(15),
        lastName: Joi.string().required().regex(/^[a-zA-Z]+$/).min(2).max(15),
        // must be email
        email: Joi.string().email().required(),
        // minimmum 8 characters, at least one uppercase letter, one lowercase letter and one number
        password: Joi.string().required().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/).message(
          "Password must contain at least one lower case letter, one upper case letter, one number, and be at least 8 characters"
        ),
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
      // get the payload
      const payload = request.payload;

      // hash the password
      const hash = await bcrypt.hash(payload.password, saltRounds);

      // sanitise the user input
      const firstName = sanitize(payload.firstName);
      const lastName = sanitize(payload.lastName);

      // create the user object
      const newUser = new User({
        firstName: firstName,
        lastName: lastName,
        email: payload.email,
        password: hash
      });
      const user = await newUser.save();
      request.cookieAuth.set({ id: user.id });
      return h.redirect("/create");
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
        const successfulLogin = await user.comparePassword(password);
        if (successfulLogin) {
          request.cookieAuth.set({ id: user.id });
          return h.redirect("/create");
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
  },
  saveSettings: {
    validate: {
      payload: {
        firstName: Joi.string().required().regex(/^[a-zA-Z]+$/).min(2).max(15),
        lastName: Joi.string().required().regex(/^[a-zA-Z]+$/).min(2).max(15),
        // must be email
        email: Joi.string().email().required(),
        // minimmum 8 characters, at least one uppercase letter, one lowercase letter and one number
        password: Joi.string().allow('').empty('').regex(/^$|^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/).message(
          "Password must contain at least one lower case letter, one upper case letter, one number, and be at least 8 characters"
        )
      },
      options: {
        abortEarly: false,
      },
      failAction: async function (request, h, error) {
        const id = request.auth.credentials.id;
        const user = await User.findById(id).lean();
        return h
          .view("settings", {
            title: "Save error",
            errors: error.details,
            user: user
          })
          .takeover()
          .code(400);
      },
    },
    handler: async function(request, h) {
      const userEdit = request.payload;
      const id = request.auth.credentials.id;
      const user = await User.findById(id);
      user.firstName = userEdit.firstName;
      user.lastName = userEdit.lastName;
      user.email = userEdit.email;
      // if a password was provided
      if(userEdit.password)
      {
        // hash the password
        const hash = await bcrypt.hash(userEdit.password, saltRounds);
        // set the password
        user.password = hash;
      }
      await user.save();
      const updatedUser = await User.findById(id).lean();
      return h.view("settings", { title: "Account Settings", user: updatedUser, successMessage: "Yor settings have been saved!" });
    }
  },
  settings: {
    handler: async function(request, h) {
      try {
        const id = request.auth.credentials.id;
        const user = await User.findById(id).lean();
        return h.view("settings", { title: "Account Settings", user: user });
      } catch (err) {
        return h.view("login", { errors: [{ message: err.message }] });
      }
    }
  }
};

module.exports = Accounts;