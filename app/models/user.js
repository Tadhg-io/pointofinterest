"use strict";

const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String
});

userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email : email});
};

userSchema.methods.comparePassword = async function(testPassword) {
  // check if the hash matches the password
  const isMatch = await bcrypt.compare(testPassword, this.password);
  return isMatch;
};

module.exports = Mongoose.model("User", userSchema);