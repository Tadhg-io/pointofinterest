"use strict";
const sanHTML = require('sanitize-html');

const sanitize = function (stringToSanitize) {
  return sanHTML(stringToSanitize, {
    allowedTags: [],
    allowedAttributes: {},
    allowedIframeHostnames: []
  });
}

module.exports = sanitize;