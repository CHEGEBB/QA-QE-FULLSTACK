document.addEventListener("DOMContentLoaded", function (){
  const booksContainer = document.getElementById("books-container");
  const genreFilter = document.getElementById("genre-filter");
  const yearFilter = document.getElementById("year-filter");
  const sortBy = document.getElementById("sort-by");
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

  async function fetchBooks(params: Record<string, string> = {}) {
    try {

      const queryParams = new URLSearchParams(params).toString();
      const url = 'http://localhost:5000';

      const response = await fetch(url);
      const data = await response.json();

      if (loadingContainer) {
        loadingContainer.style.display = "none";
      }

      return data;
    } catch (error) {
      console.error("Error fetching books:", error);
      if (loadingContainer) {
        loadingContainer.style.display = "none";
      }
      return { books: [], stats: {} };
    }

  }});