"use strict";

const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const pointSchema = new Schema({
  id: String,
  description: String,
  loggedBy: String
});

pointSchema.statics.findById = function(id) {
  return this.findOne({ id : id});
};

pointSchema.statics.findAll = function() {
  console.log('finding');
  return this.find({}).lean();
};

module.exports = Mongoose.model("Point", pointSchema);