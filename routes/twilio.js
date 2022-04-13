
const express = require('express');
const {itemByCategory} =require('./db-queries/database.js');
const router  = express.Router();

module.exports = (db) => {

  //What happens when we receive a message
  router.post("/", (req, res) => {
    //What happens when we receive a message
    console.log("message received");

  });

  return router;
};
