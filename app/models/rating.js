"use strict";

const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const ratingSchema = new Schema({
  point: {type: Schema.Types.ObjectId, ref: 'Point'},
  user: {type: Schema.Types.ObjectId, ref: 'User'},
  rating: Number
});

ratingSchema.statics.findRatingsByPoint = function(pointId) {
  return this.find({ point : pointId}).lean().populate("user").populate("point");
};

ratingSchema.statics.findRatingsByUser = function(userId) {
  return this.find({ user: userId }).lean().populate("user").populate("point");
}

module.exports = Mongoose.model("Rating", ratingSchema);