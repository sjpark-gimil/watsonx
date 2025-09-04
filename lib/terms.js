const fs = require('fs');
const path = require('path');
const yaml = require('yaml');

const TERMS_DIR = path.join(__dirname, '..', 'content', 'terms');

function loadAllTerms() {
    const terms = [];
    
    if (!fs.existsSync(TERMS_DIR)) {
        return terms;
    }
    
    // Try to load from single terms.yml file first
    const termsFile = path.join(TERMS_DIR, 'terms.yml');
    if (fs.existsSync(termsFile)) {
        try {
            const content = fs.readFileSync(termsFile, 'utf8');
            const data = yaml.parse(content);
            
            if (data.terms && Array.isArray(data.terms)) {
                return data.terms.map(termData => ({
                    id: termData.id,
                    term: `${termData.term_kr}\n${termData.term_en}`, // Combine Korean and English like original
                    term_kr: termData.term_kr,
                    term_en: termData.term_en,
                    aliases: termData.aliases || [],
                    short: termData.short,
                    category: termData.category,
                    examples: termData.examples || []
                }));
            }
        } catch (error) {
            console.error(`Error parsing terms.yml:`, error);
        }
    }
    
    // Fallback to individual files (for backward compatibility)
    const files = fs.readdirSync(TERMS_DIR);
    
    files.forEach(file => {
        if (file.endsWith('.yml') || file.endsWith('.yaml')) {
            const filePath = path.join(TERMS_DIR, file);
            const content = fs.readFileSync(filePath, 'utf8');
            
            try {
                const termData = yaml.parse(content);
                // Skip if it's the terms.yml file (already processed above)
                if (file === 'terms.yml') return;
                
                terms.push({
                    id: termData.id,
                    term: `${termData.term_kr}\n${termData.term_en}`, // Combine Korean and English like original
                    term_kr: termData.term_kr,
                    term_en: termData.term_en,
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
        // Search in Korean term
        if (term.term_kr && term.term_kr.toLowerCase().includes(lowerSearchTerm)) {
            return true;
        }
        
        // Search in English term
        if (term.term_en && term.term_en.toLowerCase().includes(lowerSearchTerm)) {
            return true;
        }
        
        // Search in combined term (for backward compatibility)
        if (term.term && term.term.toLowerCase().includes(lowerSearchTerm)) {
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
