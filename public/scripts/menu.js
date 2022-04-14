
//Append one item
const createMenuItem = function(menuItem) {

  ///itemID should extract ${menuItem.id}

  const $menuItem = $(`
  <article class="menu-box">
  <div class="name-des">
    <header class="food-item-name">${menuItem.name}</header>
    <span class="food-description">${menuItem.description}</span>
  <div>

  <div>
    <span><img src=${menuItem.image} class="menu-image"></span>
  </div>

  <footer class="menu-item-footer">
    <span class="menu-price">Price: $${menuItem.price}.00</span>
    <form class="menu-input" action="/cart/add/${menuItem.id}/" METHOD="POST">
      <input class="quant-form" type="number" name="quant" min="1" max="9" value="1">
      <button type="submit" class="add-button">Add to Cart<span style="display: none">${menuItem.id}</span></button>
    </form>
  </footer>
</article>`);
return $menuItem;
}


const renderCategory = function (category) {
  //Make a call to theAPI
  $.ajax(`/api/menu/${category}`, { method: 'GET' })
  .then((menuItems) => {
      for (let item of menuItems){
        $('.menu-items').append(createMenuItem(item))
      }
  })
  .then(() => {
    $(".add-button").click(function (event) {
      event.preventDefault();

      setTimeout( () => {
        $('#cart-button').css('color', 'white')
      }, 100);
      setTimeout( () => {
        $('#cart-button').css('color', '#5e5d95')
      }, 400);
      setTimeout( () => {
        $('#cart-button').css('color', 'white')
      }, 700);
      setTimeout( () => {
        $('#cart-button').css('color', '#5e5d95')
      }, 1000);
      setTimeout( () => {
        $('#cart-button').css('color', 'white')
      }, 1300);
      setTimeout( () => {
        $('#cart-button').css('color', '#5e5d95')
      }, 1600);

      const id = $(this).find("span").text();
      const inputQuant = Number($(this).siblings().val());
      $.ajax(`/cart/add/${id}/${inputQuant}`, { method: 'POST'})

    });

  });

}



const categoryClick = (category) => {
  $(`#category-${category}`).click((event) => {
    event.preventDefault();
    $('.menu-items').empty();
    renderCategory(category);
  })
}

const allCategoryClicks = () => {
  const categoryList = ["salad", "appetizer", "main", "side", "dessert", "drink"];
  for (let category of categoryList) {
    categoryClick(category);
  }
}


$(document).ready(function() {
  renderCategory("salad");
  allCategoryClicks();
});
