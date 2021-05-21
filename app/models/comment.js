"use strict";

const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const commentSchema = new Schema({
  date: Date,
  comment: String,
  user: {type: Schema.Types.ObjectId, ref: 'User'},
  point: {type: Schema.Types.ObjectId, ref: 'Point'}
});

commentSchema.statics.findCommentsByPoint = function(pointId) {
  return this.find({ point : pointId}).lean().populate("user").populate("point");
};

commentSchema.statics.findCommentsByUser = function(userId) {
  return this.find({ user : userId}).lean().populate("user").populate("point");
};

module.exports = Mongoose.model("Comment", commentSchema);