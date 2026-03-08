# CLAUDE.md — 김선생의 러버블 입문 교안 프로젝트

## 프로젝트 개요

- **프로젝트명**: 김선생의 러버블(Lovable) 입문 교안
- **목적**: 2026년 3월 "She Builds on Lovable" 이벤트를 위한 수준별 바이브코딩 입문 교안 제공
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
├── ia.md                  ← 정보 구조(IA) 문서
├── erd.md                 ← 데이터 구조(ERD) 문서
├── index.html             ← 메인 랜딩 페이지 (교안 선택 + 게시판)
├── beginner.html          ← 초보자편 교안 (green 테마, #00B894)
├── intermediate.html      ← 중급자편 교안 (blue 테마, #0984E3)
├── developer.html         ← 개발자편 교안 (orange 테마, #E17055)
├── 교안_초보자편.md        ← 초보자편 원본 마크다운
├── 교안_중급자편.md        ← 중급자편 원본 마크다운
├── 교안_개발자편.md        ← 개발자편 원본 마크다운
├── og-thumbnail.png       ← OG 썸네일 이미지
├── og-image.html          ← OG 이미지 디자인 참고 (미사용)
├── teacher_kim.png        ← 김선생 프로필 이미지
└── KakaoTalk_*.txt        ← 카카오톡 대화 원본 (교안 소스)
```

## 작업 규칙

### 콘텐츠 수정 워크플로우

1. **MD 파일을 먼저 수정** → 이후 HTML 반영 (MD가 원본)
2. HTML은 MD 내용을 기반으로 수동 변환 (빌드 도구 없음)
3. MD ↔ HTML 간 내용 동기화 필수

### 개인정보 보호 (필수)

- **개별 발언자의 인용문은 반드시 익명**으로 처리 (개인정보보호법 준수)
  - 올바른 예: `— 실사용자 후기`, `— 실사용자 조언`, `— 실사용자 경험`
  - 잘못된 예: `— 김병선`, `— peace`, `— 이운희`
- **리소스/링크의 제작자 표기는 허용**
  - 올바른 예: `(peace 제작/공유)`, `(이운희 제작)` — 사이트/콘텐츠 제작자 크레딧
- **출처 섹션**에서 카톡방 참여자 목록은 유지 가능

### 색상 테마 규칙

| 페이지 | 주 색상 | CSS 변수 |
|--------|---------|----------|
| index.html | 보라 | `--primary:#5A4ED9` |
| beginner.html | 초록 | `--primary:#00B894` |
| intermediate.html | 파랑 | `--primary:#0984E3` |
| developer.html | 오렌지 | `--primary:#E17055` |

### HTML 공통 구조

모든 교안 HTML은 동일한 레이아웃 패턴 사용:
- **topnav**: 상단 네비게이션 (3개 교안 링크, sticky)
- **hero**: 그라디언트 헤더 (제목, 대상, 소요시간)
- **sidebar**: 좌측 목차 (sticky, 섹션 링크)
- **content**: 우측 본문 영역 (max-width: 800px)
- **footer**: 하단 정보

### 커밋 규칙

- 커밋 메시지: 한국어, 변경 내용 요약
- Co-Authored-By 태그 포함
- 커밋 후 즉시 push (GitHub Pages 자동 반영)

## 콘텐츠 출처

모든 교안 콘텐츠는 아래 소스에서 발췌·정리:

| 출처 | 설명 |
|------|------|
| 카카오톡 대화방 | 러버블 바이브코딩 카톡방 (2026.3.8) |
| peace YouTube | https://youtu.be/bWY5n0GYgG8 |
| peace Gemini Gem | https://gemini.google.com/gem/1yC701ZmuJgy_D4hkyNz0t50EqAnBj3kh |
| She Builds on Lovable | https://lovable.dev |

## 예시 사이트 (교안 내 참조)

| 사이트 | 제작자 | URL |
|--------|--------|-----|
| Cool Hot Story | peace | https://cool-hot-story.lovable.app |
| 레고 학급경영 | 이운희 | https://brick-academy-hub.lovable.app/ |

## 주의사항

- `.claude/` 디렉토리는 커밋하지 않음
- `KakaoTalk_*.txt` 파일은 원본 소스이나 개인정보 포함이므로 커밋하지 않음
- `og-image.html`은 참고용이며 배포에 불필요
- 게시판(index.html)은 localStorage 기반이므로 서버 DB 없음
