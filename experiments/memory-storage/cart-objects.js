

class userCart {

	constructor() {
    this.items = {}
  }
  removeDish (dish) {
    delete this.items[dish];
  }

  changeDishQuant(dish, newQuant) {
    this.items[dish].quant = newQuant;
  }

  //Called from the MENU page
  //Either creates the dish in the list, or increments existing
  addDish(dish, price, amountAdded) {
    if(!this.items[dish]) this.items[dish] = {price: price, quant: 0}; //Add to list if it's not there, set quantity to 0
    this.items[dish].quant += amountAdded; //Add the quantity specified in either case
  }


  getTotalPrice() {
    let totalPrice = 0;
    for (let dish of Object.keys(this.items)) {
      totalPrice += this.items[dish].price * this.items[dish].quant;
    }
    return totalPrice;
  }

}


///--------------HOW TO USE IT


currUserID = 1; //<-----We set this manually or later with cookies

const allUserCarts = {};// Looks like this: {userID1: [object of a userCart Class], userID2: [object of a userCart Class]}

if (!allUserCarts[currUserID]) {
  allUserCarts[currUserID] = new userCart();
}

//An individual user cart looks like this, with properties and helper methods

// const userCart = {
//   items: {soup: {price: 13.00, quant: 1}, salad: {price: 10.00, quant: 2}}, 
//   addDish();
//   removeDish();
//   changeDishQuant();
//   getTotalPrice();
// }


//TESTING

console.log("Create empty cart, the total price is: " + allUserCarts[currUserID].getTotalPrice());

allUserCarts[currUserID].addDish("Tilapia", 13.00, 2);
console.log("After adding two Tilapia ($13 each), the total price is: " + allUserCarts[currUserID].getTotalPrice());

allUserCarts[currUserID].addDish("Tilapia", 13.00, 1);
console.log("Add one more Tilapia, the total price is: " + allUserCarts[currUserID].getTotalPrice());

allUserCarts[currUserID].changeDishQuant("Tilapia", 1);
console.log("Change the Tilapia quantity from 3 to 1, the total price is: " + allUserCarts[currUserID].getTotalPrice());

allUserCarts[currUserID].addDish("Muffin", 2.00, 3);
console.log("Add 3 muffins ($2 each), the total price is: " + allUserCarts[currUserID].getTotalPrice());

allUserCarts[currUserID].removeDish("Tilapia");
console.log("Take all Tilapia out of cart, the total price is: " + allUserCarts[currUserID].getTotalPrice());