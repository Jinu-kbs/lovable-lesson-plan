# IA (Information Architecture) — 김선생의 러버블 입문 교안

## 사이트맵

```
/ (index.html) ─── 메인 랜딩 페이지
├── /beginner.html ─── 초보자편 교안
├── /intermediate.html ─── 중급자편 교안
└── /developer.html ─── 개발자편 교안
```

## 페이지별 구조

### 1. 메인 랜딩 (index.html)

```
Hero 섹션
├── 프로필 이미지 (teacher_kim.png)
├── 제목: "김선생의 러버블(Lovable) 입문 교안"
├── 소개 문구
├── SNS 링크 (Threads, Instagram)
├── AI 생성 자료 안내 문구
└── 이벤트 배지

자가 진단 섹션
├── Q1: AI 챗봇 경험 → 초보자편 / 다음
├── Q2: 개발 용어 이해 → 중급자편 / 다음
└── Q3: 코딩 경험 → 중급자편 / 개발자편

수준별 교안 카드 (3개)
├── 초보자편 카드 → beginner.html
├── 중급자편 카드 → intermediate.html
└── 개발자편 카드 → developer.html

이벤트 배너
├── 25시간 무료 빌드
├── $100 API 크레딧
└── $250 Stripe 크레딧

사용자 후기·질문 게시판 (localStorage)

Footer
├── 이벤트 안내 문구
└── 제공자 정보 + SNS 링크
```

### 2. 초보자편 (beginner.html)

```
TopNav: [초보자편(active)] [중급자편] [개발자편]

Sidebar (목차)                     Content (본문)
─────────────                     ──────────────
자가 진단                          어떤 교안을 봐야 할까요?
추천 리소스                        추천 리소스 테이블 (4개 링크)
1. 바이브코딩이란?                 바이브코딩 개념, 주목 이유
2. 러버블이란?                     러버블 특징 테이블, 영어 UI 안내
3. 용어 해설                       10개 용어 테이블
4. 사전 준비                       GitHub/Vercel/Lovable 가입 가이드
  └ 체크리스트                     4항목 체크리스트
5. 아이디어 구상하기               시작 미션 3가지, 직군별 추천 테이블
                                   예시 프롬프트 3종 (교사/소상공인/프리랜서)
6. PRD 만들기                      PRD 개념, 작성법, 예시 (카페 사이트)
7. 러버블 실습                     이벤트 시간 전략, Step 1~5 단계별 가이드
                                   프롬프트 예시 3종, 수정 요청 예시
8. 웹사이트 공개하기               방법 1: Publish / 방법 2: GitHub+Vercel / 방법 3: 수동
9. 이벤트 참여 미션                혜택 테이블, SNS 공유 방법
10. 트러블슈팅                     4개 문제 상황별 해결법
11. FAQ                            7개 질문·답변
12. 주의사항 및 팁                 크레딧 관리, 자주 하는 실수 4가지, 실전 노하우
13. 다음 단계                      학습 방향 테이블
전체 흐름 요약                     5단계 플로우
출처                               출처 테이블 (4개 소스)
```

### 3. 중급자편 (intermediate.html)

```
TopNav: [초보자편] [중급자편(active)] [개발자편]

Sidebar (목차)                     Content (본문)
─────────────                     ──────────────
이 교안이 맞는 분                  대상 설명, 수준 안내
추천 리소스                        추천 리소스 테이블 (4개 링크)
1. 바이브코딩 도구 비교            4개 도구 비교 테이블 (Lovable/안티그래비티/커서/AI Studio)
                                   도구 선택 가이드, 학습 경로
2. 효율적인 워크플로우             5단계 워크플로우, 단계별 도구·비용 테이블
3. 사전 준비                       필수 계정 테이블, 체크리스트
4. 기획 문서 작성 실습             PRD/IA/ERD 작성법, 프롬프트 예시
  └ PRD/IA/ERD                     IA 예시 2종, 직군별 PRD 포인트 테이블
5. 러버블 심화 활용                Chat 모드 전략, 프롬프트 노하우
  └ Chat 모드/프롬프트/파일관리     역할부여/단계별/부정 프롬프트 예시
  └ UI/UX 흐름                     사용자 흐름 설계 팁
6. 실전 프로젝트                   직군별 추천 테이블, 온라인 강좌 사이트 실습
                                   Step 1~3 단계별 빌드 가이드
7. 배포                            방법 1: Publish / 방법 2: GitHub+Vercel
8. 데이터베이스 연결               DB 필요 여부 판단, 3개 외부 DB 비교 테이블
                                   Supabase 프롬프트 예시
9. 이벤트 참여 및 혜택             혜택 테이블, 시간 활용 전략, SNS 미션
10. 트러블슈팅                     5개 문제 상황별 해결법 (프로젝트 규모 경고 포함)
11. FAQ                            7개 질문·답변
12. 크레딧 최적화 전략             6가지 전략 테이블
13. 다음 단계                      5가지 방향 테이블
전체 프로세스 요약                 4단계 플로우
출처                               출처 테이블 (4개 소스)
```

### 4. 개발자편 (developer.html)

```
TopNav: [초보자편] [중급자편] [개발자편(active)]

Sidebar (목차)                     Content (본문)
─────────────                     ──────────────
이 교안이 맞는 분                  대상 설명
추천 리소스                        추천 리소스 테이블 (4개 링크)
1. 기술 아키텍처                   스택 테이블 (React/Vite/TS/Tailwind/shadcn)
                                   프로젝트 디렉토리 구조, 포지셔닝 비교 테이블
                                   하이브리드 워크플로우 사례
2. 사전 준비                       필수 계정, 개발 환경 (Node/Git), 체크리스트
3. 기획 문서 체계                  PRD.md 템플릿 (기술 제약, P0/P1/P2 우선순위)
                                   IA.md 템플릿 (라우팅, 인증 흐름)
                                   ERD.md 템플릿 (SQL 스키마, RLS 정책)
4. 빌드 전략                       전략 1: 전체 투입 / 전략 2: 단계별 / 전략 3: 기존 코드
5. 코드 커스터마이징               로컬 실행, 주요 파일 분석, Tailwind/환경변수 설정
6. GitHub 연동                     러버블 연동, 하이브리드 워크플로우, 양방향 동기화
                                   브랜치 전략 (main/develop/feature)
7. 외부 서비스 연동                Supabase/Stripe/기타 연동 프롬프트 예시
8. 배포 및 운영                    Publish, Vercel CLI, 커스텀 도메인, 모니터링 도구
9. 마이그레이션                    로컬(VS Code/Cursor), Claude Code, 안티그래비티
                                   마이그레이션 체크리스트 테이블
10. 디버깅 가이드                  러버블/로컬/Supabase/Vercel 에러 해결
                                   일반적 문제 테이블, 프로젝트 규모 주의사항
11. 이벤트 참여 및 혜택            개발자 활용법 테이블, 시간 활용 전략
12. 다음 단계                      6가지 방향 테이블
워크플로우 요약                    기획→빌드→운영 플로우
출처                               출처 테이블 (4개 소스)
```

## 네비게이션 흐름

```
index.html
    │
    ├─[초보자편 카드 클릭]──→ beginner.html
    │                           ├─[중급자편 링크]──→ intermediate.html
    │                           └─[개발자편 링크]──→ developer.html
    │
    ├─[중급자편 카드 클릭]──→ intermediate.html
    │                           ├─[초보자편 링크]──→ beginner.html
    │                           └─[개발자편 링크]──→ developer.html
    │
    └─[개발자편 카드 클릭]──→ developer.html
                                ├─[초보자편 링크]──→ beginner.html
                                └─[중급자편 링크]──→ intermediate.html
```

## 외부 링크 목록

| 대상 | URL | 사용 위치 |
|------|-----|-----------|
| Lovable | https://lovable.dev | 전 교안 |
| GitHub | https://github.com | 전 교안 |
| Vercel | https://vercel.com | 전 교안 |
| 기획 도우미 Gem | https://gemini.google.com/gem/1yC701ZmuJgy_D4hkyNz0t50EqAnBj3kh | 전 교안 |
| YouTube 영상 | https://youtu.be/bWY5n0GYgG8 | 전 교안 |
| Cool Hot Story | https://cool-hot-story.lovable.app | 전 교안 |
| 레고 학급경영 | https://brick-academy-hub.lovable.app/ | 전 교안 |
| Threads | https://www.threads.net/@byeongseon_jinuchem | index.html |
| Instagram | https://www.instagram.com/byeongseon_jinuchem | index.html |

## 반응형 브레이크포인트

- **모바일** (≤600px): 1열 카드, 사이드바 숨김, 폰트 축소
- **데스크톱** (>600px): 사이드바 + 본문 2열 레이아웃
