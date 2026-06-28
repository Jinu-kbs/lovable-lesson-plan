# Claude Design — 개발자편

> **최종 검증 2026-06-26 · 리서치 프리뷰** — Claude Design은 2026년 4월 출시 후 두 달 만(6월 17일)에 대규모 오버홀이 있었을 만큼 변화가 빠릅니다. UI·명령어·커넥터 목록·토큰 정책은 게시 시점에 공식 페이지에서 재확인하세요.

**대상**: 디자인 → 코드 풀루프를 자동화하려는 개발자
**선수 학습**: [Claude Design 중급자편](claude-design-intermediate.html), [Claude Code 개발자편](claude-code-developer.html)
**목표**: `/design`·`/design-sync` 양방향 핸드오프와 핸드오프 번들을 활용해 디자인에서 프로덕션 코드까지 한 루프로 돌린다
**소요 시간**: 약 4~5시간

---

## 목차

1. [자가 진단](#diag)
2. [추천 리소스](#resources)
3. [Claude Code 양방향 핸드오프](#s1)
4. [핸드오프 번들 구조](#s2)
5. [코드 라운드트립](#s3)
6. [GitHub 디자인 시스템 임포트](#s4)
7. [엔터프라이즈 브랜드 통제·사용 한도 공유](#s5)
8. [다음 단계](#s6)
9. [출처](#sources)
10. [핵심 가정 + 검증 체크리스트](#verify)

---

## 자가 진단 {#diag}

이 교안은 **Claude Code를 이미 쓰고 있고, 디자인 산출물을 실제 컴포넌트 라이브러리에 연결하고 싶은 개발자**를 대상으로 합니다.

| 항목 | 필요 수준 |
|------|----------|
| Claude Code 사용 | **필수** — 터미널에서 슬래시 명령(`/init` 등) 경험 |
| Claude 구독 | **필수** — Pro/Max/Team/Enterprise (Free 불가) |
| 디자인 시스템 개념 | **권장** — 디자인 토큰, 컴포넌트 라이브러리 이해 |
| Git/GitHub | **권장** — 저장소 연결, PR 흐름 |

Claude Code가 처음이라면 [Claude Code 개발자편](claude-code-developer.html)을 먼저 보세요. Claude Design 자체가 처음이라면 [중급자편](claude-design-intermediate.html)부터 시작하세요.

---

## 추천 리소스 {#resources}

| 리소스 | 설명 | 링크 |
|--------|------|------|
| Claude Design 공식 발표 | Anthropic Labs 출시 발표 | anthropic.com/news/claude-design-anthropic-labs |
| 6월 업데이트 블로그 | 브랜드 정합·코드 동기화 오버홀 | claude.com/blog/claude-design-stays-on-brand-for-daily-work |
| 공식 제품 페이지 | 기능·커넥터·익스포트 목록 | claude.com/product/design |
| Vercel 배포 가이드 | Claude Design 결과물 배포 | vercel.com/kb/guide/claude-design |

---

## 1. Claude Code 양방향 핸드오프 {#s1}

### 학습 목표
- `/design`·`/design-sync` 두 명령의 역할 차이를 이해한다
- "디자인 → 코드"가 아니라 "디자인 ↔ 코드" 양방향 동기화임을 파악한다
- 코딩 에이전트가 "백지에서 시작하지 않는" 워크플로우를 설계한다

### 1.1 왜 양방향인가

2026년 6월 오버홀의 핵심은 **Claude Design과 Claude Code가 같은 시스템**이 되었다는 점입니다. 디자인을 이미지나 PNG로 던지고 개발자가 눈으로 보며 재현하던 단방향 핸드오프가 사라졌습니다. 대신 Claude Code 터미널에서 디자인을 직접 끌어오거나(`/design-sync`), 디자인 프로젝트를 생성·편집·동기화(`/design`)할 수 있습니다.

### 1.2 `/design-sync` — 디자인 시스템을 코드로 끌어오기

`/design-sync`는 **디자인 시스템을 Claude Code 컨텍스트로 가져옵니다.** 코딩 작업이 백지가 아니라 "이미 승인된 컴포넌트·토큰"에서 시작하도록 만드는 명령입니다.

```bash
# Claude Code 터미널에서
/design-sync

# 결과: 연결된 디자인 시스템(색상·타이포·컴포넌트·토큰)이
# 현재 코드 작업의 컨텍스트로 올라온다.
# 이후 "새 카드 컴포넌트 만들어줘" 같은 요청이
# 기존 디자인 시스템에 맞춰 생성된다.
```

### 1.3 `/design` — Claude Code를 떠나지 않고 디자인하기

`/design`은 **터미널을 벗어나지 않고 디자인 프로젝트를 생성·편집·동기화**합니다.

```bash
# Claude Code 터미널에서
/design 교사 연수 신청 페이지의 히어로 섹션 프로토타입 만들어줘

# Claude Design 프로젝트가 생성/갱신되고,
# 캔버스 결과가 코드 작업과 연결된 상태로 유지된다.
```

### 1.4 두 명령 비교

| 명령 | 방향 | 용도 |
|------|------|------|
| `/design-sync` | 디자인 → 코드 | 디자인 시스템을 코드 컨텍스트로 끌어옴 (컴포넌트에서 시작) |
| `/design` | 코드 → 디자인 | 터미널에서 디자인 프로젝트 생성·편집·동기화 |

> 명령어 동작은 Claude Code 버전에 따라 다를 수 있습니다. 게시 시점에 실제 버전에서 동일하게 동작하는지 확인하세요. — 실사용자 조언

---

## 2. 핸드오프 번들 구조 {#s2}

### 학습 목표
- 핸드오프 번들이 이미지가 아니라 기계 판독 가능 스펙임을 이해한다
- 번들에 들어가는 5가지 구성요소를 파악한다
- "생산자=소비자" 네이티브 포맷의 장점을 설명할 수 있다

### 2.1 핸드오프 번들이란

Claude Design → Claude Code로 디자인을 넘길 때, **이미지나 파일 링크가 아니라 "핸드오프 번들(handoff bundle)"이라는 기계 판독 가능 명세(machine-readable spec)**를 넘깁니다. 이것이 단방향 시절과의 결정적 차이입니다.

### 2.2 번들에 들어가는 5가지

| 구성요소 | 설명 |
|----------|------|
| **컴포넌트 구조(component structure)** | 기계 판독 가능한 컴포넌트 스펙 |
| **디자인 토큰(design tokens)** | 실제 캔버스에서 사용한 색상·간격·타이포 토큰 |
| **레이아웃 계층(layout hierarchy)** | 요소의 중첩·정렬·배치 구조 |
| **참조된 에셋(referenced assets)** | 아이콘·이미지 등 사용된 자산 |
| **스펙 파일(spec file)** | Claude Code가 바로 읽을 수 있는 명세 파일 |

개념적으로 스펙 파일은 다음과 같은 형태로 컴포넌트·토큰·레이아웃을 함께 담습니다.

```json
{
  "component": "HeroSection",
  "tokens": {
    "color.primary": "#C026D3",
    "spacing.lg": "24px",
    "font.heading": "Pretendard, 700"
  },
  "layout": {
    "type": "stack",
    "align": "center",
    "children": ["Heading", "Subtext", "CtaButton"]
  },
  "assets": ["hero-illustration.svg"]
}
```

> 위 JSON은 개념 설명용 예시입니다. 실제 번들 포맷은 Claude Design/Claude Code가 공유하는 네이티브 포맷이며 공개 스키마가 아닐 수 있습니다.

### 2.3 "생산자=소비자" 네이티브 포맷의 장점

JSON 디자인 토큰 같은 표준위원회식 타협 포맷은 도구마다 해석이 갈려 **번역(translation) 단계**가 필요합니다. 반면 Claude Design(생산자)과 Claude Code(소비자)는 같은 시스템이므로 번역 단계가 사라집니다. Claude Code는 번들을 컨텍스트에 올리고 **실제 컴포넌트 라이브러리에 맞춰 프로덕션 코드**를 생성합니다.

---

## 3. 코드 라운드트립 {#s3}

### 학습 목표
- 디자인 → 코드 → 디자인으로 이어지는 전체 루프를 설계한다
- 핸드오프 직후 코드 생성·검증 단계를 실습한다
- 라운드트립에서 디자인 시스템이 단일 진실 원천(SSOT) 역할을 하도록 만든다

### 3.1 전체 루프

```
1. Claude Design에서 기능 설명 → 캔버스에 프로토타입 생성
2. 채팅·인라인 코멘트·직접 편집으로 다듬기
3. "Send to Claude Code" → 핸드오프 번들 익스포트
4. Claude Code가 번들을 받아 실제 코드 생성
   (/design-sync로 디자인 시스템 동기화)
5. 코드에서 바뀐 부분을 /design으로 디자인에 반영 (라운드트립)
```

### 3.2 핸드오프 직후 코드 생성

```bash
# Claude Code 터미널 — 번들을 받은 직후
/design-sync                      # 디자인 시스템 컨텍스트 로드
> 방금 받은 HeroSection 번들을 React 컴포넌트로 구현해줘.
> 기존 디자인 토큰과 컴포넌트 라이브러리를 그대로 사용해.
```

생성된 컴포넌트는 디자인 토큰을 하드코딩하지 않고, 동기화된 시스템의 토큰을 참조하도록 만드는 것이 핵심입니다.

```jsx
// 디자인 토큰을 참조하는 형태 (값 하드코딩 회피)
import { tokens } from "@/design-system/tokens";

export function HeroSection({ title, subtitle, onCta }) {
  return (
    <section style={{ padding: tokens.spacing.lg, textAlign: "center" }}>
      <h1 style={{ color: tokens.color.primary, font: tokens.font.heading }}>
        {title}
      </h1>
      <p>{subtitle}</p>
      <CtaButton onClick={onCta}>신청하기</CtaButton>
    </section>
  );
}
```

<!-- 핸즈온: 코드 라운드트립 검증 -->
**[스크린샷] Claude Code 터미널에서 핸드오프 번들 수신 직후 화면**

> **✓ 체크포인트** `/design-sync` 실행 후 디자인 시스템이 컨텍스트에 로드되고, 생성된 컴포넌트가 새 토큰 값을 하드코딩하지 않고 디자인 시스템의 토큰을 참조하면 라운드트립이 성립한 것입니다.

### 3.3 배포로 연결

라운드트립이 끝난 코드는 그대로 배포로 이어집니다. HTML 단독 익스포트는 정적 사이트로, Vercel 커넥터(또는 .zip → Vercel Drop, Git/CLI 불필요)는 라이브 프로덕션 URL로 연결됩니다. 자세한 배포 흐름은 배포 교안을 참고하세요.

---

## 4. GitHub 디자인 시스템 임포트 {#s4}

### 학습 목표
- GitHub 저장소에서 디자인 시스템을 가져오는 흐름을 이해한다
- 자동 브랜드 대조·자동 교정 동작을 파악한다
- 여러 디자인 시스템 버전을 운영한다

### 4.1 임포트 소스 3종

6월 오버홀로 **GitHub 저장소, 디자인 파일, 원본(raw) 업로드**에서 하나 이상의 디자인 시스템을 가져올 수 있게 되었습니다.

| 소스 | 설명 |
|------|------|
| **GitHub 저장소** | 코드베이스에서 색상·타이포·컴포넌트를 추출 |
| **디자인 파일** | 업로드한 기존 디자인 자료 |
| **원본(raw) 업로드** | 토큰·스타일 정의 파일 직접 업로드 |

### 4.2 자동 대조·자동 교정

Claude는 만든 결과물을 디자인 시스템에 **대조(check)하고 자동 교정(auto-correct)**한 뒤 사용자에게 보여줍니다. 즉, 승인된 컴포넌트·토큰에 자동으로 맞춰진 결과만 캔버스에 나타납니다. 개발자 입장에서는 핸드오프 번들이 처음부터 "온브랜드" 상태로 도착한다는 의미입니다.

### 4.3 여러 버전 운영

디자인 시스템은 **여러 버전(multiple versions)**을 유지할 수 있습니다. 예: 프로덕션 v1과 리브랜딩 실험용 v2를 동시에 두고, `/design-sync` 시 어느 버전을 끌어올지 선택하는 식입니다.

```bash
# 개념 예시 — 버전을 지정해 동기화
/design-sync --system production-v1
```

> 버전 선택 UI·플래그는 게시 시점에 실제 화면에서 확인하세요. — 실사용자 경험

---

## 5. 엔터프라이즈 브랜드 통제·사용 한도 공유 {#s5}

### 학습 목표
- 관리자 역할(admin role)의 브랜드 통제 메커니즘을 이해한다
- 사용 한도 공유 구조와 토큰 예산 관리를 익힌다

### 5.1 엔터프라이즈 브랜드 통제

새 **관리자 역할(admin role)**은 단일 표준 디자인 시스템을 승인하고 편집을 잠급니다(lock down). 모든 결과물이 회사 가이드라인에 부합하도록 강제하는 장치입니다.

| 항목 | 동작 |
|------|------|
| 표준 시스템 승인 | 조직의 단일 디자인 시스템을 관리자가 지정 |
| 편집 잠금 | 구성원이 임의로 토큰·컴포넌트를 바꾸지 못하도록 잠금 |
| 강제 정합 | 모든 산출물이 승인 시스템에 자동 대조됨 |

> Enterprise에서 Claude Design은 **기본 비활성**입니다. 관리자가 Organization 설정에서 켜야 사용할 수 있습니다.

### 5.2 사용 한도 공유 — 토큰 예산 관리

6월 업데이트로 Claude Design이 **채팅·Claude Cowork·Claude Code와 사용 한도를 공유**하게 되었습니다. 별도 요금제는 없고 기존 구독 한도를 그대로 씁니다.

- 출시 초기에는 토큰 과소모가 심했습니다(한 리뷰에서 약 25분 만에 주간 한도의 80%를 소진했다는 보도가 여러 매체에 인용됨).
- 6월 업데이트로 턴당 평균 토큰이 줄고 오류율이 크게 낮아졌습니다.
- 그래도 한도를 공유하므로 **디자인 작업이 코딩·채팅 한도까지 잠식**합니다. 와이어프레임 모드로 초기 반복을 저렴하게 돌리고, 구조가 잡힌 뒤에만 정교한 목업을 저장하는 절약 전략이 여전히 유효합니다.

```bash
# 예산 관리 관점 — 핸드오프는 구조가 확정된 뒤에만
# 1) 와이어프레임 모드로 빠르게 여러 안 탐색 (저렴)
# 2) 확정된 안만 정교화
# 3) 확정 후 /design-sync → 코드 생성 (한도 공유 고려)
```

---

## 6. 다음 단계 {#s6}

이 교안을 마쳤다면 디자인-코드 루프를 다음 방향으로 확장할 수 있습니다.

| 방향 | 연결 교안 |
|------|----------|
| 코딩 에이전트 심화 | [Claude Code 개발자편](claude-code-developer.html) |
| 프로덕션 배포 | 배포 개발자편 |
| 형상 관리·PR 흐름 | Git/GitHub 개발자편 |
| 도구 비교 | AI 도구 5종 비교 |

**프런티어 디자인**도 함께 살펴보세요. Claude Design은 음성·비디오·셰이더·3D·내장 AI가 들어간 코드 기반 프로토타입까지 만들 수 있어, 핸드오프 번들을 통해 이런 인터랙티브 요소도 코드로 이어집니다.

### 더 배우려면

- [Claude Design 공식 발표](https://www.anthropic.com/news/claude-design-anthropic-labs)
- [6월 업데이트 블로그 — 브랜드 정합·코드 동기화](https://claude.com/blog/claude-design-stays-on-brand-for-daily-work)
- [공식 제품 페이지](https://claude.com/product/design)
- [Vercel 배포 가이드](https://vercel.com/kb/guide/claude-design)
- [Claude 가격](https://claude.com/pricing)

---

## 출처 및 참고자료 {#sources}

| 출처 | 설명 |
|------|------|
| Anthropic 공식 — Claude Design 발표 | anthropic.com/news/claude-design-anthropic-labs |
| Anthropic 공식 — 6월 업데이트 블로그 | claude.com/blog/claude-design-stays-on-brand-for-daily-work |
| Anthropic 공식 — 제품 페이지 | claude.com/product/design |
| Vercel Knowledge Base | vercel.com/kb/guide/claude-design |
| VentureBeat / TechRepublic | 6월 오버홀·브랜드 통제·코드 동기화 보도 (교차검증) |

---

## 핵심 가정 + 검증 체크리스트 {#verify}

### 핵심 가정 3줄
1. Claude Design은 2026년 6월 기준 리서치 프리뷰이며, UI·명령어·커넥터·토큰 정책이 빠르게 바뀐다(게시 시점 재확인 전제).
2. 핵심 개발자 가치는 `/design`·`/design-sync` 양방향 핸드오프와 기계 판독 가능한 핸드오프 번들(컴포넌트 스펙+토큰+레이아웃+에셋+스펙 파일)이다.
3. 별도 요금이 없고 채팅·Cowork·Claude Code와 사용 한도를 공유하므로, 디자인 작업이 코딩 한도까지 잠식한다(예산 관리 필요).

### 검증 체크리스트 (PI 김병선 직접 확인)
- [ ] `/design`·`/design-sync` 명령이 현재 Claude Code 버전에서 동일하게 동작하는지 실제 테스트
- [ ] "Send to Claude Code" 버튼 명칭·핸드오프 번들 익스포트 UI가 게시 시점과 일치하는지 확인
- [ ] 핸드오프 번들 JSON 예시가 개념 설명용임을 본문에 명시했는지 확인(실제 스키마 비공개 가능)
- [ ] GitHub 디자인 시스템 임포트 소스 3종이 공식 페이지와 일치하는지 재확인
- [ ] Enterprise 기본 비활성·관리자 활성 절차가 최신 문서와 일치하는지 확인
- [ ] 토큰 사용 한도 공유 정책이 게시 시점에 유효한지 확인

---

*본 교안은 '김선생의 바이브코딩 가이드' 개발자편 콘텐츠입니다. 무인 검색 기반 리서치를 바탕으로 했으므로 위 체크리스트는 사람(PI)이 직접 확인해야 합니다.*
