"use strict";

const assert = require("chai").assert;
const TestService = require("./test-service");
const fixtures = require("./fixtures.json");
const axios = require("axios");

suite("Points API tests", function () {

  let newRatings = fixtures.newRatings;
  let newPoint = fixtures.newPoint;
  let newUser = fixtures.newUser;
  const testService = new TestService("http://localhost:3000");
  const _ = require("lodash");

  setup(async function () {
    await testService.deleteAllRatings();
    await testService.deleteAllUsers();
    await testService.deleteAllPoints();
  });

  teardown(async function () {
    await testService.deleteAllRatings();
    await testService.deleteAllUsers();
    await testService.deleteAllPoints();
  });

  test("create a rating", async function () {
    const createdUser = await testService.createUser(newUser);
    const createdPoint = await testService.createPoint(newPoint);

    const newRating = {
      //date: Date.now(),
      rating: newRatings[0].rating,
      point: createdPoint._id,
      user: createdUser._id
    }
    const returnedRating = await testService.createRating(newRating);
    assert(_.some([returnedRating], newRating), "returnedRating must be a superset of newRatings");
    assert.isDefined(returnedRating._id);
  });

  test("get a rating", async function () {
    const r1 = await testService.createRating(newRatings);
    const r2 = await testService.getRating(r1._id);
    assert.deepEqual(r1, r2);
  });

  test("get invalid rating", async function () {
    const r1 = await testService.getRating("1234");
    assert.isNull(r1);
    const r2 = await testService.getRating("012345678901234567890123");
    assert.isNull(r2);
  });

  test("delete a rating", async function () {
    let r = await testService.createRating(newRatings);
    assert(r._id != null);
    await testService.deleteOneRating(r._id);
    r = await testService.getRating(r._id);
    assert(r == null);
  });

  test("get all rating", async function () {
    for (let r of newRatings) {
      await testService.createRating(r);
    }

    const allRating = await testService.getRatings();
    assert.equal(allRating.length, newRatings.length);
  });

  test("get rating's detail", async function () {
    for (let r of newRatings) {
      await testService.createRating(r);
    }

    const allRatings = await testService.getRatings();
    for (var i = 0; i < allRatings.length; i++) {
      assert(_.some([allRatings[i]], newRatings[i]), "returnedRating must be a superset of newRating");
    }
  });

  test("get all ratings empty", async function () {
    const allRatings = await testService.getRatings();
    assert.equal(allRatings.length, 0);
  });

});