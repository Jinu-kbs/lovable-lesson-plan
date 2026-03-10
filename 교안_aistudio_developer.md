# AI Studio 교안 — 개발자편

> **대상**: 코딩 경험자, AI Studio 빌드를 개발 워크플로우에 통합하려는 개발자
> **목표**: AI Studio의 기술 아키텍처를 이해하고, Gemini API와 연동하여 프로덕션 프로젝트로 확장하기
> **소요 시간**: 약 4~5시간

---

## 어떤 교안을 봐야 할까요? (자가 진단)

이 교안은 **코딩 경험이 있는 개발자**를 위한 것입니다. AI Studio 빌드를 빠른 프로토타이핑 도구로 활용하고, Gemini API를 프로덕션 프로젝트에 직접 연동하려는 분에게 적합합니다.

| 항목 | 초보자편 | **개발자편 (현재)** |
|------|---------|-------------------|
| 코딩 경험 | 없음 | **있음 (JavaScript/Python)** |
| API 사용 경험 | 없음 | **REST API 호출 가능** |
| Git/GitHub | 모름 | **브랜치·배포 가능** |
| 학습 목표 | 바이브코딩 체험 | **Gemini API 연동·프로덕션 확장** |
| 소요 시간 | 2~3시간 | **4~5시간** |

> API 호출, 터미널, 패키지 매니저 경험이 없다면 **[초보자편](aistudio-beginner.html)**을 먼저 보세요.

### 추천 리소스

| 리소스 | 설명 | 링크 |
|--------|------|------|
| AI Studio 공식 사이트 | Google AI Studio 빌드 모드 | [aistudio.google.com](https://aistudio.google.com) |
| Google AI 개발자 문서 | Gemini API 공식 레퍼런스 | [ai.google.dev](https://ai.google.dev) |
| Firebase 문서 | 호스팅, Auth, Firestore 가이드 | [firebase.google.com/docs](https://firebase.google.com/docs) |
| 기획 도우미 Gem | PRD/IA/ERD 작성 도우미 (peace 제작/공유) | [Gem 바로가기](https://gemini.google.com/gem/1yC701ZmuJgy_D4hkyNz0t50EqAnBj3kh) |

---

## 목차

1. [기술 아키텍처](#1-기술-아키텍처)
2. [사전 준비](#2-사전-준비)
3. [기획 문서 체계](#3-기획-문서-체계)
4. [빌드 전략](#4-빌드-전략)
5. [코드 커스터마이징](#5-코드-커스터마이징)
6. [Gemini API 연동](#6-gemini-api-연동)
7. [외부 서비스 연동](#7-외부-서비스-연동)
8. [배포 및 운영](#8-배포-및-운영)
9. [마이그레이션](#9-마이그레이션)
10. [디버깅 가이드](#10-디버깅-가이드)
11. [다음 단계](#11-다음-단계)

---

## 1. 기술 아키텍처

### AI Studio Build 내부 구조

AI Studio Build는 Google AI Studio의 Build 탭에서 제공하는 웹 기반 코드 생성 파이프라인입니다. Gemini 2.5 Pro 모델이 프롬프트를 분석하여 HTML/CSS/JavaScript 코드를 생성합니다.

| 계층 | 설명 |
|------|------|
| **UI Layer** | 웹 브라우저 기반 에디터 + 프리뷰 패널 + 채팅 인터페이스 |
| **AI Layer** | Gemini 2.5 Pro — 프롬프트 해석 및 코드 생성 |
| **Build Pipeline** | 프롬프트 → 코드 생성 → 실시간 프리뷰 렌더링 |
| **Export Layer** | 코드 복사, 공유 링크 생성, Deploy |
| **API Layer** | Gemini API — 외부에서 직접 호출 가능 (REST/SDK) |

### 생성 코드 구조

AI Studio Build는 단일 HTML 파일 기반 코드를 생성합니다:

- **단일 파일 구조**: HTML, CSS, JS가 하나의 파일에 인라인 포함
- **CDN 의존성**: 외부 라이브러리는 CDN 링크로 참조
- **프레임워크 없음**: 바닐라 HTML/CSS/JS 기반 (요청 시 프레임워크 포함 가능)
- **반응형 기본 적용**: 모바일 대응 미디어 쿼리 포함

### 5대 도구 포지셔닝 비교

| 항목 | AI Studio | Lovable | AntiGravity | Cursor | Claude Code |
|------|-----------|---------|-------------|--------|-------------|
| **유형** | 웹 프로토타입 빌더 | 풀스택 웹앱 빌더 | 에이전트 IDE | AI 코드 에디터 | CLI 도구 |
| **AI 모델** | Gemini 2.5 Pro | Claude | Gemini | 멀티 모델 | Claude |
| **코드 접근** | 복사/다운로드 | GitHub 연동 | 로컬 파일시스템 | 로컬 파일시스템 | 로컬 파일시스템 |
| **DB 지원** | 미지원 | Supabase 연동 | 자유 선택 | 자유 선택 | 자유 선택 |
| **비용** | 무료 | 유료 (이벤트 무료) | 무료 (프리뷰) | $20/월~ | 종량제 |
| **최적 용도** | 아이디어 검증 | SaaS 웹앱 | 멀티 에이전트 | 정밀 코드 제어 | 개발 자동화 |

### 언제 AI Studio를 선택할까?

| 상황 | 추천 도구 | 이유 |
|------|----------|------|
| 아이디어를 5분 만에 시각화 | **AI Studio** | 설치 없이 즉시 시작, 무료 |
| 풀스택 웹앱 제작 | **Lovable** | DB, 인증, 배포 통합 |
| 코드 수준 정밀 제어 | **Cursor** | 파일시스템 직접 접근 |
| 대규모 코드베이스 자동화 | **Claude Code** | CLI 기반 자율 실행 |

---

## 2. 사전 준비

### 개발 환경 요구사항

| 항목 | 필수/권장 | 설명 |
|------|----------|------|
| **Google 계정** | 필수 | AI Studio 접속 및 API 키 발급 |
| **Google Cloud 프로젝트** | 권장 | API 키 관리, 할당량 모니터링 |
| **Node.js 18+** | 권장 | 생성 코드 로컬 실행, npm 패키지 |
| **Python 3.10+** | 선택 | Gemini Python SDK 사용 시 |
| **Git** | 권장 | 버전 관리 및 배포 |

### Gemini API 키 발급

1. [aistudio.google.com](https://aistudio.google.com) 접속 → 좌측 메뉴 **Get API key** 클릭
2. 프로젝트 선택 또는 새 프로젝트 생성
3. 생성된 API 키를 안전하게 보관

또는 [console.cloud.google.com](https://console.cloud.google.com)에서 "Generative Language API" 활성화 후 **사용자 인증 정보 → API 키 만들기**로 발급합니다.

> API 키는 절대 코드에 하드코딩하지 마세요. `.env` 파일에 저장하고 `.gitignore`에 추가하세요.

### 개발 환경 체크리스트

- [ ] Google 계정 및 AI Studio 접속 확인
- [ ] Gemini API 키 발급 완료
- [ ] Node.js 18+ / Git 설치 확인
- [ ] 코드 에디터(VS Code 또는 Cursor) 준비
- [ ] API 키를 `.env` 파일에 저장, `.gitignore`에 `.env` 추가

---

## 3. 기획 문서 체계

### PRD.md 템플릿

```markdown
# PRD — [프로젝트명]

## 개요
- 목적: [프로젝트 목표]
- 대상 사용자: [타겟 유저]
- 기술 제약: AI Studio 빌드 (단일 HTML, 프론트엔드 전용)

## 기능 우선순위
| 우선순위 | 기능 | 설명 |
|---------|------|------|
| **P0** (필수) | [핵심 기능] | [설명] |
| **P1** (중요) | [부가 기능] | [설명] |
| **P2** (희망) | [추가 기능] | [설명] |

## 기술 제약
- 프론트엔드 전용 (서버 사이드 코드 불가)
- localStorage 기반 데이터 저장
- CDN 기반 외부 라이브러리
```

### IA.md 템플릿

```markdown
# IA — [프로젝트명] 정보 구조

## 페이지 구조
- / (메인)
  ├── 헤더 (네비게이션)
  ├── 주요 콘텐츠 섹션
  └── 푸터

## 컴포넌트 구조 (Gemini API 연동 시)
├── src/
│   ├── components/    ← UI 컴포넌트
│   ├── services/      ← API 호출 로직
│   └── utils/         ← 유틸리티 함수
```

### Gemini를 활용한 기획 문서 생성

```
아래 조건으로 PRD.md, IA.md를 작성해줘:
- 이름: 학급 시간표 관리 앱
- 기술: AI Studio 빌드 → Firebase 배포 예정
- 핵심 기능: 시간표 CRUD, 과목별 색상, 반응형
- P0/P1/P2 우선순위로 기능 분류해줘
```

> 기획 도우미 Gem ([바로가기](https://gemini.google.com/gem/1yC701ZmuJgy_D4hkyNz0t50EqAnBj3kh))을 사용하면 PRD/IA/ERD 작성이 더 수월합니다. — peace 제작/공유

---

## 4. 빌드 전략

### 전략 1: Rapid Prototype (AI Studio 단독)

AI Studio Build만으로 MVP를 빠르게 만드는 방식입니다:

```
학급 시간표 관리 웹앱을 만들어줘.
- 시간표 표(월~금, 1~6교시) 편집 가능
- 과목별 색상 구분, localStorage로 데이터 저장
- 바닐라 HTML/CSS/JavaScript, 단일 파일
- 깔끔한 카드 레이아웃, 파스텔톤, 반응형
```

**장점**: 5분 이내 프로토타입, 설치 불필요, 무료
**단점**: 단일 파일 제한, DB 미지원

### 전략 2: Hybrid (AI Studio + 수동 편집)

AI Studio에서 기본 구조 생성 → 로컬에서 코드 직접 수정:

1. **AI Studio**: 초기 프로토타입 생성 (UI/레이아웃)
2. **코드 내보내기**: 로컬 프로젝트로 복사
3. **에디터 편집**: 코드 구조 분리, 리팩토링
4. **API 추가**: Gemini API 연동 코드 작성

### 전략 3: API-First (Gemini API + 커스텀 프론트엔드)

AI Studio Build 미사용. Gemini API를 직접 호출하여 자체 앱에 통합:

1. React/Vue 등 프레임워크로 UI 구축
2. 백엔드에서 Gemini API 직접 호출
3. 프롬프트 엔지니어링 + 응답 파싱 + 후처리

### 전략 비교표

| 항목 | Rapid Prototype | Hybrid | API-First |
|------|----------------|--------|-----------|
| **속도** | 5분 | 1~2시간 | 반나절~ |
| **유연성** | 낮음 | 중간 | 높음 |
| **코드 품질** | AI 생성 그대로 | 수동 개선 | 완전 제어 |
| **DB 연동** | 불가 | 가능 (수동) | 가능 |
| **적합한 상황** | 아이디어 검증 | MVP | 프로덕션 서비스 |

---

## 5. 코드 커스터마이징

### 코드 분리 (파일 구조화)

AI Studio에서 내보낸 단일 HTML을 프로젝트 구조로 분리합니다:

```bash
mkdir my-project && cd my-project
# index.html → HTML 마크업만 유지
# style.css  ← <style> 태그 내용 이동
# app.js     ← <script> 태그 내용 이동
# index.html에 <link rel="stylesheet" href="style.css"> 및
# <script src="app.js"></script> 추가
```

### npm 의존성 추가

```bash
npm init -y
npm install chart.js        # 차트 라이브러리
npm install marked           # Markdown 파서
npm install dompurify        # XSS 방지
```

### 환경 변수 설정

```bash
# .env 파일
GEMINI_API_KEY=your_api_key_here

# .gitignore에 추가
echo ".env" >> .gitignore
```

> 프론트엔드 전용 프로젝트에서 API 키는 클라이언트에 노출됩니다. 프로덕션에서는 서버 사이드 프록시를 사용하세요.

### CSS 변수 기반 테마 관리

```css
:root {
  --primary: #4CAF50;
  --primary-light: #A5D6A7;
  --bg-color: #f5f5f5;
  --card-bg: #ffffff;
  --border-radius: 8px;
}
/* AI 생성 코드의 하드코딩 값을 변수로 교체 */
.card { background: var(--card-bg); border-radius: var(--border-radius); }
```

---

## 6. Gemini API 연동

### API 개요

| 항목 | 설명 |
|------|------|
| **엔드포인트** | `https://generativelanguage.googleapis.com/v1beta/` |
| **인증** | API 키 (쿼리 파라미터 또는 헤더) |
| **모델** | `gemini-2.5-pro`, `gemini-2.5-flash` 등 |
| **입력** | 텍스트, 이미지, 오디오, 비디오 (멀티모달) |
| **무료 한도** | 일일 요청 수 제한 (모델별 상이) |

### REST API 직접 호출

```bash
curl -X POST \
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"contents": [{"parts": [{"text": "한국어로 인사말 생성해줘"}]}]}'
```

### JavaScript SDK

```javascript
// npm install @google/generative-ai
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateContent(prompt) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const result = await model.generateContent(prompt);
  return result.response.text();
}
```

### Python SDK

```python
# pip install google-generativeai
import google.generativeai as genai
import os

genai.configure(api_key=os.environ["GEMINI_API_KEY"])
model = genai.GenerativeModel("gemini-2.5-flash")
response = model.generate_content("서울 관광 명소 3곳 추천해줘")
print(response.text)
```

### 스트리밍 응답

```javascript
async function streamResponse(prompt, onChunk) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const result = await model.generateContentStream(prompt);
  for await (const chunk of result.stream) {
    onChunk(chunk.text());  // UI에 실시간 반영
  }
}
```

### 프롬프트 엔지니어링 (API 레벨)

```javascript
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  systemInstruction: `초등학교 교사를 위한 수업 설계 도우미.
    한국어 응답. JSON 형식 출력.`,
});

const result = await model.generateContent(`
  과학 5학년 태양계 2차시 수업 계획서 작성.
  출력: { "title": "", "objectives": [], "activities": [{"time": "", "activity": ""}] }
`);
const plan = JSON.parse(result.response.text());
```

### 멀티모달 (이미지 입력)

```javascript
import fs from "fs";

const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
const imageData = fs.readFileSync("photo.jpg").toString("base64");

const result = await model.generateContent([
  { text: "이 이미지를 분석하고 설명해줘" },
  { inlineData: { mimeType: "image/jpeg", data: imageData } },
]);
```

---

## 7. 외부 서비스 연동

### Firebase 연동

| Firebase 서비스 | 용도 | AI Studio 프로젝트 적용 |
|----------------|------|----------------------|
| **Firebase Auth** | 사용자 인증 | 로그인/회원가입 추가 |
| **Cloud Firestore** | NoSQL DB | localStorage 대체 |
| **Firebase Hosting** | 정적 배포 | 프로덕션 배포 |
| **Cloud Storage** | 파일 저장 | 이미지/파일 업로드 |

```javascript
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";

const app = initializeApp({ apiKey: "...", projectId: "..." });
const db = getFirestore(app);

// CRUD 예시
await addDoc(collection(db, "items"), { title: "새 항목", done: false });
const snapshot = await getDocs(collection(db, "items"));
const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
```

### Cloud Functions (Gemini API 프록시)

API 키를 서버에서 안전하게 관리하는 서버리스 프록시:

```javascript
// functions/index.js
const functions = require("firebase-functions");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(functions.config().gemini.api_key);

exports.generateContent = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError("unauthenticated", "인증 필요");
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const result = await model.generateContent(data.prompt);
  return { text: result.response.text() };
});
```

### 환경 변수 관리

| 환경 | 관리 방법 | 위치 |
|------|----------|------|
| **로컬 개발** | `.env` 파일 | 프로젝트 루트 |
| **Firebase** | `functions.config()` | Firebase CLI |
| **Vercel** | 환경 변수 UI | Dashboard |
| **GitHub Pages** | Secrets | Repository Settings |

---

## 8. 배포 및 운영

### 배포 플랫폼 비교

| 플랫폼 | 적합한 프로젝트 | 장점 | 비용 |
|--------|---------------|------|------|
| **Firebase Hosting** | 정적 사이트 + Firebase | Google 생태계 통합 | 무료 (Spark) |
| **Vercel** | Next.js, 정적 사이트 | 자동 배포, 프리뷰 | Hobby 무료 |
| **GitHub Pages** | 정적 HTML | GitHub 통합, 무료 | 무료 |
| **Netlify** | Jamstack | 간편 설정 | Starter 무료 |

### Firebase Hosting 배포

```bash
npm install -g firebase-tools
firebase login
firebase init hosting        # Public directory: public
cp index.html style.css app.js public/
firebase deploy --only hosting
# → https://your-project.web.app
```

### Vercel / GitHub Pages 배포

```bash
# Vercel
npm install -g vercel && vercel --prod

# GitHub Pages
git init && git add . && git commit -m "초기 배포"
git remote add origin https://github.com/user/repo.git && git push -u origin main
# Settings → Pages → Branch: main → Save
# → https://user.github.io/repo/
```

### 커스텀 도메인

각 플랫폼의 설정 UI에서 도메인을 추가하고, DNS에서 CNAME 레코드를 설정합니다.

### 모니터링

| 도구 | 용도 | 연동 방법 |
|------|------|----------|
| **Google Analytics** | 트래픽 분석 | gtag.js 스크립트 삽입 |
| **Sentry** | 에러 추적 | `@sentry/browser` SDK |
| **Uptime Robot** | 가동 모니터링 | URL 등록 (무료) |

---

## 9. 마이그레이션

### AI Studio → Lovable (풀스택 SaaS가 필요할 때)

| 단계 | 작업 | 비고 |
|------|------|------|
| 1 | AI Studio 생성 코드 복사 | 전체 HTML |
| 2 | Lovable에서 새 프로젝트 생성 | "기존 코드 기반으로" 프롬프트 |
| 3 | Supabase DB, 인증 연동 | Lovable 내장 기능 |
| 4 | 원클릭 배포 | 커스텀 도메인 설정 |

**전환 시점**: 사용자 인증, 데이터베이스, 결제 기능이 필요할 때

### AI Studio → Cursor (코드 수준 제어가 필요할 때)

| 단계 | 작업 | 비고 |
|------|------|------|
| 1 | 코드 로컬 저장 | `index.html` 파일 |
| 2 | Cursor에서 프로젝트 열기 | 코드 자동 인덱싱 |
| 3 | 코드 분리 (HTML/CSS/JS) | Agent에게 요청 가능 |
| 4 | `.cursor/rules/` 추가 | 프로젝트 컨벤션 설정 |
| 5 | 프레임워크 전환 (필요 시) | React/Vue 등 |

**전환 시점**: 파일 구조 분리, 프레임워크 도입, 복잡한 상태 관리가 필요할 때

### AI Studio → AntiGravity (멀티 에이전트가 필요할 때)

| 단계 | 작업 | 비고 |
|------|------|------|
| 1 | 프로토타입으로 컨셉 확인 | 화면 캡처/기획서 |
| 2 | AntiGravity에서 새 프로젝트 생성 | 기획서를 Agent에 전달 |
| 3 | 멀티 에이전트로 앱 구축 | Plan → Build → Test |

**전환 시점**: 모바일 앱, 멀티 에이전트 자율 개발이 필요할 때

### 마이그레이션 체크리스트

- [ ] 원본 코드 백업 완료
- [ ] 기획 문서(PRD/IA) 이전
- [ ] 의존성 설치 및 빌드 확인
- [ ] 환경 변수(.env) 재설정
- [ ] Git 저장소 연결 및 초기 커밋
- [ ] 배포 환경 설정 완료

---

## 10. 디버깅 가이드

### AI Studio Build 생성 오류

| 증상 | 원인 | 해결 방법 |
|------|------|----------|
| 코드 생성 멈춤 | 프롬프트가 너무 복잡 | 기능을 쪼개서 단계별 요청 |
| 레이아웃 깨짐 | CSS 충돌/누락 | "CSS를 점검하고 수정해줘" 재요청 |
| JS 동작 안함 | 이벤트 리스너 누락 | F12 콘솔에서 에러 확인 |
| 이전 수정 사라짐 | Context Window 초과 | 새 대화에서 현재 코드 붙여넣기 |

### Gemini API 오류

| 에러 코드 | 원인 | 해결 방법 |
|----------|------|----------|
| `400` | 잘못된 요청 형식 | JSON 구조 확인 |
| `401` | API 키 오류 | 키 유효성 확인, 재발급 |
| `403` | API 미활성화 | Cloud Console에서 API 활성화 |
| `429` | Rate Limit 초과 | 지수 백오프 적용 (아래 참조) |
| `500` | 서버 일시 오류 | 최대 3회 재시도 |

### Rate Limit 대응 패턴

```javascript
async function callWithRetry(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try { return await fn(); }
    catch (e) {
      if (e.status === 429 && i < maxRetries - 1) {
        await new Promise(r => setTimeout(r, Math.pow(2, i) * 1000));
      } else throw e;
    }
  }
}
```

### 내보내기/배포 문제

| 문제 | 해결 방법 |
|------|----------|
| 로컬에서 동작 안함 | 인터넷 연결 확인 (CDN 의존성) |
| 스타일 차이 | CSS Reset/Normalize 추가 |
| 이미지 로드 실패 | 절대 경로 사용 또는 로컬 저장 |
| Firebase `No site found` | `firebase init hosting` 재실행 |
| GitHub Pages 404 | `index.html`이 루트에 있는지 확인 |

---

## 11. 다음 단계

AI Studio 개발자편을 마치셨습니다. 다음 단계를 선택하세요:

| 방향 | 설명 | 추천 |
|------|------|------|
| **Gemini API 프로덕션** | Rate limit 관리, 비용 최적화 | 고급 |
| **Firebase 풀스택** | Auth + Firestore + Hosting 통합 | 실무 |
| **[Lovable 개발자편](lovable-developer.html)** | SaaS 빌더, Supabase 연동 | 추천 |
| **[Cursor 개발자편](cursor-developer.html)** | .cursor/rules, Agent 활용 | 추천 |
| **[Claude Code 개발자편](claude-code-developer.html)** | CLI 자동화, CLAUDE.md 활용 | 고급 |

### 학습 방향 매트릭스

| 현재 수준 | 다음 목표 | 추천 학습 |
|----------|----------|----------|
| AI Studio 단독 사용 | 프로덕션 배포 | Firebase Hosting + Gemini API |
| 프로토타입 위주 | 풀스택 웹앱 | Lovable 또는 Cursor로 마이그레이션 |
| Gemini API 기초 | API 프로덕션 | Cloud Functions + Rate Limit 관리 |
| 개인 프로젝트 | 팀 프로젝트 | GitHub 협업 + CI/CD 파이프라인 |

---

## 전체 흐름 요약

```
기획 (PRD.md / IA.md + 기획 도우미 Gem)
  ↓
빌드 (AI Studio Build → 프로토타입 / Gemini API → 커스텀 앱)
  ↓
커스터마이징 (코드 분리 + npm 의존성 + 환경 변수)
  ↓
연동 (Firebase Auth + Firestore + Cloud Functions)
  ↓
배포 (Firebase Hosting / Vercel / GitHub Pages)
  ↓
운영 (모니터링 + API 비용 관리 + 마이그레이션 판단)
```

---

## 출처

| 출처 | 설명 |
|------|------|
| **Google AI Studio** | [aistudio.google.com](https://aistudio.google.com) — AI Studio 공식 사이트 |
| **Google AI 개발자 문서** | [ai.google.dev](https://ai.google.dev) — Gemini API 공식 레퍼런스 |
| **Firebase 공식 문서** | [firebase.google.com/docs](https://firebase.google.com/docs) — Firebase 서비스 가이드 |
| **기획 도우미 Gem** | [Gem 바로가기](https://gemini.google.com/gem/1yC701ZmuJgy_D4hkyNz0t50EqAnBj3kh) — PRD/IA/ERD 작성 도우미 (peace 제작/공유) |

---

*본 교안은 2026년 3월 바이브코딩 가이드 프로젝트의 일부로 작성되었습니다. AI Studio는 가장 빠른 프로토타이핑 도구이며, Gemini API를 통해 프로덕션으로 확장할 수 있습니다.*
