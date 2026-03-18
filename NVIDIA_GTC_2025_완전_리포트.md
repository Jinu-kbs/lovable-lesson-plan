# NVIDIA GTC 2025 이벤트 완전 리포트

**2025년 3월 | SAP Center, San Jose, CA | AI 및 가속 컴퓨팅 컨퍼런스**

정리 요약 — 주메타뷰 노진송 CEO/CTO WWW.METAVU.IO

---

## 목차 (Table of Contents)

1. 프리게임 쇼 개요
2. 패널 토론 1 — 가속 컴퓨팅
3. 패널 토론 2 — AI 인프라
4. 패널 토론 3 — 오픈 모델
5. 패널 토론 4 — 에이전틱 AI
6. 패널 토론 5 — 피지컬 AI
7. 사이드라인 인터뷰 종합
8. Jensen Huang 키노트 — CUDA & 가속 컴퓨팅
9. Jensen Huang 키노트 — AI Factory & 추론
10. Jensen Huang 키노트 — 오픈 모델 & OpenClaw
11. Jensen Huang 키노트 — 피지컬 AI & 로보틱스
12. 핵심 주제 요약 & 결론

---

## 01. 프리게임 쇼 개요 (Pre-Game Show)

### 진행자 (HOSTS)

- Sarah Guo (Conviction 창립자 겸 Managing Partner)
- Gavin Baker (Atreides Management 창립자 겸 Managing Partner)
- Tiffany Jansen (현장 특파원)

NVIDIA GTC 2025는 역대 최대 규모로 개최되었으며, 젠슨 황 CEO의 기조연설에 앞서 Sarah Guo와 Gavin Baker가 진행하는 프리게임 쇼로 시작되었습니다. 올해 프리게임 쇼는 1주년을 맞이하였으며, 작년 발코니 코너에서의 소규모 프로덕션에서 시작하여 파리, 타이베이, 워싱턴 D.C.를 거쳐 다시 산호세로 돌아오며 대규모 행사로 성장했습니다.

현장 리포터 Tiffany Jansen은 Arena Green에서 아침 7시부터 줄을 선 수천 명의 참석자들과 함께 현장의 열기를 전달했습니다. 이번 GTC는 단순히 기술을 논하는 자리를 넘어, 개발자, 연구원, 스타트업, 업계 리더들이 모여 AI 혁명의 최전선을 탐구하는 축제의 장이 되었습니다.

> **SARAH GUO**
> "AI는 단순한 글로벌 경제의 기능이 아니라, 우리가 전 지구적 규모로 건설하고 탐험하며 제조하는 방식을 재편하는 엔진입니다."

프리게임 쇼는 5개의 주요 주제를 다루는 패널 토론으로 구성되었습니다:

- **가속 컴퓨팅 (Accelerated Computing)**: 모든 혁신의 기반
- **AI 인프라 (AI Infrastructure)**: 필수적인 기반 시설로의 진화
- **오픈 모델 (Open Models)**: 생태계 확장의 동력
- **에이전틱 AI (Agentic AI)**: 인지에서 행동으로의 변곡점
- **피지컬 AI (Physical AI)**: 디지털 지능의 물리 세계 진입

---

## 02. 가속 컴퓨팅 패널 (Accelerated Computing Panel)

### 참가자 (PARTICIPANTS)

- Mark Edelstein (Morgan Stanley)
- Dinesh Nirmal (IBM)
- Aki Jain (Palantir)
- Anirudh Devgan (Cadence)
- Dan Ping (Siemens)

### NVIDIA의 초기와 플랫폼 비전

Mark Edelstein은 1996년 NVIDIA를 처음 만났을 때를 회상했습니다. 당시 60여 개의 3D 그래픽 경쟁사가 난립하던 시기였으나, 1997년 젠슨 황이 Riva 제품 라인으로 시장의 판도를 완전히 바꾸었습니다.

> **"세 팀, 두 시즌 (Three Teams for Two Seasons)" 전략**: PC 시장의 봄/가을 리프레시 주기를 맞추기 위해 세 개의 팀을 운영하여, 경쟁사들이 한 세대를 건너뛸 때 NVIDIA는 스스로를 앞서가는 혁신을 지속했습니다.

Mark는 NVIDIA가 초기부터 아키텍처, 알고리즘, 소프트웨어 호환성을 결합한 **'플랫폼'** 비전을 가지고 있었다고 강조했습니다. 컴퓨터 비전에서 시작해 가속 컴퓨팅으로 진화한 이 회사는 현재 "9개 팀이 4시즌을 위해 일하는 것 같은" 압도적인 실행력을 보여주고 있습니다.

### 데이터의 진화: Endpoint에서 Skill로

Dinesh Nirmal(IBM)은 데이터 활용의 3단계 진화를 설명했습니다:

1. **과거**: 데이터는 엔드포인트(Endpoint)였습니다. 데이터베이스에 저장되고 SQL 쿼리로 추출되었습니다.
2. **현재**: 데이터는 도구(Tools)입니다. MCP 서버, 벡터 데이터베이스, RAG 등을 통해 활용됩니다.
3. **미래**: 데이터는 코드(Data as Code) 또는 스킬(Data as Skills)이 됩니다.

미래에는 문서에서 질문에 답하는 프로그램을 자동 생성하고, 데이터가 변경되면 코드를 재생성하는 것이 아니라 수정(modify)하여 유연성과 최적화를 달성할 것입니다. 특히 기업 데이터의 90%를 차지하는 비정형 데이터(문서, 영상 등)를 트랜잭션 데이터와 연결하는 것이 핵심 과제입니다.

### Palantir: AI 동료와 디지털 트윈

Aki Jain(Palantir)은 2016~2017년 컴퓨터 비전의 실용화로 GPU 기반 AI가 전장에서 병사들을 보호하는 데 쓰이기 시작했다고 언급했습니다. 그는 "Lymph hack / Limiting Factor(제한 요소)"라는 용어를 사용하며, 과거에는 소프트웨어가 부족했으나 이제는 소프트웨어가 기반이 되고 컴퓨팅이 제한 요소가 되었다고 설명했습니다.

**GE Aerospace 사례 (2024)**: 특정 엔진의 디지털 트윈 시뮬레이션과 부품 온톨로지(Ontology)를 구축하여 공급망 전체를 관리했습니다. AI 박사(PhDs)를 활용해 기존 3개월 걸리던 작업을 3일로 단축시키는 혁신을 이루었습니다.

### Cadence: 칩 설계를 위한 3단 케이크

Anirudh Devgan(Cadence)은 칩 설계를 **3단 케이크 모델**로 설명했습니다:

- **상단 층**: AI — Agentic AI
- **중간 층**: Ground Truth — 물리, 화학 기본 원리
- **하단 층**: 컴퓨팅 + 데이터

> **ANIRUDH DEVGAN**
> "케이크는 층별로 먹는 게 아니라 한입에 함께 먹어야 합니다. AI, 기본 물리학, 컴퓨팅이 함께 작동해야 진정한 혁신이 가능합니다."

이제 Agentic AI를 통해 RTL(Register Transfer Language) 코드를 자동 생성할 수 있게 되었습니다. 무어의 법칙이 둔화되더라도 면적 스케일링(Area Scaling)과 3D 적층 기술을 통해 칩의 복잡성은 계속 증가할 것이며, 이를 감당하기 위해 AI를 통한 설계 효율화(최소 10배)가 필수적입니다.

### Siemens: AI와 도메인 지식의 결합

Dan Ping(Siemens)은 LLM과 같은 AI 모델은 다재다능하지만 깊이가 부족할 수 있다고 지적했습니다. 그러나 산업 현장의 전문 도메인 지식과 결합된 Agentic AI는 진정한 게임 체인저가 될 것입니다.

CES에서 Siemens CEO와 젠슨 황이 공동 발표한 4가지 파트너십 분야가 강조되었습니다:

- **분야 1**: AI in Simulation (시뮬레이션)
- **분야 2**: AI in Supply Chain Management (공급망 관리)
- **분야 3**: AI in Manufacturing (제조)
- **분야 4**: AI in EDA (전자 설계 자동화)

특히 디지털 트윈 분야에서는 **Omniverse Accelerator**를 통해 전 세계 팀들이 가상 환경에서 협업하며, 사실적인 시뮬레이션을 통해 설계를 변경하고 의사결정을 내리는 혁신이 일어나고 있습니다.

---

## 03. AI 인프라 패널 (AI Infrastructure Panel)

### 참가자 (PARTICIPANTS)

- Michael Dell (Dell Technologies)
- Mike Intrator (CoreWeave)
- Lin Chao (Fireworks AI)
- Joe Creed (Caterpillar)
- Claudia Blanco (GE Vernova)

### Dell: 컴퓨팅의 보편화와 데이터 플랫폼

Michael Dell은 Dell AI Factory 출시 2년 후, 이제는 데이터 플랫폼과 오케스트레이션 엔진으로 발전했다고 설명했습니다.

- **데이터 계층 구조**: 세계 최고속 병렬 파일 시스템(Lightning File System), CVV 캐싱 등을 통해 GPU에 데이터를 빠르게 공급합니다.
- **Cold Data 활성화**: 4,000개 이상의 고객사들이 오랫동안 사용하지 않던 콜드 데이터를 AI를 통해 활성화하고 있습니다.
- **생산성 혁명**: 2만 명 이상의 엔지니어에게 AI 도구를 제공하여 9개월 걸리던 제품 혁신 주기를 2주로 단축시켰습니다.

> **MICHAEL DELL**
> "AI를 켜면 바로 되는 것이 아니라, 데이터를 정리하고 프로세스를 재설계해야 합니다. 이제 데이터 사일로를 통합해야 할, 이전엔 없었던 강력한 이유가 생겼습니다."

### CoreWeave: 추론의 분리(Disaggregation)와 경제학

Mike Intrator(CoreWeave)는 세계 최초 AI 네이티브 클라우드로서 **추론의 분리(Disaggregation of Inference)** 트렌드를 강조했습니다.

- **Prefill**: 사전 채우기, 컨텍스트 처리가 필요하며 계산 집약적입니다.
- **Decode**: 디코드, 토큰 생성이며 메모리/대역폭 집약적입니다.

이러한 분리를 통해 Hopper나 Ampere 같은 구형 GPU도 특정 단계에서 여전히 높은 가치를 가질 수 있게 되었습니다. 이는 GPU의 예상 수명을 4~5년에서 8~10년으로 늘려주며, 인프라 투자의 효율성을 극대화합니다.

### Fireworks AI: 2026년 폭발적 혁신

Lin Chao(Fireworks AI)는 2026년이 단순한 효율성의 해가 아니라 **폭발적 AI 혁신의 해**가 될 것이라고 전망했습니다.

데모에서 프로덕션으로 전환되는 시간이 여러 분기에서 며칠 단위로 단축되었습니다. Fireworks AI는 3차원 최적화(프라이빗 데이터 활성화 + 모델 가속화 + 비용 절감)를 통해 TCO를 5~10배 절감하고 있습니다. 또한 훈련과 추론을 혼합(Blending)하여 추론 중에도 모델이 애플리케이션 패턴을 학습하도록 하고 있습니다.

### Caterpillar: 보이지 않는 층(Invisible Layer)

Joe Creed(Caterpillar)는 100년 역사의 산업 기업이 AI 인프라의 근간을 지탱하고 있음을 강조했습니다.

- **광업**: AI 칩 제조에 필수적인 핵심 광물과 구리를 채굴합니다.
- **건설**: 데이터센터 건설을 위한 장비를 제공합니다.
- **전력**: 데이터센터에 필요한 전력을 공급합니다(세계적 전력 부족 해결).

동시에 Caterpillar는 AI의 사용자이기도 합니다. 장비 운전석 내 운전자 코칭(Operator Coaching) AI를 도입하고, 원격 진단을 통해 기술자가 현장 방문 전 미리 준비할 수 있게 하여 숙련 인력 부족 문제를 해결하고 있습니다.

### GE Vernova: AI for AI

에너지 전환 전문 기업 GE Vernova의 Claudia Blanco는 대형 AI 데이터센터의 막대한 전력 수요를 감당하기 위해 **"AI for AI"** 개념을 제시했습니다. 즉, AI 인프라를 지탱하기 위한 전력망 관리에도 AI가 필수적이라는 것입니다.

그녀는 현재 상황을 100년 전 전력망 구축 시기와 비교했습니다. 과거 발전소→송전→배전 시스템이 구축되던 대전환기와 마찬가지로, 현재는 데이터센터→전력공급→냉각→인프라 관리가 통합되는 새로운 인프라 혁명이 진행 중입니다. **AI Factory** 개념을 통해 전력과 컴퓨팅 시스템을 처음부터 통합 설계하는 것이 미래의 핵심이 될 것입니다.

---

## 04. 오픈 모델 패널 (Open Models Panel)

### 참가자 (PARTICIPANTS)

- Ahmad (Perplexity)
- Arthur Mensch (Mistral AI)
- Robin Rombach (Black Forest Labs)
- Aidan Gomez (Cohere)

### Perplexity Computer: AI 오케스트라

Ahmad(Perplexity)는 Perplexity Computer를 **"AI 오케스트라 지휘자"**로 묘사했습니다. 브라우저, 파일 시스템, 코드 샌드박스, 20개의 모델, 수백 개의 커넥터를 연결하여 AI가 디렉터로서 서브에이전트들에게 작업을 지시합니다.

기업 사용자의 50% 이상이 매일 다른 모델을 선택하여 사용하고 있으며, 이는 모델의 특화(Specialization) 추세를 보여줍니다. Perplexity는 기업 출시 첫 몇 주 만에 최대 사용자당 약 9천만 달러($90M) 상당의 노동 가치를 창출했습니다.

### Mistral AI: 엣지 배포와 AI 리눅스

Arthur Mensch(Mistral)는 엣지 배포(Edge Deployment)에 최적화된 **Mistral 4**를 발표했습니다. 모바일, 로봇, 공장 등 오프라인 환경에서도 작동하며 뛰어난 가성비를 제공합니다. 그는 오픈 소스 AI가 미래의 **"AI의 Linux"**가 될 것이며, Mistral은 Red Hat처럼 통합과 지원에서 가치를 창출할 것이라고 전망했습니다.

### Black Forest Labs: 창작의 물질(Substance)

Robin Rombach는 모델을 단순한 도구가 아닌 **창작을 위한 형태를 바꿀 수 있는 물질(Moldable Substance)**로 정의했습니다. 새로운 **Flux 2** 모델은 VLM 컴포넌트와 자체 아키텍처를 결합하여 시각적 생성 AI의 범위를 시뮬레이션과 피지컬 AI로 확장하고 있습니다.

### Cohere: 데이터 주권과 신뢰

Transformer 논문의 공동 저자인 Aidan Gomez(Cohere)는 오픈 모델의 핵심 가치로 **데이터 프라이버시, 주권(Sovereignty), 제어권**을 꼽았습니다. 기업 도입의 장벽인 신뢰(Trust) 문제를 해결하기 위해, Cohere는 높은 보안 환경(통신, 금융)에서도 작동하는 온프레미스/에어갭 배포를 지원합니다.

### Open Router 인터뷰: 신데렐라 효과

패널 토론 전 진행된 Alex Atallah(Open Router CEO)와의 인터뷰에서는 **"신데렐라 효과(Cinderella Effect)"**가 언급되었습니다. 새로운 오픈 모델이 출시되면 첫 주에 개발자들이 그 모델의 최적 사용 사례(Use Case)를 발견하고, 그 코호트가 가장 높은 리텐션을 보인다는 현상입니다. 개발자들은 벤치마크 점수보다는 실제 사용감인 **바이브(Vibes)**를 따르는 경향이 강합니다.

### Base10 Partners 인터뷰: 모델 운영 3대 요소

Tuhin Shrivastava(Base10 Partners)는 모델 운영의 3대 핵심 요소로 **속도(Speed), 신뢰성(Reliability), 비용(Cost)**을 제시했습니다.

포트폴리오 회사인 Open Evidence의 사례를 들며, 의사들이 환자 곁(Bedside)에서 사용하는 임상 결정 지원 서비스의 경우 신뢰성이 생명과 직결되며 빠른 응답 속도가 필수적이라고 설명했습니다. "모든 것을 지배하는 하나의 모델" 시대는 가고, 태스크에 특화된 수많은 소형 모델들이 폭발적으로 성장하는 트렌드를 예측했습니다.

---

## 05. 에이전틱 AI 패널 (Agentic AI Panel)

### 참가자 (PARTICIPANTS)

- Peter Steinberger (OpenClaw)
- Harrison Chase (LangChain)
- Vincent Vanhoucke (Prime Intellect)
- Sam Rodriguez (Edison Scientific)
- **Special Guest: Jensen Huang (NVIDIA)**

> ### 젠슨 황 CEO의 깜짝 등장
>
> 패널 토론 중 젠슨 황 CEO가 무대에 등장하여 Peter Steinberger의 **OpenClaw** 프로젝트를 **"인류 역사상 가장 빠르게 성장하는 오픈 소스 프로젝트"**라고 극찬했습니다. 그는 "AI가 우리를 덜 일하게 만드는 것이 아니라 더 바쁘게 만들지만, 더 흥미로운 문제를 해결하게 해줄 것"이라며, "이제 우리는 항상 크리티컬 패스(Critical Path)에 있다"고 말했습니다.

### OpenClaw: 에이전틱 컴퓨터의 OS

Peter Steinberger는 컴퓨터와 대화하고 싶어서 OpenClaw를 만들었다고 밝혔습니다. OpenClaw는 리소스 관리, 스케줄링, 문제 분해, 서브에이전트 호출, 멀티모달 I/O를 수행하며, 마치 **Windows가 PC를 가능하게 한 것처럼 개인용 에이전트 시대를 열었습니다.** 이제 코딩뿐만 아니라 Slack, 이메일 등 지식 노동 전체를 자동화할 수 있습니다.

### LangChain: Harness Engineering

Harrison Chase는 에이전트 개발이 **Context Engineering(정보 제공)에서 Harness Engineering(환경 구축)**으로 진화했다고 설명했습니다. 모델이 충분히 똑똑해져서 루프(Loop) 내에서 자율적으로 작동할 수 있게 되었기 때문입니다. 이제 엔지니어링, 제품, 디자인(EPD) 전반에 걸친 **시스템 사고(System Thinking)**가 더욱 중요해졌습니다.

### Edison Scientific: 과학의 A급 인재 병목 해결

Sam Rodriguez는 현재 AI가 "B급 과학자" 수준이지만 곧 "A급"으로 발전할 것이라고 전망했습니다. 100배 빠른 속도로 실행되는 A급 에이전트 스웜(Swarms)은 인간보다 뛰어난 성과를 낼 수 있습니다. 과학의 3대 요소인 자본, 물류, 인재 중 **인재(Talent)의 병목 현상**을 AI로 해결하여, 1~2년 내에 전례 없는 규모의 신약 발견이 가능할 것이라고 예측했습니다.

### ServiceNow: 자율 기업(Autonomous Enterprise)의 도래

Bill McDermott(ServiceNow)는 NVIDIA와의 7년 파트너십을 강조하며 ServiceNow의 성과를 젠슨 황과 NVIDIA의 공으로 돌렸습니다. 현재 ServiceNow 내부의 고객 서비스 및 HR 업무의 90%가 이미 에이전트에 의해 처리되고 있습니다.

그는 "모델은 비싼 조언일 뿐, 워크플로우에 통합되어야 실제 가치를 가진다"고 말하며, Rolls Royce, Bell Canada, Adobe 등의 기업들이 에이전트를 도입해 제조와 고객 지원을 혁신하고 있다고 전했습니다. 이제 조직도(Org Chart)에 **AI 스페셜리스트**가 공식적으로 포함되는 시대가 왔습니다.

---

## 06. 피지컬 AI 패널 (Physical AI Panel)

### 참가자 (PARTICIPANTS)

- Raquel Urtasun (Waabi)
- Giacomo Corbo (PhysicsX)
- Deepak Pathak (Skild AI)
- Daniel Nadler (Open Evidence)

### Waabi: 시뮬레이션 우선 자율주행

Raquel Urtasun은 Waabi가 **시뮬레이션 우선(Simulation-First)** 접근법으로 검증 가능한 엔드-투-엔드 자율주행 시스템을 구축했다고 설명했습니다. 단일 AI 브레인으로 트럭과 로보택시를 모두 제어하며, **Uber와의 파트너십**을 통해 글로벌 25,000대 이상의 로보택시를 배치할 계획입니다.

### PhysicsX: 시뮬레이션에서 추론으로

Giacomo Corbo는 기존 수치 시뮬레이션의 한계(느린 속도, 재사용 불가)를 지적하며, AI 모델을 통해 **1만 배에서 100만 배 빠른 예측**을 달성했다고 밝혔습니다. 시뮬레이션 데이터를 Training Corpus로 활용하는 패러다임 전환을 통해, 반도체, 제트 엔진, 배터리 등 산업 전반의 엔지니어링을 혁신하고 있습니다.

### Skild AI: 범용 로봇 두뇌와 데이터 플라이휠

Deepak Pathak은 어떤 로봇, 어떤 작업이든 수행할 수 있는 **범용 로봇 두뇌**를 개발 중입니다. 로봇 데이터 부족 문제를 해결하기 위해 시뮬레이션과 인컨텍스트 학습(In-Context Learning)을 물리 세계에 최초로 적용했습니다. 팔다리가 제거되어도 즉시 적응하는 이 AI는 **엔터프라이즈 → 구조화된 환경 → 가정**으로 이어지는 데이터 플라이휠 전략을 통해 확장될 것입니다.

### Open Evidence: 의료 초지능

Daniel Nadler는 의료 분야의 특수성(피드백 루프가 인체에서 발생, 오류가 치명적임)을 강조했습니다. 폭발하는 의학 지식을 의사가 따라잡을 수 없기에, 각 전문의(심장내과, 신경과 등)를 위한 디지털 트윈을 제공하여 **의료 초지능**을 구축했습니다. 현재 100명 미만의 직원으로 미국 3억 명의 환자를 담당하는 의사들을 지원하고 있습니다.

### Wayve 인터뷰: 엔드-투-엔드 자율주행

Alex Kendall(Wayve)은 Wayve가 10년 전부터 개척해온 엔드-투-엔드 AI 자율주행 기술이 이제 글로벌 제품 단계에 도달했다고 밝혔습니다.

Wayve의 **세계 모델(World Model)**은 도로 위 위험을 이해하고 동적 움직임을 예측하여, 훈련 데이터가 없는 500개 이상의 도시에서 **제로 샷(Zero-Shot)** 주행에 성공했습니다. 고정밀 지도(HD Map)나 추가 하드웨어 없이 양산차에 내장된 카메라만으로 작동합니다. Uber, Stellantis, Mercedes, Nissan과의 파트너십을 맺었으며, 이번 GTC에서 Nissan 로보택시 실물을 공개하고 시승 행사를 진행합니다.

---

## 07. 사이드라인 인터뷰 종합

이번 GTC 2025에서는 Tiffany Jansen이 진행한 다양한 사이드라인 인터뷰를 통해 각 분야 전문가들의 생생한 목소리를 들을 수 있었습니다.

- **Dan Ping (Siemens)**: AI와 도메인 지식의 결합을 통한 제조 혁신 강조
- **Claudia Blanco (GE Vernova)**: AI 인프라를 위한 전력망 관리, "AI for AI" 개념 제시
- **Alex Atallah (OpenRouter)**: 오픈 모델 생태계와 "신데렐라 효과" 설명
- **Tuhin Shrivastava (Base10 Partners)**: 모델 운영의 3대 요소(속도, 신뢰성, 비용)와 소형 모델 트렌드 전망
- **Bill McDermott (ServiceNow)**: 자율 기업(Autonomous Enterprise)의 도래와 AI 스페셜리스트의 부상
- **Alex Kendall (Wayve)**: 엔드-투-엔드 AI 자율주행 기술의 성숙과 글로벌 확장

---

## 08. Jensen Huang 키노트 — CUDA & 가속 컴퓨팅 플랫폼

### CUDA 20주년과 가속 컴퓨팅 플랫폼

젠슨 황은 올해가 **CUDA 출시 20주년**임을 기념하며 기조연설을 시작했습니다. 1999년 세계 최초의 프로그래머블 셰이더인 GeForce를 발명하고, 2006년 이를 범용 컴퓨팅으로 확장한 CUDA를 출시한 것이 AI 혁명의 시초가 되었습니다.

NVIDIA는 **수직적으로 통합되고 수평적으로 개방된(Vertically Integrated, Horizontally Open)** 전략을 추구합니다.

- **Neural Rendering (DLSS 5)**: 3D 그래픽(구조적 데이터)과 생성 AI(확률적 컴퓨팅)를 융합하여, 완벽하게 제어 가능하면서도 사실적인 그래픽을 구현했습니다.
- **데이터 처리 라이브러리**: 정형 데이터를 위한 cuDF(Pandas 가속)와 비정형 데이터를 위한 cuVS(벡터 검색 가속)를 통해 기업 데이터 처리를 혁신하고 있습니다.
- **클라우드 파트너십**: IBM, Dell, Google Cloud, AWS, Azure, Oracle 등과 협력하여 전 세계 모든 클라우드에 NVIDIA 가속 컴퓨팅을 통합했습니다.

---

## 09. Jensen Huang 키노트 — AI Factory & 추론 변곡점

### 추론 변곡점(Inference Inflection Point)과 $1조 수요

AI는 **ChatGPT(생성) → o1(추론) → Claude Code(에이전틱 수행)**로 진화하며 컴퓨팅 수요가 폭발했습니다. 쿼리당 연산량은 10,000배, 사용량은 100배 증가하여 총 **100만 배**의 컴퓨팅 수요가 발생했습니다.

| 지표 | 수치 |
|------|------|
| 최근 2년 AI 컴퓨팅 수요 증가 | **100만 배** |
| 2027년까지 인프라 수요 예상 | **$1조+** |

2027년까지 최소 **1조 달러($1 Trillion)** 규모의 인프라 수요가 예상됩니다. 데이터센터는 이제 파일 저장소가 아닌 **AI 팩토리**이며, 토큰은 새로운 원자재(Commodity)입니다. CEO들은 앞으로 **Tokens/Watt** (와트당 토큰 생산량)를 핵심 KPI로 관리하게 될 것입니다.

### Vera Rubin: 에이전틱 AI를 위한 아키텍처

젠슨 황은 차세대 아키텍처 **Vera Rubin**을 공개했습니다.

**Vera Rubin 시스템 스펙:**

- **성능**: 36 엑사플롭스(Exaops) 컴퓨팅, 260TB/s NVLink 대역폭
- **구성**: 7개 칩, 5개 랙 스케일 컴퓨터
- **냉각**: 100% 액체 냉각, 45도 고온수 냉각 가능하여 에너지 절약
- **설치**: 케이블 제거 설계를 통해 설치 시간 2일 → 2시간 단축

### Groq LPU 통합

NVIDIA는 추론 전용 프로세서 기업 **Groq**과의 파트너십 및 기술 통합을 발표했습니다.

- **추론의 분리**: 고처리량이 필요한 Prefill은 Vera Rubin이, 저지연이 필요한 Decode는 Groq LPU가 담당합니다.
- **성능 향상**: 이 결합을 통해 프리미엄 티어 추론에서 **3~5배의 성능 향상**을 달성했습니다.
- **Groq LP30**: 삼성 파운드리에서 생산 중이며, Q3 출하 예정입니다.

### Vera CPU & BlueField 4

에이전틱 워크플로우 오케스트레이션을 위한 세계 최고의 단일 스레드 성능을 가진 **Vera CPU**와 AI 네이티브 스토리지를 위한 **BlueField 4 DPU**도 함께 발표되었습니다.

---

## 10. Jensen Huang 키노트 — 오픈 모델 & OpenClaw

### OpenClaw와 NeMo Claw

젠슨 황은 Peter Steinberger의 OpenClaw를 **"인류 역사상 가장 빠르게 성장하는 오픈 소스 프로젝트"**라 칭송하며, 이를 **에이전틱 컴퓨터의 운영체제**라고 정의했습니다.

> **JENSEN HUANG**
> "OpenClaw가 개인용 에이전트를 가능하게 한 것은 마치 Windows가 개인용 컴퓨터를 가능하게 한 것과 같습니다. 모든 기업은 이제 오픈 클로 전략이 필요합니다."

기업 환경에서의 보안 우려를 해소하기 위해 NVIDIA는 **NeMo Claw** 레퍼런스 디자인과 **OpenShell** 보안 기술을 발표했습니다. 이를 통해 모든 SaaS 기업은 안전하게 **Agentic as a Service (GaaS)** 기업으로 변모할 수 있습니다.

### 오픈 모델 이니셔티브 & Nemotron Coalition

NVIDIA는 6개의 최첨단 오픈 모델 패밀리를 지속적으로 발전시키고 있습니다:

- **Nemotron**: 언어 및 추론 (Nemotron3 Ultra 발표)
- **Cosmos**: 피지컬 AI 월드 모델
- **Alpamayo**: 사고하는 자율주행 AI
- **Groot**: 범용 로봇 파운데이션 모델
- **BioNeMo**: 생물학/화학 모델
- **Earth-2**: 기후/날씨 예측 모델

또한 **Nemotron Coalition**을 결성하여 Black Forest Labs, Mistral, Perplexity, LangChain 등과 협력하여 오픈 모델 생태계를 강화합니다.

---

## 11. Jensen Huang 키노트 — 피지컬 AI & 로보틱스

### 피지컬 AI와 로보틱스 혁명

마지막으로 젠슨 황은 디지털 AI가 물리적 세계로 진입하는 **피지컬 AI(Physical AI)**의 시대를 선포했습니다.

- **도구**: Isaac Lab(훈련), Newton(물리 시뮬레이터), Cosmos(월드 모델)를 통해 로봇 학습 데이터 부족 해결
- **로보택시 파트너십**: [NEW] BYD, 현대자동차(Hyundai), Nissan, Geely가 NVIDIA 플랫폼에 합류 (연간 1,800만 대 생산 규모)
- **통신**: T-Mobile과 협력하여 기지국을 AI 인프라(AI-RAN)로 전환

> ### 라이브 데모: Disney Olaf 로봇
>
> 무대에 Disney의 **Olaf 로봇**(스타워즈 BD-1 스타일의 이족 보행 로봇)이 등장하여 젠슨 황과 자연스럽게 상호작용했습니다. 이 로봇은 NVIDIA Jetson 컴퓨터를 탑재하고 Isaac Lab과 Newton 시뮬레이터에서 훈련되어, 복잡한 물리적 동작을 자연스럽게 수행했습니다. 이는 디즈니랜드의 캐릭터들이 로봇으로 살아 움직이는 미래를 예고합니다.

---

## 12. 핵심 주제 요약 & 결론

| 핵심 주제 | 설명 |
|-----------|------|
| **AI Factory** | 데이터센터의 새로운 정의. TOKENS/WATT가 핵심 KPI |
| **Agentic** | 도구 사용에서 자율 수행으로. OPENCLAW가 표준 OS |
| **Physical AI** | 자율주행과 로보틱스의 CHATGPT 모멘트 도래 |
| **Inference** | 학습을 넘어 추론의 시대. $1조 인프라 시장 |

GTC 2025는 AI 산업이 학습(Training)의 시대를 넘어 **추론(Inference)**과 **에이전트(Agent)**, 그리고 **피지컬 AI(Physical AI)**의 시대로 완전히 진입했음을 선언하는 자리였습니다.

NVIDIA는 단순한 칩 제조사를 넘어, 하드웨어부터 소프트웨어, 알고리즘, 데이터센터 설계(DSX), 그리고 오픈 소스 생태계까지 아우르는 **AI 팩토리 플랫폼 기업**으로 변모했습니다. 특히 Groq과의 파격적인 협력, OpenClaw에 대한 전폭적인 지원, 그리고 현대자동차를 비롯한 글로벌 제조사들과의 파트너십은 NVIDIA가 추구하는 **수직적 통합과 수평적 개방** 전략이 얼마나 강력한지를 증명했습니다.

**이제 모든 기업은 토큰을 생산하거나 소비하는 주체가 될 것이며, AI 에이전트는 기업의 새로운 운영체제가 될 것입니다.**

---

*© 2025 NVIDIA GTC Complete Report — Generated based on official event transcript*

*본 문서는 NVIDIA GTC 2025 이벤트의 전체 내용을 상세하게 요약한 리포트입니다.*
