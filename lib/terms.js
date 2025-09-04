const fs = require('fs');
const path = require('path');
const yaml = require('yaml');

const TERMS_DIR = path.join(__dirname, '..', 'content', 'terms');

function loadAllTerms() {
    const terms = [];
    
    if (!fs.existsSync(TERMS_DIR)) {
        return terms;
    }
    
    const files = fs.readdirSync(TERMS_DIR);
    
    files.forEach(file => {
        if (file.endsWith('.yml') || file.endsWith('.yaml')) {
            const filePath = path.join(TERMS_DIR, file);
            const content = fs.readFileSync(filePath, 'utf8');
            
            try {
                const termData = yaml.parse(content);
                terms.push({
                    id: termData.id,
                    term: termData.term,
                    aliases: termData.aliases || [],
                    short: termData.short,
                    category: termData.category,
                    examples: termData.examples || []
                });
            } catch (error) {
                console.error(`Error parsing term file ${file}:`, error);
            }
        }
    });
    
    return terms;
}

function getTermsByCategory(terms, category) {
    if (category === 'all') {
        return terms;
    }
    return terms.filter(term => term.category === category);
}

function searchTerms(terms, searchTerm) {
    if (!searchTerm) {
        return terms;
    }
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    
    return terms.filter(term => {
        // Search in term name
        if (term.term.toLowerCase().includes(lowerSearchTerm)) {
            return true;
        }
        
        // Search in aliases
        if (term.aliases.some(alias => alias.toLowerCase().includes(lowerSearchTerm))) {
            return true;
        }
        
        // Search in definition
        if (term.short.toLowerCase().includes(lowerSearchTerm)) {
            return true;
        }
        
        // Search in examples
        if (term.examples.some(example => example.toLowerCase().includes(lowerSearchTerm))) {
            return true;
        }
        
        return false;
    });
}

module.exports = { loadAllTerms, getTermsByCategory, searchTerms };
