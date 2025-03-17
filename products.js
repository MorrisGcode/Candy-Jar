// Filter products
function applyFilters() {
    const nameFilter = document.getElementById('nameSearch').value.toLowerCase();
    const minPrice = Number(document.getElementById('minPrice').value) || 0;
    const maxPrice = Number(document.getElementById('maxPrice').value) || Infinity;

    // Get all products
    const products = [product_1, product_2, product_3, product_4, product_5, 
                     product_6, product_7, product_8, product_9];

    // Filter products
    const filteredProducts = products.filter(product => {
        const matchesName = product.name.toLowerCase().includes(nameFilter);
        const matchesPrice = product.price >= minPrice && 
                           (maxPrice === Infinity || product.price <= maxPrice);
        return matchesName && matchesPrice;
    });

    // Display filtered products
    displayFilteredProducts(filteredProducts);
}

function displayFilteredProducts(products) {
    const container = document.getElementById('productContainer');
    container.innerHTML = '';

    if (products.length === 0) {
        container.innerHTML = '<div class="col-12"><p class="text-center">No products found matching your criteria</p></div>';
        return;
    }

    products.forEach(product => {
        container.appendChild(product.displayCard());
    });
}

function resetFilters() {
    document.getElementById('nameSearch').value = '';
    document.getElementById('minPrice').value = '';
    document.getElementById('maxPrice').value = '';
    updateDisplay(); // Use your existing display function
}

let cart = JSON.parse(localStorage.getItem('cart')) || [];

class Product {
    constructor(name, price, image, stock) {
        this.name = name
        this.price = price
        this.image = image
        this.stock = stock 
    }

    buy(quantity){
        if(quantity > this.stock){
            console.log("Insufficient stock")
            alert("No available stock")
        }else{
            this.stock -= quantity
            console.log(`You have bought ${quantity} ${this.name}, your new stock is ${this.stock}`)
        }
    }

    displayCard() {
        let card = document.createElement('div');
        card.className = 'col-md-3'; 
        card.innerHTML = `
            <div class="product-card">
                <img src="${this.image}" class="product-image" alt="${this.name}">
                <h3>${this.name}</h3>
                <p class="text-success fw-bold">Price: Ksh${this.price}</p>
                <p class="text-secondary">Stock: ${this.stock}</p>
                <button onclick="buyProduct('${this.name}')" class="btn btn-primary">Buy Now</button>
            </div>
        `;
        return card;
    }
}

// products
let product_1 = new Product("kitKat", 100, "images/kitkat.webp", 20)
let product_2 = new Product("Street Tub 220g", 50, "images/streettub.webp", 10)
let product_3 = new Product("Street Tub 600g", 150, "images/streettubbig.webp", 15)
let product_4 = new Product("maltesers", 150, "images/maltesers.jpg", 5)
let product_5 = new Product("Welch mixed", 100, "images/welch.webp", 25)
let product_6 = new Product("Weathers butter", 100, "images/Weathers.jpg", 30)
let product_7 = new Product("twix", 150, "images/twix.webp", 35)
let product_8 = new Product("TicTac", 120, "images/tictac.webp", 40)
let product_9 = new Product("toblerone", 180, "images/toblerone.jpg", 45)

// Display products
window.onload = function() {
    updateDisplay();
    displayCart();
    updateCartCount();
    
    // Add event listener for real-time name search
    document.getElementById('nameSearch').addEventListener('input', applyFilters);
};

//  buying
function buyProduct(productName) {
    // product by name
    let product;
    switch(productName.toLowerCase()) {
        case "kitkat":
            product = product_1;
            break;
        case "street tub 220g":
            product = product_2;
            break;
        case "street tub 600g":
            product = product_3;
            break;
        case "maltesers":
            product = product_4;
            break;
        case "welch mixed":
            product = product_5;
            break;
        case "weathers butter":
            product = product_6;
            break;
        case "twix":
            product = product_7;
            break;
        case "tictac":
            product = product_8;
            break;
        case "toblerone":
            product = product_9;
            break;
        default:
            console.error("Product not found:", productName);
            return;
    }

    // Add to cart 
    if (product.stock > 0) {
        // Check if item already exists in cart
        const existingItemIndex = cart.findIndex(item => item.name === product.name);
        
        if (existingItemIndex !== -1) {
            cart[existingItemIndex].quantity++;
        } else {
            cart.push({
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }
        
        product.stock--;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateDisplay();
        updateCartCount();
        alert('Added to cart!');
    } else {
        alert('Sorry, this item is out of stock!');
    }
}

// display updates
function updateDisplay() {
    let container = document.getElementById('productContainer');
    container.innerHTML = '';
    container.appendChild(product_1.displayCard());
    container.appendChild(product_2.displayCard());
    container.appendChild(product_3.displayCard());
    container.appendChild(product_4.displayCard());
    container.appendChild(product_5.displayCard());
    container.appendChild(product_6.displayCard());
    container.appendChild(product_7.displayCard());
    container.appendChild(product_8.displayCard());
    container.appendChild(product_9.displayCard());
}

// Add this function to update cart count
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        cartCount.textContent = cart.length;
    }
}

// Modify the displayCart function
function displayCart() {
    const cartContainer = document.getElementById('cartItems');
    if (!cartContainer) return;
    
    // Clear existing items
    cartContainer.innerHTML = '';
    
    // Get cart from localStorage
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    let total = 0;

    if (cart.length === 0) {
        cartContainer.innerHTML = '<div class="col-12"><p>Your cart is empty</p></div>';
        return;
    }

    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        const cartItem = document.createElement('div');
        cartItem.className = 'col-12 mb-3';
        cartItem.innerHTML = `
            <div class="card">
                <div class="card-body d-flex justify-content-between align-items-center">
                    <img src="${item.image}" style="width: 100px; height: 100px; object-fit: cover;">
                    <h5 class="card-title">${item.name}</h5>
                    <p class="card-text">Ksh${item.price}</p>
                    <div class="quantity-controls">
                        <button onclick="updateQuantity(${index}, -1)" class="btn btn-sm btn-secondary">-</button>
                        <span class="mx-2">${item.quantity}</span>
                        <button onclick="updateQuantity(${index}, 1)" class="btn btn-sm btn-secondary">+</button>
                    </div>
                    <button onclick="removeFromCart(${index})" class="btn btn-danger">Remove</button>
                </div>
            </div>
        `;
        cartContainer.appendChild(cartItem);
    });

    const totalElement = document.getElementById('cartTotal');
    if (totalElement) {
        totalElement.textContent = total.toFixed(2);
    }
    
    updateCartCount();
}

// Add function to update quantity
function updateQuantity(index, change) {
    if (cart[index].quantity + change > 0) {
        cart[index].quantity += change;
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCart();
    }
}
// show price per product
// function showPrice() {
//     let price = document.getElementById('price').value;
//     let quantity = document.getElementById('quantity').value;
//     let total = price * quantity;
//     document.getElementById('total').innerHTML = total;



function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
    updateCartCount();
}

function checkout() {
    alert('Thank you for your purchase!');
    cart = [];
    localStorage.removeItem('cart');
    displayCart();
    updateCartCount();
}