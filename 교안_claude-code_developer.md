# Claude Code 개발자 교안 — 개발자편

> **대상**: 코딩 경험자, 터미널 기반 AI 개발 도구를 활용하려는 개발자
> **목표**: Claude Code로 에이전트형 CLI 개발 워크플로우 구축
> **소요 시간**: 약 4~5시간

---

## 어떤 교안을 봐야 할까요? (자가 진단)

Claude Code는 **개발자 전용 도구**입니다. 초보자편·중급자편이 별도로 존재하지 않으며, 이 교안이 유일한 Claude Code 교안입니다.

| 항목 | 필요 수준 |
|------|----------|
| 코딩 경험 | **필수** — JavaScript/Python/TypeScript 등 1개 이상 |
| 터미널 사용 | **필수** — cd, ls, npm, git 등 기본 명령어 숙지 |
| Git/GitHub | **필수** — 커밋, 브랜치, PR 경험 |
| Node.js/npm | **필수** — npm install, npx 사용 가능 |

> 위 항목 중 하나라도 해당하지 않는다면, **[Lovable 초보자편](lovable-beginner.html)** 또는 **[Cursor 초보자편](cursor-beginner.html)**으로 먼저 시작하세요.

---

### 추천 리소스

| 리소스 | 설명 | 링크 |
|--------|------|------|
| **Claude Code 공식 문서** | Anthropic 공식 사용법 가이드 | [docs.anthropic.com](https://docs.anthropic.com/en/docs/claude-code) |
| **Claude Code GitHub** | 오픈소스 저장소 및 이슈 트래커 | [GitHub](https://github.com/anthropics/claude-code) |
| **MCP 프로토콜 문서** | Model Context Protocol 공식 스펙 | [modelcontextprotocol.io](https://modelcontextprotocol.io) |
| **Anthropic 블로그** | Claude Code 업데이트 및 활용 사례 | [anthropic.com/blog](https://www.anthropic.com/blog) |

---

## 목차

1. [바이브코딩 도구 비교](#1-바이브코딩-도구-비교)
2. [Claude Code란?](#2-claude-code란)
3. [사전 준비](#3-사전-준비)
4. [핵심 기능](#4-핵심-기능)
5. [고급 기능](#5-고급-기능)
6. [실전 프로젝트](#6-실전-프로젝트)
7. [CLAUDE.md & 프로젝트 설정](#7-claudemd--프로젝트-설정)
8. [GitHub 연동](#8-github-연동)
9. [IDE 연동](#9-ide-연동)
10. [트러블슈팅](#10-트러블슈팅)
11. [FAQ](#11-faq)
12. [다음 단계](#12-다음-단계)

---

## 1. 바이브코딩 도구 비교

### 5대 바이브코딩 도구 비교표

| 항목 | Lovable | AntiGravity | Cursor | AI Studio | **Claude Code** |
|------|---------|-------------|--------|-----------|----------------|
| **유형** | 웹 빌더 (노코드) | 에이전트 IDE (GUI) | AI IDE (GUI) | 웹 IDE (노코드) | **에이전트 CLI (터미널)** |
| **인터페이스** | 웹 브라우저 | 데스크톱 앱 | 데스크톱 앱 | 웹 브라우저 | **터미널** |
| **대상** | 비개발자~개발자 | 비개발자~개발자 | 개발자 중심 | 비개발자~중급자 | **개발자 전용** |
| **AI 모델** | Claude | Gemini, Claude, GPT | 멀티 모델 선택 | Gemini | **Claude Sonnet 4, Opus 4** |
| **배포** | 원클릭 | 내장 배포 | 별도 설정 | Firebase 연동 | **별도 설정 (유연)** |
| **가격** | 무료~$20/월 | 무료 (프리뷰) | $20/월~ | 무료~ | **Max $100/월 또는 API 종량제** |

### Claude Code의 위치: 가장 강력한 CLI 도구

- **GUI가 없습니다** — 터미널에서 텍스트로만 상호작용합니다
- **코딩 지식이 필수입니다** — 파일 구조, 빌드 시스템, 배포 과정을 이해해야 합니다
- **가장 유연합니다** — 어떤 언어, 프레임워크, 프로젝트에서든 작동합니다
- **자동화에 최적입니다** — CI/CD, 스크립팅, 배치 처리가 가능합니다

### 도구 선택 가이드

| 상황 | 추천 도구 | 이유 |
|------|----------|------|
| 코딩 경험 없이 빠르게 웹앱 제작 | Lovable | 프롬프트만으로 완성 가능 |
| Google 생태계 기반 개발 | AntiGravity, AI Studio | Gemini + Firebase 네이티브 |
| GUI IDE에서 AI 코딩 보조 | Cursor | VS Code 기반, 직관적 |
| 터미널 기반 전문 개발 | **Claude Code** | 최고의 유연성과 자동화 |
| CLI + GUI 조합 | **Claude Code + Cursor** | 각각의 강점 활용 |

---

## 2. Claude Code란?

### 에이전트형 CLI의 개념

Claude Code는 Anthropic이 만든 **에이전트형 CLI 코딩 도구**입니다. 터미널에서 Claude AI와 대화하며 코드를 작성, 편집, 실행, 테스트, 배포할 수 있습니다.

"에이전트형"이란 단순한 텍스트 응답이 아니라, **스스로 도구를 선택하고 실행**할 수 있다는 뜻입니다. 파일을 읽고, 코드를 수정하고, 터미널 명령을 실행하고, Git 작업을 수행합니다.

```
$ claude

╭──────────────────────────────────────────╮
│ ✻ Welcome to Claude Code!                │
│   /help for available commands           │
╰──────────────────────────────────────────╯

> 이 프로젝트의 구조를 분석하고 README를 작성해줘
```

### 아키텍처

```
사용자 입력 (자연어)
    ▼
Claude AI 분석 (의도 파악, 계획 수립)
    ▼
도구 선택 & 실행
  ├── 파일 읽기/편집 (Read, Write, Edit)
  ├── Bash 실행 (빌드, 테스트)
  ├── 코드 검색 (Grep, Glob)
  ├── Git 조작 (commit, PR)
  ├── MCP 서버 (외부 서비스)
  └── 서브에이전트 (병렬 작업)
    ▼
결과 반환 & 다음 단계
```

### 핵심 특징

| 특징 | 설명 |
|------|------|
| **파일 편집** | 코드 파일을 직접 읽고, 생성하고, 수정 |
| **코드 검색** | Grep, Glob으로 코드베이스 전체를 빠르게 검색 |
| **Git 통합** | 커밋, 브랜치, PR 생성, 코드 리뷰 자동 처리 |
| **Bash 실행** | 터미널 명령 직접 실행 (빌드, 테스트, 배포) |
| **MCP 연결** | 외부 서비스(DB, API, 브라우저)와 연결 |
| **서브에이전트** | 복잡한 작업을 병렬로 분할 처리 |

### 지원 모델

| 모델 | 특징 | 용도 |
|------|------|------|
| **Claude Sonnet 4** | 빠르고 정확한 기본 모델 | 일반 개발 작업 |
| **Claude Opus 4** | 최고 성능, 복잡한 추론 | 아키텍처 설계, 대규모 리팩토링 |

> 💡 **팁**: Sonnet 4는 대부분의 코딩 작업에 충분합니다. 모델 전환은 `/model` 명령으로 가능합니다.

---

## 3. 사전 준비

### 개발 환경 요구사항

| 항목 | 필수/권장 | 설명 |
|------|----------|------|
| **Node.js 18+** | 필수 | Claude Code 실행 런타임 |
| **Git** | 필수 | 버전 관리 및 GitHub 연동 |
| **GitHub 계정** | 권장 | PR 생성 및 코드 리뷰 자동화 |
| **VS Code** | 선택 | IDE 연동 시 필요 |

### 설치 및 인증

```bash
# 1. Node.js 버전 확인 (18 이상 필요)
node --version

# 2. Claude Code 글로벌 설치
npm install -g @anthropic-ai/claude-code

# 3. 설치 확인
claude --version

# 4. 첫 실행 — 인증 과정 시작
claude
```

> 💡 **팁**: `npx @anthropic-ai/claude-code`로 설치 없이 바로 실행할 수도 있습니다.

#### 인증 방법 1: Max 구독 (추천)

| 플랜 | 가격 | 포함 내용 |
|------|------|----------|
| **Max 5x** | $100/월 | 일반 사용량의 5배 |
| **Max 20x** | $200/월 | 일반 사용량의 20배 |

```bash
# "Login with Claude.ai" 선택 → 브라우저에서 인증
claude
```

#### 인증 방법 2: API 키 (종량제)

```bash
export ANTHROPIC_API_KEY="sk-ant-xxxxx"
claude
```

> 💡 **팁**: 2026년 러버블데이 이벤트 참가자는 API 크레딧을 제공받을 수 있습니다.

### CLAUDE.md 파일 생성

CLAUDE.md는 Claude Code의 **메모리 파일**입니다. 프로젝트 규칙을 기록하면 Claude가 매 세션마다 참고합니다.

```bash
# Claude에게 자동 생성 요청
> 이 프로젝트를 분석하고 CLAUDE.md를 생성해줘
```

### 사전 준비 체크리스트

- [ ] Node.js 18+ 설치 확인
- [ ] Claude Code 글로벌 설치
- [ ] 인증 완료 (Max 구독 또는 API 키)
- [ ] Git 설치 확인
- [ ] `claude` 실행 테스트
- [ ] CLAUDE.md 파일 생성

---

## 4. 핵심 기능

### 대화형 코딩

```bash
$ claude

> 새로운 Express.js API 서버를 만들어줘.
> /api/users 엔드포인트에 CRUD 기능을 추가하고,
> Zod로 입력 검증을 해줘.
```

Claude는 요청을 분석하고, 파일 생성, 패키지 설치, 코드 작성을 순서대로 실행합니다. 각 단계에서 사용자 승인을 요청합니다.

### 파일 읽기/쓰기/편집

```bash
> src/App.tsx 파일을 읽어줘
> src/components/Header.tsx 컴포넌트를 만들어줘
> Header 컴포넌트에 다크모드 토글 버튼을 추가해줘
> 모든 컴포넌트에서 className 대신 cn() 유틸리티를 사용하도록 변경해줘
```

### Git 통합

```bash
> 지금까지의 변경사항을 커밋해줘. 메시지는 한국어로 작성해줘.
> feature/dark-mode 브랜치를 만들고 체크아웃해줘
> 현재 브랜치의 변경사항으로 PR을 만들어줘.
```

### 테스트 실행 및 자동화

```bash
> 테스트를 실행해줘
> 실패한 테스트를 확인하고 코드를 수정해줘
> UserService에 대한 단위 테스트를 작성해줘
```

> 💡 **팁**: `claude "npm test를 실행하고, 실패하면 코드를 수정하고 다시 테스트해줘"` — 반복 작업도 한 문장으로 지시 가능합니다.

### 코드 검색

```bash
> 이 프로젝트에서 console.log를 사용하는 모든 곳을 찾아줘
> fetchUser 함수가 호출되는 모든 곳을 찾아줘
> 에러 핸들링이 누락된 API 호출을 찾아줘
```

### 주요 슬래시 커맨드

| 명령어 | 설명 |
|--------|------|
| `/help` | 사용 가능한 명령어 목록 |
| `/model` | AI 모델 변경 (Sonnet ↔ Opus) |
| `/memory` | CLAUDE.md에 정보 추가 |
| `/compact` | 대화 요약 (컨텍스트 절약) |
| `/clear` | 대화 초기화 |
| `/cost` | 현재 세션 비용 확인 |

---

## 5. 고급 기능

### MCP 서버 연결 (Model Context Protocol)

MCP는 Claude Code를 외부 서비스와 연결하는 프로토콜입니다.

```json
// .claude/settings.json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": { "DATABASE_URL": "postgresql://user:pass@localhost:5432/mydb" }
    },
    "browser": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-puppeteer"]
    }
  }
}
```

```bash
> PostgreSQL에서 users 테이블의 최근 가입자 10명을 조회해줘
> 브라우저로 localhost:3000에 접속해서 회원가입 폼을 테스트해줘
```

> 💡 **팁**: [modelcontextprotocol.io](https://modelcontextprotocol.io)에서 사용 가능한 MCP 서버 목록을 확인하세요.

### 서브에이전트 (병렬 작업)

복잡한 작업을 여러 서브에이전트로 분할하여 병렬 처리합니다:

```bash
> 이 프로젝트의 모든 API 엔드포인트에 대한 테스트를 작성해줘.
# Claude가 내부적으로 작업을 분할:
# - 서브에이전트 1: /api/users 테스트
# - 서브에이전트 2: /api/posts 테스트
# - 서브에이전트 3: /api/auth 테스트
```

### 후크 (Hooks) — 이벤트 기반 자동화

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [{
          "type": "command",
          "command": "npx prettier --write ${FILE_PATH}"
        }]
      }
    ],
    "Notification": [
      {
        "hooks": [{
          "type": "command",
          "command": "terminal-notifier -message '${MESSAGE}' -title 'Claude Code'"
        }]
      }
    ]
  }
}
```

| 후크 이벤트 | 실행 시점 | 활용 예시 |
|-------------|----------|----------|
| **PreToolUse** | 도구 실행 전 | 위험한 명령 차단 |
| **PostToolUse** | 도구 실행 후 | 자동 코드 포맷팅 |
| **Notification** | 알림 발생 시 | 데스크톱 알림 전송 |

### 커스텀 슬래시 커맨드

```markdown
<!-- .claude/commands/review.md -->
현재 Git diff를 분석하고 코드 리뷰를 수행해줘.
1. 버그 가능성 2. 성능 이슈 3. 보안 취약점 4. 테스트 누락
```

```bash
# 등록한 커맨드 사용
> /review
```

> 💡 **팁**: 글로벌 커맨드는 `~/.claude/commands/`, 프로젝트 커맨드는 `.claude/commands/`에 저장합니다.

### 음성 모드

```bash
claude --voice
# 🎤 "이 함수에 에러 핸들링을 추가해줘"
# 🎤 "테스트를 실행해줘"
```

### 비대화형 모드 (CI/CD용)

```bash
# 단일 명령 실행
claude --print "이 프로젝트의 보안 취약점을 분석해줘"

# 파이프와 조합
cat error.log | claude --print "이 에러 로그를 분석해줘"

# CI/CD에서 자동 코드 리뷰
git diff main..HEAD | claude --print "이 변경사항을 리뷰해줘"
```

---

## 6. 실전 프로젝트

### Step 1: 프로젝트 초기화

```bash
mkdir my-todo-app && cd my-todo-app
git init
claude
```

```bash
> Next.js 14 + TypeScript + Tailwind CSS로 할 일 관리 앱을 만들어줘.
> - 할 일 CRUD (생성, 읽기, 수정, 삭제)
> - 카테고리별 필터링
> - 반응형 디자인 (모바일 대응)
> 먼저 프로젝트를 초기화하고 필요한 패키지를 설치해줘.
```

### Step 2: 기능 구현

```bash
# 데이터 모델 정의
> 할 일 항목의 데이터 타입을 정의해줘.

# UI 컴포넌트 구현
> TodoList 컴포넌트를 카드 형태로 만들어줘.

# 상태 관리
> React Context + localStorage로 전역 상태를 관리해줘.
```

> 💡 **팁**: 기능별로 나누어 요청하면 Claude가 더 정확하게 구현합니다.

### Step 3: 테스트 및 배포

```bash
> 모든 컴포넌트에 대한 단위 테스트를 작성하고 실행해줘
> 프로덕션 빌드를 해서 에러가 없는지 확인해줘
> 변경사항을 커밋해줘. 메시지는 한국어로 작성해줘.
```

---

## 7. CLAUDE.md & 프로젝트 설정

### 3단계 메모리 계층

| 단계 | 파일 위치 | 용도 |
|------|----------|------|
| **1. 글로벌** | `~/.claude/CLAUDE.md` | 개인 코딩 스타일, 공통 규칙 |
| **2. 프로젝트** | `프로젝트/CLAUDE.md` | 기술 스택, 빌드 명령, 컨벤션 |
| **3. 하위 폴더** | `프로젝트/src/CLAUDE.md` | 모듈별 특화 규칙 |

하위 단계의 규칙이 상위 단계를 오버라이드합니다.

```markdown
# 프로젝트/CLAUDE.md 예시

## 프로젝트 개요
- Next.js 14 기반 웹 애플리케이션
- TypeScript + Tailwind CSS

## 빌드 명령
- npm run dev: 개발 서버
- npm run build: 빌드
- npm test: 테스트

## 코딩 컨벤션
- 컴포넌트는 함수형으로 작성
- 커밋 메시지는 한국어로 작성
```

### /memory 커맨드

```bash
> /memory "이 프로젝트에서는 date-fns 대신 dayjs를 사용한다"
# → CLAUDE.md에 자동 추가됨
```

### .claude/settings.json

```json
{
  "permissions": {
    "allow": [
      "Read", "Write", "Edit", "Glob", "Grep",
      "Bash(npm run *)", "Bash(npx *)", "Bash(git *)"
    ],
    "deny": [
      "Bash(rm -rf *)", "Bash(sudo *)"
    ]
  }
}
```

> 💡 **팁**: 처음에는 최소한의 권한만 허용하고, 작업하면서 필요한 명령을 하나씩 추가하세요.

---

## 8. GitHub 연동

### PR 생성 자동화

```bash
> 현재 브랜치의 변경사항으로 GitHub PR을 만들어줘.
# Claude가 실행: git diff → 커밋 → 푸시 → gh pr create
```

### 코드 리뷰 지원

```bash
> gh pr diff 42를 분석하고 코드 리뷰를 해줘
> PR #42의 리뷰 코멘트를 확인하고 수정해줘
```

### CI/CD 통합 (GitHub Actions)

```yaml
# .github/workflows/claude-review.yml
name: Claude Code Review
on:
  pull_request:
    types: [opened, synchronize]
jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Install Claude Code
        run: npm install -g @anthropic-ai/claude-code
      - name: Run Code Review
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          git diff origin/main...HEAD | claude --print \
            "이 변경사항을 리뷰해줘." > review.md
```

---

## 9. IDE 연동

### VS Code 확장

```bash
# VS Code에서 Claude Code 확장 설치
code --install-extension anthropic.claude-code
```

VS Code에서 Claude Code를 사용하면:
- **사이드바 패널**에서 Claude와 대화
- **에디터에서 직접** 코드를 선택하고 Claude에게 질문
- **터미널 통합** — VS Code 터미널에서 `claude` 명령 실행

### JetBrains 확장

IntelliJ IDEA, WebStorm, PyCharm 등에서도 사용 가능합니다.
Settings → Plugins → Marketplace → "Claude Code" 검색 후 설치합니다.

### IDE vs CLI 사용 시나리오

| 시나리오 | 추천 방식 | 이유 |
|----------|----------|------|
| 단일 파일 수정 | IDE 확장 | 에디터에서 바로 확인 |
| 멀티파일 리팩토링 | CLI | 전체 프로젝트 컨텍스트 |
| 코드 리뷰 | CLI | Git diff 파이프라인 연동 |
| CI/CD 자동화 | CLI (`--print`) | 스크립트에 통합 가능 |
| 디버깅 | IDE 확장 | 브레이크포인트와 병행 |

> 💡 **팁**: CLI와 IDE 확장을 동시에 사용하는 것이 가장 효율적입니다.

---

## 10. 트러블슈팅

### 1. 설치 오류 (Node.js 버전, 권한)

```bash
# Node.js 버전 확인 (18 미만이면 업그레이드)
node --version

# nvm으로 업그레이드
nvm install 20 && nvm use 20

# 권한 오류 시 — npm 글로벌 디렉토리 변경 (권장)
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
```

### 2. API 인증 실패

```bash
# API 키 재설정
export ANTHROPIC_API_KEY="sk-ant-새로운키"

# Max 구독 재인증
claude --login
```

### 3. 컨텍스트 초과 (대용량 프로젝트)

```bash
> /compact    # 대화 요약으로 컨텍스트 절약
> /clear      # 새 대화 시작
```

`.claudeignore`로 불필요한 파일을 제외하세요:
```
node_modules/
dist/
build/
*.min.js
*.lock
```

### 4. 파일 권한 오류

`.claude/settings.json`의 `allow` 목록에 `Write`, `Edit`이 포함되어 있는지 확인합니다.

### 5. 후크 실행 오류

```bash
# 후크 스크립트 실행 권한 부여
chmod +x .claude/hooks/my-hook.sh

# 디버그 모드로 확인
claude --debug
```

### 6. 성능 이슈 (느린 응답)

```bash
# .claudeignore로 대형 파일 제외
echo "node_modules/" >> .claudeignore

# 빠른 모델로 변경
> /model  # → Sonnet 4 선택
```

> 💡 **팁**: 대부분의 성능 이슈는 `.claudeignore` 설정으로 해결됩니다.

---

## 11. FAQ

### 1. Claude Code 요금은 얼마인가요?

| 방식 | 요금 | 특징 |
|------|------|------|
| **Max 5x** | $100/월 | 월정액, 예측 가능한 비용 |
| **Max 20x** | $200/월 | 월정액, 대량 사용 |
| **API 종량제** | 사용량 기반 | 토큰당 과금, 유연한 사용 |

### 2. 오프라인에서도 사용 가능한가요?

아니요, **인터넷 연결이 필수**입니다. AI 처리는 Anthropic 서버에서 이루어집니다. 단, 코드 자체는 로컬에 저장됩니다.

### 3. Cursor와 뭐가 다른가요?

| 항목 | Claude Code | Cursor |
|------|------------|--------|
| **인터페이스** | CLI (터미널) | GUI (에디터) |
| **AI 모델** | Claude 전용 | 멀티 모델 선택 |
| **CI/CD 통합** | 네이티브 지원 | 별도 설정 필요 |
| **자동화** | 스크립팅 가능 | GUI 중심 |

Cursor는 **보면서 코딩하는 GUI**, Claude Code는 **대화하며 코딩하는 CLI**입니다.

### 4. 생성된 코드의 소유권은?

Claude Code로 생성한 코드의 **소유권은 사용자에게 있습니다**. 상업적 사용도 가능합니다.

### 5. 팀에서 함께 사용할 수 있나요?

네. CLAUDE.md와 커스텀 슬래시 커맨드를 Git에 커밋하면 팀 전체가 동일한 규칙과 워크플로우를 공유할 수 있습니다.

### 6. 보안은 안전한가요?

| 항목 | 설명 |
|------|------|
| **코드 전송** | 프롬프트와 관련 코드가 Anthropic 서버로 전송 |
| **데이터 학습** | API 사용 시 코드가 모델 학습에 미사용 |
| **권한 제어** | settings.json으로 실행 가능한 명령 제한 |
| **승인 시스템** | 위험한 작업 전 사용자 승인 요청 |

### 7. 한국어로 대화할 수 있나요?

네, **한국어로 자연스럽게 대화할 수 있습니다**. 코드 주석이나 커밋 메시지도 한국어로 작성 가능합니다.

### 8. Windows에서도 사용 가능한가요?

네, **Windows, macOS, Linux 모두 지원**합니다. Windows에서는 WSL(Windows Subsystem for Linux) 환경을 권장합니다.

---

## 12. 다음 단계

### MCP 서버 직접 개발

Claude Code의 기능을 확장하려면 나만의 MCP 서버를 만들 수 있습니다. 사내 DB 연동, Jira 이슈 관리, Figma 디자인 연동 등 다양한 가능성이 있습니다. [modelcontextprotocol.io](https://modelcontextprotocol.io)에서 개발 가이드를 확인하세요.

### 엔터프라이즈 활용

- **코드 리뷰 자동화**: 모든 PR에 Claude Code 리뷰를 자동 실행
- **문서화 자동화**: API 문서, 변경 로그를 자동으로 생성
- **테스트 생성**: 기존 코드에 대한 테스트를 자동으로 작성
- **마이그레이션**: 프레임워크나 라이브러리 버전 업그레이드 자동화

### 커뮤니티 참여

| 커뮤니티 | 설명 |
|----------|------|
| [GitHub Issues](https://github.com/anthropics/claude-code) | 버그 리포트, 기능 제안 |
| Anthropic Discord | 사용자 커뮤니티, 팁 공유 |
| [MCP 서버 목록](https://modelcontextprotocol.io) | 커뮤니티 MCP 서버 |

### 다른 도구 조합

| 조합 | 워크플로우 |
|------|----------|
| **Cursor + Claude Code** | Cursor에서 UI 개발, Claude Code로 백엔드 자동화 |
| **Lovable + Claude Code** | Lovable로 프로토타입 생성, Claude Code로 커스터마이징 |
| **Claude Code + GitHub Actions** | CI/CD 파이프라인 구축 및 자동 리뷰 |

---

## 전체 흐름 요약

```
설치 → 설정 → 개발 → 배포

1. 설치: npm install -g @anthropic-ai/claude-code + 인증
2. 설정: CLAUDE.md + settings.json + MCP 서버
3. 개발: 대화형 코딩 + 후크 + 서브에이전트
4. 배포: Git 커밋 + PR 생성 + CI/CD 연동
```

| 단계 | 핵심 활동 | 소요 시간 |
|------|----------|----------|
| **1. 설치** | Node.js 확인, npm install, 인증 | 15분 |
| **2. 설정** | CLAUDE.md, MCP 서버, 권한 설정 | 30분 |
| **3. 개발** | 대화형 코딩, 기능 구현, 테스트 | 2~3시간 |
| **4. 배포** | Git 커밋, PR 생성, CI/CD 연동 | 30분~1시간 |

---

## 출처

| 출처 | 설명 | 링크 |
|------|------|------|
| **Anthropic 공식 문서** | Claude Code 사용법 및 API 문서 | [docs.anthropic.com](https://docs.anthropic.com/en/docs/claude-code) |
| **Claude Code GitHub** | 오픈소스 저장소 | [github.com/anthropics/claude-code](https://github.com/anthropics/claude-code) |
| **MCP 프로토콜** | Model Context Protocol 공식 사이트 | [modelcontextprotocol.io](https://modelcontextprotocol.io) |
| **Anthropic 블로그** | Claude Code 업데이트 소식 | [anthropic.com/blog](https://www.anthropic.com/blog) |
| **러버블 바이브코딩 카톡방** | 2026.3.8 카카오톡 대화 내용 (익명 처리) | 비공개 |

---

> 이 교안은 **김선생의 바이브코딩 가이드** 프로젝트의 일부입니다.
> Claude Code는 개발자 전용 도구이므로, 이 교안이 Claude Code의 유일한 교안입니다.
> 코딩 경험이 없다면 [Lovable 초보자편](lovable-beginner.html) 또는 [Cursor 초보자편](cursor-beginner.html)부터 시작하세요.
