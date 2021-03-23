"use strict";

const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const pointSchema = new Schema({
  description: String,
  name: String,
  loggedBy: String,
  imageUrl: String,
  owner: {type: Schema.Types.ObjectId, ref: 'User'}
});

pointSchema.statics.findPointById = function(id) {
  return this.findOne({ _id : id});
};

pointSchema.statics.findAll = function() {
  return this.find({}).lean();
};

module.exports = Mongoose.model("Point", pointSchema);