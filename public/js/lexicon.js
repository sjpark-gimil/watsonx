// Sample lexicon data
const terms = [
    {
        id: 1,
        term: '인공지능 (AI)',
        definition: '컴퓨터 시스템이 인간의 지능적인 행동을 모방하도록 하는 기술',
        category: 'ai',
        examples: ['챗봇', '추천 시스템', '이미지 인식']
    },
    {
        id: 2,
        term: '머신러닝 (Machine Learning)',
        definition: '데이터를 통해 학습하고 예측하는 AI의 하위 분야',
        category: 'ml',
        examples: ['지도 학습', '비지도 학습', '강화 학습']
    },
    {
        id: 3,
        term: '딥러닝 (Deep Learning)',
        definition: '인공 신경망을 사용하는 머신러닝의 한 분야',
        category: 'dl',
        examples: ['합성곱 신경망(CNN)', '순환 신경망(RNN)', '트랜스포머']
    },
    {
        id: 4,
        term: '자연어 처리 (NLP)',
        definition: '컴퓨터가 인간의 언어를 이해하고 처리하는 기술',
        category: 'nlp',
        examples: ['기계 번역', '감정 분석', '질의 응답']
    },
    {
        id: 5,
        term: '신경망 (Neural Network)',
        definition: '뉴런의 동작 원리를 모방한 알고리즘 구조',
        category: 'dl',
        examples: ['순전파', '역전파', '활성화 함수']
    },
    {
        id: 6,
        term: '지도 학습 (Supervised Learning)',
        definition: '레이블이 있는 데이터로 모델을 훈련시키는 방법',
        category: 'ml',
        examples: ['분류', '회귀 분석']
    },
    {
        id: 7,
        term: '비지도 학습 (Unsupervised Learning)',
        definition: '레이블 없이 데이터의 패턴을 찾는 학습 방법',
        category: 'ml',
        examples: ['클러스터링', '차원 축소']
    },
    {
        id: 8,
        term: '강화 학습 (Reinforcement Learning)',
        definition: '보상을 통해 학습하는 머신러닝 방법',
        category: 'ml',
        examples: ['게임 AI', '로봇 제어']
    },
    {
        id: 9,
        term: '합성곱 신경망 (CNN)',
        definition: '이미지 처리에 특화된 딥러닝 모델',
        category: 'dl',
        examples: ['이미지 분류', '객체 감지']
    },
    {
        id: 10,
        term: '트랜스포머 (Transformer)',
        definition: '자연어 처리에 혁신을 가져온 딥러닝 아키텍처',
        category: 'nlp',
        examples: ['GPT', 'BERT']
    }
];

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
                <p>${term.definition}</p>
                ${term.examples ? `
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
function filterTerms() {
    const searchTerm = searchInput.value.toLowerCase();
    
    const filteredTerms = terms.filter(term => {
        const matchesSearch = term.term.toLowerCase().includes(searchTerm) || 
                           term.definition.toLowerCase().includes(searchTerm) ||
                           (term.examples && term.examples.some(example => example.toLowerCase().includes(searchTerm)));
        
        const matchesFilter = activeFilter === 'all' || term.category === activeFilter;
        
        return matchesSearch && matchesFilter;
    });
    
    displayTerms(filteredTerms);
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
displayTerms(terms);
