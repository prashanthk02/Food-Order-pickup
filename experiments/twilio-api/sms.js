//how to install all missing dependencies?

//npm install twilio --no-bin-links
//npm install ngrok -g

//ngrok authtoken 27ajZJD2vezF7f7SB5pujHVnBSl_2QLuc4ysDUPDGQvvxyZ92

// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure

// #---------TWILIO

// # Twilio credentials
// TWILIO_ACCOUNT_SID: "ACeadf543eb1764173a0fa8466747f885e"
// TWILIO_AUTH_TOKEN: "fbff4d0231a03b21a4575424599019d0"

// #Twilio key instead of auth tokens, not sure if will use this...
// TWILIO_SID=SK7ce5ce1b11c54bd90f7c36856ae44cb3
// TWILIO_SECRET=cLB85XqC3fJNYfEnP0tyfMJN9AMqO7I8

require("dotenv").config(); ///! Unsure how to get it out of there, pasted neutrally

// console.log(process.env.TWILIO_ACCOUNT_SID);

const accountSid = "ACeadf543eb1764173a0fa8466747f885e";
const authToken = "fbff4d0231a03b21a4575424599019d0";
const client = require('twilio')(accountSid, authToken);



const sendMessageToClient = () => {
  client.messages
    .create({
      body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
      from: '+18077709123', //process.env.MY_PHONE_NUMBER
      to: '+15145855582'
    })
    .then(message => console.log(message.sid))
    .catch((err) => console.log(err));
}


  //----Receiving requires a server, setting up a test server for now

  const http = require('http');
  const express = require('express');
  const MessagingResponse = require('twilio').twiml.MessagingResponse;
  
  const app = express();
  app.use(express.urlencoded({ extended: true }));

  app.get("/", (req, res) => {
    res.send("The index works!");
  });
  
  app.post('/sms', (req, res) => {

    //console.log(req.body.Body);
    const numMinutes = Number(req.body.Body);
    console.log(numMinutes, typeof(numMinutes));


    const twiml = new MessagingResponse();
    twiml.message('The Robots are coming! Head for the hills!');
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());
    console.log("It happened!");

  });


  
  http.createServer(app).listen(8080, () => {
    console.log('Express server listening on port 8080');
  });
