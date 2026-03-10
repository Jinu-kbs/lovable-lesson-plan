# Claude Code 교안 — 중급자편

> **대상**: AI 도구 경험자, Claude Code 기본 사용법을 알고 워크플로우를 최적화하려는 분
> **목표**: MCP 연동, CLAUDE.md 활용, 멀티파일 프로젝트를 체계적으로 관리하기
> **소요 시간**: 약 4~5시간

---

## 이 교안이 맞는 분 (자가 진단)

- Claude Code를 설치하고 기본적인 대화형 코딩을 해본 경험이 있다
- 슬래시 커맨드(`/help`, `/model`, `/compact`)의 존재를 알고 있다
- 단일 파일 수정은 해봤지만, 멀티파일 프로젝트를 체계적으로 관리하고 싶다
- CLAUDE.md, MCP, 커스텀 커맨드 등 심화 기능을 활용하고 싶다

> CLI나 터미널 사용이 처음이라면 → **[초보자편](claude-code-beginner.html)** 교안을 먼저 보세요.
> 서브에이전트, 후크, CI/CD 자동화까지 다루고 싶다면 → **[개발자편](claude-code-developer.html)** 교안을 추천합니다.

---

### 📌 추천 리소스

| 리소스 | 설명 | 링크 |
|--------|------|------|
| Claude Code 공식 문서 | Anthropic 공식 사용법 가이드 | [docs.anthropic.com](https://docs.anthropic.com/en/docs/claude-code) |
| MCP 프로토콜 문서 | Model Context Protocol 공식 스펙 | [modelcontextprotocol.io](https://modelcontextprotocol.io) |
| Anthropic 블로그 | Claude Code 업데이트 및 활용 사례 | [anthropic.com/blog](https://www.anthropic.com/blog) |
| Claude Code GitHub | 오픈소스 저장소 및 이슈 트래커 | [GitHub](https://github.com/anthropics/claude-code) |

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

Claude Code는 **터미널에서 Claude와 대화하며 코딩하는 에이전트형 도구**입니다. GUI 없이 텍스트만으로 파일 생성, 편집, 빌드, 테스트, 배포를 모두 수행합니다.

### 도구 선택 가이드

| 상황 | 추천 도구 |
|------|----------|
| 설치 없이 웹앱을 빠르게 만들고 싶을 때 | **러버블** |
| AI 에이전트에게 작업 전체를 위임하고 싶을 때 | **안티그래비티** |
| 코드를 직접 읽고 수정하면서 AI 도움을 받고 싶을 때 | **커서** |
| 바이브코딩을 가볍게 체험하고 싶을 때 | **AI Studio** |
| 터미널에서 모든 것을 해결하고 싶을 때 | **Claude Code** |

---

## 2. Claude Code 워크플로우

### 5단계 개발 워크플로우

```
1단계: 초기화 — 프로젝트 생성, CLAUDE.md 설정, 의존성 설치
  ↓
2단계: 기획 — PRD/IA/ERD 문서 작성, 구조 설계
  ↓
3단계: 구현 — 대화형 코딩, 멀티파일 편집, 기능 구현
  ↓
4단계: 테스트 — 단위 테스트 작성, 버그 수정, 리팩토링
  ↓
5단계: 배포 — Git 커밋, PR 생성, 프로덕션 배포
```

### 세션 관리

| 전략 | 명령어 | 설명 |
|------|--------|------|
| **컨텍스트 압축** | `/compact` | 대화가 길어질 때 요약하여 토큰 절약 |
| **비용 확인** | `/cost` | 현재 세션의 토큰 사용량과 비용 확인 |
| **대화 초기화** | `/clear` | 새로운 작업 시작 시 깨끗한 상태로 리셋 |
| **모델 변경** | `/model` | Sonnet ↔ Opus 전환 |

> **팁**: `/compact`는 장시간 작업 시 30~50회 대화마다 한 번씩 실행하세요. 특정 주제만 유지하려면 `/compact "API 구현 관련만 유지해줘"` 형태로 요청합니다. — 실사용자 조언

### 모델 선택 가이드

| 모델 | 특징 | 추천 용도 | 비용 |
|------|------|----------|------|
| **Claude Sonnet 4** | 빠르고 정확 | 일반 코딩, 파일 편집 | 낮음 |
| **Claude Opus 4** | 복잡한 추론 | 아키텍처 설계, 대규모 리팩토링 | 높음 |
| **Claude Haiku** | 초고속 응답 | 코드 포맷팅, 간단한 질문 | 매우 낮음 |

> "Sonnet 4를 기본으로 쓰다가 복잡한 설계에만 Opus로 전환하면 비용을 50% 이상 절약할 수 있어요." — 실사용자 조언

---

## 3. 사전 준비

### 개발 환경 확인

| 항목 | 필수/권장 | 확인 방법 |
|------|----------|----------|
| **Node.js 18+** | 필수 | `node --version` |
| **Git** | 필수 | `git --version` |
| **Claude Code** | 필수 | `claude --version` |
| **GitHub CLI (gh)** | 권장 | `gh --version` |

### CLAUDE.md 파일 설정

CLAUDE.md는 Claude Code의 **메모리 시스템**입니다. 프로젝트 루트에 생성하면 매 세션마다 자동으로 읽어갑니다.

```markdown
# CLAUDE.md — 프로젝트 규칙
## 프로젝트 개요
- Next.js 14 + TypeScript + Tailwind CSS
## 빌드 명령
- npm run dev / npm run build / npm test
## 코딩 컨벤션
- 함수형 컴포넌트 + hooks, 커밋 메시지 한국어
```

### .claude/settings.json 설정

```json
{
  "permissions": {
    "allow": [
      "Read", "Write", "Edit", "Glob", "Grep",
      "Bash(npm run *)", "Bash(npx *)", "Bash(git *)"
    ],
    "deny": ["Bash(rm -rf *)", "Bash(sudo *)"]
  }
}
```

### 사전 준비 체크리스트

- [ ] Node.js 18+ 설치 확인
- [ ] Git / Claude Code 설치 확인
- [ ] 인증 완료 (Max 구독 또는 API 키)
- [ ] CLAUDE.md 파일 생성
- [ ] .claude/settings.json 권한 설정
- [ ] MCP 서버 사전 요구사항 확인 (PostgreSQL, Chrome 등)

---

## 4. 기획 문서 작성 실습

### PRD / IA / ERD 개념

| 문서 | 역할 | 핵심 질문 |
|------|------|----------|
| **PRD** | 무엇을 만들 것인가? | 목적, 기능, 디자인 요구사항 |
| **IA** | 어떤 구조로 만들 것인가? | 페이지 구성, 네비게이션 |
| **ERD** | 데이터를 어떻게 관리할 것인가? | 테이블 구조, 관계, 필드 |

### Claude Code로 기획 문서 자동 생성

```bash
$ claude

> 온라인 포트폴리오 사이트를 만들려고 해.
> 프로젝트 기획 문서를 PRD.md, ia.md, erd.md로 작성해줘.
> 대상: 프리랜서 개발자, 주요 기능: 프로필, 갤러리, 기술 스택, 연락처 폼
```

### 기획 프롬프트 패턴

```bash
# PRD → IA → ERD 순서로 요청
> 이 프로젝트의 PRD를 작성해줘. 포함: 개요, 핵심 기능, 기술 스택
> PRD.md를 읽고 IA(정보 구조)를 작성해줘. 포함: 사이트맵, 컴포넌트
> PRD.md와 ia.md를 읽고 ERD(데이터 구조)를 작성해줘
```

### Claude Code를 기획 파트너로 활용

```bash
> 이 프로젝트의 구조를 분석하고 개선점을 제안해줘
> '알림' 기능을 추가하려면 어떤 파일을 수정해야 할지 분석해줘
> 현재 코드를 보고 리팩토링 계획을 우선순위별로 세워줘
```

> "PRD → IA → ERD 순서로 요청하면 놀라울 정도로 체계적인 문서가 나와요." — 실사용자 후기

---

## 5. Claude Code 심화 활용

### CLAUDE.md 3단계 계층 구조

| 단계 | 파일 위치 | 용도 |
|------|----------|------|
| **글로벌** | `~/.claude/CLAUDE.md` | 개인 코딩 스타일, 공통 규칙 |
| **프로젝트** | `프로젝트/CLAUDE.md` | 기술 스택, 빌드 명령, 컨벤션 |
| **하위 폴더** | `프로젝트/src/CLAUDE.md` | 모듈별 특화 규칙 |

하위 단계가 상위 단계를 오버라이드합니다. `/memory` 커맨드로 규칙을 빠르게 추가할 수 있습니다:

```bash
> /memory "이 프로젝트에서는 date-fns 대신 dayjs를 사용한다"
> /memory "API 응답은 항상 { success, data, error } 형태로 통일"
```

### 커스텀 슬래시 커맨드

`.claude/commands/` 디렉토리에 마크다운 파일을 생성하면 나만의 커맨드를 만들 수 있습니다:

```markdown
<!-- .claude/commands/review.md -->
현재 Git diff를 분석하고 코드 리뷰를 수행해줘.
체크: 1. 버그 가능성 2. 성능 이슈 3. 보안 취약점 4. 테스트 누락
```

```bash
> /review                                    # 커스텀 커맨드 실행
> /refactor src/components/Dashboard.tsx     # 파일 지정 커맨드
```

### 컨텍스트 관리

컨텍스트가 커지면 `.claudeignore`로 불필요한 파일을 제외합니다:

```
node_modules/
dist/
.next/
*.min.js
*.lock
```

### 권한 설정 (allow/deny)

```json
{
  "permissions": {
    "allow": [
      "Read", "Write", "Edit", "Glob", "Grep",
      "Bash(npm run *)", "Bash(git add *)", "Bash(git commit *)"
    ],
    "deny": [
      "Bash(rm -rf *)", "Bash(sudo *)", "Bash(chmod 777 *)"
    ]
  }
}
```

> **팁**: `allow`에 등록된 명령은 확인 없이 실행됩니다. 처음에는 최소 권한만 허용하세요.

### 멀티파일 작업

```bash
> Header.tsx, Footer.tsx, layout.css를 통일된 디자인으로 수정해줘
> 프로젝트에서 console.log를 모두 찾아서 logger로 교체해줘
> src/pages/ 파일들을 feature 기반 구조로 재배치해줘
```

---

## 6. 실전 프로젝트: API + 프론트엔드

### Step 1: 프로젝트 초기화 및 구조 설계

```bash
$ mkdir todo-fullstack && cd todo-fullstack && git init
$ claude

> 풀스택 할 일 관리 앱을 만들어줘.
> 구조: server/ (Express), client/ (React+Vite), shared/ (타입)
> 먼저 프로젝트를 초기화하고 CLAUDE.md를 생성해줘.
```

### Step 2: API 서버 구현

```bash
> server/에 Express API 서버를 구현해줘.
> 엔드포인트: GET/POST/PUT/DELETE /api/todos
> Zod 입력 검증, 에러 핸들링 미들웨어 포함.

> SQLite + better-sqlite3로 데이터 영속성을 추가해줘.
```

### Step 3: 프론트엔드 연결 및 테스트

```bash
> client/에 React 프론트엔드를 구현해줘.
> TodoList, TodoItem, AddTodo 컴포넌트, 카테고리 필터, 반응형 디자인

> API 서버와 프론트엔드를 동시에 실행하고 동작을 확인해줘.
```

> "기능별로 나눠서 요청하면 훨씬 정확하게 구현해요." — 실사용자 후기

---

## 7. 배포

### 방법 1: Vercel CLI (추천)

```bash
> 이 프로젝트를 Vercel에 배포해줘.
> vercel CLI 설치 → vercel login → vercel --prod
```

### 방법 2: GitHub Pages

```bash
> GitHub Pages 배포 설정: vite.config.ts base 경로 + GitHub Actions 워크플로우 생성
```

### 방법 3: Netlify

```bash
> Netlify에 배포: netlify-cli 설치 → netlify init → netlify deploy --prod
```

### 배포 자동화

커스텀 커맨드로 빌드 → 테스트 → 커밋 → 배포를 한 번에 실행할 수 있습니다:

```bash
> .claude/commands/deploy.md를 만들어줘. 빌드+테스트+커밋+Vercel 배포 한 번에 실행
> /deploy    # 이후 한 명령으로 배포
```

---

## 8. MCP 서버 연동

### MCP란? (Model Context Protocol)

MCP는 Claude Code를 외부 서비스와 연결하는 **표준 프로토콜**입니다.

```
Claude Code ←→ MCP 프로토콜 ←→ PostgreSQL / 브라우저 / GitHub / 파일시스템
```

### PostgreSQL MCP

```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": { "DATABASE_URL": "postgresql://user:pass@localhost:5432/mydb" }
    }
  }
}
```

```bash
> users 테이블에서 최근 가입한 10명을 조회해줘
> 월별 매출 통계를 SQL로 작성하고 실행해줘
```

### 브라우저 MCP (Puppeteer)

```json
{
  "mcpServers": {
    "browser": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-puppeteer"]
    }
  }
}
```

```bash
> 브라우저로 localhost:3000에 접속해서 회원가입 폼을 테스트해줘
```

### 파일시스템 MCP

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/me/projects"]
    }
  }
}
```

### MCP가 확장하는 능력

| 기본 기능 | MCP 확장 후 |
|----------|------------|
| 파일 읽기/쓰기 | + 데이터베이스 직접 쿼리 |
| 코드 검색 | + 웹 브라우저 테스트 |
| Git 작업 | + GitHub 이슈/PR 관리 |
| 터미널 명령 | + 외부 API 서비스 연동 |

> "MCP를 설정하면 단순 코딩 도구에서 풀스택 개발 어시스턴트로 업그레이드돼요." — 실사용자 후기

---

## 9. Git 워크플로우

### 브랜치 전략

```
main (안정) → develop (개발) → feature/기능명, fix/버그명
```

### 자동 커밋 및 PR 생성

```bash
> 변경사항을 커밋해줘. 메시지는 한국어로 작성해줘.
> git diff를 보여주고 커밋 메시지를 제안해줘
> 현재 브랜치의 변경사항으로 GitHub PR을 만들어줘.
```

### 코드 리뷰 및 충돌 해결

```bash
> gh pr diff 42를 분석하고 코드 리뷰를 해줘
> PR #42의 리뷰 코멘트를 확인하고 수정해줘
> 현재 머지 충돌을 분석하고 양쪽 의도를 살려 해결해줘
```

> **팁**: Claude Code는 `git diff`, `git log`를 분석하여 충돌의 맥락을 이해하고 양쪽 변경의 의도를 파악하여 통합합니다.

---

## 10. 문제가 생겼을 때 (트러블슈팅)

### 상황 1: 컨텍스트 오버플로

`/compact`로 대화 요약 → 심각하면 `/clear`로 새 세션 시작 → `.claudeignore`로 대형 파일 제외

### 상황 2: MCP 연결 실패

흔한 원인: npx 패키지 미설치(`-y` 옵션 확인), 환경 변수 누락(settings.json env 섹션), 서비스 미실행(PostgreSQL 등 시작 확인)

### 상황 3: 응답이 너무 느릴 때

`/model`로 Sonnet 전환 → `.claudeignore`에 `node_modules/`, `*.min.js` 추가

### 상황 4: 토큰 한도 초과

`/cost`로 비용 확인 → `/compact`로 압축 → Max 한도 초과 시 API 종량제 전환 고려

### 상황 5: Git 충돌 발생

```bash
> 현재 Git 충돌을 보여주고 해결해줘
> 충돌 마커를 찾아서 양쪽 의도를 살려 정리해줘
```

### 상황 6: 비용이 예상보다 많을 때

| 절감 전략 | 방법 |
|----------|------|
| 모델 선택 | 간단한 작업은 Sonnet, 복잡한 작업만 Opus |
| 컨텍스트 관리 | `/compact` 주기적 사용, `.claudeignore` 설정 |
| 범위 축소 | 한 번에 하나의 기능만 요청 |
| 세션 관리 | 작업 전환 시 `/clear`로 초기화 |

---

## 11. 자주 묻는 질문 (FAQ)

### Q1. CLAUDE.md는 반드시 있어야 하나요?

필수는 아니지만 **강력히 권장**합니다. 없으면 매 세션마다 프로젝트 규칙을 반복 설명해야 합니다.

### Q2. MCP 서버는 몇 개까지 연결할 수 있나요?

기술적 제한은 없지만 **3~5개 이내**가 권장됩니다. 많을수록 초기 로딩이 느려지고 컨텍스트를 더 소모합니다.

### Q3. 커스텀 커맨드와 CLAUDE.md의 차이는?

CLAUDE.md는 **매 세션 자동 적용**되는 프로젝트 규칙이고, 커스텀 커맨드는 **명시적 호출 시 실행**되는 반복 작업 자동화입니다.

### Q4. 세션을 끝내면 대화 기록이 사라지나요?

네, 세션 종료 시 맥락이 초기화됩니다. 중요한 결정은 `/memory`로 CLAUDE.md에 저장하세요.

### Q5. Cursor와 함께 쓸 수 있나요?

네, Cursor에서 UI 편집 + Claude Code로 백엔드/테스트/배포 자동화가 **인기 있는 조합**입니다.

### Q6. API 종량제 vs Max 구독?

매일 사용하면 Max($100/월), 주 2~3회면 API 종량제가 유리합니다.

### Q7. Windows에서 MCP를 사용할 수 있나요?

네, WSL 환경을 **권장**합니다. 네이티브 Windows에서는 일부 경로 문제가 발생할 수 있습니다.

### Q8. 생성된 코드의 품질은 믿을 수 있나요?

**반드시 직접 검토**해야 합니다. 보안 코드(인증, 권한)는 특히 주의하고, 테스트 커버리지를 높이는 것이 핵심입니다.

---

## 12. 효율화 전략

### 프롬프트 최적화

| 원칙 | 나쁜 예 | 좋은 예 |
|------|---------|---------|
| **구체성** | "코드 수정해줘" | "src/api/users.ts에서 에러 핸들링 추가" |
| **범위** | "전체 앱 리팩토링" | "UserService 클래스만 리팩토링" |
| **단계별** | "로그인부터 결제까지" | "1단계: 로그인 API 먼저" |
| **맥락** | "에러 수정" | "TypeError: Cannot read 'map' — 빈 배열 처리" |
| **참조** | "비슷하게 만들어줘" | "UserCard.tsx 패턴으로 ProductCard 생성" |

### 세션 전략

| 상황 | 전략 |
|------|------|
| 같은 기능 개발 중 | 이어가기 (맥락 유지) |
| 다른 작업 시작 | `/clear`로 새 세션 |
| 50회 이상 대화 | `/compact` 후 이어가기 |
| 응답 품질 저하 | 새 세션 시작 |

### CLAUDE.md 템플릿 (프로젝트 유형별)

**프론트엔드**: React + TypeScript + Tailwind, 함수형 컴포넌트, mobile-first 반응형

**API 서버**: Express + TypeScript + Prisma, RESTful, Zod 검증, 에러 미들웨어

**풀스택**: Next.js App Router, Server Components 우선, DB 마이그레이션 필수

### 비용 최적화

| 작업 | 추천 모델 | 절감 효과 |
|------|----------|----------|
| 코드 포맷팅, 간단한 수정 | Haiku | 90% 절감 |
| 일반 코딩, 파일 편집 | Sonnet | 기준 비용 |
| 아키텍처 설계, 디버깅 | Opus | 3~5배 비용 |

### AI 검증 프롬프트

```bash
> 방금 작성한 코드를 리뷰해줘. 버그, 보안, 성능 이슈 체크.
> 이 기능의 테스트를 작성하고 실행해줘. 엣지 케이스 포함.
> 프로젝트 코드 품질 분석: 타입 안정성, 에러 핸들링, 보안
```

---

## 13. 다음 단계

Claude Code 중급자편을 마치셨습니다! 다음 단계를 선택하세요:

| 방향 | 설명 | 추천 |
|------|------|------|
| **[Claude Code 개발자편](claude-code-developer.html)** | 서브에이전트, 후크, CI/CD 통합 | 심화 추천 |
| **Cursor 중급자편** | GUI 기반 AI 코딩 경험 비교 | 병행 추천 |
| **실전 프로젝트** | SaaS 프로젝트 도전 | 도전 추천 |

### 개발자편 미리보기

| 주제 | 설명 |
|------|------|
| **서브에이전트** | 복잡한 작업을 병렬로 분할 처리 |
| **후크 (Hooks)** | 이벤트 기반 자동화 (파일 저장 시 포맷팅 등) |
| **CI/CD 통합** | GitHub Actions에서 Claude Code 자동 실행 |
| **비대화형 모드** | `claude --print`로 스크립트에 통합 |
| **MCP 서버 개발** | 나만의 MCP 서버 직접 구축 |

### 학습 로드맵

| 단계 | 학습 내용 | 예상 기간 |
|------|----------|----------|
| 현재 | CLAUDE.md, MCP 연동, 멀티파일 관리 | 1~2주 |
| 다음 | 서브에이전트, 후크, 커스텀 커맨드 심화 | 1주 |
| 심화 | CI/CD 파이프라인, MCP 서버 개발 | 2~3주 |
| 고급 | 팀 워크플로우 구축, 엔터프라이즈 설정 | 지속적 |

---

## 전체 흐름 요약

```
1단계: 설정 — CLAUDE.md, settings.json, MCP 서버 연결
  ↓
2단계: 기획 — PRD/IA/ERD 문서 자동 생성, 구조 설계
  ↓
3단계: 구현·테스트 — 대화형 코딩, 멀티파일 편집, 테스트
  ↓
4단계: 배포 — Git 커밋, PR 생성, Vercel/Netlify/GitHub Pages
```

| 단계 | 핵심 활동 | 소요 시간 |
|------|----------|----------|
| **1. 설정** | CLAUDE.md, MCP 서버, 권한 설정 | 30분 |
| **2. 기획** | PRD/IA/ERD 작성, 구조 설계 | 30분~1시간 |
| **3. 구현·테스트** | 대화형 코딩, 기능 구현, 테스트 | 2~3시간 |
| **4. 배포** | Git 커밋, PR 생성, 배포 | 30분 |

---

## 출처

| 출처 | 설명 | 링크 |
|------|------|------|
| **Anthropic 공식 문서** | Claude Code 사용법 및 API 문서 | [docs.anthropic.com](https://docs.anthropic.com/en/docs/claude-code) |
| **MCP 프로토콜** | Model Context Protocol 공식 사이트 | [modelcontextprotocol.io](https://modelcontextprotocol.io) |
| **Anthropic 블로그** | Claude Code 업데이트 소식 | [anthropic.com/blog](https://www.anthropic.com/blog) |
| **Claude Code GitHub** | 오픈소스 저장소 | [github.com/anthropics/claude-code](https://github.com/anthropics/claude-code) |

---

> 이 교안은 **김선생의 바이브코딩 가이드** 프로젝트의 일부입니다.
> CLI가 처음이라면 [초보자편](claude-code-beginner.html)부터, 서브에이전트와 CI/CD까지 다루고 싶다면 [개발자편](claude-code-developer.html)을 참고하세요.
