const Points = require('./app/api/points');

module.exports = [
  { method: 'GET', path: '/api/points', config: Points.find },
  { method: 'GET', path: '/api/points/{id}', config: Points.findOne },
  { method: "POST", path: "/api/points", config: Points.create }
];