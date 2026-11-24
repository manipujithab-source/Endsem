import { useState } from "react";
import foodData from "./food.json";
import "./App.css";

function App() {
  const [food] = useState(foodData);
  const [cart, setCart] = useState({});
  const [customer, setCustomer] = useState("");
  const [message, setMessage] = useState("");

  const categories = ["South Indian", "North Indian", "Western"];

  const addItem = (id) => {
    setCart((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };

  const removeItem = (id) => {
    setCart((prev) => {
      const updated = { ...prev };

      if (updated[id] > 1) {
        updated[id]--;
      } else {
        delete updated[id];
      }

      return updated;
    });
  };

  const total = food.reduce(
    (sum, item) => sum + item.price * (cart[item.id] || 0),
    0
  );

  const placeOrder = () => {
    const items = food
      .filter((item) => cart[item.id])
      .map((item) => ({
        name: item.name,
        price: item.price,
        quantity: cart[item.id],
        amount: item.price * cart[item.id]
      }));

    if (!customer.trim()) {
      setMessage("Please enter customer name");
      return;
    }

    if (items.length === 0) {
      setMessage("Please select food items");
      return;
    }

    const order = {
      id: Date.now(),
      customer: customer,
      items: items,
      total: total,
      date: new Date().toLocaleString()
    };

    const oldOrders = JSON.parse(
      localStorage.getItem("orders") || "[]"
    );

    oldOrders.push(order);

    localStorage.setItem("orders", JSON.stringify(oldOrders));

    setMessage("Order placed successfully!");

    setCart({});
    setCustomer("");
  };

  const viewOrders = () => {
    const orders = JSON.parse(
      localStorage.getItem("orders") || "[]"
    );

    console.log("Saved Orders:", orders);
    alert("Saved orders are available in the browser console.");
  };

  const clearOrders = () => {
    localStorage.removeItem("orders");
    alert("All saved orders cleared");
  };

  return (
    <div className="container">
      <h1>Restaurant Billing System</h1>

      <p className="subtitle">
        Select food and place your order
      </p>

      <input
        type="text"
        placeholder="Enter customer name"
        value={customer}
        onChange={(e) => setCustomer(e.target.value)}
      />

      {categories.map((category) => (
        <div key={category}>
          <h2>{category}</h2>

          <div className="menu">
            {food
              .filter((item) => item.category === category)
              .map((item) => (
                <div className="food-card" key={item.id}>
                  <h3>{item.name}</h3>

                  <p>₹{item.price}</p>

                  <div className="quantity">
                    <button onClick={() => removeItem(item.id)}>
                      -
                    </button>

                    <span>{cart[item.id] || 0}</span>

                    <button onClick={() => addItem(item.id)}>
                      +
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}

      <h2>Your Bill</h2>

      <div className="bill">
        {food
          .filter((item) => cart[item.id])
          .map((item) => (
            <p key={item.id}>
              {item.name} × {cart[item.id]} = ₹
              {item.price * cart[item.id]}
            </p>
          ))}

        <h3>Total: ₹{total}</h3>

        <button className="order-btn" onClick={placeOrder}>
          Place Order
        </button>
      </div>

      {message && <p className="message">{message}</p>}

      <div className="order-actions">
        <button onClick={viewOrders}>
          View Saved Orders
        </button>

        <button onClick={clearOrders}>
          Clear Orders
        </button>
      </div>
    </div>
  );
}

export default App;