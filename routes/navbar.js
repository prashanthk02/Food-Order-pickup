
const express = require('express');
const router  = express.Router();


module.exports = (db) => {

  router.get("/menu", (req, res) => {
   res.render("menuTest");
  });

  router.get("/cart", (req, res) => {
   res.render("cartTest");
  });

  router.get("/orders", (req, res) => {
   res.render("orders");
  });


  return router;
};
