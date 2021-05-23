"use strict";

const assert = require("chai").assert;
const TestService = require("./test-service");
const fixtures = require("./fixtures.json");
const axios = require("axios");

suite("Points API tests", function () {

  let users = fixtures.users;
  let newUser = fixtures.newUser;
  const testService = new TestService("http://localhost:3000");
  const _ = require("lodash");

  setup(async function () {
    const returnedUser = await testService.createUser(newUser);
    const response = await testService.authenticate(newUser);
  });

  teardown(async function () {
    await testService.deleteAllUsers();
    testService.clearAuth();
  });

  test("create a user", async function () {
    const returnedUser = await testService.createUser(newUser);
    assert(_.some([returnedUser], newUser), "returnedUser must be a superset of newUser");
    assert.isDefined(returnedUser._id);
  });

  test("get a user", async function () {
    const u1 = await testService.createUser(newUser);
    const u2 = await testService.getUser(u1._id);
    assert.deepEqual(u1, u2);
  });

  test("get invalid user", async function () {
    const u1 = await testService.getUser("1234");
    assert.isNull(u1);
    const u2 = await testService.getUser("012345678901234567890123");
    assert.isNull(u2);
  });

  test("delete a user", async function () {
    let u = await testService.createUser(newUser);
    assert(u._id != null);
    await testService.deleteOneUser(u._id);
    u = await testService.getUser(u._id);
    assert(u == null);
  });

  test("get all users", async function () {
    for (let u of users) {
      await testService.createUser(u);
    }

    const allUsers = await testService.getUsers();
    assert.equal(allUsers.length, users.length + 1);
  });

  test("get users details", async function () {
    let arrUsers = [newUser];

    for (let u of users) {
      const createdUser = await testService.createUser(u);
      arrUsers.push(createdUser);
    }

    const allUsers = await testService.getUsers();
    for (var i = 0; i < arrUsers.length; i++) {
      assert(_.some([allUsers[i]], arrUsers[i]), "returnedCandidate must be a superset of newCandidate");
    }
  });

  test("get all users only contains the authenticated user", async function () {
    const allUsers = await testService.getUsers();
    assert.equal(allUsers.length, 1);
  });

});