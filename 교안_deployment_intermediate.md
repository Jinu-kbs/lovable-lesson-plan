# 배포 가이드 중급편 — 배포 자동화와 환경 관리

> **과정명**: 배포 자동화와 환경 관리
> **대상**: 기본 배포는 해봤지만 자동화와 환경 분리를 배우고 싶은 분
> **목표**: CI/CD 연동, 환경 분리(dev/staging/prod), 모니터링
> **소요 시간**: 약 4~5시간

---

## 이 교안이 나에게 맞을까요? (자가 진단)

아래 질문에 답해보세요:

| 질문 | 예 → | 아니오 → |
|------|------|----------|
| Vercel, Netlify, GitHub Pages로 한 번 이상 배포해본 적 있나요? | **이 교안이 맞아요!** | → 먼저 배포 초보편을 진행하세요 |
| git push 후 자동으로 배포되는 구조를 만들고 싶나요? | **이 교안이 맞아요!** | → 수동 배포로도 충분할 수 있어요 |
| 개발용/테스트용/운영용 환경을 분리하고 싶나요? | **이 교안이 맞아요!** | → 소규모 프로젝트라면 초보편이 적합해요 |
| CI/CD, GitHub Actions라는 단어를 들어본 적 있나요? | 기본 개념은 아시네요! | **이 교안이 맞아요!** |
| Docker, Kubernetes를 사용한 배포를 원하나요? | → 고급편을 참고하세요 | **이 교안이 맞아요!** |

> 하나라도 "이 교안이 맞아요!"에 해당하면, 이 교안부터 시작하세요!

---

### 추천 리소스

| 리소스 | 설명 | 링크 |
|--------|------|------|
| **GitHub Actions 공식 문서** | CI/CD 워크플로우 작성 가이드 | [바로가기](https://docs.github.com/en/actions) |
| **Vercel 공식 문서** | Vercel 배포 및 설정 가이드 | [바로가기](https://vercel.com/docs) |
| **Firebase 공식 문서** | Firebase Hosting 가이드 | [바로가기](https://firebase.google.com/docs/hosting) |
| **Supabase 공식 문서** | 오픈소스 백엔드 서비스 | [바로가기](https://supabase.com/docs) |
| **Replit 공식 문서** | 올인원 배포·Secrets 가이드 | [바로가기](https://docs.replit.com) |
| **Cloudflare 러닝 센터** | DNS, SSL, CDN 개념 학습 | [바로가기](https://www.cloudflare.com/learning/) |

---

## 목차

1. [배포 전략](#1-배포-전략)
2. [CI/CD 파이프라인](#2-cicd-파이프라인)
3. [환경 분리](#3-환경-분리)
4. [Vercel 심화](#4-vercel-심화)
5. [Firebase Hosting](#5-firebase-hosting)
6. [데이터베이스 연동 배포](#6-데이터베이스-연동-배포)
7. [도메인과 SSL](#7-도메인과-ssl)
8. [모니터링과 로깅](#8-모니터링과-로깅)
9. [실전 프로젝트: 방명록 앱 만들고 배포하기](#9-실전-프로젝트-방명록-앱-만들고-배포하기)
10. [실전 프로젝트: 자동 배포 파이프라인](#10-실전-프로젝트-자동-배포-파이프라인)
11. [트러블슈팅 & FAQ](#11-트러블슈팅--faq)

---

## 1. 배포 전략

### 학습 목표

- 수동 배포와 자동 배포의 차이를 이해한다
- 블루-그린, 롤링, 카나리 배포 전략을 비교할 수 있다
- 프로젝트 규모에 맞는 배포 전략을 선택할 수 있다

### 수동 배포 vs 자동 배포

초보편에서 배운 배포는 대부분 **수동 배포**였습니다. 파일을 직접 업로드하거나, 빌드 후 결과물을 수동으로 배포 플랫폼에 올리는 방식이었죠.

| 항목 | 수동 배포 | 자동 배포 (CI/CD) |
|------|----------|------------------|
| **방식** | 사람이 직접 빌드하고 업로드 | 코드 푸시하면 자동 실행 |
| **속도** | 매번 10~30분 | 설정 후 3~5분 |
| **실수 가능성** | 높음 (빌드 누락, 파일 빠짐) | 매우 낮음 (자동화) |
| **일관성** | 매번 달라질 수 있음 | 항상 동일한 과정 |
| **확장성** | 프로젝트 커지면 한계 | 대규모에도 대응 |
| **비용** | 무료 (사람 시간 제외) | 대부분 무료 (GitHub Actions 등) |

```
[수동 배포 흐름]
개발자가 코드 수정
    → 수동으로 빌드 (npm run build)
    → 빌드 결과 확인
    → 수동으로 배포 (파일 업로드)
    → 배포 확인
    → 문제 발생 시 수동 롤백

[자동 배포 흐름 (CI/CD)]
개발자가 코드 수정 → git push
    → 자동 코드 검사 (린트)
    → 자동 빌드
    → 자동 테스트
    → 자동 배포
    → 문제 발생 시 자동 알림 + 롤백
```

### 배포 전략 비교표

프로젝트 규모가 커지면 **어떻게 새 버전을 서비스에 반영할 것인지**가 중요해집니다. 대표적인 4가지 전략을 비교해봅시다.

| 전략 | 방식 | 다운타임 | 위험도 | 적합한 규모 |
|------|------|----------|--------|------------|
| **재배포 (Recreate)** | 기존 서비스 중단 → 새 버전 배포 | 있음 | 높음 | 개인/소규모 |
| **블루-그린 (Blue-Green)** | 새 환경에 배포 → 트래픽 전환 | 없음 | 낮음 | 중소규모 |
| **롤링 (Rolling)** | 서버를 하나씩 순차 교체 | 없음 | 중간 | 중대규모 |
| **카나리 (Canary)** | 일부 사용자에게만 먼저 배포 | 없음 | 매우 낮음 | 대규모 |

#### 1) 재배포 (Recreate)

가장 단순한 전략입니다. 기존 서비스를 완전히 내리고, 새 버전을 올립니다.

```
현재 v1.0 서비스 중
    ↓ [서비스 중단]
v1.0 제거
    ↓ [새 버전 설치]
v2.0 서비스 시작
```

- **장점**: 구현이 가장 간단, 리소스 최소 사용
- **단점**: 배포 중 서비스 중단, 문제 발생 시 복구 시간 필요
- **적합**: 개인 프로젝트, 내부 도구, 사용자가 적은 서비스

#### 2) 블루-그린 (Blue-Green)

두 개의 동일한 환경(블루/그린)을 유지하면서, 트래픽을 한쪽에서 다른 쪽으로 전환합니다.

```
[블루 환경] v1.0 ← 현재 트래픽
[그린 환경] (대기 중)

    ↓ 새 버전을 그린 환경에 배포

[블루 환경] v1.0 ← 현재 트래픽
[그린 환경] v2.0 (테스트 중)

    ↓ 테스트 통과 후 트래픽 전환

[블루 환경] v1.0 (대기, 롤백용)
[그린 환경] v2.0 ← 현재 트래픽
```

- **장점**: 다운타임 없음, 즉시 롤백 가능
- **단점**: 서버 2배 필요, 데이터베이스 동기화 고려 필요
- **적합**: Vercel(프리뷰 배포), Netlify(Deploy Preview)가 이 방식

#### 3) 롤링 (Rolling)

여러 서버가 있을 때, 하나씩 순서대로 새 버전으로 교체합니다.

```
서버1: v1.0  서버2: v1.0  서버3: v1.0
    ↓ 서버1 교체
서버1: v2.0  서버2: v1.0  서버3: v1.0
    ↓ 서버2 교체
서버1: v2.0  서버2: v2.0  서버3: v1.0
    ↓ 서버3 교체
서버1: v2.0  서버2: v2.0  서버3: v2.0
```

- **장점**: 서버 추가 불필요, 점진적 교체
- **단점**: 일시적으로 두 버전 공존, 배포 시간이 길 수 있음
- **적합**: 여러 인스턴스를 운영하는 서비스

#### 4) 카나리 (Canary)

전체 사용자 중 일부에게만 새 버전을 먼저 노출하여 안정성을 확인합니다.

```
v1.0 ← 95% 트래픽
v2.0 ← 5% 트래픽 (카나리 그룹)

    ↓ 문제 없으면 비율 확대

v1.0 ← 70% 트래픽
v2.0 ← 30% 트래픽

    ↓ 최종 전환

v2.0 ← 100% 트래픽
```

- **장점**: 위험 최소화, 실제 사용자 피드백 가능
- **단점**: 구현 복잡, 모니터링 체계 필요
- **적합**: 대규모 서비스, 사용자 영향이 큰 업데이트

### 바이브코딩 프로젝트에서의 추천 전략

| 프로젝트 규모 | 추천 전략 | 구현 방법 |
|-------------|----------|----------|
| 개인 프로젝트 | 재배포 | git push → 자동 배포 |
| 팀 프로젝트 | 블루-그린 | Vercel 프리뷰 배포 활용 |
| 학교/기관 서비스 | 블루-그린 + 환경 분리 | dev/staging/prod 환경 구성 |
| 상용 서비스 | 카나리 | Feature Flag + 점진적 배포 |

> **핵심 포인트**: 바이브코딩으로 만든 대부분의 프로젝트는 Vercel이나 Netlify의 **자동 배포(블루-그린 방식)**로 충분합니다. 이 교안에서는 이 방식을 중심으로 실습합니다.

체크포인트:
- [ ] 수동 배포와 자동 배포의 차이를 설명할 수 있다
- [ ] 4가지 배포 전략의 장단점을 이해했다
- [ ] 내 프로젝트에 적합한 배포 전략을 선택했다

---

## 2. CI/CD 파이프라인

### 학습 목표

- CI/CD의 개념과 필요성을 이해한다
- GitHub Actions로 자동 빌드, 테스트, 배포 파이프라인을 구축한다
- YAML 워크플로우 파일을 직접 작성할 수 있다

### CI/CD란?

**CI (Continuous Integration, 지속적 통합)**: 여러 개발자가 작성한 코드를 자주 병합하고, 자동으로 빌드와 테스트를 실행하는 것

**CD (Continuous Deployment, 지속적 배포)**: 테스트를 통과한 코드를 자동으로 운영 서버에 배포하는 것

```
[CI/CD 전체 흐름]

개발자 A: 기능 개발 → git push → PR 생성
개발자 B: 버그 수정 → git push → PR 생성
                                    ↓
                            [CI - 자동 실행]
                            ├── 코드 린트 검사
                            ├── 단위 테스트
                            ├── 통합 테스트
                            └── 빌드 테스트
                                    ↓
                            모두 통과? ─── 실패 → 알림 → 수정
                                    ↓ (통과)
                            [CD - 자동 배포]
                            ├── 스테이징 배포
                            ├── E2E 테스트
                            └── 프로덕션 배포
```

### GitHub Actions 기본 개념

GitHub Actions는 GitHub에 내장된 CI/CD 도구입니다. **무료** 사용 가능하며 (월 2,000분), 코드 저장소와 완벽하게 통합됩니다.

| 용어 | 설명 | 비유 |
|------|------|------|
| **Workflow** | 자동화할 전체 과정을 정의한 파일 | 요리 레시피 전체 |
| **Event** | 워크플로우를 시작하는 트리거 | "주문이 들어오면" |
| **Job** | 워크플로우 안의 작업 단위 | 레시피의 각 단계 |
| **Step** | Job 안의 개별 명령 | 각 단계의 세부 동작 |
| **Runner** | 워크플로우가 실행되는 서버 | 요리사가 일하는 주방 |
| **Action** | 재사용 가능한 작업 모듈 | 미리 만든 양념 키트 |

### 워크플로우 파일 구조

GitHub Actions 워크플로우는 `.github/workflows/` 디렉토리에 YAML 파일로 작성합니다.

```yaml
# .github/workflows/deploy.yml
# 파일 위치가 매우 중요합니다! 반드시 .github/workflows/ 안에 있어야 합니다.

name: 배포 자동화          # 워크플로우 이름 (GitHub UI에 표시)

on:                       # 언제 실행할지 (트리거)
  push:
    branches: [ main ]    # main 브랜치에 push할 때
  pull_request:
    branches: [ main ]    # main으로 PR이 생성될 때

jobs:                     # 실행할 작업들
  build-and-deploy:       # Job 이름
    runs-on: ubuntu-latest  # 실행 환경 (Ubuntu 최신)

    steps:                # 이 Job의 단계들
      - name: 코드 체크아웃
        uses: actions/checkout@v4   # 미리 만들어진 Action 사용

      - name: Node.js 설치
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: 의존성 설치
        run: npm ci                 # 직접 명령어 실행

      - name: 빌드
        run: npm run build

      - name: 테스트
        run: npm test
```

### 실습: 첫 번째 GitHub Actions 워크플로우

#### Step 1: 워크플로우 파일 생성

프로젝트 루트에서 다음 명령어를 실행합니다.

```bash
# 워크플로우 디렉토리 생성
mkdir -p .github/workflows

# 워크플로우 파일 생성
touch .github/workflows/ci.yml
```

#### Step 2: 기본 CI 워크플로우 작성

```yaml
# .github/workflows/ci.yml
name: CI 파이프라인

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  lint:
    name: 코드 검사
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Node.js 설치
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: 의존성 설치
        run: npm ci

      - name: 린트 검사
        run: npm run lint

  test:
    name: 테스트
    runs-on: ubuntu-latest
    needs: lint              # lint Job이 성공해야 실행
    steps:
      - uses: actions/checkout@v4

      - name: Node.js 설치
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: 의존성 설치
        run: npm ci

      - name: 테스트 실행
        run: npm test

  build:
    name: 빌드
    runs-on: ubuntu-latest
    needs: test              # test Job이 성공해야 실행
    steps:
      - uses: actions/checkout@v4

      - name: Node.js 설치
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: 의존성 설치
        run: npm ci

      - name: 프로덕션 빌드
        run: npm run build

      - name: 빌드 결과물 업로드
        uses: actions/upload-artifact@v4
        with:
          name: build-output
          path: dist/
          retention-days: 7
```

#### Step 3: 자동 배포 워크플로우 (Vercel 연동)

```yaml
# .github/workflows/deploy-vercel.yml
name: Vercel 자동 배포

on:
  push:
    branches: [ main ]

env:
  VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
  VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

jobs:
  deploy-production:
    name: 프로덕션 배포
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Node.js 설치
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Vercel CLI 설치
        run: npm install -g vercel@latest

      - name: Vercel 프로젝트 설정 가져오기
        run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}

      - name: 프로덕션 빌드
        run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}

      - name: 프로덕션 배포
        run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
```

#### Step 4: GitHub Secrets 설정

GitHub Actions에서 비밀 정보(API 키, 토큰 등)를 안전하게 관리하는 방법입니다.

```bash
# Vercel 토큰 생성 방법
# 1. https://vercel.com/account/tokens 접속
# 2. "Create" 버튼 클릭
# 3. 토큰 이름 입력 (예: "github-actions")
# 4. 생성된 토큰 복사 (한 번만 표시됨!)
```

GitHub 저장소에서 Secrets 등록하기:

```
1. GitHub 저장소 → Settings → Secrets and variables → Actions
2. "New repository secret" 클릭
3. 다음 항목들을 등록:
   - VERCEL_TOKEN: Vercel에서 발급받은 토큰
   - VERCEL_ORG_ID: Vercel 팀/개인 ID
   - VERCEL_PROJECT_ID: Vercel 프로젝트 ID
```

> **보안 주의**: Secrets에 등록한 값은 절대 로그에 출력되지 않습니다. 워크플로우 파일에 토큰이나 비밀번호를 직접 적지 마세요!

### GitHub Actions 유용한 기능들

#### 매트릭스 전략: 여러 환경에서 동시 테스트

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18, 20, 22]
    steps:
      - uses: actions/checkout@v4
      - name: Node.js ${{ matrix.node-version }} 설치
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
      - run: npm ci
      - run: npm test
```

#### 조건부 실행

```yaml
steps:
  - name: 프로덕션 전용 단계
    if: github.ref == 'refs/heads/main'
    run: echo "main 브랜치에서만 실행됩니다"

  - name: PR에서만 실행
    if: github.event_name == 'pull_request'
    run: echo "PR일 때만 실행됩니다"
```

#### 캐싱으로 빌드 속도 향상

```yaml
steps:
  - name: npm 캐시 설정
    uses: actions/cache@v4
    with:
      path: ~/.npm
      key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
      restore-keys: |
        ${{ runner.os }}-node-
```

#### 슬랙 알림 연동

```yaml
  - name: 슬랙 알림 전송
    if: always()
    uses: 8398a7/action-slack@v3
    with:
      status: ${{ job.status }}
      text: |
        배포 결과: ${{ job.status }}
        브랜치: ${{ github.ref }}
        커밋: ${{ github.sha }}
    env:
      SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

체크포인트:
- [ ] CI/CD의 개념(지속적 통합, 지속적 배포)을 설명할 수 있다
- [ ] GitHub Actions 워크플로우 YAML 파일의 구조를 이해했다
- [ ] 린트, 테스트, 빌드, 배포 파이프라인을 직접 구성할 수 있다
- [ ] GitHub Secrets를 이용한 보안 관리 방법을 알았다

---

## 3. 환경 분리

### 학습 목표

- dev, staging, prod 환경의 역할과 차이를 이해한다
- 환경변수(.env)를 안전하게 관리하는 방법을 익힌다
- 브랜치 전략과 환경 분리를 연동하는 워크플로우를 구축한다

### 왜 환경을 분리하나요?

개발을 처음 배울 때는 하나의 환경에서 모든 것을 처리합니다. 하지만 프로젝트가 커지면 실제 사용자에게 영향을 주지 않으면서 새 기능을 테스트할 수 있는 별도의 공간이 필요해집니다.

```
[환경 분리 없이 개발하면?]

개발자: 새 기능 코드 작성 → 바로 운영 서버에 배포!
                                    ↓
사용자: "사이트가 갑자기 안 돼요!" "에러 화면이 보여요!"
                                    ↓
개발자: "아차! 버그가 있었네..." → 급히 롤백 → 밤새 수정

[환경을 분리하면?]

개발자: 새 기능 코드 작성 → 개발 환경에서 테스트
                                    ↓
                    스테이징 환경에서 최종 점검
                                    ↓
                    문제 없으면 운영 환경에 배포
                                    ↓
사용자: (아무 문제 없이 서비스 이용 중)
```

### 3가지 환경의 역할

| 환경 | 목적 | 데이터 | 접근 대상 | URL 예시 |
|------|------|--------|----------|----------|
| **Development (개발)** | 새 기능 개발 및 실험 | 테스트 데이터 | 개발자만 | `dev.my-app.com` |
| **Staging (스테이징)** | 운영 전 최종 테스트 | 운영과 유사한 데이터 | 개발자 + QA | `staging.my-app.com` |
| **Production (운영)** | 실제 사용자에게 서비스 | 실제 데이터 | 모든 사용자 | `my-app.com` |

각 환경의 상세 비교:

| 항목 | Development | Staging | Production |
|------|-------------|---------|------------|
| **안정성** | 낮음 (실험 중) | 높음 (테스트 완료) | 매우 높음 (검증 완료) |
| **디버깅** | 상세 에러 표시 | 상세 에러 표시 | 에러 숨김 (사용자 친화적) |
| **성능** | 최적화 불필요 | 운영과 유사 | 최적화 필수 |
| **데이터베이스** | 로컬/테스트 DB | 별도 DB | 운영 DB |
| **API 키** | 테스트용 키 | 테스트용 키 | 실제 키 |
| **로깅** | 모든 로그 출력 | 주요 로그 출력 | 에러 로그만 |

### 환경변수(.env) 관리

#### .env 파일이란?

환경변수는 코드를 변경하지 않고도 **환경에 따라 다른 설정값**을 사용할 수 있게 해주는 장치입니다.

```bash
# .env.development (개발 환경)
VITE_API_URL=http://localhost:3001
VITE_APP_ENV=development
VITE_DEBUG_MODE=true
VITE_ANALYTICS_ID=
VITE_DB_HOST=localhost

# .env.staging (스테이징 환경)
VITE_API_URL=https://staging-api.my-app.com
VITE_APP_ENV=staging
VITE_DEBUG_MODE=true
VITE_ANALYTICS_ID=UA-XXXXX-STAGING
VITE_DB_HOST=staging-db.my-app.com

# .env.production (운영 환경)
VITE_API_URL=https://api.my-app.com
VITE_APP_ENV=production
VITE_DEBUG_MODE=false
VITE_ANALYTICS_ID=UA-XXXXX-PROD
VITE_DB_HOST=prod-db.my-app.com
```

> **중요**: `.env` 파일명 앞에 `VITE_`는 Vite 프로젝트에서 사용하는 접두사입니다. Next.js는 `NEXT_PUBLIC_`, Create React App은 `REACT_APP_`을 사용합니다.

#### .gitignore에 .env 추가 (보안 필수!)

```bash
# .gitignore
# 환경변수 파일은 절대 Git에 올리지 않습니다!
.env
.env.local
.env.development.local
.env.staging.local
.env.production.local

# 아래 파일은 기본값 템플릿이므로 Git에 올려도 됩니다
# .env.example
# .env.development (비밀 정보 미포함 시)
```

#### .env.example 만들기

팀원들이 어떤 환경변수가 필요한지 알 수 있도록 **예시 파일**을 만들어둡니다.

```bash
# .env.example (Git에 올리는 파일 - 실제 값은 비워둠)
VITE_API_URL=
VITE_APP_ENV=
VITE_DEBUG_MODE=
VITE_ANALYTICS_ID=
VITE_DB_HOST=

# 설명:
# VITE_API_URL: 백엔드 API 서버 주소
# VITE_APP_ENV: 현재 환경 (development / staging / production)
# VITE_DEBUG_MODE: 디버그 모드 (true / false)
# VITE_ANALYTICS_ID: Google Analytics 추적 ID
# VITE_DB_HOST: 데이터베이스 호스트 주소
```

### 코드에서 환경변수 사용하기

```javascript
// config.js - 환경별 설정을 중앙에서 관리
const config = {
  apiUrl: import.meta.env.VITE_API_URL,
  appEnv: import.meta.env.VITE_APP_ENV || 'development',
  isDebug: import.meta.env.VITE_DEBUG_MODE === 'true',
  analyticsId: import.meta.env.VITE_ANALYTICS_ID,
};

// 환경별 분기 처리
if (config.isDebug) {
  console.log('현재 환경:', config.appEnv);
  console.log('API 서버:', config.apiUrl);
}

// API 호출 시 환경변수 사용
async function fetchData(endpoint) {
  const response = await fetch(`${config.apiUrl}${endpoint}`);
  return response.json();
}

export default config;
```

### 브랜치 전략과 환경 연동

```
[Git 브랜치 ↔ 환경 매핑]

feature/new-login  →  개발자 로컬 (개별 테스트)
        ↓ PR + 머지
develop 브랜치     →  Development 환경 (dev.my-app.com)
        ↓ PR + 머지
staging 브랜치     →  Staging 환경 (staging.my-app.com)
        ↓ PR + 머지 (릴리스)
main 브랜치        →  Production 환경 (my-app.com)
```

#### 환경별 자동 배포 워크플로우

```yaml
# .github/workflows/deploy-by-env.yml
name: 환경별 자동 배포

on:
  push:
    branches:
      - develop      # 개발 환경
      - staging      # 스테이징 환경
      - main         # 운영 환경

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Node.js 설치
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: 의존성 설치
        run: npm ci

      # 브랜치에 따라 환경변수 파일 선택
      - name: 개발 환경 설정
        if: github.ref == 'refs/heads/develop'
        run: cp .env.development .env

      - name: 스테이징 환경 설정
        if: github.ref == 'refs/heads/staging'
        run: cp .env.staging .env

      - name: 운영 환경 설정
        if: github.ref == 'refs/heads/main'
        run: |
          echo "VITE_API_URL=${{ secrets.PROD_API_URL }}" >> .env
          echo "VITE_APP_ENV=production" >> .env
          echo "VITE_ANALYTICS_ID=${{ secrets.PROD_ANALYTICS_ID }}" >> .env

      - name: 빌드
        run: npm run build

      - name: Vercel 배포
        run: |
          npm install -g vercel@latest
          if [ "${{ github.ref }}" = "refs/heads/main" ]; then
            vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
          else
            vercel deploy --prebuilt --token=${{ secrets.VERCEL_TOKEN }}
          fi
```

### Vercel에서의 환경 분리

Vercel은 자체적으로 환경 분리를 지원합니다.

```bash
# Vercel CLI로 환경변수 설정
# 개발 환경
vercel env add VITE_API_URL development
# → 값 입력: http://localhost:3001

# 프리뷰 환경 (PR 배포)
vercel env add VITE_API_URL preview
# → 값 입력: https://staging-api.my-app.com

# 프로덕션 환경
vercel env add VITE_API_URL production
# → 값 입력: https://api.my-app.com
```

Vercel 대시보드에서도 설정 가능합니다:

```
Vercel 대시보드 → Settings → Environment Variables

┌─────────────────────┬──────────────────────────────┬─────────────┐
│ Name                │ Value                        │ Environment │
├─────────────────────┼──────────────────────────────┼─────────────┤
│ VITE_API_URL        │ http://localhost:3001         │ Development │
│ VITE_API_URL        │ https://staging-api.my-app.com│ Preview     │
│ VITE_API_URL        │ https://api.my-app.com        │ Production  │
│ VITE_ANALYTICS_ID   │ (비어있음)                     │ Development │
│ VITE_ANALYTICS_ID   │ UA-XXXXX-STAGING              │ Preview     │
│ VITE_ANALYTICS_ID   │ UA-XXXXX-PROD                 │ Production  │
└─────────────────────┴──────────────────────────────┴─────────────┘
```

체크포인트:
- [ ] dev/staging/prod 3가지 환경의 역할을 설명할 수 있다
- [ ] .env 파일을 환경별로 분리하여 관리할 수 있다
- [ ] .gitignore에 .env를 추가해 보안을 유지할 수 있다
- [ ] 브랜치와 환경을 연동한 자동 배포 워크플로우를 이해했다

---

## 4. Vercel 심화

### 학습 목표

- GitHub Import부터 프로덕션 배포, PR 프리뷰, 롤백까지 Vercel 전 과정을 직접 해본다
- 환경변수를 Production/Preview로 분리하여 안전하게 관리한다
- PR별 프리뷰 배포를 활용하여 팀 협업 효율을 높인다
- Edge Functions를 이해하고 간단한 API를 구현한다
- Vercel Analytics로 성능을 모니터링한다

> **최종 검증일**: 2026-06-26 · Vercel은 무료(Hobby) 한도·UI가 자주 바뀝니다. 정확한 한도와 화면은 [공식 가격 페이지](https://vercel.com/pricing)에서 확인하세요. **Hobby(무료)는 비상업·개인 용도 전용**이며, 수익형 사이트는 Pro($20/월)가 필요합니다.

### Vercel 풀 핸즈온 (GitHub Import → 프로덕션 → 프리뷰 → 롤백)

여기서는 빈 화면에서 **공개 URL**까지 가는 전 과정을 단계별로 따라 합니다. 빌드 도구(Vite/Next.js)를 쓰는 프로젝트든 정적 HTML이든 흐름은 같습니다.

#### 1단계 — GitHub Import (저장소 연결)

1. [vercel.com](https://vercel.com)에 **GitHub 계정으로 로그인**한다(신용카드 불필요).
2. 대시보드 → **"Add New… → Project"** 클릭.
3. 처음이면 **GitHub 앱 권한 승인**(저장소 접근 허용) 화면이 나온다. 전체 저장소 또는 특정 저장소만 허용할 수 있다.
4. 배포할 저장소를 골라 **"Import"** 클릭.
5. Vercel이 프레임워크를 자동 감지(Next.js / Vite / 정적 HTML 등)하고 **Build Command·Output Directory**를 채워준다. 정적 HTML이면 빌드 없이 그대로 배포된다.

> [스크린샷 자리] Vercel "Import Git Repository" 화면 — 저장소 목록과 Import 버튼이 보이는 화면

체크포인트:
- [ ] Vercel 대시보드에 내 GitHub 저장소가 보이고 Import 버튼을 눌렀다

#### 2단계 — 환경변수 입력 (Production / Preview 분리)

Import 화면 또는 배포 후 **Settings → Environment Variables**에서 키-값을 등록한다. 핵심은 **환경(Environment)별로 다른 값**을 줄 수 있다는 점이다.

```
Vercel → Settings → Environment Variables

┌──────────────────────────┬─────────────────────────────────┬──────────────┐
│ Name                     │ Value                           │ Environment  │
├──────────────────────────┼─────────────────────────────────┼──────────────┤
│ VITE_SUPABASE_URL        │ https://prod-xxx.supabase.co     │ Production   │
│ VITE_SUPABASE_URL        │ https://staging-xxx.supabase.co  │ Preview      │
│ VITE_SUPABASE_PUBLISHABLE_KEY │ sb_publishable_(운영 공개 키) │ Production   │
│ VITE_SUPABASE_PUBLISHABLE_KEY │ sb_publishable_(테스트 공개 키)│ Preview     │
└──────────────────────────┴─────────────────────────────────┴──────────────┘
```

CLI로도 같은 작업을 할 수 있습니다.

```bash
# 환경별로 따로 등록 (development / preview / production)
vercel env add VITE_SUPABASE_URL production
# → 값 입력: https://prod-xxx.supabase.co

vercel env add VITE_SUPABASE_URL preview
# → 값 입력: https://staging-xxx.supabase.co
```

> **보안 주의**: `VITE_`나 `NEXT_PUBLIC_` 접두사가 붙은 변수는 **빌드 결과에 박혀 브라우저로 노출**됩니다. Supabase 공개 키(publishable/anon)는 노출돼도 RLS로 보호되므로 괜찮지만, **비밀 키(secret/service_role)에는 절대 그 접두사를 붙이지 마세요.** 비밀 키는 서버 사이드 전용 변수로만 둡니다.

> [스크린샷 자리] Vercel Environment Variables 화면 — 같은 Name이 Production/Preview에 각각 다른 값으로 등록된 모습

체크포인트:
- [ ] 같은 변수 이름을 Production과 Preview에 서로 다른 값으로 등록했다
- [ ] 클라이언트 노출 접두사(VITE_/NEXT_PUBLIC_)에는 공개 가능한 값만 넣었다

#### 3단계 — 프로덕션 배포

1. Import 화면에서 **"Deploy"** 클릭(또는 main 브랜치에 push).
2. 수십 초 내 빌드가 끝나고 **`프로젝트명.vercel.app`** 공개 URL이 발급된다.
3. 이후로는 **main 브랜치에 push하면 자동으로 프로덕션이 갱신**된다(별도 클릭 불필요). 이것이 곧 CI/CD다.

```bash
# CLI로 즉시 프로덕션 배포
npm i -g vercel
vercel --prod
```

> [스크린샷 자리] 배포 완료 후 "Congratulations" 화면 — Visit 버튼과 *.vercel.app 주소가 보이는 화면

체크포인트:
- [ ] `*.vercel.app` 주소로 접속해 내 사이트가 인터넷에 떴다
- [ ] main에 push한 뒤 자동으로 새 배포가 시작되는 것을 확인했다

#### 4단계 — PR 프리뷰 배포

main이 아닌 **다른 브랜치에서 PR을 만들면**, Vercel이 그 PR 코드만으로 **독립된 미리보기 사이트**를 자동 생성한다.

```
[프리뷰 흐름]
feature 브랜치 작업 → GitHub PR 생성
    ↓ (Vercel 자동 감지)
PR 코드로 별도 배포 → 고유 프리뷰 URL 생성 (예: my-app-git-feature-xxx.vercel.app)
    ↓
PR에 프리뷰 URL 코멘트 자동 첨부 → 팀원이 실제 동작을 보고 리뷰
    ↓
PR 머지(main) → 프로덕션 자동 반영
```

이때 프리뷰 배포는 **Preview 환경변수**를 사용하므로, 2단계에서 분리해 둔 스테이징 값이 자동 적용된다(운영 DB를 건드리지 않는다).

> [스크린샷 자리] GitHub PR 하단에 Vercel 봇이 단 프리뷰 URL 코멘트(Visit Preview)가 보이는 화면

체크포인트:
- [ ] PR을 만들었더니 프리뷰 URL이 자동으로 생성·코멘트됐다
- [ ] 프리뷰가 Production이 아닌 Preview 환경변수를 쓴다는 점을 이해했다

#### 5단계 — 롤백 (이전 배포로 되돌리기)

잘못 배포했을 때, Vercel은 **클릭 한 번으로 이전 배포로 되돌릴 수 있다**(배포 이력이 전부 보존됨).

1. 프로젝트 → **Deployments** 탭에서 정상 동작하던 이전 배포를 찾는다.
2. 우측 **⋯ 메뉴 → "Promote to Production"** 클릭.
3. 즉시 해당 버전이 프로덕션으로 승격된다(다시 빌드하지 않으므로 빠르다).
4. 이력을 남기고 싶으면 `git revert`로 문제 커밋을 되돌린 뒤 push하는 방법도 있다(권장).

> [스크린샷 자리] Deployments 목록에서 이전 배포의 "Promote to Production" 메뉴가 열린 화면

체크포인트:
- [ ] 이전 배포를 프로덕션으로 승격(롤백)하는 위치를 찾았다
- [ ] 안전한 롤백 방법으로 git revert도 있다는 것을 안다

### 프리뷰 배포 (Preview Deployments)

프리뷰 배포는 Pull Request가 생성될 때마다 **해당 PR의 코드로 별도의 임시 사이트**를 만들어주는 기능입니다.

```
[프리뷰 배포 흐름]

1. 개발자가 feature 브랜치에서 작업
2. GitHub에 PR 생성
3. Vercel이 자동으로 PR 코드를 배포
4. 고유한 프리뷰 URL 생성 (예: my-app-abc123.vercel.app)
5. PR에 자동으로 프리뷰 URL 코멘트 달림
6. 팀원이 프리뷰 URL에서 직접 확인하고 리뷰
7. PR 머지 → 프로덕션 자동 배포
```

#### 프리뷰 배포의 장점

| 장점 | 설명 |
|------|------|
| **코드 리뷰 향상** | 코드뿐 아니라 실제 동작하는 사이트를 보고 리뷰 |
| **비개발자 참여** | 기획자, 디자이너도 프리뷰 URL로 확인 가능 |
| **환경 격리** | 프리뷰 배포끼리 서로 영향 없음 |
| **자동 정리** | PR 닫히면 프리뷰 배포 자동 제거 |

#### Vercel 프리뷰 배포 설정

```json
// vercel.json
{
  "github": {
    "enabled": true,
    "autoAlias": true,
    "silent": false
  },
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ]
}
```

#### 프리뷰 배포에 환경변수 적용

```bash
# 프리뷰 환경 전용 변수 설정
vercel env add DATABASE_URL preview
# → 스테이징 DB URL 입력

vercel env add API_KEY preview
# → 테스트용 API 키 입력
```

### Edge Functions

Edge Functions는 사용자에게 가까운 서버(Edge)에서 실행되는 **서버리스 함수**입니다.

```
[일반 서버리스 vs Edge Functions]

일반 서버리스:
사용자(서울) → 서버(미국 버지니아) → 응답 (150~200ms)

Edge Functions:
사용자(서울) → Edge(서울/도쿄) → 응답 (10~50ms)
```

#### Edge Function 구현 예시

```javascript
// api/hello.js
// Vercel Edge Function 예시

export const config = {
  runtime: 'edge',    // Edge 런타임 지정
};

export default function handler(request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name') || '방문자';

  return new Response(
    JSON.stringify({
      message: `안녕하세요, ${name}님!`,
      timestamp: new Date().toISOString(),
      region: request.headers.get('x-vercel-ip-country') || 'unknown',
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60',
      },
    }
  );
}
```

#### API 라우트 활용

```javascript
// api/visitors.js
// 방문자 수 카운트 API (KV Storage 활용)

import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // 현재 방문자 수 조회
    const count = await kv.get('visitor-count') || 0;
    return res.json({ count });
  }

  if (req.method === 'POST') {
    // 방문자 수 증가
    const count = await kv.incr('visitor-count');
    return res.json({ count });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
```

### Vercel Analytics

```javascript
// Vercel Web Analytics 설치
// 1. 프로젝트에 패키지 추가
// npm install @vercel/analytics

// 2. 앱에 Analytics 추가
// src/main.jsx (React 프로젝트)
import { inject } from '@vercel/analytics';

inject();  // 이 한 줄로 분석 시작!
```

```javascript
// Vercel Speed Insights 추가
// npm install @vercel/speed-insights

// src/main.jsx
import { injectSpeedInsights } from '@vercel/speed-insights';

injectSpeedInsights();
```

Vercel 대시보드에서 확인할 수 있는 정보:

| 지표 | 설명 |
|------|------|
| **페이지뷰** | 각 페이지 방문 수 |
| **고유 방문자** | 중복 제거된 방문자 수 |
| **Referrer** | 어디서 유입됐는지 |
| **Top Pages** | 가장 많이 방문한 페이지 |
| **Web Vitals** | LCP, FID, CLS 등 성능 지표 |
| **지역별 방문자** | 국가/도시별 접속 현황 |

체크포인트:
- [ ] PR별 프리뷰 배포의 개념과 장점을 이해했다
- [ ] Edge Functions와 일반 서버리스 함수의 차이를 알았다
- [ ] Vercel Analytics를 프로젝트에 추가할 수 있다

---

## 5. Firebase Hosting

### 학습 목표

- Firebase Hosting의 특징과 장점을 이해한다
- Firebase CLI로 프로젝트를 배포할 수 있다
- 멀티 사이트와 Cloud Functions를 연동할 수 있다

### Firebase Hosting이란?

Firebase Hosting은 Google이 제공하는 **정적 웹 호스팅 서비스**입니다. Google의 글로벌 CDN을 사용하여 빠른 로딩 속도를 제공합니다.

| 항목 | Firebase Hosting | Vercel | Netlify |
|------|-----------------|--------|---------|
| **무료 용량** | 10GB 저장, 월 360MB 전송 | 100GB 대역폭 | 100GB 대역폭 |
| **CDN** | Google 글로벌 CDN | Vercel Edge Network | Netlify Edge |
| **SSL** | 자동 (무료) | 자동 (무료) | 자동 (무료) |
| **커스텀 도메인** | 지원 | 지원 | 지원 |
| **서버리스 함수** | Cloud Functions | Edge/Serverless | Netlify Functions |
| **DB 연동** | Firestore, RTDB | 외부 연동 | 외부 연동 |
| **장점** | Google 생태계 통합 | React/Next.js 최적화 | 간편한 배포 |

### Firebase CLI 설치 및 초기화

```bash
# Firebase CLI 설치
npm install -g firebase-tools

# Firebase 로그인
firebase login
# → 브라우저가 열리며 Google 계정으로 로그인

# 로그인 확인
firebase projects:list
```

#### 프로젝트 초기화

```bash
# Firebase 초기화 (프로젝트 루트에서 실행)
firebase init hosting

# 대화형 설정 과정:
# ? What do you want to use as your public directory?
# → dist (또는 build, 프로젝트에 따라 다름)
#
# ? Configure as a single-page app (rewrite all urls to /index.html)?
# → Yes (React/Vue 등 SPA인 경우)
#
# ? Set up automatic builds and deploys with GitHub?
# → Yes (GitHub Actions 연동 시)
```

초기화 후 생성되는 파일:

```json
// firebase.json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      },
      {
        "source": "**/*.@(jpg|jpeg|gif|png|svg|webp)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=86400"
          }
        ]
      }
    ]
  }
}
```

### 배포 실습

```bash
# 1. 프로젝트 빌드
npm run build

# 2. 로컬 프리뷰 (배포 전 확인)
firebase emulators:start
# → http://localhost:5000 에서 확인

# 3. 프로덕션 배포
firebase deploy --only hosting
# → https://my-project.web.app 에서 확인

# 4. 배포 이력 확인
firebase hosting:channel:list
```

### 멀티 사이트 호스팅

하나의 Firebase 프로젝트에서 **여러 사이트**를 호스팅할 수 있습니다.

```json
// firebase.json (멀티 사이트 설정)
{
  "hosting": [
    {
      "target": "main-site",
      "public": "dist/main",
      "rewrites": [
        { "source": "**", "destination": "/index.html" }
      ]
    },
    {
      "target": "admin-panel",
      "public": "dist/admin",
      "rewrites": [
        { "source": "**", "destination": "/index.html" }
      ]
    },
    {
      "target": "api-docs",
      "public": "dist/docs"
    }
  ]
}
```

```bash
# 사이트 타겟 설정
firebase target:apply hosting main-site my-project-main
firebase target:apply hosting admin-panel my-project-admin
firebase target:apply hosting api-docs my-project-docs

# 특정 사이트만 배포
firebase deploy --only hosting:main-site
firebase deploy --only hosting:admin-panel

# 전체 배포
firebase deploy --only hosting
```

### Cloud Functions 연동

```javascript
// functions/index.js
const functions = require('firebase-functions');

// HTTP 함수
exports.api = functions.https.onRequest((req, res) => {
  res.json({
    message: '안녕하세요! Firebase Cloud Functions입니다.',
    timestamp: new Date().toISOString()
  });
});

// 스케줄 함수 (매일 오전 9시 실행)
exports.dailyReport = functions.pubsub
  .schedule('0 9 * * *')
  .timeZone('Asia/Seoul')
  .onRun(async (context) => {
    console.log('일일 리포트 생성 중...');
    // 리포트 생성 로직
  });
```

```json
// firebase.json에 Cloud Functions → Hosting 연동
{
  "hosting": {
    "public": "dist",
    "rewrites": [
      {
        "source": "/api/**",
        "function": "api"
      },
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

#### GitHub Actions로 Firebase 자동 배포

```yaml
# .github/workflows/deploy-firebase.yml
name: Firebase 자동 배포

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Node.js 설치
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: 의존성 설치
        run: npm ci

      - name: 빌드
        run: npm run build

      - name: Firebase 배포
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: my-project-id
```

체크포인트:
- [ ] Firebase CLI를 설치하고 프로젝트를 초기화할 수 있다
- [ ] firebase deploy 명령으로 사이트를 배포할 수 있다
- [ ] 멀티 사이트 호스팅 설정을 이해했다
- [ ] Cloud Functions와 Hosting을 연동하는 방법을 알았다

---

## 6. 데이터베이스 연동 배포

### 학습 목표

- Supabase, Firebase, PlanetScale의 특징을 비교하고 선택할 수 있다
- Supabase 프로젝트를 직접 만들고(가입→리전→테이블→RLS→키→연결) 정적 사이트에 붙일 수 있다
- 2026년 신규 API 키 체계(`sb_publishable_`/`sb_secret_`)의 차이와 노출 규칙을 안다
- 데이터베이스 마이그레이션과 시딩의 개념을 이해한다
- DB가 포함된 풀스택 앱을 안전하게 배포할 수 있다

### 클라우드 데이터베이스 비교

바이브코딩으로 만든 프로젝트에 데이터를 저장하려면 **클라우드 데이터베이스**가 필요합니다.

| 항목 | Supabase | Firebase (Firestore) | PlanetScale |
|------|----------|---------------------|-------------|
| **유형** | PostgreSQL (관계형) | NoSQL (문서형) | MySQL (관계형) |
| **무료 플랜** | 2개 프로젝트, 500MB | Spark (무료) | Hobby (1개 DB) |
| **실시간** | 지원 | 지원 (기본) | 미지원 |
| **인증** | 내장 (Auth) | 내장 (Auth) | 외부 연동 |
| **파일 저장** | Storage | Cloud Storage | 외부 연동 |
| **난이도** | 중간 | 쉬움 | 중간~어려움 |
| **쿼리 방식** | SQL + REST API | SDK (NoSQL) | SQL |
| **적합한 프로젝트** | 관계형 데이터, API 중심 | 실시간 앱, 모바일 | 대용량, 복잡한 쿼리 |

> **최종 검증일**: 2026-06-28 · Supabase는 무료 한도(DB 500MB·이그레스 5GB·MAU 5만)와 키 체계가 바뀝니다. 정확한 수치는 [공식 가격 페이지](https://supabase.com/pricing)에서 확인하세요. 무료 프로젝트는 **1주 비활성 시 자동 정지**되므로 발표 전날 한 번 깨워두세요.

### Supabase 실전 연동 핸즈온 (가입 → 리전 → 테이블 → RLS → 키 → 연결)

"새로고침하면 사라지는 글"을 "DB에 영구 저장되는 데이터"로 바꾸는 전 과정입니다. 여기서 만든 `guestbook` 테이블은 9장 방명록 앱에서 그대로 씁니다.

#### 1단계 — 가입

1. [supabase.com](https://supabase.com) → **"Start your project"**.
2. **GitHub 계정으로 가입** 권장(배포 연동까지 일관됨).
3. 개인 작업은 기본 조직(Organization)을 그대로 사용한다.

#### 2단계 — 프로젝트 생성·리전 선택 (★한국 = Asia)

1. 대시보드 → **"New Project"**.
2. 입력 항목:
   - **Name**: `guestbook-app`
   - **Database Password**: DB 비밀번호 — **반드시 안전하게 보관**(재확인이 까다로움)
   - **Region**: ★ **Northeast Asia (Seoul) / `ap-northeast-2`** — 한국 사용자 대상이면 지연 최소
   - **Plan**: Free
3. **★ 리전은 생성 후 변경 불가**입니다. 한국 서비스는 반드시 Seoul을 고르세요.
4. 생성 후 약 1~2분 프로비저닝을 기다립니다.

> [스크린샷 자리] Supabase "New Project" 화면 — Region 드롭다운에서 Northeast Asia (Seoul)을 선택한 모습

체크포인트:
- [ ] 리전을 Seoul로 지정해 프로젝트를 생성했다 (생성 후 변경 불가임을 안다)
- [ ] DB 비밀번호를 안전한 곳에 보관했다

#### 3단계 — 테이블/스키마 만들기

`SQL Editor`에 아래를 붙여넣고 실행합니다(GUI Table Editor로도 가능하지만, SQL 한 덩어리가 재현성이 좋습니다).

```sql
-- 방명록 테이블
create table public.guestbook (
  id          bigint generated always as identity primary key,
  name        text not null,
  message     text not null,
  created_at  timestamptz not null default now()
);
```

#### 4단계 — RLS(행 수준 보안) 정책 추가 (★보안 핵심)

**RLS는 "테이블마다 자동으로 WHERE 조건을 붙이는" 보안 장치**입니다. RLS를 켜지 않으면 공개 키만으로 누구나 전체 테이블을 읽고 쓸 수 있어 **사고로 직결**됩니다. 반대로 켜기만 하고 정책을 안 넣으면 아무것도 안 보입니다(빈 배열). **켜되, 정책을 명시**하세요.

```sql
-- (1) RLS 활성화
alter table public.guestbook enable row level security;

-- (2) 모두 읽기 허용
create policy "Anyone can read guestbook"
  on public.guestbook
  for select
  using (true);

-- (3) 모두 작성 허용 (본문만)
create policy "Anyone can insert guestbook"
  on public.guestbook
  for insert
  with check (true);
```

원리:
- RLS를 켜면 **기본은 "모두 거부"**. 정책으로 "허용"을 명시해야 통과합니다.
- `for select ... using (true)` = 읽기 전부 허용 / `for insert ... with check (true)` = 쓰기 전부 허용.
- 삭제·수정을 막으려면 `delete`/`update` 정책을 **만들지 않으면 됩니다**(없으면 자동 거부).

> **교안 강조**: "RLS를 끄고 배포 = 현관문 열어두고 외출." 바이브코딩 배포 사고 1순위입니다.

> [스크린샷 자리] Supabase Table Editor에서 guestbook 테이블에 "RLS enabled" 표시와 정책 2개가 보이는 화면

체크포인트:
- [ ] guestbook 테이블에 RLS를 켰다
- [ ] select·insert 정책을 추가했고, delete/update 정책은 일부러 안 만들었다

#### 5단계 — API 키 확인 (★2026 신규 체계: publishable / secret)

대시보드 → **Project Settings → API**(또는 API Keys)에서 **프로젝트 URL**과 키를 확인합니다. 2026년에 새로 만든 프로젝트는 옛 `anon`/`service_role`이 아니라 **새 키 형식**을 봅니다.

| 키 | 2026 신규 형식 | 옛(레거시) 형식 | 역할 | 노출 |
|----|----------------|------------------|------|------|
| **공개 키** | `sb_publishable_...` | `anon` (JWT) | 브라우저·클라이언트용. **RLS 범위 내**에서만 동작 | **공개 가능** (단 RLS 필수) |
| **비밀 키** | `sb_secret_...` | `service_role` (JWT) | 서버·엣지 함수용. **RLS 우회** | **절대 노출 금지** |

- **공개 키(publishable/anon)**: 권한이 낮고 RLS가 모든 것을 거릅니다. HTML/JS에 박아도 됩니다.
- **비밀 키(secret/service_role)**: **모든 RLS를 건너뛰고** DB 전체를 읽고/쓰고/지웁니다. 브라우저·모바일·CLI·**깃허브에 절대 넣지 마세요.** 공식 문구: "Never use in a browser, even on localhost."

> **안전 수칙**: 공개해도 되는 것 = 프로젝트 URL, publishable(anon) 키. **절대 공개 금지** = secret(service_role) 키, DB 비밀번호. 안전의 전제는 **RLS가 켜져 있을 것**. 비밀 키가 깃허브에 올라가면 끝입니다.

> [스크린샷 자리] Supabase API 설정 화면 — Project URL과 sb_publishable_ 키, sb_secret_ 키(가려진 상태)가 보이는 화면

체크포인트:
- [ ] 프로젝트 URL과 공개 키(publishable/anon)를 복사했다
- [ ] 비밀 키(secret/service_role)는 코드·깃허브에 절대 넣지 않는다는 것을 안다

#### 6단계 — `@supabase/supabase-js` 클라이언트 연결 (CDN)

정적 HTML이면 빌드 없이 **CDN**으로 바로 붙입니다.

```html
<!-- supabase-js v2 CDN 로드 -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script>
  const { createClient } = window.supabase;

  const SUPABASE_URL = 'https://<프로젝트ID>.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_xxxxx'; // 공개 키 (또는 레거시 anon)

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
</script>
```

번들러/프레임워크(러버블 export·Vite·Next.js)에서는 npm 설치 + 환경변수로 관리합니다.

```bash
npm install @supabase/supabase-js
```

```js
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
)
```

기본 동작 두 가지를 기억하세요.
- `insert()`는 기본적으로 넣은 행을 **반환하지 않습니다**. 받으려면 `.select()`를 체이닝합니다.
- 반환은 항상 `{ data, error }` 구조 → **`error` 체크를 습관화**합니다.

체크포인트:
- [ ] supabase-js CDN(또는 npm)으로 클라이언트를 초기화했다
- [ ] insert/select가 `{ data, error }`를 돌려준다는 것을 이해했다

### Supabase 연동 배포 (CLI 마이그레이션)

> 위 핸즈온이 "대시보드에서 직접" 붙이는 길이라면, 아래는 **마이그레이션을 코드로 관리**하는 팀 협업용 흐름입니다.

#### 프로젝트 생성 및 연결

```bash
# Supabase CLI 설치
npm install -g supabase

# 로그인
supabase login

# 프로젝트 초기화
supabase init

# 원격 프로젝트 연결
supabase link --project-ref your-project-ref
```

#### 마이그레이션 (Migration)

마이그레이션은 데이터베이스의 구조(테이블, 칼럼 등)를 **코드로 관리**하는 방법입니다.

```bash
# 새 마이그레이션 파일 생성
supabase migration new create_users_table
```

```sql
-- supabase/migrations/20260309000001_create_users_table.sql
-- 사용자 테이블 생성
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 게시물 테이블 생성
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 인덱스 생성 (검색 성능 향상)
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_published ON posts(published);

-- RLS (Row Level Security) 활성화
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- RLS 정책: 본인 데이터만 조회/수정 가능
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);
```

```bash
# 마이그레이션 적용 (로컬)
supabase db reset

# 마이그레이션 적용 (원격, 운영)
supabase db push
```

#### 시딩 (Seeding)

시딩은 데이터베이스에 **초기 데이터**를 넣는 작업입니다. 개발이나 테스트 환경에서 주로 사용합니다.

```sql
-- supabase/seed.sql
-- 테스트 사용자 데이터
INSERT INTO users (id, email, name) VALUES
  ('11111111-1111-1111-1111-111111111111', 'test1@example.com', '테스트 사용자 1'),
  ('22222222-2222-2222-2222-222222222222', 'test2@example.com', '테스트 사용자 2');

-- 테스트 게시물 데이터
INSERT INTO posts (user_id, title, content, published) VALUES
  ('11111111-1111-1111-1111-111111111111', '첫 번째 게시물', '안녕하세요!', true),
  ('11111111-1111-1111-1111-111111111111', '두 번째 게시물', '두 번째 글입니다.', false),
  ('22222222-2222-2222-2222-222222222222', '다른 사용자 게시물', '반갑습니다.', true);
```

#### 환경별 DB 분리

```bash
# 개발용 Supabase 프로젝트
# supabase start (로컬 Docker 환경)

# 스테이징용 Supabase 프로젝트
# → supabase 대시보드에서 별도 프로젝트 생성

# 운영용 Supabase 프로젝트
# → supabase 대시보드에서 별도 프로젝트 생성
```

```bash
# .env.development  (2026 신규 프로젝트는 sb_publishable_ 형식 / 옛 프로젝트는 anon 키)
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_local...key

# .env.staging
VITE_SUPABASE_URL=https://staging-xxx.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_staging...key

# .env.production
VITE_SUPABASE_URL=https://prod-xxx.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_prod...key
```

> 공개 키만 클라이언트(`VITE_`)에 둡니다. **비밀 키(`sb_secret_`/service_role)는 절대 `VITE_`/`NEXT_PUBLIC_` 접두사로 노출하지 마세요.**

### Firebase Firestore 연동

```javascript
// src/lib/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
```

```javascript
// Firestore 보안 규칙 (firestore.rules)
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 인증된 사용자만 읽기/쓰기 가능
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    match /posts/{postId} {
      allow read: if resource.data.published == true;
      allow write: if request.auth != null
                   && request.auth.uid == resource.data.userId;
    }
  }
}
```

### DB 배포 체크리스트

배포 전 데이터베이스 관련 확인 사항:

```
[ ] 마이그레이션 파일이 최신 상태인가?
[ ] 시딩 데이터에 민감한 정보(실제 이메일, 비밀번호)가 없는가?
[ ] 환경별 DB 접속 정보가 올바른가?
[ ] RLS 또는 보안 규칙이 적용되어 있는가?
[ ] 운영 DB에 테스트 데이터가 들어가지 않도록 확인했는가?
[ ] DB 백업 설정이 되어 있는가?
[ ] 인덱스가 필요한 쿼리에 인덱스를 추가했는가?
```

체크포인트:
- [ ] Supabase, Firebase, PlanetScale의 차이를 비교할 수 있다
- [ ] Supabase 프로젝트를 직접 만들고 RLS·키·연결까지 이해했다
- [ ] 2026 신규 키(publishable/secret)의 노출 규칙을 안다
- [ ] 마이그레이션과 시딩의 개념을 이해했다
- [ ] 환경별로 DB를 분리하여 관리하는 방법을 알았다
- [ ] DB 보안 규칙(RLS, Firestore Rules)의 중요성을 이해했다

---

## 7. 도메인과 SSL

### 학습 목표

- DNS 레코드의 종류와 역할을 이해한다
- 커스텀 도메인을 배포 플랫폼에 연결할 수 있다
- SSL 인증서와 CDN의 원리를 파악한다

### DNS(Domain Name System) 기초

DNS는 도메인 이름(예: my-app.com)을 IP 주소(예: 76.76.21.21)로 변환해주는 시스템입니다.

```
[사용자가 my-app.com 접속 시]

사용자: "my-app.com 접속!"
    ↓
브라우저: DNS 서버에 물어봄 → "my-app.com의 IP가 뭐야?"
    ↓
DNS 서버: "76.76.21.21이야!"
    ↓
브라우저: 76.76.21.21 서버에 접속 → 웹 페이지 로딩
```

### DNS 레코드 종류

| 레코드 타입 | 용도 | 값 예시 | 설명 |
|------------|------|--------|------|
| **A** | 도메인 → IPv4 | `76.76.21.21` | 가장 기본적인 레코드 |
| **AAAA** | 도메인 → IPv6 | `2606:4700::1` | IPv6 주소 연결 |
| **CNAME** | 도메인 → 다른 도메인 | `cname.vercel-dns.com` | 별칭(Alias) 설정 |
| **TXT** | 텍스트 정보 | `v=spf1 include:...` | 도메인 소유 인증, 이메일 설정 |
| **MX** | 메일 서버 | `10 mail.google.com` | 이메일 수신 서버 |
| **NS** | 네임 서버 | `ns1.cloudflare.com` | DNS 관리 서버 지정 |

### 서브도메인 설정

```
[도메인 구조]

my-app.com           → 메인 사이트 (A 레코드)
www.my-app.com        → 메인 사이트 (CNAME → my-app.com)
api.my-app.com        → API 서버 (A 레코드 또는 CNAME)
staging.my-app.com    → 스테이징 환경 (CNAME)
admin.my-app.com      → 관리자 패널 (CNAME)
docs.my-app.com       → 문서 사이트 (CNAME)
```

#### DNS 설정 예시 (Cloudflare)

```
Type    Name        Content                 TTL     Proxy
A       @           76.76.21.21             Auto    Proxied
CNAME   www         my-app.com              Auto    Proxied
CNAME   api         api-server.railway.app  Auto    DNS only
CNAME   staging     staging-my-app.vercel.app Auto  DNS only
CNAME   admin       admin-my-app.vercel.app Auto    DNS only
```

### Vercel에 커스텀 도메인 연결

```bash
# Vercel CLI로 도메인 추가
vercel domains add my-app.com

# 도메인 확인
vercel domains ls

# DNS 레코드 확인
vercel domains inspect my-app.com
```

Vercel 대시보드에서 도메인을 추가하면 아래와 같은 DNS 설정 안내가 표시됩니다.

```
Vercel 도메인 설정 안내:

┌──────────────────────────────────────────────────┐
│ Domain: my-app.com                               │
│                                                  │
│ DNS Records to add:                              │
│                                                  │
│ Type: A                                          │
│ Name: @                                          │
│ Value: 76.76.21.21                               │
│                                                  │
│ Type: CNAME                                      │
│ Name: www                                        │
│ Value: cname.vercel-dns.com                      │
│                                                  │
│ Status: Pending verification...                  │
│ (DNS 전파에 최대 48시간 소요)                      │
└──────────────────────────────────────────────────┘
```

### SSL 인증서 (HTTPS)

SSL(Secure Sockets Layer) 인증서는 웹사이트와 사용자 간의 통신을 **암호화**해줍니다.

```
[HTTP vs HTTPS]

HTTP:  사용자 ─── 평문 데이터 ──→ 서버  (누구나 읽을 수 있음)
HTTPS: 사용자 ─── 암호화 데이터 ──→ 서버  (중간에서 읽을 수 없음)
```

#### SSL 인증서 발급 방법

| 방법 | 비용 | 갱신 | 난이도 |
|------|------|------|--------|
| **Let's Encrypt** | 무료 | 90일마다 (자동 갱신 가능) | 보통 |
| **Vercel/Netlify 자동** | 무료 | 자동 | 매우 쉬움 |
| **Cloudflare** | 무료 | 자동 | 쉬움 |
| **유료 인증서** | 연 5~50만 원 | 1년 | 보통 |

> **핵심 포인트**: Vercel, Netlify, Cloudflare를 사용하면 SSL 인증서가 **자동으로 발급**됩니다. 별도의 설정이 필요 없습니다!

### CDN (Content Delivery Network)

CDN은 전 세계에 분산된 서버 네트워크를 통해 콘텐츠를 **가장 가까운 서버**에서 제공합니다.

```
[CDN 없이]
서울 사용자 → 미국 서버에서 로딩 (200ms)
부산 사용자 → 미국 서버에서 로딩 (200ms)

[CDN 사용]
서울 사용자 → 서울 CDN 서버에서 로딩 (20ms)
부산 사용자 → 부산 CDN 서버에서 로딩 (25ms)
```

#### Cloudflare CDN 설정

```
[Cloudflare 설정 순서]

1. cloudflare.com 가입
2. 도메인 추가 (my-app.com)
3. 네임서버 변경 안내에 따라 도메인 등록 업체에서 NS 변경
4. DNS 레코드 설정
5. SSL/TLS → Full (strict) 선택
6. 캐싱 규칙 설정
```

```
Cloudflare 캐싱 설정:

Page Rules:
┌────────────────────────────────────────┐
│ URL: my-app.com/assets/*               │
│ Cache Level: Cache Everything          │
│ Edge Cache TTL: 1 month                │
│ Browser Cache TTL: 1 year              │
├────────────────────────────────────────┤
│ URL: my-app.com/api/*                  │
│ Cache Level: Bypass                    │
│ (API는 캐싱하지 않음)                    │
├────────────────────────────────────────┤
│ URL: my-app.com/*                      │
│ Cache Level: Standard                  │
│ Browser Cache TTL: 4 hours             │
└────────────────────────────────────────┘
```

### 도메인 구매 가이드

| 등록 업체 | 특징 | 가격 (.com 기준) |
|----------|------|-----------------|
| **Cloudflare Registrar** | 원가 판매, 무료 DNS/CDN | 연 약 $9.77 |
| **Namecheap** | 저렴, 다양한 도메인 | 연 약 $8.88~ |
| **Google Domains** | 간편, Google 연동 | 연 약 $12 |
| **가비아** | 한국 업체, .kr 도메인 | 연 약 2만 원~ |
| **카페24** | 한국 업체, 호스팅 연동 | 연 약 1.5만 원~ |

> **팁**: .com 도메인은 Cloudflare Registrar가 **원가 판매**이므로 가장 저렴합니다. .kr 도메인은 가비아나 카페24가 편리합니다.

체크포인트:
- [ ] DNS 레코드(A, CNAME, TXT)의 역할을 설명할 수 있다
- [ ] 서브도메인을 설정하는 방법을 이해했다
- [ ] SSL 인증서의 필요성과 자동 발급 방법을 알았다
- [ ] CDN의 원리와 Cloudflare 설정 방법을 이해했다

---

## 8. 모니터링과 로깅

### 학습 목표

- 배포 후 모니터링이 필요한 이유를 이해한다
- Core Web Vitals 지표를 파악하고 개선할 수 있다
- Sentry로 에러를 추적하고 관리할 수 있다

### 왜 모니터링이 필요한가?

```
[모니터링 없이 운영하면?]

사용자: "사이트가 안 들어가져요" (3시간 전부터)
개발자: "네? 지금요?" (모르고 있었음)
    → 원인 파악에 2시간
    → 총 5시간 장애

[모니터링이 있으면?]

모니터링 시스템: "알림! 에러율 급증, 페이지 로딩 5초 초과"
개발자: (즉시 확인) → 원인 파악 30분 → 해결
    → 총 1시간 이내 복구
```

### Core Web Vitals

Google이 정의한 웹 성능의 핵심 3가지 지표입니다. **검색 순위에도 영향**을 미칩니다.

| 지표 | 이름 | 측정 대상 | 좋음 | 보통 | 나쁨 |
|------|------|----------|------|------|------|
| **LCP** | Largest Contentful Paint | 가장 큰 요소 로딩 시간 | 2.5초 이하 | 4초 이하 | 4초 초과 |
| **INP** | Interaction to Next Paint | 사용자 입력 반응 속도 | 200ms 이하 | 500ms 이하 | 500ms 초과 |
| **CLS** | Cumulative Layout Shift | 레이아웃 변동 정도 | 0.1 이하 | 0.25 이하 | 0.25 초과 |

#### LCP 개선 방법

```html
<!-- 이미지 최적화 -->
<!-- 나쁜 예 -->
<img src="hero-image.png" alt="히어로 이미지">

<!-- 좋은 예 -->
<img
  src="hero-image.webp"
  alt="히어로 이미지"
  width="1200"
  height="630"
  loading="eager"
  fetchpriority="high"
  decoding="async"
>

<!-- 폰트 사전 로딩 -->
<link rel="preload" href="/fonts/pretendard.woff2" as="font" type="font/woff2" crossorigin>

<!-- 핵심 CSS 인라인 -->
<style>
  /* 위 폴드(첫 화면) 렌더링에 필요한 핵심 CSS만 인라인 */
  .hero { display: flex; min-height: 60vh; }
</style>
```

#### CLS 개선 방법

```css
/* 이미지/비디오에 크기 지정 (레이아웃 흔들림 방지) */
img, video {
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 9;  /* 비율 고정 */
}

/* 폰트 로딩 시 레이아웃 이동 방지 */
@font-face {
  font-family: 'Pretendard';
  src: url('/fonts/pretendard.woff2') format('woff2');
  font-display: swap;         /* FOUT 허용, FOIT 방지 */
  size-adjust: 100%;           /* 대체 폰트와 크기 맞춤 */
}
```

### Sentry 에러 모니터링

Sentry는 프로덕션 환경에서 발생하는 에러를 **실시간으로 수집하고 분석**해주는 서비스입니다.

```bash
# Sentry SDK 설치
npm install @sentry/react

# 또는 Vite 전용
npm install @sentry/vite-plugin
```

```javascript
// src/main.jsx
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.VITE_APP_ENV,

  // 성능 모니터링 (선택)
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],

  // 트랜잭션 샘플링 비율 (10%)
  tracesSampleRate: 0.1,

  // 세션 리플레이 샘플링
  replaysSessionSampleRate: 0.1,   // 일반 세션 10% 기록
  replaysOnErrorSampleRate: 1.0,   // 에러 세션 100% 기록
});
```

#### Sentry 커스텀 에러 전송

```javascript
// 수동으로 에러 보고
try {
  await riskyOperation();
} catch (error) {
  Sentry.captureException(error, {
    tags: {
      feature: 'payment',
      severity: 'critical',
    },
    extra: {
      userId: currentUser.id,
      action: 'checkout',
    },
  });
}

// 사용자 정보 연결
Sentry.setUser({
  id: user.id,
  email: user.email,
  username: user.name,
});

// 성능 측정
const transaction = Sentry.startTransaction({
  name: 'loadDashboard',
  op: 'page.load',
});
// ... 대시보드 로딩 로직 ...
transaction.finish();
```

### 로그 관리

```javascript
// src/utils/logger.js
// 환경별 로그 관리 유틸리티

const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

const currentLevel = import.meta.env.VITE_APP_ENV === 'production'
  ? LOG_LEVELS.ERROR      // 운영: 에러만 출력
  : LOG_LEVELS.DEBUG;     // 개발: 전부 출력

const logger = {
  debug: (...args) => {
    if (currentLevel <= LOG_LEVELS.DEBUG) {
      console.debug('[DEBUG]', ...args);
    }
  },

  info: (...args) => {
    if (currentLevel <= LOG_LEVELS.INFO) {
      console.info('[INFO]', ...args);
    }
  },

  warn: (...args) => {
    if (currentLevel <= LOG_LEVELS.WARN) {
      console.warn('[WARN]', ...args);
    }
  },

  error: (...args) => {
    if (currentLevel <= LOG_LEVELS.ERROR) {
      console.error('[ERROR]', ...args);

      // 운영 환경에서는 Sentry에도 전송
      if (import.meta.env.VITE_APP_ENV === 'production') {
        Sentry.captureMessage(args.join(' '), 'error');
      }
    }
  },
};

export default logger;
```

### 모니터링 대시보드 구성

```
[추천 모니터링 스택]

┌─────────────────────────────────────────────────┐
│               모니터링 대시보드                    │
├───────────┬───────────┬───────────┬─────────────┤
│ 성능 지표  │ 에러 추적  │ 사용자 분석 │ 가동 시간   │
│           │           │           │             │
│ Vercel    │ Sentry    │ Vercel    │ UptimeRobot │
│ Analytics │           │ Analytics │ (무료)       │
│           │           │           │             │
│ - LCP     │ - 에러 수  │ - 방문자   │ - 5분 간격  │
│ - INP     │ - 에러 유형│ - 페이지뷰 │ - 알림 설정 │
│ - CLS     │ - 스택추적 │ - 유입 경로│ - 장애 기록 │
└───────────┴───────────┴───────────┴─────────────┘
```

#### UptimeRobot 설정 (무료 가동 시간 모니터링)

```
UptimeRobot (https://uptimerobot.com) 설정:

1. 무료 계정 생성
2. "Add New Monitor" 클릭
3. Monitor Type: HTTP(s)
4. Friendly Name: "My App Production"
5. URL: https://my-app.com
6. Monitoring Interval: 5 minutes
7. Alert Contacts: 이메일, 슬랙 웹훅 등 설정

→ 사이트가 다운되면 즉시 이메일/슬랙 알림!
```

체크포인트:
- [ ] Core Web Vitals 3가지 지표(LCP, INP, CLS)를 설명할 수 있다
- [ ] LCP와 CLS를 개선하는 기본 방법을 알았다
- [ ] Sentry를 프로젝트에 연동하는 방법을 이해했다
- [ ] 환경별 로그 레벨 관리의 필요성을 이해했다

---

## 9. 실전 프로젝트: 방명록 앱 만들고 배포하기

### 학습 목표

- 순수 HTML/JS + supabase-js로 방명록(닉네임+메시지)을 insert/select 구현한다
- 같은 앱을 Vercel과 Replit에 각각 배포해 두 플랫폼의 모델 차이를 몸으로 안다
- 정적/풀스택 상황에 맞는 플랫폼 조합 선택 기준을 세운다

> **개인정보 보호**: 방명록에는 **닉네임 또는 익명만** 사용하세요. 실명·이메일·전화번호 등 개인정보를 남기지 않도록 안내 문구를 넣습니다.

### 무엇을 만드나

6장에서 만든 `guestbook` 테이블(닉네임 `name` + 메시지 `message`)에, 누구나 글을 남기고 모두가 읽는 **방명록**을 붙입니다. 빌드 도구 없이 **HTML 파일 하나**로 완성되며, 그대로 Vercel에 올립니다.

#### Step 1 — 완성형 방명록 HTML (복붙 가능)

아래 한 파일을 `index.html`로 저장하고, `<프로젝트ID>`와 공개 키만 본인 값으로 바꾸면 동작합니다.

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>방명록</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 560px; margin: 40px auto; padding: 0 16px; }
    form { display: flex; flex-direction: column; gap: 8px; margin-bottom: 24px; }
    input, textarea, button { padding: 10px; font-size: 1rem; }
    li { border-bottom: 1px solid #eee; padding: 10px 0; }
    .meta { color: #888; font-size: .8rem; }
  </style>
</head>
<body>
  <h1>방명록</h1>
  <p class="meta">닉네임/익명으로만 남겨 주세요. 실명·연락처 입력 금지.</p>

  <form id="gb-form">
    <input id="name" placeholder="닉네임" maxlength="20" required />
    <textarea id="message" placeholder="메시지" maxlength="200" required></textarea>
    <button type="submit">남기기</button>
  </form>
  <ul id="gb-list"></ul>

  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <script>
    const supabase = window.supabase.createClient(
      'https://<프로젝트ID>.supabase.co',
      'sb_publishable_xxxxx'   // 공개 키 — RLS로 보호되므로 노출 OK
    );

    // 1) 목록 불러오기 (최신순)
    async function loadGuestbook() {
      const { data, error } = await supabase
        .from('guestbook')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) { console.error(error); return; }
      document.getElementById('gb-list').innerHTML = data
        .map(function (r) {
          return '&lt;li&gt;&lt;b&gt;' + escapeHtml(r.name) + '&lt;/b&gt;: '
               + escapeHtml(r.message) + '&lt;/li&gt;';
        })
        .join('');
    }

    // 2) 글 남기기
    document.getElementById('gb-form').addEventListener('submit', async function (e) {
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const message = document.getElementById('message').value.trim();
      const { error } = await supabase
        .from('guestbook')
        .insert({ name: name, message: message });
      if (error) { alert('저장 실패: ' + error.message); return; }
      e.target.reset();
      loadGuestbook();
    });

    // XSS 방지: 사용자 입력을 그대로 innerHTML에 넣지 않도록 이스케이프
    function escapeHtml(s) {
      return String(s)
        .replace(/&/g, '&amp;')
        .replace(/&lt;/g, '&lt;')
        .replace(/&gt;/g, '&gt;');
    }

    loadGuestbook();
  </script>
</body>
</html>
```

> **보안 메모**: 사용자가 입력한 글을 `innerHTML`에 그대로 넣으면 스크립트 삽입(XSS) 위험이 있으므로 `escapeHtml`로 이스케이프합니다. 공개 키는 노출돼도 RLS가 막아주지만, **비밀 키는 이 파일에 절대 넣지 마세요.**

체크포인트:
- [ ] 로컬에서 글을 남기면 목록에 바로 뜨고, 새로고침해도 남아 있다
- [ ] 다른 브라우저(또는 휴대폰)에서 같은 글이 보인다 → "DB에 저장됐다"

#### Step 2 — Vercel에 배포

1. 이 `index.html`을 GitHub 저장소에 push.
2. 4장 "Vercel 풀 핸즈온" 그대로: **Add New Project → Import → Deploy**.
3. 정적 HTML이라 빌드 없이 즉시 `*.vercel.app`으로 공개된다.
4. 공개 URL을 휴대폰으로 열어 글을 남겨 본다.

> [스크린샷 자리] Vercel에 배포된 방명록 화면 — 입력 폼과 남겨진 글 목록이 보이는 모습

#### Step 3 — 같은 앱을 Replit로도 배포 (비교)

같은 앱을 **Replit**에도 올려 두 플랫폼의 모델 차이를 체감합니다.

1. [replit.com](https://replit.com) 가입 → **New project**(정적 HTML 템플릿 또는 GitHub Import).
   - GitHub Import: 주소창에 `https://replit.com/github.com/<owner>/<repo>` 입력 → 자동 import.
2. 같은 `index.html`을 두고 **Run**으로 미리보기.
3. 우상단 **Publish → 배포 유형 선택**: 정적 사이트이므로 **Static**(호스팅 무료) 권장.
4. **Deploy** → `*.replit.app` 공개 URL 발급.
5. ⚠️ **배포 실패 1위 원인**: 워크스페이스의 **Secrets는 배포로 자동 복사되지 않습니다.** 비밀값을 쓰는 앱이라면 Deployments 패널에 Secrets를 다시 넣어야 합니다(이 방명록은 공개 키만 쓰므로 해당 없음).

> **참고(검증 필요)**: Replit은 플랜·배포 정책·아시아 리전 노출이 자주 바뀝니다. 무료(Starter)는 공개 앱 1개·약 30일 후 만료·리전 북미 고정 등 제약이 있으니 [공식 문서](https://docs.replit.com)에서 현재 정책을 확인하세요.

#### Step 4 — Replit vs Vercel 비교

| 항목 | **Replit** | **Vercel** |
|------|-----------|-----------|
| 정체성 | 올인원 클라우드 IDE + 호스팅 | 프론트엔드/서버리스 배포 플랫폼 |
| 코드 에디터 | **내장**(브라우저 IDE) | 없음(외부 에디터 + Git 연동) |
| 백엔드(상시 서버) | **지원**(Reserved VM 등 풀스택) | 서버리스 함수 중심 |
| 데이터베이스 | **내장 PostgreSQL/KV** + 외부 연동 | 네이티브 DB 없음 → 외부 서비스 필요 |
| AI 빌더 | **Replit Agent**(자연어→앱) | v0(UI 생성 중심) |
| 배포 워크플로우 | 에디터에서 즉시 Publish | Git push → 자동 CI/CD |
| 무료 한도 | 공개 앱 1개·약 30일 만료·북미 고정 | Hobby(개인용)·대역폭/함수 한도 |
| 강점 | **풀스택을 한 곳에서**, 교육·프로토타입 | 프론트 성능·CDN·서버리스 프로덕션 |

이 방명록은 **데이터를 외부 Supabase에 두므로** 두 플랫폼 모두 "정적 호스팅"만 하면 됩니다. 그래서 차이가 잘 안 느껴질 수 있는데, 핵심은 이렇습니다.
- **Replit**은 DB·백엔드까지 한 프로젝트 안에서 끝낼 수 있습니다(내장 PostgreSQL을 쓰면 Supabase조차 필요 없음).
- **Vercel**은 프론트는 빠르게 뜨지만, **데이터 저장은 항상 외부 서비스(Supabase 등)**가 필요합니다.
- 결론: 둘은 경쟁이라기보다 **용도가 다릅니다.** 교사·초보자의 첫 풀스택은 Replit이 마찰이 적고, 정적/프론트 중심 프로덕션은 Vercel이 유리합니다.

#### 한 단계 위: 같은 방명록을 Next.js + Vercel로

순수 HTML 대신 **Next.js(App Router)**로 만들면 서버에서 데이터를 안전하게 다룰 수 있습니다. 비교만 가볍게 봅니다.

```jsx
// app/page.jsx  — 서버 컴포넌트에서 목록을 미리 읽어 렌더 (비밀 키를 서버에서만 사용)
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,            // 서버 전용 (NEXT_PUBLIC_ 안 붙임)
  process.env.SUPABASE_SECRET_KEY      // ★ 비밀 키 — 서버에서만, 절대 클라이언트로 안 감
);

export default async function Page() {
  const { data } = await supabase
    .from('guestbook')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    &lt;ul&gt;
      {data?.map(function (r) {
        return &lt;li key={r.id}&gt;&lt;b&gt;{r.name}&lt;/b&gt;: {r.message}&lt;/li&gt;;
      })}
    &lt;/ul&gt;
  );
}
```

```js
// app/api/guestbook/route.js — API 라우트(서버)에서 insert 처리
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

export async function POST(request) {
  const { name, message } = await request.json();
  const { error } = await supabase.from('guestbook').insert({ name, message });
  if (error) return Response.json({ ok: false }, { status: 500 });
  return Response.json({ ok: true });
}
```

| 구분 | 순수 HTML + supabase-js(CDN) | Next.js + Vercel |
|------|------------------------------|------------------|
| 키 위치 | 공개 키를 브라우저에 노출(RLS 의존) | **비밀 키를 서버에만** 둘 수 있음 |
| 데이터 읽기 | 브라우저에서 직접 select | 서버 컴포넌트에서 미리 렌더(빠른 첫 화면) |
| 데이터 쓰기 | 브라우저에서 직접 insert | **API 라우트(서버)**가 검증 후 insert |
| 환경변수 | 사실상 없음(파일에 직접) | `SUPABASE_SECRET_KEY`는 `NEXT_PUBLIC_` 없이 서버 전용 |
| 적합 단계 | 학습·데모·아주 작은 앱 | 검증·권한이 필요한 실서비스 |

> 핵심: 정적 방식은 **RLS가 유일한 방어선**이지만, Next.js 서버 방식은 **비밀 키를 서버에 숨기고** 입력을 한 번 더 검증할 수 있어 더 견고합니다.

### 플랫폼 조합 선택 기준표

"무엇을 만드느냐"에 따라 조합을 고릅니다.

| 상황 | 추천 조합 | 이유 |
|------|-----------|------|
| **정적만** (소개·포트폴리오·랜딩) | GitHub Pages / Netlify / Cloudflare(Workers) | 빌드·DB 불필요. 무료·간단. 정적 호스팅은 사실상 무료 |
| **API + DB 필요** (방명록·게시판·로그인) | Vercel + Supabase / Replit / Lovable | 프론트 + 영구 저장. Vercel은 외부 DB 필요, Replit은 내장 DB로 한 곳에서 |
| **팀 협업** (PR 리뷰·환경 분리) | Vercel + Supabase + GitHub Actions | PR 프리뷰·Production/Preview 환경 분리·CI/CD |
| **가장 간단** (코드 한 줄도 부담) | Replit(올인원) 또는 Lovable(자연어→앱) | 에디터+서버+DB+호스팅이 한 화면. 가입 분리 없음 |

체크포인트:
- [ ] 방명록을 로컬→Vercel→Replit 순으로 배포하고 같은 글이 보이는지 확인했다
- [ ] Vercel은 외부 DB가 필요하고 Replit은 내장 DB가 있다는 차이를 설명할 수 있다
- [ ] 내 다음 프로젝트에 맞는 플랫폼 조합을 선택 기준표에서 골랐다
- [ ] 방명록에 실명/연락처가 들어가지 않도록 안내 문구를 넣었다

---

## 10. 실전 프로젝트: 자동 배포 파이프라인

### 학습 목표

- 지금까지 배운 내용을 종합하여 풀스택 앱 자동 배포 파이프라인을 구축한다
- 환경 분리, CI/CD, 모니터링이 통합된 실전 프로젝트를 완성한다

### 프로젝트 개요: 할일 관리 앱 자동 배포

```
[완성할 배포 파이프라인]

개발자 로컬 환경
    ↓ git push (feature 브랜치)
GitHub: PR 생성
    ↓ CI 자동 실행
린트 검사 → 테스트 → 빌드
    ↓ 모두 통과
Vercel 프리뷰 배포 (팀 리뷰)
    ↓ PR 승인 + 머지 (main)
프로덕션 자동 배포
    ↓ 배포 완료
Sentry 모니터링 시작 + 슬랙 알림
```

### Step 1: 프로젝트 구조 설정

```
my-todo-app/
├── .github/
│   └── workflows/
│       ├── ci.yml              # CI 파이프라인
│       └── deploy.yml          # 배포 파이프라인
├── src/
│   ├── main.jsx                # 앱 진입점
│   ├── App.jsx                 # 메인 컴포넌트
│   ├── components/             # UI 컴포넌트
│   ├── lib/
│   │   ├── supabase.js         # Supabase 클라이언트
│   │   ├── sentry.js           # Sentry 설정
│   │   └── config.js           # 환경 설정
│   └── utils/
│       └── logger.js           # 로거 유틸리티
├── supabase/
│   ├── migrations/             # DB 마이그레이션
│   └── seed.sql                # 시드 데이터
├── .env.development            # 개발 환경변수
├── .env.staging                # 스테이징 환경변수
├── .env.example                # 환경변수 템플릿
├── .gitignore
├── firebase.json               # (Firebase 사용 시)
├── vercel.json                 # Vercel 설정
├── package.json
└── vite.config.js
```

### Step 2: CI 워크플로우 작성

```yaml
# .github/workflows/ci.yml
name: CI

on:
  pull_request:
    branches: [ main, develop ]

jobs:
  quality-check:
    name: 코드 품질 검사
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Node.js 설치
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: 의존성 설치
        run: npm ci

      - name: 타입 검사
        run: npm run type-check
        continue-on-error: false

      - name: 린트 검사
        run: npm run lint

      - name: 테스트
        run: npm test -- --coverage
        env:
          VITE_SUPABASE_URL: ${{ secrets.TEST_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.TEST_SUPABASE_KEY }}

      - name: 빌드 테스트
        run: npm run build

      - name: 번들 사이즈 체크
        run: |
          BUILD_SIZE=$(du -sh dist | cut -f1)
          echo "빌드 사이즈: $BUILD_SIZE"
          echo "## 빌드 결과" >> $GITHUB_STEP_SUMMARY
          echo "- 빌드 사이즈: $BUILD_SIZE" >> $GITHUB_STEP_SUMMARY
```

### Step 3: 배포 워크플로우 작성

```yaml
# .github/workflows/deploy.yml
name: 배포

on:
  push:
    branches: [ main ]

jobs:
  deploy-production:
    name: 프로덕션 배포
    runs-on: ubuntu-latest
    environment: production

    steps:
      - uses: actions/checkout@v4

      - name: Node.js 설치
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: 의존성 설치
        run: npm ci

      - name: 테스트
        run: npm test

      - name: 프로덕션 빌드
        run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.PROD_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.PROD_SUPABASE_KEY }}
          VITE_SENTRY_DSN: ${{ secrets.SENTRY_DSN }}
          VITE_APP_ENV: production

      - name: Supabase 마이그레이션
        run: |
          npx supabase link --project-ref ${{ secrets.SUPABASE_PROJECT_REF }}
          npx supabase db push
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}

      - name: Vercel 배포
        run: |
          npm install -g vercel@latest
          vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
          vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}
          vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

      - name: Sentry 릴리스 생성
        run: |
          npx @sentry/cli releases new ${{ github.sha }}
          npx @sentry/cli releases set-commits ${{ github.sha }} --auto
          npx @sentry/cli releases finalize ${{ github.sha }}
        env:
          SENTRY_AUTH_TOKEN: ${{ secrets.SENTRY_AUTH_TOKEN }}
          SENTRY_ORG: my-org
          SENTRY_PROJECT: my-todo-app

      - name: 배포 성공 알림
        if: success()
        run: |
          curl -X POST ${{ secrets.SLACK_WEBHOOK }} \
            -H 'Content-Type: application/json' \
            -d '{
              "text": "배포 완료! :white_check_mark:",
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "*프로덕션 배포 완료*\n커밋: `${{ github.sha }}`\n배포자: ${{ github.actor }}"
                  }
                }
              ]
            }'

      - name: 배포 실패 알림
        if: failure()
        run: |
          curl -X POST ${{ secrets.SLACK_WEBHOOK }} \
            -H 'Content-Type: application/json' \
            -d '{
              "text": "배포 실패! :x: 확인이 필요합니다.",
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "*프로덕션 배포 실패*\n커밋: `${{ github.sha }}`\n확인: ${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}"
                  }
                }
              ]
            }'
```

### Step 4: 환경 설정 파일

```json
// vercel.json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### Step 5: 배포 검증

```bash
# 배포 후 확인 체크리스트
echo "=== 배포 후 검증 ==="

# 1. 사이트 접속 확인
curl -s -o /dev/null -w "%{http_code}" https://my-app.com
# → 200이면 정상

# 2. SSL 인증서 확인
curl -vI https://my-app.com 2>&1 | grep "SSL certificate"

# 3. 응답 시간 측정
curl -s -o /dev/null -w "DNS: %{time_namelookup}s\nConnect: %{time_connect}s\nTTFB: %{time_starttransfer}s\nTotal: %{time_total}s\n" https://my-app.com

# 4. 주요 페이지 상태 확인
for page in "/" "/about" "/login" "/dashboard"; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://my-app.com$page")
  echo "$page: $STATUS"
done
```

### 완성된 파이프라인 요약

```
[전체 배포 파이프라인 요약]

┌──────────────────────────────────────────────────┐
│                    개발 단계                       │
│                                                  │
│  로컬 개발 → git push → PR 생성                    │
└────────────────────┬─────────────────────────────┘
                     ↓
┌──────────────────────────────────────────────────┐
│               CI (자동 품질 검사)                   │
│                                                  │
│  린트 → 타입 검사 → 테스트 → 빌드 → 번들 사이즈 체크  │
└────────────────────┬─────────────────────────────┘
                     ↓
┌──────────────────────────────────────────────────┐
│               프리뷰 배포                          │
│                                                  │
│  Vercel 프리뷰 URL 생성 → 팀 리뷰 → PR 승인         │
└────────────────────┬─────────────────────────────┘
                     ↓
┌──────────────────────────────────────────────────┐
│             CD (자동 프로덕션 배포)                  │
│                                                  │
│  DB 마이그레이션 → 빌드 → Vercel 배포 → Sentry 릴리스│
└────────────────────┬─────────────────────────────┘
                     ↓
┌──────────────────────────────────────────────────┐
│               운영 모니터링                         │
│                                                  │
│  Sentry 에러 추적 + Vercel Analytics + 가동 모니터링 │
│  + 슬랙 알림                                       │
└──────────────────────────────────────────────────┘
```

체크포인트:
- [ ] CI/CD 파이프라인의 전체 흐름을 이해했다
- [ ] 린트, 테스트, 빌드가 포함된 CI 워크플로우를 작성할 수 있다
- [ ] DB 마이그레이션이 포함된 배포 워크플로우를 이해했다
- [ ] 배포 성공/실패 시 알림이 동작하는 구조를 이해했다

---

## 11. 트러블슈팅 & FAQ

### 자주 발생하는 문제 6가지

#### 문제 1: GitHub Actions 워크플로우가 실행되지 않음

```
증상: git push 했는데 Actions 탭에 아무것도 안 뜨는 경우

원인 1: 파일 위치가 잘못됨
  → 워크플로우 파일은 반드시 .github/workflows/ 안에 있어야 합니다
  → .github/workflow/ (s 빠짐) ← 이런 오타 주의!

원인 2: YAML 문법 오류
  → 들여쓰기가 잘못되면 워크플로우 자체가 인식되지 않음
  → 탭(Tab) 대신 반드시 스페이스(Space) 2칸 사용

원인 3: 트리거 브랜치가 다름
  → on.push.branches에 현재 브랜치가 포함되어 있는지 확인

해결:
  1. 파일 경로 확인: .github/workflows/ci.yml
  2. YAML Validator로 문법 검사 (yamllint.com)
  3. 브랜치 이름 확인
```

#### 문제 2: 환경변수가 빌드에 반영되지 않음

```
증상: 배포된 사이트에서 API 호출이 undefined로 나옴

원인 1: 접두사 누락
  → Vite: VITE_ 접두사 필요
  → Next.js: NEXT_PUBLIC_ 접두사 필요
  → CRA: REACT_APP_ 접두사 필요

원인 2: Vercel/Netlify에 환경변수 미등록
  → 로컬 .env만 있고 배포 플랫폼에는 등록하지 않은 경우

원인 3: 환경변수 변경 후 재배포 필요
  → 환경변수를 변경하면 반드시 새로 빌드해야 반영됨

해결:
  1. 변수 이름에 올바른 접두사가 있는지 확인
  2. 배포 플랫폼의 환경변수 설정 확인
  3. 변경 후 재배포 실행
```

#### 문제 3: Vercel 배포 실패 - 빌드 오류

```
증상: Vercel 대시보드에서 "Build Failed" 표시

원인 1: Node.js 버전 불일치
  → 로컬은 Node 20인데 Vercel 기본값이 다를 수 있음

원인 2: 의존성 충돌
  → package-lock.json과 package.json 불일치

원인 3: TypeScript 타입 오류
  → 로컬에서는 무시했지만 Vercel에서는 strict 모드

해결:
  # vercel.json에 Node 버전 지정
  {
    "functions": {
      "api/**/*.js": {
        "runtime": "nodejs20.x"
      }
    }
  }

  # 또는 package.json에 engines 추가
  {
    "engines": {
      "node": ">=20.0.0"
    }
  }

  # 의존성 재설치
  rm -rf node_modules package-lock.json
  npm install
```

#### 문제 4: DNS 변경 후 사이트가 안 열림

```
증상: 도메인을 연결했는데 "사이트에 연결할 수 없습니다" 표시

원인: DNS 전파 시간 (최대 48시간)
  → DNS 레코드 변경 후 전 세계 서버에 전파되는 데 시간이 걸림

확인 방법:
  # DNS 전파 상태 확인
  nslookup my-app.com
  dig my-app.com A

  # 또는 온라인 도구 사용
  # https://www.whatsmydns.net 에서 전파 상태 확인

해결:
  1. DNS 레코드가 올바른지 재확인
  2. 24~48시간 기다리기
  3. TTL(Time to Live) 값을 낮게 설정 (변경 시 빠른 전파)
  4. DNS 캐시 초기화: ipconfig /flushdns (Windows)
```

#### 문제 5: SSL 인증서 오류

```
증상: "이 연결은 비공개가 아닙니다" 경고 표시

원인 1: DNS 레코드가 아직 전파되지 않음
  → SSL 인증서는 DNS 인증 후에 발급됨

원인 2: Mixed Content (HTTP + HTTPS 혼합)
  → HTTPS 사이트에서 HTTP 리소스를 로딩하면 오류

원인 3: Cloudflare SSL 모드 설정 오류
  → "Flexible"이 아닌 "Full (Strict)" 사용 권장

해결:
  1. DNS 전파 완료 후 기다리기 (Vercel/Netlify는 자동 발급)
  2. 코드에서 http://를 https://로 변경
  3. Cloudflare SSL/TLS → Full (strict) 선택
```

#### 문제 6: Supabase 마이그레이션 실패

```
증상: supabase db push 실행 시 오류 발생

원인 1: 기존 데이터와 충돌
  → NOT NULL 칼럼 추가 시 기존 데이터에 값이 없으면 실패

원인 2: 마이그레이션 파일 순서 문제
  → 참조하는 테이블이 아직 생성되지 않은 경우

원인 3: 원격 DB와 로컬 마이그레이션 불일치

해결:
  # 마이그레이션 상태 확인
  supabase migration list

  # 원격 DB 스키마와 비교
  supabase db diff

  # NOT NULL 칼럼 추가 시 기본값 설정
  ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'user';
```

### FAQ (자주 묻는 질문 8가지)

**Q1. GitHub Actions 무료 사용량이 충분한가요?**

> 무료 플랜 기준 월 2,000분입니다. 평균 빌드 시간이 3분이라면 월 약 660회 배포가 가능합니다. 개인 프로젝트나 소규모 팀에는 충분합니다. 사용량은 GitHub 대시보드 → Settings → Billing에서 확인할 수 있습니다.

**Q2. Vercel과 Firebase Hosting 중 어느 것을 써야 하나요?**

> React/Next.js 프로젝트라면 **Vercel**이 최적화되어 있습니다. Google 서비스(Firebase Auth, Firestore)와 통합이 필요하다면 **Firebase Hosting**이 편합니다. 둘 다 무료로 시작할 수 있으니 프로젝트에 맞게 선택하세요.

**Q3. 환경변수에 어떤 정보를 넣어야 하나요?**

> **환경변수에 넣어야 하는 것**: API URL, API 키(공개용), 환경 구분값, 분석 ID, 기능 플래그
> **환경변수에 넣지 말아야 하는 것**: 비밀번호, 개인 토큰, DB 접속 정보(서버 사이드만 가능)
> 프론트엔드 환경변수(VITE_, NEXT_PUBLIC_)는 브라우저에서 노출되므로, 민감한 정보는 서버 사이드 환경변수에만 저장해야 합니다.

**Q4. 커스텀 도메인이 꼭 필요한가요?**

> 아닙니다. Vercel(`.vercel.app`), Netlify(`.netlify.app`), Firebase(`.web.app`) 등 무료 도메인만으로 충분합니다. 다만 **프로페셔널한 인상**, **SEO 개선**, **브랜딩**이 필요하다면 커스텀 도메인을 추천합니다.

**Q5. Sentry 무료 플랜으로 충분한가요?**

> 무료 플랜(Developer Plan)은 월 5,000건 에러 이벤트까지 제공합니다. 소규모 프로젝트에는 충분하지만, 트래픽이 많아지면 샘플링 비율을 낮추거나 유료 플랜으로 전환해야 합니다.

**Q6. dev/staging/prod 환경을 모두 만들어야 하나요?**

> 개인 프로젝트라면 **dev(로컬) + prod(Vercel)** 2개만으로 충분합니다. 팀 프로젝트라면 staging 환경을 추가하면 안정성이 크게 향상됩니다. 규모에 따라 점진적으로 추가하세요.

**Q7. GitHub Actions 시크릿(Secrets)은 안전한가요?**

> GitHub Secrets는 암호화되어 저장되며, 워크플로우 로그에 절대 출력되지 않습니다. 다만 **fork된 저장소의 PR**에서는 시크릿에 접근할 수 없으므로 별도 처리가 필요합니다. 조직(Organization) 수준의 시크릿 관리도 가능합니다.

**Q8. 배포 후 롤백은 어떻게 하나요?**

> **Vercel**: 대시보드에서 이전 배포를 클릭하고 "Promote to Production" 버튼을 누르면 즉시 롤백됩니다.
> **Firebase**: `firebase hosting:rollback` 명령어를 사용합니다.
> **Git**: `git revert`로 이전 커밋을 되돌린 후 push하면 자동 배포됩니다.
> 가장 안전한 방법은 **git revert**를 사용하여 변경 이력을 남기는 것입니다.

---

## 더 배우려면

| 자료 | 설명 | 링크 |
|------|------|------|
| **Supabase 공식 문서** | DB·RLS·API 키·연동 전체 레퍼런스 | [supabase.com/docs](https://supabase.com/docs) |
| **Replit 공식 문서** | Deployments·Secrets·배포 유형 | [docs.replit.com](https://docs.replit.com) |
| **Vercel 공식 문서** | Import·환경변수·프리뷰·롤백 | [vercel.com/docs](https://vercel.com/docs) |
| Supabase 새 API 키 이해 | publishable/secret 키 체계 | [api-keys 가이드](https://supabase.com/docs/guides/api/api-keys) |
| Supabase RLS 가이드 | 행 수준 보안 정책 | [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security) |

---

## 출처

| 출처 | 설명 |
|------|------|
| [GitHub Actions 공식 문서](https://docs.github.com/en/actions) | CI/CD 워크플로우 가이드 |
| [Vercel 공식 문서](https://vercel.com/docs) | Vercel 배포 및 설정 |
| [Firebase 공식 문서](https://firebase.google.com/docs/hosting) | Firebase Hosting 가이드 |
| [Supabase 공식 문서](https://supabase.com/docs) | Supabase 가이드 |
| [Supabase API 키 가이드](https://supabase.com/docs/guides/api/api-keys) | 2026 신규 publishable/secret 키 |
| [Replit 공식 문서](https://docs.replit.com) | Replit 배포·Secrets |
| [Cloudflare 러닝 센터](https://www.cloudflare.com/learning/) | DNS, SSL, CDN 학습 |
| [web.dev](https://web.dev/vitals/) | Core Web Vitals 가이드 |
| [Sentry 공식 문서](https://docs.sentry.io/) | 에러 모니터링 가이드 |
| 카카오톡 대화방 | 러버블 바이브코딩 카톡방 (2026.3.8) |

---

> 이 교안은 **배포 가이드 초보편**을 완료한 분들을 위한 중급 과정입니다. 초보편에서 다룬 기본 배포(Vercel, Netlify, GitHub Pages)를 토대로, 자동화와 환경 관리를 통해 **더 안정적이고 체계적인 배포 체계**를 구축하는 것을 목표로 합니다.
