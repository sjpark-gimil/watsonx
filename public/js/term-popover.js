// AI Lexicon Data
const aiLexicon = [
    {
        term: "인공지능 (AI)",
        slug: "ai",
        category: "fundamentals",
        definition: "컴퓨터 시스템이 인간의 지능을 모방하도록 설계된 기술.",
        related: ["머신러닝", "딥러닝", "신경망"]
    },
    {
        term: "머신러닝 (ML)",
        slug: "machine-learning",
        category: "fundamentals",
        definition: "데이터를 기반으로 컴퓨터가 스스로 학습하여 예측이나 결정을 내릴 수 있게 하는 인공지능의 한 분야.",
        related: ["지도학습", "비지도학습", "강화학습"]
    },
    {
        term: "딥러닝",
        slug: "deep-learning",
        category: "models",
        definition: "인공 신경망을 기반으로 한 머신러닝의 한 분야로, 많은 양의 데이터를 학습하여 복잡한 패턴을 인식함.",
        related: ["합성곱 신경망", "순환 신경망", "전이학습"]
    },
    {
        term: "신경망",
        slug: "neural-networks",
        category: "models",
        definition: "인간의 뇌 신경세포 연결 방식을 모방한 알고리즘으로, 데이터의 복잡한 패턴을 학습할 수 있음.",
        related: ["퍼셉트론", "역전파", "은닉층"]
    },
    {
        term: "지도학습",
        slug: "supervised-learning",
        category: "training",
        definition: "정답이 포함된 레이블이 달린 데이터를 사용하여 모델을 학습시키는 방법.",
        related: ["분류", "회귀분석", "의사결정나무"]
    },
    {
        term: "비지도학습",
        slug: "unsupervised-learning",
        category: "training",
        definition: "정답 레이블 없이 데이터의 숨겨진 패턴이나 구조를 찾는 머신러닝 방법.",
        related: ["군집화", "차원 축소", "주성분 분석"]
    },
    {
        term: "강화학습",
        slug: "reinforcement-learning",
        category: "training",
        definition: "보상을 최대화하기 위해 환경과 상호작용하며 학습하는 머신러닝 방법.",
        related: ["Q-러닝", "정책 경사", "에이전트"]
    },
    {
        term: "모델 배포",
        slug: "model-deployment",
        category: "deployment",
        definition: "학습된 머신러닝 모델을 실제 서비스에 적용하는 과정.",
        related: ["모델 서빙", "API 엔드포인트", "도커 컨테이너"]
    },
    {
        term: "자연어 처리 (NLP)",
        slug: "nlp",
        category: "applications",
        definition: "인간의 언어를 컴퓨터가 이해하고 처리할 수 있게 하는 인공지능 기술.",
        related: ["텍스트 분류", "개체명 인식", "감정 분석"]
    },
    {
        term: "컴퓨터 비전",
        slug: "computer-vision",
        category: "applications",
        definition: "컴퓨터가 시각 정보를 해석하고 이해할 수 있게 하는 인공지능 기술.",
        related: ["이미지 인식", "객체 감지", "이미지 분할"]
    },
    {
        term: "Watsonx",
        slug: "watsonx",
        category: "platform",
        definition: "IBM의 차세대 AI 및 데이터 플랫폼으로, 신뢰할 수 있는 데이터와 AI 워크플로우를 통해 비즈니스의 AI 영향력을 확장하고 가속화합니다.",
        related: ["AI 플랫폼", "머신러닝", "모델 배포"]
    },
    {
        term: "Fine-tuning",
        slug: "fine-tuning",
        category: "training",
        definition: "The process of taking a pre-trained model and further training it on a new dataset to adapt it to a specific task.",
        related: ["transfer-learning", "model-training", "pre-trained-models"]
    },
    {
        term: "LLM",
        slug: "llm",
        category: "models",
        definition: "Large Language Model - A type of AI model trained on vast amounts of text data to understand and generate human-like text.",
        related: ["gpt", "natural-language-processing", "transformer"]
    },
    {
        term: "Prompt Engineering",
        slug: "prompt-engineering",
        category: "applications",
        definition: "The practice of designing and refining the input to generative AI models to produce the desired output.",
        related: ["llm", "natural-language-processing", "ai-interaction"]
    }
];

document.addEventListener('mouseover', e => {
    const el = e.target.closest('.term');
    if (!el) return;
    const id = el.dataset.termId;
    const panel = document.getElementById('term-popover') || createPanel();
    const data = window.__TERMS__ && window.__TERMS__[id];
    if (!data) return;
    panel.innerHTML = `<strong>${data.term}</strong><div>${data.short || ''}</div>
    <a href="${data.link || 'javascript:void(0)'}">Learn more</a>`;
    const r = el.getBoundingClientRect();
    panel.style.top = `${window.scrollY + r.bottom + 6}px`;
    panel.style.left = `${window.scrollX + r.left}px`;
    panel.classList.add('show');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest('.term')) hide();
  });
  function createPanel(){
    const d = document.createElement('div');
    d.id = 'term-popover';
    d.className = 'term-popover';
    document.body.appendChild(d);
    return d;
  }
  function hide(){ const p = document.getElementById('term-popover'); if (p) p.classList.remove('show'); }
  