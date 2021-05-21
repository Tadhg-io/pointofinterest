const Points = require('./app/api/points');
const Users = require('./app/api/user');
const Categories = require('./app/api/category');
const Comments = require('./app/api/comment');
const Rating = require('./app/api/rating');

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

  // Comments
  { method: 'GET', path: '/api/comments', config: Comments.find },
  { method: 'GET', path: '/api/comments/{id}', config: Comments.findOne },
  { method: "POST", path: "/api/comments", config: Comments.create },
  { method: "DELETE", path: "/api/comments/{id}", config: Comments.deleteOne },
  { method: "DELETE", path: "/api/comments", config: Comments.deleteAll },

  // Comments
  { method: 'GET', path: '/api/ratings', config: Rating.find },
  { method: 'GET', path: '/api/ratings/{id}', config: Rating.findOne },
  { method: "POST", path: "/api/ratings", config: Rating.create },
  { method: "DELETE", path: "/api/ratings/{id}", config: Rating.deleteOne },
  { method: "DELETE", path: "/api/ratings", config: Rating.deleteAll },

];