
//These variables should be in .env

const adminPhone = "+15145855582";

const client = require('twilio')(accountSid, authToken);



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

    if (req.body.From===adminPhone) {

      const numMinutes = Number(req.body.Body);
      const twiml = new MessagingResponse();

      console.log("Num minutes: " + numMinutes);

      //Block for some valid input
      if (numMinutes && numMinutes >= 0) {
        //

        //

        
        twiml.message('Thank you!');
        res.writeHead(200, {'Content-Type': 'text/xml'});
        res.end(twiml.toString());
      } else {
        twiml.message('Invalid response - try again!');
        res.writeHead(200, {'Content-Type': 'text/xml'});
        res.end(twiml.toString());
      }

    }

  });


  
  http.createServer(app).listen(8080, () => {
    console.log('Express server listening on port 8080');
  });

