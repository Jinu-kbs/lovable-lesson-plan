# ERD (Entity Relationship Diagram) — 김선생의 러버블 입문 교안

## 관련 문서

| 문서 | 설명 |
|------|------|
| [CLAUDE.md](CLAUDE.md) | 클로드 지침서 (개발 워크플로우, 규칙) |
| [PRD.md](PRD.md) | 제품 요구사항 문서 (기능, 대상, 제약사항) |
| [ia.md](ia.md) | 정보 구조 (사이트맵, 페이지 구조, 네비게이션) |

## 개요

본 프로젝트는 **정적 사이트**로 서버 사이드 데이터베이스를 사용하지 않습니다.
데이터 저장은 브라우저 localStorage만 사용합니다.

---

## 데이터 엔티티

### 1. 게시판 포스트 (BulletinPost)

**저장소**: `localStorage` (키: `bb_posts`)
**위치**: `index.html` 사용자 후기·질문 게시판

| 필드 | 타입 | 설명 | 예시 |
|------|------|------|------|
| `time` | string | 작성 시각 (toLocaleString) | `"2026. 3. 8. 오후 2:30:15"` |
| `text` | string | 게시글 본문 | `"러버블 첫 사용 후기입니다"` |

**데이터 형식** (JSON Array):
```json
[
  { "time": "2026. 3. 8. 오후 2:30:15", "text": "러버블로 포트폴리오 만들었어요!" },
  { "time": "2026. 3. 8. 오후 1:20:00", "text": "초보자편 교안 감사합니다" }
]
```

**동작 방식**:
- 새 글 작성 시 배열 맨 앞에 추가 (`unshift`) → 최신순 정렬
- 페이지 로드 시 `loadPosts()`로 전체 렌더링
- 삭제 기능 없음 (localStorage 직접 초기화로만 삭제 가능)

---

### 2. 교안 콘텐츠 (LessonContent)

**저장소**: 파일 시스템 (`.md` 원본 → `.html` 변환)
**관계**: 1 MD 파일 : 1 HTML 파일

| 필드 | 타입 | 설명 |
|------|------|------|
| `tool` | enum | `lovable` / `antigravity` / `cursor` / `aistudio` / `claude-code` / `devinterface` / `chatgpt` / `prompt` / `github` / `deployment` |
| `level` | enum | `beginner` / `intermediate` / `developer` |
| `title` | string | 교안 제목 |
| `target` | string | 대상 수강자 설명 |
| `duration` | string | 예상 소요 시간 |
| `sections[]` | Section[] | 섹션 목록 |
| `resources[]` | Resource[] | 추천 리소스 목록 |
| `sources[]` | Source[] | 출처 목록 |

#### Section (섹션)

| 필드 | 타입 | 설명 |
|------|------|------|
| `id` | string | 섹션 앵커 ID |
| `number` | number | 섹션 번호 |
| `title` | string | 섹션 제목 |
| `subsections[]` | Subsection[] | 하위 섹션 |
| `tables[]` | Table[] | 포함된 테이블 |
| `codeBlocks[]` | string[] | 코드 블록 |
| `blockquotes[]` | Quote[] | 인용문 |

#### Resource (추천 리소스)

| 필드 | 타입 | 설명 |
|------|------|------|
| `name` | string | 리소스 이름 |
| `description` | string | 설명 |
| `url` | string | 링크 URL |
| `creator` | string | 제작자 (표기 허용) |

#### Source (출처)

| 필드 | 타입 | 설명 |
|------|------|------|
| `name` | string | 출처 이름 |
| `description` | string | 설명 |
| `url` | string? | 링크 (선택) |

#### Quote (인용문)

| 필드 | 타입 | 설명 |
|------|------|------|
| `text` | string | 인용 내용 |
| `attribution` | string | 익명 출처 (실사용자 후기/조언/경험/경고/인사이트/워크플로우) |
| `label` | string | 라벨 (실전 팁/실사용자 경험/핵심 인사이트/주의 등) |

---

### 3. OG 메타데이터 (OGMetadata)

**저장소**: `index.html` `<head>` 내 메타 태그

| 필드 | 타입 | 값 |
|------|------|-----|
| `og:title` | string | `김선생의 러버블(Lovable) 입문 교안` |
| `og:description` | string | `바이브코딩으로 나만의 웹사이트를 만들고 배포하기까지...` |
| `og:image` | URL | `https://jinu-kbs.github.io/lovable-lesson-plan/og-thumbnail.png` |
| `og:image:width` | number | `1200` |
| `og:image:height` | number | `630` |
| `og:url` | URL | `https://jinu-kbs.github.io/lovable-lesson-plan/` |
| `og:type` | string | `website` |
| `og:locale` | string | `ko_KR` |
| `twitter:card` | string | `summary_large_image` |

---

### 4. 자가 진단 (SelfCheck)

**저장소**: `index.html` 하드코딩 (동적 데이터 아님)

| 순서 | 질문 | 아니오 결과 | 예 결과 |
|------|------|-------------|---------|
| 1 | AI 챗봇 경험? | 초보자편 | 다음 질문 |
| 2 | 개발 용어 이해? | 중급자편 | 다음 질문 |
| 3 | 코딩 경험? | 중급자편 | 개발자편 |

---

### 5. 이벤트 혜택 (EventBenefit)

**저장소**: 하드코딩 (전 교안 공통)

| 혜택 | 내용 | 수령 방법 |
|------|------|-----------|
| 무료 빌드 | 25시간 무제한 | 이벤트 시간 lovable.dev 접속 |
| API 크레딧 | $100 Claude API | Lovable 대시보드 내 링크 |
| Stripe 크레딧 | $250 수수료 면제 | Stripe 연동 시 적용 |

---

## 엔티티 관계도

```
┌─────────────────┐
│   index.html    │
│   (랜딩 페이지)  │
├─────────────────┤
│ OGMetadata      │
│ SelfCheck[3]    │
│ EventBenefit[3] │
│ BulletinPost[]  │──→ localStorage("bb_posts")
└──────┬──────────┘
       │ 링크 (href)
       │
  ┌────┼────────────────┐
  │    │                │
  ▼    ▼                ▼
┌────────────┐ ┌──────────────┐ ┌────────────┐
│beginner    │ │intermediate  │ │developer   │
│.html       │ │.html         │ │.html       │
├────────────┤ ├──────────────┤ ├────────────┤
│LessonContent│ │LessonContent│ │LessonContent│
│ level:     │ │ level:       │ │ level:     │
│  beginner  │ │  intermediate│ │  developer │
│ sections:  │ │ sections:    │ │ sections:  │
│  13개      │ │  13개        │ │  12개      │
│ resources: │ │ resources:   │ │ resources: │
│  4개       │ │  4개         │ │  4개       │
│ sources:   │ │ sources:     │ │ sources:   │
│  4개       │ │  4개         │ │  4개       │
└────────────┘ └──────────────┘ └────────────┘
       ▲              ▲               ▲
       │ 원본 (수동 변환)│               │
       │              │               │
┌────────────┐ ┌──────────────┐ ┌────────────┐
│교안_초보자  │ │교안_중급자    │ │교안_개발자  │
│편.md       │ │편.md         │ │편.md       │
└────────────┘ └──────────────┘ └────────────┘
```

## 데이터 흐름

```
[카카오톡 대화 원본] ──(발췌/정리)──→ [교안 MD 3개]
       .txt 파일                        .md 파일
                                           │
                                     (수동 HTML 변환)
                                           │
                                           ▼
                                    [교안 HTML 3개]
                                        .html 파일
                                           │
                                     (git push)
                                           │
                                           ▼
                                   [GitHub Pages 배포]
                                           │
                                           ▼
                                    [사용자 브라우저]
                                           │
                                    (localStorage)
                                           │
                                           ▼
                                   [게시판 데이터 저장]
```

## 제약사항

- **서버 DB 없음**: 모든 데이터는 클라이언트 사이드 (localStorage)
- **게시판 데이터 휘발성**: 브라우저 캐시 삭제 시 게시판 데이터 소실
- **기기 간 동기화 불가**: localStorage는 해당 브라우저에만 저장
- **교안 콘텐츠 정적**: 빌드 도구 없이 수동 HTML 변환
