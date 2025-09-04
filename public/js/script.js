// Sample tutorial data
const tutorials = [
    {
        id: 1,
        title: 'watsonx.ai 시작하기',
        description: 'watsonx.ai에서 첫 번째 AI 프로젝트를 생성하고 실행하는 방법을 배워봅니다.',
        platform: 'watsonx.ai',
        level: 'beginner',
        duration: '15분',
        tags: ['기초', '시작하기', 'AI 스튜디오']
    },
    {
        id: 2,
        title: 'watsonx.data로 데이터 관리',
        description: 'watsonx.data를 사용하여 데이터 레이크하우스를 설정하고 관리하는 방법을 배웁니다.',
        platform: 'watsonx.data',
        level: 'beginner',
        duration: '30분',
        tags: ['데이터 관리', '데이터 레이크', '스토리지']
    },
    {
        id: 3,
        title: 'watsonx.governance 설정',
        description: 'AI 모델의 거버넌스 및 규정 준수를 위한 watsonx.governance 설정 방법을 배웁니다.',
        platform: 'watsonx.governance',
        level: 'intermediate',
        duration: '45분',
        tags: ['거버넌스', '규정 준수', 'AI 윤리']
    },
    {
        id: 4,
        title: 'watsonx.ai 모델 훈련',
        description: '사용자 정의 데이터셋으로 watsonx.ai에서 모델을 훈련시키는 방법을 배웁니다.',
        platform: 'watsonx.ai',
        level: 'intermediate',
        duration: '45분',
        tags: ['모델 훈련', '사용자 정의 모델']
    },
    {
        id: 5,
        title: 'watsonx.data 성능 최적화',
        description: '대규모 데이터셋에서 watsonx.data의 성능을 최적화하는 고급 기법을 배웁니다.',
        platform: 'watsonx.data',
        level: 'advanced',
        duration: '60분',
        tags: ['성능 최적화', '쿼리 튜닝', '대용량 데이터']
    },
    {
        id: 6,
        title: 'watsonx.governance 모니터링',
        description: 'AI 모델의 성능과 편향을 모니터링하고 관리하는 방법을 배웁니다.',
        platform: 'watsonx.governance',
        level: 'advanced',
        duration: '50분',
        tags: ['모니터링', '편향 감지', '성과 추적']
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
                <div class="meta">
                    <span class="platform-tag">${tutorial.platform}</span>
                    <span>${tutorial.duration} • ${getLevelText(tutorial.level)}</span>
                </div>
            </div>
            <div class="card-body">
                <p>${tutorial.description}</p>
            </div>
            <div class="card-footer">
                <div class="tags-container">
                    ${tutorial.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <div class="card-actions">
                    <a href="/tutorials/${tutorial.id}" class="btn btn-primary">시작하기</a>
                </div>
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
    const searchInputValue = document.getElementById('tutorialSearch')?.value.toLowerCase() || '';
    
    const filteredTutorials = tutorials.filter(tutorial => {
        // Search in title, description, and tags
        const matchesSearch = tutorial.title.toLowerCase().includes(searchTerm) || 
                            tutorial.description.toLowerCase().includes(searchTerm) ||
                            tutorial.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
                            tutorial.title.toLowerCase().includes(searchInputValue) ||
                            tutorial.description.toLowerCase().includes(searchInputValue) ||
                            tutorial.tags.some(tag => tag.toLowerCase().includes(searchInputValue));
        
        // Check if it matches the active filter (platform or level)
        const matchesFilter = activeFilter === 'all' || 
                            tutorial.level === activeFilter || 
                            tutorial.platform === activeFilter;
        
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
