"use strict";
const Point = require('../models/point');
const ImageStore = require('../utils/image-store');

const POI = {
  home: {
    handler: function (request, h) {
      return h.view("home", { title: "Make a Donation" });
    },
  },
  list: {
    handler: async function (request, h) {
      const points = await Point.findAll();
      return h.view("list", {
        title: "POI list",
        points
      });
    },
  },
  view: {
    handler: async function (request, h) {
      const pointId = request.params.id;
      const point = await Point.findPointById(pointId);
      return h.view("view", {
        title: "View " + point.name,
        point: point
      });
    },
  },
  add: {
    handler: async function (request, h) {
      try {
        const data = request.payload;
        let url;
        if (Object.keys(data.imagefile).length > 0) {
          url = await ImageStore.uploadImage(request.payload.imagefile);
        }

        const loggedInUser = request.auth.credentials.id;

        const newPoint = new Point({
          id: data.id,
          loggedBy: data.loggedBy,
          description: data.description,
          name: data.name,
          imageUrl: url,
          owner: loggedInUser
        });
        const point = await newPoint.save();
      }
      catch(error) {
        console.log(error)
      }
      return h.redirect("/list");
    },
    payload: {
      multipart: true,
      output: 'data',
      maxBytes: 209715200,
      parse: true
    }
  },
};

module.exports = POI;