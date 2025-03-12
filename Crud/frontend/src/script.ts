document.addEventListener("DOMContentLoaded", function () {
  const booksContainer = document.getElementById("books-container");
  const genreFilter = document.getElementById("genre-filter") as HTMLSelectElement;
  const yearFilter = document.getElementById("year-filter") as HTMLSelectElement;
  const sortBy = document.getElementById("sort-by") as HTMLSelectElement;
  const applyFiltersBtn = document.getElementById("apply-filters");
  const searchInput = document.querySelector(".search-bar input") as HTMLInputElement;
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
  const addBookForm = document.getElementById("add-book-form") as HTMLFormElement;

  const editModalOverlay = document.getElementById("edit-modal-overlay");
  const closeEditModal = document.getElementById("close-edit-modal");
  const editBookForm = document.getElementById("edit-book-form") as HTMLFormElement;

  const deleteModalOverlay = document.getElementById("delete-modal-overlay");
  const cancelDeleteBtn = document.getElementById("cancel-delete");
  const confirmDeleteBtn = document.getElementById("confirm-delete");

  let currentBookIdToDelete: string | null = null;

  if (cartFooter) {
    cartFooter.insertBefore(cartTotalPrice, checkoutBtn);
  }

  interface Book {
    id: string;
    title: string;
    author: string;
    description: string;
    genre: string;
    year: string;
    pages: string;
    price: number;
    image: string;
    publisher: string;
  }

  interface CartItem extends Book {
    quantity: number;
  }

  let cartItems: CartItem[] = [];
  let allBooks: Book[] = [];

  // Function to fetch books from the server
  async function fetchBooks(params: Record<string, string> = {}) {
    try {
      if (loadingContainer) {
        loadingContainer.style.display = "flex";
      }

      const queryParams = new URLSearchParams(params).toString();
      const url = `http://localhost:5000/api/books${queryParams ? `?${queryParams}` : ''}`;

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const books = await response.json();
      console.log("Fetched books:", books);
      
      allBooks = books;

      if (loadingContainer) {
        loadingContainer.style.display = "none";
      }

      const stats = {
        totalBooks: books.length,
        avgPages: books.length 
          ? Math.round(books.reduce((sum: number, book: Book) => sum + parseInt(book.pages), 0) / books.length)
          : 0,
        oldestBook: books.length 
          ? Math.min(...books.map((book: Book) => parseInt(book.year)))
          : null,
        uniqueGenres: new Set(books.map((book: Book) => book.genre)).size
      };

      return { books, stats };
    } catch (error) {
      console.error("Error fetching books:", error);
      if (loadingContainer) {
        loadingContainer.style.display = "none";
      }
      return { books: [], stats: { totalBooks: 0, avgPages: 0, oldestBook: null, uniqueGenres: 0 } };
    }
  }

  // Function to filter and sort books
  function filterAndSortBooks() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const genre = genreFilter ? genreFilter.value : '';
    const yearRange = yearFilter ? yearFilter.value : '';
    const sortOption = sortBy ? sortBy.value : '';

    const params: Record<string, string> = {};

    if (searchTerm) params['search'] = searchTerm;
    if (genre) params['genre'] = genre;
    if (yearRange) params['yearRange'] = yearRange;
    if (sortOption) params['sortBy'] = sortOption;

    fetchBooks(params).then(({ books, stats }) => {
      displayBooks(books);
      updateStats(stats);
    });
  }

  // Initial fetch of books
  fetchBooks().then(({ books, stats }) => {
    displayBooks(books);
    updateStats(stats);
  });

  // Event listeners for filters
  if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener("click", filterAndSortBooks);
  }

  if (searchInput) {
    searchInput.addEventListener("keyup", function(event) {
      if (event.key === "Enter") {
        filterAndSortBooks();
      }
    });
  }

  // Function to display books in the UI
  function displayBooks(books: Book[]) {
    if (!booksContainer) return;
    
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
      
      const editBtn = document.createElement("button");
      editBtn.className = "action-btn edit-btn";
      editBtn.setAttribute("data-id", book.id);
      editBtn.innerHTML = '<i class="fa fa-pencil" aria-hidden="true"></i>';
      editBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openEditModal(book);
      });
      
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
      
      buyBook.addEventListener('click', function(e) {
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
  function updateStats(stats: {
    totalBooks: number,
    avgPages: number,
    oldestBook: number | null,
    uniqueGenres: number
  }) {
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
  function addToCart(bookId: string) {
    const bookToAdd = allBooks.find(book => book.id === bookId);

    if (!bookToAdd) {
      console.error("Book not found:", bookId);
      return;
    }

    const existingItemIndex = cartItems.findIndex(item => item.id === bookId);

    if (existingItemIndex !== -1) {
      cartItems[existingItemIndex].quantity += 1;
    } else {
      cartItems.push({
        ...bookToAdd,
        quantity: 1
      });
    }

    updateCartUI();
    showNotification(`Added "${bookToAdd.title}" to cart`);
  }

  // Update cart UI elements
  function updateCartUI() {
    if (!cartCountElement || !cartTotalItems) return;

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
    if (!cartItemsContainer || !cartEmptyMessage || !checkoutBtn) return;

    // Remove existing items
    const itemElements = cartItemsContainer.querySelectorAll('.cart-item');
    itemElements.forEach(item => item.remove());

    if (cartItems.length === 0) {
      (cartEmptyMessage as HTMLElement).style.display = 'block';
      (checkoutBtn as HTMLButtonElement).disabled = true;
      return;
    } else {
      (cartEmptyMessage as HTMLElement).style.display = 'none';
      (checkoutBtn as HTMLButtonElement).disabled = false;
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
      button.addEventListener('click', function(this: HTMLElement) {
        const id = this.getAttribute('data-id');
        if (id) {
          incrementCartItem(id);
        }
      });
    });

    const decreaseButtons = document.querySelectorAll('.decrease-quantity');
    decreaseButtons.forEach(button => {
      button.addEventListener('click', function(this: HTMLElement) {
        const id = this.getAttribute('data-id');
        if (id) {
          decrementCartItem(id);
        }
      });
    });

    const removeButtons = document.querySelectorAll('.remove-item');
    removeButtons.forEach(button => {
      button.addEventListener('click', function(this: HTMLElement) {
        const id = this.getAttribute('data-id');
        if (id) {
          removeCartItem(id);
        }
      });
    });
  }

  // Increment quantity of cart item
  function incrementCartItem(id: string) {
    const itemIndex = cartItems.findIndex(item => item.id === id);
    if (itemIndex !== -1) {
      cartItems[itemIndex].quantity += 1;
      updateCartUI();
    }
  }

  // Decrement quantity of cart item
  function decrementCartItem(id: string) {
    const itemIndex = cartItems.findIndex(item => item.id === id);
    if (itemIndex !== -1) {
      if (cartItems[itemIndex].quantity > 1) {
        cartItems[itemIndex].quantity -= 1;
      } else {
        removeCartItem(id);
        return;
      }
      updateCartUI();
    }
  }

  // Remove item from cart
  function removeCartItem(id: string) {
    cartItems = cartItems.filter(item => item.id !== id);
    updateCartUI();
    showNotification("Item removed from cart");
  }

  // Show notification
  function showNotification(message: string) {
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
  function showBookModal(book: Book) {
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
      buyButton.addEventListener('click', function() {
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
    checkoutBtn.addEventListener('click', function() {
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
  function openEditModal(book: Book) {
    if (editModalOverlay) {
      editModalOverlay.classList.add('active');

      const editBookId = document.getElementById('edit-book-id') as HTMLInputElement;
      const editTitle = document.getElementById('edit-title') as HTMLInputElement;
      const editAuthor = document.getElementById('edit-author') as HTMLInputElement;
      const editYear = document.getElementById('edit-year') as HTMLInputElement;
      const editPages = document.getElementById('edit-pages') as HTMLInputElement;
      const editGenre = document.getElementById('edit-genre') as HTMLSelectElement;
      const editDescription = document.getElementById('edit-description') as HTMLTextAreaElement;
      const editPublisher = document.getElementById('edit-publisher') as HTMLInputElement;
      const editImage = document.getElementById('edit-image') as HTMLInputElement;
      
      if (editBookId) editBookId.value = book.id;
      if (editTitle) editTitle.value = book.title;
      if (editAuthor) editAuthor.value = book.author;
      if (editYear) editYear.value = book.year;
      if (editPages) editPages.value = book.pages;
      if (editGenre) editGenre.value = book.genre;
      if (editDescription) editDescription.value = book.description;
      if (editPublisher) editPublisher.value = book.publisher;
      if (editImage) editImage.value = book.image;
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
  function openDeleteModal(bookId: string) {
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

  // Form Submissions
  if (addBookForm) {
    addBookForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(addBookForm);
      const bookData: Record<string, string> = {};
      
      formData.forEach((value, key) => {
        bookData[key] = value as string;
      });
      
      // Add price field (random between $9.99 and $29.99)
      const price = (Math.random() * 20 + 9.99).toFixed(2);
      bookData['price'] = price;
      
      try {
        if (loadingContainer) {
          loadingContainer.style.display = "flex";
        }
        
        const response = await fetch('http://localhost:5000/api/books', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bookData),
        });
        
        if (!response.ok) {
          throw new Error(`Failed to add book: ${response.status}`);
        }
        
        // Close modal and refresh books
        if (addModalOverlay) {
          addModalOverlay.classList.remove('active');
        }
        
        // Refresh book list
        const { books, stats } = await fetchBooks();
        displayBooks(books);
        updateStats(stats);
        
        showNotification('Book added successfully!');
      } catch (error) {
        console.error("Error adding book:", error);
        showNotification('Failed to add book. Please try again.');
      } finally {
        if (loadingContainer) {
          loadingContainer.style.display = "none";
        }
      }
    });
  }

  if (editBookForm) {
    editBookForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(editBookForm);
      const bookData: Record<string, string> = {};
      const bookId = (document.getElementById('edit-book-id') as HTMLInputElement).value;
      
      formData.forEach((value, key) => {
        if (key !== 'id') {
          bookData[key] = value as string;
        }
      });
      
      try {
        if (loadingContainer) {
          loadingContainer.style.display = "flex";
        }
        
        const response = await fetch(`http://localhost:5000/api/books/${bookId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bookData),
        });
        
        if (!response.ok) {
          throw new Error(`Failed to update book: ${response.status}`);
        }
        
        // Close modal and refresh books
        if (editModalOverlay) {
          editModalOverlay.classList.remove('active');
        }
        
        const editedBookIndex = cartItems.findIndex(item => item.id === bookId);
        if (editedBookIndex !== -1) {
          const quantity = cartItems[editedBookIndex].quantity;
          const updatedBook = { ...bookData, id: bookId, price: parseFloat(bookData.price) };
          cartItems[editedBookIndex] = { ...updatedBook as unknown as Book, quantity };
          updateCartUI();
        }
        
        const { books, stats } = await fetchBooks();
        displayBooks(books);
        updateStats(stats);
        
        showNotification('Book updated successfully!');
      } catch (error) {
        console.error("Error updating book:", error);
        showNotification('Failed to update book. Please try again.');
      } finally {
        if (loadingContainer) {
          loadingContainer.style.display = "none";
        }
      }
    });
  }

  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener('click', async () => {
      if (!currentBookIdToDelete) return;

      try {
        if (loadingContainer) {
          loadingContainer.style.display = "flex";
        }
        
        const response = await fetch(`http://localhost:5000/api/books/${currentBookIdToDelete}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error(`Failed to delete book: ${response.status}`);
        }
        
        // Close modal
        if (deleteModalOverlay) {
          deleteModalOverlay.classList.remove('active');
        }
        
        // Remove from cart if present
        cartItems = cartItems.filter(item => item.id !== currentBookIdToDelete);
        updateCartUI();
        
        // Refresh book list
        const { books, stats } = await fetchBooks();
        displayBooks(books);
        updateStats(stats);
        
        showNotification('Book deleted successfully!');
      } catch (error) {
        console.error("Error deleting book:", error);
        showNotification('Failed to delete book. Please try again.');
      } finally {
        if (loadingContainer) {
          loadingContainer.style.display = "none";
        }
        currentBookIdToDelete = null;
      }
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

  // Initialize cart UI
  updateCartUI();
});