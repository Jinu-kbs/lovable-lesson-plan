# 러버블(Lovable) 입문 교안 - 개발자편

> **대상**: 코딩 기초가 있고 러버블을 처음 써보는 분
> **목표**: 러버블의 기술 구조를 이해하고, 기존 개발 경험을 활용하여 효율적으로 프로젝트를 빌드·배포하기
> **소요 시간**: 약 3~4시간

---

## 이 교안이 맞는 분

- HTML/CSS/JavaScript 또는 다른 프로그래밍 언어를 다뤄본 적이 있다
- "프론트엔드", "백엔드", "API" 같은 용어가 익숙하다
- 러버블을 프로토타입 도구로 활용하고 싶다
- 생성된 코드를 직접 수정하거나 다른 개발 도구로 마이그레이션할 계획이 있다

> AI 도구 경험은 있지만 코딩은 처음이라면 → **중급자편** 교안을 추천합니다.

### 📌 추천 리소스

| 리소스 | 설명 | 링크 |
|--------|------|------|
| **기획 도우미 Gem** | 제미나이 기반 프로젝트 기획 도우미 (peace 제작/공유) | [Gem 바로가기](https://gemini.google.com/gem/1yC701ZmuJgy_D4hkyNz0t50EqAnBj3kh) |
| **러버블 5분 만들기 영상** | 실제 제작 과정 참고 (peace 채널) | [YouTube 보기](https://youtu.be/bWY5n0GYgG8) |
| **예시: Cool Hot Story** | 5분 만에 만든 데모 사이트 (peace 제작) | [사이트 보기](https://cool-hot-story.lovable.app) |
| **예시: 레고 학급경영** | 초등 학급경영 사이트 예시 (이운희 제작) | [사이트 보기](https://brick-academy-hub.lovable.app/) |

---

## 목차

1. [러버블 기술 아키텍처](#1-러버블-기술-아키텍처)
2. [사전 준비](#2-사전-준비)
3. [개발자를 위한 기획 문서 체계](#3-개발자를-위한-기획-문서-체계)
4. [효과적인 빌드 전략](#4-효과적인-빌드-전략)
5. [생성 코드 이해 및 커스터마이징](#5-생성-코드-이해-및-커스터마이징)
6. [GitHub 연동 및 코드 관리](#6-github-연동-및-코드-관리)
7. [외부 서비스 연동](#7-외부-서비스-연동)
8. [배포 및 운영](#8-배포-및-운영)
9. [다른 도구로의 마이그레이션](#9-다른-도구로의-마이그레이션)
10. [디버깅 가이드](#10-디버깅-가이드)
11. [이벤트 참여 및 혜택](#11-이벤트-참여-및-혜택)
12. [다음 단계](#12-다음-단계)

---

## 1. 러버블 기술 아키텍처

### 생성되는 프로젝트 스택

러버블이 생성하는 프로젝트는 아래 스택을 기반으로 합니다:

| 계층 | 기술 | 설명 |
|------|------|------|
| **프레임워크** | React + Vite | SPA 기반의 빠른 빌드 환경 |
| **스타일링** | Tailwind CSS | 유틸리티 기반 CSS 프레임워크 |
| **UI 라이브러리** | shadcn/ui | Radix UI 기반 컴포넌트 라이브러리 |
| **언어** | TypeScript | 타입 안전성 보장 |
| **라우팅** | React Router | 클라이언트 사이드 라우팅 |
| **상태 관리** | React Query (TanStack) | 서버 상태 관리 |
| **AI 모델** | Anthropic Claude | Lovable 내부에서 사용하는 AI |

### 프로젝트 구조

```
project-root/
├── public/              # 정적 파일
├── src/
│   ├── components/      # 재사용 가능한 UI 컴포넌트
│   │   └── ui/          # shadcn/ui 컴포넌트
│   ├── pages/           # 페이지 컴포넌트
│   ├── hooks/           # 커스텀 훅
│   ├── lib/             # 유틸리티 함수
│   ├── integrations/    # 외부 서비스 연동 코드
│   ├── App.tsx          # 라우팅 설정
│   └── main.tsx         # 앱 진입점
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

### 러버블의 포지셔닝: 프로토타입 → 핸드오프

| 항목 | 러버블 사용 | 직접 개발 |
|------|-------------|-----------|
| **초기 셋업** | 0분 | 30분~1시간 |
| **프로토타입 속도** | 수 분 | 수 시간~수 일 |
| **코드 품질** | 일관적, 패턴화됨 | 개발자 역량에 의존 |
| **커스터마이징** | 대화 기반 + 코드 수정 | 완전 자유 |
| **디버깅** | 제한적 | 완전 제어 |

> **실전 팁**: "저는 러버블 1월에 조금 파다가 클로드 코드로 넘어온 케이스여서... 이제 도구는 거기로 안착했어요" — 실사용자 경험. 러버블은 **빠른 프로토타입** 도구로, 세부 작업은 익숙한 IDE에서 진행하는 하이브리드 방식이 효과적입니다.

> **하이브리드 워크플로우 실전 사례**: "러버블에서 교안 작성 → HTML로 변환 → 깃허브 자동 연동 → 안티그래비티에서 HTML 부분 수정 (왜 안티그래비티 쓰라는지 알겠음, 신세계) → 4시간마다 자동 깃허브 업데이트 설정" — 실사용자 워크플로우. 러버블로 큰 틀을 잡고, 안티그래비티나 커서에서 세부 수정하는 방식이 실전에서 효과적입니다.

---

## 2. 사전 준비

### 필수 계정

| 서비스 | 용도 |
|--------|------|
| **GitHub** | 코드 저장, 버전 관리, CI/CD 트리거 |
| **Vercel** | 배포 (GitHub 연동 가입 추천) |
| **Lovable** | 웹앱 생성 |
| **(선택) Supabase** | PostgreSQL DB, Auth, Storage |

### 개발 환경 준비 (러버블 후 코드 수정 시)

```bash
# Node.js 설치 확인
node -v   # v18 이상 권장

# 패키지 매니저
npm -v    # 또는 yarn, pnpm, bun

# Git 설치 확인
git --version
```

### 체크리스트

- [ ] 계정 가입 완료 (GitHub, Vercel, Lovable)
- [ ] Node.js 18+ 설치
- [ ] Git 설치 및 설정
- [ ] 코드 에디터 준비 (VS Code, Cursor 등)
- [ ] 프로젝트 아이디어 및 기획 문서 준비

---

## 3. 개발자를 위한 기획 문서 체계

개발 경험이 있는 분은 PRD를 개발 관점에서 더 정밀하게 작성할 수 있습니다. 중급자편의 PRD가 "무엇을 만들까"에 초점을 둔다면, 개발자편의 PRD는 **"어떻게 만들까"까지 포함**합니다.

### 3-1. PRD.md — 기술 제약과 우선순위 포함

```markdown
# PRD: [프로젝트명]

## 1. 개요
- **프로젝트명**:
- **버전**: v1.0
- **목적**:
- **대상 사용자**:

## 2. 기능 요구사항 (우선순위별)

### 2.1 사용자 인증 (P0 - 필수)
- 이메일/비밀번호 회원가입
- 소셜 로그인 (Google)
- 비밀번호 재설정
- 세션 관리 및 자동 로그아웃

### 2.2 대시보드 (P0 - 필수)
- 사용자별 데이터 요약 표시
- 최근 활동 타임라인
- 빠른 액션 버튼

### 2.3 설정 (P1 - 중요)
- 프로필 수정
- 알림 설정
- 테마 전환 (다크/라이트)

### 2.4 향후 확장 (P2 - 나중에)
- 팀 협업 기능
- 데이터 내보내기

## 3. 비기능 요구사항
- 반응형 디자인 (모바일 우선)
- 페이지 로딩 2초 이내
- WCAG 2.1 AA 접근성 준수

## 4. 기술 제약
- React + TypeScript + Tailwind CSS + shadcn/ui
- Supabase (Auth + DB + Storage)
- Vercel 배포
- 환경변수: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
```

### 3-2. IA.md — 라우팅과 인증 흐름 포함

```markdown
# IA: [프로젝트명]

## 사이트맵 (라우팅 설계)

/                        # 랜딩 페이지 (비인증)
├── /auth
│   ├── /login           # 로그인
│   ├── /signup          # 회원가입
│   └── /reset-password  # 비밀번호 재설정
├── /dashboard           # 대시보드 (인증 필요, ProtectedRoute)
│   ├── /dashboard/analytics  # 분석 뷰
│   └── /dashboard/history    # 활동 이력
├── /settings            # 설정 (인증 필요, ProtectedRoute)
│   ├── /settings/profile     # 프로필
│   └── /settings/preferences # 환경설정
└── /about               # 소개 페이지 (비인증)

## 네비게이션 구조

### 비인증 사용자
- 홈 | 소개 | 로그인 | 회원가입

### 인증 사용자
- 대시보드 | 설정 | 로그아웃
```

### 3-3. ERD.md — SQL 스키마 수준

```markdown
# ERD: [프로젝트명]

## 테이블 정의

### users (Supabase Auth 확장)
| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | uuid | PK, FK → auth.users.id | Supabase Auth 연동 |
| email | varchar(255) | UNIQUE, NOT NULL | 이메일 |
| display_name | varchar(100) | | 표시 이름 |
| avatar_url | text | | 프로필 이미지 URL |
| created_at | timestamptz | DEFAULT now() | 가입일 |

### projects
| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | uuid | PK, DEFAULT gen_random_uuid() | |
| user_id | uuid | FK → users.id, NOT NULL | 소유자 |
| title | varchar(200) | NOT NULL | 프로젝트명 |
| description | text | | 설명 |
| status | varchar(20) | DEFAULT 'draft' | draft/active/archived |
| created_at | timestamptz | DEFAULT now() | |
| updated_at | timestamptz | | |

## RLS 정책
- users: 본인 프로필만 조회/수정 가능
- projects: 본인 프로젝트만 CRUD 가능

## 관계
- auth.users 1:1 users (프로필 확장)
- users 1:N projects (한 사용자가 여러 프로젝트 소유)
```

---

## 4. 효과적인 빌드 전략

### 전략 1: 전체 PRD 투입 → 한 번에 빌드

```
아래 PRD를 기반으로 웹 애플리케이션을 만들어주세요.
기술 스택: React + TypeScript + Tailwind CSS + shadcn/ui

[PRD 전문 붙여넣기]
```

- **장점**: 한 번에 전체 구조가 잡힘
- **단점**: 크레딧 소모가 크고, 수정이 어려울 수 있음

### 전략 2: 단계별 빌드 (추천)

```
Phase 1: "PRD의 P0 기능(인증, 대시보드)을 구현해주세요.
         P1, P2는 추후 추가할 예정입니다."

Phase 2: "기능 P1(설정 페이지)을 추가해주세요.
         기존 라우팅 구조와 컴포넌트 패턴에 맞춰서 작성해주세요."

Phase 3: "Supabase 연동으로 사용자 인증을 추가해주세요.
         환경변수는 VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY를 사용합니다."
```

- **장점**: 각 단계에서 결과를 확인하고 방향 조정 가능
- **단점**: 여러 번 요청 필요

### 전략 3: 기존 코드/명세서 투입

이미 프로젝트가 있다면 직접 투입할 수 있습니다:

```
기존 프로젝트의 요구사항 명세서를 기반으로 빌드해주세요.
단, 한 번에 전체를 만들지 말고
먼저 메인 레이아웃과 라우팅만 잡아주세요.
```

> **주의**: "만들고 있던 앱의 명세서를 넣고 한 번 하니까 크레딧이 끝났어요" — 실사용자 경험. 큰 명세서는 반드시 단계별로 나누세요.

---

## 5. 생성 코드 이해 및 커스터마이징

### 5-1. 코드 다운로드 후 로컬 실행

```bash
# 프로젝트 클론
git clone https://github.com/[username]/[project-name].git
cd [project-name]

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

### 5-2. 주요 파일 분석

러버블이 생성한 코드를 수정할 때 주로 다루는 파일들:

```
src/
├── App.tsx              # 라우팅 정의 — 페이지 추가/수정 시
├── pages/Index.tsx      # 메인 페이지 — 레이아웃 변경 시
├── components/          # UI 컴포넌트 — 기능 수정 시
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── ui/              # shadcn/ui — 보통 수정 불필요
├── lib/utils.ts         # 유틸리티 — cn() 함수 등
└── integrations/        # 외부 API 연동 — DB 설정 등
    └── supabase/
        ├── client.ts    # Supabase 클라이언트 설정
        └── types.ts     # 자동 생성된 타입
```

### 5-3. 커스터마이징 포인트

**테마/스타일 변경:**
```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#10B981',
      },
      fontFamily: {
        sans: ['Pretendard', 'sans-serif'],  // 한글 폰트
      },
    },
  },
}
```

**환경변수 설정:**
```bash
# .env.local (로컬 개발용, .gitignore에 포함됨)
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

---

## 6. GitHub 연동 및 코드 관리

### 6-1. 러버블 내장 GitHub 연동

1. 프로젝트 설정에서 **Connect to GitHub** 선택
2. 저장소 생성 또는 기존 저장소 연결
3. 코드 변경 시 자동 커밋/푸시

### 6-2. 하이브리드 워크플로우

```
[러버블에서 프로토타입 생성]
         ↓
[GitHub에 Push]
         ↓
[로컬에서 Clone]
         ↓
[VS Code / Cursor / Claude Code / AntiGravity에서 세부 수정]
         ↓
[GitHub에 Push → Vercel 자동 배포]
```

### 6-3. 양방향 동기화 주의

러버블에서 수정한 후 Push하면 로컬 코드와 충돌할 수 있습니다:

- **러버블만 사용**: 러버블 → GitHub → Vercel (단방향)
- **로컬 병행**: 러버블로 초기 빌드 → 이후 로컬에서만 수정 (핸드오프)
- **혼합**: 충돌 주의, `git pull`로 동기화 후 작업

> **권장**: 러버블로 프로토타입을 완성한 후, 로컬로 핸드오프하는 방식이 가장 깔끔합니다.

### 6-4. 브랜치 전략 (팀 협업 시)

```
main              ← 배포용 (Vercel 자동 배포)
├── develop       ← 개발 통합 브랜치
│   ├── feature/auth      ← 인증 기능
│   ├── feature/dashboard ← 대시보드
│   └── fix/mobile-nav    ← 모바일 네비 수정
```

---

## 7. 외부 서비스 연동

### 7-1. Supabase (데이터베이스 + 인증)

러버블에서 Supabase 연동을 요청하는 프롬프트:

```
Supabase를 연동해서 다음 기능을 구현해주세요:

1. 사용자 인증 (이메일/비밀번호, Google OAuth)
2. users 프로필 테이블 (CRUD)
3. projects 테이블 (사용자별 프로젝트 관리)
4. RLS(Row Level Security) 정책 적용

Supabase 환경변수:
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
```

### 7-2. Stripe (결제 시스템)

```
Stripe를 연동해서 구독 결제 기능을 추가해주세요:

1. 가격 플랜 페이지 (Free / Pro / Enterprise)
2. Stripe Checkout으로 결제 처리
3. 구독 상태 관리

환경변수: VITE_STRIPE_PUBLIC_KEY
```

### 7-3. 기타 연동 가능 서비스

| 서비스 | 용도 | 난이도 |
|--------|------|--------|
| **Resend / SendGrid** | 이메일 발송 | 중 |
| **Uploadthing** | 파일 업로드 | 중 |
| **OpenAI / Claude API** | AI 기능 추가 | 중~상 |
| **Google Analytics** | 사용자 분석 | 하 |

---

## 8. 배포 및 운영

### 8-1. 러버블 자체 배포 (Publish)

가장 빠른 방법. **Publish** 버튼 클릭으로 즉시 배포.

### 8-2. Vercel 배포

```bash
# CLI 배포 (선택사항)
npm i -g vercel
vercel

# 또는 Vercel 대시보드에서 GitHub 저장소 Import → Deploy
```

**Vercel 환경변수 설정:**

Vercel 대시보드 → Settings → Environment Variables에서 `.env.local`의 변수를 등록합니다.

### 8-3. 커스텀 도메인 연결

1. Vercel 대시보드 → Domains
2. 커스텀 도메인 입력 (예: myapp.com)
3. DNS 설정:
   - A 레코드: `76.76.21.21`
   - 또는 CNAME: `cname.vercel-dns.com`

### 8-4. 운영 모니터링

| 항목 | 도구 | 설명 |
|------|------|------|
| **에러 추적** | Sentry | 런타임 에러 수집 |
| **성능** | Vercel Analytics | Core Web Vitals |
| **사용자 분석** | Google Analytics | 방문자 행동 |
| **가동 시간** | UptimeRobot | 다운 알림 (무료) |

---

## 9. 다른 도구로의 마이그레이션

### 러버블 → 로컬 개발 (VS Code / Cursor)

```bash
# 1. GitHub에서 클론
git clone https://github.com/[user]/[project].git
cd [project]

# 2. 의존성 설치
npm install

# 3. 환경변수 설정
cp .env.example .env.local
# .env.local 파일을 편집하여 필요한 값 입력

# 4. 개발 서버 실행
npm run dev

# 이후 일반적인 React 프로젝트처럼 개발 진행
```

### 러버블 → 클로드 코드 (Claude Code)

```bash
# 프로젝트 디렉토리에서
claude

# 컨텍스트 제공
> 이 프로젝트는 러버블로 생성된 React + TypeScript 프로젝트입니다.
> [수정하고 싶은 내용]을 변경해주세요.
```

### 러버블 → 커서 (Cursor)

1. Cursor에서 클론된 프로젝트 폴더 열기
2. Cursor의 AI 기능(Cmd+K)으로 코드 수정
3. 터미널에서 `npm run dev`로 확인

### 러버블 → 안티그래비티 (AntiGravity)

안티그래비티는 웹 기반 IDE로, HTML/코드를 직접 수정하는 데 유용합니다:

1. 러버블에서 프로젝트 파일 다운로드
2. 안티그래비티에서 HTML/코드 파일 열기
3. AI 지원으로 세부 수정 (UI 미세 조정, 스타일 변경 등)

> **실사용자 경험**: "안티그래비티에서 HTML 부분 수정 기능 처음 써봄. 이건 또 신세계. 왜 안티그래비티 쓰라는지 알겠음" — 실사용자 경험. 러버블 + 안티그래비티 조합으로 프로토타입 후 세부 수정까지 효율적으로 처리 가능

### 마이그레이션 시 주의사항

| 항목 | 체크 포인트 |
|------|-------------|
| **환경변수** | 러버블 내부 설정 → 로컬 `.env.local`로 옮기기 |
| **Supabase** | 테이블 스키마, RLS 정책은 Supabase 대시보드에서 별도 관리 |
| **shadcn/ui** | `components.json` 설정이 있어야 새 컴포넌트 추가 가능 |
| **의존성** | `package.json`의 버전 호환성 확인 |
| **빌드** | `npm run build`로 프로덕션 빌드 정상 여부 확인 |

---

## 10. 디버깅 가이드

### 러버블에서 코드가 깨졌을 때

1. **Undo(되돌리기)**: 러버블 내장 기능으로 이전 상태 복원
2. **버전 히스토리**: 이전 버전으로 롤백
3. **파일 백업**: 마음에 든 상태에서 미리 다운로드해둔 파일로 복원

### 로컬에서 빌드 에러가 날 때

```bash
# 의존성 재설치
rm -rf node_modules package-lock.json
npm install

# TypeScript 타입 에러 확인
npx tsc --noEmit

# Vite 캐시 초기화
rm -rf node_modules/.vite
npm run dev
```

### Supabase 연동 에러

```bash
# 환경변수 확인
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY

# Supabase 대시보드에서 확인:
# - API URL과 anon key가 일치하는지
# - RLS 정책이 올바른지
# - 테이블 스키마가 코드와 일치하는지
```

### Vercel 배포 실패 시

1. Vercel 대시보드 → Deployments → 실패한 배포의 로그 확인
2. 로컬에서 `npm run build`로 빌드 에러 재현
3. 환경변수가 Vercel에 제대로 등록되었는지 확인

### 러버블이 생성한 코드의 일반적 문제

| 증상 | 원인 | 해결 |
|------|------|------|
| 빈 화면 | 라우팅 미설정 | App.tsx에서 라우트 확인 |
| 스타일 깨짐 | Tailwind 클래스 오류 | 브라우저 DevTools로 확인 |
| API 호출 실패 | 환경변수 누락 | .env.local 확인 |
| 타입 에러 | 자동 생성 타입 불일치 | Supabase types 재생성 |
| 무한 렌더링 | useEffect 의존성 | React DevTools로 확인 |

### 프로젝트 규모 증가에 따른 주의사항

러버블로 만든 프로젝트는 규모가 커질수록 관리가 어려워집니다:

- **구조 이해 필수**: 생성된 코드의 구조를 이해하지 못한 채 계속 요청만 하면, 수정이 어렵고 크레딧이 급격히 소모됩니다
- **조기 핸드오프 권장**: 기본 구조가 잡히면 빨리 로컬 환경으로 옮겨서 직접 코드를 제어하세요
- **구조화된 PRD = 최고의 프롬프트**: 잘 구조화된 PRD를 투입하면 처음부터 깔끔한 구조가 나옵니다

> **실사용자 경고**: "러버블 같은 걸로 사이트 만들고 나중에 구조를 이해 못하면 나중에 더 힘들어집니다... 커지면 수정하는 데 크레딧도 쭉쭉 나가요" — 실사용자 경고. 개발자라면 코드 구조를 파악한 후 빠르게 로컬 개발로 전환하세요.

### 모듈형 개발과 재사용

러버블로 만든 결과물을 **모듈 형태로 보관**하면 다른 프로젝트에서 재사용할 수 있습니다:

- 인증 모듈, 대시보드 레이아웃, 결제 흐름 등 기능 단위로 코드를 분리·정리
- GitHub에 템플릿 저장소로 보관하면 새 프로젝트 시작 시 빠르게 활용
- 하나의 기능을 잘 구현해두면 이후 유사 프로젝트에 계속 재활용 가능

> **실전 팁**: "개발 내용이 나한테 모듈 형태로 남아 있으면 하나 개발한 거 가지고 있으면 나중에 쓸 수 있고, 깃허브에서 라이브러리를 찾아봐도 됩니다" — 실사용자 경험

### 자동화 워크플로우 도구 (make, n8n)

러버블로 만든 웹앱에 자동화를 붙이고 싶다면 **make**(구 Integromat)이나 **n8n**을 고려하세요:

- **크롤링/모니터링**: 특정 사이트의 공지사항을 자동 수집
- **트리거 알림**: 조건 충족 시 이메일/문자 자동 발송
- **데이터 연동**: 외부 API 호출 → DB 저장 자동화

| 도구 | 특징 | 가격 |
|------|------|------|
| **make** | GUI 기반 자동화, 다양한 연동 | 무료 플랜 있음 |
| **n8n** | 오픈소스, 셀프호스팅 가능 | 무료 (셀프호스팅) |

> **실사용자 사례**: "학교 사이트 공지사항을 키워드로 긁어오는 서비스 만들고 싶다" → make의 트리거 방식을 활용하면 무료 플랜에서도 구현 가능합니다.

---

## 11. 이벤트 참여 및 혜택

### She Builds on Lovable 이벤트 혜택

| 혜택 | 개발자 활용법 |
|------|---------------|
| **25시간 무료 빌드** | 프로토타입 여러 개 실험, 복잡한 구조 테스트 |
| **$100 API 크레딧** | Claude API로 AI 기능 프로토타입, Lovable 대시보드에서 수령 |
| **$250 Stripe 크레딧** | SaaS 결제 시스템 POC 구축 |

### 개발자를 위한 시간 활용 전략

| 시간대 | 할 일 |
|--------|-------|
| **시작 전** | PRD/IA/ERD 완성, 기술 스택 결정 |
| **1시간** | 메인 프로젝트 프로토타입 (P0 기능) |
| **2~3시간** | UI 정제 + Supabase 연동 |
| **4시간** | GitHub Push → Vercel 배포 → 로컬 클론 |
| **남은 시간** | 실험: 다른 아이디어, Stripe 연동, AI 기능 등 |

### SNS 공유 미션

태그: @lovable.community, @lovable.dev / 해시태그: **#SheBuildsonLovable**

---

## 12. 다음 단계

| 방향 | 설명 | 리소스 |
|------|------|--------|
| **풀스택 확장** | Next.js + Supabase로 SSR/API Routes 추가 | [Next.js 문서](https://nextjs.org/docs) |
| **모바일 앱** | React Native 또는 Capacitor로 모바일 래핑 | [Capacitor 문서](https://capacitorjs.com/docs) |
| **HTML 세부 수정** | 안티그래비티에서 러버블 코드 직접 수정 | [antigravity.dev](https://www.antigravity.dev) |
| **CI/CD** | GitHub Actions로 테스트 자동화 | [GitHub Actions 문서](https://docs.github.com/actions) |
| **AI 기능** | Claude API / OpenAI API로 AI 기능 내장 | [Anthropic Docs](https://docs.anthropic.com) |
| **모노레포** | Turborepo로 프론트/백엔드 통합 관리 | [Turborepo 문서](https://turbo.build/repo/docs) |
| **자동화 워크플로우** | make, n8n으로 반복 작업 자동화 (API 연동, 알림 등) | [make.com](https://www.make.com), [n8n.io](https://n8n.io) |

---

## 개발자를 위한 워크플로우 요약

```
[기획]                    [빌드]                [운영]
PRD.md / IA.md / ERD.md → 러버블 프로토타입   → GitHub Push
 (기술 제약 포함)               ↓                    ↓
 (P0/P1/P2 우선순위)       로컬 Clone           Vercel 자동 배포
                               ↓                    ↓
                         VS Code / Cursor       커스텀 도메인
                         Claude Code             모니터링 (Sentry)
```

> **핵심 메시지**: 러버블은 **프로토타입을 빠르게 만드는 도구**로 활용하고, 세밀한 제어가 필요한 부분은 익숙한 개발 도구로 전환하는 하이브리드 접근이 가장 효율적입니다.

---

## 출처

본 교안의 실사용자 경험담 및 추천 리소스는 아래 출처에서 발췌·정리하였습니다.

| 출처 | 설명 |
|------|------|
| **러버블 바이브코딩 카카오톡 대화방** | 2026년 3월 8일 대화 기록 (참여자: 김병선, peace, 이운희, 송윤임, 우대윤, 서진영 외) |
| **peace YouTube** | [러버블 5분 만들기 영상](https://youtu.be/bWY5n0GYgG8) |
| **peace Gemini Gem** | [기획 도우미 Gem](https://gemini.google.com/gem/1yC701ZmuJgy_D4hkyNz0t50EqAnBj3kh) |
| **She Builds on Lovable** | [공식 이벤트 페이지](https://lovable.dev) |

---

*본 교안은 2026년 3월 She Builds on Lovable 이벤트를 계기로 작성되었습니다.*
