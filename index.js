'use strict';
require('./app/models/db');

const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const Handlebars = require('handlebars');
const Cookie = require("@hapi/cookie");
const Bell = require('@hapi/bell');
const env = require('dotenv');
const ImageStore = require('./app/utils/image-store');
const Joi = require("@hapi/joi");
const fs = require('fs');

env.config();

const server = Hapi.server({
  port: 3000,
  host: 'localhost',
  tls: {
    key: fs.readFileSync('keys/private/webserver.key'),
    cert: fs.readFileSync('keys/webserver.crt')
  }
});

const credentials = {
  cloud_name: process.env.name,
  api_key: process.env.key,
  api_secret: process.env.secret
};

async function init() {
  await server.register(Inert);
  await server.register(Vision);

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


  // Register bell and hapi auth cookie with the server
  await server.register([Bell, Cookie]);

  // set the bell options for Github authentication
  var bellAuthOptions = {
    provider: 'github',
    password: 'github-encryption-password-secure',
    clientId: 'dd5ecabb6b4c6cfe8186',
    clientSecret: '3d44c5fcfd6f0013a13a5330a2007866ac771c6f',
    isSecure: false,
  };

  server.auth.strategy('github-oauth', 'bell', bellAuthOptions);

  server.auth.strategy('session', 'cookie', {
    cookie: {
      name: process.env.cookie_name,
      password: process.env.cookie_password,
      isSecure: false
    },
    redirectTo: '/',
  });

  server.auth.default('session');

  server.validator(require("@hapi/joi"));

  server.route(require('./routes'));
  server.route(require('./routes-api'));
  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
}

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();