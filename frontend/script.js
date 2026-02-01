const form = document.getElementById("addProductForm");
const productList = document.getElementById("productList");

let editingId = null; // track which product is being edited

// CREATE or UPDATE product
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const product = {
    name: document.getElementById("name").value,
    price: document.getElementById("price").value,
    stock: document.getElementById("stock").value,
    supplier: document.getElementById("supplier").value,
  };

  if (editingId) {
    // UPDATE
    await fetch(`http://localhost:3000/products/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
    editingId = null;
    form.querySelector("button").textContent = "Add Product"; // reset button text
  } else {
    // CREATE
    await fetch("http://localhost:3000/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
  }

  form.reset();
  loadProducts();
});

// READ products
async function loadProducts() {
  const res = await fetch("http://localhost:3000/products");
  const products = await res.json();

  productList.innerHTML = products
    .map(
      (p) =>
        `<p>
      ${p.name} - ${p.stock} units 
      <button onclick="deleteProduct(${p.id})">Delete</button>
      <button onclick="editProduct(${p.id}, '${p.name}', ${p.price}, ${p.stock}, '${p.supplier}')">Edit</button>
    </p>`,
    )
    .join("");
}

// DELETE product
async function deleteProduct(id) {
  await fetch(`http://localhost:3000/products/${id}`, { method: "DELETE" });
  loadProducts();
}

// EDIT product (prefill form)
function editProduct(id, name, price, stock, supplier) {
  document.getElementById("name").value = name;
  document.getElementById("price").value = price;
  document.getElementById("stock").value = stock;
  document.getElementById("supplier").value = supplier;

  editingId = id;
  form.querySelector("button").textContent = "Update Product"; // change button text
}

// Load products when page opens
loadProducts();
