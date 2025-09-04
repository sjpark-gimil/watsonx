// Terms will be loaded from server-side data or API
let terms = [];

// DOM Elements
const lexiconContainer = document.getElementById('lexiconTerms');
const searchInput = document.getElementById('lexiconSearch');
const filterButtons = document.querySelectorAll('.filter-btn');
let activeFilter = 'all';

// Display terms
function displayTerms(termsToShow) {
    lexiconContainer.innerHTML = '';
    
    if (termsToShow.length === 0) {
        lexiconContainer.innerHTML = '<p class="no-results">검색 결과가 없습니다.</p>';
        return;
    }
    
    termsToShow.forEach(term => {
        const termCard = document.createElement('div');
        termCard.className = 'card';
        termCard.innerHTML = `
            <div class="card-header">
                <h3>${term.term}</h3>
                <div class="meta">${getCategoryText(term.category)}</div>
            </div>
            <div class="card-body">
                <p>${term.short}</p>
                ${term.examples && term.examples.length > 0 ? `
                    <div class="examples">
                        <strong>예시:</strong>
                        <div class="tags">
                            ${term.examples.map(example => `<span class="tag">${example}</span>`).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
        lexiconContainer.appendChild(termCard);
    });
}

// Get category text in Korean
function getCategoryText(category) {
    const categories = {
        'ai': 'AI 기본',
        'ml': '머신러닝',
        'dl': '딥러닝',
        'nlp': '자연어 처리'
    };
    return categories[category] || category;
}

// Filter terms based on search and active filter
async function filterTerms() {
    const searchTerm = searchInput.value.toLowerCase();
    
    try {
        // Use API to get filtered terms
        const params = new URLSearchParams();
        if (activeFilter !== 'all') {
            params.append('category', activeFilter);
        }
        if (searchTerm) {
            params.append('search', searchTerm);
        }
        
        const response = await fetch(`/api/terms?${params}`);
        const filteredTerms = await response.json();
        
        displayTerms(filteredTerms);
    } catch (error) {
        console.error('Error fetching terms:', error);
        // Fallback to client-side filtering
        const filteredTerms = terms.filter(term => {
            const matchesSearch = term.term.toLowerCase().includes(searchTerm) || 
                               term.short.toLowerCase().includes(searchTerm) ||
                               (term.examples && term.examples.some(example => example.toLowerCase().includes(searchTerm)));
            
            const matchesFilter = activeFilter === 'all' || term.category === activeFilter;
            
            return matchesSearch && matchesFilter;
        });
        
        displayTerms(filteredTerms);
    }
}

// Event Listeners
searchInput.addEventListener('input', filterTerms);

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        // Update active filter
        activeFilter = button.dataset.category;
        // Apply filters
        filterTerms();
    });
});

// Initialize
async function initializeLexicon() {
    try {
        // Try to use server-side data first
        if (typeof serverTerms !== 'undefined' && serverTerms.length > 0) {
            terms = serverTerms;
            displayTerms(terms);
        } else {
            // Fallback to API
            const response = await fetch('/api/terms');
            terms = await response.json();
            displayTerms(terms);
        }
    } catch (error) {
        console.error('Error initializing lexicon:', error);
        displayTerms([]);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeLexicon);
