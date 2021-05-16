'use strict';

const Point = require('../models/point');
const Boom = require("@hapi/boom");

const Points = {
  find: {
    auth: false,
    handler: async function (request, h) {
      const points = await Point.find();
      return points;
    },
  },
  findOne: {
    auth: false,
    handler: async function (request, h) {
      try {
        const point = await Point.findOne({ _id: request.params.id });
        if (!point) {
          return Boom.notFound("No Point with this id");
        }
        return point;
      } catch (err) {
        return Boom.notFound("No Point with this id");
      }
    },
  },
  create: {
    auth: false,
    handler: async function (request, h) {
      const data = request.payload;
      const newPoint = new Point({
        name: data.name,
        description: data.description
      });
      const point = await newPoint.save();
      if (point) {
        return h.response(point).code(201);
      }
      return Boom.badImplementation("error creating point");
    },
  }
};

module.exports = Points;