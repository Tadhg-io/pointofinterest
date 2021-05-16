"use strict";
const Point = require('../models/point');
const Category = require('../models/category');
const ImageStore = require('../utils/image-store');

const POI = {
  index: {
    auth: false,
    handler: function (request, h) {

      return h.view("main", { 
        title: "Point of Interest"
      });
    },
  },
  home: {
    handler: async function (request, h) {

      const categoryList = await Category.findAll();

        return h.view("create", { 
          title: "Point of Interest",
          categories: categoryList,
          loggedIn: true
        });
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
      // get the logged in user
      const loggedInUser = request.auth.credentials.id;
      // get the point from the DB
      const point = await Point.findPointById(pointId).lean();

      let isOwner = point.owner == loggedInUser;

      return h.view("view", {
        title: "View " + point.name,
        point: point,
        isOwner
      });

    },
  },
  edit: {
    handler: async function (request, h) {
      
      const pointId = request.params.id;
      // get the logged in user
      const loggedInUser = request.auth.credentials.id;
      // get the point from the DB
      const point = await Point.findPointById(pointId).lean();

      // confirm tha the user owns this record
      if(point.owner == loggedInUser) {
        return h.view("edit", {
          title: "Edit " + point.name,
          point: point
        });
      }
      // if they don't let them view the record instead
      else {
        return h.view("view", {
          title: "View " + point.name,
          point: point
        });
      }

    },
  },
  delete: {
    handler: async function (request, h) {

      const pointId = request.params.id;
      // get the logged in user
      const loggedInUser = request.auth.credentials.id;
      // get the point from the DB
      const point = await Point.findPointById(pointId).lean();

      // if the user owns the record, delete it
      if(point.owner == loggedInUser) {
        await Point.deleteOne({ _id: point._id });
      }

      return h.redirect('/list');
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
          category: data.category,
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
  save: {
    handler: async function (request, h) {
      
      // get the point from the DB
      const point = await Point.findPointById(request.params.id);
      // get the payload
      const data = request.payload;

      // get the logged in user
      const loggedInUser = request.auth.credentials.id;

      // update the record if the user is the owner
      if(point.owner == loggedInUser) {
        // update the Point
        point.name = data.name;
        point.description = data.description;
        await point.save();
      }
      
      return h.redirect("/view/" + point._id);

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