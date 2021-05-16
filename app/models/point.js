"use strict";

const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const pointSchema = new Schema({
  description: String,
  name: String,
  latitude: Number,
  longitude: Number,
  loggedBy: String,
  imageUrl: String,
  category: {type: Schema.Types.ObjectId, ref: 'Category'},
  owner: {type: Schema.Types.ObjectId, ref: 'User'}
});

pointSchema.statics.findPointById = function(id) {
  return this.findOne({ _id : id});
};

pointSchema.statics.findAll = function() {
  return this.find({}).lean().populate("category");
};

module.exports = Mongoose.model("Point", pointSchema);