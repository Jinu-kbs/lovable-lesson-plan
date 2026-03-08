# 안티그래비티(AntiGravity) 입문 교안 — 개발자편

> **대상**: 코딩 경험이 있고, 에이전트 기반 개발 워크플로우를 구축하고 싶은 분
> **목표**: 기술 아키텍처 이해, Skills·Rules 커스터마이징, GitHub 연동, 멀티 에이전트 협업
> **소요 시간**: 약 5~6시간

---

## 이 교안이 맞는 분

- HTML/CSS/JS 또는 Python 등 프로그래밍 경험이 있다
- VS Code 등 코드 에디터를 사용해본 적이 있다
- Git/GitHub를 사용할 줄 알거나 배우고 싶다
- AI 에이전트 기반 개발에 관심이 있다

> 코딩 경험이 없다면 → **초보자편** 또는 **중급자편**을 먼저 보세요.

---

### 📌 추천 리소스

| 리소스 | 설명 | 링크 |
|--------|------|------|
| AntiGravity 공식 사이트 | 다운로드 및 공식 문서 | [antigravity.google](https://antigravity.google) |
| Google Codelabs 가이드 | 공식 시작하기 튜토리얼 | [Codelabs](https://codelabs.developers.google.com/getting-started-google-antigravity) |
| 기획 도우미 Gem | PRD/IA/ERD 작성을 도와주는 AI (peace 제작/공유) | [Gem 바로가기](https://gemini.google.com/gem/1yC701ZmuJgy_D4hkyNz0t50EqAnBj3kh) |
| Google Developers Blog | 안티그래비티 아키텍처 설명 | [Blog](https://developers.googleblog.com) |

---

## 목차

1. [기술 아키텍처](#1-기술-아키텍처)
2. [사전 준비](#2-사전-준비)
3. [기획 문서 체계](#3-기획-문서-체계)
4. [빌드 전략](#4-빌드-전략)
5. [Rules·Workflows·Skills](#5-rulesworkflowsskills)
6. [GitHub 연동](#6-github-연동)
7. [외부 서비스 연동](#7-외부-서비스-연동)
8. [배포 및 운영](#8-배포-및-운영)
9. [마이그레이션](#9-마이그레이션)
10. [디버깅 가이드](#10-디버깅-가이드)
11. [멀티 에이전트 협업](#11-멀티-에이전트-협업)
12. [다음 단계](#12-다음-단계)

---

## 1. 기술 아키텍처

### VS Code 포크 구조

안티그래비티는 VS Code를 포크한 데스크톱 앱입니다:

| 계층 | 설명 |
|------|------|
| **UI Layer** | VS Code 기반 Editor View + Manager View (에이전트 지시 화면) |
| **Agent Layer** | Gemini 3 Pro / Claude Sonnet / GPT 모델 기반 에이전트 |
| **Execution Layer** | 터미널 에이전트 (명령어 실행), 브라우저 에이전트 (Chrome 조작) |
| **Storage Layer** | 로컬 파일시스템 + Git 연동 |

### 에이전트 시스템 내부

| 에이전트 유형 | 역할 | 실행 환경 |
|-------------|------|----------|
| **코딩 에이전트** | 코드 생성, 수정, 리팩토링 | Editor View |
| **터미널 에이전트** | npm install, git, 빌드 명령 등 실행 | 내장 터미널 |
| **브라우저 에이전트** | Chrome 조작, UI 테스트, 스크린샷 | Chrome 확장 |
| **플래닝 에이전트** | Plan Artifact 생성, 작업 분해 | Manager View |

### 모델 라우팅

안티그래비티는 작업 유형에 따라 자동으로 최적 모델을 선택합니다:

| 작업 유형 | 추천 모델 | 이유 |
|----------|----------|------|
| 코드 생성/수정 | Gemini 3 Pro | 빠른 응답, 코드 특화 |
| 복잡한 리팩토링 | Claude Sonnet | 긴 컨텍스트 윈도우 |
| 문서 분석 | Claude Sonnet | 긴 문서 처리 |
| 일반 작업 | 자동 선택 | 상황에 따라 최적 모델 |

### IDE 비교표

| 항목 | AntiGravity | Cursor | VS Code + Copilot | Claude Code |
|------|-------------|--------|-------------------|-------------|
| **기반** | VS Code 포크 | VS Code 포크 | VS Code | CLI (터미널) |
| **AI 모델** | 멀티 모델 | Claude + 커스텀 | GitHub Copilot | Claude |
| **에이전트** | 멀티 에이전트 | 단일 에이전트 | 코파일럿 | 단일 에이전트 |
| **브라우저** | 내장 에이전트 | 미지원 | 미지원 | 미지원 |
| **Plan Mode** | 지원 | 미지원 | 미지원 | 미지원 |
| **비용** | 무료 (프리뷰) | $20/월 | $10/월 | 종량제 |

---

## 2. 사전 준비

### 개발 환경 요구사항

| 항목 | 필수/권장 | 설명 |
|------|----------|------|
| **Node.js 18+** | 권장 | 많은 프로젝트에서 필요 |
| **Git** | 권장 | 버전 관리 및 GitHub 연동 |
| **Python 3.10+** | 선택 | Python 프로젝트 시 |
| **Google 계정** | 필수 | 앱 로그인 |
| **GitHub 계정** | 권장 | 코드 관리 |

### 보안 정책 설정

개발자에게 추천하는 보안 모드:

| 모드 | 설명 | 개발자 사용 |
|------|------|-----------|
| Safe | 매 작업마다 승인 | 민감한 프로덕션 환경 |
| Auto | 안전한 작업 자동 승인 | 일반 개발 |
| **Turbo** | 대부분 자동 승인 | **개발 속도 우선** ✅ |

### Allow/Deny 리스트

보안 정책을 세밀하게 제어할 수 있습니다:

```
# Allow 리스트 예시
- npm install, npm run dev, npm run build
- git add, git commit, git push
- python -m pytest

# Deny 리스트 예시
- rm -rf /
- sudo 명령어
- 프로덕션 DB 접근
```

### .agents/ 디렉토리 구조

프로젝트 루트에 `.agents/` 디렉토리를 만들어 워크스페이스 설정을 관리합니다:

```
.agents/
├── rules.md          ← 워크스페이스 Rules
├── workflows/        ← 커스텀 Workflows
│   ├── deploy.md
│   └── test.md
└── skills/           ← 커스텀 Skills
    └── SKILL.md
```

---

## 3. 기획 문서 체계

### PRD.md / IA.md / ERD.md 연동

개발자는 기획 문서를 마크다운 파일로 프로젝트에 포함시켜 에이전트가 참조하도록 합니다:

```
프로젝트-루트/
├── docs/
│   ├── PRD.md     ← 요구정의서
│   ├── IA.md      ← 정보 구조
│   └── ERD.md     ← 데이터 구조
├── .agents/
│   └── rules.md   ← "docs/ 디렉토리의 문서를 항상 참조할 것"
└── src/
```

### Plan Mode와 기획 문서

에이전트에게 기획 문서를 인식시키는 방법:

```
이 프로젝트의 docs/ 디렉토리에 PRD.md, IA.md, ERD.md가 있어.
이 문서들을 먼저 읽고, PRD에 정의된 기능을 구현해줘.
Plan Mode로 구현 계획을 세워줘.
```

---

## 4. 빌드 전략

### 전략 1: 풀 에이전트 위임

에이전트에게 전체 프로젝트를 맡기는 방식:

```
docs/PRD.md를 읽고 이 프로젝트를 처음부터 만들어줘.
React + TypeScript + Tailwind CSS를 사용하고,
Plan Mode로 전체 구현 계획을 먼저 세워줘.
```

**장점**: 빠른 프로토타이핑, 일관된 코드 스타일
**단점**: 세밀한 제어 어려움, 대규모 프로젝트에서 컨텍스트 한계

### 전략 2: 하이브리드 (추천)

개발자가 아키텍처를 잡고, 세부 구현은 에이전트에게 맡기는 방식:

1. 개발자: 프로젝트 구조, 핵심 설정 파일 작성
2. 에이전트: 컴포넌트 구현, 스타일링, 테스트
3. 개발자: 코드 리뷰, 아키텍처 조정
4. 에이전트: 리팩토링, 최적화

```
이미 src/App.tsx와 라우팅 설정을 만들어뒀어.
src/components/ 디렉토리에 아래 컴포넌트들을 구현해줘:
1. Header.tsx - 네비게이션 바
2. Dashboard.tsx - 메인 대시보드
3. TaskBoard.tsx - 칸반 보드
IA.md의 구조를 따라서 만들어줘.
```

### 전략 3: 기존 코드 강화

이미 있는 프로젝트에 에이전트를 투입하는 방식:

```
이 프로젝트의 코드를 분석하고:
1. 코드 품질 리포트를 작성해줘
2. 성능 개선 포인트를 찾아줘
3. 테스트 커버리지를 높여줘
```

---

## 5. Rules·Workflows·Skills

### Global vs Workspace Rules

| 유형 | 적용 범위 | 용도 |
|------|----------|------|
| **Global Rules** | 모든 프로젝트 | 코딩 스타일, 언어 설정, 기본 보안 |
| **Workspace Rules** | 특정 프로젝트 | 프로젝트별 기술 스택, 컨벤션, 제약사항 |

### Rules 작성 예시

```markdown
# Workspace Rules (.agents/rules.md)

## 프로젝트 정보
- 이름: 팀 대시보드
- 기술 스택: React 18, TypeScript, Tailwind CSS, Supabase
- Node.js 버전: 18+

## 코드 컨벤션
- 컴포넌트: 함수형 + React.FC 사용
- 상태관리: React Query + Zustand
- 스타일: Tailwind CSS (커스텀 CSS 금지)
- 테스트: Vitest + React Testing Library

## 금지사항
- any 타입 사용 금지
- console.log는 개발 중에만 허용
- 직접 DOM 조작 금지 (ref 사용 시 제외)

## 참조 문서
- docs/PRD.md 참조
- docs/IA.md의 컴포넌트 구조 따르기
```

### 커스텀 Workflows

반복되는 작업 패턴을 Workflow로 자동화합니다:

```markdown
# .agents/workflows/new-feature.md

## 새 기능 추가 Workflow

1. PRD에서 해당 기능 요구사항 확인
2. Plan Mode로 구현 계획 수립
3. 컴포넌트 파일 생성 (src/components/)
4. 비즈니스 로직 구현
5. 테스트 코드 작성 (src/__tests__/)
6. 브라우저에서 동작 확인
7. ESLint/Prettier 실행
```

### SKILL.md 제작

Skills는 에이전트에게 특정 전문 지식을 부여하는 파일입니다:

```markdown
# .agents/skills/SKILL.md

## 역할
프론트엔드 개발 전문가

## 전문 분야
- React + TypeScript 앱 개발
- Tailwind CSS 반응형 디자인
- Supabase 백엔드 연동
- 접근성(a11y) 준수

## 작업 원칙
1. 컴포넌트는 단일 책임 원칙을 따른다
2. 재사용 가능한 컴포넌트를 우선 작성한다
3. 에러 처리를 반드시 포함한다
4. 모바일 퍼스트로 개발한다
```

---

## 6. GitHub 연동

### 터미널 에이전트로 Git 관리

안티그래비티의 터미널 에이전트는 Git 명령어를 직접 실행합니다:

```
이 프로젝트를 Git으로 초기화하고 GitHub에 올려줘.
저장소 이름: team-dashboard
브랜치: main
.gitignore에 node_modules, .env, dist 추가해줘.
```

### PR 워크플로우

에이전트에게 PR(Pull Request) 기반 워크플로우를 맡길 수 있습니다:

```
새 기능을 feature/kanban-board 브랜치에서 작업해줘.
작업이 끝나면 PR을 생성하고,
PR 설명에 변경사항 요약을 작성해줘.
```

### CI/CD 연동

GitHub Actions와 연동하여 자동화된 파이프라인을 구축합니다:

```
GitHub Actions CI/CD 파이프라인을 설정해줘:
1. PR 시: ESLint + 테스트 자동 실행
2. main 병합 시: 자동 빌드 + Vercel 배포
3. .github/workflows/ci.yml 파일 생성
```

---

## 7. 외부 서비스 연동

### MCP 프로토콜

MCP(Model Context Protocol)는 에이전트가 외부 서비스와 통신하는 표준입니다:

| MCP 서버 | 서비스 | 주요 기능 |
|---------|--------|----------|
| **supabase-mcp** | Supabase | DB 쿼리, 인증, 스토리지 |
| **github-mcp** | GitHub | 이슈, PR, 코드 검색 |
| **figma-mcp** | Figma | 디자인 토큰, 컴포넌트 |
| **stripe-mcp** | Stripe | 결제, 구독 관리 |

### Supabase 연동

```
Supabase MCP를 설정하고 아래를 구현해줘:
1. 환경변수에 SUPABASE_URL, SUPABASE_ANON_KEY 설정
2. 사용자 인증 (이메일/비밀번호 + Google OAuth)
3. Row Level Security(RLS) 정책 설정
4. 실시간 구독 (Realtime) 활성화
```

### 브라우저 에이전트 테스트

브라우저 에이전트를 활용한 E2E 테스트:

```
브라우저 에이전트로 다음 시나리오를 테스트해줘:
1. 로그인 페이지에서 이메일/비밀번호 입력
2. 대시보드 페이지 로딩 확인
3. 새 태스크 생성 → 목록에 표시되는지 확인
4. 태스크 상태 변경 (할 일 → 진행 중)
5. 스크린샷으로 결과 기록
```

---

## 8. 배포 및 운영

### Firebase / Cloud Run / Vercel

| 플랫폼 | 적합한 프로젝트 | 장점 |
|--------|---------------|------|
| **Firebase** | 풀스택 앱 | Hosting + DB + Auth 통합 |
| **Cloud Run** | 컨테이너 앱 | 서버리스 + 자동 스케일링 |
| **Vercel** | 프론트엔드 앱 | 빠른 배포 + GitHub 연동 |
| **GitHub Pages** | 정적 사이트 | 무료 + 간편 |

### 커스텀 도메인 설정

```
Vercel에 배포된 프로젝트에 커스텀 도메인을 연결해줘.
도메인: dashboard.example.com
CNAME 레코드 설정 방법도 안내해줘.
```

### 에이전트 배포 자동화

```
배포 자동화 스크립트를 만들어줘:
1. 테스트 실행 (실패 시 중단)
2. 빌드
3. Firebase/Vercel에 배포
4. 배포 결과를 Slack으로 알림
```

---

## 9. 마이그레이션

### Cursor → AntiGravity

| 단계 | 작업 |
|------|------|
| 1 | Cursor 프로젝트 폴더를 안티그래비티에서 워크스페이스로 열기 |
| 2 | .cursorrules → .agents/rules.md로 변환 |
| 3 | Cursor Composer 프롬프트 → Manager View에서 Plan Mode로 전환 |

### VS Code → AntiGravity

| 단계 | 작업 |
|------|------|
| 1 | 기존 VS Code 프로젝트 폴더를 워크스페이스로 열기 |
| 2 | VS Code 확장 설정은 대부분 호환 |
| 3 | .agents/ 디렉토리 추가하여 에이전트 Rules 설정 |

### Lovable → AntiGravity

| 단계 | 작업 |
|------|------|
| 1 | 러버블에서 프로젝트를 GitHub에 내보내기 |
| 2 | 안티그래비티에서 GitHub 저장소를 워크스페이스로 열기 |
| 3 | 에이전트에게 코드 분석 및 개선 요청 |

### AntiGravity → 다른 도구

안티그래비티에서 작업한 코드는 표준 프로젝트 구조이므로:
- Cursor, VS Code 등에서 그대로 열어서 작업 가능
- Git 히스토리 유지
- 특수 파일(.agents/)만 제거하면 범용 프로젝트

### 마이그레이션 체크리스트

- [ ] 프로젝트 파일 이동/복제 완료
- [ ] 의존성 설치 (npm install) 정상
- [ ] 빌드 성공 확인
- [ ] 기존 테스트 통과 확인
- [ ] .agents/ Rules 설정 완료
- [ ] Git 히스토리 보존 확인

---

## 10. 디버깅 가이드

### Artifact 분석

에이전트가 생성한 Artifact(산출물)를 통해 디버깅합니다:

| Artifact 유형 | 활용 |
|-------------|------|
| **Plan Artifact** | 구현 계획 검토, 누락 사항 확인 |
| **스크린샷** | UI 렌더링 결과 확인 |
| **터미널 로그** | 빌드/실행 에러 분석 |
| **코드 diff** | 변경사항 추적 |

### 터미널 에이전트 디버깅

```
터미널에서 다음 에러가 발생했어: [에러 메시지]
1. 에러 원인을 분석해줘
2. 수정 방안을 Plan으로 작성해줘
3. 수정 후 다시 빌드해줘
```

### 브라우저 에이전트 디버깅

```
브라우저에서 다음 페이지를 열고 문제를 분석해줘:
1. 콘솔 에러 확인
2. 네트워크 탭에서 실패한 요청 확인
3. 스크린샷으로 현재 UI 상태 기록
4. 문제 원인과 해결 방안 제시
```

### 일반 에러 패턴

| 에러 | 원인 | 해결 |
|------|------|------|
| `Module not found` | 의존성 미설치 | `npm install` 실행 |
| `Type error` | TypeScript 타입 불일치 | 타입 정의 수정 |
| `CORS error` | API 도메인 차단 | 프록시 설정 또는 서버 CORS 허용 |
| `Build failed` | 구문 오류 또는 설정 문제 | 에러 로그 분석 후 수정 |

---

## 11. 멀티 에이전트 협업

### 병렬 작업 전략

안티그래비티의 멀티 에이전트 기능을 활용한 병렬 개발:

| 에이전트 | 담당 영역 | 작업 내용 |
|---------|----------|----------|
| 에이전트 A | 프론트엔드 | 컴포넌트 개발, UI 스타일링 |
| 에이전트 B | 백엔드 연동 | API 통합, DB 쿼리 |
| 에이전트 C | 테스트 | 유닛 테스트, E2E 테스트 |

### 에이전트 간 역할 분배

```
이 프로젝트를 병렬로 작업해줘:
- 프론트엔드: src/components/ 하위 컴포넌트 구현
- 백엔드: src/api/ 하위 API 클라이언트 구현
- 테스트: src/__tests__/ 하위 테스트 작성
파일이 겹치지 않도록 영역을 분리해줘.
```

### 대규모 프로젝트 관리

| 전략 | 설명 |
|------|------|
| **모듈 분리** | 기능별 디렉토리로 분리하여 에이전트 충돌 방지 |
| **단계별 실행** | Phase 1 → Phase 2 → Phase 3 순서로 진행 |
| **중간 검토** | 각 단계 완료 시 코드 리뷰 및 품질 확인 |
| **Git 브랜치** | 기능별 브랜치 → PR → 머지 전략 |

---

## 12. 다음 단계

안티그래비티 개발자편을 마치셨습니다! 다음 단계를 선택하세요:

| 방향 | 설명 | 추천 |
|------|------|------|
| **Skills 생태계 기여** | 커스텀 Skills를 만들어 공유 | ★★★ |
| **러버블 개발자편** | 러버블의 기술 아키텍처 이해 | ★★☆ |
| **커서 초보자편** | AI 코파일럿 기반 개발 체험 | ★★☆ |
| **실전 프로젝트** | 프로덕션급 프로젝트 배포 | ★★★ |
| **고급 에이전트 패턴** | 멀티 에이전트 협업 최적화 | ★★★ |

---

## 전체 흐름 요약

```
기획 (PRD.md/IA.md/ERD.md)
  ↓
빌드 (에이전트 위임 / 하이브리드 / 기존 코드 강화)
  ↓
운영 (배포 → 모니터링 → 반복 개선)
```

---

## 출처

| 출처 | 설명 |
|------|------|
| [AntiGravity 공식](https://antigravity.google) | Google AntiGravity 공식 사이트 |
| [Google Developers Blog](https://developers.googleblog.com) | 안티그래비티 기술 아키텍처 |
| [Google Codelabs](https://codelabs.developers.google.com/getting-started-google-antigravity) | 시작하기 공식 튜토리얼 |
| [기획 도우미 Gem](https://gemini.google.com/gem/1yC701ZmuJgy_D4hkyNz0t50EqAnBj3kh) | PRD/IA/ERD 작성 도우미 (peace 제작/공유) |
