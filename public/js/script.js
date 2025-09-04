// Sample tutorial data
const tutorials = [
    {
        id: 1,
        title: '첫 번째 프로젝트 시작하기',
        description: 'watsonx.ai에서 첫 번째 AI 프로젝트를 생성하고 실행하는 방법을 배워봅니다.',
        level: 'beginner',
        duration: '15분',
        tags: ['기초', '시작하기']
    },
    {
        id: 2,
        title: '데이터 분석 기초',
        description: 'watsonx.ai를 사용하여 데이터를 분석하고 시각화하는 방법을 배웁니다.',
        level: 'beginner',
        duration: '30분',
        tags: ['데이터 분석', '시각화']
    },
    {
        id: 3,
        title: '머신러닝 모델 훈련',
        description: '사용자 정의 데이터셋으로 머신러닝 모델을 훈련시키는 방법을 배웁니다.',
        level: 'intermediate',
        duration: '45분',
        tags: ['머신러닝', '모델 훈련']
    },
    {
        id: 4,
        title: '모델 배포하기',
        description: '훈련된 모델을 API로 배포하고 사용하는 방법을 배웁니다.',
        level: 'intermediate',
        duration: '30분',
        tags: ['배포', 'API']
    },
    {
        id: 5,
        title: '고급 자연어 처리',
        description: '고급 NLP 기법을 사용하여 텍스트 데이터를 처리하는 방법을 배웁니다.',
        level: 'advanced',
        duration: '60분',
        tags: ['NLP', '고급']
    }
];

// DOM Elements
const tutorialsContainer = document.getElementById('tutorialsContainer');
const searchInput = document.getElementById('tutorialSearch');
const filterButtons = document.querySelectorAll('.filter-btn');
let activeFilter = 'all';

// Display tutorials
function displayTutorials(tutorialsToShow) {
    tutorialsContainer.innerHTML = '';
    
    if (tutorialsToShow.length === 0) {
        tutorialsContainer.innerHTML = '<p class="no-results">검색 결과가 없습니다.</p>';
        return;
    }
    
    tutorialsToShow.forEach(tutorial => {
        const tutorialCard = document.createElement('div');
        tutorialCard.className = 'card';
        tutorialCard.innerHTML = `
            <div class="card-header">
                <h3>${tutorial.title}</h3>
                <div class="meta">${tutorial.duration} • ${getLevelText(tutorial.level)}</div>
            </div>
            <div class="card-body">
                <p>${tutorial.description}</p>
            </div>
            <div class="card-footer">
                <div class="tags">
                    ${tutorial.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <a href="/tutorials/${tutorial.id}" class="btn btn-primary">시작하기</a>
            </div>
        `;
        tutorialsContainer.appendChild(tutorialCard);
    });
}

// Get level text in Korean
function getLevelText(level) {
    const levels = {
        'beginner': '초보자',
        'intermediate': '중급자',
        'advanced': '고급'
    };
    return levels[level] || level;
}

// Filter tutorials based on search and active filter
function filterTutorials() {
    const searchTerm = searchInput.value.toLowerCase();
    
    const filteredTutorials = tutorials.filter(tutorial => {
        const matchesSearch = tutorial.title.toLowerCase().includes(searchTerm) || 
                            tutorial.description.toLowerCase().includes(searchTerm) ||
                            tutorial.tags.some(tag => tag.toLowerCase().includes(searchTerm));
        
        const matchesFilter = activeFilter === 'all' || tutorial.level === activeFilter;
        
        return matchesSearch && matchesFilter;
    });
    
    displayTutorials(filteredTutorials);
}

// Event Listeners
searchInput.addEventListener('input', filterTutorials);

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        // Update active filter
        activeFilter = button.dataset.category;
        // Apply filters
        filterTutorials();
    });
});

// Initialize
displayTutorials(tutorials);
