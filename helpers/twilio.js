//Import private phones
require('dotenv').config({path:__dirname+'/./../.env'});
const restaurantPhone = process.env.RESTAURANT_PHONE; 
const twilioPhone = process.env.TWILIO_API_PHONE; 
const clientPhone = '+15145855582'


const smsClientConfirmed = (twilioClient) => {
  const messageText = "I work for you!";
  twilioClient.messages
  .create({
    body: messageText,
    from: twilioPhone,
    to: clientPhone
  })
  .then(message => console.log(message.sid))
  .catch((err) => console.log(err));
}

const newOrderSMS = (twilioClient) => {
  const messageText = "New order!";
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

module.exports = {smsClientConfirmed, newOrderSMS};