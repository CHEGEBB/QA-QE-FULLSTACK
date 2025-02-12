document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
});

async function fetchProducts() {
    try {
        const response = await fetch('http://localhost:3000/products');
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

function displayProducts(products) {
    const container = document.getElementById('products-container');
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        productCard.innerHTML = `
            <h2>${product.name}</h2>
            <p><strong>Description:</strong> ${product.description}</p>
            <p><strong>Price:</strong> $${product.price}</p>
            <p><strong>Category:</strong> ${product.category}</p>
            <p><strong>Stock:</strong> ${product.stock} units</p>
        `;
        
        container.appendChild(productCard);
    });
}