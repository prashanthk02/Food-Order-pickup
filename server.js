//Helper imports
const makeCart = require("./helpers/cart-objects");


// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const sassMiddleware = require("./lib/sass-middleware");
const express = require("express");
const app = express();
const morgan = require("morgan");

// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use(
  "/styles",
  sassMiddleware({
    source: __dirname + "/styles",
    destination: __dirname + "/public/styles",
    isSass: false, // false => scss, true => sass
  })
);

app.use(express.static("public"));


//------------GLOBAL VARIABLES (can be accessed from different files e.g. global.currUserID)

global.currUserID = 1; //<------------This is manually set to 1 (Alice in the database) for now
global.allCarts = {} //Keys are userIDs (e.g. 1), values are userCart objects
makeCart(global.currUserID) //<-------See ./helpers/cart-objects.js. This creates a new cart in the global.allCarts object if there wasn't one already for the current user

//A TEST FOR HOW THE CART WORKS (remove later)

console.log("----Initial cart----")
global.allCarts[global.currUserID].print();

console.log("----Try adding something----")
global.allCarts[global.currUserID].addDish("Tuna sandich", 10.00, 2);
global.allCarts[global.currUserID].addDish("Blueberry muffin", 3.00, 1);
global.allCarts[global.currUserID].print();


//--------------------------------------------

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const usersRoutes = require("./routes/users---givenexample");
const widgetsRoutes = require("./routes/widgets---givenexample");

//Our actual routes
const navbarRoutes = require("./routes/navbar");
const menuRoutes = require("./routes/menu");
const cartRoutes = require("./routes/cart");


//-----THESE WERE EXAMPLES, DELETE LATER

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/api/users", usersRoutes(db));
app.use("/api/widgets", widgetsRoutes(db));
// Note: mount other resources here, using the same pattern above


//-------OUR ACTUAL ROUTES

app.use("/navbar", navbarRoutes(db)); //---> Separate files for all routes that are for displaying the navbar links: menu, cart, order
app.use("/api/menu", menuRoutes(db)); //---> API routes return JSONS with data from the database
app.use("/cart", cartRoutes(db)); //---> For manipulating the cart objects in memory


//HOMEPAGE AS A TEST
// app.get("/", (req, res) => {
//   res.send("<h1>The index shows cart contents to test them for now.</h1>\n"
//   + global.allCarts[currUserID].print()
//   + `<br><br><a href="/navbar/menu">Menu</a> <br>
//   <a href="/navbar/orders">Orders</a> <br>
//   <a href="/navbar/cart">Cart</a> <br>`);
// })


//--------------------------------------------


// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

app.get("/", (req, res) => {
  res.redirect("navbar/menu");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

