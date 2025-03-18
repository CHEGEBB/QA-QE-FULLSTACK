// Define types for API requests and responses
interface User {
    id: number;
    name: string;
    email: string;
    role_id: number; // 1: Admin, 2: Librarian, 3: Borrower
    role_name?: string;
}

interface LoginRequest {
    email: string;
    password: string;
    role_id: number;
}

interface SignupRequest {
    name: string;
    email: string;
    password: string;
    role_id: number; // Always 3 for signup (Borrower)
}

interface AuthResponse {
    user: User;
    token?: string;
    tokens?: {
        access_token: string;
        refresh_token: string;
    };
    message?: string;
}

// Constants
const API_BASE_URL = 'http://localhost:5000/api'; // Changed from https to http
const ROLE_TYPES = {
    ADMIN: 1,
    LIBRARIAN: 2,
    BORROWER: 3
};

// DOM Elements
const authTabs = document.querySelectorAll('.auth-tab');
const loginForm = document.getElementById('login-form') as HTMLDivElement;
const signupForm = document.getElementById('signup-form') as HTMLDivElement;
const roleOptions = document.querySelectorAll('.role-option');
const passwordToggles = document.querySelectorAll('.password-toggle');
const passwordInput = document.getElementById('signup-password') as HTMLInputElement;
const strengthBar = document.querySelector('.strength-bar') as HTMLDivElement;
const strengthText = document.querySelector('.strength-text') as HTMLSpanElement;

// Login and Signup form elements
const loginButton = document.querySelector('.login-button') as HTMLButtonElement;
const signupButton = document.querySelector('.signup-button') as HTMLButtonElement;
const loginEmail = document.getElementById('login-email') as HTMLInputElement;
const loginPassword = document.getElementById('login-password') as HTMLInputElement;
const signupName = document.getElementById('signup-name') as HTMLInputElement;
const signupEmail = document.getElementById('signup-email') as HTMLInputElement;
const signupPassword = document.getElementById('signup-password') as HTMLInputElement;
const termsCheckbox = document.getElementById('terms') as HTMLInputElement;

// Book facts carousel
const facts = document.querySelectorAll('.fact');
const dots = document.querySelectorAll('.dot');
let currentFactIndex = 0;
let factInterval: number;

// Tab switching logic
authTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active class from all tabs and forms
        authTabs.forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
        
        // Add active class to clicked tab and corresponding form
        tab.classList.add('active');
        const formId = `${tab.getAttribute('data-tab')}-form`;
        document.getElementById(formId)?.classList.add('active');
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
        const passwordInput = toggle.previousElementSibling as HTMLInputElement;
        const icon = toggle.querySelector('i');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon?.classList.replace('fa-eye', 'fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            icon?.classList.replace('fa-eye-slash', 'fa-eye');
        }
    });
});

// Password strength checker
passwordInput?.addEventListener('input', checkPasswordStrength);

function checkPasswordStrength() {
    const password = passwordInput.value;
    let strength = 0;
    
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    strengthBar.className = 'strength-bar';
    
    if (password.length === 0) {
        strengthBar.style.width = '0';
        strengthText.textContent = 'Password strength';
    } else if (strength <= 2) {
        strengthBar.classList.add('weak');
        strengthBar.style.width = '25%';
        strengthText.textContent = 'Weak password';
    } else if (strength === 3) {
        strengthBar.classList.add('medium');
        strengthBar.style.width = '50%';
        strengthText.textContent = 'Medium password';
    } else {
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

function showFact(index: number) {
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
function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password: string): boolean {
    return password.length >= 8;
}

function validateName(name: string): boolean {
    return name.trim().length > 0;
}

function showError(element: HTMLElement, message: string) {
    // Remove any existing error message
    const existingError = element.parentElement?.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Create and append error message
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    element.parentElement?.appendChild(errorElement);
    
    // Add error class to input
    element.classList.add('error');
}

function clearError(element: HTMLElement) {
    // Remove error message
    const errorElement = element.parentElement?.querySelector('.error-message');
    if (errorElement) {
        errorElement.remove();
    }
    
    // Remove error class
    element.classList.remove('error');
}

// Remove any existing error messages from the form
function clearFormErrors(form: HTMLElement) {
    const existingErrors = form.querySelectorAll('.form-error');
    existingErrors.forEach(error => error.remove());
}

// Login functionality
loginButton.addEventListener('click', async (e) => {
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
    const selectedRole = selectedRoleElement?.getAttribute('data-role');
    
    let roleId: number;
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
    const loginRequest: LoginRequest = {
        email: loginEmail.value,
        password: loginPassword.value,
        role_id: roleId
    };
    
    try {
        // Show loading state
        loginButton.disabled = true;
        loginButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Logging in...';
        
        // Send login request
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginRequest)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }
        
        // Handle successful login
        const authResponse: AuthResponse = data;
        
        // Store token in localStorage - handle both token formats
        if (authResponse.tokens) {
            localStorage.setItem('token', authResponse.tokens.access_token);
            localStorage.setItem('refresh_token', authResponse.tokens.refresh_token);
        } else if (authResponse.token) {
            localStorage.setItem('token', authResponse.token);
        }
        
        localStorage.setItem('user', JSON.stringify(authResponse.user));
        
        // Redirect to home page
        window.location.href = '/home.html';
        
    } catch (error) {
        // Handle error
        console.error('Login error:', error);
        
        // Show error message
        const errorMessage = error instanceof Error ? error.message : 'Login failed. Please try again.';
        
        const errorElement = document.createElement('div');
        errorElement.className = 'form-error';
        errorElement.textContent = errorMessage;
        
        // Insert error message at the top of the form
        loginForm.insertBefore(errorElement, loginForm.firstChild);
        
    } finally {
        // Reset button state
        loginButton.disabled = false;
        loginButton.innerHTML = '<i class="fa-solid fa-sign-in-alt"></i> Log In';
    }
});

// Signup functionality
signupButton.addEventListener('click', async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    clearError(signupName);
    clearError(signupEmail);
    clearError(signupPassword);
    clearFormErrors(signupForm);
    
    // Remove any existing error near terms checkbox
    const termsErrorElement = termsCheckbox.parentElement?.querySelector('.error-message');
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
        termsCheckbox.parentElement?.appendChild(termsError);
        return;
    }
    
    // Create signup request (always role_id 3 for borrower)
    const signupRequest: SignupRequest = {
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
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(signupRequest)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Signup failed');
        }
        
        // Handle successful signup
        const authResponse: AuthResponse = data;
        
        // Store token in localStorage - handle both token formats
        if (authResponse.tokens) {
            localStorage.setItem('token', authResponse.tokens.access_token);
            localStorage.setItem('refresh_token', authResponse.tokens.refresh_token);
        } else if (authResponse.token) {
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
        
    } catch (error) {
        // Handle error
        console.error('Signup error:', error);
        
        // Show error message
        const errorMessage = error instanceof Error ? error.message : 'Signup failed. Please try again.';
        
        const errorElement = document.createElement('div');
        errorElement.className = 'form-error';
        errorElement.textContent = errorMessage;
        
        // Insert error message at the top of the form
        signupForm.insertBefore(errorElement, signupForm.firstChild);
        
    } finally {
        // Reset button state
        signupButton.disabled = false;
        signupButton.innerHTML = '<i class="fa-solid fa-user-plus"></i> Create Account';
    }
});

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