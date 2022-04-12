
// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure

const client = require('twilio')(accountSid, authToken);

const adminPhone = "+15145855582";
const twilioPhone = '+18077709123';

// client.messages
// .create({body: 'Hi there', from: '+18077709123', to: '+15145855582'})
// .then(message => console.log(message.sid))
// .catch((err) => console.log(err));

//Takes an order ID (int? string?) and a list of menu items. Each menu item is an object. The key is the name of the item, and the value is the quantity






const sendOrderToAdminSMS = (orderID, orderItems) => {

  let messageText = `Order ID#${orderID} was just placed.\n`;

  //Add order items to the message
  for (let item of Object.keys(orderItems)) {
    messageText += `\n ${item}: ${orderItems[item]}`
  }

  messageText += `\n\nSpecify how long it will take to fulfill this order.\nUse this exact format:\n #${orderID} - [minutes]`


  client.messages
      .create({
        body: messageText,
        from: '+18077709123', //process.env.MY_PHONE_NUMBER
        to: adminPhone
      })
      .then(message => console.log(message.sid))
      .catch((err) => console.log(err));
}


const tempOrderItems = {
  "Tilapia": 1, 
  "Cranberry scone": 3
}

sendOrderToAdminSMS(5, tempOrderItems);
