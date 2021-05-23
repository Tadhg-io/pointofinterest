"use strict";

const assert = require("chai").assert;
const TestService = require("./test-service");
const fixtures = require("./fixtures.json");
const axios = require("axios");
const _ = require("lodash");

suite("Points API tests", function () {

  let points = fixtures.points;
  let newPoint = fixtures.newPoint;
  let newUser = fixtures.newUser;
  const testService = new TestService("http://localhost:3000");

  suiteSetup(async function () {
    await testService.deleteAllUsers();
    const returnedUser = await testService.createUser(newUser);
    const response = await testService.authenticate(newUser);
  });

  suiteTeardown(async function () {
    await testService.deleteAllUsers();
    testService.clearAuth();
  });

  setup(async function () {
    await testService.deleteAllPoints();
  });

  teardown(async function () {
    await testService.deleteAllPoints();
  });

  test("create a point", async function () {
    const returnedPoint = await testService.createPoint(newPoint);
    assert(_.some([returnedPoint], newPoint), "returnedCandidate must be a superset of newCandidate");
    assert.isDefined(returnedPoint._id);
  });

  test("get a point", async function () {
    const p1 = await testService.createPoint(newPoint);
    const p2 = await testService.getPoint(p1._id);
    assert.deepEqual(p1, p2);
  });

  test("get invalid point", async function () {
    const c1 = await testService.getPoint("1234");
    assert.isNull(c1);
    const c2 = await testService.getPoint("012345678901234567890123");
    assert.isNull(c2);
  });

  test("delete a point", async function () {
    let c = await testService.createPoint(newPoint);
    assert(c._id != null);
    await testService.deleteOnePoint(c._id);
    c = await testService.getPoint(c._id);
    assert(c == null);
  });

  test("get all point", async function () {
    for (let p of points) {
      await testService.createPoint(p);
    }

    const allPoints = await testService.getPois();
    assert.equal(allPoints.length, points.length);
  });

  test("get a points detail", async function () {
    for (let p of points) {
      await testService.createPoint(p);
    }

    const allPoints = await testService.getPois();
    for (var i = 0; i < points.length; i++) {
      assert(_.some([allPoints[i]], points[i]), "returnedCandidate must be a superset of newCandidate");
    }
  });

  test("get all points empty", async function () {
    const allCandidates = await testService.getPois();
    assert.equal(allCandidates.length, 0);
  });

});