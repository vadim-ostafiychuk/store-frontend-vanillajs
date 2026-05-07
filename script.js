const products = JSON.parse(localStorage.getItem("products")) || [
  { id: 1, title: "Title 1", price: 20, img: "https://placehold.co/300x400" },
  { id: 2, title: "Title 2", price: 50, img: "https://placehold.co/300x400" },
  { id: 3, title: "Title 3", price: 100, img: "https://placehold.co/300x400" },
];

function saveProducts() {
  localStorage.setItem("products", JSON.stringify(products));
}

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function addProduct() {
    const titleInput = document.getElementById("productTitle");
    const priceInput = document.getElementById("productPrice");

    const title = titleInput.value.trim();
    const price = Number(priceInput.value);

    if (!title || !price) return;

    const newProduct = {
        id: Date.now(),
        title,
        price,
        img: "https://placehold.co/300x400"
    };

    products.push(newProduct);

    renderProducts();

    titleInput.value = "";
    priceInput.value = "";
}

function addToCart(id) {
  const cartItemIndex = cart.findIndex((cartItem) => cartItem.productId === id);

  if (cartItemIndex !== -1) {
    cart[cartItemIndex].quantity += 1;

    cart[cartItemIndex].cartItemTotal =
      cart[cartItemIndex].productPrice * cart[cartItemIndex].quantity;
  } else {
    const product = products.find((product) => product.id === id);

    cart.push({
      productId: product.id,
      productTitle: product.title,
      productPrice: product.price,
      cartItemTotal: product.price,
      quantity: 1,
    });
  }

  renderCart();
}

function deleteFromCart(id) {
  const index = cart.findIndex((item) => item.productId === id);

  if (index !== -1) {
    cart.splice(index, 1);
  }

  renderCart();
}

function updateTotal() {
  const total = cart.reduce((sum, item) => sum + item.cartItemTotal, 0);
  document.getElementById("total").innerText = `Total: ${total} UAH`;
}

function increaseQuantity(id) {
  const item = cart.find((item) => item.productId === id);

  if (!item) return;

  item.quantity++;

  item.cartItemTotal = item.productPrice * item.quantity;

  renderCart();
}

function decreaseQuantity(id) {
  const item = cart.find((item) => item.productId === id);

  if (!item) return;

  item.quantity--;

  if (item.quantity <= 0) {
    deleteFromCart(id);
    return;
  }

  item.cartItemTotal = item.productPrice * item.quantity;

  renderCart();
}

function renderProducts() {

  saveProducts()

  const productsList = document.getElementById("products");

  productsList.innerHTML = "";

  products.forEach((el) => {
    const card = document.createElement("div");
    card.className = "products__card";

    card.innerHTML = `
            <img src="${el.img}" alt="${el.title}">
            <h2>${el.title} - ${el.price} UAH</h2>
            <button onclick="addToCart(${el.id})">Add To Cart</button>
        `;

    productsList.appendChild(card);
  });
}

function renderCart() {
  saveCart();

  const cartElement = document.getElementById("cartBody");

  cartBody.innerHTML = "";

  cart.forEach((item, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
            <td>${item.productTitle}</td>
            <td>${item.productPrice} UAH</td>
            <td>
              <button onclick="decreaseQuantity(${item.productId})">-</button>
              ${item.quantity}
              <button onclick="increaseQuantity(${item.productId})">+</button></td>
            <td>
                <button onclick="deleteFromCart(${item.productId})">Remove</button>
            </td>
        `;

    cartBody.appendChild(row);
  });

  updateTotal();
}

renderProducts();
renderCart();
