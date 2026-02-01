const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root", // change if you use another user
  password: "D4i4l6e3e@p", // add your MySQL password
  database: "ironlady",
});

// Test connection
db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL");
});

// CRUD Routes
// CREATE
app.post("/products", (req, res) => {
  const { name, price, stock, supplier } = req.body;
  db.query(
    "INSERT INTO products (name, price, stock, supplier) VALUES (?, ?, ?, ?)",
    [name, price, stock, supplier],
    (err, result) => {
      if (err) throw err;
      res.send({ id: result.insertId, name, price, stock, supplier });
    },
  );
});

// READ
app.get("/products", (req, res) => {
  db.query("SELECT * FROM products", (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

// UPDATE
app.put("/products/:id", (req, res) => {
  const { name, price, stock, supplier } = req.body;
  db.query(
    "UPDATE products SET name=?, price=?, stock=?, supplier=? WHERE id=?",
    [name, price, stock, supplier, req.params.id],
    (err, result) => {
      if (err) throw err;
      res.send({ message: "Product updated" });
    },
  );
});

// DELETE
app.delete("/products/:id", (req, res) => {
  db.query(
    "DELETE FROM products WHERE id=?",
    [req.params.id],
    (err, result) => {
      if (err) throw err;
      res.send({ message: "Product deleted" });
    },
  );
});

app.listen(3000, () => console.log("Server running on port 3000"));
