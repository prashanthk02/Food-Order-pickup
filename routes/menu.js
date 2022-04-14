
const express = require('express');
const {itemByCategory} =require('./db-queries/database.js');
const router  = express.Router();

module.exports = (db) => {

  //------Return a JSON of menu items from the category
  router.get("/:category", (req, res) => {
    const category = req.params.category;
    const queryString = itemByCategory(category, req);
    const queryValues = [category];
    db.query(queryString, queryValues)
      .then(data => {
        res.json(data.rows);
      })
      //Failure check
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  return router;
};
