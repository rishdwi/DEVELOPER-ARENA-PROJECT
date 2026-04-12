// ====================================
// INTERACTIVE PORTFOLIO - MAIN SCRIPT
// ====================================

// Configuration & Constants
const CONFIG = {
    formId: 'contactForm',
    darkModeStorageKey: 'darkMode',
    maxMessageLength: 500,
    emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    nameMinLength: 2,
    messageMinLength: 10,
    subjectMinLength: 3
};

// ==========================================
// 1. DARK MODE TOGGLE (Day 6: Local Storage)
// ==========================================
function initDarkMode() {
    const darkModeBtn = document.getElementById('darkModeBtn');
    
    // Check if user has saved preference in localStorage
    const isDarkMode = localStorage.getItem(CONFIG.darkModeStorageKey) === 'true';
    
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        updateDarkModeButtonText();
    }
    
    // Add event listener to dark mode button
    if (darkModeBtn) {
        darkModeBtn.addEventListener('click', toggleDarkMode);
    }
    
    console.log('✓ Dark Mode initialized');
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    
    // Save preference to localStorage
    localStorage.setItem(CONFIG.darkModeStorageKey, isDarkMode);
    updateDarkModeButtonText();
}

function updateDarkModeButtonText() {
    const darkModeBtn = document.getElementById('darkModeBtn');
    if (darkModeBtn) {
        const isDarkMode = document.body.classList.contains('dark-mode');
        darkModeBtn.textContent = isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode';
    }
}

// =====================================================
// 2. FORM VALIDATION (Day 4: Form Validation)
// with Real-Time Feedback (Day 3: Event Listeners)
// =====================================================
function initFormValidation() {
    const form = document.getElementById(CONFIG.formId);
    
    if (!form) {
        console.warn('Form with ID "' + CONFIG.formId + '" not found');
        return;
    }
    
    // Form submission
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        if (validateAllFields()) {
            handleFormSubmit();
        }
    });
    
    // Get all input fields
    const inputs = form.querySelectorAll('input[type="text"], input[type="email"], textarea');
    
    // Add real-time validation listeners to each field
    inputs.forEach(input => {
        const fieldName = input.getAttribute('name');
        
        // Blur event: full validation
        input.addEventListener('blur', function() {
            validateField(fieldName);
        });
        
        // Input event: clear errors
        input.addEventListener('input', function() {
            clearFieldError(fieldName);
        });
        
        // Character counter for message field
        if (fieldName === 'message') {
            input.addEventListener('input', updateCharacterCount);
        }
    });
    
    console.log('✓ Form validation initialized');
}

// Validate all form fields
function validateAllFields() {
    const form = document.getElementById(CONFIG.formId);
    const inputs = form.querySelectorAll('input[type="text"], input[type="email"], textarea');
    let isValid = true;
    
    inputs.forEach(input => {
        const fieldName = input.getAttribute('name');
        if (!validateField(fieldName)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Validate individual field
function validateField(fieldName) {
    const field = document.getElementById(fieldName);
    const errorElement = field.nextElementSibling;
    const value = field.value.trim();
    let error = '';
    
    switch(fieldName) {
        case 'name':
            if (value.length < CONFIG.nameMinLength) {
                error = `Name must be at least ${CONFIG.nameMinLength} characters`;
            }
            break;
            
        case 'email':
            if (!value) {
                error = 'Email is required';
            } else if (!CONFIG.emailRegex.test(value)) {
                error = 'Please enter a valid email address';
            }
            break;
            
        case 'subject':
            if (value.length < CONFIG.subjectMinLength) {
                error = `Subject must be at least ${CONFIG.subjectMinLength} characters`;
            }
            break;
            
        case 'message':
            if (value.length < CONFIG.messageMinLength) {
                error = `Message must be at least ${CONFIG.messageMinLength} characters`;
            } else if (value.length > CONFIG.maxMessageLength) {
                error = `Message cannot exceed ${CONFIG.maxMessageLength} characters`;
            }
            break;
    }
    
    // Display error or success
    if (error) {
        setFieldError(field, error, errorElement);
        return false;
    } else {
        setFieldSuccess(field, errorElement);
        return true;
    }
}

function setFieldError(field, error, errorElement) {
    field.classList.add('error');
    field.classList.remove('success');
    
    if (errorElement && errorElement.classList.contains('error-text')) {
        errorElement.textContent = error;
    }
}

function setFieldSuccess(field, errorElement) {
    field.classList.remove('error');
    field.classList.add('success');
    
    if (errorElement && errorElement.classList.contains('error-text')) {
        errorElement.textContent = '';
    }
}

function clearFieldError(fieldName) {
    const field = document.getElementById(fieldName);
    if (field) {
        field.classList.remove('error', 'success');
        const errorElement = field.nextElementSibling;
        if (errorElement && errorElement.classList.contains('error-text')) {
            errorElement.textContent = '';
        }
    }
}

// Update character count for message field
function updateCharacterCount(event) {
    const textarea = event.target;
    const charCount = textarea.nextElementSibling;
    const currentLength = textarea.value.length;
    
    if (charCount && charCount.classList.contains('char-count')) {
        charCount.textContent = `${currentLength} / ${CONFIG.maxMessageLength}`;
        
        // Add warning class if near limit
        if (currentLength > CONFIG.maxMessageLength * 0.8) {
            charCount.classList.add('warning');
        } else {
            charCount.classList.remove('warning');
        }
    }
}

// Handle form submission
function handleFormSubmit() {
    const form = document.getElementById(CONFIG.formId);
    const name = document.getElementById('name').value;
    
    // Show success message
    showSuccessMessage(`Thank you, ${name}! Your message has been sent successfully. We'll get back to you soon!`);
    
    // Save form data to localStorage
    saveFormData({
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value,
        timestamp: new Date().toISOString()
    });
    
    // Reset form after delay
    setTimeout(() => {
        form.reset();
        document.getElementById('message').value = '';
        updateCharacterCount({ target: document.getElementById('message') });
        clearAllFieldStyles();
    }, 2000);
}

function clearAllFieldStyles() {
    const form = document.getElementById(CONFIG.formId);
    const inputs = form.querySelectorAll('input[type="text"], input[type="email"], textarea');
    inputs.forEach(input => {
        input.classList.remove('error', 'success');
    });
}

// Show success message (creates temporary notification)
function showSuccessMessage(message) {
    clearMessages();
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    
    const form = document.getElementById(CONFIG.formId);
    form.parentNode.insertBefore(successDiv, form);
    
    // Auto-remove after 4 seconds
    setTimeout(() => successDiv.remove(), 4000);
}

// Show error message (creates temporary notification)
function showErrorMessage(message) {
    clearMessages();
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    const form = document.getElementById(CONFIG.formId);
    form.parentNode.insertBefore(errorDiv, form);
    
    // Auto-remove after 4 seconds
    setTimeout(() => errorDiv.remove(), 4000);
}

function clearMessages() {
    const errorMsg = document.querySelector('.error-message');
    const successMsg = document.querySelector('.success-message');
    if (errorMsg) errorMsg.remove();
    if (successMsg) successMsg.remove();
}

// =====================================
// 3. DOM MANIPULATION (Day 2: DOM)
// =====================================

// Update form data in localStorage
function saveFormData(data) {
    const submissions = JSON.parse(localStorage.getItem('formSubmissions') || '[]');
    submissions.push(data);
    localStorage.setItem('formSubmissions', JSON.stringify(submissions));
    console.log('✓ Form data saved to localStorage');
}

// Get previous form submissions from localStorage
function getFormSubmissions() {
    return JSON.parse(localStorage.getItem('formSubmissions') || '[]');
}

// =====================================================
// 4. SMOOTH SCROLL for Anchor Links (Day 1: Setup)
// =====================================================
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
    
    console.log('✓ Smooth scroll initialized');
}

// =====================================================
// 5. SCROLL ANIMATIONS - Fade In Elements (Day 3)
// Using Intersection Observer API
// =====================================================
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
                entry.target.style.animation = 'fadeInUp 0.8s ease-out backwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        observer.observe(section);
    });
    
    console.log('✓ Scroll animations initialized');
}

// =====================================
// 6. SKILLS INTERACTIVE PREVIEW (Day 3)
// =====================================
function initSkillsPreview() {
    const skillItems = document.querySelectorAll('#skills li');
    
    skillItems.forEach((skill, index) => {
        // Add staggered animation delay
        skill.style.animation = `slideDown 0.6s ease-out ${index * 0.1}s backwards`;
        
        skill.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.15) rotateY(5deg)';
        });
        
        skill.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
        
        // Add click event for demonstration
        skill.style.cursor = 'pointer';
        skill.addEventListener('click', function() {
            animateSkillClick(this);
        });
    });
    
    console.log('✓ Skills preview initialized');
}

function animateSkillClick(element) {
    element.classList.add('pulse-animation');
    setTimeout(() => {
        element.classList.remove('pulse-animation');
    }, 600);
}

// ==========================================
// 7. ACTIVE NAVIGATION LINK (Day 3)
// ==========================================
function initActiveNavLink() {
    const navLinks = document.querySelectorAll('nav a:not(.github-btn):not(.dark-mode-btn)');
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
                link.style.color = '#fbbf24';
            } else {
                link.style.color = '';
            }
        });
    });
    
    console.log('✓ Active navigation link initialized');
}

// ==========================================
// 8. PROJECT CARD INTERACTIONS (Day 5)
// ==========================================
function initProjectInteractions() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach((card, index) => {
        // Add staggered fade-in animation
        card.style.animation = `fadeInScale 0.6s ease-out ${index * 0.15}s backwards`;
        
        card.addEventListener('mouseenter', function() {
            // Lift card on hover
            this.style.transform = 'translateY(-15px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        // Add click handler for project links
        const projectLink = card.querySelector('.project-link');
        if (projectLink) {
            projectLink.addEventListener('click', function(e) {
                e.preventDefault();
                showProjectDetail(card.querySelector('h3').textContent);
            });
        }
    });
    
    console.log('✓ Project interactions initialized');
}

function showProjectDetail(projectName) {
    const message = `Project: ${projectName} - More details coming soon!`;
    console.log(message);
    // You could expand this to show a modal or navigate to a project page
}

// ==========================================
// 9. PROFILE IMAGE INTERACTION (Day 2)
// ==========================================
function initProfileImageInteraction() {
    const profileImage = document.querySelector('.profile-image');
    
    if (profileImage) {
        profileImage.addEventListener('click', function() {
            this.style.transform = 'scale(1.1) rotate(5deg)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 300);
        });
    }
    
    console.log('✓ Profile image interaction initialized');
}

// ==========================================
// 10. CONSOLE LOGGING & DEBUG INFO (Day 1)
// ==========================================
function initConsoleInfo() {
    console.clear();
    console.log('%c📚 Interactive Portfolio Website', 'font-size: 20px; font-weight: bold; color: #6366f1;');
    console.log('%cAuthor: Yogesh Dwivedi', 'font-size: 14px; color: #ec4899;');
    console.log('%c✓ All JavaScript features loaded successfully!', 'font-size: 12px; color: #10b981; font-weight: bold;');
    console.log('');
    console.log('Features loaded:');
    console.log('✓ Dark Mode Toggle (with localStorage)');
    console.log('✓ Form Validation (real-time feedback)');
    console.log('✓ DOM Manipulation');
    console.log('✓ Smooth Scrolling');
    console.log('✓ Scroll Animations');
    console.log('✓ Skills Preview');
    console.log('✓ Active Navigation');
    console.log('✓ Project Interactions');
    console.log('✓ Local Storage Integration');
    console.log('');
    console.log('Try these in the console:');
    console.log('- portfolioUtils.getFormSubmissions() - View all form submissions');
    console.log('- portfolioUtils.clearFormSubmissions() - Clear all saved submissions');
    console.log('- portfolioUtils.getPortfolioStats() - View portfolio statistics');
}

// ==========================================
// UTILITY FUNCTIONS FOR DEBUGGING
// ==========================================

// Get portfolio statistics
function getPortfolioStats() {
    const stats = {
        formSubmissions: getFormSubmissions().length,
        darkModeEnabled: localStorage.getItem(CONFIG.darkModeStorageKey) === 'true',
        totalSections: document.querySelectorAll('section').length,
        totalProjects: document.querySelectorAll('.project-card').length,
        totalSkills: document.querySelectorAll('#skills li').length,
        lastVisit: new Date().toLocaleString()
    };
    console.table(stats);
    return stats;
}

// Clear all form submissions
function clearFormSubmissions() {
    localStorage.removeItem('formSubmissions');
    console.log('✓ All form submissions cleared');
}

// ==========================================
// 11. MAIN INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing portfolio features...');
    
    // Initialize all features in order
    initDarkMode();
    initFormValidation();
    initSmoothScroll();
    initScrollAnimation();
    initSkillsPreview();
    initActiveNavLink();
    initProjectInteractions();
    initProfileImageInteraction();
    initConsoleInfo();
    
    console.log('✅ All features initialized successfully!');
});

// ==========================================
// KEYBOARD SHORTCUTS
// ==========================================
document.addEventListener('keydown', function(event) {
    // Ctrl/Cmd + K to focus search (example)
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        // You could add a search feature here
    }
    
    // ESC to close modals (future feature)
    if (event.key === 'Escape') {
        clearMessages();
    }
});

// ==========================================
// BONUS: Window Resize Handler
// ==========================================
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        // Reorganize layout responsive adjustments
        initActiveNavLink();
    }, 250);
});

// ==========================================
// BONUS: Expose utilities globally for debugging
// ==========================================
window.portfolioUtils = {
    getFormSubmissions,
    clearFormSubmissions,
    getPortfolioStats,
    toggleDarkMode,
    validateField,
    saveFormData
};
