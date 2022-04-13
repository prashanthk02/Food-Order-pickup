//Import private phones
require('dotenv').config({path:__dirname+'/./../.env'});
const restaurantPhone = process.env.RESTAURANT_PHONE;
const twilioPhone = process.env.TWILIO_API_PHONE;

//--Send order confirmation and waiting time to client
const clientConfirmedSMS = (orderID, orderMinutes, twilioClient, db) => {

  const clientPhone = global.allWaitingOrders[orderID].clientPhone;

  let messageText = global.allWaitingOrders[orderID].confirmedMessageStart();
  messageText += `\n\n... will be ready in ${orderMinutes} ${(orderMinutes === 1 ? "minute" : "minutes")}!`

  twilioClient.messages
  .create({
    body: messageText,
    from: twilioPhone,
    to: clientPhone
  });
}


//--Send message about new order to restaurant
const newOrderSMS = (twilioClient, newWaitingOrder) => {
  const messageText = newWaitingOrder.newOrderMessage();
  twilioClient.messages
  .create({
    body: messageText,
    from: twilioPhone,
    to: restaurantPhone
  });

}

//Send message to client when order is ready
const clientReadySMS = (orderID, twilioClient) => {
  const clientName = global.allWaitingOrders[orderID].clientName;
  const clientPhone = global.allWaitingOrders[orderID].clientPhone;
  const messageText = `${clientName}, your order is ready!\nThank you for dining with Lighthouse Grill!`

  twilioClient.messages
  .create({
    body: messageText,
    from: twilioPhone,
    to: clientPhone
  });
}

module.exports = {clientConfirmedSMS, newOrderSMS, clientReadySMS};
