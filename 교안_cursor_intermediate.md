# 커서(Cursor) 중급자 교안 — 중급자편

> **대상**: AI 도구 경험자, 체계적인 프로젝트를 만들고 싶은 분
> **목표**: .cursor/rules, Composer, Agent Mode를 활용한 체계적인 프로젝트 개발
> **소요 시간**: 약 4~5시간

---

## 어떤 교안을 봐야 할까요?

- AI 코딩 도구(Copilot, ChatGPT 등)를 써본 경험이 있고, 프로젝트 단위 개발을 하고 싶다
- 커서 초보자편을 마쳤거나, Tab/Chat 기본 사용법을 알고 있다
- .cursor/rules, Composer, Agent Mode 등 심화 기능을 활용하고 싶다

> 코딩에 자신 있고 CLI·터미널 중심으로 작업한다면 → **개발자편** 교안을 추천합니다.
> 커서 자체가 처음이라면 → **초보자편** 교안을 먼저 보세요.

---

### 📌 추천 리소스

| 리소스 | 설명 | 링크 |
|--------|------|------|
| Cursor 공식 문서 | 기능별 상세 가이드 및 변경 로그 | [docs.cursor.com](https://docs.cursor.com) |
| Cursor 공식 포럼 | 커뮤니티 Q&A, 팁 공유 | [forum.cursor.com](https://forum.cursor.com) |
| 기획 도우미 Gem | PRD/IA/ERD 작성 도우미 (peace 제작/공유) | [Gem 바로가기](https://gemini.google.com/gem/1yC701ZmuJgy_D4hkyNz0t50EqAnBj3kh) |
| Cursor 101 유튜브 | 기능별 튜토리얼 영상 모음 | [YouTube](https://youtube.com/@cursor_ai) |

---

## 1. 바이브코딩 도구 비교

### 5개 도구 비교표

| 항목 | 러버블 | 안티그래비티 | 커서 | AI Studio | Claude Code |
|------|--------|-------------|------|-----------|-------------|
| **유형** | 웹 빌더 | 에이전트 IDE | AI IDE | 웹 빌더 | CLI 도구 |
| **설치** | 불필요 (웹) | 필요 (데스크톱) | 필요 (데스크톱) | 불필요 (웹) | 필요 (터미널) |
| **코딩 필요** | 불필요 | 선택적 | 선택적 | 불필요 | 필요 |
| **난이도** | 쉬움 | 보통 | 보통 | 매우 쉬움 | 어려움 |
| **추천 대상** | 비개발자~중급 | 입문자~개발자 | 중급~개발자 | 완전 입문자 | 개발자 |
| **핵심** | 노코드 빌더 | 에이전트 위임 | 코파일럿+에이전트 | 프로토타입 | 터미널 AI |

### 도구 선택 가이드

| 상황 | 추천 도구 |
|------|----------|
| 설치 없이 웹앱을 빠르게 만들고 싶을 때 | **러버블** |
| AI 에이전트에게 작업 전체를 위임하고 싶을 때 | **안티그래비티** |
| 코드를 직접 읽고 수정하면서 AI 도움을 받고 싶을 때 | **커서** |
| 바이브코딩을 가볍게 체험하고 싶을 때 | **AI Studio** |
| 터미널에서 모든 것을 해결하고 싶을 때 | **Claude Code** |

---

## 2. AI 코딩 워크플로우

### Tab → Composer → Agent 단계별 사용

| 기능 | 단축키 | 역할 | 사용 시점 |
|------|--------|------|----------|
| **Tab** | `Tab` 키 | 코드 자동완성 (한 줄~여러 줄) | 타이핑 중 제안 수락 |
| **Composer** | `Ctrl+I` | 멀티 파일 편집, 코드 생성 | 여러 파일을 동시에 수정할 때 |
| **Agent** | `Ctrl+Shift+I` | 자율 실행, 터미널 명령 포함 | 큰 기능을 통째로 맡길 때 |

### AI 코딩 5단계 워크플로우

```
1단계: 기획 — Chat에서 PRD/IA 작성, @codebase로 기존 코드 파악
  ↓
2단계: 스캐폴딩 — Agent Mode로 프로젝트 구조 생성, 패키지 설치
  ↓
3단계: 핵심 개발 — Composer + Tab으로 멀티 파일 편집
  ↓
4단계: 반복 개선 — Chat + Composer로 버그 수정, 리팩토링
  ↓
5단계: 배포 — Agent Mode로 빌드 설정, 배포 명령 실행
```

> **팁**: "Composer를 중심으로 작업하되, 큰 변경은 Agent Mode, 작은 수정은 Tab으로 처리하세요." — 활용 가이드

---

## 3. 사전 준비

### 계정 및 설치

| 항목 | 설명 | 필수 |
|------|------|------|
| **Cursor 다운로드** | [cursor.com](https://cursor.com)에서 설치 | 필수 |
| **Cursor 계정** | 이메일 또는 GitHub/Google 로그인 | 필수 |
| **GitHub 계정** | 코드 관리 및 배포 | 권장 |
| **Node.js** | 웹 프로젝트 개발 시 (LTS 권장) | 선택 |

### VS Code에서 마이그레이션

커서는 VS Code 포크(fork)이므로 첫 실행 시 "Import from VS Code"를 선택하면 확장, 테마, 키바인딩이 자동 복사됩니다. 단, Copilot 등 AI 확장은 충돌 방지를 위해 비활성화를 권장합니다.

### 요금제 선택 가이드

| 요금제 | 가격 | 추천 대상 |
|--------|------|----------|
| **Hobby** | 무료 | 체험/학습 |
| **Pro** | $20/월 | **중급자 추천** |
| **Team** | $40/월 | 팀 프로젝트 |
| **Pro Plus** | $60/월 | 헤비 사용자 |
| **Ultra** | $200/월 | 전문 개발자 |

### .cursor/rules 초기 설정

프로젝트 루트에 MDC(Markdown Cursor) 포맷으로 작성합니다:

```markdown
---
description: 프로젝트 전반 규칙
globs:
alwaysApply: true
---

# 프로젝트 기본 규칙
- 코드 주석과 UI 텍스트는 한국어, 변수명은 영어 camelCase
- React 19 + TypeScript + Tailwind CSS v4 + Vite
- 함수형 컴포넌트 + hooks, 파일당 하나의 컴포넌트
- Props에는 반드시 TypeScript 인터페이스 정의
```

### 사전 준비 체크리스트

- [ ] Cursor 최신 버전(v2.6) 설치 및 로그인
- [ ] VS Code 설정 마이그레이션 (해당 시)
- [ ] GitHub 계정 연결 (Settings → Accounts)
- [ ] .cursor/rules 파일 생성 완료

---

## 4. 기획 문서 작성 실습

### PRD / IA / ERD 개념

| 문서 | 역할 | 핵심 질문 |
|------|------|----------|
| **PRD** | 무엇을 만들 것인가? | 목적, 기능, 디자인 요구사항 |
| **IA** | 어떤 구조로 만들 것인가? | 페이지 구성, 네비게이션, 컴포넌트 트리 |
| **ERD** | 데이터를 어떻게 관리할 것인가? | 테이블 구조, 관계, 필드 정의 |

### Composer와 기획 문서 연동

1. `docs/PRD.md` 파일로 PRD 작성
2. Composer에서 `@file docs/PRD.md`로 참조
3. "이 PRD를 기반으로 프로젝트 구조를 만들어줘" 요청
4. Agent Mode가 파일 생성 및 패키지 설치 자동 수행

### @codebase 활용

`@codebase`를 사용하면 프로젝트 전체를 AI에게 참조시킬 수 있습니다:

```
@codebase 현재 프로젝트 구조를 분석하고,
새로운 '알림' 기능을 어디에 추가하면 좋을지 제안해줘.
```

### PRD/IA 작성 프롬프트 예시

```
온라인 포트폴리오 사이트의 PRD를 작성해줘.
포함: 프로젝트 개요, 핵심 기능(우선순위별), 페이지별 상세,
디자인 요구사항, 기술 스택 권장
대상: 프리랜서 개발자/디자이너
주요 기능: 프로필, 프로젝트 갤러리, 기술 스택, 연락처 폼, 블로그
```

```
@file docs/PRD.md 를 기반으로 IA(정보 구조)를 작성해줘.
포함: 사이트맵, 네비게이션 흐름, 페이지별 컴포넌트, 모바일/데스크톱 차이
```

---

## 5. 커서 심화 활용

### .cursor/rules 커스터마이징

| 설정 | 설명 | 예시 |
|------|------|------|
| `alwaysApply: true` | 모든 대화에 항상 적용 | 프로젝트 전역 규칙 |
| `globs: "src/**/*.tsx"` | 특정 파일 패턴에만 적용 | 컴포넌트 규칙 |
| `description` | 규칙의 목적 설명 | "API 호출 패턴" |

여러 Rules를 `.cursor/rules/` 디렉토리로 분리 관리합니다:

```
.cursor/rules/
├── global.mdc           ← 전체 프로젝트 규칙
├── react-components.mdc ← 컴포넌트 작성 규칙
├── api-patterns.mdc     ← API 호출 패턴
└── testing.mdc          ← 테스트 코드 규칙
```

### 모델 선택 전략

| 모델 | 특징 | 추천 용도 |
|------|------|----------|
| **Claude Sonnet 4** | 빠르고 정확 | 일반 코딩, 리팩토링 (기본 추천) |
| **Claude Opus 4** | 복잡한 추론 | 아키텍처 설계, 대규모 변경 |
| **GPT-4o** | 범용성 높음 | 문서 작성, 간단한 수정 |
| **Gemini 2.5 Pro** | 긴 컨텍스트 | 대규모 코드 분석 |

> "Claude Sonnet 4를 기본으로 사용하고, 복잡한 설계에만 Opus를 쓰면 비용도 절약됩니다." — 실사용자 조언

### 컨텍스트 관리

| 참조 방식 | 문법 | 용도 |
|----------|------|------|
| 파일 참조 | `@file 파일경로` | 특정 파일 추가 |
| 코드베이스 | `@codebase` | 프로젝트 전체 검색 |
| 폴더 참조 | `@folder src/components` | 폴더 내 파일 참조 |
| 웹 문서 | `@web 검색어` | 최신 문서/API 참조 |
| Git | `@git` | 최근 변경 이력 참조 |

### Notepads 활용

Notepads는 자주 재사용하는 프롬프트를 저장하는 기능입니다. Command Palette → "Notepad: Create"로 생성하고, `@notepad 이름`으로 참조합니다. 예: 컴포넌트 생성 규칙, API 호출 패턴 등을 Notepad로 저장해두면 매번 반복 입력할 필요가 없습니다.

### 핵심 단축키

| 단축키 | 기능 | 단축키 | 기능 |
|--------|------|--------|------|
| `Tab` | 자동완성 수락 | `Ctrl+K` | 인라인 수정 |
| `Ctrl+L` | Chat 열기 | `Ctrl+/` | 모델 전환 |
| `Ctrl+I` | Composer 열기 | `@` | 컨텍스트 추가 |
| `Ctrl+Shift+I` | Agent Mode | `Esc` | 제안 무시 |

---

## 6. 실전 프로젝트: Agent Mode 풀스택 웹앱

### 프로젝트: 온라인 포트폴리오 사이트

### Step 1: Chat으로 기획 상담

```
개인 포트폴리오 사이트를 만들려고 해.
React + TypeScript + Tailwind CSS 사용.
페이지: 히어로, 프로젝트 갤러리, 기술 스택, 연락처 폼, 다크/라이트 전환
docs/ 폴더에 PRD.md, IA.md로 기획 문서 작성해줘.
```

### Step 2: Agent Mode로 스캐폴딩

```
@file docs/PRD.md 기반으로 프로젝트 생성:
1. Vite + React + TypeScript 초기화
2. Tailwind CSS v4 설치/설정
3. 폴더 구조 (components, pages, hooks, utils)
4. 기본 레이아웃 (Header, Footer, Layout)
5. 다크모드 Context + 개발 서버 실행 확인
```

Agent가 터미널 명령과 파일 생성을 자동으로 수행합니다.

### Step 3: Composer로 반복 개선

```
@file src/pages/Projects.tsx
@file src/components/ProjectCard.tsx

프로젝트 갤러리 개선:
1. 카테고리별 필터 (전체/웹/모바일/기타)
2. 카드 호버 애니메이션
3. 클릭 시 모달 상세 정보
4. 반응형 그리드 (모바일 1열, 태블릿 2열, 데스크톱 3열)
```

> "Agent Mode로 골격을 잡고 Composer로 세부 기능을 추가하는 패턴이 가장 효율적이었어요." — 실사용자 후기

---

## 7. 배포

### 방법 1: Vercel (추천)

```
이 프로젝트를 Vercel에 배포해줘.
vercel CLI 설치 → vercel login → vercel --prod
```

또는 GitHub 연동: 커서 터미널에서 push → [vercel.com](https://vercel.com)에서 Import → 자동 배포

### 방법 2: Netlify

```
Netlify에 배포: netlify-cli 설치 → netlify init → netlify deploy --prod
```

### 방법 3: GitHub Pages

```
GitHub Pages 배포 설정:
vite.config.ts에 base 경로 → GitHub Actions 워크플로우 생성
```

커서 Agent Mode는 내장 터미널에서 배포 명령을 직접 실행하므로 에디터 안에서 모든 과정이 완료됩니다.

---

## 8. 데이터베이스 연결

### Supabase MCP 연동

Settings → MCP에서 Supabase MCP 서버를 추가하고, Agent Mode에서 DB 작업을 요청합니다:

```
Supabase MCP로 테이블 생성:
- profiles: id, name, email, avatar_url, bio
- projects: id, title, description, image_url, category, created_at
- contacts: id, name, email, message, created_at
profiles↔projects user_id 연결, RLS 정책 설정
```

### Prisma / Drizzle ORM

| ORM | 특징 | 설정 프롬프트 |
|-----|------|-------------|
| **Prisma** | 풍부한 생태계, 직관적 스키마 | "Prisma 설치 → schema.prisma 모델 → migrate dev" |
| **Drizzle** | 경량, TypeScript 네이티브 | "Drizzle ORM 설치 → TS 스키마 → DB push" |

### Agent 기반 DB 셋업

```
포트폴리오에 Supabase 인증+데이터 저장 추가:
1. 이메일/비밀번호 로그인  2. 프로필 관리 (CRUD)
3. 프로젝트 포스팅 (이미지 업로드)  4. 연락 폼 (DB 저장)
```

---

## 9. 외부 서비스 연동

### MCP 서버 연결

| 서비스 | MCP 서버 | 용도 |
|--------|---------|------|
| **Supabase** | @supabase/mcp-server | DB, 인증, 스토리지 |
| **GitHub** | @modelcontextprotocol/server-github | PR, 이슈 관리 |
| **Figma** | figma-mcp | 디자인 시안 가져오기 |
| **Sentry** | sentry-mcp | 에러 모니터링 |

### API 연동 및 환경 변수 관리

Agent Mode에서 외부 API를 통합합니다:

```
포트폴리오에 GitHub API 연동:
프로필 + 저장소(star 순) + 언어 통계 표시
```

환경 변수는 `.env.local` 파일로 관리하고, `.gitignore`에 반드시 추가합니다:

```bash
# .env.local (커밋하지 않음)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

> **주의**: API 키가 GitHub에 노출되면 악용될 수 있습니다. `.env.example`(값 빈칸)도 함께 생성하세요.

---

## 10. 문제가 생겼을 때 (트러블슈팅)

### 상황 1: Agent가 무한 루프에 빠져요

`Esc`로 즉시 중지 → 문제 범위를 좁혀서 재요청 → 작업을 작은 단위로 분할

### 상황 2: 컨텍스트 오버플로우

새 Composer 세션 시작 → `@file`로 필요한 파일만 지정 → `.cursorignore`로 불필요 파일 제외

### 상황 3: 인덱싱 오류

Command Palette → "Cursor: Rebuild Index" → `.cursorignore`에 `node_modules`, `dist` 추가

### 상황 4: 모델 전환 문제

`Ctrl+/`로 다른 모델 전환. Claude Sonnet이 가장 안정적인 기본 선택입니다.

### 상황 5: 충돌 해결

Checkpoint 기능으로 이전 상태 복원 → Git 히스토리에서 롤백 → Agent에게 충돌 부분 명시하여 해결 요청

### 상황 6: 속도 제한(Rate Limiting)

1~5분 대기 후 리셋. 대기 중 기획 문서 보완이나 코드 리뷰를 수행하세요.

---

## 11. 자주 묻는 질문 (FAQ)

### Q1. Background Agent는 안전한가요?

별도 브랜치에서 작업하므로 메인 코드에 바로 영향을 주지 않습니다. 병합 전 결과를 꼭 검토하세요.

### Q2. 커서가 생성한 코드의 소유권은?

사용자에게 있습니다. 상업적 용도로 자유롭게 사용 가능합니다.

### Q3. 오프라인에서도 작업할 수 있나요?

AI 기능은 인터넷 필요. 에디터 자체는 VS Code처럼 오프라인 사용 가능합니다.

### Q4. 팀원과 .cursor/rules를 공유할 수 있나요?

네. Git으로 관리하면 팀원 모두 동일한 AI 규칙을 적용받습니다.

### Q5. 데이터 프라이버시는 안전한가요?

Settings → Privacy에서 Privacy Mode를 활성화하면 코드가 AI 학습에 사용되지 않습니다.

### Q6. 여러 프로젝트를 동시에 관리할 수 있나요?

네. 커서 창을 여러 개 열어 독립적으로 작업할 수 있습니다.

### Q7. 비용을 최적화하려면?

Tab 자동완성 적극 활용, 간단한 작업은 Tab/Chat, 복잡한 작업만 Agent 사용, Claude Sonnet 기본으로 쓰고 Opus는 꼭 필요할 때만 사용하세요.

### Q8. 커뮤니티나 학습 자료는?

| 채널 | 링크 |
|------|------|
| Cursor 포럼 | [forum.cursor.com](https://forum.cursor.com) |
| Discord | [discord.gg/cursor](https://discord.gg/cursor) |
| Reddit | [reddit.com/r/cursor](https://reddit.com/r/cursor) |

---

## 12. 개발 효율화 전략

### 효율적 프롬프팅 패턴

| 원칙 | 나쁜 예 | 좋은 예 |
|------|---------|---------|
| **구체성** | "이쁘게 만들어줘" | "shadow-lg, rounded-xl, 호버 시 scale-105" |
| **범위** | "전체 앱 리팩토링" | "Header.tsx 네비게이션 로직만 수정" |
| **단계별** | "로그인부터 결제까지" | "1단계: 로그인 UI 먼저" |
| **참조** | "코드 고쳐줘" | "@file src/hooks/useAuth.ts 로그아웃 추가" |
| **맥락** | "에러 수정해줘" | "TypeError: Cannot read 'map' — 빈 데이터 처리" |

### .cursor/rules 자동화 예시

```markdown
---
description: API 호출 패턴
globs: "src/api/**/*.ts"
alwaysApply: false
---
- fetch 대신 axios 인스턴스 사용
- try-catch 에러 처리 필수
- 로딩/에러/성공 상태 커스텀 훅으로 래핑
- API 응답 타입은 TypeScript 제네릭 정의
```

### Composer 멀티 파일 패턴

```
@file src/components/ProjectCard.tsx
@file src/components/ProjectModal.tsx
@file src/styles/projects.module.css

위 3개 파일 동시 수정:
1. ProjectCard에 onClick 핸들러
2. ProjectModal 새로 생성
3. 모달 스타일 (백드롭, 슬라이드 인)
```

### Checkpoint 전략

| 시점 | 전략 |
|------|------|
| 큰 기능 추가 전 | Agent 실행 전 자동 생성 |
| 실험적 변경 전 | 수동 Checkpoint 생성 권장 |
| 문제 발생 시 | Checkpoint에서 복원 |
| 정상 확인 후 | Git commit으로 영구 저장 |

### Agent vs Composer 선택 기준

| 기준 | Composer | Agent |
|------|----------|-------|
| 터미널 명령 | 불가 | 가능 |
| 파일 생성 | 기존 파일 수정 | 새 파일 생성 가능 |
| 작업 범위 | 2~5개 파일 | 프로젝트 전체 |
| 제어 수준 | 높음 | 낮음 (자율 실행) |
| 추천 | 기능 수정, UI 변경 | 초기 설정, 배포 |

---

## 13. 다음 단계

커서 중급자편을 마치셨습니다! 다음 단계를 선택하세요:

| 방향 | 설명 | 추천 |
|------|------|------|
| **[커서 개발자편](cursor-developer.html)** | Background Agent, 병렬 에이전트, 고급 MCP | ★★★ |
| **[안티그래비티 중급자편](antigravity-intermediate.html)** | 에이전트 위임 방식의 개발 경험 | ★★☆ |
| **[Claude Code 개발자편](claude-code-developer.html)** | 터미널 기반 AI 코딩 (상급자용) | ★★☆ |
| **실전 프로젝트** | 포트폴리오를 넘어 SaaS 프로젝트 도전 | ★★★ |

### 학습 방향 로드맵

| 단계 | 학습 내용 | 예상 기간 |
|------|----------|----------|
| 현재 | Composer, Agent Mode, .cursor/rules | 1~2주 |
| 다음 | Background Agent, 병렬 에이전트(최대 8개) | 1주 |
| 심화 | MCP 서버 직접 구축, CI/CD 파이프라인 | 2~3주 |
| 고급 | 팀 협업 워크플로우, 엔터프라이즈 설정 | 지속적 |

---

## 전체 프로세스 요약

```
1단계: 기획 문서 작성
  ↓ Chat으로 PRD/IA 작성, @codebase로 구조 파악
2단계: Agent Mode로 스캐폴딩
  ↓ 프로젝트 생성, 패키지 설치, 초기 설정 자동화
3단계: Composer로 반복 개발
  ↓ 멀티 파일 편집, Tab 자동완성, Rules 최적화
4단계: 배포 및 운영
  ↓ Vercel/Netlify/GitHub Pages 배포, DB 연동, 유지보수
```

---

## 출처

| 출처 | 설명 |
|------|------|
| [Cursor 공식](https://cursor.com) | Cursor AI IDE 공식 사이트 |
| [Cursor Docs](https://docs.cursor.com) | 공식 문서 및 가이드 |
| [Cursor Forum](https://forum.cursor.com) | 커뮤니티 Q&A |
| [기획 도우미 Gem](https://gemini.google.com/gem/1yC701ZmuJgy_D4hkyNz0t50EqAnBj3kh) | PRD/IA/ERD 작성 도우미 (peace 제작/공유) |
