const dishesData = [
  {
    id: "pizza-margherita",
    name: "Pizza Margherita",
    price: 8.5,
    category: "pizza",
    description:
      "Classic pizza with tomato sauce, mozzarella cheese, and fresh basil.",
    image: "./assets/img/pizza-margherita.png",
  },
  {
    id: "pizza-salami",
    name: "Pizza Salami",
    price: 9.0,
    category: "pizza",
    description:
      "Delicious pizza topped with spicy salami, mozzarella cheese, and tomato sauce.",
    image: "./assets/img/pizza-salami.png",
  },
  {
    id: "pizza-funghi",
    name: "Pizza Funghi",
    price: 9.5,
    category: "pizza",
    description:
      "Savory pizza with mushrooms, mozzarella cheese, and a hint of garlic.",
    image: "./assets/img/pizza-funghi.png",
  },
  {
    id: "spaghetti-carbonara",
    name: "Spaghetti Carbonara",
    price: 10.0,
    category: "pasta",
    description:
      "Traditional Roman pasta dish with eggs, cheese, pancetta, and pepper.",
    image: "./assets/img/spaghetti-carbonara.png",
  },
  {
    id: "spaghetti-bolognese",
    name: "Spaghetti Bolognese",
    price: 10.5,
    category: "pasta",
    description:
      "Hearty spaghetti with a rich meat sauce made from ground beef and tomatoes.",
    image: "./assets/img/spaghetti-bolognese.png",
  },
  {
    id: "caesar-salad",
    name: "Caesar Salad",
    price: 7.0,
    category: "salad",
    description:
      "Crisp romaine lettuce with Caesar dressing, croutons, and parmesan cheese.",
    image: "./assets/img/caesar-salad.png",
  },
  {
    id: "mixed-salad",
    name: "Gemischter Salat",
    price: 6.5,
    category: "salad",
    description:
      "Fresh mixed greens with tomatoes, cucumbers, and Italian vinaigrette.",
    image: "./assets/img/mixed-salad.png",
  },
  {
    id: "tiramisu",
    name: "Tiramisu",
    price: 5.5,
    category: "dessert",
    description:
      "A classic Italian dessert made with coffee-soaked ladyfingers and mascarpone cheese.",
    image: "./assets/img/tiramisu.png",
  },
  {
    id: "panna-cotta",
    name: "Panna Cotta",
    price: 5.0,
    category: "dessert",
    description: "Silky smooth vanilla panna cotta with fresh berry coulis.",
    image: "./assets/img/panna-cotta.png",
  },
];

// Export for Module
if (typeof module !== "undefined" && module.exports) {
  module.exports = { dishesData };
}

// Make it available globally
window.dishesData = dishesData;
