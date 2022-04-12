const express = require('express');
const {getDishDetails} =require('./db-queries/database.js');
const router  = express.Router();

module.exports = (db) => {

  //BRAINSTORMING ROUTES, NOT FINAL
  //These can be called from HTML forms in EJS, or by $.get etc. in jQuery

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
        console.log(rawJSON);
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
    console.log(item);
    global.allCarts[global.currUserID].removeDish(item);
    // res.end();
    res.redirect('/nav/cart');
  });

  const orderDetailInsert = function (order_id, dish_id, user_id, quantity) {
    db.query(
    `INSERT INTO order_details (order_id, dish_id, user_id, quantity)
    VALUES (${order_id}, ${dish_id}, ${user_id}, ${quantity})`
    )
    .then(() => {
      console.log("Success!");
    })
  }

  router.post("/submitOrder", (req, res) => {
    db.query(`
    INSERT INTO orders (order_time, order_status, user_id)
    VALUES (now(),'Awaiting Confirmation', ${global.currUserID})
    RETURNING id`)
    .then(data => {
      const orderID = data.rows[0].id;
      for(let dishID of Object.keys(global.allCarts[global.currUserID].items)) {
        const quant = global.allCarts[global.currUserID].items[dishID].quant;
        orderDetailInsert(orderID, dishID, global.currUserID, quant);
      }
      res.redirect("/nav/menu");
    })
    .catch(error => console.log(error.message));
  });


  return router;
};

