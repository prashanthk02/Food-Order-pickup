# Notes on using the API

* Helper functions not written yet, just tried rough code for now...

* Install Twilio: `npm install twilio --no-bin-links` (or `npm install` since it is already in `package-lock.json`)

* In order for the server to receive an SMS, Twilio has to connect to an ngrok server rather than a local server

  * `npm install ngrok -g` (for some reason it's not in `package-lock.json`)
  * `ngrok authtoken 27ajZJD2vezF7f7SB5pujHVnBSl_2QLuc4ysDUPDGQvvxyZ92` (or if it doesn't work, get token from Ngrok account online or ask Daria)

  *Need two terminals to do simultaneously*
  * `npm start local` to run the app
  * `ngrok http 8080` and copy the `https://...` address that is redirected. Make sure the app dispays on that address.
  * Give the ngrok address to Daria to add to the online Twilio account
  * Do not close and re-run the ngrok connection because it will give you a different address next time

* For now authenticating with Twilio account SID and access token, will see if can change to API key
  * ...
