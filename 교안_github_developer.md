# Git/GitHub 개발자 교안 — "Git 워크플로와 GitHub 자동화"

> **대상**: Git 활용 경험자, 팀 워크플로와 자동화를 구축하려는 개발자
> **목표**: 고급 Git 전략, GitHub Actions 심화, 모노레포, 보안
> **소요 시간**: 약 5~6시간

---

## 어떤 교안을 봐야 할까요?

| 항목 | 초보자편 | 중급자편 | **개발자편 (현재)** |
|------|---------|---------|-------------------|
| Git 경험 | 없음 | add/commit/push 가능 | **브랜치·PR·리뷰 능숙** |
| GitHub Actions | 모름 | 기초 YAML | **매트릭스·재사용 워크플로** |
| 협업 경험 | 없음 | PR 해본 적 있음 | **팀 워크플로 설계 가능** |
| 보안 | 모름 | .gitignore 정도 | **시크릿 관리·코드 스캔** |
| 소요 시간 | 3~4시간 | 4~5시간 | **5~6시간** |

> 브랜치, PR, 코드 리뷰 경험이 없다면 → **중급자편**을 먼저 보세요.
> Git이 처음이라면 → **초보자편**부터 시작하세요.

---

### 추천 리소스

| 리소스 | 설명 | 링크 |
|--------|------|------|
| Pro Git Book | Git 내부 구조까지 다루는 공식 서적 (한국어) | [git-scm.com/book/ko](https://git-scm.com/book/ko/v2) |
| GitHub Actions Docs | 워크플로 작성 공식 가이드 | [docs.github.com/actions](https://docs.github.com/en/actions) |
| GitHub CLI Manual | gh 명령어 전체 레퍼런스 | [cli.github.com/manual](https://cli.github.com/manual/) |
| GitToolBox | IntelliJ Git 플러그인 | [plugins.jetbrains.com](https://plugins.jetbrains.com/plugin/7499-gittoolbox) |
| Conventional Commits | 커밋 메시지 규약 | [conventionalcommits.org](https://www.conventionalcommits.org/ko/) |
| Turborepo Docs | 모노레포 빌드 시스템 | [turbo.build/repo](https://turbo.build/repo) |

---

## 목차

1. [Git 내부 구조](#1-git-내부-구조)
2. [고급 브랜치 전략](#2-고급-브랜치-전략)
3. [GitHub Actions 심화](#3-github-actions-심화)
4. [Git Hooks](#4-git-hooks)
5. [코드 리뷰 자동화](#5-코드-리뷰-자동화)
6. [GitHub API & CLI](#6-github-api--cli)
7. [보안](#7-보안)
8. [모노레포 관리](#8-모노레포-관리)
9. [마이그레이션](#9-마이그레이션)
10. [다음 단계](#10-다음-단계)

---

## 사전 준비 체크리스트

### 필수 도구

| 도구 | 확인 명령어 | 최소 버전 |
|------|------------|----------|
| Git | `git --version` | 2.40 이상 |
| GitHub CLI | `gh --version` | 2.40 이상 |
| Node.js | `node --version` | 20 LTS 이상 |
| VS Code | — | 최신 버전 |
| Docker (선택) | `docker --version` | 24 이상 |

### 필수 설정

```bash
# GPG 서명 설정 (권장)
git config --global commit.gpgsign true
git config --global tag.gpgsign true

# 기본 병합 전략
git config --global pull.rebase true
git config --global merge.conflictstyle zdiff3

# delta 페이저 설정 (가독성 향상)
git config --global core.pager delta
git config --global interactive.diffFilter "delta --color-only"

# GitHub CLI 인증
gh auth login
gh auth status
```

### VS Code 추천 확장

| 확장 프로그램 | 설명 |
|-------------|------|
| **GitLens** | blame, 히스토리, 코드 오너 표시 |
| **Git Graph** | 커밋 그래프 시각화 |
| **GitHub Actions** | 워크플로 문법 하이라이트·실행 상태 |
| **YAML** | Actions YAML 자동완성 |
| **EditorConfig** | 팀 코딩 스타일 통일 |

---

## 1. Git 내부 구조

### 학습 목표

- Git의 4가지 객체 모델(blob, tree, commit, tag)을 이해한다
- SHA-1 해시가 어떻게 무결성을 보장하는지 설명할 수 있다
- DAG(방향성 비순환 그래프) 구조를 그릴 수 있다
- `.git` 디렉토리의 각 파일/폴더 역할을 파악한다

### 1-1. Git은 스냅샷 기반이다

많은 VCS(Subversion 등)는 파일의 **변경분(delta)**을 저장합니다. 반면 Git은 매 커밋마다 프로젝트 전체의 **스냅샷**을 저장합니다.

```
[Delta 기반 VCS]
v1: fileA(원본)   fileB(원본)
v2: fileA(Δ1)     fileB(원본)
v3: fileA(Δ2)     fileB(Δ1)

[스냅샷 기반 Git]
v1: fileA(전체)   fileB(전체)
v2: fileA(전체)   fileB → 변경 없으면 이전 참조
v3: fileA(전체)   fileB(전체)
```

단, Git은 내부적으로 **packfile**을 사용해 동일하거나 유사한 파일을 압축하므로 실제 저장 공간은 효율적입니다.

### 1-2. 4가지 객체 모델

Git의 모든 데이터는 4가지 객체로 구성됩니다.

| 객체 | 역할 | 저장 내용 |
|------|------|----------|
| **blob** | 파일 내용 | 파일의 바이너리 데이터 (파일명 없음) |
| **tree** | 디렉토리 | blob과 하위 tree에 대한 포인터 + 파일명 + 권한 |
| **commit** | 스냅샷 | tree 포인터 + 부모 커밋 + 작성자 + 메시지 |
| **tag** | 이름표 | commit 포인터 + 태그명 + 서명 (annotated tag) |

```
commit 3a4b5c
├── tree 7d8e9f (루트 디렉토리)
│   ├── blob a1b2c3 → README.md
│   ├── blob d4e5f6 → package.json
│   └── tree 1a2b3c (src/)
│       ├── blob 4d5e6f → index.ts
│       └── blob 7a8b9c → utils.ts
└── parent commit 1f2e3d
```

### 1-3. SHA-1 해시와 무결성

Git은 모든 객체에 SHA-1 해시(40자 16진수)를 부여합니다.

```bash
# 파일의 blob 해시 확인
git hash-object README.md
# 출력: e69de29bb2d1d6434b8b29ae775ad8c2e48c5391

# 해시 직접 계산 (Git 내부 방식)
echo -n "blob 13\0Hello, Git!\n" | sha1sum

# 객체 내용 확인
git cat-file -t e69de29   # 타입: blob
git cat-file -p e69de29   # 내용 출력
git cat-file -s e69de29   # 크기(바이트)
```

**해시의 역할:**

1. **무결성 보장**: 내용이 1비트라도 바뀌면 해시가 완전히 달라짐
2. **중복 제거**: 동일 내용의 파일은 같은 blob 하나만 저장
3. **빠른 비교**: 해시만 비교하면 내용이 같은지 즉시 판별

> **참고**: Git 2.42+에서는 SHA-256 전환이 진행 중입니다. `git init --object-format=sha256`으로 새 해시 알고리즘을 시험할 수 있습니다.

### 1-4. DAG (방향성 비순환 그래프)

Git의 커밋 히스토리는 **DAG** 구조를 형성합니다.

```
          A ← B ← C ← D (main)
                    ↖
                     E ← F (feature)

- A: 초기 커밋 (부모 없음 = root commit)
- B: A를 부모로 가짐
- C: B를 부모로 가짐 (분기점)
- D: C를 부모로 가짐 (main HEAD)
- E: C를 부모로 가짐 (feature 분기)
- F: E를 부모로 가짐 (feature HEAD)
```

**DAG의 특성:**

- **방향성**: 자식 → 부모 방향으로만 참조
- **비순환**: 순환 참조 불가능 (A→B→C→A 같은 구조 없음)
- **병합 커밋**: 부모가 2개 이상인 커밋

```bash
# DAG 시각화
git log --oneline --graph --all --decorate

# 특정 커밋의 부모 확인
git cat-file -p HEAD
# tree 7d8e9f...
# parent 1f2e3d...
# author ...
# committer ...
```

### 1-5. .git 디렉토리 완전 해부

```bash
.git/
├── HEAD              # 현재 브랜치 참조 (ref: refs/heads/main)
├── config            # 로컬 저장소 설정
├── description       # gitweb용 설명 (거의 미사용)
├── index             # 스테이징 영역 (바이너리)
├── packed-refs       # 압축된 참조 목록
│
├── hooks/            # Git 훅 스크립트
│   ├── pre-commit.sample
│   ├── commit-msg.sample
│   ├── pre-push.sample
│   └── ...
│
├── info/
│   └── exclude       # 로컬 전용 .gitignore
│
├── logs/             # reflog 기록
│   ├── HEAD
│   └── refs/
│       └── heads/
│           └── main
│
├── objects/          # 모든 Git 객체 저장소
│   ├── pack/         # packfile (압축된 객체)
│   ├── info/
│   └── [2자리hex]/[38자리hex]  # loose 객체
│
└── refs/             # 브랜치·태그 참조
    ├── heads/        # 로컬 브랜치
    │   └── main      # main 브랜치가 가리키는 커밋 해시
    ├── tags/         # 태그
    └── remotes/      # 원격 브랜치
        └── origin/
            └── main
```

### 1-6. 실습: Git 내부 탐험

```bash
# 새 저장소 생성
mkdir git-internals && cd git-internals
git init

# .git 구조 확인
find .git -type f | head -20

# 파일 생성 및 blob 확인
echo "Hello Git Internals" > hello.txt
git hash-object hello.txt
# 아직 .git/objects에 없음

# 스테이징하면 blob 생성
git add hello.txt
find .git/objects -type f
# .git/objects/xx/yyyy... 파일 생성됨

# blob 내용 확인
git cat-file -p $(git hash-object hello.txt)

# 커밋하면 tree + commit 객체 생성
git commit -m "첫 번째 커밋"

# 커밋 객체 분석
git cat-file -p HEAD
# tree <hash>
# author ...
# committer ...
# 첫 번째 커밋

# tree 객체 분석
git cat-file -p HEAD^{tree}
# 100644 blob <hash>    hello.txt

# reflog로 HEAD 이동 기록 확인
git reflog
```

### 1-7. packfile과 가비지 컬렉션

```bash
# loose 객체 수 확인
git count-objects -v

# 수동으로 pack 실행
git gc

# pack 후 객체 확인
ls .git/objects/pack/
# pack-xxx.idx  (인덱스)
# pack-xxx.pack (데이터)

# packfile 내용 확인
git verify-pack -v .git/objects/pack/pack-*.idx | head -20

# 도달 불가능한 객체 정리
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

### 체크포인트

- [ ] `git cat-file -p HEAD`로 커밋 객체 구조를 읽을 수 있다
- [ ] blob, tree, commit, tag 4가지 객체의 차이를 설명할 수 있다
- [ ] `.git/refs/heads/main` 파일에 무엇이 저장되는지 안다
- [ ] SHA-1 해시가 무결성을 보장하는 원리를 이해한다

---

## 2. 고급 브랜치 전략

### 학습 목표

- Trunk-Based Development, GitLab Flow, Release Branch 전략을 비교한다
- 팀 규모와 배포 주기에 맞는 전략을 선택할 수 있다
- 모노레포에서의 브랜치 관리 방법을 이해한다
- 브랜치 보호 규칙을 설정할 수 있다

### 2-1. 브랜치 전략 비교

#### Git Flow (복잡, 릴리스 주기가 긴 프로젝트)

```
main ──────●──────────────●──────────── (릴리스만)
            \            /
release  ────●───●──────●              (릴리스 준비)
              \  |     /
develop ──●────●─●───●────●──────────  (통합 브랜치)
           \  /     / \
feature ────●─────●    ●──────────     (기능 개발)
                        \
hotfix  ─────────────────●─────────    (긴급 수정)
```

| 브랜치 | 역할 | 수명 |
|--------|------|------|
| `main` | 프로덕션 코드 | 영구 |
| `develop` | 다음 릴리스 통합 | 영구 |
| `feature/*` | 기능 개발 | 임시 |
| `release/*` | 릴리스 준비 | 임시 |
| `hotfix/*` | 긴급 수정 | 임시 |

#### Trunk-Based Development (단순, 빠른 배포 주기)

```
main ──●──●──●──●──●──●──●──●──●──●── (모든 개발)
        \  /    \  /         \  /
short ───●──     ●──          ●──      (1~2일 수명)
```

**핵심 원칙:**

- `main` 브랜치에 직접 또는 매우 짧은 브랜치로 커밋
- 브랜치 수명: 최대 1~2일
- Feature Flag로 미완성 기능 숨김
- CI/CD가 반드시 green 상태 유지

```bash
# Trunk-Based 워크플로 예시
git checkout main
git pull --rebase origin main

# 짧은 수명의 브랜치
git checkout -b feat/add-search
# ... 작업 (1~2일 이내) ...

git checkout main
git pull --rebase origin main
git merge --no-ff feat/add-search
git push origin main
git branch -d feat/add-search
```

#### GitLab Flow (환경별 브랜치)

```
main ──●──●──●──●──●──●──●──●──●──
        \     \           \
staging  ●─────●────────────●───────
                \           \
production ──────●───────────●──────
```

**특징:**

- `main` → `staging` → `production` 순서로 머지
- 환경별 브랜치가 배포 게이트 역할
- Cherry-pick으로 특정 커밋만 상위 환경에 반영 가능

### 2-2. 전략 선택 가이드

| 기준 | Git Flow | Trunk-Based | GitLab Flow |
|------|----------|-------------|-------------|
| 팀 규모 | 10명+ | 2~8명 | 5~20명 |
| 배포 주기 | 주/월 단위 | 일 수회 | 주 수회 |
| CI/CD 성숙도 | 낮아도 가능 | 높아야 함 | 중간 |
| 복잡도 | 높음 | 낮음 | 중간 |
| 적합 사례 | 모바일 앱, 패키지 | SaaS, 웹 서비스 | 멀티 환경 |

### 2-3. Release Branch 패턴

장기 지원(LTS) 제품에서 사용하는 패턴입니다.

```
main ──●──●──●──●──●──●──●──●──●──
        \        \
v1.x ────●──●─────\──────────────── (v1 유지보수)
                   \
v2.x ───────────────●──●──●──────── (v2 유지보수)
```

```bash
# 릴리스 브랜치 생성
git checkout -b release/v2.0 main
git push -u origin release/v2.0

# 릴리스 태그
git tag -a v2.0.0 -m "v2.0.0 정식 릴리스"
git push origin v2.0.0

# 핫픽스를 릴리스 브랜치에 적용
git checkout release/v2.0
git cherry-pick <hotfix-commit-hash>
git tag -a v2.0.1 -m "v2.0.1 핫픽스"
git push origin release/v2.0 v2.0.1
```

### 2-4. 브랜치 보호 규칙

```bash
# GitHub CLI로 브랜치 보호 설정
gh api repos/{owner}/{repo}/branches/main/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["ci/test","ci/lint"]}' \
  --field enforce_admins=true \
  --field required_pull_request_reviews='{"required_approving_review_count":2,"dismiss_stale_reviews":true}' \
  --field restrictions=null
```

**권장 보호 규칙:**

| 규칙 | 설명 | 권장 |
|------|------|------|
| PR 필수 | 직접 push 금지 | 항상 |
| 리뷰 최소 인원 | 승인 필요 인원 수 | 2명 |
| 상태 체크 필수 | CI 통과 필수 | 항상 |
| 대화 해결 필수 | 모든 리뷰 코멘트 해결 | 권장 |
| 서명 필수 | GPG 서명된 커밋만 허용 | 선택 |
| 선형 히스토리 | 머지 커밋 금지 (rebase만) | 팀 합의 |

### 2-5. 실습: 브랜치 전략 시뮬레이션

```bash
# Git Flow 시뮬레이션
mkdir git-flow-sim && cd git-flow-sim
git init

# main + develop 설정
echo "v1.0" > version.txt
git add . && git commit -m "init: v1.0"

git checkout -b develop
echo "new feature" >> features.txt
git add . && git commit -m "feat: 새 기능 추가"

# feature 브랜치
git checkout -b feature/login develop
echo "login code" > login.js
git add . && git commit -m "feat: 로그인 구현"

# develop에 병합
git checkout develop
git merge --no-ff feature/login -m "Merge feature/login into develop"
git branch -d feature/login

# release 브랜치
git checkout -b release/v1.1 develop
echo "v1.1" > version.txt
git add . && git commit -m "chore: 버전 v1.1로 변경"

# main에 병합 + 태그
git checkout main
git merge --no-ff release/v1.1 -m "Merge release/v1.1"
git tag -a v1.1.0 -m "v1.1.0"

# develop에도 병합
git checkout develop
git merge --no-ff release/v1.1 -m "Merge release/v1.1 back to develop"
git branch -d release/v1.1

# 결과 확인
git log --oneline --graph --all
```

### 체크포인트

- [ ] Trunk-Based와 Git Flow의 차이를 설명할 수 있다
- [ ] 팀 상황에 맞는 브랜치 전략을 선택할 수 있다
- [ ] `gh api`로 브랜치 보호 규칙을 설정할 수 있다
- [ ] Release Branch 패턴에서 핫픽스 적용 흐름을 이해한다

---

## 3. GitHub Actions 심화

### 학습 목표

- 매트릭스 빌드로 다중 환경 테스트를 구성한다
- 재사용 워크플로(Reusable Workflow)를 작성한다
- 시크릿과 환경 변수를 안전하게 관리한다
- 자체 호스팅 러너를 설정하고 활용한다

### 3-1. 매트릭스 빌드

여러 OS, 언어 버전, 환경 조합을 동시에 테스트합니다.

```yaml
# .github/workflows/matrix-ci.yml
name: Matrix CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ${{ matrix.os }}
    strategy:
      fail-fast: false          # 하나 실패해도 나머지 계속 실행
      max-parallel: 4           # 동시 실행 최대 4개
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        node: [18, 20, 22]
        exclude:
          - os: windows-latest
            node: 18             # Windows + Node 18 조합 제외
        include:
          - os: ubuntu-latest
            node: 22
            coverage: true       # 특정 조합에만 추가 변수

    steps:
      - uses: actions/checkout@v4

      - name: Node.js ${{ matrix.node }} 설정
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
          cache: 'npm'

      - run: npm ci
      - run: npm test

      - name: 커버리지 리포트 (특정 조합만)
        if: matrix.coverage
        run: npm run test:coverage

      - name: 커버리지 업로드
        if: matrix.coverage
        uses: codecov/codecov-action@v4
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
```

### 3-2. 재사용 워크플로 (Reusable Workflows)

반복되는 워크플로를 모듈화하여 여러 저장소에서 재사용합니다.

```yaml
# .github/workflows/reusable-deploy.yml (재사용 워크플로 정의)
name: Reusable Deploy

on:
  workflow_call:               # 다른 워크플로에서 호출 가능
    inputs:
      environment:
        required: true
        type: string
        description: '배포 환경 (staging / production)'
      node-version:
        required: false
        type: string
        default: '20'
    secrets:
      DEPLOY_KEY:
        required: true
      AWS_ACCESS_KEY_ID:
        required: true
      AWS_SECRET_ACCESS_KEY:
        required: true
    outputs:
      deploy-url:
        description: '배포된 URL'
        value: ${{ jobs.deploy.outputs.url }}

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: ${{ inputs.environment }}
    outputs:
      url: ${{ steps.deploy.outputs.url }}

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: ${{ inputs.node-version }}

      - run: npm ci
      - run: npm run build

      - name: 배포
        id: deploy
        run: |
          echo "url=https://${{ inputs.environment }}.example.com" >> $GITHUB_OUTPUT
          # 실제 배포 명령어
        env:
          DEPLOY_KEY: ${{ secrets.DEPLOY_KEY }}
```

```yaml
# .github/workflows/ci-cd.yml (재사용 워크플로 호출)
name: CI/CD Pipeline

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm test

  deploy-staging:
    needs: test
    uses: ./.github/workflows/reusable-deploy.yml
    with:
      environment: staging
    secrets:
      DEPLOY_KEY: ${{ secrets.STAGING_DEPLOY_KEY }}
      AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
      AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}

  deploy-production:
    needs: deploy-staging
    uses: ./.github/workflows/reusable-deploy.yml
    with:
      environment: production
    secrets:
      DEPLOY_KEY: ${{ secrets.PROD_DEPLOY_KEY }}
      AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
      AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

### 3-3. Composite Actions

여러 스텝을 하나의 액션으로 묶어 재사용합니다.

```yaml
# .github/actions/setup-project/action.yml
name: 'Setup Project'
description: '프로젝트 공통 설정 (Node.js + 의존성 설치 + 캐시)'

inputs:
  node-version:
    description: 'Node.js 버전'
    required: false
    default: '20'

runs:
  using: 'composite'
  steps:
    - name: Node.js 설정
      uses: actions/setup-node@v4
      with:
        node-version: ${{ inputs.node-version }}

    - name: npm 캐시 복원
      uses: actions/cache@v4
      with:
        path: ~/.npm
        key: ${{ runner.os }}-npm-${{ hashFiles('**/package-lock.json') }}
        restore-keys: |
          ${{ runner.os }}-npm-

    - name: 의존성 설치
      run: npm ci
      shell: bash

    - name: 타입 체크
      run: npx tsc --noEmit || true
      shell: bash
```

```yaml
# 사용 예시
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: ./.github/actions/setup-project
        with:
          node-version: '20'
      - run: npm run build
```

### 3-4. 시크릿 관리

```bash
# GitHub CLI로 시크릿 설정
gh secret set DEPLOY_KEY --body "my-secret-value"
gh secret set AWS_ACCESS_KEY_ID < aws-key.txt

# 환경별 시크릿
gh secret set DEPLOY_KEY --env staging --body "staging-key"
gh secret set DEPLOY_KEY --env production --body "prod-key"

# 시크릿 목록 확인
gh secret list
gh secret list --env production

# 조직 수준 시크릿
gh secret set ORG_SECRET --org my-org --visibility selected \
  --repos "repo1,repo2,repo3"
```

**시크릿 관리 모범 사례:**

| 원칙 | 설명 |
|------|------|
| 최소 권한 | 필요한 저장소/환경에만 시크릿 공유 |
| 주기적 교체 | 90일 주기로 시크릿 갱신 |
| 환경 분리 | staging/production 시크릿 분리 |
| OIDC 사용 | 가능하면 정적 키 대신 OIDC 토큰 사용 |
| 로그 마스킹 | `::add-mask::` 명령으로 값 마스킹 |

```yaml
# OIDC를 사용한 AWS 인증 (정적 키 불필요)
jobs:
  deploy:
    permissions:
      id-token: write
      contents: read
    steps:
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789:role/github-actions
          aws-region: ap-northeast-2
```

### 3-5. 자체 호스팅 러너 (Self-Hosted Runner)

GitHub 호스팅 러너 대신 자체 서버에서 워크플로를 실행합니다.

```bash
# 러너 설치 (Linux)
mkdir actions-runner && cd actions-runner
curl -o actions-runner-linux-x64-2.311.0.tar.gz -L \
  https://github.com/actions/runner/releases/download/v2.311.0/actions-runner-linux-x64-2.311.0.tar.gz
tar xzf ./actions-runner-linux-x64-2.311.0.tar.gz

# 러너 등록
./config.sh --url https://github.com/OWNER/REPO \
  --token YOUR_TOKEN \
  --labels gpu,linux,self-hosted \
  --work _work

# 서비스로 실행
sudo ./svc.sh install
sudo ./svc.sh start
sudo ./svc.sh status
```

```yaml
# 자체 호스팅 러너 사용
jobs:
  gpu-test:
    runs-on: [self-hosted, gpu, linux]
    steps:
      - uses: actions/checkout@v4
      - run: nvidia-smi   # GPU 사용 가능
      - run: python train.py
```

**자체 호스팅 러너를 쓰는 경우:**

- GPU/TPU가 필요한 ML 학습
- 사내 네트워크 접근이 필요한 배포
- GitHub 호스팅 러너의 스펙/시간 제한 초과
- 특수 하드웨어(ARM, FPGA 등) 필요

### 3-6. 워크플로 최적화

```yaml
# 경로 필터로 불필요한 실행 방지
on:
  push:
    paths:
      - 'src/**'
      - 'tests/**'
      - 'package.json'
    paths-ignore:
      - '**.md'
      - 'docs/**'

# 동시 실행 제어
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true    # 같은 브랜치의 이전 실행 취소

# 아티팩트 캐싱으로 빌드 속도 향상
- uses: actions/cache@v4
  with:
    path: |
      ~/.npm
      node_modules
      .next/cache
    key: ${{ runner.os }}-nextjs-${{ hashFiles('**/package-lock.json') }}-${{ hashFiles('**/*.js', '**/*.ts') }}
    restore-keys: |
      ${{ runner.os }}-nextjs-${{ hashFiles('**/package-lock.json') }}-
      ${{ runner.os }}-nextjs-

# 조건부 실행
- name: 프로덕션 배포
  if: github.ref == 'refs/heads/main' && github.event_name == 'push'
  run: npm run deploy:prod
```

### 체크포인트

- [ ] 매트릭스 빌드에서 `exclude`와 `include`를 사용할 수 있다
- [ ] 재사용 워크플로를 만들고 호출할 수 있다
- [ ] OIDC 기반 클라우드 인증의 장점을 설명할 수 있다
- [ ] `concurrency` 설정으로 중복 실행을 방지할 수 있다

---

## 4. Git Hooks

### 학습 목표

- Git Hook의 종류와 동작 시점을 이해한다
- Husky + lint-staged로 자동 코드 품질 관리를 구축한다
- Conventional Commits 규칙을 강제하는 commit-msg 훅을 만든다
- 팀 전체에 Hook 설정을 공유하는 방법을 익힌다

### 4-1. Git Hook 종류

Git Hook은 특정 Git 이벤트 발생 시 자동 실행되는 스크립트입니다.

| 훅 | 실행 시점 | 주요 용도 |
|----|----------|----------|
| `pre-commit` | `git commit` 실행 직전 | 린트, 포맷팅, 테스트 |
| `prepare-commit-msg` | 커밋 메시지 편집기 열기 전 | 메시지 템플릿 자동 삽입 |
| `commit-msg` | 커밋 메시지 저장 후 | 메시지 형식 검증 |
| `post-commit` | 커밋 완료 후 | 알림, 로깅 |
| `pre-push` | `git push` 실행 직전 | 전체 테스트, 빌드 검증 |
| `pre-rebase` | `git rebase` 실행 직전 | rebase 정책 검증 |
| `post-merge` | 병합 완료 후 | 의존성 자동 설치 |
| `post-checkout` | 브랜치 전환 후 | 환경 설정 자동 변경 |

```bash
# Hook 직접 만들기 (.git/hooks/pre-commit)
#!/bin/sh
echo "커밋 전 검사 실행 중..."

# 스테이징된 파일에서 console.log 검출
if git diff --cached --name-only | xargs grep -l "console.log" 2>/dev/null; then
  echo "경고: console.log가 남아있습니다!"
  exit 1   # 0이 아니면 커밋 중단
fi

echo "검사 통과!"
exit 0
```

```bash
# 실행 권한 부여
chmod +x .git/hooks/pre-commit
```

### 4-2. Husky + lint-staged 설정

Hook을 팀 전체가 공유하려면 Husky를 사용합니다.

```bash
# Husky 설치
npm install --save-dev husky lint-staged

# Husky 초기화
npx husky init
# .husky/ 디렉토리 생성, package.json에 prepare 스크립트 추가

# pre-commit 훅 설정
echo "npx lint-staged" > .husky/pre-commit

# commit-msg 훅 설정
echo "npx --no -- commitlint --edit \$1" > .husky/commit-msg
```

```json
// package.json
{
  "scripts": {
    "prepare": "husky"
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{css,scss}": [
      "stylelint --fix",
      "prettier --write"
    ],
    "*.{json,md,yml}": [
      "prettier --write"
    ]
  }
}
```

### 4-3. Conventional Commits

커밋 메시지에 일관된 규칙을 적용합니다.

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**타입 목록:**

| 타입 | 설명 | 예시 |
|------|------|------|
| `feat` | 새 기능 | `feat(auth): 소셜 로그인 추가` |
| `fix` | 버그 수정 | `fix(api): null 응답 처리 오류 수정` |
| `docs` | 문서 수정 | `docs: API 엔드포인트 설명 추가` |
| `style` | 코드 스타일 (기능 변경 없음) | `style: 들여쓰기 수정` |
| `refactor` | 리팩토링 | `refactor(cart): 장바구니 로직 분리` |
| `perf` | 성능 개선 | `perf: 이미지 lazy loading 적용` |
| `test` | 테스트 추가/수정 | `test(auth): 로그인 실패 케이스 추가` |
| `build` | 빌드 설정 변경 | `build: webpack 5로 업그레이드` |
| `ci` | CI 설정 변경 | `ci: Node 22 매트릭스 추가` |
| `chore` | 기타 변경 | `chore: 불필요한 의존성 제거` |

```bash
# commitlint 설치
npm install --save-dev @commitlint/cli @commitlint/config-conventional
```

```js
// commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', [
      'feat', 'fix', 'docs', 'style', 'refactor',
      'perf', 'test', 'build', 'ci', 'chore', 'revert'
    ]],
    'subject-max-length': [2, 'always', 72],
    'body-max-line-length': [2, 'always', 100],
    'scope-case': [2, 'always', 'kebab-case'],
  },
};
```

### 4-4. 자동 버전 관리 (standard-version / release-please)

Conventional Commits를 기반으로 버전을 자동 관리합니다.

```yaml
# .github/workflows/release.yml (release-please 사용)
name: Release Please

on:
  push:
    branches: [main]

permissions:
  contents: write
  pull-requests: write

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: googleapis/release-please-action@v4
        with:
          release-type: node
          token: ${{ secrets.GITHUB_TOKEN }}
```

**동작 방식:**

1. `feat` 커밋 → **마이너** 버전 업 (1.0.0 → 1.1.0)
2. `fix` 커밋 → **패치** 버전 업 (1.0.0 → 1.0.1)
3. `feat!` 또는 `BREAKING CHANGE` → **메이저** 버전 업 (1.0.0 → 2.0.0)
4. CHANGELOG.md 자동 생성
5. GitHub Release 자동 생성

### 4-5. 실습: 팀 프로젝트 Hooks 세팅

```bash
# 프로젝트 초기화
mkdir hooks-practice && cd hooks-practice
git init
npm init -y

# 도구 설치
npm install --save-dev \
  husky \
  lint-staged \
  @commitlint/cli \
  @commitlint/config-conventional \
  eslint \
  prettier

# Husky 초기화
npx husky init

# pre-commit: lint-staged 실행
echo "npx lint-staged" > .husky/pre-commit

# commit-msg: commitlint 실행
echo 'npx --no -- commitlint --edit "$1"' > .husky/commit-msg

# pre-push: 테스트 실행
echo "npm test" > .husky/pre-push
```

```json
// package.json에 추가
{
  "lint-staged": {
    "*.js": ["eslint --fix", "prettier --write"]
  }
}
```

```bash
# 테스트: 잘못된 커밋 메시지
echo "test" > test.js
git add test.js
git commit -m "그냥 커밋"
# 오류! commitlint에 의해 차단됨

# 올바른 커밋 메시지
git commit -m "feat: 테스트 파일 추가"
# 성공!
```

### 체크포인트

- [ ] pre-commit, commit-msg, pre-push 훅의 차이를 안다
- [ ] Husky + lint-staged를 프로젝트에 설정할 수 있다
- [ ] Conventional Commits 형식으로 커밋 메시지를 작성한다
- [ ] release-please로 자동 버전 관리가 어떻게 동작하는지 이해한다

---

## 5. 코드 리뷰 자동화

### 학습 목표

- CODEOWNERS 파일을 작성하여 자동 리뷰어를 지정한다
- PR 템플릿으로 리뷰 품질을 높인다
- GitHub Actions로 자동 라벨링, 자동 할당을 구현한다
- AI 코드 리뷰 도구를 연동한다

### 5-1. CODEOWNERS

```
# .github/CODEOWNERS
# 파일/디렉토리별 코드 오너 지정
# PR 생성 시 자동으로 리뷰어 할당

# 전체 프로젝트 기본 오너
*                       @team-lead @senior-dev

# 프론트엔드
/src/components/        @frontend-team
/src/pages/             @frontend-team
*.css                   @frontend-team @designer

# 백엔드
/src/api/               @backend-team
/src/models/            @backend-team @dba

# 인프라
/infrastructure/        @devops-team
/.github/workflows/     @devops-team
Dockerfile              @devops-team

# 문서
/docs/                  @tech-writer
*.md                    @tech-writer

# 보안 관련 (최소 2명 리뷰 필수)
/src/auth/              @security-team @team-lead
/src/crypto/            @security-team
```

**CODEOWNERS 규칙:**

- 나중에 나오는 규칙이 우선순위가 높음
- `@팀명` 또는 `@사용자명` 사용 가능
- 브랜치 보호 규칙과 결합하면 해당 오너의 승인 필수

### 5-2. PR 템플릿

```markdown
<!-- .github/pull_request_template.md -->
## 변경 사항

<!-- 무엇을 변경했는지 간단히 설명해주세요 -->

## 변경 유형

- [ ] 새 기능 (feat)
- [ ] 버그 수정 (fix)
- [ ] 리팩토링 (refactor)
- [ ] 문서 수정 (docs)
- [ ] 테스트 추가 (test)
- [ ] 기타

## 관련 이슈

<!-- closes #123 또는 fixes #456 -->

## 테스트 방법

1.
2.
3.

## 스크린샷 (UI 변경 시)

| Before | After |
|--------|-------|
|        |       |

## 체크리스트

- [ ] 코드가 프로젝트 컨벤션을 따르고 있다
- [ ] 셀프 리뷰를 완료했다
- [ ] 테스트를 추가했다
- [ ] 문서를 업데이트했다 (필요 시)
- [ ] 하위 호환성을 확인했다

## 리뷰어에게

<!-- 리뷰 시 특히 봐주셨으면 하는 부분 -->
```

### 5-3. 자동 라벨링

```yaml
# .github/workflows/auto-label.yml
name: Auto Label PR

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  label:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write
    steps:
      - uses: actions/labeler@v5
        with:
          repo-token: ${{ secrets.GITHUB_TOKEN }}
```

```yaml
# .github/labeler.yml (라벨 규칙)
frontend:
  - changed-files:
    - any-glob-to-any-file:
      - 'src/components/**'
      - 'src/pages/**'
      - '*.css'

backend:
  - changed-files:
    - any-glob-to-any-file:
      - 'src/api/**'
      - 'src/models/**'

infrastructure:
  - changed-files:
    - any-glob-to-any-file:
      - '.github/**'
      - 'Dockerfile'
      - 'docker-compose.yml'

documentation:
  - changed-files:
    - any-glob-to-any-file:
      - '**/*.md'
      - 'docs/**'
```

### 5-4. PR 크기 경고

```yaml
# .github/workflows/pr-size.yml
name: PR Size Check

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  size-check:
    runs-on: ubuntu-latest
    permissions:
      pull-requests: write
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: PR 크기 분석
        id: size
        run: |
          ADDITIONS=$(gh pr view ${{ github.event.pull_request.number }} --json additions -q '.additions')
          DELETIONS=$(gh pr view ${{ github.event.pull_request.number }} --json deletions -q '.deletions')
          TOTAL=$((ADDITIONS + DELETIONS))
          echo "total=$TOTAL" >> $GITHUB_OUTPUT

          if [ $TOTAL -gt 1000 ]; then
            echo "label=size/XL" >> $GITHUB_OUTPUT
          elif [ $TOTAL -gt 500 ]; then
            echo "label=size/L" >> $GITHUB_OUTPUT
          elif [ $TOTAL -gt 100 ]; then
            echo "label=size/M" >> $GITHUB_OUTPUT
          else
            echo "label=size/S" >> $GITHUB_OUTPUT
          fi
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: 라벨 적용
        run: gh pr edit ${{ github.event.pull_request.number }} --add-label "${{ steps.size.outputs.label }}"
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: 대형 PR 경고 코멘트
        if: steps.size.outputs.total > 500
        run: |
          gh pr comment ${{ github.event.pull_request.number }} --body \
            "이 PR은 **${{ steps.size.outputs.total }}줄**이 변경되었습니다. 가능하면 더 작은 PR로 분리해주세요."
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### 5-5. AI 코드 리뷰 연동

```yaml
# .github/workflows/ai-review.yml
name: AI Code Review

on:
  pull_request:
    types: [opened, synchronize]

permissions:
  contents: read
  pull-requests: write

jobs:
  ai-review:
    runs-on: ubuntu-latest
    steps:
      - uses: coderabbitai/ai-pr-reviewer@v1
        with:
          debug: false
          review_simple_changes: false
          review_comment_lgtm: false
          openai_light_model: gpt-4o-mini
          openai_heavy_model: gpt-4o
          language: ko-KR
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### 5-6. 리뷰 대시보드 워크플로

```yaml
# .github/workflows/review-stats.yml
name: Review Statistics

on:
  schedule:
    - cron: '0 9 * * 1'    # 매주 월요일 오전 9시

jobs:
  stats:
    runs-on: ubuntu-latest
    steps:
      - name: PR 리뷰 통계 수집
        run: |
          echo "## 지난 주 PR 리뷰 통계" > stats.md
          echo "" >> stats.md

          # 지난 7일간 머지된 PR
          gh pr list --state merged --limit 100 \
            --json number,title,author,mergedAt,reviewDecision \
            --jq '.[] | select(.mergedAt > (now - 604800 | todate))' \
            | jq -r '"- #\(.number) \(.title) by @\(.author.login)"' >> stats.md

          # 평균 리뷰 시간 계산
          echo "" >> stats.md
          echo "### 대기 중인 PR" >> stats.md
          gh pr list --state open --json number,title,createdAt \
            --jq '.[] | "- #\(.number) \(.title) (생성: \(.createdAt))"' >> stats.md
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### 체크포인트

- [ ] CODEOWNERS 파일을 작성하고 자동 리뷰어 할당을 설정할 수 있다
- [ ] PR 템플릿을 만들어 리뷰 품질을 높일 수 있다
- [ ] 자동 라벨링 워크플로를 구성할 수 있다
- [ ] AI 코드 리뷰 도구의 장단점을 이해한다

---

## 6. GitHub API & CLI

### 학습 목표

- gh CLI의 주요 명령어 20가지를 능숙하게 사용한다
- REST API와 GraphQL API의 차이를 이해한다
- 자동화 스크립트를 작성하여 반복 작업을 줄인다
- GitHub Apps와 Personal Access Token의 차이를 파악한다

### 6-1. gh CLI 핵심 명령어 20가지

```bash
# ─── 저장소 관리 ───

# 1. 저장소 생성
gh repo create my-project --public --clone --add-readme

# 2. 저장소 포크
gh repo fork owner/repo --clone

# 3. 저장소 정보 조회
gh repo view owner/repo --json name,description,stargazerCount

# ─── PR 관리 ───

# 4. PR 생성
gh pr create --title "feat: 새 기능" --body "설명" --reviewer user1,user2

# 5. PR 목록 조회
gh pr list --state open --assignee @me

# 6. PR 리뷰
gh pr review 123 --approve --body "LGTM!"

# 7. PR 머지
gh pr merge 123 --squash --delete-branch

# 8. PR 체크아웃
gh pr checkout 123

# ─── 이슈 관리 ───

# 9. 이슈 생성
gh issue create --title "버그: 로그인 실패" --label bug --assignee @me

# 10. 이슈 목록
gh issue list --state open --label "priority:high"

# 11. 이슈 닫기
gh issue close 456 --reason completed

# ─── 워크플로 관리 ───

# 12. 워크플로 실행
gh workflow run ci.yml --ref main

# 13. 워크플로 상태 확인
gh run list --workflow ci.yml --limit 5

# 14. 실행 로그 확인
gh run view 789 --log

# 15. 실패한 실행 재시도
gh run rerun 789 --failed

# ─── 릴리스 관리 ───

# 16. 릴리스 생성
gh release create v1.0.0 --title "v1.0.0" --generate-notes

# 17. 릴리스에 파일 첨부
gh release upload v1.0.0 ./dist/app.zip

# ─── 기타 유틸리티 ───

# 18. Gist 생성
gh gist create script.sh --public --desc "유용한 스크립트"

# 19. GitHub API 직접 호출
gh api repos/{owner}/{repo}/contributors --jq '.[].login'

# 20. 별칭(alias) 설정
gh alias set prc 'pr create --fill'
gh alias set prl 'pr list --state open --assignee @me'
```

### 6-2. REST API 활용

```bash
# 저장소 정보 조회
gh api repos/facebook/react \
  --jq '{name, stars: .stargazers_count, forks: .forks_count}'

# 특정 파일 내용 조회 (Base64 디코딩)
gh api repos/{owner}/{repo}/contents/README.md \
  --jq '.content' | base64 -d

# 커밋 목록 조회 (최근 5개)
gh api repos/{owner}/{repo}/commits \
  --jq '.[0:5] | .[] | {sha: .sha[0:7], message: .commit.message, date: .commit.author.date}'

# PR 코멘트 추가
gh api repos/{owner}/{repo}/issues/123/comments \
  --method POST \
  --field body="자동 생성된 코멘트입니다."

# 브랜치 보호 규칙 조회
gh api repos/{owner}/{repo}/branches/main/protection

# 라벨 생성
gh api repos/{owner}/{repo}/labels \
  --method POST \
  --field name="priority:critical" \
  --field color="FF0000" \
  --field description="긴급 처리 필요"

# 페이지네이션 (모든 이슈 가져오기)
gh api repos/{owner}/{repo}/issues \
  --paginate \
  --jq '.[].title'
```

### 6-3. GraphQL API 활용

```bash
# GraphQL 쿼리: PR과 리뷰 정보 한 번에 조회
gh api graphql -f query='
{
  repository(owner: "facebook", name: "react") {
    pullRequests(last: 5, states: OPEN) {
      nodes {
        number
        title
        author { login }
        reviews(last: 3) {
          nodes {
            author { login }
            state
          }
        }
        labels(first: 5) {
          nodes { name }
        }
      }
    }
  }
}'

# 사용자의 기여 통계
gh api graphql -f query='
{
  user(login: "octocat") {
    contributionsCollection {
      totalCommitContributions
      totalPullRequestContributions
      totalIssueContributions
      totalPullRequestReviewContributions
    }
  }
}' --jq '.data.user.contributionsCollection'
```

### 6-4. 자동화 스크립트 예시

```bash
#!/bin/bash
# stale-pr-reminder.sh — 7일 이상 된 PR에 리마인더 코멘트

DAYS_THRESHOLD=7
REPO="owner/repo"

gh pr list --repo "$REPO" --state open --json number,title,createdAt,author \
  --jq ".[] | select(
    (.createdAt | fromdateiso8601) < (now - ($DAYS_THRESHOLD * 86400))
  )" | while read -r pr; do
    PR_NUM=$(echo "$pr" | jq -r '.number')
    AUTHOR=$(echo "$pr" | jq -r '.author.login')

    gh pr comment "$PR_NUM" --repo "$REPO" --body \
      "@$AUTHOR 이 PR이 ${DAYS_THRESHOLD}일 이상 열려 있습니다. 업데이트가 필요한지 확인해주세요."

    echo "리마인더 전송: PR #$PR_NUM"
  done
```

```bash
#!/bin/bash
# batch-label.sh — 여러 이슈에 라벨 일괄 적용

REPO="owner/repo"
LABEL="sprint-42"

# 특정 마일스톤의 모든 이슈에 라벨 추가
gh issue list --repo "$REPO" --milestone "Sprint 42" --json number \
  --jq '.[].number' | while read -r num; do
    gh issue edit "$num" --repo "$REPO" --add-label "$LABEL"
    echo "라벨 추가: Issue #$num"
  done
```

```bash
#!/bin/bash
# release-notes.sh — 두 태그 사이의 변경 내역 생성

FROM_TAG=${1:-$(gh release list --limit 2 --json tagName --jq '.[1].tagName')}
TO_TAG=${2:-$(gh release list --limit 1 --json tagName --jq '.[0].tagName')}

echo "## $FROM_TAG → $TO_TAG 변경 내역"
echo ""

# feat 커밋
echo "### 새 기능"
git log "$FROM_TAG..$TO_TAG" --oneline --grep="^feat" | sed 's/^/- /'

echo ""

# fix 커밋
echo "### 버그 수정"
git log "$FROM_TAG..$TO_TAG" --oneline --grep="^fix" | sed 's/^/- /'

echo ""

# PR 목록
echo "### 관련 PR"
git log "$FROM_TAG..$TO_TAG" --oneline --grep="Merge pull request" \
  | sed 's/.*#\([0-9]*\).*/- #\1/' | sort -u
```

### 6-5. GitHub Apps vs Personal Access Token

| 항목 | Personal Access Token | GitHub App |
|------|----------------------|------------|
| 범위 | 사용자 수준 | 저장소/조직 수준 |
| 권한 | 넓은 범위 (repo, admin) | 세분화된 권한 |
| 인증 | 토큰 문자열 | JWT + Installation Token |
| 만료 | 설정 가능 (fine-grained) | 토큰 자동 갱신 |
| Rate Limit | 5,000 req/hr | 5,000 req/hr (설치당) |
| 적합 | 개인 스크립트, 소규모 | 팀 도구, 서비스 연동 |

```bash
# Fine-grained PAT 생성 (권장)
# Settings → Developer settings → Personal access tokens → Fine-grained tokens
# 필요한 저장소와 권한만 선택

# PAT로 인증
gh auth login --with-token < token.txt

# 토큰 권한 확인
gh auth status
```

### 체크포인트

- [ ] gh CLI로 PR 생성, 리뷰, 머지를 할 수 있다
- [ ] REST API와 GraphQL API의 차이를 설명할 수 있다
- [ ] 반복 작업을 자동화하는 스크립트를 작성할 수 있다
- [ ] Fine-grained PAT의 장점을 이해한다

---

## 7. 보안

### 학습 목표

- Dependabot으로 의존성 취약점을 자동 관리한다
- Secret Scanning으로 유출된 시크릿을 탐지한다
- CodeQL로 코드 보안 취약점을 분석한다
- GPG 서명으로 커밋 무결성을 보장한다

### 7-1. Dependabot 설정

```yaml
# .github/dependabot.yml
version: 2
updates:
  # npm 의존성
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
      time: "09:00"
      timezone: "Asia/Seoul"
    open-pull-requests-limit: 10
    reviewers:
      - "security-team"
    labels:
      - "dependencies"
      - "security"
    # 마이너/패치만 자동 머지
    allow:
      - dependency-type: "direct"
    ignore:
      - dependency-name: "webpack"
        versions: [">=6.0.0"]    # 메이저 업데이트 무시

  # GitHub Actions 버전
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
    labels:
      - "ci"
      - "dependencies"

  # Docker 이미지
  - package-ecosystem: "docker"
    directory: "/"
    schedule:
      interval: "weekly"
```

### 7-2. Dependabot 자동 머지

```yaml
# .github/workflows/dependabot-auto-merge.yml
name: Dependabot Auto Merge

on:
  pull_request:
    types: [opened, synchronize]

permissions:
  contents: write
  pull-requests: write

jobs:
  auto-merge:
    runs-on: ubuntu-latest
    if: github.actor == 'dependabot[bot]'
    steps:
      - name: Dependabot 메타데이터
        id: metadata
        uses: dependabot/fetch-metadata@v2
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}

      - name: 패치/마이너 업데이트 자동 머지
        if: steps.metadata.outputs.update-type == 'version-update:semver-patch' ||
            steps.metadata.outputs.update-type == 'version-update:semver-minor'
        run: gh pr merge --auto --squash "$PR_URL"
        env:
          PR_URL: ${{ github.event.pull_request.html_url }}
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### 7-3. Secret Scanning

GitHub는 저장소에 푸시된 시크릿(API 키, 토큰 등)을 자동 탐지합니다.

```yaml
# 시크릿 스캐닝 커스텀 패턴 (조직 수준 설정)
# Settings → Code security → Secret scanning → Custom patterns

# 예: 사내 API 키 패턴
name: "Internal API Key"
pattern: "MYCOMPANY_API_[A-Za-z0-9]{32}"
```

**Push Protection 활성화:**

```bash
# 저장소 설정에서 활성화
gh api repos/{owner}/{repo} \
  --method PATCH \
  --field security_and_analysis='{"secret_scanning_push_protection":{"status":"enabled"}}'
```

**시크릿이 유출되었을 때:**

```bash
# 1. 즉시 시크릿 무효화 (최우선)
# API 키 재발급, 토큰 폐기 등

# 2. 히스토리에서 제거 (git filter-repo 사용)
pip install git-filter-repo

# 특정 파일에서 시크릿 제거
git filter-repo --path secrets.env --invert-paths

# 특정 문자열 치환
git filter-repo --replace-text expressions.txt
# expressions.txt 내용:
# AKIAIOSFODNN7EXAMPLE==>REDACTED
# sk-xxxxxxx==>REDACTED

# 3. force push (팀 합의 필수)
git push --force-with-lease origin main
```

### 7-4. CodeQL 분석

```yaml
# .github/workflows/codeql.yml
name: CodeQL Analysis

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 3 * * 1'     # 매주 월요일 새벽 3시

jobs:
  analyze:
    runs-on: ubuntu-latest
    permissions:
      security-events: write
      actions: read
      contents: read

    strategy:
      matrix:
        language: ['javascript', 'typescript']

    steps:
      - uses: actions/checkout@v4

      - name: CodeQL 초기화
        uses: github/codeql-action/init@v3
        with:
          languages: ${{ matrix.language }}
          queries: +security-extended    # 확장 보안 쿼리

      - name: Autobuild
        uses: github/codeql-action/autobuild@v3

      - name: 분석 실행
        uses: github/codeql-action/analyze@v3
        with:
          category: "/language:${{ matrix.language }}"
```

### 7-5. GPG 서명

```bash
# GPG 키 생성
gpg --full-generate-key
# RSA, 4096비트, 유효기간 1년 권장

# 키 목록 확인
gpg --list-secret-keys --keyid-format=long
# sec   rsa4096/3AA5C34371567BD2 2024-01-01 [SC]
#       ABC123...
# uid   Your Name <your@email.com>

# 공개키 내보내기 (GitHub에 등록)
gpg --armor --export 3AA5C34371567BD2

# Git에 서명 키 설정
git config --global user.signingkey 3AA5C34371567BD2
git config --global commit.gpgsign true
git config --global tag.gpgsign true

# 서명된 커밋 만들기
git commit -S -m "feat: 서명된 커밋"

# 서명 확인
git log --show-signature -1
git verify-commit HEAD
git verify-tag v1.0.0
```

**GitHub에 GPG 키 등록:**

1. Settings → SSH and GPG keys → New GPG key
2. `gpg --armor --export KEY_ID` 출력값 붙여넣기
3. 이후 서명된 커밋에 "Verified" 배지 표시

### 7-6. 브랜치 보호 고급 설정

```bash
# Ruleset 생성 (새로운 방식, 브랜치 보호 규칙 대체)
gh api repos/{owner}/{repo}/rulesets \
  --method POST \
  --input - <<'EOF'
{
  "name": "main-protection",
  "target": "branch",
  "enforcement": "active",
  "conditions": {
    "ref_name": {
      "include": ["refs/heads/main"],
      "exclude": []
    }
  },
  "rules": [
    { "type": "deletion" },
    { "type": "non_fast_forward" },
    { "type": "required_linear_history" },
    {
      "type": "pull_request",
      "parameters": {
        "required_approving_review_count": 2,
        "dismiss_stale_reviews_on_push": true,
        "require_code_owner_review": true,
        "require_last_push_approval": true
      }
    },
    {
      "type": "required_status_checks",
      "parameters": {
        "strict_required_status_checks_policy": true,
        "required_status_checks": [
          { "context": "ci/test" },
          { "context": "ci/lint" },
          { "context": "security/codeql" }
        ]
      }
    },
    {
      "type": "commit_message_pattern",
      "parameters": {
        "operator": "must_match",
        "pattern": "^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\\(.+\\))?: .+"
      }
    }
  ]
}
EOF
```

### 7-7. 보안 체크리스트

| 항목 | 설명 | 우선순위 |
|------|------|---------|
| `.gitignore` | `.env`, `*.key`, `*.pem` 제외 | 필수 |
| Secret Scanning | 저장소 설정에서 활성화 | 필수 |
| Push Protection | 시크릿 포함 push 차단 | 필수 |
| Dependabot | 의존성 취약점 자동 알림 | 필수 |
| CodeQL | 코드 보안 분석 | 권장 |
| GPG 서명 | 커밋 무결성 보장 | 권장 |
| Branch Protection | main 직접 push 차단 | 필수 |
| OIDC | 정적 키 대신 토큰 사용 | 권장 |
| 2FA | 계정 2단계 인증 | 필수 |
| Fine-grained PAT | 최소 권한 토큰 | 권장 |

### 체크포인트

- [ ] Dependabot을 설정하고 자동 머지 워크플로를 구성할 수 있다
- [ ] 시크릿이 유출되었을 때 대응 절차를 알고 있다
- [ ] CodeQL 분석 워크플로를 작성할 수 있다
- [ ] GPG 키를 생성하고 서명된 커밋을 만들 수 있다

---

## 8. 모노레포 관리

### 학습 목표

- 모노레포와 폴리레포의 장단점을 비교한다
- Git subtree와 submodule의 차이를 이해한다
- Turborepo/Nx로 모노레포 빌드를 최적화한다
- sparse-checkout으로 대용량 저장소를 효율적으로 다룬다

### 8-1. 모노레포 vs 폴리레포

```
[모노레포]                          [폴리레포]
my-company/                         my-company/
├── apps/                           ├── frontend-repo/
│   ├── web/                        │   └── (독립 저장소)
│   ├── mobile/                     ├── backend-repo/
│   └── admin/                      │   └── (독립 저장소)
├── packages/                       ├── shared-lib-repo/
│   ├── ui/                         │   └── (독립 저장소)
│   ├── utils/                      └── design-system-repo/
│   └── config/                         └── (독립 저장소)
├── package.json
└── turbo.json
```

| 기준 | 모노레포 | 폴리레포 |
|------|---------|---------|
| 코드 공유 | 쉬움 (같은 저장소) | 패키지 배포 필요 |
| 의존성 관리 | 통합 관리 | 개별 관리 |
| CI/CD | 영향 범위 분석 필요 | 독립적 |
| 코드 리뷰 | 전체 맥락 파악 가능 | 저장소별 분리 |
| 접근 제어 | 세밀한 제어 어려움 | 저장소별 제어 |
| 저장소 크기 | 커짐 | 작게 유지 |
| 사용 기업 | Google, Meta, Uber | Netflix, Spotify |

### 8-2. Git Submodule

외부 저장소를 현재 저장소의 하위 디렉토리로 포함합니다.

```bash
# 서브모듈 추가
git submodule add https://github.com/team/shared-lib.git libs/shared
git commit -m "chore: shared-lib 서브모듈 추가"

# 서브모듈 포함하여 클론
git clone --recurse-submodules https://github.com/team/main-project.git

# 기존 클론에서 서브모듈 초기화
git submodule init
git submodule update

# 서브모듈 업데이트 (최신 커밋으로)
git submodule update --remote libs/shared
git add libs/shared
git commit -m "chore: shared-lib 업데이트"

# 모든 서브모듈 일괄 업데이트
git submodule foreach 'git pull origin main'

# 서브모듈 제거
git submodule deinit libs/shared
git rm libs/shared
rm -rf .git/modules/libs/shared
git commit -m "chore: shared-lib 서브모듈 제거"
```

```
# .gitmodules 파일 내용
[submodule "libs/shared"]
    path = libs/shared
    url = https://github.com/team/shared-lib.git
    branch = main
```

### 8-3. Git Subtree

서브모듈보다 단순한 방식으로 외부 저장소를 통합합니다.

```bash
# subtree 추가
git subtree add --prefix=libs/shared \
  https://github.com/team/shared-lib.git main --squash

# subtree 업데이트 (원격에서 가져오기)
git subtree pull --prefix=libs/shared \
  https://github.com/team/shared-lib.git main --squash

# subtree 푸시 (변경분을 원격에 반영)
git subtree push --prefix=libs/shared \
  https://github.com/team/shared-lib.git main

# subtree 분리 (독립 저장소로 추출)
git subtree split --prefix=libs/shared --branch shared-only
```

| 항목 | Submodule | Subtree |
|------|-----------|---------|
| 저장 방식 | 참조(포인터)만 저장 | 파일 전체 복사 |
| 클론 | `--recurse-submodules` 필요 | 일반 클론 OK |
| 의존성 | 별도 초기화 필요 | 추가 작업 없음 |
| 히스토리 | 분리됨 | 통합됨 |
| 양방향 동기화 | 가능 (별도 push) | 가능 (subtree push) |
| 적합 | 독립 라이브러리 | 통합 관리 선호 시 |

### 8-4. Turborepo 설정

```json
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "!.next/cache/**"]
    },
    "test": {
      "dependsOn": ["build"],
      "inputs": ["src/**/*.ts", "src/**/*.tsx", "test/**/*.ts"]
    },
    "lint": {
      "dependsOn": ["^build"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "deploy": {
      "dependsOn": ["build", "test", "lint"],
      "outputs": []
    }
  }
}
```

```json
// package.json (루트)
{
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "test": "turbo run test",
    "lint": "turbo run lint"
  },
  "devDependencies": {
    "turbo": "^2.0.0"
  }
}
```

```bash
# 특정 패키지만 빌드
npx turbo run build --filter=@myapp/web

# 변경된 패키지만 빌드
npx turbo run build --filter='...[HEAD~1]'

# 의존성 그래프 시각화
npx turbo run build --graph

# 캐시 상태 확인
npx turbo run build --summarize
```

### 8-5. sparse-checkout

대용량 저장소에서 필요한 디렉토리만 체크아웃합니다.

```bash
# sparse-checkout으로 클론
git clone --filter=blob:none --sparse https://github.com/big/monorepo.git
cd monorepo

# 필요한 디렉토리만 체크아웃
git sparse-checkout set apps/web packages/ui packages/utils

# 디렉토리 추가
git sparse-checkout add apps/mobile

# 현재 설정 확인
git sparse-checkout list

# cone 모드 (디렉토리 단위, 더 빠름)
git sparse-checkout set --cone apps/web packages/ui

# sparse-checkout 해제
git sparse-checkout disable
```

### 8-6. 대용량 저장소 최적화

```bash
# 저장소 크기 확인
git count-objects -v -H

# 큰 파일 찾기
git rev-list --objects --all | \
  git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' | \
  sed -n 's/^blob //p' | \
  sort -rnk2 | head -20

# partial clone (blob 없이 클론)
git clone --filter=blob:none https://github.com/big/repo.git

# treeless clone (tree도 없이)
git clone --filter=tree:0 https://github.com/big/repo.git

# shallow clone (최근 N개 커밋만)
git clone --depth=1 https://github.com/big/repo.git

# shallow clone 확장
git fetch --unshallow    # 전체 히스토리 가져오기
git fetch --depth=100    # 100개 커밋까지 확장
```

### 8-7. GitHub Actions에서 모노레포 최적화

```yaml
# .github/workflows/monorepo-ci.yml
name: Monorepo CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  detect-changes:
    runs-on: ubuntu-latest
    outputs:
      web: ${{ steps.changes.outputs.web }}
      api: ${{ steps.changes.outputs.api }}
      shared: ${{ steps.changes.outputs.shared }}
    steps:
      - uses: actions/checkout@v4
      - uses: dorny/paths-filter@v3
        id: changes
        with:
          filters: |
            web:
              - 'apps/web/**'
              - 'packages/ui/**'
            api:
              - 'apps/api/**'
              - 'packages/utils/**'
            shared:
              - 'packages/**'

  test-web:
    needs: detect-changes
    if: needs.detect-changes.outputs.web == 'true'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npx turbo run test --filter=@myapp/web

  test-api:
    needs: detect-changes
    if: needs.detect-changes.outputs.api == 'true'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npx turbo run test --filter=@myapp/api
```

### 체크포인트

- [ ] 모노레포와 폴리레포의 장단점을 설명할 수 있다
- [ ] submodule과 subtree의 차이를 이해하고 선택할 수 있다
- [ ] Turborepo의 `--filter` 옵션으로 특정 패키지만 빌드할 수 있다
- [ ] sparse-checkout으로 필요한 디렉토리만 체크아웃할 수 있다

---

## 9. 마이그레이션

### 학습 목표

- SVN에서 Git으로 저장소를 마이그레이션한다
- Git LFS로 대용량 파일을 관리한다
- git-filter-repo로 히스토리를 정리한다
- 저장소 분할과 합병을 수행한다

### 9-1. SVN에서 Git으로 마이그레이션

```bash
# 사용자 매핑 파일 생성
# svn-authors.txt
# svnuser1 = Git Name1 <email1@example.com>
# svnuser2 = Git Name2 <email2@example.com>

# SVN 사용자 목록 추출
svn log --quiet https://svn.example.com/repo | \
  grep "^r" | awk '{print $3}' | sort -u > svn-users.txt

# git-svn으로 변환
git svn clone \
  --stdlayout \
  --authors-file=svn-authors.txt \
  --no-metadata \
  https://svn.example.com/repo \
  git-repo

cd git-repo

# SVN 태그를 Git 태그로 변환
for tag in $(git branch -r | grep "tags/"); do
  TAG_NAME=$(echo "$tag" | sed 's|tags/||')
  git tag "$TAG_NAME" "$tag"
  git branch -r -d "$tag"
done

# SVN 브랜치를 Git 브랜치로 변환
for branch in $(git branch -r | grep -v "tags/\|trunk"); do
  BRANCH_NAME=$(echo "$branch" | sed 's|origin/||')
  git branch "$BRANCH_NAME" "$branch"
done

# 원격 저장소 설정 및 푸시
git remote add origin https://github.com/team/new-repo.git
git push -u origin --all
git push origin --tags
```

### 9-2. Git LFS (Large File Storage)

```bash
# Git LFS 설치 확인
git lfs version

# 저장소에서 LFS 초기화
git lfs install

# 추적할 파일 패턴 지정
git lfs track "*.psd"
git lfs track "*.zip"
git lfs track "*.mp4"
git lfs track "models/*.bin"

# .gitattributes 확인 (자동 생성됨)
cat .gitattributes
# *.psd filter=lfs diff=lfs merge=lfs -text
# *.zip filter=lfs diff=lfs merge=lfs -text

# .gitattributes 커밋 (LFS 설정 공유)
git add .gitattributes
git commit -m "chore: Git LFS 설정 추가"

# LFS 파일 추가 및 커밋
git add design.psd
git commit -m "feat: 디자인 파일 추가"
git push

# LFS 상태 확인
git lfs status
git lfs ls-files

# 기존 파일을 LFS로 마이그레이션
git lfs migrate import --include="*.psd,*.zip" --everything
git push --force-with-lease origin --all
```

**LFS 사용 가이드:**

| 파일 유형 | LFS 사용 | 이유 |
|----------|---------|------|
| 이미지 (PSD, AI) | 사용 | 대용량 바이너리 |
| 동영상 (MP4, MOV) | 사용 | 대용량 바이너리 |
| 압축파일 (ZIP, TAR) | 사용 | 대용량 바이너리 |
| ML 모델 (BIN, H5) | 사용 | 대용량 바이너리 |
| 폰트 (TTF, OTF) | 상황에 따라 | 비교적 작은 크기 |
| 소스 코드 | 사용 안 함 | 텍스트, diff 가능 |
| JSON/YAML | 사용 안 함 | 텍스트, diff 가능 |

### 9-3. git-filter-repo (히스토리 정리)

```bash
# 설치
pip install git-filter-repo

# 특정 파일 히스토리에서 완전 삭제
git filter-repo --path secrets.env --invert-paths

# 특정 디렉토리만 남기기 (저장소 분할)
git filter-repo --path src/frontend/ --path package.json

# 디렉토리 이름 변경 (히스토리 포함)
git filter-repo --path-rename old-name/:new-name/

# 커밋 작성자 변경
git filter-repo --mailmap mailmap.txt
# mailmap.txt:
# New Name <new@email.com> <old@email.com>

# 대용량 파일 제거 (10MB 이상)
git filter-repo --strip-blobs-bigger-than 10M

# 특정 문자열 치환 (시크릿 제거)
git filter-repo --replace-text replacements.txt
# replacements.txt:
# AKIAIOSFODNN7EXAMPLE==>REDACTED
# password123==>REDACTED

# 분석만 수행 (변경 없음)
git filter-repo --analyze
ls .git/filter-repo/analysis/
```

### 9-4. 저장소 분할

하나의 저장소를 여러 저장소로 분할합니다.

```bash
# 원본 저장소 백업
git clone --mirror https://github.com/team/monorepo.git monorepo-backup

# 프론트엔드 저장소 추출
git clone https://github.com/team/monorepo.git frontend-repo
cd frontend-repo
git filter-repo \
  --path apps/web/ \
  --path packages/ui/ \
  --path-rename apps/web/:

# 새 원격 설정 및 푸시
git remote add origin https://github.com/team/frontend.git
git push -u origin main --force

# 백엔드 저장소 추출 (동일 방식)
cd ..
git clone https://github.com/team/monorepo.git backend-repo
cd backend-repo
git filter-repo \
  --path apps/api/ \
  --path packages/utils/ \
  --path-rename apps/api/:

git remote add origin https://github.com/team/backend.git
git push -u origin main --force
```

### 9-5. 저장소 합병

여러 저장소를 하나로 합칩니다.

```bash
# 새 모노레포 생성
mkdir monorepo && cd monorepo
git init
echo "# Monorepo" > README.md
git add . && git commit -m "init: 모노레포 초기화"

# 프론트엔드 저장소 병합
git remote add frontend https://github.com/team/frontend.git
git fetch frontend
git merge frontend/main --allow-unrelated-histories \
  -m "merge: frontend 저장소 병합"
mkdir -p apps/web
git mv $(ls -A | grep -v apps | grep -v .git | grep -v README.md) apps/web/
git commit -m "refactor: frontend를 apps/web/으로 이동"

# 백엔드 저장소 병합
git remote add backend https://github.com/team/backend.git
git fetch backend
git merge backend/main --allow-unrelated-histories \
  -m "merge: backend 저장소 병합"
# ... 파일 이동 ...

# 불필요한 리모트 제거
git remote remove frontend
git remote remove backend
```

### 9-6. 마이그레이션 체크리스트

| 단계 | 작업 | 확인 |
|------|------|------|
| 1 | 원본 저장소 백업 (mirror clone) | [ ] |
| 2 | 브랜치/태그 목록 정리 | [ ] |
| 3 | 대용량 파일 식별 및 LFS 전환 | [ ] |
| 4 | 시크릿 히스토리 스캔 및 제거 | [ ] |
| 5 | 커밋 작성자 매핑 | [ ] |
| 6 | 테스트 저장소에서 검증 | [ ] |
| 7 | CI/CD 파이프라인 이전 | [ ] |
| 8 | 팀 공지 및 전환 일정 공유 | [ ] |
| 9 | 원본 저장소 아카이브 | [ ] |
| 10 | DNS/웹훅/연동 서비스 업데이트 | [ ] |

### 체크포인트

- [ ] SVN에서 Git으로 마이그레이션하는 절차를 알고 있다
- [ ] Git LFS를 설정하고 대용량 파일을 관리할 수 있다
- [ ] git-filter-repo로 히스토리를 정리할 수 있다
- [ ] 저장소 분할·합병 작업을 수행할 수 있다

---

## 10. 다음 단계

### 학습 목표

- DevOps/SRE 관점에서 Git 활용 방향을 파악한다
- 오픈소스 메인테이너로서의 역할을 이해한다
- GitOps 개념과 도구를 살펴본다
- 지속적 학습을 위한 심화 리소스를 파악한다

### 10-1. DevOps/SRE 연계

Git과 GitHub를 DevOps 파이프라인의 핵심으로 활용합니다.

```yaml
# Infrastructure as Code (Terraform + GitHub Actions)
# .github/workflows/terraform.yml
name: Terraform Plan & Apply

on:
  pull_request:
    paths: ['infrastructure/**']
  push:
    branches: [main]
    paths: ['infrastructure/**']

jobs:
  plan:
    runs-on: ubuntu-latest
    if: github.event_name == 'pull_request'
    steps:
      - uses: actions/checkout@v4
      - uses: hashicorp/setup-terraform@v3

      - name: Terraform Init
        run: terraform init
        working-directory: infrastructure

      - name: Terraform Plan
        run: terraform plan -no-color -out=tfplan
        working-directory: infrastructure

      - name: PR에 Plan 결과 코멘트
        uses: actions/github-script@v7
        with:
          script: |
            const output = `#### Terraform Plan
            \`\`\`
            ${process.env.PLAN_OUTPUT}
            \`\`\`
            *변경사항을 확인해주세요.*`;
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: output
            });

  apply:
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    environment: production
    steps:
      - uses: actions/checkout@v4
      - uses: hashicorp/setup-terraform@v3
      - run: terraform init && terraform apply -auto-approve
        working-directory: infrastructure
```

### 10-2. GitOps

Git 저장소를 인프라 상태의 단일 원천(Single Source of Truth)으로 사용합니다.

```
[GitOps 흐름]

개발자 ─→ Git Push ─→ GitHub ─→ ArgoCD/Flux ─→ Kubernetes
                        │
                   (PR 리뷰)
                        │
                   (자동 동기화)
                        │
                   클러스터 상태 == Git 상태
```

**GitOps 원칙:**

| 원칙 | 설명 |
|------|------|
| 선언적 기술 | 원하는 상태를 YAML/JSON으로 정의 |
| 버전 관리 | 모든 변경 이력이 Git에 기록 |
| 자동 적용 | Git 변경 → 자동으로 인프라 반영 |
| 자가 치유 | 실제 상태가 Git과 다르면 자동 복구 |

```yaml
# ArgoCD Application 예시
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: my-app
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/team/k8s-manifests.git
    targetRevision: main
    path: apps/my-app
  destination:
    server: https://kubernetes.default.svc
    namespace: production
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
      - CreateNamespace=true
```

### 10-3. 오픈소스 메인테이너 가이드

오픈소스 프로젝트 운영에 필요한 GitHub 설정입니다.

```markdown
<!-- .github/CONTRIBUTING.md (기여 가이드) -->
# 기여 가이드

## 시작하기

1. 저장소를 Fork합니다
2. Feature 브랜치를 생성합니다 (`feat/기능명`)
3. 변경사항을 커밋합니다 (Conventional Commits)
4. Pull Request를 생성합니다

## 코드 스타일
- ESLint + Prettier 설정을 따릅니다
- `npm run lint`가 통과해야 합니다

## PR 규칙
- 제목은 Conventional Commits 형식
- 본문에 변경 이유를 설명해주세요
- 테스트가 포함되어야 합니다

## 이슈 보고
- 버그: Bug Report 템플릿 사용
- 기능 제안: Feature Request 템플릿 사용
```

```yaml
# .github/ISSUE_TEMPLATE/bug_report.yml
name: 버그 리포트
description: 버그를 신고합니다
labels: ["bug", "triage"]
body:
  - type: textarea
    id: description
    attributes:
      label: 버그 설명
      description: 버그가 무엇인지 설명해주세요
    validations:
      required: true

  - type: textarea
    id: reproduce
    attributes:
      label: 재현 방법
      description: 버그를 재현하는 단계를 적어주세요
      placeholder: |
        1. '...'에 접속
        2. '...'를 클릭
        3. 에러 발생
    validations:
      required: true

  - type: textarea
    id: expected
    attributes:
      label: 기대 동작
      description: 원래 어떻게 동작해야 하나요?

  - type: dropdown
    id: severity
    attributes:
      label: 심각도
      options:
        - 낮음 (불편하지만 사용 가능)
        - 보통 (일부 기능 제한)
        - 높음 (핵심 기능 불가)
        - 긴급 (서비스 전체 장애)
    validations:
      required: true

  - type: input
    id: version
    attributes:
      label: 버전
      placeholder: "v1.2.3"
```

### 10-4. GitHub Discussions 활용

```bash
# Discussions 활성화 (저장소 설정에서)
gh api repos/{owner}/{repo} \
  --method PATCH \
  --field has_discussions=true

# Discussion 카테고리 구성
# - Announcements (공지)
# - Q&A (질문/답변)
# - Ideas (아이디어 제안)
# - Show and Tell (프로젝트 공유)
```

### 10-5. 심화 학습 리소스

| 주제 | 리소스 | 링크 |
|------|--------|------|
| Git 내부 | Pro Git — Git Internals | [git-scm.com/book/ko](https://git-scm.com/book/ko/v2/Git%EC%9D%98-%EB%82%B4%EB%B6%80-Plumbing-%EB%AA%85%EB%A0%B9%EA%B3%BC-Porcelain-%EB%AA%85%EB%A0%B9) |
| GitHub Actions | GitHub Actions Certification | [github.com/skills](https://resources.github.com/learn/certifications/) |
| GitOps | Argo CD 공식 문서 | [argo-cd.readthedocs.io](https://argo-cd.readthedocs.io/) |
| 모노레포 | Turborepo Handbook | [turbo.build/repo/docs](https://turbo.build/repo/docs) |
| 보안 | GitHub Security Lab | [securitylab.github.com](https://securitylab.github.com/) |
| 오픈소스 | Open Source Guide | [opensource.guide/ko](https://opensource.guide/ko/) |
| CI/CD | GitHub Actions Patterns | [github.com/matchai/awesome-pinned-gists](https://github.com/sdras/awesome-actions) |

### 10-6. 학습 로드맵

```
[Git/GitHub 개발자 학습 로드맵]

Git 내부 구조 이해
     │
     ├── 브랜치 전략 설계
     │        │
     │        └── 팀 컨벤션 수립
     │
     ├── GitHub Actions 심화
     │        │
     │        ├── 매트릭스 빌드
     │        ├── 재사용 워크플로
     │        └── 자체 호스팅 러너
     │
     ├── 코드 품질 자동화
     │        │
     │        ├── Git Hooks (Husky)
     │        ├── CODEOWNERS
     │        └── AI 코드 리뷰
     │
     ├── 보안
     │        │
     │        ├── Dependabot
     │        ├── CodeQL
     │        └── GPG 서명
     │
     ├── 인프라
     │        │
     │        ├── 모노레포 (Turborepo/Nx)
     │        └── GitOps (ArgoCD/Flux)
     │
     └── 오픈소스
              │
              ├── 메인테이너 스킬
              └── 커뮤니티 운영
```

### 체크포인트

- [ ] GitOps의 4가지 원칙을 설명할 수 있다
- [ ] 오픈소스 프로젝트에 필요한 파일 구조를 안다
- [ ] 자신의 다음 학습 방향을 정할 수 있다
- [ ] 이 교안의 내용을 실무에 적용할 계획이 있다

---

## 출처 및 참고 자료

### 공식 문서

| 출처 | URL |
|------|-----|
| Git 공식 문서 (Pro Git) | https://git-scm.com/book/ko/v2 |
| GitHub Docs | https://docs.github.com/ko |
| GitHub CLI 매뉴얼 | https://cli.github.com/manual/ |
| GitHub Actions 문서 | https://docs.github.com/en/actions |
| Conventional Commits | https://www.conventionalcommits.org/ko/ |
| Turborepo 문서 | https://turbo.build/repo/docs |

### 커뮤니티 리소스

| 출처 | URL |
|------|-----|
| Atlassian Git 튜토리얼 | https://www.atlassian.com/git/tutorials |
| GitHub Skills | https://skills.github.com/ |
| Open Source Guide (한국어) | https://opensource.guide/ko/ |
| Awesome GitHub Actions | https://github.com/sdras/awesome-actions |

### 도구

| 도구 | URL |
|------|-----|
| Husky | https://typicode.github.io/husky/ |
| commitlint | https://commitlint.js.org/ |
| git-filter-repo | https://github.com/newren/git-filter-repo |
| delta (diff 페이저) | https://github.com/dandavison/delta |
| ArgoCD | https://argo-cd.readthedocs.io/ |

### 교안 정보

| 항목 | 내용 |
|------|------|
| 작성일 | 2026년 3월 9일 |
| 대상 | 러버블 바이브코딩 카톡방 참여자 |
| 시리즈 | Git/GitHub 교안 (초보자편 → 중급자편 → **개발자편**) |

---

> **수고하셨습니다!** 이 교안의 내용을 모두 실습하셨다면, Git과 GitHub를 활용한 팀 워크플로 설계, CI/CD 파이프라인 구축, 보안 자동화까지 할 수 있는 수준에 도달한 것입니다. 다음 단계로 GitOps, 오픈소스 메인테이너, 또는 DevOps 엔지니어링을 도전해보세요!
