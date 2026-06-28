> **프리뷰 경고 / 최종 검증 2026-06-26** — Claude Cowork는 2026년 1월 프리뷰 → 4월 정식 출시(GA)된 신생 제품으로 가격·기능·모델·커넥터 목록이 거의 매달 바뀝니다. 게시 시점에 반드시 claude.com 및 support.claude.com에서 재확인하세요.

# Claude Cowork — 개발자편

**대상**: 개발 경험자, Claude Code 사용자, 플러그인·MCP·기업 배포를 설계하는 엔지니어
**목표**: 커스텀 플러그인 제작, 고급 워크플로우 자동화, MCP 연동, 기업 거버넌스·보안을 다룬다
**소요 시간**: 약 4~5시간

상호 참조: 동일 기반인 [Claude Code 개발자편](claude-code-developer.html), 연동 핵심인 [MCP 개발자편](mcp-developer.html)을 함께 보면 이해가 빠릅니다.

---

## 목차

1. Cowork의 개발자 관점 — Claude Code와 같은 기반
2. 샌드박스 아키텍처와 격리 구조
3. 커스텀 플러그인 제작 (오픈소스 플러그인 구조)
4. 고급 워크플로우 · 자동화
5. MCP / 커넥터 연동
6. 기업 거버넌스 · 보안 (권한 모드 · 규제 데이터 한계)
7. 더 배우려면
8. 출처

---

## 1. Cowork의 개발자 관점 — Claude Code와 같은 기반

Claude Cowork와 Claude Code는 **같은 기술 기반(same technical foundations)** 위에 서 있습니다. 한 저명 개발자/평론가는 직접 사용 후 "Cowork는 덜 위협적인 기본 인터페이스로 감싸고, 기술 지식 없이도 알아서 파일시스템 샌드박스가 구성되는, 사실상 일반 Claude Code"라고 요약했습니다.

따라서 개발자에게 Cowork는 새 도구를 배우는 일이 아니라, **이미 아는 Claude Code의 거버넌스/UI 레이어를 비개발자 동료에게 배포하는 일**에 가깝습니다.

| 항목 | Claude Code | Claude Cowork |
|------|-------------|---------------|
| 인터페이스 | 터미널(CLI) | 데스크톱 앱 탭(Chat / Cowork) |
| 샌드박스 | 사용자가 직접 구성 | 자동 구성 (VM 기반 격리) |
| 타깃 | 개발자 | 비개발자 지식노동자 |
| 플러그인 | 개발자용 플러그인 | UI 중심으로 재포장된 동일 플러그인 |
| 모델 | 최신 Claude (Opus 계열) | 최신 Opus 계열, 1M 토큰 컨텍스트 |

> Anthropic 제품팀의 설명: 개발자용 플러그인을 Cowork로 가져와 사용자 친화적·UI 중심 형태로 만들어 최대한 많은 사람이 쓸 수 있게 한 것이 이번 출시의 핵심이다.

개발자가 해야 할 일은 명확합니다. (1) 팀의 워크플로우를 플러그인으로 코드화하고, (2) 안전한 커넥터/MCP 경계를 설계하며, (3) 조직 거버넌스와 관측성을 세팅하는 것입니다.

---

## 2. 샌드박스 아키텍처와 격리 구조

### 2.1 VM 기반 로컬 격리

- Cowork의 파일/폴더 작업은 **격리된 가상머신(VM) 안에서 로컬 실행**됩니다.
- macOS에서는 **VZVirtualMachine (Apple Virtualization Framework)** 를 사용하고, 커스텀 Linux 루트 파일시스템(rootfs)을 내려받아 부팅합니다.
- 이 격리 덕분에 명시적으로 허용한 디렉터리 외 파일에는 접근하지 못합니다.
- 세션 작업 경로는 격리 구조를 드러냅니다.

```
# 세션 작업 폴더 경로 예시 (VM 내부 마운트)
/sessions/zealous-bold-ramanujan/mnt/blog-drafts

# 구조 해설
/sessions/<세션ID>/        ← 세션별 격리 디렉터리
            mnt/<폴더명>/  ← 사용자가 명시적으로 연결한 로컬 폴더만 마운트
```

### 2.2 네트워크(egress) 제어

- 네트워크 권한은 사용자가 설정한 **egress(외부 통신) 설정**을 따릅니다.
- 단, 웹 검색·웹 가져오기(fetch) 도구는 서버 측에서 작동합니다.

### 2.3 Computer Use vs Cowork 샌드박스 — 반드시 구분

| 기능 | 격리 | 권한 모델 |
|------|------|-----------|
| **Cowork 파일/폴더 작업** | VM 샌드박스 **있음** | 허용 폴더만 마운트 |
| **Computer Use (컴퓨터 직접 제어)** | 샌드박스 **없음** | 앱별(per-app) 권한, blocklist 운영 |

> Computer Use는 Claude가 데스크톱·앱·브라우저를 직접 클릭/타이핑합니다. 투자·암호화폐 플랫폼 등 일부 앱은 기본 차단(off-limits by default)이며, 사용자가 앱 차단 목록(blocklist)을 운영할 수 있습니다. 이 둘을 혼동하면 보안 설계가 무너집니다.

---

## 3. 커스텀 플러그인 제작 (오픈소스 플러그인 구조)

### 3.1 플러그인이란

플러그인은 "Claude에게 일하는 방식, 사용할 도구·데이터, 핵심 워크플로우 처리법, 노출할 슬래시 명령(slash command)을 알려줘서 팀이 더 일관된 결과를 얻게" 합니다.

Anthropic은 2026년 1월 30일 **사내 제작 11종 플러그인을 오픈소스로 공개**했습니다. 공개된 직무 카테고리:

- 생산성(productivity), 엔터프라이즈 검색(enterprise search), 플러그인 제작/커스터마이즈
- 영업(sales), 재무(finance), 데이터(data), 법무(legal)
- 마케팅(marketing), 고객지원(customer support), 프로젝트 관리(project management), 생물학 연구(biology research)

### 3.2 시작 전략 — 신규 제작보다 포크/커스터마이즈

오픈소스 컬렉션에서 가장 가까운 플러그인을 가져와 커스터마이즈하는 것이 가장 빠릅니다. 직무에 맞는 게 없을 때만 신규 제작합니다.

```
1. 오픈소스 플러그인 컬렉션에서 가장 가까운 직무 플러그인 선택
2. 슬래시 명령 / 도구 / 데이터 소스 / 워크플로우를 우리 조직에 맞게 수정
3. 조직 플러그인 마켓플레이스로 공유 (2026-02-24부터)
4. 팀이 만들고 공유할수록 Claude는 교차기능 전문가(cross-functional expert)가 됨
```

### 3.3 플러그인 구성 요소

플러그인은 다음 4가지를 정의합니다.

```yaml
# plugin 정의 개념 구조 (직무 플러그인 예: 영업)
name: sales-workflow
description: CRM·지식베이스 연동 영업 자동화

# 1) 노출할 슬래시 명령
commands:
  - /research-prospect   # 잠재고객 리서치
  - /draft-followup      # 후속 연락 초안

# 2) 사용할 도구
tools:
  - web_search
  - file_read

# 3) 연결할 데이터 소스
data_sources:
  - crm_connector
  - knowledge_base

# 4) 워크플로우 처리 지침 (회사 영업 프로세스 학습)
instructions: |
  잠재고객 리서치 시 회사 ICP 기준을 우선 적용한다.
  후속 연락 초안은 우리 회사 톤앤매너 가이드를 따른다.
```

> **참고**: 본 프로젝트에는 `moai-cowork:finance-trade`, `moai-cowork:operations-hr`, `moai-cowork:legal-compliance`, `moai-cowork:marketing-growth` 등 직무별 Cowork 스킬/플러그인이 실제 설치되어 있습니다. 직무별 확장이 실재함을 시연 소재로 쓸 수 있습니다.

### 핸즈온: 플러그인 포크 → 커스터마이즈

> 가장 가까운 오픈소스 직무 플러그인을 골라 슬래시 명령 하나를 우리 조직 기준으로 바꿔 보세요.

(스크린샷 자리: Cowork Customize 섹션의 플러그인 목록)

체크포인트: Customize 섹션에 내가 수정한 플러그인이 보이고, 새 슬래시 명령이 작업 입력창에서 자동완성으로 노출됨.

---

## 4. 고급 워크플로우 · 자동화

### 4.1 예약 작업 (Scheduled Tasks)

2026년 2월 17일 추가된 기능으로 **정기(recurring)·온디맨드 작업**을 생성합니다. 스킬·플러그인·커넥터를 묶는 **Customize 섹션**도 함께 신설됐습니다.

```
예시 예약 작업 설계
- 트리거: 매주 월요일 09:00
- 입력 폴더: /reports/weekly-source
- 작업: 지난주 산출물 종합 → 주간 리포트 초안 생성
- 권한 모드: Ask before acting (검토 후 발송)
```

### 4.2 다단계 파이프라인 — 실측 사례

한 개발자가 "지난 3개월 블로그 초안을 검토하고, 내 웹사이트와 대조해 발행 여부를 확인한 뒤, 발행 준비된 글을 추천하라"는 작업을 주자 Claude가 **개별 검색 44회를 실행**하고 상세 분석과 추천을 생성했습니다. 즉 Cowork는 단발 명령이 아니라 **장시간 다단계 작업(long-horizon task)** 에 강합니다.

### 4.3 글로벌 지침으로 일관성 코드화

```
Settings > Cowork > Global instructions > Edit
- 출력 형식: 항상 한국어, 표는 마크다운
- 파일명 규칙: NN_주제_형식.ext
- 금지: 민감 폴더(금융/의료) 자동 처리 금지
→ 저장 시 모든 Cowork 작업에 일관 적용
```

### 핸즈온: 주간 리포트 예약 작업

> 매주 반복되는 문서 작업 하나를 예약 작업으로 등록하세요.

(스크린샷 자리: Scheduled Tasks 생성 화면)

체크포인트: 예약 작업 목록에 다음 실행 예정 시각이 표시되고, 권한 모드가 "Ask before acting"으로 설정됨.

---

## 5. MCP / 커넥터 연동

### 5.1 커넥터 관리

- **Settings > Connectors** 에서 커넥터를 관리합니다.
- "어떤 MCP를 Claude에 연결할지, 얼마나 자주 권한을 물을지" 직접 통제합니다.
- 2026년 6월 현재 지원/언급된 커넥터: Google Workspace(Drive·Gmail·Calendar), Microsoft 365, Slack, Jira, DocuSign, Apollo, Clay, Outreach, Similarweb, MSCI, LegalZoom, FactSet, WordPress, Harvey 등.

### 5.2 MCP 연동 — Claude Code와 동일 개념

Cowork는 Claude Code와 같은 MCP 생태계를 씁니다. 커스텀 MCP 서버 제작·연결 흐름은 [MCP 개발자편](mcp-developer.html)을 참고하세요. 핵심은 **연결 대상과 권한 빈도를 명시적으로 설정**하는 것입니다.

```json
// MCP 서버 연결 개념 (Cowork Settings > Connectors에서 관리)
{
  "mcpServers": {
    "internal-kb": {
      "command": "node",
      "args": ["./mcp-kb-server.js"],
      "permission": "ask-each-time"   // 또는 trusted
    }
  }
}
```

### 5.3 커넥터 실무 함정

> Cowork는 격리된 VM/컨테이너 안에서 돌기 때문에, Google Workspace 등 일부 커넥터는 컨테이너 내부의 자격증명(credential) 처리 문제로 추가 설정이 필요할 수 있다는 사용자 보고가 있습니다. "커넥터가 바로 안 붙을 수 있고 설정이 필요할 수 있다"는 점을 팀에 미리 안내하세요.

### 5.4 Slack 통합 (2026-06-23)

Team/Enterprise 플랜에서 Slack 대화 중 Claude를 직접 태그(@)해 작업을 위임하고, 사용자는 다른 일에 집중할 수 있습니다.

### 핸즈온: 내부 MCP 서버 연결

> 사내 지식베이스를 MCP 서버로 노출하고 Cowork에 권한 빈도 "ask-each-time"으로 연결하세요.

(스크린샷 자리: Settings > Connectors 권한 빈도 설정 화면)

체크포인트: 작업 실행 시 해당 MCP 호출마다 승인 다이얼로그가 뜨고, 거부 시 작업이 멈춤.

---

## 6. 기업 거버넌스 · 보안 (권한 모드 · 규제 데이터 한계)

### 6.1 두 가지 권한 모드

| 모드 | 동작 | 권장 상황 |
|------|------|-----------|
| **Ask before acting** | 각 행동마다 멈추고 승인 요청 | 새 도구·낯선 파일 — 기본 권장 |
| **Act without asking** | 멈추지 않고 빠르게 실행 | 신뢰하는 파일·정의가 명확한 작업에만 |

> "Ask before acting"는 **소프트 경계**입니다. 테스트에서 Claude가 승인된 계획에서 벗어나는(drift) 사례가 관찰됐고, 사용자가 습관적으로 "OK"를 누르는 **승인 피로(approval fatigue)** 위험이 있습니다. "Act without asking"는 간접 프롬프트 인젝션 위험을 높입니다.

### 6.2 안전 가드레일

- **삭제 보호**: 파일 영구 삭제 전 반드시 명시적 권한("Allow") 요구
- **프롬프트 인젝션 탐지**: 신뢰할 수 없는 콘텐츠가 컨텍스트에 들어올 때 서버 측 probe가 스캔, 행동 탈취 시도로 보이면 경고 추가
- **위험 작업 회피 훈련**: 자금 이체·파일 삭제·민감 데이터 처리 회피
- **헌법(Constitution) 기반**: 모호한 상황에서 "우려 제기·명확화 요청·진행 거부"를 임의 진행보다 우선

> Anthropic 스스로 보호 장치가 "불완전(imperfect)"하다고 인정합니다. 은행·의료·정부 앱, 민감한 재무 문서에는 접근 권한을 주지 마세요.

### 6.3 기업 배포 · RBAC

- 2026년 6월 현재 **어떤 조직이든 영업 상담 없이 웹사이트에서 직접 Enterprise 플랜 구매** 가능.
- 단일 좌석 유형(single seat type)에 Claude · Claude Code · Cowork 접근이 모두 포함.
- 관리자는 특정 팀에만 Cowork를 켜고, 부서별 기능 제한, **역할 기반 권한(RBAC)**, 그룹 지출 한도를 설정할 수 있음.

### 6.4 관측성 (GA 이후)

| 기능 | 내용 |
|------|------|
| Analytics API | Cowork 참여(engagement) 데이터 |
| Usage analytics | Team/Enterprise 사용량 추적 |
| OpenTelemetry | 활동 모니터링(관측성) |

### 6.5 규제 데이터 한계 — 반드시 명시

GA 이후에도 Cowork는 **규제 데이터(regulated data)에 대해 인증되지 않았습니다.**

- Anthropic의 HIPAA Business Associate Agreement(BAA)에서 **제외**
- 활동이 SOC 2 감사 로그에 **포착되지 않음**
- 중앙 집중식 감사 로깅 부재 (단, GA에서 OpenTelemetry·사용량 분석 추가)

> 의료·금융·정부 등 규제 데이터를 Cowork에 맡기지 마세요. 거버넌스 정책에 "규제 데이터 폴더는 절대 연결 금지"를 명문화하는 것을 권장합니다.

### 핸즈온: 거버넌스 베이스라인 적용

> 조직 정책으로 (1) 기본 권한 모드 Ask before acting, (2) 규제 데이터 폴더 연결 금지, (3) OpenTelemetry 수집 활성화를 설정하세요.

(스크린샷 자리: Enterprise 관리자 콘솔의 RBAC/기능 제한 화면)

체크포인트: 관리자 콘솔에서 부서별 Cowork on/off가 보이고, 사용량 분석 대시보드에 데이터가 수집되기 시작함.

---

## 7. 더 배우려면

### 공식 (1차 출처)

- 제품 페이지: https://www.anthropic.com/product/claude-cowork
- 시작하기: https://support.claude.com/en/articles/13345190-get-started-with-claude-cowork
- 안전하게 사용하기: https://support.claude.com/en/articles/13364135-use-claude-cowork-safely
- 컴퓨터 사용 허용: https://support.claude.com/en/articles/14128542-let-claude-use-your-computer-in-cowork
- 릴리스 노트: https://support.claude.com/en/articles/12138966-release-notes

### 플러그인 · 보안 (개발자 심화)

- Anthropic 오픈소스 플러그인 저장소: https://github.com/anthropics (직무별 플러그인 컬렉션)
- 보안 실무자 가이드(Harmonic Security): https://www.harmonic.security/resources/securing-claude-cowork-a-security-practitioners-guide
- 프롬프트 인젝션 방어(MintMCP): https://www.mintmcp.com/blog/claude-cowork-promt-injection

### 함께 보기 (사이트 내)

- [Claude Code 개발자편](claude-code-developer.html) — 동일 기반 도구
- [MCP 개발자편](mcp-developer.html) — 커넥터/MCP 서버 제작

---

## 8. 출처

| 출처 | 설명 |
|------|------|
| anthropic.com / claude.com | Claude Cowork 제품·가격·다운로드 공식 페이지 |
| support.claude.com | Help Center·릴리스 노트 (설치·안전·커넥터) |
| 개발자/평론 심층 분석 | Cowork = Claude Code 기반, 44회 검색 실측 사례 |
| 보안 실무 가이드 (Harmonic·MintMCP) | 프롬프트 인젝션 방어·보안 체크리스트 |
| 본 프로젝트 research/13_claude-cowork.md | 2026-06-26 스냅샷 종합 리서치 |

---

> 모든 인용은 개인정보 보호를 위해 익명 처리했습니다(— 실사용자 경험). 본 교안의 수치·기능은 2026-06-26 스냅샷이며 게시 시점 재확인이 필요합니다.
