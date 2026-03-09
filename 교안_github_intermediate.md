# Git/GitHub 중급 교안 — "Git 브랜치와 GitHub 협업"

> **대상**: Git 기본(add, commit, push)은 알지만 브랜치, PR, 협업을 배우고 싶은 분
> **목표**: 브랜치 전략, Pull Request, 코드 리뷰, 충돌 해결을 마스터하기
> **소요 시간**: 약 4~5시간

---

## 어떤 교안을 봐야 할까요?

- Git의 `add`, `commit`, `push` 명령어를 사용해본 적이 있다
- GitHub 계정이 있고, 저장소를 만들어본 경험이 있다
- 하지만 브랜치를 만들거나 Pull Request를 해본 적은 없다
- 혼자가 아닌 팀으로 협업하는 방법을 배우고 싶다

> Git이 처음이라면 → **초보자편** 교안을 먼저 보세요.
> Git 내부 구조나 CI/CD 파이프라인을 깊이 다루고 싶다면 → **개발자편** 교안을 추천합니다.

---

### 추천 리소스

| 리소스 | 설명 | 링크 |
|--------|------|------|
| Git 공식 문서 | 명령어 레퍼런스 및 Pro Git 책 (한국어) | [git-scm.com/book/ko](https://git-scm.com/book/ko/v2) |
| GitHub Docs | GitHub 공식 가이드 (한국어 지원) | [docs.github.com](https://docs.github.com/ko) |
| Learn Git Branching | 시각적 브랜치 학습 도구 (강력 추천) | [learngitbranching.js.org](https://learngitbranching.js.org/?locale=ko) |
| GitHub Skills | 실습 기반 GitHub 학습 코스 | [skills.github.com](https://skills.github.com/) |
| Oh My Git! | Git을 게임으로 배우는 도구 | [ohmygit.org](https://ohmygit.org/) |

---

## 목차

1. [브랜치 전략](#1-브랜치-전략)
2. [병합과 충돌 해결](#2-병합과-충돌-해결)
3. [Pull Request 완전 정복](#3-pull-request-완전-정복)
4. [GitHub Issues와 프로젝트 관리](#4-github-issues와-프로젝트-관리)
5. [Fork와 오픈소스 기여](#5-fork와-오픈소스-기여)
6. [Git 고급 명령어](#6-git-고급-명령어)
7. [GitHub Actions 입문](#7-github-actions-입문)
8. [GitHub Pages로 배포하기](#8-github-pages로-배포하기)
9. [협업 실습 프로젝트](#9-협업-실습-프로젝트)
10. [트러블슈팅 & FAQ](#10-트러블슈팅--faq)

---

## 사전 준비 체크리스트

시작하기 전에 아래 항목을 확인하세요.

### 필수 설치

| 도구 | 확인 명령어 | 최소 버전 |
|------|------------|----------|
| Git | `git --version` | 2.30 이상 |
| VS Code | — | 최신 버전 |
| GitHub 계정 | — | 가입 완료 |

### Git 초기 설정 (아직 안 했다면)

```bash
# 사용자 정보 설정
git config --global user.name "홍길동"
git config --global user.email "hong@example.com"

# 기본 브랜치명을 main으로 설정
git config --global init.defaultBranch main

# 줄바꿈 설정 (Windows)
git config --global core.autocrlf true

# 줄바꿈 설정 (Mac/Linux)
git config --global core.autocrlf input

# 설정 확인
git config --list
```

### VS Code 추천 확장 프로그램

| 확장 프로그램 | 설명 |
|-------------|------|
| **GitLens** | 커밋 히스토리, blame, 비교 등 Git 심화 기능 |
| **Git Graph** | 브랜치 그래프를 시각적으로 표시 |
| **GitHub Pull Requests** | VS Code에서 직접 PR 생성/리뷰 |
| **Git History** | 파일별 변경 이력 확인 |

### 실습용 저장소 준비

```bash
# 실습용 폴더 생성 및 초기화
mkdir git-intermediate-practice
cd git-intermediate-practice
git init

# 기본 파일 생성
echo "# Git 중급 실습" > README.md
echo "console.log('Hello Git!');" > app.js
echo "body { margin: 0; }" > style.css

# 첫 번째 커밋
git add .
git commit -m "프로젝트 초기 설정"

# GitHub 원격 저장소 연결 (본인 저장소 URL로 변경)
git remote add origin https://github.com/YOUR_USERNAME/git-intermediate-practice.git
git push -u origin main
```

---

## 1. 브랜치 전략

### 학습 목표

- 브랜치의 개념과 필요성을 이해한다
- 브랜치 생성, 전환, 삭제 명령어를 능숙하게 사용한다
- Git Flow, GitHub Flow, Trunk-Based 전략의 차이를 파악한다
- 팀에 맞는 브랜치 네이밍 규칙을 적용할 수 있다

---

### 1.1 브랜치란 무엇인가?

브랜치(Branch)는 독립적인 작업 공간입니다. 나뭇가지가 줄기에서 갈라져 나오듯, 코드의 특정 시점에서 분기하여 원래 코드에 영향을 주지 않고 새로운 작업을 할 수 있습니다.

#### 왜 브랜치가 필요한가?

| 상황 | 브랜치 없이 | 브랜치 사용 시 |
|------|-----------|-------------|
| 새 기능 개발 | 기존 코드에 직접 수정 → 버그 위험 | 별도 브랜치에서 안전하게 개발 |
| 버그 수정 | 개발 중인 코드와 섞임 | 핫픽스 브랜치로 즉시 대응 |
| 실험적 시도 | 실패 시 되돌리기 어려움 | 브랜치 삭제로 깔끔하게 정리 |
| 팀 협업 | 같은 파일 수정 시 충돌 빈발 | 각자 브랜치에서 독립 작업 |

#### 브랜치의 시각적 이해

```
          feature/login
          ┌──●──●──●
         /            \
main ●──●──●───────────●──●  (머지)
         \            /
          └──●──●──●
          feature/signup
```

- `main`: 항상 배포 가능한 안정적인 코드
- `feature/login`: 로그인 기능을 개발하는 독립 공간
- `feature/signup`: 회원가입 기능을 개발하는 독립 공간
- 각 브랜치에서 작업 완료 후 main에 합침(머지)

---

### 1.2 브랜치 기본 명령어

#### 브랜치 목록 확인

```bash
# 로컬 브랜치 목록
git branch

# 원격 브랜치 포함 전체 목록
git branch -a

# 원격 브랜치만 보기
git branch -r

# 각 브랜치의 마지막 커밋 정보 포함
git branch -v

# 이미 머지된 브랜치만 보기
git branch --merged

# 아직 머지되지 않은 브랜치만 보기
git branch --no-merged
```

#### 브랜치 생성

```bash
# 새 브랜치 생성 (현재 브랜치에 머무름)
git branch feature/login

# 새 브랜치 생성 + 즉시 전환
git checkout -b feature/login

# (Git 2.23+) switch 명령어로 생성 + 전환
git switch -c feature/login

# 특정 커밋에서 브랜치 생성
git branch feature/login abc1234

# 원격 브랜치를 기반으로 로컬 브랜치 생성
git checkout -b feature/login origin/feature/login
```

> **팁**: `checkout`은 브랜치 전환과 파일 복원 두 가지 역할을 해서 혼란스러울 수 있습니다. Git 2.23부터 도입된 `switch`(브랜치 전환)와 `restore`(파일 복원)를 사용하면 더 명확합니다.

#### 브랜치 전환

```bash
# 기존 방식
git checkout feature/login

# (Git 2.23+) 새로운 방식 (권장)
git switch feature/login

# 이전 브랜치로 돌아가기
git switch -
```

**주의**: 브랜치를 전환하기 전에 현재 작업을 커밋하거나 stash해야 합니다.

```bash
# 커밋하지 않은 변경사항이 있으면 경고 발생
git switch feature/login
# error: Your local changes to the following files would be overwritten...

# 해결 방법 1: 커밋하기
git add .
git commit -m "작업 중간 저장"
git switch feature/login

# 해결 방법 2: stash로 임시 저장
git stash
git switch feature/login
# ... 작업 후 돌아와서
git stash pop
```

#### 브랜치 삭제

```bash
# 로컬 브랜치 삭제 (머지 완료된 브랜치만)
git branch -d feature/login

# 강제 삭제 (머지 여부 무관)
git branch -D feature/login

# 원격 브랜치 삭제
git push origin --delete feature/login

# 원격에서 삭제된 브랜치의 로컬 추적 정보 정리
git fetch --prune
```

#### 브랜치 이름 변경

```bash
# 현재 브랜치 이름 변경
git branch -m new-name

# 특정 브랜치 이름 변경
git branch -m old-name new-name

# 원격에도 반영하려면
git push origin --delete old-name
git push -u origin new-name
```

---

### 1.3 브랜치 전략 비교

팀의 규모와 프로젝트 특성에 따라 적합한 브랜치 전략이 다릅니다.

#### Git Flow

가장 전통적이고 체계적인 전략입니다. 대규모 프로젝트에 적합합니다.

```
hotfix ────●──────────────────────────●──── hotfix
           │                          │
main  ●────●──────────────────────────●──── main (배포)
           │                          │
release    │    ●──●──●───────────────●──── release
           │   /                      │
develop ●──●──●──●──●──●──●──●──●──●──●──── develop
              /       \      /
feature      ●──●──●   ●──●               feature
```

| 브랜치 | 역할 | 수명 |
|--------|------|------|
| `main` | 배포된 코드. 태그로 버전 관리 | 영구 |
| `develop` | 다음 배포를 준비하는 개발 브랜치 | 영구 |
| `feature/*` | 새 기능 개발 | 기능 완료 시 삭제 |
| `release/*` | 배포 전 테스트/수정 | 배포 후 삭제 |
| `hotfix/*` | 긴급 버그 수정 | 수정 후 삭제 |

```bash
# Git Flow 예시 워크플로우

# 1. feature 브랜치 생성 (develop에서 분기)
git switch develop
git switch -c feature/user-auth

# 2. 기능 개발 및 커밋
git add .
git commit -m "사용자 인증 기능 추가"

# 3. develop에 머지
git switch develop
git merge feature/user-auth
git branch -d feature/user-auth

# 4. release 브랜치 생성
git switch -c release/1.0.0

# 5. 테스트 및 버그 수정 후 main에 머지
git switch main
git merge release/1.0.0
git tag v1.0.0

# 6. develop에도 머지
git switch develop
git merge release/1.0.0
git branch -d release/1.0.0
```

**장점**: 역할이 명확, 릴리스 관리 체계적
**단점**: 브랜치가 많아 복잡, 소규모 팀에 과도

---

#### GitHub Flow

GitHub이 사용하는 단순한 전략입니다. 소규모 팀이나 지속적 배포(CD) 환경에 적합합니다.

```
main     ●──●──●──●──●──●──●──●──●  (항상 배포 가능)
              \      /   \      /
feature        ●──●──●    ●──●      (PR로 머지)
```

**규칙**: 단 두 가지만 기억하세요.

1. `main` 브랜치는 항상 배포 가능한 상태 유지
2. 새 작업은 반드시 브랜치를 만들고, PR을 통해 머지

```bash
# GitHub Flow 예시 워크플로우

# 1. main에서 브랜치 생성
git switch main
git pull origin main
git switch -c feature/dark-mode

# 2. 작업 및 커밋 (여러 번 가능)
git add .
git commit -m "다크 모드 토글 UI 추가"
git add .
git commit -m "다크 모드 CSS 변수 적용"

# 3. 원격에 푸시
git push -u origin feature/dark-mode

# 4. GitHub에서 PR 생성 → 리뷰 → 머지

# 5. 로컬 정리
git switch main
git pull origin main
git branch -d feature/dark-mode
```

**장점**: 단순하고 배우기 쉬움, CI/CD와 잘 어울림
**단점**: 릴리스 버전 관리가 별도로 필요

---

#### Trunk-Based Development

모든 개발자가 `main`(trunk)에 직접 짧은 주기로 커밋하는 전략입니다. 고도로 자동화된 테스트가 전제됩니다.

```
main  ●──●──●──●──●──●──●──●──●  (모든 커밋이 여기로)
          \  /       \  /
short      ●          ●         (수명 1~2일 이하)
```

| 특징 | 설명 |
|------|------|
| 브랜치 수명 | 최대 1~2일 (짧을수록 좋음) |
| 머지 빈도 | 하루에 여러 번 |
| 테스트 | 자동화된 테스트 필수 |
| 피처 플래그 | 미완성 기능은 플래그로 숨김 |

**장점**: 통합 충돌 최소화, 빠른 피드백
**단점**: 높은 테스트 자동화 수준 필요

---

#### 전략 비교 요약

| 항목 | Git Flow | GitHub Flow | Trunk-Based |
|------|----------|-------------|-------------|
| **복잡도** | 높음 | 낮음 | 매우 낮음 |
| **팀 규모** | 대규모 | 소~중규모 | 모든 규모 |
| **배포 주기** | 정기 릴리스 | 수시 배포 | 지속 배포 |
| **브랜치 수** | 5종류 | 2종류 | 1~2종류 |
| **학습 난이도** | 어려움 | 쉬움 | 쉬움 (운영은 어려움) |
| **추천** | 앱/패키지 개발 | 웹 서비스 | 성숙한 팀 |

> **추천**: 처음이라면 **GitHub Flow**로 시작하세요. 단순하면서도 협업의 핵심(브랜치 + PR)을 모두 경험할 수 있습니다.

---

### 1.4 브랜치 네이밍 규칙

좋은 브랜치 이름은 작업 내용을 즉시 파악할 수 있게 합니다.

#### 추천 네이밍 패턴

```
{type}/{description}
{type}/{issue-number}-{description}
```

#### 타입별 접두사

| 접두사 | 용도 | 예시 |
|--------|------|------|
| `feature/` | 새 기능 | `feature/user-login` |
| `fix/` | 버그 수정 | `fix/header-overflow` |
| `hotfix/` | 긴급 수정 | `hotfix/security-patch` |
| `refactor/` | 코드 개선 | `refactor/api-structure` |
| `docs/` | 문서 수정 | `docs/api-guide` |
| `test/` | 테스트 추가 | `test/auth-unit-test` |
| `chore/` | 설정/빌드 변경 | `chore/eslint-config` |

#### 네이밍 규칙

```bash
# 좋은 예
feature/42-user-authentication
fix/login-redirect-loop
docs/update-readme

# 나쁜 예
Feature/Login          # 대문자 사용 (X)
my-branch              # 타입 접두사 없음 (X)
feature/fix-bug        # 모호한 설명 (X)
feature/implement-the-new-user-login-page-with-oauth  # 너무 긴 이름 (X)
```

**규칙 요약**:
- 소문자 + 하이픈(`-`) 사용
- 타입 접두사 필수
- 간결하되 의미 있는 설명
- 이슈 번호 포함 시 추적 용이

---

### 1.5 실습: 브랜치 만들고 작업하기

```bash
# 1. 현재 상태 확인
git branch
# * main

# 2. 새 브랜치 생성 + 전환
git switch -c feature/navigation

# 3. 파일 수정
echo '<nav><a href="/">Home</a><a href="/about">About</a></nav>' > nav.html

# 4. 커밋
git add nav.html
git commit -m "네비게이션 컴포넌트 추가"

# 5. 또 다른 수정
echo '<nav><a href="/">Home</a><a href="/about">About</a><a href="/contact">Contact</a></nav>' > nav.html
git add nav.html
git commit -m "Contact 링크 추가"

# 6. 브랜치 히스토리 확인
git log --oneline --graph --all
# * abc1234 (feature/navigation) Contact 링크 추가
# * def5678 네비게이션 컴포넌트 추가
# * 111aaaa (main) 프로젝트 초기 설정

# 7. main으로 돌아가기
git switch main
# nav.html이 없는 것을 확인! (main에는 아직 없음)

# 8. 확인 후 다시 feature로
git switch feature/navigation
# nav.html이 다시 나타남!
```

---

### 체크포인트 1

아래 질문에 답할 수 있다면 다음 섹션으로 넘어가세요.

- [ ] `git branch`와 `git switch -c`의 차이를 설명할 수 있다
- [ ] Git Flow, GitHub Flow, Trunk-Based의 차이를 말할 수 있다
- [ ] 브랜치 네이밍 규칙(`feature/`, `fix/` 등)을 적용할 수 있다
- [ ] `git branch -d`와 `git branch -D`의 차이를 안다
- [ ] 우리 팀에 어떤 브랜치 전략이 적합한지 판단할 수 있다

---

## 2. 병합과 충돌 해결

### 학습 목표

- merge와 rebase의 차이를 정확히 이해한다
- 충돌이 왜 발생하는지 원인을 파악한다
- VS Code에서 충돌을 시각적으로 해결할 수 있다
- 실습을 통해 충돌 해결 경험을 쌓는다

---

### 2.1 Merge (병합)

merge는 두 브랜치의 변경사항을 하나로 합치는 가장 기본적인 방법입니다.

#### Fast-Forward Merge

분기 후 main에 새 커밋이 없을 때 발생합니다. 별도의 머지 커밋 없이 포인터만 이동합니다.

```
# Before merge
main     ●──●
               \
feature         ●──●──●

# After merge (fast-forward)
main     ●──●──●──●──●
```

```bash
# Fast-Forward Merge 예시
git switch main
git merge feature/navigation
# Updating abc1234..def5678
# Fast-forward
#  nav.html | 1 +
#  1 file changed, 1 insertion(+)
```

#### 3-Way Merge

분기 후 main에도 새 커밋이 있을 때 발생합니다. 머지 커밋이 자동 생성됩니다.

```
# Before merge
main     ●──●──●──●
               \
feature         ●──●

# After merge (3-way)
main     ●──●──●──●──●  (머지 커밋)
               \      /
feature         ●──●
```

```bash
# 3-Way Merge 예시
git switch main
git merge feature/navigation
# 자동으로 머지 커밋 생성됨
# Merge made by the 'ort' strategy.
```

#### Merge 옵션

```bash
# 기본 머지 (fast-forward 가능하면 FF, 아니면 3-way)
git merge feature/navigation

# 항상 머지 커밋 생성 (FF 가능해도)
git merge --no-ff feature/navigation

# 머지 커밋 메시지 직접 지정
git merge --no-ff -m "feature/navigation 브랜치 머지" feature/navigation

# 머지 취소 (충돌 발생 시)
git merge --abort

# 머지 전 변경사항 미리보기
git diff main...feature/navigation
```

> **팁**: `--no-ff` 옵션을 사용하면 브랜치 히스토리가 명확하게 보존됩니다. 팀 규칙으로 `--no-ff`를 기본으로 사용하는 것을 추천합니다.

---

### 2.2 Rebase (리베이스)

rebase는 브랜치의 시작점을 다른 커밋으로 옮기는 작업입니다. 커밋 히스토리를 깔끔하게 유지할 수 있습니다.

#### Rebase의 원리

```
# Before rebase
main     ●──●──●──●  (C, D 커밋 추가됨)
               \
feature         ●──●  (E, F 커밋)

# After rebase
main     ●──●──●──●
                     \
feature               ●'──●'  (E', F' - 새로운 커밋)
```

rebase는 feature 브랜치의 커밋들을 main의 최신 커밋 위로 "재배치"합니다. 기존 커밋(E, F)은 새로운 커밋(E', F')으로 다시 만들어집니다.

```bash
# Rebase 기본 사용법
git switch feature/navigation
git rebase main

# rebase 후 fast-forward merge 가능
git switch main
git merge feature/navigation  # Fast-forward!
```

#### Rebase 중 충돌 해결

```bash
# rebase 중 충돌 발생 시
git rebase main
# CONFLICT (content): Merge conflict in app.js

# 1. 충돌 파일 수정
# 2. 스테이징
git add app.js

# 3. rebase 계속
git rebase --continue

# 또는 rebase 취소
git rebase --abort

# 또는 현재 커밋 건너뛰기
git rebase --skip
```

---

### 2.3 Merge vs Rebase 비교

| 항목 | Merge | Rebase |
|------|-------|--------|
| **히스토리** | 분기/합류 구조 보존 | 일직선 히스토리 |
| **커밋 변경** | 기존 커밋 유지 | 새로운 커밋 생성 (해시 변경) |
| **머지 커밋** | 생성됨 (3-way) | 없음 |
| **충돌 해결** | 한 번에 해결 | 커밋마다 해결 필요할 수 있음 |
| **안전성** | 높음 (비파괴적) | 주의 필요 (커밋 해시 변경) |
| **사용 시점** | 공유 브랜치 병합 | 로컬 브랜치 정리 |

#### 황금률: Rebase 사용 시 주의사항

```
절대 공유된 (이미 push한) 브랜치를 rebase하지 마세요!
```

rebase는 커밋 해시를 변경하므로, 다른 사람이 같은 브랜치를 사용 중이면 큰 혼란이 발생합니다.

```bash
# 안전한 사용 ✅
# 아직 push하지 않은 로컬 feature 브랜치에서
git switch feature/my-work
git rebase main

# 위험한 사용 ❌
# 이미 push한 브랜치를 rebase하고 force push
git rebase main
git push --force  # 다른 사람의 작업을 덮어쓸 수 있음!
```

#### 실전 추천 워크플로우

```bash
# 1. feature 브랜치에서 작업
git switch feature/login
# ... 여러 커밋 ...

# 2. main의 최신 변경사항을 rebase로 가져오기
git switch main
git pull origin main
git switch feature/login
git rebase main

# 3. 충돌 해결 후 PR 생성
git push -u origin feature/login
# GitHub에서 PR 생성

# 4. PR 머지 시 Squash Merge 사용
# GitHub PR 페이지에서 "Squash and merge" 선택
```

---

### 2.4 충돌(Conflict)이란?

두 브랜치에서 **같은 파일의 같은 부분**을 다르게 수정했을 때 Git이 자동으로 합칠 수 없어 발생합니다.

#### 충돌이 발생하는 경우

| 상황 | 충돌 여부 |
|------|----------|
| A는 `app.js` 수정, B는 `style.css` 수정 | 충돌 없음 (다른 파일) |
| A는 `app.js` 1~10줄 수정, B는 `app.js` 50~60줄 수정 | 충돌 없음 (다른 부분) |
| A는 `app.js` 5줄 수정, B도 `app.js` 5줄 수정 | **충돌 발생!** |
| A가 파일 삭제, B가 같은 파일 수정 | **충돌 발생!** |

#### 충돌 마커 읽기

충돌이 발생하면 Git이 파일에 특수 마커를 삽입합니다.

```
<<<<<<< HEAD
const greeting = "안녕하세요";    ← 현재 브랜치(main)의 코드
=======
const greeting = "반갑습니다";    ← 머지하려는 브랜치(feature)의 코드
>>>>>>> feature/greeting
```

| 마커 | 의미 |
|------|------|
| `<<<<<<< HEAD` | 현재 브랜치(HEAD)의 변경 시작 |
| `=======` | 두 변경사항의 구분선 |
| `>>>>>>> branch-name` | 머지 대상 브랜치의 변경 끝 |

#### 해결 방법

```
# 방법 1: 현재 브랜치(HEAD)의 코드만 유지
const greeting = "안녕하세요";

# 방법 2: 머지 대상 브랜치의 코드만 유지
const greeting = "반갑습니다";

# 방법 3: 두 코드를 조합하여 새로 작성
const greeting = "안녕하세요, 반갑습니다";

# 방법 4: 완전히 새로운 코드로 대체
const greeting = "환영합니다";
```

> **핵심**: 충돌 마커(`<<<<<<<`, `=======`, `>>>>>>>`)를 모두 제거하고, 원하는 코드만 남기면 됩니다.

---

### 2.5 VS Code에서 충돌 해결하기

VS Code는 충돌 해결을 위한 시각적 도구를 내장하고 있습니다.

#### 단계별 해결 과정

**1단계**: 충돌 파일 열기

VS Code의 소스 제어 패널(Ctrl+Shift+G)에서 충돌 파일을 확인합니다. 파일명 옆에 `C` (Conflict) 표시가 나타납니다.

**2단계**: 충돌 에디터에서 선택하기

VS Code는 충돌 영역 위에 편리한 버튼을 표시합니다:

```
Accept Current Change  |  Accept Incoming Change  |  Accept Both Changes  |  Compare Changes
```

| 버튼 | 동작 |
|------|------|
| **Accept Current Change** | HEAD(현재 브랜치)의 코드 유지 |
| **Accept Incoming Change** | 머지 대상 브랜치의 코드 유지 |
| **Accept Both Changes** | 두 코드 모두 유지 (순서대로) |
| **Compare Changes** | 변경사항을 나란히 비교 |

**3단계**: 3-Way Merge Editor 사용 (VS Code 1.69+)

```
1. 충돌 파일을 열면 상단에 "Resolve in Merge Editor" 버튼 클릭
2. 3개 패널이 나타남:
   - 왼쪽: 현재 브랜치(Ours)
   - 오른쪽: 머지 대상 브랜치(Theirs)
   - 하단: 결과 (여기서 최종 코드 확인/편집)
3. 체크박스를 클릭하여 원하는 변경사항 선택
4. 하단 결과 패널에서 직접 편집도 가능
5. "Complete Merge" 버튼으로 완료
```

**4단계**: 해결 완료 후 스테이징 및 커밋

```bash
# 충돌 해결 후
git add app.js
git commit -m "merge conflict 해결: app.js 인사말 통합"
```

---

### 2.6 실습: 의도적으로 충돌 만들고 해결하기

이 실습에서는 일부러 충돌을 만들어 해결하는 경험을 쌓습니다.

```bash
# 1. main 브랜치에서 시작
git switch main

# 2. 실습 파일 생성
cat > greeting.js << 'EOF'
function greet(name) {
    return `Hello, ${name}!`;
}

function farewell(name) {
    return `Goodbye, ${name}!`;
}

module.exports = { greet, farewell };
EOF

git add greeting.js
git commit -m "인사 모듈 생성"

# 3. feature-korean 브랜치 생성 후 수정
git switch -c feature/korean-greeting

cat > greeting.js << 'EOF'
function greet(name) {
    return `안녕하세요, ${name}님!`;
}

function farewell(name) {
    return `안녕히 가세요, ${name}님!`;
}

module.exports = { greet, farewell };
EOF

git add greeting.js
git commit -m "인사말을 한국어로 변경"

# 4. main으로 돌아가서 다르게 수정
git switch main

cat > greeting.js << 'EOF'
function greet(name) {
    const hour = new Date().getHours();
    if (hour < 12) return `Good morning, ${name}!`;
    if (hour < 18) return `Good afternoon, ${name}!`;
    return `Good evening, ${name}!`;
}

function farewell(name) {
    return `See you later, ${name}!`;
}

module.exports = { greet, farewell };
EOF

git add greeting.js
git commit -m "시간대별 인사 기능 추가"

# 5. 머지 시도 → 충돌 발생!
git merge feature/korean-greeting
# Auto-merging greeting.js
# CONFLICT (content): Merge conflict in greeting.js
# Automatic merge failed; fix conflicts and then commit the result.

# 6. 충돌 상태 확인
git status
# both modified:   greeting.js

# 7. VS Code에서 충돌 해결
# code greeting.js
# → 두 변경사항을 조합하여 시간대별 한국어 인사로 수정

# 8. 해결 후 커밋
git add greeting.js
git commit -m "한국어 시간대별 인사 기능 통합 (충돌 해결)"
```

#### 충돌 해결 후 예시 코드

```javascript
function greet(name) {
    const hour = new Date().getHours();
    if (hour < 12) return `좋은 아침이에요, ${name}님!`;
    if (hour < 18) return `안녕하세요, ${name}님!`;
    return `좋은 저녁이에요, ${name}님!`;
}

function farewell(name) {
    return `안녕히 가세요, ${name}님!`;
}

module.exports = { greet, farewell };
```

---

### 체크포인트 2

아래 질문에 답할 수 있다면 다음 섹션으로 넘어가세요.

- [ ] Fast-Forward Merge와 3-Way Merge의 차이를 설명할 수 있다
- [ ] merge와 rebase의 차이점을 3가지 이상 말할 수 있다
- [ ] "rebase는 공유 브랜치에서 사용하지 않는다"의 이유를 안다
- [ ] 충돌 마커(`<<<<<<<`, `=======`, `>>>>>>>`)를 읽고 해결할 수 있다
- [ ] VS Code의 Merge Editor를 사용하여 충돌을 해결할 수 있다

---

## 3. Pull Request 완전 정복

### 학습 목표

- Pull Request의 개념과 필요성을 이해한다
- PR을 생성하고 리뷰하는 전체 과정을 수행할 수 있다
- 효과적인 코드 리뷰 방법을 익힌다
- Squash Merge, Draft PR 등 고급 기능을 활용할 수 있다

---

### 3.1 Pull Request란?

Pull Request(PR)는 "내 브랜치의 변경사항을 main에 합쳐주세요"라는 요청입니다. 단순한 머지 요청을 넘어, 코드 리뷰와 토론의 장이 됩니다.

#### PR이 필요한 이유

| 목적 | 설명 |
|------|------|
| **코드 리뷰** | 다른 사람이 코드를 검토하여 품질 향상 |
| **지식 공유** | 팀원 모두가 변경사항을 파악 |
| **자동 테스트** | CI/CD와 연동하여 자동 검증 |
| **이력 관리** | 왜 이런 변경을 했는지 기록 |
| **토론** | 구현 방식에 대한 의견 교환 |

#### PR 없이 직접 push하면?

```bash
# 위험한 방식 ❌
git switch main
# ... 코드 수정 ...
git push origin main
# 리뷰 없이 바로 배포됨!

# 안전한 방식 ✅
git switch -c feature/improvement
# ... 코드 수정 ...
git push -u origin feature/improvement
# GitHub에서 PR 생성 → 리뷰 → 승인 후 머지
```

---

### 3.2 PR 생성하기 (단계별)

#### 1단계: 브랜치에서 작업 완료 후 push

```bash
# 작업 완료 확인
git status
git log --oneline -5

# 원격에 push
git push -u origin feature/dark-mode
```

#### 2단계: GitHub에서 PR 생성

GitHub 저장소 페이지에서:

1. **"Compare & pull request"** 버튼 클릭 (push 직후 나타남)
2. 또는 **"Pull requests"** 탭 → **"New pull request"** 클릭

#### 3단계: PR 내용 작성

```markdown
## 제목
[Feature] 다크 모드 토글 기능 추가

## 설명
### 변경 사항
- 다크 모드 토글 버튼 UI 구현
- CSS 변수 기반 테마 전환 로직 추가
- localStorage에 사용자 선호 테마 저장

### 스크린샷
| 라이트 모드 | 다크 모드 |
|------------|----------|
| [스크린샷] | [스크린샷] |

### 테스트 방법
1. 우측 상단의 토글 버튼 클릭
2. 다크 모드로 전환되는지 확인
3. 페이지 새로고침 후에도 유지되는지 확인

### 관련 이슈
Closes #42

### 체크리스트
- [x] 코드 스타일 준수
- [x] 모바일 반응형 확인
- [x] 접근성 (키보드 조작) 확인
- [ ] 크로스 브라우저 테스트
```

#### 4단계: 리뷰어 지정

- **Reviewers**: 코드를 검토할 팀원 지정
- **Assignees**: PR 담당자 (보통 본인)
- **Labels**: `feature`, `bug`, `docs` 등 분류 태그
- **Projects**: 프로젝트 보드에 연결
- **Milestone**: 릴리스 마일스톤에 연결

---

### 3.3 PR 템플릿 설정하기

매번 같은 형식으로 PR을 작성하려면 템플릿을 만들어두세요.

```bash
# 저장소 루트에 템플릿 파일 생성
mkdir -p .github
```

`.github/PULL_REQUEST_TEMPLATE.md` 파일 내용:

```markdown
## 변경 사항
<!-- 무엇을 변경했나요? -->

## 변경 이유
<!-- 왜 이 변경이 필요한가요? -->

## 테스트 방법
<!-- 어떻게 테스트했나요? -->
1.
2.
3.

## 스크린샷 (UI 변경 시)
<!-- 변경 전/후 스크린샷 -->

## 관련 이슈
<!-- Closes #이슈번호 -->

## 체크리스트
- [ ] 코드 리뷰 요청
- [ ] 테스트 통과
- [ ] 문서 업데이트 (필요 시)
```

---

### 3.4 코드 리뷰하기

#### 리뷰어의 역할

PR의 "Files changed" 탭에서 변경된 코드를 확인합니다.

**라인별 코멘트 남기기**:
1. 변경된 코드 라인의 `+` 아이콘 클릭
2. 코멘트 작성
3. "Start a review" 또는 "Add single comment" 선택

**코멘트 유형 접두사** (관례):

| 접두사 | 의미 | 예시 |
|--------|------|------|
| `nit:` | 사소한 개선 제안 | `nit: 변수명을 더 명확하게 바꾸면 좋겠어요` |
| `question:` | 이해를 위한 질문 | `question: 이 로직이 필요한 이유가 뭔가요?` |
| `suggestion:` | 대안 제안 | `suggestion: Map을 사용하면 더 효율적일 수 있어요` |
| `issue:` | 반드시 수정 필요 | `issue: 이 코드에 XSS 취약점이 있습니다` |
| `praise:` | 칭찬 | `praise: 이 추상화 정말 깔끔하네요!` |

#### Suggestion 기능 활용

GitHub에서 코드를 직접 제안할 수 있습니다:

````markdown
```suggestion
const MAX_RETRY_COUNT = 3;
for (let i = 0; i < MAX_RETRY_COUNT; i++) {
```
````

PR 작성자는 "Apply suggestion" 버튼으로 바로 적용할 수 있습니다.

#### 리뷰 제출하기

모든 코멘트를 작성한 후 "Review changes" 버튼으로 리뷰를 제출합니다.

| 옵션 | 의미 | 사용 시점 |
|------|------|----------|
| **Comment** | 의견만 남기기 | 가벼운 피드백 |
| **Approve** | 승인 (머지 가능) | 코드가 괜찮을 때 |
| **Request Changes** | 수정 요청 | 반드시 고쳐야 할 사항 있을 때 |

---

### 3.5 PR 머지 방식

GitHub에서 PR을 머지할 때 3가지 방식을 선택할 수 있습니다.

#### Create a Merge Commit (기본)

```
main     ●──●──●──────●  (머지 커밋)
               \      /
feature         ●──●──●
```

- 모든 커밋 히스토리 보존
- 머지 커밋 생성
- 브랜치 히스토리가 명확

#### Squash and Merge (추천)

```
main     ●──●──●──●  (하나의 커밋)
```

- feature 브랜치의 모든 커밋을 하나로 합침
- main 히스토리가 깔끔
- 각 PR = 하나의 커밋

```bash
# Squash Merge를 CLI로 수행할 때
git switch main
git merge --squash feature/dark-mode
git commit -m "다크 모드 기능 추가 (#42)"
```

#### Rebase and Merge

```
main     ●──●──●──●──●──●  (일직선)
```

- feature 커밋들을 main 위에 재배치
- 머지 커밋 없이 일직선 히스토리
- 각 커밋이 개별적으로 보존

#### 방식 비교

| 항목 | Merge Commit | Squash Merge | Rebase Merge |
|------|-------------|-------------|-------------|
| 히스토리 | 분기 보존 | 깔끔 (1커밋) | 깔끔 (일직선) |
| 세부 커밋 | 유지 | 합쳐짐 | 유지 |
| 추천 상황 | 히스토리 보존 중요 | 일반적인 PR | 커밋 단위 관리 |

> **추천**: 대부분의 팀에서 **Squash and Merge**를 기본으로 사용합니다. PR 단위로 히스토리가 정리되어 이해하기 쉽습니다.

---

### 3.6 Draft PR

아직 작업 중이지만 미리 피드백을 받고 싶을 때 사용합니다.

#### Draft PR의 장점

- 머지 버튼이 비활성화되어 실수로 머지 방지
- "WIP (Work In Progress)" 상태를 명확히 표시
- 진행 중인 작업에 대한 조기 피드백 가능
- 설계 방향에 대한 의견을 미리 수렴

#### 사용법

```bash
# 1. 작업 중인 브랜치를 push
git push -u origin feature/new-dashboard

# 2. GitHub에서 PR 생성 시 "Create draft pull request" 선택
# 또는 gh CLI 사용
gh pr create --draft --title "[WIP] 새 대시보드 레이아웃" --body "아직 작업 중입니다. 디자인 피드백 부탁드려요."

# 3. 작업 완료 후 "Ready for review" 버튼 클릭
# 또는 gh CLI
gh pr ready
```

---

### 3.7 gh CLI로 PR 관리하기

GitHub CLI(`gh`)를 사용하면 터미널에서 PR을 관리할 수 있습니다.

```bash
# gh 설치 확인
gh --version

# GitHub 인증
gh auth login

# PR 생성
gh pr create --title "다크 모드 추가" --body "설명..."

# PR 목록 확인
gh pr list

# 특정 PR 상세 정보
gh pr view 42

# PR 체크아웃 (리뷰를 위해)
gh pr checkout 42

# PR 머지
gh pr merge 42 --squash

# PR 닫기
gh pr close 42
```

---

### 체크포인트 3

아래 질문에 답할 수 있다면 다음 섹션으로 넘어가세요.

- [ ] PR을 생성하는 전체 과정을 설명할 수 있다
- [ ] `nit:`, `suggestion:`, `issue:` 코멘트 접두사를 적절히 사용할 수 있다
- [ ] Merge Commit, Squash Merge, Rebase Merge의 차이를 안다
- [ ] Draft PR이 언제 유용한지 설명할 수 있다
- [ ] `gh pr create`로 터미널에서 PR을 만들 수 있다

---