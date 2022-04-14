//Helper imports
const {makeCart} = require("./helpers/cart-objects");


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

//Twilio setup
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = require('twilio')(accountSid, authToken);

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

//COOKIES HERE
const cookieSession = require('cookie-session');
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));


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
makeCart(global.currUserID) //<-------See ./helpers/cart-objects.js. This creates a new cart in the global.allCarts object if there wasn't one already

global.allWaitingOrders = {}


//--------------------------------------------

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own

//Our actual routes
const navbarRoutes = require("./routes/nav");
const menuRoutes = require("./routes/menu");
const cartRoutes = require("./routes/cart");
const twilioRoutes = require("./routes/twilio");
const multiUserRoutes = require("./routes/multiUser");
const ordersRoutes = require("./routes/orders");


//-------OUR ACTUAL ROUTES

app.use("/nav", navbarRoutes(db)); //---> Separate files for all routes that are for displaying the navbar links: menu, cart, order
app.use("/api/menu", menuRoutes(db)); //---> API routes return JSONS with data from the database

app.use("/cart", cartRoutes(db, twilioClient)); //---> For manipulating the cart objects in memory
app.use("/twilio", twilioRoutes(db, twilioClient)); //---> for Twilio
app.use("/multiUser", multiUserRoutes(db)); //---> for Twilio
app.use("/api/orders", ordersRoutes(db, twilioClient)); //---> to display the past orders


/*

LIST OF ROUTES

/navbar - for displaying menu, orders, art

/api/menu -for displaying theitems of the menu page

//CART ROUTES -- redirection of /cart is in a file cart.js
//These manipulate theobject --- global.allCarts[global.currUserID]
POST -- /cart/user/:userID/add
POST -- /cart/user/:userID/change
DELETE -- /cart/user/:userID/remove
POST -- /cart/user/:userID/submit
GET -- /cart/user/:userID/viewCart

//TWILIO
POST /twilio/sms -->
*/


app.get("/", (req, res) => {
  res.redirect("nav/menu");
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});


//----------------TEST SPACE

// const {smsClientConfirmed} = require('./helpers/twilio')
// smsClientConfirmed(twilioClient);
