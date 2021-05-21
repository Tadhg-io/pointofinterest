"use strict";

const assert = require("chai").assert;
const TestService = require("./test-service");
const fixtures = require("./fixtures.json");
const axios = require("axios");

suite("Points API tests", function () {

  let newComments = fixtures.newComments;
  let newPoint = fixtures.newPoint;
  let newUser = fixtures.newUser;
  const testService = new TestService("http://localhost:3000");
  const _ = require("lodash");

  setup(async function () {
    await testService.deleteAllComments();
    await testService.deleteAllUsers();
    await testService.deleteAllPoints();
  });

  teardown(async function () {
    await testService.deleteAllComments();
    await testService.deleteAllUsers();
    await testService.deleteAllPoints();
  });

  test("create a comment", async function () {
    const createdUser = await testService.createUser(newUser);
    const createdPoint = await testService.createPoint(newPoint);

    const newComment = {
      //date: Date.now(),
      comment: newComments[0].comment,
      point: createdPoint._id,
      user: createdUser._id
    }
    const returnedComment = await testService.createComment(newComment);
    assert(_.some([returnedComment], newComment), "returnedComment must be a superset of newComments");
    assert.isDefined(returnedComment._id);
  });

  test("get a category", async function () {
    const c1 = await testService.createCategory(newComments);
    const c2 = await testService.getCategory(c1._id);
    assert.deepEqual(c1, c2);
  });

  test("get invalid category", async function () {
    const c1 = await testService.getCategory("1234");
    assert.isNull(c1);
    const c2 = await testService.getCategory("012345678901234567890123");
    assert.isNull(c2);
  });

  test("delete a category", async function () {
    let c = await testService.createCategory(newComments);
    assert(c._id != null);
    await testService.deleteOneCategory(c._id);
    c = await testService.getCategory(c._id);
    assert(c == null);
  });

  test("get all comments", async function () {
    for (let c of newComments) {
      await testService.createComment(c);
    }

    const allComments = await testService.getComments();
    assert.equal(allComments.length, newComments.length);
  });

  test("get comments's detail", async function () {
    for (let c of newComments) {
      await testService.createComment(c);
    }

    const allComments = await testService.getComments();
    for (var i = 0; i < allComments.length; i++) {
      assert(_.some([allComments[i]], newComments[i]), "returnedComment must be a superset of newComment");
    }
  });

  test("get all comments empty", async function () {
    const allComments = await testService.getComments();
    assert.equal(allComments.length, 0);
  });

});