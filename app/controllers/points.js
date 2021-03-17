"use strict";
const Point = require('../models/point');

const POI = {
  home: {
    handler: function (request, h) {
      return h.view("home", { title: "Make a Donation" });
    },
  },
  view: {
    handler: async function (request, h) {
      const points = await Point.findAll();
      return h.view("view", {
        title: "View Points of Interest",
        points
      });
    },
  },
  add: {
    handler: async function (request, h) {
      const data = request.payload;
      data.loggedBy = request.auth.credentials.id;
      data.id = '987654321';
      const newPoint = new Point({
        id: data.id,
        loggedBy: data.loggedBy,
        description: data.description
      });
      const point = await newPoint.save();
      return h.redirect("/view");
    },
  },
};

module.exports = POI;