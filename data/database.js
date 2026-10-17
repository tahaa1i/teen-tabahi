const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./food_ordering.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
  }
});

// Create tables
db.serialize(() => {
  // Menu items table
  db.run(`CREATE TABLE IF NOT EXISTS menu_items (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price REAL NOT NULL,
    image TEXT,
    description TEXT
  )`);

  // Orders table
  db.run(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    items TEXT NOT NULL,  -- JSON string of cart items
    total REAL NOT NULL,
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Insert menu data
  const menuData = [
    { id: 1, name: "Delicious Pizza", category: "pizza", price: 2000, image: "images/f1-image.png", description: "Cheesy and hot pizza with fresh toppings." },
    { id: 2, name: "Classic Burger", category: "burger", price: 500, image: "images/f2image.png", description: "Spicy" },
    { id: 3, name: "Cheese Pizza", category: "pizza", price: 1200, image: "images/f3image.png", description: "Loaded with mozzarella cheese and herbs." },
    { id: 4, name: "Creamy Pasta", category: "pasta", price: 750, image: "images/f4image.png", description: "Creamy pasta with mushrooms and parmesan." },
    { id: 5, name: "Classic Fries", category: "fries", price: 150, image: "images/f5image.png", description: "Smoky Fries." },
    { id: 6, name: "Pepperoni Pizza", category: "pizza", price: 1300, image: "images/f6.png", description: "Pepperoni slices with extra cheese." },
    { id: 7, name: "Beef patty burger", category: "burger", price: 850, image: "images/f7.png", description: "Grilled beef patty with lettuce and tomato." },
    { id: 8, name: "Chicken Burger", category: "burger", price: 450, image: "images/f8.png", description: "Goated Burger with special sauce." },
    { id: 9, name: "Spaghetti", category: "pasta", price: 1000, image: "images/f9.png", description: "Classic spaghetti with tomato sauce." }
  ];

  const stmt = db.prepare("INSERT OR IGNORE INTO menu_items (id, name, category, price, image, description) VALUES (?, ?, ?, ?, ?, ?)");
  menuData.forEach(item => {
    stmt.run(item.id, item.name, item.category, item.price, item.image, item.description);
  });
  stmt.finalize();

  console.log('Database tables created and menu data inserted.');
});

// Function to insert an order
function insertOrder(orderData, callback) {
  const { customer_name, email, phone, address, items, total } = orderData;
  const itemsJson = JSON.stringify(items);

  db.run(`INSERT INTO orders (customer_name, email, phone, address, items, total) VALUES (?, ?, ?, ?, ?, ?)`,
    [customer_name, email, phone, address, itemsJson, total],
    function(err) {
      if (err) {
        console.error('Error inserting order:', err.message);
        callback(err);
      } else {
        console.log('Order inserted with ID:', this.lastID);
        callback(null, this.lastID);
      }
    });
}

// Function to get all menu items
function getMenuItems(callback) {
  db.all("SELECT * FROM menu_items", [], (err, rows) => {
    if (err) {
      console.error('Error fetching menu items:', err.message);
      callback(err);
    } else {
      callback(null, rows);
    }
  });
}

// Function to get all orders
function getOrders(callback) {
  db.all("SELECT * FROM orders ORDER BY order_date DESC", [], (err, rows) => {
    if (err) {
      console.error('Error fetching orders:', err.message);
      callback(err);
    } else {
      callback(null, rows);
    }
  });
}

const fs = require('fs');
const path = require('path');

// Function to export menu items to JSON
function exportMenuToJson(callback) {
  getMenuItems((err, rows) => {
    if (err) {
      callback(err);
    } else {
      const jsonData = JSON.stringify(rows, null, 2);
      fs.writeFile(path.join(__dirname, 'menu_items.json'), jsonData, 'utf8', (err) => {
        if (err) {
          callback(err);
        } else {
          console.log('Menu items exported to menu_items.json');
          callback(null);
        }
      });
    }
  });
}

// Function to export orders to JSON
function exportOrdersToJson(callback) {
  getOrders((err, rows) => {
    if (err) {
      callback(err);
    } else {
      const jsonData = JSON.stringify(rows, null, 2);
      fs.writeFile(path.join(__dirname, 'orders.json'), jsonData, 'utf8', (err) => {
        if (err) {
          callback(err);
        } else {
          console.log('Orders exported to orders.json');
          callback(null);
        }
      });
    }
  });
}

module.exports = {
  db,
  insertOrder,
  getMenuItems,
  getOrders,
  exportMenuToJson,
  exportOrdersToJson
};
