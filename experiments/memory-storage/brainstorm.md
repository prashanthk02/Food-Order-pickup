* Assumption for now: In the cart, only the grand total is added up and displays near the "Send order" button. In the list of items, it lists e.g. $13 x 2 if an item costs $13 and the user chose quantity 2. The 2 dynamically changes by jQuery when user manipulates the quantity in the Cart, and the grand total is also manipulated.

### Key objects that will exist in memory but not the database

```js

const allCartObjects = {
// cart Content for user 1, indexed by userID
userID1: {
  items: {soup: {price: 13.00, quant: 1}, salad: {price: 10.00, quant: 2}}, 
  getTotalPrice() {
    let totalPrice = 0;
    for (let dish of Object.keys(this.items)){
      totalPrice += this.items[dish].price*this.items[dish].quant
    }
    return totalPrice
  }
  }, 
// cart Content for user 2, indexed by userID
userID2: {
  items: {soup: 1, salad: 2},
  total_price: 20.00
  }
}

//Each cartOrder looks like, e.g.
const cartOrder1 = {fish: 1, cupcake: 1}

```

How this object evolves over time:
- The user is logged into a session. Before we have login/registration, we use one user as a global default
- A user can only have one order in the cart at a time. When the user is on the Menu page and they click "Add to cart", we check if  `allCartObjects[userID]` already exists, where `userID` is the ID of the logged in user. If it exists, we manipulate data inside the existing object. If not, we create a new cart object for that user.
- We can manipulate the quantity of menu items both from the Menu page and from the Cart page. If a certain menu item already exists in the object, we change the amount. If it doesn't exist, we add it. If the user presses 'remove from cart', we delete it.
* When the user presses "Send order" from the Cart page, the order is removed from the 'allCartObjects'

*/



```js
const cartOrder1 = 
{
    userId: 1 (for Alice...),

    status: // "Cart" or "Sent but not completed"
    menuItems: [{fish: 1, cupcake: 2}}],
    timestampForCompletion: ....
}

// This object begins as a cart, so it can not have the orderID match the database yet

/*

How this object evolves over time:
- 
-
-

*/
```
<br>

----

<br>


* When the client presses make order, they provide a phone number. The order is also logged into the database.

* The message received must be:
  * From the admin phone #
  * In the right format
  * The order # must
    * Refer to an existing order
    * Not already have an associated time delay

* When a valid message is received:
  * Status is the database changes
  * The user is notified by SMS
  * SetTimeout is set for more changes
    * Order is changed to completed in the database
    * Order is changed in the user's orders page? by jQuery? maybe?
    * Order is cleared from the temp memory object

<br>

----

<br>

* User to change information about themselves, add another phone?