const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());

const file = "./db.json";

// Get food menu
app.get("/food", (req, res) => {
  const data = JSON.parse(fs.readFileSync(file));
  res.json(data.foodItems);
});

// Place customer order
app.post("/order", (req, res) => {
  const data = JSON.parse(fs.readFileSync(file));

  const order = req.body;
  order.id = Date.now();

  data.orders.push(order);

  fs.writeFileSync(file, JSON.stringify(data, null, 2));

  res.json({
    message: "Order placed successfully",
    order
  });
});

// Get all orders
app.get("/orders", (req, res) => {
  const data = JSON.parse(fs.readFileSync(file));
  res.json(data.orders);
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});