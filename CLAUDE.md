# CLAUDE.md — 김선생의 바이브코딩 가이드 프로젝트

## 프로젝트 개요

- **프로젝트명**: 김선생의 바이브코딩 가이드
- **목적**: 러버블, 안티그래비티, 커서 등 바이브코딩 도구별 수준별 가이드 제공 (2026년 3월 이벤트 기반)
- **배포 URL**: https://jinu-kbs.github.io/lovable-lesson-plan/
- **저장소**: https://github.com/Jinu-kbs/lovable-lesson-plan
- **브랜치**: main (GitHub Pages 배포 브랜치)
- **Git 사용자**: Jinu-kbs (kuchem97@gmail.com)

## 기술 스택

- **정적 사이트**: 순수 HTML/CSS/JS (프레임워크 없음)
- **배포**: GitHub Pages (main 브랜치 루트)
- **폰트**: Pretendard (시스템 폰트 폴백)
- **OG 이미지**: Python Pillow로 생성 (og-thumbnail.png, 1200x630px)

## 파일 구조

```
프로젝트 루트/
├── CLAUDE.md              ← 이 파일 (클로드 지침서)
├── PRD.md                 ← 제품 요구사항 문서
├── ia.md                  ← 정보 구조(IA) 문서
├── erd.md                 ← 데이터 구조(ERD) 문서
├── common.css             ← 교안 공통 스타일 (CSS 변수 기반)
├── common.js              ← 교안 공통 스크립트 (TOC, 스크롤스파이, 자기주도학습 네비게이션)
├── lessons-data.js        ← 교안 메타데이터 (JS, 자동 네비게이션용)
├── index.html             ← 메인 랜딩 페이지 (도구별 교안 허브 + 게시판)
├── 검토_지침.md            ← 교안 검토 체크리스트 (24항목)
│
├── lovable-beginner.html          ← 러버블 초보자편 교안
├── lovable-intermediate.html      ← 러버블 중급자편 교안
├── lovable-developer.html         ← 러버블 개발자편 교안
├── 교안_lovable_beginner.md       ← 러버블 초보자편 MD 원본
├── 교안_lovable_intermediate.md   ← 러버블 중급자편 MD 원본
├── 교안_lovable_developer.md      ← 러버블 개발자편 MD 원본
│
├── antigravity-beginner.html      ← 안티그래비티 초보자편 교안
├── antigravity-intermediate.html  ← 안티그래비티 중급자편 교안
├── antigravity-developer.html     ← 안티그래비티 개발자편 교안
├── 교안_antigravity_beginner.md   ← 안티그래비티 초보자편 MD 원본
├── 교안_antigravity_intermediate.md ← 안티그래비티 중급자편 MD 원본
├── 교안_antigravity_developer.md  ← 안티그래비티 개발자편 MD 원본
│
├── cursor-beginner.html           ← 커서 초보자편 교안
├── cursor-intermediate.html       ← 커서 중급자편 교안
├── cursor-developer.html          ← 커서 개발자편 교안
├── 교안_cursor_beginner.md        ← 커서 초보자편 MD 원본
├── 교안_cursor_intermediate.md    ← 커서 중급자편 MD 원본
├── 교안_cursor_developer.md       ← 커서 개발자편 MD 원본
│
├── aistudio-beginner.html         ← AI Studio 초보자편 교안
├── aistudio-intermediate.html     ← AI Studio 중급자편 교안
├── aistudio-developer.html        ← AI Studio 개발자편 교안
├── 교안_aistudio_beginner.md      ← AI Studio 초보자편 MD 원본
├── 교안_aistudio_intermediate.md  ← AI Studio 중급자편 MD 원본
├── 교안_aistudio_developer.md     ← AI Studio 개발자편 MD 원본
│
├── claude-code-beginner.html      ← Claude Code 초보자편 교안
├── claude-code-intermediate.html  ← Claude Code 중급자편 교안
├── claude-code-developer.html     ← Claude Code 개발자편 교안
├── 교안_claude-code_beginner.md   ← Claude Code 초보자편 MD 원본
├── 교안_claude-code_intermediate.md ← Claude Code 중급자편 MD 원본
├── 교안_claude-code_developer.md  ← Claude Code 개발자편 MD 원본
│
├── devinterface-beginner.html      ← 개발 인터페이스 초보자편 교안
├── devinterface-intermediate.html  ← 개발 인터페이스 중급자편 교안
├── devinterface-developer.html     ← 개발 인터페이스 개발자편 교안
├── 교안_devinterface_beginner.md   ← 개발 인터페이스 초보자편 MD 원본
├── 교안_devinterface_intermediate.md ← 개발 인터페이스 중급자편 MD 원본
├── 교안_devinterface_developer.md  ← 개발 인터페이스 개발자편 MD 원본
│
├── chatgpt-beginner.html          ← ChatGPT 초보자편 교안
├── chatgpt-intermediate.html      ← ChatGPT 중급자편 교안
├── chatgpt-developer.html         ← ChatGPT 개발자편 교안
├── 교안_chatgpt_beginner.md       ← ChatGPT 초보자편 MD 원본
├── 교안_chatgpt_intermediate.md   ← ChatGPT 중급자편 MD 원본
├── 교안_chatgpt_developer.md      ← ChatGPT 개발자편 MD 원본
│
├── prompt-beginner.html           ← 프롬프트 엔지니어링 초보자편 교안
├── prompt-intermediate.html       ← 프롬프트 엔지니어링 중급자편 교안
├── prompt-developer.html          ← 프롬프트 엔지니어링 개발자편 교안
├── 교안_prompt_beginner.md        ← 프롬프트 엔지니어링 초보자편 MD 원본
├── 교안_prompt_intermediate.md    ← 프롬프트 엔지니어링 중급자편 MD 원본
├── 교안_prompt_developer.md       ← 프롬프트 엔지니어링 개발자편 MD 원본
│
├── github-beginner.html           ← Git/GitHub 초보자편 교안
├── github-intermediate.html       ← Git/GitHub 중급자편 교안
├── github-developer.html          ← Git/GitHub 개발자편 교안
├── 교안_github_beginner.md        ← Git/GitHub 초보자편 MD 원본
├── 교안_github_intermediate.md    ← Git/GitHub 중급자편 MD 원본
├── 교안_github_developer.md       ← Git/GitHub 개발자편 MD 원본
│
├── deployment-beginner.html       ← 배포 초보자편 교안
├── deployment-intermediate.html   ← 배포 중급자편 교안
├── deployment-developer.html      ← 배포 개발자편 교안
├── 교안_deployment_beginner.md    ← 배포 초보자편 MD 원본
├── 교안_deployment_intermediate.md ← 배포 중급자편 MD 원본
├── 교안_deployment_developer.md   ← 배포 개발자편 MD 원본
│
├── google-beginner.html            ← 구글 생태계 초보자편 교안
├── google-intermediate.html       ← 구글 생태계 중급자편 교안
├── google-developer.html          ← 구글 생태계 개발자편 교안
├── 교안_google_beginner.md        ← 구글 생태계 초보자편 MD 원본
├── 교안_google_intermediate.md    ← 구글 생태계 중급자편 MD 원본
├── 교안_google_developer.md       ← 구글 생태계 개발자편 MD 원본
│
├── ai-intro.html                  ← AI 교육 철학 인트로 페이지
├── 교안_ai-intro.md               ← AI 교육 철학 MD 원본
│
├── ai-science.html                ← AI 과학교육 탁월함 페이지
├── 교안_ai-science.md             ← AI 과학교육 MD 원본
│
├── ai-compare.html                ← AI 도구 5종 비교 페이지
├── ai-compare.md                  ← AI 도구 5종 비교 MD 원본
│
├── compare.html                   ← 도구 비교 독립 페이지
│
├── claude-code-roadmap.html        ← Claude Code 마스터 로드맵 (탭 기반 학습 가이드)
├── nvidia-gtc-2025.html           ← NVIDIA GTC 2025 완전 리포트 (인포그래픽 페이지)
├── NVIDIA_GTC_2025_완전_리포트.md ← NVIDIA GTC 2025 리포트 MD 원본
│
├── beginner.html          ← 리다이렉트 스텁 → lovable-beginner.html
├── intermediate.html      ← 리다이렉트 스텁 → lovable-intermediate.html
├── developer.html         ← 리다이렉트 스텁 → lovable-developer.html
│
├── og-thumbnail.png       ← OG 썸네일 이미지
├── og-image.html          ← OG 이미지 디자인 참고 (미사용)
├── teacher_kim.png        ← 김선생 프로필 이미지
├── KakaoTalk_*.txt        ← 카카오톡 대화 원본 (교안 소스)
└── 러버블 로그인 및 클로드api 수령 방법_26 합치기.pdf ← 참고자료
```

## 파일 네이밍 규칙

새로운 도구 교안 추가 시 아래 규칙을 따른다:
- **HTML**: `{tool}-{level}.html` (예: `cursor-beginner.html`)
- **MD**: `교안_{tool}_{level}.md` (예: `교안_cursor_beginner.md`)
- **Level**: `beginner`, `intermediate`, `developer`
- **Tool**: `lovable`, `antigravity`, `cursor`, `aistudio`, `claude-code`, `devinterface`, `chatgpt`, `prompt`, `github`, `deployment`, `google`

## 공통 코드 구조

### common.css
- 모든 교안 HTML이 공유하는 스타일 (topnav, hero, sidebar, content, footer, 모바일 TOC 등)
- 페이지별로 4개 CSS 변수만 오버라이드: `--primary`, `--primary-light`, `--blockquote-bg`, `--hover-bg`

### lessons-data.js
- 11개 도구 × 3레벨 교안 메타데이터 (URL, 제목, 설명, 관련교안, 선수학습)
- 4개 특별 페이지 정보
- 3개 추천 학습 경로 (입문/중급/개발자)
- common.js가 이 데이터로 브레드크럼, 관련교안 카드, 학습경로, footer nav를 자동 생성

### common.js
- 모바일 TOC 바텀시트, 백투탑 버튼, 스크롤 스파이, 코드 복사 버튼
- **자기주도학습 네비게이션 자동 생성** (lessons-data.js 기반):
  - 브레드크럼 (홈 > 도구 > 레벨)
  - 선수 학습 배너
  - 학습 경로 시각화
  - 관련 교안 카드 그리드
  - 이전/다음 교안 footer 네비게이션

## 개발 워크플로우 (6단계 필수 준수)

모든 작업은 아래 6단계를 반드시 순서대로 수행한다.

### 1단계: 계획하기

- 사용자 요청을 분석하고 작업 범위를 파악한다
- 변경할 파일 목록과 영향 범위를 정리한다
- 불명확한 요구사항은 사용자에게 확인 후 진행한다

### 2단계: PRD / IA / ERD 반영

- 변경 내용에 따라 **CLAUDE.md**, **PRD.md**, **ia.md**, **erd.md**를 먼저 업데이트한다
- 새로운 페이지, 섹션, 데이터 구조가 추가되면 반드시 문서에 반영한다
- 문서가 현재 코드 상태와 항상 일치해야 한다

### 3단계: MD 파일 작성/수정

- 콘텐츠 원본인 **교안 MD 파일**을 먼저 작성하거나 수정한다
- MD 파일이 교안의 단일 원본(Single Source of Truth)이다
- 새로운 섹션, 내용 추가, 수정은 반드시 MD에서 먼저 수행한다

### 4단계: 코드 개발 (HTML 변환)

- MD 내용을 기반으로 HTML 파일에 반영한다 (빌드 도구 없음, 수동 변환)
- MD ↔ HTML 간 내용 동기화 필수
- CSS 스타일, 레이아웃 구조는 기존 패턴을 유지한다

### 5단계: 유효성 검증

- HTML 파일의 링크가 정상 작동하는지 확인한다
- 개인정보 보호 규칙 위반 여부를 점검한다 (인용문 실명 사용 금지)
- MD와 HTML 간 내용 불일치가 없는지 확인한다
- 색상 테마, 레이아웃 구조가 규칙과 일치하는지 확인한다

### 6단계: 깃허브 커밋 / 푸시 / 배포

- 변경된 파일만 선별적으로 `git add`한다
- 커밋 메시지는 한국어로 변경 내용을 요약한다
- `Co-Authored-By` 태그를 포함한다
- 커밋 후 즉시 `git push`하여 GitHub Pages에 자동 배포한다
- 배포 후 사이트 URL을 사용자에게 안내한다

```
1. 계획 → 2. PRD/IA/ERD → 3. MD 작성 → 4. HTML 변환 → 5. 검증 → 6. 커밋/푸시/배포
```

---

## 작업 규칙

### 개인정보 보호 (필수)

- **개별 발언자의 인용문은 반드시 익명**으로 처리 (개인정보보호법 준수)
  - 올바른 예: `— 실사용자 후기`, `— 실사용자 조언`, `— 실사용자 경험`
  - 잘못된 예: `— 김병선`, `— peace`, `— 이운희`
- **리소스/링크의 제작자 표기는 허용**
  - 올바른 예: `(peace 제작/공유)`, `(이운희 제작)` — 사이트/콘텐츠 제작자 크레딧
- **출처 섹션**에서 카톡방 참여자 목록은 유지 가능

### 색상 테마 규칙

| 도구 | Primary | Light | 교안 수준 |
|------|---------|-------|----------|
| **index.html** | `#5A4ED9` (보라) | `#C5BFFB` | — |
| **Lovable** | `#00B894` (초록) | `#55EFC4` | 초보/중급/개발자 |
| **AntiGravity** | `#9C27B0` (보라) | `#CE93D8` | 초보/중급/개발자 |
| **Cursor** | `#2196F3` (파랑) | `#90CAF9` | 초보/중급/개발자 |
| **AI Studio** | `#4CAF50` (초록) | `#A5D6A7` | 초보/중급/개발자 |
| **Claude Code** | `#FF9800` (오렌지) | `#FFCC80` | 초보/중급/개발자 |
| **개발 인터페이스** | `#607D8B` (블루그레이) | `#B0BEC5` | 초보/중급/개발자 |
| **ChatGPT/Codex** | `#10A37F` (그린) | `#7DD3B7` | 초보/중급/개발자 |
| **프롬프트 엔지니어링** | `#E91E63` (핑크) | `#F48FB1` | 초보/중급/개발자 |
| **Git/GitHub** | `#F44336` (레드) | `#EF9A9A` | 초보/중급/개발자 |
| **배포** | `#00BCD4` (시안) | `#80DEEA` | 초보/중급/개발자 |
| **구글 생태계** | `#4285F4` (구글블루) | `#AECBFA` | 초보/중급/개발자 |
| **AI 교육 철학** | `#1565C0` (딥블루) | `#90CAF9` | 단일 페이지 |
| **AI 과학교육** | `#00695C` (다크틸) | `#80CBC4` | 단일 페이지 |
| **NVIDIA GTC 2025** | `#76B900` (NVIDIA 그린) | `#A8D84E` | 단일 페이지 (필독 리포트) |

### HTML 공통 구조

모든 교안 HTML은 동일한 레이아웃 패턴 사용:
- **topnav**: 상단 네비게이션 (3개 교안 링크, sticky)
- **hero**: 그라디언트 헤더 (제목, 대상, 소요시간)
- **sidebar**: 좌측 목차 (sticky, 섹션 링크)
- **content**: 우측 본문 영역 (max-width: 800px)
- **footer**: 하단 정보

### 커밋 규칙 (6단계에서 적용)

- 커밋 메시지: 한국어, 변경 내용 요약
- Co-Authored-By 태그 포함
- 커밋 후 즉시 push (GitHub Pages 자동 반영)
- `.claude/`, `KakaoTalk_*.txt`, `og-image.html`은 커밋하지 않음
- `검토_지침.md`는 커밋 대상 (프로젝트 품질관리 문서)

## 콘텐츠 보관 원칙

- **콘텐츠 원본 파일은 삭제하지 않고 그대로 보관한다**
- 원본 소스(카톡 대화, PDF 참고자료 등)는 프로젝트 루트에 유지한다
- 원본을 가공하여 MD/HTML로 변환하더라도 원본 파일은 보존한다
- 커밋 대상이 아닌 파일도 로컬에서 반드시 보관한다

### 콘텐츠 원본 목록

| 파일 | 유형 | 설명 | 커밋 여부 |
|------|------|------|-----------|
| `KakaoTalk_20260308_1024_46_689_group.txt` | 카톡 대화 | 러버블 바이브코딩 카톡방 (1차) | 미커밋 (개인정보) |
| `KakaoTalk_20260308_1146_53_200_group.txt` | 카톡 대화 | 러버블 바이브코딩 카톡방 (2차) | 미커밋 (개인정보) |
| `KakaoTalk_20260308_1253_52_306_group.txt` | 카톡 대화 | 러버블 바이브코딩 카톡방 (3차) | 미커밋 (개인정보) |
| `KakaoTalk_20260308_1917_28_581_group.txt` | 카톡 대화 | 러버블 바이브코딩 카톡방 (4차, 최신) | 미커밋 (개인정보) |
| `러버블 로그인 및 클로드api 수령 방법_26 합치기.pdf` | PDF 가이드 | 러버블 로그인 및 Claude API 크레딧 수령 방법 | 미커밋 (용량) |

## 콘텐츠 출처

모든 교안 콘텐츠는 아래 소스에서 발췌·정리:

| 출처 | 설명 |
|------|------|
| 카카오톡 대화방 | 러버블 바이브코딩 카톡방 (2026.3.8) |
| 참고자료 PDF | 러버블 로그인 및 클로드api 수령 방법 (26장) |
| peace YouTube | https://youtu.be/bWY5n0GYgG8 |
| peace Gemini Gem | https://gemini.google.com/gem/1yC701ZmuJgy_D4hkyNz0t50EqAnBj3kh |
| She Builds on Lovable | https://lovable.dev |

## 예시 사이트 (교안 내 참조)

| 사이트 | 제작자 | URL |
|--------|--------|-----|
| Cool Hot Story | peace | https://cool-hot-story.lovable.app |
| 레고 학급경영 | 이운희 | https://brick-academy-hub.lovable.app/ |
| 교사 진도 관리 앱 | peace | https://teachers-vibe-sync.lovable.app/ |

## 주의사항

- `.claude/` 디렉토리는 커밋하지 않음
- `KakaoTalk_*.txt` 파일은 원본 소스이나 개인정보 포함이므로 커밋하지 않음
- `*.pdf` 참고자료는 용량 문제로 커밋하지 않음 (로컬 보관)
- `og-image.html`은 참고용이며 배포에 불필요
- 게시판(index.html)은 localStorage 기반이므로 서버 DB 없음
