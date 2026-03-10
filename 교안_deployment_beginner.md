# 배포 가이드 초보편 — 내 프로젝트를 세상에 공개하기

> **과정명**: 내 프로젝트를 세상에 공개하기
> **대상**: 코드를 만들었지만 배포를 한 번도 해본 적 없는 입문자
> **목표**: Vercel / Netlify / GitHub Pages로 첫 배포 성공
> **소요 시간**: 약 2~3시간

---

## 이 교안이 나에게 맞을까요? (자가 진단)

아래 질문에 답해보세요:

| 질문 | 예 → | 아니오 → |
|------|------|----------|
| 바이브코딩 도구(러버블, 커서 등)로 프로젝트를 만들어본 적 있나요? | **이 교안이 맞아요!** | → 먼저 도구별 초보자편을 진행하세요 |
| 만든 프로젝트를 다른 사람에게 보여주고 싶나요? | **이 교안이 맞아요!** | → 배포가 꼭 필요하지 않을 수 있어요 |
| "배포", "호스팅"이라는 단어가 낯선가요? | **이 교안이 맞아요!** | → 이미 기본 개념은 아시네요, 확인 차원에서 읽어보세요 |
| 이전에 Vercel이나 Netlify로 배포해 본 적이 있나요? | → 중급편을 참고하세요 | **이 교안이 맞아요!** |

> 하나라도 "이 교안이 맞아요!"에 해당하면, 이 교안부터 시작하세요!

---

## 목차

1. [배포란?](#1-배포란)
2. [배포 방식 3가지](#2-배포-방식-3가지)
3. [GitHub Pages 배포](#3-github-pages-배포)
4. [Vercel 배포](#4-vercel-배포)
5. [Netlify 배포](#5-netlify-배포)
6. [도구별 배포 방법](#6-도구별-배포-방법)
7. [커스텀 도메인 연결하기](#7-커스텀-도메인-연결하기)
8. [배포 후 확인하기](#8-배포-후-확인하기)
9. [트러블슈팅 & FAQ](#9-트러블슈팅--faq)
10. [다음 단계](#10-다음-단계)

---

## 1. 배포란?

### 비유로 이해하기: 집 요리 vs 식당 오픈

배포를 이해하는 가장 쉬운 방법은 요리에 비유하는 것입니다.

| | 집에서 요리 (개발) | 식당 오픈 (배포) |
|---|---|---|
| **누가 먹나요?** | 나만 먹음 | 누구나 와서 먹을 수 있음 |
| **어디서?** | 내 주방 (내 컴퓨터) | 식당 (인터넷 서버) |
| **주소가 있나요?** | 없음 (localhost) | 있음 (https://my-site.com) |
| **언제나 가능?** | 컴퓨터 켤 때만 | 24시간 365일 |
| **다른 사람이 접근?** | 불가능 | URL만 알면 가능 |

지금 여러분이 바이브코딩 도구(러버블, 커서 등)로 만든 프로젝트는 **"집에서 요리한 상태"** 입니다.
이것을 **식당으로 오픈**(= 배포)해야 다른 사람들이 내 사이트에 접속할 수 있습니다.

### 배포의 정의

**배포(Deploy, 디플로이)** 란, 내 컴퓨터에서 만든 웹사이트나 앱을 **인터넷 서버에 올려서 누구나 접속할 수 있도록 공개하는 작업**입니다.

```
배포 전: http://localhost:3000  (나만 볼 수 있음)
    ↓ [배포 과정]
배포 후: https://my-project.vercel.app  (전 세계 누구나 접속 가능!)
```

### 알아야 할 핵심 용어 3가지

배포를 이해하려면 딱 3가지 개념만 알면 됩니다:

#### 1) 호스팅 (Hosting) = 가게 자리

- 내 웹사이트 파일을 저장해두는 **인터넷 컴퓨터(서버)** 를 빌리는 것
- 마치 음식을 팔기 위해 **가게 자리를 빌리는 것**과 같습니다
- 무료 호스팅: GitHub Pages, Vercel, Netlify
- 유료 호스팅: AWS, 카페24, Cloudflare 등

#### 2) 도메인 (Domain) = 가게 주소

- 내 사이트의 **인터넷 주소** (예: `www.my-cafe.com`)
- 마치 **가게 간판 + 주소**와 같습니다
- 무료 도메인: `username.github.io`, `my-site.vercel.app`, `my-site.netlify.app`
- 유료 도메인: `.com`, `.kr`, `.co.kr` 등 (연 1~2만 원)

#### 3) 서버 (Server) = 가게 건물

- 내 사이트를 24시간 돌려주는 **실제 컴퓨터**
- 마치 **가게 건물 자체**와 같습니다
- 직접 서버를 관리할 필요 없이, 호스팅 서비스가 대신 관리해줍니다

### URL이 만들어지는 과정

배포하면 내 프로젝트에 접속할 수 있는 **고유 URL**이 자동으로 생성됩니다.

```
내 프로젝트 파일들
    ↓ [배포 플랫폼에 업로드]
배포 플랫폼이 서버에 파일 저장
    ↓ [자동으로 URL 생성]
https://my-project.vercel.app  ← 이 주소로 접속 가능!
```

**각 플랫폼별 자동 생성 URL 형식:**

| 플랫폼 | URL 형식 | 예시 |
|--------|---------|------|
| GitHub Pages | `https://유저명.github.io/저장소명/` | `https://jinu-kbs.github.io/my-cafe/` |
| Vercel | `https://프로젝트명.vercel.app` | `https://my-cafe.vercel.app` |
| Netlify | `https://프로젝트명.netlify.app` | `https://my-cafe.netlify.app` |
| Lovable | `https://프로젝트명.lovable.app` | `https://cool-hot-story.lovable.app` |

> **핵심 포인트**: 위의 무료 URL만으로도 충분합니다! 나만의 `.com` 주소는 나중에 연결해도 됩니다.

### 배포는 어렵지 않습니다

과거에는 배포가 매우 어려운 작업이었습니다:

```
예전: 서버 구입 → 리눅스 설치 → 네트워크 설정 → 도메인 구매 → DNS 설정 → SSL 인증서 → ...
지금: 클릭 몇 번이면 끝! ✅
```

현대의 배포 플랫폼들은 이 모든 과정을 **자동화**해놓았기 때문에, 여러분은 **파일을 올리고 버튼만 누르면** 됩니다.

> **격려**: 배포가 처음이라 두려울 수 있지만, 이 교안을 따라하면 30분 안에 첫 배포를 완료할 수 있습니다. 하나하나 함께 해봅시다!

---

## 2. 배포 방식 3가지

모든 웹 프로젝트의 배포는 크게 3가지 방식으로 나뉩니다. 내 프로젝트가 어떤 유형인지 알면 **어떤 배포 방법을 써야 하는지** 바로 결정할 수 있습니다.

### 비교표: 정적 사이트 vs 서버 앱 vs 서버리스

| 항목 | 정적 사이트 (Static) | 서버 앱 (Server) | 서버리스 (Serverless) |
|------|---------------------|-----------------|---------------------|
| **비유** | 전단지 | 카페 주문 시스템 | 배달 전문점 |
| **작동 방식** | 미리 만들어둔 파일을 그대로 보여줌 | 요청할 때마다 서버가 페이지를 만들어 줌 | 특정 기능만 필요할 때 실행 |
| **서버 필요?** | 불필요 (파일만 올리면 됨) | 항상 실행 중인 서버 필요 | 자동으로 켜졌다 꺼짐 |
| **속도** | 매우 빠름 | 보통 | 첫 요청만 약간 느릴 수 있음 |
| **비용** | 무료 ~ 매우 저렴 | 유료 (서버 비용) | 사용한 만큼만 과금 |
| **복잡도** | 가장 쉬움 | 어려움 | 보통 |
| **예시** | 블로그, 포트폴리오, 소개 페이지 | 쇼핑몰, SNS, 관리자 대시보드 | API, 이미지 리사이즈, 알림 발송 |
| **배포 플랫폼** | GitHub Pages, Netlify, Vercel | AWS EC2, Heroku, Railway | Vercel Functions, AWS Lambda |

### 바이브코딩 결과물은 어떤 타입?

바이브코딩 도구로 만든 대부분의 프로젝트는 **정적 사이트** 또는 **정적 사이트 + 서버리스 함수** 조합입니다.

| 도구 | 주로 만들어지는 타입 | 배포 난이도 |
|------|---------------------|-----------|
| **Lovable** | 정적 사이트 (React SPA) | 매우 쉬움 (Publish 버튼) |
| **Cursor** | 다양 (설정에 따라) | 보통 (수동 배포) |
| **AntiGravity** | 정적 사이트 + API | 보통 |
| **AI Studio** | 정적 사이트 (HTML/JS) | 쉬움 |
| **Claude Code** | 다양 (설정에 따라) | 보통 (CLI 사용) |
| **ChatGPT** | 코드 조각 (수동 조립 필요) | 보통~어려움 |

> **핵심 포인트**: 이 교안에서 다루는 GitHub Pages, Vercel, Netlify 모두 **정적 사이트 배포에 최적화**된 플랫폼입니다. 바이브코딩으로 만든 프로젝트 대부분을 이 3가지 플랫폼으로 배포할 수 있습니다.

### 어떤 배포 플랫폼을 선택할까?

```
                  내 프로젝트는?
                      |
            ┌─────────┼──────────┐
            │         │          │
    순수 HTML/CSS   React/Vue   서버(백엔드)가
    정적 파일       프로젝트     필요한 프로젝트
            │         │          │
     GitHub Pages   Vercel     Railway/
     또는 Netlify   또는       Render 등
                    Netlify    (이 교안 범위 밖)
```

**추천 가이드:**

| 상황 | 추천 플랫폼 | 이유 |
|------|-----------|------|
| 가장 쉬운 방법을 원해요 | **Netlify** | 파일 드래그&드롭으로 즉시 배포 |
| GitHub을 이미 쓰고 있어요 | **GitHub Pages** 또는 **Vercel** | GitHub과 자연스럽게 연동 |
| React/Next.js 프로젝트예요 | **Vercel** | React 생태계 최적화 |
| 가장 빠르게 결과를 보고 싶어요 | **Netlify** (드래그&드롭) | 1분이면 배포 완료 |
| 자동 재배포가 중요해요 | **Vercel** 또는 **Netlify** | GitHub 푸시 시 자동 반영 |

✅ **체크포인트**: 내 프로젝트 타입과 추천 플랫폼을 확인했나요? 그러면 다음 섹션으로 이동하세요!

---

## 3. GitHub Pages 배포

### GitHub Pages란?

**GitHub Pages**는 GitHub 저장소(Repository)에 올린 파일을 **무료로 웹사이트로 공개**해주는 서비스입니다. GitHub 계정만 있으면 누구나 사용할 수 있습니다.

| 항목 | 내용 |
|------|------|
| **비용** | 완전 무료 |
| **용량 제한** | 저장소당 1GB, 월 100GB 트래픽 |
| **커스텀 도메인** | 지원 (무료 HTTPS) |
| **자동 배포** | main 브랜치 푸시 시 자동 반영 |
| **적합한 프로젝트** | 순수 HTML/CSS/JS, 정적 사이트, 블로그 |
| **부적합한 프로젝트** | 백엔드 서버 필요, 데이터베이스 연동 |

### 사전 준비

배포하기 전에 아래 사항을 확인하세요:

- [ ] GitHub 계정이 있다 (없으면 [github.com](https://github.com)에서 무료 가입)
- [ ] 배포할 프로젝트 파일이 준비되어 있다
- [ ] 프로젝트에 `index.html` 파일이 있다 (필수!)

> **참고**: GitHub 계정이 없다면 먼저 [github.com](https://github.com)에서 가입하세요. 이메일 주소만 있으면 무료로 가입할 수 있습니다.

### Step 1: GitHub 저장소 만들기

1. [github.com](https://github.com)에 로그인합니다
2. 우측 상단의 **+** 버튼을 클릭합니다
3. **New repository** (새 저장소)를 선택합니다
4. 저장소 정보를 입력합니다:

```
Repository name: my-first-site     ← 프로젝트 이름 (영어, 하이픈 사용)
Description: 나의 첫 배포 사이트      ← 설명 (선택사항)
Public: ● 선택                      ← 반드시 Public으로!
Add a README file: ☑ 체크           ← 체크 추천
```

5. **Create repository** 버튼을 클릭합니다

> **주의**: GitHub Pages는 **Public(공개) 저장소**에서만 무료로 사용할 수 있습니다. Private(비공개) 저장소는 유료 플랜(Pro)이 필요합니다.

### Step 2: 파일 업로드하기

저장소가 만들어지면 프로젝트 파일을 업로드합니다.

**방법 A: 웹에서 직접 업로드 (가장 쉬움)**

1. 저장소 페이지에서 **Add file** → **Upload files** 클릭
2. 프로젝트 파일들을 **드래그&드롭**으로 업로드
3. 하단의 **Commit changes** 버튼 클릭

**방법 B: Git 명령어로 업로드 (커서/Claude Code 사용자)**

```bash
# 1) 프로젝트 폴더에서 터미널 열기
cd my-project

# 2) Git 초기화
git init

# 3) GitHub 저장소 연결
git remote add origin https://github.com/내아이디/my-first-site.git

# 4) 파일 추가 및 커밋
git add .
git commit -m "첫 배포"

# 5) GitHub에 업로드
git push -u origin main
```

> **팁**: Git 명령어가 낯설다면 방법 A(웹 업로드)를 사용하세요. 결과는 똑같습니다!

### Step 3: GitHub Pages 활성화

파일 업로드가 완료되면 GitHub Pages를 켜야 합니다.

1. 저장소 페이지에서 **Settings** (설정) 탭 클릭
2. 왼쪽 메뉴에서 **Pages** 클릭
3. **Source** 항목에서 설정:

```
Source: Deploy from a branch
Branch: main          ← main 브랜치 선택
Folder: / (root)      ← 루트 폴더 선택
```

4. **Save** 버튼 클릭

### Step 4: 배포 확인

설정 저장 후 **1~2분** 정도 기다리면 배포가 완료됩니다.

```
배포 URL: https://내아이디.github.io/my-first-site/
```

1. Settings → Pages 화면 상단에 **초록색 박스**로 URL이 표시됩니다
2. 해당 URL을 클릭하면 내 사이트가 열립니다!
3. 이 URL을 다른 사람에게 공유하면 누구나 접속할 수 있습니다

> **확인**: URL을 클릭했을 때 내 사이트가 정상적으로 보이나요? 축하합니다! 첫 배포 성공입니다!

### GitHub Pages 배포 흐름 정리

```
GitHub 저장소 생성
    ↓
프로젝트 파일 업로드 (드래그&드롭 또는 git push)
    ↓
Settings → Pages → Source 설정
    ↓
1~2분 대기
    ↓
https://유저명.github.io/저장소명/  ← 배포 완료!
```

### 파일 수정하면 자동 반영되나요?

**네!** GitHub Pages는 main 브랜치에 변경사항이 푸시되면 **자동으로 재배포**됩니다.

- 웹에서 파일 수정: 파일 클릭 → 연필(Edit) 아이콘 → 수정 → Commit changes
- Git으로 수정: `git add . → git commit → git push`
- 반영까지 약 1~3분 소요

### GitHub Pages 제한사항

| 항목 | 제한 |
|------|------|
| 저장소 크기 | 1GB 이하 권장 |
| 월 트래픽 | 100GB |
| 파일 크기 | 개별 파일 100MB 이하 |
| 빌드 시간 | 10분 이내 |
| 서버 사이드 코드 | 지원하지 않음 (정적 파일만 가능) |

> **참고**: 일반적인 개인 프로젝트나 포트폴리오 사이트에는 이 제한이 전혀 문제가 되지 않습니다.

✅ **체크포인트**: GitHub Pages로 배포에 성공했다면, 다음 섹션의 Vercel 배포도 시도해보세요. 두 가지를 비교해보면 각각의 장점을 알 수 있습니다!

---

## 4. Vercel 배포

### Vercel이란?

**Vercel**(버셀)은 프론트엔드 프로젝트를 위한 **배포 + 호스팅 플랫폼**입니다. Next.js를 만든 회사이기도 하며, React, Vue, 정적 사이트 등 다양한 프로젝트를 쉽게 배포할 수 있습니다.

| 항목 | 내용 |
|------|------|
| **비용** | Hobby(개인) 무료, Pro $20/월 |
| **무료 범위** | 월 100GB 트래픽, 100개 배포/일 |
| **커스텀 도메인** | 지원 (무료 HTTPS) |
| **자동 배포** | GitHub 푸시 시 자동 반영 |
| **프리뷰 배포** | Pull Request마다 별도 URL 생성 |
| **환경변수** | 웹 UI에서 쉽게 설정 |
| **적합한 프로젝트** | React, Next.js, Vue, 정적 사이트 |

### Vercel의 장점 (GitHub Pages 대비)

| 기능 | GitHub Pages | Vercel |
|------|-------------|--------|
| 빌드 명령어 | 미지원 | 자동 감지 |
| 프리뷰 배포 | 없음 | PR마다 자동 생성 |
| 환경변수 | 수동 관리 | 웹 UI 제공 |
| 서버리스 함수 | 없음 | 지원 |
| 속도 | 좋음 | 매우 좋음 (Edge Network) |
| 분석 | 없음 | 기본 제공 |

### 사전 준비

- [ ] GitHub 계정이 있다
- [ ] 배포할 프로젝트가 GitHub 저장소에 올라가 있다
- [ ] (React/Next.js 프로젝트의 경우) `package.json` 파일이 있다

### Step 1: Vercel 가입하기

1. [vercel.com](https://vercel.com)에 접속합니다
2. 우측 상단의 **Sign Up** 클릭
3. **Continue with GitHub** 를 선택합니다 (가장 편리!)
4. GitHub 계정으로 로그인하면 **자동 연결** 완료

> **팁**: GitHub 계정으로 가입하면 저장소 연동이 자동으로 이루어져 훨씬 편리합니다.

**[화면 안내]** Vercel 가입 화면에서는 아래와 같은 옵션이 보입니다:
```
┌─────────────────────────┐
│     Welcome to Vercel   │
│                         │
│ [Continue with GitHub]  │  ← 이것을 클릭!
│ [Continue with GitLab]  │
│ [Continue with Email]   │
└─────────────────────────┘
```

### Step 2: 프로젝트 Import (가져오기)

1. Vercel 대시보드에서 **Add New...** → **Project** 클릭
2. **Import Git Repository** 화면에서 GitHub 저장소 목록이 나타납니다
3. 배포할 저장소 옆의 **Import** 버튼 클릭

**[화면 안내]** Import 화면 구성:
```
┌────────────────────────────────────────┐
│  Import Git Repository                 │
│                                        │
│  GitHub  GitLab  Bitbucket             │
│                                        │
│  ┌────────────────────────────────┐    │
│  │ my-first-site          [Import]│    │  ← 배포할 저장소의 Import 클릭
│  │ another-project        [Import]│    │
│  │ old-project            [Import]│    │
│  └────────────────────────────────┘    │
└────────────────────────────────────────┘
```

> **저장소가 안 보이나요?** → Import 화면 하단의 **Adjust GitHub App Permissions** 링크를 클릭하여 저장소 접근 권한을 추가해야 합니다.

### Step 3: 프로젝트 설정

Import 후 **Configure Project** 화면이 나타납니다.

**순수 HTML/CSS/JS 프로젝트인 경우:**

```
Project Name: my-first-site          ← 프로젝트 이름 (URL에 사용됨)
Framework Preset: Other              ← "Other" 선택
Root Directory: ./                   ← 기본값 유지
Build Command: (비워두기)             ← 빌드 명령 없음
Output Directory: ./                 ← 기본값 유지
```

**React(Vite) 프로젝트인 경우 (러버블 등):**

```
Project Name: my-react-app           ← 프로젝트 이름
Framework Preset: Vite               ← 자동 감지되는 경우가 많음
Root Directory: ./                   ← 기본값 유지
Build Command: npm run build         ← 자동 입력됨
Output Directory: dist               ← 자동 입력됨
```

**Next.js 프로젝트인 경우:**

```
Project Name: my-next-app            ← 프로젝트 이름
Framework Preset: Next.js            ← 자동 감지됨
Root Directory: ./                   ← 기본값 유지
Build Command: next build            ← 자동 입력됨
Output Directory: .next              ← 자동 입력됨
```

> **팁**: Vercel은 `package.json`을 분석하여 프레임워크를 **자동으로 감지**합니다. 대부분의 경우 기본값 그대로 배포하면 됩니다!

### Step 4: 환경변수 설정 (필요한 경우)

프로젝트에서 API 키나 비밀 설정값을 사용하는 경우 환경변수를 추가해야 합니다.

**환경변수 추가 방법:**

1. Configure Project 화면에서 **Environment Variables** 섹션을 펼칩니다
2. **Key**와 **Value**를 입력합니다

```
┌─────────────────────────────────────┐
│  Environment Variables              │
│                                     │
│  Key:   VITE_API_KEY                │
│  Value: sk-abc123...                │
│                                     │
│  [Add]                              │
│                                     │
│  ┌─────────────────────────────┐    │
│  │ VITE_API_KEY    ••••••      │    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

**자주 사용하는 환경변수 예시:**

| Key | 설명 | 사용 상황 |
|-----|------|----------|
| `VITE_API_KEY` | API 키 | Supabase, Firebase 등 연동 시 |
| `VITE_SUPABASE_URL` | Supabase URL | Supabase 사용 시 |
| `DATABASE_URL` | DB 연결 문자열 | 데이터베이스 사용 시 |

> **주의**: `.env` 파일에 있는 환경변수는 자동으로 적용되지 않습니다. Vercel 대시보드에서 **직접 추가**해야 합니다!

### Step 5: 배포하기

모든 설정이 완료되면 **Deploy** 버튼을 클릭합니다.

```
설정 완료
    ↓ [Deploy 버튼 클릭]
빌드 시작 (보통 30초~2분)
    ↓
빌드 로그가 실시간으로 표시됨
    ↓
✅ 배포 완료!
    ↓
https://my-first-site.vercel.app  ← 이 URL로 접속!
```

**[화면 안내]** 배포 완료 화면:
```
┌──────────────────────────────────────┐
│  Congratulations!                    │
│                                      │
│  Your project has been deployed.     │
│                                      │
│  ┌──────────────────────────┐        │
│  │   사이트 미리보기 이미지   │        │
│  └──────────────────────────┘        │
│                                      │
│  🔗 my-first-site.vercel.app        │
│                                      │
│  [Go to Dashboard]                   │
└──────────────────────────────────────┘
```

### 프리뷰 배포 (Preview Deployments)

Vercel의 강력한 기능 중 하나는 **프리뷰 배포**입니다.

- GitHub에서 **Pull Request**(PR)를 만들면 → 자동으로 **별도 URL**이 생성됩니다
- 이 URL로 변경사항을 **미리 확인**할 수 있습니다
- PR이 병합(Merge)되면 → **본 사이트(Production)**에 자동 반영됩니다

```
main 브랜치 → https://my-site.vercel.app  (본 사이트)
PR #1       → https://my-site-abc123.vercel.app  (프리뷰)
PR #2       → https://my-site-def456.vercel.app  (프리뷰)
```

> **팁**: 큰 변경을 할 때 PR을 만들어 프리뷰로 먼저 확인하면 실수를 방지할 수 있습니다.

### 자동 재배포

GitHub 저장소에 코드를 **push**하면 Vercel이 **자동으로 재배포**합니다.

```
코드 수정 → git push → Vercel이 감지 → 자동 빌드 → 자동 배포
                                      (보통 30초~1분)
```

별도로 배포 버튼을 누를 필요 없이, 코드만 올리면 자동으로 반영됩니다!

### 배포 후 대시보드 활용

Vercel 대시보드에서는 다양한 정보를 확인할 수 있습니다:

| 탭 | 내용 |
|---|------|
| **Deployments** | 배포 이력, 빌드 로그, 이전 버전 롤백 |
| **Analytics** | 방문자 수, 페이지뷰, 성능 지표 |
| **Settings** | 도메인 설정, 환경변수 관리, 빌드 설정 |
| **Logs** | 서버리스 함수 실행 로그 (사용 시) |

✅ **체크포인트**: Vercel 배포에 성공했나요? 배포된 URL을 스마트폰으로 접속해보세요!

---

## 5. Netlify 배포

### Netlify란?

**Netlify**(넷리파이)는 **정적 사이트 배포에 특화된 플랫폼**입니다. 특히 **드래그&드롭 배포** 기능 덕분에 가장 빠르고 쉽게 배포할 수 있습니다.

| 항목 | 내용 |
|------|------|
| **비용** | Starter 무료, Pro $19/월 |
| **무료 범위** | 월 100GB 트래픽, 300분 빌드/월 |
| **커스텀 도메인** | 지원 (무료 HTTPS) |
| **특별 기능** | 드래그&드롭 배포, Forms, Identity |
| **자동 배포** | GitHub 푸시 시 자동 반영 |
| **적합한 프로젝트** | HTML/CSS/JS, React, Vue, 정적 사이트 전반 |

### 배포 방법 2가지

Netlify는 2가지 배포 방법을 제공합니다:

| 방법 | 장점 | 단점 |
|------|------|------|
| **드래그&드롭** | 가장 빠름, Git 불필요 | 자동 재배포 없음 |
| **GitHub 연결** | 자동 재배포, 협업에 유리 | 초기 설정이 약간 더 필요 |

### 방법 A: 드래그&드롭 배포 (1분 만에 완료!)

Git이나 GitHub 없이 **폴더를 끌어다 놓기만 하면** 배포됩니다.

**Step 1:** [app.netlify.com](https://app.netlify.com)에 가입/로그인

**Step 2:** 대시보드에서 **Sites** 탭 클릭

**Step 3:** 화면 하단의 드래그&드롭 영역을 찾습니다

**[화면 안내]** Netlify 대시보드:
```
┌──────────────────────────────────────────┐
│  Sites                                    │
│                                           │
│  ┌─────────────────────────────────────┐  │
│  │                                     │  │
│  │  Want to deploy a new site without  │  │
│  │  connecting to Git?                 │  │
│  │                                     │  │
│  │  Drag and drop your site output     │  │
│  │  folder here                        │  │
│  │                                     │  │
│  │      [browse to upload]             │  │
│  │                                     │  │
│  └─────────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

**Step 4:** 프로젝트 폴더를 드래그&드롭!

- 순수 HTML 프로젝트: **프로젝트 폴더 전체**를 드래그
- React/Vite 프로젝트: **`dist` 폴더**를 드래그 (먼저 `npm run build` 실행 필요)

**Step 5:** 10~30초 후 배포 완료!

```
드래그&드롭
    ↓ [10~30초]
✅ 배포 완료!
    ↓
https://random-name-12345.netlify.app  ← 자동 생성된 URL
```

> **팁**: 자동 생성된 URL 이름이 마음에 들지 않으면 **Site settings → Change site name**에서 변경할 수 있습니다. 예: `https://my-cafe.netlify.app`

### 방법 B: GitHub 연결 배포

GitHub 저장소를 Netlify에 연결하면 코드 변경 시 **자동 재배포**됩니다.

**Step 1:** [app.netlify.com](https://app.netlify.com)에 로그인

**Step 2:** **Add new site** → **Import an existing project** 클릭

**Step 3:** **Connect to GitHub** 선택

**[화면 안내]** 연결 화면:
```
┌──────────────────────────────────────┐
│  Import an existing project          │
│                                      │
│  Connect to Git provider             │
│                                      │
│  [GitHub]    ← 클릭!                 │
│  [GitLab]                            │
│  [Bitbucket]                         │
│  [Azure DevOps]                      │
└──────────────────────────────────────┘
```

**Step 4:** 저장소 선택 후 빌드 설정

**순수 HTML 프로젝트:**

```
Branch to deploy: main
Build command: (비워두기)
Publish directory: .
```

**React(Vite) 프로젝트:**

```
Branch to deploy: main
Build command: npm run build
Publish directory: dist
```

**Step 5:** **Deploy site** 버튼 클릭

### 환경변수 설정

Netlify에서도 환경변수를 설정할 수 있습니다.

1. **Site settings** → **Environment variables** 이동
2. **Add a variable** 클릭
3. Key와 Value 입력 후 저장

```
Key:   VITE_API_KEY
Value: your-api-key-here
Scope: All scopes (기본값)
```

> **주의**: 환경변수를 추가하거나 변경한 후에는 **Deploys → Trigger deploy → Clear cache and deploy site**를 클릭하여 재배포해야 합니다.

### Netlify Forms (양식 기능)

Netlify의 독특한 기능 중 하나는 **서버 없이 폼 데이터를 수집**할 수 있다는 것입니다.

HTML 폼에 `netlify` 속성만 추가하면 됩니다:

```html
<!-- 일반 HTML 폼 -->
<form name="contact" method="POST" data-netlify="true">
  <input type="text" name="name" placeholder="이름">
  <input type="email" name="email" placeholder="이메일">
  <textarea name="message" placeholder="메시지"></textarea>
  <button type="submit">보내기</button>
</form>
```

폼이 제출되면 Netlify 대시보드의 **Forms** 탭에서 데이터를 확인할 수 있습니다. 별도의 백엔드 서버가 필요 없습니다!

| 무료 범위 | 제한 |
|----------|------|
| 폼 제출 | 월 100건 |
| 폼 알림 | 이메일/Slack/Webhook |

### 드래그&드롭 배포 vs GitHub 연결 비교

| 항목 | 드래그&드롭 | GitHub 연결 |
|------|-----------|------------|
| 배포 속도 | 매우 빠름 (10초) | 초기 설정 후 자동 |
| 자동 재배포 | 불가 (수동 재업로드) | 가능 (push 시 자동) |
| 롤백 | 불편 | 쉬움 (이전 배포로 복원) |
| 협업 | 어려움 | GitHub PR 활용 가능 |
| Git 필요? | 아니오 | 예 |
| 추천 상황 | 빠른 테스트, 1회성 배포 | 지속적 업데이트 프로젝트 |

✅ **체크포인트**: Netlify 드래그&드롭으로 가장 빠른 배포를 경험해보세요! 정말 1분이면 됩니다.

---

## 6. 도구별 배포 방법

바이브코딩 도구마다 배포 방식이 다릅니다. 내가 사용한 도구에 맞는 배포 방법을 확인하세요.

### 6-1. Lovable (러버블) — Publish 버튼 원클릭 배포

러버블은 **자체 배포 기능**이 내장되어 있어 가장 쉽게 배포할 수 있습니다.

**방법 1: Publish 버튼 (가장 쉬움)**

```
1. 러버블 에디터에서 프로젝트 열기
2. 상단의 [Share] 또는 [Publish] 버튼 클릭
3. "Publish to web" 선택
4. 자동으로 URL 생성!
   → https://프로젝트명.lovable.app
```

배포된 URL은 `프로젝트명.lovable.app` 형태입니다.

**방법 2: GitHub로 내보내기 → Vercel/Netlify 배포**

러버블 프로젝트를 GitHub 저장소로 내보내서 Vercel이나 Netlify로 배포할 수도 있습니다.

```
1. 러버블 에디터에서 프로젝트 열기
2. 상단 메뉴에서 [GitHub] 아이콘 클릭
3. "Connect to GitHub" 선택
4. 새 저장소 이름 입력
5. GitHub에 코드가 자동으로 업로드됨
6. Vercel 또는 Netlify에서 해당 저장소 Import
```

**Vercel에서 러버블 프로젝트 배포 시 설정:**

```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
```

> **팁**: 러버블 자체 배포(lovable.app)로도 충분하지만, 커스텀 도메인이나 더 많은 기능이 필요하면 Vercel/Netlify를 활용하세요.

**방법 비교:**

| 항목 | Publish 버튼 | GitHub → Vercel |
|------|-------------|-----------------|
| 난이도 | 매우 쉬움 (클릭 1번) | 보통 |
| URL | `*.lovable.app` | `*.vercel.app` |
| 커스텀 도메인 | 유료 플랜 필요 | 무료 |
| 자동 재배포 | 러버블에서 수정 시 자동 | GitHub push 시 자동 |
| 환경변수 | 러버블 설정에서 | Vercel 대시보드에서 |

### 6-2. Cursor (커서) — 수동 배포

커서는 코드 에디터이므로 **자체 배포 기능이 없습니다.** 별도의 배포 플랫폼을 사용해야 합니다.

**추천 배포 방법:**

| 프로젝트 유형 | 추천 플랫폼 | 배포 방법 |
|-------------|-----------|----------|
| 순수 HTML/CSS/JS | GitHub Pages | Settings → Pages |
| React / Vite | Vercel | GitHub Import |
| Next.js | Vercel | GitHub Import (최적) |
| Vue / Nuxt | Netlify 또는 Vercel | GitHub Import |

**커서에서 배포하는 전체 과정:**

```
Step 1: 커서에서 프로젝트 완성
    ↓
Step 2: 터미널에서 GitHub에 업로드
    $ git init
    $ git add .
    $ git commit -m "프로젝트 완성"
    $ git remote add origin https://github.com/내아이디/my-project.git
    $ git push -u origin main
    ↓
Step 3: Vercel/Netlify에서 GitHub 저장소 Import
    ↓
Step 4: 배포 완료!
```

**커서 터미널에서 바로 사용할 수 있는 명령어:**

```bash
# Vercel CLI로 한 줄 배포 (Vercel 계정 필요)
npx vercel

# Netlify CLI로 한 줄 배포 (Netlify 계정 필요)
npx netlify-cli deploy --prod
```

> **팁**: 커서의 터미널(Ctrl+\`)에서 바로 CLI 명령어를 실행할 수 있습니다.

### 6-3. Claude Code — CLI 배포

Claude Code는 터미널 기반이므로 **CLI(명령줄)를 활용한 배포**가 자연스럽습니다.

**방법 1: Vercel CLI**

```bash
# 1. Vercel CLI 설치 (최초 1회)
npm i -g vercel

# 2. 프로젝트 폴더에서 배포
cd my-project
vercel

# 3. 질문에 답하기
? Set up and deploy "~/my-project"? [Y/n]  → Y
? Which scope?  → 내 계정 선택
? Link to existing project?  → N (새 프로젝트)
? Project Name?  → my-project (기본값 Enter)
? In which directory is your code located?  → ./ (기본값 Enter)

# 4. 프로덕션 배포
vercel --prod
```

**방법 2: Netlify CLI**

```bash
# 1. Netlify CLI 설치 (최초 1회)
npm i -g netlify-cli

# 2. Netlify 로그인
netlify login

# 3. 프로젝트 초기화
cd my-project
netlify init

# 4. 배포 (드래프트)
netlify deploy

# 5. 프로덕션 배포
netlify deploy --prod
```

**방법 3: GitHub Pages (gh-pages 패키지)**

```bash
# 1. gh-pages 설치
npm install gh-pages --save-dev

# 2. package.json에 배포 스크립트 추가
# "scripts": { "deploy": "gh-pages -d dist" }

# 3. 빌드 후 배포
npm run build
npm run deploy
```

> **팁**: Claude Code의 AI가 배포 과정도 도와줄 수 있습니다. "이 프로젝트를 Vercel에 배포해줘"라고 요청해보세요.

### 6-4. ChatGPT — 코드 복사 후 수동 배포

ChatGPT로 만든 코드는 **복사-붙여넣기** 후 직접 배포해야 합니다.

**배포 과정:**

```
Step 1: ChatGPT에서 생성된 코드 복사
    ↓
Step 2: 로컬에 파일로 저장
    - index.html
    - style.css
    - script.js
    ↓
Step 3: 배포 플랫폼 선택
    방법 A: Netlify 드래그&드롭 (가장 빠름)
    방법 B: GitHub에 업로드 → GitHub Pages
    방법 C: GitHub에 업로드 → Vercel Import
```

**ChatGPT 코드를 파일로 저장하는 방법:**

1. ChatGPT가 생성한 HTML 코드를 복사합니다
2. 텍스트 에디터(메모장, VS Code 등)를 열고 붙여넣기합니다
3. `index.html`이라는 이름으로 저장합니다
4. CSS, JS가 별도 파일이면 같은 폴더에 저장합니다

> **주의**: ChatGPT는 하나의 완성된 프로젝트 폴더를 만들어주지 않으므로, 여러 파일을 직접 정리해야 합니다.

### 6-5. AI Studio — 공유 링크 활용

Google AI Studio에서 만든 프로젝트는 **공유 링크**로 바로 공개할 수 있습니다.

**방법 1: AI Studio 공유 링크**

```
1. AI Studio에서 프로젝트 열기
2. 우측 상단의 [Share] 버튼 클릭
3. "Get shareable link" 선택
4. 생성된 링크를 공유!
```

> **참고**: AI Studio 공유 링크는 Google 계정 로그인이 필요할 수 있습니다.

**방법 2: 코드 다운로드 → 별도 배포**

```
1. AI Studio에서 생성된 코드 확인
2. 파일로 다운로드 (또는 코드 복사)
3. Netlify 드래그&드롭 또는 GitHub Pages로 배포
```

### 도구별 배포 방법 요약표

| 도구 | 자체 배포 | 추천 외부 플랫폼 | 난이도 | 한 줄 요약 |
|------|----------|----------------|-------|-----------|
| **Lovable** | Publish 버튼 | Vercel | 매우 쉬움 | 버튼 하나로 끝 |
| **Cursor** | 없음 | Vercel / GitHub Pages | 보통 | GitHub 업로드 후 Import |
| **Claude Code** | 없음 | Vercel CLI | 보통 | CLI 한 줄로 배포 |
| **ChatGPT** | 없음 | Netlify 드래그&드롭 | 보통 | 코드 복사 → 파일 저장 → 드래그 |
| **AI Studio** | 공유 링크 | Netlify | 쉬움 | 공유 링크 또는 코드 내보내기 |

✅ **체크포인트**: 내가 사용한 도구의 배포 방법을 확인했나요? 해당 방법으로 배포를 진행해보세요!

---

## 7. 커스텀 도메인 연결하기

### 커스텀 도메인이란?

배포하면 자동으로 생성되는 URL(예: `my-site.vercel.app`)을 사용할 수도 있지만, **나만의 주소**(예: `www.my-cafe.com`)를 연결할 수도 있습니다.

| 구분 | 자동 생성 URL | 커스텀 도메인 |
|------|-------------|-------------|
| **예시** | `my-site.vercel.app` | `www.my-cafe.com` |
| **비용** | 무료 | 연 1~2만 원 |
| **전문성** | 학생/개인 프로젝트에 적합 | 비즈니스/공식 사이트에 적합 |
| **기억하기** | 약간 어려움 | 쉬움 |
| **신뢰도** | 보통 | 높음 |

> **참고**: 커스텀 도메인은 선택사항입니다. 개인 프로젝트나 학습 목적이라면 자동 생성 URL로도 충분합니다!

### Step 1: 도메인 구매

도메인을 구매할 수 있는 대표적인 사이트:

| 사이트 | 특징 | 가격대 (.com 기준) |
|--------|------|-------------------|
| **가비아** (gabia.com) | 한국 최대, 한국어 지원 | 연 1.5~2만 원 |
| **Namecheap** | 글로벌 인기, 영어 UI | 연 $9~13 (약 1.2만 원) |
| **Cloudflare** | 원가 판매, 추가 기능 | 연 $9~10 (약 1.2만 원) |
| **Google Domains** | 간편한 UI, 깔끔 | 연 $12 (약 1.6만 원) |

**도메인 선택 팁:**

```
추천 확장자:
  .com     → 가장 범용적 (비즈니스, 개인 모두)
  .kr      → 한국 사이트임을 나타냄
  .co.kr   → 한국 기업/기관
  .dev     → 개발자/기술 프로젝트
  .io      → 스타트업/테크 프로젝트
  .site    → 범용, 저렴

피해야 할 것:
  - 너무 긴 도메인 (15자 이상)
  - 하이픈(-)이 많은 도메인
  - 기존 유명 브랜드와 유사한 이름
```

### Step 2: DNS 설정

도메인을 구매한 후, 배포 플랫폼과 연결하려면 **DNS 설정**이 필요합니다.

**DNS란?** 도메인 이름(예: my-cafe.com)을 실제 서버 주소(IP)로 변환해주는 **전화번호부** 같은 시스템입니다.

| DNS 레코드 유형 | 용도 | 예시 |
|----------------|------|------|
| **A 레코드** | 도메인 → IP 주소 | `my-cafe.com → 76.76.21.21` |
| **CNAME** | 도메인 → 다른 도메인 | `www.my-cafe.com → cname.vercel-dns.com` |
| **TXT** | 도메인 소유 인증 | 소유권 확인용 텍스트 |

### 플랫폼별 DNS 설정 방법

**GitHub Pages + 커스텀 도메인:**

```
1. GitHub 저장소 → Settings → Pages → Custom domain
2. 도메인 입력: www.my-cafe.com
3. 도메인 구매 사이트(가비아 등)에서 DNS 설정:

   타입: CNAME
   호스트: www
   값: 내아이디.github.io

   타입: A
   호스트: @
   값: 185.199.108.153
        185.199.109.153
        185.199.110.153
        185.199.111.153

4. "Enforce HTTPS" 체크 (자동 SSL 인증서)
```

**Vercel + 커스텀 도메인:**

```
1. Vercel 대시보드 → 프로젝트 → Settings → Domains
2. 도메인 입력: my-cafe.com → Add
3. Vercel이 안내하는 DNS 레코드를 도메인 사이트에 추가:

   타입: A
   호스트: @
   값: 76.76.21.21

   타입: CNAME
   호스트: www
   값: cname.vercel-dns.com

4. 설정 후 수 분~24시간 내 적용 (보통 수 분)
```

**Netlify + 커스텀 도메인:**

```
1. Netlify → Site settings → Domain management → Add custom domain
2. 도메인 입력: my-cafe.com
3. Netlify가 안내하는 DNS 레코드를 추가:

   방법 A: Netlify DNS 사용 (추천, 가장 쉬움)
     - 도메인 네임서버를 Netlify로 변경

   방법 B: 외부 DNS 사용
     타입: A
     호스트: @
     값: 75.2.60.5

     타입: CNAME
     호스트: www
     값: [사이트이름].netlify.app

4. HTTPS는 자동으로 적용됨 (Let's Encrypt)
```

### HTTPS 자동 설정

세 플랫폼 모두 **무료 HTTPS(SSL 인증서)** 를 자동으로 제공합니다.

```
http://my-cafe.com   → 보안 없음 (안전하지 않음 경고)
https://my-cafe.com  → 보안 연결 (자물쇠 아이콘)
```

커스텀 도메인을 연결하면 HTTPS가 **자동으로 활성화**되므로 별도 설정이 필요 없습니다!

### 서브도메인 활용

하나의 도메인으로 여러 프로젝트를 운영할 수 있습니다:

```
my-domain.com         → 메인 사이트
blog.my-domain.com    → 블로그
shop.my-domain.com    → 쇼핑몰
docs.my-domain.com    → 문서 사이트
```

DNS에서 각 서브도메인을 다른 서버/프로젝트로 연결하면 됩니다.

> **팁**: 처음에는 커스텀 도메인 없이 무료 URL로 시작하고, 프로젝트가 성장하면 나중에 도메인을 구매하는 것도 좋은 전략입니다.

✅ **체크포인트**: 커스텀 도메인은 선택사항입니다. 지금 당장 필요하지 않다면 다음 섹션으로 넘어가세요!

---

## 8. 배포 후 확인하기

배포가 완료되었다면, 아래 항목들을 점검하여 사이트가 제대로 작동하는지 확인합니다.

### 8-1. 모바일 테스트

배포된 사이트를 **스마트폰**으로 접속해보세요. 방문자의 절반 이상이 모바일로 접속합니다.

**확인 항목:**

| 항목 | 확인 방법 |
|------|----------|
| 레이아웃이 깨지지 않는가? | 스마트폰으로 직접 접속 |
| 글자 크기가 읽기 편한가? | 확대 없이 읽을 수 있는지 확인 |
| 버튼/링크가 터치하기 쉬운가? | 손가락으로 쉽게 터치 가능한지 |
| 이미지가 잘리지 않는가? | 가로/세로 모드 모두 확인 |
| 메뉴가 정상 작동하는가? | 햄버거 메뉴 등 모바일 내비게이션 |

**PC에서 모바일 테스트하는 방법:**

1. Chrome 브라우저에서 배포된 사이트 열기
2. **F12** (또는 `Ctrl + Shift + I`) 눌러 개발자 도구 열기
3. **모바일 아이콘** (Toggle device toolbar) 클릭
4. 상단에서 기기 선택: iPhone SE, iPhone 14 Pro, Galaxy S20 등

```
┌──────────────────────────────────┐
│  Toggle device toolbar 아이콘     │
│  📱 ← 이것을 클릭!                │
│                                   │
│  ┌─────────────────┐             │
│  │  iPhone 14 Pro  │ ← 기기 선택  │
│  │  375 x 812      │             │
│  └─────────────────┘             │
│                                   │
│  ┌───────────┐                   │
│  │ 모바일     │                   │
│  │ 미리보기   │                   │
│  │ 화면      │                   │
│  └───────────┘                   │
└──────────────────────────────────┘
```

### 8-2. 속도 점검 (Lighthouse)

Google Chrome에 내장된 **Lighthouse**로 사이트 성능을 점검합니다.

**사용 방법:**

1. Chrome에서 배포된 사이트 열기
2. **F12** → **Lighthouse** 탭 클릭
3. **Analyze page load** 클릭
4. 약 30초~1분 대기

**점수 해석:**

| 점수 | 상태 | 의미 |
|------|------|------|
| 90~100 | 우수 | 매우 잘 만들어진 사이트 |
| 50~89 | 보통 | 개선의 여지가 있음 |
| 0~49 | 개선 필요 | 주요 문제 해결 필요 |

**주요 점검 항목:**

| 카테고리 | 설명 | 목표 |
|---------|------|------|
| **Performance** | 로딩 속도, 응답성 | 80점 이상 |
| **Accessibility** | 접근성 (스크린리더, 색상 대비) | 90점 이상 |
| **Best Practices** | 보안, 코드 품질 | 90점 이상 |
| **SEO** | 검색 엔진 최적화 | 90점 이상 |

**흔한 성능 개선 팁:**

```
1. 이미지 최적화
   - 큰 이미지는 압축 (tinypng.com 활용)
   - WebP 형식 사용 권장
   - width/height 속성 지정

2. 불필요한 코드 제거
   - 사용하지 않는 CSS/JS 삭제
   - 라이브러리 경량 버전 사용

3. 리소스 로딩 최적화
   - CSS는 <head>에, JS는 </body> 앞에
   - 중요하지 않은 JS는 defer 또는 async 속성 추가
```

### 8-3. OG 이미지 설정 (공유 미리보기)

SNS나 카카오톡으로 사이트 링크를 공유하면 **미리보기 카드**가 표시됩니다. 이 미리보기를 설정하는 것이 **OG(Open Graph) 태그**입니다.

**OG 태그 예시:**

```html
<head>
  <!-- 기본 메타 태그 -->
  <title>내 카페 사이트</title>
  <meta name="description" content="맛있는 커피와 디저트를 만나보세요">

  <!-- OG 태그 (SNS 공유 미리보기) -->
  <meta property="og:title" content="내 카페 사이트">
  <meta property="og:description" content="맛있는 커피와 디저트를 만나보세요">
  <meta property="og:image" content="https://my-site.com/og-image.png">
  <meta property="og:url" content="https://my-site.com">
  <meta property="og:type" content="website">

  <!-- 트위터 카드 -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="내 카페 사이트">
  <meta name="twitter:description" content="맛있는 커피와 디저트를 만나보세요">
  <meta name="twitter:image" content="https://my-site.com/og-image.png">
</head>
```

**OG 이미지 권장 사양:**

| 항목 | 권장값 |
|------|--------|
| 크기 | 1200 x 630 픽셀 |
| 형식 | PNG 또는 JPG |
| 파일 크기 | 1MB 이하 |
| 위치 | 사이트 루트 또는 `/images/` 폴더 |

**OG 태그 테스트 도구:**

| 도구 | URL | 용도 |
|------|-----|------|
| **카카오 OG 디버거** | developers.kakao.com/tool/debugger/sharing | 카카오톡 미리보기 확인 |
| **Facebook Debugger** | developers.facebook.com/tools/debug | 페이스북 미리보기 확인 |
| **Twitter Card Validator** | cards-dev.twitter.com/validator | 트위터 미리보기 확인 |
| **metatags.io** | metatags.io | 여러 플랫폼 한 번에 확인 |

> **팁**: OG 이미지를 만들기 어렵다면, [Canva](https://www.canva.com)에서 "Social Media" 템플릿(1200x630)을 활용해보세요.

### 8-4. SEO 기초 (검색 엔진 최적화)

배포된 사이트가 구글, 네이버 등 검색 엔진에서 잘 검색되도록 하려면 **SEO 기초 설정**이 필요합니다.

**필수 메타 태그:**

```html
<head>
  <!-- 1. 페이지 제목 (검색 결과에 표시) -->
  <title>내 카페 소개 | 서울 강남 수제 커피</title>

  <!-- 2. 페이지 설명 (검색 결과 미리보기) -->
  <meta name="description" content="서울 강남에 위치한 수제 커피 전문점.
    직접 로스팅한 원두로 만든 스페셜티 커피를 즐겨보세요.">

  <!-- 3. 뷰포트 (모바일 반응형 필수) -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- 4. 문자 인코딩 -->
  <meta charset="UTF-8">

  <!-- 5. 언어 설정 -->
  <html lang="ko">
</head>
```

**SEO 체크리스트:**

- [ ] `<title>` 태그에 핵심 키워드 포함 (30~60자)
- [ ] `<meta name="description">` 작성 (70~160자)
- [ ] 모든 이미지에 `alt` 속성 추가
- [ ] 제목 태그(`<h1>`, `<h2>`)를 구조적으로 사용
- [ ] 모바일 반응형 지원 (`<meta name="viewport">`)
- [ ] HTTPS 사용 (배포 플랫폼이 자동 제공)
- [ ] 페이지 로딩 속도 3초 이내
- [ ] `robots.txt` 파일 추가 (선택)
- [ ] `sitemap.xml` 파일 추가 (선택)

**간단한 robots.txt:**

```
User-agent: *
Allow: /
Sitemap: https://my-site.com/sitemap.xml
```

### 8-5. 공유 미리보기 확인

카카오톡이나 SNS에 링크를 공유했을 때 미리보기가 제대로 표시되는지 확인합니다.

**카카오톡 미리보기 초기화 방법:**

카카오톡은 한 번 공유한 링크의 OG 정보를 **캐시**합니다. OG 태그를 수정한 후에는 캐시를 초기화해야 합니다.

```
1. 카카오 개발자 도구 접속: developers.kakao.com/tool/debugger/sharing
2. URL 입력
3. [디버그] 클릭
4. [캐시 초기화] 클릭
5. 카카오톡에서 다시 링크 공유하여 확인
```

✅ **체크포인트**: 아래 항목을 모두 확인했나요?

- [ ] 모바일에서 사이트가 잘 보인다
- [ ] Lighthouse 점수가 80점 이상이다
- [ ] OG 태그를 설정했다
- [ ] SEO 기본 메타 태그를 추가했다
- [ ] 카카오톡 공유 미리보기가 정상이다

---

## 9. 트러블슈팅 & FAQ

### 자주 발생하는 문제 6가지

#### 문제 1: 빌드 실패 (Build Failed)

**증상:** Vercel이나 Netlify에서 "Build Error" 또는 "Build Failed" 메시지가 표시됨

**원인과 해결:**

| 원인 | 해결 방법 |
|------|----------|
| `package.json`이 없음 | 프로젝트 루트에 `package.json`이 있는지 확인 |
| 의존성 설치 실패 | `npm install`을 로컬에서 먼저 실행하여 문제 확인 |
| Node.js 버전 불일치 | Vercel/Netlify 설정에서 Node 버전 지정 (18.x 이상 권장) |
| 빌드 명령어 오류 | `npm run build`가 로컬에서 정상 작동하는지 확인 |
| 타입스크립트 오류 | 빌드 로그에서 에러 메시지를 확인하고 코드 수정 |

**빌드 로그 확인 방법:**

```
Vercel:  대시보드 → Deployments → 실패한 배포 클릭 → Build Logs
Netlify: 대시보드 → Deploys → 실패한 배포 클릭 → Deploy log
```

**빌드 로그에서 자주 보이는 에러와 의미:**

```
Error: Cannot find module 'react'
→ react가 설치되지 않음. package.json의 dependencies에 있는지 확인

Error: Module not found: Can't resolve './components/Header'
→ 파일 경로 또는 파일 이름이 잘못됨. 대소문자도 확인!

Type error: Property 'x' does not exist on type 'y'
→ TypeScript 타입 오류. 코드에서 타입을 수정해야 함

FATAL ERROR: CALL_AND_RETRY_LAST Allocation failed
→ 빌드에 메모리가 부족. 프로젝트 최적화 필요
```

#### 문제 2: 404 에러 (페이지를 찾을 수 없음)

**증상:** 배포는 성공했지만 접속 시 "404 Not Found" 페이지가 표시됨

**원인과 해결:**

| 원인 | 해결 방법 |
|------|----------|
| `index.html`이 없음 | 프로젝트 루트에 `index.html` 파일이 있는지 확인 |
| 출력 폴더 설정 오류 | Vercel: Output Directory를 `dist` 또는 `build`로 설정 |
| 라우팅 문제 (SPA) | 새로고침 시 404 → 아래 "SPA 라우팅 해결" 참고 |
| 파일명 대소문자 | Linux 서버는 대소문자를 구분! `About.html` ≠ `about.html` |
| GitHub Pages 경로 | `username.github.io/repo/`로 접속해야 함 (`/repo/` 빠뜨리지 않기) |

**SPA(Single Page Application) 라우팅 해결:**

React/Vue 같은 SPA에서 새로고침 시 404가 발생하면:

**Vercel:** `vercel.json` 파일 추가
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

**Netlify:** `public/_redirects` 파일 추가
```
/*    /index.html   200
```

**GitHub Pages:** `404.html` 파일을 `index.html`과 동일하게 만들기

#### 문제 3: 환경변수 누락

**증상:** 로컬에서는 잘 되는데, 배포 후 API 연동이 안 됨

**원인:** `.env` 파일의 환경변수가 배포 플랫폼에 설정되지 않았기 때문

**해결:**

```
1. 로컬 .env 파일의 변수 목록 확인
2. 배포 플랫폼 대시보드에서 동일한 환경변수 추가:

   Vercel:   Settings → Environment Variables → Add
   Netlify:  Site settings → Environment variables → Add a variable

3. 환경변수 추가 후 재배포
4. React/Vite 프로젝트: 변수 이름이 VITE_ 로 시작하는지 확인!
```

> **중요**: React(Vite) 프로젝트에서 클라이언트(브라우저)에서 사용하는 환경변수는 반드시 `VITE_` 접두사가 필요합니다.
>
> `VITE_API_KEY=abc123`  (올바름)
> `API_KEY=abc123`       (클라이언트에서 접근 불가!)

#### 문제 4: 이미지가 안 보임

**증상:** 로컬에서는 이미지가 잘 보이는데, 배포 후 깨진 이미지 아이콘이 표시됨

**원인과 해결:**

| 원인 | 해결 방법 |
|------|----------|
| 절대 경로 사용 | `C:\Users\...\image.png` → `/images/image.png` (상대 경로로 변경) |
| 파일명 대소문자 | `Photo.jpg` ≠ `photo.jpg` (Linux 서버는 대소문자 구분) |
| 파일 미포함 | 이미지 파일이 GitHub에 업로드되었는지 확인 |
| 경로 구분자 | `\`(역슬래시) → `/`(슬래시)로 변경 |
| 파일 크기 초과 | GitHub: 100MB 제한. 큰 파일은 압축 필요 |

**이미지 경로 올바른 사용법:**

```html
<!-- 잘못된 예시 -->
<img src="C:\Users\user\Desktop\image.png">     ← 로컬 경로 사용 불가!
<img src="image.PNG">                            ← 대소문자 주의!

<!-- 올바른 예시 -->
<img src="/images/image.png">                    ← 루트 상대 경로
<img src="./images/image.png">                   ← 현재 폴더 상대 경로
<img src="https://my-site.com/images/image.png"> ← 절대 URL
```

#### 문제 5: CORS 에러

**증상:** 브라우저 콘솔에 "Access to fetch at '...' has been blocked by CORS policy" 에러

**원인:** 다른 도메인의 API를 호출할 때 서버에서 CORS 허용을 설정하지 않은 경우

**해결:**

```
1. API 서버에서 CORS 허용 설정 (서버 코드 수정)
2. Vercel/Netlify의 프록시 기능 활용:

   Vercel (vercel.json):
   {
     "rewrites": [
       { "source": "/api/:path*", "destination": "https://api.example.com/:path*" }
     ]
   }

   Netlify (_redirects):
   /api/*  https://api.example.com/:splat  200

3. 개발용 임시 해결: 브라우저 CORS 확장 프로그램 (배포 시에는 사용 불가!)
```

> **참고**: CORS는 보안을 위한 브라우저 정책입니다. 자신의 API 서버라면 서버에서 CORS 헤더를 추가해야 합니다. 타사 API라면 프록시를 설정해야 합니다.

#### 문제 6: 느린 로딩 속도

**증상:** 사이트 접속 시 로딩이 오래 걸림 (3초 이상)

**해결 체크리스트:**

```
□ 이미지 최적화
  - 큰 이미지를 압축 (tinypng.com)
  - 적절한 크기로 리사이즈 (가로 1920px 이하)
  - WebP 형식 사용 고려
  - loading="lazy" 속성 추가 (하단 이미지)

□ 코드 최적화
  - 사용하지 않는 라이브러리 제거
  - CSS/JS 파일 압축 (minify) — 빌드 시 자동
  - 코드 스플리팅 적용 (React의 lazy import)

□ 폰트 최적화
  - 웹폰트는 2~3종만 사용
  - font-display: swap 속성 추가
  - 한국어 폰트는 서브셋 사용

□ 외부 리소스
  - CDN에서 로드하는 라이브러리 수 줄이기
  - 불필요한 외부 스크립트 제거
  - 비동기 로딩(async/defer) 적용
```

### 자주 묻는 질문 (FAQ) 8가지

#### Q1: 배포한 사이트를 삭제할 수 있나요?

**A:** 네, 각 플랫폼에서 프로젝트/사이트를 삭제할 수 있습니다.

```
GitHub Pages: Settings → Pages → Source를 "None"으로 변경
              또는 저장소 자체 삭제 (Settings → Delete this repository)

Vercel:       대시보드 → 프로젝트 → Settings → Advanced → Delete Project

Netlify:      대시보드 → 사이트 → Site settings → Danger zone → Delete this site
```

#### Q2: 무료 배포의 제한은 어떤 건가요?

| 플랫폼 | 무료 제한 | 유료 전환 시점 |
|--------|---------|-------------|
| **GitHub Pages** | Public 저장소만, 월 100GB 트래픽 | Private 저장소 배포 필요 시 |
| **Vercel** | 월 100GB 트래픽, 100배포/일, 개인만 | 팀 사용, 상업 프로젝트 |
| **Netlify** | 월 100GB 트래픽, 300분 빌드/월 | 트래픽 초과, 팀 사용 |

> **팁**: 개인 프로젝트나 포트폴리오 수준에서는 무료 플랜으로 충분합니다. 유료로 전환할 필요가 생길 때는 이미 상당한 트래픽이 발생하는 상황이므로, 걱정하지 않아도 됩니다.

#### Q3: 배포 후 코드를 수정하면 어떻게 되나요?

**A:** GitHub에 연결된 경우, 코드를 push하면 **자동으로 재배포**됩니다.

```
코드 수정 → git add → git commit → git push
                                        ↓
                              배포 플랫폼이 감지
                                        ↓
                              자동 빌드 + 배포
                              (보통 1~3분 소요)
```

Netlify 드래그&드롭 배포의 경우, 수정된 폴더를 다시 드래그&드롭해야 합니다.

#### Q4: 배포한 사이트에 비밀번호를 걸 수 있나요?

**A:** 네, 몇 가지 방법이 있습니다.

| 방법 | 난이도 | 설명 |
|------|-------|------|
| Netlify 비밀번호 보호 | 쉬움 | Site settings → Access control → Password protection (유료) |
| Vercel 비밀번호 보호 | 쉬움 | Settings → Deployment Protection (Pro 플랜) |
| JavaScript 간단 보호 | 보통 | 클라이언트 측 비밀번호 확인 (보안 수준 낮음) |
| 인증 시스템 구현 | 어려움 | Supabase Auth, Firebase Auth 등 활용 |

#### Q5: 여러 페이지 사이트도 배포할 수 있나요?

**A:** 네, 프로젝트 폴더에 여러 HTML 파일을 만들면 각각 별도 URL로 접근 가능합니다.

```
my-project/
├── index.html          → https://my-site.com/
├── about.html          → https://my-site.com/about.html
├── contact.html        → https://my-site.com/contact.html
└── products/
    └── index.html      → https://my-site.com/products/
```

React/Vue 같은 SPA는 하나의 `index.html`에서 **라우터**가 페이지를 전환합니다.

#### Q6: 데이터베이스를 사용하는 사이트도 배포할 수 있나요?

**A:** 정적 호스팅(GitHub Pages, Vercel, Netlify)에서는 **직접적인 데이터베이스 연결**은 불가능하지만, **클라우드 데이터베이스 서비스**와 연동하면 가능합니다.

| 서비스 | 무료 범위 | 난이도 |
|--------|---------|-------|
| **Supabase** | 2개 프로젝트, 500MB | 보통 |
| **Firebase** | 1GB 저장, 50K 읽기/일 | 보통 |
| **PlanetScale** | 5GB, 1B 읽기/월 | 약간 어려움 |

> **팁**: 러버블로 만든 프로젝트 중 Supabase를 사용하는 경우, Vercel/Netlify 배포 시 Supabase 관련 환경변수만 추가하면 됩니다.

#### Q7: 배포한 사이트의 URL을 변경할 수 있나요?

**A:** 네, 방법이 있습니다.

```
GitHub Pages: 저장소 이름 변경 → URL도 자동 변경
Vercel:       Settings → Domains → 기존 도메인 변경 또는 새 도메인 추가
Netlify:      Site settings → Change site name → 새 이름 입력
```

> **주의**: URL을 변경하면 기존 URL로는 접속할 수 없게 됩니다. 이미 공유한 링크가 있다면 주의하세요.

#### Q8: 배포를 이전 버전으로 되돌릴 수 있나요?

**A:** Vercel과 Netlify는 **롤백(Rollback)** 기능을 제공합니다.

```
Vercel:
  1. 대시보드 → Deployments
  2. 이전 배포 중 원하는 버전 찾기
  3. 우측 메뉴(⋮) → Promote to Production

Netlify:
  1. 대시보드 → Deploys
  2. 이전 배포 중 원하는 버전 찾기
  3. "Publish deploy" 클릭

GitHub Pages:
  git revert 또는 git reset으로 이전 커밋으로 되돌리기
```

> **팁**: Vercel과 Netlify는 **모든 배포 이력**을 보관하므로, 언제든지 이전 버전으로 돌아갈 수 있습니다. 실수를 해도 걱정 마세요!

✅ **체크포인트**: 배포 중 문제가 발생했다면 위 트러블슈팅을 참고하여 해결해보세요. 대부분의 문제는 위 6가지 중 하나에 해당합니다!

---

## 10. 다음 단계

### 축하합니다! 첫 배포를 완료했습니다!

여러분이 이 교안을 통해 배운 것들을 정리해봅시다:

```
✅ 배포의 개념 이해 (호스팅, 도메인, 서버)
✅ 3가지 배포 플랫폼 비교 (GitHub Pages, Vercel, Netlify)
✅ 실제 배포 실습 완료
✅ 도구별 배포 방법 파악
✅ 배포 후 점검 방법 (모바일, 속도, OG, SEO)
✅ 트러블슈팅 능력 확보
```

### 중급편에서 다루는 내용

배포 기초를 마스터했다면, 다음 단계로 나아가보세요:

| 주제 | 설명 |
|------|------|
| **CI/CD 파이프라인** | GitHub Actions로 자동 테스트 + 배포 |
| **모니터링** | 사이트 가동시간 모니터링, 에러 추적 (Sentry) |
| **성능 최적화** | CDN 설정, 캐싱 전략, 이미지 최적화 고급편 |
| **도메인 관리 고급** | 멀티 도메인, 리다이렉트, 도메인별 환경 분리 |
| **배포 전략** | Blue-Green 배포, Canary 배포, Feature Flag |
| **서버리스 함수** | Vercel/Netlify의 서버리스 API 활용 |
| **보안 강화** | CSP 헤더, 환경변수 관리, 접근 제어 |

### 추천 학습 경로

```
지금 여기!
    ↓
배포 초보편 (이 교안) ✅
    ↓
바이브코딩 도구별 교안 심화 (러버블 중급, 커서 중급 등)
    ↓
배포 중급편 (CI/CD, 모니터링, 최적화)
    ↓
풀스택 프로젝트 (프론트엔드 + 백엔드 + DB + 배포)
```

- [배포 중급자편](deployment-intermediate.html) — CI/CD 파이프라인, 모니터링, 성능 최적화
- [배포 개발자편](deployment-developer.html) — Docker, 클라우드 플랫폼, IaC, 쿠버네티스
- [도구 비교](compare.html) — 바이브코딩 도구별 심화 비교

### 배포 관련 추가 학습 리소스

| 리소스 | 설명 | 링크 |
|--------|------|------|
| Vercel 공식 문서 | 배포, 도메인, 환경변수 등 상세 가이드 | [vercel.com/docs](https://vercel.com/docs) |
| Netlify 공식 문서 | 배포, Forms, 빌드 설정 가이드 | [docs.netlify.com](https://docs.netlify.com) |
| GitHub Pages 가이드 | 공식 사용 가이드 | [pages.github.com](https://pages.github.com) |
| web.dev | Google의 웹 성능/SEO 가이드 | [web.dev](https://web.dev) |

### 마무리

배포는 프로젝트의 **마침표**가 아니라 **시작점**입니다.

배포를 완료하면:
- 다른 사람에게 피드백을 받을 수 있습니다
- 포트폴리오로 활용할 수 있습니다
- 실사용자의 반응을 확인하며 개선할 수 있습니다
- 나만의 인터넷 공간을 갖게 됩니다

> **응원**: 첫 배포를 완료한 순간, 여러분은 이미 "웹 개발자"입니다. 코드를 만들고, 배포하고, 세상에 공개한 경험은 아무도 빼앗을 수 없습니다. 다음 프로젝트가 기대되지 않나요? 계속 도전해보세요!

---

## 부록: 배포 플랫폼 전체 비교표

| 항목 | GitHub Pages | Vercel | Netlify |
|------|-------------|--------|---------|
| **비용** | 무료 | Hobby 무료 | Starter 무료 |
| **빌드 지원** | Jekyll만 | 다양한 프레임워크 | 다양한 프레임워크 |
| **자동 배포** | push 시 자동 | push 시 자동 | push 시 자동 |
| **프리뷰 배포** | 없음 | PR마다 생성 | PR마다 생성 |
| **환경변수** | 없음 | 웹 UI | 웹 UI |
| **서버리스 함수** | 없음 | 지원 | 지원 |
| **양식(Forms)** | 없음 | 없음 | 기본 제공 |
| **커스텀 도메인** | 지원 | 지원 | 지원 |
| **HTTPS** | 자동 | 자동 | 자동 |
| **CDN** | GitHub CDN | Edge Network | Cloudflare CDN |
| **롤백** | Git 사용 | 원클릭 | 원클릭 |
| **분석** | 없음 | 기본 제공 | 유료 플러그인 |
| **최적 용도** | 간단한 정적 사이트 | React/Next.js | 정적 사이트 + Forms |

---

## 부록: 용어 사전

| 용어 | 영어 | 설명 |
|------|------|------|
| 배포 | Deploy | 프로젝트를 서버에 올려 공개하는 과정 |
| 호스팅 | Hosting | 웹사이트 파일을 저장하는 서버 임대 서비스 |
| 도메인 | Domain | 인터넷 주소 (예: google.com) |
| DNS | Domain Name System | 도메인을 IP 주소로 변환하는 시스템 |
| SSL/HTTPS | Secure Socket Layer | 암호화된 안전한 통신 프로토콜 |
| CDN | Content Delivery Network | 전 세계에 분산된 콘텐츠 전송 네트워크 |
| 빌드 | Build | 소스 코드를 배포 가능한 형태로 변환하는 과정 |
| CI/CD | Continuous Integration/Deployment | 지속적 통합/배포 자동화 |
| SPA | Single Page Application | 하나의 HTML 파일로 동작하는 웹 앱 |
| 프리뷰 | Preview | 본 사이트 반영 전 미리 확인하는 배포 |
| 롤백 | Rollback | 이전 버전으로 되돌리는 작업 |
| 환경변수 | Environment Variable | 배포 환경별로 다르게 설정하는 값 (API 키 등) |
| 정적 사이트 | Static Site | 미리 만들어진 HTML 파일을 제공하는 사이트 |
| 서버리스 | Serverless | 서버를 직접 관리하지 않고 필요시만 실행 |
| OG 태그 | Open Graph Tag | SNS 공유 미리보기를 설정하는 메타 태그 |
| SEO | Search Engine Optimization | 검색 엔진에서 잘 검색되도록 최적화 |
| CORS | Cross-Origin Resource Sharing | 다른 도메인 간 리소스 공유 보안 정책 |
| A 레코드 | A Record | 도메인을 IP 주소로 연결하는 DNS 레코드 |
| CNAME | Canonical Name | 도메인을 다른 도메인으로 연결하는 DNS 레코드 |
| 서브도메인 | Subdomain | 주 도메인 앞에 붙는 하위 도메인 (예: blog.site.com) |
| 프록시 | Proxy | 클라이언트와 서버 사이의 중개 서버 |

---

## 부록: 배포 체크리스트 (인쇄용)

배포 전후로 아래 체크리스트를 활용하세요:

### 배포 전 체크

- [ ] `index.html` 파일이 프로젝트 루트에 있다
- [ ] 모든 파일 경로가 상대 경로로 되어 있다 (로컬 절대 경로 사용 금지)
- [ ] 파일명에 한글이나 공백이 없다 (영어, 하이픈, 언더스코어 사용)
- [ ] `.env` 파일이 `.gitignore`에 포함되어 있다
- [ ] API 키나 비밀번호가 코드에 하드코딩되어 있지 않다
- [ ] 로컬에서 `npm run build`가 에러 없이 완료된다 (빌드 프로젝트인 경우)
- [ ] 필요한 모든 파일이 GitHub에 업로드되어 있다

### 배포 후 체크

- [ ] 배포 URL로 접속하면 사이트가 정상 표시된다
- [ ] 모든 페이지의 링크가 작동한다
- [ ] 이미지가 모두 정상 표시된다
- [ ] 모바일에서 레이아웃이 깨지지 않는다
- [ ] HTTPS가 적용되어 있다 (주소창에 자물쇠 아이콘)
- [ ] OG 태그를 설정했다 (카카오톡 공유 시 미리보기 확인)
- [ ] SEO 메타 태그를 추가했다 (title, description)
- [ ] Lighthouse 성능 점수가 80점 이상이다
- [ ] 콘솔(F12)에 심각한 에러가 없다
- [ ] 배포 URL을 기록/북마크해두었다

---

## 출처 및 참고 자료

| 출처 | 설명 |
|------|------|
| [Vercel 공식 문서](https://vercel.com/docs) | Vercel 배포, 설정, 도메인 가이드 |
| [Netlify 공식 문서](https://docs.netlify.com) | Netlify 배포, Forms, 환경변수 가이드 |
| [GitHub Pages 공식 가이드](https://pages.github.com) | GitHub Pages 시작 가이드 |
| [web.dev](https://web.dev) | Google 웹 성능 및 SEO 가이드 |
| [MDN Web Docs](https://developer.mozilla.org) | 웹 기술 레퍼런스 |
| 러버블 바이브코딩 카톡방 (2026.3.8) | 실사용자 경험 및 팁 |
