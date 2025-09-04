const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const expressLayouts = require('express-ejs-layouts');
const { loadAllDocs, getDocBySlug, listDocs } = require('./lib/content');
const { createMd } = require('./lib/md');
const { loadAllTerms, getTermsByCategory, searchTerms } = require('./lib/terms');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS as template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Use EJS layouts
app.use(expressLayouts);
app.set('layout', 'layout');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Load content and markdown renderer
let allDocs = [];
let allTerms = [];
let mdRenderer = null;

async function initializeContent() {
    try {
        allDocs = await loadAllDocs();
        allTerms = loadAllTerms();
        // Create markdown renderer (simplified for now)
        mdRenderer = createMd({ 'en': {} });
        console.log(`Loaded ${allDocs.length} documents and ${allTerms.length} terms`);
    } catch (error) {
        console.error('Error loading content:', error);
    }
}

// Initialize content on startup
initializeContent();

// Routes
app.get('/', (req, res) => {
    res.render('index', { 
        title: '홈',
        currentPage: 'home'
    });
});

// Tutorials listing page
app.get('/tutorials', (req, res) => {
    const tutorials = listDocs(allDocs);
    res.render('tutorials', { 
        title: '튜토리얼',
        currentPage: 'tutorials',
        tutorials: tutorials
    });
});

// Individual tutorial page
app.get('/tutorials/:slug', (req, res) => {
    const tutorial = getDocBySlug(allDocs, req.params.slug);
    if (!tutorial) {
        return res.status(404).render('404', { 
            title: '페이지를 찾을 수 없습니다',
            currentPage: '',
            body: '' 
        });
    }
    
    // Render markdown content
    const renderedContent = mdRenderer ? mdRenderer['en'].render(tutorial.content) : tutorial.content;
    
    // Get related tutorials (same product)
    const relatedTutorials = listDocs(allDocs)
        .filter(t => t.product === tutorial.front.product && t.slug !== tutorial.slug)
        .slice(0, 3);
    
    res.render('tutorial', { 
        title: tutorial.front.title,
        currentPage: 'tutorials',
        tutorial: {
            ...tutorial,
            content: renderedContent
        },
        relatedTutorials: relatedTutorials
    });
});

// AI Lexicon page
app.get('/lexicon', (req, res) => {
    res.render('lexicon', { 
        title: 'AI 용어사전',
        currentPage: 'lexicon',
        terms: allTerms
    });
});

// API Routes
app.get('/api/tutorials', (req, res) => {
    const tutorials = listDocs(allDocs);
    res.json(tutorials);
});

app.get('/api/terms', (req, res) => {
    const { category, search } = req.query;
    let filteredTerms = allTerms;
    
    if (search) {
        filteredTerms = searchTerms(filteredTerms, search);
    }
    
    if (category && category !== 'all') {
        filteredTerms = getTermsByCategory(filteredTerms, category);
    }
    
    res.json(filteredTerms);
});

// 404 page
app.get('/404', (req, res) => {
    res.status(404).render('404', { 
        title: '페이지를 찾을 수 없습니다',
        currentPage: ''
    });
});

// Error handling middleware
app.use((req, res) => {
    res.status(404).render('404', { 
        title: '페이지를 찾을 수 없습니다',
        currentPage: ''
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('500', { 
        title: '서버 오류',
        currentPage: ''
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
