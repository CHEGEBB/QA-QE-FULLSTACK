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
// Constants
const API_BASE_URL = 'http://localhost:5000/api'; // Changed from https to http
const ROLE_TYPES = {
    ADMIN: 1,
    LIBRARIAN: 2,
    BORROWER: 3
};
// DOM Elements
const authTabs = document.querySelectorAll('.auth-tab');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const roleOptions = document.querySelectorAll('.role-option');
const passwordToggles = document.querySelectorAll('.password-toggle');
const passwordInput = document.getElementById('signup-password');
const strengthBar = document.querySelector('.strength-bar');
const strengthText = document.querySelector('.strength-text');
// Login and Signup form elements
const loginButton = document.querySelector('.login-button');
const signupButton = document.querySelector('.signup-button');
const loginEmail = document.getElementById('login-email');
const loginPassword = document.getElementById('login-password');
const signupName = document.getElementById('signup-name');
const signupEmail = document.getElementById('signup-email');
const signupPassword = document.getElementById('signup-password');
const termsCheckbox = document.getElementById('terms');
// Book facts carousel
const facts = document.querySelectorAll('.fact');
const dots = document.querySelectorAll('.dot');
let currentFactIndex = 0;
let factInterval;
// Tab switching logic
authTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        var _a;
        // Remove active class from all tabs and forms
        authTabs.forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
        // Add active class to clicked tab and corresponding form
        tab.classList.add('active');
        const formId = `${tab.getAttribute('data-tab')}-form`;
        (_a = document.getElementById(formId)) === null || _a === void 0 ? void 0 : _a.classList.add('active');
    });
});
// Role selection logic
roleOptions.forEach(role => {
    role.addEventListener('click', () => {
        // Remove active class from all roles
        roleOptions.forEach(r => r.classList.remove('active'));
        // Add active class to clicked role
        role.classList.add('active');
        // Update UI based on selected role
        const selectedRole = role.getAttribute('data-role');
        document.body.className = ''; // Reset body classes
        document.body.classList.add(`${selectedRole}-mode`);
    });
});
// Password visibility toggle
passwordToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
        const passwordInput = toggle.previousElementSibling;
        const icon = toggle.querySelector('i');
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon === null || icon === void 0 ? void 0 : icon.classList.replace('fa-eye', 'fa-eye-slash');
        }
        else {
            passwordInput.type = 'password';
            icon === null || icon === void 0 ? void 0 : icon.classList.replace('fa-eye-slash', 'fa-eye');
        }
    });
});
// Password strength checker
passwordInput === null || passwordInput === void 0 ? void 0 : passwordInput.addEventListener('input', checkPasswordStrength);
function checkPasswordStrength() {
    const password = passwordInput.value;
    let strength = 0;
    if (password.length >= 8)
        strength += 1;
    if (/[A-Z]/.test(password))
        strength += 1;
    if (/[0-9]/.test(password))
        strength += 1;
    if (/[^A-Za-z0-9]/.test(password))
        strength += 1;
    strengthBar.className = 'strength-bar';
    if (password.length === 0) {
        strengthBar.style.width = '0';
        strengthText.textContent = 'Password strength';
    }
    else if (strength <= 2) {
        strengthBar.classList.add('weak');
        strengthBar.style.width = '25%';
        strengthText.textContent = 'Weak password';
    }
    else if (strength === 3) {
        strengthBar.classList.add('medium');
        strengthBar.style.width = '50%';
        strengthText.textContent = 'Medium password';
    }
    else {
        strengthBar.classList.add('strong');
        strengthBar.style.width = '100%';
        strengthText.textContent = 'Strong password';
    }
}
// Fact carousel functionality
function startFactCarousel() {
    factInterval = window.setInterval(() => {
        showFact((currentFactIndex + 1) % facts.length);
    }, 6000); // Change fact every 6 seconds
}
function showFact(index) {
    facts.forEach((fact, i) => {
        fact.classList.toggle('active', i === index);
    });
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
    currentFactIndex = index;
}
// Click on dots to change facts
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        clearInterval(factInterval);
        showFact(index);
        startFactCarousel();
    });
});
// Initialize fact carousel
startFactCarousel();
// Form validation
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
function validatePassword(password) {
    return password.length >= 8;
}
function validateName(name) {
    return name.trim().length > 0;
}
function showError(element, message) {
    var _a, _b;
    // Remove any existing error message
    const existingError = (_a = element.parentElement) === null || _a === void 0 ? void 0 : _a.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    // Create and append error message
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    (_b = element.parentElement) === null || _b === void 0 ? void 0 : _b.appendChild(errorElement);
    // Add error class to input
    element.classList.add('error');
}
function clearError(element) {
    var _a;
    // Remove error message
    const errorElement = (_a = element.parentElement) === null || _a === void 0 ? void 0 : _a.querySelector('.error-message');
    if (errorElement) {
        errorElement.remove();
    }
    // Remove error class
    element.classList.remove('error');
}
// Remove any existing error messages from the form
function clearFormErrors(form) {
    const existingErrors = form.querySelectorAll('.form-error');
    existingErrors.forEach(error => error.remove());
}
// Login functionality
loginButton.addEventListener('click', (e) => __awaiter(void 0, void 0, void 0, function* () {
    e.preventDefault();
    // Clear previous errors
    clearError(loginEmail);
    clearError(loginPassword);
    clearFormErrors(loginForm);
    // Validate email
    if (!validateEmail(loginEmail.value)) {
        showError(loginEmail, 'Please enter a valid email address');
        return;
    }
    // Validate password
    if (!validatePassword(loginPassword.value)) {
        showError(loginPassword, 'Password must be at least 8 characters');
        return;
    }
    // Get selected role
    const selectedRoleElement = document.querySelector('.role-option.active');
    const selectedRole = selectedRoleElement === null || selectedRoleElement === void 0 ? void 0 : selectedRoleElement.getAttribute('data-role');
    let roleId;
    switch (selectedRole) {
        case 'admin':
            roleId = ROLE_TYPES.ADMIN;
            break;
        case 'librarian':
            roleId = ROLE_TYPES.LIBRARIAN;
            break;
        default:
            roleId = ROLE_TYPES.BORROWER;
    }
    // Create login request
    const loginRequest = {
        email: loginEmail.value,
        password: loginPassword.value,
        role_id: roleId
    };
    try {
        // Show loading state
        loginButton.disabled = true;
        loginButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Logging in...';
        // Send login request
        const response = yield fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginRequest)
        });
        const data = yield response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }
        // Handle successful login
        const authResponse = data;
        // Store token in localStorage - handle both token formats
        if (authResponse.tokens) {
            localStorage.setItem('token', authResponse.tokens.access_token);
            localStorage.setItem('refresh_token', authResponse.tokens.refresh_token);
        }
        else if (authResponse.token) {
            localStorage.setItem('token', authResponse.token);
        }
        localStorage.setItem('user', JSON.stringify(authResponse.user));
        // Redirect to home page
        window.location.href = '/home.html';
    }
    catch (error) {
        // Handle error
        console.error('Login error:', error);
        // Show error message
        const errorMessage = error instanceof Error ? error.message : 'Login failed. Please try again.';
        const errorElement = document.createElement('div');
        errorElement.className = 'form-error';
        errorElement.textContent = errorMessage;
        // Insert error message at the top of the form
        loginForm.insertBefore(errorElement, loginForm.firstChild);
    }
    finally {
        // Reset button state
        loginButton.disabled = false;
        loginButton.innerHTML = '<i class="fa-solid fa-sign-in-alt"></i> Log In';
    }
}));
// Signup functionality
signupButton.addEventListener('click', (e) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    e.preventDefault();
    // Clear previous errors
    clearError(signupName);
    clearError(signupEmail);
    clearError(signupPassword);
    clearFormErrors(signupForm);
    // Remove any existing error near terms checkbox
    const termsErrorElement = (_a = termsCheckbox.parentElement) === null || _a === void 0 ? void 0 : _a.querySelector('.error-message');
    if (termsErrorElement) {
        termsErrorElement.remove();
    }
    // Validate name
    if (!validateName(signupName.value)) {
        showError(signupName, 'Please enter your name');
        return;
    }
    // Validate email
    if (!validateEmail(signupEmail.value)) {
        showError(signupEmail, 'Please enter a valid email address');
        return;
    }
    // Validate password
    if (!validatePassword(signupPassword.value)) {
        showError(signupPassword, 'Password must be at least 8 characters');
        return;
    }
    // Check terms checkbox
    if (!termsCheckbox.checked) {
        // Show error near terms checkbox
        const termsError = document.createElement('div');
        termsError.className = 'error-message';
        termsError.textContent = 'You must agree to the Terms of Service';
        (_b = termsCheckbox.parentElement) === null || _b === void 0 ? void 0 : _b.appendChild(termsError);
        return;
    }
    // Create signup request (always role_id 3 for borrower)
    const signupRequest = {
        name: signupName.value,
        email: signupEmail.value,
        password: signupPassword.value,
        role_id: ROLE_TYPES.BORROWER // Always 3 for signup (Borrower)
    };
    try {
        // Show loading state
        signupButton.disabled = true;
        signupButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Creating account...';
        // Send signup request
        const response = yield fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(signupRequest)
        });
        const data = yield response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Signup failed');
        }
        // Handle successful signup
        const authResponse = data;
        // Store token in localStorage - handle both token formats
        if (authResponse.tokens) {
            localStorage.setItem('token', authResponse.tokens.access_token);
            localStorage.setItem('refresh_token', authResponse.tokens.refresh_token);
        }
        else if (authResponse.token) {
            localStorage.setItem('token', authResponse.token);
        }
        localStorage.setItem('user', JSON.stringify(authResponse.user));
        // Show success message
        const successElement = document.createElement('div');
        successElement.className = 'form-success';
        successElement.textContent = 'Account created successfully! Redirecting...';
        // Insert success message at the top of the form
        signupForm.insertBefore(successElement, signupForm.firstChild);
        // Redirect to home page after short delay
        setTimeout(() => {
            window.location.href = '/home.html';
        }, 1500);
    }
    catch (error) {
        // Handle error
        console.error('Signup error:', error);
        // Show error message
        const errorMessage = error instanceof Error ? error.message : 'Signup failed. Please try again.';
        const errorElement = document.createElement('div');
        errorElement.className = 'form-error';
        errorElement.textContent = errorMessage;
        // Insert error message at the top of the form
        signupForm.insertBefore(errorElement, signupForm.firstChild);
    }
    finally {
        // Reset button state
        signupButton.disabled = false;
        signupButton.innerHTML = '<i class="fa-solid fa-user-plus"></i> Create Account';
    }
}));
// Check if user is already logged in
function checkLoggedInUser() {
    const token = localStorage.getItem('token');
    if (token) {
        // Redirect to home page if already logged in
        window.location.href = '/home.html';
    }
}
// Run on page load
document.addEventListener('DOMContentLoaded', () => {
    checkLoggedInUser();
});
//# sourceMappingURL=auth.js.map