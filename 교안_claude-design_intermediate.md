> 최종 검증 2026-06-26 · Claude Design은 리서치 프리뷰라 UI·기능·연동 목록이 자주 바뀝니다. 화면이 교안과 달라 보이면 버튼 이름보다 "동선"을 기준으로 따라오세요.

# Claude Design — 중급자편

**대상**: 자기 브랜드/디자인 시스템을 가진 팀·1인 크리에이터
**목표**: 디자인 시스템을 자동 구축하고, 다양한 입력으로 실전 결과물을 만들며, Canva·Lovable·Vercel 등으로 익스포트·협업까지 한 바퀴 돌리기
**소요 시간**: 약 3~4시간

---

## 어떤 교안을 봐야 할까요? (자가 진단)

이 교안은 **Claude Design으로 프롬프트 한 줄짜리 프로토타입은 만들어봤고, 이제 자기 브랜드를 일관되게 입히고 싶은 분**을 위한 중급 과정입니다.

| 나의 상황 | 추천 교안 |
|----------|----------|
| Claude Design이 처음이고 접근 방법부터 모른다 | → 초보자편 |
| 프롬프트로 피치덱·랜딩 페이지는 만들어봤다 | → 이 교안 (중급자편) |
| `/design`·`/design-sync`로 코드 라운드트립을 돌리고 싶다 | → 개발자편 |

선수 학습: **Claude Design 초보자편**(접근 조건·첫 프로토타입·토큰 절약)을 먼저 보고 오세요.

---

## 추천 리소스

| 리소스 | 설명 | 링크 |
|--------|------|------|
| Claude Design 제품 페이지 | 공식 기능·접근 자격 안내 | https://claude.com/product/design |
| 6월 업데이트 공식 블로그 | 디자인 시스템 임포트·브랜드 통제 설명 | https://claude.com/blog/claude-design-stays-on-brand-for-daily-work |
| Vercel 배포 가이드 | Claude Design 결과물 Vercel 배포 | https://vercel.com/kb/guide/claude-design |
| 진입점 | claude.ai/design | https://claude.ai/design |

> 같은 흐름의 다른 도구: [Lovable 중급자편](lovable-intermediate.html)(프로덕션 앱 배포), [Cursor 중급자편](cursor-intermediate.html)(에디터 기반 AI 코딩)도 함께 보면 좋습니다.

---

## 1. 디자인 시스템 자동 구축

### 1-1. 디자인 시스템이란

디자인 시스템(design system)은 **색상(colors)·타이포그래피(typography)·컴포넌트(components)**를 하나로 묶은 브랜드 규칙집입니다. Claude Design의 가장 큰 특징은 이 디자인 시스템을 **온보딩 단계에서 자동으로 구축**한다는 점입니다.

### 1-2. 무엇을 읽어서 학습하나

처음 세팅할 때 Claude는 두 가지를 읽어 디자인 시스템을 구성합니다.

| 입력 | 설명 |
|------|------|
| 코드베이스(codebase) | 연결된 GitHub 저장소를 읽어 실제 쓰이는 색·폰트·컴포넌트 추출 |
| 디자인 파일(design files) | 업로드한 기존 디자인 자료에서 스타일 추출 |
| 원본(raw) 업로드 | 색상값·폰트 파일 등 원본 자산 직접 업로드 |

6월 17일 업데이트로 이 부분이 강화되어 **GitHub 저장소·디자인 파일·원본 업로드에서 하나 이상의 디자인 시스템**을 가져올 수 있습니다.

핸즈온: 디자인 시스템 가져오기

1. claude.ai/design 진입 → 새 프로젝트 또는 설정에서 "디자인 시스템" 추가
2. GitHub 저장소 연결 또는 디자인 파일 업로드
3. Claude가 색·타이포·컴포넌트를 자동 추출하는 동안 대기

> 스크린샷: 디자인 시스템 임포트 화면 (GitHub 연결/파일 업로드 선택)

> 체크포인트: 추출된 디자인 시스템에 내 브랜드 색상과 폰트가 카드 형태로 표시됨.

### 1-3. 여러 버전 유지·관리

디자인 시스템은 시간이 지나며 다듬을 수 있고, **여러 버전(multiple versions)**을 유지할 수 있습니다. 예를 들어 "메인 브랜드", "다크 모드용", "이벤트 캠페인용"을 각각 버전으로 관리합니다.

### 1-4. 자동 브랜드 정합 (auto-correct)

Claude가 결과물을 만든 뒤 **디자인 시스템에 대조(check)하고 자동 교정(auto-correct)**한 다음 사용자에게 보여줍니다. 즉 승인된 컴포넌트·토큰에 자동으로 맞춰지므로, 결과물이 브랜드에서 벗어나는 일이 줄어듭니다.

> 체크포인트: 동일 프롬프트로 만든 결과물 두 개가 같은 폰트·색 팔레트를 일관되게 사용함.

---

## 2. 실전 활용 — 다양한 입력으로 만들기

### 2-1. 입력 방식 5종

Claude Design은 텍스트 외에도 여러 입력을 받습니다.

| 입력 유형 | 설명 | 중급 활용 예 |
|----------|------|-------------|
| 텍스트 프롬프트 | 자연어로 무엇을 만들지 설명 | "우리 브랜드 톤으로 채용 공고 랜딩 페이지" |
| 이미지 업로드 | 참고 이미지·스크린샷 | 경쟁사 화면을 참고로 첨부 |
| 문서 업로드 | DOCX·PPTX·XLSX | 기존 기획서(워드)를 슬라이드로 변환 |
| 코드베이스 연동 | 저장소에서 컴포넌트 추출 | 실제 컴포넌트로 프로토타입 구성 |
| 웹 캡처(web capture) | 웹사이트의 요소를 그대로 가져오기 | 기존 사이트 헤더를 잡아와 리디자인 |

### 2-2. 핸즈온 — 문서를 슬라이드로

1. PPTX 또는 DOCX 기획서를 캔버스에 업로드
2. "이 문서를 12장짜리 피치덱으로, 우리 디자인 시스템에 맞춰 만들어줘"라고 지시
3. 생성된 덱을 인라인 코멘트·직접 편집·조정 슬라이더로 다듬기

> 스크린샷: 문서 업로드 후 슬라이드 덱이 생성된 캔버스

> 체크포인트: 원본 문서의 내용이 슬라이드로 재구성되고, 색·폰트가 디자인 시스템과 일치함.

### 2-3. 핸즈온 — 웹 캡처로 리디자인

1. 웹 캡처 도구로 참고할 사이트의 요소(헤더·카드 등)를 잡아오기
2. "이 헤더를 우리 브랜드 색으로 바꿔서 다시 그려줘"
3. 조정 노브(간격·색·레이아웃)로 미세 조정

> 체크포인트: 캡처한 요소가 캔버스에 들어오고, 디자인 시스템 색으로 재구성됨.

### 2-4. 토큰 절약 팁 (중급에서도 유효)

6월 업데이트로 토큰 효율이 개선되고 채팅·Cowork·Claude Code와 사용 한도를 공유하게 되었지만, 여전히 **와이어프레임 모드로 초기 반복을 저렴하게 돌리고, 구조가 잡힌 뒤에만 정교한 목업을 저장**하는 절약 습관을 권장합니다.

---

## 3. 익스포트 9종

### 3-1. 기본 익스포트

| 익스포트 | 용도 |
|----------|------|
| HTML(단독 파일) | 정적 사이트·랜딩 페이지로 바로 |
| PDF | 문서 제출·인쇄 |
| PPTX | 발표용 파워포인트 |
| 내부 URL·폴더·조직 범위 링크 | 팀 공유 |

### 3-2. 커넥터 9종 (후속 편집·배포)

알파벳순: **Adobe · Base44 · Canva · Gamma · Lovable · Miro · Replit · Vercel · Wix** ("더 많은 목적지 추가 예정").

| 커넥터 | 활용 |
|--------|------|
| Canva | 디자이너·마케터가 Canva에서 후속 편집 |
| Lovable | 온브랜드 앱 디자인 → Lovable에서 프로덕션 앱으로 |
| Vercel | 라이브 프로덕션 URL로 배포 |
| Replit / Base44 / Wix | 각 플랫폼에서 후속 개발 |
| Miro / Gamma / Adobe | 화이트보드·덱·전문 편집 |

### 3-3. 핸즈온 — Vercel 배포 (Git/CLI 불필요)

1. 결과물을 Vercel 커넥터로 보내거나, HTML을 .zip으로 익스포트
2. .zip을 Vercel Drop에 끌어다 놓기 (Git·CLI 없이 즉시 배포)
3. 발급된 라이브 URL 확인

> 스크린샷: 익스포트 메뉴(커넥터 9종 목록)

> 체크포인트: Vercel이 발급한 https URL로 결과물이 실제 웹에서 열림.

### 3-4. 핸즈온 — Lovable 연동

1. Claude Design에서 온브랜드로 앱 화면을 디자인
2. Lovable 커넥터로 전송
3. Lovable에서 프로덕션 앱으로 이어 작업 (→ [Lovable 중급자편](lovable-intermediate.html) 참고)

---

## 4. 협업

### 4-1. 조직 범위 공유 권한

결과물은 **조직 범위(organization-scoped)**로 공유하며 권한을 세분화합니다.

| 권한 | 설명 |
|------|------|
| private | 비공개 (본인만) |
| view-only | 보기 전용 |
| edit | 편집 가능 |

내부 URL·폴더로 팀에 전달합니다.

### 4-2. 엔터프라이즈 브랜드 통제

6월 업데이트로 새 **관리자 역할(admin role)**이 추가되었습니다. 관리자는 **단일 표준 디자인 시스템을 승인하고 편집을 잠가(lock down)** 모든 결과물이 회사 가이드라인에 부합하도록 강제할 수 있습니다. 팀 규모가 커질수록 브랜드 일관성을 지키는 핵심 장치입니다.

> 체크포인트: 팀원이 만든 결과물이 관리자가 잠근 표준 디자인 시스템을 따름.

---

## 5. 다음 단계

- 디자인→코드 풀루프(`/design`·`/design-sync`·핸드오프 번들)가 궁금하다면 → **Claude Design 개발자편**
- 프로토타입을 진짜 앱으로 → [Lovable 중급자편](lovable-intermediate.html)
- 에디터에서 AI 코딩 → [Cursor 중급자편](cursor-intermediate.html)

---

## 더 배우려면 (공식 자료)

- Claude Design 제품 페이지: https://claude.com/product/design
- 6월 업데이트 공식 블로그: https://claude.com/blog/claude-design-stays-on-brand-for-daily-work
- Claude Design 출시 발표: https://www.anthropic.com/news/claude-design-anthropic-labs
- Vercel 배포 가이드: https://vercel.com/kb/guide/claude-design
- Claude 가격: https://claude.com/pricing

---

## 출처 및 참고자료

| 출처 | 설명 |
|------|------|
| Anthropic 공식 — Claude Design 발표 | anthropic.com/news/claude-design-anthropic-labs |
| Anthropic 공식 — 6월 업데이트 블로그 | claude.com/blog/claude-design-stays-on-brand-for-daily-work |
| Anthropic 공식 — 제품 페이지 | claude.com/product/design |
| Vercel KB — 배포 가이드 | vercel.com/kb/guide/claude-design |

> 본 교안 내용은 2026년 6월 26일 기준이며, Claude Design은 리서치 프리뷰라 게시 시점에 공식 페이지 재확인이 필요합니다. 모든 인용은 익명 처리되었습니다.
