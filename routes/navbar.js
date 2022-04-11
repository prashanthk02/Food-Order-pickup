/*
 * All routes for Widgets are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();


module.exports = (db) => {

  router.get("/menu", (req, res) => {
   res.render("menu");
  });

  router.get("/cart", (req, res) => {
   res.render("cart");
  });

  router.get("/orders", (req, res) => {
   res.render("orders");
  });


  return router;
};
