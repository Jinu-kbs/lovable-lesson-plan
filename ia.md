# IA (Information Architecture) — 김선생의 바이브코딩 가이드

## 관련 문서

| 문서 | 설명 |
|------|------|
| [CLAUDE.md](CLAUDE.md) | 클로드 지침서 (개발 워크플로우, 규칙) |
| [PRD.md](PRD.md) | 제품 요구사항 문서 (기능, 대상, 제약사항) |
| [erd.md](erd.md) | 데이터 구조 (엔티티, 관계, 저장소) |

## 사이트맵

```
/ (index.html) ─── 멀티 도구 허브 (인터랙티브 퀴즈, 도구 카드, 비교표)
│
├── 러버블 (Lovable)
│   ├── /lovable-beginner.html ─── 초보자편
│   ├── /lovable-intermediate.html ─── 중급자편
│   └── /lovable-developer.html ─── 개발자편
│
├── 안티그래비티 (AntiGravity)
│   ├── /antigravity-beginner.html ─── 초보자편
│   ├── /antigravity-intermediate.html ─── 중급자편
│   └── /antigravity-developer.html ─── 개발자편
│
├── 커서 (Cursor)
│   ├── /cursor-beginner.html ─── 초보자편
│   ├── /cursor-intermediate.html ─── 중급자편
│   └── /cursor-developer.html ─── 개발자편
│
├── AI Studio Builder
│   ├── /aistudio-beginner.html ─── 초보자편
│   ├── /aistudio-intermediate.html ─── 중급자편
│   └── /aistudio-developer.html ─── 개발자편
│
├── Claude Code
│   ├── /claude-code-beginner.html ─── 초보자편
│   ├── /claude-code-intermediate.html ─── 중급자편
│   └── /claude-code-developer.html ─── 개발자편
│
├── /compare.html ─── 도구 비교
│
└── 리다이렉트 스텁 (기존 URL 호환)
    ├── /beginner.html → lovable-beginner.html
    ├── /intermediate.html → lovable-intermediate.html
    └── /developer.html → lovable-developer.html
```

## 공통 코드

```
common.css ─── 교안 공통 스타일 (CSS 변수로 페이지별 오버라이드)
common.js  ─── 교안 공통 스크립트 (모바일 TOC, 백투탑, 스크롤 스파이, 코드 복사)
```

## 페이지별 구조

### 1. 메인 랜딩 (index.html) — 멀티 도구 허브

```
TopNav
├── 브랜드: "바이브코딩 가이드"
├── 드롭다운: "도구별 교안 ▼"
│   ├── 💗 러버블 ── 초보자 · 중급자 · 개발자
│   ├── 🚀 안티그래비티 ── 초보자 · 중급자 · 개발자
│   ├── 💻 커서 ── 초보자 · 중급자 · 개발자
│   ├── 🧪 AI Studio ── 초보자 · 중급자 · 개발자
│   └── ⚡ Claude Code ── 초보자 · 중급자 · 개발자
├── 링크: "도구 비교" (#compare)
└── 모바일: 햄버거 메뉴 (☰)

Hero 섹션
├── 프로필 이미지 (teacher_kim.png)
├── 제목: "김선생의 바이브코딩 가이드"
├── 소개 문구 (러버블, 커서, 안티그래비티 등)
├── SNS 링크 (Threads, Instagram)
├── AI 생성 자료 안내 문구
└── 이벤트 배지

인터랙티브 퀴즈 (2단계)
├── Q1: 만들고 싶은 것 → 도구 선택 (5개 옵션)
├── Q2: 기술 수준 → 수준 선택 (3개 옵션, 단일 수준 도구는 생략)
└── 결과: 추천 도구+수준 카드 (교안 링크 또는 "준비 중")

도구별 카드 그리드 (5개)
├── 💗 러버블 ── 초보자·중급자·개발자 링크
├── 🚀 안티그래비티 ── 초보자·중급자·개발자 링크
├── 💻 커서 ── 초보자·중급자·개발자 링크
├── 🧪 AI Studio ── 초보자·중급자·개발자 링크
└── ⚡ Claude Code ── 초보자·중급자·개발자 링크

도구 비교표 (#compare)
├── 유형, 설치, 코딩 필요, 주요 대상
├── 난이도, 무료 사용, 추천 대상
└── 교안 상태 (전체 제공 중)

이벤트 배너 (She Builds on Lovable)
├── 25시간 무료 빌드
├── $100 API 크레딧
└── $250 Stripe 크레딧

사용자 후기·질문 게시판 (localStorage)

Footer
├── 이벤트 안내 문구
└── 제공자 정보 + SNS 링크
```

### 2. 초보자편 (lovable-beginner.html)

```
TopNav: [바이브코딩 가이드(brand)] [초보자편(active)] [중급자편] [개발자편]

Sidebar (목차)                     Content (본문)
─────────────                     ──────────────
자가 진단                          어떤 교안을 봐야 할까요?
추천 리소스                        추천 리소스 테이블 (4개 링크)
1. 바이브코딩이란?                 바이브코딩 개념, 주목 이유, 학습 경로 다이어그램
2. 러버블이란?                     러버블 특징 테이블, 영어 UI 안내
3. 용어 해설                       10개 용어 테이블
4. 사전 준비                       GitHub/Vercel/Lovable 가입 가이드
  └ 체크리스트                     4항목 체크리스트
5. 아이디어 구상하기               시작 미션 3가지, 직군별 추천 테이블
                                   예시 프롬프트 3종 (교사/소상공인/프리랜서)
6. PRD 만들기                      PRD 개념, 작성법, 예시 (카페 사이트)
7. 러버블 실습                     이벤트 타이밍 경고, 시간 전략, Step 1~5 가이드
                                   프롬프트 예시 3종, 수정 요청 예시
8. 웹사이트 공개하기               방법 1: Publish / 방법 2: GitHub+Vercel / 방법 3: 수동
9. 이벤트 참여 미션                혜택 테이블, 크레딧 수령 타이밍, SNS 공유 방법
10. 트러블슈팅                     5개 문제 상황별 해결법 (카톡 캐시 포함)
11. FAQ                            9개 질문·답변 (크레딧 구분, Visual Edits 포함)
12. 주의사항 및 팁                 크레딧 관리, 자주 하는 실수 4가지, 실전 노하우, AI 검증 프롬프트
13. 다음 단계                      학습 방향 테이블
전체 흐름 요약                     5단계 플로우
출처                               출처 테이블 (4개 소스)
```

### 3. 중급자편 (lovable-intermediate.html)

```
TopNav: [바이브코딩 가이드(brand)] [초보자편] [중급자편(active)] [개발자편]

Sidebar (목차)                     Content (본문)
─────────────                     ──────────────
이 교안이 맞는 분                  대상 설명, 수준 안내
추천 리소스                        추천 리소스 테이블 (4개 링크)
1. 바이브코딩 도구 비교            4개 도구 비교 테이블 (Lovable/안티그래비티/커서/AI Studio)
                                   도구 선택 가이드, 학습 경로
2. 효율적인 워크플로우             5단계 워크플로우, 단계별 도구·비용 테이블
3. 사전 준비                       필수 계정 테이블, 체크리스트
4. 기획 문서 작성 실습             PRD/IA/ERD 작성법, 프롬프트 예시
  └ PRD/IA/ERD                     IA 예시 2종, 직군별 PRD 포인트 테이블
5. 러버블 심화 활용                Chat 모드 전략, 프롬프트 노하우
  └ Chat 모드/프롬프트/파일관리     역할부여/단계별/부정 프롬프트 예시
  └ UI/UX 흐름                     사용자 흐름 설계 팁
6. 실전 프로젝트                   직군별 추천 테이블, 온라인 강좌 사이트 실습
                                   Step 1~3 단계별 빌드 가이드
7. 배포                            방법 1: Publish / 방법 2: GitHub+Vercel
8. 데이터베이스 연결               DB 필요 여부 판단, 3개 외부 DB 비교 테이블
                                   Supabase 프롬프트 예시
9. 이벤트 참여 및 혜택             이벤트 타이밍 경고, 혜택 테이블, 크레딧 수령 타이밍, 시간 전략, SNS
10. 트러블슈팅                     6개 문제 상황별 해결법 (카톡 캐시, 규모 경고 포함)
11. FAQ                            8개 질문·답변 (크레딧 구분 포함)
12. 크레딧 최적화 전략             6가지 전략 테이블, AI 검증 프롬프트
13. 다음 단계                      5가지 방향 테이블
전체 프로세스 요약                 4단계 플로우
출처                               출처 테이블 (4개 소스)
```

### 4. 개발자편 (lovable-developer.html)

```
TopNav: [바이브코딩 가이드(brand)] [초보자편] [중급자편] [개발자편(active)]

Sidebar (목차)                     Content (본문)
─────────────                     ──────────────
이 교안이 맞는 분                  대상 설명, 추천 리소스 테이블 (4개 링크)
1. 기술 아키텍처                   스택 테이블 (React/Vite/TS/Tailwind/shadcn)
                                   프로젝트 디렉토리 구조, 포지셔닝 비교 테이블
                                   하이브리드 워크플로우 사례
2. 사전 준비                       필수 계정, 개발 환경 (Node/Git), 체크리스트
3. 기획 문서 체계                  PRD.md 템플릿 (기술 제약, P0/P1/P2 우선순위)
                                   IA.md 템플릿 (라우팅, 인증 흐름)
                                   ERD.md 템플릿 (SQL 스키마, RLS 정책)
4. 빌드 전략                       전략 1: 전체 투입 / 전략 2: 단계별 / 전략 3: 기존 코드
5. 코드 커스터마이징               로컬 실행, 주요 파일 분석, Tailwind/환경변수 설정
6. GitHub 연동                     러버블 연동, 하이브리드 워크플로우, 양방향 동기화
                                   브랜치 전략 (main/develop/feature)
7. 외부 서비스 연동                Supabase/Stripe/기타 연동 프롬프트 예시
8. 배포 및 운영                    Publish, Vercel CLI, 커스텀 도메인, 모니터링 도구
9. 마이그레이션                    로컬(VS Code/Cursor), Claude Code, 안티그래비티
                                   마이그레이션 체크리스트 테이블
10. 디버깅 가이드                  러버블/로컬/Supabase/Vercel 에러 해결
                                   일반적 문제 테이블, 프로젝트 규모 주의사항
11. 이벤트 참여 및 혜택            개발자 활용법 테이블, 시간 활용 전략
12. 다음 단계                      7가지 방향 테이블 (make/n8n 자동화 추가)
워크플로우 요약                    기획→빌드→운영 플로우
출처                               출처 테이블 (4개 소스)
```

### 5. 안티그래비티 초보자편 (antigravity-beginner.html)

```
TopNav: [바이브코딩 가이드(brand)] [초보자편(active)] [중급자편] [개발자편]

Sidebar (목차)                     Content (본문)
─────────────                     ──────────────
자가 진단                          어떤 교안을 봐야 할까요?
추천 리소스                        추천 리소스 테이블 (4개 링크)
1. 바이브코딩이란?                 바이브코딩 개념, 비교표, 학습 경로
2. 안티그래비티란?                 러버블과 비교, 주요 기능표, 영어 UI 안내
3. 용어 해설                       12개 용어 테이블
4. 사전 준비                       Google 계정, 앱 설치, Chrome 확장, 체크리스트
5. 아이디어 구상하기               직군별 추천, 프롬프트 예시 3종
6. 프롬프트 작성하기               PRD 개념, Plan Mode 활용법
7. 안티그래비티 실습               Step 1~5 (워크스페이스→결과 확인)
8. 프로젝트 공개하기               GitHub+Vercel, Firebase, 에이전트 배포
9. 무료 사용 안내                  퍼블릭 프리뷰, 향후 요금, 이벤트 관계
10. 트러블슈팅                     5개 상황별 해결법
11. FAQ                            8개 질문·답변
12. 주의사항 및 팁                 보안 정책, 실수, 노하우
13. 다음 단계                      학습 방향 테이블
전체 흐름 요약                     5단계 플로우
출처                               출처 테이블 (4개 소스)
```

### 6. 안티그래비티 중급자편 (antigravity-intermediate.html)

```
TopNav: [바이브코딩 가이드(brand)] [초보자편] [중급자편(active)] [개발자편]

Sidebar (목차)                     Content (본문)
─────────────                     ──────────────
자가 진단                          대상 설명, 수준 안내
추천 리소스                        추천 리소스 테이블 (4개 링크)
1. 도구 비교                       5개 도구 비교표, 도구 선택 가이드
2. 에이전트 워크플로우             Manager/Editor View, Plan/Fast Mode, 5단계
3. 사전 준비                       계정/설치, 보안 정책, Rules 초기 설정
4. 기획 문서 작성                  PRD/IA/ERD 개념, Plan Mode 연동, 프롬프트 예시
5. 심화 활용                       Rules 커스터마이징, Workflows, 모델 선택, 컨텍스트
6. 실전 프로젝트                   팀 대시보드 예시, Step 1~3
7. 배포                            Firebase/Vercel/GitHub Pages
8. 데이터베이스 연결               Supabase MCP, Firebase, 에이전트 DB 셋업
9. 외부 서비스 연동                MCP 서버, Stripe, 인증
10. 트러블슈팅                     6개 상황별 해결법
11. FAQ                            8개 질문·답변
12. 최적화 전략                    프롬프팅, Plan Mode 활용, Rules 자동화
13. 다음 단계                      학습 방향 테이블
전체 흐름 요약                     4단계 플로우
출처                               출처 테이블 (4개 소스)
```

### 7. 안티그래비티 개발자편 (antigravity-developer.html)

```
TopNav: [바이브코딩 가이드(brand)] [초보자편] [중급자편] [개발자편(active)]

Sidebar (목차)                     Content (본문)
─────────────                     ──────────────
자가 진단                          대상 설명, 추천 리소스 테이블
1. 기술 아키텍처                   VS Code 포크 구조, 에이전트 시스템, 모델 라우팅, IDE 비교
2. 사전 준비                       개발 환경, 보안 정책, Allow/Deny, .agents/ 구조
3. 기획 문서 체계                  PRD.md/IA.md/ERD.md 연동, Plan Mode
4. 빌드 전략                       풀 에이전트 위임 / 하이브리드 / 기존 코드 강화
5. Rules·Workflows·Skills         Global/Workspace Rules, 커스텀 Workflows, SKILL.md
6. GitHub 연동                     터미널 에이전트 Git, PR 워크플로우, CI/CD
7. 외부 서비스 연동                MCP 프로토콜, Supabase, 브라우저 에이전트 테스트
8. 배포 및 운영                    Firebase/Cloud Run/Vercel, 커스텀 도메인, 자동화
9. 마이그레이션                    Cursor→AG, VS Code→AG, Lovable→AG, AG→다른 도구
10. 디버깅 가이드                  Artifact 분석, 터미널/브라우저 디버깅, 에러 패턴
11. 멀티 에이전트 협업             병렬 작업, 역할 분배, 대규모 프로젝트 관리
12. 다음 단계                      학습 방향 테이블
전체 흐름 요약                     기획→빌드→운영 플로우
출처                               출처 테이블 (4개 소스)
```

### 8. 커서 초보자편 (cursor-beginner.html)

```
TopNav: [바이브코딩 가이드(brand)] [초보자편(active)] [중급자편] [개발자편]

Sidebar (목차)                     Content (본문)
─────────────                     ──────────────
자가 진단                          어떤 교안을 봐야 할까요?
추천 리소스                        추천 리소스 테이블 (4개 링크)
1. 바이브코딩이란?                 바이브코딩 개념, 비교표, 학습 경로
2. 커서란?                         Tab·Composer·Agent 3단계, 차이점 비교, 기능표
3. 용어 해설                       12개 용어 테이블
4. 사전 준비                       계정 생성, 앱 설치, VS Code 임포트, 체크리스트
5. 아이디어 구상하기               직군별 추천, 프롬프트 예시 3종
6. 프롬프트 작성하기               Chat vs Composer 선택, Agent Mode 활용
7. 커서 실습                       Step 1~5 (프로젝트 열기→결과 확인)
8. 프로젝트 공개하기               GitHub+Vercel, Netlify, 터미널 Git
9. 요금제 안내                     Hobby/Pro/Team 비교, 무료 한도
10. 트러블슈팅                     5개 상황별 해결법
11. FAQ                            8개 질문·답변
12. 주의사항 및 팁                 보안, 무료 한도, 실수, 노하우
13. 다음 단계                      학습 방향 테이블
전체 흐름 요약                     5단계 플로우
출처                               출처 테이블
```

### 9. 커서 중급자편 (cursor-intermediate.html)

```
TopNav: [바이브코딩 가이드(brand)] [초보자편] [중급자편(active)] [개발자편]

Sidebar (목차)                     Content (본문)
─────────────                     ──────────────
자가 진단                          대상 설명, 수준 안내
추천 리소스                        추천 리소스 테이블 (4개 링크)
1. 도구 비교                       5개 도구 비교표, 도구 선택 가이드
2. AI 코딩 워크플로우              Tab→Composer→Agent 단계별, 상황별 선택
3. 사전 준비                       계정/설치, VS Code 마이그레이션, Rules 설정
4. 기획 문서 작성                  PRD/IA 작성 → Composer 연동, @codebase
5. 심화 활용                       .cursor/rules, 모델 선택, Context, Notepads
6. 실전 프로젝트                   Agent Mode 풀스택 웹앱, Step 1~3
7. 배포                            Vercel/Netlify/GitHub Pages
8. 데이터베이스 연결               Supabase MCP, Prisma, Drizzle ORM
9. 외부 서비스 연동                MCP 서버, API 통합, 환경변수
10. 트러블슈팅                     6개 상황별 해결법
11. FAQ                            8개 질문·답변
12. 효율화 전략                    프롬프팅, Rules 자동화, Composer 패턴
13. 다음 단계                      학습 방향 테이블
전체 흐름 요약                     4단계 플로우
출처                               출처 테이블
```

### 10. 커서 개발자편 (cursor-developer.html)

```
TopNav: [바이브코딩 가이드(brand)] [초보자편] [중급자편] [개발자편(active)]

Sidebar (목차)                     Content (본문)
─────────────                     ──────────────
자가 진단                          대상 설명, 추천 리소스 테이블
1. 기술 아키텍처                   VS Code 포크, AI 모델 라우팅, Tab·Composer·Agent, IDE 비교
2. 사전 준비                       Node.js/Git, Rules 설정, 인덱싱 최적화
3. 기획 문서 체계                  PRD.md/IA.md → Composer 연동, @codebase 전략
4. 빌드 전략                       Agent 위임 / 하이브리드 / Tab+수동
5. .cursor/rules 고급              글로벌/프로젝트 Rules, MDC 형식, glob 패턴
6. GitHub 연동                     Git 통합, PR·리뷰, BugBot, CI/CD
7. 외부 서비스 연동                MCP 프로토콜, Supabase/Firebase/Stripe, MCP Apps
8. 배포 및 운영                    Vercel/Netlify/Cloud, 커스텀 도메인, Background Agent
9. 마이그레이션                    VS Code→Cursor, AG→Cursor, Lovable→Cursor
10. 디버깅 가이드                  Debug Mode, 체크포인트, 에러 패턴, 모델 특성
11. Background Agent & 병렬        Background Agent, 최대 8개 병렬, 대규모 프로젝트
12. 다음 단계                      MCP 서버 개발, 엔터프라이즈, 커뮤니티
전체 흐름 요약                     기획→빌드→운영 플로우
출처                               출처 테이블
```

### 11. AI Studio 초보자편 (aistudio-beginner.html)

```
TopNav: [바이브코딩 가이드(brand)] [초보자편(active)] [중급자편] [개발자편]

Sidebar (목차)                     Content (본문)
─────────────                     ──────────────
자가 진단                          어떤 교안을 봐야 할까요?
추천 리소스                        추천 리소스 테이블 (4개 링크)
1. 바이브코딩이란?                 바이브코딩 개념, 비교표, 학습 경로
2. AI Studio 빌드란?              Build 탭, Gemini 2.5 Pro, 차이점, 기능표
3. 용어 해설                       10개 용어 테이블
4. 사전 준비                       Google 계정, AI Studio 접속, 빌드 모드 진입
5. 아이디어 구상하기               프로토타입 중심, 프롬프트 예시 3종
6. 프롬프트 작성하기               효과적 프롬프트 패턴, 반복 수정
7. AI Studio 실습                  Step 1~4 (접속→프리뷰→수정)
8. 프로젝트 공개하기               내보내기, 공유 링크, 코드 다운로드
9. 무료 사용 안내                  무료 한도, Gemini API, 제한사항
10. 트러블슈팅                     5개 상황별 해결법
11. FAQ                            8개 질문·답변
12. 다음 단계                      학습 방향 테이블
전체 흐름 요약                     4단계 플로우
출처                               출처 테이블
```

### 12. Claude Code 개발자편 (claude-code-developer.html)

```
TopNav: [바이브코딩 가이드(brand)] [초보자편] [중급자편] [개발자편(active)]

Sidebar (목차)                     Content (본문)
─────────────                     ──────────────
자가 진단                          대상 설명, 추천 리소스 테이블
1. 도구 비교                       5개 도구 비교표, Claude Code 위치, CLI 장점
2. Claude Code란?                  에이전트형 CLI, MCP, 서브에이전트, 후크, 아키텍처
3. 사전 준비                       Node.js 18+, npm install, API 키/구독, CLAUDE.md
4. 핵심 기능                       대화형 코딩, 파일 편집, Git, 테스트 자동화
5. 고급 기능                       MCP 서버, 서브에이전트, 후크, 슬래시 커맨드, 음성 모드
6. 실전 프로젝트                   Step 1~3 (초기화→구현→배포)
7. CLAUDE.md & 프로젝트 설정       메모리 시스템, 지침, settings.json
8. GitHub 연동                     PR 생성, 코드 리뷰, CI, GitHub Actions
9. IDE 연동                        VS Code, JetBrains, 터미널 통합
10. 트러블슈팅                     6개 상황별 해결법
11. FAQ                            8개 질문·답변
12. 다음 단계                      MCP 서버 개발, 엔터프라이즈, 커뮤니티
전체 흐름 요약                     설치→설정→개발→배포 플로우
출처                               출처 테이블
```

### 13. AI Studio 중급자편 (aistudio-intermediate.html)

```
TopNav: [바이브코딩 가이드(brand)] [초보자편] [중급자편(active)] [개발자편]

Sidebar (목차)                     Content (본문)
─────────────                     ──────────────
자가 진단                          대상 설명, 수준 안내
추천 리소스                        추천 리소스 테이블 (4개 링크)
1. 도구 비교                       5개 도구 비교표, 도구 선택 가이드
2. AI Studio 심화 워크플로우       프롬프트 체이닝, 반복 개선 5단계
3. 사전 준비                       Google 계정, API 키 설정, 체크리스트
4. 기획 문서 작성 실습             PRD/IA 개념, Gemini Gem 연동
5. AI Studio 심화 활용             고급 프롬프트, 멀티 컴포넌트, CSS 커스텀
6. 실전 프로젝트                   멀티 섹션 대시보드, Step 1~3
7. 배포                            링크 공유, GitHub Export, Vercel
8. 외부 서비스 연동                Gemini API, Firebase 기초
9. 다른 도구로 발전하기            AI Studio → Lovable/Cursor 마이그레이션
10. 트러블슈팅                     5개 상황별 해결법
11. FAQ                            7~8개 질문·답변
12. 효율화 전략                    프롬프트 최적화, 세션 관리
13. 다음 단계                      학습 방향 테이블
전체 흐름 요약                     4단계 플로우
출처                               출처 테이블
```

### 14. AI Studio 개발자편 (aistudio-developer.html)

```
TopNav: [바이브코딩 가이드(brand)] [초보자편] [중급자편] [개발자편(active)]

Sidebar (목차)                     Content (본문)
─────────────                     ──────────────
자가 진단                          대상 설명, 추천 리소스 테이블
1. 기술 아키텍처                   AI Studio Build 내부, 코드 생성 구조, 도구 비교
2. 사전 준비                       GCP 프로젝트, API 키, Node.js, Git
3. 기획 문서 체계                  PRD.md/IA.md 템플릿, 기술 제약
4. 빌드 전략                       전략 3종 (프로토타입/하이브리드/API-first)
5. 코드 커스터마이징               Export 코드 분석, 의존성, 환경 변수
6. Gemini API 연동                 REST API, SDK, 스트리밍, 프롬프트 엔지니어링
7. 외부 서비스 연동                Firebase Auth/Firestore/Hosting, Cloud Functions
8. 배포 및 운영                    Firebase/Vercel/GitHub Pages, 모니터링
9. 마이그레이션                    AI Studio → Lovable/Cursor/AntiGravity 전환
10. 디버깅 가이드                  빌드·API·Export·배포 에러
11. 다음 단계                      심화 방향
전체 흐름 요약                     기획→빌드→운영 플로우
출처                               출처 테이블
```

### 15. Claude Code 초보자편 (claude-code-beginner.html)

```
TopNav: [바이브코딩 가이드(brand)] [초보자편(active)] [중급자편] [개발자편]

Sidebar (목차)                     Content (본문)
─────────────                     ──────────────
자가 진단                          어떤 교안을 봐야 할까요?
추천 리소스                        추천 리소스 테이블 (4개 링크)
1. 바이브코딩이란?                 바이브코딩 개념, 비교표, 학습 경로
2. Claude Code란?                  CLI 개념, GUI 도구 비교, "터미널 대화" 메타포
3. 용어 해설                       10~12개 용어 테이블
4. 사전 준비                       Node.js 설치, npm, Claude Code 설치, 인증
5. 아이디어 구상하기               CLI 초보 적합 프로젝트, 직업별 추천
6. 프롬프트 작성하기               대화법, 슬래시 명령, PRD 개념 (간단)
7. Claude Code 실습                Step 1~5 (터미널→프로젝트→커밋)
8. 프로젝트 공개하기               GitHub push, Vercel/Netlify 배포
9. 요금제 안내                     Max 구독, API 키, 무료 옵션
10. 트러블슈팅                     5개 상황별 해결법
11. FAQ                            8개 질문·답변
12. 주의사항 및 팁                 보안, 비용 관리, 흔한 실수
13. 다음 단계                      학습 방향 테이블
전체 흐름 요약                     5단계 플로우
출처                               출처 테이블
```

### 16. Claude Code 중급자편 (claude-code-intermediate.html)

```
TopNav: [바이브코딩 가이드(brand)] [초보자편] [중급자편(active)] [개발자편]

Sidebar (목차)                     Content (본문)
─────────────                     ──────────────
자가 진단                          대상 설명, 수준 안내
추천 리소스                        추천 리소스 테이블 (4개 링크)
1. 도구 비교                       5개 도구 비교표, Claude Code 포지셔닝
2. Claude Code 워크플로우          5단계, 세션 관리, /compact, /cost
3. 사전 준비                       Node.js/Git, CLAUDE.md, MCP 전제조건
4. 기획 문서 작성 실습             PRD/IA/ERD를 Claude Code로 생성
5. Claude Code 심화 활용           CLAUDE.md 마스터리, 모델 선택, 컨텍스트 관리
6. 실전 프로젝트                   풀스택 프로젝트 Step 1~3
7. 배포                            Vercel CLI, GitHub Pages, Netlify
8. MCP 서버 연동                   MCP란, Postgres/브라우저/파일 MCP
9. Git 워크플로우                  브랜치 전략, PR, 코드 리뷰
10. 트러블슈팅                     6개 상황별 해결법
11. FAQ                            8개 질문·답변
12. 효율화 전략                    프롬프트·세션·비용 최적화
13. 다음 단계                      학습 방향 테이블
전체 흐름 요약                     4단계 플로우
출처                               출처 테이블
```

### 17. 도구 비교 (compare.html)

```
TopNav: [바이브코딩 가이드(brand)] [도구 비교(active)]

Sidebar (목차)                     Content (본문)
─────────────                     ──────────────
1. 한눈에 비교                     확장 비교표 (13행×5열)
2. 도구별 상세                     5개 도구 카드 (특징·장단점·교안 링크)
3. 상황별 추천                     직군별 추천 매트릭스
4. 조합 활용                       도구 조합 전략
5. 요금 비교                       무료/유료 요금제 비교표
6. 학습 경로                       수준별 학습 순서 다이어그램
```

## 네비게이션 흐름

```
index.html (멀티 도구 허브)
    │
    ├─[드롭다운 메뉴]
    │   ├─ 러버블 → lovable-beginner / lovable-intermediate / lovable-developer
    │   ├─ 안티그래비티 → antigravity-beginner / antigravity-intermediate / antigravity-developer
    │   ├─ 커서 → cursor-beginner / cursor-intermediate / cursor-developer
    │   ├─ AI Studio → aistudio-beginner / aistudio-intermediate / aistudio-developer
    │   └─ Claude Code → claude-code-beginner / claude-code-intermediate / claude-code-developer
    │
    ├─[인터랙티브 퀴즈] → 추천 결과 → 교안 링크
    │
    ├─[도구 카드 클릭]
    │   └─ 러버블 카드 → lovable-beginner.html (교안 보기)
    │
    └─[도구 비교] → #compare (인라인 비교표)

lovable-beginner.html
    ├─[topnav 중급자편]──→ lovable-intermediate.html
    └─[topnav 개발자편]──→ lovable-developer.html

lovable-intermediate.html
    ├─[topnav 초보자편]──→ lovable-beginner.html
    └─[topnav 개발자편]──→ lovable-developer.html

lovable-developer.html
    ├─[topnav 초보자편]──→ lovable-beginner.html
    └─[topnav 중급자편]──→ lovable-intermediate.html

antigravity-beginner.html
    ├─[topnav 중급자편]──→ antigravity-intermediate.html
    └─[topnav 개발자편]──→ antigravity-developer.html

antigravity-intermediate.html
    ├─[topnav 초보자편]──→ antigravity-beginner.html
    └─[topnav 개발자편]──→ antigravity-developer.html

antigravity-developer.html
    ├─[topnav 초보자편]──→ antigravity-beginner.html
    └─[topnav 중급자편]──→ antigravity-intermediate.html

cursor-beginner.html
    ├─[topnav 중급자편]──→ cursor-intermediate.html
    └─[topnav 개발자편]──→ cursor-developer.html

cursor-intermediate.html
    ├─[topnav 초보자편]──→ cursor-beginner.html
    └─[topnav 개발자편]──→ cursor-developer.html

cursor-developer.html
    ├─[topnav 초보자편]──→ cursor-beginner.html
    └─[topnav 중급자편]──→ cursor-intermediate.html

compare.html
    └─[topnav 바이브코딩 가이드]──→ index.html

aistudio-beginner.html
    ├─[topnav 중급자편]──→ aistudio-intermediate.html
    └─[topnav 개발자편]──→ aistudio-developer.html

aistudio-intermediate.html
    ├─[topnav 초보자편]──→ aistudio-beginner.html
    └─[topnav 개발자편]──→ aistudio-developer.html

aistudio-developer.html
    ├─[topnav 초보자편]──→ aistudio-beginner.html
    └─[topnav 중급자편]──→ aistudio-intermediate.html

claude-code-beginner.html
    ├─[topnav 중급자편]──→ claude-code-intermediate.html
    └─[topnav 개발자편]──→ claude-code-developer.html

claude-code-intermediate.html
    ├─[topnav 초보자편]──→ claude-code-beginner.html
    └─[topnav 개발자편]──→ claude-code-developer.html

claude-code-developer.html
    ├─[topnav 초보자편]──→ claude-code-beginner.html
    └─[topnav 중급자편]──→ claude-code-intermediate.html

리다이렉트 스텁:
    beginner.html ──→ lovable-beginner.html
    intermediate.html ──→ lovable-intermediate.html
    developer.html ──→ lovable-developer.html
```

## 외부 링크 목록

| 대상 | URL | 사용 위치 |
|------|-----|-----------|
| Lovable | https://lovable.dev | 전 교안 |
| GitHub | https://github.com | 전 교안 |
| Vercel | https://vercel.com | 전 교안 |
| 기획 도우미 Gem | https://gemini.google.com/gem/1yC701ZmuJgy_D4hkyNz0t50EqAnBj3kh | 전 교안 |
| YouTube 영상 | https://youtu.be/bWY5n0GYgG8 | 전 교안 |
| Cool Hot Story | https://cool-hot-story.lovable.app | 전 교안 |
| 레고 학급경영 | https://brick-academy-hub.lovable.app/ | 전 교안 |
| 교사 진도 관리 앱 | https://teachers-vibe-sync.lovable.app/ | 중급자편 |
| 카카오 OG 캐시 초기화 | https://developers.kakao.com/tool/debugger/sharing | 초보자/중급자 트러블슈팅 |
| AntiGravity 공식 | https://antigravity.google | 안티그래비티 전 교안 |
| Google Codelabs | https://codelabs.developers.google.com/getting-started-google-antigravity | 안티그래비티 전 교안 |
| Google Developers Blog | https://developers.googleblog.com | 안티그래비티 전 교안 |
| Cursor 공식 | https://cursor.com | 커서 전 교안 |
| Cursor Docs | https://docs.cursor.com | 커서 전 교안 |
| Cursor Pricing | https://cursor.com/pricing | 커서 전 교안 |
| Google AI Studio | https://aistudio.google.com | AI Studio 교안 |
| AI Studio Docs | https://ai.google.dev/aistudio | AI Studio 교안 |
| Claude Code 공식 | https://docs.anthropic.com/en/docs/claude-code | Claude Code 교안 |
| Claude Code GitHub | https://github.com/anthropics/claude-code | Claude Code 교안 |
| MCP 프로토콜 | https://modelcontextprotocol.io | Claude Code 교안 |
| Threads | https://www.threads.net/@byeongseon_jinuchem | index.html |
| Instagram | https://www.instagram.com/byeongseon_jinuchem | index.html |

## 반응형 브레이크포인트

- **모바일** (≤768px): 사이드바 숨김 → 모바일 TOC 팝업 제공, 폰트 축소
- **모바일** (≤600px): index.html 1열 카드, 자가진단 1열
- **데스크톱** (>768px): 사이드바 + 본문 2열 레이아웃

## 공통 UX 요소 (교안 HTML)

- **모바일 목차(TOC)**: 하단 고정 버튼(☰) → 바텀시트 팝업
- **맨 위로 버튼**: 스크롤 400px 이상 시 하단 우측 표시
- **스크롤 스파이**: 현재 읽는 섹션을 사이드바에 하이라이트
- **코드 복사 버튼**: `<pre><code>` 블록에 호버 시 "복사" 버튼 표시
