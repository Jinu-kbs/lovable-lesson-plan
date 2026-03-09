# 프롬프트 엔지니어링 — 개발자편

> **과정명**: 고급 프롬프트 엔지니어링과 자동화
> **대상**: 프롬프트 엔지니어링을 개발 워크플로에 체계적으로 통합하려는 개발자
> **목표**: 프롬프트 자동화, API 활용, 커스텀 에이전트 설계
> **소요 시간**: 약 5~6시간

---

## 어떤 교안을 봐야 할까요?

| 항목 | 초보자편 | 중급자편 | **개발자편 (현재)** |
|------|---------|---------|-------------------|
| 코딩 경험 | 없음 | 약간 | **Python/JS 능숙** |
| API 경험 | 없음 | REST 기초 | **API 설계·호출 능숙** |
| 프롬프트 경험 | ChatGPT 채팅 | 시스템 프롬프트 | **프롬프트 파이프라인 구축** |
| 학습 목표 | 프롬프트 기초 | 고급 기법 | **자동화·에이전트·프로덕션** |
| 소요 시간 | 2시간 | 3~4시간 | **5~6시간** |

> API 호출 경험이 없거나 프롬프트 기초가 부족하다면 → **초보자편** 또는 **중급자편**을 먼저 보세요.

---

### 추천 리소스

| 리소스 | 설명 | 링크 |
|--------|------|------|
| Anthropic Prompt Engineering Guide | 공식 프롬프트 가이드 | [docs.anthropic.com](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering) |
| OpenAI Cookbook | 프롬프트 패턴 및 예제 모음 | [cookbook.openai.com](https://cookbook.openai.com) |
| Prompting Guide | 커뮤니티 기반 프롬프트 기법 정리 | [promptingguide.ai](https://www.promptingguide.ai) |
| LangChain Docs | LLM 애플리케이션 프레임워크 | [python.langchain.com](https://python.langchain.com) |
| MCP Specification | Model Context Protocol 공식 스펙 | [modelcontextprotocol.io](https://modelcontextprotocol.io) |

---

## 목차

1. [프롬프트 아키텍처](#1-프롬프트-아키텍처)
2. [API 기반 프롬프트](#2-api-기반-프롬프트)
3. [에이전트 프롬프트 설계](#3-에이전트-프롬프트-설계)
4. [프롬프트 테스팅](#4-프롬프트-테스팅)
5. [프롬프트 버전 관리](#5-프롬프트-버전-관리)
6. [보안과 프롬프트 인젝션](#6-보안과-프롬프트-인젝션)
7. [멀티모달 프롬프트](#7-멀티모달-프롬프트)
8. [프로덕션 프롬프트](#8-프로덕션-프롬프트)
9. [실전 프로젝트](#9-실전-프로젝트)
10. [다음 단계](#10-다음-단계)

---

## 1. 프롬프트 아키텍처

### 학습 목표

- LLM의 내부 동작 원리(토큰화, 어텐션)를 이해한다
- 컨텍스트 윈도우의 구조와 제약을 파악한다
- 온도, Top-P, Top-K 등 생성 파라미터를 목적에 맞게 조절한다
- 프롬프트가 모델 내부에서 어떻게 처리되는지 기술적으로 설명할 수 있다

---

### 1.1 LLM 동작 원리

대규모 언어 모델(LLM)은 입력된 토큰 시퀀스를 기반으로 다음 토큰의 확률 분포를 예측하는 자기회귀(autoregressive) 모델입니다. 프롬프트 엔지니어링의 본질은 이 확률 분포를 원하는 방향으로 조정하는 것입니다.

```
입력 텍스트 → 토큰화 → 임베딩 → Transformer 레이어 × N → 확률 분포 → 샘플링 → 출력 토큰
```

#### 핵심 개념 정리

| 개념 | 설명 | 프롬프트 엔지니어링 관점 |
|------|------|------------------------|
| **토큰화** | 텍스트를 모델이 처리할 수 있는 단위로 분할 | 토큰 수 = 비용 + 컨텍스트 한계 |
| **임베딩** | 토큰을 고차원 벡터로 변환 | 의미적 유사성이 벡터 거리로 표현됨 |
| **어텐션** | 토큰 간 관계성 계산 (Self-Attention) | 프롬프트 내 위치와 구조가 중요 |
| **확률 분포** | 다음 토큰 후보의 확률 | 파라미터로 분포 모양을 조절 |

---

### 1.2 토큰화(Tokenization)와 BPE

토큰화는 프롬프트의 비용과 성능을 결정하는 핵심 요소입니다.

#### BPE(Byte Pair Encoding) 알고리즘

```python
# BPE 토큰화 시뮬레이션 (개념 이해용)
def simple_bpe_demo():
    """BPE가 어떻게 동작하는지 보여주는 간단한 예시"""

    # 1단계: 문자 단위로 분리
    text = "low lower lowest"
    chars = list(text)
    print(f"문자 단위: {chars}")
    # ['l', 'o', 'w', ' ', 'l', 'o', 'w', 'e', 'r', ' ', 'l', 'o', 'w', 'e', 's', 't']

    # 2단계: 가장 빈번한 바이트 쌍 병합
    # ('l', 'o') → 'lo'  (3회 등장)
    # ('lo', 'w') → 'low' (3회 등장)
    # 반복하여 자주 등장하는 패턴을 하나의 토큰으로 합침

    # 최종 토큰화 결과
    tokens = ['low', ' ', 'low', 'er', ' ', 'low', 'est']
    print(f"BPE 토큰: {tokens}")
    print(f"토큰 수: {len(tokens)}")  # 7개

simple_bpe_demo()
```

#### 토큰 수 확인 — Python

```python
import tiktoken

def count_tokens(text: str, model: str = "gpt-4") -> dict:
    """텍스트의 토큰 수를 모델별로 계산"""
    encoding = tiktoken.encoding_for_model(model)
    tokens = encoding.encode(text)

    return {
        "text": text[:50] + "..." if len(text) > 50 else text,
        "model": model,
        "token_count": len(tokens),
        "tokens_preview": [encoding.decode([t]) for t in tokens[:10]],
        "estimated_cost_input": len(tokens) * 0.000003,  # $3/1M tokens 기준
    }

# 사용 예시
prompt = """당신은 시니어 Python 개발자입니다.
아래 코드를 리뷰하고 개선점을 제안해주세요.
코드의 성능, 가독성, 보안 측면을 모두 검토하세요."""

result = count_tokens(prompt)
print(f"토큰 수: {result['token_count']}")
print(f"예상 비용: ${result['estimated_cost_input']:.6f}")
```

#### 토큰 수 확인 — JavaScript (Anthropic)

```javascript
// Anthropic API의 토큰 카운팅
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

async function countTokens(prompt) {
  const response = await client.messages.count_tokens({
    model: "claude-sonnet-4-20250514",
    messages: [{ role: "user", content: prompt }],
  });

  console.log(`입력 토큰 수: ${response.input_tokens}`);
  return response.input_tokens;
}

// 비용 추정 함수
function estimateCost(inputTokens, outputTokens, model = "claude-sonnet") {
  const pricing = {
    "claude-sonnet": { input: 3.0, output: 15.0 }, // $/1M tokens
    "claude-opus": { input: 15.0, output: 75.0 },
    "claude-haiku": { input: 0.25, output: 1.25 },
  };

  const price = pricing[model];
  const inputCost = (inputTokens / 1_000_000) * price.input;
  const outputCost = (outputTokens / 1_000_000) * price.output;

  return {
    inputCost: inputCost.toFixed(6),
    outputCost: outputCost.toFixed(6),
    totalCost: (inputCost + outputCost).toFixed(6),
  };
}
```

#### 한국어 토큰화 특성

한국어는 영어 대비 토큰 효율이 낮습니다. 동일한 의미를 전달할 때 더 많은 토큰을 사용합니다.

| 텍스트 | 영어 토큰 수 | 한국어 토큰 수 | 배율 |
|--------|-------------|---------------|------|
| "Hello, how are you?" | 6 | — | — |
| "안녕하세요, 어떠세요?" | — | 11~15 | 약 2배 |
| 500자 기술 문서 | ~125 | ~250~350 | 약 2~2.8배 |

> **실전 팁**: 한국어 프롬프트는 영어 대비 약 2~3배 토큰을 소비합니다. 비용이 중요한 프로덕션 환경에서는 시스템 프롬프트를 영어로 작성하고 사용자 입력만 한국어로 받는 하이브리드 전략을 고려하세요.

---

### 1.3 컨텍스트 윈도우

컨텍스트 윈도우는 모델이 한 번에 처리할 수 있는 최대 토큰 수입니다.

#### 주요 모델별 컨텍스트 윈도우 (2026년 기준)

| 모델 | 컨텍스트 윈도우 | 최대 출력 | 특징 |
|------|----------------|----------|------|
| **Claude Opus 4** | 200K | 32K | 최고 성능, 복잡한 추론 |
| **Claude Sonnet 4** | 200K | 16K | 성능/비용 균형 |
| **Claude Haiku 3.5** | 200K | 8K | 빠른 응답, 저비용 |
| **GPT-4o** | 128K | 16K | 멀티모달, 빠른 응답 |
| **Gemini 2.5 Pro** | 1M | 65K | 초대형 컨텍스트 |
| **DeepSeek R1** | 128K | 8K | 오픈소스, 추론 특화 |

#### 컨텍스트 윈도우 구조

```
┌──────────────────────────────────────────────────┐
│                컨텍스트 윈도우 (200K)               │
│                                                    │
│  ┌──────────────────────────────────────────────┐  │
│  │  시스템 프롬프트 (System Prompt)               │  │
│  │  - 모델 역할 정의                              │  │
│  │  - 규칙과 제약 조건                            │  │
│  │  - 출력 형식 지정                              │  │
│  │  [약 500~5,000 토큰]                          │  │
│  └──────────────────────────────────────────────┘  │
│                                                    │
│  ┌──────────────────────────────────────────────┐  │
│  │  대화 히스토리 (Conversation History)          │  │
│  │  - 이전 턴의 user/assistant 메시지             │  │
│  │  [가변 — 대화가 길어지면 증가]                  │  │
│  └──────────────────────────────────────────────┘  │
│                                                    │
│  ┌──────────────────────────────────────────────┐  │
│  │  현재 입력 (Current Input)                     │  │
│  │  - 사용자의 최신 메시지                        │  │
│  │  - 첨부된 파일/이미지                          │  │
│  │  [가변]                                       │  │
│  └──────────────────────────────────────────────┘  │
│                                                    │
│  ┌──────────────────────────────────────────────┐  │
│  │  출력 공간 (Output Space)                      │  │
│  │  - 모델이 생성할 응답                          │  │
│  │  [max_tokens로 제한]                          │  │
│  └──────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────┘
```

#### "Lost in the Middle" 현상

긴 컨텍스트에서 모델은 시작과 끝 부분의 정보에 더 높은 주의를 기울이고, 중간 부분의 정보를 놓치는 경향이 있습니다.

```python
def optimize_context_placement(system_prompt: str,
                                documents: list[str],
                                user_query: str) -> list[dict]:
    """컨텍스트 배치를 최적화하는 함수

    전략: 가장 중요한 정보를 시작과 끝에 배치
    """
    # 문서 관련성 점수 계산 (간단한 키워드 매칭 예시)
    scored_docs = []
    query_words = set(user_query.lower().split())

    for doc in documents:
        doc_words = set(doc.lower().split())
        relevance = len(query_words & doc_words) / len(query_words)
        scored_docs.append((relevance, doc))

    scored_docs.sort(key=lambda x: x[0], reverse=True)

    # 가장 관련성 높은 문서를 시작과 끝에 배치
    if len(scored_docs) >= 3:
        reordered = []
        reordered.append(scored_docs[0])      # 1위 → 시작
        reordered.extend(scored_docs[2:])      # 나머지 → 중간
        reordered.append(scored_docs[1])       # 2위 → 끝
        scored_docs = reordered

    # 메시지 구성
    context_text = "\n\n---\n\n".join(
        f"[문서 {i+1}] (관련도: {score:.2f})\n{doc}"
        for i, (score, doc) in enumerate(scored_docs)
    )

    return [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": f"참고 문서:\n{context_text}\n\n질문: {user_query}"}
    ]
```

---

### 1.4 생성 파라미터

#### Temperature (온도)

확률 분포의 날카로움을 조절합니다.

```python
# 온도별 출력 특성 비교
temperature_guide = {
    0.0: {
        "특성": "결정적(deterministic) — 항상 같은 출력",
        "용도": ["코드 생성", "수학 문제", "분류", "데이터 추출"],
        "예시": "함수 이름을 지어주세요 → getUserById"
    },
    0.3: {
        "특성": "약간의 변동 — 높은 일관성",
        "용도": ["기술 문서 작성", "코드 리뷰", "요약"],
        "예시": "이 코드를 리뷰해주세요 → 일관된 리뷰 포인트"
    },
    0.7: {
        "특성": "균형 — 창의성과 일관성의 중간",
        "용도": ["일반 대화", "블로그 글", "마케팅 카피"],
        "예시": "제품 설명을 작성해주세요 → 매번 약간 다른 표현"
    },
    1.0: {
        "특성": "높은 다양성 — 예측 어려움",
        "용도": ["브레인스토밍", "시 작성", "아이디어 발산"],
        "예시": "새로운 앱 아이디어 → 매번 독특한 아이디어"
    },
}
```

#### Top-P (Nucleus Sampling)

누적 확률이 P에 도달할 때까지의 토큰만 후보로 선택합니다.

```python
def demonstrate_top_p(probabilities: dict, top_p: float) -> list:
    """Top-P 샘플링 시뮬레이션

    Args:
        probabilities: {"토큰": 확률} 딕셔너리
        top_p: 누적 확률 임계값 (0.0 ~ 1.0)

    Returns:
        선택된 토큰 후보 목록
    """
    # 확률 기준 내림차순 정렬
    sorted_tokens = sorted(
        probabilities.items(),
        key=lambda x: x[1],
        reverse=True
    )

    cumulative = 0.0
    candidates = []

    for token, prob in sorted_tokens:
        cumulative += prob
        candidates.append({"token": token, "prob": prob, "cumulative": cumulative})
        if cumulative >= top_p:
            break

    return candidates

# 예시: "오늘 날씨가" 다음에 올 토큰 예측
next_token_probs = {
    "좋다":   0.35,
    "춥다":   0.25,
    "덥다":   0.15,
    "흐리다": 0.10,
    "맑다":   0.08,
    "나쁘다": 0.04,
    "변덕":   0.03,
}

# Top-P = 0.9 → 누적 확률 90%에 도달할 때까지만 후보 유지
result = demonstrate_top_p(next_token_probs, top_p=0.9)
for r in result:
    print(f"  {r['token']}: {r['prob']:.2f} (누적: {r['cumulative']:.2f})")
# 좋다: 0.35 (누적: 0.35)
# 춥다: 0.25 (누적: 0.60)
# 덥다: 0.15 (누적: 0.75)
# 흐리다: 0.10 (누적: 0.85)
# 맑다: 0.08 (누적: 0.93) ← 여기서 중단
```

#### Top-K

확률 상위 K개의 토큰만 후보로 유지합니다.

```python
def demonstrate_top_k(probabilities: dict, top_k: int) -> list:
    """Top-K 샘플링 시뮬레이션"""
    sorted_tokens = sorted(
        probabilities.items(),
        key=lambda x: x[1],
        reverse=True
    )
    return sorted_tokens[:top_k]

# Top-K = 3 → 상위 3개 토큰만 후보
top_3 = demonstrate_top_k(next_token_probs, top_k=3)
print("Top-K=3 후보:", top_3)
# [('좋다', 0.35), ('춥다', 0.25), ('덥다', 0.15)]
```

#### 파라미터 조합 가이드

| 작업 유형 | Temperature | Top-P | Top-K | 이유 |
|----------|------------|-------|-------|------|
| 코드 생성 | 0.0 | 1.0 | — | 정확한 구문 필요 |
| 코드 리뷰 | 0.2 | 0.9 | — | 일관된 피드백 |
| 기술 문서 | 0.3 | 0.95 | — | 정확하되 자연스러운 문체 |
| 일반 대화 | 0.7 | 0.95 | — | 자연스러운 응답 |
| 창작 글쓰기 | 1.0 | 0.95 | 50 | 다양한 표현 |
| JSON 추출 | 0.0 | 1.0 | — | 구조 정확성 필수 |

> **주의**: Temperature와 Top-P를 동시에 극단값으로 설정하지 마세요. 일반적으로 하나를 조절하고 나머지는 기본값으로 둡니다.

---

### 1.5 프롬프트 구조 설계 원칙

#### 구조화된 프롬프트의 5대 요소

```python
STRUCTURED_PROMPT_TEMPLATE = """
# 1. 역할 (Role)
당신은 {role}입니다.

# 2. 컨텍스트 (Context)
{context}

# 3. 지시 (Instruction)
{instruction}

# 4. 입력 데이터 (Input)
<input>
{input_data}
</input>

# 5. 출력 형식 (Output Format)
다음 JSON 형식으로 응답하세요:
```json
{output_schema}
```
"""

def build_structured_prompt(
    role: str,
    context: str,
    instruction: str,
    input_data: str,
    output_schema: dict
) -> str:
    """구조화된 프롬프트를 생성하는 빌더 함수"""
    import json

    return STRUCTURED_PROMPT_TEMPLATE.format(
        role=role,
        context=context,
        instruction=instruction,
        input_data=input_data,
        output_schema=json.dumps(output_schema, indent=2, ensure_ascii=False)
    )

# 사용 예시
prompt = build_structured_prompt(
    role="시니어 Python 코드 리뷰어",
    context="FastAPI 기반 REST API 프로젝트에서 PR 코드 리뷰를 수행합니다.",
    instruction="아래 코드를 리뷰하고 개선점을 제안하세요. 보안, 성능, 가독성 순으로 우선순위를 매기세요.",
    input_data="def get_user(id):\n  return db.query(f'SELECT * FROM users WHERE id={id}')",
    output_schema={
        "severity": "critical | major | minor",
        "category": "security | performance | readability",
        "issue": "발견된 문제 설명",
        "suggestion": "개선 코드",
        "reasoning": "개선 이유"
    }
)
```

---

### 체크포인트 1

- [ ] BPE 토큰화 원리를 설명할 수 있다
- [ ] 컨텍스트 윈도우의 구조(시스템/히스토리/입력/출력)를 이해한다
- [ ] Temperature, Top-P, Top-K의 차이와 적절한 조합을 선택할 수 있다
- [ ] "Lost in the Middle" 현상을 이해하고 컨텍스트 배치를 최적화할 수 있다
- [ ] 구조화된 프롬프트의 5대 요소를 활용하여 프롬프트를 설계할 수 있다

---

## 2. API 기반 프롬프트

### 학습 목표

- OpenAI와 Anthropic API로 프롬프트를 프로그래밍적으로 전송한다
- Function Calling과 Tool Use를 활용하여 외부 시스템과 연동한다
- Structured Output으로 안정적인 JSON 응답을 받는다
- 스트리밍 응답을 구현하여 사용자 경험을 개선한다

---

### 2.1 API 기초 — Anthropic (Claude)

#### 설치 및 설정

```bash
# Python SDK 설치
pip install anthropic

# 환경 변수 설정
export ANTHROPIC_API_KEY="sk-ant-..."
```

#### 기본 메시지 전송

```python
import anthropic

client = anthropic.Anthropic()

def send_prompt(
    prompt: str,
    system: str = "",
    model: str = "claude-sonnet-4-20250514",
    max_tokens: int = 4096,
    temperature: float = 0.0
) -> str:
    """Claude API에 프롬프트를 전송하는 기본 함수"""

    message = client.messages.create(
        model=model,
        max_tokens=max_tokens,
        temperature=temperature,
        system=system,
        messages=[
            {"role": "user", "content": prompt}
        ]
    )

    return message.content[0].text

# 사용 예시
response = send_prompt(
    system="당신은 Python 코드 리뷰 전문가입니다.",
    prompt="다음 코드의 보안 취약점을 분석해주세요:\ndef login(user, pw):\n  query = f'SELECT * FROM users WHERE name=\"{user}\" AND pass=\"{pw}\"'\n  return db.execute(query)"
)
print(response)
```

#### 멀티턴 대화

```python
class ConversationManager:
    """멀티턴 대화를 관리하는 클래스"""

    def __init__(self, system_prompt: str, model: str = "claude-sonnet-4-20250514"):
        self.client = anthropic.Anthropic()
        self.system_prompt = system_prompt
        self.model = model
        self.messages = []
        self.total_input_tokens = 0
        self.total_output_tokens = 0

    def send(self, user_message: str, max_tokens: int = 4096) -> str:
        """메시지를 전송하고 대화 히스토리에 추가"""
        self.messages.append({
            "role": "user",
            "content": user_message
        })

        response = self.client.messages.create(
            model=self.model,
            max_tokens=max_tokens,
            system=self.system_prompt,
            messages=self.messages
        )

        assistant_message = response.content[0].text
        self.messages.append({
            "role": "assistant",
            "content": assistant_message
        })

        # 토큰 사용량 추적
        self.total_input_tokens += response.usage.input_tokens
        self.total_output_tokens += response.usage.output_tokens

        return assistant_message

    def get_usage_summary(self) -> dict:
        """토큰 사용량 요약"""
        return {
            "turns": len(self.messages) // 2,
            "total_input_tokens": self.total_input_tokens,
            "total_output_tokens": self.total_output_tokens,
            "estimated_cost": (
                self.total_input_tokens * 3 / 1_000_000 +
                self.total_output_tokens * 15 / 1_000_000
            )
        }

    def reset(self):
        """대화 히스토리 초기화"""
        self.messages = []

# 사용 예시
conv = ConversationManager(
    system_prompt="당신은 Python 튜터입니다. 개념을 코드 예제와 함께 설명합니다."
)

print(conv.send("데코레이터가 뭔가요?"))
print(conv.send("실전에서 어떻게 사용하나요?"))
print(conv.get_usage_summary())
```

---

### 2.2 API 기초 — OpenAI

```python
from openai import OpenAI

client = OpenAI()  # OPENAI_API_KEY 환경 변수 자동 참조

def send_openai_prompt(
    prompt: str,
    system: str = "",
    model: str = "gpt-4o",
    temperature: float = 0.0,
    response_format: dict = None
) -> str:
    """OpenAI API에 프롬프트를 전송하는 기본 함수"""

    messages = []
    if system:
        messages.append({"role": "system", "content": system})
    messages.append({"role": "user", "content": prompt})

    kwargs = {
        "model": model,
        "messages": messages,
        "temperature": temperature,
    }

    if response_format:
        kwargs["response_format"] = response_format

    response = client.chat.completions.create(**kwargs)
    return response.choices[0].message.content
```

---

### 2.3 Structured Output (구조화된 출력)

#### Anthropic — Tool Use를 활용한 구조화 출력

```python
import anthropic
import json

def extract_structured_data(text: str) -> dict:
    """텍스트에서 구조화된 데이터를 추출"""

    client = anthropic.Anthropic()

    # Tool 정의로 출력 스키마를 강제
    tools = [
        {
            "name": "save_extraction",
            "description": "텍스트에서 추출한 구조화된 정보를 저장합니다",
            "input_schema": {
                "type": "object",
                "properties": {
                    "people": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "name": {"type": "string", "description": "이름"},
                                "role": {"type": "string", "description": "직책/역할"},
                                "company": {"type": "string", "description": "소속 회사"},
                                "email": {"type": "string", "description": "이메일 (있는 경우)"}
                            },
                            "required": ["name"]
                        }
                    },
                    "action_items": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "task": {"type": "string"},
                                "assignee": {"type": "string"},
                                "deadline": {"type": "string"},
                                "priority": {
                                    "type": "string",
                                    "enum": ["high", "medium", "low"]
                                }
                            },
                            "required": ["task"]
                        }
                    },
                    "summary": {"type": "string", "description": "핵심 내용 요약 (1~2문장)"}
                },
                "required": ["summary"]
            }
        }
    ]

    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=4096,
        tools=tools,
        tool_choice={"type": "tool", "name": "save_extraction"},
        messages=[{
            "role": "user",
            "content": f"다음 텍스트에서 정보를 추출하세요:\n\n{text}"
        }]
    )

    # tool_use 블록에서 구조화된 데이터 추출
    for block in response.content:
        if block.type == "tool_use":
            return block.input

    return {}

# 사용 예시
meeting_notes = """
오늘 회의에서 김팀장이 신규 API 인증 시스템을 다음 주 금요일까지
완성하기로 했습니다. 박대리는 프론트엔드 로그인 페이지를 수요일까지,
이사원은 API 문서를 목요일까지 작성합니다. 보안 감사는 최우선입니다.
"""

result = extract_structured_data(meeting_notes)
print(json.dumps(result, indent=2, ensure_ascii=False))
```

#### OpenAI — JSON 모드 및 Structured Output

```python
from openai import OpenAI
from pydantic import BaseModel

client = OpenAI()

# 방법 1: Pydantic 기반 Structured Output
class CodeReview(BaseModel):
    file_path: str
    issues: list[dict]  # {"line": int, "severity": str, "message": str}
    overall_score: int   # 1-10
    summary: str

def review_code_structured(code: str, file_path: str) -> CodeReview:
    """코드 리뷰 결과를 구조화된 형태로 반환"""

    completion = client.beta.chat.completions.parse(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "코드를 리뷰하고 구조화된 피드백을 제공하세요."},
            {"role": "user", "content": f"파일: {file_path}\n\n```\n{code}\n```"}
        ],
        response_format=CodeReview,
    )

    return completion.choices[0].message.parsed

# 방법 2: JSON 모드 (간단한 경우)
def extract_json(prompt: str) -> dict:
    """JSON 모드로 구조화된 응답 요청"""
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"}
    )
    return json.loads(response.choices[0].message.content)
```

---

### 2.4 Function Calling / Tool Use

외부 함수를 LLM이 호출할 수 있게 하여 실시간 데이터, 계산, API 호출 등을 수행합니다.

#### Anthropic Tool Use 전체 흐름

```python
import anthropic
import json
import requests

client = anthropic.Anthropic()

# 1단계: 도구 정의
tools = [
    {
        "name": "get_weather",
        "description": "지정된 도시의 현재 날씨 정보를 조회합니다",
        "input_schema": {
            "type": "object",
            "properties": {
                "city": {
                    "type": "string",
                    "description": "도시 이름 (예: Seoul, Tokyo)"
                },
                "unit": {
                    "type": "string",
                    "enum": ["celsius", "fahrenheit"],
                    "description": "온도 단위"
                }
            },
            "required": ["city"]
        }
    },
    {
        "name": "search_database",
        "description": "내부 데이터베이스에서 정보를 검색합니다",
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {"type": "string", "description": "검색 쿼리"},
                "table": {
                    "type": "string",
                    "enum": ["users", "orders", "products"],
                    "description": "검색할 테이블"
                },
                "limit": {
                    "type": "integer",
                    "description": "최대 결과 수",
                    "default": 10
                }
            },
            "required": ["query", "table"]
        }
    },
    {
        "name": "run_code",
        "description": "Python 코드를 실행하고 결과를 반환합니다",
        "input_schema": {
            "type": "object",
            "properties": {
                "code": {"type": "string", "description": "실행할 Python 코드"},
                "timeout": {"type": "integer", "description": "타임아웃(초)", "default": 30}
            },
            "required": ["code"]
        }
    }
]

# 2단계: 도구 실행 함수
def execute_tool(name: str, input_data: dict) -> str:
    """도구를 실행하고 결과를 반환"""

    if name == "get_weather":
        # 실제로는 날씨 API 호출
        return json.dumps({
            "city": input_data["city"],
            "temperature": 18,
            "condition": "맑음",
            "humidity": 45
        }, ensure_ascii=False)

    elif name == "search_database":
        # 실제로는 DB 쿼리 실행
        return json.dumps({
            "results": [
                {"id": 1, "name": "샘플 결과", "match_score": 0.95}
            ],
            "total": 1
        }, ensure_ascii=False)

    elif name == "run_code":
        # 실제로는 샌드박스에서 코드 실행
        try:
            exec_globals = {}
            exec(input_data["code"], exec_globals)
            return json.dumps({"status": "success", "output": str(exec_globals.get("result", ""))})
        except Exception as e:
            return json.dumps({"status": "error", "error": str(e)})

    return json.dumps({"error": f"Unknown tool: {name}"})

# 3단계: 에이전트 루프
def agent_loop(user_message: str, max_iterations: int = 10) -> str:
    """도구 사용을 포함한 에이전트 루프"""

    messages = [{"role": "user", "content": user_message}]

    for iteration in range(max_iterations):
        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=4096,
            system="당신은 도구를 활용하여 사용자의 질문에 답하는 AI 어시스턴트입니다.",
            tools=tools,
            messages=messages
        )

        # 응답 처리
        if response.stop_reason == "end_turn":
            # 최종 텍스트 응답
            return response.content[0].text

        elif response.stop_reason == "tool_use":
            # 도구 호출 처리
            assistant_content = response.content
            messages.append({"role": "assistant", "content": assistant_content})

            # 각 도구 호출에 대해 결과 생성
            tool_results = []
            for block in assistant_content:
                if block.type == "tool_use":
                    print(f"  [도구 호출] {block.name}({json.dumps(block.input, ensure_ascii=False)})")
                    result = execute_tool(block.name, block.input)
                    print(f"  [도구 결과] {result[:100]}...")
                    tool_results.append({
                        "type": "tool_result",
                        "tool_use_id": block.id,
                        "content": result
                    })

            messages.append({"role": "user", "content": tool_results})

    return "최대 반복 횟수에 도달했습니다."

# 사용 예시
result = agent_loop("서울 날씨를 확인하고, 날씨에 맞는 옷차림을 추천해주세요.")
print(result)
```

---

### 2.5 스트리밍 응답

#### Anthropic 스트리밍

```python
import anthropic

client = anthropic.Anthropic()

def stream_response(prompt: str, system: str = "") -> str:
    """스트리밍으로 응답을 받아 실시간 출력"""

    full_response = ""

    with client.messages.stream(
        model="claude-sonnet-4-20250514",
        max_tokens=4096,
        system=system,
        messages=[{"role": "user", "content": prompt}]
    ) as stream:
        for text in stream.text_stream:
            print(text, end="", flush=True)
            full_response += text

    print()  # 줄바꿈
    return full_response

# 사용 예시
stream_response(
    system="당신은 친절한 한국어 튜터입니다.",
    prompt="Python 제너레이터를 설명해주세요."
)
```

#### JavaScript/TypeScript 스트리밍 (웹앱 연동)

```javascript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

async function streamToClient(prompt, res) {
  // Express.js SSE(Server-Sent Events) 응답
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const stream = await client.messages.stream({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    messages: [{ role: "user", content: prompt }],
  });

  for await (const event of stream) {
    if (
      event.type === "content_block_delta" &&
      event.delta.type === "text_delta"
    ) {
      res.write(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`);
    }
  }

  // 사용량 정보 전송
  const finalMessage = await stream.finalMessage();
  res.write(
    `data: ${JSON.stringify({
      done: true,
      usage: finalMessage.usage,
    })}\n\n`
  );

  res.end();
}
```

#### 프론트엔드 스트리밍 수신

```javascript
// React 컴포넌트에서 SSE 스트리밍 수신
function useStreamingChat() {
  const [response, setResponse] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const sendMessage = async (prompt) => {
    setIsStreaming(true);
    setResponse("");

    const eventSource = new EventSource(
      `/api/chat?prompt=${encodeURIComponent(prompt)}`
    );

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.done) {
        eventSource.close();
        setIsStreaming(false);
        console.log("토큰 사용량:", data.usage);
        return;
      }

      setResponse((prev) => prev + data.text);
    };

    eventSource.onerror = () => {
      eventSource.close();
      setIsStreaming(false);
    };
  };

  return { response, isStreaming, sendMessage };
}
```

---

### 2.6 에러 처리와 재시도

```python
import anthropic
import time
from functools import wraps

def retry_with_backoff(max_retries: int = 3, base_delay: float = 1.0):
    """지수 백오프 재시도 데코레이터"""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(max_retries + 1):
                try:
                    return func(*args, **kwargs)
                except anthropic.RateLimitError as e:
                    if attempt == max_retries:
                        raise
                    delay = base_delay * (2 ** attempt)
                    print(f"Rate limit 도달. {delay}초 후 재시도... ({attempt + 1}/{max_retries})")
                    time.sleep(delay)
                except anthropic.APIStatusError as e:
                    if e.status_code >= 500:
                        # 서버 에러는 재시도
                        if attempt == max_retries:
                            raise
                        delay = base_delay * (2 ** attempt)
                        print(f"서버 에러 ({e.status_code}). {delay}초 후 재시도...")
                        time.sleep(delay)
                    else:
                        # 클라이언트 에러는 즉시 실패
                        raise
                except anthropic.APIConnectionError:
                    if attempt == max_retries:
                        raise
                    delay = base_delay * (2 ** attempt)
                    print(f"연결 에러. {delay}초 후 재시도...")
                    time.sleep(delay)
        return wrapper
    return decorator

@retry_with_backoff(max_retries=3)
def safe_api_call(prompt: str) -> str:
    """안전한 API 호출 (자동 재시도 포함)"""
    client = anthropic.Anthropic()
    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=4096,
        messages=[{"role": "user", "content": prompt}]
    )
    return response.content[0].text
```

---

### 체크포인트 2

- [ ] Anthropic / OpenAI API를 사용하여 프롬프트를 전송할 수 있다
- [ ] Structured Output으로 안정적인 JSON 응답을 받을 수 있다
- [ ] Tool Use / Function Calling을 구현하여 외부 데이터를 활용할 수 있다
- [ ] 스트리밍 응답을 구현하여 실시간 UX를 제공할 수 있다
- [ ] 에러 처리와 지수 백오프 재시도를 구현할 수 있다

---

## 3. 에이전트 프롬프트 설계

### 학습 목표

- 자율 에이전트의 지시문(시스템 프롬프트)을 체계적으로 설계한다
- MCP(Model Context Protocol)를 활용하여 에이전트와 외부 도구를 통합한다
- Tool Use 프롬프트 패턴을 이해하고 실전에 적용한다
- 멀티 에이전트 아키텍처를 설계한다

---

### 3.1 에이전트란 무엇인가

에이전트는 LLM이 스스로 판단하여 도구를 선택하고, 실행하고, 결과를 평가하는 자율적 시스템입니다.

```
┌──────────────────────────────────────────────────────────┐
│                      에이전트 루프                         │
│                                                          │
│   사용자 입력 ──→ [관찰] ──→ [사고] ──→ [행동] ──→ [관찰]  │
│                      ↑                              │    │
│                      └──────────────────────────────┘    │
│                           반복 (목표 달성까지)              │
│                                                          │
│   행동의 종류:                                             │
│   - 도구 호출 (API, DB, 파일시스템)                        │
│   - 코드 실행                                             │
│   - 다른 에이전트 호출                                     │
│   - 사용자에게 질문                                        │
│   - 최종 답변 제출                                        │
└──────────────────────────────────────────────────────────┘
```

#### 에이전트 vs. 단순 프롬프트 비교

| 항목 | 단순 프롬프트 | 에이전트 |
|------|-------------|---------|
| 실행 방식 | 1회 호출, 1회 응답 | 반복 루프 (관찰→사고→행동) |
| 도구 사용 | 없음 | 필요에 따라 도구 선택·실행 |
| 자율성 | 없음 (지시된 것만 수행) | 목표 기반 자율 판단 |
| 에러 처리 | 사용자가 직접 | 에이전트가 자체 복구 시도 |
| 복잡도 | 낮음 | 높음 |
| 비용 | 예측 가능 (1회) | 가변적 (반복 횟수에 따라) |

---

### 3.2 에이전트 시스템 프롬프트 설계

#### 구조화된 에이전트 지시문 템플릿

```python
AGENT_SYSTEM_PROMPT = """
# 역할과 정체성
당신은 {agent_name}입니다. {agent_description}

# 핵심 목표
{primary_goal}

# 행동 원칙
1. 항상 현재 상태를 파악한 후 행동한다
2. 불확실한 경우 사용자에게 확인을 요청한다
3. 각 행동의 결과를 검증한 후 다음 단계로 진행한다
4. 실패 시 대안을 시도하되, 3회 이상 실패하면 사용자에게 보고한다

# 사용 가능한 도구
{tool_descriptions}

# 도구 사용 규칙
- 도구를 호출하기 전에 어떤 도구를 왜 사용하는지 설명한다
- 도구 결과를 반드시 검증한다
- 한 번에 하나의 도구만 호출한다 (병렬 호출이 명시적으로 허용된 경우 제외)
- 민감한 작업(삭제, 수정)은 실행 전 사용자 확인을 받는다

# 출력 형식
{output_format}

# 제약 조건
{constraints}
"""

def build_agent_prompt(config: dict) -> str:
    """에이전트 설정으로부터 시스템 프롬프트를 생성"""
    return AGENT_SYSTEM_PROMPT.format(**config)

# 사용 예시: 코드 리뷰 에이전트
code_review_agent = build_agent_prompt({
    "agent_name": "CodeReview Agent",
    "agent_description": "GitHub PR의 코드를 자동으로 리뷰하는 AI 에이전트",
    "primary_goal": "제출된 PR의 코드 품질, 보안, 성능을 분석하고 개선점을 제안한다",
    "tool_descriptions": """
    - read_file(path): 파일 내용을 읽는다
    - search_code(query): 코드베이스에서 패턴을 검색한다
    - run_tests(path): 테스트를 실행한다
    - post_comment(file, line, comment): PR에 리뷰 코멘트를 남긴다
    """,
    "output_format": "각 이슈를 [심각도] [카테고리] 형태로 보고한다",
    "constraints": """
    - 스타일 관련 이슈는 minor로 분류한다
    - 보안 취약점은 반드시 critical로 표시한다
    - 전체 리뷰 코멘트는 20개를 초과하지 않는다
    """
})
```

---

### 3.3 MCP (Model Context Protocol) 통합

MCP는 LLM 에이전트가 외부 도구·데이터 소스와 표준화된 방식으로 통신하는 프로토콜입니다.

#### MCP 아키텍처

```
┌─────────────┐     ┌─────────────┐     ┌─────────────────┐
│  LLM Host   │     │  MCP Client │     │   MCP Server    │
│  (Claude,   │────→│  (SDK 내장)  │────→│  (도구 제공자)   │
│   Cursor)   │     │             │     │                  │
└─────────────┘     └─────────────┘     │  - 파일시스템     │
                                        │  - DB 연결        │
                                        │  - API 호출       │
                                        │  - 브라우저 제어   │
                                        └─────────────────┘
```

#### MCP 서버 구현 (Python)

```python
# mcp_server.py — 커스텀 MCP 서버 예시
from mcp.server import Server
from mcp.types import Tool, TextContent
import json
import sqlite3

app = Server("my-dev-tools")

# 도구 1: 데이터베이스 쿼리
@app.tool()
async def query_database(query: str, database: str = "main.db") -> str:
    """SQLite 데이터베이스에서 읽기 전용 쿼리를 실행합니다.

    Args:
        query: 실행할 SQL 쿼리 (SELECT만 허용)
        database: 데이터베이스 파일 경로
    """
    # 보안: SELECT만 허용
    if not query.strip().upper().startswith("SELECT"):
        return json.dumps({"error": "읽기 전용 쿼리만 허용됩니다"})

    try:
        conn = sqlite3.connect(database)
        conn.row_factory = sqlite3.Row
        cursor = conn.execute(query)
        rows = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return json.dumps({"results": rows, "count": len(rows)}, ensure_ascii=False)
    except Exception as e:
        return json.dumps({"error": str(e)})

# 도구 2: 파일 검색
@app.tool()
async def search_files(
    pattern: str,
    directory: str = ".",
    file_type: str = "*.py"
) -> str:
    """디렉토리에서 패턴과 일치하는 파일을 검색합니다.

    Args:
        pattern: 검색할 텍스트 패턴 (정규식 지원)
        directory: 검색 시작 디렉토리
        file_type: 파일 확장자 필터 (예: *.py, *.js)
    """
    import glob
    import re

    results = []
    for filepath in glob.glob(f"{directory}/**/{file_type}", recursive=True):
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                for line_num, line in enumerate(f, 1):
                    if re.search(pattern, line):
                        results.append({
                            "file": filepath,
                            "line": line_num,
                            "content": line.strip()[:200]
                        })
        except (UnicodeDecodeError, PermissionError):
            continue

    return json.dumps({"matches": results[:50], "total": len(results)}, ensure_ascii=False)

# 도구 3: Git 상태 조회
@app.tool()
async def git_status(repo_path: str = ".") -> str:
    """Git 저장소의 현재 상태를 조회합니다.

    Args:
        repo_path: Git 저장소 경로
    """
    import subprocess

    try:
        result = subprocess.run(
            ["git", "status", "--porcelain"],
            cwd=repo_path,
            capture_output=True,
            text=True,
            timeout=10
        )

        branch = subprocess.run(
            ["git", "branch", "--show-current"],
            cwd=repo_path,
            capture_output=True,
            text=True,
            timeout=5
        )

        return json.dumps({
            "branch": branch.stdout.strip(),
            "changes": result.stdout.strip().split("\n") if result.stdout.strip() else [],
            "is_clean": not bool(result.stdout.strip())
        }, ensure_ascii=False)
    except Exception as e:
        return json.dumps({"error": str(e)})

# MCP 서버 실행
if __name__ == "__main__":
    import asyncio
    from mcp.server.stdio import stdio_server

    async def main():
        async with stdio_server() as (read_stream, write_stream):
            await app.run(read_stream, write_stream)

    asyncio.run(main())
```

#### MCP 설정 파일 (Claude Desktop)

```json
{
  "mcpServers": {
    "my-dev-tools": {
      "command": "python",
      "args": ["mcp_server.py"],
      "cwd": "/path/to/project"
    },
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/home/user/projects"
      ]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

---

### 3.4 Tool Use 프롬프트 패턴

#### 패턴 1: 순차 도구 호출 (Chain)

```python
SEQUENTIAL_TOOL_PROMPT = """
목표: {goal}

다음 순서대로 도구를 사용하세요:
1. 먼저 {tool_1}로 현재 상태를 파악합니다
2. 결과를 분석한 후 {tool_2}로 필요한 데이터를 수집합니다
3. 수집된 데이터를 기반으로 {tool_3}으로 작업을 수행합니다
4. 최종 결과를 검증합니다

각 단계의 결과를 다음 단계의 입력으로 활용하세요.
실패 시 이전 단계로 돌아가 다른 접근법을 시도하세요.
"""
```

#### 패턴 2: 조건부 도구 선택 (Router)

```python
CONDITIONAL_TOOL_PROMPT = """
사용자의 요청을 분석하여 적절한 도구를 선택하세요:

- 코드 관련 질문 → search_code, read_file
- 데이터 분석 → query_database, run_code
- 파일 관리 → list_files, read_file, write_file
- 배포 관련 → git_status, deploy

선택 기준:
1. 요청의 핵심 의도를 파악합니다
2. 필요한 최소한의 도구만 사용합니다
3. 도구 결과가 불충분하면 추가 도구를 사용합니다
"""
```

#### 패턴 3: 자기 검증 (Self-Verification)

```python
SELF_VERIFY_PROMPT = """
작업을 수행한 후 반드시 검증 단계를 거치세요:

1. 작업 수행: {task}
2. 검증:
   - 결과가 요청과 일치하는가?
   - 부작용이 없는가?
   - 에지 케이스를 처리했는가?
3. 검증 실패 시:
   - 문제점을 명시합니다
   - 수정 작업을 수행합니다
   - 다시 검증합니다

검증 체크리스트:
- [ ] 출력 형식이 올바른가
- [ ] 데이터 무결성이 유지되는가
- [ ] 보안 규칙을 위반하지 않았는가
"""
```

---

### 3.5 멀티 에이전트 아키텍처

```python
# 멀티 에이전트 시스템 설계 예시
class MultiAgentSystem:
    """역할별 에이전트를 조율하는 오케스트레이터"""

    def __init__(self):
        self.agents = {}
        self.client = anthropic.Anthropic()

    def register_agent(self, name: str, system_prompt: str, tools: list = None):
        """에이전트를 등록"""
        self.agents[name] = {
            "system_prompt": system_prompt,
            "tools": tools or [],
            "history": []
        }

    def run_agent(self, agent_name: str, task: str) -> str:
        """특정 에이전트를 실행"""
        agent = self.agents[agent_name]

        response = self.client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=4096,
            system=agent["system_prompt"],
            tools=agent["tools"],
            messages=[{"role": "user", "content": task}]
        )

        return response.content[0].text

    def orchestrate(self, user_request: str) -> dict:
        """사용자 요청을 분석하여 적절한 에이전트에게 작업 배분"""

        # 오케스트레이터가 작업을 분석하고 에이전트를 선택
        plan = self.run_agent("orchestrator", f"""
        다음 요청을 분석하고 실행 계획을 JSON으로 작성하세요:

        요청: {user_request}

        사용 가능한 에이전트: {list(self.agents.keys())}

        JSON 형식:
        {{
            "steps": [
                {{"agent": "에이전트이름", "task": "세부 작업", "depends_on": []}}
            ]
        }}
        """)

        # 계획에 따라 에이전트 순차 실행
        results = {}
        import json
        steps = json.loads(plan)["steps"]

        for step in steps:
            # 의존성 결과를 컨텍스트에 포함
            context = ""
            for dep in step.get("depends_on", []):
                if dep in results:
                    context += f"\n이전 결과 ({dep}): {results[dep]}\n"

            task_with_context = f"{context}\n{step['task']}"
            results[step["agent"]] = self.run_agent(step["agent"], task_with_context)

        return results

# 사용 예시
mas = MultiAgentSystem()

mas.register_agent(
    "orchestrator",
    "당신은 작업을 분석하고 적절한 에이전트에게 배분하는 오케스트레이터입니다."
)

mas.register_agent(
    "code_analyst",
    "당신은 코드를 분석하고 구조를 파악하는 전문가입니다."
)

mas.register_agent(
    "test_writer",
    "당신은 분석된 코드에 대한 테스트 케이스를 작성하는 전문가입니다."
)

mas.register_agent(
    "doc_writer",
    "당신은 코드와 테스트를 기반으로 기술 문서를 작성하는 전문가입니다."
)

results = mas.orchestrate("src/auth.py 파일을 분석하고, 테스트를 작성하고, 문서화해주세요.")
```

---

### 3.6 CLAUDE.md — 프로젝트 지시문 설계

Claude Code 에이전트를 위한 프로젝트별 지시문 파일입니다.

```markdown
# CLAUDE.md 작성 가이드

## 기본 구조

### 프로젝트 개요
- 프로젝트 이름, 목적, 기술 스택 한 줄 요약

### 개발 환경
- 패키지 매니저 (npm/yarn/pnpm)
- Node/Python 버전
- 환경 변수 목록

### 코드 컨벤션
- 네이밍 규칙 (camelCase, snake_case 등)
- 파일/디렉토리 구조
- 임포트 순서

### 커밋 규칙
- 커밋 메시지 형식
- 브랜치 전략

### 테스트 규칙
- 테스트 프레임워크
- 커버리지 기준
- 테스트 실행 명령어

### 금지 사항
- 절대 해서는 안 되는 것들
```

#### 실전 CLAUDE.md 예시

```markdown
# CLAUDE.md — E-Commerce API

## 프로젝트
FastAPI + PostgreSQL 기반 전자상거래 REST API

## 명령어
- 서버: `uvicorn app.main:app --reload`
- 테스트: `pytest -v --cov=app`
- 마이그레이션: `alembic upgrade head`
- 린트: `ruff check . && mypy app/`

## 코드 규칙
- 타입 힌트 필수 (모든 함수 시그니처)
- Pydantic V2 모델 사용
- 비즈니스 로직은 services/ 디렉토리에
- DB 쿼리는 repositories/ 디렉토리에
- 엔드포인트는 routers/ 디렉토리에

## 테스트 규칙
- 모든 엔드포인트에 최소 happy path + error path 테스트
- DB 테스트는 test_db fixture 사용
- 외부 API는 반드시 mock

## 금지 사항
- raw SQL 직접 실행 금지 (SQLAlchemy ORM 사용)
- .env 파일 커밋 금지
- print() 디버깅 금지 (logging 모듈 사용)
- 동기 DB 드라이버 금지 (asyncpg 사용)
```

---

### 체크포인트 3

- [ ] 에이전트 루프(관찰→사고→행동)의 원리를 이해한다
- [ ] 구조화된 에이전트 시스템 프롬프트를 설계할 수 있다
- [ ] MCP 서버를 구현하고 에이전트와 통합할 수 있다
- [ ] 순차/조건부/자기검증 도구 사용 패턴을 적용할 수 있다
- [ ] 멀티 에이전트 아키텍처의 구조와 오케스트레이션을 이해한다
- [ ] CLAUDE.md 등 프로젝트 지시문을 효과적으로 작성할 수 있다

---