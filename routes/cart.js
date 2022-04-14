//Import helper functions
const {addWaitingOrderAndNotifyRestaurant} = require('./../helpers/waiting-objects.js');


//Set up the router
const express = require('express');
const {getDishDetails} =require('./db-queries/database.js');
const router  = express.Router();

module.exports = (db, twilioClient) => {

  router.post("/add/:item/:quant", (req, res) => {

    if(!req.session.user_id){
      return res.redirect("multiUser/login");
    }

    const itemID = req.params.item;
    const quant = Number(req.params.quant);
    //const quant = Number(req.body.quant);
    global.allCarts[req.session.user_id].addDish(itemID, quant);
    res.redirect('/nav/menu');
  });

  router.get("/contents", (req, res) => {
    const listOfIDs =[];
    for (let id of Object.keys(global.allCarts[req.session.user_id].items)){
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
          elem.quant = global.allCarts[req.session.user_id].items[elem.id].quant;
        }
        res.json(rawJSON);
      })
  })

  router.post("/change/:item", (req, res) => {
    const newQuant = req.body.newQuant
    const dishID = req.params.item
    global.allCarts[req.session.user_id].changeDishQuant(dishID, newQuant);
    res.redirect('/nav/cart');
  });

  router.post("/remove/:item", (req, res) => {
    const item = req.params.item;
    global.allCarts[req.session.user_id].removeDish(item);
    res.redirect('/nav/cart');
  });

  //Helper function to insert order details when an order is placed
  const orderDetailInsert = function (order_id, dish_id, user_id, quantity) {
    db.query(
    `INSERT INTO order_details (order_id, dish_id, user_id, quantity)
    VALUES (${order_id}, ${dish_id}, ${user_id}, ${quantity})`
    )
    .then(() => console.log("DETAILS SUBMITTED"))
    .catch((error) => console.log(error));
  }

  //Clicking submit order should submit the order in cart to the database and trigger next steps
  router.post("/submitOrder", (req, res) => {
    db.query(`
    INSERT INTO orders (order_time, order_status, user_id)
    VALUES (now(),'unconfirmed', ${req.session.user_id})
    RETURNING id`)
    .then(data => {
      const orderID = data.rows[0].id;

      //Log order details into the database
      for(let dishID of Object.keys(global.allCarts[req.session.user_id].items)) {
        const quant = global.allCarts[req.session.user_id].items[dishID].quant;
        orderDetailInsert(orderID, dishID, req.session.user_id, quant);
      }

      //Send to helper function for next steps
      console.log(`\n\nUSER ID: ${req.session.user_id}\n\n`);

      addWaitingOrderAndNotifyRestaurant(db, orderID, req.session.user_id, global.allCarts[req.session.user_id], twilioClient);

      res.redirect("/nav/cart");
    })
    .catch(error => console.log(error));

  });


  return router;
};

