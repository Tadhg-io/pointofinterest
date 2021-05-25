"use strict";
const Point = require("../models/point");
const Comment = require("../models/comment");
const User = require("../models/user");
const Rating = require("../models/rating");
const sanitize = require("../utils/sanitize-html");
const Joi = require("@hapi/joi");

const Social = {
  addComment: {
    validate: {
      payload: {
        comment: Joi.string().required().min(2).max(280)
      },
      options: {
        abortEarly: true
      },
      failAction: function(request, h, error) {

        const pointId = request.params.id;

        return h
          .redirect("/view/" + pointId, {
            title: "Comment error",
            errors: error.details
          }).takeover();
      }
    },
    handler: async function(request, h) {
      let pointId;
      try {
        const data = request.payload;

        // get the point id
        pointId = request.params.id;

        // get the logged in user
        const loggedInUser = request.auth.credentials.id;

        // sanitise html from inputs
        const comment = sanitize(data.comment);

        const newComment = new Comment({
          date: new Date(Date.now()),
          point: pointId,
          user: loggedInUser,
          comment
        });
        const createdComment = await newComment.save();
      } catch (error) {
        console.log(error);
      }
      return h.redirect("/view/" + pointId);
    },
    payload: {
      multipart: true,
      output: 'data',
      maxBytes: 209715200,
      parse: true
    }
  },
  rate: {
    validate: {
      payload: {
        rating: Joi.number().min(1).max(5)
      },
      options: {
        abortEarly: true
      },
      failAction: function(request, h, error) {

        const pointId = request.params.id;

        return h
          .redirect("/view/" + pointId, {
            title: "Rating error",
            errors: error.details
          }).takeover();
      }
    },
    handler: async function(request, h) {
      let pointId;
      try {
        const data = request.payload;

        // get the point id
        pointId = request.params.id;

        // get the logged in user
        const userId = request.auth.credentials.id;

        // see if this user has rated this point already
        let existingRating = await Rating.findUserPointRating(pointId, userId);
        // if a rating exists
        if(existingRating) {
          existingRating.rating = data.rating;
          await existingRating.save(function(){});
        }
        // otherwise create a new rating
        else {
          const newRating = new Rating({
            point: pointId,
            user: userId,
            rating: data.rating
          });
          const createdRating = await newRating.save();
        }

      } catch (error) {
        console.log(error);
      }
      return h.redirect("/view/" + pointId);
    }
  }
};

module.exports = Social;