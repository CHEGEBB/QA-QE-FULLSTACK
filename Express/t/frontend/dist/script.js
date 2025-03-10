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
                const queryParams = new URLSearchParams(params).toString();
                const url = 'http://localhost:5000';
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
});
//# sourceMappingURL=script.js.map