const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./db");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});


// ==========================================
// TEST BACKEND
// ==========================================

app.get("/api/test", (req, res) => {
    res.json({
        message: "Sky Plastics backend is working!"
    });
});


// ==========================================
// GET PRODUCTS FROM MYSQL
// ==========================================

app.get("/api/products", (req, res) => {

    const sql = "SELECT * FROM products";

    db.query(sql, (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                error: "Database error"
            });
        }

        res.json(results);
    });
});


// ==========================================
// CREATE NEW ORDER
// ==========================================

app.post("/api/orders", (req, res) => {

    const {
        name,
        phone,
        email,
        address,
        city,
        pincode,
        items
    } = req.body;


    // Check required information
    if (!name || !phone || !address || !items || items.length === 0) {

        return res.status(400).json({
            error: "Customer details and products are required"
        });

    }


    // ==========================================
    // STEP 1: CREATE CUSTOMER
    // ==========================================

    const customerSQL = `
        INSERT INTO customers
        (name, phone, email, address, city, pincode)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
        customerSQL,
        [name, phone, email, address, city, pincode],
        (customerError, customerResult) => {

            if (customerError) {

                console.error("Customer error:", customerError);

                return res.status(500).json({
                    error: "Could not save customer"
                });

            }


            const customerId = customerResult.insertId;


            // ==========================================
            // STEP 2: GET PRODUCT PRICES FROM DATABASE
            // ==========================================

            const productIds = items.map(item => item.product_id);

            const placeholders = productIds.map(() => "?").join(",");

            const productSQL = `
                SELECT id, name, price, stock
                FROM products
                WHERE id IN (${placeholders})
            `;

            db.query(
                productSQL,
                productIds,
                (productError, products) => {

                    if (productError) {

                        console.error("Product error:", productError);

                        return res.status(500).json({
                            error: "Could not get products"
                        });

                    }


                    // ==========================================
                    // CHECK PRODUCTS
                    // ==========================================

                    if (products.length !== productIds.length) {

                        return res.status(400).json({
                            error: "One or more products were not found"
                        });

                    }


                    let totalAmount = 0;


                    // Check stock and calculate total
                    for (const item of items) {

                        const product = products.find(
                            p => p.id === item.product_id
                        );

                        if (!product) {
                            return res.status(400).json({
                                error: "Product not found"
                            });
                        }

                        if (item.quantity <= 0) {
                            return res.status(400).json({
                                error: "Invalid quantity"
                            });
                        }

                        if (product.stock < item.quantity) {

                            return res.status(400).json({
                                error: `${product.name} does not have enough stock`
                            });

                        }

                        totalAmount += product.price * item.quantity;
                    }


                    // ==========================================
                    // STEP 3: CREATE ORDER
                    // ==========================================

                    const orderSQL = `
                        INSERT INTO orders
                        (customer_id, total_amount, status)
                        VALUES (?, ?, ?)
                    `;

                    db.query(
                        orderSQL,
                        [customerId, totalAmount, "Pending"],
                        (orderError, orderResult) => {

                            if (orderError) {

                                console.error("Order error:", orderError);

                                return res.status(500).json({
                                    error: "Could not create order"
                                });

                            }


                            const orderId = orderResult.insertId;


                            // ==========================================
                            // STEP 4: SAVE ORDER ITEMS
                            // ==========================================

                            let completedItems = 0;

                            for (const item of items) {

                                const product = products.find(
                                    p => p.id === item.product_id
                                );


                                const itemSQL = `
                                    INSERT INTO order_items
                                    (order_id, product_id, quantity, price)
                                    VALUES (?, ?, ?, ?)
                                `;


                                db.query(
                                    itemSQL,
                                    [
                                        orderId,
                                        item.product_id,
                                        item.quantity,
                                        product.price
                                    ],
                                    (itemError) => {

                                        if (itemError) {

                                            console.error(
                                                "Order item error:",
                                                itemError
                                            );

                                            return res.status(500).json({
                                                error: "Could not save order items"
                                            });

                                        }


                                        // ==========================================
                                        // STEP 5: REDUCE STOCK
                                        // ==========================================

                                        const updateStockSQL = `
                                            UPDATE products
                                            SET stock = stock - ?
                                            WHERE id = ?
                                        `;


                                        db.query(
                                            updateStockSQL,
                                            [
                                                item.quantity,
                                                item.product_id
                                            ],
                                            (stockError) => {

                                                if (stockError) {

                                                    console.error(
                                                        "Stock update error:",
                                                        stockError
                                                    );

                                                    return res.status(500).json({
                                                        error: "Could not update stock"
                                                    });

                                                }


                                                completedItems++;


                                                // ==========================================
                                                // ORDER COMPLETED
                                                // ==========================================

                                                if (
                                                    completedItems === items.length
                                                ) {

                                                    res.status(201).json({

                                                        message:
                                                            "Order placed successfully!",

                                                        order_id:
                                                            orderId,

                                                        total_amount:
                                                            totalAmount,

                                                        status:
                                                            "Pending"
                                                    });

                                                }

                                            }
                                        );

                                    }
                                );

                            }

                        }
                    );

                }
            );

        }
    );

});


// ==========================================
// START SERVER
// ==========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {

    console.log(
        `🚀 Sky Plastics server running on port ${PORT}`
    );

});