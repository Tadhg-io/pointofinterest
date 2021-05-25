'use strict';

const Rating = require('../models/rating');
const Boom = require("@hapi/boom");

const Ratings = {
  find: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      const ratings = await Rating.find();
      return ratings;
    },
  },

  findOne: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        const rating = await Rating.findOne({ _id: request.params.id });
        if (!rating) {
          return Boom.notFound("No Rating with this id");
        }
        return rating;
      } catch (err) {
        return Boom.notFound("No Rating with this id");
      }
    },
  },

  create: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      const data = request.payload;
      const newRating = new Rating({
        rating: data.rating,
        point: data.point,
        user: data.user
      });
      const rating = await newRating.save();
      if (rating) {
        return h.response(rating).code(201);
      }
      return Boom.badImplementation("error creating rating");
    },
  },

  deleteAll: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      await Rating.deleteMany({});
      return { success: true };
    },
  },

  deleteOne: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      const rating = await Rating.deleteOne({ _id: request.params.id });
      if (rating) {
        return { success: true };
      }
      return Boom.notFound("id not found");
    },
  },
};

module.exports = Ratings;