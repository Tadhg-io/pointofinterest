const Points = require('./app/api/points');
const Users = require('./app/api/user');
const Categories = require('./app/api/category');

module.exports = [

  // Points
  { method: 'GET', path: '/api/points', config: Points.find },
  { method: 'GET', path: '/api/points/{id}', config: Points.findOne },
  { method: "POST", path: "/api/points", config: Points.create },
  { method: "DELETE", path: "/api/points/{id}", config: Points.deleteOne },
  { method: "DELETE", path: "/api/points", config: Points.deleteAll },

  // Users
  { method: 'GET', path: '/api/users', config: Users.find },
  { method: 'GET', path: '/api/users/{id}', config: Users.findOne },
  { method: "POST", path: "/api/users", config: Users.create },
  { method: "DELETE", path: "/api/users/{id}", config: Users.deleteOne },
  { method: "DELETE", path: "/api/users", config: Users.deleteAll },

  // Categories
  { method: 'GET', path: '/api/cat', config: Categories.find },
  { method: 'GET', path: '/api/cat/{id}', config: Categories.findOne },
  { method: "POST", path: "/api/cat", config: Categories.create },
  { method: "DELETE", path: "/api/cat/{id}", config: Categories.deleteOne },
  { method: "DELETE", path: "/api/cat", config: Categories.deleteAll },

];