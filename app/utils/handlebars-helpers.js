"use strict";

exports.formatDate = function(date) {
  const dateTime = new Date(date);
  return dateTime.toString('dd-MM-yyyy');
}