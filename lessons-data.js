// lessons-data.js — 바이브코딩 가이드 교안 메타데이터
// common.js가 이 데이터를 기반으로 브레드크럼, 관련교안, 학습경로, footer nav를 자동 생성합니다.

const LESSONS = {
  tools: {
    lovable: {
      name: '러버블 Lovable', icon: '💗', color: '#00B894',
      beginner:     { url: 'lovable-beginner.html',     title: '러버블 초보자편',      desc: '설치 없이 웹에서 바로 앱 만들기' },
      intermediate: { url: 'lovable-intermediate.html',  title: '러버블 중급자편',      desc: 'PRD/IA/ERD로 체계적 개발' },
      developer:    { url: 'lovable-developer.html',     title: '러버블 개발자편',      desc: '기술 아키텍처와 Supabase 연동' },
      related: ['aistudio', 'prompt', 'github', 'deployment'],
      prereqs: { beginner: [], intermediate: ['prompt-beginner'], developer: ['github-beginner'] }
    },
    antigravity: {
      name: '안티그래비티', icon: '🚀', color: '#9C27B0',
      beginner:     { url: 'antigravity-beginner.html',     title: '안티그래비티 초보자편',  desc: 'AI 에이전트에게 개발 맡기기' },
      intermediate: { url: 'antigravity-intermediate.html',  title: '안티그래비티 중급자편',  desc: 'Rules, Workflows 활용' },
      developer:    { url: 'antigravity-developer.html',     title: '안티그래비티 개발자편',  desc: 'Skills 제작과 GitHub 연동' },
      related: ['lovable', 'cursor', 'prompt', 'github'],
      prereqs: { beginner: [], intermediate: [], developer: ['github-beginner'] }
    },
    cursor: {
      name: '커서 Cursor', icon: '💻', color: '#2196F3',
      beginner:     { url: 'cursor-beginner.html',     title: '커서 초보자편',        desc: 'AI 코드 에디터 첫 경험' },
      intermediate: { url: 'cursor-intermediate.html',  title: '커서 중급자편',        desc: '기획 문서 기반 개발' },
      developer:    { url: 'cursor-developer.html',     title: '커서 개발자편',        desc: '워크플로우 최적화' },
      related: ['claude-code', 'github', 'deployment', 'prompt'],
      prereqs: { beginner: [], intermediate: ['prompt-beginner'], developer: ['github-beginner'] }
    },
    aistudio: {
      name: 'AI Studio', icon: '🧪', color: '#4CAF50',
      beginner:     { url: 'aistudio-beginner.html',     title: 'AI Studio 초보자편',   desc: '무료로 가장 쉽게 시작' },
      intermediate: { url: 'aistudio-intermediate.html',  title: 'AI Studio 중급자편',   desc: 'Gemini API 활용' },
      developer:    { url: 'aistudio-developer.html',     title: 'AI Studio 개발자편',   desc: 'Firebase 연동 풀스택' },
      related: ['google', 'lovable', 'prompt', 'chatgpt'],
      prereqs: { beginner: [], intermediate: [], developer: ['github-beginner'] }
    },
    'claude-code': {
      name: 'Claude Code', icon: '⚡', color: '#FF9800',
      beginner:     { url: 'claude-code-beginner.html',     title: 'Claude Code 초보자편',  desc: '터미널에서 AI와 코딩' },
      intermediate: { url: 'claude-code-intermediate.html',  title: 'Claude Code 중급자편',  desc: 'CLAUDE.md와 체계적 개발' },
      developer:    { url: 'claude-code-developer.html',     title: 'Claude Code 개발자편',  desc: 'MCP, 서브에이전트 활용' },
      related: ['cursor', 'github', 'deployment', 'devinterface'],
      prereqs: { beginner: ['devinterface-beginner'], intermediate: ['github-beginner'], developer: ['github-intermediate'] }
    },
    devinterface: {
      name: '개발 인터페이스', icon: '🖥️', color: '#607D8B',
      beginner:     { url: 'devinterface-beginner.html',     title: '개발 인터페이스 초보자편', desc: 'CLI, 터미널, IDE 기초' },
      intermediate: { url: 'devinterface-intermediate.html',  title: '개발 인터페이스 중급자편', desc: '셸 스크립트와 자동화' },
      developer:    { url: 'devinterface-developer.html',     title: '개발 인터페이스 개발자편', desc: '컨테이너와 클라우드 개발' },
      related: ['cursor', 'claude-code', 'github', 'deployment'],
      prereqs: { beginner: [], intermediate: [], developer: ['github-beginner'] }
    },
    chatgpt: {
      name: 'ChatGPT/Codex', icon: '🎓', color: '#10A37F',
      beginner:     { url: 'chatgpt-beginner.html',     title: 'ChatGPT 초보자편',     desc: 'ChatGPT로 바이브코딩 시작' },
      intermediate: { url: 'chatgpt-intermediate.html',  title: 'ChatGPT 중급자편',     desc: 'GPTs, Canvas 활용' },
      developer:    { url: 'chatgpt-developer.html',     title: 'ChatGPT 개발자편',     desc: 'Codex와 API 활용' },
      related: ['prompt', 'lovable', 'aistudio', 'cursor'],
      prereqs: { beginner: [], intermediate: ['prompt-beginner'], developer: ['prompt-intermediate'] }
    },
    prompt: {
      name: '프롬프트 엔지니어링', icon: '🎯', color: '#E91E63',
      beginner:     { url: 'prompt-beginner.html',     title: '프롬프트 초보자편',     desc: 'AI에게 정확히 지시하기' },
      intermediate: { url: 'prompt-intermediate.html',  title: '프롬프트 중급자편',     desc: '고급 프롬프트 테크닉' },
      developer:    { url: 'prompt-developer.html',     title: '프롬프트 개발자편',     desc: '프롬프트 자동화와 최적화' },
      related: ['chatgpt', 'lovable', 'cursor', 'aistudio'],
      prereqs: { beginner: [], intermediate: [], developer: [] }
    },
    github: {
      name: 'Git/GitHub', icon: '🐙', color: '#F44336',
      beginner:     { url: 'github-beginner.html',     title: 'Git/GitHub 초보자편',   desc: '버전 관리의 기초' },
      intermediate: { url: 'github-intermediate.html',  title: 'Git/GitHub 중급자편',   desc: '브랜치와 협업' },
      developer:    { url: 'github-developer.html',     title: 'Git/GitHub 개발자편',   desc: 'CI/CD와 자동화' },
      related: ['deployment', 'cursor', 'claude-code', 'devinterface'],
      prereqs: { beginner: ['devinterface-beginner'], intermediate: [], developer: [] }
    },
    deployment: {
      name: '배포', icon: '🌐', color: '#00BCD4',
      beginner:     { url: 'deployment-beginner.html',     title: '배포 초보자편',        desc: '사이트를 세상에 공개하기' },
      intermediate: { url: 'deployment-intermediate.html',  title: '배포 중급자편',        desc: '커스텀 도메인과 HTTPS' },
      developer:    { url: 'deployment-developer.html',     title: '배포 개발자편',        desc: 'CI/CD 파이프라인 구축' },
      related: ['github', 'lovable', 'cursor', 'devinterface'],
      prereqs: { beginner: ['github-beginner'], intermediate: ['github-intermediate'], developer: ['github-developer'] }
    },
    google: {
      name: '구글 생태계', icon: '🔍', color: '#4285F4',
      beginner:     { url: 'google-beginner.html',     title: '구글 생태계 초보자편',   desc: 'Docs, Sheets, Forms 활용' },
      intermediate: { url: 'google-intermediate.html',  title: '구글 생태계 중급자편',   desc: 'Apps Script 자동화' },
      developer:    { url: 'google-developer.html',     title: '구글 생태계 개발자편',   desc: 'Cloud Functions, API 개발' },
      related: ['aistudio', 'chatgpt', 'prompt', 'deployment'],
      prereqs: { beginner: [], intermediate: [], developer: ['github-beginner'] }
    }
  },

  special: [
    { id: 'ai-intro',            url: 'ai-intro.html',            title: 'AI 교육 철학',     icon: '🎓', color: '#1565C0' },
    { id: 'ai-science',          url: 'ai-science.html',          title: 'AI 과학교육',      icon: '🔬', color: '#00695C' },
    { id: 'compare',             url: 'compare.html',             title: '도구 비교',        icon: '⚖️', color: '#5A4ED9' },
    { id: 'ai-compare',          url: 'ai-compare.html',          title: 'AI 비교',         icon: '🤖', color: '#5A4ED9' },
    { id: 'harness-engineering',  url: 'harness-engineering.html',  title: '하네스 엔지니어링',      icon: '⚙️', color: '#6366F1' },
    { id: 'claude-skills',        url: 'claude-skills.html',        title: '클로드 스킬 가이드',     icon: '🛠️', color: '#D97706' },
    { id: 'software-engineering', url: 'software-engineering.html', title: '소프트웨어 엔지니어링',  icon: '📐', color: '#0891B2' }
  ],

  paths: {
    beginner: [
      { tool: 'aistudio',  level: 'beginner' },
      { tool: 'lovable',   level: 'beginner' },
      { tool: 'lovable',   level: 'intermediate' }
    ],
    intermediate: [
      { tool: 'lovable',      level: 'intermediate' },
      { tool: 'antigravity',  level: 'beginner' },
      { tool: 'cursor',       level: 'beginner' }
    ],
    developer: [
      { tool: 'cursor',       level: 'developer' },
      { tool: 'claude-code',  level: 'developer' },
      { tool: 'antigravity',  level: 'developer' }
    ]
  },

  // 레벨 한국어 매핑
  levelNames: {
    beginner: '초보자편',
    intermediate: '중급자편',
    developer: '개발자편'
  }
};
