
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
      <input type="number" name="quant" min="1" max="9" value="1">
      <button type="submit" class="add-button">Add to Cart</button>
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
        $('.menu-items').append(createMenuItem(item));
      }
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
