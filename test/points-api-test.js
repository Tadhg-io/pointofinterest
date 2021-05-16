"use strict";

const assert = require("chai").assert;
const axios = require("axios");

suite("Points API tests", function () {
  test("get points", async function () {
    const response = await axios.get("http://localhost:3000/api/points");
    const points = response.data;
    assert.equal(3, points.length);

    assert.equal(points[0].name, "Ringfort");
    assert.equal(points[0].description, "A Ringfort in County Galway");
    assert.equal(points[0].loggedBy, "John Smith");

    assert.equal(points[1].name, "Castle");
    assert.equal(points[1].description, "A Castle in County Mayo");
    assert.equal(points[1].loggedBy, "Thomas Paine");
  });


  test("get one point", async function () {
    let response = await axios.get("http://localhost:3000/api/points");
    const points = response.data;
    assert.equal(3, points.length);

    const onePointUrl = "http://localhost:3000/api/points/" + points[0]._id;
    response = await axios.get(onePointUrl);
    const onePoint = response.data;

    assert.equal(onePoint.name, "Ringfort");
    assert.equal(onePoint.description, "A Ringfort in County Galway");
    assert.equal(onePoint.loggedBy, "John Smith");
  });

  test("create a candidate", async function () {
    const pointsUrl = "http://localhost:3000/api/points";
    const newPoint = {
      name: "Ringfort 2",
      description: "Electric Boogaloo"
    };

    const response = await axios.post(pointsUrl, newPoint);
    const returnedPoint = response.data;
    assert.equal(201, response.status);

    assert.equal(returnedPoint.name, "Ringfort 2");
    assert.equal(returnedPoint.description, "Electric Boogaloo");
  });
});