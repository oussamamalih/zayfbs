const products = [
  {
    name: "Protein Powder",
    price: "200 MAD",
    image: "images/step1.png"
  },
  {
    name: "Fitness Gloves",
    price: "80 MAD",
    image: "images/step1.png"
  },
  {
    name: "Fitness Gloves",
    price: "80 MAD",
    image: "images/step1.png"
  },
  {
    name: "Fitness Gloves",
    price: "80 MAD",
    image: "images/step1.png"
  }
];

const container = document.getElementById("shop-container");

products.forEach(product => {
  // Create card div
  const card = document.createElement("div");
  card.classList.add("card");

  // Add content
  card.innerHTML = `
    <img src="${product.image}" alt="${product.name}">
    <h3>${product.name}</h3>
    <p class="prix">${product.price}</p>
  <button class="add-btn" id="add-btn">Add to Cart</button>
  `;

  // Add card to container
  container.appendChild(card);
});

