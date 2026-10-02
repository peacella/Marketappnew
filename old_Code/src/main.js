import "./style.css";
import config from "./config.js";
import supabase from "./supabase.js";

const products = [
  { id: 1, n: "Garri", p: 8500, c: "food", e: "🌾" },
  { id: 2, n: "Palm Oil", p: 12000, c: "food", e: "🫙" },
  { id: 3, n: "Dried Hibiscus", p: 9500, c: "food", e: "🌺" },
  { id: 4, n: "Pure Honey", p: 11000, c: "natural", e: "🍯" },
  { id: 5, n: "Bitter Kola", p: 7500, c: "food", e: "🌰" },
  { id: 6, n: "Shea Butter", p: 9000, c: "natural", e: "🧴" },
  { id: 7, n: "Cocoa", p: 13500, c: "food", e: "🍫" },
  { id: 8, n: "Soursop Leaves", p: 6500, c: "natural", e: "🍃" },
];
let cart = JSON.parse(localStorage.getItem("pella_cart") || "[]");
const money = (n) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(n);
function renderProducts() {
  let f = document.getElementById("filter").value,
    g = document.getElementById("products");
  g.innerHTML = "";
  products
    .filter((x) => f === "all" || x.c === f)
    .forEach((x) =>
      g.insertAdjacentHTML(
        "beforeend",
        `<article class="product"><div class="pic">${x.e}</div><div class="info"><span class="tag">${x.c === "food" ? "FOODSTUFF" : "NATURAL ESSENTIAL"}</span><h3>${x.n}</h3><div class="price">${money(x.p)}</div><button class="add" onclick="add(${x.id})">Add to cart</button></div></article>`,
      ),
    );
}
function add(id) {
  let x = cart.find((i) => i.id === id);
  x ? x.q++ : cart.push({ id, q: 1 });
  save();
  renderCart();
  openCart();
}
function save() {
  localStorage.setItem("pella_cart", JSON.stringify(cart));
}
function renderCart() {
  let b = document.getElementById("items"),
    t = 0,
    c = 0;
  b.innerHTML = "";
  cart.forEach((i) => {
    let p = products.find((x) => x.id === i.id);
    t += p.p * i.q;
    c += i.q;
    b.insertAdjacentHTML(
      "beforeend",
      `<div class="cartItem"><div><b>${p.n}</b><div>${money(p.p)} × ${i.q}</div></div><div class="qty"><button onclick="qty(${p.id},-1)">−</button> <button onclick="qty(${p.id},1)">+</button></div></div>`,
    );
  });
  if (!cart.length) b.innerHTML = "<p>Your cart is empty.</p>";
  document.getElementById("total").textContent = money(t);
  document.getElementById("checkoutTotal").textContent = money(t);
  document.getElementById("cartCount").textContent = c;
}
function qty(id, d) {
  let x = cart.find((i) => i.id === id);
  x.q += d;
  if (x.q < 1) cart = cart.filter((i) => i.id !== id);
  save();
  renderCart();
}
function openCart() {
  document.getElementById("cartPanel").classList.add("open");
}
function closeCart() {
  document.getElementById("cartPanel").classList.remove("open");
}
document.getElementById("cartBtn").onclick = openCart;
document.getElementById("closeCart").onclick = closeCart;
document.getElementById("overlay").onclick = closeCart;
document.getElementById("filter").onchange = renderProducts;
document.getElementById("checkout").onclick = () => {
  if (!cart.length) return alert("Add a product first.");
  closeCart();
  document.getElementById("modal").classList.remove("hidden");
};
document.getElementById("closeModal").onclick = () =>
  document.getElementById("modal").classList.add("hidden");
document.getElementById("form").onsubmit = async (e) => {
  e.preventDefault();
  const message = document.getElementById("message");
  const { error } = await supabase.from("deliveries").insert({
    full_name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    address: document.getElementById("address").value,
  });
  if (error) {
    message.textContent = "Could not save your delivery. Please try again.";
    return;
  }
  message.textContent = "Order captured. We will contact you about your delivery.";
};
renderProducts();
renderCart();

window.add = add;
window.qty = qty;

export { config };
