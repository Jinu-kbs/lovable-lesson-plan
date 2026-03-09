# Git과 GitHub 첫걸음 — 초보자편

> **과정명**: Git과 GitHub 첫걸음
> **대상**: Git을 한 번도 써본 적 없는 완전 입문자
> **목표**: Git으로 버전 관리하고 GitHub에 코드 올리기
> **소요 시간**: 약 3~4시간

---

## 어떤 교안을 봐야 할까요? (자가 진단)

아래 질문에 답해보세요:

| 질문 | 예 → | 아니오 → |
|------|------|----------|
| "버전 관리"가 뭔지 설명할 수 있나요? | 섹션 3부터 시작 | **이 교안 처음부터** 시작하세요! |
| Git을 설치해본 적이 있나요? | 섹션 4부터 시작 | **섹션 2(Git 설치)** 부터 시작하세요! |
| `git commit`이 무슨 뜻인지 아나요? | 섹션 5 이후로 | **이 교안 처음부터** 시작하세요! |
| GitHub에 코드를 올려본 적이 있나요? | 이 교안은 쉬울 수 있어요 | **이 교안이 딱 맞아요!** |

> 하나라도 "아니오"라면 이 교안부터 시작하세요!

### 추천 리소스

| 리소스 | 설명 | 링크 |
|--------|------|------|
| **Git 공식 사이트** | Git 다운로드 및 공식 문서 | [git-scm.com](https://git-scm.com) |
| **GitHub 공식 사이트** | 계정 생성 및 저장소 관리 | [github.com](https://github.com) |
| **GitHub Docs** | GitHub 공식 한국어 문서 | [docs.github.com/ko](https://docs.github.com/ko) |
| **VS Code 다운로드** | 코드 편집기 | [code.visualstudio.com](https://code.visualstudio.com) |

---

## 목차

1. [버전 관리란?](#1-버전-관리란)
2. [Git 설치](#2-git-설치)
3. [핵심 개념 5가지](#3-핵심-개념-5가지)
4. [기본 명령어 실습](#4-기본-명령어-실습)
5. [GitHub 가입과 연결](#5-github-가입과-연결)
6. [push와 pull](#6-push와-pull)
7. [VS Code에서 Git 사용](#7-vs-code에서-git-사용)
8. [.gitignore와 README](#8-gitignore와-readme)
9. [종합 실습](#9-종합-실습)
10. [트러블슈팅 & FAQ](#10-트러블슈팅--faq)

---

## 1. 버전 관리란?

### 1-1. 파일 관리, 이렇게 해본 적 있나요?

여러분의 컴퓨터 바탕화면이나 폴더에 이런 파일이 있지는 않나요?

```
보고서_최종.docx
보고서_최종_수정.docx
보고서_최종_수정_진짜최종.docx
보고서_최종_수정_진짜최종_v2.docx
보고서_최종_수정_진짜최종_v2_교장님피드백.docx
```

또는 이런 경험은요?

- 파일을 수정했는데 이전 버전이 더 나았던 적
- 동료가 같은 파일을 동시에 수정해서 충돌이 난 적
- USB에 복사했는데 어떤 게 최신인지 헷갈린 적
- "어제 지운 그 부분"을 다시 살리고 싶었던 적

이 모든 문제를 해결하는 것이 바로 **버전 관리(Version Control)** 입니다.

### 1-2. 게임 세이브 비유로 이해하기

버전 관리를 가장 쉽게 이해하는 방법은 **게임 세이브**에 비유하는 것입니다.

```
게임 세이브                          Git 버전 관리
─────────────                    ─────────────────
세이브 슬롯 1: 마을 도착           commit 1: 프로젝트 시작
세이브 슬롯 2: 보스방 앞           commit 2: 메인 페이지 완성
세이브 슬롯 3: 보스 클리어          commit 3: 로그인 기능 추가
세이브 슬롯 4: 엔딩                commit 4: 디자인 수정

→ 보스전에서 죽으면?               → 코드를 망쳤으면?
→ 슬롯 2를 불러온다!               → commit 2로 되돌린다!
```

**핵심 포인트:**

- 원하는 시점으로 언제든 되돌아갈 수 있습니다
- 각 세이브(커밋)에는 "무엇을 했는지" 메모가 남습니다
- 여러 갈래의 진행(브랜치)이 가능합니다

### 1-3. 기존 방법 vs Git

| 방법 | 장점 | 단점 |
|------|------|------|
| **USB 복사** | 간단함 | 분실 위험, 버전 혼동 |
| **이메일 첨부** | 전송 기록 남음 | 파일 크기 제한, 정리 어려움 |
| **파일명에 날짜 추가** | 직관적 | 파일 개수 폭증, 차이점 파악 불가 |
| **클라우드 동기화** | 자동 백업 | 세밀한 버전 관리 불가 |
| **Git** | 모든 변경 이력 추적, 협업 용이, 되돌리기 자유 | 초기 학습 곡선 있음 |

### 1-4. Git과 GitHub는 다릅니다

이 부분은 처음 배울 때 많이 헷갈리는 부분입니다.

```
Git = 내 컴퓨터에서 돌아가는 버전 관리 "프로그램"
     (설치해서 사용하는 도구)

GitHub = Git으로 관리하는 코드를 인터넷에 올리는 "서비스"
        (웹사이트, 클라우드 저장소)
```

쉽게 비유하면:

| 비유 | Git | GitHub |
|------|-----|--------|
| **카메라와 앨범** | 사진을 찍는 카메라 | 사진을 공유하는 온라인 앨범 |
| **일기와 블로그** | 일기를 쓰는 행위 | 일기를 공개하는 블로그 |
| **문서와 구글 드라이브** | 워드로 문서 작성 | 구글 드라이브에 업로드 |

> **기억하세요**: Git은 내 컴퓨터에서 작동하고, GitHub는 인터넷에서 작동합니다. Git 없이 GitHub를 쓸 수 없고, GitHub 없이도 Git은 사용할 수 있습니다.

### 1-5. 누가 Git을 쓰나요?

Git은 개발자만 쓰는 도구가 아닙니다:

- **개발자**: 코드 버전 관리 (가장 대표적)
- **디자이너**: 디자인 파일 버전 관리
- **작가/번역가**: 원고 버전 관리
- **연구자**: 논문, 데이터 분석 코드 관리
- **학생**: 과제, 프로젝트 관리
- **바이브코더**: AI로 만든 프로젝트 관리와 배포

### 1-6. 실제 활용 사례

**사례 1: 개인 프로젝트**
```
혼자서 웹사이트를 만들고 있습니다.
→ 새 기능을 추가하다가 사이트가 망가졌습니다.
→ Git이 있으면? 이전 커밋으로 바로 되돌립니다!
→ Git이 없으면? Ctrl+Z를 수십 번 누르거나, 백업이 없으면 처음부터...
```

**사례 2: 팀 프로젝트**
```
3명이 함께 앱을 개발합니다.
→ 각자 다른 기능을 동시에 개발합니다.
→ Git이 있으면? 브랜치로 나눠 작업 후 합칩니다.
→ Git이 없으면? 카톡으로 파일 주고받으며 수동으로 합칩니다...
```

**사례 3: 바이브코딩 프로젝트**
```
러버블/커서로 프로젝트를 만들었습니다.
→ GitHub에 올려두면 어디서든 코드를 확인할 수 있습니다.
→ GitHub Pages로 무료 웹사이트 배포도 가능합니다!
```

### 체크포인트

- [x] 버전 관리가 왜 필요한지 이해했다
- [x] Git과 GitHub의 차이를 설명할 수 있다
- [x] 게임 세이브 비유로 커밋 개념을 이해했다

---

## 2. Git 설치

### 2-1. Windows에서 설치하기

#### 단계 1: 다운로드

1. 웹 브라우저에서 [git-scm.com](https://git-scm.com) 접속
2. 화면 중앙의 **"Download for Windows"** 버튼 클릭
3. **"64-bit Git for Windows Setup"** 선택하여 다운로드

#### 단계 2: 설치 프로그램 실행

다운로드된 `Git-2.xx.x-64-bit.exe` 파일을 더블클릭합니다.

#### 단계 3: 설치 옵션 선택 (화면별 안내)

설치 마법사가 여러 화면을 보여줍니다. 대부분 기본값으로 진행하면 됩니다.

**화면 1 — 라이선스 동의**
```
GNU General Public License 내용이 표시됩니다.
→ [Next] 클릭
```

**화면 2 — 설치 경로**
```
기본 경로: C:\Program Files\Git
→ 그대로 두고 [Next] 클릭
```

**화면 3 — 구성 요소 선택**
```
기본 선택된 항목을 그대로 유지합니다.
특히 아래 항목이 체크되어 있는지 확인하세요:
  [v] Git Bash Here
  [v] Git GUI Here
  [v] Git LFS (Large File Support)
→ [Next] 클릭
```

**화면 4 — 시작 메뉴 폴더**
```
기본값(Git)을 그대로 유지합니다.
→ [Next] 클릭
```

**화면 5 — 기본 편집기 선택**
```
"Use Visual Studio Code as Git's default editor"를 선택합니다.
(VS Code가 설치되어 있지 않다면 Notepad를 선택해도 됩니다)
→ [Next] 클릭
```

**화면 6 — 초기 브랜치 이름**
```
"Override the default branch name for new repositories"를 선택하고,
입력란에 "main"을 입력합니다.
(최신 관례는 master 대신 main을 사용합니다)
→ [Next] 클릭
```

**화면 7 — PATH 환경 변수**
```
"Git from the command line and also from 3rd-party software"를 선택합니다.
(이 옵션이 기본 선택되어 있습니다)
→ [Next] 클릭
```

**화면 8~12 — 나머지 옵션들**
```
나머지 화면은 모두 기본값으로 진행합니다.
계속 [Next]를 클릭하다가 마지막에 [Install]을 클릭합니다.
```

**화면 13 — 설치 완료**
```
"Launch Git Bash" 체크 후 [Finish] 클릭
→ Git Bash 터미널 창이 열립니다!
```

#### 단계 4: 설치 확인

검은색 터미널 창(Git Bash)이 열리면 아래 명령어를 입력합니다:

```bash
git --version
```

아래와 비슷한 결과가 나오면 성공입니다:

```
git version 2.47.1.windows.1
```

> **Windows 팁**: Git Bash 외에도 **PowerShell**이나 **명령 프롬프트(cmd)** 에서도 git 명령어를 사용할 수 있습니다. 하지만 이 교안에서는 Git Bash를 기준으로 설명합니다. Git Bash는 리눅스/맥과 동일한 명령어를 사용할 수 있어서 인터넷의 대부분의 Git 튜토리얼과 호환됩니다.

### 2-2. Mac에서 설치하기

Mac에서는 여러 가지 방법으로 Git을 설치할 수 있습니다.

#### 방법 A: Xcode Command Line Tools (가장 간단)

1. **터미널**을 엽니다
   - `Cmd + Space` → "터미널" 검색 → 엔터
   - 또는 Finder → 응용 프로그램 → 유틸리티 → 터미널

2. 아래 명령어를 입력합니다:

```bash
git --version
```

3. Git이 설치되어 있지 않으면, **자동으로 설치 안내 팝업**이 나타납니다
4. **"설치"** 버튼을 클릭합니다
5. 설치가 완료되면 다시 `git --version`으로 확인합니다

#### 방법 B: Homebrew 사용 (개발자 추천)

```bash
# Homebrew가 없다면 먼저 설치
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Git 설치
brew install git

# 설치 확인
git --version
```

> **Mac 팁**: 대부분의 Mac 사용자는 **방법 A**로 충분합니다. 터미널에서 `git --version`만 입력하면 자동으로 설치 안내가 나옵니다.

### 2-3. 첫 설정 (Windows/Mac 공통)

Git을 설치한 후 **반드시** 사용자 정보를 설정해야 합니다. 이 정보는 누가 코드를 수정했는지 기록하는 데 사용됩니다.

#### 사용자 이름 설정

```bash
git config --global user.name "홍길동"
```

#### 이메일 설정

```bash
git config --global user.email "hong@example.com"
```

> **중요**: 이메일은 나중에 GitHub 가입할 때 사용할 이메일과 **동일하게** 설정하세요! GitHub에서 커밋 기록을 내 계정과 연결해줍니다.

#### 설정 확인

```bash
git config --global --list
```

아래와 비슷한 결과가 나오면 성공입니다:

```
user.name=홍길동
user.email=hong@example.com
```

#### 기본 브랜치 이름 설정 (선택)

```bash
git config --global init.defaultBranch main
```

이렇게 하면 새 저장소를 만들 때 기본 브랜치 이름이 `main`으로 설정됩니다.

#### 한글 파일명 표시 설정 (Windows 필수)

Windows에서 한글 파일명이 깨지는 것을 방지합니다:

```bash
git config --global core.quotepath false
```

### 2-4. 설치 확인 체크리스트

아래 명령어들을 차례로 입력해서 모두 정상 작동하는지 확인하세요:

```bash
# 1. Git 버전 확인
git --version

# 2. 사용자 이름 확인
git config user.name

# 3. 이메일 확인
git config user.email

# 4. 전체 설정 확인
git config --global --list
```

### 체크포인트

- [x] Git이 설치되었다 (`git --version`으로 확인)
- [x] 사용자 이름이 설정되었다 (`git config user.name`)
- [x] 이메일이 설정되었다 (`git config user.email`)
- [x] 한글 파일명 설정을 완료했다 (Windows)

---

## 3. 핵심 개념 5가지

Git을 사용하기 전에 반드시 알아야 할 5가지 핵심 개념이 있습니다. 이 개념을 이해하면 Git 명령어가 "왜" 그렇게 작동하는지 자연스럽게 알 수 있습니다.

### 3-1. Working Directory (작업 디렉토리)

**한 줄 설명**: 내가 실제로 파일을 만들고 수정하는 폴더

```
비유: 책상 위에 펼쳐놓은 서류들

내 프로젝트 폴더/
├── index.html     ← 이 파일들이 있는 폴더 자체가
├── style.css      ← Working Directory입니다
└── script.js      ← 여기서 파일을 만들고, 수정하고, 삭제합니다
```

**특징:**
- 여러분의 눈에 보이는 실제 폴더입니다
- 탐색기(Windows)나 Finder(Mac)에서 볼 수 있습니다
- 이 폴더에서 파일을 자유롭게 생성, 수정, 삭제합니다
- Git이 이 폴더의 변경사항을 감시합니다

### 3-2. Staging Area (스테이징 영역)

**한 줄 설명**: 다음 커밋에 포함할 변경사항을 골라놓는 대기실

```
비유: 택배 보내기 전 포장 구역

  수정한 파일이 10개 있다고 합시다.
  그중에서 지금 보내고 싶은 3개만 골라서
  포장 구역(Staging Area)에 올려놓습니다.

  ┌──────────────────────────────────────────┐
  │  Staging Area (포장 구역)                 │
  │                                          │
  │  [index.html]  [style.css]  [README.md]  │
  │   ← 이 3개만 다음 커밋에 포함됩니다        │
  └──────────────────────────────────────────┘
```

**왜 필요한가요?**

파일 10개를 수정했는데, 그중 3개는 "로그인 기능"이고 7개는 "디자인 수정"일 수 있습니다. 스테이징 영역이 있으면:

- "로그인 기능" 관련 3개만 먼저 골라서 커밋
- "디자인 수정" 관련 7개는 나중에 따로 커밋

이렇게 **의미 있는 단위로 나누어 커밋**할 수 있습니다.

**관련 명령어:**
```bash
git add 파일명      # 특정 파일을 스테이징 영역에 추가
git add .           # 모든 변경된 파일을 스테이징 영역에 추가
```

### 3-3. Repository (저장소)

**한 줄 설명**: Git이 모든 버전 기록을 저장하는 데이터베이스

```
비유: 은행 금고 (모든 거래 내역이 기록됨)

  내 프로젝트 폴더/
  ├── .git/          ← 이 숨겨진 폴더가 바로 Repository!
  │   ├── objects/   ← 모든 파일의 모든 버전이 여기에 저장됩니다
  │   ├── refs/      ← 브랜치와 태그 정보
  │   └── HEAD       ← 현재 작업 중인 브랜치
  ├── index.html
  ├── style.css
  └── script.js
```

**저장소는 2종류가 있습니다:**

| 종류 | 위치 | 설명 |
|------|------|------|
| **로컬 저장소** | 내 컴퓨터 | `.git` 폴더 안에 있음 |
| **원격 저장소** | GitHub 서버 | 인터넷에 있음, 다른 사람과 공유 |

```
┌──────────────────┐    push     ┌──────────────────┐
│   로컬 저장소      │  ------→   │   원격 저장소      │
│  (내 컴퓨터)       │  ←------   │  (GitHub)         │
│   .git 폴더       │    pull    │   github.com/...  │
└──────────────────┘            └──────────────────┘
```

> **주의**: `.git` 폴더는 숨겨져 있습니다. 절대로 직접 수정하거나 삭제하지 마세요! Git이 관리하는 폴더입니다.

### 3-4. Commit (커밋)

**한 줄 설명**: 현재 상태를 "세이브"하는 행위 (스냅샷)

```
비유: 게임 세이브 + 일기 한 줄

  커밋 = 그 시점의 모든 파일 상태 저장
       + "무엇을 했는지" 메시지 기록
       + 언제, 누가 했는지 자동 기록

  예시:
  ┌─────────────────────────────────────────┐
  │  커밋 #a1b2c3d                           │
  │  작성자: 홍길동                           │
  │  날짜: 2026-03-09 14:30                  │
  │  메시지: "메인 페이지 헤더 디자인 완성"     │
  │                                         │
  │  변경된 파일:                              │
  │   - index.html (수정)                     │
  │   - style.css (수정)                      │
  │   - header.png (추가)                     │
  └─────────────────────────────────────────┘
```

**좋은 커밋 메시지 작성법:**

| 나쁜 예 | 좋은 예 |
|---------|---------|
| "수정" | "로그인 버튼 클릭 시 에러 수정" |
| "업데이트" | "회원가입 이메일 인증 기능 추가" |
| "ㅎㅎ" | "메인 페이지 반응형 레이아웃 적용" |
| "asdf" | "README에 설치 방법 문서 추가" |

**커밋 메시지 규칙:**
- 무엇을 **왜** 변경했는지 간단히 적습니다
- 한국어 또는 영어 모두 괜찮습니다
- 현재형으로 적는 것이 관례입니다 (예: "추가", "수정", "삭제")

### 3-5. Branch (브랜치)

**한 줄 설명**: 독립된 작업 공간을 만드는 기능 (가지치기)

```
비유: 평행 세계

  메인 세계(main)에서 새로운 세계(branch)를 만들어
  실험해보고, 성공하면 합치고, 실패하면 버립니다.

  main ─────●─────●─────●─────●─────●──────
                   \                 ↑
  feature ──────────●─────●─────●───┘ (성공! 합치기)

  main ─────●─────●─────●─────●──────
                   \
  experiment ───────●─────●───✕ (실패... 버리기)
```

**왜 필요한가요?**

1. **안전한 실험**: 새 기능을 시도하다 망해도 main은 무사합니다
2. **동시 작업**: 여러 기능을 동시에 개발할 수 있습니다
3. **코드 리뷰**: 합치기 전에 다른 사람이 검토할 수 있습니다

**초보자를 위한 팁:**
> 브랜치는 처음에는 사용하지 않아도 괜찮습니다. `main` 브랜치 하나로 시작하고, 나중에 필요할 때 배워도 됩니다. 이 교안에서는 브랜치를 만드는 실습은 하지 않습니다.

### 3-6. 전체 흐름 다이어그램

5가지 개념이 어떻게 연결되는지 전체 그림을 봅시다:

```
┌─────────────────────────────────────────────────────────────────┐
│                         Git의 전체 흐름                          │
│                                                                 │
│  ① Working Directory    ② Staging Area    ③ Local Repository    │
│  (작업 디렉토리)          (스테이징 영역)     (로컬 저장소)         │
│                                                                 │
│  파일 생성/수정/삭제       커밋할 파일 선택     버전 기록 저장       │
│                                                                 │
│       │                      │                    │             │
│       │    git add            │    git commit      │             │
│       │ ─────────────→        │ ─────────────→     │             │
│       │                      │                    │             │
│       │              git status로 상태 확인         │             │
│       │ ←───────────────────────────────────────── │             │
│                                                                 │
│                                                    │             │
│                                          git push  │             │
│                                         ─────────→ │             │
│                                                    ↓             │
│                                         ④ Remote Repository     │
│                                           (원격 저장소/GitHub)    │
│                                                                 │
│  ⑤ Branch: 이 모든 과정이 독립적인 작업 공간(브랜치)에서 진행됩니다  │
└─────────────────────────────────────────────────────────────────┘
```

**한 줄 요약:**
```
파일 수정 → git add(스테이징) → git commit(저장) → git push(업로드)
```

### 체크포인트

- [x] Working Directory가 무엇인지 안다
- [x] Staging Area가 왜 필요한지 이해했다
- [x] Repository(저장소)의 두 종류를 안다
- [x] Commit이 무엇인지 게임 세이브로 비유할 수 있다
- [x] Branch의 개념을 이해했다 (나중에 써도 OK)

---

## 4. 기본 명령어 실습

이제 직접 명령어를 하나씩 입력해봅시다! 터미널(Git Bash 또는 Mac 터미널)을 열어주세요.

### 4-0. 터미널 열기

**Windows:**
- 바탕화면에서 마우스 오른쪽 클릭 → "Git Bash Here" 선택
- 또는 시작 메뉴 → "Git Bash" 검색 → 실행

**Mac:**
- `Cmd + Space` → "터미널" 입력 → 엔터

### 4-1. 실습 폴더 만들기

먼저 실습용 폴더를 만들고 이동합니다.

**입력:**
```bash
mkdir my-first-git
cd my-first-git
```

**결과:**
```
(아무 출력 없음 = 성공!)
프롬프트가 ~/my-first-git 으로 변경됩니다
```

> **명령어 해설**:
> - `mkdir` = make directory, 새 폴더를 만듭니다
> - `cd` = change directory, 해당 폴더로 이동합니다

### 4-2. git init — 저장소 초기화

이 폴더를 Git으로 관리하겠다고 선언합니다.

**입력:**
```bash
git init
```

**결과:**
```
Initialized empty Git repository in /Users/홍길동/my-first-git/.git/
```

이제 이 폴더 안에 `.git`이라는 숨겨진 폴더가 생겼습니다. 확인해볼까요?

**입력:**
```bash
ls -la
```

**결과:**
```
total 0
drwxr-xr-x   3 홍길동  staff    96  3  9 14:00 .
drwxr-xr-x  10 홍길동  staff   320  3  9 14:00 ..
drwxr-xr-x   9 홍길동  staff   288  3  9 14:00 .git
```

`.git` 폴더가 보이면 성공입니다! (이 폴더는 건드리지 마세요)

### 4-3. 파일 만들기

실습용 파일을 만들어봅시다.

**입력:**
```bash
echo "안녕하세요! 나의 첫 Git 프로젝트입니다." > README.md
```

파일이 잘 만들어졌는지 확인합니다:

**입력:**
```bash
cat README.md
```

**결과:**
```
안녕하세요! 나의 첫 Git 프로젝트입니다.
```

### 4-4. git status — 상태 확인

현재 Git 상태를 확인합니다. **이 명령어는 가장 자주 사용합니다!**

**입력:**
```bash
git status
```

**결과:**
```
On branch main

No commits yet

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        README.md

nothing added to commit but untracked files present (use "git add" to track)
```

**결과 해석:**

| 부분 | 의미 |
|------|------|
| `On branch main` | 현재 main 브랜치에 있습니다 |
| `No commits yet` | 아직 커밋한 적이 없습니다 |
| `Untracked files` | Git이 아직 추적하지 않는 새 파일이 있습니다 |
| `README.md` | 이 파일이 새로 생겼습니다 (빨간색으로 표시) |

> **팁**: `git status`는 **아무것도 바꾸지 않는** 안전한 명령어입니다. 헷갈릴 때마다 입력해서 현재 상태를 확인하세요!

### 4-5. git add — 스테이징 영역에 추가

이제 README.md를 스테이징 영역(포장 구역)에 올립니다.

**입력:**
```bash
git add README.md
```

**결과:**
```
(아무 출력 없음 = 성공!)
```

상태를 다시 확인해봅시다:

**입력:**
```bash
git status
```

**결과:**
```
On branch main

No commits yet

Changes to be committed:
  (use "git rm --cached <file>..." to unstage)
        new file:   README.md
```

`README.md`가 **"Changes to be committed"** 아래로 이동했습니다! (초록색으로 표시) 이제 커밋할 준비가 된 것입니다.

**git add 다양한 사용법:**

```bash
git add 파일이름       # 특정 파일 1개 추가
git add file1 file2   # 여러 파일 추가
git add *.html        # 모든 .html 파일 추가
git add .             # 현재 폴더의 모든 변경 파일 추가
```

### 4-6. git commit — 커밋하기 (세이브!)

스테이징 영역에 올린 파일을 커밋(세이브)합니다.

**입력:**
```bash
git commit -m "첫 번째 커밋: README 파일 생성"
```

**결과:**
```
[main (root-commit) a1b2c3d] 첫 번째 커밋: README 파일 생성
 1 file changed, 1 insertion(+)
 create mode 100644 README.md
```

**결과 해석:**

| 부분 | 의미 |
|------|------|
| `main` | main 브랜치에 커밋함 |
| `(root-commit)` | 이 저장소의 첫 번째 커밋 |
| `a1b2c3d` | 커밋의 고유 ID (줄인 것) |
| `1 file changed` | 1개 파일이 변경됨 |
| `1 insertion(+)` | 1줄이 추가됨 |

> **`-m` 옵션**: `-m` 뒤에 큰따옴표로 커밋 메시지를 적습니다. `-m`을 빼면 편집기가 열리는데, 초보자는 `-m`을 쓰는 것이 편합니다.

### 4-7. 파일 수정 후 다시 커밋하기

파일을 수정하고 다시 커밋하는 과정을 연습합시다.

**입력:**
```bash
echo "" >> README.md
echo "## 프로젝트 소개" >> README.md
echo "Git을 배우기 위한 연습 프로젝트입니다." >> README.md
```

상태 확인:

**입력:**
```bash
git status
```

**결과:**
```
On branch main
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
        modified:   README.md

no changes added to commit (use "git add" and/or "git commit -am")
```

이번에는 `modified`(수정됨)로 표시됩니다. 스테이징하고 커밋합시다:

**입력:**
```bash
git add README.md
git commit -m "README에 프로젝트 소개 섹션 추가"
```

**결과:**
```
[main b2c3d4e] README에 프로젝트 소개 섹션 추가
 1 file changed, 3 insertions(+)
```

### 4-8. 새 파일 추가하고 커밋하기

HTML 파일을 하나 만들어서 커밋해봅시다.

**입력:**
```bash
cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>나의 첫 웹페이지</title>
</head>
<body>
    <h1>안녕하세요!</h1>
    <p>Git으로 관리하는 나의 첫 웹페이지입니다.</p>
</body>
</html>
EOF
```

**입력:**
```bash
git add index.html
git commit -m "index.html 메인 페이지 추가"
```

**결과:**
```
[main c3d4e5f] index.html 메인 페이지 추가
 1 file changed, 11 insertions(+)
 create mode 100644 index.html
```

### 4-9. git log — 커밋 기록 보기

지금까지의 커밋 기록을 확인합니다.

**입력:**
```bash
git log
```

**결과:**
```
commit c3d4e5f... (HEAD -> main)
Author: 홍길동 <hong@example.com>
Date:   Sun Mar 9 14:30:00 2026 +0900

    index.html 메인 페이지 추가

commit b2c3d4e...
Author: 홍길동 <hong@example.com>
Date:   Sun Mar 9 14:25:00 2026 +0900

    README에 프로젝트 소개 섹션 추가

commit a1b2c3d...
Author: 홍길동 <hong@example.com>
Date:   Sun Mar 9 14:20:00 2026 +0900

    첫 번째 커밋: README 파일 생성
```

> **팁**: 커밋 기록이 길 때 `q`를 누르면 나갈 수 있습니다.

**간단한 한 줄 로그:**

**입력:**
```bash
git log --oneline
```

**결과:**
```
c3d4e5f (HEAD -> main) index.html 메인 페이지 추가
b2c3d4e README에 프로젝트 소개 섹션 추가
a1b2c3d 첫 번째 커밋: README 파일 생성
```

이 형태가 훨씬 보기 좋습니다! `--oneline` 옵션을 자주 사용하게 될 것입니다.

### 4-10. 명령어 요약 표

| 명령어 | 의미 | 비유 |
|--------|------|------|
| `git init` | Git 저장소 시작 | 새 게임 시작 |
| `git status` | 현재 상태 확인 | 인벤토리 확인 |
| `git add 파일` | 스테이징에 추가 | 택배 포장 구역에 올리기 |
| `git add .` | 전부 스테이징 | 모든 물건 포장 |
| `git commit -m "메시지"` | 커밋(세이브) | 게임 세이브 |
| `git log` | 커밋 기록 보기 | 세이브 목록 보기 |
| `git log --oneline` | 간단한 기록 보기 | 세이브 목록 (요약) |

### 체크포인트

- [x] `git init`으로 저장소를 만들 수 있다
- [x] `git status`로 상태를 확인할 수 있다
- [x] `git add` → `git commit` 흐름을 이해했다
- [x] `git log`로 커밋 기록을 볼 수 있다
- [x] 커밋 메시지를 의미 있게 작성할 수 있다

---

## 5. GitHub 가입과 연결

지금까지 내 컴퓨터(로컬)에서만 Git을 사용했습니다. 이제 **GitHub에 올려서** 인터넷 어디서나 접근할 수 있게 만들어봅시다.

### 5-1. GitHub 계정 만들기

#### 단계 1: 사이트 접속

1. 브라우저에서 [github.com](https://github.com) 접속
2. 우측 상단의 **"Sign up"** 클릭

#### 단계 2: 정보 입력

1. **Email**: 이메일 주소 입력
   - Git 설정에서 사용한 이메일과 **동일하게** 입력하세요!
2. **Password**: 비밀번호 입력 (15자 이상 또는 8자 이상 + 숫자)
3. **Username**: 사용자 이름 입력
   - 영문, 숫자, 하이픈(-) 사용 가능
   - 이 이름이 프로필 URL이 됩니다 (github.com/여기에표시)
   - 예: `hong-gildong`, `my-dev-2026`
4. **이메일 수신**: 원하는 대로 선택

#### 단계 3: 보안 인증

1. 퍼즐 인증(CAPTCHA)을 완료합니다
2. **"Create account"** 클릭
3. 이메일로 전송된 **인증 코드**를 입력합니다

#### 단계 4: 초기 설정

1. 환영 화면에서 간단한 설문에 답합니다 (건너뛰기 가능)
2. 무료 플랜(Free)을 선택합니다

> **축하합니다!** GitHub 계정이 만들어졌습니다.

### 5-2. SSH 키 설정 (Windows)

SSH 키는 비밀번호를 매번 입력하지 않고 GitHub에 안전하게 연결하는 방법입니다.

> **비유**: SSH 키는 "출입증"과 같습니다. 한 번 만들어 등록하면, 매번 비밀번호를 입력하지 않아도 GitHub에 자유롭게 드나들 수 있습니다.

#### 단계 1: SSH 키 생성

Git Bash를 열고 아래 명령어를 입력합니다:

```bash
ssh-keygen -t ed25519 -C "hong@example.com"
```

(이메일을 본인 이메일로 바꾸세요)

아래 질문들이 나옵니다. **모두 엔터만 누르면 됩니다:**

```
Generating public/private ed25519 key pair.
Enter file in which to save the key (/c/Users/홍길동/.ssh/id_ed25519): [엔터]
Enter passphrase (empty for no passphrase): [엔터]
Enter same passphrase again: [엔터]
```

**결과:**
```
Your identification has been saved in /c/Users/홍길동/.ssh/id_ed25519
Your public key has been saved in /c/Users/홍길동/.ssh/id_ed25519.pub
The key fingerprint is:
SHA256:AbCdEfGhIjKlMnOpQrStUvWxYz hong@example.com
```

#### 단계 2: SSH 에이전트 시작 및 키 등록

```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
```

**결과:**
```
Agent pid 12345
Identity added: /c/Users/홍길동/.ssh/id_ed25519 (hong@example.com)
```

#### 단계 3: 공개 키 복사

```bash
cat ~/.ssh/id_ed25519.pub
```

**결과:**
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIAbCdEfGh... hong@example.com
```

이 **전체 내용**을 마우스로 선택한 후 복사합니다 (Ctrl+C).

> **중요**: `id_ed25519.pub`은 **공개 키**입니다. 공유해도 안전합니다. `id_ed25519`(확장자 없는 파일)은 **비밀 키**이므로 절대 공유하지 마세요!

#### 단계 4: GitHub에 공개 키 등록

1. GitHub 로그인 → 우측 상단 **프로필 아이콘** 클릭 → **Settings**
2. 왼쪽 메뉴에서 **"SSH and GPG keys"** 클릭
3. **"New SSH key"** 버튼 클릭
4. 입력:
   - **Title**: `내 윈도우 PC` (원하는 이름)
   - **Key type**: Authentication Key (기본값)
   - **Key**: 아까 복사한 공개 키 붙여넣기
5. **"Add SSH key"** 클릭

#### 단계 5: 연결 테스트

```bash
ssh -T git@github.com
```

처음 연결할 때 아래 메시지가 나옵니다:

```
The authenticity of host 'github.com (...)' can't be established.
ED25519 key fingerprint is SHA256:...
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
```

`yes`를 입력하면:

```
Hi hong-gildong! You've been successfully authenticated, but GitHub does not provide shell access.
```

이 메시지가 나오면 **SSH 연결 성공**입니다!

### 5-3. SSH 키 설정 (Mac)

Mac에서도 과정은 거의 동일합니다.

#### 단계 1: SSH 키 생성

터미널을 열고 아래 명령어를 입력합니다:

```bash
ssh-keygen -t ed25519 -C "hong@example.com"
```

모든 질문에 엔터만 누릅니다.

#### 단계 2: SSH 에이전트 시작 및 키 등록

```bash
eval "$(ssh-agent -s)"
```

Mac의 경우 SSH config 파일을 먼저 만듭니다:

```bash
touch ~/.ssh/config
open ~/.ssh/config
```

열린 편집기에 아래 내용을 추가하고 저장합니다:

```
Host github.com
  AddKeysToAgent yes
  UseKeychain yes
  IdentityFile ~/.ssh/id_ed25519
```

그 다음 키를 등록합니다:

```bash
ssh-add --apple-use-keychain ~/.ssh/id_ed25519
```

#### 단계 3: 공개 키 복사

```bash
pbcopy < ~/.ssh/id_ed25519.pub
```

Mac에서는 `pbcopy`를 사용하면 클립보드에 자동으로 복사됩니다!

#### 단계 4~5: GitHub 등록 및 테스트

Windows와 동일합니다. GitHub Settings → SSH and GPG keys → New SSH key → 붙여넣기 → 추가

연결 테스트:
```bash
ssh -T git@github.com
```

### 5-4. 대안: HTTPS 방식 (SSH가 어려운 경우)

SSH 설정이 어려우면 HTTPS 방식을 사용할 수 있습니다. 다만 매번 인증이 필요할 수 있습니다.

**HTTPS vs SSH 비교:**

| 항목 | HTTPS | SSH |
|------|-------|-----|
| **설정 난이도** | 쉬움 | 약간 복잡 |
| **인증 방식** | 토큰 입력 | 키 등록 (1회) |
| **편의성** | 매번 토큰 입력 (또는 저장) | 한 번 설정하면 끝 |
| **추천** | 임시 사용 | 장기 사용 (추천!) |

HTTPS를 사용하려면:
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. **"Generate new token"** 클릭
3. 이름 입력, 만료일 선택, **repo** 권한 체크
4. 생성된 토큰을 복사해서 비밀번호 대신 사용

> **추천**: 처음에 SSH 설정이 어렵더라도 SSH 방식을 추천합니다. 한 번만 설정하면 이후에는 훨씬 편합니다.

### 5-5. GitHub에 원격 저장소 만들기

#### 단계 1: 새 저장소 생성

1. GitHub 로그인 후 우측 상단의 **`+`** 버튼 → **"New repository"** 클릭
2. 입력:
   - **Repository name**: `my-first-git` (로컬 폴더 이름과 동일하게)
   - **Description**: `Git 연습 프로젝트` (선택사항)
   - **Public** 선택 (다른 사람도 볼 수 있음)
   - **Add a README file**: 체크하지 **않음** (이미 로컬에 만들었으므로)
   - **Add .gitignore**: 선택하지 않음
   - **Choose a license**: 선택하지 않음
3. **"Create repository"** 클릭

#### 단계 2: 나타난 안내 화면

저장소가 만들어지면 GitHub이 **"Quick setup"** 안내를 보여줍니다. 우리는 이미 로컬에 프로젝트가 있으므로, **"...or push an existing repository from the command line"** 부분을 따라합니다.

```bash
# SSH 방식 (추천)
git remote add origin git@github.com:사용자이름/my-first-git.git
git push -u origin main
```

또는

```bash
# HTTPS 방식
git remote add origin https://github.com/사용자이름/my-first-git.git
git push -u origin main
```

> **`사용자이름`** 을 본인의 GitHub 사용자이름으로 바꾸세요!

### 체크포인트

- [x] GitHub 계정이 만들어졌다
- [x] SSH 키가 생성되고 GitHub에 등록되었다
- [x] `ssh -T git@github.com`이 성공했다
- [x] GitHub에 원격 저장소가 만들어졌다

---

## 6. push와 pull

### 6-1. 개념 이해

```
비유: 구글 드라이브와 내 컴퓨터

  push = 내 컴퓨터에서 구글 드라이브로 파일 올리기 (업로드)
  pull = 구글 드라이브에서 내 컴퓨터로 파일 받기 (다운로드)

  ┌──────────────┐                ┌──────────────┐
  │   내 컴퓨터    │   push →      │   GitHub     │
  │  (로컬 저장소) │               │ (원격 저장소)  │
  │              │   ← pull      │              │
  └──────────────┘                └──────────────┘
```

### 6-2. git remote add — 원격 저장소 연결

로컬 저장소와 GitHub 원격 저장소를 연결합니다.

**입력:**
```bash
git remote add origin git@github.com:사용자이름/my-first-git.git
```

**각 부분의 의미:**

| 부분 | 의미 |
|------|------|
| `git remote add` | 원격 저장소를 추가하겠다 |
| `origin` | 원격 저장소의 별명 (관례적으로 origin 사용) |
| `git@github.com:...` | 원격 저장소의 주소 (SSH 방식) |

연결 확인:

**입력:**
```bash
git remote -v
```

**결과:**
```
origin  git@github.com:사용자이름/my-first-git.git (fetch)
origin  git@github.com:사용자이름/my-first-git.git (push)
```

### 6-3. git push — GitHub에 올리기

로컬 커밋을 GitHub에 업로드합니다.

**입력:**
```bash
git push -u origin main
```

**각 부분의 의미:**

| 부분 | 의미 |
|------|------|
| `git push` | 올리겠다 |
| `-u` | upstream 설정 (다음부터 `git push`만 입력하면 됨) |
| `origin` | 어디에? origin(GitHub)에 |
| `main` | 어떤 브랜치를? main 브랜치를 |

**결과:**
```
Enumerating objects: 9, done.
Counting objects: 100% (9/9), done.
Delta compression using up to 8 threads
Compressing objects: 100% (6/6), done.
Writing objects: 100% (9/9), 789 bytes | 789.00 KiB/s, done.
Total 9 (delta 1), reused 0 (delta 0), pack-reused 0
To github.com:사용자이름/my-first-git.git
 * [new branch]      main -> main
branch 'main' set up to track 'origin/main'.
```

**GitHub에서 확인하기:**
1. 브라우저에서 `github.com/사용자이름/my-first-git` 접속
2. README.md와 index.html이 보이면 성공!
3. 커밋 기록도 확인할 수 있습니다 ("3 commits" 클릭)

> **이후부터는** `-u` 없이 `git push`만 입력하면 됩니다.

### 6-4. git pull — GitHub에서 받기

다른 컴퓨터에서 작업했거나, GitHub 웹에서 직접 수정한 내용을 받아옵니다.

**실습: GitHub에서 직접 파일 수정하기**

1. GitHub에서 `my-first-git` 저장소 페이지 접속
2. `README.md` 파일 클릭
3. 연필 아이콘(Edit this file) 클릭
4. 파일 맨 아래에 아래 내용 추가:
   ```
   ## 수정 이력
   - GitHub 웹에서 직접 수정 테스트
   ```
5. 하단의 **"Commit changes"** 버튼 클릭

이제 **GitHub에는 있지만 내 컴퓨터에는 없는** 변경사항이 생겼습니다.

**입력 (터미널에서):**
```bash
git pull
```

**결과:**
```
remote: Enumerating objects: 5, done.
remote: Counting objects: 100% (5/5), done.
remote: Compressing objects: 100% (2/2), done.
remote: Total 3 (delta 1), reused 0 (delta 0), pack-reused 0
Unpacking objects: 100% (3/3), done.
From github.com:사용자이름/my-first-git
   c3d4e5f..d4e5f6g  main       -> origin/main
Updating c3d4e5f..d4e5f6g
Fast-forward
 README.md | 3 +++
 1 file changed, 3 insertions(+)
```

내 컴퓨터의 파일이 GitHub 최신 상태로 업데이트되었습니다!

### 6-5. git clone — 저장소 복제하기

`clone`은 GitHub에 있는 저장소를 내 컴퓨터로 **통째로 복사**하는 명령어입니다.

```
비유: 도서관에서 책을 빌리는 것이 아니라,
     책 전체를 복사해서 가져오는 것!
     (원본도 그대로 있고, 내 복사본도 있음)
```

**사용 상황:**
- 새 컴퓨터에서 기존 프로젝트를 이어서 작업할 때
- 다른 사람의 오픈소스 프로젝트를 가져올 때
- 팀 프로젝트에 처음 참여할 때

**입력:**
```bash
# 바탕화면이나 원하는 위치로 이동
cd ~/Desktop

# 저장소 복제
git clone git@github.com:사용자이름/my-first-git.git
```

**결과:**
```
Cloning into 'my-first-git'...
remote: Enumerating objects: 12, done.
remote: Counting objects: 100% (12/12), done.
remote: Compressing objects: 100% (8/8), done.
remote: Total 12 (delta 2), reused 12 (delta 2), pack-reused 0
Receiving objects: 100% (12/12), done.
Resolving deltas: 100% (2/2), done.
```

`my-first-git` 폴더가 생기고, 모든 파일과 커밋 기록이 들어있습니다.

> **참고**: `clone`으로 가져온 저장소는 `remote`가 자동으로 설정되어 있어서 바로 `push`/`pull`이 가능합니다.

### 6-6. push/pull 일상 워크플로우

매일 작업할 때의 기본 흐름입니다:

```
1. 작업 시작 전:  git pull        (최신 코드 받기)
2. 파일 수정:     열심히 작업
3. 상태 확인:     git status      (뭘 수정했는지 확인)
4. 스테이징:      git add .       (변경 파일 스테이징)
5. 커밋:          git commit -m "메시지"  (세이브)
6. 업로드:        git push        (GitHub에 올리기)
```

**이 6단계를 습관으로 만들면 Git 마스터입니다!**

### 6-7. 명령어 정리

| 명령어 | 방향 | 설명 | 비유 |
|--------|------|------|------|
| `git remote add origin 주소` | 설정 | 원격 저장소 연결 | 배송지 등록 |
| `git push` | 로컬 → GitHub | 커밋 업로드 | 택배 보내기 |
| `git pull` | GitHub → 로컬 | 최신 변경 다운로드 | 택배 받기 |
| `git clone 주소` | GitHub → 로컬 | 저장소 전체 복사 | 매장 통째로 복제 |

### 체크포인트

- [x] `git remote add`로 원격 저장소를 연결할 수 있다
- [x] `git push`로 코드를 GitHub에 올릴 수 있다
- [x] `git pull`로 최신 코드를 받을 수 있다
- [x] `git clone`으로 저장소를 복제할 수 있다
- [x] push/pull 일상 워크플로우를 이해했다

---

## 7. VS Code에서 Git 사용

터미널 명령어가 익숙하지 않다면, VS Code의 그래픽 인터페이스로 Git을 더 쉽게 사용할 수 있습니다.

### 7-1. VS Code 설치 (아직 안 했다면)

1. [code.visualstudio.com](https://code.visualstudio.com) 접속
2. 본인 OS에 맞는 버전 다운로드
3. 설치 시 아래 옵션 체크 (Windows):
   - [v] Add "Open with Code" action to file context menu
   - [v] Add "Open with Code" action to directory context menu
   - [v] Add to PATH
4. 설치 완료 후 VS Code 실행

### 7-2. VS Code에서 프로젝트 열기

**방법 1: 터미널에서 열기**
```bash
cd ~/my-first-git
code .
```

**방법 2: VS Code에서 열기**
1. VS Code 실행
2. File → Open Folder
3. `my-first-git` 폴더 선택

**방법 3: 우클릭으로 열기 (Windows)**
1. `my-first-git` 폴더를 탐색기에서 찾기
2. 마우스 오른쪽 클릭 → "Open with Code"

### 7-3. 소스 제어 패널 (Git 패널)

VS Code 왼쪽 사이드바에 **가지 모양 아이콘**(Source Control)이 Git 패널입니다.

```
VS Code 왼쪽 사이드바:

  [파일 탐색기 아이콘]    ← 파일 관리
  [검색 아이콘]          ← 검색
  [가지 아이콘]          ← Git (소스 제어) ★ 이것!
  [벌레 아이콘]          ← 디버거
  [퍼즐 아이콘]          ← 확장
```

**단축키**: `Ctrl+Shift+G` (Windows) / `Cmd+Shift+G` (Mac)

### 7-4. VS Code에서 커밋하기

#### 단계 1: 파일 수정

VS Code에서 `index.html`을 열고 내용을 수정합니다. 예를 들어 `<body>` 안에 새 내용을 추가합니다:

```html
<body>
    <h1>안녕하세요!</h1>
    <p>Git으로 관리하는 나의 첫 웹페이지입니다.</p>
    <p>VS Code에서 수정했습니다!</p>
</body>
```

#### 단계 2: 변경사항 확인

소스 제어 패널에 숫자가 표시됩니다 (변경된 파일 수).

```
소스 제어 패널:

  변경 사항 (Changes)
  ────────────────────
  M  index.html        [+] [-] [되돌리기]
  │
  ├─ M = Modified (수정됨)
  ├─ [+] = 스테이징에 추가 (git add)
  ├─ [-] = 스테이징에서 제거
  └─ [되돌리기] = 수정 취소 (주의!)
```

#### 단계 3: 스테이징 (git add)

- 파일 오른쪽의 **`+`** 아이콘을 클릭합니다
- 또는 "Changes" 옆의 **`+`** 아이콘을 클릭하면 모든 파일이 스테이징됩니다

```
소스 제어 패널:

  스테이지된 변경 사항 (Staged Changes)
  ────────────────────
  M  index.html        [-] [되돌리기]

  변경 사항 (Changes)
  ────────────────────
  (없음)
```

#### 단계 4: 커밋 메시지 입력

상단의 메시지 입력란에 커밋 메시지를 입력합니다:

```
VS Code에서 첫 커밋 테스트
```

#### 단계 5: 커밋

**체크(V) 버튼**을 클릭하거나 `Ctrl+Enter`(Windows) / `Cmd+Enter`(Mac)를 누릅니다.

> **완료!** 터미널을 열지 않고도 커밋할 수 있습니다.

### 7-5. VS Code에서 push/pull

커밋 후 하단 상태 표시줄에 동기화 아이콘이 나타납니다:

```
VS Code 하단 상태 표시줄:

  main ↑1 ↓0  [동기화 아이콘]
  │     │  │
  ├─ 현재 브랜치: main
  ├─ ↑1: push할 커밋 1개
  └─ ↓0: pull할 커밋 0개
```

**동기화 아이콘**을 클릭하면 push와 pull을 동시에 수행합니다.

또는:
- `Ctrl+Shift+P` → "Git: Push" 입력 → 엔터 (push만)
- `Ctrl+Shift+P` → "Git: Pull" 입력 → 엔터 (pull만)

### 7-6. 커밋 기록 보기

VS Code에서 커밋 기록을 보는 방법:

**방법 1: 기본 기능**
- 소스 제어 패널 상단의 **"..."** 메뉴 → **"View History"**

**방법 2: 터미널**
- VS Code 내장 터미널 열기: `` Ctrl+` `` (백틱)
- `git log --oneline` 입력

**방법 3: GitLens 확장 (추천)**
- 다음 섹션에서 설명합니다

### 7-7. GitLens 확장 프로그램 설치

GitLens는 VS Code에서 Git을 훨씬 편하게 사용할 수 있게 해주는 확장 프로그램입니다.

#### 설치 방법

1. VS Code 왼쪽 사이드바에서 **퍼즐 아이콘**(확장) 클릭
2. 검색창에 **"GitLens"** 입력
3. "GitLens - Git supercharged" 항목의 **Install** 클릭

#### GitLens의 유용한 기능

| 기능 | 설명 |
|------|------|
| **Blame 표시** | 각 줄을 누가, 언제 수정했는지 바로 보여줌 |
| **커밋 히스토리** | 파일별, 줄별 변경 이력을 시각적으로 표시 |
| **비교 뷰** | 이전 버전과 현재 버전의 차이를 나란히 비교 |
| **그래프 뷰** | 브랜치와 커밋을 시각적 그래프로 표시 |

**설치 후 확인:**
- 코드의 각 줄 옆에 회색으로 "누가, 언제 수정했는지" 정보가 표시됩니다
- 소스 제어 패널에 "GITLENS" 섹션이 추가됩니다

### 7-8. VS Code Git 단축키 정리

| 단축키 (Windows) | 단축키 (Mac) | 기능 |
|---------|---------|------|
| `Ctrl+Shift+G` | `Cmd+Shift+G` | 소스 제어 패널 열기 |
| `` Ctrl+` `` | `` Cmd+` `` | 터미널 열기 |
| `Ctrl+Shift+P` | `Cmd+Shift+P` | 명령 팔레트 (Git 명령 검색) |
| `Ctrl+Enter` | `Cmd+Enter` | 커밋 (메시지 입력 후) |

### 체크포인트

- [x] VS Code에서 소스 제어 패널을 찾을 수 있다
- [x] VS Code에서 커밋할 수 있다 (add → 메시지 → 커밋)
- [x] VS Code에서 push/pull을 할 수 있다
- [x] GitLens 확장을 설치했다

---

## 8. .gitignore와 README

### 8-1. .gitignore란?

`.gitignore`는 **Git이 무시해야 할 파일 목록**을 적어놓는 파일입니다.

```
비유: 집에 CCTV가 있는데,
     화장실과 드레스룸은 촬영하지 않도록
     "촬영 제외 구역"을 지정하는 것과 같습니다.
```

**왜 필요한가요?**

모든 파일을 Git에 올리면 안 되는 경우가 있습니다:

| 올리면 안 되는 것 | 이유 | 예시 |
|------------------|------|------|
| **비밀 정보** | 해킹 위험 | `.env`, API 키, 비밀번호 |
| **의존성 폴더** | 용량이 크고, 필요 시 재설치 가능 | `node_modules/` |
| **빌드 결과물** | 소스로부터 재생성 가능 | `dist/`, `build/` |
| **OS 생성 파일** | 개발과 무관 | `.DS_Store`, `Thumbs.db` |
| **편집기 설정** | 개인 설정 | `.vscode/settings.json` |

### 8-2. .gitignore 만들기

프로젝트 루트에 `.gitignore` 파일을 만듭니다.

**터미널에서:**
```bash
cd ~/my-first-git
```

**VS Code에서 새 파일 만들기:**
1. 파일 탐색기에서 새 파일 아이콘 클릭
2. 파일 이름: `.gitignore` (반드시 점(.)으로 시작!)
3. 아래 내용 입력

### 8-3. 프로젝트별 .gitignore 예시

#### 기본 .gitignore (모든 프로젝트 공통)

```gitignore
# OS 관련 파일
.DS_Store
Thumbs.db
Desktop.ini

# 편집기 설정
.vscode/
.idea/
*.swp
*.swo

# 환경 변수 (비밀 정보!)
.env
.env.local
.env.production

# 로그 파일
*.log
npm-debug.log*
```

#### Node.js 프로젝트용

```gitignore
# 위의 기본 내용 + 아래 추가

# 의존성 폴더 (npm install로 재설치 가능)
node_modules/

# 빌드 결과물
dist/
build/
.next/

# 패키지 관련
package-lock.json  # (선택사항, 프로젝트에 따라 포함할 수도 있음)
```

#### Python 프로젝트용

```gitignore
# 위의 기본 내용 + 아래 추가

# 가상환경
venv/
.venv/
env/

# 컴파일된 파일
__pycache__/
*.py[cod]
*.pyo

# 배포 관련
*.egg-info/
dist/
build/
```

#### 러버블(Lovable) 프로젝트용

```gitignore
# 위의 기본 내용 + Node.js 내용 + 아래 추가

# Supabase 로컬 설정
supabase/.temp/
```

### 8-4. .gitignore 작성 규칙

| 패턴 | 의미 | 예시 |
|------|------|------|
| `파일명` | 특정 파일 무시 | `.env` |
| `폴더명/` | 특정 폴더 전체 무시 | `node_modules/` |
| `*.확장자` | 해당 확장자 모든 파일 무시 | `*.log` |
| `!파일명` | 무시하지 않음 (예외) | `!important.log` |
| `#` | 주석 | `# 이것은 주석입니다` |
| `**` | 모든 하위 디렉토리 | `**/test/` |

### 8-5. 이미 추적 중인 파일을 .gitignore에 추가한 경우

`.gitignore`에 추가하기 **전에** 이미 Git이 추적하고 있는 파일은, `.gitignore`에 추가해도 무시되지 않습니다. 이 경우 캐시를 지워야 합니다:

```bash
# 특정 파일의 추적 해제
git rm --cached .env

# 특정 폴더의 추적 해제
git rm -r --cached node_modules/

# 커밋
git commit -m ".gitignore 적용: 불필요한 파일 추적 해제"
```

> **주의**: `git rm --cached`는 Git 추적만 해제하는 것이며, 실제 파일은 삭제되지 않습니다. `--cached` 없이 `git rm`을 사용하면 파일이 실제로 삭제됩니다!

### 8-6. README.md란?

`README.md`는 프로젝트의 **"첫인상"** 입니다. GitHub 저장소 페이지에 접속하면 가장 먼저 보이는 문서입니다.

**README가 왜 중요한가요?**

- 프로젝트가 뭔지 한눈에 파악할 수 있습니다
- 다른 사람이 프로젝트를 이해하고 사용하는 데 도움을 줍니다
- 미래의 나 자신도 "이 프로젝트가 뭐였더라?" 할 때 도움이 됩니다

### 8-7. README.md 작성법

#### Markdown 기본 문법

README.md는 **Markdown** 형식으로 작성합니다. 간단한 문법만 알면 됩니다:

```markdown
# 제목 1 (가장 큰 제목)
## 제목 2
### 제목 3

**굵게**
*기울임*

- 목록 1
- 목록 2

1. 순서 있는 목록
2. 순서 있는 목록

[링크 텍스트](https://url.com)

![이미지 설명](이미지주소.png)

`코드` (인라인)

​```
코드 블록
​```
```

#### README 템플릿

```markdown
# 프로젝트 이름

프로젝트에 대한 한 줄 설명을 적어주세요.

## 소개

이 프로젝트는 무엇을 하기 위해 만들어졌는지 설명합니다.

## 주요 기능

- 기능 1: 설명
- 기능 2: 설명
- 기능 3: 설명

## 시작하기

### 사전 요구사항

- Node.js 18 이상
- npm 또는 yarn

### 설치 방법

​```bash
# 저장소 복제
git clone https://github.com/사용자이름/프로젝트이름.git

# 폴더 이동
cd 프로젝트이름

# 의존성 설치
npm install

# 실행
npm start
​```

## 사용 방법

사용 방법이나 스크린샷을 넣어주세요.

## 라이선스

MIT License
```

### 8-8. 라이선스 선택 가이드

라이선스는 다른 사람이 내 코드를 어떻게 사용할 수 있는지 규칙을 정하는 것입니다.

| 라이선스 | 제한 수준 | 특징 | 추천 상황 |
|---------|----------|------|----------|
| **MIT** | 매우 자유 | 누구나 자유롭게 사용/수정/배포 가능 | 대부분의 개인 프로젝트 |
| **Apache 2.0** | 자유 | MIT와 비슷 + 특허 관련 보호 | 기업 프로젝트 |
| **GPL 3.0** | 엄격 | 수정 후 배포 시 소스 공개 의무 | 오픈소스 철학 강조 시 |
| **없음** | 기본적으로 저작권 보호 | 명시적 허가 없이 사용 불가 | 비공개 프로젝트 |

> **초보자 추천**: 특별한 이유가 없다면 **MIT 라이선스**를 선택하세요. 가장 간단하고 널리 사용됩니다.

**라이선스 파일 만들기:**

GitHub에서 저장소 생성 시 라이선스를 선택하거나, 수동으로 `LICENSE` 파일을 만들 수 있습니다.

### 8-9. .gitignore와 README 커밋하기

지금까지 만든 파일들을 커밋합니다:

```bash
git add .gitignore README.md
git commit -m ".gitignore와 README 추가"
git push
```

### 체크포인트

- [x] .gitignore가 왜 필요한지 이해했다
- [x] 프로젝트에 맞는 .gitignore를 작성할 수 있다
- [x] README.md를 Markdown으로 작성할 수 있다
- [x] 라이선스의 기본 개념을 이해했다

---

## 9. 종합 실습

지금까지 배운 모든 내용을 활용하여 **처음부터 끝까지** 프로젝트를 만들어봅시다.

### 9-1. 실습 목표

```
새 프로젝트를 만들고 → Git으로 관리하고 → GitHub에 올리기

완성 후 결과:
- 로컬: 깔끔하게 관리된 프로젝트 폴더
- GitHub: 커밋 기록이 남은 원격 저장소
- 배포: GitHub Pages로 웹사이트 공개 (보너스!)
```

### 9-2. 단계 1: 프로젝트 폴더 만들기

```bash
# 바탕화면 또는 원하는 위치로 이동
cd ~/Desktop

# 프로젝트 폴더 만들기
mkdir my-portfolio
cd my-portfolio

# Git 초기화
git init
```

**확인:**
```bash
git status
```

```
On branch main
No commits yet
nothing to commit (create copy and track files)
```

### 9-3. 단계 2: 기본 파일 만들기

#### .gitignore 만들기

```bash
cat > .gitignore << 'EOF'
# OS 파일
.DS_Store
Thumbs.db

# 편집기
.vscode/
.idea/

# 환경 변수
.env
.env.local
EOF
```

#### README.md 만들기

```bash
cat > README.md << 'EOF'
# 나의 포트폴리오

Git과 GitHub을 배우며 만든 첫 포트폴리오 웹사이트입니다.

## 기술 스택

- HTML5
- CSS3

## 라이선스

MIT License
EOF
```

#### index.html 만들기

```bash
cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>나의 포트폴리오</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>홍길동의 포트폴리오</h1>
        <p>안녕하세요! 만나서 반갑습니다.</p>
    </header>

    <main>
        <section>
            <h2>소개</h2>
            <p>저는 Git과 GitHub을 배우고 있는 초보 개발자입니다.</p>
        </section>
    </main>

    <footer>
        <p>2026 홍길동. All rights reserved.</p>
    </footer>
</body>
</html>
EOF
```

### 9-4. 단계 3: 첫 번째 커밋

```bash
# 상태 확인
git status

# 전체 스테이징
git add .

# 상태 다시 확인 (초록색으로 변경)
git status

# 커밋
git commit -m "프로젝트 초기 설정: README, .gitignore, index.html"
```

**예상 결과:**
```
[main (root-commit) abc1234] 프로젝트 초기 설정: README, .gitignore, index.html
 3 files changed, 40 insertions(+)
 create mode 100644 .gitignore
 create mode 100644 README.md
 create mode 100644 index.html
```

### 9-5. 단계 4: CSS 추가 — 두 번째 커밋

```bash
cat > style.css << 'EOF'
/* 전체 리셋 */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Pretendard', -apple-system, sans-serif;
    line-height: 1.6;
    color: #333;
}

header {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    text-align: center;
    padding: 60px 20px;
}

header h1 {
    font-size: 2.5rem;
    margin-bottom: 10px;
}

main {
    max-width: 800px;
    margin: 40px auto;
    padding: 0 20px;
}

section {
    margin-bottom: 40px;
}

section h2 {
    color: #667eea;
    margin-bottom: 15px;
    font-size: 1.5rem;
}

footer {
    text-align: center;
    padding: 20px;
    background: #f5f5f5;
    color: #666;
    margin-top: 60px;
}
EOF
```

```bash
git add style.css
git commit -m "스타일시트 추가: 헤더 그라디언트, 레이아웃 정리"
```

### 9-6. 단계 5: 콘텐츠 보강 — 세 번째 커밋

`index.html`의 `<main>` 섹션에 내용을 추가합니다. VS Code에서 파일을 열고 수정합니다:

```html
    <main>
        <section>
            <h2>소개</h2>
            <p>저는 Git과 GitHub을 배우고 있는 초보 개발자입니다.</p>
            <p>바이브코딩을 통해 웹 개발의 세계에 입문했습니다.</p>
        </section>

        <section>
            <h2>배운 것들</h2>
            <ul>
                <li>Git 기본 명령어 (init, add, commit, push)</li>
                <li>GitHub 저장소 관리</li>
                <li>HTML/CSS 기초</li>
                <li>.gitignore와 README 작성법</li>
            </ul>
        </section>

        <section>
            <h2>프로젝트</h2>
            <p>앞으로 더 많은 프로젝트를 추가할 예정입니다!</p>
        </section>

        <section>
            <h2>연락처</h2>
            <p>GitHub: <a href="https://github.com/사용자이름">github.com/사용자이름</a></p>
        </section>
    </main>
```

```bash
git add index.html
git commit -m "포트폴리오 콘텐츠 보강: 배운 것, 프로젝트, 연락처 섹션 추가"
```

### 9-7. 단계 6: GitHub에 올리기

#### GitHub에서 저장소 만들기

1. GitHub → `+` → New repository
2. Repository name: `my-portfolio`
3. Public 선택
4. README 추가 **안 함** (이미 있으므로)
5. Create repository

#### 원격 연결 및 push

```bash
# SSH 방식
git remote add origin git@github.com:사용자이름/my-portfolio.git

# push
git push -u origin main
```

### 9-8. 단계 7: GitHub에서 확인하기

브라우저에서 `github.com/사용자이름/my-portfolio`에 접속합니다.

**확인할 것:**

1. **파일 목록**: `.gitignore`, `README.md`, `index.html`, `style.css`가 보이는가?
2. **README 미리보기**: 하단에 README.md 내용이 렌더링되어 보이는가?
3. **커밋 기록**: "3 commits" 클릭 → 3개의 커밋이 순서대로 보이는가?
4. **.gitignore**: `.DS_Store` 같은 파일이 올라가지 않았는가?

### 9-9. 보너스: GitHub Pages로 웹사이트 배포

GitHub에 올린 HTML 파일을 **무료 웹사이트**로 공개할 수 있습니다!

#### 설정 방법

1. GitHub 저장소 페이지 → **Settings** 탭
2. 왼쪽 메뉴에서 **"Pages"** 클릭
3. **Source**: "Deploy from a branch" 선택
4. **Branch**: `main` 선택, 폴더는 `/ (root)` 유지
5. **Save** 클릭

#### 배포 확인

1~2분 후 상단에 URL이 표시됩니다:
```
https://사용자이름.github.io/my-portfolio/
```

이 URL로 접속하면 만든 포트폴리오 웹사이트가 보입니다!

> **팁**: 변경사항을 push하면 자동으로 GitHub Pages에도 반영됩니다. 다만 반영까지 1~2분 정도 걸릴 수 있습니다.

### 9-10. 커밋 기록 최종 확인

```bash
git log --oneline
```

**예상 결과:**
```
e5f6g7h (HEAD -> main, origin/main) 포트폴리오 콘텐츠 보강: 배운 것, 프로젝트, 연락처 섹션 추가
d4e5f6g 스타일시트 추가: 헤더 그라디언트, 레이아웃 정리
abc1234 프로젝트 초기 설정: README, .gitignore, index.html
```

3개의 커밋이 의미 있는 메시지와 함께 깔끔하게 기록되어 있습니다!

### 체크포인트

- [x] 새 프로젝트를 만들고 Git으로 초기화했다
- [x] .gitignore와 README.md를 작성했다
- [x] 의미 있는 단위로 3회 커밋했다
- [x] GitHub에 push했다
- [x] GitHub에서 파일과 커밋 기록을 확인했다
- [x] (보너스) GitHub Pages로 배포했다

---

## 10. 트러블슈팅 & FAQ

### 10-1. 트러블슈팅 — 자주 겪는 문제 8가지

---

#### 문제 1: push 시 인증 실패

```
remote: Support for password authentication was removed.
fatal: Authentication failed for 'https://github.com/...'
```

**원인**: GitHub는 2021년부터 비밀번호 인증을 지원하지 않습니다.

**해결 방법:**

**방법 A: SSH 방식으로 전환 (추천)**
```bash
# 현재 원격 주소 확인
git remote -v

# HTTPS를 SSH로 변경
git remote set-url origin git@github.com:사용자이름/저장소이름.git

# 확인
git remote -v

# 다시 push
git push
```

**방법 B: Personal Access Token 사용**
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token → 이름 입력, repo 권한 체크 → Generate
3. 생성된 토큰을 비밀번호 대신 입력

---

#### 문제 2: push 거부 (reject)

```
! [rejected]        main -> main (non-fast-forward)
error: failed to push some refs to 'github.com:...'
hint: Updates were rejected because the remote contains work that you do not have locally.
```

**원인**: GitHub에 내 컴퓨터에 없는 커밋이 있습니다 (다른 곳에서 수정했거나, GitHub 웹에서 직접 수정한 경우).

**해결 방법:**
```bash
# 먼저 pull로 최신 변경사항 받기
git pull

# (충돌이 없으면) 다시 push
git push
```

만약 `git pull` 시 충돌(conflict)이 발생하면:
```bash
# 충돌 파일을 열어서 수동으로 수정
# <<<<<<< HEAD
# 내 코드
# =======
# 원격의 코드
# >>>>>>> origin/main

# 충돌 표시(<<<, ===, >>>)를 지우고 원하는 내용으로 수정

# 수정 후 커밋
git add .
git commit -m "merge 충돌 해결"
git push
```

---

#### 문제 3: 한글 파일명 깨짐

```
$ git status
"\355\225\234\352\270\200\355\214\214\354\235\274.txt"
```

**원인**: Git이 한글 파일명을 이스케이프 문자로 표시하고 있습니다.

**해결 방법:**
```bash
git config --global core.quotepath false
```

이후 `git status`를 다시 실행하면 한글이 정상적으로 표시됩니다:
```
한글파일.txt
```

---

#### 문제 4: "fatal: not a git repository"

```
fatal: not a git repository (or any of the parent directories): .git
```

**원인**: 현재 디렉토리가 Git 저장소가 아닙니다.

**해결 방법:**
```bash
# 현재 위치 확인
pwd

# 프로젝트 폴더로 이동
cd ~/my-first-git

# 또는 Git 초기화가 안 됐다면
git init
```

---

#### 문제 5: 실수로 커밋한 파일 되돌리기

**상황**: `.env` 파일을 실수로 커밋해버렸습니다!

**해결 방법:**
```bash
# 1. .gitignore에 추가
echo ".env" >> .gitignore

# 2. Git 추적에서 제거 (파일은 삭제하지 않음)
git rm --cached .env

# 3. 커밋
git commit -m ".env 파일 Git 추적 해제 및 .gitignore 추가"

# 4. push
git push
```

> **주의**: GitHub에 한 번이라도 올라간 비밀 정보(API 키 등)는 커밋 기록에 남아있을 수 있습니다. 비밀 키가 노출된 경우 해당 키를 즉시 재발급하세요!

---

#### 문제 6: 커밋 메시지를 잘못 작성한 경우

**상황**: 커밋 메시지에 오타가 있습니다.

**해결 방법 (아직 push하기 전):**
```bash
# 마지막 커밋 메시지만 수정
git commit --amend -m "올바른 커밋 메시지"
```

> **주의**: 이미 push한 커밋의 메시지를 수정하면 복잡해집니다. 초보자는 push하기 전에 커밋 메시지를 꼼꼼히 확인하세요.

---

#### 문제 7: SSH 키 관련 오류

```
Permission denied (publickey).
fatal: Could not read from remote repository.
```

**원인**: SSH 키가 등록되지 않았거나, SSH 에이전트가 실행되지 않았습니다.

**해결 방법:**

```bash
# 1. SSH 키가 있는지 확인
ls -la ~/.ssh/

# 2. SSH 에이전트 시작
eval "$(ssh-agent -s)"

# 3. SSH 키 등록
ssh-add ~/.ssh/id_ed25519

# 4. 연결 테스트
ssh -T git@github.com
```

SSH 키가 없다면 섹션 5를 참고하여 새로 만들어주세요.

---

#### 문제 8: git pull 시 "error: Your local changes would be overwritten"

```
error: Your local changes to the following files would be overwritten by merge:
        index.html
Please commit your changes or stash them before you can merge.
```

**원인**: 로컬에서 수정한 파일이 있는데, 원격에서도 같은 파일이 수정되었습니다.

**해결 방법:**

**방법 A: 로컬 변경사항을 먼저 커밋**
```bash
git add .
git commit -m "작업 중인 변경사항 임시 저장"
git pull
```

**방법 B: 로컬 변경사항을 임시 보관 (stash)**
```bash
# 변경사항 임시 보관
git stash

# pull
git pull

# 보관한 변경사항 다시 적용
git stash pop
```

---

### 10-2. 자주 묻는 질문 (FAQ) — 8가지

---

#### FAQ 1: Git과 GitHub는 꼭 같이 써야 하나요?

**아니요!** Git은 내 컴퓨터에서만 사용할 수도 있습니다. GitHub 없이도 로컬에서 버전 관리가 가능합니다.

하지만 GitHub를 함께 쓰면:
- 코드 백업이 됩니다 (컴퓨터가 고장나도 안전)
- 여러 컴퓨터에서 작업할 수 있습니다
- 다른 사람과 협업할 수 있습니다
- GitHub Pages로 웹사이트를 무료 배포할 수 있습니다

---

#### FAQ 2: 커밋은 얼마나 자주 해야 하나요?

**"의미 있는 단위"** 로 커밋하는 것이 좋습니다.

| 너무 적은 커밋 | 적절한 커밋 | 너무 많은 커밋 |
|-------------|-----------|-------------|
| "프로젝트 완성" (1개) | "헤더 디자인 완성" | "a 추가" |
| 변경사항 파악 불가 | 각 커밋이 하나의 기능/수정 | 의미 없는 커밋 과다 |

**초보자 가이드라인:**
- 새 기능을 하나 완성했을 때
- 버그를 하나 수정했을 때
- 작업을 중단하기 전 (세이브!)
- 대략 30분~1시간에 한 번

---

#### FAQ 3: Private(비공개) 저장소를 쓸 수 있나요?

**네!** GitHub 무료 계정에서도 Private 저장소를 **무제한**으로 만들 수 있습니다.

저장소 생성 시 **Private**을 선택하면 본인과 초대한 사람만 볼 수 있습니다.

| Public (공개) | Private (비공개) |
|------|---------|
| 누구나 코드를 볼 수 있음 | 본인과 초대받은 사람만 접근 |
| 오픈소스, 포트폴리오에 적합 | 개인 프로젝트, 회사 코드에 적합 |
| GitHub Pages 무료 사용 | GitHub Pages는 Pro 계정 필요 |

---

#### FAQ 4: `git add .`과 `git add -A`의 차이는?

대부분의 경우 동일하게 작동합니다.

| 명령어 | 설명 |
|--------|------|
| `git add .` | 현재 디렉토리와 하위 디렉토리의 모든 변경 추가 |
| `git add -A` | 저장소 전체의 모든 변경 추가 (삭제 포함) |
| `git add 파일명` | 지정한 파일만 추가 |

> **초보자 추천**: 프로젝트 루트에서 `git add .`을 사용하면 충분합니다.

---

#### FAQ 5: 이전 커밋으로 되돌리고 싶어요

**방법 1: 특정 파일만 되돌리기**
```bash
# 특정 파일을 마지막 커밋 상태로 되돌리기
git checkout -- 파일이름
```

**방법 2: 커밋 자체를 되돌리기 (안전한 방법)**
```bash
# 해당 커밋의 변경을 취소하는 새 커밋 생성
git revert 커밋ID
```

**방법 3: 커밋 기록까지 되돌리기 (주의!)**
```bash
# 해당 커밋 시점으로 완전히 되돌아감 (이후 커밋 삭제)
git reset --hard 커밋ID
```

> **초보자 추천**: `revert`를 사용하세요. 기록이 보존되어 안전합니다.

---

#### FAQ 6: GitHub Desktop이라는 것도 있던데, 그걸 써도 되나요?

**네!** [GitHub Desktop](https://desktop.github.com)은 GUI(그래픽) 방식의 Git 클라이언트입니다.

| 방법 | 장점 | 단점 |
|------|------|------|
| **터미널 (CLI)** | 모든 기능 사용 가능, 어디서나 동일 | 명령어 암기 필요 |
| **VS Code Git 패널** | 코딩하면서 바로 사용 | 복잡한 기능은 터미널 필요 |
| **GitHub Desktop** | 가장 직관적, 초보자 친화적 | 고급 기능 제한 |

> **추천**: 처음에는 어떤 방법이든 괜찮습니다. 하지만 터미널 명령어를 함께 익혀두면 나중에 큰 도움이 됩니다.

---

#### FAQ 7: 바이브코딩(러버블, 커서 등)에서 Git은 어떻게 쓰이나요?

| 도구 | Git 사용 방식 |
|------|-------------|
| **러버블 (Lovable)** | 프로젝트가 GitHub에 자동 연동, 저장소에서 코드 확인 가능 |
| **커서 (Cursor)** | VS Code 기반이므로 Git 패널 내장, 직접 커밋/push |
| **안티그래비티** | 프로젝트를 GitHub에 내보내기 가능 |
| **Claude Code** | CLI 환경에서 Git 직접 사용, 커밋/push 명령 실행 |

바이브코딩 도구를 사용하더라도 Git의 기본 개념을 이해하고 있으면:
- 프로젝트 이력을 파악할 수 있습니다
- 문제가 생겼을 때 이전 버전으로 되돌릴 수 있습니다
- 코드를 다른 환경으로 옮길 수 있습니다

---

#### FAQ 8: Git을 더 깊이 배우려면 어디서 공부하나요?

**무료 학습 자료:**

| 자료 | 설명 | 링크 |
|------|------|------|
| **Git 공식 도서 (Pro Git)** | 무료 온라인 도서, 한국어 번역 | [git-scm.com/book/ko](https://git-scm.com/book/ko/v2) |
| **GitHub Skills** | GitHub 공식 대화형 학습 | [skills.github.com](https://skills.github.com) |
| **Learn Git Branching** | 시각적으로 Git 학습 | [learngitbranching.js.org](https://learngitbranching.js.org/?locale=ko) |
| **생활코딩 Git** | 한국어 입문 강의 | [opentutorials.org](https://opentutorials.org/course/3837) |

**다음에 배울 것들:**
- 브랜치 만들기와 합치기 (merge)
- Pull Request (PR) 만들기
- 충돌(conflict) 해결하기
- Git Flow 워크플로우
- GitHub Actions (자동화)

---

### 10-3. Git 명령어 치트시트

자주 사용하는 명령어를 한눈에 정리합니다:

#### 초기 설정

```bash
git config --global user.name "이름"          # 사용자 이름 설정
git config --global user.email "이메일"       # 이메일 설정
git config --global core.quotepath false      # 한글 파일명 설정
git config --global init.defaultBranch main   # 기본 브랜치 이름 설정
```

#### 기본 워크플로우

```bash
git init                    # 새 저장소 초기화
git status                  # 현재 상태 확인
git add 파일명              # 파일 스테이징
git add .                   # 모든 변경 파일 스테이징
git commit -m "메시지"      # 커밋 (세이브)
git log --oneline           # 커밋 기록 보기
```

#### 원격 저장소

```bash
git remote add origin 주소  # 원격 저장소 연결
git remote -v               # 원격 저장소 확인
git push -u origin main     # 첫 push (이후 git push만)
git push                    # GitHub에 올리기
git pull                    # GitHub에서 받기
git clone 주소              # 저장소 복제
```

#### 확인 및 되돌리기

```bash
git diff                    # 변경 내용 비교
git log                     # 상세 커밋 기록
git log --oneline           # 한 줄 커밋 기록
git checkout -- 파일명      # 파일 변경 취소
git reset HEAD 파일명       # 스테이징 취소
```

---

## 부록: 용어 사전

| 용어 | 영문 | 설명 |
|------|------|------|
| **저장소** | Repository | Git이 파일 이력을 저장하는 공간 (폴더 + .git) |
| **커밋** | Commit | 변경사항을 저장하는 행위, 또는 그 기록 (세이브) |
| **스테이징** | Staging | 커밋할 파일을 선택하는 과정 (git add) |
| **브랜치** | Branch | 독립된 작업 공간 (가지치기) |
| **푸시** | Push | 로컬 커밋을 원격 저장소에 업로드 |
| **풀** | Pull | 원격 저장소의 변경사항을 로컬에 다운로드 |
| **클론** | Clone | 원격 저장소를 로컬에 통째로 복사 |
| **원격 저장소** | Remote | 인터넷(GitHub)에 있는 저장소 |
| **로컬 저장소** | Local | 내 컴퓨터에 있는 저장소 |
| **작업 디렉토리** | Working Directory | 실제 파일을 편집하는 폴더 |
| **충돌** | Conflict | 같은 파일의 같은 부분을 다르게 수정한 경우 |
| **머지** | Merge | 두 브랜치를 합치는 것 |
| **SSH 키** | SSH Key | 비밀번호 없이 안전하게 인증하는 암호화 키 |
| **.gitignore** | .gitignore | Git이 무시할 파일 목록 |
| **README** | README | 프로젝트 소개 문서 |
| **HEAD** | HEAD | 현재 작업 중인 커밋을 가리키는 포인터 |
| **origin** | Origin | 원격 저장소의 기본 별명 |
| **main** | Main | 기본 브랜치의 이름 (과거에는 master) |
| **diff** | Diff | 두 버전 간의 차이점 |
| **stash** | Stash | 작업 중인 변경사항을 임시 보관 |

---

## 다음 단계

이 교안을 완료했다면, 다음으로 도전해볼 수 있는 것들입니다:

### 바이브코딩 도구와 함께 사용하기

```
Git/GitHub 기초 (지금 여기!)
  ↓
러버블 (Lovable) → GitHub 연동으로 코드 확인
  ↓
커서 (Cursor) → Git 패널로 버전 관리하며 개발
  ↓
Claude Code → CLI에서 Git 직접 사용
```

### Git 심화 학습 경로

```
1단계: 기본 (지금 여기!)
  init, add, commit, push, pull, clone

2단계: 브랜치 활용
  branch, checkout, merge, rebase

3단계: 협업
  Pull Request, Code Review, Fork

4단계: 고급
  Git Flow, Cherry-pick, Submodule, GitHub Actions
```

### 실전 프로젝트 아이디어

| 프로젝트 | 난이도 | 배울 수 있는 것 |
|---------|-------|---------------|
| 개인 포트폴리오 | ★☆☆ | GitHub Pages 배포 |
| TIL(Today I Learned) 저장소 | ★☆☆ | 매일 커밋 습관 |
| 오픈소스 README 번역 기여 | ★★☆ | Fork, PR, 협업 |
| 팀 프로젝트 | ★★☆ | 브랜치, 머지, 충돌 해결 |
| GitHub Actions 자동화 | ★★★ | CI/CD, 자동 배포 |

---

## 출처 및 참고 자료

| 자료 | 설명 |
|------|------|
| [Git 공식 사이트](https://git-scm.com) | Git 다운로드, 공식 문서 |
| [GitHub 공식 문서](https://docs.github.com/ko) | GitHub 한국어 공식 가이드 |
| [Pro Git Book (한국어)](https://git-scm.com/book/ko/v2) | Git 공식 무료 도서 |
| [GitHub Skills](https://skills.github.com) | GitHub 공식 대화형 학습 |
| [Learn Git Branching](https://learngitbranching.js.org/?locale=ko) | 시각적 Git 브랜치 학습 |
| 김선생의 바이브코딩 가이드 | 본 교안 프로젝트 |

---

> **수고하셨습니다!** 이제 여러분은 Git과 GitHub의 기초를 익혔습니다. 처음에는 명령어가 낯설고 어렵게 느껴지겠지만, 매일 조금씩 사용하다 보면 자연스러워집니다. "commit 습관"을 들이는 것이 가장 중요합니다. 화이팅!
