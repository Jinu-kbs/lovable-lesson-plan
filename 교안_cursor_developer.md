# 커서(Cursor) 개발자 교안 — 개발자편

> **대상**: 코딩 경험자, Cursor를 전문 개발 워크플로우에 통합하려는 개발자
> **목표**: Cursor의 아키텍처 이해, .cursor/rules 고급 설정, Background Agent·병렬 작업 활용
> **소요 시간**: 약 5~6시간

---

## 어떤 교안을 봐야 할까요?

| 항목 | 초보자편 | 중급자편 | **개발자편 (현재)** |
|------|---------|---------|-------------------|
| 코딩 경험 | 없음 | 약간 | **있음** |
| IDE 사용 경험 | 없음 | VS Code 정도 | **VS Code·터미널 능숙** |
| Git/GitHub | 모름 | 기초 | **PR·브랜치 전략 가능** |
| 학습 목표 | AI 자동완성 체험 | Composer 활용 | **.cursor/rules·Agent·배포** |
| 소요 시간 | 2시간 | 3~4시간 | **5~6시간** |

> Git, 터미널, 패키지 매니저 사용 경험이 없다면 → **초보자편** 또는 **중급자편**을 먼저 보세요.

---

### 추천 리소스

| 리소스 | 설명 | 링크 |
|--------|------|------|
| Cursor 공식 문서 | 기능별 상세 가이드 | [cursor.com/docs](https://docs.cursor.com) |
| cursor.directory | 커뮤니티 Rules 모음 | [cursor.directory](https://cursor.directory) |
| awesome-cursorrules | GitHub Rules 템플릿 | [GitHub](https://github.com/PatrickJS/awesome-cursorrules) |
| Cursor Changelog | 버전별 업데이트 내역 | [cursor.com/changelog](https://cursor.com/changelog) |

---

## 목차

1. [기술 아키텍처](#1-기술-아키텍처)
2. [사전 준비](#2-사전-준비)
3. [기획 문서 체계](#3-기획-문서-체계)
4. [빌드 전략](#4-빌드-전략)
5. [.cursor/rules 고급 설정](#5-cursorrules-고급-설정)
6. [GitHub 연동](#6-github-연동)
7. [외부 서비스 연동](#7-외부-서비스-연동)
8. [배포 및 운영](#8-배포-및-운영)
9. [마이그레이션](#9-마이그레이션)
10. [디버깅 가이드](#10-디버깅-가이드)
11. [Background Agent & 병렬 작업](#11-background-agent--병렬-작업)
12. [다음 단계](#12-다음-단계)

---

## 1. 기술 아키텍처

### VS Code 포크 구조

Cursor는 Anysphere가 개발한 VS Code 포크 기반 AI-네이티브 IDE입니다. Electron 위에서 동작하며 VS Code의 확장 생태계를 거의 그대로 사용할 수 있습니다.

| 계층 | 설명 |
|------|------|
| **UI Layer** | VS Code 기반 에디터 + Composer 패널 + Agent 채팅 |
| **AI Layer** | Tab(자동완성), Composer(멀티파일 편집), Agent(자율 실행) |
| **Model Router** | 작업 유형에 따라 cursor-small / 프론티어 모델 자동 라우팅 |
| **Execution Layer** | 터미널 명령 실행, 파일시스템 조작, Git 연동 |
| **Index Layer** | 로컬 persistent 코드베이스 인덱싱 (벡터 검색) |

### 3대 핵심 AI 기능

| 기능 | 역할 | 사용 모델 | 단축키 |
|------|------|----------|--------|
| **Tab** | 코드 자동완성 (인라인 제안) | cursor-small (저지연 전용) | `Tab` |
| **Composer** | 멀티파일 동시 편집 | Claude Sonnet, GPT-4o 등 | `Cmd/Ctrl+I` |
| **Agent** | 자율 실행 (터미널·파일·브라우저) | Claude Sonnet, Gemini 2.5 Pro 등 | `Cmd/Ctrl+Shift+I` |

### 모델 선택 전략

Cursor는 작업 유형에 따라 최적의 모델을 선택해야 합니다:

| 작업 유형 | 추천 모델 | 이유 |
|----------|----------|------|
| 인라인 자동완성 | cursor-small | 50ms 이내 응답, 코드 특화 |
| 단일 파일 편집 | Claude 4 Sonnet | 정확도와 속도 균형 |
| 멀티파일 리팩토링 | Claude 4 Sonnet | 긴 컨텍스트, 높은 정확도 |
| 복잡한 아키텍처 설계 | Gemini 2.5 Pro | 100만 토큰 컨텍스트 |
| 빠른 프로토타이핑 | GPT-4o | 응답 속도 빠름 |

> 모델 설정은 Cursor Settings → Models에서 변경할 수 있습니다. 프로젝트 특성에 맞는 모델을 기본으로 지정하세요.

### IDE 비교표

| 항목 | Cursor | AntiGravity | VS Code + Copilot | Windsurf | Claude Code |
|------|--------|-------------|-------------------|----------|-------------|
| **기반** | VS Code 포크 | VS Code 포크 | VS Code | VS Code 포크 | CLI (터미널) |
| **AI 모델** | 멀티 모델 선택 | 멀티 모델 | GitHub Copilot | Claude 기반 | Claude |
| **Agent** | Agent + Background | 멀티 에이전트 | Copilot Agent | Cascade | 단일 에이전트 |
| **병렬 작업** | 최대 8개 | 지원 | 미지원 | 미지원 | 미지원 |
| **Rules 시스템** | MDC 포맷 | .agents/rules.md | .github/copilot | 자체 포맷 | CLAUDE.md |
| **비용** | $20/월~ | 무료 (프리뷰) | $10/월 | $15/월 | 종량제 |

### 보안 아키텍처

| 항목 | 설명 |
|------|------|
| **코드 전송** | AI 요청 시 관련 코드 스니펫이 클라우드로 전송됨 |
| **Privacy Mode** | 활성화 시 코드가 모델 학습에 사용되지 않음 |
| **로컬 인덱싱** | 코드베이스 인덱스는 로컬에 저장 |
| **SOC 2** | Anysphere SOC 2 Type II 인증 완료 |

---

## 2. 사전 준비

### 개발 환경 요구사항

| 항목 | 필수/권장 | 설명 |
|------|----------|------|
| **Node.js 18+** | 권장 | 대부분의 웹 프로젝트에서 필요 |
| **Git** | 필수 | 버전 관리 및 GitHub 연동 |
| **Python 3.10+** | 선택 | Python 프로젝트 시 |
| **Cursor v2.6+** | 필수 | 최신 Agent 기능 사용 |
| **GitHub 계정** | 권장 | 코드 관리 및 BugBot 사용 |

### .cursor/rules 디렉토리 구조

프로젝트 루트에 `.cursor/rules/` 디렉토리를 생성하여 AI 동작을 제어합니다:

```
프로젝트-루트/
├── .cursor/
│   └── rules/
│       ├── project.mdc        ← 프로젝트 전역 규칙 (Always)
│       ├── typescript.mdc     ← TS 파일 작업 시 자동 적용 (Auto)
│       ├── react.mdc          ← React 컴포넌트 규칙 (Auto)
│       ├── api-routes.mdc     ← API 라우트 규칙 (Auto)
│       └── deployment.mdc     ← 배포 관련 규칙 (Manual)
├── .cursorignore              ← 인덱싱 제외 파일
├── src/
└── package.json
```

### .cursorignore 설정

코드베이스 인덱싱에서 제외할 파일을 지정합니다. 인덱싱 최적화는 Agent 응답 속도에 직접적인 영향을 줍니다:

```
# .cursorignore
node_modules/
dist/
build/
.next/
coverage/
*.min.js
*.lock
*.log
```

### 보안 정책 설정

| 설정 | 설명 | 추천 환경 |
|------|------|----------|
| **Privacy Mode** | 코드가 모델 학습에 미사용 | 기업·민감 프로젝트 |
| **Allow List** | 허용할 터미널 명령어 목록 | 프로덕션 환경 |
| **Deny List** | 차단할 명령어 목록 | 모든 환경 |
| **모델 제한** | 특정 모델만 사용 허용 | 보안 중시 팀 |

### 개발 환경 체크리스트

- [ ] Cursor 최신 버전 설치 및 로그인
- [ ] Privacy Mode 정책 결정 및 설정
- [ ] 기본 AI 모델 선택 (Claude Sonnet 추천)
- [ ] VS Code 확장 마이그레이션 확인
- [ ] .cursor/rules/ 디렉토리 생성
- [ ] .cursorignore 설정 완료
- [ ] 코드베이스 인덱싱 완료 확인 (하단 상태바)

---

## 3. 기획 문서 체계

### PRD.md / IA.md 연동 전략

Cursor Composer와 Agent는 프로젝트 내 문서를 `@file` 참조로 직접 읽을 수 있습니다:

```
프로젝트-루트/
├── docs/
│   ├── PRD.md     ← 요구정의서
│   ├── IA.md      ← 정보 구조
│   └── ERD.md     ← 데이터 구조
├── .cursor/
│   └── rules/
│       └── project.mdc   ← "docs/ 디렉토리의 문서를 항상 참조할 것"
└── src/
```

### @codebase 통합 전략

`@codebase`를 활용하면 AI가 프로젝트 전체 맥락을 파악합니다:

```
@codebase 이 프로젝트의 전체 구조를 분석하고,
@file docs/PRD.md 에 정의된 기능 중 아직 구현되지 않은 것을 찾아줘.
```

### Notepads 활용

Notepads는 대화 간 지속되는 컨텍스트 저장소입니다. Composer나 Agent 채팅에서 `@notepad`로 참조할 수 있습니다:

| Notepad 용도 | 내용 예시 |
|-------------|----------|
| **아키텍처 결정** | 기술 스택 선택 이유, 설계 원칙 |
| **API 스펙** | 엔드포인트 목록, 요청/응답 형식 |
| **코딩 컨벤션** | 팀 코딩 스타일, 네이밍 규칙 |
| **배포 설정** | 환경변수, 배포 절차 |

### Composer 프롬프트 패턴

효과적인 Composer 프롬프트 작성법:

```
# 멀티파일 편집 패턴
@file src/types/user.ts 의 User 타입을 참조해서,
@file src/api/users.ts 에 CRUD API 함수를 만들고,
@file src/components/UserList.tsx 에 사용자 목록 컴포넌트를 구현해줘.

docs/ERD.md의 users 테이블 스키마를 기반으로 타입을 정의해줘.
```

> Composer에서 `@file`로 명시적으로 파일을 지정하면 AI가 정확한 컨텍스트에서 작업합니다. `@folder`로 디렉토리 단위 참조도 가능합니다.

---

## 4. 빌드 전략

### 전략 1: 풀 Agent 위임

Agent에게 전체 프로젝트를 자율적으로 구축하게 맡기는 방식입니다:

```
docs/PRD.md를 읽고 이 프로젝트를 처음부터 만들어줘.
Next.js 14 + TypeScript + Tailwind CSS + Prisma를 사용해.
1. 프로젝트 초기화 (npx create-next-app)
2. DB 스키마 생성 (docs/ERD.md 기반)
3. API 라우트 구현
4. UI 컴포넌트 구현
5. 테스트 코드 작성
각 단계를 순서대로 실행해줘.
```

**장점**: 빠른 프로토타이핑, 일관된 코드 스타일, 터미널 명령 자동 실행
**단점**: 대규모 프로젝트에서 컨텍스트 한계, 세밀한 제어 어려움

### 전략 2: 하이브리드 (추천)

개발자가 아키텍처를 설계하고, AI가 세부 구현을 담당하는 방식입니다:

1. **개발자**: 프로젝트 구조, 핵심 설정, .cursor/rules 작성
2. **Agent**: 보일러플레이트 코드, 반복 구현 자동 생성
3. **Composer**: 특정 파일 그룹의 정밀 편집, 리팩토링
4. **Tab**: 코딩 중 실시간 자동완성

```
이미 src/app/ 라우팅과 prisma/schema.prisma를 작성해뒀어.
Composer로 아래를 구현해줘:
@file prisma/schema.prisma 를 참조해서
1. src/lib/actions/ 하위에 Server Actions 생성
2. src/components/ 하위에 폼 컴포넌트 생성
3. src/app/(dashboard)/ 하위에 페이지 라우트 생성
```

### 전략 3: Tab + 수동 코딩

전통적인 코딩에 AI 자동완성만 보조로 사용하는 방식입니다:

```
# Tab 자동완성 활용 시나리오
- 함수 시그니처 입력 → Tab이 본문 제안
- 주석 작성 → Tab이 구현 코드 제안
- 테스트 패턴 입력 → Tab이 나머지 테스트 케이스 제안
- 타입 정의 → Tab이 관련 유틸리티 타입 제안
```

### 전략 선택 매트릭스

| 상황 | 추천 전략 | 이유 |
|------|----------|------|
| 새 프로젝트 MVP | 풀 Agent 위임 | 빠른 프로토타입 |
| 기존 코드베이스 확장 | 하이브리드 | 기존 패턴 유지 + AI 보조 |
| 레거시 리팩토링 | Composer 집중 | 정밀한 멀티파일 수정 |
| 알고리즘·로직 중심 | Tab + 수동 | 세밀한 제어 필요 |
| 대규모 팀 프로젝트 | 하이브리드 + Rules | 일관성 보장 |

---

## 5. .cursor/rules 고급 설정

### MDC 포맷 개요

Cursor v2.5부터 레거시 `.cursorrules` 파일이 `.cursor/rules/` 디렉토리의 MDC(Markdown Components) 포맷으로 대체되었습니다.

### Rule 유형

| 유형 | 적용 방식 | 용도 |
|------|----------|------|
| **Always** | 모든 AI 요청에 항상 적용 | 프로젝트 전역 규칙, 코딩 컨벤션 |
| **Auto** | glob 패턴에 매칭되는 파일 작업 시 자동 적용 | 파일 유형별 규칙 |
| **Manual** | `@rule` 참조 시에만 적용 | 특수 작업용 규칙 |

### MDC 파일 작성법

```markdown
---
description: TypeScript 프로젝트 코딩 규칙
globs: ["**/*.ts", "**/*.tsx"]
alwaysApply: false
---

# TypeScript 코딩 규칙

## 타입 시스템
- `any` 타입 사용 금지, `unknown` 사용 후 타입 가드 적용
- 인터페이스보다 `type` alias 선호
- 제네릭 타입 파라미터는 의미 있는 이름 사용 (T 대신 TData 등)

## 함수
- 함수는 단일 책임 원칙 준수
- 순수 함수 우선, 부수 효과 최소화
- 반환 타입을 명시적으로 표기
```

### 프로젝트 전역 규칙 예시

```markdown
---
description: 프로젝트 전역 규칙
alwaysApply: true
---

# 프로젝트 정보
- 이름: 팀 대시보드
- 기술 스택: Next.js 14, TypeScript, Tailwind CSS, Prisma, PostgreSQL
- 패키지 매니저: pnpm

# 코드 컨벤션
- 한국어 주석 사용
- 에러 메시지는 한국어로 작성
- 컴포넌트 파일명: PascalCase
- 유틸리티 파일명: camelCase

# 금지 사항
- console.log 커밋 금지 (console.error, console.warn만 허용)
- 인라인 스타일 금지 (Tailwind CSS 사용)
- 서버 컴포넌트에서 useState/useEffect 사용 금지

# 참조 문서
- docs/PRD.md: 요구사항 정의
- docs/IA.md: 정보 구조
- docs/ERD.md: 데이터 구조
```

### React 컴포넌트 Auto 규칙 예시

```markdown
---
description: React 컴포넌트 규칙
globs: ["src/components/**/*.tsx", "src/app/**/*.tsx"]
alwaysApply: false
---

# React 컴포넌트 규칙
- 함수형 컴포넌트만 사용
- Props 타입을 컴포넌트 파일 상단에 정의
- 컴포넌트당 하나의 파일 (Single File Component)
- 접근성(a11y): aria-label, role 속성 필수
- 반응형: 모바일 퍼스트 (sm → md → lg 순서)

# 폴더 구조
- ui/: 범용 UI 컴포넌트 (Button, Input, Modal)
- features/: 기능별 컴포넌트
- layouts/: 레이아웃 컴포넌트
```

### API 라우트 Auto 규칙 예시

```markdown
---
description: API 라우트 규칙
globs: ["src/app/api/**/*.ts"]
alwaysApply: false
---

# API 라우트 규칙
- 모든 엔드포인트에 에러 핸들링 필수
- 입력 값 검증에 Zod 사용
- 응답 형식: { success: boolean, data?: T, error?: string }
- HTTP 상태 코드 정확히 사용 (200, 201, 400, 401, 404, 500)
- Rate limiting 미들웨어 적용
```

### 레거시 .cursorrules 마이그레이션

```
# 기존 .cursorrules 파일을
.cursorrules (프로젝트 루트, 단일 파일)

# 새로운 MDC 포맷으로 전환
.cursor/rules/project.mdc    (alwaysApply: true)
.cursor/rules/typescript.mdc (globs: ["**/*.ts"])
.cursor/rules/react.mdc      (globs: ["**/*.tsx"])
```

> 레거시 `.cursorrules` 파일은 여전히 동작하지만, MDC 포맷은 파일 유형별 세밀한 규칙 적용이 가능하므로 마이그레이션을 추천합니다.

---

## 6. GitHub 연동

### 터미널 기반 Git 워크플로우

Cursor Agent는 터미널에서 Git 명령어를 직접 실행합니다:

```
이 프로젝트를 Git으로 초기화하고 GitHub에 올려줘.
저장소 이름: team-dashboard
.gitignore에 node_modules, .env, .next, dist 추가해줘.
```

### Cmd+K 터미널 활용

터미널에서 `Cmd+K` (Ctrl+K)를 누르면 자연어로 명령어를 생성할 수 있습니다:

```
# 자연어 → 명령어 변환 예시
"최근 3일간 변경된 파일 목록" → git log --since="3 days ago" --name-only
"main과 현재 브랜치의 차이" → git diff main...HEAD --stat
"마지막 커밋 취소하고 변경사항 유지" → git reset --soft HEAD~1
```

### PR 워크플로우

```
feature/user-auth 브랜치에서 인증 기능을 구현해줘.
완료되면:
1. 변경사항을 커밋
2. GitHub에 푸시
3. PR 설명에 변경사항 요약 작성
```

### BugBot 자동 수정

BugBot은 PR에서 자동으로 코드 이슈를 감지하고 수정합니다:

| BugBot 기능 | 설명 |
|------------|------|
| **자동 코드 리뷰** | PR 코드의 잠재적 버그 감지 |
| **수정 제안** | 인라인 코드 수정 제안 |
| **자동 수정 PR** | 감지된 이슈에 대한 수정 PR 자동 생성 |
| **CI 연동** | 테스트 실패 시 자동 분석 |

### CI/CD 연동

```
GitHub Actions CI/CD 파이프라인을 설정해줘:
1. PR 생성 시: ESLint + TypeScript 타입 체크 + 테스트 실행
2. main 병합 시: 자동 빌드 + Vercel 배포
3. .github/workflows/ci.yml 파일 생성
```

---

## 7. 외부 서비스 연동

### MCP 프로토콜 심층 이해

MCP(Model Context Protocol)는 AI 에이전트가 외부 서비스와 소통하는 표준 프로토콜입니다. Cursor Settings → MCP에서 서버를 추가합니다.

| MCP 서버 | 서비스 | 주요 기능 |
|---------|--------|----------|
| **supabase-mcp** | Supabase | DB 쿼리, 인증, 스토리지, Edge Functions |
| **firebase-mcp** | Firebase | Firestore, Auth, Hosting |
| **stripe-mcp** | Stripe | 결제, 구독, 인보이스 관리 |
| **figma-mcp** | Figma | 디자인 토큰, 컴포넌트 스펙 추출 |
| **github-mcp** | GitHub | 이슈, PR, 코드 검색, Actions |

### MCP 서버 설정 방법

Cursor Settings에서 JSON 형태로 MCP 서버를 등록합니다:

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server"],
      "env": {
        "SUPABASE_URL": "your-project-url",
        "SUPABASE_SERVICE_ROLE_KEY": "your-key"
      }
    }
  }
}
```

### MCP Apps: 인터랙티브 UI

Cursor v2.6에서 추가된 MCP Apps는 Agent 채팅 내에서 인터랙티브 UI를 렌더링합니다:

| MCP App | 기능 |
|---------|------|
| **Amplitude** | 분석 차트를 채팅 내에서 직접 표시 |
| **Figma** | 디자인 시안을 채팅 내에서 미리보기 |
| **Sentry** | 에러 로그를 시각적으로 확인 |

### Supabase 연동 실습

```
Supabase MCP를 사용해서 아래를 구현해줘:
1. users, posts, comments 테이블 생성 (ERD.md 기반)
2. Row Level Security(RLS) 정책 설정
3. 이메일/비밀번호 + Google OAuth 인증
4. Realtime 구독으로 실시간 댓글 업데이트
```

### 브라우저 도구 활용

Cursor의 브라우저 도구를 사용하면 Agent가 로컬 개발 서버를 열어 UI를 확인하고 테스트할 수 있습니다:

```
브라우저에서 localhost:3000을 열고:
1. 로그인 페이지 렌더링 확인
2. 폼 입력 후 제출 동작 테스트
3. 대시보드 페이지 로딩 확인
4. 반응형 레이아웃 (모바일/태블릿) 확인
```

### 커스텀 MCP 서버 기초

직접 MCP 서버를 만들어 Cursor에 연결할 수 있습니다:

```typescript
// 기본 MCP 서버 구조 (Node.js)
import { Server } from "@modelcontextprotocol/sdk/server";

const server = new Server({
  name: "my-custom-mcp",
  version: "1.0.0",
});

// 도구 정의
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [{
    name: "get_dashboard_data",
    description: "대시보드 데이터 조회",
    inputSchema: { type: "object", properties: { ... } }
  }]
}));
```

---

## 8. 배포 및 운영

### 배포 플랫폼 비교

| 플랫폼 | 적합한 프로젝트 | 장점 | Agent 연동 |
|--------|---------------|------|-----------|
| **Vercel** | Next.js 앱 | GitHub 연동, 프리뷰 배포 | CLI로 자동 배포 |
| **Netlify** | 정적 사이트, Jamstack | 간편 설정, 폼 처리 | CLI 배포 가능 |
| **Cloud Run** | 컨테이너 앱 | 서버리스, 자동 스케일링 | gcloud CLI |
| **Railway** | 풀스택 앱 | DB 포함, 간편 설정 | CLI 배포 가능 |
| **GitHub Pages** | 정적 사이트 | 무료, GitHub 통합 | gh-pages 패키지 |

### Vercel CLI 배포

```
Vercel에 이 프로젝트를 배포해줘:
1. vercel CLI 설치 (npm i -g vercel)
2. 환경변수 설정 (vercel env add)
3. 프리뷰 배포 (vercel)
4. 프로덕션 배포 (vercel --prod)
```

### 커스텀 도메인 설정

```
Vercel에 배포된 프로젝트에 커스텀 도메인을 연결해줘.
도메인: dashboard.example.com
DNS 설정 방법:
- CNAME: dashboard → cname.vercel-dns.com
```

### Background Agent 배포 자동화

Background Agent를 활용하면 배포 프로세스를 자동으로 실행할 수 있습니다:

```
Background Agent로 배포 파이프라인을 실행해줘:
1. 전체 테스트 실행 (실패 시 중단)
2. 빌드 (next build)
3. Lighthouse 성능 점검
4. Vercel 프로덕션 배포
5. 배포 URL 확인 및 상태 검증
```

### 모니터링 설정

| 도구 | 용도 | 연동 방법 |
|------|------|----------|
| **Sentry** | 에러 추적 | MCP 또는 SDK 직접 통합 |
| **Vercel Analytics** | 성능 모니터링 | 자동 활성화 |
| **Uptime Robot** | 가동 시간 모니터링 | URL 등록 |
| **LogRocket** | 사용자 세션 리플레이 | SDK 통합 |

---

## 9. 마이그레이션

### VS Code → Cursor

| 단계 | 작업 | 비고 |
|------|------|------|
| 1 | Cursor 설치 시 VS Code 설정 자동 임포트 | 대부분 자동 |
| 2 | 확장(Extensions) 호환성 확인 | 99% 호환 |
| 3 | 키바인딩 그대로 유지 | settings.json 동일 |
| 4 | .cursor/rules/ 디렉토리 추가 | Cursor 전용 |
| 5 | 코드베이스 인덱싱 실행 | 초기 1회 |

### AntiGravity → Cursor

| 단계 | 작업 | 비고 |
|------|------|------|
| 1 | 프로젝트 폴더를 Cursor에서 열기 | 파일 그대로 사용 |
| 2 | `.agents/rules.md` → `.cursor/rules/project.mdc` 변환 | 포맷 변경 필요 |
| 3 | Workflows → Notepads 또는 rules로 재구성 | 개념 매핑 |
| 4 | Plan Mode 프롬프트 → Agent 채팅으로 전환 | 유사한 기능 |

### Lovable → Cursor

| 단계 | 작업 | 비고 |
|------|------|------|
| 1 | 러버블에서 프로젝트를 GitHub에 내보내기 | 러버블 UI에서 |
| 2 | `git clone`으로 로컬에 받기 | 터미널 |
| 3 | Cursor에서 프로젝트 폴더 열기 | 코드 구조 분석 |
| 4 | `.cursor/rules/` 추가하여 규칙 설정 | Cursor 전용 |
| 5 | `npm install && npm run dev`로 로컬 실행 | 개발 시작 |

### Cursor → 다른 도구

Cursor에서 작업한 코드는 표준 프로젝트 구조이므로:

- VS Code, AntiGravity, Windsurf 등에서 그대로 열어서 작업 가능
- Git 히스토리 유지
- `.cursor/` 디렉토리만 제거하면 범용 프로젝트

### 마이그레이션 체크리스트

- [ ] 프로젝트 파일 이동/복제 완료
- [ ] 의존성 설치 (npm install) 정상
- [ ] 빌드 성공 확인 (npm run build)
- [ ] 기존 테스트 통과 확인
- [ ] .cursor/rules/ 설정 완료
- [ ] 코드베이스 인덱싱 완료
- [ ] Git 히스토리 보존 확인
- [ ] 환경변수 (.env) 설정 완료

---

## 10. 디버깅 가이드

### Debug Mode (v2.6)

Cursor v2.6에 추가된 Debug Mode는 터미널 에러를 자동 감지하여 수정을 제안합니다:

| 기능 | 설명 |
|------|------|
| **자동 에러 감지** | 터미널 출력에서 에러를 실시간 감지 |
| **원인 분석** | 에러 스택 트레이스를 분석하여 근본 원인 파악 |
| **수정 제안** | 코드 변경 사항을 diff로 제안 |
| **원클릭 적용** | 제안된 수정을 바로 적용 |

### Checkpoint 기반 롤백

Cursor는 대화별로 코드 상태를 자동 저장하는 Checkpoint 기능을 제공합니다:

```
# Checkpoint 활용 시나리오
1. Agent에게 리팩토링 요청
2. 결과가 예상과 다름
3. Checkpoint로 이전 상태로 롤백
4. 다른 접근 방식으로 재요청
```

> Checkpoint는 Git 커밋과 별개로 동작합니다. Agent 대화 내에서 각 응답 시점의 파일 상태를 저장하므로, Git 히스토리를 더럽히지 않고 안전하게 실험할 수 있습니다.

### 터미널 에이전트 디버깅

```
터미널에서 다음 에러가 발생했어: [에러 메시지 붙여넣기]
1. 에러 원인을 분석해줘
2. 관련 파일을 찾아서 수정해줘
3. 수정 후 다시 빌드해줘
```

### 일반 에러 패턴

| 에러 | 원인 | 해결 |
|------|------|------|
| `Module not found` | 의존성 미설치 또는 경로 오류 | `npm install` 또는 import 경로 확인 |
| `Type 'X' is not assignable` | TypeScript 타입 불일치 | 타입 정의 수정 또는 타입 가드 추가 |
| `CORS error` | API 도메인 차단 | next.config.js rewrites 또는 서버 CORS 설정 |
| `Hydration mismatch` | 서버/클라이언트 렌더링 불일치 | `'use client'` 지시어 추가 또는 dynamic import |
| `Build failed` | 구문 오류 또는 설정 문제 | 에러 로그 분석 후 수정 |
| `Agent 무한 루프` | 불명확한 프롬프트 | 구체적 종료 조건 명시 |

### 모델별 동작 차이

| 모델 | 특성 | 디버깅 시 주의점 |
|------|------|----------------|
| Claude Sonnet | 정확하지만 보수적 | 과도한 타입 체크, 불필요한 null 검사 |
| GPT-4o | 빠르지만 간혹 부정확 | 존재하지 않는 API 사용, 환각 가능 |
| Gemini 2.5 Pro | 긴 컨텍스트 처리 우수 | 응답 시간이 길 수 있음 |

---

## 11. Background Agent & 병렬 작업

### Background Agent 개요

Background Agent는 사용자 개입 없이 수 시간 동안 비동기적으로 작업을 수행합니다. 코드 생성, 테스트, 의존성 관리 등 시간이 오래 걸리는 작업에 적합합니다.

| 항목 | 설명 |
|------|------|
| **실행 환경** | 클라우드 샌드박스 (격리된 환경) |
| **실행 시간** | 수 시간까지 가능 |
| **사용자 개입** | 불필요 (완전 자율) |
| **결과 전달** | 완료 시 PR 또는 알림으로 전달 |
| **요금** | Pro 이상 플랜에서 사용 가능 |

### Background Agent 활용 사례

```
# 사례 1: 테스트 커버리지 확대
Background Agent로 src/ 하위의 모든 모듈에 대해
유닛 테스트를 작성해줘. 현재 커버리지는 40%이고,
80% 이상으로 올려줘.

# 사례 2: 의존성 업데이트
모든 npm 의존성을 최신 버전으로 업데이트하고,
Breaking changes가 있으면 코드를 수정해줘.
테스트가 모두 통과하는지 확인해줘.

# 사례 3: 코드 마이그레이션
이 프로젝트의 JavaScript 파일을 모두
TypeScript로 변환해줘. 타입 정의도 추가해줘.
```

### 병렬 Agent (Cursor 2.0+)

최대 8개의 Agent를 동시에 실행하여 작업을 분산 처리할 수 있습니다:

| 에이전트 | 담당 영역 | 작업 내용 |
|---------|----------|----------|
| Agent 1 | 프론트엔드 | UI 컴포넌트 개발 |
| Agent 2 | 백엔드 API | REST/GraphQL 엔드포인트 |
| Agent 3 | 데이터베이스 | 마이그레이션, 시드 데이터 |
| Agent 4 | 테스트 | 유닛·통합 테스트 |
| Agent 5 | 문서화 | API 문서, README |
| Agent 6~8 | 추가 기능 | 인증, 결제, 알림 등 |

> 각 Agent는 격리된 클라우드 샌드박스에서 실행됩니다. 파일 충돌을 방지하기 위해 작업 영역을 명확히 분리하세요.

### 대규모 프로젝트 분할 전략

| 전략 | 설명 | 적합한 상황 |
|------|------|-----------|
| **모듈 분리** | 기능별 디렉토리로 Agent 할당 | 마이크로서비스, 모노레포 |
| **레이어 분리** | 프론트/백/DB 레이어별 할당 | 풀스택 앱 |
| **단계별 실행** | Phase 1 → 2 → 3 순차 진행 | 의존성 있는 작업 |
| **독립 기능** | 서로 무관한 기능 병렬 처리 | 기능 확장기 |

### Agent 진행 상황 모니터링

```
# Agent 상태 확인 방법
1. Cursor 상단 Agent 패널에서 실행 중인 Agent 목록 확인
2. 각 Agent의 작업 로그 실시간 확인
3. 완료된 Agent의 변경사항 diff 검토
4. PR로 생성된 결과물 코드 리뷰
```

### 작업 조율 전략

```
# 충돌 방지 프롬프트 패턴
3개의 병렬 Agent를 실행할 거야:
- Agent A: src/features/auth/ 디렉토리만 수정
- Agent B: src/features/dashboard/ 디렉토리만 수정
- Agent C: src/features/settings/ 디렉토리만 수정
공유 파일(src/lib/, src/types/)은 수정하지 마.
공유 타입이 필요하면 각 feature 디렉토리 내에 로컬 타입을 정의해.
```

---

## 12. 다음 단계

Cursor 개발자편을 마치셨습니다. 다음 단계를 선택하세요:

| 방향 | 설명 | 추천 |
|------|------|------|
| **커스텀 MCP 서버 개발** | 팀 내부 도구를 MCP로 연결 | 고급 |
| **엔터프라이즈 배포** | Team/Ultra 플랜, SSO, 감사 로그 | 팀 리더 |
| **고급 Agent 패턴** | Background Agent 자동화 파이프라인 | 고급 |
| **cursor.directory 기여** | 커뮤니티 Rules 공유 | 커뮤니티 |
| **러버블 개발자편** | 노코드/로우코드 대비 이해 | 추천 |
| **안티그래비티 개발자편** | 멀티 에이전트 비교 체험 | 추천 |

### 학습 방향 매트릭스

| 현재 수준 | 다음 목표 | 추천 학습 |
|----------|----------|----------|
| Cursor 단독 사용 | 멀티 도구 활용 | AntiGravity + Claude Code 병행 |
| 개인 프로젝트 | 팀 프로젝트 | Team 플랜 + .cursor/rules 표준화 |
| 프론트엔드 중심 | 풀스택 | MCP 연동 + Background Agent |
| 수동 배포 | 자동 배포 | CI/CD + Background Agent 파이프라인 |

### 커뮤니티 리소스

| 리소스 | 설명 |
|--------|------|
| [cursor.directory](https://cursor.directory) | 커뮤니티 Rules 모음, 검색·공유 |
| [awesome-cursorrules](https://github.com/PatrickJS/awesome-cursorrules) | GitHub 기반 Rules 템플릿 |
| [Cursor Forum](https://forum.cursor.com) | 공식 커뮤니티 포럼 |
| [Cursor Discord](https://discord.gg/cursor) | 실시간 커뮤니티 채팅 |
| [Cursor Changelog](https://cursor.com/changelog) | 버전별 업데이트 내역 |

---

## 전체 흐름 요약

```
기획 (PRD.md / IA.md / ERD.md + Notepads 설정)
  ↓
설정 (.cursor/rules/ MDC 규칙 + .cursorignore + MCP 서버)
  ↓
빌드 (Agent 위임 / 하이브리드 / Tab+수동 전략 선택)
  ↓
검증 (Debug Mode + Checkpoint 롤백 + 테스트)
  ↓
배포 (Vercel/Railway CLI + Background Agent 자동화)
  ↓
운영 (모니터링 + BugBot PR 자동수정 + 병렬 Agent 활용)
```

---

## 출처

| 출처 | 설명 |
|------|------|
| [Cursor 공식 문서](https://docs.cursor.com) | 기능별 상세 가이드 |
| [Cursor Changelog](https://cursor.com/changelog) | 버전 업데이트 내역 |
| [cursor.directory](https://cursor.directory) | 커뮤니티 Rules 모음 |
| [awesome-cursorrules](https://github.com/PatrickJS/awesome-cursorrules) | GitHub Rules 템플릿 |
| [MCP 공식 스펙](https://modelcontextprotocol.io) | Model Context Protocol 표준 |
| [기획 도우미 Gem](https://gemini.google.com/gem/1yC701ZmuJgy_D4hkyNz0t50EqAnBj3kh) | PRD/IA/ERD 작성 도우미 (peace 제작/공유) |
