"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
document.addEventListener("DOMContentLoaded", function () {
    const booksContainer = document.getElementById("books-container");
    const genreFilter = document.getElementById("genre-filter");
    const yearFilter = document.getElementById("year-filter");
    const sortBy = document.getElementById("sort-by");
    const applyFiltersBtn = document.getElementById("apply-filters");
    const searchInput = document.querySelector(".search-bar input");
    const loadingContainer = document.getElementById("loading-container");
    const cartCountElement = document.querySelector(".cart-count");
    const cartItemsContainer = document.querySelector(".cart-items");
    const cartEmptyMessage = document.querySelector(".cart-empty-message");
    const cartTotalItems = document.querySelector(".cart-total span:last-child");
    const cartTotalPrice = document.createElement("div");
    cartTotalPrice.className = "cart-total";
    cartTotalPrice.innerHTML = "<span>Total Price:</span><span>$0.00</span>";
    const checkoutBtn = document.querySelector(".checkout-btn");
    const cartFooter = document.querySelector(".cart-footer");
    if (cartFooter) {
        cartFooter.insertBefore(cartTotalPrice, checkoutBtn);
    }
    let cartItems = [];
    function fetchBooks() {
        return __awaiter(this, arguments, void 0, function* (params = {}) {
            try {
                if (loadingContainer) {
                    loadingContainer.style.display = "flex";
                }
                const queryParams = new URLSearchParams(params).toString();
                const url = `http://localhost:5000/api/books${queryParams ? `?${queryParams}` : ''}`;
                const response = yield fetch(url);
                const data = yield response.json();
                if (loadingContainer) {
                    loadingContainer.style.display = "none";
                }
                return data;
            }
            catch (error) {
                console.error("Error fetching books:", error);
                if (loadingContainer) {
                    loadingContainer.style.display = "none";
                }
                return { books: [], stats: {} };
            }
        });
    }
    function filterAndSortBooks() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const genre = genreFilter ? genreFilter.value : '';
        const yearRange = yearFilter ? yearFilter.value : '';
        const sortOption = sortBy ? sortBy.value : '';
        const params = {};
        if (searchTerm)
            params['search'] = searchTerm;
        if (genre)
            params['genre'] = genre;
        if (yearRange)
            params['yearRange'] = yearRange;
        if (sortOption)
            params['sortBy'] = sortOption;
        fetchBooks(params).then(({ books, stats }) => {
            displayBooks(books);
            updateStats(stats);
        });
    }
    fetchBooks().then(({ books, stats }) => {
        displayBooks(books);
        updateStats(stats);
    });
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener("click", filterAndSortBooks);
    }
    if (searchInput) {
        searchInput.addEventListener("keyup", function (event) {
            if (event.key === "Enter") {
                filterAndSortBooks();
            }
        });
    }
    function displayBooks(books) {
        if (booksContainer)
            booksContainer.innerHTML = "";
        if (books.length === 0) {
            const noResults = document.createElement('div');
            noResults.className = 'no-results';
            noResults.textContent = 'No books match your filters. Try adjusting your search criteria.';
            if (booksContainer)
                booksContainer.appendChild(noResults);
            return;
        }
        books.forEach((result) => {
            const bookCard = document.createElement("div");
            bookCard.className = "book-card";
            const bookImage = document.createElement("div");
            bookImage.className = "book-image";
            const image = document.createElement("img");
            image.className = "image";
            image.src = result.image;
            image.alt = result.title;
            const bookCategory = document.createElement("div");
            bookCategory.className = "book-category";
            bookCategory.textContent = result.genre;
            bookImage.appendChild(image);
            bookImage.appendChild(bookCategory);
            const bookInfo = document.createElement("div");
            bookInfo.className = "book-info";
            const bookTitle = document.createElement("h3");
            bookTitle.className = "book-title";
            bookTitle.textContent = result.title;
            const bookAuthor = document.createElement("p");
            bookAuthor.className = "book-author";
            bookAuthor.textContent = result.author;
            const bookMeta = document.createElement("div");
            bookMeta.className = "book-meta";
            const year = document.createElement("span");
            year.id = "year";
            year.textContent = result.year;
            const pages = document.createElement("span");
            pages.id = "pages";
            pages.textContent = `${result.pages} pages`;
            const price = document.createElement("span");
            price.id = "price";
            price.textContent = `$${result.price.toFixed(2)}`;
            price.style.color = "var(--primary)";
            price.style.fontWeight = "bold";
            bookMeta.appendChild(year);
            bookMeta.appendChild(pages);
            bookMeta.appendChild(price);
            const description = document.createElement("p");
            description.className = "book-description";
            description.textContent = result.description;
            const bookPublisher = document.createElement("p");
            bookPublisher.className = "book-publisher";
            bookPublisher.textContent = result.publisher;
            const bookId = document.createElement("p");
            bookId.className = 'id-book';
            bookId.textContent = result.id;
            bookId.style.display = 'none';
            const buyBook = document.createElement("button");
            buyBook.className = "buy-book";
            buyBook.textContent = `Buy Now • $${result.price.toFixed(2)}`;
            buyBook.addEventListener('click', function (e) {
                e.stopPropagation();
                const target = e.target;
                let bookId = null;
                if (target && target.parentNode) {
                    const idElement = target.parentNode.querySelector('.id-book');
                    bookId = idElement ? idElement.textContent : null;
                }
                if (bookId) {
                    addToCart(bookId, books);
                }
            });
            bookInfo.appendChild(bookTitle);
            bookInfo.appendChild(bookAuthor);
            bookInfo.appendChild(bookMeta);
            bookInfo.appendChild(description);
            bookInfo.appendChild(bookPublisher);
            bookInfo.appendChild(bookId);
            bookInfo.appendChild(buyBook);
            bookCard.appendChild(bookImage);
            bookCard.appendChild(bookInfo);
            bookCard.addEventListener('click', () => {
                showBookModal(result);
            });
            if (booksContainer)
                booksContainer.appendChild(bookCard);
        });
    }
    function updateStats(stats) {
        const totalBooksElement = document.getElementById("total-books");
        if (totalBooksElement) {
            totalBooksElement.textContent = stats.totalBooks.toString();
        }
        const avgPagesElement = document.getElementById("avg-pages");
        if (avgPagesElement) {
            avgPagesElement.textContent = stats.avgPages.toString();
        }
        const oldestBookElement = document.getElementById("oldest-book");
        if (oldestBookElement && stats.oldestBook !== null) {
            oldestBookElement.textContent =
                stats.oldestBook < 0 ? `${Math.abs(stats.oldestBook)} BCE` : stats.oldestBook.toString();
        }
        const genresCountElement = document.getElementById("genres-count");
        if (genresCountElement) {
            genresCountElement.textContent = stats.uniqueGenres.toString();
        }
    }
    function addToCart(bookId, booksArray) {
        const bookToAdd = booksArray.find((book) => book.id === bookId);
        if (!bookToAdd)
            return;
        const existingItemIndex = cartItems.findIndex(item => item.id === bookId);
        if (existingItemIndex !== -1) {
            cartItems[existingItemIndex].quantity += 1;
        }
        else {
            cartItems.push(Object.assign(Object.assign({}, bookToAdd), { quantity: 1 }));
        }
        updateCartUI();
        showNotification(`Added "${bookToAdd.title}" to cart`);
    }
    function updateCartUI() {
        if (!cartCountElement || !cartTotalItems || !cartTotalPrice)
            return;
        const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
        if (cartCountElement) {
            cartCountElement.textContent = totalItems.toString();
        }
        if (cartTotalItems) {
            cartTotalItems.textContent = `${totalItems} ${totalItems === 1 ? 'book' : 'books'}`;
        }
        const totalPrice = cartItems.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
        const priceElement = cartTotalPrice.querySelector('span:last-child');
        if (priceElement) {
            priceElement.textContent = `$${totalPrice.toFixed(2)}`;
        }
        renderCartItems();
    }
    function renderCartItems() {
        if (!cartItemsContainer || !cartEmptyMessage || !checkoutBtn)
            return;
        const itemElements = cartItemsContainer.querySelectorAll('.cart-item');
        itemElements.forEach(item => item.remove());
        if (cartItems.length === 0) {
            cartEmptyMessage.style.display = 'block';
            checkoutBtn.disabled = true;
            return;
        }
        else {
            cartEmptyMessage.style.display = 'none';
            checkoutBtn.disabled = false;
        }
        cartItems.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
        <div class="cart-item-image">
          <img src="${item.image}" alt="${item.title}">
        </div>
        <div class="cart-item-details">
          <h3 class="cart-item-title">${item.title}</h3>
          <p class="cart-item-author">${item.author}</p>
          <p class="cart-item-price">$${item.price.toFixed(2)} each</p>
          <div class="cart-item-controls">
            <div class="quantity-controls">
              <button class="quantity-btn decrease-quantity" data-id="${item.id}">
                <i class="fa fa-minus" aria-hidden="true"></i>
              </button>
              <span class="quantity">${item.quantity}</span>
              <button class="quantity-btn btn2 increase-quantity" data-id="${item.id}">
                <i class="fa fa-plus" aria-hidden="true"></i>
              </button>
            </div>
            <span class="item-total">$${(item.price * item.quantity).toFixed(2)}</span>
            <button class="remove-item" data-id="${item.id}">
              <i class="fa fa-trash" aria-hidden="true"></i>
              Remove
            </button>
          </div>
        </div>
      `;
            cartItemsContainer.appendChild(cartItem);
        });
        addCartItemEventListeners();
    }
    function addCartItemEventListeners() {
        const increaseButtons = document.querySelectorAll('.increase-quantity');
        increaseButtons.forEach(button => {
            button.addEventListener('click', function () {
                const id = this.getAttribute('data-id');
                if (id) {
                    incrementCartItem(id);
                }
            });
        });
        const decreaseButtons = document.querySelectorAll('.decrease-quantity');
        decreaseButtons.forEach(button => {
            button.addEventListener('click', function () {
                const id = this.getAttribute('data-id');
                if (id) {
                    decrementCartItem(id);
                }
            });
        });
        const removeButtons = document.querySelectorAll('.remove-item');
        removeButtons.forEach(button => {
            button.addEventListener('click', function () {
                const id = this.getAttribute('data-id');
                if (id) {
                    removeCartItem(id);
                }
            });
        });
    }
    function incrementCartItem(id) {
        const itemIndex = cartItems.findIndex(item => item.id === id);
        if (itemIndex !== -1) {
            cartItems[itemIndex].quantity += 1;
            updateCartUI();
        }
    }
    function decrementCartItem(id) {
        const itemIndex = cartItems.findIndex(item => item.id === id);
        if (itemIndex !== -1) {
            if (cartItems[itemIndex].quantity > 1) {
                cartItems[itemIndex].quantity -= 1;
            }
            else {
                removeCartItem(id);
                return;
            }
            updateCartUI();
        }
    }
    function removeCartItem(id) {
        cartItems = cartItems.filter(item => item.id !== id);
        updateCartUI();
        showNotification("Item removed from cart");
    }
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background-color: var(--primary);
      color: white;
      padding: 10px 15px;
      border-radius: 4px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      z-index: 1000;
      opacity: 0;
      transform: translateY(10px);
      transition: opacity 0.3s, transform 0.3s;
    `;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 10);
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(10px)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        });
    }
    function showBookModal(result) {
        const modal = document.createElement('div');
        modal.className = 'book-modal';
        modal.innerHTML = `
      <div class="modal-content">
        <span class="close-button">&times;</span>
        <h2>${result.title}</h2>
        <p><strong>Author:</strong> ${result.author}</p>
        <p><strong>Genre:</strong> ${result.genre}</p>
        <p><strong>Year:</strong> ${result.year}</p>
        <p><strong>Pages:</strong> ${result.pages}</p>
        <p><strong>Price:</strong> $${result.price.toFixed(2)}</p>
        <p><strong>Description:</strong> ${result.description}</p>
        <p><strong>Publisher:</strong> ${result.publisher}</p>
        <img src="${result.image}" alt="${result.title}">
      </div>
    `;
        document.body.appendChild(modal);
        const closeButton = modal.querySelector('.close-button');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                document.body.removeChild(modal);
            });
        }
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }
    const cartButton = document.getElementById('cart-button');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartModal = document.querySelector('.cart-modal');
    const closeCart = document.getElementById('close-cart');
    if (cartButton && cartOverlay && closeCart && cartModal) {
        cartButton.addEventListener('click', () => {
            cartOverlay.classList.add('active');
            cartModal.classList.add('active');
        });
        const closeCartModal = () => {
            cartOverlay.classList.remove('active');
            cartModal.classList.remove('active');
        };
        closeCart.addEventListener('click', closeCartModal);
        cartOverlay.addEventListener('click', (e) => {
            if (e.target === cartOverlay) {
                closeCartModal();
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && cartOverlay.classList.contains('active')) {
                closeCartModal();
            }
        });
    }
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function () {
            if (cartItems.length > 0) {
                const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
                alert(`Proceeding to checkout!\nTotal: $${totalPrice.toFixed(2)}\nNumber of books: ${cartItems.reduce((count, item) => count + item.quantity, 0)}`);
            }
        });
    }
    updateCartUI();
});