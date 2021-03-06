'use strict';
require('./app/models/db');

const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const Handlebars = require('handlebars');
const Cookie = require("@hapi/cookie");
const env = require('dotenv');
const ImageStore = require('./app/utils/image-store');
const Joi = require("@hapi/joi");
const utils = require("./app/api/utils.js");
const handlebarsHelpers = require("./app/utils/handlebars-helpers");

env.config();

const server = Hapi.server({
  port: 3000,
  host: 'localhost',
});

const credentials = {
  cloud_name: process.env.name,
  api_key: process.env.key,
  api_secret: process.env.secret
};

async function init() {
  await server.register(Inert);
  await server.register(Vision);
  await server.register(Cookie);
  await server.register(require('hapi-auth-jwt2'));

  ImageStore.configure(credentials);

  server.views({
    engines: {
      hbs: require('handlebars'),
    },
    relativeTo: __dirname,
    path: './app/views',
    layoutPath: './app/views/layouts',
    partialsPath: './app/views/partials',
    layout: true,
    isCached: false,
  });

  server.auth.strategy('session', 'cookie', {
    cookie: {
      name: process.env.cookie_name,
      password: process.env.cookie_password,
      isSecure: false
    },
    redirectTo: '/',
  });

  server.auth.strategy("jwt", "jwt", {
    key: "secretpasswordnotrevealedtoanyone",
    validate: utils.validate,
    verifyOptions: { algorithms: ["HS256"] },
  });

  server.auth.default('session');

  server.validator(require("@hapi/joi"));

  server.route(require('./routes'));
  server.route(require('./routes-api'));
  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
}

// register Handlebars helpers
Handlebars.registerHelper('formatDate', handlebarsHelpers.formatDate);

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();