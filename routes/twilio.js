
//Twilio setup
const MessagingResponse = require('twilio').twiml.MessagingResponse;

//Import function
const { clientConfirmedSMS } = require('../helpers/twilio');
const { clientReadySMS } = require('../helpers/twilio');

//Import private phones
require('dotenv').config({path:__dirname+'/./../.env'});
const restaurantPhone = process.env.RESTAURANT_PHONE;

const express = require('express');
const router  = express.Router();



module.exports = (db, twilioClient) => {

  //What happens when we receive a message
  router.post("/", (req, res) => {

    //If it's the restaurant sending this message
    if (req.body.From===restaurantPhone) {

      //Extract info from message
      const restoMessage = req.body.Body;
      const restoMessageParsed = restoMessage.slice(1).split(' - ');
      const orderID = Number(restoMessageParsed[0]);
      const orderMinutes = Number(restoMessageParsed[1]);

      //-----Handle bad input

      const twiml = new MessagingResponse();
      if (restoMessage.charAt(0) !=="#" || restoMessageParsed.length != 2 || !Number.isInteger(orderID) || orderMinutes <= 0 || orderMinutes <= 0){
        twiml.message('Invalid format - try again.');
        res.writeHead(200, {'Content-Type': 'text/xml'});
        return res.end(twiml.toString());
      }

      if(!global.allWaitingOrders[orderID]) {
        twiml.message('Invalid - this order is not waiting to be prepared. Try again.');
        res.writeHead(200, {'Content-Type': 'text/xml'});
        return res.end(twiml.toString());
      }

      if(global.allWaitingOrders[orderID].status === "preparing") {
        twiml.message('Invalid - you have already set the time for this order. Try again.');
        res.writeHead(200, {'Content-Type': 'text/xml'});
        return res.end(twiml.toString());
      }

       //-----Handle successful input

            //Update status of order in waiting orders
      global.allWaitingOrders[orderID].status = "preparing";

      //Update status of order in database
      db.query(`
      UPDATE orders
      SET order_status='preparing'
      WHERE id = ${orderID};`)
      .then(() => {

        clientConfirmedSMS(orderID, orderMinutes, twilioClient, db);

        const msOrderDue = orderMinutes * 60 * 1000;

        //---WHAT HAPPENS AFTER ORDER IS COMPLETED
        setTimeout(() => {
          db.query(`
          UPDATE orders
          SET order_status='completed'
          WHERE id = ${orderID};`)
          .then(() => {
            clientReadySMS(orderID, twilioClient);
            delete global.allWaitingOrders[orderID];
          });
        }, msOrderDue);
        //---

      })
      .then(() => {
        twiml.message('The time to prepare this order is set - thank you!');
        res.writeHead(200, {'Content-Type': 'text/xml'});
        return res.end(twiml.toString());
      })

    }

  });

  return router;
};
