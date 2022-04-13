
const express = require('express');
const {ordersByCustomer} =require('./db-queries/database.js');
const router  = express.Router();


module.exports = (db) => {

  router.get("/menu", (req, res) => {
   res.render("menu");
  });

  router.get("/cart", (req, res) => {
   res.render("cart");
  });

  router.get("/orders", (req, res) => {

    const userID = global.currUserID;
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
        const templateVars = {orderInfo: final_JSON}
        res.render("orders", templateVars);
        ;})

  });



  //  res.render("orders");
  // });


  return router;
};
