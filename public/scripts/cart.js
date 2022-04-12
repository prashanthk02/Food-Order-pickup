const createCartItem = function(item) {

  const $cartItem = $(`
  <article>
  <h4>${item.name}</h4>
  <div>
    <img src="${item.image}" class="cart-image">
    <label>Quantity: ${item.quant}</label>
    <input type="number" min="1" max="9"> * $${item.price}
    <button type="submit">Update Quantity</button>
  </div>
  <span>${item.description}</span>
  <button>Remove from Cart</button>
</article>`);
return $cartItem;
}

$(document).ready(function() {
  renderCart();
  // $('#cart-items').append(createCartItem());
});


const renderCart = function () {

  //Make a call to theAPI
  $.ajax(`/cart/contents`, { method: 'GET' })
  .then((cartItems) => {
      if(cartItems){
        for (let item of cartItems){
          $('#cart-items').append(createCartItem(item));
        }
      }

  });

}
