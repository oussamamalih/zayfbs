const products = [
  {
    name: "Huile Extra Vierge Classique",
    price: "200 MAD",
    image: "images/pro1.png",
    desc: "Notre huile d'olive extra vierge classique est un véritable trésor de la nature, pressée à froid pour préserver toutes ses qualités. Avec son goût riche et équilibré, elle est parfaite pour sublimer vos plats et apporter une touche méditerranéenne à votre cuisine."
  },
  {
    name: "Huile Bio Premium 500ml",
    price: "80 MAD",
    image: "images/pro2.png",
    desc: "Notre huile d'olive extra vierge classique est un véritable trésor de la nature, pressée à froid pour préserver toutes ses qualités. Avec son goût riche et équilibré, elle est parfaite pour sublimer vos plats et apporter une touche méditerranéenne à votre cuisine."
  },
  {
    name: "Huile Artisanale 1L",
    price: "80 MAD",
    image: "images/pro3.png",
    desc: "Notre huile d'olive extra vierge classique est un véritable trésor de la nature, pressée à froid pour préserver toutes ses qualités. Avec son goût riche et équilibré, elle est parfaite pour sublimer vos plats et apporter une touche méditerranéenne à votre cuisine."
  },
  {
    name: "Coffret Découverte",
    price: "80 MAD",
    image: "images/pro4.png",
    desc: "Notre huile d'olive extra vierge classique est un véritable trésor de la nature, pressée à froid pour préserver toutes ses qualités. Avec son goût riche et équilibré, elle est parfaite pour sublimer vos plats et apporter une touche méditerranéenne à votre cuisine."
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
    <p class="desc">${product.desc}</p>
  <button class="add-btn" id="add-btn">Add to Cart</button>
  `;

  
  container.appendChild(card);
});

