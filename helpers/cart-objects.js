class userCart {

	constructor() {
    this.items = {}
  }

  //Called from the CART page
  removeDish (dish) {
    delete this.items[dish];
  }

  //Called from the CART page
  changeDishQuant(dish, newQuant) {
    this.items[dish].quant = newQuant;
  }

  //Called from the MENU page
  //Either creates the dish in the list, or increments existing
  addDish(dish, amountAdded) {
    if(!this.items[dish]) this.items[dish] = {quant: 0};
    this.items[dish].quant += amountAdded;
  }

  //Helper function
  print(){
    let contents = "";
    for (let dish of Object.keys(this.items)) {
      contents += `Dish ID: ${dish}, Quantity: ${this.items[dish].quant}\n`
    }
    console.log(contents);
    return contents;
  }
}


///--------------USE

const makeCart = (userID) => {
  if (!global.allCarts[userID]) {
    global.allCarts[userID] = new userCart();
  }
}


module.exports = {makeCart};

