
const express = require('express');
const {ordersByCustomer} = require('./db-queries/database.js');
const router  = express.Router();


module.exports = (db) => {

  router.get("/menu", (req, res) => {
    let loggedValue = 1;
    if (!req.session.user_id) {
      loggedValue = 0;
    }
    console.log(`REQ SESSION IS: ${req.session}`);
    console.log(`REQ SESSION ID IS: ${req.session.user_id}`);
    console.log(`LOGGED VALUE GOING IN IS: ${loggedValue}`);
    res.render("menu", {logged: loggedValue});
  });



  router.get("/cart", (req, res) => {
    if (!req.session.user_id) {
      return res.redirect("/nav/menu");
    }
    return res.render("cart", {logged: 1});
  });



  router.get("/orders", (req, res) => {

    if (!req.session.user_id) {
      return res.redirect("/nav/menu");
    }

    const userID = req.session.user_id;
    const category = req.params.category;
    const queryString = ordersByCustomer();
    const queryValues = [userID];

    //Query database for orders
    db.query(queryString, queryValues)
      .then(data => {
        const orders_JSON= data.rows;
        const final_JSON = {};

        for (let order of orders_JSON) {
          if (final_JSON[order.order_id]) {
            final_JSON[order.order_id].totalPrice += order.price * order.quantity;
            final_JSON[order.order_id].dishes.push({name: order.name, quantity: order.quantity});
          } else {
            final_JSON[order.order_id] = {
              dishes: [{name: order.name, quantity: order.quantity}],
              totalPrice: order.price * order.quantity,
              status:  order.order_status,
              time: order.order_time
            }
          }
        }
        const templateVars = {orderInfo: final_JSON, logged: 1}
        res.render("orders", templateVars);
        ;})

  });

  return router;
};
