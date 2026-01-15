const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");

menuBtn.addEventListener("click", () => {
  nav.classList.toggle("active");
});

document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".banner-slider .slide");
  let current = 0;

  if (slides.length > 0) {
    setInterval(() => {
      slides[current].classList.remove("active");
      current = (current + 1) % slides.length;
      slides[current].classList.add("active");
    }, 3000);
  }
});

let cart = [];
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const checkoutBtn = document.querySelector(".checkout-btn");

document.querySelectorAll(".add-cart").forEach(button => {
  button.addEventListener("click", () => {
    const card = button.parentElement;
    const name = card.querySelector("h3").textContent;
    const price = parseInt(
    card.querySelector(".price").textContent
    .replace("₱", "")
    .replace(/,/g, "")
    );
    const stockSpan = card.querySelector(".stock-count");
    let stock = parseInt(stockSpan.textContent);

    if (stock <= 0) {
      alert("Out of stock!");
      return;
    }

    stock--;
    stockSpan.textContent = stock;

    const item = cart.find(i => i.name === name);

    if (item) {
      item.qty++;
    } else {
      cart.push({name,price,qty: 1,maxStock: stock + 1,stockElement: stockSpan});
    }

    updateCart();
  });
});

function updateCart() {
  cartItems.innerHTML = "";
  let total = 0;
  let count = 0;

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.qty;
    total += itemTotal;
    count += item.qty;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.name}</td>
      <td>₱${item.price}</td>
      <td>
        <input type="number" min="1" max="${item.maxStock}" value="${item.qty}" data-index="${index}">
      </td>
      <td>₱${itemTotal}</td>
      <td>
        <button class="remove-btn" data-index="${index}">X</button>
      </td>
    `;
    cartItems.appendChild(row);
  });

  cartTotal.textContent = total;
  cartCount.textContent = count;

  setupInputs();
}

function setupInputs() {
  document.querySelectorAll(".cart-table input").forEach(input => {
    input.addEventListener("change", e => {
      const index = e.target.dataset.index;
      let newQty = parseInt(e.target.value) || 1;

    if (newQty > cart[index].maxStock) {
    alert("Quantity exceeds available stock!");
    newQty = cart[index].maxStock;
}

const item = cart[index];
const oldQty = item.qty;

if (newQty > item.maxStock) {
  alert("Quantity exceeds available stock!");
  newQty = item.maxStock;
}

item.qty = Math.max(1, newQty);

// Restore or reduce stock difference
const diff = oldQty - item.qty;
item.stockElement.textContent =
  parseInt(item.stockElement.textContent) + diff;

updateCart();
    });
  });

  document.querySelectorAll(".remove-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      const index = e.target.dataset.index;
      const item = cart[index];

// Restore full quantity to stock
item.stockElement.textContent =
  parseInt(item.stockElement.textContent) + item.qty;

cart.splice(index, 1);
updateCart();
    });
  });
}

checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Your cart is empty!");
  } else {
    alert("Checkout successful! (Demo only)");
    cart = [];
    updateCart();
  }
});

const searchInput = document.getElementById("searchInput");
const productCards = document.querySelectorAll(".product-card");

searchInput.addEventListener("keyup", () => {
  const searchValue = searchInput.value.toLowerCase();

  productCards.forEach(card => {
    const productName = card.querySelector("h3").textContent.toLowerCase();

    if (productName.includes(searchValue)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
});