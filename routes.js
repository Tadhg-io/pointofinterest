"use strict";

const Accounts = require("./app/controllers/accounts");
const POI = require("./app/controllers/points");

module.exports = [
  { method: "GET", path: "/", config: Accounts.index },
  { method: "GET", path: "/home", config: POI.home },
  { method: "GET", path: "/view", config: POI.view },
  { method: 'POST', path: '/signup', config: Accounts.signup },
  { method: 'GET', path: '/signup', config: Accounts.showSignup },
  { method: "GET", path: "/login", config: Accounts.showLogin },
  { method: "GET", path: "/logout", config: Accounts.logout },
  { method: "POST", path: "/login", config: Accounts.login },
  { method: 'POST', path: '/add', config: POI.add },

  {
    method: "GET",
    path: "/{param*}",
    handler: {
      directory: {
        path: "./public"
      }
    },
    options: { auth: false }
  }
];