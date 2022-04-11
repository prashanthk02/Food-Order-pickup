
//Append one item
const createMenuItem = function(menuItem) {

  ///itemID should extract ${menuItem.id}

  const $menuItem = $(`
  <article>
  <header class="food-item-name">${menuItem.name}</header>
  <span class="food-description">${menuItem.description}</span>
  <span class="food-image"><img src=${menuItem.image}></span>
  <footer class="food-price">
    <span>${menuItem.price}</span>
    <form action="/add/:itemID/:quant" METHOD="post">
      <input type="number" min="1" max="9">
      </select>
      <button type="submit">Add to Cart</button>
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