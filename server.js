const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve the AI Lexicon page
app.get('/lexicon', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'lexicon.html'));
});

// API Routes (example - can be expanded)
app.get('/api/tutorials', (req, res) => {
    // In a real app, this would come from a database
    const tutorials = [
        { id: 1, title: 'Getting Started', description: 'Introduction to watsonx.ai' },
        { id: 2, title: 'API Integration', description: 'How to use watsonx.ai APIs' },
        { id: 3, title: 'Model Training', description: 'Training custom models' }
    ];
    res.json(tutorials);
});

// Error handling middleware
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
