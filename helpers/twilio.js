require('dotenv').config({path:__dirname+'/./../.env'});

const twilioPhone = process.env.TWILIO_API_PHONE; //"f7182d8de74854ec880f4d92013df045";
const clientPhone = '+15145855582'

const accountSid = process.env.TWILIO_ACCOUNT_SID; 
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);


const smsClientConfirmed = () => {
  const messageText = "I work for you!";
  client.messages
  .create({
    body: messageText,
    from: twilioPhone,
    to: clientPhone
  })
  .then(message => console.log(message.sid))
  .catch((err) => console.log(err));
}


console.log(accountSid + "\n" + authToken)
smsClientConfirmed();