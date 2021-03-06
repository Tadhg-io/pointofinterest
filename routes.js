"use strict";

const Accounts = require("./app/controllers/accounts");
const Social = require("./app/controllers/social");
const POI = require("./app/controllers/points");

module.exports = [

  // Home
  { method: "GET", path: "/", config: POI.index },
  { method: "GET", path: "/create", config: POI.home },

  // Points
  { method: "GET", path: "/list", config: POI.list },
  { method: 'POST', path: '/add', config: POI.add },
  { method: "GET", path: "/view/{id}", config: POI.view },
  { method: "GET", path: "/edit/{id}", config: POI.edit },
  { method: "POST", path: "/save/{id}", config: POI.save },
  { method: "GET", path: "/delete/{id}", config: POI.delete },

  // Account
  { method: 'POST', path: '/signup', config: Accounts.signup },
  { method: 'GET', path: '/signup', config: Accounts.showSignup },
  { method: "GET", path: "/login", config: Accounts.showLogin },
  { method: "GET", path: "/logout", config: Accounts.logout },
  { method: "POST", path: "/login", config: Accounts.login },
  { method: 'GET', path: '/settings', config: Accounts.settings },
  { method: 'POST', path: '/settings', config: Accounts.saveSettings },

  // Social
  { method: 'POST', path: '/add-comment/{id}', config: Social.addComment },
  { method: 'POST', path: '/rate/{id}', config: Social.rate },


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