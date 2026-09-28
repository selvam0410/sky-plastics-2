/* =========================================
   PRODUCT DATA
========================================= */

const products = [

    {
        id: 1,
        name: "120ml Round Container",
        category: "round",
        type: "Round Container",
        size: "120ml",
        price: 2.10,
        image: "assets/120 ml.png",
        badge: "Popular"
    },

    {
        id: 2,
        name: "200ml Round Container",
        category: "round",
        type: "Round Container",
        size: "200ml",
        price: 3.10,
        image: "assets/200 ml.png",
        badge: ""
    },

    {
        id: 3,
        name: "250ml Round Container",
        category: "round",
        type: "Round Container",
        size: "250ml",
        price: 3.50,
        image: "assets/250 ml.png",
        badge: "Best Seller"
    },

    {
        id: 4,
        name: "500g Round Container",
        category: "round",
        type: "Round Container",
        size: "500g",
        price: 4.30,
        image: "assets/500 ml.png",
        badge: ""
    },

    {
        id: 5,
        name: "750ml Biryani Container",
        category: "biryani",
        type: "Biryani Container",
        size: "750ml",
        price: 6.80,
        image: "assets/750 ml.png",
        badge: "Popular"
    },

    {
        id: 6,
        name: "250ml Glass Tumbler",
        category: "glass",
        type: "Glass Tumbler",
        size: "250ml With Lid",
        price: 3.20,
        image: "assets/glass with lid.png",
        badge: "With Lid"
    },

    {
        id: 7,
        name: "250ml Glass Tumbler",
        category: "glass",
        type: "Glass Tumbler",
        size: "250ml Without Lid",
        price: 2.20,
        image: "assets/glass only.png",
        badge: "Open Top"
    }

];


/* =========================================
   VARIABLES
========================================= */

let currentCategory = "all";

let cart = JSON.parse(
    localStorage.getItem("skyPlasticsCart")
) || {};


/* =========================================
   DISPLAY PRODUCTS
========================================= */

function displayProducts(list = products) {

    const container =
        document.getElementById("product-container");

    container.innerHTML = "";


    list.forEach(product => {

        const card =
            document.createElement("div");

        card.className = "product-card";


        card.innerHTML = `

            ${
                product.badge
                ?
                `<span class="badge">
                    ${product.badge}
                </span>`
                :
                ""
            }


            <div class="product-image">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                >

            </div>


            <div class="product-info">

                <div class="product-type">
                    ${product.type}
                </div>


                <h3>
                    ${product.name}
                </h3>


                <div class="product-details">

                    <span class="product-size">
                        ${product.size}
                    </span>

                    <span class="product-price">
                        ₹${product.price.toFixed(2)}
                    </span>

                </div>


                <button
                    class="add-cart"
                    onclick="addToCart(${product.id})">

                    Add to Cart

                </button>

            </div>

        `;


        container.appendChild(card);

    });

}


/* =========================================
   FILTER PRODUCTS
========================================= */

document.querySelectorAll(".filter")
.forEach(button => {

    button.addEventListener(
        "click",
        function() {

            document
                .querySelectorAll(".filter")
                .forEach(btn => {

                    btn.classList.remove(
                        "active"
                    );

                });


            this.classList.add("active");


            currentCategory =
                this.dataset.category;


            filterProducts();

        }
    );

});


function filterProducts() {

    let filteredProducts;


    if (currentCategory === "all") {

        filteredProducts =
            [...products];

    }

    else {

        filteredProducts =
            products.filter(product =>
                product.category ===
                currentCategory
            );

    }


    applySorting(filteredProducts);

}


/* =========================================
   SORT PRODUCTS
========================================= */

document
    .getElementById("sort")
    .addEventListener(
        "change",
        filterProducts
    );


function applySorting(list) {

    const sortValue =
        document.getElementById("sort").value;


    if (sortValue === "low") {

        list.sort(
            (a, b) =>
                a.price - b.price
        );

    }


    if (sortValue === "high") {

        list.sort(
            (a, b) =>
                b.price - a.price
        );

    }


    displayProducts(list);

}


/* =========================================
   ADD TO CART
========================================= */

function addToCart(id, quantity = 1) {

    quantity = Number(quantity);

    if (!Number.isInteger(quantity) || quantity < 1) {
        quantity = 1;
    }

    if (cart[id]) {
        cart[id] += quantity;
    } else {
        cart[id] = quantity;
    }

    saveCart();
    updateCart();
    openCart();
}


/* =========================================
   SAVE CART
========================================= */

function saveCart() {

    localStorage.setItem(
        "skyPlasticsCart",
        JSON.stringify(cart)
    );

}


/* =========================================
   CART TOTAL QUANTITY
========================================= */

function getTotalItems() {

    return Object.values(cart)
        .reduce(
            (total, quantity) =>
                total + quantity,
            0
        );

}


/* =========================================
   CART SUBTOTAL
========================================= */

function getSubtotal() {

    let total = 0;


    Object.keys(cart)
    .forEach(id => {

        const product =
            products.find(
                item =>
                    item.id ==
                    id
            );


        if (product) {

            total +=
                product.price *
                cart[id];

        }

    });


    return total;

}


/* =========================================
   UPDATE CART
========================================= */

function updateCart() {

    const cartItems =
        document.getElementById(
            "cart-items"
        );

    const emptyCart =
        document.getElementById(
            "empty-cart"
        );

    const cartFooter =
        document.getElementById(
            "cart-footer"
        );


    const totalItems =
        getTotalItems();


    document.getElementById(
        "cart-count"
    ).textContent =
        totalItems;


    document.getElementById(
        "total-items"
    ).textContent =
        totalItems;


    document.getElementById(
        "subtotal"
    ).textContent =
        `₹${getSubtotal().toFixed(2)}`;


    cartItems.innerHTML = "";


    if (totalItems === 0) {

        emptyCart.style.display =
            "block";

        cartFooter.style.display =
            "none";

        return;

    }


    emptyCart.style.display =
        "none";

    cartFooter.style.display =
        "block";


    Object.keys(cart)
    .forEach(id => {

        const product =
            products.find(
                item =>
                    item.id ==
                    id
            );


        if (!product) return;


        const quantity =
            cart[id];


        const item =
            document.createElement(
                "div"
            );


        item.className =
            "cart-item";


        item.innerHTML = `

            <img
                src="${product.image}"
                alt="${product.name}"
            >


            <div>

                <h4>
                    ${product.name}
                </h4>

                <small>
                    ${product.size}
                </small>


                <div class="quantity">

    <button
        type="button"
        onclick="changeQuantity(${product.id}, -1)">
        −
    </button>

    <input
        type="number"
        min="1"
        value="${quantity}"
        onchange="setCartQuantity(${product.id}, this.value)"
        onkeydown="
            if(event.key === 'Enter') {
                this.blur();
            }
        "
    >

    <button
        type="button"
        onclick="changeQuantity(${product.id}, 1)">
        +
    </button>

</div>


                <button
                    class="remove"
                    onclick="
                    removeFromCart(
                        ${product.id}
                    )">

                    Remove

                </button>

            </div>


            <div class="item-price">

                ₹${(
                    product.price *
                    quantity
                ).toFixed(2)}

            </div>

        `;


        cartItems.appendChild(item);

    });

}


/* =========================================
   CHANGE QUANTITY
========================================= */

function setCartQuantity(id, value) {

    let quantity = Number(value);

    if (!Number.isInteger(quantity) || quantity < 1) {

        delete cart[id];

    } else {

        cart[id] = quantity;

    }

    saveCart();
    updateCart();
}

/* =========================================
   CHANGE QUANTITY VIA BUTTONS (+ / -)
========================================= */

function changeQuantity(id, amount) {
    let currentQty = cart[id] || 0;
    let newQty = currentQty + amount;

    if (newQty <= 0) {
        delete cart[id];
    } else {
        cart[id] = newQty;
    }

    saveCart();
    updateCart();
}
/* =========================================
   REMOVE PRODUCT
========================================= */

function removeFromCart(id) {

    delete cart[id];

    saveCart();

    updateCart();

}


/* =========================================
   CLEAR CART
========================================= */

function clearCart() {

    cart = {};

    saveCart();

    updateCart();

}


/* =========================================
   OPEN CART
========================================= */

function openCart() {

    document
        .getElementById("cart")
        .classList.add("open");


    document
        .getElementById("cart-overlay")
        .classList.add("show");

}


/* =========================================
   CLOSE CART
========================================= */

function closeCart() {

    document
        .getElementById("cart")
        .classList.remove("open");


    document
        .getElementById("cart-overlay")
        .classList.remove("show");

}


/* =========================================
   BUY NOW
========================================= */

function buyNow() {

    if (getTotalItems() === 0) {

        alert(
            "Your cart is empty."
        );

        return;

    }


    const summary =
        document.getElementById(
            "order-summary"
        );


    summary.innerHTML = "";


    Object.keys(cart)
    .forEach(id => {

        const product =
            products.find(
                item =>
                    item.id ==
                    id
            );


        const quantity =
            cart[id];


        const row =
            document.createElement(
                "div"
            );


        row.className =
            "summary-row";


        row.innerHTML = `

            <span>
                ${product.name}
                × ${quantity}
            </span>

            <strong>
                ₹${(
                    product.price *
                    quantity
                ).toFixed(2)}
            </strong>

        `;


        summary.appendChild(row);

    });


    const total =
        document.createElement(
            "div"
        );


    total.className =
        "summary-row";


    total.style.borderTop =
        "1px solid #ddd";


    total.style.marginTop =
        "8px";


    total.style.paddingTop =
        "10px";


    total.innerHTML = `

        <strong>
            Total
        </strong>

        <strong>
            ₹${getSubtotal().toFixed(2)}
        </strong>

    `;


    summary.appendChild(total);


    document
        .getElementById(
            "order-modal"
        )
        .classList.add("show");


    closeCart();

}


/* =========================================
   CLOSE ORDER MODAL
========================================= */

function closeOrder() {

    document
        .getElementById(
            "order-modal"
        )
        .classList.remove("show");

}


/* =========================================
   ORDER FORM
========================================= */

document
    .getElementById("order-form")
    .addEventListener("submit", async function(event) {

        event.preventDefault();


        // Get customer details
        const name =
            document
                .getElementById("customer-name")
                .value
                .trim();


        const phone =
            document
                .getElementById("customer-phone")
                .value
                .trim();


        const address =
            document
                .getElementById("customer-address")
                .value
                .trim();


        // Check details
        if (!name || !phone || !address) {

            alert(
                "Please enter your name, phone number and delivery address."
            );

            return;
        }


        // Convert cart into order items
        const items =
            Object.keys(cart).map(id => {

                return {
                    product_id: Number(id),
                    quantity: Number(cart[id])
                };

            });


        // Make sure cart is not empty
        if (items.length === 0) {

            alert("Your cart is empty.");

            return;
        }


        // Send order to Node.js backend
        try {

            const response =
                await fetch("/api/orders", {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        name: name,

                        phone: phone,

                        address: address,

                        items: items

                    })

                });


            const result =
                await response.json();


            // If backend gives an error
            if (!response.ok) {

                alert(
                    "❌ Order failed\n\n" +
                    result.error
                );

                return;
            }


            // Order successful
            alert(

                "🎉 ORDER PLACED SUCCESSFULLY!\n\n" +

                "Order ID: " +
                result.order_id +

                "\n\nTotal Amount: ₹" +
                Number(result.total_amount).toFixed(2) +

                "\n\nStatus: " +
                result.status

            );


            // Clear cart
            cart = {};

            saveCart();

            updateCart();

            closeOrder();

        }


        catch (error) {

            console.error(
                "Order error:",
                error
            );


            alert(
                "❌ Could not connect to the backend.\n\n" +
                "Make sure Node.js server is running."
            );

        }

    });


/* =========================================
   INITIAL LOAD
========================================= */

displayProducts();

updateCart();