// Import AI Lexicon functionality
import { highlightTermsInContent } from './term-popover.js';

// DOM Elements
const sidebar = document.querySelector('.sidebar');
const menuToggle = document.createElement('button');
const searchInput = document.getElementById('searchInput');
const navLinks = document.querySelectorAll('.sidebar-nav a');
const contentArea = document.querySelector('.content-area');
const tutorialsContainer = document.getElementById('tutorialsContainer');
const signInBtn = document.getElementById('signInBtn');

// Sample tutorial data (in a real app, this would come from an API)
const tutorials = [
    {
        id: 1,
        title: 'Getting Started',
        description: 'Learn the basics of watsonx.ai and set up your first project in minutes.',
        icon: 'rocket',
        link: '/tutorials/getting-started'
    },
    {
        id: 2,
        title: 'API Integration',
        description: 'Integrate watsonx.ai capabilities into your applications with our APIs.',
        icon: 'laptop-code',
        link: '/tutorials/api-integration'
    },
    {
        id: 3,
        title: 'Data Analysis',
        description: 'Analyze and visualize your data with watsonx.ai powerful tools.',
        icon: 'chart-bar',
        link: '/tutorials/data-analysis'
    }
];

// Initialize the application
function init() {
    setupMobileMenu();
    setupSearch();
    renderTutorials();
    setupEventListeners();
    
    // Highlight AI terms in the content
    if (contentArea) {
        highlightTermsInContent(contentArea);
    }
}

// Setup mobile menu toggle
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
    
    const topBar = document.querySelector('.top-bar');
    if (topBar) {
        const searchBar = document.querySelector('.search-bar');
        topBar.insertBefore(menuToggle, searchBar);
    }
    
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });
    
    // Close sidebar when clicking on a link (for mobile)
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
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

// Render tutorial cards
function renderTutorials(filter = '') {
    if (!tutorialsContainer) return;
    
    const filteredTutorials = tutorials.filter(tutorial => 
        tutorial.title.toLowerCase().includes(filter.toLowerCase()) ||
        tutorial.description.toLowerCase().includes(filter.toLowerCase())
    );
    
    tutorialsContainer.innerHTML = filteredTutorials.map(tutorial => `
        <div class="card" data-id="${tutorial.id}">
            <div class="card-icon">
                <i class="fas fa-${tutorial.icon}"></i>
            </div>
            <h3>${tutorial.title}</h3>
            <p>${tutorial.description}</p>
            <a href="${tutorial.link}" class="card-link">Start Learning <i class="fas fa-arrow-right"></i></a>
        </div>
    `).join('');
}

// Setup search functionality
function setupSearch() {
    if (!searchInput) return;
    
    let searchTimeout;
    
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        const searchTerm = e.target.value.trim();
        
        // Debounce search to improve performance
        searchTimeout = setTimeout(() => {
            renderTutorials(searchTerm);
        }, 300);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Sign in button click handler
    if (signInBtn) {
        signInBtn.addEventListener('click', () => {
            // In a real app, this would open a sign-in modal or redirect to auth
            console.log('Sign in clicked');
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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
    
    // Add animation to cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe tutorial cards when they're added to the DOM
    const renderObserver = new MutationObserver(() => {
        document.querySelectorAll('.card').forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.transitionDelay = `${index * 0.1}s`;
            observer.observe(card);
        });
    });
    
    if (tutorialsContainer) {
        renderObserver.observe(tutorialsContainer, { childList: true });
    }
}

// Initialize the app when the DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

(async function(){
    const res = await fetch('/search-index.json');
    const payload = await res.json();
    const mini = MiniSearch.loadJSON(payload.index, { fields: ['title','summary','content','tags','product','version','lang'], storeFields: ['slug','title','summary','product','version','lang','est_minutes','level'] });
  
    const input = document.querySelector('#q');
    const out = document.querySelector('#results');
  
    input.addEventListener('input', () => {
      const q = input.value.trim();
      out.innerHTML = '';
      if (!q) return;
      const hits = mini.search(q, { prefix: true, fuzzy: 0.2, boost: { title: 3, tags: 2 } });
      for (const h of hits.slice(0, 20)) {
        const lang = h.store.lang;
        const url = `/${lang}/docs/${h.store.slug}`;
        out.innerHTML += `<div class="hit"><a href="${url}">${h.store.title}</a><p>${h.store.summary||''}</p></div>`;
      }
    });
  })();
  

// Export for testing or future module imports
export { init, renderTutorials, setupSearch };
