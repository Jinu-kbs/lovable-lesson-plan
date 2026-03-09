# ChatGPT(Codex) 개발자 교안 — 개발자편: ChatGPT/Codex 개발 통합

> **대상**: 개발 경험자, ChatGPT/Codex를 개발 워크플로에 통합하려는 개발자
> **목표**: Codex 에이전트 활용, API 심화, CI/CD 통합, 프로덕션 배포
> **주요 도구**: Codex, OpenAI API, GitHub, Docker
> **소요**: 약 5~6시간

---

## 어떤 교안을 봐야 할까요? (자가 진단)

| 항목 | 초보자편 | 중급자편 | **개발자편 (현재)** |
|------|---------|---------|-------------------|
| 코딩 경험 | 없음 | 약간 | **있음 (1년 이상)** |
| API 사용 경험 | 없음 | REST API 기초 | **API 설계·운영 가능** |
| Git/GitHub | 모름 | 기초 커밋 | **PR·브랜치·Actions 능숙** |
| ChatGPT 활용 | 대화 수준 | Canvas·Codex 체험 | **프롬프트 엔지니어링·API 활용** |
| 학습 목표 | 첫 코드 생성 | 프로젝트 제작 | **프로덕션 통합·자동화** |
| 소요 시간 | 3~4시간 | 4~5시간 | **5~6시간** |

> Git, 터미널, 패키지 매니저(npm/pip) 사용 경험이 없다면 → **초보자편** 또는 **중급자편**을 먼저 보세요.

---

### 추천 리소스

| 리소스 | 설명 | 링크 |
|--------|------|------|
| **OpenAI Platform 문서** | API 레퍼런스 및 가이드 | [platform.openai.com/docs](https://platform.openai.com/docs) |
| **Codex 공식 문서** | Codex 에이전트 사용법 | [OpenAI Codex](https://openai.com/index/openai-codex/) |
| **OpenAI Cookbook** | API 활용 예제 모음 | [GitHub](https://github.com/openai/openai-cookbook) |
| **OpenAI API Changelog** | API 변경 이력 | [platform.openai.com/docs/changelog](https://platform.openai.com/docs/changelog) |
| **GPTs Actions 가이드** | GPTs 외부 API 연동 | [platform.openai.com/docs/actions](https://platform.openai.com/docs/actions) |

---

## 목차

1. [기술 아키텍처](#1-기술-아키텍처)
2. [사전 준비](#2-사전-준비)
3. [Codex 에이전트 심화](#3-codex-에이전트-심화)
4. [API 심화 활용](#4-api-심화-활용)
5. [개발 워크플로 통합](#5-개발-워크플로-통합)
6. [CI/CD 통합](#6-cicd-통합)
7. [프로덕션 배포](#7-프로덕션-배포)
8. [GPTs/Actions 심화](#8-gptsactions-심화)
9. [마이그레이션](#9-마이그레이션)
10. [디버깅 가이드](#10-디버깅-가이드)
11. [보안과 비용 관리](#11-보안과-비용-관리)
12. [다음 단계](#12-다음-단계)

---

## 1. 기술 아키텍처

### 학습 목표

- GPT 모델 아키텍처와 Codex 에이전트 구조를 이해한다
- API 엔드포인트 맵을 파악하고 적절한 엔드포인트를 선택할 수 있다
- 토큰·컨텍스트 윈도우 관리 전략을 수립할 수 있다
- ChatGPT 제품군과 API의 차이를 명확히 구분한다

### GPT 모델 패밀리 개요

OpenAI의 모델 라인업은 용도별로 세분화되어 있습니다:

| 모델 | 컨텍스트 윈도우 | 특징 | 주요 용도 |
|------|----------------|------|----------|
| **GPT-4o** | 128K 토큰 | 멀티모달(텍스트+이미지+오디오) | 범용 대화, 분석 |
| **GPT-4o mini** | 128K 토큰 | 경량·저비용·고속 | 대량 처리, 분류 |
| **GPT-4.1** | 1M 토큰 | 코딩 특화, 긴 컨텍스트 | 대규모 코드베이스 분석 |
| **GPT-4.1 mini** | 1M 토큰 | 코딩 특화 경량 | 코드 보조, 자동완성 |
| **GPT-4.1 nano** | 1M 토큰 | 초경량·초저비용 | 임베디드, 에지 |
| **o3** | 200K 토큰 | 추론 특화 (사고 체인) | 수학, 논리, 코딩 문제 |
| **o4-mini** | 200K 토큰 | 추론 경량 | 복잡한 문제 해결 (비용 효율) |

### Codex 에이전트 아키텍처

Codex는 ChatGPT 내에서 동작하는 **자율 코딩 에이전트**입니다. 클라우드 샌드박스에서 코드를 실행하며, GitHub 저장소와 직접 연동됩니다.

```
┌─────────────────────────────────────────────────────┐
│                   ChatGPT UI                         │
│  ┌───────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │  대화 모드  │  │  Canvas  │  │  Codex 에이전트   │  │
│  └─────┬─────┘  └────┬─────┘  └────────┬─────────┘  │
│        │              │                  │            │
│  ┌─────▼──────────────▼──────────────────▼─────────┐ │
│  │              GPT 모델 라우터                      │ │
│  │   (GPT-4o / GPT-4.1 / o3 / o4-mini 자동 선택)    │ │
│  └──────────────────────┬──────────────────────────┘ │
└─────────────────────────┼────────────────────────────┘
                          │
              ┌───────────▼───────────┐
              │   클라우드 샌드박스      │
              │  ┌──────────────────┐  │
              │  │  파일시스템       │  │
              │  │  터미널 실행      │  │
              │  │  패키지 설치      │  │
              │  │  테스트 실행      │  │
              │  └────────┬─────────┘  │
              └───────────┼────────────┘
                          │
              ┌───────────▼───────────┐
              │     GitHub 연동        │
              │  - PR 자동 생성        │
              │  - 브랜치 생성         │
              │  - 코드 리뷰           │
              └───────────────────────┘
```

### API 엔드포인트 맵

OpenAI API는 기능별로 여러 엔드포인트를 제공합니다:

| 엔드포인트 | 메서드 | 용도 | 주요 파라미터 |
|-----------|--------|------|-------------|
| `/v1/chat/completions` | POST | 대화형 텍스트 생성 | model, messages, tools |
| `/v1/responses` | POST | Responses API (최신) | model, input, tools |
| `/v1/embeddings` | POST | 텍스트 벡터화 | model, input |
| `/v1/images/generations` | POST | 이미지 생성 | model, prompt, size |
| `/v1/audio/transcriptions` | POST | 음성→텍스트 | model, file |
| `/v1/audio/speech` | POST | 텍스트→음성 | model, input, voice |
| `/v1/files` | POST/GET | 파일 업로드·관리 | purpose, file |
| `/v1/fine_tuning/jobs` | POST | 파인튜닝 작업 | model, training_file |
| `/v1/assistants` | POST/GET | Assistants API | model, tools, instructions |

### 토큰·컨텍스트 관리 전략

```python
import tiktoken

def count_tokens(text: str, model: str = "gpt-4o") -> int:
    """텍스트의 토큰 수를 계산합니다."""
    encoding = tiktoken.encoding_for_model(model)
    return len(encoding.encode(text))

def estimate_cost(
    input_tokens: int,
    output_tokens: int,
    model: str = "gpt-4o"
) -> float:
    """API 호출 비용을 추정합니다."""
    pricing = {
        "gpt-4o":        {"input": 2.50, "output": 10.00},
        "gpt-4o-mini":   {"input": 0.15, "output": 0.60},
        "gpt-4.1":       {"input": 2.00, "output": 8.00},
        "gpt-4.1-mini":  {"input": 0.40, "output": 1.60},
        "gpt-4.1-nano":  {"input": 0.10, "output": 0.40},
        "o3":            {"input": 2.00, "output": 8.00},
        "o4-mini":       {"input": 1.10, "output": 4.40},
    }
    rate = pricing.get(model, pricing["gpt-4o"])
    cost = (input_tokens / 1_000_000 * rate["input"] +
            output_tokens / 1_000_000 * rate["output"])
    return round(cost, 6)

# 사용 예시
code = open("src/main.py").read()
tokens = count_tokens(code)
print(f"토큰 수: {tokens}")
print(f"예상 비용: ${estimate_cost(tokens, 500)}")
```

### 모델 선택 의사결정 트리

| 작업 유형 | 추천 모델 | 이유 |
|----------|----------|------|
| 간단한 코드 생성·수정 | GPT-4.1 mini | 코딩 특화, 비용 효율 |
| 대규모 코드베이스 분석 | GPT-4.1 | 1M 토큰 컨텍스트 |
| 복잡한 알고리즘·수학 | o3 / o4-mini | 추론 체인 |
| 멀티모달 (이미지 포함) | GPT-4o | 이미지 입력 지원 |
| 대량 배치 처리 | GPT-4o mini | 최저 비용 |
| 실시간 대화형 서비스 | GPT-4o mini | 빠른 응답 |

### 체크포인트

- [ ] GPT 모델 패밀리의 특징과 용도를 설명할 수 있다
- [ ] Codex 에이전트의 동작 구조를 이해하고 있다
- [ ] API 엔드포인트별 용도를 구분할 수 있다
- [ ] 토큰 수 계산과 비용 추정 방법을 알고 있다

---

## 2. 사전 준비

### 학습 목표

- OpenAI API 키와 Organization을 올바르게 설정할 수 있다
- Python 및 JavaScript SDK를 설치하고 첫 API 호출을 수행할 수 있다
- 개발 환경을 구성하고 보안 설정을 완료할 수 있다

### 개발 환경 요구사항

| 항목 | 필수/권장 | 설명 |
|------|----------|------|
| **Python 3.10+** | 권장 | OpenAI Python SDK |
| **Node.js 18+** | 권장 | OpenAI JS/TS SDK |
| **Git** | 필수 | 버전 관리 및 Codex 연동 |
| **Docker** | 권장 | 컨테이너 기반 배포 |
| **VS Code / Cursor** | 권장 | IDE 통합 |
| **GitHub 계정** | 필수 | Codex 저장소 연동 |
| **OpenAI 계정** | 필수 | API 키 발급 |

### API 키 및 Organization 설정

#### 1단계: API 키 발급

OpenAI Platform(https://platform.openai.com)에서 API 키를 생성합니다:

1. **Settings → API keys** 이동
2. **Create new secret key** 클릭
3. 키 이름 지정 (예: `dev-project-2026`)
4. 권한 설정: 필요한 엔드포인트만 선택
5. 키를 안전한 곳에 복사 (다시 확인 불가)

#### 2단계: Organization 및 Project 설정

```bash
# 환경 변수 설정 (.env 파일)
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxx
OPENAI_ORG_ID=org-xxxxxxxxxxxxxxxxxxxx
OPENAI_PROJECT_ID=proj_xxxxxxxxxxxxxxxxxxxx
```

> Organization은 팀 단위 결제·관리를 위한 상위 단위이며, Project는 그 안에서 API 키와 사용량을 분리하는 논리 단위입니다.

#### 3단계: 예산 및 제한 설정

Platform → Settings → Limits에서 설정합니다:

| 설정 | 추천값 | 설명 |
|------|-------|------|
| **Monthly budget** | $50~$200 | 월간 API 사용 예산 |
| **Rate limit tier** | Tier 2+ | 분당 요청 수 제한 |
| **Notification threshold** | 80% | 예산 도달 시 알림 |
| **Hard cap** | 설정 권장 | 예산 초과 시 자동 차단 |

### SDK 설치

#### Python SDK

```bash
# Python SDK 설치
pip install openai

# 또는 프로젝트 의존성으로
pip install openai python-dotenv tiktoken

# requirements.txt에 추가
echo "openai>=1.40.0
python-dotenv>=1.0.0
tiktoken>=0.7.0" > requirements.txt
```

#### JavaScript/TypeScript SDK

```bash
# npm
npm install openai dotenv

# yarn
yarn add openai dotenv

# pnpm
pnpm add openai dotenv
```

### 첫 API 호출 테스트

#### Python

```python
# test_api.py
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
client = OpenAI()  # OPENAI_API_KEY 환경변수 자동 사용

# Chat Completions API 테스트
response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "system", "content": "당신은 한국어 코딩 도우미입니다."},
        {"role": "user", "content": "Python으로 피보나치 함수를 작성해줘"}
    ],
    temperature=0.2,
    max_tokens=500
)

print(response.choices[0].message.content)
print(f"\n--- 사용량 ---")
print(f"입력 토큰: {response.usage.prompt_tokens}")
print(f"출력 토큰: {response.usage.completion_tokens}")
print(f"총 토큰: {response.usage.total_tokens}")
```

#### JavaScript/TypeScript

```javascript
// test_api.js
import OpenAI from 'openai';
import 'dotenv/config';

const openai = new OpenAI();

async function main() {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: '당신은 한국어 코딩 도우미입니다.' },
      { role: 'user', content: 'TypeScript로 간단한 REST API를 만들어줘' }
    ],
    temperature: 0.2,
    max_tokens: 500
  });

  console.log(response.choices[0].message.content);
  console.log(`\n--- 사용량 ---`);
  console.log(`입력 토큰: ${response.usage.prompt_tokens}`);
  console.log(`출력 토큰: ${response.usage.completion_tokens}`);
}

main();
```

### 개발 환경 구성 예시

```
프로젝트-루트/
├── .env                 ← API 키 (절대 커밋 금지)
├── .env.example         ← 환경변수 템플릿 (커밋 가능)
├── .gitignore           ← .env 포함
├── requirements.txt     ← Python 의존성
├── package.json         ← Node.js 의존성
├── src/
│   ├── api/
│   │   ├── client.py    ← OpenAI 클라이언트 래퍼
│   │   └── client.ts    ← TypeScript 클라이언트 래퍼
│   ├── prompts/
│   │   ├── system.md    ← 시스템 프롬프트
│   │   └── templates/   ← 프롬프트 템플릿
│   └── utils/
│       └── tokens.py    ← 토큰 관리 유틸
├── tests/
│   └── test_api.py      ← API 테스트
├── docker-compose.yml   ← Docker 구성
└── Makefile             ← 자동화 명령
```

### .gitignore 필수 항목

```gitignore
# API 키·환경변수
.env
.env.local
.env.production

# Python
__pycache__/
*.pyc
.venv/
venv/

# Node.js
node_modules/
dist/

# IDE
.vscode/
.idea/
.cursor/

# OS
.DS_Store
Thumbs.db
```

### 개발 환경 체크리스트

- [ ] OpenAI Platform 계정 생성 및 결제 정보 등록
- [ ] API 키 발급 및 .env 파일에 저장
- [ ] Organization/Project 설정 완료
- [ ] 월간 예산 및 알림 설정 완료
- [ ] Python 또는 Node.js SDK 설치
- [ ] 첫 API 호출 테스트 성공
- [ ] .gitignore에 .env 포함 확인
- [ ] GitHub 저장소 Codex 연동 확인

### 체크포인트

- [ ] API 키를 안전하게 관리하는 방법을 설명할 수 있다
- [ ] Organization과 Project의 차이를 이해하고 있다
- [ ] SDK로 첫 API 호출을 성공적으로 수행했다
- [ ] 개발 환경이 올바르게 구성되어 있다

---

## 3. Codex 에이전트 심화

### 학습 목표

- Codex 에이전트의 작업 모드와 전략을 이해한다
- 멀티태스크 및 병렬 작업을 효과적으로 활용한다
- 코드 품질 제어와 보안 정책을 설정할 수 있다
- Codex를 팀 워크플로에 통합할 수 있다

### Codex 에이전트 개요

Codex는 ChatGPT 내에서 동작하는 클라우드 기반 코딩 에이전트입니다. GitHub 저장소를 직접 읽고, 코드를 수정하며, PR을 생성합니다.

| 특징 | 설명 |
|------|------|
| **실행 환경** | 클라우드 샌드박스 (격리된 컨테이너) |
| **코드 접근** | GitHub 저장소 직접 연동 |
| **결과 제출** | PR 생성 또는 브랜치 푸시 |
| **병렬 작업** | 여러 작업을 동시에 실행 가능 |
| **보안** | 네트워크 격리, 읽기 전용 기본값 |

### 작업 모드 상세

Codex는 3가지 작업 모드를 지원합니다:

#### Ask 모드 (질문 모드)

코드를 변경하지 않고 질문에만 답합니다:

```
[Codex에게]
이 저장소의 인증 시스템 구조를 분석해줘.
JWT 토큰 갱신 로직에서 취약점이 있는지 확인해줘.
```

활용 사례:
- 코드베이스 이해 및 온보딩
- 보안 취약점 탐지
- 아키텍처 리뷰
- 의존성 분석

#### Code 모드 (코드 작성 모드)

파일을 읽고 수정할 수 있지만, 터미널 명령은 실행하지 않습니다:

```
[Codex에게]
src/auth/jwt.ts 파일에서 토큰 갱신 로직을 리팩토링해줘.
만료 5분 전에 자동 갱신하는 로직을 추가해줘.
```

활용 사례:
- 코드 리팩토링
- 새 기능 구현
- 버그 수정
- 테스트 코드 작성

#### Full Auto 모드 (전체 자동화)

파일 수정 + 터미널 명령(패키지 설치, 테스트 실행, 빌드 등)까지 수행합니다:

```
[Codex에게]
이 Next.js 프로젝트에 Stripe 결제 시스템을 통합해줘.
1. stripe 패키지를 설치하고
2. 결제 API 라우트를 만들고
3. 프론트엔드 결제 폼을 구현하고
4. 테스트를 작성하고 실행해줘
```

활용 사례:
- 종합적인 기능 구현
- 의존성 업데이트 및 마이그레이션
- 테스트 작성 및 실행
- 빌드 검증

### 효과적인 작업 전략

#### 단일 작업 최적화

```
[효과적인 Codex 프롬프트 구조]

## 목표
구체적으로 무엇을 달성하려는지 서술

## 컨텍스트
- 관련 파일: src/api/auth.ts, src/middleware/jwt.ts
- 사용 중인 프레임워크: Next.js 14, Prisma
- 현재 상태: 인증은 구현됨, 토큰 갱신이 미구현

## 요구사항
1. 구체적인 기능 요구사항 1
2. 구체적인 기능 요구사항 2
3. 구체적인 기능 요구사항 3

## 제약 조건
- 기존 API 스키마를 깨뜨리지 말 것
- TypeScript strict mode 준수
- 테스트 커버리지 80% 이상

## 결과물
- PR로 제출할 것
- 테스트가 통과하는 상태여야 함
```

#### 멀티태스크 병렬 실행

Codex는 여러 작업을 동시에 실행할 수 있습니다:

```
[작업 1 - Codex에게]
src/components/ 디렉토리의 모든 React 컴포넌트에
PropTypes를 TypeScript 인터페이스로 마이그레이션해줘.

[작업 2 - Codex에게 (동시 실행)]
tests/ 디렉토리에 누락된 유닛 테스트를 작성해줘.
커버리지 리포트를 기준으로 커버리지 80% 미만인 파일을 우선 처리해줘.

[작업 3 - Codex에게 (동시 실행)]
README.md를 프로젝트 현재 상태에 맞게 업데이트해줘.
설치 가이드, API 문서, 환경변수 목록을 포함해줘.
```

> 병렬 작업 시 서로 같은 파일을 수정하지 않도록 작업 범위를 명확히 분리하세요.

### 코드 품질 제어

#### AGENTS.md 파일 활용

프로젝트 루트에 `AGENTS.md` 파일을 생성하면 Codex가 이를 자동으로 읽어 코딩 규칙을 따릅니다:

```markdown
# AGENTS.md

## 코딩 규칙
- TypeScript strict mode 사용
- 함수는 순수 함수로 작성 (부작용 최소화)
- 에러 핸들링은 Result 타입 사용
- 모든 public 함수에 JSDoc 주석 필수

## 테스트 규칙
- 테스트 프레임워크: Vitest
- 파일명: *.test.ts
- 커버리지 최소 80%
- 모킹은 vi.mock() 사용

## 금지 사항
- any 타입 사용 금지
- console.log 사용 금지 (logger 사용)
- 직접 DOM 조작 금지
- eval() 사용 금지

## 브랜치 규칙
- feature/기능명 형식
- 커밋 메시지: Conventional Commits
- PR 설명에 변경 이유 포함
```

#### 하위 디렉토리별 규칙

```
프로젝트-루트/
├── AGENTS.md              ← 전역 규칙
├── src/
│   ├── AGENTS.md          ← src 전용 규칙
│   ├── api/
│   │   └── AGENTS.md      ← API 전용 규칙
│   └── components/
│       └── AGENTS.md      ← 컴포넌트 전용 규칙
└── tests/
    └── AGENTS.md          ← 테스트 전용 규칙
```

### 보안 정책

Codex 샌드박스의 보안 설정을 이해하고 활용합니다:

| 보안 항목 | 기본 설정 | 설명 |
|----------|----------|------|
| **네트워크 격리** | 활성화 | 외부 네트워크 접근 차단 (npm/pip 설치 시에만 허용) |
| **파일시스템** | 프로젝트 범위 | 프로젝트 디렉토리만 접근 가능 |
| **비밀 정보** | 환경변수 | GitHub Secrets를 환경변수로 전달 가능 |
| **실행 권한** | 사용자 권한 | root 권한 없음 |

```bash
# Codex가 접근할 수 있는 환경변수 설정 (GitHub 저장소)
# Settings → Secrets and variables → Codex

DATABASE_URL=postgresql://...
REDIS_URL=redis://...
```

### 실습: Codex로 기능 구현하기

다음 프롬프트로 Codex에게 기능을 요청해보세요:

```
## 작업: 사용자 알림 시스템 구현

### 배경
현재 프로젝트는 Next.js 14 + Prisma + PostgreSQL 기반입니다.
사용자 알림 기능이 아직 구현되지 않았습니다.

### 요구사항
1. Prisma 스키마에 Notification 모델 추가
   - id, userId, type, title, message, read, createdAt
2. API 라우트 구현
   - GET /api/notifications - 목록 조회 (페이지네이션)
   - PATCH /api/notifications/:id/read - 읽음 처리
   - DELETE /api/notifications/:id - 삭제
3. 유닛 테스트 작성
4. DB 마이그레이션 실행

### 제약 조건
- 기존 User 모델과 관계 설정
- Zod로 입력 검증
- 에러 시 적절한 HTTP 상태 코드 반환

### 모드
Full Auto
```

### 체크포인트

- [ ] Codex의 3가지 모드(Ask/Code/Full Auto) 차이를 설명할 수 있다
- [ ] AGENTS.md 파일을 작성하여 코드 품질을 제어할 수 있다
- [ ] 멀티태스크 병렬 실행 전략을 수립할 수 있다
- [ ] Codex 보안 정책을 이해하고 환경변수를 설정할 수 있다

---

## 4. API 심화 활용

### 학습 목표

- Function Calling과 Structured Outputs를 활용하여 구조화된 응답을 생성할 수 있다
- Vision API로 이미지 기반 작업을 수행할 수 있다
- 임베딩과 Fine-tuning의 개념을 이해하고 적용할 수 있다
- API 비용을 최적화하는 전략을 수립할 수 있다

### Function Calling (도구 호출)

Function Calling은 GPT 모델이 외부 함수를 호출하도록 요청하는 기능입니다. 모델이 직접 함수를 실행하는 것이 아니라, 어떤 함수를 어떤 인자로 호출해야 하는지 JSON으로 응답합니다.

```python
from openai import OpenAI
import json

client = OpenAI()

# 사용 가능한 도구(함수) 정의
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "특정 도시의 현재 날씨를 조회합니다",
            "parameters": {
                "type": "object",
                "properties": {
                    "city": {
                        "type": "string",
                        "description": "도시명 (예: 서울, 부산)"
                    },
                    "unit": {
                        "type": "string",
                        "enum": ["celsius", "fahrenheit"],
                        "description": "온도 단위"
                    }
                },
                "required": ["city"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "search_database",
            "description": "데이터베이스에서 사용자 정보를 검색합니다",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "검색 쿼리"
                    },
                    "table": {
                        "type": "string",
                        "enum": ["users", "orders", "products"]
                    },
                    "limit": {
                        "type": "integer",
                        "description": "결과 수 제한",
                        "default": 10
                    }
                },
                "required": ["query", "table"]
            }
        }
    }
]

# 도구 호출이 포함된 대화
response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": "날씨와 DB 검색 도구를 활용하는 비서입니다."},
        {"role": "user", "content": "서울 날씨 알려주고, 최근 주문 3건도 보여줘"}
    ],
    tools=tools,
    tool_choice="auto"  # 모델이 자동으로 도구 호출 결정
)

# 도구 호출 처리
message = response.choices[0].message
if message.tool_calls:
    for tool_call in message.tool_calls:
        func_name = tool_call.function.name
        func_args = json.loads(tool_call.function.arguments)
        print(f"호출할 함수: {func_name}")
        print(f"인자: {func_args}")

        # 실제 함수 실행 후 결과를 다시 전달
        # result = execute_function(func_name, func_args)
```

### Structured Outputs (구조화 출력)

모델이 지정된 JSON 스키마에 정확히 일치하는 구조화된 응답을 반환하도록 합니다:

```python
from openai import OpenAI
from pydantic import BaseModel

client = OpenAI()

# Pydantic 모델로 출력 스키마 정의
class CodeReview(BaseModel):
    file_path: str
    issues: list[dict]  # {"line": int, "severity": str, "message": str}
    overall_score: int   # 1-10
    suggestions: list[str]
    is_safe_to_merge: bool

class ReviewResult(BaseModel):
    reviews: list[CodeReview]
    summary: str
    total_issues: int

# Structured Outputs 사용
response = client.beta.chat.completions.parse(
    model="gpt-4o",
    messages=[
        {
            "role": "system",
            "content": "코드 리뷰어입니다. 제출된 코드를 분석하고 구조화된 리뷰를 제공합니다."
        },
        {
            "role": "user",
            "content": f"다음 코드를 리뷰해주세요:\n```python\n{code_to_review}\n```"
        }
    ],
    response_format=ReviewResult
)

review = response.choices[0].message.parsed
print(f"전체 이슈 수: {review.total_issues}")
print(f"머지 가능: {review.reviews[0].is_safe_to_merge}")
for issue in review.reviews[0].issues:
    print(f"  Line {issue['line']}: [{issue['severity']}] {issue['message']}")
```

### Vision API (이미지 입력)

GPT-4o는 이미지를 입력으로 받아 분석할 수 있습니다:

```python
import base64
from openai import OpenAI

client = OpenAI()

# 로컬 이미지를 base64로 인코딩
def encode_image(image_path: str) -> str:
    with open(image_path, "rb") as f:
        return base64.b64encode(f.read()).decode("utf-8")

# 이미지 기반 코드 생성
image_base64 = encode_image("wireframe.png")

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "이 와이어프레임을 분석하고 React 컴포넌트로 구현해줘. "
                            "Tailwind CSS를 사용하고, 반응형으로 만들어줘."
                },
                {
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:image/png;base64,{image_base64}",
                        "detail": "high"  # low, high, auto
                    }
                }
            ]
        }
    ],
    max_tokens=2000
)

print(response.choices[0].message.content)
```

#### Vision API 활용 사례

| 용도 | 설명 | 프롬프트 예시 |
|------|------|-------------|
| **UI → 코드** | 디자인 스크린샷을 코드로 변환 | "이 디자인을 HTML/CSS로 구현해줘" |
| **에러 스크린샷** | 에러 화면을 캡처하여 디버깅 | "이 에러 메시지를 분석하고 해결책을 알려줘" |
| **다이어그램 분석** | 아키텍처 다이어그램 해석 | "이 시스템 아키텍처를 설명해줘" |
| **코드 이미지** | 이미지 속 코드를 추출·개선 | "이 코드를 타이핑하고 리팩토링해줘" |

### 임베딩 (Embeddings)

텍스트를 벡터로 변환하여 의미적 유사도를 계산합니다:

```python
from openai import OpenAI
import numpy as np

client = OpenAI()

def get_embedding(text: str, model: str = "text-embedding-3-small") -> list[float]:
    """텍스트를 벡터로 변환합니다."""
    response = client.embeddings.create(
        model=model,
        input=text
    )
    return response.data[0].embedding

def cosine_similarity(a: list[float], b: list[float]) -> float:
    """두 벡터의 코사인 유사도를 계산합니다."""
    a, b = np.array(a), np.array(b)
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

# 코드 검색 시스템 예시
code_snippets = [
    "def login(username, password): ...",
    "def create_user(email, name): ...",
    "def send_email(to, subject, body): ...",
    "def generate_report(start_date, end_date): ...",
]

# 각 코드 스니펫의 임베딩 생성
embeddings = [get_embedding(snippet) for snippet in code_snippets]

# 검색 쿼리
query = "사용자 인증 관련 함수"
query_embedding = get_embedding(query)

# 유사도 계산 및 정렬
similarities = [
    (i, cosine_similarity(query_embedding, emb))
    for i, emb in enumerate(embeddings)
]
similarities.sort(key=lambda x: x[1], reverse=True)

print("검색 결과:")
for idx, score in similarities:
    print(f"  [{score:.4f}] {code_snippets[idx][:50]}")
```

### Fine-tuning (모델 미세조정)

특정 도메인이나 코딩 스타일에 맞게 모델을 조정합니다:

```python
from openai import OpenAI

client = OpenAI()

# 1. 훈련 데이터 준비 (JSONL 형식)
training_data = """
{"messages": [{"role": "system", "content": "코드 리뷰어입니다."}, {"role": "user", "content": "이 함수를 리뷰해줘: def add(a,b): return a+b"}, {"role": "assistant", "content": "1. 타입 힌트 추가 필요\\n2. docstring 추가 권장\\n3. 입력 검증 없음"}]}
{"messages": [{"role": "system", "content": "코드 리뷰어입니다."}, {"role": "user", "content": "리뷰: class User: pass"}, {"role": "assistant", "content": "1. 빈 클래스 - 속성/메서드 구현 필요\\n2. __init__ 메서드 추가 권장\\n3. docstring 추가 권장"}]}
"""

# 2. 훈련 파일 업로드
with open("training_data.jsonl", "w") as f:
    f.write(training_data)

file = client.files.create(
    file=open("training_data.jsonl", "rb"),
    purpose="fine-tune"
)

# 3. Fine-tuning 작업 생성
job = client.fine_tuning.jobs.create(
    training_file=file.id,
    model="gpt-4o-mini-2024-07-18",  # 베이스 모델
    hyperparameters={
        "n_epochs": 3,
        "learning_rate_multiplier": 1.8,
        "batch_size": 1
    }
)

print(f"Fine-tuning 작업 ID: {job.id}")
print(f"상태: {job.status}")

# 4. 작업 상태 확인
status = client.fine_tuning.jobs.retrieve(job.id)
print(f"상태: {status.status}")
print(f"Fine-tuned 모델: {status.fine_tuned_model}")
```

### 비용 최적화 전략

| 전략 | 절감 효과 | 구현 방법 |
|------|----------|----------|
| **모델 계층화** | 30~70% | 간단한 작업은 mini/nano, 복잡한 작업만 고급 모델 |
| **캐싱** | 20~50% | 동일 요청 결과를 Redis 등에 캐시 |
| **프롬프트 최적화** | 10~30% | 불필요한 컨텍스트 제거, 간결한 시스템 프롬프트 |
| **배치 API** | 50% | 실시간 불필요한 작업은 Batch API 사용 (24시간 내 처리) |
| **Prompt Caching** | 25~50% | 긴 시스템 프롬프트 자동 캐싱 (1024 토큰 이상) |
| **스트리밍** | 간접 절감 | 사용자 체감 대기시간 감소, 불필요한 재요청 방지 |

```python
# 배치 API 사용 예시 (50% 비용 절감)
import json
from openai import OpenAI

client = OpenAI()

# 1. 배치 요청 파일 준비
requests = []
for i, code in enumerate(code_files):
    requests.append({
        "custom_id": f"review-{i}",
        "method": "POST",
        "url": "/v1/chat/completions",
        "body": {
            "model": "gpt-4o-mini",
            "messages": [
                {"role": "system", "content": "코드 리뷰를 수행합니다."},
                {"role": "user", "content": f"리뷰:\n```\n{code}\n```"}
            ],
            "max_tokens": 500
        }
    })

# JSONL 파일로 저장
with open("batch_requests.jsonl", "w") as f:
    for req in requests:
        f.write(json.dumps(req) + "\n")

# 2. 파일 업로드
batch_file = client.files.create(
    file=open("batch_requests.jsonl", "rb"),
    purpose="batch"
)

# 3. 배치 작업 생성
batch = client.batches.create(
    input_file_id=batch_file.id,
    endpoint="/v1/chat/completions",
    completion_window="24h"
)

print(f"배치 ID: {batch.id}")
print(f"상태: {batch.status}")
```

```python
# 스트리밍 응답 처리
from openai import OpenAI

client = OpenAI()

stream = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "user", "content": "React 컴포넌트를 작성해줘"}
    ],
    stream=True
)

collected_content = ""
for chunk in stream:
    if chunk.choices[0].delta.content is not None:
        content = chunk.choices[0].delta.content
        collected_content += content
        print(content, end="", flush=True)

print()  # 줄바꿈
```

### 체크포인트

- [ ] Function Calling으로 외부 함수를 연동하는 코드를 작성할 수 있다
- [ ] Structured Outputs로 JSON 스키마 기반 응답을 받을 수 있다
- [ ] Vision API로 이미지를 분석하고 코드를 생성할 수 있다
- [ ] 임베딩을 활용한 의미적 검색의 원리를 이해한다
- [ ] 비용 최적화 전략 3가지 이상을 설명할 수 있다

---

## 5. 개발 워크플로 통합

### 학습 목표

- IDE(VS Code/Cursor)에 OpenAI API를 통합할 수 있다
- CLI 도구를 만들어 터미널에서 AI를 활용할 수 있다
- Git Hook과 AI 리뷰를 연동할 수 있다
- 코드 생성 파이프라인을 구축할 수 있다

### IDE 플러그인 통합

#### VS Code + OpenAI 확장

VS Code에서 OpenAI API를 직접 활용하는 방법:

```json
// .vscode/settings.json
{
  "openai.apiKey": "${env:OPENAI_API_KEY}",
  "openai.defaultModel": "gpt-4o",
  "editor.inlineSuggest.enabled": true,
  "github.copilot.enable": {
    "*": true,
    "yaml": true,
    "plaintext": false,
    "markdown": false
  }
}
```

#### Cursor에서 OpenAI 모델 사용

Cursor IDE에서 OpenAI 모델을 직접 선택할 수 있습니다:

```
Cursor Settings → Models → 모델 목록에서:
- GPT-4o ✅
- o3 ✅
- o4-mini ✅
```

### CLI 도구 직접 제작

터미널에서 사용할 수 있는 AI 코딩 도우미 CLI를 만듭니다:

```python
#!/usr/bin/env python3
# ai_cli.py - AI 코딩 CLI 도구

import sys
import os
import argparse
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
client = OpenAI()

def review_code(file_path: str) -> str:
    """파일의 코드를 리뷰합니다."""
    with open(file_path) as f:
        code = f.read()

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": (
                    "코드 리뷰어입니다. 다음 관점에서 리뷰합니다:\n"
                    "1. 버그 및 잠재적 문제\n"
                    "2. 성능 최적화\n"
                    "3. 코드 가독성\n"
                    "4. 보안 취약점\n"
                    "한국어로 응답합니다."
                )
            },
            {"role": "user", "content": f"파일: {file_path}\n```\n{code}\n```"}
        ],
        temperature=0.3,
        max_tokens=1000
    )
    return response.choices[0].message.content

def generate_tests(file_path: str) -> str:
    """파일에 대한 테스트 코드를 생성합니다."""
    with open(file_path) as f:
        code = f.read()

    ext = os.path.splitext(file_path)[1]
    framework = "pytest" if ext == ".py" else "vitest"

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "system",
                "content": f"{framework}를 사용하여 유닛 테스트를 작성합니다."
            },
            {
                "role": "user",
                "content": f"다음 코드의 테스트를 작성해줘:\n```\n{code}\n```"
            }
        ],
        temperature=0.2,
        max_tokens=2000
    )
    return response.choices[0].message.content

def explain_code(file_path: str) -> str:
    """코드를 분석하고 설명합니다."""
    with open(file_path) as f:
        code = f.read()

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": "코드 분석가입니다. 코드의 구조, 흐름, 주요 로직을 한국어로 설명합니다."
            },
            {"role": "user", "content": f"```\n{code}\n```"}
        ],
        temperature=0.3,
        max_tokens=1500
    )
    return response.choices[0].message.content

def main():
    parser = argparse.ArgumentParser(description="AI 코딩 CLI 도구")
    subparsers = parser.add_subparsers(dest="command")

    # review 명령
    review_parser = subparsers.add_parser("review", help="코드 리뷰")
    review_parser.add_argument("file", help="리뷰할 파일 경로")

    # test 명령
    test_parser = subparsers.add_parser("test", help="테스트 코드 생성")
    test_parser.add_argument("file", help="테스트 대상 파일 경로")
    test_parser.add_argument("-o", "--output", help="출력 파일 경로")

    # explain 명령
    explain_parser = subparsers.add_parser("explain", help="코드 설명")
    explain_parser.add_argument("file", help="분석할 파일 경로")

    args = parser.parse_args()

    if args.command == "review":
        print(review_code(args.file))
    elif args.command == "test":
        result = generate_tests(args.file)
        if args.output:
            with open(args.output, "w") as f:
                f.write(result)
            print(f"테스트 코드 저장: {args.output}")
        else:
            print(result)
    elif args.command == "explain":
        print(explain_code(args.file))
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
```

사용 예시:

```bash
# 코드 리뷰
python ai_cli.py review src/auth.py

# 테스트 생성 → 파일로 저장
python ai_cli.py test src/auth.py -o tests/test_auth.py

# 코드 설명
python ai_cli.py explain src/complex_algorithm.py
```

### Git Hook + AI 리뷰

#### pre-commit Hook: 커밋 전 AI 리뷰

```bash
#!/bin/bash
# .git/hooks/pre-commit

echo "🔍 AI 코드 리뷰를 실행합니다..."

# 스테이징된 파일 목록 (Python/JS/TS만)
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACMR \
    | grep -E '\.(py|js|ts|jsx|tsx)$')

if [ -z "$STAGED_FILES" ]; then
    echo "리뷰할 파일이 없습니다."
    exit 0
fi

# 각 파일에 대해 AI 리뷰 실행
ISSUES_FOUND=0
for FILE in $STAGED_FILES; do
    echo "리뷰 중: $FILE"
    REVIEW=$(python ai_cli.py review "$FILE" 2>/dev/null)

    # "심각" 또는 "critical" 키워드가 있으면 경고
    if echo "$REVIEW" | grep -qi "심각\|critical\|보안.*취약"; then
        echo "⚠️  $FILE 에서 심각한 이슈가 발견되었습니다:"
        echo "$REVIEW"
        ISSUES_FOUND=1
    fi
done

if [ $ISSUES_FOUND -eq 1 ]; then
    echo ""
    echo "심각한 이슈가 발견되었습니다. 커밋을 계속하시겠습니까?"
    echo "강제 커밋: git commit --no-verify"
    exit 1
fi

echo "✅ AI 리뷰 통과"
exit 0
```

#### commit-msg Hook: 커밋 메시지 자동 생성

```bash
#!/bin/bash
# .git/hooks/commit-msg

COMMIT_MSG_FILE=$1
CURRENT_MSG=$(cat "$COMMIT_MSG_FILE")

# 커밋 메시지가 비어있거나 "wip"이면 AI가 생성
if [ -z "$CURRENT_MSG" ] || [ "$CURRENT_MSG" = "wip" ]; then
    echo "📝 AI가 커밋 메시지를 생성합니다..."

    DIFF=$(git diff --cached --stat)
    DIFF_CONTENT=$(git diff --cached | head -200)

    AI_MSG=$(python -c "
from openai import OpenAI
client = OpenAI()
response = client.chat.completions.create(
    model='gpt-4o-mini',
    messages=[
        {'role': 'system', 'content': 'Git 커밋 메시지를 생성합니다. Conventional Commits 형식으로, 한국어로 작성합니다. 제목은 50자 이내.'},
        {'role': 'user', 'content': '''변경 통계:\n$DIFF\n\n변경 내용:\n$DIFF_CONTENT'''}
    ],
    temperature=0.3,
    max_tokens=100
)
print(response.choices[0].message.content.strip())
" 2>/dev/null)

    if [ -n "$AI_MSG" ]; then
        echo "$AI_MSG" > "$COMMIT_MSG_FILE"
        echo "생성된 메시지: $AI_MSG"
    fi
fi
```

### 코드 생성 파이프라인

프로젝트에서 반복적인 코드를 AI로 자동 생성하는 파이프라인:

```python
# codegen.py - 코드 생성 파이프라인

import os
import json
from openai import OpenAI
from pathlib import Path

client = OpenAI()

def generate_api_route(spec: dict) -> str:
    """API 스펙에서 라우트 코드를 생성합니다."""
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "system",
                "content": (
                    "Next.js 14 App Router API 라우트를 생성합니다.\n"
                    "규칙:\n"
                    "- TypeScript 사용\n"
                    "- Zod로 입력 검증\n"
                    "- 에러 핸들링 포함\n"
                    "- JSDoc 주석 포함"
                )
            },
            {
                "role": "user",
                "content": f"API 스펙:\n```json\n{json.dumps(spec, indent=2)}\n```"
            }
        ],
        temperature=0.2,
        max_tokens=2000
    )
    return response.choices[0].message.content

def generate_component(spec: dict) -> str:
    """컴포넌트 스펙에서 React 컴포넌트를 생성합니다."""
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "system",
                "content": (
                    "React 컴포넌트를 생성합니다.\n"
                    "규칙:\n"
                    "- TypeScript + Tailwind CSS\n"
                    "- 함수형 컴포넌트\n"
                    "- Props 인터페이스 정의\n"
                    "- 접근성(a11y) 준수"
                )
            },
            {
                "role": "user",
                "content": f"컴포넌트 스펙:\n```json\n{json.dumps(spec, indent=2)}\n```"
            }
        ],
        temperature=0.2,
        max_tokens=2000
    )
    return response.choices[0].message.content

# 사용 예시: 스펙 파일에서 코드 생성
api_spec = {
    "path": "/api/users",
    "method": "GET",
    "description": "사용자 목록 조회 (페이지네이션)",
    "query_params": {
        "page": {"type": "number", "default": 1},
        "limit": {"type": "number", "default": 20},
        "search": {"type": "string", "optional": True}
    },
    "response": {
        "users": [{"id": "string", "name": "string", "email": "string"}],
        "total": "number",
        "page": "number"
    }
}

code = generate_api_route(api_spec)
output_path = Path("src/app/api/users/route.ts")
output_path.parent.mkdir(parents=True, exist_ok=True)
output_path.write_text(code)
print(f"생성 완료: {output_path}")
```

```bash
# Makefile에 코드 생성 명령 추가
# Makefile

.PHONY: codegen test lint

codegen:
	python codegen.py --spec specs/api.json --output src/app/api/
	python codegen.py --spec specs/components.json --output src/components/

test:
	pytest tests/ -v --cov=src/

lint:
	ruff check src/
	mypy src/

review:
	python ai_cli.py review src/

all: codegen lint test
```

### 체크포인트

- [ ] IDE에서 OpenAI 모델을 연동하여 사용할 수 있다
- [ ] CLI 도구를 작성하여 터미널에서 AI 코드 리뷰를 수행할 수 있다
- [ ] Git Hook으로 커밋 시 자동 AI 리뷰를 설정할 수 있다
- [ ] 코드 생성 파이프라인의 개념을 이해하고 활용할 수 있다

---

## 6. CI/CD 통합

### 학습 목표

- GitHub Actions에서 OpenAI API를 활용할 수 있다
- 자동 코드 리뷰 워크플로를 구축할 수 있다
- AI 기반 테스트 생성을 CI 파이프라인에 통합할 수 있다
- 배포 파이프라인에 AI 검증 단계를 추가할 수 있다

### GitHub Actions + OpenAI API

#### PR 자동 리뷰 워크플로

```yaml
# .github/workflows/ai-review.yml
name: AI Code Review

on:
  pull_request:
    types: [opened, synchronize]
    paths:
      - 'src/**'
      - 'tests/**'

permissions:
  contents: read
  pull-requests: write

jobs:
  ai-review:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.12'

      - name: Install dependencies
        run: pip install openai

      - name: Get changed files
        id: changed
        run: |
          FILES=$(git diff --name-only origin/${{ github.base_ref }}...HEAD \
              | grep -E '\.(py|js|ts|jsx|tsx)$' || true)
          echo "files=$FILES" >> $GITHUB_OUTPUT

      - name: AI Review
        if: steps.changed.outputs.files != ''
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
        run: |
          python << 'SCRIPT'
          import os
          from openai import OpenAI

          client = OpenAI()
          files = os.environ.get("CHANGED_FILES", "").split()

          reviews = []
          for file_path in files:
              if not os.path.exists(file_path):
                  continue
              with open(file_path) as f:
                  code = f.read()

              response = client.chat.completions.create(
                  model="gpt-4o-mini",
                  messages=[
                      {
                          "role": "system",
                          "content": (
                              "코드 리뷰어입니다. 변경된 코드를 검토합니다.\n"
                              "형식: 파일명, 이슈 목록, 전체 점수(1-10)\n"
                              "심각한 버그, 보안 이슈에 집중합니다.\n"
                              "한국어로 응답합니다."
                          )
                      },
                      {"role": "user", "content": f"파일: {file_path}\n```\n{code}\n```"}
                  ],
                  temperature=0.3,
                  max_tokens=800
              )
              reviews.append(f"### {file_path}\n{response.choices[0].message.content}")

          review_text = "\n\n".join(reviews)
          with open("review_output.md", "w") as f:
              f.write(review_text)
          SCRIPT
        env:
          CHANGED_FILES: ${{ steps.changed.outputs.files }}

      - name: Post Review Comment
        if: steps.changed.outputs.files != ''
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const review = fs.readFileSync('review_output.md', 'utf8');
            await github.rest.issues.createComment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: context.issue.number,
              body: `## 🤖 AI 코드 리뷰\n\n${review}\n\n---\n*Powered by OpenAI GPT-4o-mini*`
            });
```

#### 자동 테스트 생성 워크플로

```yaml
# .github/workflows/ai-tests.yml
name: AI Test Generation

on:
  workflow_dispatch:
    inputs:
      target_dir:
        description: '테스트 대상 디렉토리'
        required: true
        default: 'src/'
      min_coverage:
        description: '최소 커버리지 (%)'
        required: true
        default: '80'

jobs:
  generate-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.12'

      - name: Install dependencies
        run: |
          pip install openai pytest pytest-cov

      - name: Generate tests
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
        run: |
          python << 'SCRIPT'
          import os
          import glob
          from openai import OpenAI
          from pathlib import Path

          client = OpenAI()
          target_dir = "${{ github.event.inputs.target_dir }}"

          for py_file in glob.glob(f"{target_dir}/**/*.py", recursive=True):
              if "__pycache__" in py_file or "test_" in py_file:
                  continue

              with open(py_file) as f:
                  code = f.read()

              if len(code.strip()) < 50:
                  continue

              response = client.chat.completions.create(
                  model="gpt-4o",
                  messages=[
                      {
                          "role": "system",
                          "content": (
                              "pytest 테스트 코드를 생성합니다.\n"
                              "규칙:\n"
                              "- 경계값, 에러 케이스 포함\n"
                              "- fixture 활용\n"
                              "- mock 적절히 사용\n"
                              "- 파일 상단에 import 포함"
                          )
                      },
                      {
                          "role": "user",
                          "content": f"파일: {py_file}\n```python\n{code}\n```"
                      }
                  ],
                  temperature=0.2,
                  max_tokens=2000
              )

              test_content = response.choices[0].message.content
              # 코드 블록에서 실제 코드만 추출
              if "```python" in test_content:
                  test_content = test_content.split("```python")[1].split("```")[0]

              test_path = py_file.replace("src/", "tests/test_")
              Path(os.path.dirname(test_path)).mkdir(parents=True, exist_ok=True)

              with open(test_path, "w") as f:
                  f.write(test_content)

              print(f"생성: {test_path}")
          SCRIPT

      - name: Run tests
        run: |
          pytest tests/ -v --cov=src/ --cov-report=term-missing

      - name: Create PR with tests
        uses: peter-evans/create-pull-request@v6
        with:
          commit-message: "test: AI 생성 테스트 코드 추가"
          title: "[AI] 자동 생성된 테스트 코드"
          body: |
            ## AI가 생성한 테스트 코드

            - 대상 디렉토리: `${{ github.event.inputs.target_dir }}`
            - 최소 커버리지 목표: ${{ github.event.inputs.min_coverage }}%

            자동 생성된 테스트를 검토해주세요.
          branch: ai/auto-tests
```

#### 배포 전 AI 검증 워크플로

```yaml
# .github/workflows/deploy.yml
name: Deploy with AI Validation

on:
  push:
    branches: [main]

jobs:
  ai-validate:
    runs-on: ubuntu-latest
    outputs:
      is_safe: ${{ steps.validate.outputs.is_safe }}
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 2

      - name: AI 배포 검증
        id: validate
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
        run: |
          DIFF=$(git diff HEAD~1 HEAD -- src/ | head -500)

          python3 << SCRIPT
          from openai import OpenAI
          import json

          client = OpenAI()
          response = client.chat.completions.create(
              model="gpt-4o-mini",
              messages=[
                  {
                      "role": "system",
                      "content": (
                          "배포 검증 시스템입니다. 코드 변경사항을 분석합니다.\n"
                          "JSON으로 응답: {\"safe\": true/false, \"reason\": \"...\"}"
                      )
                  },
                  {"role": "user", "content": f"변경사항:\n{'''$DIFF'''}"}
              ],
              temperature=0.1,
              max_tokens=200
          )

          result = json.loads(response.choices[0].message.content)
          print(f"안전 여부: {result['safe']}")
          print(f"이유: {result['reason']}")

          with open("validation.json", "w") as f:
              json.dump(result, f)
          SCRIPT

          IS_SAFE=$(python3 -c "import json; print(json.load(open('validation.json'))['safe'])")
          echo "is_safe=$IS_SAFE" >> $GITHUB_OUTPUT

  deploy:
    needs: ai-validate
    if: needs.ai-validate.outputs.is_safe == 'True'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy
        run: |
          echo "배포를 진행합니다..."
          # 실제 배포 스크립트
```

### 체크포인트

- [ ] GitHub Actions에서 OpenAI API를 사용하는 워크플로를 작성할 수 있다
- [ ] PR 자동 리뷰 워크플로의 동작 방식을 이해한다
- [ ] AI 테스트 생성을 CI에 통합하는 방법을 알고 있다
- [ ] 배포 파이프라인에 AI 검증 단계를 추가할 수 있다

---

## 7. 프로덕션 배포

### 학습 목표

- OpenAI API 기반 서비스를 프로덕션 환경에 배포할 수 있다
- 레이트 리밋과 에러 핸들링을 올바르게 구현할 수 있다
- 모니터링과 로깅 시스템을 구축할 수 있다
- Docker 컨테이너로 서비스를 패키징할 수 있다

### API 기반 서비스 아키텍처

```
┌──────────────────────────────────────────────────┐
│                    클라이언트                      │
│       (React / Next.js / 모바일 앱)               │
└────────────────────┬─────────────────────────────┘
                     │ HTTPS
┌────────────────────▼─────────────────────────────┐
│               API Gateway / Proxy                 │
│         (Nginx / CloudFlare / Vercel)             │
│   - Rate Limiting  - CORS  - Auth Verification    │
└────────────────────┬─────────────────────────────┘
                     │
┌────────────────────▼─────────────────────────────┐
│              백엔드 서버 (FastAPI / Express)       │
│   ┌─────────────┐  ┌──────────────┐              │
│   │ 프롬프트 관리 │  │  캐시 레이어  │              │
│   │  (템플릿)    │  │  (Redis)     │              │
│   └──────┬──────┘  └──────┬───────┘              │
│          │                │                       │
│   ┌──────▼────────────────▼───────┐              │
│   │       OpenAI API 클라이언트     │              │
│   │   - 재시도 로직                 │              │
│   │   - 에러 핸들링                 │              │
│   │   - 사용량 추적                 │              │
│   └──────────────┬────────────────┘              │
└──────────────────┼────────────────────────────────┘
                   │
┌──────────────────▼────────────────────────────────┐
│                OpenAI API                          │
│    (GPT-4o / GPT-4.1 / o3 / Embeddings)           │
└───────────────────────────────────────────────────┘
```

### FastAPI 프로덕션 서버

```python
# main.py - FastAPI 프로덕션 서버
from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from openai import OpenAI, APIError, RateLimitError, APIConnectionError
from functools import lru_cache
import redis
import hashlib
import json
import logging
import time
from contextlib import asynccontextmanager

# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Redis 캐시
cache = redis.Redis(host="localhost", port=6379, db=0, decode_responses=True)

# OpenAI 클라이언트
client = OpenAI()

app = FastAPI(title="AI Service API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourdomain.com"],
    allow_methods=["POST"],
    allow_headers=["*"],
)

# --- 모델 ---

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=5000)
    model: str = Field(default="gpt-4o-mini")
    temperature: float = Field(default=0.7, ge=0.0, le=2.0)
    max_tokens: int = Field(default=1000, ge=1, le=4000)

class ChatResponse(BaseModel):
    content: str
    model: str
    usage: dict
    cached: bool = False

# --- 유틸리티 ---

def get_cache_key(request: ChatRequest) -> str:
    """요청에 대한 캐시 키를 생성합니다."""
    data = f"{request.model}:{request.message}:{request.temperature}"
    return f"chat:{hashlib.md5(data.encode()).hexdigest()}"

def call_openai_with_retry(
    request: ChatRequest,
    max_retries: int = 3
) -> ChatResponse:
    """재시도 로직이 포함된 OpenAI API 호출"""
    for attempt in range(max_retries):
        try:
            response = client.chat.completions.create(
                model=request.model,
                messages=[
                    {"role": "system", "content": "유용한 한국어 AI 비서입니다."},
                    {"role": "user", "content": request.message}
                ],
                temperature=request.temperature,
                max_tokens=request.max_tokens
            )

            return ChatResponse(
                content=response.choices[0].message.content,
                model=response.model,
                usage={
                    "prompt_tokens": response.usage.prompt_tokens,
                    "completion_tokens": response.usage.completion_tokens,
                    "total_tokens": response.usage.total_tokens,
                }
            )

        except RateLimitError:
            wait_time = 2 ** attempt  # 지수 백오프
            logger.warning(f"Rate limit 도달. {wait_time}초 대기 (시도 {attempt + 1})")
            time.sleep(wait_time)

        except APIConnectionError:
            logger.error(f"API 연결 오류 (시도 {attempt + 1})")
            if attempt == max_retries - 1:
                raise HTTPException(status_code=502, detail="AI 서비스 연결 실패")
            time.sleep(1)

        except APIError as e:
            logger.error(f"API 오류: {e.status_code} - {e.message}")
            raise HTTPException(
                status_code=e.status_code or 500,
                detail=f"AI 서비스 오류: {e.message}"
            )

    raise HTTPException(status_code=429, detail="요청 한도 초과. 잠시 후 다시 시도하세요.")

# --- 엔드포인트 ---

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """AI 채팅 엔드포인트"""
    # 1. 캐시 확인
    cache_key = get_cache_key(request)
    cached = cache.get(cache_key)
    if cached:
        result = ChatResponse(**json.loads(cached))
        result.cached = True
        logger.info(f"캐시 히트: {cache_key}")
        return result

    # 2. API 호출
    start_time = time.time()
    result = call_openai_with_retry(request)
    elapsed = time.time() - start_time

    # 3. 캐시 저장 (TTL: 1시간)
    cache.setex(cache_key, 3600, json.dumps(result.model_dump()))

    # 4. 메트릭 기록
    logger.info(
        f"API 호출 완료: model={result.model}, "
        f"tokens={result.usage['total_tokens']}, "
        f"elapsed={elapsed:.2f}s"
    )

    return result

@app.get("/health")
async def health_check():
    """헬스 체크"""
    return {"status": "healthy", "timestamp": time.time()}
```

### Express.js 프로덕션 서버

```javascript
// server.js - Express 프로덕션 서버
import express from 'express';
import OpenAI from 'openai';
import Redis from 'ioredis';
import crypto from 'crypto';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import 'dotenv/config';

const app = express();
const openai = new OpenAI();
const redis = new Redis(process.env.REDIS_URL);

// 보안 미들웨어
app.use(helmet());
app.use(express.json({ limit: '10kb' }));

// Rate Limiting (서버 자체)
const limiter = rateLimit({
  windowMs: 60 * 1000,   // 1분
  max: 30,               // 분당 30회
  message: { error: '요청 한도 초과. 1분 후 다시 시도하세요.' }
});
app.use('/api/', limiter);

// 캐시 키 생성
function getCacheKey(model, message, temp) {
  const data = `${model}:${message}:${temp}`;
  return `chat:${crypto.createHash('md5').update(data).digest('hex')}`;
}

// 재시도 로직
async function callWithRetry(params, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await openai.chat.completions.create(params);
    } catch (error) {
      if (error.status === 429) {
        const waitTime = Math.pow(2, attempt) * 1000;
        console.warn(`Rate limit. ${waitTime}ms 대기 (${attempt + 1}/${maxRetries})`);
        await new Promise(r => setTimeout(r, waitTime));
        continue;
      }
      throw error;
    }
  }
  throw new Error('최대 재시도 횟수 초과');
}

// 채팅 엔드포인트
app.post('/api/chat', async (req, res) => {
  try {
    const { message, model = 'gpt-4o-mini', temperature = 0.7, max_tokens = 1000 } = req.body;

    if (!message || message.length > 5000) {
      return res.status(400).json({ error: '메시지는 1~5000자여야 합니다.' });
    }

    // 캐시 확인
    const cacheKey = getCacheKey(model, message, temperature);
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json({ ...JSON.parse(cached), cached: true });
    }

    // API 호출
    const startTime = Date.now();
    const response = await callWithRetry({
      model,
      messages: [
        { role: 'system', content: '유용한 한국어 AI 비서입니다.' },
        { role: 'user', content: message }
      ],
      temperature,
      max_tokens
    });

    const result = {
      content: response.choices[0].message.content,
      model: response.model,
      usage: response.usage,
      cached: false
    };

    // 캐시 저장 (1시간)
    await redis.setex(cacheKey, 3600, JSON.stringify(result));

    console.log(`API 호출: ${Date.now() - startTime}ms, ${response.usage.total_tokens} tokens`);
    res.json(result);

  } catch (error) {
    console.error('Chat error:', error.message);
    res.status(error.status || 500).json({
      error: error.message || '서버 오류가 발생했습니다.'
    });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: Date.now() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

### Docker 컨테이너 구성

```dockerfile
# Dockerfile
FROM python:3.12-slim

WORKDIR /app

# 의존성 설치
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 소스 코드 복사
COPY src/ ./src/
COPY main.py .

# 보안: 비-root 사용자 실행
RUN useradd -m appuser
USER appuser

# 포트 노출
EXPOSE 8000

# 헬스체크
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# 실행
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "8000:8000"
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - REDIS_URL=redis://redis:6379
    depends_on:
      - redis
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '1.0'

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./certs:/etc/nginx/certs:ro
    depends_on:
      - api
    restart: unless-stopped

volumes:
  redis_data:
```

### 모니터링 설정

```python
# monitoring.py - 사용량 모니터링

import time
from datetime import datetime, timedelta
from collections import defaultdict
from dataclasses import dataclass, field

@dataclass
class APIMetrics:
    """API 사용량 메트릭"""
    total_requests: int = 0
    total_tokens: int = 0
    total_cost: float = 0.0
    errors: int = 0
    cache_hits: int = 0
    avg_latency: float = 0.0
    requests_by_model: dict = field(default_factory=lambda: defaultdict(int))
    tokens_by_model: dict = field(default_factory=lambda: defaultdict(int))

class APIMonitor:
    """OpenAI API 사용량 모니터링"""

    def __init__(self, daily_budget: float = 50.0):
        self.daily_budget = daily_budget
        self.metrics = APIMetrics()
        self.daily_reset = datetime.now().replace(hour=0, minute=0, second=0)
        self.latencies = []

    def record_request(
        self,
        model: str,
        input_tokens: int,
        output_tokens: int,
        latency: float,
        cached: bool = False
    ):
        """API 요청을 기록합니다."""
        self.metrics.total_requests += 1
        self.metrics.total_tokens += input_tokens + output_tokens
        self.metrics.requests_by_model[model] += 1
        self.metrics.tokens_by_model[model] += input_tokens + output_tokens

        if cached:
            self.metrics.cache_hits += 1

        # 비용 계산
        cost = self._calculate_cost(model, input_tokens, output_tokens)
        self.metrics.total_cost += cost

        # 지연 시간
        self.latencies.append(latency)
        self.metrics.avg_latency = sum(self.latencies) / len(self.latencies)

        # 예산 경고
        if self.metrics.total_cost > self.daily_budget * 0.8:
            print(f"[경고] 일일 예산의 80% 도달: ${self.metrics.total_cost:.2f}/{self.daily_budget}")

        if self.metrics.total_cost > self.daily_budget:
            print(f"[위험] 일일 예산 초과: ${self.metrics.total_cost:.2f}/{self.daily_budget}")

    def record_error(self, error_type: str):
        """API 에러를 기록합니다."""
        self.metrics.errors += 1

    def get_report(self) -> str:
        """현재 메트릭 리포트를 반환합니다."""
        m = self.metrics
        cache_rate = (m.cache_hits / m.total_requests * 100) if m.total_requests > 0 else 0

        report = f"""
=== API 사용량 리포트 ===
총 요청 수: {m.total_requests}
총 토큰 수: {m.total_tokens:,}
총 비용: ${m.total_cost:.4f}
에러 수: {m.errors}
캐시 히트율: {cache_rate:.1f}%
평균 지연 시간: {m.avg_latency:.2f}s

--- 모델별 사용량 ---"""
        for model, count in m.requests_by_model.items():
            tokens = m.tokens_by_model[model]
            report += f"\n  {model}: {count}건, {tokens:,} 토큰"

        return report

    def _calculate_cost(self, model, input_tokens, output_tokens):
        pricing = {
            "gpt-4o":       {"input": 2.50, "output": 10.00},
            "gpt-4o-mini":  {"input": 0.15, "output": 0.60},
            "gpt-4.1":      {"input": 2.00, "output": 8.00},
        }
        rate = pricing.get(model, pricing["gpt-4o-mini"])
        return (input_tokens / 1_000_000 * rate["input"] +
                output_tokens / 1_000_000 * rate["output"])

# 사용 예시
monitor = APIMonitor(daily_budget=50.0)
# API 호출 후:
# monitor.record_request("gpt-4o-mini", 150, 300, 0.8)
# print(monitor.get_report())
```

### 체크포인트

- [ ] FastAPI 또는 Express로 API 서비스를 구축할 수 있다
- [ ] 레이트 리밋과 지수 백오프 재시도 로직을 구현할 수 있다
- [ ] Docker로 서비스를 컨테이너화할 수 있다
- [ ] 사용량 모니터링 시스템의 구조를 이해한다

---

## 8. GPTs/Actions 심화

### 학습 목표

- GPTs를 생성하고 커스터마이징할 수 있다
- Actions를 통해 외부 API를 GPTs에 연동할 수 있다
- OAuth 설정으로 인증이 필요한 API를 연동할 수 있다
- 커스텀 GPTs를 팀 내에 배포할 수 있다

### GPTs 아키텍처

GPTs는 ChatGPT를 커스터마이징한 버전입니다. Instructions(시스템 프롬프트), Knowledge(파일 업로드), Actions(외부 API 연동)로 구성됩니다.

```
┌─────────────────────────────────────────────┐
│                 GPTs 구조                    │
│                                             │
│  ┌──────────────────────────────────┐       │
│  │  Instructions (시스템 프롬프트)    │       │
│  │  - 역할 정의                      │       │
│  │  - 응답 규칙                      │       │
│  │  - 출력 형식                      │       │
│  └──────────────────────────────────┘       │
│                                             │
│  ┌──────────────────────────────────┐       │
│  │  Knowledge (지식 베이스)           │       │
│  │  - PDF, DOCX, TXT 파일            │       │
│  │  - CSV, JSON 데이터               │       │
│  │  - 코드 파일                      │       │
│  └──────────────────────────────────┘       │
│                                             │
│  ┌──────────────────────────────────┐       │
│  │  Actions (외부 API 연동)           │       │
│  │  - OpenAPI 스키마                  │       │
│  │  - OAuth 인증                     │       │
│  │  - Webhook                        │       │
│  └──────────────────────────────────┘       │
│                                             │
│  ┌──────────────────────────────────┐       │
│  │  Capabilities (내장 기능)          │       │
│  │  - Web Browsing                   │       │
│  │  - DALL-E 이미지 생성              │       │
│  │  - Code Interpreter               │       │
│  └──────────────────────────────────┘       │
└─────────────────────────────────────────────┘
```

### Actions: 외부 API 연동

Actions는 OpenAPI 스키마를 기반으로 GPTs가 외부 API를 호출할 수 있게 합니다:

```yaml
# openapi-schema.yaml - GPTs Actions용 OpenAPI 스키마

openapi: 3.1.0
info:
  title: Project Management API
  description: 프로젝트 관리 도구 API
  version: 1.0.0
servers:
  - url: https://api.yourservice.com/v1

paths:
  /tasks:
    get:
      operationId: listTasks
      summary: 프로젝트 작업 목록을 조회합니다
      parameters:
        - name: status
          in: query
          schema:
            type: string
            enum: [todo, in_progress, done]
          description: 작업 상태 필터
        - name: assignee
          in: query
          schema:
            type: string
          description: 담당자 이메일
      responses:
        '200':
          description: 작업 목록
          content:
            application/json:
              schema:
                type: object
                properties:
                  tasks:
                    type: array
                    items:
                      $ref: '#/components/schemas/Task'
                  total:
                    type: integer

    post:
      operationId: createTask
      summary: 새 작업을 생성합니다
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [title]
              properties:
                title:
                  type: string
                  description: 작업 제목
                description:
                  type: string
                  description: 작업 설명
                assignee:
                  type: string
                  description: 담당자 이메일
                priority:
                  type: string
                  enum: [low, medium, high, urgent]
                due_date:
                  type: string
                  format: date
      responses:
        '201':
          description: 생성된 작업
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Task'

  /tasks/{taskId}:
    patch:
      operationId: updateTask
      summary: 작업을 업데이트합니다
      parameters:
        - name: taskId
          in: path
          required: true
          schema:
            type: string
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                status:
                  type: string
                  enum: [todo, in_progress, done]
                title:
                  type: string
                priority:
                  type: string
                  enum: [low, medium, high, urgent]
      responses:
        '200':
          description: 업데이트된 작업

components:
  schemas:
    Task:
      type: object
      properties:
        id:
          type: string
        title:
          type: string
        description:
          type: string
        status:
          type: string
        assignee:
          type: string
        priority:
          type: string
        due_date:
          type: string
        created_at:
          type: string
```

### OAuth 설정

인증이 필요한 API를 GPTs에 연동할 때 OAuth 2.0을 설정합니다:

```json
{
  "type": "oauth",
  "client_url": "https://auth.yourservice.com/authorize",
  "authorization_url": "https://auth.yourservice.com/token",
  "scope": "read write",
  "token_exchange_method": "basic_auth_header",
  "client_id": "your_client_id",
  "client_secret": "your_client_secret"
}
```

#### OAuth 플로우

```
1. 사용자가 GPTs에서 Action 실행 요청
2. GPTs가 OAuth 인증 화면으로 리디렉트
3. 사용자가 서비스에 로그인하고 권한 승인
4. 콜백 URL로 authorization code 수신
5. GPTs가 code를 access token으로 교환
6. access token으로 API 호출
```

### Actions용 백엔드 서버 구현

```python
# actions_server.py - GPTs Actions 백엔드

from fastapi import FastAPI, Header, HTTPException
from pydantic import BaseModel
from typing import Optional
import jwt

app = FastAPI()

# JWT 검증
def verify_token(authorization: str = Header()):
    """Bearer 토큰을 검증합니다."""
    try:
        token = authorization.replace("Bearer ", "")
        payload = jwt.decode(token, "your-secret", algorithms=["HS256"])
        return payload
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="유효하지 않은 토큰")

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    assignee: Optional[str] = None
    priority: str = "medium"
    due_date: Optional[str] = None

@app.get("/v1/tasks")
async def list_tasks(
    status: Optional[str] = None,
    assignee: Optional[str] = None,
    user=Depends(verify_token)
):
    """작업 목록 조회"""
    # DB에서 작업 조회 (예시)
    tasks = [
        {"id": "1", "title": "API 개발", "status": "in_progress", "priority": "high"},
        {"id": "2", "title": "테스트 작성", "status": "todo", "priority": "medium"},
    ]

    if status:
        tasks = [t for t in tasks if t["status"] == status]

    return {"tasks": tasks, "total": len(tasks)}

@app.post("/v1/tasks", status_code=201)
async def create_task(task: TaskCreate, user=Depends(verify_token)):
    """새 작업 생성"""
    new_task = {
        "id": "3",
        "title": task.title,
        "description": task.description,
        "status": "todo",
        "assignee": task.assignee,
        "priority": task.priority,
        "due_date": task.due_date,
        "created_at": "2026-03-09T00:00:00Z"
    }
    return new_task
```

### GPTs Instructions 작성 가이드

```markdown
# Instructions 예시: 프로젝트 관리 GPT

## 역할
당신은 프로젝트 관리 비서입니다. 사용자의 작업을 관리하고,
진행 상황을 추적하며, 우선순위를 제안합니다.

## 응답 규칙
1. 한국어로 응답합니다
2. 작업 목록은 테이블 형식으로 보여줍니다
3. 우선순위가 높은 작업을 먼저 안내합니다
4. 마감일이 가까운 작업에 대해 알림을 줍니다

## Actions 사용 규칙
- 작업 조회 시 listTasks를 사용합니다
- 새 작업 생성 시 createTask를 사용합니다
- 상태 변경 시 updateTask를 사용합니다
- 사용자 확인 없이 작업을 삭제하지 않습니다

## 출력 형식
작업 목록을 보여줄 때:
| # | 제목 | 상태 | 우선순위 | 마감일 |
|---|------|------|---------|-------|
| 1 | ... | ... | ... | ... |
```

### 체크포인트

- [ ] GPTs의 구성 요소(Instructions, Knowledge, Actions)를 이해한다
- [ ] OpenAPI 스키마를 작성하여 Actions를 설정할 수 있다
- [ ] OAuth 플로우를 이해하고 설정할 수 있다
- [ ] Actions용 백엔드 API를 구현할 수 있다

---

## 9. 마이그레이션

### 학습 목표

- ChatGPT/Codex 프로젝트를 다른 AI 도구로 이전할 수 있다
- 다른 AI 도구에서 ChatGPT/Codex로 이전할 수 있다
- 멀티 AI 전략을 수립하여 도구별 강점을 활용할 수 있다
- 프롬프트와 설정을 도구 간에 변환할 수 있다

### 도구 간 비교표

| 항목 | ChatGPT/Codex | Claude Code | Cursor | Lovable |
|------|--------------|-------------|--------|---------|
| **유형** | 웹 에이전트 + API | CLI 에이전트 | GUI IDE | 웹 빌더 |
| **코드 실행** | 클라우드 샌드박스 | 로컬 터미널 | 로컬 터미널 | 클라우드 |
| **모델** | GPT-4o/4.1/o3 | Claude Sonnet/Opus | 멀티 모델 | Claude |
| **GitHub 연동** | Codex 직접 연동 | Git 네이티브 | GitHub Extension | 내장 |
| **설정 파일** | AGENTS.md | CLAUDE.md | .cursor/rules | 없음 |
| **API 제공** | OpenAI API | Anthropic API | 없음 | 없음 |
| **비용** | Plus $20/월, API 종량제 | Max $100/월 | Pro $20/월 | Free~$20/월 |

### ChatGPT → Claude Code 마이그레이션

#### 프롬프트 변환

ChatGPT와 Claude는 프롬프트 스타일이 다릅니다:

```markdown
# ChatGPT 스타일 프롬프트 (AGENTS.md)
You are a senior TypeScript developer.
Follow these rules:
- Use strict TypeScript
- Write unit tests for all functions
- Use ESLint with airbnb config
- Prefer functional programming patterns
```

```markdown
# Claude Code 스타일 프롬프트 (CLAUDE.md)
## 프로젝트 규칙

### 코딩 규칙
- TypeScript strict mode 필수
- 모든 public 함수에 유닛 테스트 작성
- ESLint airbnb 설정 사용
- 함수형 프로그래밍 패턴 선호

### 금지 사항
- any 타입 사용 금지
- console.log 직접 사용 금지

### 커밋 규칙
- Conventional Commits 형식
- 한국어 커밋 메시지
```

#### API 클라이언트 변환

```python
# OpenAI → Anthropic API 변환

# --- OpenAI (변환 전) ---
from openai import OpenAI

openai_client = OpenAI()
response = openai_client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": "코드 리뷰어입니다."},
        {"role": "user", "content": "이 코드를 리뷰해줘: ..."}
    ],
    temperature=0.3,
    max_tokens=1000
)
result = response.choices[0].message.content

# --- Anthropic (변환 후) ---
from anthropic import Anthropic

anthropic_client = Anthropic()
response = anthropic_client.messages.create(
    model="claude-sonnet-4-20250514",
    system="코드 리뷰어입니다.",
    messages=[
        {"role": "user", "content": "이 코드를 리뷰해줘: ..."}
    ],
    temperature=0.3,
    max_tokens=1000
)
result = response.content[0].text
```

### ChatGPT → Cursor 마이그레이션

```markdown
# AGENTS.md → .cursor/rules/project.mdc 변환

---
description: 프로젝트 전역 규칙
globs: ["**/*"]
alwaysApply: true
---

## 코딩 규칙
- TypeScript strict mode 필수
- 함수형 프로그래밍 패턴 선호
- 모든 함수에 JSDoc 주석

## 테스트
- Vitest 사용
- 커버리지 80% 이상
```

### 멀티 AI 전략

여러 AI 도구를 조합하여 각각의 강점을 활용합니다:

| 작업 | 추천 도구 | 이유 |
|------|----------|------|
| 빠른 프로토타이핑 | Lovable | 대화로 즉시 웹앱 생성 |
| 대규모 리팩토링 | Codex (Full Auto) | 클라우드에서 병렬 실행, PR 자동 생성 |
| 실시간 코드 편집 | Cursor | 인라인 자동완성 + Agent |
| CI/CD 자동화 | Claude Code | CLI 기반 스크립트 통합 |
| API 서비스 개발 | ChatGPT + API | 프로토타이핑 → 프로덕션 |
| 코드 리뷰 | GPTs Actions | 팀 전체 자동 리뷰 |

```python
# multi_ai_client.py - 멀티 AI 클라이언트

from openai import OpenAI
from anthropic import Anthropic
from enum import Enum

class AIProvider(Enum):
    OPENAI = "openai"
    ANTHROPIC = "anthropic"

class MultiAIClient:
    """여러 AI 제공자를 통합하는 클라이언트"""

    def __init__(self):
        self.openai = OpenAI()
        self.anthropic = Anthropic()

    def chat(
        self,
        message: str,
        provider: AIProvider = AIProvider.OPENAI,
        system: str = "",
        **kwargs
    ) -> str:
        if provider == AIProvider.OPENAI:
            return self._openai_chat(message, system, **kwargs)
        elif provider == AIProvider.ANTHROPIC:
            return self._anthropic_chat(message, system, **kwargs)

    def _openai_chat(self, message, system, **kwargs):
        messages = []
        if system:
            messages.append({"role": "system", "content": system})
        messages.append({"role": "user", "content": message})

        response = self.openai.chat.completions.create(
            model=kwargs.get("model", "gpt-4o-mini"),
            messages=messages,
            temperature=kwargs.get("temperature", 0.7),
            max_tokens=kwargs.get("max_tokens", 1000)
        )
        return response.choices[0].message.content

    def _anthropic_chat(self, message, system, **kwargs):
        response = self.anthropic.messages.create(
            model=kwargs.get("model", "claude-sonnet-4-20250514"),
            system=system,
            messages=[{"role": "user", "content": message}],
            temperature=kwargs.get("temperature", 0.7),
            max_tokens=kwargs.get("max_tokens", 1000)
        )
        return response.content[0].text

    def compare(self, message: str, system: str = "") -> dict:
        """동일한 프롬프트로 두 AI의 응답을 비교합니다."""
        return {
            "openai": self.chat(message, AIProvider.OPENAI, system),
            "anthropic": self.chat(message, AIProvider.ANTHROPIC, system),
        }

# 사용 예시
client = MultiAIClient()

# 단일 호출
result = client.chat("이 코드를 리뷰해줘", provider=AIProvider.OPENAI)

# 비교 호출
comparison = client.compare("Python으로 퀵소트를 구현해줘")
print("=== OpenAI ===")
print(comparison["openai"])
print("=== Anthropic ===")
print(comparison["anthropic"])
```

### 마이그레이션 체크리스트

#### ChatGPT/Codex → Claude Code

- [ ] AGENTS.md 내용을 CLAUDE.md로 변환
- [ ] OpenAI API 호출을 Anthropic API로 변환
- [ ] Function Calling → Tool Use 변환
- [ ] GitHub Codex 연동 → Claude Code Git 네이티브 연동
- [ ] 프롬프트 스타일 조정 (Claude는 더 구조화된 지시를 선호)

#### ChatGPT/Codex → Cursor

- [ ] AGENTS.md → .cursor/rules/*.mdc 변환
- [ ] Codex 작업 → Cursor Agent 프롬프트로 변환
- [ ] 모델 설정 (Cursor에서 GPT-4o 등 OpenAI 모델 선택 가능)
- [ ] GitHub 연동 설정

### 체크포인트

- [ ] ChatGPT와 Claude Code의 프롬프트 스타일 차이를 이해한다
- [ ] API 클라이언트를 다른 AI 제공자로 변환할 수 있다
- [ ] 멀티 AI 전략을 수립하고 구현할 수 있다
- [ ] 마이그레이션 체크리스트를 활용하여 이전을 수행할 수 있다

---

## 10. 디버깅 가이드

### 학습 목표

- OpenAI API 에러 코드를 해석하고 해결할 수 있다
- 토큰 관련 문제를 진단하고 대처할 수 있다
- 레이트 리밋 문제를 체계적으로 관리할 수 있다
- Codex 에이전트 오류를 디버깅할 수 있다

### API 에러 코드 레퍼런스

| HTTP 상태 | 에러 코드 | 원인 | 해결 방법 |
|-----------|----------|------|----------|
| **400** | `invalid_request_error` | 잘못된 요청 파라미터 | 요청 본문, 파라미터 타입 확인 |
| **401** | `authentication_error` | 잘못된 API 키 | API 키 재발급, 환경변수 확인 |
| **403** | `permission_error` | 권한 부족 | Organization/Project 권한 확인 |
| **404** | `not_found_error` | 존재하지 않는 모델/리소스 | 모델명, 엔드포인트 URL 확인 |
| **429** | `rate_limit_error` | 요청 한도 초과 | 지수 백오프 재시도, Tier 업그레이드 |
| **500** | `server_error` | OpenAI 서버 오류 | 재시도, OpenAI 상태 페이지 확인 |
| **503** | `service_unavailable` | 서비스 과부하 | 잠시 대기 후 재시도 |

### 에러 핸들링 패턴

```python
# error_handler.py - 체계적인 에러 핸들링

from openai import (
    OpenAI,
    APIError,
    APIConnectionError,
    RateLimitError,
    AuthenticationError,
    BadRequestError,
    NotFoundError,
    PermissionDeniedError
)
import time
import logging

logger = logging.getLogger(__name__)

class OpenAIErrorHandler:
    """OpenAI API 에러를 체계적으로 처리합니다."""

    def __init__(self, client: OpenAI, max_retries: int = 3):
        self.client = client
        self.max_retries = max_retries

    def safe_call(self, **kwargs) -> dict:
        """안전한 API 호출 (재시도 + 에러 핸들링)"""
        last_error = None

        for attempt in range(self.max_retries):
            try:
                response = self.client.chat.completions.create(**kwargs)
                return {
                    "success": True,
                    "content": response.choices[0].message.content,
                    "usage": response.usage,
                    "attempt": attempt + 1
                }

            except AuthenticationError as e:
                # 재시도 불필요 - 즉시 실패
                logger.error(f"인증 오류: {e.message}")
                return {
                    "success": False,
                    "error": "API 키가 유효하지 않습니다. 키를 확인하세요.",
                    "error_type": "auth",
                    "recoverable": False
                }

            except PermissionDeniedError as e:
                logger.error(f"권한 오류: {e.message}")
                return {
                    "success": False,
                    "error": "이 모델/기능에 대한 접근 권한이 없습니다.",
                    "error_type": "permission",
                    "recoverable": False
                }

            except BadRequestError as e:
                logger.error(f"요청 오류: {e.message}")
                # 컨텍스트 길이 초과인 경우
                if "context_length" in str(e.message).lower():
                    return {
                        "success": False,
                        "error": "입력이 모델의 컨텍스트 한도를 초과했습니다.",
                        "error_type": "context_overflow",
                        "recoverable": True,
                        "suggestion": "입력을 줄이거나 더 큰 컨텍스트 모델을 사용하세요."
                    }
                return {
                    "success": False,
                    "error": f"잘못된 요청: {e.message}",
                    "error_type": "bad_request",
                    "recoverable": False
                }

            except NotFoundError as e:
                logger.error(f"리소스 없음: {e.message}")
                return {
                    "success": False,
                    "error": f"모델 또는 리소스를 찾을 수 없습니다: {e.message}",
                    "error_type": "not_found",
                    "recoverable": False
                }

            except RateLimitError as e:
                wait_time = min(2 ** attempt * 2, 60)  # 최대 60초
                logger.warning(
                    f"Rate limit (시도 {attempt + 1}/{self.max_retries}). "
                    f"{wait_time}초 대기"
                )
                last_error = e
                time.sleep(wait_time)

            except APIConnectionError as e:
                wait_time = 2 ** attempt
                logger.warning(
                    f"연결 오류 (시도 {attempt + 1}/{self.max_retries}). "
                    f"{wait_time}초 대기"
                )
                last_error = e
                time.sleep(wait_time)

            except APIError as e:
                if e.status_code and e.status_code >= 500:
                    wait_time = 2 ** attempt
                    logger.warning(
                        f"서버 오류 {e.status_code} "
                        f"(시도 {attempt + 1}/{self.max_retries})"
                    )
                    last_error = e
                    time.sleep(wait_time)
                else:
                    return {
                        "success": False,
                        "error": f"API 오류: {e.message}",
                        "error_type": "api_error",
                        "recoverable": False
                    }

        return {
            "success": False,
            "error": f"최대 재시도 횟수({self.max_retries})를 초과했습니다.",
            "error_type": "max_retries",
            "last_error": str(last_error),
            "recoverable": True,
            "suggestion": "잠시 후 다시 시도하거나 Rate Limit Tier를 업그레이드하세요."
        }

# 사용 예시
client = OpenAI()
handler = OpenAIErrorHandler(client, max_retries=3)

result = handler.safe_call(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": "안녕하세요"}],
    max_tokens=100
)

if result["success"]:
    print(f"응답: {result['content']}")
    print(f"시도 횟수: {result['attempt']}")
else:
    print(f"오류: {result['error']}")
    if result.get("suggestion"):
        print(f"제안: {result['suggestion']}")
```

### 토큰 관련 문제 해결

| 문제 | 증상 | 해결 방법 |
|------|------|----------|
| **컨텍스트 초과** | `context_length_exceeded` 에러 | 입력 텍스트 축소, 큰 모델로 전환 |
| **출력 잘림** | 응답이 중간에 끊김 | `max_tokens` 값 증가, `finish_reason` 확인 |
| **비용 폭증** | 예상보다 높은 비용 | 토큰 수 사전 계산, 캐싱 적용 |
| **느린 응답** | 타임아웃 발생 | 스트리밍 사용, 입력 최적화 |

```python
# 컨텍스트 초과 문제 해결: 자동 청킹

import tiktoken

def smart_truncate(
    text: str,
    max_tokens: int,
    model: str = "gpt-4o"
) -> str:
    """토큰 한도에 맞게 텍스트를 자릅니다."""
    encoding = tiktoken.encoding_for_model(model)
    tokens = encoding.encode(text)

    if len(tokens) <= max_tokens:
        return text

    truncated_tokens = tokens[:max_tokens]
    return encoding.decode(truncated_tokens)

def chunk_text(
    text: str,
    chunk_size: int = 3000,
    overlap: int = 200,
    model: str = "gpt-4o"
) -> list[str]:
    """텍스트를 청크로 분할합니다 (오버랩 포함)."""
    encoding = tiktoken.encoding_for_model(model)
    tokens = encoding.encode(text)

    chunks = []
    start = 0
    while start < len(tokens):
        end = min(start + chunk_size, len(tokens))
        chunk_tokens = tokens[start:end]
        chunks.append(encoding.decode(chunk_tokens))
        start += chunk_size - overlap

    return chunks

# 사용 예시: 대용량 코드 리뷰
large_code = open("huge_file.py").read()
chunks = chunk_text(large_code, chunk_size=3000)

reviews = []
for i, chunk in enumerate(chunks):
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "코드 리뷰어입니다."},
            {"role": "user", "content": f"[파트 {i+1}/{len(chunks)}]\n```\n{chunk}\n```"}
        ]
    )
    reviews.append(response.choices[0].message.content)

print("\n---\n".join(reviews))
```

### 레이트 리밋 관리

```python
# rate_limiter.py - 레이트 리밋 관리자

import time
import threading
from collections import deque

class RateLimiter:
    """토큰 버킷 기반 레이트 리미터"""

    def __init__(self, requests_per_minute: int = 60, tokens_per_minute: int = 90000):
        self.rpm_limit = requests_per_minute
        self.tpm_limit = tokens_per_minute
        self.request_times = deque()
        self.token_counts = deque()
        self.lock = threading.Lock()

    def wait_if_needed(self, estimated_tokens: int = 1000):
        """필요한 경우 대기합니다."""
        with self.lock:
            now = time.time()
            window_start = now - 60  # 1분 윈도우

            # 만료된 기록 제거
            while self.request_times and self.request_times[0] < window_start:
                self.request_times.popleft()
            while self.token_counts and self.token_counts[0][0] < window_start:
                self.token_counts.popleft()

            # RPM 체크
            if len(self.request_times) >= self.rpm_limit:
                wait_time = self.request_times[0] - window_start
                print(f"RPM 한도 도달. {wait_time:.1f}초 대기")
                time.sleep(wait_time)

            # TPM 체크
            current_tokens = sum(t[1] for t in self.token_counts)
            if current_tokens + estimated_tokens > self.tpm_limit:
                wait_time = self.token_counts[0][0] - window_start
                print(f"TPM 한도 도달. {wait_time:.1f}초 대기")
                time.sleep(wait_time)

            # 기록 추가
            self.request_times.append(time.time())
            self.token_counts.append((time.time(), estimated_tokens))

# 사용 예시
limiter = RateLimiter(requests_per_minute=50, tokens_per_minute=80000)

for task in tasks:
    limiter.wait_if_needed(estimated_tokens=500)
    response = client.chat.completions.create(...)
```

### Codex 에이전트 오류 해결

| 오류 상황 | 원인 | 해결 방법 |
|----------|------|----------|
| **작업 실패** | 의존성 설치 실패 | `package.json`/`requirements.txt` 확인, 호환성 점검 |
| **테스트 미통과** | 테스트 환경 차이 | 환경변수 설정, 테스트 fixture 확인 |
| **PR 충돌** | 동시 작업 충돌 | 작업 범위 분리, 순차 실행 고려 |
| **빈 결과** | 프롬프트 불명확 | 구체적인 파일 경로, 예상 결과 명시 |
| **무한 루프** | 작업 조건 불충분 | 종료 조건 명시, 최대 반복 제한 |
| **보안 차단** | 네트워크 격리 | 필요한 패키지를 사전 설치, 오프라인 작업 |

```
[Codex 오류 보고 프롬프트]

## 오류 상황
Codex 작업 ID: [작업 ID]
오류 메시지: [에러 메시지]

## 환경 정보
- 저장소: [GitHub URL]
- 브랜치: [브랜치명]
- 사용 모드: [Ask/Code/Full Auto]

## 재현 단계
1. [첫 번째 단계]
2. [두 번째 단계]
3. [오류 발생]

## 기대 동작
[예상했던 결과]

## 실제 동작
[실제 발생한 결과]
```

### 디버깅 체크리스트

```
=== API 호출 디버깅 체크리스트 ===

1. 인증 확인
   [ ] API 키가 올바르게 설정되어 있는가?
   [ ] 환경변수가 로드되는가? (echo $OPENAI_API_KEY)
   [ ] API 키가 만료되지 않았는가?
   [ ] Organization/Project ID가 올바른가?

2. 요청 확인
   [ ] 모델명이 정확한가? (오타 확인)
   [ ] messages 배열 형식이 올바른가?
   [ ] 필수 파라미터가 모두 포함되어 있는가?
   [ ] max_tokens 값이 적절한가?

3. 네트워크 확인
   [ ] 인터넷 연결이 정상인가?
   [ ] 프록시/방화벽이 API를 차단하지 않는가?
   [ ] VPN이 영향을 주지 않는가?

4. 비용·한도 확인
   [ ] 월간 예산이 남아있는가?
   [ ] Rate Limit Tier가 적절한가?
   [ ] 토큰 사용량이 한도 내인가?

5. 응답 확인
   [ ] finish_reason이 "stop"인가? (아니면 잘림)
   [ ] 응답 content가 null이 아닌가?
   [ ] 에러 메시지의 세부 내용을 확인했는가?
```

### 체크포인트

- [ ] API 에러 코드별 원인과 해결법을 알고 있다
- [ ] 지수 백오프 재시도 로직을 구현할 수 있다
- [ ] 토큰 초과 문제를 청킹으로 해결할 수 있다
- [ ] 레이트 리미터를 구현하여 한도를 관리할 수 있다
- [ ] Codex 에이전트 오류를 체계적으로 디버깅할 수 있다

---

## 11. 보안과 비용 관리

### 학습 목표

- API 키를 안전하게 관리하고 유출 시 대응할 수 있다
- 사용량을 모니터링하고 예산을 효과적으로 관리할 수 있다
- 데이터 프라이버시 정책을 이해하고 준수할 수 있다
- 프로덕션 환경의 보안 모범 사례를 적용할 수 있다

### API 키 보안

#### 키 관리 원칙

| 원칙 | 설명 | 실천 방법 |
|------|------|----------|
| **최소 권한** | 필요한 엔드포인트만 허용 | 프로젝트별 제한된 키 발급 |
| **환경 분리** | 개발/스테이징/프로덕션 키 분리 | 별도 Organization 또는 Project |
| **정기 교체** | 주기적으로 키를 갱신 | 3~6개월마다 키 로테이션 |
| **모니터링** | 비정상 사용 감지 | 사용량 알림 설정 |
| **유출 대응** | 유출 시 즉시 무효화 | 키 재발급 + 영향 범위 확인 |

#### 환경별 키 관리

```bash
# 개발 환경: .env (커밋 금지)
OPENAI_API_KEY=sk-proj-dev-xxxx

# 스테이징: CI/CD 환경변수
# GitHub Settings → Secrets → OPENAI_API_KEY_STAGING

# 프로덕션: 시크릿 매니저
# AWS Secrets Manager / GCP Secret Manager / HashiCorp Vault
```

```python
# 프로덕션에서 안전한 키 로딩

import os
import boto3  # AWS 사용 시

def get_api_key() -> str:
    """환경에 따라 API 키를 안전하게 로드합니다."""
    env = os.getenv("APP_ENV", "development")

    if env == "production":
        # AWS Secrets Manager에서 로드
        session = boto3.session.Session()
        client = session.client("secretsmanager", region_name="ap-northeast-2")
        response = client.get_secret_value(SecretId="openai/api-key")
        return response["SecretString"]

    elif env == "staging":
        # 환경변수에서 로드
        key = os.getenv("OPENAI_API_KEY_STAGING")
        if not key:
            raise ValueError("OPENAI_API_KEY_STAGING 환경변수가 설정되지 않았습니다")
        return key

    else:
        # 개발 환경: .env 파일
        from dotenv import load_dotenv
        load_dotenv()
        return os.getenv("OPENAI_API_KEY", "")
```

#### 키 유출 대응 절차

```
=== API 키 유출 시 즉시 대응 절차 ===

1. [즉시] OpenAI Platform에서 해당 키 비활성화
   Platform → API keys → 해당 키 Delete

2. [즉시] 새 API 키 발급 및 배포

3. [1시간 내] 영향 범위 확인
   - Platform → Usage 에서 비정상 사용량 확인
   - 유출 경로 파악 (Git 기록, 로그 등)

4. [24시간 내] 보안 조치
   - Git 히스토리에서 키 제거 (git filter-branch 또는 BFG)
   - 관련 서비스 크레덴셜 교체
   - 팀에 사고 공유

5. [1주 내] 재발 방지
   - pre-commit Hook에 시크릿 스캔 추가
   - .gitignore 강화
   - 시크릿 매니저 도입 검토
```

```bash
# pre-commit Hook: 시크릿 유출 방지
#!/bin/bash
# .git/hooks/pre-commit

# API 키 패턴 검사
PATTERNS=(
    'sk-proj-[A-Za-z0-9]'
    'sk-[A-Za-z0-9]{20,}'
    'OPENAI_API_KEY=[^$]'
)

for PATTERN in "${PATTERNS[@]}"; do
    if git diff --cached --diff-filter=ACMR | grep -qE "$PATTERN"; then
        echo "⚠️  API 키가 커밋에 포함되어 있습니다!"
        echo "패턴: $PATTERN"
        echo "커밋이 차단되었습니다. .env 파일이 .gitignore에 포함되어 있는지 확인하세요."
        exit 1
    fi
done
```

### 사용량 모니터링

#### Platform 대시보드 활용

OpenAI Platform의 Usage 페이지에서 다음을 확인합니다:

| 메트릭 | 확인 내용 | 주기 |
|--------|----------|------|
| **Daily cost** | 일일 비용 추이 | 매일 |
| **Requests/min** | 분당 요청 수 | 실시간 |
| **Tokens/min** | 분당 토큰 사용량 | 실시간 |
| **Error rate** | 에러 발생 비율 | 매일 |
| **Model usage** | 모델별 사용 비율 | 주간 |

#### 자동 알림 설정

```python
# cost_alert.py - 비용 알림 시스템

import os
import json
import requests
from datetime import datetime, timedelta
from openai import OpenAI

class CostMonitor:
    """API 비용을 모니터링하고 알림을 보냅니다."""

    def __init__(
        self,
        daily_budget: float = 50.0,
        monthly_budget: float = 500.0,
        slack_webhook: str = ""
    ):
        self.daily_budget = daily_budget
        self.monthly_budget = monthly_budget
        self.slack_webhook = slack_webhook
        self.daily_cost = 0.0
        self.monthly_cost = 0.0

    def record_cost(self, cost: float, model: str):
        """비용을 기록하고 임계값을 확인합니다."""
        self.daily_cost += cost
        self.monthly_cost += cost

        # 일일 예산 80% 경고
        if self.daily_cost > self.daily_budget * 0.8:
            self._send_alert(
                level="warning",
                message=(
                    f"일일 API 비용이 예산의 80%에 도달했습니다.\n"
                    f"현재: ${self.daily_cost:.2f} / 예산: ${self.daily_budget:.2f}"
                )
            )

        # 일일 예산 초과
        if self.daily_cost > self.daily_budget:
            self._send_alert(
                level="critical",
                message=(
                    f"일일 API 예산을 초과했습니다!\n"
                    f"현재: ${self.daily_cost:.2f} / 예산: ${self.daily_budget:.2f}"
                )
            )

    def _send_alert(self, level: str, message: str):
        """Slack으로 알림을 전송합니다."""
        emoji = "⚠️" if level == "warning" else "🚨"
        print(f"{emoji} {message}")

        if self.slack_webhook:
            payload = {
                "text": f"{emoji} *OpenAI API 비용 알림*\n{message}"
            }
            requests.post(self.slack_webhook, json=payload)

# 사용 예시
monitor = CostMonitor(
    daily_budget=50.0,
    slack_webhook=os.getenv("SLACK_WEBHOOK_URL", "")
)
```

### 예산 최적화 전략

| 전략 | 절감 효과 | 복잡도 | 설명 |
|------|----------|--------|------|
| **모델 계층화** | 30~70% | 낮음 | 작업에 따라 mini/nano 사용 |
| **프롬프트 압축** | 10~30% | 낮음 | 불필요한 컨텍스트 제거 |
| **Redis 캐싱** | 20~50% | 중간 | 동일 요청 결과 캐시 |
| **Batch API** | 50% | 중간 | 비실시간 작업 일괄 처리 |
| **Prompt Caching** | 25~50% | 낮음 | 긴 시스템 프롬프트 자동 캐싱 |
| **임베딩 전처리** | 40~60% | 높음 | 사전 벡터화로 검색 비용 절감 |

```python
# 모델 계층화 라우터

def select_model(task_type: str, input_length: int) -> str:
    """작업 유형과 입력 길이에 따라 최적의 모델을 선택합니다."""

    # 간단한 분류/변환 → 최저비용 모델
    if task_type in ["classify", "format", "translate_short"]:
        return "gpt-4.1-nano"

    # 일반 코드 생성/리뷰 → 중간 모델
    if task_type in ["code_review", "code_generate", "summarize"]:
        if input_length < 5000:
            return "gpt-4o-mini"
        else:
            return "gpt-4.1-mini"

    # 복잡한 분석/추론 → 고급 모델
    if task_type in ["architecture", "debug_complex", "security_audit"]:
        return "gpt-4o"

    # 수학/논리 문제 → 추론 모델
    if task_type in ["math", "logic", "algorithm"]:
        return "o4-mini"

    # 기본값
    return "gpt-4o-mini"
```

### 데이터 프라이버시

| 항목 | API 사용 시 | ChatGPT 사용 시 |
|------|-----------|----------------|
| **학습 데이터** | 기본적으로 학습에 사용되지 않음 | 설정에 따라 학습 가능 |
| **데이터 보존** | 30일간 남용 모니터링용 보존 | 계정 설정에 따름 |
| **Zero Data Retention** | 별도 계약 가능 (Enterprise) | N/A |
| **SOC 2 Type II** | 인증 완료 | 인증 완료 |
| **GDPR** | 준수 | 준수 |

```python
# 민감 정보 필터링

import re

def sanitize_input(text: str) -> str:
    """API로 전송하기 전에 민감 정보를 제거합니다."""
    patterns = {
        "이메일": r'\b[\w.+-]+@[\w-]+\.[\w.]+\b',
        "전화번호": r'\b\d{2,3}[-.]?\d{3,4}[-.]?\d{4}\b',
        "주민번호": r'\b\d{6}[-]?\d{7}\b',
        "카드번호": r'\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b',
        "IP주소": r'\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b',
    }

    sanitized = text
    for name, pattern in patterns.items():
        sanitized = re.sub(pattern, f'[{name}_제거됨]', sanitized)

    return sanitized

# 사용 예시
user_code = """
def send_email():
    to = "user@example.com"
    password = "my_secret_123"
    ...
"""
safe_code = sanitize_input(user_code)
# API에 safe_code를 전송
```

### 보안 체크리스트

```
=== 프로덕션 보안 체크리스트 ===

API 키 관리
[ ] API 키가 코드에 하드코딩되어 있지 않다
[ ] .env 파일이 .gitignore에 포함되어 있다
[ ] 프로덕션은 시크릿 매니저를 사용한다
[ ] 키 로테이션 주기가 설정되어 있다
[ ] pre-commit Hook에 시크릿 스캔이 포함되어 있다

네트워크 보안
[ ] HTTPS를 사용한다
[ ] CORS가 올바르게 설정되어 있다
[ ] Rate Limiting이 적용되어 있다
[ ] API 엔드포인트에 인증이 적용되어 있다

데이터 보안
[ ] 민감 정보 필터링이 적용되어 있다
[ ] 사용자 데이터는 최소한만 전송한다
[ ] 로그에 API 키나 개인정보가 포함되지 않는다
[ ] 데이터 보존 정책을 확인했다

비용 관리
[ ] 일일/월간 예산이 설정되어 있다
[ ] 비용 알림이 설정되어 있다
[ ] 모델 계층화가 적용되어 있다
[ ] 비정상 사용량 감지 로직이 있다
```

### 체크포인트

- [ ] API 키 유출 시 대응 절차를 설명할 수 있다
- [ ] 환경별 키 관리 전략을 구현할 수 있다
- [ ] 비용 모니터링 및 알림 시스템을 구축할 수 있다
- [ ] 민감 정보 필터링을 적용할 수 있다
- [ ] 보안 체크리스트를 기반으로 프로덕션을 점검할 수 있다

---

## 12. 다음 단계

### 학습 목표

- AI 엔지니어링 경력 경로를 이해한다
- 멀티 모델 활용 전략을 수립한다
- 심화 학습을 위한 리소스를 파악한다

### AI 엔지니어링 경로

이 교안을 완료한 후의 심화 경로:

```
ChatGPT/Codex 개발자편 (현재)
       │
       ├─→ AI 애플리케이션 개발
       │     ├── RAG (검색 증강 생성) 시스템 구축
       │     ├── AI 에이전트 개발 (LangChain, CrewAI)
       │     └── 멀티모달 AI 서비스
       │
       ├─→ AI 인프라·플랫폼
       │     ├── LLM 서빙 (vLLM, TensorRT-LLM)
       │     ├── 모델 파인튜닝·평가
       │     └── AI 모니터링·옵저버빌리티
       │
       ├─→ AI 프로덕트
       │     ├── AI 기반 SaaS 제품 개발
       │     ├── GPTs/Actions 마켓플레이스
       │     └── AI 자동화 워크플로
       │
       └─→ 멀티 AI 통합
             ├── OpenAI + Anthropic + Google 통합
             ├── 오픈소스 모델 (Llama, Mistral) 병행
             └── AI 라우팅·오케스트레이션
```

### 멀티 모델 활용 전략

프로덕션 환경에서는 단일 모델에 의존하지 않고 여러 모델을 조합합니다:

| 전략 | 설명 | 활용 사례 |
|------|------|----------|
| **폴백 체인** | 1차 모델 실패 시 2차 모델로 대체 | GPT-4o → Claude → Gemini |
| **작업별 라우팅** | 작업 유형에 따라 모델 분배 | 코딩→GPT-4.1, 분석→Claude, 검색→Gemini |
| **앙상블** | 여러 모델 결과를 종합 | 코드 리뷰를 2개 모델로 수행 후 통합 |
| **비용 최적화** | 비용 대비 성능 기준 라우팅 | 간단한 작업→mini, 복잡→고급 모델 |

```python
# ai_router.py - AI 모델 라우터

from enum import Enum
from typing import Optional

class TaskType(Enum):
    CODE_GENERATE = "code_generate"
    CODE_REVIEW = "code_review"
    ARCHITECTURE = "architecture"
    TRANSLATION = "translation"
    SUMMARIZE = "summarize"
    REASONING = "reasoning"

class AIRouter:
    """작업 유형에 따라 최적의 AI 모델로 라우팅합니다."""

    ROUTING_TABLE = {
        TaskType.CODE_GENERATE: [
            ("openai", "gpt-4.1"),
            ("anthropic", "claude-sonnet-4-20250514"),
        ],
        TaskType.CODE_REVIEW: [
            ("openai", "gpt-4o"),
            ("anthropic", "claude-sonnet-4-20250514"),
        ],
        TaskType.ARCHITECTURE: [
            ("anthropic", "claude-opus-4-20250514"),
            ("openai", "o3"),
        ],
        TaskType.TRANSLATION: [
            ("openai", "gpt-4o-mini"),
            ("anthropic", "claude-haiku-35-20241022"),
        ],
        TaskType.SUMMARIZE: [
            ("openai", "gpt-4o-mini"),
        ],
        TaskType.REASONING: [
            ("openai", "o3"),
            ("openai", "o4-mini"),
        ],
    }

    def route(self, task_type: TaskType) -> tuple[str, str]:
        """작업 유형에 맞는 (provider, model) 튜플을 반환합니다."""
        candidates = self.ROUTING_TABLE.get(task_type, [])
        if not candidates:
            return ("openai", "gpt-4o-mini")
        return candidates[0]

    def fallback(self, task_type: TaskType) -> Optional[tuple[str, str]]:
        """폴백 모델을 반환합니다."""
        candidates = self.ROUTING_TABLE.get(task_type, [])
        if len(candidates) > 1:
            return candidates[1]
        return None

# 사용 예시
router = AIRouter()
provider, model = router.route(TaskType.CODE_GENERATE)
print(f"선택된 모델: {provider}/{model}")
```

### 심화 리소스

#### 공식 문서

| 리소스 | 설명 | 링크 |
|--------|------|------|
| **OpenAI Platform Docs** | API 전체 레퍼런스 | [platform.openai.com/docs](https://platform.openai.com/docs) |
| **OpenAI Cookbook** | API 활용 예제 모음 | [github.com/openai/openai-cookbook](https://github.com/openai/openai-cookbook) |
| **Codex 문서** | Codex 에이전트 사용법 | [openai.com/index/openai-codex](https://openai.com/index/openai-codex/) |
| **GPTs Actions 가이드** | Actions API 연동 가이드 | [platform.openai.com/docs/actions](https://platform.openai.com/docs/actions) |
| **OpenAI Status** | API 서비스 상태 확인 | [status.openai.com](https://status.openai.com) |

#### 커뮤니티

| 리소스 | 설명 | 링크 |
|--------|------|------|
| **OpenAI Community** | 공식 포럼 | [community.openai.com](https://community.openai.com) |
| **OpenAI Discord** | 실시간 커뮤니티 | [discord.gg/openai](https://discord.gg/openai) |
| **Reddit r/OpenAI** | 뉴스 및 토론 | [reddit.com/r/OpenAI](https://reddit.com/r/OpenAI) |
| **AI Korea** | 한국어 AI 커뮤니티 | 카카오톡/디스코드 |

#### 심화 학습 주제

| 주제 | 난이도 | 설명 |
|------|--------|------|
| **RAG 시스템** | 중급 | 임베딩 + 벡터DB + LLM 조합 |
| **AI 에이전트 프레임워크** | 중급 | LangChain, LangGraph, CrewAI |
| **Fine-tuning 실전** | 고급 | 도메인 특화 모델 훈련 |
| **LLM 평가** | 고급 | 모델 성능 벤치마킹 (MMLU, HumanEval) |
| **프롬프트 엔지니어링 심화** | 중급 | Chain-of-Thought, Few-shot, Self-consistency |
| **AI 보안** | 고급 | 프롬프트 인젝션, 탈옥 방어 |
| **AI 옵저버빌리티** | 중급 | LangSmith, Weights & Biases |

### 이 교안 시리즈의 다른 도구

| 도구 | 교안 | 특징 |
|------|------|------|
| **Lovable** | 초보자/중급자/개발자 | 웹 빌더, 프롬프트로 앱 생성 |
| **AntiGravity** | 초보자/중급자/개발자 | Gemini 기반 에이전트 IDE |
| **Cursor** | 초보자/중급자/개발자 | VS Code 포크 AI IDE |
| **AI Studio** | 초보자/중급자/개발자 | Google 웹 IDE |
| **Claude Code** | 초보자/중급자/개발자 | Anthropic CLI 에이전트 |

### 최종 체크포인트

이 교안을 완료했다면 다음을 수행할 수 있어야 합니다:

- [ ] GPT 모델 아키텍처와 Codex 에이전트 구조를 설명할 수 있다
- [ ] OpenAI API를 SDK로 호출하고 응답을 처리할 수 있다
- [ ] Codex 에이전트를 활용하여 코드를 생성하고 PR을 만들 수 있다
- [ ] Function Calling, Structured Outputs, Vision API를 구현할 수 있다
- [ ] CLI 도구와 Git Hook으로 AI를 개발 워크플로에 통합할 수 있다
- [ ] GitHub Actions에서 AI 코드 리뷰 파이프라인을 구축할 수 있다
- [ ] Docker로 AI API 서비스를 프로덕션 배포할 수 있다
- [ ] GPTs Actions로 외부 API를 연동할 수 있다
- [ ] 다른 AI 도구로의 마이그레이션을 수행할 수 있다
- [ ] API 에러를 체계적으로 디버깅할 수 있다
- [ ] API 키 보안과 비용 관리 체계를 구축할 수 있다

---

## 출처

| 출처 | 설명 |
|------|------|
| [OpenAI Platform](https://platform.openai.com) | OpenAI 공식 API 플랫폼 |
| [OpenAI 공식 문서](https://platform.openai.com/docs) | API 레퍼런스 및 가이드 |
| [OpenAI Cookbook](https://github.com/openai/openai-cookbook) | API 활용 예제 모음 |
| [OpenAI Codex](https://openai.com/index/openai-codex/) | Codex 에이전트 공식 안내 |
| [ChatGPT](https://chat.openai.com) | ChatGPT 서비스 |
| [OpenAI API Changelog](https://platform.openai.com/docs/changelog) | API 변경 이력 |
| 카카오톡 대화방 | 러버블 바이브코딩 카톡방 (2026.3.8) |

---

> 이 교안은 **김선생의 바이브코딩 가이드** 프로젝트의 일부입니다.
> 최종 업데이트: 2026년 3월