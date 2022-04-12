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
