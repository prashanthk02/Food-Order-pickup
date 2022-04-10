//how to install all missing dependencies?

//npm install twilio --no-bin-links

// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure


const accountSid = "ACeadf543eb1764173a0fa8466747f885e"; //process.env.TWILIO_ACCOUNT_SID;
const authToken = "fbff4d0231a03b21a4575424599019d0"; //process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

client.messages
  .create({
     body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
     from: '+18077709123', //process.env.MY_PHONE_NUMBER
     to: '+15145855582'
   })
  .then(message => console.log(message.sid))
  .catch((err) => console.log(err));