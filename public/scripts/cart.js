const createCartItem = function(item) {

  const $cartItem = $(`
  <article>
  <div class="item-details">
  <img src="${item.image}" class="cart-image">
  <div class ="item-name-desc">
  <span class="food-item-name">${item.name}</span>
  <span class="menu-price"> $${item.price}.00</span>
  </div>
  </div>
  <div class="item-actions">
  <form class="cart-update" action="/cart/change/${item.id}" method="POST">
    <input type="number" name="newQuant" min="1" max="9" value="${item.quant}">
    <button type="submit" class="update-button">Update quantity</button>
  </form>
  <form class="remove-from-cart" action="/cart/remove/${item.id}" method="POST">
    <button type="submit" class="remove-button">Remove</button>
  </form>
  </div>
  </article>`);
return $cartItem;
}

const renderCart = function () {

  //Make a call to theAPI
  $.ajax(`/cart/contents`, { method: 'GET' })
  .then((cartItems) => {
      if(cartItems){
        for (let item of cartItems){
          $('#cart-items').append(createCartItem(item));
        }
      }

  })
}

const displayTotalPrice= () => {

  $.ajax(`/cart/contents`, { method: 'GET' })
  .then((cartItems) => {
    let totalCost = 0;
    if (cartItems) {
      for (let item of cartItems) {
        totalCost += item.price * item.quant
      }
      $("#order-total").text(totalCost);
    } else {
      $('#outer-container > main').empty();
      $('#outer-container > main').append('<h1>Your cart is empty.</h1>')
    }

  });


}



$(document).ready(function() {
  renderCart();
  displayTotalPrice();
});


//<span style="display:none" class="cart-item-id">${item.id}</span>



//-------------THIS DOESN't WORK

const addRemoveListener = function () {

  $('.remove-button').click(function (event) {

    event.preventDefault()

    const itemID = $(this).siblings("span.cart-item-id").text();
    $.ajax(`/cart/remove/${itemID}`, { method: 'POST' })
    .then(() => {
      $(this).closest("article").empty();
      displayTotalPrice();
    })

    // $.ajax(`/cart/remove/${itemID}`)
    //   console.log("HERE!");
    //   // console.log(this.closest("article"));
    //   // this.closest("article").empty();
  })
}
