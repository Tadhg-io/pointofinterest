"use strict";

const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const categorySchema = new Schema({
  name: String
});

categorySchema.statics.findByName = function(name) {
  return this.findOne({ name : name});
};


categorySchema.statics.findAll = function() {
  return this.find({}).lean();
};

module.exports = Mongoose.model("Category", categorySchema);