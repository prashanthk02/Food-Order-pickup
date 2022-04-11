const express = require('express');
const {itemByCategory} =require('./db-queries/database.js');
const router  = express.Router();

module.exports = (db) => {

  //BRAINSTORMING ROUTES, NOT FINAL
  //These can be called from HTML forms in EJS, or by $.get etc. in jQuery

  router.post("/add/:item/:quant", (req, res) => {
    //Just modify the global object
  });

  router.post("/change/:item/:newQuant", (req, res) => {
    //Just modify the global object
  });

  router.post("/remove/:item/", (req, res) => {
    //Just modify the global object
  });

  router.get("/totalPrice", (req, res) => {
    //res.JSON for total price
  });

  router.post("/submitOrder", (req, res) => {
    //Should this be a route? Should this be a function? Unsure. 
    //A lot of things need to happen when the order is submitted.
  });


  return router;
};
