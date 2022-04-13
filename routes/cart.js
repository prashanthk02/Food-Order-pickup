//Import helper functions
const {addWaitingOrderAndNotifyRestaurant} = require('./../helpers/waiting-objects.js');


//Set up the router
const express = require('express');
const {getDishDetails} =require('./db-queries/database.js');
const router  = express.Router();

module.exports = (db, twilioClient) => {

  router.post("/add/:item/", (req, res) => {
    const itemID = req.params.item;
    const quant = Number(req.body.quant);
    global.allCarts[global.currUserID].addDish(itemID, quant);
    res.redirect('/nav/menu');
  });

  router.get("/contents", (req, res) => {
    const listOfIDs =[];
    for (let id of Object.keys(global.allCarts[global.currUserID].items)){
      listOfIDs.push(id);
    }

    if(listOfIDs.length===0) {
      return res.json(null);
    }

    queryString = getDishDetails(listOfIDs);
    db.query(queryString)
      .then(data => {
        const rawJSON = data.rows;
        for (let elem of rawJSON){
          elem.quant = global.allCarts[global.currUserID].items[elem.id].quant;
        }
        res.json(rawJSON);
      })
  })

  router.post("/change/:item", (req, res) => {
    const newQuant = req.body.newQuant
    const dishID = req.params.item
    global.allCarts[global.currUserID].changeDishQuant(dishID, newQuant);
    res.redirect('/nav/cart');
  });

  router.post("/remove/:item", (req, res) => {
    const item = req.params.item;
    global.allCarts[global.currUserID].removeDish(item);
    res.redirect('/nav/cart');
  });

  //Helper function to insert order details when an order is placed
  const orderDetailInsert = function (order_id, dish_id, user_id, quantity) {
    db.query(
    `INSERT INTO order_details (order_id, dish_id, user_id, quantity)
    VALUES (${order_id}, ${dish_id}, ${user_id}, ${quantity})`
    );
  }

  //Clicking submit order should submit the order in cart to the database and trigger next steps
  router.post("/submitOrder", (req, res) => {
    db.query(`
    INSERT INTO orders (order_time, order_status, user_id)
    VALUES (now(),'unconfirmed', ${global.currUserID})
    RETURNING id`)
    .then(data => {
      const orderID = data.rows[0].id;

      //Log order details into the database
      for(let dishID of Object.keys(global.allCarts[global.currUserID].items)) {
        const quant = global.allCarts[global.currUserID].items[dishID].quant;
        orderDetailInsert(orderID, dishID, global.currUserID, quant);
      }

      //Send to helper function for next steps
      addWaitingOrderAndNotifyRestaurant(db, orderID, global.currUserID, global.allCarts[global.currUserID], twilioClient);

      res.redirect("/nav/cart");
    })

  });


  return router;
};

