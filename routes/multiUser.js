
const express = require('express');
const {ordersByCustomer} =require('./db-queries/database.js');
const router  = express.Router();


module.exports = (db) => {

  //-----------GET

  router.get("/register", (req, res) => {
    if(req.session.user_id){
      return res.redirect("/nav/menu");
    }
    return res.render("user-register", {logged: 0});
  });

  router.get("/login", (req, res) => {
    if(req.session.user_id){
      return res.redirect("/nav/menu");
    }
    return res.render("user-login", {logged: 0});
  });

  router.get("/error", (req, res) => {
    if(req.session.user_id){
      return res.redirect("/nav/menu");
    }
    return res.render("user-error", {logged: 0});
  });

  //---------POST

  //Process a registration
  router.post("/register", (req, res) => {

    const {user_name, user_phone, user_password} = req.body;

    if (!user_name || !user_phone || !user_password) {
      return res.render("user-error",  {error: "Error. Missing information. Try again.", logged: 0})
    }

    db.query(`SELECT * FROM users WHERE name=$1;`, [user_name])
    .then((data) => {
      if (data.rows.length > 0) {
        return res.render("user-error",  {error: "Error. User with that name already exists. Try again.", logged: 0})
      }
    })
    .then(() => {
      db.query(`
      INSERT INTO users (name, phone_number, password)
      VALUES ($1, $2, $3)
      RETURNING id`, [user_name, user_phone, user_password])
      .then((data) => {
        const id = data.rows[0].id;
        req.session.user_id = id;
        return res.redirect("/nav/menu");
      });

    })

   });
 

   
   //Process a login
   router.post("/login", (req, res) => {

    const {user_name, user_password} = req.body;
    if (!user_name || !user_password) {
      return res.render("user-error",  {error: "Error. Missing information. Try again.", logged: 0})
    }

    db.query(`SELECT * FROM users WHERE name=$1`, [user_name])
    .then((data) => {
      if (data.rows.length === 0) {
        return res.render("user-error",  {error: "Error. A user with that name does not exist. Try again.", logged: 0})
      } 

      const truePassword = data.rows[0].password;
      if (user_password!==truePassword) {
        return res.render("user-error",  {error: "Error. Incorrect password. Try again.", logged: 0})
      }

      req.session.user_id = data.rows[0].id;
      return res.redirect("/nav/menu");
      
    })

    //If wrong info -> no
    //If user DNE -> no
    //If password wrong ->
    //Otherwise, set cookie session
     
    //res.redirect("/nav/menu")
   });
 
   //Logout - end cookie session
   router.post("/logout", (req, res) => {
    console.log(`I AM INSIDE LOGOUT ROUTE!!!!!`);
    req.session = null;
    console.log(`REQ SESSION GET LOGOUT: ${req.session}`);

    res.redirect("/nav/menu");
   });


  return router;
};
