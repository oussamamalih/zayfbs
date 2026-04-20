const products = [
  {
    name: "Huile Extra Vierge Classique",
    price: "200 MAD",
    image: "images/pro1.png"
  },
  {
    name: "Huile Bio Premium 500ml",
    price: "80 MAD",
    image: "images/pro2.png"
  },
  {
    name: "Huile Artisanale 1L",
    price: "80 MAD",
    image: "images/pro3.png"
  },
  {
    name: "Coffret Découverte",
    price: "80 MAD",
    image: "images/pro4.png"
  }
];

const container = document.getElementById("shop-container");

products.forEach(product => {
  
  const card = document.createElement("div");
  card.classList.add("card");

  
  card.innerHTML = `
    <img src="${product.image}" alt="${product.name}">
    <h3>${product.name}</h3>
    <p class="prix">${product.price}</p>
  <button class="add-btn" id="add-btn">Add to Cart</button>
  `;

  
  container.appendChild(card);
});

