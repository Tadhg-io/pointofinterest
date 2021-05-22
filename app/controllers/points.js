"use strict";
const Point = require('../models/point');
const Category = require('../models/category');
const ImageStore = require('../utils/image-store');
const sanitize = require('../utils/sanitize-html');
const Joi = require('@hapi/joi');

const POI = {
  home: {
    auth: false,
    handler: function (request, h) {

      console.log("HomeAuth", request.auth);
      return h.view("main", { 
        title: "Point of Interest"
      });
    },
  },
  create: {
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
      console.log("ListAuth", request.auth);
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
    validate: {
      payload: {
        name: Joi.string().required().min(2).max(40),
        description: Joi.string().required().min(10),
        category: Joi.required(),
        latitude: Joi.number(),
        longitude: Joi.number().required(),
      },
      options: {
        abortEarly: false,
      },
      failAction: function (request, h, error) {
        return h
          .view("add", {
            title: "Create error",
            errors: error.details,
          })
          .takeover()
          .code(400);
      },
    },
    handler: async function (request, h) {
      try {
        const data = request.payload;
        let url;
        if (Object.keys(data.imagefile).length > 0) {
          url = await ImageStore.uploadImage(request.payload.imagefile);
        }

        // get the logged in user
        const loggedInUser = request.auth.credentials.id;

        // sanitise html from inputs
        const description = sanitize(data.description);
        const name = sanitize(data.name);
        const category = sanitize(data.category);
        const latitude = sanitize(data.latitude);
        const longitude = sanitize(data.longitude);

        const newPoint = new Point({
          id: data.id,
          loggedBy: data.loggedBy,
          description: description,
          name: name,
          imageUrl: url,
          category: category,
          latitude: latitude,
          longitude: longitude,
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
    validate: {
      payload: {
        name: Joi.string().required().min(2).max(40),
        description: Joi.string().required().min(10),
        category: Joi.required(),
        latitude: Joi.number(),
        longitude: Joi.number().required(),
      },
      options: {
        abortEarly: false,
      },
      failAction: function (request, h, error) {
        return h
          .view("edit", {
            title: "Update error",
            errors: error.details,
          })
          .takeover()
          .code(400);
      },
    },
    handler: async function (request, h) {
      
      // get the point from the DB
      const point = await Point.findPointById(request.params.id);
      // get the payload
      const data = request.payload;

      // get the logged in user
      const loggedInUser = request.auth.credentials.id;

      // sanitise html from inputs
      const description = sanitize(data.description);
      const name = sanitize(data.name);
      const category = sanitize(data.category);
      const latitude = sanitize(data.latitude);
      const longitude = sanitize(data.longitude);

      // update the record if the user is the owner
      if(point.owner == loggedInUser) {
        // update the Point
        point.name = name;
        point.description = description;
        point.category = category;
        point.latitude = latitude;
        point.longitude = longitude;
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