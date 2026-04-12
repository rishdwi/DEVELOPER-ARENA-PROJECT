// ===== Dark Mode Toggle =====
function initDarkMode() {
    const darkModeBtn = document.getElementById('darkModeBtn');
    
    // Check if user has saved preference
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        updateDarkModeButtonText();
    }
    
    // Add event listener to dark mode button
    if (darkModeBtn) {
        darkModeBtn.addEventListener('click', toggleDarkMode);
    }
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    updateDarkModeButtonText();
}

function updateDarkModeButtonText() {
    const darkModeBtn = document.getElementById('darkModeBtn');
    if (darkModeBtn) {
        const isDarkMode = document.body.classList.contains('dark-mode');
        darkModeBtn.textContent = isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode';
    }
}

// ===== Form Validation =====
function initFormValidation() {
    const form = document.querySelector('form');
    
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            validateForm();
        });
        
        // Real-time validation
        const email = document.getElementById('email');
        const message = document.getElementById('message');
        
        if (email) {
            email.addEventListener('blur', validateEmail);
            email.addEventListener('input', clearErrorMessage);
        }
        
        if (message) {
            message.addEventListener('blur', validateMessage);
            message.addEventListener('input', clearErrorMessage);
        }
    }
}

function validateForm() {
    clearErrorMessage();
    
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    
    // Validate name
    if (name.length < 2) {
        showError('Name must be at least 2 characters long');
        return false;
    }
    
    // Validate email
    if (!isValidEmail(email)) {
        showError('Please enter a valid email address');
        return false;
    }
    
    // Validate message
    if (message.length < 10) {
        showError('Message must be at least 10 characters long');
        return false;
    }
    
    // Form is valid
    showSuccess('Message sent successfully! Thank you for reaching out.');
    
    // Reset form
    setTimeout(() => {
        document.querySelector('form').reset();
        clearErrorMessage();
    }, 1500);
    
    return true;
}

function validateEmail() {
    const email = document.getElementById('email').value.trim();
    
    if (!email) {
        return;
    }
    
    if (!isValidEmail(email)) {
        showError('Please enter a valid email address');
        return false;
    }
    
    clearErrorMessage();
    return true;
}

function validateMessage() {
    const message = document.getElementById('message').value.trim();
    
    if (!message) {
        return;
    }
    
    if (message.length < 10) {
        showError('Message must be at least 10 characters long');
        return false;
    }
    
    clearErrorMessage();
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showError(message) {
    clearErrorMessage();
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    const form = document.querySelector('form');
    form.parentNode.insertBefore(errorDiv, form);
}

function showSuccess(message) {
    clearErrorMessage();
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    
    const form = document.querySelector('form');
    form.parentNode.insertBefore(successDiv, form);
}

function clearErrorMessage() {
    const errorMsg = document.querySelector('.error-message');
    const successMsg = document.querySelector('.success-message');
    
    if (errorMsg) errorMsg.remove();
    if (successMsg) successMsg.remove();
}

// ===== Smooth Scroll for Anchor Links =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===== Scroll Animation - Fade In Elements =====
function initScrollAnimation() {
    const sections = document.querySelectorAll('section');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

// ===== Skills Filter/Preview =====
function initSkillsPreview() {
    const skillItems = document.querySelectorAll('#skills li');
    
    skillItems.forEach(skill => {
        skill.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.15)';
        });
        
        skill.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
}

// ===== Active Navigation Link =====
function initActiveNavLink() {
    const navLinks = document.querySelectorAll('nav a');
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });
}

// ===== Initialize All Functions =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('Portfolio JavaScript loaded successfully');
    
    initDarkMode();
    initFormValidation();
    initSmoothScroll();
    initScrollAnimation();
    initSkillsPreview();
    initActiveNavLink();
});
