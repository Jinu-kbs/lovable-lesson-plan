# 구글 생태계 중급자편: 구글 도구 심화와 자동화

> **과정명**: 구글 도구 심화와 자동화
> **대상**: 구글 기본 도구는 쓸 줄 알지만 고급 기능·자동화·연동을 배우고 싶은 분
> **목표**: 고급 Sheets, Apps Script, NotebookLM 심화, 도구 간 연동 자동화를 수행할 수 있다
> **주요 도구**: Google Sheets 고급, Apps Script, NotebookLM, Gemini Advanced, Sites, Classroom
> **소요**: 약 4~5시간

---

## 어떤 교안을 봐야 할까요? (자가 진단)

이 교안은 **구글 기본 도구를 사용해본 경험이 있는 분**을 위한 중급 과정입니다.

| 항목 | 자가 점검 |
|------|----------|
| Google Sheets 기초 | SUM, AVERAGE, IF 등 기본 함수를 사용할 수 있다 |
| Google Docs/Slides | 문서·프레젠테이션을 만들고 공유할 수 있다 |
| Google Drive | 파일 업로드, 폴더 정리, 공유 링크를 만들 수 있다 |
| Google Forms | 기본 설문지를 만들고 응답을 확인할 수 있다 |

> 위 항목 중 2개 이상 해당하지 않는다면 → **초보자편** 교안을 먼저 보세요.
> 위 항목 모두 해당하고 API 연동·고급 자동화까지 다루고 싶다면 → **개발자편** 교안을 추천합니다.

---

### 추천 리소스

| 리소스 | 설명 | 링크 |
|--------|------|------|
| **Apps Script 공식 가이드** | Google Apps Script 레퍼런스 및 튜토리얼 | [developers.google.com/apps-script](https://developers.google.com/apps-script) |
| **Sheets 함수 레퍼런스** | Google Sheets 전체 함수 목록 및 사용법 | [support.google.com/docs/table/25273](https://support.google.com/docs/table/25273) |
| **NotebookLM** | Google AI 기반 리서치 도구 | [notebooklm.google.com](https://notebooklm.google.com/) |
| **Google Workspace 업데이트 블로그** | 새 기능·변경사항 공식 안내 | [workspaceupdates.googleblog.com](https://workspaceupdates.googleblog.com/) |

---

## 목차

1. [Sheets 고급](#1-sheets-고급)
2. [Apps Script 입문](#2-apps-script-입문)
3. [NotebookLM 심화](#3-notebooklm-심화)
4. [Gemini 심화](#4-gemini-심화)
5. [Google Sites](#5-google-sites)
6. [Calendar·Meet·Chat](#6-calendarmeet·chat)
7. [도구 연동 활용](#7-도구-연동-활용)
8. [Google Classroom](#8-google-classroom)
9. [Chrome 확장과 생산성](#9-chrome-확장과-생산성)
10. [실전 프로젝트](#10-실전-프로젝트)
11. [트러블슈팅 & FAQ](#11-트러블슈팅--faq)
12. [다음 단계](#12-다음-단계)

---

## 1. Sheets 고급

### 학습 목표

- VLOOKUP, QUERY, ARRAYFORMULA 등 고급 함수를 활용하여 데이터를 분석할 수 있다
- 피벗 테이블과 조건부 서식으로 시각적 대시보드를 만들 수 있다
- IMPORTRANGE로 여러 시트 간 데이터를 연동할 수 있다

### 1-1. 참조 함수: VLOOKUP / HLOOKUP

VLOOKUP(Vertical Lookup)은 특정 값을 기준으로 다른 열의 데이터를 가져오는 함수입니다. 실무에서 가장 많이 쓰이는 함수 중 하나입니다.

```
=VLOOKUP(검색값, 범위, 열번호, [정렬여부])
```

```
# 직원 정보 시트에서 사번으로 이름 찾기
=VLOOKUP(A2, 직원목록!A:D, 2, FALSE)

# 제품 코드로 가격 조회
=VLOOKUP("P-001", 제품목록!A:C, 3, FALSE)

# HLOOKUP: 가로 방향 검색 (행 기준)
=HLOOKUP("3월", A1:L2, 2, FALSE)
```

| 매개변수 | 설명 | 예시 |
|----------|------|------|
| 검색값 | 찾을 값 | `A2`, `"P-001"` |
| 범위 | 검색 대상 범위 | `제품목록!A:C` |
| 열번호 | 반환할 열 번호 (1부터 시작) | `3` |
| 정렬여부 | FALSE=정확히 일치, TRUE=근사치 | `FALSE` (대부분 FALSE 사용) |

> **팁**: VLOOKUP은 검색 열이 반드시 범위의 첫 번째 열이어야 합니다. 왼쪽 방향 검색이 필요하면 INDEX+MATCH 조합을 사용하세요.

### 1-2. QUERY 함수

QUERY 함수는 SQL과 유사한 구문으로 스프레드시트 데이터를 조회·필터·집계합니다. Sheets의 가장 강력한 함수입니다.

```
=QUERY(데이터범위, 쿼리문, [헤더행수])
```

```
# 기본 조회: A열이 "서울"인 행만 추출
=QUERY(A1:E100, "SELECT * WHERE A = '서울'", 1)

# 특정 열만 선택
=QUERY(A1:E100, "SELECT A, C, E WHERE B > 1000", 1)

# 정렬
=QUERY(A1:E100, "SELECT A, B ORDER BY B DESC", 1)

# 집계: 부서별 평균 매출
=QUERY(A1:E100, "SELECT A, AVG(D) GROUP BY A", 1)

# 상위 10개
=QUERY(A1:E100, "SELECT A, B ORDER BY B DESC LIMIT 10", 1)

# 조건 결합
=QUERY(A1:E100, "SELECT A, B, C WHERE B > 500 AND C = '완료'", 1)

# LABEL로 헤더 이름 변경
=QUERY(A1:E100, "SELECT A, SUM(D) GROUP BY A LABEL SUM(D) '총매출'", 1)
```

| QUERY 키워드 | 기능 | SQL 대응 |
|-------------|------|---------|
| `SELECT` | 열 선택 | SELECT |
| `WHERE` | 조건 필터 | WHERE |
| `ORDER BY` | 정렬 | ORDER BY |
| `GROUP BY` | 그룹 집계 | GROUP BY |
| `LIMIT` | 결과 개수 제한 | LIMIT |
| `LABEL` | 열 이름 변경 | AS |
| `PIVOT` | 피벗 변환 | PIVOT |
| `FORMAT` | 출력 형식 지정 | — |

### 1-3. ARRAYFORMULA

ARRAYFORMULA는 하나의 수식을 배열 전체에 적용합니다. 각 행마다 수식을 복사할 필요가 없습니다.

```
# 일반 수식: 각 행에 복사해야 함
=B2*C2

# ARRAYFORMULA: 한 번에 전체 열 처리
=ARRAYFORMULA(B2:B*C2:C)

# IF와 조합: 빈 셀 제외
=ARRAYFORMULA(IF(B2:B="", "", B2:B*C2:C))

# 여러 함수 조합
=ARRAYFORMULA(IF(A2:A<>"", YEAR(A2:A)&"-"&MONTH(A2:A), ""))
```

> **실사용자 팁**: "ARRAYFORMULA는 처음엔 어색하지만, 한 번 익숙해지면 수식 관리가 훨씬 편해집니다. 특히 행이 계속 추가되는 시트에서 위력을 발휘해요." — 실사용자 경험

### 1-4. IMPORTRANGE

IMPORTRANGE는 다른 스프레드시트의 데이터를 현재 시트로 가져옵니다.

```
=IMPORTRANGE("스프레드시트URL", "시트명!범위")

# 예시: 다른 파일의 데이터 가져오기
=IMPORTRANGE("https://docs.google.com/spreadsheets/d/abc123", "Sheet1!A1:D100")

# QUERY와 결합: 가져온 데이터를 필터링
=QUERY(IMPORTRANGE("URL", "데이터!A1:F"), "SELECT Col1, Col3 WHERE Col2 > 100", 1)
```

> **주의**: 처음 IMPORTRANGE를 사용하면 "액세스 허용" 버튼이 나타납니다. 한 번 허용하면 이후에는 자동으로 연결됩니다.

### 1-5. 피벗 테이블

피벗 테이블은 대량의 원시 데이터를 요약·분석하는 강력한 도구입니다.

**만드는 방법**:
1. 데이터 범위를 선택합니다
2. 메뉴 → 삽입 → 피벗 테이블
3. 새 시트 또는 기존 시트에 생성

**구성 요소**:

| 영역 | 역할 | 예시 |
|------|------|------|
| 행 (Rows) | 세로축 기준 | 부서, 제품명 |
| 열 (Columns) | 가로축 기준 | 월, 분기 |
| 값 (Values) | 집계할 데이터 | 매출 합계, 건수 |
| 필터 (Filters) | 전체 필터 조건 | 연도, 지역 |

### 1-6. 조건부 서식 고급

기본적인 색상 지정을 넘어 맞춤 수식으로 조건부 서식을 적용합니다.

```
# 매출이 목표 대비 120% 이상이면 초록 배경
=B2 >= $G$1 * 1.2

# 마감일이 오늘 이전이고 상태가 "미완료"이면 빨강 배경
=AND(C2 < TODAY(), D2 = "미완료")

# 짝수 행에 배경색 (줄무늬 효과)
=ISEVEN(ROW())

# 중복값 강조
=COUNTIF(A:A, A2) > 1
```

### 1-7. 기타 고급 기능

```
# SPARKLINE: 셀 안에 미니 차트
=SPARKLINE(B2:M2, {"charttype","bar"; "max",100; "color1","#4CAF50"})

# 데이터 유효성 검사: 드롭다운 목록
# 메뉴 → 데이터 → 데이터 확인 → 목록에서 선택

# 명명된 범위 (Named Range)
# 메뉴 → 데이터 → 명명된 범위 → 이름 지정
# 이후 수식에서 범위 이름으로 참조
=SUM(월별매출)

# 보호 시트: 특정 셀/시트를 편집 불가로 설정
# 시트 탭 우클릭 → 시트 보호 → 권한 설정
```

### 실습 과제 1: 매출 대시보드 만들기

다음 구조로 매출 대시보드를 만들어보세요.

```
[시트1: 원시데이터]
A열: 날짜, B열: 제품명, C열: 카테고리, D열: 수량, E열: 단가, F열: 매출(ARRAYFORMULA)

[시트2: 대시보드]
1. QUERY로 카테고리별 매출 합계 표
2. QUERY로 월별 매출 추이 표
3. 피벗 테이블로 제품×월 매출 교차분석
4. 조건부 서식으로 목표 미달 항목 빨강 표시
5. SPARKLINE으로 월별 추이 미니차트

[시트3: 연동]
다른 스프레드시트에서 IMPORTRANGE로 지점별 데이터 통합
```

---

## 2. Apps Script 입문

### 학습 목표

- Apps Script의 개념과 스크립트 에디터 사용법을 이해한다
- 기초 JavaScript 문법과 내장 서비스를 활용하여 자동화 스크립트를 작성할 수 있다
- 트리거를 설정하여 자동 실행 워크플로를 구성할 수 있다

### 2-1. Apps Script란?

Google Apps Script는 Google Workspace 앱(Sheets, Docs, Forms, Gmail, Drive, Calendar 등)을 자동화·확장하는 클라우드 기반 스크립팅 플랫폼입니다. JavaScript를 기반으로 하며, 브라우저에서 바로 코드를 작성·실행할 수 있습니다.

| 특징 | 설명 |
|------|------|
| 언어 | JavaScript (ES6+ 일부 지원) |
| 실행 환경 | Google 서버 (클라우드) |
| 설치 | 불필요 (브라우저에서 바로 사용) |
| 비용 | 무료 (일일 실행 할당량 있음) |
| 접근 | Sheets/Docs 등에서 직접 열기 가능 |

### 2-2. 스크립트 에디터 열기

```
방법 1: Sheets/Docs에서 열기
  메뉴 → 확장 프로그램 → Apps Script

방법 2: 직접 접속
  https://script.google.com

방법 3: 독립 스크립트 생성
  script.google.com → 새 프로젝트
```

### 2-3. 기초 문법

```javascript
// 변수 선언
let name = "김선생";
const PI = 3.14159;
var count = 0;  // var도 사용 가능하지만 let/const 권장

// 함수 정의
function greet(name) {
  return "안녕하세요, " + name + "님!";
}

// 배열
let fruits = ["사과", "바나나", "포도"];
fruits.forEach(function(fruit) {
  Logger.log(fruit);  // Apps Script에서의 console.log
});

// 객체
let student = {
  name: "홍길동",
  grade: 3,
  scores: [90, 85, 95]
};

// 조건문
if (student.grade >= 3) {
  Logger.log("고학년입니다");
} else {
  Logger.log("저학년입니다");
}

// 반복문
for (let i = 0; i < fruits.length; i++) {
  Logger.log(fruits[i]);
}
```

> **팁**: Apps Script에서는 `console.log` 대신 `Logger.log()`를 사용합니다. 실행 로그는 메뉴 → 보기 → 로그에서 확인합니다.

### 2-4. 내장 서비스

Apps Script는 Google 앱에 접근할 수 있는 내장 서비스를 제공합니다.

#### SpreadsheetApp (Sheets)

```javascript
function sheetsExample() {
  // 현재 스프레드시트
  let ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName("Sheet1");

  // 셀 값 읽기
  let value = sheet.getRange("A1").getValue();
  Logger.log("A1 값: " + value);

  // 셀 값 쓰기
  sheet.getRange("B1").setValue("Hello Apps Script!");

  // 범위 데이터 읽기 (2차원 배열)
  let data = sheet.getRange("A1:C10").getValues();
  for (let row of data) {
    Logger.log(row[0] + ", " + row[1] + ", " + row[2]);
  }

  // 마지막 행 번호
  let lastRow = sheet.getLastRow();

  // 새 행 추가
  sheet.appendRow(["새데이터", 100, new Date()]);
}
```

#### GmailApp (Gmail)

```javascript
function gmailExample() {
  // 이메일 보내기
  GmailApp.sendEmail(
    "recipient@example.com",
    "제목: Apps Script 테스트",
    "안녕하세요, 자동 발송 이메일입니다."
  );

  // HTML 이메일 보내기
  GmailApp.sendEmail(
    "recipient@example.com",
    "HTML 이메일 테스트",
    "",  // 일반 텍스트 본문 (HTML 대체용)
    {
      htmlBody: "<h1>안녕하세요!</h1><p>이것은 <b>HTML</b> 이메일입니다.</p>"
    }
  );

  // 읽지 않은 메일 개수
  let unreadCount = GmailApp.getInboxUnreadCount();
  Logger.log("읽지 않은 메일: " + unreadCount + "개");
}
```

#### DriveApp (Drive)

```javascript
function driveExample() {
  // 파일 생성
  let file = DriveApp.createFile("test.txt", "파일 내용입니다.");
  Logger.log("파일 ID: " + file.getId());

  // 폴더 생성
  let folder = DriveApp.createFolder("자동생성 폴더");

  // 폴더에 파일 이동
  file.moveTo(folder);

  // 파일 검색
  let files = DriveApp.searchFiles('title contains "보고서"');
  while (files.hasNext()) {
    let f = files.next();
    Logger.log(f.getName() + " (" + f.getId() + ")");
  }
}
```

#### CalendarApp (Calendar)

```javascript
function calendarExample() {
  // 일정 생성
  let calendar = CalendarApp.getDefaultCalendar();

  calendar.createEvent(
    "팀 미팅",
    new Date("2026-03-15 14:00"),
    new Date("2026-03-15 15:00"),
    { description: "주간 회의", location: "회의실 A" }
  );

  // 오늘 일정 조회
  let today = new Date();
  let events = calendar.getEventsForDay(today);
  events.forEach(function(event) {
    Logger.log(event.getTitle() + " : " + event.getStartTime());
  });
}
```

#### FormApp / DocumentApp

```javascript
// Forms: 응답 데이터 처리
function formExample() {
  let form = FormApp.openById("FORM_ID");
  let responses = form.getResponses();
  Logger.log("총 응답 수: " + responses.length);

  let latest = responses[responses.length - 1];
  let answers = latest.getItemResponses();
  answers.forEach(function(answer) {
    Logger.log(answer.getItem().getTitle() + ": " + answer.getResponse());
  });
}

// Docs: 문서 내용 수정
function docsExample() {
  let doc = DocumentApp.create("자동 생성 문서");
  let body = doc.getBody();

  body.appendParagraph("제목").setHeading(DocumentApp.ParagraphHeading.HEADING1);
  body.appendParagraph("이 문서는 Apps Script로 자동 생성되었습니다.");
  body.appendParagraph("생성일: " + new Date().toLocaleDateString("ko-KR"));

  Logger.log("문서 URL: " + doc.getUrl());
}
```

### 2-5. 매크로 녹화/편집

코드를 직접 작성하지 않고 매크로를 녹화하여 반복 작업을 자동화할 수 있습니다.

```
1. Sheets에서 메뉴 → 확장 프로그램 → 매크로 → 매크로 녹화
2. 원하는 작업을 수행 (서식 적용, 정렬, 필터 등)
3. 저장 → 매크로 이름 지정
4. 확장 프로그램 → Apps Script에서 녹화된 코드 확인/편집

녹화된 매크로 코드를 수정하여 더 고급 기능을 추가할 수 있습니다.
```

### 2-6. 커스텀 함수

Apps Script로 Sheets 전용 함수를 직접 만들 수 있습니다.

```javascript
/**
 * 두 날짜 사이의 영업일 수를 계산합니다.
 * @param {Date} startDate 시작일
 * @param {Date} endDate 종료일
 * @return {number} 영업일 수
 * @customfunction
 */
function WORKDAYS(startDate, endDate) {
  let count = 0;
  let current = new Date(startDate);
  while (current <= endDate) {
    let day = current.getDay();
    if (day !== 0 && day !== 6) {  // 일요일(0), 토요일(6) 제외
      count++;
    }
    current.setDate(current.getDate() + 1);
  }
  return count;
}

/**
 * 텍스트에서 이메일 주소를 추출합니다.
 * @param {string} text 검색할 텍스트
 * @return {string} 발견된 이메일 주소
 * @customfunction
 */
function EXTRACT_EMAIL(text) {
  let match = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  return match ? match[0] : "";
}
```

> **주의**: `@customfunction` 주석(JSDoc)을 추가하면 Sheets에서 함수 입력 시 자동완성 설명이 표시됩니다.

### 2-7. 트리거 (Trigger)

트리거는 특정 조건에서 함수를 자동 실행합니다.

| 트리거 유형 | 설명 | 예시 |
|------------|------|------|
| **시간 기반** | 지정 시간/간격으로 실행 | 매일 오전 9시, 매시간 |
| **이벤트 기반** | 특정 이벤트 발생 시 실행 | 폼 제출, 셀 편집 |
| **onOpen** | 스프레드시트 열 때 실행 | 커스텀 메뉴 추가 |
| **onEdit** | 셀 편집 시 실행 | 자동 타임스탬프 |

```javascript
// onOpen: 스프레드시트를 열 때 커스텀 메뉴 추가
function onOpen() {
  let ui = SpreadsheetApp.getUi();
  ui.createMenu("📋 자동화 메뉴")
    .addItem("보고서 생성", "generateReport")
    .addItem("이메일 발송", "sendEmails")
    .addSeparator()
    .addItem("데이터 정리", "cleanData")
    .addToUi();
}

// onEdit: 셀이 편집될 때 자동 타임스탬프 기록
function onEdit(e) {
  let sheet = e.source.getActiveSheet();
  let range = e.range;

  // B열이 편집되면 C열에 타임스탬프 기록
  if (range.getColumn() === 2 && sheet.getName() === "작업목록") {
    let timestampCell = sheet.getRange(range.getRow(), 3);
    timestampCell.setValue(new Date());
  }
}

// 시간 기반 트리거 설정 (코드로)
function createTimeTrigger() {
  ScriptApp.newTrigger("dailyReport")
    .timeBased()
    .everyDays(1)
    .atHour(9)
    .create();
}

// 폼 제출 트리거 설정
function createFormTrigger() {
  let form = FormApp.openById("FORM_ID");
  ScriptApp.newTrigger("onFormSubmit")
    .forForm(form)
    .onFormSubmit()
    .create();
}
```

> **트리거 설정 방법**: 코드로 설정하는 것 외에, Apps Script 에디터 좌측 메뉴 → 시계 아이콘(트리거) → "트리거 추가"에서 GUI로도 설정할 수 있습니다.

### 실습 과제 2: 커스텀 메뉴 + 자동 이메일 스크립트

```javascript
// [실습] 아래 코드를 Apps Script 에디터에 입력하고 실행해보세요.

// 1단계: 커스텀 메뉴 추가
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("✉️ 이메일 도구")
    .addItem("선택 행에 이메일 보내기", "sendSelectedEmail")
    .addItem("전체 미발송 이메일 보내기", "sendAllPendingEmails")
    .addToUi();
}

// 2단계: 이메일 발송 함수
function sendAllPendingEmails() {
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("이메일목록");
  let data = sheet.getDataRange().getValues();
  let sentCount = 0;

  // 첫 행은 헤더이므로 건너뜀
  // 열 구조: A=이름, B=이메일, C=제목, D=내용, E=발송여부
  for (let i = 1; i < data.length; i++) {
    let name = data[i][0];
    let email = data[i][1];
    let subject = data[i][2];
    let body = data[i][3];
    let sent = data[i][4];

    if (email && sent !== "발송완료") {
      GmailApp.sendEmail(email, subject, body);
      sheet.getRange(i + 1, 5).setValue("발송완료");
      sheet.getRange(i + 1, 6).setValue(new Date());
      sentCount++;
    }
  }

  SpreadsheetApp.getUi().alert(sentCount + "건의 이메일을 발송했습니다.");
}

// 3단계: onEdit로 자동 타임스탬프
function onEdit(e) {
  let sheet = e.source.getActiveSheet();
  if (sheet.getName() === "이메일목록" && e.range.getColumn() <= 4) {
    sheet.getRange(e.range.getRow(), 7).setValue("수정: " + new Date().toLocaleString("ko-KR"));
  }
}
```

---

## 3. NotebookLM 심화

### 학습 목표

- 10개 이상의 다양한 소스를 활용하여 깊이 있는 리서치를 수행할 수 있다
- Audio Overview의 고급 기능(지시 프롬프트, 다국어)을 활용할 수 있다
- NotebookLM과 Gemini의 차이를 이해하고 상황에 맞게 선택할 수 있다

### 3-1. 멀티소스 활용 (10+)

NotebookLM은 노트북당 최대 50개의 소스를 추가할 수 있습니다. 다양한 소스를 조합하면 더 풍부한 인사이트를 얻을 수 있습니다.

| 소스 유형 | 지원 형식 | 활용 팁 |
|----------|----------|--------|
| **Google Docs** | 문서 링크 | Docs에 정리한 메모, 회의록 추가 |
| **PDF** | 파일 업로드 | 논문, 보고서, 매뉴얼 |
| **웹 페이지** | URL 붙여넣기 | 뉴스 기사, 블로그, 공식 문서 |
| **YouTube** | 영상 URL | 강연, 튜토리얼 (자막 기반 분석) |
| **Google Slides** | 프레젠테이션 링크 | 발표 자료 분석 |
| **텍스트** | 직접 붙여넣기 | 짧은 메모, 인용문 |
| **오디오** | 파일 업로드 | 녹음 파일 (음성→텍스트 변환) |

```
효과적인 멀티소스 구성 예시 (교육 리서치):

소스 1-3: 교육부 정책 보고서 (PDF) 3건
소스 4-5: 관련 논문 (PDF) 2건
소스 6-7: 교육 전문가 강연 (YouTube) 2건
소스 8-9: 해외 사례 기사 (웹 URL) 2건
소스 10:  내 기존 연구 메모 (Google Docs) 1건
→ 총 10개 소스로 종합 리서치 수행
```

### 3-2. 소스 유형별 활용 전략

**PDF 소스**: 장문의 보고서를 업로드하면 NotebookLM이 핵심 내용을 파악합니다. 업로드 후 "이 문서의 핵심 논점 3가지를 정리해줘"와 같이 질문합니다.

**YouTube 소스**: 영상 URL을 추가하면 자막 기반으로 내용을 분석합니다. "이 영상에서 발표자가 강조한 핵심 메시지는?"처럼 질문할 수 있습니다.

**웹 페이지 소스**: URL을 입력하면 해당 페이지의 텍스트 내용을 소스로 활용합니다. 여러 기사를 추가하고 "이 기사들의 공통점과 차이점을 비교해줘"와 같이 분석을 요청합니다.

### 3-3. Audio Overview 고급

Audio Overview는 소스를 기반으로 팟캐스트 스타일의 오디오 요약을 생성합니다.

**지시 프롬프트 활용**:

```
기본: "이 소스들을 요약해줘"

고급 지시 예시:
- "초등학생도 이해할 수 있는 쉬운 말로 설명해줘"
- "핵심 논쟁점 위주로 토론 형식으로 진행해줘"
- "실제 적용 사례와 한계점을 중심으로 다뤄줘"
- "한국 교육 현장에 적용할 수 있는 시사점 위주로 정리해줘"
```

**다국어 오디오**: Audio Overview는 영어뿐 아니라 한국어를 포함한 여러 언어로 생성할 수 있습니다. 지시 프롬프트에 "한국어로 진행해줘"를 추가합니다.

### 3-4. 인사이트 추출과 노트 정리

```
효과적인 질문 패턴:

[요약] "이 소스들의 핵심 내용을 3줄로 요약해줘"
[비교] "소스 A와 소스 B의 관점 차이를 비교해줘"
[추출] "데이터나 통계가 언급된 부분만 모아줘"
[분석] "이 주제에 대한 찬성/반대 논거를 정리해줘"
[적용] "이 내용을 수업에 적용할 수 있는 방법을 제안해줘"
[출처] "이 주장의 출처가 어느 소스인지 알려줘"
```

> **핵심 차이**: NotebookLM은 **내가 제공한 소스만** 기반으로 답합니다(Grounded). Gemini는 인터넷 전체 지식을 기반으로 답합니다. 정확한 출처 기반 분석이 필요하면 NotebookLM, 폭넓은 탐색이 필요하면 Gemini를 사용하세요.

### 3-5. 공유와 협업

```
공유 방법:
1. 노트북 우측 상단 "공유" 클릭
2. 이메일 주소 입력 → 권한 설정 (보기/편집)
3. 링크 공유 옵션도 가능

Audio Overview 공유:
- 생성된 오디오를 다운로드하여 별도 공유 가능
- 노트북을 공유하면 Audio Overview도 함께 공유됨
```

### 실습 과제 3: 10개 소스 리서치 보고서

```
[실습 주제] "AI가 교육에 미치는 영향" 리서치

1단계: 소스 수집 (10개)
  - 교육부 보도자료 PDF 2건
  - AI 교육 관련 YouTube 강연 2건
  - 해외 교육 AI 사례 웹 기사 3건
  - Google Docs로 정리한 내 수업 경험 메모 1건
  - AI 교육 논문/보고서 PDF 2건

2단계: 노트북에 소스 추가 및 질문
  - "이 소스들에서 AI 교육의 긍정적 효과와 우려 사항을 정리해줘"
  - "한국과 해외의 AI 교육 접근 방식 차이점을 비교해줘"
  - "교사가 AI를 수업에 활용할 수 있는 구체적 방법을 제안해줘"

3단계: Audio Overview 생성
  - 지시: "한국 교사를 대상으로, 실제 수업에 적용할 수 있는
    실용적 관점에서 한국어로 설명해줘"

4단계: 핵심 노트 정리 및 공유
```

---

## 4. Gemini 심화

### 학습 목표

- Gemini Advanced의 고급 기능과 Workspace 연동을 활용할 수 있다
- Gems(커스텀 페르소나)를 만들어 전문 AI 도우미를 구성할 수 있다
- AI Studio의 기초적인 사용법을 이해한다

### 4-1. Gemini Advanced (Ultra)

Gemini Advanced는 Google One AI Premium 플랜에서 사용할 수 있는 최상위 모델입니다.

| 기능 | Gemini (무료) | Gemini Advanced |
|------|-------------|-----------------|
| 모델 | Gemini Flash | Gemini Ultra / Pro |
| 컨텍스트 | 기본 | 최대 100만 토큰 |
| 파일 업로드 | 제한적 | 대용량 지원 |
| Workspace 연동 | 일부 | 완전 통합 |
| Gems | 미지원 | 사용 가능 |
| NotebookLM | 기본 | 고급 기능 |

### 4-2. Workspace 연동

Gemini는 Gmail, Docs, Sheets, Slides와 직접 연동됩니다.

**Gmail에서 Gemini**:
```
- 이메일 요약: 긴 스레드를 한 줄로 요약
- 답장 초안: "공손하게 거절하는 답장 작성해줘"
- 검색: "@gemini 지난달 프로젝트 관련 이메일 찾아줘"
```

**Docs에서 Gemini**:
```
- "이 문서의 핵심 내용을 요약해줘"
- "이 보고서를 초등학생도 이해할 수 있게 다시 써줘"
- "이 문서를 바탕으로 프레젠테이션 초안을 만들어줘"
- 사이드 패널에서 Gemini와 대화하며 문서 작성
```

**Sheets에서 Gemini**:
```
- "이 데이터를 분석하고 차트를 추천해줘"
- "이 데이터에서 이상값을 찾아줘"
- 수식 추천: "A열과 B열의 값을 조건에 따라 합산하는 수식"
```

**Slides에서 Gemini**:
```
- "이 주제로 10슬라이드 프레젠테이션을 만들어줘"
- "이 슬라이드에 어울리는 이미지를 생성해줘"
- "발표자 노트를 추가해줘"
```

### 4-3. Gems (커스텀 페르소나)

Gems는 특정 목적에 맞게 커스터마이징된 Gemini 대화 인스턴스입니다.

```
Gem 생성 방법:
1. gemini.google.com 접속
2. 좌측 메뉴 → Gem 관리자
3. "새 Gem 만들기" 클릭
4. 이름, 지시사항 입력
5. 저장 후 바로 사용

Gem 지시사항 작성 예시:

[국어 교사 도우미 Gem]
이름: 국어 수업 도우미
지시사항:
"당신은 중학교 국어 교사의 수업 준비를 돕는 전문 도우미입니다.
- 교육과정 성취기준에 맞춰 답변합니다
- 학생 수준에 맞는 활동지와 평가 문항을 제안합니다
- 문학 작품 분석 시 학생이 이해하기 쉬운 해설을 제공합니다
- 답변은 항상 구체적인 수업 활동으로 연결합니다"

[데이터 분석 Gem]
이름: 데이터 분석가
지시사항:
"당신은 Google Sheets 데이터 분석 전문가입니다.
- 데이터를 보면 적절한 분석 방법을 제안합니다
- QUERY, ARRAYFORMULA 등 고급 함수를 추천합니다
- 차트 유형 선택을 도와줍니다
- 분석 결과를 비전문가도 이해할 수 있게 설명합니다"
```

### 4-4. Extensions

Gemini Extensions는 외부 서비스와 연동하여 기능을 확장합니다.

| Extension | 기능 | 사용 예시 |
|-----------|------|----------|
| Google Flights | 항공편 검색 | "서울에서 도쿄 3월 항공편 검색" |
| Google Hotels | 숙소 검색 | "부산 해운대 근처 호텔 추천" |
| Google Maps | 장소·경로 검색 | "학교에서 박물관까지 대중교통 경로" |
| YouTube | 영상 검색 | "Apps Script 초보자 튜토리얼 영상" |
| Google Workspace | 메일·문서 검색 | "@Gmail 지난주 회의록 찾아줘" |

### 4-5. 멀티모달 활용

```
이미지 분석:
- 사진 업로드 → "이 사진에서 텍스트를 추출해줘" (OCR)
- 차트 이미지 → "이 차트의 데이터를 표로 정리해줘"
- 수학 문제 사진 → "이 문제를 풀어줘"

파일 분석:
- PDF 업로드 → "이 보고서의 핵심 요약"
- CSV 업로드 → "이 데이터를 분석해줘"
- 코드 파일 → "이 코드를 리뷰해줘"
```

### 4-6. AI Studio 기초

Google AI Studio는 Gemini API를 웹 UI에서 테스트하고 프롬프트를 개발할 수 있는 플랫폼입니다.

```
AI Studio 주요 기능:
- 프롬프트 설계 및 테스트
- 모델 비교 (Flash vs Pro vs Ultra)
- 시스템 프롬프트 설정
- Few-shot 프롬프트 구성
- API 키 발급 및 관리

접속: https://aistudio.google.com
```

### 실습 과제 4: Gems로 전문 AI 도우미 만들기

```
[실습] 자신의 업무에 맞는 Gem 3개를 만들어보세요.

1. 업무 도우미 Gem
   - 자신의 직무/과목에 특화된 지시사항 작성
   - 구체적인 답변 형식과 톤 지정

2. 글쓰기 도우미 Gem
   - 보고서/이메일/공문 등 문서 작성 지원
   - 어투, 분량, 포맷 등 세부 지시

3. 데이터 분석 Gem
   - Sheets 데이터 분석 지원
   - 함수 추천, 차트 선택, 인사이트 도출

각 Gem으로 실제 업무 질문 3가지 이상 테스트해보세요.
```

---

## 5. Google Sites

### 학습 목표

- Google Sites로 웹사이트를 만들고 다양한 구글 콘텐츠를 임베드할 수 있다
- 페이지 구성, 테마 설정, 공동 편집을 수행할 수 있다
- SEO 기초와 게시/공유 설정을 이해한다

### 5-1. 사이트 만들기

```
시작하기:
1. sites.google.com 접속
2. "빈 사이트" 또는 템플릿 선택
3. 사이트 이름 입력

테마 설정:
- 우측 패널 → 테마 탭
- 6가지 기본 테마 중 선택
- 색상, 글꼴 스타일 변경 가능

레이아웃:
- 단일 열, 2열, 3열 레이아웃
- 섹션 단위로 배경색/이미지 변경
- 드래그앤드롭으로 요소 배치
```

### 5-2. 페이지 구성

| 요소 | 설명 | 활용 |
|------|------|------|
| 텍스트 상자 | 제목, 본문 텍스트 | 소개글, 안내문 |
| 이미지 | 사진, 일러스트 | 갤러리, 배너 |
| 임베드 | 외부 콘텐츠 삽입 | URL, HTML |
| 구분선 | 섹션 구분 | 시각적 분리 |
| 버튼 | 링크 버튼 | CTA, 다운로드 |
| 접을 수 있는 텍스트 | 아코디언 | FAQ, 상세정보 |
| 목차 | 자동 목차 생성 | 긴 페이지 네비게이션 |

### 5-3. 콘텐츠 임베드

Google Sites의 강점은 구글 도구의 콘텐츠를 바로 삽입할 수 있다는 점입니다.

```
삽입 가능한 구글 콘텐츠:

- Google Docs: 문서 내용을 사이트에 표시
- Google Sheets: 스프레드시트 또는 차트 삽입
- Google Slides: 프레젠테이션 슬라이드쇼
- Google Forms: 설문지 폼 직접 삽입
- Google Calendar: 일정표 삽입
- Google Maps: 지도/위치 표시
- YouTube: 영상 플레이어

삽입 방법:
1. 삽입 → 해당 도구 선택
2. 파일 선택
3. 크기/표시 옵션 설정
4. 삽입 완료

외부 콘텐츠:
- URL 임베드: 외부 웹사이트 삽입 (iFrame 지원 사이트만)
- HTML 임베드: <embed> 코드 직접 삽입
```

### 5-4. 커스텀 도메인과 게시

```
게시:
1. 우측 상단 "게시" 클릭
2. 웹 주소 설정 (예: sites.google.com/view/my-site)
3. 검색 설정: 검색엔진에 표시 여부

커스텀 도메인:
1. 설정 → 커스텀 도메인
2. 보유한 도메인 연결
3. DNS 설정 (CNAME 레코드)

SEO 기초:
- 페이지 제목에 키워드 포함
- 이미지에 대체 텍스트(alt) 입력
- 명확한 URL 구조 사용
- 사이트 설명 메타태그 설정
```

### 5-5. 공동 편집

```
공동 편집자 추가:
1. 우측 상단 "공유" 아이콘
2. 사용자 추가 → 권한 설정
   - 편집자: 콘텐츠 수정 가능
   - 게시된 사이트 뷰어: 게시된 사이트만 열람

편집 기록:
- 메뉴 → 버전 기록 → 이전 버전 복원 가능
```

### 실습 과제 5: 포트폴리오 사이트 만들기

```
[실습] 5페이지 포트폴리오 사이트를 만들어보세요.

페이지 1 - 홈: 자기소개 + 프로필 이미지
페이지 2 - 프로젝트: Google Slides 프레젠테이션 삽입
페이지 3 - 데이터: Google Sheets 차트 삽입
페이지 4 - 문의: Google Forms 설문 삽입
페이지 5 - 일정: Google Calendar 삽입

추가 과제:
- Google Maps로 위치 표시
- YouTube 자기소개 영상 삽입
- 테마 색상을 자신의 브랜드에 맞게 변경
```

---

## 6. Calendar·Meet·Chat

### 학습 목표

- Google Calendar 고급 기능(공유 캘린더, 예약 일정)을 활용할 수 있다
- Google Meet의 녹화, AI 요약, 출석 추적 기능을 사용할 수 있다
- Google Chat Spaces에서 팀 커뮤니케이션을 관리할 수 있다

### 6-1. Calendar 고급

**다중 캘린더 관리**:

```
캘린더 추가:
- 좌측 "다른 캘린더" → + 버튼
- 새 캘린더 만들기 / URL로 추가 / 관심 캘린더 구독

활용 예시:
- "개인" 캘린더: 개인 일정
- "업무" 캘린더: 회사/학교 일정
- "프로젝트A" 캘린더: 특정 프로젝트 일정
- "대한민국 공휴일" 구독: 공휴일 자동 표시
```

**공유 캘린더**:

| 권한 수준 | 설명 |
|----------|------|
| 한가함/바쁨만 보기 | 시간대만 확인 가능 |
| 모든 일정 세부정보 보기 | 일정 내용까지 열람 |
| 일정 변경 | 일정 추가·수정 가능 |
| 변경 및 공유 관리 | 다른 사람 권한도 관리 |

**Appointment Schedule (예약 일정)**:

```
설정 방법:
1. Calendar → 예약 일정 만들기
2. 제목 입력 (예: "상담 예약")
3. 가능한 시간대 설정
4. 예약 단위 (30분/1시간) 설정
5. 예약 페이지 링크 공유

활용:
- 학생 상담 예약
- 면접 일정 조율
- 고객 미팅 예약
- 자동으로 빈 시간대만 노출
```

### 6-2. Google Meet 고급

| 기능 | 설명 | 사용법 |
|------|------|--------|
| **녹화** | 회의 전체 녹화 (Google Drive 자동 저장) | 활동 → 녹화 시작 |
| **자막** | 실시간 자막 표시 (한국어 지원) | CC 버튼 클릭 |
| **AI 요약** | 회의 내용 자동 요약 (Gemini 기반) | 회의 종료 후 자동 생성 |
| **출석 추적** | 참가자 입퇴장 시간 기록 | 관리자 설정에서 활성화 |
| **소회의실** | 그룹 나누어 토론 | 활동 → 소회의실 |
| **설문/Q&A** | 실시간 설문 및 질의응답 | 활동 → 설문/Q&A |
| **손 들기** | 발언 요청 | 하단 손 들기 아이콘 |

### 6-3. Google Chat / Spaces

```
Spaces(스페이스):
- 팀/프로젝트별 전용 채팅 공간
- 스레드 기반 대화 → 주제별 정리
- 파일 공유, 할 일 관리
- Meet 영상통화 바로 시작

Spaces 활용:
- 프로젝트별 Space 생성
- 스레드로 주제별 토론
- Google Drive 파일 공유 및 공동 편집
- 봇 연동 (Google Calendar 봇 등)

봇 연동:
1. Space에서 + 버튼 → 앱 및 통합 추가
2. Google Calendar, Drive, Meet 등 앱 추가
3. 스케줄 알림, 파일 업데이트 등 자동 알림
```

### 실습 과제 6: 팀 일정 관리 시스템

```
[실습] 팀 일정 관리 시스템을 구성해보세요.

1단계: Calendar
  - 팀 공유 캘린더 생성
  - Appointment Schedule로 상담 예약 페이지 설정
  - 팀원 캘린더 추가 및 권한 설정

2단계: Meet
  - 주간 회의 정기 일정 생성 (캘린더 연동)
  - 자막 및 녹화 설정
  - 소회의실 구성 테스트

3단계: Chat
  - 프로젝트용 Space 생성
  - 스레드로 안건별 토론
  - Calendar 봇 추가하여 알림 수신
```

---

## 7. 도구 연동 활용

### 학습 목표

- Google Forms 응답을 Sheets에서 자동 집계하는 워크플로를 구성할 수 있다
- Apps Script를 활용하여 도구 간 자동화 파이프라인을 구축할 수 있다
- 3가지 이상의 연동 시나리오를 직접 구현할 수 있다

### 7-1. Forms → Sheets 자동 집계

Google Forms의 응답은 자동으로 연결된 Sheets에 기록됩니다. 이를 고급 Sheets 함수와 결합하면 실시간 분석이 가능합니다.

```
설정 방법:
1. Google Forms에서 설문 생성
2. 응답 탭 → 스프레드시트 아이콘 클릭
3. 새 스프레드시트 생성 또는 기존 시트에 연결

Sheets에서 자동 분석:
- COUNTIF로 응답 항목별 개수 집계
- QUERY로 조건별 필터링
- 차트 자동 업데이트
- 피벗 테이블로 교차분석
```

```
# Sheets 자동 분석 수식 예시 (응답 시트 이름: "설문응답")

# 특정 답변 개수 세기
=COUNTIF(설문응답!C:C, "매우 만족")

# 만족도 평균 (1~5점 척도)
=AVERAGE(설문응답!D:D)

# 부서별 응답 수
=QUERY(설문응답!A:F, "SELECT B, COUNT(A) GROUP BY B LABEL COUNT(A) '응답수'", 1)

# 날짜별 응답 추이
=QUERY(설문응답!A:F, "SELECT YEAR(A)||'-'||MONTH(A), COUNT(A) GROUP BY YEAR(A)||'-'||MONTH(A)", 1)
```

### 7-2. Sheets → Gmail 자동 이메일 (Apps Script)

```javascript
// Sheets 데이터를 기반으로 개인화된 이메일 자동 발송
function sendPersonalizedEmails() {
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("수신자목록");
  let data = sheet.getDataRange().getValues();
  // 열 구조: A=이름, B=이메일, C=점수, D=등급, E=발송여부

  let template = HtmlService.createHtmlOutput(
    '<h2>{{이름}}님의 평가 결과</h2>' +
    '<p>안녕하세요, {{이름}}님!</p>' +
    '<p>이번 평가에서 <b>{{점수}}점</b>을 받으셨습니다.</p>' +
    '<p>등급: <b>{{등급}}</b></p>' +
    '<p>감사합니다.</p>'
  ).getContent();

  for (let i = 1; i < data.length; i++) {
    if (data[i][4] === "발송완료") continue;

    let name = data[i][0];
    let email = data[i][1];
    let score = data[i][2];
    let grade = data[i][3];

    let htmlBody = template
      .replace(/\{\{이름\}\}/g, name)
      .replace(/\{\{점수\}\}/g, score)
      .replace(/\{\{등급\}\}/g, grade);

    GmailApp.sendEmail(email, "평가 결과 안내", "", { htmlBody: htmlBody });
    sheet.getRange(i + 1, 5).setValue("발송완료");
    sheet.getRange(i + 1, 6).setValue(new Date());
  }
}
```

### 7-3. Docs → PDF 자동 변환

```javascript
// Google Docs를 PDF로 변환하여 Drive 폴더에 저장
function convertDocsToPDF() {
  let folderId = "FOLDER_ID";  // PDF 저장할 폴더 ID
  let folder = DriveApp.getFolderById(folderId);

  let docId = "DOCUMENT_ID";
  let doc = DriveApp.getFileById(docId);
  let pdfBlob = doc.getAs("application/pdf");
  pdfBlob.setName(doc.getName() + ".pdf");

  folder.createFile(pdfBlob);
  Logger.log("PDF 변환 완료: " + doc.getName());
}
```

### 7-4. Drive → 자동 정리

```javascript
// Drive 폴더의 파일을 날짜별로 자동 정리
function organizeByDate() {
  let sourceFolderId = "SOURCE_FOLDER_ID";
  let sourceFolder = DriveApp.getFolderById(sourceFolderId);
  let files = sourceFolder.getFiles();

  while (files.hasNext()) {
    let file = files.next();
    let date = file.getDateCreated();
    let folderName = Utilities.formatDate(date, "Asia/Seoul", "yyyy-MM");

    // 월별 폴더 찾기 또는 생성
    let subFolders = sourceFolder.getFoldersByName(folderName);
    let targetFolder;
    if (subFolders.hasNext()) {
      targetFolder = subFolders.next();
    } else {
      targetFolder = sourceFolder.createFolder(folderName);
    }

    file.moveTo(targetFolder);
  }
  Logger.log("파일 정리 완료");
}
```

### 7-5. Calendar → Sheets 로그

```javascript
// Calendar 일정을 Sheets에 자동 기록
function logCalendarEvents() {
  let calendar = CalendarApp.getDefaultCalendar();
  let today = new Date();
  let nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

  let events = calendar.getEvents(today, nextWeek);
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("일정로그");

  // 헤더 추가 (첫 실행 시)
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["제목", "시작", "종료", "장소", "설명", "기록시간"]);
  }

  events.forEach(function(event) {
    sheet.appendRow([
      event.getTitle(),
      event.getStartTime(),
      event.getEndTime(),
      event.getLocation(),
      event.getDescription(),
      new Date()
    ]);
  });

  Logger.log(events.length + "건의 일정을 기록했습니다.");
}
```

### 7-6. 연동 시나리오 3가지

**시나리오 A: 학생 과제 관리**
```
Forms(과제 제출) → Sheets(자동 기록) → Apps Script(채점 알림 이메일)
                                      → Calendar(마감일 일정 자동 생성)
```

**시나리오 B: 행사 참가 관리**
```
Forms(참가 신청) → Sheets(집계) → Apps Script(확인 이메일)
                               → Sites(참가자 목록 자동 업데이트)
```

**시나리오 C: 주간 보고 자동화**
```
Sheets(데이터 입력) → Apps Script(데이터 집계)
                    → Docs(보고서 자동 생성)
                    → Gmail(관리자에게 자동 발송)
                    → Drive(보고서 PDF 아카이빙)
```

### 실습 과제 7: 설문→분석→자동 이메일 파이프라인

```javascript
// [실습] 전체 파이프라인 구현

// 1단계: Google Forms로 만족도 조사 생성 (1~5점 척도, 의견란)
// 2단계: 응답이 Sheets에 자동 기록되도록 연결
// 3단계: 아래 Apps Script로 자동화

// 폼 제출 시 자동 실행되는 함수
function onFormSubmit(e) {
  let responses = e.namedValues;
  let name = responses["이름"][0];
  let email = responses["이메일"][0];
  let score = parseInt(responses["만족도"][0]);
  let comment = responses["의견"][0];

  // 응답 확인 이메일 발송
  let subject = "설문 응답 확인: " + name + "님";
  let body = name + "님, 설문에 응답해주셔서 감사합니다.\n";
  body += "만족도 점수: " + score + "/5\n";
  body += "의견: " + comment;

  GmailApp.sendEmail(email, subject, body);

  // 관리자에게 알림 (낮은 점수 시)
  if (score <= 2) {
    GmailApp.sendEmail(
      "admin@example.com",
      "[주의] 낮은 만족도 응답",
      name + "님이 " + score + "점을 주셨습니다.\n의견: " + comment
    );
  }

  // Sheets에 분석 열 추가
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("설문응답");
  let lastRow = sheet.getLastRow();
  let gradeCell = sheet.getRange(lastRow, 6);  // F열: 등급

  if (score >= 4) gradeCell.setValue("우수");
  else if (score >= 3) gradeCell.setValue("보통");
  else gradeCell.setValue("개선필요");
}

// 트리거 설정 (한 번만 실행)
function setupFormTrigger() {
  let form = FormApp.openById("YOUR_FORM_ID");
  ScriptApp.newTrigger("onFormSubmit")
    .forForm(form)
    .onFormSubmit()
    .create();
}
```

---

## 8. Google Classroom

### 학습 목표

- Google Classroom의 구조와 교육용 LMS 기능을 이해한다
- 수업 생성, 과제 관리, 채점을 수행할 수 있다
- Classroom과 다른 구글 도구(Forms, Docs, Drive)를 통합 활용할 수 있다

### 8-1. Google Classroom이란?

Google Classroom은 Google이 제공하는 무료 교육용 학습 관리 시스템(LMS)입니다.

| 기능 | 설명 |
|------|------|
| 수업 관리 | 수업 생성, 학생 초대, 공지사항 |
| 과제 관리 | 과제 생성·배포·수합·채점 |
| 자료 공유 | 수업 자료 배포 (Docs, Slides, PDF 등) |
| 소통 | 공지사항, 댓글, 1:1 피드백 |
| 성적 관리 | 성적표, 루브릭 기반 채점 |
| 가디언 연동 | 보호자에게 학생 활동 요약 발송 |

### 8-2. 수업 만들기

```
수업 생성:
1. classroom.google.com 접속
2. + 버튼 → 수업 만들기
3. 수업 이름, 섹션, 과목, 강의실 입력
4. 수업 코드 생성 (학생에게 공유)

수업 구조:
- 스트림: 공지사항, 활동 피드
- 수업: 주제별 과제·자료 정리
- 사용자: 학생·교사 관리
- 성적: 전체 성적표
```

### 8-3. 과제 관리

| 유형 | 설명 | 활용 |
|------|------|------|
| **과제** | 제출물을 받는 과제 | 보고서, 프로젝트 |
| **퀴즈 과제** | Google Forms 퀴즈 연동 | 자동 채점 테스트 |
| **질문** | 간단한 질의응답 | 토론, 의견 수집 |
| **자료** | 제출 없이 자료만 배포 | 참고자료, 안내 |

```
과제 생성 옵션:
- 마감일 및 시간 설정
- 배점 설정 (점수 또는 채점안함)
- 주제 분류 (단원별 정리)
- 파일 첨부 (Docs, Slides, Drive 파일)
- 각 학생에게 사본 배포 (개인 작업용)
- 루브릭 추가 (채점 기준표)
- 독창성 보고서 (표절 검사)
```

### 8-4. 채점

**루브릭(채점 기준표)**:

```
루브릭 예시 - 발표 과제:

기준 1: 내용 (40점)
  - 우수 (40점): 핵심 개념을 정확히 전달
  - 보통 (30점): 대부분의 개념을 전달
  - 미흡 (20점): 핵심 내용이 부족
  - 부족 (10점): 내용이 부정확하거나 불충분

기준 2: 발표력 (30점)
  - 우수 (30점): 명확한 발표, 적절한 시선 처리
  - 보통 (20점): 전반적으로 무난한 발표
  - 미흡 (10점): 발표가 부자연스럽거나 원고 의존

기준 3: 자료 구성 (30점)
  - 우수 (30점): 시각적으로 우수한 슬라이드
  - 보통 (20점): 기본적인 슬라이드 구성
  - 미흡 (10점): 슬라이드 구성이 미흡
```

**성적표**:
- 성적 탭에서 전체 학생의 과제별 점수를 한눈에 확인
- CSV로 내보내기 가능 (Sheets에서 분석)
- 과제별 평균, 중앙값 등 통계 확인

### 8-5. Classroom + 도구 통합

| 연동 | 방법 | 효과 |
|------|------|------|
| **+Forms** | 퀴즈 과제로 Forms 연결 | 자동 채점, 점수 자동 반영 |
| **+Docs** | 과제에 Docs 템플릿 첨부 | 각 학생에게 사본 배포 |
| **+Slides** | 발표 과제에 Slides 템플릿 | 일관된 발표 형식 |
| **+Drive** | 수업 자료 Drive 폴더 연동 | 자동 폴더 구조 생성 |
| **+Meet** | 수업에서 바로 Meet 시작 | 화상 수업 원클릭 연결 |
| **+Calendar** | 과제 마감일 자동 캘린더 등록 | 일정 관리 자동화 |

### 8-6. 교사 팁 5가지

> **팁 1**: "주제(Topic) 기능을 적극 활용하세요. 과제와 자료를 단원별로 정리하면 학생들이 훨씬 쉽게 찾을 수 있습니다." — 실사용자 조언

> **팁 2**: "Docs 사본 배포 기능은 정말 유용합니다. 활동지를 Docs로 만들어 '각 학생에게 사본 제공'으로 배포하면 학생마다 개별 파일이 생기고, 제출까지 한 번에 관리됩니다." — 실사용자 경험

> **팁 3**: "Forms 퀴즈와 연동하면 객관식·단답형은 자동 채점됩니다. 서술형만 수동 채점하면 되니 시간이 크게 절약됩니다." — 실사용자 후기

> **팁 4**: "보호자(가디언) 초대를 설정하면 학생의 과제 제출 현황이 보호자에게 이메일로 요약 발송됩니다. 별도 안내 없이 가정 연계가 가능합니다." — 실사용자 조언

> **팁 5**: "수업 재사용 기능으로 지난 학기 수업을 복사할 수 있습니다. 과제, 자료, 루브릭이 모두 복사되므로 다음 학기 준비가 빨라집니다." — 실사용자 경험

### 실습 과제 8: 가상 수업 운영

```
[실습] Classroom에서 가상 수업을 만들어보세요.

1단계: 수업 개설
  - 수업 이름, 과목, 섹션 입력
  - 수업 테마 이미지 변경
  - 수업 코드 확인

2단계: 주제 3개 생성
  - 1단원, 2단원, 3단원

3단계: 콘텐츠 추가
  - 자료 1건: Slides 학습자료
  - 과제 1건: Docs 활동지 (사본 배포)
  - 퀴즈 1건: Forms 퀴즈 연동
  - 질문 1건: 토론 주제

4단계: 채점
  - 루브릭 생성 및 적용
  - 성적표 확인

5단계: 공지사항 1건 작성
```

---

## 9. Chrome 확장과 생산성

### 학습 목표

- 생산성을 높이는 Chrome 확장 프로그램을 선별하여 설치·활용할 수 있다
- Chrome 프로필과 동기화 설정을 관리할 수 있다
- Chrome DevTools의 기초적인 사용법을 이해한다

### 9-1. 필수 확장 10선

| 카테고리 | 확장 이름 | 기능 |
|---------|----------|------|
| **AI 도구** | Google Gemini | 브라우저에서 바로 Gemini 사용 |
| **AI 도구** | Google NotebookLM (웹앱) | AI 리서치 도구 |
| **생산성** | Google Keep | 빠른 메모 및 웹 스크랩 |
| **생산성** | Google Tasks | 할 일 관리, Calendar 연동 |
| **탭 관리** | OneTab | 열린 탭을 목록으로 정리 |
| **스크린샷** | GoFullPage | 전체 페이지 스크린샷 |
| **문법** | Grammarly (영문) | 영어 문법/맞춤법 검사 |
| **비밀번호** | Google 비밀번호 관리자 | 비밀번호 자동 생성·저장 |
| **광고차단** | uBlock Origin | 웹 광고 차단 |
| **웹 저장** | Save to Google Drive | 웹 콘텐츠를 Drive에 저장 |

### 9-2. Chrome 프로필 관리

```
프로필 사용 목적:
- 개인용 / 업무용 계정 분리
- 학교 계정 / 개인 계정 분리
- 확장 프로그램·북마크·기록을 프로필별로 분리

프로필 추가:
1. Chrome 우측 상단 프로필 아이콘
2. "+ 추가" 클릭
3. 이름, 테마 색상 설정
4. Google 계정 로그인 (선택)

전환:
- 프로필 아이콘 클릭 → 다른 프로필 선택
- 각 프로필은 독립된 창으로 열림
```

### 9-3. 북마크 관리

```
효과적인 북마크 구조:

📁 업무
  📁 구글 도구
    - Google Sheets
    - Google Docs
    - Apps Script
  📁 프로젝트
    - 프로젝트A 대시보드
    - 프로젝트B 문서
  📁 참고자료
    - 공식 문서
    - 튜토리얼

📁 학습
  📁 온라인 강의
  📁 기술 블로그

북마크 바 활용:
- 자주 쓰는 링크만 북마크 바에 배치
- 이름을 줄여서 공간 절약 (예: "Sheets" → 아이콘만)
- 구분자 폴더로 그룹화
```

### 9-4. Chrome DevTools 기초

```
DevTools 열기:
- F12 또는 Ctrl+Shift+I (Windows)
- Cmd+Option+I (macOS)
- 우클릭 → 검사

주요 탭:
- Elements: HTML/CSS 구조 확인 및 수정
- Console: JavaScript 실행 및 로그 확인
- Network: 네트워크 요청 모니터링
- Application: 쿠키, 스토리지 확인
- Lighthouse: 성능, 접근성, SEO 분석

활용 예시:
- 웹 페이지의 색상 코드 확인
- 폰트 종류·크기 확인
- 네트워크 속도 시뮬레이션 (느린 3G 등)
- 모바일 화면 미리보기 (반응형 모드)
```

### 9-5. 동기화 설정

```
동기화 범위 설정:
1. Chrome 설정 → 동기화 및 Google 서비스
2. 동기화 관리에서 개별 항목 선택/해제:
   - 앱 (확장 프로그램)
   - 북마크
   - 확장 프로그램 설정
   - 방문 기록
   - 설정
   - 테마
   - 열린 탭
   - 비밀번호
   - 주소 및 기타 정보
   - 결제 수단

팁: 업무용 프로필에서는 비밀번호, 북마크, 확장 프로그램을 동기화하고
    개인용 프로필에서는 별도 설정으로 관리하세요.
```

### 실습 과제 9: 확장 3개 설치 및 활용

```
[실습] 아래 3가지 확장을 설치하고 활용해보세요.

1. OneTab
   - 현재 열린 탭 10개 이상을 OneTab으로 정리
   - 탭 그룹 이름 지정
   - 필요한 탭만 복원

2. Save to Google Drive
   - 웹 페이지를 PDF로 Drive에 저장
   - 이미지를 Drive에 직접 저장
   - 저장 폴더 설정

3. GoFullPage
   - 긴 웹 페이지 전체 스크린샷 캡처
   - PNG/PDF로 다운로드
   - 클립보드에 복사

추가: Chrome DevTools로 아무 웹사이트의 폰트, 색상을 확인해보세요.
```

---

## 10. 실전 프로젝트

### 학습 목표

- 여러 구글 도구를 연동하여 자동화된 이벤트 관리 시스템을 구축할 수 있다
- Forms, Sheets, Apps Script, Calendar, Sites를 하나의 워크플로로 통합할 수 있다
- 실제 업무에 적용 가능한 자동화 파이프라인을 설계할 수 있다

### 프로젝트: 자동화 이벤트 관리 시스템

전체 흐름:

```
참가자가 Forms 작성
       ↓
Sheets에 자동 기록
       ↓
Apps Script가 확인 이메일 발송
       ↓
Calendar에 일정 자동 추가
       ↓
Sites 안내 페이지에 정보 표시
```

### 10-1. Forms: 참가 신청서

```
Google Forms 설문 구성:

제목: "○○ 이벤트 참가 신청서"

질문 1: 이름 (단답형, 필수)
질문 2: 이메일 (단답형, 필수, 이메일 유효성 검사)
질문 3: 소속 (단답형)
질문 4: 참가 세션 선택 (객관식 - 오전/오후/종일)
질문 5: 식사 포함 여부 (체크박스)
질문 6: 추가 요청사항 (장문형, 선택)

설정:
- 응답 1회로 제한
- 확인 메시지 커스텀
- 응답 시트 연결
```

### 10-2. Sheets: 참가자 관리

```
시트 구성:

[시트1: 원시응답] - Forms 자동 연결
A: 타임스탬프, B: 이름, C: 이메일, D: 소속, E: 세션, F: 식사, G: 요청사항

[시트2: 대시보드] - 자동 분석
- 총 신청자 수: =COUNTA(원시응답!B:B)-1
- 세션별 인원: =COUNTIF(원시응답!E:E, "오전")
- 식사 신청 수: =COUNTIF(원시응답!F:F, "예")
- QUERY로 소속별 신청 현황
- 차트: 세션별 인원 파이차트

[시트3: 이메일로그] - 발송 기록
A: 이름, B: 이메일, C: 발송시간, D: 상태
```

### 10-3. Apps Script: 자동화 엔진

```javascript
// ===== 이벤트 관리 자동화 스크립트 =====

// 폼 제출 시 자동 실행
function onFormSubmit(e) {
  let responses = e.namedValues;
  let name = responses["이름"][0];
  let email = responses["이메일"][0];
  let session = responses["참가 세션 선택"][0];
  let meal = responses["식사 포함 여부"][0];

  // 1. 확인 이메일 발송
  sendConfirmationEmail(name, email, session, meal);

  // 2. 캘린더에 일정 추가
  addToCalendar(name, email, session);

  // 3. 이메일 로그 기록
  logEmail(name, email);
}

// 확인 이메일 발송
function sendConfirmationEmail(name, email, session, meal) {
  let subject = "✅ 이벤트 참가 신청 확인 - " + name + "님";

  let htmlBody = '<div style="font-family:sans-serif; max-width:600px; margin:0 auto;">';
  htmlBody += '<h2 style="color:#4CAF50;">참가 신청이 완료되었습니다!</h2>';
  htmlBody += '<p>' + name + '님, 이벤트에 신청해주셔서 감사합니다.</p>';
  htmlBody += '<table style="border-collapse:collapse; width:100%;">';
  htmlBody += '<tr><td style="padding:8px; border:1px solid #ddd; background:#f5f5f5;">참가 세션</td>';
  htmlBody += '<td style="padding:8px; border:1px solid #ddd;">' + session + '</td></tr>';
  htmlBody += '<tr><td style="padding:8px; border:1px solid #ddd; background:#f5f5f5;">식사</td>';
  htmlBody += '<td style="padding:8px; border:1px solid #ddd;">' + meal + '</td></tr>';
  htmlBody += '</table>';
  htmlBody += '<p>문의사항은 회신해주세요.</p>';
  htmlBody += '</div>';

  GmailApp.sendEmail(email, subject, "", { htmlBody: htmlBody });
}

// 캘린더에 일정 추가
function addToCalendar(name, email, session) {
  let calendar = CalendarApp.getDefaultCalendar();
  let eventDate = new Date("2026-04-15");  // 이벤트 날짜

  let startTime, endTime;
  if (session === "오전") {
    startTime = new Date("2026-04-15 09:00");
    endTime = new Date("2026-04-15 12:00");
  } else if (session === "오후") {
    startTime = new Date("2026-04-15 13:00");
    endTime = new Date("2026-04-15 17:00");
  } else {
    startTime = new Date("2026-04-15 09:00");
    endTime = new Date("2026-04-15 17:00");
  }

  calendar.createEvent(
    "이벤트 참가: " + name,
    startTime,
    endTime,
    {
      description: "참가자: " + name + "\n이메일: " + email + "\n세션: " + session,
      guests: email,
      sendInvites: true
    }
  );
}

// 이메일 발송 로그
function logEmail(name, email) {
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("이메일로그");
  sheet.appendRow([name, email, new Date(), "발송완료"]);
}

// 트리거 설정 (최초 1회 실행)
function setupTrigger() {
  let form = FormApp.openById("YOUR_FORM_ID");
  ScriptApp.newTrigger("onFormSubmit")
    .forForm(form)
    .onFormSubmit()
    .create();
  Logger.log("트리거 설정 완료");
}
```

### 10-4. Sites: 이벤트 안내 페이지

```
Sites 페이지 구성:

페이지 1 - 이벤트 소개
  - 이벤트 제목, 날짜, 장소
  - Google Maps로 장소 표시
  - 프로그램 일정표 (Sheets 차트 삽입)

페이지 2 - 참가 신청
  - Google Forms 삽입 (신청서)
  - 실시간 신청 현황 (Sheets 차트 삽입)

페이지 3 - 안내사항
  - 교통편, 주차 안내
  - FAQ (접을 수 있는 텍스트)
  - 문의처

게시:
  - sites.google.com/view/my-event
  - 소셜 미디어 공유용 링크 생성
```

### 10-5. 전체 시스템 점검

```
체크리스트:

□ Forms 설문이 정상 작동하는가?
□ 응답이 Sheets에 자동 기록되는가?
□ Apps Script 트리거가 설정되어 있는가?
□ 확인 이메일이 정상 발송되는가?
□ Calendar에 일정이 추가되는가?
□ Sites 페이지에 Forms가 삽입되어 있는가?
□ Sites 페이지에 Sheets 차트가 실시간 업데이트되는가?
□ 에러 발생 시 로그가 기록되는가?
```

---

## 11. 트러블슈팅 & FAQ

### 트러블슈팅 6선

#### 문제 1: Apps Script 권한 오류

```
증상: "이 앱은 확인되지 않았습니다" 경고 표시

해결:
1. "고급" 클릭
2. "(프로젝트이름)(으)로 이동(안전하지 않음)" 클릭
3. "허용" 클릭

원인: 자체 작성한 스크립트는 Google 검증을 받지 않았기 때문입니다.
본인이 직접 작성한 스크립트라면 안전하게 허용할 수 있습니다.
```

#### 문제 2: IMPORTRANGE "액세스 허용" 반복 요청

```
증상: IMPORTRANGE 함수가 계속 "#REF!" 오류를 표시

해결:
1. IMPORTRANGE가 포함된 셀을 클릭
2. "액세스 허용" 버튼 클릭
3. 한 번 허용하면 같은 시트에서는 재요청 없음

주의:
- 소스 시트에 대한 보기 권한이 있어야 합니다
- URL이 정확한지 확인하세요
- 시트 이름에 특수문자가 있으면 따옴표로 감싸세요
```

#### 문제 3: Apps Script 실행 시간 초과

```
증상: "최대 실행 시간 초과" 오류 (6분 제한)

해결:
// 대량 데이터 처리 시 배치 처리로 분할
function processInBatches() {
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  let data = sheet.getDataRange().getValues();
  let properties = PropertiesService.getScriptProperties();
  let startRow = parseInt(properties.getProperty("lastRow")) || 1;
  let batchSize = 100;

  for (let i = startRow; i < Math.min(startRow + batchSize, data.length); i++) {
    // 처리 로직
    processRow(data[i]);
  }

  properties.setProperty("lastRow", String(startRow + batchSize));

  if (startRow + batchSize < data.length) {
    // 다음 배치를 위한 트리거 설정
    ScriptApp.newTrigger("processInBatches")
      .timeBased()
      .after(1000)  // 1초 후
      .create();
  }
}
```

#### 문제 4: Sheets QUERY 함수 오류

```
증상: "#VALUE!" 또는 "Unable to parse query string" 오류

원인별 해결:

1. 날짜 비교 오류:
   잘못된: =QUERY(A:D, "SELECT * WHERE A > '2026-03-01'")
   올바른: =QUERY(A:D, "SELECT * WHERE A > date '2026-03-01'")

2. 열 혼합 데이터 타입:
   원인: 같은 열에 숫자와 텍스트가 섞여 있음
   해결: 데이터 정리 또는 TO_TEXT()/VALUE() 함수로 변환

3. 한글 헤더 문제:
   LABEL 사용: =QUERY(A:D, "SELECT A, SUM(C) GROUP BY A LABEL A '부서', SUM(C) '합계'")
```

#### 문제 5: Google Sites 임베드가 표시되지 않음

```
증상: 임베드한 외부 사이트가 빈 화면으로 표시

원인: 해당 사이트가 iFrame 삽입을 차단하는 경우
      (X-Frame-Options 헤더)

해결:
- 구글 도구(Docs, Sheets, Forms 등)는 문제없이 삽입됨
- 외부 사이트가 안 되면 스크린샷+링크로 대체
- YouTube, Google Maps는 정상 삽입 가능
```

#### 문제 6: NotebookLM 소스 추가 실패

```
증상: 소스를 추가했는데 "소스를 처리할 수 없습니다" 표시

해결:
- PDF: 파일 크기 확인 (최대 200MB, 500페이지)
- 웹 URL: 페이지가 로봇 차단(robots.txt)을 하는지 확인
- YouTube: 자막이 있는 영상만 지원
- 스캔 PDF: OCR이 안 된 이미지 PDF는 인식 불가
  → Google Drive에 업로드 후 Docs로 변환하여 텍스트 추출
```

### FAQ 8선

#### Q1. Apps Script를 배우려면 JavaScript를 먼저 알아야 하나요?

기초적인 JavaScript 지식이 있으면 도움이 되지만, 필수는 아닙니다. Apps Script의 내장 서비스(SpreadsheetApp, GmailApp 등)는 비교적 직관적이어서 예제 코드를 복사·수정하면서 배울 수 있습니다. 변수, 함수, 조건문, 반복문 정도만 이해하면 시작할 수 있습니다.

> **실사용자 조언**: "처음에는 구글 검색으로 예제 코드를 찾아서 복사·수정하는 것부터 시작했어요. 하다 보니 자연스럽게 코드가 읽히더라고요." — 실사용자 경험

#### Q2. NotebookLM과 Gemini, 언제 어떤 것을 쓰나요?

| 상황 | 추천 도구 |
|------|----------|
| 특정 자료 기반 분석 | NotebookLM (출처 명확) |
| 일반적인 질문·탐색 | Gemini (폭넓은 지식) |
| 논문/보고서 리뷰 | NotebookLM (소스 기반 답변) |
| 아이디어 브레인스토밍 | Gemini (창의적 답변) |
| 여러 문서 비교 분석 | NotebookLM (멀티소스) |
| 코드 작성·디버깅 | Gemini (실시간 지원) |
| Workspace 연동 작업 | Gemini (Gmail, Docs 등) |

#### Q3. Apps Script 일일 할당량이 있나요?

네, 무료 계정(gmail.com)과 Google Workspace 계정의 할당량이 다릅니다.

| 항목 | 무료 계정 | Workspace |
|------|----------|-----------|
| 이메일 발송 | 100통/일 | 1,500통/일 |
| 스크립트 실행 시간 | 6분/실행 | 30분/실행 |
| 트리거 수 | 20개/사용자 | 20개/사용자 |
| URL Fetch 호출 | 20,000회/일 | 100,000회/일 |
| Drive 읽기/쓰기 | 20,000회/일 | 100,000회/일 |

#### Q4. Google Sites로 만든 사이트에 방문자 분석을 추가할 수 있나요?

네, Google Analytics를 연동할 수 있습니다. Sites 설정 → 분석 → Google Analytics 측정 ID(G-XXXXXXXXXX)를 입력하면 됩니다. 방문자 수, 페이지별 조회수, 체류 시간 등을 확인할 수 있습니다.

#### Q5. VLOOKUP 대신 요즘은 뭘 쓰나요?

XLOOKUP이 추천됩니다. Google Sheets에서도 XLOOKUP을 지원합니다.

```
# VLOOKUP의 한계
- 검색 열이 첫 번째 열이어야 함
- 왼쪽 방향 검색 불가
- 열 삽입 시 열 번호가 어긋남

# XLOOKUP (권장)
=XLOOKUP(검색값, 검색범위, 반환범위, [미발견시값])

# 예시
=XLOOKUP(A2, 제품목록!B:B, 제품목록!D:D, "없음")

# INDEX+MATCH (전통적 대안)
=INDEX(반환범위, MATCH(검색값, 검색범위, 0))
```

#### Q6. Classroom은 학교 외에서도 사용할 수 있나요?

네, Google 계정이 있으면 누구나 사용할 수 있습니다. 다만 Google Workspace for Education 계정을 사용하면 추가 기능(독창성 보고서, 가디언 초대 등)을 이용할 수 있습니다. 기업 교육, 동아리, 스터디 그룹 등 다양한 학습 환경에서 활용 가능합니다.

#### Q7. Gemini Gems와 ChatGPT GPTs의 차이는?

| 비교 | Gemini Gems | ChatGPT GPTs |
|------|-------------|-------------|
| 플랫폼 | Google Gemini | OpenAI ChatGPT |
| 필요 구독 | Google One AI Premium | ChatGPT Plus |
| 커스텀 지시 | 텍스트 지시사항 | 텍스트 + 파일 업로드 |
| 도구 연동 | Google Workspace 연동 | 코드 인터프리터, DALL-E, 웹 검색 |
| 공유 | 링크 공유 가능 | GPT Store에 게시 가능 |
| 강점 | Google 생태계 통합 | 다양한 액션·API 연동 |

#### Q8. Apps Script로 만든 자동화가 갑자기 안 되면?

```
점검 순서:

1. 트리거 확인
   - Apps Script 에디터 → 트리거(시계 아이콘)
   - 트리거가 비활성화되거나 삭제되지 않았는지 확인

2. 실행 로그 확인
   - 실행 → 실행 기록 → 오류 메시지 확인

3. 권한 재승인
   - 스크립트를 수동 실행 → 권한 재요청 시 허용

4. 할당량 확인
   - 일일 할당량을 초과했는지 확인
   - https://script.google.com/dashboard에서 할당량 확인

5. 코드 변경 영향
   - 최근 코드 수정이 오류를 유발했는지 확인
   - 버전 기록에서 이전 코드 복원
```

---

## 12. 다음 단계

### 이 교안을 마치셨다면

중급 과정을 완료하셨습니다. 다음 학습 경로를 참고하세요.

```
중급 과정 완료!
    │
    ├── 개발자편 교안으로 진행
    │   ├── Apps Script 고급 (웹 앱, API 연동)
    │   ├── Google Cloud Platform 기초
    │   ├── Workspace Add-on 개발
    │   └── BigQuery 연동 데이터 분석
    │
    ├── 다른 도구 심화
    │   ├── Looker Studio (데이터 시각화)
    │   ├── AppSheet (노코드 앱 빌더)
    │   ├── Google Colab (Python 데이터 분석)
    │   └── Firebase (웹/앱 백엔드)
    │
    └── 실전 프로젝트
        ├── 업무 자동화 파이프라인 구축
        ├── 데이터 대시보드 제작 및 공유
        └── 팀 워크플로 최적화
```

- [구글 생태계 개발자편](google-developer.html) — Apps Script 고급, GCP, BigQuery, Gemini API

### 추천 학습 자료

| 자료 | 설명 | 링크 |
|------|------|------|
| **Apps Script 공식 가이드** | Google 공식 튜토리얼 및 레퍼런스 | [developers.google.com/apps-script](https://developers.google.com/apps-script) |
| **Google Workspace Learning Center** | Workspace 도구 전체 학습 자료 | [support.google.com/a/users](https://support.google.com/a/users) |
| **Sheets 함수 목록** | 전체 함수 레퍼런스 | [support.google.com/docs/table/25273](https://support.google.com/docs/table/25273) |
| **Google AI Studio** | Gemini API 테스트 및 프롬프트 개발 | [aistudio.google.com](https://aistudio.google.com/) |
| **NotebookLM** | AI 기반 리서치 도구 | [notebooklm.google.com](https://notebooklm.google.com/) |

---

## 실습 주제 50선

구글 생태계 중급 과정에서 직접 실습해볼 수 있는 50가지 주제입니다. 각 주제는 교실 환경에서 바로 활용 가능하며, 난이도는 3단계(기본/중급/심화)로 구분됩니다.

| 번호 | 도구 | 실습 주제 | 실습 내용 | 난이도 |
|------|------|----------|----------|--------|
| 1 | Sheets | VLOOKUP으로 학생 정보 조회 | 학생 명부 시트에서 학번으로 이름·반·연락처를 자동 조회하는 수식을 작성한다 | 기본 |
| 2 | Sheets | INDEX+MATCH 역방향 검색 | VLOOKUP의 한계를 넘어 왼쪽 방향 검색이 가능한 INDEX+MATCH 조합을 구현한다 | 중급 |
| 3 | Sheets | QUERY 함수로 성적 분석 | QUERY 함수를 사용하여 조건별 평균, 석차, 과목별 통계를 SQL 스타일로 추출한다 | 중급 |
| 4 | Sheets | QUERY WHERE·ORDER BY 활용 | QUERY 함수에 WHERE 조건과 ORDER BY 정렬을 적용하여 원하는 데이터만 필터링한다 | 중급 |
| 5 | Sheets | ARRAYFORMULA 자동 확장 수식 | ARRAYFORMULA를 사용하여 새로운 행이 추가될 때 자동으로 수식이 적용되는 시트를 만든다 | 중급 |
| 6 | Sheets | 피벗 테이블로 매출 분석 | 피벗 테이블을 생성하여 월별·카테고리별 매출을 집계하고 트렌드를 분석한다 | 기본 |
| 7 | Sheets | 조건부 서식 대시보드 | 셀 값에 따라 색상이 자동 변경되는 조건부 서식을 설정하여 시각적 대시보드를 구성한다 | 기본 |
| 8 | Sheets | IMPORTRANGE 시트 간 연동 | IMPORTRANGE로 여러 스프레드시트의 데이터를 하나의 종합 시트로 통합한다 | 중급 |
| 9 | Sheets | 차트 생성과 커스터마이징 | 데이터 시각화를 위한 막대·꺾은선·원형 차트를 생성하고 디자인을 조정한다 | 기본 |
| 10 | Sheets | SPARKLINE 미니 차트 활용 | 셀 안에 들어가는 미니 차트(SPARKLINE)를 만들어 한눈에 추세를 파악한다 | 중급 |
| 11 | Sheets | 데이터 유효성 검사와 드롭다운 | 드롭다운 목록, 입력 범위 제한 등 데이터 유효성 규칙을 설정하여 입력 오류를 방지한다 | 기본 |
| 12 | Sheets | FILTER·SORT 동적 데이터 추출 | FILTER 함수와 SORT 함수를 결합하여 조건에 맞는 데이터를 동적으로 추출한다 | 중급 |
| 13 | Apps Script | 첫 번째 커스텀 함수 만들기 | Sheets에서 사용할 수 있는 사용자 정의 함수(예: 학점 변환 함수)를 작성한다 | 기본 |
| 14 | Apps Script | 커스텀 메뉴 추가하기 | Sheets에 사용자 정의 메뉴를 추가하여 자주 쓰는 기능을 메뉴에서 실행한다 | 기본 |
| 15 | Apps Script | 이메일 자동 발송 스크립트 | Sheets의 학생 목록을 읽어 각 학생에게 맞춤형 이메일을 자동 발송하는 스크립트를 작성한다 | 중급 |
| 16 | Apps Script | Forms 응답 자동 처리 | Google Forms 제출 시 응답 내용을 가공하여 다른 시트에 정리하고 알림을 보낸다 | 중급 |
| 17 | Apps Script | 시간 기반 트리거 설정 | 매일 아침 자동으로 출석 현황을 집계하는 시간 기반 트리거를 설정한다 | 중급 |
| 18 | Apps Script | Sheets 데이터 자동 백업 | 스크립트로 현재 시트 데이터를 특정 폴더에 백업 파일로 자동 생성한다 | 중급 |
| 19 | Apps Script | HTML 서비스로 입력 폼 만들기 | HtmlService를 사용하여 사이드바 형태의 데이터 입력 폼을 구현한다 | 심화 |
| 20 | Apps Script | Docs 자동 문서 생성 | Sheets 데이터를 바탕으로 Google Docs 템플릿에 자동으로 내용을 채워 문서를 생성한다 | 심화 |
| 21 | Apps Script | Slides 자동 프레젠테이션 생성 | Sheets 데이터를 읽어 Google Slides 프레젠테이션 슬라이드를 자동 생성한다 | 심화 |
| 22 | Apps Script | Drive 파일 정리 자동화 | Drive의 특정 폴더에서 오래된 파일을 찾아 정리하는 스크립트를 작성한다 | 중급 |
| 23 | NotebookLM | 논문 비교 분석 노트북 | 관련 논문 3~5편을 업로드하고 NotebookLM으로 핵심 주장과 차이점을 비교 분석한다 | 기본 |
| 24 | NotebookLM | 교과서 요약 및 질의응답 | 교과서 PDF를 소스로 추가하고 단원별 핵심 내용 요약과 심화 질문을 생성한다 | 기본 |
| 25 | NotebookLM | 다중 소스 교차 검증 | 서로 다른 관점의 자료를 업로드하여 NotebookLM으로 교차 검증하고 팩트체크한다 | 중급 |
| 26 | NotebookLM | AI 팟캐스트 생성 활용 | NotebookLM의 Audio Overview 기능으로 학습 자료를 팟캐스트 형식의 오디오로 변환한다 | 중급 |
| 27 | NotebookLM | 연구 보고서 초안 작성 | 여러 출처를 기반으로 NotebookLM의 인용 기능을 활용하여 연구 보고서 초안을 작성한다 | 중급 |
| 28 | NotebookLM | 노트북 공유 및 협업 | 팀원에게 노트북을 공유하고 각자 질문을 추가하며 협업 리서치를 진행한다 | 기본 |
| 29 | Gemini | 복합 프롬프트 작성법 | 역할 지정, 출력 형식, 제약 조건을 포함한 복합 프롬프트로 정교한 결과물을 생성한다 | 중급 |
| 30 | Gemini | 데이터 분석 요청하기 | Gemini에 CSV 데이터를 붙여넣고 트렌드 분석, 이상치 탐지, 인사이트 도출을 요청한다 | 중급 |
| 31 | Gemini | 코드 생성 및 디버깅 | Gemini를 활용하여 Apps Script 코드를 생성하고 오류를 디버깅하는 워크플로를 실습한다 | 심화 |
| 32 | Gemini | 교육 자료 생성 실습 | Gemini로 수업 계획서, 퀴즈, 활동지 등 교육 자료를 체계적으로 생성한다 | 기본 |
| 33 | Gemini | 이미지 분석 및 설명 | Gemini의 멀티모달 기능을 활용하여 이미지를 분석하고 교육적 설명을 생성한다 | 중급 |
| 34 | Gemini | Gemini in Sheets 활용 | Sheets에 내장된 Gemini 기능을 활용하여 데이터 요약, 분류, 감성 분석을 수행한다 | 중급 |
| 35 | Sites | 학급 홈페이지 제작 | Google Sites로 학급 공지사항, 일정, 학습 자료를 담은 홈페이지를 제작한다 | 기본 |
| 36 | Sites | 포트폴리오 사이트 만들기 | 프로젝트 결과물, 활동 사진, 설명을 포함한 개인 또는 팀 포트폴리오 사이트를 구축한다 | 기본 |
| 37 | Sites | Google 도구 임베딩 | Sites에 Sheets 차트, Forms 설문, Calendar, YouTube 등 다양한 Google 도구를 임베드한다 | 중급 |
| 38 | Sites | 다중 페이지 사이트 구성 | 메뉴 구조와 하위 페이지를 활용하여 체계적인 다중 페이지 웹사이트를 구성한다 | 중급 |
| 39 | Calendar | 공유 캘린더로 일정 관리 | 팀·학급 공유 캘린더를 만들고 일정을 등록하며 알림을 설정한다 | 기본 |
| 40 | Meet | 화상 수업 녹화 및 관리 | Google Meet으로 화상 수업을 진행하고 녹화·출석 기록·채팅 로그를 관리한다 | 기본 |
| 41 | Chat | Spaces로 팀 협업 워크플로 | Google Chat Spaces에 팀 채널을 만들고 파일 공유·작업 할당·알림을 설정한다 | 중급 |
| 42 | Calendar | 예약 일정 자동화 | Calendar 예약 일정 기능으로 상담·면담 예약 시스템을 구축한다 | 중급 |
| 43 | 연동 | Forms→Sheets→Email 파이프라인 | 설문 응답이 Sheets에 자동 기록되고 조건에 따라 이메일이 발송되는 파이프라인을 구축한다 | 심화 |
| 44 | 연동 | Sheets→Docs 자동 보고서 | Sheets의 월별 데이터를 읽어 Docs 템플릿에 자동으로 채워 보고서를 생성하는 연동을 구현한다 | 심화 |
| 45 | 연동 | Calendar→Sheets 일정 동기화 | Calendar의 일정을 자동으로 Sheets에 기록하여 일정 관리 대시보드를 만든다 | 심화 |
| 46 | 연동 | Drive→Sheets 파일 목록 관리 | Drive 특정 폴더의 파일 목록을 Sheets에 자동 정리하고 변경사항을 추적한다 | 중급 |
| 47 | Classroom | 과제 일괄 생성 및 배포 | Classroom에서 주제별 과제를 일괄 생성하고 학생별 기한·점수 기준을 설정한다 | 중급 |
| 48 | Classroom | 루브릭 기반 채점 실습 | 루브릭(평가 기준표)을 만들어 Classroom에서 체계적으로 과제를 채점하고 피드백한다 | 중급 |
| 49 | Chrome | 생산성 확장 프로그램 활용 | Google Keep, Workona, Momentum 등 Chrome 확장 프로그램을 설치하여 업무 생산성을 높인다 | 기본 |
| 50 | Chrome | 단축키 마스터 챌린지 | Sheets, Docs, Drive의 핵심 단축키를 학습하고 실무에서 속도를 높이는 챌린지를 수행한다 | 기본 |

> **활용 팁**: 난이도 "기본" 주제부터 시작하여 "중급" → "심화" 순으로 진행하세요. 심화 주제는 Apps Script 기초를 먼저 학습한 후 도전하는 것을 권장합니다.

---

## 출처

### 참고 자료

| 출처 | 설명 |
|------|------|
| [Google Apps Script 공식 문서](https://developers.google.com/apps-script) | Google Apps Script 레퍼런스 |
| [Google Sheets 함수 목록](https://support.google.com/docs/table/25273) | Sheets 전체 함수 레퍼런스 |
| [Google Workspace 업데이트](https://workspaceupdates.googleblog.com/) | Workspace 기능 업데이트 블로그 |
| [NotebookLM](https://notebooklm.google.com/) | Google AI 리서치 도구 |
| [Google AI Studio](https://aistudio.google.com/) | Gemini API 개발 플랫폼 |
| [Google Classroom 고객센터](https://support.google.com/edu/classroom) | Classroom 사용 가이드 |
| [Google Sites 고객센터](https://support.google.com/sites) | Sites 사용 가이드 |
| [Chrome 웹 스토어](https://chromewebstore.google.com/) | Chrome 확장 프로그램 |
