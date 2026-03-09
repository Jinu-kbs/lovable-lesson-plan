# ☁️ 구글 생태계 개발자편: Google API와 클라우드 통합

> **과정명**: Google API와 클라우드 통합
> **대상**: 개발 경험자, 구글 API와 클라우드를 활용한 자동화/서비스 개발에 관심 있는 분
> **목표**: Google API, Cloud Functions, Gemini API, Firebase를 활용한 프로덕션 서비스 구축
> **주요 도구**: Google Cloud Platform, Google APIs, Apps Script 고급, Gemini API, Cloud Functions, BigQuery, Firebase
> **소요**: 약 5~6시간

---

## 어떤 교안을 봐야 할까요? (자가 진단)

이 교안은 **개발 경험이 있는 분**을 대상으로 합니다. 구글 서비스 사용이 처음이라면 초보자편부터 시작하세요.

| 항목 | 필요 수준 |
|------|----------|
| 코딩 경험 | **필수** — Python 또는 JavaScript로 프로젝트 경험 |
| 터미널/CLI 사용 | **필수** — 기본 명령어와 패키지 관리자 사용 가능 |
| REST API 이해 | **필수** — HTTP 메서드, JSON, 인증 개념 숙지 |
| Git/GitHub | **권장** — 버전 관리 기본 워크플로 이해 |
| 클라우드 기초 | **권장** — 서버, 데이터베이스, 배포 개념 이해 |

> 위 항목 중 코딩 경험과 REST API 이해가 해당하지 않는다면, **구글 생태계 초보자편** 또는 **구글 생태계 중급자편**으로 먼저 시작하세요.

---

### 추천 리소스

| 리소스 | 설명 | 링크 |
|--------|------|------|
| **Google Cloud 공식 문서** | GCP 전체 서비스 가이드 및 튜토리얼 | [cloud.google.com/docs](https://cloud.google.com/docs) |
| **Gemini API 레퍼런스** | Gemini 모델 API 사양 및 SDK 문서 | [ai.google.dev/docs](https://ai.google.dev/docs) |
| **Firebase 공식 문서** | Firebase 전체 서비스 가이드 | [firebase.google.com/docs](https://firebase.google.com/docs) |
| **Google Codelabs** | 단계별 실습 튜토리얼 모음 | [codelabs.developers.google.com](https://codelabs.developers.google.com/) |

---

## 목차

1. [Google Cloud 개요](#1-google-cloud-개요)
2. [Google APIs 활용](#2-google-apis-활용)
3. [Apps Script 고급](#3-apps-script-고급)
4. [Gemini API](#4-gemini-api)
5. [Cloud Functions](#5-cloud-functions)
6. [BigQuery & 데이터 분석](#6-bigquery--데이터-분석)
7. [Firebase 통합](#7-firebase-통합)
8. [자동화 파이프라인](#8-자동화-파이프라인)
9. [보안과 비용 관리](#9-보안과-비용-관리)
10. [종합 프로젝트](#10-종합-프로젝트)
11. [다음 단계](#11-다음-단계)

---

## 1. Google Cloud 개요

### 학습 목표

- Google Cloud Platform(GCP)의 핵심 서비스와 아키텍처를 이해한다
- 프로젝트/폴더/조직의 리소스 계층 구조와 IAM 기초를 학습한다
- gcloud CLI를 설치하고 기본 명령어를 활용하여 GCP 프로젝트를 생성한다

### 상세 설명

#### 1.1 GCP란?

Google Cloud Platform은 Google이 제공하는 클라우드 컴퓨팅 플랫폼입니다. Gmail, YouTube, Google 검색을 운영하는 동일한 인프라 위에 구축되어 있으며, 200개 이상의 서비스를 제공합니다.

> "GCP는 데이터와 AI에 강점이 있는 클라우드입니다. BigQuery, Gemini API, Vertex AI 같은 서비스는 다른 클라우드에서 대체하기 어렵습니다" — 실사용자 조언

#### 1.2 핵심 서비스 맵

```
Google Cloud Platform — 핵심 서비스 카테고리

┌─────────────────────────────────────────────────────────────┐
│                        Compute (컴퓨팅)                      │
│  Compute Engine │ Cloud Run │ Cloud Functions │ GKE │ App Engine │
├─────────────────────────────────────────────────────────────┤
│                       Storage (저장소)                       │
│  Cloud Storage │ Persistent Disk │ Filestore │ Archive       │
├─────────────────────────────────────────────────────────────┤
│                     Data (데이터베이스)                       │
│  Cloud SQL │ Firestore │ Bigtable │ Spanner │ BigQuery       │
├─────────────────────────────────────────────────────────────┤
│                         AI / ML                              │
│  Vertex AI │ Gemini API │ Vision AI │ Natural Language │ TTS  │
├─────────────────────────────────────────────────────────────┤
│                      Networking (네트워킹)                    │
│  VPC │ Cloud Load Balancing │ Cloud CDN │ Cloud DNS          │
├─────────────────────────────────────────────────────────────┤
│                    DevOps & Management                        │
│  Cloud Build │ Artifact Registry │ Cloud Monitoring │ Logging │
└─────────────────────────────────────────────────────────────┘
```

#### 1.3 Cloud Console

Cloud Console은 GCP의 웹 기반 관리 인터페이스입니다.

```
Cloud Console 주요 영역

┌──────────────────────────────────────────────┐
│  [≡] 탐색 메뉴    │  프로젝트 선택 ▼  │ 🔍  │
├──────────────────────────────────────────────┤
│  ┌────────────┐  ┌──────────────────────┐    │
│  │ 탐색 패널   │  │  대시보드             │    │
│  │            │  │  ┌────┐ ┌────┐       │    │
│  │ • Compute  │  │  │CPU │ │메모리│      │    │
│  │ • Storage  │  │  └────┘ └────┘       │    │
│  │ • Database │  │  ┌────┐ ┌────┐       │    │
│  │ • AI/ML    │  │  │네트워크│ │비용 │     │    │
│  │ • IAM      │  │  └────┘ └────┘       │    │
│  └────────────┘  └──────────────────────┘    │
│                                              │
│  [>_] Cloud Shell                            │
└──────────────────────────────────────────────┘
```

#### 1.4 프로젝트 구조 (프로젝트/폴더/조직)

GCP에서 모든 리소스는 **프로젝트** 단위로 관리됩니다.

```
리소스 계층 구조

조직 (Organization) — example.com
  ├── 폴더 (Folder) — "개발팀"
  │     ├── 프로젝트 — my-app-dev (개발 환경)
  │     │     ├── Compute Engine 인스턴스
  │     │     ├── Cloud SQL 데이터베이스
  │     │     └── Cloud Storage 버킷
  │     └── 프로젝트 — my-app-prod (프로덕션 환경)
  │           ├── Cloud Run 서비스
  │           ├── Firestore 데이터베이스
  │           └── Cloud Functions
  └── 폴더 (Folder) — "데이터팀"
        └── 프로젝트 — data-analytics
              ├── BigQuery 데이터셋
              └── Vertex AI 모델
```

| 계층 | 설명 | 예시 |
|------|------|------|
| **조직** | 최상위, Google Workspace 도메인 연결 | example.com |
| **폴더** | 프로젝트 그룹화, 정책 상속 | 부서별, 환경별 |
| **프로젝트** | 리소스의 기본 단위, 고유 ID | my-project-123 |
| **리소스** | 실제 서비스 인스턴스 | VM, 버킷, DB |

#### 1.5 IAM 기초

IAM(Identity and Access Management)은 "누가, 무엇을, 어떤 리소스에" 접근할 수 있는지 제어합니다.

```
IAM 모델

누가 (Principal)          무엇을 (Role)           어디에 (Resource)
┌──────────────┐    ┌──────────────────┐    ┌──────────────────┐
│ 사용자        │    │ roles/viewer     │    │ 프로젝트          │
│ 서비스 계정   │ ──▶│ roles/editor     │──▶ │ 버킷             │
│ 그룹         │    │ roles/owner      │    │ 데이터셋          │
│ 도메인       │    │ 커스텀 역할       │    │ 함수             │
└──────────────┘    └──────────────────┘    └──────────────────┘
```

```python
# IAM 정책 예시 — Python으로 IAM 바인딩 확인
from google.cloud import resourcemanager_v3

client = resourcemanager_v3.ProjectsClient()

# 프로젝트의 IAM 정책 가져오기
policy = client.get_iam_policy(
    request={"resource": "projects/my-project-id"}
)

for binding in policy.bindings:
    print(f"역할: {binding.role}")
    for member in binding.members:
        print(f"  - {member}")
```

#### 1.6 결제 계정과 무료 크레딧

| 항목 | 내용 |
|------|------|
| **무료 체험** | 신규 가입 시 $300 크레딧 (90일) |
| **Always Free** | 매월 무료 사용량 (e.g., Cloud Functions 200만 호출) |
| **결제 알림** | 예산 설정 → 임계치 초과 시 이메일 알림 |
| **자동 종료** | 무료 체험 종료 시 리소스 자동 중지 (과금 안 됨) |

> "GCP 무료 체험은 신용카드를 등록해도 자동 과금되지 않습니다. 체험 기간이 끝나면 명시적으로 유료 계정으로 업그레이드해야 합니다" — 실사용자 경험

#### 1.7 gcloud CLI 설치 및 기본 명령어

```bash
# gcloud CLI 설치 (macOS)
brew install --cask google-cloud-sdk

# gcloud CLI 설치 (Linux/WSL)
curl https://sdk.cloud.google.com | bash
exec -l $SHELL

# gcloud CLI 설치 (Windows — PowerShell)
# Google Cloud SDK 설치 프로그램 다운로드 후 실행
# https://cloud.google.com/sdk/docs/install

# 초기화 — 브라우저에서 인증 후 프로젝트 선택
gcloud init

# 인증 상태 확인
gcloud auth list

# 현재 프로젝트 확인
gcloud config get-value project

# 프로젝트 목록
gcloud projects list
```

```bash
# 핵심 gcloud 명령어 모음

# === 프로젝트 관리 ===
gcloud projects create my-new-project --name="My New Project"
gcloud config set project my-new-project

# === 서비스/API 활성화 ===
gcloud services enable sheets.googleapis.com
gcloud services enable cloudfunctions.googleapis.com
gcloud services list --enabled

# === 인증 ===
gcloud auth application-default login  # ADC(Application Default Credentials)
gcloud auth print-access-token         # 현재 액세스 토큰 출력

# === 리전/존 설정 ===
gcloud config set compute/region asia-northeast3    # 서울
gcloud config set compute/zone asia-northeast3-a

# === 설정 프로필 관리 ===
gcloud config configurations create dev-config
gcloud config configurations activate dev-config
gcloud config configurations list
```

### 실습 과제: GCP 프로젝트 생성

> 아래 순서로 GCP 프로젝트를 생성하고 기본 환경을 설정하세요.

```bash
#!/bin/bash
# GCP 프로젝트 초기 설정 스크립트

PROJECT_ID="my-vibe-project-$(date +%Y%m%d)"
REGION="asia-northeast3"

echo "=== 1. 프로젝트 생성 ==="
gcloud projects create "$PROJECT_ID" \
    --name="Vibe Coding Project" \
    --set-as-default

echo "=== 2. 결제 계정 연결 ==="
BILLING_ACCOUNT=$(gcloud billing accounts list --format="value(ACCOUNT_ID)" | head -1)
gcloud billing projects link "$PROJECT_ID" \
    --billing-account="$BILLING_ACCOUNT"

echo "=== 3. 필수 API 활성화 ==="
APIS=(
    "sheets.googleapis.com"
    "drive.googleapis.com"
    "cloudfunctions.googleapis.com"
    "firestore.googleapis.com"
    "aiplatform.googleapis.com"
    "run.googleapis.com"
    "cloudbuild.googleapis.com"
    "cloudscheduler.googleapis.com"
    "secretmanager.googleapis.com"
)

for api in "${APIS[@]}"; do
    echo "  활성화: $api"
    gcloud services enable "$api" --project="$PROJECT_ID"
done

echo "=== 4. 기본 리전 설정 ==="
gcloud config set compute/region "$REGION"
gcloud config set run/region "$REGION"
gcloud config set functions/region "$REGION"

echo "=== 5. ADC 인증 ==="
gcloud auth application-default login

echo "=== 설정 완료 ==="
gcloud config list
echo "프로젝트 ID: $PROJECT_ID"
```

---

## 2. Google APIs 활용

### 학습 목표

- Google API의 인증 방식 3가지(API 키, OAuth 2.0, 서비스 계정)를 이해하고 적절히 선택한다
- Python 클라이언트 라이브러리를 사용하여 Google Sheets API를 호출한다
- 주요 Google API 10선의 용도와 활용 방법을 파악한다

### 상세 설명

#### 2.1 Google API란?

Google API는 Google 서비스에 프로그래밍 방식으로 접근할 수 있는 RESTful 인터페이스입니다. 모든 API는 Google API 콘솔에서 관리됩니다.

```
Google API 호출 흐름

클라이언트 앱                    Google API 서버
┌──────────┐                   ┌──────────────┐
│          │ ──── 인증 토큰 ───▶│              │
│  Python  │ ──── HTTP 요청 ───▶│ Sheets API   │
│  Node.js │ ◀─── JSON 응답 ───│ Drive API    │
│  Apps    │                   │ Gmail API    │
│  Script  │                   │ ...          │
└──────────┘                   └──────────────┘
       │
       ▼
 인증 방식 선택
 ├── API 키: 공개 데이터 읽기
 ├── OAuth 2.0: 사용자 데이터 접근
 └── 서비스 계정: 서버 간 통신
```

#### 2.2 인증 3가지 방식

| 인증 방식 | 용도 | 사용자 동의 | 보안 수준 |
|-----------|------|------------|----------|
| **API 키** | 공개 데이터 읽기 (Maps, YouTube 검색) | 불필요 | 낮음 (키 노출 위험) |
| **OAuth 2.0** | 사용자 개인 데이터 (Gmail, Drive, Calendar) | 필요 | 높음 (토큰 기반) |
| **서비스 계정** | 서버 간 통신, 자동화 | 불필요 | 높음 (키 파일 관리 필수) |

```python
# === 인증 방식 1: API 키 ===
import requests

API_KEY = "AIzaSy..."  # API 콘솔에서 발급
url = f"https://www.googleapis.com/youtube/v3/search?part=snippet&q=python&key={API_KEY}"
response = requests.get(url)
data = response.json()
```

```python
# === 인증 방식 2: OAuth 2.0 ===
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

SCOPES = ['https://www.googleapis.com/auth/spreadsheets']

# credentials.json은 API 콘솔에서 다운로드
flow = InstalledAppFlow.from_client_secrets_file(
    'credentials.json', SCOPES
)
creds = flow.run_local_server(port=0)

# 인증된 서비스 객체 생성
service = build('sheets', 'v4', credentials=creds)
```

```python
# === 인증 방식 3: 서비스 계정 ===
from google.oauth2 import service_account
from googleapiclient.discovery import build

SCOPES = ['https://www.googleapis.com/auth/spreadsheets']

# 서비스 계정 키 파일 (JSON)
creds = service_account.Credentials.from_service_account_file(
    'service-account-key.json',
    scopes=SCOPES
)

service = build('sheets', 'v4', credentials=creds)

# 주의: 스프레드시트를 서비스 계정 이메일과 공유해야 접근 가능
# 서비스 계정 이메일: my-sa@my-project.iam.gserviceaccount.com
```

#### 2.3 API 활성화와 제한 설정

```bash
# API 활성화 (gcloud CLI)
gcloud services enable sheets.googleapis.com
gcloud services enable drive.googleapis.com

# 활성화된 API 목록 확인
gcloud services list --enabled --filter="config.name:googleapis.com"
```

```
API 키 제한 설정 (API 콘솔)

┌─────────────────────────────────────────┐
│ API 키 제한                              │
│                                         │
│ 애플리케이션 제한:                        │
│ ○ 없음                                  │
│ ● HTTP 리퍼러 (웹사이트)                 │
│   → *.example.com/*                     │
│ ○ IP 주소 (서버)                         │
│ ○ Android 앱                            │
│ ○ iOS 앱                                │
│                                         │
│ API 제한:                                │
│ ○ 제한하지 않음                           │
│ ● 키 제한                                │
│   ☑ Maps JavaScript API                 │
│   ☑ YouTube Data API v3                 │
│   ☐ Sheets API                          │
└─────────────────────────────────────────┘
```

#### 2.4 클라이언트 라이브러리

```bash
# Python 클라이언트 설치
pip install google-api-python-client google-auth-httplib2 google-auth-oauthlib

# Node.js 클라이언트 설치
npm install googleapis @google-cloud/local-auth
```

```javascript
// Node.js — Google API 클라이언트
const { google } = require('googleapis');
const { authenticate } = require('@google-cloud/local-auth');
const path = require('path');

async function main() {
    // OAuth 2.0 인증
    const auth = await authenticate({
        keyfilePath: path.join(__dirname, 'credentials.json'),
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const res = await sheets.spreadsheets.values.get({
        spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms',
        range: 'Sheet1!A1:D10',
    });

    console.log('데이터:', res.data.values);
}

main().catch(console.error);
```

#### 2.5 주요 Google API 10선

| API | 용도 | 활용 예시 |
|-----|------|----------|
| **Sheets API** | 스프레드시트 읽기/쓰기 | 데이터 수집, 리포트 자동화 |
| **Docs API** | 문서 생성/편집 | 보고서 자동 생성 |
| **Drive API** | 파일 관리, 공유 | 파일 업로드, 폴더 정리 |
| **Gmail API** | 이메일 발송/관리 | 알림 메일, 대량 발송 |
| **Calendar API** | 일정 생성/조회 | 일정 자동 등록, 알림 |
| **YouTube Data API** | 동영상 검색/관리 | 채널 분석, 메타데이터 수집 |
| **Maps API** | 지도, 지오코딩 | 위치 기반 서비스 |
| **Custom Search API** | 프로그래밍 방식 검색 | 검색 자동화 |
| **Cloud Translation API** | 텍스트 번역 | 다국어 콘텐츠 |
| **Cloud Vision API** | 이미지 분석 | OCR, 라벨 감지 |

#### 2.6 인증 토큰 관리와 갱신

```python
import os
import json
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
TOKEN_PATH = 'token.json'
CREDS_PATH = 'credentials.json'

def get_credentials():
    """토큰 파일이 있으면 재사용, 만료되었으면 갱신, 없으면 새로 발급"""
    creds = None

    # 기존 토큰 파일 확인
    if os.path.exists(TOKEN_PATH):
        creds = Credentials.from_authorized_user_file(TOKEN_PATH, SCOPES)

    # 유효하지 않으면 갱신 또는 새로 발급
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            print("토큰 갱신 중...")
            creds.refresh(Request())
        else:
            print("새 인증 진행...")
            flow = InstalledAppFlow.from_client_secrets_file(CREDS_PATH, SCOPES)
            creds = flow.run_local_server(port=0)

        # 토큰 저장
        with open(TOKEN_PATH, 'w') as f:
            f.write(creds.to_json())
        print("토큰 저장 완료")

    return creds

def main():
    creds = get_credentials()
    service = build('sheets', 'v4', credentials=creds)

    # 스프레드시트 데이터 읽기
    result = service.spreadsheets().values().get(
        spreadsheetId='SPREADSHEET_ID',
        range='Sheet1!A1:E10'
    ).execute()

    values = result.get('values', [])
    for row in values:
        print(row)

main()
```

### 실습 과제: Python으로 Sheets API 읽기/쓰기

> Google Sheets API를 사용하여 스프레드시트에 데이터를 쓰고 읽는 Python 스크립트를 작성하세요.

```python
from googleapiclient.discovery import build
from google.oauth2 import service_account

SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
SERVICE_ACCOUNT_FILE = 'service-account-key.json'
SPREADSHEET_ID = 'your-spreadsheet-id-here'

def get_service():
    """Sheets API 서비스 객체 생성"""
    creds = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES
    )
    return build('sheets', 'v4', credentials=creds)

def write_data(service, data, range_name='Sheet1!A1'):
    """스프레드시트에 데이터 쓰기"""
    body = {'values': data}
    result = service.spreadsheets().values().update(
        spreadsheetId=SPREADSHEET_ID,
        range=range_name,
        valueInputOption='USER_ENTERED',
        body=body
    ).execute()
    print(f"{result.get('updatedCells')}개 셀 업데이트 완료")
    return result

def read_data(service, range_name='Sheet1!A1:E10'):
    """스프레드시트에서 데이터 읽기"""
    result = service.spreadsheets().values().get(
        spreadsheetId=SPREADSHEET_ID,
        range=range_name
    ).execute()
    values = result.get('values', [])
    if not values:
        print('데이터가 없습니다.')
        return []
    return values

def append_data(service, data, range_name='Sheet1!A1'):
    """기존 데이터 아래에 새 행 추가"""
    body = {'values': data}
    result = service.spreadsheets().values().append(
        spreadsheetId=SPREADSHEET_ID,
        range=range_name,
        valueInputOption='USER_ENTERED',
        insertDataOption='INSERT_ROWS',
        body=body
    ).execute()
    print(f"{result.get('updates', {}).get('updatedRows', 0)}개 행 추가 완료")
    return result

def main():
    service = get_service()

    # 1. 헤더와 데이터 쓰기
    header_data = [
        ['이름', '이메일', '부서', '입사일', '상태'],
        ['김개발', 'dev@example.com', '개발팀', '2025-01-15', '활성'],
        ['이디자인', 'design@example.com', '디자인팀', '2025-03-01', '활성'],
        ['박매니저', 'pm@example.com', '기획팀', '2024-11-20', '활성'],
    ]
    write_data(service, header_data)

    # 2. 데이터 읽기
    print("\n=== 현재 데이터 ===")
    rows = read_data(service)
    for row in rows:
        print(' | '.join(row))

    # 3. 새 데이터 추가
    new_data = [
        ['최인턴', 'intern@example.com', '개발팀', '2026-03-01', '수습'],
    ]
    append_data(service, new_data)

    # 4. 업데이트 확인
    print("\n=== 업데이트 후 데이터 ===")
    rows = read_data(service, 'Sheet1!A1:E20')
    for row in rows:
        print(' | '.join(row))

if __name__ == '__main__':
    main()
```

---

## 3. Apps Script 고급

### 학습 목표

- Apps Script의 라이브러리 관리와 코드 모듈화를 이해한다
- Web App으로 REST API 서버를 구축하고 배포한다
- OAuth2 라이브러리를 활용하여 외부 API와 연동한다

### 상세 설명

#### 3.1 라이브러리 관리

Apps Script에서 라이브러리는 코드 재사용과 모듈화를 위한 핵심 기능입니다.

```javascript
// === 라이브러리로 사용할 프로젝트 ===
// 스크립트 ID: 1abc...xyz (프로젝트 설정에서 확인)

/**
 * 유틸리티 라이브러리 — 공통 함수 모음
 * 다른 프로젝트에서 이 스크립트를 라이브러리로 추가하여 사용
 */

/**
 * 날짜를 한국어 형식으로 포맷팅
 * @param {Date} date - 변환할 날짜
 * @returns {string} "2026년 3월 9일 (일)" 형식
 */
function formatDateKR(date) {
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const day = days[date.getDay()];
  return `${y}년 ${m}월 ${d}일 (${day})`;
}

/**
 * 스프레드시트 데이터를 JSON 배열로 변환
 * @param {Sheet} sheet - 시트 객체
 * @returns {Object[]} 헤더를 키로 사용하는 객체 배열
 */
function sheetToJSON(sheet) {
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  return data.slice(1).map(row => {
    const obj = {};
    headers.forEach((header, i) => {
      obj[header] = row[i];
    });
    return obj;
  });
}

/**
 * 에러를 로그 시트에 기록
 * @param {Error} error - 에러 객체
 * @param {string} context - 에러 발생 컨텍스트
 */
function logError(error, context) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let logSheet = ss.getSheetByName('_ErrorLog');
  if (!logSheet) {
    logSheet = ss.insertSheet('_ErrorLog');
    logSheet.appendRow(['타임스탬프', '컨텍스트', '에러 메시지', '스택 트레이스']);
  }
  logSheet.appendRow([
    new Date(),
    context,
    error.message,
    error.stack || 'N/A'
  ]);
}
```

#### 3.2 Web App 배포 (doGet / doPost)

Apps Script를 HTTP 엔드포인트로 배포하여 외부에서 호출할 수 있습니다.

```javascript
// === Web App — REST API 서버 ===

/**
 * GET 요청 처리
 * 사용법: https://script.google.com/macros/s/DEPLOY_ID/exec?action=list&sheet=Sheet1
 */
function doGet(e) {
  try {
    const action = e.parameter.action || 'list';
    const sheetName = e.parameter.sheet || 'Sheet1';

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(sheetName);

    if (!sheet) {
      return jsonResponse({ error: `시트 '${sheetName}'을 찾을 수 없습니다` }, 404);
    }

    let result;

    switch (action) {
      case 'list':
        result = getSheetData(sheet);
        break;
      case 'get':
        const id = e.parameter.id;
        result = getRowById(sheet, id);
        break;
      case 'schema':
        result = getSheetSchema(sheet);
        break;
      default:
        return jsonResponse({ error: `알 수 없는 액션: ${action}` }, 400);
    }

    return jsonResponse({ success: true, data: result });

  } catch (error) {
    return jsonResponse({ error: error.message }, 500);
  }
}

/**
 * POST 요청 처리
 * Body: { "action": "add", "sheet": "Sheet1", "data": { "이름": "홍길동", ... } }
 */
function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const action = body.action || 'add';
    const sheetName = body.sheet || 'Sheet1';

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(sheetName);

    let result;

    switch (action) {
      case 'add':
        result = addRow(sheet, body.data);
        break;
      case 'update':
        result = updateRow(sheet, body.id, body.data);
        break;
      case 'delete':
        result = deleteRow(sheet, body.id);
        break;
      default:
        return jsonResponse({ error: `알 수 없는 액션: ${action}` }, 400);
    }

    return jsonResponse({ success: true, data: result });

  } catch (error) {
    return jsonResponse({ error: error.message }, 500);
  }
}

/**
 * JSON 응답 생성 헬퍼
 */
function jsonResponse(data, statusCode = 200) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * 시트 전체 데이터를 JSON 배열로 반환
 */
function getSheetData(sheet) {
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];

  const headers = data[0];
  return data.slice(1).map((row, index) => {
    const obj = { _row: index + 2 };  // 실제 행 번호
    headers.forEach((header, i) => {
      obj[header] = row[i];
    });
    return obj;
  });
}

/**
 * ID로 특정 행 조회
 */
function getRowById(sheet, id) {
  const data = getSheetData(sheet);
  return data.find(row => String(row['ID']) === String(id)) || null;
}

/**
 * 새 행 추가
 */
function addRow(sheet, rowData) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const newRow = headers.map(header => rowData[header] || '');
  sheet.appendRow(newRow);
  return { message: '행 추가 완료', row: sheet.getLastRow() };
}
```

#### 3.3 HTML Service — 프론트엔드 구축

```javascript
// Code.gs — 서버 사이드
function doGet() {
  return HtmlService
    .createTemplateFromFile('index')
    .evaluate()
    .setTitle('관리 대시보드')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// HTML 파일 포함 헬퍼
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

// 클라이언트에서 호출할 서버 함수
function getDataFromSheet(sheetName) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  return sheetToJSON(sheet);
}

function saveDataToSheet(sheetName, data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  addRow(sheet, data);
  return { success: true };
}
```

```html
<!-- index.html — 클라이언트 사이드 -->
<!DOCTYPE html>
<html>
<head>
  <base target="_top">
  <?!= include('styles'); ?>
</head>
<body>
  <div id="app">
    <h1>관리 대시보드</h1>
    <div id="data-table"></div>
    <button onclick="loadData()">데이터 불러오기</button>
  </div>

  <script>
    function loadData() {
      google.script.run
        .withSuccessHandler(renderTable)
        .withFailureHandler(showError)
        .getDataFromSheet('Sheet1');
    }

    function renderTable(data) {
      if (!data || data.length === 0) {
        document.getElementById('data-table').innerHTML = '<p>데이터가 없습니다</p>';
        return;
      }

      const headers = Object.keys(data[0]);
      let html = '<table><thead><tr>';
      headers.forEach(h => html += `<th>${h}</th>`);
      html += '</tr></thead><tbody>';

      data.forEach(row => {
        html += '<tr>';
        headers.forEach(h => html += `<td>${row[h]}</td>`);
        html += '</tr>';
      });
      html += '</tbody></table>';

      document.getElementById('data-table').innerHTML = html;
    }

    function showError(error) {
      alert('오류: ' + error.message);
    }

    // 페이지 로드 시 자동 실행
    document.addEventListener('DOMContentLoaded', loadData);
  </script>
</body>
</html>
```

#### 3.4 외부 REST API 연동 (UrlFetchApp)

```javascript
/**
 * 외부 API 호출 — UrlFetchApp 활용
 */

// === GET 요청 ===
function fetchWeatherData(city) {
  const apiKey = PropertiesService.getScriptProperties().getProperty('WEATHER_API_KEY');
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=kr`;

  const options = {
    method: 'get',
    muteHttpExceptions: true,  // HTTP 에러에서도 응답 받기
    headers: {
      'Accept': 'application/json'
    }
  };

  const response = UrlFetchApp.fetch(url, options);
  const code = response.getResponseCode();

  if (code !== 200) {
    throw new Error(`API 호출 실패 (${code}): ${response.getContentText()}`);
  }

  return JSON.parse(response.getContentText());
}

// === POST 요청 ===
function sendSlackMessage(channel, message) {
  const token = PropertiesService.getScriptProperties().getProperty('SLACK_TOKEN');
  const url = 'https://slack.com/api/chat.postMessage';

  const options = {
    method: 'post',
    contentType: 'application/json',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    payload: JSON.stringify({
      channel: channel,
      text: message,
      mrkdwn: true
    }),
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(url, options);
  return JSON.parse(response.getContentText());
}

// === 배치 요청 (fetchAll) ===
function fetchMultipleAPIs() {
  const requests = [
    { url: 'https://api.example.com/users', method: 'get' },
    { url: 'https://api.example.com/products', method: 'get' },
    { url: 'https://api.example.com/orders', method: 'get' },
  ];

  // 병렬 요청 — 개별 fetch보다 훨씬 빠름
  const responses = UrlFetchApp.fetchAll(requests);

  return responses.map((res, i) => ({
    endpoint: requests[i].url,
    status: res.getResponseCode(),
    data: JSON.parse(res.getContentText())
  }));
}
```

#### 3.5 PropertiesService — 환경 설정 관리

```javascript
/**
 * PropertiesService로 API 키, 설정값 관리
 * 코드에 직접 키를 하드코딩하지 마세요!
 */

// 스크립트 속성 설정 (초기 1회)
function setupProperties() {
  const props = PropertiesService.getScriptProperties();
  props.setProperties({
    'API_KEY': 'your-api-key',
    'WEBHOOK_URL': 'https://hooks.slack.com/...',
    'ADMIN_EMAIL': 'admin@example.com',
    'MAX_RETRIES': '3',
    'DEBUG_MODE': 'false'
  });
  Logger.log('속성 설정 완료');
}

// 속성 읽기
function getConfig(key) {
  return PropertiesService.getScriptProperties().getProperty(key);
}

// 사용자별 속성 (각 사용자마다 다른 값)
function saveUserPreference(key, value) {
  PropertiesService.getUserProperties().setProperty(key, value);
}

function getUserPreference(key, defaultValue) {
  return PropertiesService.getUserProperties().getProperty(key) || defaultValue;
}
```

#### 3.6 에러 핸들링과 재시도

```javascript
/**
 * 재시도 로직이 포함된 API 호출 래퍼
 */
function fetchWithRetry(url, options = {}, maxRetries = 3) {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = UrlFetchApp.fetch(url, {
        ...options,
        muteHttpExceptions: true
      });

      const code = response.getResponseCode();

      // 성공
      if (code >= 200 && code < 300) {
        return JSON.parse(response.getContentText());
      }

      // 재시도 가능한 에러 (429, 5xx)
      if (code === 429 || code >= 500) {
        const waitTime = Math.pow(2, attempt) * 1000;  // 지수 백오프
        Logger.log(`재시도 ${attempt}/${maxRetries} — ${waitTime}ms 대기`);
        Utilities.sleep(waitTime);
        continue;
      }

      // 재시도 불가능한 에러 (4xx)
      throw new Error(`HTTP ${code}: ${response.getContentText()}`);

    } catch (error) {
      lastError = error;
      if (attempt === maxRetries) break;

      Logger.log(`에러 발생 (시도 ${attempt}): ${error.message}`);
      Utilities.sleep(Math.pow(2, attempt) * 1000);
    }
  }

  throw new Error(`${maxRetries}회 재시도 후 실패: ${lastError.message}`);
}
```

#### 3.7 V8 런타임과 모던 JavaScript

```javascript
// V8 런타임 활성화 시 사용 가능한 모던 문법

// 화살표 함수, 템플릿 리터럴, 구조 분해
const processRow = ({ name, email, department }) => {
  return `${name} (${department}) — ${email}`;
};

// async/await (Apps Script에서는 제한적)
// UrlFetchApp은 동기 방식이므로 async가 불필요하지만
// Promise 패턴 사용은 가능

// Map, Set, Symbol
const uniqueDepartments = [...new Set(
  data.map(row => row.department)
)];

// Optional chaining, Nullish coalescing
const city = user?.address?.city ?? '미지정';

// Array 메서드 체이닝
const report = data
  .filter(row => row.status === '활성')
  .map(row => ({
    name: row.name,
    daysActive: daysBetween(row.startDate, new Date())
  }))
  .sort((a, b) => b.daysActive - a.daysActive)
  .slice(0, 10);
```

### 실습 과제: Web App API 서버

> 스프레드시트를 데이터베이스로 사용하는 CRUD API를 Web App으로 배포하세요. GET/POST 요청을 처리하고, 외부 클라이언트(curl, Postman)에서 호출해보세요.

```javascript
// === 완성형 Web App API 서버 ===

const SHEET_NAME = 'Members';

function doGet(e) {
  const action = e.parameter.action || 'list';
  const id = e.parameter.id;

  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);

    switch (action) {
      case 'list':
        return respond(200, sheetToJSON(sheet));
      case 'get':
        if (!id) return respond(400, { error: 'id 파라미터가 필요합니다' });
        const row = findById(sheet, id);
        if (!row) return respond(404, { error: '데이터를 찾을 수 없습니다' });
        return respond(200, row);
      default:
        return respond(400, { error: `지원하지 않는 액션: ${action}` });
    }
  } catch (err) {
    return respond(500, { error: err.message });
  }
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);

    switch (body.action) {
      case 'create':
        const newId = Utilities.getUuid();
        const newData = { ID: newId, ...body.data, 생성일: new Date().toISOString() };
        appendRowFromObject(sheet, newData);
        return respond(201, { id: newId, message: '생성 완료' });

      case 'update':
        if (!body.id) return respond(400, { error: 'id가 필요합니다' });
        updateRowById(sheet, body.id, body.data);
        return respond(200, { message: '수정 완료' });

      case 'delete':
        if (!body.id) return respond(400, { error: 'id가 필요합니다' });
        deleteRowById(sheet, body.id);
        return respond(200, { message: '삭제 완료' });

      default:
        return respond(400, { error: `지원하지 않는 액션: ${body.action}` });
    }
  } catch (err) {
    return respond(500, { error: err.message });
  }
}

function respond(status, data) {
  return ContentService
    .createTextOutput(JSON.stringify({ status, ...data }))
    .setMimeType(ContentService.MimeType.JSON);
}

// curl 테스트 예시:
// GET:  curl "https://script.google.com/.../exec?action=list"
// POST: curl -X POST -H "Content-Type: application/json" \
//       -d '{"action":"create","data":{"이름":"홍길동","이메일":"hong@ex.com"}}' \
//       "https://script.google.com/.../exec"
```

---

## 4. Gemini API

### 학습 목표

- Google AI Studio에서 프롬프트를 설계/테스트하고 API 키를 발급한다
- Gemini API를 Python/JavaScript SDK로 호출하고 다양한 기능을 활용한다
- Function Calling, Structured Output, 스트리밍 등 고급 기능을 구현한다

### 상세 설명

#### 4.1 AI Studio — 프롬프트 디자인과 테스트

Google AI Studio는 Gemini 모델을 웹에서 직접 테스트하고 API 키를 발급받는 도구입니다.

```
AI Studio 워크플로

┌─────────────────────────────────────────────────┐
│                Google AI Studio                  │
│                                                  │
│  1. 프롬프트 디자인                               │
│     ├── Freeform: 자유 형식 프롬프트              │
│     ├── Structured: 입출력 예시 기반              │
│     └── Chat: 대화형 프롬프트                     │
│                                                  │
│  2. 모델 선택                                     │
│     ├── Gemini 2.0 Flash (빠르고 저렴)            │
│     ├── Gemini 2.0 Pro (균형)                     │
│     └── Gemini Ultra (최고 성능)                  │
│                                                  │
│  3. 파라미터 조정                                 │
│     ├── Temperature (0.0 ~ 2.0)                  │
│     ├── Top-P (0.0 ~ 1.0)                        │
│     ├── Top-K (1 ~ 100)                          │
│     └── Max Output Tokens                        │
│                                                  │
│  4. [Get API Key] → API 키 발급                   │
│  5. [Get Code] → Python/JS/curl 코드 생성         │
└─────────────────────────────────────────────────┘
```

> "AI Studio에서 프롬프트를 충분히 테스트한 후에 코드로 옮기세요. 프롬프트 엔지니어링에 투자한 시간이 API 비용을 절약합니다" — 실사용자 조언

#### 4.2 Gemini API 호출 — Python SDK

```bash
# SDK 설치
pip install google-generativeai
```

```python
import google.generativeai as genai

# API 키 설정
genai.configure(api_key="YOUR_API_KEY")

# 모델 선택
model = genai.GenerativeModel('gemini-2.0-flash')

# === 기본 텍스트 생성 ===
response = model.generate_content("Python의 GIL을 초보자에게 설명해주세요")
print(response.text)

# === 파라미터 조정 ===
generation_config = genai.GenerationConfig(
    temperature=0.7,
    top_p=0.95,
    top_k=40,
    max_output_tokens=2048,
)

response = model.generate_content(
    "마이크로서비스 아키텍처의 장단점을 표로 정리해주세요",
    generation_config=generation_config,
)
print(response.text)
```

#### 4.3 Gemini API 호출 — JavaScript SDK

```bash
# SDK 설치
npm install @google/generative-ai
```

```javascript
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI('YOUR_API_KEY');

async function generateText() {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // 기본 텍스트 생성
    const result = await model.generateContent(
        'Node.js의 이벤트 루프를 설명해주세요'
    );
    console.log(result.response.text());
}

async function chatSession() {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // 대화형 세션
    const chat = model.startChat({
        history: [
            { role: 'user', parts: [{ text: '나는 Python 개발자입니다' }] },
            { role: 'model', parts: [{ text: '안녕하세요! Python에 대해 도움을 드리겠습니다.' }] },
        ],
        generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
        },
    });

    const result = await chat.sendMessage('FastAPI와 Django 중 어떤 것을 추천하나요?');
    console.log(result.response.text());
}

generateText().catch(console.error);
```

#### 4.4 모델 선택 가이드

| 모델 | 속도 | 품질 | 비용 | 적합한 용도 |
|------|------|------|------|------------|
| **Gemini 2.0 Flash** | 매우 빠름 | 좋음 | 매우 저렴 | 분류, 요약, 간단한 생성 |
| **Gemini 2.0 Pro** | 보통 | 우수 | 보통 | 복잡한 추론, 코드 생성 |
| **Gemini Ultra** | 느림 | 최고 | 높음 | 고난도 분석, 멀티모달 |
| **Gemini Flash Lite** | 가장 빠름 | 기본 | 최저 | 대량 처리, 실시간 응답 |

> "대부분의 프로덕션 워크로드에는 Flash 모델이면 충분합니다. Pro나 Ultra는 복잡한 추론이 필요한 경우에만 사용하세요. 비용 차이가 10배 이상 납니다" — 실사용자 경험

#### 4.5 멀티모달 — 이미지/비디오/오디오 입력

```python
import google.generativeai as genai
from pathlib import Path

genai.configure(api_key="YOUR_API_KEY")
model = genai.GenerativeModel('gemini-2.0-flash')

# === 이미지 분석 ===
image_path = Path("screenshot.png")
image_data = image_path.read_bytes()

response = model.generate_content([
    "이 UI 스크린샷을 분석해주세요. 개선할 점을 알려주세요.",
    {"mime_type": "image/png", "data": image_data}
])
print(response.text)

# === 여러 이미지 비교 ===
img1 = Path("design_v1.png").read_bytes()
img2 = Path("design_v2.png").read_bytes()

response = model.generate_content([
    "두 디자인을 비교 분석해주세요. 어떤 것이 더 사용성이 좋은지 평가해주세요.",
    {"mime_type": "image/png", "data": img1},
    {"mime_type": "image/png", "data": img2}
])
print(response.text)

# === PDF 분석 ===
pdf_data = Path("report.pdf").read_bytes()

response = model.generate_content([
    "이 PDF 보고서의 핵심 내용을 3줄로 요약해주세요.",
    {"mime_type": "application/pdf", "data": pdf_data}
])
print(response.text)
```

#### 4.6 Function Calling

Function Calling은 모델이 외부 함수를 호출할 수 있게 하는 기능입니다.

```python
import google.generativeai as genai

genai.configure(api_key="YOUR_API_KEY")

# 1. 함수 정의
def get_weather(city: str, unit: str = "celsius") -> dict:
    """지정한 도시의 현재 날씨를 조회합니다."""
    weather_data = {
        "서울": {"temp": 12, "condition": "맑음", "humidity": 45},
        "부산": {"temp": 15, "condition": "흐림", "humidity": 60},
    }
    return weather_data.get(city, {"temp": 0, "condition": "알 수 없음", "humidity": 0})

def search_products(query: str, max_results: int = 5) -> list:
    """제품을 검색합니다."""
    return [{"name": f"{query} 제품 {i}", "price": 10000 * i} for i in range(1, max_results + 1)]

# 2. 모델에 함수 등록
model = genai.GenerativeModel(
    model_name='gemini-2.0-flash',
    tools=[get_weather, search_products]
)

# 3. 자동 Function Calling
chat = model.start_chat(enable_automatic_function_calling=True)

response = chat.send_message("서울 날씨가 어때?")
print(response.text)
# 출력: "서울의 현재 날씨는 맑으며, 기온은 12도, 습도는 45%입니다."

response = chat.send_message("노트북 검색해줘, 3개만")
print(response.text)
```

#### 4.7 Structured Output — JSON 스키마 출력

```python
import google.generativeai as genai
from pydantic import BaseModel
from typing import List

genai.configure(api_key="YOUR_API_KEY")

# Pydantic 모델로 출력 스키마 정의
class CodeReview(BaseModel):
    file_name: str
    language: str
    issues: List[dict]
    overall_score: int  # 1~10
    summary: str
    suggestions: List[str]

model = genai.GenerativeModel('gemini-2.0-flash')

code_snippet = """
def calc(x,y):
    r=x+y
    print(r)
    return r

calc(1,2)
"""

response = model.generate_content(
    f"다음 코드를 리뷰해주세요:\n```python\n{code_snippet}\n```",
    generation_config=genai.GenerationConfig(
        response_mime_type="application/json",
        response_schema=CodeReview,
    ),
)

review = CodeReview.model_validate_json(response.text)
print(f"점수: {review.overall_score}/10")
print(f"요약: {review.summary}")
for suggestion in review.suggestions:
    print(f"  - {suggestion}")
```

#### 4.8 스트리밍 응답

```python
import google.generativeai as genai

genai.configure(api_key="YOUR_API_KEY")
model = genai.GenerativeModel('gemini-2.0-flash')

# 스트리밍 — 토큰 단위로 실시간 출력
response = model.generate_content(
    "Google Cloud의 주요 서비스 10가지를 설명해주세요",
    stream=True
)

for chunk in response:
    print(chunk.text, end="", flush=True)

print()  # 줄바꿈
```

```javascript
// JavaScript 스트리밍
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI('YOUR_API_KEY');

async function streamResponse() {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const result = await model.generateContentStream(
        'Cloud Functions vs Cloud Run 비교를 해주세요'
    );

    for await (const chunk of result.stream) {
        const text = chunk.text();
        process.stdout.write(text);
    }
    console.log();
}

streamResponse().catch(console.error);
```

#### 4.9 System Instructions와 Safety Settings

```python
import google.generativeai as genai

genai.configure(api_key="YOUR_API_KEY")

# System Instruction으로 모델 행동 지정
model = genai.GenerativeModel(
    model_name='gemini-2.0-flash',
    system_instruction="""당신은 GCP 전문 컨설턴트입니다.
    - 항상 한국어로 답변합니다
    - 비용 최적화를 항상 고려합니다
    - 보안 모범 사례를 반드시 언급합니다
    - 코드 예제는 Python으로 제공합니다
    - 답변 마지막에 예상 비용을 안내합니다""",
    safety_settings={
        'HARM_CATEGORY_HARASSMENT': 'BLOCK_ONLY_HIGH',
        'HARM_CATEGORY_HATE_SPEECH': 'BLOCK_ONLY_HIGH',
        'HARM_CATEGORY_SEXUALLY_EXPLICIT': 'BLOCK_ONLY_HIGH',
        'HARM_CATEGORY_DANGEROUS_CONTENT': 'BLOCK_ONLY_HIGH',
    }
)

response = model.generate_content(
    "Cloud SQL vs Firestore vs BigQuery 중 어떤 것을 선택해야 하나요?"
)
print(response.text)
```

#### 4.10 비용 최적화

| 전략 | 설명 | 절감 효과 |
|------|------|----------|
| **모델 선택** | Flash를 먼저 시도, 필요 시 Pro/Ultra | 5~20배 |
| **캐싱** | 동일 요청은 캐시 활용 | 100% (재호출 없음) |
| **프롬프트 최적화** | 불필요한 지시 제거, 간결하게 | 20~50% |
| **배치 처리** | 여러 항목을 한 번에 처리 | 30~60% |
| **토큰 제한** | max_output_tokens 적절히 설정 | 가변적 |
| **컨텍스트 캐싱** | 긴 컨텍스트 재사용 시 캐싱 | 최대 75% |

```python
# 비용 최적화 — 토큰 사용량 확인
response = model.generate_content("GCP 비용 절감 팁 5가지")

# 토큰 사용량 확인
print(f"입력 토큰: {response.usage_metadata.prompt_token_count}")
print(f"출력 토큰: {response.usage_metadata.candidates_token_count}")
print(f"총 토큰: {response.usage_metadata.total_token_count}")
```

### 실습 과제: 문서 요약 서비스

> Gemini API를 사용하여 텍스트 파일이나 PDF를 입력받아 요약하는 서비스를 구현하세요.

```python
import google.generativeai as genai
from pathlib import Path
import json

genai.configure(api_key="YOUR_API_KEY")

class DocumentSummarizer:
    def __init__(self, model_name='gemini-2.0-flash'):
        self.model = genai.GenerativeModel(
            model_name=model_name,
            system_instruction="당신은 문서 요약 전문가입니다. 핵심 내용을 구조적으로 요약합니다."
        )

    def summarize_text(self, text, style="bullet"):
        """텍스트 요약"""
        prompts = {
            "bullet": "다음 텍스트를 핵심 포인트 5개로 요약해주세요:\n\n",
            "paragraph": "다음 텍스트를 3문장으로 요약해주세요:\n\n",
            "executive": "다음 텍스트를 경영진 보고서 형식으로 요약해주세요 (배경/핵심/제안):\n\n",
        }
        prompt = prompts.get(style, prompts["bullet"]) + text
        response = self.model.generate_content(prompt)
        return response.text

    def summarize_file(self, file_path):
        """파일 요약 (텍스트, PDF 지원)"""
        path = Path(file_path)
        suffix = path.suffix.lower()

        if suffix == '.pdf':
            data = path.read_bytes()
            response = self.model.generate_content([
                "이 문서를 한국어로 요약해주세요. 핵심 포인트, 주요 수치, 결론을 포함해주세요.",
                {"mime_type": "application/pdf", "data": data}
            ])
        elif suffix in ['.txt', '.md', '.csv']:
            text = path.read_text(encoding='utf-8')
            response = self.model.generate_content(
                f"다음 내용을 요약해주세요:\n\n{text}"
            )
        else:
            raise ValueError(f"지원하지 않는 파일 형식: {suffix}")

        return response.text

    def batch_summarize(self, texts):
        """여러 텍스트 배치 요약 (비용 최적화)"""
        combined = "\n\n---\n\n".join(
            [f"[문서 {i+1}]\n{text}" for i, text in enumerate(texts)]
        )
        prompt = f"다음 {len(texts)}개 문서를 각각 1문장으로 요약해주세요:\n\n{combined}"

        response = self.model.generate_content(
            prompt,
            generation_config=genai.GenerationConfig(
                response_mime_type="application/json",
                response_schema={
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "document_number": {"type": "integer"},
                            "summary": {"type": "string"},
                            "keywords": {"type": "array", "items": {"type": "string"}}
                        }
                    }
                }
            )
        )
        return json.loads(response.text)

# 사용 예시
summarizer = DocumentSummarizer()

# 텍스트 요약
summary = summarizer.summarize_text(
    "Google Cloud Platform은 2008년에 시작되어...",
    style="executive"
)
print(summary)

# 파일 요약
summary = summarizer.summarize_file("report.pdf")
print(summary)
```

---

## 5. Cloud Functions

### 학습 목표

- 서버리스 컴퓨팅의 개념과 Cloud Functions의 아키텍처를 이해한다
- HTTP, Pub/Sub, Cloud Storage 트리거로 함수를 구현한다
- Functions Framework으로 로컬에서 개발/테스트하고 GCP에 배포한다

### 상세 설명

#### 5.1 서버리스 개념

```
전통적 서버 vs 서버리스

전통적 서버                          서버리스 (Cloud Functions)
┌──────────────┐                   ┌──────────────┐
│ 서버 프로비저닝 │ ← 직접 관리      │              │
│ OS 패치       │ ← 직접 관리      │  코드만 작성   │ ← 개발자 관리
│ 런타임 설치   │ ← 직접 관리      │              │
│ 스케일링 설정  │ ← 직접 관리      └──────────────┘
│ 코드 배포     │ ← 직접 관리      ┌──────────────┐
│ 모니터링      │ ← 직접 관리      │ 인프라 자동 관리│ ← Google 관리
└──────────────┘                   │ 자동 스케일링  │
                                   │ 사용한 만큼 과금│
과금: 24/7 서버 비용                │ 패치/보안 자동  │
                                   └──────────────┘
                                   과금: 호출 횟수 + 실행 시간
```

| 항목 | Cloud Functions | Cloud Run | Compute Engine |
|------|----------------|-----------|----------------|
| **추상화 수준** | 함수 단위 | 컨테이너 단위 | VM 단위 |
| **스케일링** | 0에서 자동 | 0에서 자동 | 수동/자동 |
| **실행 시간 제한** | 9분 (1세대) / 60분 (2세대) | 60분 | 무제한 |
| **콜드 스타트** | 있음 | 있음 (더 길 수 있음) | 없음 |
| **비용** | 호출당 과금 | 요청당 + vCPU/메모리 | 시간당 과금 |
| **적합한 용도** | 이벤트 처리, API | API, 웹앱 | 장시간 작업 |

#### 5.2 Cloud Functions 2nd gen 아키텍처

```
Cloud Functions 2nd gen

이벤트 소스                 Cloud Functions           백엔드 서비스
┌──────────┐              ┌─────────────┐           ┌──────────┐
│ HTTP 요청 │──────────────▶│             │──────────▶│ Firestore│
│ Pub/Sub  │──── Eventarc ▶│  함수 코드   │──────────▶│ BigQuery │
│ Storage  │──────────────▶│  (Node/Py)  │──────────▶│ Cloud SQL│
│ Firestore│──────────────▶│             │──────────▶│ API 호출  │
│ Scheduler│──────────────▶│             │──────────▶│ Pub/Sub  │
└──────────┘              └─────────────┘           └──────────┘
                                │
                          Cloud Run 기반
                          (자동 스케일링)
```

#### 5.3 HTTP 트리거 함수 — Python

```python
# main.py — HTTP 트리거 Cloud Function (Python)
import functions_framework
from flask import jsonify, request
import google.generativeai as genai
import os

genai.configure(api_key=os.environ.get('GEMINI_API_KEY'))

@functions_framework.http
def analyze_text(request):
    """텍스트 분석 API 엔드포인트"""

    # CORS 처리
    if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }
        return ('', 204, headers)

    cors_headers = {'Access-Control-Allow-Origin': '*'}

    try:
        data = request.get_json()

        if not data or 'text' not in data:
            return jsonify({'error': 'text 필드가 필요합니다'}), 400, cors_headers

        text = data['text']
        analysis_type = data.get('type', 'summary')

        model = genai.GenerativeModel('gemini-2.0-flash')

        prompts = {
            'summary': f'다음 텍스트를 3문장으로 요약해주세요:\n{text}',
            'sentiment': f'다음 텍스트의 감성을 분석해주세요 (긍정/부정/중립):\n{text}',
            'keywords': f'다음 텍스트에서 핵심 키워드 5개를 추출해주세요:\n{text}',
        }

        prompt = prompts.get(analysis_type, prompts['summary'])
        response = model.generate_content(prompt)

        return jsonify({
            'result': response.text,
            'type': analysis_type,
            'tokens': response.usage_metadata.total_token_count
        }), 200, cors_headers

    except Exception as e:
        return jsonify({'error': str(e)}), 500, cors_headers
```

```
# requirements.txt
functions-framework==3.*
google-generativeai>=0.5.0
flask>=2.0
```

```bash
# 로컬 테스트
functions-framework --target=analyze_text --debug

# curl 테스트
curl -X POST http://localhost:8080 \
  -H "Content-Type: application/json" \
  -d '{"text": "오늘 GCP 세미나가 매우 유익했습니다", "type": "sentiment"}'

# GCP에 배포
gcloud functions deploy analyze-text \
  --gen2 \
  --runtime=python312 \
  --region=asia-northeast3 \
  --source=. \
  --entry-point=analyze_text \
  --trigger-http \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=your-key-here \
  --memory=256Mi \
  --timeout=60s
```

#### 5.4 HTTP 트리거 함수 — Node.js

```javascript
// index.js — HTTP 트리거 Cloud Function (Node.js)
const functions = require('@google-cloud/functions-framework');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

functions.http('analyzeText', async (req, res) => {
    // CORS
    res.set('Access-Control-Allow-Origin', '*');
    if (req.method === 'OPTIONS') {
        res.set('Access-Control-Allow-Methods', 'POST');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.status(204).send('');
        return;
    }

    try {
        const { text, type = 'summary' } = req.body;

        if (!text) {
            res.status(400).json({ error: 'text 필드가 필요합니다' });
            return;
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const prompts = {
            summary: `다음 텍스트를 요약해주세요:\n${text}`,
            sentiment: `감성 분석을 해주세요:\n${text}`,
            keywords: `키워드 5개를 추출해주세요:\n${text}`,
        };

        const result = await model.generateContent(prompts[type] || prompts.summary);

        res.json({
            result: result.response.text(),
            type,
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});
```

#### 5.5 Pub/Sub 트리거

```python
# Pub/Sub 트리거 — 비동기 메시지 처리
import functions_framework
import base64
import json
from google.cloud import firestore

db = firestore.Client()

@functions_framework.cloud_event
def process_message(cloud_event):
    """Pub/Sub 메시지를 수신하여 Firestore에 저장"""

    message_data = base64.b64decode(cloud_event.data["message"]["data"]).decode()
    data = json.loads(message_data)

    print(f"수신된 메시지: {data}")

    doc_ref = db.collection('events').document()
    doc_ref.set({
        'type': data.get('type', 'unknown'),
        'payload': data,
        'processed_at': firestore.SERVER_TIMESTAMP,
        'event_id': cloud_event['id'],
    })

    print(f"Firestore 저장 완료: {doc_ref.id}")
```

```bash
# Pub/Sub 트리거 배포
gcloud functions deploy process-message \
  --gen2 \
  --runtime=python312 \
  --region=asia-northeast3 \
  --source=. \
  --entry-point=process_message \
  --trigger-topic=my-topic

# 테스트 — 메시지 발행
gcloud pubsub topics publish my-topic \
  --message='{"type": "user_signup", "user_id": "user123"}'
```

#### 5.6 Cloud Storage 트리거

```python
# Cloud Storage 트리거 — 파일 업로드 시 자동 처리
import functions_framework
from google.cloud import storage, vision

@functions_framework.cloud_event
def process_image(cloud_event):
    """Cloud Storage에 이미지 업로드 시 자동으로 라벨 감지"""

    data = cloud_event.data
    bucket_name = data["bucket"]
    file_name = data["name"]

    if not file_name.lower().endswith(('.png', '.jpg', '.jpeg', '.gif')):
        print(f"이미지가 아닌 파일 건너뜀: {file_name}")
        return

    print(f"이미지 처리 시작: gs://{bucket_name}/{file_name}")

    client = vision.ImageAnnotatorClient()
    image = vision.Image(
        source=vision.ImageSource(
            gcs_image_uri=f"gs://{bucket_name}/{file_name}"
        )
    )

    response = client.label_detection(image=image)
    labels = [label.description for label in response.label_annotations]

    print(f"감지된 라벨: {labels}")

    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(file_name)
    blob.metadata = {"labels": ",".join(labels)}
    blob.patch()
```

#### 5.7 로컬 개발과 배포

```bash
# Functions Framework 설치
pip install functions-framework

# 로컬 실행 (HTTP 트리거)
functions-framework --target=analyze_text --debug --port=8080

# 환경변수 파일로 관리
cat > .env.yaml << 'EOF'
GEMINI_API_KEY: "your-key"
PROJECT_ID: "my-project"
DATABASE_URL: "firestore"
EOF

# 배포 시 환경변수 파일 사용
gcloud functions deploy my-function \
  --gen2 \
  --runtime=python312 \
  --region=asia-northeast3 \
  --source=. \
  --entry-point=my_function \
  --trigger-http \
  --env-vars-file=.env.yaml

# Secret Manager로 민감 정보 관리
gcloud secrets create GEMINI_API_KEY --data-file=- <<< "your-actual-key"

gcloud functions deploy my-function \
  --gen2 \
  --set-secrets="GEMINI_API_KEY=GEMINI_API_KEY:latest"
```

### 실습 과제: HTTP API 엔드포인트

> Gemini API를 활용한 텍스트 분석 Cloud Function을 작성하고, 로컬에서 테스트한 후 GCP에 배포하세요.

```bash
# 프로젝트 구조
mkdir text-analyzer && cd text-analyzer

# 1. 로컬 테스트
functions-framework --target=analyze_text --debug

# 2. 테스트 요청
curl -X POST http://localhost:8080 \
  -H "Content-Type: application/json" \
  -d '{"text": "Google Cloud Functions는 서버리스 컴퓨팅 서비스입니다", "type": "summary"}'

# 3. GCP 배포
gcloud functions deploy analyze-text \
  --gen2 \
  --runtime=python312 \
  --region=asia-northeast3 \
  --source=. \
  --entry-point=analyze_text \
  --trigger-http \
  --allow-unauthenticated \
  --memory=512Mi

# 4. 배포된 함수 URL 확인
gcloud functions describe analyze-text \
  --gen2 \
  --region=asia-northeast3 \
  --format="value(serviceConfig.uri)"
```

---

## 6. BigQuery & 데이터 분석

### 학습 목표

- BigQuery의 아키텍처와 데이터 모델(데이터셋/테이블)을 이해한다
- 표준 SQL로 대규모 데이터를 분석하고 공개 데이터셋을 활용한다
- Connected Sheets와 Looker Studio로 시각화 대시보드를 구축한다

### 상세 설명

#### 6.1 BigQuery란?

BigQuery는 Google의 완전 관리형 서버리스 데이터 웨어하우스입니다. 페타바이트 규모의 데이터를 초 단위로 분석할 수 있습니다.

```
BigQuery 아키텍처

데이터 소스                    BigQuery                    분석/시각화
┌──────────┐              ┌──────────────────┐         ┌──────────────┐
│ CSV/JSON │──── 로드 ────▶│  데이터셋         │         │ Looker Studio│
│ Sheets   │──── 연결 ────▶│  ├── 테이블 A    │── SQL ──▶│ Connected    │
│ Cloud    │──── 스트림 ──▶│  ├── 테이블 B    │── API ──▶│  Sheets      │
│ Storage  │              │  ├── 뷰 (View)   │         │ Python/JS    │
│ Pub/Sub  │──── 구독 ────▶│  └── ML 모델    │         └──────────────┘
└──────────┘              │  Dremel 엔진     │
                          │  (컬럼나 스토리지) │
                          └──────────────────┘
                          비용: 저장 $0.02/GB/월
                               쿼리 $5/TB 처리
```

| 특징 | 설명 |
|------|------|
| **서버리스** | 인프라 관리 불필요, 쿼리 실행 시 자동 스케일링 |
| **컬럼나 저장** | 열 기반 저장으로 분석 쿼리 최적화 |
| **표준 SQL** | ANSI SQL 지원, 기존 SQL 지식 활용 가능 |
| **무료 할당량** | 매월 1TB 쿼리 처리 + 10GB 저장 무료 |
| **공개 데이터셋** | 200개 이상 공개 데이터셋 무료 제공 |

#### 6.2 데이터셋과 테이블

```bash
# BigQuery CLI (bq)

# 데이터셋 생성
bq mk --dataset --location=asia-northeast3 my_project:analytics

# CSV에서 테이블 생성
bq load --autodetect \
  --source_format=CSV \
  analytics.sales_data \
  gs://my-bucket/sales_2026.csv

# 테이블 스키마 확인
bq show analytics.sales_data

# 테이블 목록
bq ls analytics
```

```python
# Python으로 BigQuery 테이블 생성 및 데이터 로드
from google.cloud import bigquery

client = bigquery.Client()

# 데이터셋 생성
dataset_id = f"{client.project}.analytics"
dataset = bigquery.Dataset(dataset_id)
dataset.location = "asia-northeast3"
dataset = client.create_dataset(dataset, exists_ok=True)
print(f"데이터셋 생성: {dataset_id}")

# 스키마 정의
schema = [
    bigquery.SchemaField("id", "INTEGER", mode="REQUIRED"),
    bigquery.SchemaField("name", "STRING", mode="REQUIRED"),
    bigquery.SchemaField("email", "STRING", mode="NULLABLE"),
    bigquery.SchemaField("department", "STRING", mode="NULLABLE"),
    bigquery.SchemaField("salary", "FLOAT", mode="NULLABLE"),
    bigquery.SchemaField("hire_date", "DATE", mode="NULLABLE"),
    bigquery.SchemaField("is_active", "BOOLEAN", mode="NULLABLE"),
]

# 테이블 생성
table_id = f"{dataset_id}.employees"
table = bigquery.Table(table_id, schema=schema)
table = client.create_table(table, exists_ok=True)
print(f"테이블 생성: {table_id}")

# 데이터 삽입
rows = [
    {"id": 1, "name": "김개발", "email": "dev@ex.com",
     "department": "개발", "salary": 5000,
     "hire_date": "2025-01-15", "is_active": True},
    {"id": 2, "name": "이디자인", "email": "design@ex.com",
     "department": "디자인", "salary": 4500,
     "hire_date": "2025-03-01", "is_active": True},
]

errors = client.insert_rows_json(table_id, rows)
if not errors:
    print(f"{len(rows)}개 행 삽입 완료")
```

#### 6.3 표준 SQL 쿼리

```sql
-- === BigQuery 표준 SQL 예제 ===

-- 1. 기본 집계
SELECT
    department,
    COUNT(*) AS employee_count,
    AVG(salary) AS avg_salary,
    MAX(salary) AS max_salary,
    MIN(salary) AS min_salary
FROM `my_project.analytics.employees`
WHERE is_active = TRUE
GROUP BY department
ORDER BY avg_salary DESC;

-- 2. 윈도우 함수
SELECT
    name,
    department,
    salary,
    RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS dept_rank,
    salary - AVG(salary) OVER (PARTITION BY department) AS diff_from_avg
FROM `my_project.analytics.employees`;

-- 3. 날짜 함수
SELECT
    name,
    hire_date,
    DATE_DIFF(CURRENT_DATE(), hire_date, DAY) AS days_employed,
    DATE_DIFF(CURRENT_DATE(), hire_date, MONTH) AS months_employed,
    FORMAT_DATE('%Y년 %m월', hire_date) AS hire_month
FROM `my_project.analytics.employees`
ORDER BY hire_date;

-- 4. CTE (Common Table Expression)
WITH monthly_stats AS (
    SELECT
        FORMAT_DATE('%Y-%m', order_date) AS month,
        SUM(amount) AS total_sales,
        COUNT(DISTINCT customer_id) AS unique_customers
    FROM `my_project.analytics.orders`
    GROUP BY month
),
growth AS (
    SELECT
        month,
        total_sales,
        unique_customers,
        LAG(total_sales) OVER (ORDER BY month) AS prev_month_sales,
        SAFE_DIVIDE(
            total_sales - LAG(total_sales) OVER (ORDER BY month),
            LAG(total_sales) OVER (ORDER BY month)
        ) * 100 AS growth_rate
    FROM monthly_stats
)
SELECT * FROM growth
ORDER BY month DESC
LIMIT 12;
```

#### 6.4 공개 데이터셋 활용

```sql
-- BigQuery 공개 데이터셋 활용 예제

-- GitHub 활동 분석 — 가장 인기 있는 프로그래밍 언어
SELECT
    language.name AS language,
    COUNT(DISTINCT repo_name) AS repo_count
FROM `bigquery-public-data.github_repos.languages`,
    UNNEST(language) AS language
GROUP BY language
ORDER BY repo_count DESC
LIMIT 20;
```

#### 6.5 Sheets 연동 (Connected Sheets)

```
Connected Sheets 워크플로

Google Sheets                          BigQuery
┌──────────────────┐                 ┌──────────────┐
│ 데이터 메뉴       │                 │              │
│ └─ 데이터 커넥터  │ ──── 연결 ────▶ │ 데이터셋      │
│    └─ BigQuery   │                 │ ├── 테이블    │
│                  │ ◀─── 결과 ────  │ └── 뷰       │
│ ┌──────────────┐ │                 │              │
│ │ 피벗 테이블    │ │                 │ SQL 실행     │
│ │ 차트         │ │                 │ (서버에서)    │
│ └──────────────┘ │                 │              │
└──────────────────┘                 └──────────────┘
장점: BigQuery 성능 + Sheets 편의성
```

#### 6.6 Python에서 BigQuery 쿼리

```python
from google.cloud import bigquery
import pandas as pd

client = bigquery.Client()

# SQL 쿼리 실행 → Pandas DataFrame
query = """
SELECT
    language.name AS language,
    COUNT(*) AS repo_count,
    SUM(language.bytes) AS total_bytes
FROM `bigquery-public-data.github_repos.languages`,
    UNNEST(language) AS language
GROUP BY language
ORDER BY repo_count DESC
LIMIT 20
"""

df = client.query(query).to_dataframe()
print(df.to_string(index=False))

# 쿼리 비용 예측 (Dry Run)
job_config = bigquery.QueryJobConfig(dry_run=True, use_query_cache=False)
query_job = client.query(query, job_config=job_config)
bytes_processed = query_job.total_bytes_processed
print(f"예상 처리량: {bytes_processed / 1e9:.2f} GB")
print(f"예상 비용: ${bytes_processed / 1e12 * 5:.4f}")
```

#### 6.7 BigQuery ML

```sql
-- BigQuery ML — SQL로 머신러닝 모델 학습

-- 1. 모델 생성 (선형 회귀)
CREATE OR REPLACE MODEL `analytics.salary_predictor`
OPTIONS(
    model_type='LINEAR_REG',
    input_label_cols=['salary']
) AS
SELECT
    department,
    DATE_DIFF(CURRENT_DATE(), hire_date, MONTH) AS months_employed,
    is_active,
    salary
FROM `analytics.employees`;

-- 2. 모델 평가
SELECT * FROM ML.EVALUATE(MODEL `analytics.salary_predictor`);

-- 3. 예측
SELECT
    predicted_salary,
    department,
    months_employed
FROM ML.PREDICT(
    MODEL `analytics.salary_predictor`,
    (SELECT '개발' AS department, 24 AS months_employed, TRUE AS is_active)
);
```

#### 6.8 비용 관리

| 전략 | 설명 | 절감 효과 |
|------|------|----------|
| **파티셔닝** | 날짜/정수 기준 파티션으로 스캔 범위 축소 | 50~90% |
| **클러스터링** | 자주 필터링하는 열 기준 정렬 | 20~50% |
| **SELECT 명시** | SELECT * 대신 필요한 열만 선택 | 30~80% |
| **캐시 활용** | 동일 쿼리 24시간 캐시 (무료) | 100% |
| **Dry Run** | 실행 전 비용 확인 | 예방적 |

```sql
-- 파티셔닝 + 클러스터링 테이블 생성
CREATE TABLE `analytics.events_optimized`
PARTITION BY DATE(event_timestamp)
CLUSTER BY user_id, event_name
AS
SELECT * FROM `analytics.events_raw`;
```

### 실습 과제: 공개 데이터 분석 대시보드

> BigQuery 공개 데이터셋을 활용하여 데이터를 분석하고, Python으로 결과를 출력하세요.

```python
from google.cloud import bigquery

client = bigquery.Client()

# GitHub 공개 데이터셋 — 프로그래밍 언어 트렌드
query = """
WITH yearly_commits AS (
    SELECT
        EXTRACT(YEAR FROM author.date) AS year,
        CASE
            WHEN ENDS_WITH(difference.new_path, '.py') THEN 'Python'
            WHEN ENDS_WITH(difference.new_path, '.js') THEN 'JavaScript'
            WHEN ENDS_WITH(difference.new_path, '.ts') THEN 'TypeScript'
            WHEN ENDS_WITH(difference.new_path, '.go') THEN 'Go'
            WHEN ENDS_WITH(difference.new_path, '.rs') THEN 'Rust'
            ELSE 'Other'
        END AS language
    FROM `bigquery-public-data.github_repos.commits`,
        UNNEST(difference) AS difference
    WHERE EXTRACT(YEAR FROM author.date) BETWEEN 2020 AND 2025
)
SELECT
    year,
    language,
    COUNT(*) AS commit_count
FROM yearly_commits
WHERE language != 'Other'
GROUP BY year, language
ORDER BY year, commit_count DESC
"""

df = client.query(query).to_dataframe()

# 결과 출력
pivot = df.pivot(index='year', columns='language', values='commit_count')
print("=== 프로그래밍 언어별 연간 커밋 수 ===")
print(pivot.to_string())
```

---

## 7. Firebase 통합

### 학습 목표

- Firebase의 핵심 서비스(Authentication, Firestore, Hosting)를 이해한다
- Cloud Firestore의 CRUD 작업과 실시간 리스너, 보안 규칙을 구현한다
- Firebase Hosting과 Cloud Functions를 통합하여 풀스택 앱을 배포한다

### 상세 설명

#### 7.1 Firebase란?

Firebase는 Google의 앱 개발 플랫폼으로, 백엔드 인프라를 코드 없이 구축할 수 있습니다.

```
Firebase 서비스 맵

┌─────────────────────────────────────────────────┐
│                   Firebase                       │
│                                                  │
│  빌드 (Build)                                     │
│  ├── Authentication — 사용자 인증                  │
│  ├── Cloud Firestore — NoSQL 데이터베이스          │
│  ├── Realtime Database — 실시간 JSON DB           │
│  ├── Cloud Storage — 파일 저장                    │
│  ├── Hosting — 정적 사이트 + Cloud Functions       │
│  └── Cloud Functions — 서버리스 백엔드             │
│                                                  │
│  성장 (Grow)                                      │
│  ├── Analytics — 앱 분석                          │
│  ├── Cloud Messaging — 푸시 알림                  │
│  ├── Remote Config — 원격 설정                    │
│  └── A/B Testing — 실험                          │
│                                                  │
│  품질 (Quality)                                   │
│  ├── Crashlytics — 충돌 보고                      │
│  ├── Performance Monitoring — 성능 모니터링        │
│  └── Test Lab — 디바이스 테스트                    │
└─────────────────────────────────────────────────┘
```

#### 7.2 Authentication — 사용자 인증

```javascript
// Firebase Authentication — 웹 (v9 모듈러 SDK)
import { initializeApp } from 'firebase/app';
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    onAuthStateChanged,
    signOut
} from 'firebase/auth';

// Firebase 설정
const firebaseConfig = {
    apiKey: "AIzaSy...",
    authDomain: "my-project.firebaseapp.com",
    projectId: "my-project",
    storageBucket: "my-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abc123"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// === 이메일/비밀번호 가입 ===
async function signUp(email, password) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log('가입 성공:', userCredential.user.uid);
        return userCredential.user;
    } catch (error) {
        console.error('가입 실패:', error.code, error.message);
        throw error;
    }
}

// === 이메일/비밀번호 로그인 ===
async function signIn(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log('로그인 성공:', userCredential.user.email);
        return userCredential.user;
    } catch (error) {
        console.error('로그인 실패:', error.code);
        throw error;
    }
}

// === Google 소셜 로그인 ===
async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');

    try {
        const result = await signInWithPopup(auth, provider);
        console.log('Google 로그인:', result.user.displayName);
        return result.user;
    } catch (error) {
        console.error('Google 로그인 실패:', error.code);
        throw error;
    }
}

// === 인증 상태 감지 ===
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log('로그인 상태:', user.email);
    } else {
        console.log('로그아웃 상태');
    }
});

// === 로그아웃 ===
async function logout() {
    await signOut(auth);
    console.log('로그아웃 완료');
}
```

#### 7.3 Cloud Firestore — CRUD와 실시간 리스너

```javascript
import { getFirestore, collection, doc, addDoc, getDoc, getDocs,
         updateDoc, deleteDoc, query, where, orderBy, limit,
         onSnapshot, serverTimestamp } from 'firebase/firestore';

const db = getFirestore(app);

// === CREATE — 문서 추가 ===
async function addMember(data) {
    const docRef = await addDoc(collection(db, 'members'), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    });
    console.log('추가 완료, ID:', docRef.id);
    return docRef.id;
}

// === READ — 단일 문서 조회 ===
async function getMember(id) {
    const docSnap = await getDoc(doc(db, 'members', id));
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
}

// === READ — 쿼리 조회 ===
async function getActiveMembers(department) {
    const q = query(
        collection(db, 'members'),
        where('isActive', '==', true),
        where('department', '==', department),
        orderBy('createdAt', 'desc'),
        limit(20)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
}

// === UPDATE — 문서 수정 ===
async function updateMember(id, data) {
    await updateDoc(doc(db, 'members', id), {
        ...data,
        updatedAt: serverTimestamp()
    });
    console.log('수정 완료:', id);
}

// === DELETE — 문서 삭제 ===
async function deleteMember(id) {
    await deleteDoc(doc(db, 'members', id));
    console.log('삭제 완료:', id);
}

// === 실시간 리스너 — 데이터 변경 시 자동 업데이트 ===
function listenToMessages(chatRoomId, callback) {
    const q = query(
        collection(db, 'chatRooms', chatRoomId, 'messages'),
        orderBy('createdAt', 'asc')
    );

    // 실시간 구독 — 데이터 변경 시 callback 호출
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const messages = [];
        snapshot.docChanges().forEach((change) => {
            if (change.type === 'added') {
                messages.push({ id: change.doc.id, ...change.doc.data() });
            }
        });
        callback(messages);
    });

    return unsubscribe;  // 구독 해제 함수 반환
}
```

```python
# Python — Firestore Admin SDK (서버 사이드)
from google.cloud import firestore

db = firestore.Client()

# 문서 추가
doc_ref = db.collection('members').document()
doc_ref.set({
    'name': '김개발',
    'email': 'dev@example.com',
    'department': '개발팀',
    'is_active': True,
    'created_at': firestore.SERVER_TIMESTAMP
})
print(f"추가 완료: {doc_ref.id}")

# 쿼리 조회
members_ref = db.collection('members')
query = members_ref.where('department', '==', '개발팀') \
                    .where('is_active', '==', True) \
                    .order_by('created_at', direction=firestore.Query.DESCENDING) \
                    .limit(10)

for doc in query.stream():
    print(f"{doc.id} => {doc.to_dict()}")

# 트랜잭션
@firestore.transactional
def transfer_points(transaction, from_id, to_id, amount):
    from_ref = db.collection('users').document(from_id)
    to_ref = db.collection('users').document(to_id)

    from_doc = from_ref.get(transaction=transaction)
    to_doc = to_ref.get(transaction=transaction)

    from_points = from_doc.get('points')
    if from_points < amount:
        raise ValueError('포인트 부족')

    transaction.update(from_ref, {'points': from_points - amount})
    transaction.update(to_ref, {'points': to_doc.get('points') + amount})

transaction = db.transaction()
transfer_points(transaction, 'user1', 'user2', 100)
```

#### 7.4 보안 규칙

```javascript
// firestore.rules — Firestore 보안 규칙
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // 사용자 프로필 — 본인만 읽기/쓰기
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // 게시글 — 인증된 사용자 읽기, 작성자만 수정/삭제
    match /posts/{postId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null
                    && request.resource.data.authorId == request.auth.uid
                    && request.resource.data.title is string
                    && request.resource.data.title.size() <= 200;
      allow update, delete: if request.auth != null
                            && resource.data.authorId == request.auth.uid;
    }

    // 채팅방 — 멤버만 접근
    match /chatRooms/{roomId} {
      allow read: if request.auth != null
                  && request.auth.uid in resource.data.members;

      match /messages/{messageId} {
        allow read: if request.auth != null
                    && request.auth.uid in get(/databases/$(database)/documents/chatRooms/$(roomId)).data.members;
        allow create: if request.auth != null
                      && request.resource.data.senderId == request.auth.uid;
      }
    }
  }
}
```

#### 7.5 Firebase Hosting

```bash
# Firebase CLI 설치
npm install -g firebase-tools

# 로그인
firebase login

# 프로젝트 초기화
firebase init hosting

# 배포
firebase deploy --only hosting

# 미리보기 채널 (PR 미리보기용)
firebase hosting:channel:deploy preview-branch
```

```json
// firebase.json — Hosting 설정
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "/api/**",
        "function": "api"
      },
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          { "key": "Cache-Control", "value": "max-age=31536000" }
        ]
      }
    ]
  },
  "functions": {
    "source": "functions",
    "runtime": "nodejs20"
  },
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  }
}
```

#### 7.6 Firebase CLI와 에뮬레이터

```bash
# 에뮬레이터 설치 및 실행
firebase init emulators
firebase emulators:start

# 에뮬레이터 UI: http://localhost:4000
# Firestore: http://localhost:8080
# Auth: http://localhost:9099
# Functions: http://localhost:5001
# Hosting: http://localhost:5000

# 에뮬레이터 데이터 내보내기/가져오기
firebase emulators:export ./emulator-data
firebase emulators:start --import=./emulator-data
```

> "Firebase 에뮬레이터를 반드시 사용하세요. 로컬에서 모든 서비스를 테스트할 수 있어서 개발 비용이 $0입니다" — 실사용자 조언

### 실습 과제: 실시간 채팅 앱

> Firebase Authentication + Firestore + Hosting을 사용하여 실시간 채팅 앱을 구현하세요.

```javascript
// chat-app.js — 실시간 채팅 앱 핵심 로직
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, collection, addDoc, query, orderBy,
         limit, onSnapshot, serverTimestamp } from 'firebase/firestore';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 로그인
async function login() {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return result.user;
}

// 메시지 전송
async function sendMessage(text) {
    const user = auth.currentUser;
    if (!user || !text.trim()) return;

    await addDoc(collection(db, 'messages'), {
        text: text.trim(),
        uid: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: serverTimestamp()
    });
}

// 실시간 메시지 수신
function subscribeMessages(callback) {
    const q = query(
        collection(db, 'messages'),
        orderBy('createdAt', 'desc'),
        limit(50)
    );

    return onSnapshot(q, (snapshot) => {
        const messages = snapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .reverse();
        callback(messages);
    });
}
```

---

## 8. 자동화 파이프라인

### 학습 목표

- Cloud Scheduler, Pub/Sub, Workflows를 활용한 자동화 아키텍처를 설계한다
- Eventarc를 사용하여 이벤트 기반 파이프라인을 구축한다
- 실전 자동화 패턴 3가지를 이해하고 구현한다

### 상세 설명

#### 8.1 Cloud Scheduler — 크론 작업

```bash
# Cloud Scheduler로 정기 작업 설정

# HTTP 트리거 (Cloud Functions 호출)
gcloud scheduler jobs create http daily-report \
  --schedule="0 9 * * 1-5" \
  --uri="https://asia-northeast3-my-project.cloudfunctions.net/generate-report" \
  --http-method=POST \
  --headers="Content-Type=application/json" \
  --message-body='{"type": "daily", "format": "pdf"}' \
  --time-zone="Asia/Seoul" \
  --description="평일 오전 9시 일일 리포트 생성"

# Pub/Sub 트리거
gcloud scheduler jobs create pubsub data-sync \
  --schedule="*/30 * * * *" \
  --topic=data-sync-topic \
  --message-body='{"action": "sync", "source": "sheets"}' \
  --time-zone="Asia/Seoul" \
  --description="30분마다 데이터 동기화"

# 작업 목록 확인
gcloud scheduler jobs list

# 수동 실행 (테스트)
gcloud scheduler jobs run daily-report
```

#### 8.2 Cloud Workflows — 오케스트레이션

```yaml
# workflow.yaml — 데이터 처리 파이프라인
main:
  params: [input]
  steps:
    - init:
        assign:
          - project_id: ${sys.get_env("GOOGLE_CLOUD_PROJECT_ID")}
          - timestamp: ${time.format(sys.now())}

    - fetch_data:
        call: http.get
        args:
          url: ${"https://asia-northeast3-" + project_id + ".cloudfunctions.net/fetch-data"}
          auth:
            type: OIDC
        result: raw_data

    - check_data:
        switch:
          - condition: ${len(raw_data.body.items) == 0}
            next: no_data
          - condition: ${len(raw_data.body.items) > 0}
            next: process_data

    - process_data:
        call: http.post
        args:
          url: ${"https://asia-northeast3-" + project_id + ".cloudfunctions.net/analyze"}
          body:
            data: ${raw_data.body.items}
            timestamp: ${timestamp}
          auth:
            type: OIDC
        result: analysis_result

    - save_results:
        call: http.post
        args:
          url: ${"https://asia-northeast3-" + project_id + ".cloudfunctions.net/save-report"}
          body:
            analysis: ${analysis_result.body}
            timestamp: ${timestamp}
          auth:
            type: OIDC
        result: save_result

    - send_notification:
        call: http.post
        args:
          url: https://hooks.slack.com/services/T.../B.../xxx
          body:
            text: ${"일일 리포트 생성 완료 (" + timestamp + ")\n처리 항목: " + string(len(raw_data.body.items)) + "건"}
        result: notify_result

    - done:
        return:
          status: "success"
          items_processed: ${len(raw_data.body.items)}
          timestamp: ${timestamp}

    - no_data:
        return:
          status: "no_data"
          message: "처리할 데이터가 없습니다"
```

```bash
# Workflow 배포
gcloud workflows deploy data-pipeline \
  --source=workflow.yaml \
  --location=asia-northeast3

# Workflow 실행
gcloud workflows run data-pipeline \
  --data='{"source": "daily"}' \
  --location=asia-northeast3
```

#### 8.3 Pub/Sub — 이벤트 메시징

```python
# 발행자 (Publisher)
from google.cloud import pubsub_v1
import json

publisher = pubsub_v1.PublisherClient()
topic_path = publisher.topic_path('my-project', 'events-topic')

def publish_event(event_type, data):
    """이벤트 발행"""
    message = json.dumps({
        'type': event_type,
        'data': data,
        'timestamp': datetime.now().isoformat()
    }).encode('utf-8')

    future = publisher.publish(
        topic_path,
        message,
        event_type=event_type  # 속성 (필터링용)
    )
    print(f"발행 완료: {future.result()}")

# 이벤트 발행
publish_event('user_signup', {'user_id': 'u123', 'email': 'new@ex.com'})
publish_event('order_placed', {'order_id': 'o456', 'amount': 50000})
```

```python
# 구독자 (Subscriber)
from google.cloud import pubsub_v1

subscriber = pubsub_v1.SubscriberClient()
subscription_path = subscriber.subscription_path('my-project', 'events-sub')

def callback(message):
    """메시지 수신 콜백"""
    data = json.loads(message.data.decode('utf-8'))
    event_type = message.attributes.get('event_type', 'unknown')

    print(f"수신: {event_type} — {data}")

    # 이벤트 타입별 처리
    if event_type == 'user_signup':
        send_welcome_email(data['email'])
    elif event_type == 'order_placed':
        process_order(data['order_id'])

    message.ack()  # 처리 완료 확인

# 구독 시작
streaming_pull = subscriber.subscribe(subscription_path, callback=callback)
print("이벤트 수신 대기 중...")

try:
    streaming_pull.result()
except KeyboardInterrupt:
    streaming_pull.cancel()
```

#### 8.4 실전 아키텍처 3패턴

```
패턴 1: 데이터 수집 → 분석 → 알림

Cloud Scheduler (매일 9시)
  │
  ▼
Cloud Functions (데이터 수집)
  │  ── 외부 API 호출
  │  ── Sheets 데이터 읽기
  ▼
BigQuery (분석)
  │  ── SQL 쿼리 실행
  │  ── 집계/통계 생성
  ▼
Cloud Functions (알림)
  │  ── Slack 메시지
  │  ── 이메일 발송
  ▼
완료
```

```
패턴 2: 파일 업로드 → AI 처리 → 저장

Cloud Storage (파일 업로드)
  │
  ▼ (트리거)
Cloud Functions (AI 처리)
  │  ── Gemini API 분석
  │  ── Vision API OCR
  ▼
Firestore (결과 저장)
  │
  ▼ (트리거)
Cloud Functions (후처리)
  │  ── 결과 알림
  │  ── 리포트 생성
  ▼
완료
```

```
패턴 3: 폼 제출 → 처리 → 이메일 → 로그

Google Forms
  │
  ▼ (Apps Script 트리거)
Apps Script (데이터 가공)
  │
  ▼ (Pub/Sub 발행)
Cloud Functions (처리)
  │  ── 데이터 검증
  │  ── Firestore 저장
  ├──▶ Gmail API (확인 이메일)
  └──▶ BigQuery (로그 저장)
```

#### 8.5 실전 구현 — 일일 리포트 자동화

```python
# daily_report.py — Cloud Functions
import functions_framework
from google.cloud import bigquery, firestore
from google.cloud import secretmanager
import google.generativeai as genai
import requests
import json
from datetime import datetime, timedelta

def get_secret(secret_id):
    """Secret Manager에서 비밀값 조회"""
    client = secretmanager.SecretManagerServiceClient()
    name = f"projects/my-project/secrets/{secret_id}/versions/latest"
    response = client.access_secret_version(request={"name": name})
    return response.payload.data.decode("UTF-8")

@functions_framework.http
def generate_daily_report(request):
    """일일 리포트 자동 생성"""

    # 1. BigQuery에서 데이터 조회
    bq_client = bigquery.Client()
    yesterday = (datetime.now() - timedelta(days=1)).strftime('%Y-%m-%d')

    query = f"""
    SELECT
        COUNT(*) as total_events,
        COUNT(DISTINCT user_id) as unique_users,
        COUNTIF(event_type = 'signup') as new_signups,
        COUNTIF(event_type = 'purchase') as purchases,
        SUM(CASE WHEN event_type = 'purchase' THEN amount ELSE 0 END) as revenue
    FROM `analytics.events`
    WHERE DATE(timestamp) = '{yesterday}'
    """

    df = bq_client.query(query).to_dataframe()
    stats = df.iloc[0].to_dict()

    # 2. Gemini API로 리포트 생성
    genai.configure(api_key=get_secret('GEMINI_API_KEY'))
    model = genai.GenerativeModel('gemini-2.0-flash')

    prompt = f"""다음 데이터를 기반으로 일일 비즈니스 리포트를 작성해주세요:
    - 날짜: {yesterday}
    - 총 이벤트: {stats['total_events']:,}건
    - 고유 사용자: {stats['unique_users']:,}명
    - 신규 가입: {stats['new_signups']:,}명
    - 구매: {stats['purchases']:,}건
    - 매출: {stats['revenue']:,.0f}원

    핵심 인사이트와 제안을 포함해주세요."""

    response = model.generate_content(prompt)

    # 3. Firestore에 리포트 저장
    db = firestore.Client()
    db.collection('reports').document(yesterday).set({
        'date': yesterday,
        'stats': stats,
        'report': response.text,
        'generated_at': firestore.SERVER_TIMESTAMP
    })

    # 4. Slack 알림
    slack_webhook = get_secret('SLACK_WEBHOOK_URL')
    requests.post(slack_webhook, json={
        'text': f"*일일 리포트 ({yesterday})*\n{response.text[:500]}"
    })

    return {'status': 'success', 'date': yesterday}
```

### 실습 과제: 일일 리포트 자동 생성

> Cloud Scheduler + Cloud Functions + BigQuery + Gemini API를 연결하여 매일 아침 자동으로 리포트를 생성하고 Slack으로 알림을 보내는 파이프라인을 구축하세요.

```bash
# 1. Cloud Function 배포
gcloud functions deploy generate-daily-report \
  --gen2 \
  --runtime=python312 \
  --region=asia-northeast3 \
  --source=. \
  --entry-point=generate_daily_report \
  --trigger-http \
  --set-secrets="GEMINI_API_KEY=GEMINI_API_KEY:latest,SLACK_WEBHOOK_URL=SLACK_WEBHOOK_URL:latest" \
  --memory=512Mi \
  --timeout=120s

# 2. Cloud Scheduler 설정
gcloud scheduler jobs create http daily-report-job \
  --schedule="0 9 * * 1-5" \
  --uri="$(gcloud functions describe generate-daily-report --gen2 --region=asia-northeast3 --format='value(serviceConfig.uri)')" \
  --http-method=POST \
  --time-zone="Asia/Seoul" \
  --oidc-service-account-email="my-project@appspot.gserviceaccount.com"

# 3. 수동 테스트
gcloud scheduler jobs run daily-report-job
```

---

## 9. 보안과 비용 관리

### 학습 목표

- IAM 최소 권한 원칙과 Secret Manager를 활용한 보안 모범 사례를 적용한다
- GCP 예산 알림과 비용 분석으로 클라우드 비용을 관리한다
- Cloud Monitoring과 Logging으로 서비스 운영 상태를 모니터링한다

### 상세 설명

#### 9.1 IAM 모범 사례 — 최소 권한 원칙

```
최소 권한 원칙 (Principle of Least Privilege)

나쁜 예:
  사용자 → roles/owner (전체 권한) → 모든 리소스
                 ❌ 과도한 권한

좋은 예:
  개발자 → roles/cloudfunctions.developer → Cloud Functions만
  분석가 → roles/bigquery.dataViewer     → BigQuery 읽기만
  운영자 → roles/monitoring.viewer       → 모니터링 보기만
                 ✅ 필요한 최소 권한
```

```bash
# IAM 역할 부여
gcloud projects add-iam-policy-binding my-project \
  --member="user:developer@example.com" \
  --role="roles/cloudfunctions.developer"

# 서비스 계정 생성 (최소 권한)
gcloud iam service-accounts create my-function-sa \
  --display-name="Cloud Functions Service Account"

# 서비스 계정에 필요한 역할만 부여
gcloud projects add-iam-policy-binding my-project \
  --member="serviceAccount:my-function-sa@my-project.iam.gserviceaccount.com" \
  --role="roles/datastore.user"

gcloud projects add-iam-policy-binding my-project \
  --member="serviceAccount:my-function-sa@my-project.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

# Cloud Function에 서비스 계정 지정
gcloud functions deploy my-function \
  --gen2 \
  --service-account=my-function-sa@my-project.iam.gserviceaccount.com
```

#### 9.2 Secret Manager

```python
# Secret Manager — 민감 정보 안전하게 관리
from google.cloud import secretmanager

client = secretmanager.SecretManagerServiceClient()
project_id = "my-project"

# 시크릿 생성
def create_secret(secret_id, secret_value):
    """시크릿 생성 및 버전 추가"""
    parent = f"projects/{project_id}"

    # 시크릿 생성
    secret = client.create_secret(
        request={
            "parent": parent,
            "secret_id": secret_id,
            "secret": {"replication": {"automatic": {}}},
        }
    )

    # 버전 추가 (실제 값 저장)
    client.add_secret_version(
        request={
            "parent": secret.name,
            "payload": {"data": secret_value.encode("UTF-8")},
        }
    )
    print(f"시크릿 생성 완료: {secret_id}")

# 시크릿 조회
def get_secret(secret_id):
    """최신 버전의 시크릿 값 조회"""
    name = f"projects/{project_id}/secrets/{secret_id}/versions/latest"
    response = client.access_secret_version(request={"name": name})
    return response.payload.data.decode("UTF-8")

# 사용 예시
api_key = get_secret("GEMINI_API_KEY")
db_password = get_secret("DATABASE_PASSWORD")
```

```bash
# gcloud로 Secret Manager 관리

# 시크릿 생성
echo -n "my-api-key-value" | gcloud secrets create MY_API_KEY --data-file=-

# 시크릿 값 확인
gcloud secrets versions access latest --secret=MY_API_KEY

# 시크릿 버전 추가 (값 업데이트)
echo -n "new-api-key-value" | gcloud secrets versions add MY_API_KEY --data-file=-

# 시크릿 목록
gcloud secrets list
```

> "API 키나 비밀번호를 코드에 직접 넣지 마세요. Secret Manager를 사용하면 키 로테이션, 접근 제어, 감사 로그를 모두 얻을 수 있습니다" — 실사용자 조언

#### 9.3 비용 관리

```bash
# 예산 알림 설정
gcloud billing budgets create \
  --billing-account=012345-6789AB-CDEF01 \
  --display-name="월간 예산 $50" \
  --budget-amount=50USD \
  --threshold-rules=percent=0.5,basis=current-spend \
  --threshold-rules=percent=0.8,basis=current-spend \
  --threshold-rules=percent=1.0,basis=current-spend \
  --all-updates-rule-pubsub-topic=projects/my-project/topics/budget-alerts
```

| 서비스 | Free Tier (매월) | 초과 시 비용 |
|--------|-----------------|-------------|
| **Cloud Functions** | 200만 호출, 40만 GB초 | $0.40/100만 호출 |
| **Firestore** | 읽기 5만, 쓰기 2만, 삭제 2만 | $0.06/10만 읽기 |
| **Cloud Storage** | 5GB 저장 | $0.02/GB/월 |
| **BigQuery** | 1TB 쿼리, 10GB 저장 | $5/TB 쿼리 |
| **Cloud Run** | 200만 요청, 36만 vCPU초 | $0.00002400/vCPU초 |
| **Gemini API** | Flash: 무료 할당량 | 모델별 상이 |

```python
# 비용 초과 시 자동 대응 — Pub/Sub 트리거
import functions_framework
import base64
import json
from google.cloud import compute_v1

@functions_framework.cloud_event
def budget_alert_handler(cloud_event):
    """예산 알림 수신 시 자동 대응"""
    data = json.loads(base64.b64decode(cloud_event.data["message"]["data"]))

    budget_amount = data.get('budgetAmount', {}).get('units', '0')
    cost_amount = data.get('costAmount', 0)
    threshold = data.get('alertThresholdExceeded', 0)

    print(f"예산: ${budget_amount}, 현재 비용: ${cost_amount}, 임계치: {threshold*100}%")

    # 임계치 100% 초과 시 비필수 리소스 중지
    if threshold >= 1.0:
        print("경고: 예산 초과! 비필수 리소스를 중지합니다.")
        # 개발 환경 VM 중지 등의 로직
```

#### 9.4 Cloud Monitoring과 Logging

```python
# Cloud Monitoring — 커스텀 메트릭 작성
from google.cloud import monitoring_v3
import time

client = monitoring_v3.MetricServiceClient()
project_name = f"projects/my-project"

def write_custom_metric(metric_type, value, labels=None):
    """커스텀 메트릭 기록"""
    series = monitoring_v3.TimeSeries()
    series.metric.type = f"custom.googleapis.com/{metric_type}"

    if labels:
        for key, val in labels.items():
            series.metric.labels[key] = val

    series.resource.type = "global"

    now = time.time()
    interval = monitoring_v3.TimeInterval(
        {"end_time": {"seconds": int(now), "nanos": int((now % 1) * 1e9)}}
    )

    point = monitoring_v3.Point(
        {"interval": interval, "value": {"double_value": value}}
    )
    series.points = [point]

    client.create_time_series(
        request={"name": project_name, "time_series": [series]}
    )
    print(f"메트릭 기록: {metric_type} = {value}")

# 사용 예시
write_custom_metric("api/response_time", 0.234, {"endpoint": "/analyze"})
write_custom_metric("api/request_count", 1, {"status": "200"})
```

```bash
# Cloud Logging — 로그 조회 (gcloud)

# 최근 Cloud Functions 로그
gcloud functions logs read analyze-text \
  --gen2 \
  --region=asia-northeast3 \
  --limit=50

# 에러 로그만 필터링
gcloud logging read 'severity>=ERROR AND resource.type="cloud_function"' \
  --limit=20 \
  --format="table(timestamp, severity, textPayload)"

# 특정 기간 로그
gcloud logging read 'resource.type="cloud_function"' \
  --freshness=1h \
  --limit=100
```

#### 9.5 알림 정책

```bash
# 알림 정책 — Cloud Functions 에러율 감시
gcloud monitoring policies create \
  --notification-channels="projects/my-project/notificationChannels/12345" \
  --display-name="Cloud Functions 에러율 알림" \
  --condition-display-name="에러율 5% 초과" \
  --condition-filter='metric.type="cloudfunctions.googleapis.com/function/execution_count" AND resource.type="cloud_function" AND metric.labels.status="error"' \
  --condition-threshold-value=5 \
  --condition-threshold-comparison=COMPARISON_GT \
  --condition-threshold-duration=300s
```

### 실습 과제: 예산 알림 + 모니터링 대시보드

> GCP 프로젝트에 예산 알림을 설정하고, Cloud Functions의 실행 횟수/에러율/응답 시간을 모니터링하는 대시보드를 구성하세요.

```bash
# 1. 예산 알림 설정
gcloud billing budgets create \
  --billing-account=YOUR_BILLING_ACCOUNT \
  --display-name="개발 프로젝트 월 예산" \
  --budget-amount=30USD \
  --threshold-rules=percent=0.5 \
  --threshold-rules=percent=0.8 \
  --threshold-rules=percent=1.0

# 2. 알림 채널 생성 (이메일)
gcloud monitoring channels create \
  --type=email \
  --display-name="운영팀 이메일" \
  --channel-labels=email_address=ops@example.com

# 3. Cloud Functions 모니터링 쿼리
gcloud monitoring dashboards create \
  --config-from-file=dashboard.json

# 4. 로그 기반 메트릭 생성
gcloud logging metrics create function-errors \
  --description="Cloud Functions 에러 카운트" \
  --log-filter='resource.type="cloud_function" AND severity>=ERROR'
```

---

## 10. 종합 프로젝트

### 학습 목표

- 앞서 배운 GCP 서비스를 통합하여 AI 자동화 서비스를 구축한다
- Gemini API + Cloud Functions + Firebase + Cloud Scheduler를 연결한다
- 프로덕션 수준의 아키텍처 설계, 배포, 모니터링을 경험한다

### 상세 설명

#### 프로젝트 개요: AI 텍스트 분석 자동화 서비스

사용자가 텍스트를 제출하면 Gemini API로 분석하고, 결과를 저장/시각화/알림하는 풀스택 서비스를 구축합니다.

```
종합 프로젝트 아키텍처

사용자                Firebase Hosting          Cloud Functions
┌──────┐            ┌──────────────┐          ┌──────────────┐
│ 웹   │ ── 요청 ──▶│ 프론트엔드    │ ── API ──▶│ ① 텍스트 분석 │
│ 브라우저│          │ (HTML/JS)    │          │   Gemini API │
└──────┘            └──────────────┘          └──────┬───────┘
                                                     │
              ┌──────────────────────────────────────┘
              │
              ▼
┌──────────────────┐     ┌──────────────────┐     ┌──────────────┐
│ ② Firestore      │     │ ③ Cloud Scheduler│     │ ⑥ Monitoring │
│   결과 저장       │     │   자동 실행       │     │   운영 감시   │
│   실시간 업데이트  │     │   (매일 9시)     │     │   알림 정책   │
└──────────────────┘     └──────────────────┘     └──────────────┘
              │                    │
              ▼                    ▼
┌──────────────────┐     ┌──────────────────┐
│ ④ BigQuery       │     │ ⑤ Pub/Sub        │
│   분석 로그 저장  │     │   이벤트 발행     │
│   통계 대시보드   │     │   Slack 알림     │
└──────────────────┘     └──────────────────┘
```

#### 10.1 단계 1: Gemini API 텍스트 분석 함수

```python
# functions/analyze/main.py
import functions_framework
from flask import jsonify
import google.generativeai as genai
from google.cloud import firestore, secretmanager
import json
import os
from datetime import datetime

def get_secret(secret_id):
    client = secretmanager.SecretManagerServiceClient()
    project = os.environ.get('GCP_PROJECT', 'my-project')
    name = f"projects/{project}/secrets/{secret_id}/versions/latest"
    response = client.access_secret_version(request={"name": name})
    return response.payload.data.decode("UTF-8")

# 초기화
genai.configure(api_key=get_secret('GEMINI_API_KEY'))
model = genai.GenerativeModel(
    'gemini-2.0-flash',
    system_instruction="""당신은 텍스트 분석 전문가입니다.
    항상 JSON 형식으로 응답하며, 다음 필드를 포함합니다:
    - summary: 3문장 이내 요약
    - sentiment: positive/negative/neutral
    - confidence: 0.0~1.0
    - keywords: 핵심 키워드 5개 배열
    - category: 텍스트 카테고리
    - language: 감지된 언어"""
)

db = firestore.Client()

@functions_framework.http
def analyze(request):
    """텍스트 분석 API"""
    # CORS
    if request.method == 'OPTIONS':
        return ('', 204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type',
        })

    headers = {'Access-Control-Allow-Origin': '*'}

    try:
        data = request.get_json()
        text = data.get('text', '')
        user_id = data.get('userId', 'anonymous')

        if not text:
            return jsonify({'error': 'text is required'}), 400, headers
        if len(text) > 10000:
            return jsonify({'error': 'text too long (max 10000 chars)'}), 400, headers

        # Gemini API 분석
        response = model.generate_content(
            f"다음 텍스트를 분석해주세요:\n\n{text}",
            generation_config=genai.GenerationConfig(
                response_mime_type="application/json",
                temperature=0.3,
            )
        )

        analysis = json.loads(response.text)

        # Firestore에 결과 저장
        doc_ref = db.collection('analyses').document()
        doc_ref.set({
            'userId': user_id,
            'text': text[:500],  # 처음 500자만 저장
            'analysis': analysis,
            'tokens': response.usage_metadata.total_token_count,
            'createdAt': firestore.SERVER_TIMESTAMP,
        })

        return jsonify({
            'id': doc_ref.id,
            'analysis': analysis,
            'tokens': response.usage_metadata.total_token_count,
        }), 200, headers

    except Exception as e:
        return jsonify({'error': str(e)}), 500, headers
```

```
# functions/analyze/requirements.txt
functions-framework==3.*
google-generativeai>=0.5.0
google-cloud-firestore>=2.0
google-cloud-secret-manager>=2.0
flask>=2.0
```

#### 10.2 단계 2: Cloud Functions API 배포

```bash
# 분석 함수 배포
gcloud functions deploy analyze \
  --gen2 \
  --runtime=python312 \
  --region=asia-northeast3 \
  --source=functions/analyze \
  --entry-point=analyze \
  --trigger-http \
  --allow-unauthenticated \
  --service-account=analyzer-sa@my-project.iam.gserviceaccount.com \
  --set-secrets="GEMINI_API_KEY=GEMINI_API_KEY:latest" \
  --set-env-vars="GCP_PROJECT=my-project" \
  --memory=512Mi \
  --timeout=60s \
  --max-instances=10 \
  --min-instances=0

# 함수 URL 확인
ANALYZE_URL=$(gcloud functions describe analyze \
  --gen2 --region=asia-northeast3 \
  --format="value(serviceConfig.uri)")

echo "API URL: $ANALYZE_URL"

# 테스트
curl -X POST "$ANALYZE_URL" \
  -H "Content-Type: application/json" \
  -d '{"text": "오늘 구글 클라우드 세미나에 참석했는데 정말 유익했습니다.", "userId": "test-user"}'
```

#### 10.3 단계 3: Firebase Hosting 프론트엔드

```html
<!-- public/index.html — 프론트엔드 UI -->
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI 텍스트 분석</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Pretendard', sans-serif; background: #f5f5f5; padding: 2rem; }
        .container { max-width: 800px; margin: 0 auto; }
        h1 { text-align: center; margin-bottom: 2rem; color: #1a73e8; }
        textarea { width: 100%; height: 200px; padding: 1rem; border: 2px solid #ddd;
                   border-radius: 8px; font-size: 1rem; resize: vertical; }
        button { display: block; width: 100%; padding: 1rem; margin: 1rem 0;
                 background: #1a73e8; color: white; border: none; border-radius: 8px;
                 font-size: 1.1rem; cursor: pointer; }
        button:hover { background: #1557b0; }
        button:disabled { background: #ccc; cursor: not-allowed; }
        .result { background: white; padding: 1.5rem; border-radius: 8px;
                  margin-top: 1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .label { font-weight: bold; color: #555; margin-top: 0.5rem; }
        .keywords span { display: inline-block; padding: 0.25rem 0.75rem;
                         margin: 0.25rem; background: #e8f0fe; border-radius: 20px;
                         color: #1a73e8; font-size: 0.9rem; }
        .sentiment-positive { color: #0f9d58; }
        .sentiment-negative { color: #ea4335; }
        .sentiment-neutral { color: #f9ab00; }
        .loading { text-align: center; color: #666; }
        .history { margin-top: 2rem; }
        .history-item { background: white; padding: 1rem; margin: 0.5rem 0;
                        border-radius: 8px; border-left: 4px solid #1a73e8; }
    </style>
</head>
<body>
    <div class="container">
        <h1>AI 텍스트 분석기</h1>
        <textarea id="inputText" placeholder="분석할 텍스트를 입력하세요..."></textarea>
        <button id="analyzeBtn" onclick="analyzeText()">분석하기</button>
        <div id="result"></div>
        <div id="history" class="history">
            <h2>분석 기록</h2>
            <div id="historyList"></div>
        </div>
    </div>

    <script type="module">
        import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
        import { getFirestore, collection, query, orderBy, limit,
                 onSnapshot } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

        const app = initializeApp({
            // Firebase 설정
            projectId: "my-project",
        });
        const db = getFirestore(app);

        // 실시간 분석 기록 수신
        const q = query(
            collection(db, 'analyses'),
            orderBy('createdAt', 'desc'),
            limit(10)
        );

        onSnapshot(q, (snapshot) => {
            const historyList = document.getElementById('historyList');
            historyList.innerHTML = '';
            snapshot.docs.forEach(doc => {
                const data = doc.data();
                if (data.analysis) {
                    historyList.innerHTML += `
                        <div class="history-item">
                            <strong>${data.analysis.sentiment}</strong> —
                            ${data.analysis.summary || data.text}
                        </div>
                    `;
                }
            });
        });

        // 분석 함수를 전역에 노출
        window.analyzeText = async function() {
            const text = document.getElementById('inputText').value;
            const btn = document.getElementById('analyzeBtn');
            const resultDiv = document.getElementById('result');

            if (!text.trim()) { alert('텍스트를 입력하세요'); return; }

            btn.disabled = true;
            btn.textContent = '분석 중...';
            resultDiv.innerHTML = '<div class="loading">AI가 분석하고 있습니다...</div>';

            try {
                const response = await fetch('/api/analyze', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text, userId: 'web-user' })
                });

                const data = await response.json();

                if (data.error) throw new Error(data.error);

                const a = data.analysis;
                resultDiv.innerHTML = `
                    <div class="result">
                        <div class="label">요약</div>
                        <p>${a.summary}</p>
                        <div class="label">감성</div>
                        <p class="sentiment-${a.sentiment}">${a.sentiment} (${(a.confidence * 100).toFixed(0)}%)</p>
                        <div class="label">카테고리</div>
                        <p>${a.category}</p>
                        <div class="label">키워드</div>
                        <div class="keywords">
                            ${a.keywords.map(k => `<span>${k}</span>`).join('')}
                        </div>
                        <div class="label">토큰 사용량</div>
                        <p>${data.tokens} tokens</p>
                    </div>
                `;
            } catch (error) {
                resultDiv.innerHTML = `<div class="result" style="color:red;">오류: ${error.message}</div>`;
            } finally {
                btn.disabled = false;
                btn.textContent = '분석하기';
            }
        };
    </script>
</body>
</html>
```

#### 10.4 단계 4: Firestore 데이터 저장

```javascript
// firestore.rules — 보안 규칙
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 분석 결과 — 인증된 사용자만 읽기, 함수만 쓰기
    match /analyses/{docId} {
      allow read: if request.auth != null;
      allow write: if false;  // Cloud Functions만 쓰기 (Admin SDK)
    }

    // 일일 통계 — 읽기만 허용
    match /stats/{docId} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

#### 10.5 단계 5: Cloud Scheduler 자동화

```bash
# 일일 통계 집계 스케줄러
gcloud scheduler jobs create http daily-stats \
  --schedule="0 23 * * *" \
  --uri="$STATS_FUNCTION_URL" \
  --http-method=POST \
  --time-zone="Asia/Seoul" \
  --message-body='{"action": "aggregate_daily"}' \
  --oidc-service-account-email="scheduler-sa@my-project.iam.gserviceaccount.com"
```

```python
# functions/stats/main.py — 일일 통계 집계
import functions_framework
from google.cloud import firestore, bigquery
from datetime import datetime, timedelta

db = firestore.Client()
bq_client = bigquery.Client()

@functions_framework.http
def aggregate_stats(request):
    """일일 통계 집계 및 BigQuery 저장"""

    yesterday = (datetime.now() - timedelta(days=1)).strftime('%Y-%m-%d')

    # Firestore에서 어제 분석 기록 조회
    analyses = db.collection('analyses') \
        .where('createdAt', '>=', datetime.fromisoformat(f'{yesterday}T00:00:00')) \
        .where('createdAt', '<', datetime.fromisoformat(f'{yesterday}T23:59:59')) \
        .stream()

    stats = {
        'date': yesterday,
        'total_analyses': 0,
        'sentiment_counts': {'positive': 0, 'negative': 0, 'neutral': 0},
        'total_tokens': 0,
        'categories': {},
    }

    for doc in analyses:
        data = doc.to_dict()
        analysis = data.get('analysis', {})

        stats['total_analyses'] += 1
        stats['total_tokens'] += data.get('tokens', 0)

        sentiment = analysis.get('sentiment', 'neutral')
        stats['sentiment_counts'][sentiment] = stats['sentiment_counts'].get(sentiment, 0) + 1

        category = analysis.get('category', 'unknown')
        stats['categories'][category] = stats['categories'].get(category, 0) + 1

    # Firestore에 통계 저장
    db.collection('stats').document(yesterday).set(stats)

    # BigQuery에 로그 저장
    table_id = "my-project.analytics.daily_stats"
    rows = [{
        'date': yesterday,
        'total_analyses': stats['total_analyses'],
        'positive_count': stats['sentiment_counts']['positive'],
        'negative_count': stats['sentiment_counts']['negative'],
        'neutral_count': stats['sentiment_counts']['neutral'],
        'total_tokens': stats['total_tokens'],
    }]
    bq_client.insert_rows_json(table_id, rows)

    return {'status': 'success', 'date': yesterday, 'stats': stats}
```

#### 10.6 단계 6: Monitoring 운영

```bash
# 전체 서비스 배포 스크립트
#!/bin/bash
set -euo pipefail

PROJECT_ID="my-project"
REGION="asia-northeast3"

echo "=== 1. 분석 API 배포 ==="
gcloud functions deploy analyze \
  --gen2 --runtime=python312 --region=$REGION \
  --source=functions/analyze --entry-point=analyze \
  --trigger-http --allow-unauthenticated \
  --memory=512Mi --timeout=60s

echo "=== 2. 통계 집계 함수 배포 ==="
gcloud functions deploy aggregate-stats \
  --gen2 --runtime=python312 --region=$REGION \
  --source=functions/stats --entry-point=aggregate_stats \
  --trigger-http --memory=256Mi

echo "=== 3. Firebase Hosting 배포 ==="
firebase deploy --only hosting

echo "=== 4. Firestore 보안 규칙 배포 ==="
firebase deploy --only firestore:rules

echo "=== 5. Cloud Scheduler 설정 ==="
gcloud scheduler jobs create http daily-stats-job \
  --schedule="0 23 * * *" \
  --uri="$(gcloud functions describe aggregate-stats --gen2 --region=$REGION --format='value(serviceConfig.uri)')" \
  --time-zone="Asia/Seoul" \
  --oidc-service-account-email="$PROJECT_ID@appspot.gserviceaccount.com" \
  2>/dev/null || echo "스케줄러 작업이 이미 존재합니다"

echo "=== 배포 완료 ==="
echo "사이트: https://$PROJECT_ID.web.app"
```

---

## 11. 다음 단계

### GCP 자격증 로드맵

| 자격증 | 수준 | 대상 | 주요 내용 |
|--------|------|------|----------|
| **Cloud Digital Leader** | 입문 | 비개발 직군 포함 | GCP 개요, 서비스 이해 |
| **Associate Cloud Engineer** | 중급 | 개발자/운영자 | 인프라 배포, 관리, 모니터링 |
| **Professional Cloud Architect** | 고급 | 아키텍트 | 설계, 보안, 비용 최적화 |
| **Professional Data Engineer** | 고급 | 데이터 엔지니어 | BigQuery, Dataflow, ML |
| **Professional ML Engineer** | 고급 | ML 엔지니어 | Vertex AI, MLOps |

```
자격증 추천 경로

Cloud Digital Leader (기초)
  │
  ▼
Associate Cloud Engineer (필수)
  │
  ├──▶ Professional Cloud Architect (설계/아키텍처)
  ├──▶ Professional Data Engineer (데이터/분석)
  ├──▶ Professional Cloud Developer (개발)
  └──▶ Professional ML Engineer (AI/ML)
```

### SRE/DevOps 연계

| 영역 | GCP 서비스 | 학습 내용 |
|------|-----------|----------|
| **CI/CD** | Cloud Build, Artifact Registry | 빌드 자동화, 컨테이너 레지스트리 |
| **컨테이너** | GKE, Cloud Run | Kubernetes, 컨테이너 오케스트레이션 |
| **IaC** | Terraform, Deployment Manager | 인프라 코드화 |
| **관측성** | Cloud Monitoring, Logging, Trace | SLI/SLO, 분산 추적 |

### Vertex AI / MLOps

```
Vertex AI 학습 경로

Gemini API (이 교안)
  │
  ▼
Vertex AI Studio (프롬프트 관리, 모델 튜닝)
  │
  ▼
Vertex AI Pipelines (MLOps 파이프라인)
  │
  ├── AutoML (노코드 ML)
  ├── Custom Training (커스텀 모델 학습)
  ├── Model Registry (모델 버전 관리)
  └── Prediction (모델 서빙, A/B 테스트)
```

### 커뮤니티와 학습 리소스

| 리소스 | 설명 | 링크 |
|--------|------|------|
| **Google Cloud Skills Boost** | 공식 실습 플랫폼 (무료 크레딧) | [cloudskillsboost.google](https://cloudskillsboost.google/) |
| **Google Codelabs** | 단계별 코딩 튜토리얼 | [codelabs.developers.google.com](https://codelabs.developers.google.com/) |
| **GDG (Google Developer Groups)** | 지역 개발자 커뮤니티 | [gdg.community.dev](https://gdg.community.dev/) |
| **Google Cloud Blog** | 최신 서비스/기능 소식 | [cloud.google.com/blog](https://cloud.google.com/blog) |
| **Firebase YouTube** | Firebase 공식 튜토리얼 영상 | [youtube.com/@Firebase](https://www.youtube.com/@Firebase) |

### 심화 학습 방향

**클라우드 아키텍처 심화:**
- Kubernetes(GKE) 기반 마이크로서비스 설계
- Terraform으로 GCP 인프라 코드화
- Cloud Armor, VPC Service Controls로 보안 강화

**데이터 엔지니어링 심화:**
- Dataflow (Apache Beam) 스트림/배치 파이프라인
- Dataproc (Spark/Hadoop) 대규모 데이터 처리
- Looker / Data Studio 엔터프라이즈 BI

**AI/ML 심화:**
- Vertex AI 모델 튜닝 (Fine-tuning)
- RAG 파이프라인 구축 (Vector Search + Gemini)
- Agent Builder로 AI 에이전트 구축

**바이브코딩 연계:**
- Lovable/Cursor로 프론트엔드 → Firebase Hosting 배포
- Claude Code로 Cloud Functions 코드 생성
- Apps Script + Gemini API 자동화 워크플로

### 마무리

> "구글 생태계의 강점은 모든 서비스가 유기적으로 연결된다는 것입니다. Sheets에서 시작한 데이터가 BigQuery로 흘러가고, Gemini API가 분석하고, Cloud Functions가 자동화합니다" — 실사용자 경험

이 교안에서 다룬 내용을 요약하면:

1. **Google Cloud 기초**: GCP 프로젝트 구조, IAM, gcloud CLI로 클라우드 환경을 설정
2. **Google APIs**: OAuth 2.0, 서비스 계정 인증으로 Sheets/Drive/Gmail API를 프로그래밍 방식으로 활용
3. **Apps Script 고급**: Web App 배포, 외부 API 연동으로 Google Workspace 자동화 확장
4. **Gemini API**: 텍스트 생성, 멀티모달, Function Calling, Structured Output으로 AI 기능 구현
5. **Cloud Functions**: 서버리스 아키텍처로 HTTP/이벤트 트리거 API 구축 및 배포
6. **BigQuery**: 대규모 데이터 분석, 공개 데이터셋 활용, BigQuery ML로 SQL 기반 머신러닝
7. **Firebase**: Authentication, Firestore, Hosting을 통합한 풀스택 앱 개발
8. **자동화 파이프라인**: Cloud Scheduler, Pub/Sub, Workflows로 엔드투엔드 자동화
9. **보안/비용**: IAM 최소 권한, Secret Manager, 예산 알림, Cloud Monitoring으로 안전한 운영
10. **종합 프로젝트**: 모든 서비스를 연결한 AI 자동화 서비스 구축

구글 생태계는 무료 크레딧과 Free Tier가 풍부하므로, 실습하면서 직접 경험하는 것이 가장 효과적인 학습 방법입니다. 작은 프로젝트부터 시작하여 점진적으로 서비스를 연결해 나가세요.

---

## 출처

| 출처 | 설명 |
|------|------|
| Google Cloud 공식 문서 | GCP 서비스 가이드 및 API 레퍼런스 |
| Google AI for Developers | Gemini API 문서 및 SDK 가이드 |
| Firebase 공식 문서 | Firebase 서비스 가이드 |
| Google Codelabs | GCP/Firebase 실습 튜토리얼 |
| Google Cloud Blog | 최신 서비스 업데이트 및 사례 |
| Google Cloud Skills Boost | 공식 학습 플랫폼 |
| Apps Script 공식 문서 | Apps Script 레퍼런스 |
| 러버블 바이브코딩 카톡방 (2026.3.8) | 실사용자 의견 및 경험 |
