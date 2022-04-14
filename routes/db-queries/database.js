//THIS FILE IS JUST FOR COMPOSITING THE STRINGS FOR QUERYING THE DATABASE, THE ACTUAL CALL TO THE DATABASE HAPPENS IN THE /ROUTES DIRECTORY
//WE MIGHT BREAK UP THIS FILE INTO LATER SO RELATED QUERIES ARE GROUPED??

const { ModelBuildPage } = require("twilio/lib/rest/autopilot/v1/assistant/modelBuild");


//Get item by category
const itemByCategory = ((category, req) => {
  let queryString = `
SELECT id, name, description, price, image
FROM dishes
WHERE category = $1;`

console.log("THE ID FROM HELPER IS: " + req.session.user_id);

return queryString;

})

// Get dish details for cart

const getDishDetails = (listOfIDs) => {
  let queryString = `
  SELECT * FROM dishes WHERE `;
  for (let id of listOfIDs) {
    queryString += `id = ${id} OR `
  }
  queryString = queryString.slice(0, -4);
  queryString += ";"
  return queryString;
}

//Insert into orders
const orderPlaced = ((order) => {
  const queryParams = [
    order.now(),
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
const ordersByCustomer = (() => {
  let queryString =`
  SELECT order_id, order_status, order_time, dishes.name, order_details.quantity, dishes.price
  FROM orders
  JOIN order_details ON orders.id = order_details.order_id
  JOIN dishes ON dishes.id = dish_id
  WHERE orders.user_id = $1
  ORDER BY order_time DESC;`
  return queryString;
})

//Add user to users
const newUser = ((name, phone) => {
  let queryString = `
  INSERT INTO users (name, phone_number) VALUES ($1, $2);`
})


//-------EXPORT--------

module.exports = {itemByCategory, ordersByCustomer, getDishDetails};
