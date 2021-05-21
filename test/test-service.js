"use strict";

const axios = require("axios");
const baseUrl = "http://localhost:3000";

class TestService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  // POINTS
  async getPois() {
    const response = await axios.get(this.baseUrl + "/api/points");
    return response.data;
  }

  async getPoint(id) {
    try {
      const response = await axios.get(this.baseUrl + "/api/points/" + id);
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async createPoint(newPoint) {
    const response = await axios.post(this.baseUrl + "/api/points", newPoint);
    return response.data;
  }

  async deleteAllPoints() {
    const response = await axios.delete(this.baseUrl + "/api/points");
    return response.data;
  }

  async deleteOnePoint(id) {
    const response = await axios.delete(this.baseUrl + "/api/points/" + id);
    return response.data;
  }


  // USERS
  async getUsers() {
    const response = await axios.get(this.baseUrl + "/api/users");
    return response.data;
  }

  async getUser(id) {
    try {
      const response = await axios.get(this.baseUrl + "/api/users/" + id);
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async createUser(newUser) {
    const response = await axios.post(this.baseUrl + "/api/users", newUser);
    return response.data;
  }

  async deleteAllUsers() {
    const response = await axios.delete(this.baseUrl + "/api/users");
    return response.data;
  }

  async deleteOneUser(id) {
    const response = await axios.delete(this.baseUrl + "/api/users/" + id);
    return response.data;
  }

  // CATEGORIES
  async getCategories() {
    const response = await axios.get(this.baseUrl + "/api/cat");
    return response.data;
  }

  async getCategory(id) {
    try {
      const response = await axios.get(this.baseUrl + "/api/cat/" + id);
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async createCategory(newCategory) {
    const response = await axios.post(this.baseUrl + "/api/cat", newCategory);
    return response.data;
  }

  async deleteAllCategories() {
    const response = await axios.delete(this.baseUrl + "/api/cat");
    return response.data;
  }

  async deleteOneCategory(id) {
    const response = await axios.delete(this.baseUrl + "/api/cat/" + id);
    return response.data;
  }

  // COMMENTS
  async getComments() {
    const response = await axios.get(this.baseUrl + "/api/comments");
    return response.data;
  }

  async getComment(id) {
    try {
      const response = await axios.get(this.baseUrl + "/api/comments/" + id);
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async createComment(newComment) {
    const response = await axios.post(this.baseUrl + "/api/comments", newComment);
    return response.data;
  }

  async deleteAllComments() {
    const response = await axios.delete(this.baseUrl + "/api/comments");
    return response.data;
  }

  async deleteOneComment(id) {
    const response = await axios.delete(this.baseUrl + "/api/comments/" + id);
    return response.data;
  }

  // RATINGS
  async getRatings() {
    const response = await axios.get(this.baseUrl + "/api/ratings");
    return response.data;
  }

  async getRating(id) {
    try {
      const response = await axios.get(this.baseUrl + "/api/ratings/" + id);
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async createRating(newComment) {
    const response = await axios.post(this.baseUrl + "/api/ratings", newComment);
    return response.data;
  }

  async deleteAllRatings() {
    const response = await axios.delete(this.baseUrl + "/api/ratings");
    return response.data;
  }

  async deleteOneRating(id) {
    const response = await axios.delete(this.baseUrl + "/api/ratings/" + id);
    return response.data;
  }
}

module.exports = TestService;