create database sky_plastics;
USE sky_plastics;
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    type VARCHAR(100),
    size VARCHAR(100),
    price DECIMAL(10,2),
    master_box INT,
    image VARCHAR(255),
    stock INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO products
(name, category, type, size, price, master_box, image, stock)
VALUES
(
    '120ml Round Container',
    'Container',
    'Round',
    '120ml',
    2.10,
    3000,
    'assets/120ml.jpg',
    5000
);
INSERT INTO products
(name, category, type, size, price, master_box, image, stock)
VALUES

(
    '200ml Round Container',
    'Container',
    'Round',
    '200ml',
    3.10,
    1500,
    'assets/200ml.jpg',
    3000
),

(
    '250ml Round Container',
    'Container',
    'Round',
    '250ml',
    3.50,
    1000,
    'assets/250ml.jpg',
    2000
),

(
    '500g Round Container',
    'Container',
    'Round',
    '500g',
    4.30,
    1000,
    'assets/500ml.jpg',
    2000
),

(
    '750ml Biryani Container',
    'Container',
    'Biryani',
    '750ml',
    6.80,
    750,
    'assets/750ml.jpg',
    1500
);
SELECT * FROM products;
CREATE TABLE customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    address TEXT,
    city VARCHAR(100),
    pincode VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (customer_id)
    REFERENCES customers(id)
);
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,

    FOREIGN KEY (order_id)
    REFERENCES orders(id),

    FOREIGN KEY (product_id)
    REFERENCES products(id)
);
SELECT * FROM customers;
SELECT * FROM orders;
SELECT * FROM order_items;
SELECT * FROM customers;
SELECT * FROM orders;
SELECT * FROM order_items;
SELECT * FROM customers;
SELECT * FROM orders;
SELECT * FROM orders;
SELECT * FROM orders;
USE sky_plastics;
SELECT * FROM orders;
SELECT * FROM customers;
SELECT * FROM order_items;
SELECT * FROM orders;
SELECT * FROM orders;
SELECT * FROM customers;
SELECT * FROM order_items;
select * from products(stocks)