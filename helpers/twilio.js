//Import private phones
require('dotenv').config({path:__dirname+'/./../.env'});
const restaurantPhone = process.env.RESTAURANT_PHONE; 
const twilioPhone = process.env.TWILIO_API_PHONE; 

const clientConfirmedSMS = (orderID, orderMinutes, twilioClient) => {
  const clientPhone = global.allWaitingOrders[orderID].clientPhone;

  let messageText = global.allWaitingOrders[orderID].confirmedMessageStart();
  messageText += `\n\n...will be ready in ${orderMinutes} minutes!`

  twilioClient.messages
  .create({
    body: messageText,
    from: twilioPhone,
    to: clientPhone
  })
  .then(message => {
    
  
  })
  .catch((err) => console.log(err));
}

const newOrderSMS = (twilioClient, newWaitingOrder) => {
  const messageText = newWaitingOrder.newOrderMessage();
  console.log(messageText);

  twilioClient.messages
  .create({
    body: messageText,
    from: twilioPhone,
    to: restaurantPhone
  })
  .then(message => console.log(message.sid))
  .catch((err) => console.log(err));
  
}


// console.log(accountSid + "\n" + authToken)
// smsClientConfirmed();


module.exports = {clientConfirmedSMS, newOrderSMS};