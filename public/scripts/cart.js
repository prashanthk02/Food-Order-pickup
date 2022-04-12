const createCartItem = function(item) {

  const $cartItem = $(`
  <article>
  <h4>${item.name}</h4>
  <div>
    <img src="${item.image}" class="cart-image">
    <label>Quantity: ${item.quant}</label>
    <form class="cart-update" action="/cart/change/${item.id}" method="POST">
      <input type="number" name="newQuant" min="1" max="9"> * $${item.price}
      <button type="submit">Update Quantity</button>
    </form>
  </div>
  <span>${item.description}</span>
  <form class="remove-from-cart" action="/cart/remove/${item.id}" method="POST">
  <button type="submit">Remove from Cart</button>
  </form>
</article>`);
return $cartItem;
}

$(document).ready(function() {
  renderCart();
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
