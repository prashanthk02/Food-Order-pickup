
const createOrderItem = (orders, orderID) => {

  const unixTimeZero = Date.parse(orders[orderID].time);
  const date = new Date(unixTimeZero);
  const dateCompoenents = date.toString().split(" ");
  const finalDate =`${dateCompoenents[0]}, ${dateCompoenents[1]} ${dateCompoenents[2]}, ${dateCompoenents[3]}, ${dateCompoenents[4].slice(0, 5)} EST`


  let dishesString = ``;
  for (let i of Object.keys(orders[orderID].dishes)){
    dishesString += `<li> ${orders[orderID].dishes[i].name} x ${orders[orderID].dishes[i].quantity}</li>`;
  }


  let $orderItem = $(`
  <article class="order">
  <div class="order-header">
    <div class="order-num">Order ID: ${orderID}</div>
    <div class="order-status ${orders[orderID].status}"> ${orders[orderID].status}</div>
  </div>
  <div class="order-body">
    <div class="order-date">
      ${finalDate}
    </div>
    <ul>
      ${dishesString}
    </ul>
    <div class="order-total">Total: $${orders[orderID].totalPrice}.00</div>
  </div>
</article>`);

      $("#outer-container > main").append($orderItem);
}




const renderOrders = () => {
    //Make a call to theAPI
    $.ajax(`/api/orders`, { method: 'GET' })
    .then((orders) => {
        for (let orderID of Object.keys(orders).reverse()){
          $("#outer-container > main").append(createOrderItem(orders, orderID));
        }
    });
}


$(document).ready(function() {
  renderOrders();
  console.log("YES");
});
