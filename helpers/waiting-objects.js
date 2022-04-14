const {newOrderSMS} = require('./twilio.js');


class waitingOrder {

  constructor(){
    //Nothing
  }

  //SMS for client
  confirmedMessageStart(){
    let messageText = `Hey ${this.clientName}! Your order...\n`
    for (let dish of Object.keys(this.items)){
      messageText += `\n${this.items[dish].name} x ${this.items[dish].quant}`;
    }
    return messageText;
  }

  //SMS text for the restaurant
  newOrderMessage(){
    let messageText = `${this.clientName} has placed order #${this.id}:\n`
    for (let dish of Object.keys(this.items)){
      messageText += `\n${this.items[dish].name} x ${this.items[dish].quant}`;
    }
    messageText += `
    \nSpecify how long it will take to prepare this order.
    \nReply to this message in this exact format:\n#${this.id} - [minutes]
    `
    return messageText;
  }

  //JUST FOR TESTING
  print () {
    console.log("\nClient name: " + this.clientName);
    console.log("\nClient phone: " + this.clientPhone);
    console.log("Total cost: " + this.totalPrice);
    for (let itemID of Object.keys(this.items)){
      console.log(`\nDish name: ${this.items[itemID].name}, quantity: ${this.items[itemID].quant}`);
    }
  }
}


const twilio = require('twilio');
const {getDishDetails} = require('./../routes/db-queries/database.js');


//Creates a waitingOrder with relevant information and puts it in the list of all waiting orders, indexed by the orderID in the database
//When this is done, it calls a function to notify restaurant about the new order
const addWaitingOrderAndNotifyRestaurant = (db, orderID, userID, userCart, twilioClient) => {

  console.log("GETS INSIDE\n");

  //Create new waitingOrder
  const newWaitingOrder = new waitingOrder();
  newWaitingOrder.items = {}
  newWaitingOrder.status = "unconfirmed";

  //Find details about the client who made the order
  db.query(`SELECT * FROM users WHERE id = ${userID};`)
  .then(data => {
    newWaitingOrder.id = orderID;
    newWaitingOrder.clientName = data.rows[0].name;
    newWaitingOrder.clientPhone = data.rows[0].phone_number;
  })
  .then(() => {

    //Find details about the dishes in the order
    const listDishIDs =[];
    for (let id of Object.keys(global.allCarts[userID].items)){
      listDishIDs.push(id);
    }
    queryString = getDishDetails(listDishIDs);
    db.query(queryString).then(data => {
      const dishData = data.rows;
      newWaitingOrder.totalPrice = 0;
      for (let dish of dishData) {
        newWaitingOrder.items[dish.id] = {};
        newWaitingOrder.items[dish.id].name = dish.name;
        newWaitingOrder.items[dish.id].quant = userCart.items[dish.id].quant;
        newWaitingOrder.totalPrice += userCart.items[dish.id].quant * dish.price;
      }

      //Add the waitingOrder to the global list of waiting orders
      global.allWaitingOrders[orderID] = newWaitingOrder;

      //Empty the user cart
      global.allCarts[userID].items = {};

      //Call function to notify restaurant
      newOrderSMS(twilioClient, newWaitingOrder);
    })
  })
}



module.exports = {addWaitingOrderAndNotifyRestaurant}
