"use strict";

const assert = require("chai").assert;
const TestService = require("./test-service");
const fixtures = require("./fixtures.json");
const axios = require("axios");

suite("Points API tests", function () {

  let categories = fixtures.categories;
  let newCategory = fixtures.newCategory;
  const testService = new TestService("http://localhost:3000");
  const _ = require("lodash");

  setup(async function () {
    await testService.deleteAllCategories();
  });

  teardown(async function () {
    await testService.deleteAllCategories();
  });

  test("create a category", async function () {
    const returnedCategory = await testService.createCategory(newCategory);
    assert(_.some([returnedCategory], newCategory), "returnedCategory must be a superset of newCategory");
    assert.isDefined(returnedCategory._id);
  });

  test("get a category", async function () {
    const c1 = await testService.createCategory(newCategory);
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
    let c = await testService.createCategory(newCategory);
    assert(c._id != null);
    await testService.deleteOneCategory(c._id);
    c = await testService.getCategory(c._id);
    assert(c == null);
  });

  test("get all categories", async function () {
    for (let c of categories) {
      await testService.createCategory(c);
    }

    const allCategories = await testService.getCategories();
    assert.equal(allCategories.length, categories.length);
  });

  test("get category's detail", async function () {
    for (let c of categories) {
      await testService.createCategory(c);
    }

    const allCategories = await testService.getCategories();
    for (var i = 0; i < categories.length; i++) {
      assert(_.some([allCategories[i]], categories[i]), "returnedCategory must be a superset of newCandidate");
    }
  });

  test("get all categories empty", async function () {
    const allCategories = await testService.getCategories();
    assert.equal(allCategories.length, 0);
  });

});