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
    const addBookBtn = document.getElementById("add-book-btn");
    const addModalOverlay = document.getElementById("add-modal-overlay");
    const closeAddModal = document.getElementById("close-add-modal");
    const addBookForm = document.getElementById("add-book-form");
    const editModalOverlay = document.getElementById("edit-modal-overlay");
    const closeEditModal = document.getElementById("close-edit-modal");
    const editBookForm = document.getElementById("edit-book-form");
    const deleteModalOverlay = document.getElementById("delete-modal-overlay");
    const cancelDeleteBtn = document.getElementById("cancel-delete");
    const confirmDeleteBtn = document.getElementById("confirm-delete");
    let currentBookIdToDelete = null;
    if (cartFooter) {
        cartFooter.insertBefore(cartTotalPrice, checkoutBtn);
    }
    // Role constants
    const ROLE_TYPES = {
        ADMIN: 1,
        LIBRARIAN: 2,
        BORROWER: 3
    };
    let cartItems = [];
    let allBooks = [];
    let currentUser = null;
    // Check for logged in user and set user info
    function checkUserAuthentication() {
        const token = localStorage.getItem('token');
        if (!token) {
            // Redirect to login page if not logged in
            window.location.href = '/index.html';
            return false;
        }
        const userString = localStorage.getItem('user');
        if (userString) {
            try {
                currentUser = JSON.parse(userString);
                console.log("Current user role:", currentUser.role_id);
                setupUIBasedOnRole(currentUser.role_id);
                return true;
            }
            catch (e) {
                console.error("Error parsing user data:", e);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                window.location.href = '/index.html';
                return false;
            }
        }
        else {
            // User info not found, clear token and redirect
            localStorage.removeItem('token');
            window.location.href = '/index.html';
            return false;
        }
    }
    // Set up UI based on user role
    function setupUIBasedOnRole(roleId) {
        // Hide all CRUD buttons by default
        if (addBookBtn) {
            addBookBtn.style.display = 'none';
        }
        // Show/hide elements based on role
        switch (roleId) {
            case ROLE_TYPES.ADMIN:
                // Admins can do everything
                if (addBookBtn) {
                    addBookBtn.style.display = 'block';
                }
                break;
            case ROLE_TYPES.LIBRARIAN:
                // Librarians can see but not delete
                if (addBookBtn) {
                    addBookBtn.style.display = 'block';
                }
                break;
            case ROLE_TYPES.BORROWER:
                // Borrowers can only view books
                break;
            default:
                // Unknown role, redirect to login
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/index.html';
        }
    }
    // Function to fetch books from the server
    function fetchBooks() {
        return __awaiter(this, arguments, void 0, function* (params = {}) {
            try {
                if (loadingContainer) {
                    loadingContainer.style.display = "flex";
                }
                const queryParams = new URLSearchParams(params).toString();
                const url = `http://localhost:5000/api/books${queryParams ? `?${queryParams}` : ''}`;
                // Get token from localStorage
                const token = localStorage.getItem('token');
                const headers = {
                    'Content-Type': 'application/json'
                };
                // Add authorization header if token exists
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }
                const response = yield fetch(url, {
                    headers
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const books = yield response.json();
                console.log("Fetched books:", books);
                allBooks = books;
                if (loadingContainer) {
                    loadingContainer.style.display = "none";
                }
                const stats = {
                    totalBooks: books.length,
                    avgPages: books.length
                        ? Math.round(books.reduce((sum, book) => sum + parseInt(book.pages), 0) / books.length)
                        : 0,
                    oldestBook: books.length
                        ? Math.min(...books.map((book) => parseInt(book.year)))
                        : null,
                    uniqueGenres: new Set(books.map((book) => book.genre)).size
                };
                return { books, stats };
            }
            catch (error) {
                console.error("Error fetching books:", error);
                if (loadingContainer) {
                    loadingContainer.style.display = "none";
                }
                return { books: [], stats: { totalBooks: 0, avgPages: 0, oldestBook: null, uniqueGenres: 0 } };
            }
        });
    }
    // Function to filter and sort books
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
    // Function to display books in the UI
    function displayBooks(books) {
        if (!booksContainer)
            return;
        booksContainer.innerHTML = "";
        if (books.length === 0) {
            const noResults = document.createElement('div');
            noResults.className = 'no-results';
            noResults.textContent = 'No books match your filters. Try adjusting your search criteria.';
            booksContainer.appendChild(noResults);
            return;
        }
        books.forEach((book) => {
            const bookCard = document.createElement("div");
            bookCard.className = "book-card";
            const bookImage = document.createElement("div");
            bookImage.className = "book-image";
            const image = document.createElement("img");
            image.className = "image";
            image.src = book.image;
            image.alt = book.title;
            const bookCategory = document.createElement("div");
            bookCategory.className = "book-category";
            bookCategory.textContent = book.genre;
            const bookOverlay = document.createElement("div");
            bookOverlay.className = "book-overlay";
            const bookActions = document.createElement("div");
            bookActions.className = "book-actions";
            // Only add edit and delete buttons based on role
            if (currentUser) {
                // Admins get full access
                if (currentUser.role_id === ROLE_TYPES.ADMIN) {
                    // Add edit button
                    const editBtn = document.createElement("button");
                    editBtn.className = "action-btn edit-btn";
                    editBtn.setAttribute("data-id", book.id);
                    editBtn.innerHTML = '<i class="fa fa-pencil" aria-hidden="true"></i>';
                    editBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        openEditModal(book);
                    });
                    // Add delete button
                    const deleteBtn = document.createElement("button");
                    deleteBtn.className = "action-btn delete-btn";
                    deleteBtn.setAttribute("data-id", book.id);
                    deleteBtn.innerHTML = '<i class="fa fa-trash" aria-hidden="true"></i>';
                    deleteBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        openDeleteModal(book.id);
                    });
                    bookActions.appendChild(editBtn);
                    bookActions.appendChild(deleteBtn);
                }
                // Librarians can edit but not delete
                else if (currentUser.role_id === ROLE_TYPES.LIBRARIAN) {
                    // Add edit button only
                    const editBtn = document.createElement("button");
                    editBtn.className = "action-btn edit-btn";
                    editBtn.setAttribute("data-id", book.id);
                    editBtn.innerHTML = '<i class="fa fa-pencil" aria-hidden="true"></i>';
                    editBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        openEditModal(book);
                    });
                    bookActions.appendChild(editBtn);
                }
                // Borrowers don't get CRUD buttons
            }
            bookOverlay.appendChild(bookActions);
            bookImage.appendChild(image);
            bookImage.appendChild(bookCategory);
            bookImage.appendChild(bookOverlay);
            const bookInfo = document.createElement("div");
            bookInfo.className = "book-info";
            const bookTitle = document.createElement("h3");
            bookTitle.className = "book-title";
            bookTitle.textContent = book.title;
            const bookAuthor = document.createElement("p");
            bookAuthor.className = "book-author";
            bookAuthor.textContent = book.author;
            const bookMeta = document.createElement("div");
            bookMeta.className = "book-meta";
            const year = document.createElement("span");
            year.id = "year";
            year.textContent = book.year;
            const pages = document.createElement("span");
            pages.id = "pages";
            pages.textContent = `${book.pages} pages`;
            const price = document.createElement("span");
            price.id = "price";
            price.textContent = `$${Number(book.price).toFixed(2)}`;
            price.style.color = "var(--primary)";
            price.style.fontWeight = "bold";
            bookMeta.appendChild(year);
            bookMeta.appendChild(pages);
            bookMeta.appendChild(price);
            const description = document.createElement("p");
            description.className = "book-description";
            description.textContent = book.description;
            const bookPublisher = document.createElement("p");
            bookPublisher.className = "book-publisher";
            bookPublisher.textContent = book.publisher;
            const bookId = document.createElement("p");
            bookId.className = 'id-book';
            bookId.textContent = book.id;
            bookId.style.display = 'none';
            const buyBook = document.createElement("button");
            buyBook.className = "buy-book";
            buyBook.textContent = `Buy Now • $${Number(book.price).toFixed(2)}`;
            buyBook.addEventListener('click', function (e) {
                e.stopPropagation();
                addToCart(book.id);
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
                showBookModal(book);
            });
            booksContainer.appendChild(bookCard);
        });
    }
    // Function to update statistics in the UI
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
    // Add book to shopping cart
    function addToCart(bookId) {
        const bookToAdd = allBooks.find(book => book.id === bookId);
        if (!bookToAdd) {
            console.error("Book not found:", bookId);
            return;
        }
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
    // Update cart UI elements
    function updateCartUI() {
        if (!cartCountElement || !cartTotalItems)
            return;
        const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
        cartCountElement.textContent = totalItems.toString();
        cartTotalItems.textContent = `${totalItems} ${totalItems === 1 ? 'book' : 'books'}`;
        const totalPrice = cartItems.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
        const priceElement = cartTotalPrice.querySelector('span:last-child');
        if (priceElement) {
            priceElement.textContent = `$${totalPrice.toFixed(2)}`;
        }
        renderCartItems();
    }
    // Render items in the cart
    function renderCartItems() {
        if (!cartItemsContainer || !cartEmptyMessage || !checkoutBtn)
            return;
        // Remove existing items
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
    // Add event listeners to cart items
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
    // Increment quantity of cart item
    function incrementCartItem(id) {
        const itemIndex = cartItems.findIndex(item => item.id === id);
        if (itemIndex !== -1) {
            cartItems[itemIndex].quantity += 1;
            updateCartUI();
        }
    }
    // Decrement quantity of cart item
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
    // Remove item from cart
    function removeCartItem(id) {
        cartItems = cartItems.filter(item => item.id !== id);
        updateCartUI();
        showNotification("Item removed from cart");
    }
    // Show notification
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
        }, 3000);
    }
    // Show book details modal
    function showBookModal(book) {
        const modal = document.createElement('div');
        modal.className = 'book-modal';
        modal.innerHTML = `
      <div class="modal-content">
        <span class="close-button">&times;</span>
        <div class="modal-book-details">
          <div class="modal-book-image">
            <img src="${book.image}" alt="${book.title}">
          </div>
          <div class="modal-book-info">
            <h2>${book.title}</h2>
            <p><strong>Author:</strong> ${book.author}</p>
            <p><strong>Genre:</strong> ${book.genre}</p>
            <p><strong>Year:</strong> ${book.year}</p>
            <p><strong>Pages:</strong> ${book.pages}</p>
            <p><strong>Price:</strong> $${Number(book.price).toFixed(2)}</p>
            <p><strong>Publisher:</strong> ${book.publisher}</p>
            <div class="modal-book-description">
              <h3>Description</h3>
              <p>${book.description}</p>
            </div>
            <button class="modal-buy-button" data-id="${book.id}">
              Add to Cart &bull; $${Number(book.price).toFixed(2)}
            </button>
          </div>
        </div>
      </div>
    `;
        document.body.appendChild(modal);
        const closeButton = modal.querySelector('.close-button');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                document.body.removeChild(modal);
            });
        }
        const buyButton = modal.querySelector('.modal-buy-button');
        if (buyButton) {
            buyButton.addEventListener('click', function () {
                const id = this.getAttribute('data-id');
                if (id) {
                    addToCart(id);
                }
            });
        }
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }
    // Cart modal functionality
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
    // Checkout button functionality
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function () {
            if (cartItems.length > 0) {
                const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
                alert(`Proceeding to checkout!\nTotal: $${totalPrice.toFixed(2)}\nNumber of books: ${cartItems.reduce((count, item) => count + item.quantity, 0)}`);
            }
        });
    }
    // CRUD Functionality
    // Add Book Modal
    if (addBookBtn && addModalOverlay) {
        addBookBtn.addEventListener('click', () => {
            if (!currentUser || (currentUser.role_id !== ROLE_TYPES.ADMIN && currentUser.role_id !== ROLE_TYPES.LIBRARIAN)) {
                showNotification("You don't have permission to add books");
                return;
            }
            openAddModal();
        });
    }
    function openAddModal() {
        if (addModalOverlay) {
            addModalOverlay.classList.add('active');
            // Reset the form
            if (addBookForm) {
                addBookForm.reset();
            }
        }
    }
    if (closeAddModal && addModalOverlay) {
        closeAddModal.addEventListener('click', () => {
            addModalOverlay.classList.remove('active');
        });
        addModalOverlay.addEventListener('click', (e) => {
            if (e.target === addModalOverlay) {
                addModalOverlay.classList.remove('active');
            }
        });
    }
    // Edit Book Modal
    function openEditModal(book) {
        // Check if user has permission to edit
        if (!currentUser || (currentUser.role_id !== ROLE_TYPES.ADMIN && currentUser.role_id !== ROLE_TYPES.LIBRARIAN)) {
            showNotification("You don't have permission to edit books");
            return;
        }
        if (editModalOverlay) {
            editModalOverlay.classList.add('active');
            const editBookId = document.getElementById('edit-book-id');
            const editTitle = document.getElementById('edit-title');
            const editAuthor = document.getElementById('edit-author');
            const editYear = document.getElementById('edit-year');
            const editPages = document.getElementById('edit-pages');
            const editGenre = document.getElementById('edit-genre');
            const editDescription = document.getElementById('edit-description');
            const editPublisher = document.getElementById('edit-publisher');
            const editImage = document.getElementById('edit-image');
            if (editBookId)
                editBookId.value = book.id;
            if (editTitle)
                editTitle.value = book.title;
            if (editAuthor)
                editAuthor.value = book.author;
            if (editYear)
                editYear.value = book.year;
            if (editPages)
                editPages.value = book.pages;
            if (editGenre)
                editGenre.value = book.genre;
            if (editDescription)
                editDescription.value = book.description;
            if (editPublisher)
                editPublisher.value = book.publisher;
            if (editImage)
                editImage.value = book.image;
        }
    }
    if (closeEditModal && editModalOverlay) {
        closeEditModal.addEventListener('click', () => {
            editModalOverlay.classList.remove('active');
        });
        editModalOverlay.addEventListener('click', (e) => {
            if (e.target === editModalOverlay) {
                editModalOverlay.classList.remove('active');
            }
        });
    }
    // Delete Confirmation Modal
    function openDeleteModal(bookId) {
        // Check if user has permission to delete
        if (!currentUser || currentUser.role_id !== ROLE_TYPES.ADMIN) {
            showNotification("Only administrators can delete books");
            return;
        }
        if (deleteModalOverlay) {
            deleteModalOverlay.classList.add('active');
            currentBookIdToDelete = bookId;
        }
    }
    if (cancelDeleteBtn && deleteModalOverlay) {
        cancelDeleteBtn.addEventListener('click', () => {
            deleteModalOverlay.classList.remove('active');
            currentBookIdToDelete = null;
        });
    }
    if (deleteModalOverlay) {
        deleteModalOverlay.addEventListener('click', (e) => {
            if (e.target === deleteModalOverlay) {
                deleteModalOverlay.classList.remove('active');
                currentBookIdToDelete = null;
            }
        });
    }
    // Add Book Form Submission
    if (addBookForm) {
        addBookForm.addEventListener('submit', (e) => __awaiter(this, void 0, void 0, function* () {
            e.preventDefault();
            // Check if user has permission to add books
            if (!currentUser || (currentUser.role_id !== ROLE_TYPES.ADMIN && currentUser.role_id !== ROLE_TYPES.LIBRARIAN)) {
                showNotification("You don't have permission to add books");
                return;
            }
            const formData = new FormData(addBookForm);
            const bookData = {};
            formData.forEach((value, key) => {
                bookData[key] = value;
            });
            const price = (Math.random() * 20 + 9.99).toFixed(2);
            bookData['price'] = price;
            try {
                if (loadingContainer) {
                    loadingContainer.style.display = "flex";
                }
                // Get token from localStorage
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error("Authentication required");
                }
                const response = yield fetch('http://localhost:5000/api/books', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(bookData),
                });
                if (!response.ok) {
                    const errorData = yield response.json();
                    throw new Error(errorData.message || `Failed to add book: ${response.status}`);
                }
                // Close modal and refresh books
                if (addModalOverlay) {
                    addModalOverlay.classList.remove('active');
                }
                // Refresh book list
                const { books, stats } = yield fetchBooks();
                displayBooks(books);
                updateStats(stats);
                showNotification('Book added successfully!');
            }
            catch (error) {
                console.error("Error adding book:", error);
                showNotification(error instanceof Error ? error.message : 'Failed to add book. Please try again.');
            }
            finally {
                if (loadingContainer) {
                    loadingContainer.style.display = "none";
                }
            }
        }));
    }
    // Edit Book Form Submission
    if (editBookForm) {
        editBookForm.addEventListener('submit', (e) => __awaiter(this, void 0, void 0, function* () {
            e.preventDefault();
            // Check if user has permission to edit books
            if (!currentUser || (currentUser.role_id !== ROLE_TYPES.ADMIN && currentUser.role_id !== ROLE_TYPES.LIBRARIAN)) {
                showNotification("You don't have permission to edit books");
                return;
            }
            const formData = new FormData(editBookForm);
            const bookData = {};
            const bookId = document.getElementById('edit-book-id').value;
            formData.forEach((value, key) => {
                if (key !== 'id') {
                    bookData[key] = value;
                }
            });
            try {
                if (loadingContainer) {
                    loadingContainer.style.display = "flex";
                }
                // Get token from localStorage
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error("Authentication required");
                }
                const response = yield fetch(`http://localhost:5000/api/books/${bookId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(bookData),
                });
                if (!response.ok) {
                    const errorData = yield response.json();
                    throw new Error(errorData.message || `Failed to update book: ${response.status}`);
                }
                // Close modal and refresh books
                if (editModalOverlay) {
                    editModalOverlay.classList.remove('active');
                }
                const editedBookIndex = cartItems.findIndex(item => item.id === bookId);
                if (editedBookIndex !== -1) {
                    const quantity = cartItems[editedBookIndex].quantity;
                    const updatedBook = Object.assign(Object.assign({}, bookData), { id: bookId, price: parseFloat(bookData.price) });
                    cartItems[editedBookIndex] = Object.assign(Object.assign({}, updatedBook), { quantity });
                    updateCartUI();
                }
                const { books, stats } = yield fetchBooks();
                displayBooks(books);
                updateStats(stats);
                showNotification('Book updated successfully!');
            }
            catch (error) {
                console.error("Error updating book:", error);
                showNotification(error instanceof Error ? error.message : 'Failed to update book. Please try again.');
            }
            finally {
                if (loadingContainer) {
                    loadingContainer.style.display = "none";
                }
            }
        }));
    }
    // Delete Book Confirmation
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
            if (!currentBookIdToDelete)
                return;
            // Check if user has permission to delete books
            if (!currentUser || currentUser.role_id !== ROLE_TYPES.ADMIN) {
                showNotification("Only administrators can delete books");
                return;
            }
            try {
                if (loadingContainer) {
                    loadingContainer.style.display = "flex";
                }
                // Get token from localStorage
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error("Authentication required");
                }
                const response = yield fetch(`http://localhost:5000/api/books/${currentBookIdToDelete}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    const errorData = yield response.json();
                    throw new Error(errorData.message || `Failed to delete book: ${response.status}`);
                }
                // Close modal
                if (deleteModalOverlay) {
                    deleteModalOverlay.classList.remove('active');
                }
                // Remove from cart if present
                cartItems = cartItems.filter(item => item.id !== currentBookIdToDelete);
                updateCartUI();
                // Refresh book list
                const { books, stats } = yield fetchBooks();
                displayBooks(books);
                updateStats(stats);
                showNotification('Book deleted successfully!');
            }
            catch (error) {
                console.error("Error deleting book:", error);
                showNotification(error instanceof Error ? error.message : 'Failed to delete book. Please try again.');
            }
            finally {
                if (loadingContainer) {
                    loadingContainer.style.display = "none";
                }
                currentBookIdToDelete = null;
            }
        }));
    }
    // Logout functionality
    const logoutBtn = document.getElementById('logout-button');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('refresh_token');
            window.location.href = '/index.html';
        });
    }
    // Global ESC key handler for all modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (addModalOverlay && addModalOverlay.classList.contains('active')) {
                addModalOverlay.classList.remove('active');
            }
            if (editModalOverlay && editModalOverlay.classList.contains('active')) {
                editModalOverlay.classList.remove('active');
            }
            if (deleteModalOverlay && deleteModalOverlay.classList.contains('active')) {
                deleteModalOverlay.classList.remove('active');
                currentBookIdToDelete = null;
            }
        }
    });
    // Initialize the app
    function init() {
        // Check user authentication first
        if (checkUserAuthentication()) {
            // Initial fetch of books
            fetchBooks().then(({ books, stats }) => {
                displayBooks(books);
                updateStats(stats);
            });
            // Initialize cart UI
            updateCartUI();
            // Set up event listeners for filters
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
        }
    }
    // Run the initialization
    init();
});
//# sourceMappingURL=script.js.map