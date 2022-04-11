const express = require('express');
const {ordersByCustomer} =require('./db-queries/database.js');
const router  = express.Router();


module.exports = (db) => {

  //Return JSON of the order history of the user
  router.get("/:userID/orders", (req, res) => {
    const userID = req.params.userID;
    const category = req.params.category;
    const queryString = ordersByCustomer();
    const queryValues = [userID];

    //Query 1
    db.query(queryString, queryValues)
      .then(data => {
        const orders_JSON= data.rows;
        const final_JSON = {};

        for (let order of orders_JSON) {
          if (final_JSON[order.order_id]) {
            final_JSON[order.order_id].totalPrice += order.price * order.quantity;
            final_JSON[order.order_id].dishes.push(order.name);
          } else {
            final_JSON[order.order_id] = {
              dishes: [order.name],
              totalPrice: order.price * order.quantity,
              status:  order.order_status,
              time: order.order_time
            }
          }
        }
        res.json(final_JSON)
        ;})

      });

  return router;
};
