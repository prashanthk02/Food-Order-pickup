## Links to other notes

* [API](.\experiments\twilio-api\README.md)
* [Memory storage](".\experiments\memory-storage\README.md) - objects in memory, not database

## Technology  Overview

### EJS
* The navbar is a header partial
* Clicking on Menu - displays the appetizer section of the menu
* Clicking on Orders - displays orders with the most recent on top and status of "Completed", "Preparing", or "Waiting for approval" (or whatever they are called)
* Clicking on Cart gives the basic outline of the page

### jQuery
* Menu page: 
  * Clicking links 'appetizer', 'main', 'dessert' etc changes what is displayed on the page. Appetizers is the default section (how to coordinate this???). 
  * Source of data: the database dishes table.
  * Clicking 'add to cart' initializes or updates the cart object of the user
* Cart page:
  * Data source: the cart object in memory
  * Adjusting amount, or deleting item from cart updates the cart object of the user
  * Removing an item from cart removes it from the page
    * This should be a call to re-show all the items based on the data in cart, not hide the div
  * The total $ beside the "Send order" button is updated dynamically any time user changes amount or deletes an item
  * When the cart is empty, either redirect back to the menu, or make the the button to submit order not clickable and display a message that the cart is empty
* Order page
  * Is it possible to dynamically change the status of the object?

## Routes summary