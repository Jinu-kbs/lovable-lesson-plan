# 웹·앱 개발 기초 — 중급자편

**대상**: 웹의 큰 그림(요청-응답·HTML/CSS/JS)을 한 번 본 분 · 바이브코딩 결과물이 "왜 그렇게 움직이는지" 알고 싶은 분
**목표**: 동적 상호작용의 메커니즘(DOM·이벤트·상태·비동기·API)을 설명하고, "왜 안 되는지"를 스스로 짚는다
**소요 시간**: 약 3~4시간
**최종 검증일**: 2026-06-26

> 근거: research/21_webapp-foundations.md (3장 동적 상호작용 · 4장 백엔드/데이터 · §6.2 중급자편 구성안). 권위 출처는 MDN·freeCodeCamp·The Odin Project 공개 문서.

---

## 핵심 메시지

바이브코딩 도구는 "타이핑"을 대신해 줄 뿐, "생각"을 대신해 주지는 않는다. 초보자편이 "웹이 어떻게 말을 주고받는가"의 큰 그림이었다면, 중급자편은 **화면이 어떻게 살아 움직이는가** — 즉 클릭 한 번이 어떻게 화면을 바꾸고, 데이터가 어떻게 서버를 오가는지 — 의 메커니즘이다. 이 메커니즘을 알면 "왜 화면이 안 바뀌지?", "왜 데이터가 잠깐 비었다가 채워지지?" 같은 막연한 공포가 구체적 질문으로 바뀐다.

---

## 도구가 대신 해주는 것 vs 내가 알아야 하는 것

| 도구가 대신 해주는 것 (타이핑) | 내가 알아야 하는 것 (생각) |
|------|------|
| DOM을 직접 찾고 조작하는 코드 작성 | 화면 = DOM이라는 등식, "무엇이 바뀌어야 하는가" |
| `addEventListener` 연결, 핸들러 골격 | 어떤 이벤트에 무슨 일이 일어나야 하는가 |
| 상태 변경 시 화면 자동 재렌더 | "지금 앱이 무엇을 기억해야 하는가"(상태 설계) |
| `fetch`·`async/await` 문법, 에러 처리 골격 | 어떤 API에 무엇을 요청하고 응답을 어떻게 쓸지 |
| 로딩 스피너·반응형 레이아웃 자동 생성 | 로딩/실패/빈 상태를 "보여줄지 말지" 판단 |
| 미디어 쿼리·`alt` 속성 자동 삽입 | 모든 기기·모든 사용자에게 작동하는지 점검 |

핵심: 도구가 만든 결과를 **검증하고, 막혔을 때 원인을 짚으려면** 오른쪽 열이 머릿속에 있어야 한다.

---

## 1. DOM — 살아 있는 화면

### 1.1 HTML 파일 vs DOM

브라우저는 HTML 텍스트를 읽어 **DOM(Document Object Model)** 이라는 나무 구조(tree)의 객체로 메모리에 올린다.

```
document
└── html
    ├── head
    └── body
        └── article
            ├── h1  ("제목입니다")
            ├── p
            └── button
```

핵심 등식: **HTML 파일은 "설계도"이고, DOM은 브라우저 메모리 속에서 살아 움직이는 "실제 건물"이다.** JavaScript가 화면을 바꾸는 일은 사실상 HTML 파일이 아니라 이 DOM 트리를 조작하는 것이다.

### 1.2 "내가 보는 화면 = DOM"

이 등식 하나가 동적 웹의 90%를 이해하게 만든다. 버튼을 눌렀더니 글자가 바뀌는 모든 상호작용은 "JS가 DOM의 어떤 노드를 찾아 내용/스타일을 바꿨다"로 설명된다.

> 브라우저 개발자도구(F12)의 Elements 탭이 바로 이 DOM을 실시간으로 보여 준다. HTML 원본과 달리, JS가 바꾼 결과까지 반영된 "현재의 화면"이다.

> **스크린샷**: 개발자도구(F12) → Elements 탭에서 DOM 트리가 펼쳐진 화면. 버튼을 누르면 특정 노드의 텍스트가 실시간으로 바뀌는 모습.

> **✓ 체크포인트** F12로 Elements 탭을 열고, 페이지의 버튼/메뉴를 눌렀을 때 트리의 어떤 부분이 하이라이트되며 바뀌는지 한 곳이라도 짚을 수 있으면 OK.

---

## 2. 이벤트와 상태

### 2.1 이벤트 — "사용자가 무언가 했다"

사용자의 행동(클릭, 입력, 스크롤, 키 누름)을 브라우저는 **이벤트**로 만들어 알려 준다. JS는 "이 이벤트가 일어나면 이 함수를 실행해"라고 **이벤트 리스너(listener)** 를 걸어 둔다.

```javascript
const button = document.querySelector('button');
button.addEventListener('click', () => {
  alert('버튼이 눌렸습니다!');
});
```

이 "이벤트 → 핸들러(처리 함수)" 패턴이 모든 상호작용의 기본 골격이다. 폼 제출, 좋아요 버튼, 메뉴 토글 전부 이 구조다.

### 2.2 상태 — "지금 앱이 기억하고 있는 것"

**상태(State)** 는 앱이 현재 기억하고 있는 데이터다. "로그인됨/안 됨", "장바구니에 든 상품 3개", "다크모드 켜짐". 동적 앱의 동작은 이렇게 요약된다:

```
이벤트 발생 → 상태 변경 → 화면(DOM)을 새 상태에 맞춰 다시 그림
```

예: "장바구니 담기"(이벤트) → 장바구니 개수 +1(상태 변경) → 우상단 숫자 갱신(DOM 갱신).

React 같은 프레임워크와 바이브코딩 도구가 자동화해 주는 것이 바로 "상태가 바뀌면 화면을 알아서 다시 그리는" 이 루프다.

> **디버깅 직관**: "왜 화면이 새 데이터로 안 바뀌지?"는 거의 항상 둘 중 하나다 — (1) 상태가 안 바뀌었거나, (2) 바뀐 상태로 화면을 다시 안 그렸거나. 이 두 가지로 좁히는 것만으로 원인 추적이 절반으로 준다.

> **✓ 체크포인트** 자기가 쓰는 앱에서 "이벤트 → 상태 변경 → 화면 갱신" 사례를 하나 찾아 세 단계로 말로 설명할 수 있으면 OK. (예: 좋아요 클릭 → 좋아요 수 +1 → 하트 색·숫자 갱신)

---

## 3. 비동기와 fetch

### 3.1 비동기 — "기다리는 동안 멈추지 않기"

서버에서 데이터를 받아오는 일은 시간이 걸린다(네트워크 왕복). 이때 프로그램이 멈춰 버리면 화면이 얼어붙는다. **비동기(Asynchronous) 프로그래밍**은 오래 걸리는 작업을 시작해 놓고, 끝나길 기다리는 대신 다른 일에 계속 응답할 수 있게 하는 기법이다.

이를 표현하는 도구가 **프라미스(Promise)** 다. 프라미스는 비동기 작업의 최종 완료(또는 실패)를 나타내는 객체다 — "지금은 결과가 없지만, 나중에 성공하면 이걸, 실패하면 저걸 해 줘"라는 약속.

```javascript
fetch('/api/data')                     // 1. 요청을 보낸다 (Promise 반환)
  .then(response => response.json())   // 2. 응답이 오면 JSON으로 해석
  .then(data => console.log(data))     // 3. 데이터를 사용
  .catch(error => console.error(error)); // 4. 실패하면 에러 처리
```

요즘은 더 읽기 쉬운 `async/await` 문법을 쓴다:

```javascript
async function loadData() {
  try {
    const response = await fetch('/api/data');  // 응답을 기다림
    const data = await response.json();          // 해석을 기다림
    console.log(data);
  } catch (error) {
    console.error('실패:', error);
  }
}
```

> **로딩의 정체**: "로딩 스피너가 도는 동안 다른 버튼은 눌리는" 경험이 바로 비동기다. "왜 데이터가 잠깐 비어 보였다가 채워지는지"도 비동기로 설명된다 — 화면을 먼저 그리고, 데이터가 도착하면 그때 채운다.

### 3.2 fetch — 브라우저의 표준 통신 창구

**Fetch API**는 HTTP 요청을 보내고 응답을 처리하는 JavaScript 인터페이스다. 프라미스 기반이며 현대 웹의 표준 통신 방식이다.

---

## 4. API와 JSON

### 4.1 API — 프로그램끼리 대화하는 약속

**API(Application Programming Interface)** 는 한 프로그램이 다른 프로그램에게 "이런 요청을 이렇게 보내면, 이런 형식으로 답해 줄게"라고 정해 둔 약속·창구다. 웹에서는 보통 HTTP 요청-응답으로 구현된다. 예: 날씨 API에 도시 이름을 보내면 기온을 돌려준다.

### 4.2 JSON — 프로그램끼리 주고받는 표준 텍스트

**JSON(JavaScript Object Notation)** 은 프로그램끼리 데이터를 주고받을 때 쓰는 표준 텍스트 형식이다. 사람도 읽을 수 있고 기계도 파싱하기 쉽다.

```json
{
  "name": "김선생",
  "level": "intermediate",
  "courses": ["lovable", "cursor"],
  "active": true
}
```

`fetch`로 받은 응답을 `.json()` 메서드로 JS 객체로 바꾼다. `json()` 역시 비동기다.

### 4.3 fetch 7단계 사이클 — 현대 웹 앱 상호작용의 표준

전체 그림을 한 번에 묶으면 1~4장이 하나의 흐름으로 꿰어진다:

```
① 사용자가 버튼 클릭 (이벤트)
   ↓
② JS가 fetch로 서버에 GET 요청 (비동기 시작)
   ↓  ← 이 사이 화면은 안 멈춤 (로딩 표시)
③ 서버가 JSON 응답 (200 OK)
   ↓
④ .json()으로 JS 객체로 변환
   ↓
⑤ 상태 변경
   ↓
⑥ DOM 갱신
   ↓
⑦ 사용자에게 결과 표시
```

이 7단계가 현대 웹 앱 상호작용의 표준 사이클이다. 막혔을 때 "몇 번 단계에서 멈췄는가"로 진단하면 원인이 빨리 좁혀진다.

> **상태 코드로 1차 진단**: 응답이 `4xx`로 시작하면 내(요청)가 잘못한 것(주소 오타·로그인 안 됨·권한 없음), `5xx`로 시작하면 서버 쪽 문제다. 개발자도구 Network 탭에서 이 숫자만 읽어도 ③ 단계의 실패를 즉시 가른다.

> **✓ 체크포인트** 개발자도구 Network 탭을 열고 페이지를 새로고침해, 요청 하나를 골라 상태 코드(200/404 등)와 응답 형식(JSON 여부)을 확인할 수 있으면 OK.

---

## 5. 반응형·접근성 기초

### 5.1 반응형 웹 — 모든 기기에서 작동

**반응형 웹(Responsive Web Design)** 은 화면 크기(PC·태블릿·모바일)에 맞춰 레이아웃이 자동으로 바뀌는 설계다. 미디어 쿼리(media query)와 유연한 단위(`%`, `rem`, `fr`)를 쓴다. freeCodeCamp의 첫 자격증 이름이 "Responsive Web Design"일 만큼 기본기로 취급된다.

### 5.2 접근성(a11y) — 모든 사용자에게 작동

**접근성(Accessibility, a11y)** 은 장애가 있는 사용자, 키보드만 쓰는 사용자, 느린 네트워크 사용자도 쓸 수 있게 만드는 것이다. 기본 요소:

- 시맨틱 HTML (`<button>`, `<nav>`, `<main>` 등 의미 있는 태그)
- 이미지 대체텍스트(`alt`)
- 충분한 색 대비
- 키보드 포커스(Tab으로 조작 가능)

법적 요구사항이기도 하다.

> **바이브코딩 연결**: 도구가 만든 화면을 휴대폰 크기로 줄여 보고(반응형 점검), 키보드 Tab으로만 조작해 보는(접근성 점검) 습관은 코드를 한 줄도 안 짜도 품질을 올린다.

---

## 6. 실습 — 동적 상호작용 + 외부 API 연동 (따라하기)

목표: 빈 페이지에 (A) JS로 동적 상호작용을 추가하고, (B) 외부 API에서 데이터를 받아 화면에 표시한다. 바이브코딩 도구에 시키더라도, 결과물이 아래 흐름대로 움직이는지 검증할 수 있어야 한다.

### 6.1 실습 A — 클릭 카운터 (이벤트 → 상태 → DOM)

가장 작은 "이벤트 → 상태 변경 → 화면 갱신" 루프를 손으로 만든다.

```html
<button id="btn">클릭</button>
<p>클릭 횟수: <span id="count">0</span></p>

<script>
  let count = 0;                              // 상태
  const btn = document.querySelector('#btn');
  const view = document.querySelector('#count');

  btn.addEventListener('click', () => {       // 이벤트
    count = count + 1;                        // 상태 변경
    view.textContent = count;                 // DOM 갱신
  });
</script>
```

> **스크린샷**: 버튼을 여러 번 눌러 "클릭 횟수" 숫자가 0 → 1 → 2로 올라가는 화면.

> **✓ 체크포인트** 버튼을 누를 때마다 숫자가 1씩 늘면 OK. 늘지 않으면 (1) 리스너가 안 걸렸거나 (2) `textContent` 갱신이 빠졌는지 두 곳을 본다.

### 6.2 실습 B — 외부 API 연동 (fetch 7단계)

무료 공개 API에서 데이터를 받아 화면에 표시한다. 여기서는 인증이 필요 없는 테스트용 API(`jsonplaceholder.typicode.com`)를 쓴다.

```html
<button id="load">글 불러오기</button>
<div id="status"></div>
<ul id="list"></ul>

<script>
  const loadBtn = document.querySelector('#load');
  const statusBox = document.querySelector('#status');
  const list = document.querySelector('#list');

  loadBtn.addEventListener('click', async () => {   // ① 이벤트
    statusBox.textContent = '불러오는 중...';        // 로딩 상태 표시
    try {
      const res = await fetch(                        // ② fetch 요청 (비동기)
        'https://jsonplaceholder.typicode.com/posts?_limit=5'
      );
      if (!res.ok) throw new Error('상태코드 ' + res.status); // ③ 응답 점검
      const posts = await res.json();                 // ④ JSON → JS 객체

      list.innerHTML = '';                            // ⑤~⑥ 상태 반영 + DOM 갱신
      posts.forEach(p => {
        const li = document.createElement('li');
        li.textContent = p.title;
        list.appendChild(li);
      });
      statusBox.textContent = '완료!';                 // ⑦ 결과 표시
    } catch (err) {
      statusBox.textContent = '실패: ' + err.message;  // 실패 처리
    }
  });
</script>
```

> **스크린샷**: "글 불러오기" 버튼을 누른 직후 "불러오는 중..."이 보이고, 잠시 뒤 제목 5개가 목록으로 채워진 화면.

> **✓ 체크포인트** 버튼을 누르면 (1) 로딩 표시가 잠깐 보였다가 (2) 목록 5개가 채워지면 OK. 실패 시 개발자도구 Network 탭에서 그 요청의 상태 코드를 확인해 ③ 단계 실패인지(4xx/5xx) 가른다.

> **바이브코딩 연결**: 도구에 "버튼을 누르면 외부 API에서 글 목록을 받아 보여 줘"라고 시키면, 내부적으로 위 7단계가 그대로 만들어진다. 개념을 알면 "로딩 표시가 없다", "에러 처리가 빠졌다" 같은 구체적 보완 지시를 내릴 수 있다.

---

## 더 배우려면

| 자료 | 설명 | 링크 |
|------|------|------|
| MDN — Using the Fetch API | fetch로 네트워크 요청 보내기 | https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch |
| MDN — Asynchronous JavaScript (학습 모듈) | 비동기·프라미스 개념 전반 | https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Async_JS |
| MDN — JavaScript (전체 문서) | DOM·이벤트·언어 레퍼런스 | https://developer.mozilla.org/en-US/docs/Web/JavaScript |
| freeCodeCamp — JavaScript Algorithms and Data Structures | 변수·배열·객체·함수 무료 과정 | https://www.freecodecamp.org/learn/javascript-v9 |
| The Odin Project — Intermediate HTML and CSS | 반응형·접근성 중급 챕터 | https://www.theodinproject.com/paths/full-stack-javascript/courses/intermediate-html-and-css |

---

## 출처

- MDN Web Docs — Using the Fetch API, Asynchronous JavaScript, Using promises, Response: json(), Document Object Model
- freeCodeCamp — JavaScript Algorithms and Data Structures, Responsive Web Design
- The Odin Project — Foundations, Intermediate HTML and CSS
- research/21_webapp-foundations.md (KBS Lab 딥리서치, 2026-06-26) §3·§4·§6.2

---

## 핵심 가정 3줄

1. 학습자는 초보자편(요청-응답·HTML/CSS/JS 큰 그림)을 이미 보았고, 코드 작성 능력보다 개념 이해·디버깅 직관 향상이 목표라고 가정했다.
2. 인용 개념은 2026-06-26 기준 MDN·freeCodeCamp·The Odin Project 공개 문서로 교차 확인했으며, freeCodeCamp 자격증 URL의 버전 접미사(`-v9`)는 시점에 따라 갱신될 수 있다.
3. 실습 B의 외부 API(`jsonplaceholder.typicode.com`)는 무료·무인증 테스트 서비스로, 가용성은 해당 서비스 운영에 의존한다.

## 검증 체크리스트 (PI 김병선 확인 필요)

- [ ] 중급 난이도가 초보자편과 개발자편 사이에서 적절한지(DOM·비동기 깊이)
- [ ] 실습 코드(클릭 카운터·fetch)가 브라우저에서 그대로 동작하는지 클릭 확인
- [ ] `더 배우려면` 링크 5종의 URL·버전 접미사가 2026-06 현재 유효한지
- [ ] "도구가 대신 해주는 것 vs 알아야 하는 것" 대비가 대상 독자 눈높이에 맞는지
- [ ] HTML 변환본의 sidebar TOC ↔ `<h2 id>` 앵커가 일치하는지
