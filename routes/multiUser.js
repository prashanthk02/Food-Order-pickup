
const express = require('express');
const {ordersByCustomer} =require('./db-queries/database.js');
const router  = express.Router();


module.exports = (db) => {

  //-----------GET

  router.get("/register", (req, res) => {
   res.render("user-register");
  });

  router.get("/login", (req, res) => {
    res.render("user-login");
  });

  router.get("/error", (req, res) => {
    res.render("user-error");
  });

  //---------POST

  router.post("/register", (req, res) => {

    const {user_name, user_phone, user_password} = req.body;

    if (!user_name || !user_phone || !user_password) {
      console.log("BADDDDDDDDDDDDDDDDDDDDDDDDDDDD!")
      return res.render("user-error",  {error: "Error. Missing information. Try again."})
    }

    db.query(`SELECT * FROM users WHERE name=$1;`, [user_name])
    .then((data) => {
      console.log(data.rows);
      console.log(data.rows.length, (data.rows.length > 0));
      if (data.rows.length > 0) {
        return res.render("user-error",  {error: "User with that name already exists. Try again."})
      }
    })
    .then(() => console.log("DATABASE CHECK YES"))
    .catch((error) => console.log(error));
    //Look up name in the database

    //eturn res.redirect("/nav/menu")
   });
 
   router.post("/login", (req, res) => {
     
    res.redirect("/nav/menu")
   });
 
   router.post("/logout", (req, res) => {

   });


  return router;
};
