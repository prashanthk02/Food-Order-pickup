//THIS FILE IS JUST FOR COMPOSITING THE STRINGS FOR QUERYING THE DATABASE, THE ACTUAL CALL TO THE DATABASE HAPPENS IN THE /ROUTES DIRECTORY
//WE MIGHT BREAK UP THIS FILE INTO LATER SO RELATED QUERIES ARE GROUPED??

const { ModelBuildPage } = require("twilio/lib/rest/autopilot/v1/assistant/modelBuild");


//Get item by category
const itemByCategory = ((category) => {
  let queryString = `
SELECT name, description, price, image
FROM dishes
WHERE category = $1;`

return queryString;

})

//Insert into orders
const orderPlaced = ((order) => {
  const queryParams = [
    order.order_time,
    order.order_status,
    order.user_id
  ];

  let queryString = `
  INSERT INTO orders (order_time, order_status, user_id)
  VALUES ($1, $2, $3);`
})

//Insert into order details
const orderDetails = ((order) => {
  const queryParams = [
    order.order_id,
    order.dish_id,
    order.user_id,
    order.quantity
  ];

  let queryString = `
  INSERT INTO orders (order_id, dish_id, user_id, quantity)
  VALUES ($1, $2, $3, $4);`
})

//Chnage of order status
const orderStatus = ((order) => {
  const queryParams = [
    order.order_status
  ]

  let queryString = `
  UPDATE orders UPDATE order_status $1
  WHERE order ;
  `
})

//Previous orders with total price
const customerOrders = (() => {
  let queryString = `
  SELECT order_id, order_time, order_status, SUM(order_details.quantity * dishes.price) as Amount
  FROM orders
  JOIN order_details ON orders.id = order_id
  JOIN dishes ON dishes.id = dish_id
  WHERE orders.id = $1
  GROUP BY order_id;
  `
})

//Add user to users
const newUser = ((name, phone) => {
  let queryString = `
  INSERT INTO users (name, phone_number) VALUES ($1, $2);`
})


//-------EXPORT--------

module.exports = {itemByCategory};