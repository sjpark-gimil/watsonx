// DOM Elements
const sidebar = document.querySelector('.sidebar');
const menuToggle = document.createElement('button');
const searchInput = document.querySelector('.search-bar input');
const navLinks = document.querySelectorAll('.sidebar-nav a');

// Add menu toggle for mobile
function setupMobileMenu() {
    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    menuToggle.className = 'menu-toggle';
    menuToggle.style.cssText = `
        display: none;
        background: none;
        border: none;
        color: var(--text-primary);
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0.5rem;
        margin-right: 1rem;
    `;
    
    document.querySelector('.top-bar').insertBefore(menuToggle, document.querySelector('.search-bar'));
    
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });
    
    // Close sidebar when clicking on a link (for mobile)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 1024) {
                sidebar.classList.remove('active');
            }
        });
    });
    
    // Handle window resize
    function handleResize() {
        if (window.innerWidth > 1024) {
            menuToggle.style.display = 'none';
            sidebar.style.transform = 'translateX(0)';
        } else {
            menuToggle.style.display = 'block';
            if (!sidebar.classList.contains('active')) {
                sidebar.style.transform = 'translateX(-100%)';
            }
        }
    }
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
}

// Add active class to current page link
function setActiveLink() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath === '' && href === 'index.html')) {
            link.parentElement.classList.add('active');
        } else {
            link.parentElement.classList.remove('active');
        }
    });
}

// Search functionality
function setupSearch() {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        // In a real app, you would filter content based on the search term
        console.log('Searching for:', searchTerm);
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId !== '#') {
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Initialize everything when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    setupMobileMenu();
    setActiveLink();
    setupSearch();
    
    // Add animation to cards on scroll
    const cards = document.querySelectorAll('.card');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        card.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(card);
    });
});
