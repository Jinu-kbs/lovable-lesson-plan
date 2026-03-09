# 🖥️ 개발 인터페이스 개발자편: CLI 자동화와 개발 환경 구축

> **과정명**: CLI 자동화와 개발 환경 구축
> **대상**: 개발 경험자, 자동화/DevOps/환경 구축에 관심 있는 개발자
> **목표**: CLI 기반 자동화 및 개발 환경 구축을 통해 생산성을 높인다
> **주요 도구**: Bash, PowerShell, Docker
> **소요**: 약 5~6시간

---

## 어떤 교안을 봐야 할까요? (자가 진단)

이 교안은 **개발 경험이 있는 분**을 대상으로 합니다. CLI/터미널 사용이 처음이라면 초보자편부터 시작하세요.

| 항목 | 필요 수준 |
|------|----------|
| 코딩 경험 | **필수** — 1개 이상 언어로 프로젝트 경험 |
| 터미널 사용 | **필수** — cd, ls, mkdir, cat 등 기본 명령어 숙지 |
| Git/GitHub | **필수** — 커밋, 브랜치, PR 경험 |
| 운영체제 이해 | **권장** — 파일시스템, 프로세스, 환경변수 개념 |
| 텍스트 에디터 | **권장** — VS Code 또는 Vim 기본 사용 가능 |

> 위 항목 중 터미널 사용과 코딩 경험이 해당하지 않는다면, **Cursor 초보자편** 또는 **Lovable 초보자편**으로 먼저 시작하세요.

---

### 추천 리소스

| 리소스 | 설명 | 링크 |
|--------|------|------|
| **The Missing Semester (MIT)** | 셸, Git, 디버깅 등 개발 환경 기초 강의 | [missing.csail.mit.edu](https://missing.csail.mit.edu/) |
| **GitHub Actions 공식 문서** | CI/CD 워크플로 작성 가이드 | [docs.github.com/actions](https://docs.github.com/en/actions) |
| **Docker 공식 문서** | 컨테이너 기반 개발 환경 가이드 | [docs.docker.com](https://docs.docker.com/) |
| **PowerShell Gallery** | PowerShell 모듈 저장소 및 커뮤니티 | [powershellgallery.com](https://www.powershellgallery.com/) |
| **Bash Reference Manual** | GNU Bash 공식 레퍼런스 | [gnu.org/software/bash/manual](https://www.gnu.org/software/bash/manual/) |
| **VS Code Remote Development** | Remote-SSH, Dev Containers 공식 가이드 | [code.visualstudio.com/docs/remote](https://code.visualstudio.com/docs/remote/remote-overview) |

---

## 목차

1. [Bash Shell Script](#1-bash-shell-script)
2. [PowerShell 스크립팅](#2-powershell-스크립팅)
3. [자동화 스크립트 실전](#3-자동화-스크립트-실전)
4. [CLI 파이프라인과 데이터 처리](#4-cli-파이프라인과-데이터-처리)
5. [환경 변수와 시크릿 관리](#5-환경-변수와-시크릿-관리)
6. [개발 환경 설정 자동화](#6-개발-환경-설정-자동화)
7. [VS Code 고급 활용](#7-vs-code-고급-활용)
8. [Docker 기반 개발 환경](#8-docker-기반-개발-환경)
9. [배포와 CI/CD](#9-배포와-cicd)
10. [종합 프로젝트](#10-종합-프로젝트)
11. [바이브코딩 도구 연계 심화](#11-바이브코딩-도구-연계-심화)
12. [다음 단계](#12-다음-단계)

---

## 1. Bash Shell Script

### 학습 목표

- Bash 스크립트의 기본 문법(변수, 조건문, 반복문, 함수)을 이해한다
- 인수 처리, 종료 코드, 시그널 트랩을 활용한 견고한 스크립트를 작성한다
- 실무에서 즉시 활용 가능한 파일 정리 스크립트를 완성한다

### 상세 설명

#### 1.1 변수와 데이터 타입

Bash에서 변수는 별도의 타입 선언 없이 사용합니다. 문자열이 기본이며, 산술 연산은 `$(( ))` 또는 `let`을 사용합니다.

```bash
#!/bin/bash

# 변수 선언 — 등호 양쪽에 공백 불가
PROJECT_NAME="my-app"
VERSION=1
BUILD_COUNT=$((VERSION + 1))

# 읽기 전용 변수
readonly APP_ROOT="/opt/apps"

# 배열
ENVIRONMENTS=("dev" "staging" "production")
echo "첫 번째 환경: ${ENVIRONMENTS[0]}"
echo "전체 환경: ${ENVIRONMENTS[@]}"
echo "환경 수: ${#ENVIRONMENTS[@]}"

# 연관 배열 (Bash 4+)
declare -A CONFIG
CONFIG[host]="localhost"
CONFIG[port]="3000"
CONFIG[env]="development"
echo "호스트: ${CONFIG[host]}:${CONFIG[port]}"

# 문자열 조작
FILENAME="app.2026-03-09.log"
echo "확장자 제거: ${FILENAME%.*}"       # app.2026-03-09
echo "첫 점 이후 제거: ${FILENAME%%.*}"  # app
echo "경로 제거: ${FILENAME##*/}"        # app.2026-03-09.log
echo "대문자 변환: ${FILENAME^^}"        # APP.2026-03-09.LOG
```

#### 1.2 조건문 (if / elif / else)

```bash
#!/bin/bash

FILE_PATH="$1"

# 파일 존재 여부 체크
if [[ -f "$FILE_PATH" ]]; then
    echo "파일이 존재합니다: $FILE_PATH"

    # 파일 크기 체크
    FILE_SIZE=$(stat -f%z "$FILE_PATH" 2>/dev/null || stat -c%s "$FILE_PATH" 2>/dev/null)

    if [[ "$FILE_SIZE" -gt 1048576 ]]; then
        echo "경고: 파일 크기가 1MB를 초과합니다 (${FILE_SIZE} bytes)"
    elif [[ "$FILE_SIZE" -eq 0 ]]; then
        echo "경고: 빈 파일입니다"
    else
        echo "파일 크기: ${FILE_SIZE} bytes"
    fi
elif [[ -d "$FILE_PATH" ]]; then
    echo "디렉토리입니다: $FILE_PATH"
else
    echo "존재하지 않습니다: $FILE_PATH"
    exit 1
fi

# 문자열 비교와 패턴 매칭
BRANCH=$(git branch --show-current 2>/dev/null)

if [[ "$BRANCH" == "main" || "$BRANCH" == "master" ]]; then
    echo "메인 브랜치에서 작업 중입니다"
elif [[ "$BRANCH" =~ ^feature/.+ ]]; then
    echo "기능 브랜치: $BRANCH"
elif [[ -z "$BRANCH" ]]; then
    echo "Git 저장소가 아닙니다"
fi
```

#### 1.3 반복문 (for / while)

```bash
#!/bin/bash

# for 반복 — 파일 순회
for file in *.log; do
    [[ -f "$file" ]] || continue
    line_count=$(wc -l < "$file")
    echo "$file: ${line_count} 줄"
done

# C 스타일 for
for ((i = 1; i <= 5; i++)); do
    echo "빌드 시도 #$i"
done

# while 반복 — 파일 라인 읽기
while IFS= read -r line; do
    # 주석과 빈 줄 무시
    [[ "$line" =~ ^#.*$ || -z "$line" ]] && continue
    echo "처리: $line"
done < "config.txt"

# while + 프로세스 치환 (파이프 서브셸 문제 회피)
count=0
while IFS= read -r line; do
    ((count++))
done < <(find . -name "*.js" -type f)
echo "JS 파일 수: $count"
```

#### 1.4 함수

```bash
#!/bin/bash

# 함수 정의
log_message() {
    local level="${1:-INFO}"
    local message="$2"
    local timestamp
    timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$timestamp] [$level] $message"
}

# 반환값 처리 — echo로 값 반환
get_git_info() {
    local branch
    branch=$(git branch --show-current 2>/dev/null) || {
        echo "unknown"
        return 1
    }
    local commit
    commit=$(git rev-parse --short HEAD 2>/dev/null)
    echo "${branch}@${commit}"
}

# 함수 호출
log_message "INFO" "스크립트 시작"
GIT_INFO=$(get_git_info)
log_message "INFO" "Git 정보: $GIT_INFO"
```

#### 1.5 인수 처리 ($1, $@, getopts)

```bash
#!/bin/bash

# 위치 인수
# $0: 스크립트 이름, $1~$N: 인수, $#: 인수 개수, $@: 전체 인수

usage() {
    cat <<EOF
사용법: $(basename "$0") [옵션] <대상 디렉토리>

옵션:
  -o, --output DIR   출력 디렉토리 (기본: ./output)
  -v, --verbose      상세 출력
  -d, --dry-run      실제 실행 없이 미리보기
  -h, --help         도움말
EOF
}

# 기본값 설정
OUTPUT_DIR="./output"
VERBOSE=false
DRY_RUN=false
TARGET_DIR=""

# 인수 파싱 (long option 지원)
while [[ $# -gt 0 ]]; do
    case "$1" in
        -o|--output)
            OUTPUT_DIR="$2"
            shift 2
            ;;
        -v|--verbose)
            VERBOSE=true
            shift
            ;;
        -d|--dry-run)
            DRY_RUN=true
            shift
            ;;
        -h|--help)
            usage
            exit 0
            ;;
        -*)
            echo "알 수 없는 옵션: $1" >&2
            usage
            exit 1
            ;;
        *)
            TARGET_DIR="$1"
            shift
            ;;
    esac
done

# 필수 인수 검증
if [[ -z "$TARGET_DIR" ]]; then
    echo "오류: 대상 디렉토리를 지정해주세요" >&2
    usage
    exit 1
fi
```

#### 1.6 종료 코드와 에러 처리

```bash
#!/bin/bash

# 엄격 모드 (Strict Mode)
set -euo pipefail
IFS=$'\n\t'

# set -e: 오류 발생 시 즉시 종료
# set -u: 미정의 변수 사용 시 오류
# set -o pipefail: 파이프라인 중간 오류 감지

# 종료 코드 규약
# 0: 성공
# 1: 일반 오류
# 2: 잘못된 사용법
# 126: 실행 권한 없음
# 127: 명령어 없음
# 130: Ctrl+C (SIGINT)
```

#### 1.7 trap — 시그널 처리

```bash
#!/bin/bash
set -euo pipefail

TEMP_DIR=""

cleanup() {
    local exit_code=$?
    echo "정리 작업 실행 중..."

    if [[ -n "$TEMP_DIR" && -d "$TEMP_DIR" ]]; then
        rm -rf "$TEMP_DIR"
        echo "임시 디렉토리 삭제 완료: $TEMP_DIR"
    fi

    if [[ $exit_code -ne 0 ]]; then
        echo "스크립트가 오류로 종료되었습니다 (코드: $exit_code)" >&2
    fi

    exit $exit_code
}

# EXIT: 정상/비정상 종료 시 모두 실행
# INT: Ctrl+C
# TERM: kill 시그널
trap cleanup EXIT INT TERM

# 임시 디렉토리 생성
TEMP_DIR=$(mktemp -d)
echo "임시 디렉토리 생성: $TEMP_DIR"

# 작업 수행
echo "데이터 처리 중..."
cp important-data.txt "$TEMP_DIR/"
# ... 처리 로직 ...
echo "완료"
```

### 실습 과제: 파일 정리 스크립트

> 지정한 디렉토리에서 파일을 확장자별로 분류하고, 오래된 파일을 아카이브하는 스크립트를 작성하세요.

```bash
#!/bin/bash
set -euo pipefail

# === 파일 정리 스크립트 ===
# 사용법: ./organize.sh [-d days] [-n] <디렉토리>

DAYS=30
DRY_RUN=false
TARGET=""

while [[ $# -gt 0 ]]; do
    case "$1" in
        -d) DAYS="$2"; shift 2 ;;
        -n) DRY_RUN=true; shift ;;
        *)  TARGET="$1"; shift ;;
    esac
done

[[ -z "$TARGET" ]] && { echo "사용법: $0 [-d days] [-n] <디렉토리>"; exit 1; }
[[ -d "$TARGET" ]] || { echo "오류: '$TARGET' 디렉토리가 없습니다"; exit 1; }

# 확장자별 분류
declare -A CATEGORIES=(
    [images]="jpg jpeg png gif svg webp"
    [documents]="pdf doc docx txt md"
    [code]="js ts py sh ps1 html css"
    [data]="json csv xml yaml yml"
    [archives]="zip tar gz 7z rar"
)

classify_file() {
    local ext="${1##*.}"
    ext="${ext,,}"  # 소문자 변환
    for category in "${!CATEGORIES[@]}"; do
        if [[ " ${CATEGORIES[$category]} " == *" $ext "* ]]; then
            echo "$category"
            return
        fi
    done
    echo "others"
}

moved=0
archived=0

for file in "$TARGET"/*; do
    [[ -f "$file" ]] || continue

    category=$(classify_file "$file")
    dest="$TARGET/$category"

    if $DRY_RUN; then
        echo "[미리보기] $file -> $dest/"
    else
        mkdir -p "$dest"
        mv "$file" "$dest/"
    fi
    ((moved++))
done

# 오래된 파일 아카이브
ARCHIVE_NAME="$TARGET/archive_$(date +%Y%m%d).tar.gz"
old_files=$(find "$TARGET" -maxdepth 2 -type f -mtime +$DAYS 2>/dev/null | head -20)

if [[ -n "$old_files" ]]; then
    if $DRY_RUN; then
        echo "[미리보기] ${DAYS}일 이상 된 파일을 아카이브합니다"
        echo "$old_files"
    else
        echo "$old_files" | tar -czf "$ARCHIVE_NAME" -T -
        ((archived++))
        echo "아카이브 생성: $ARCHIVE_NAME"
    fi
fi

echo "=== 정리 완료 ==="
echo "이동된 파일: $moved"
echo "아카이브: $archived"
```

---

## 2. PowerShell 스크립팅

### 학습 목표

- PowerShell 스크립트(.ps1)의 핵심 문법과 객체 파이프라인을 이해한다
- 함수, 파라미터, 모듈 제작 방법을 익힌다
- Bash와 PowerShell 간 스크립트 변환 패턴을 학습한다

### 상세 설명

#### 2.1 변수와 데이터 타입

PowerShell은 .NET 기반이므로 강력한 타입 시스템을 활용할 수 있습니다.

```powershell
# 변수 선언 — $ 접두사 사용
$ProjectName = "my-app"
$Version = [int]1
$BuildCount = $Version + 1

# 타입 지정
[string]$Name = "DevInterface"
[int]$Port = 3000
[bool]$IsProduction = $false
[datetime]$DeployDate = Get-Date

# 배열
$Environments = @("dev", "staging", "production")
$Environments[0]       # dev
$Environments.Count    # 3
$Environments += "qa"  # 요소 추가

# 해시테이블 (연관 배열)
$Config = @{
    Host = "localhost"
    Port = 3000
    Env  = "development"
}
$Config["Host"]    # localhost
$Config.Port       # 3000

# 문자열 조작
$Filename = "app.2026-03-09.log"
[System.IO.Path]::GetFileNameWithoutExtension($Filename)  # app.2026-03-09
[System.IO.Path]::GetExtension($Filename)                  # .log
$Filename.ToUpper()                                        # APP.2026-03-09.LOG
$Filename -replace '\.log$', '.txt'                        # app.2026-03-09.txt
```

#### 2.2 조건문과 반복문

```powershell
# 조건문
$FilePath = $args[0]

if (Test-Path -Path $FilePath -PathType Leaf) {
    $FileInfo = Get-Item $FilePath
    $SizeMB = [math]::Round($FileInfo.Length / 1MB, 2)

    if ($FileInfo.Length -gt 1MB) {
        Write-Warning "파일 크기가 1MB를 초과합니다 ($SizeMB MB)"
    }
    elseif ($FileInfo.Length -eq 0) {
        Write-Warning "빈 파일입니다"
    }
    else {
        Write-Host "파일 크기: $SizeMB MB"
    }
}
elseif (Test-Path -Path $FilePath -PathType Container) {
    Write-Host "디렉토리입니다: $FilePath"
}
else {
    Write-Error "존재하지 않습니다: $FilePath"
    exit 1
}

# switch 문 — 패턴 매칭 지원
$Branch = git branch --show-current 2>$null

switch -Regex ($Branch) {
    '^(main|master)$'  { Write-Host "메인 브랜치에서 작업 중" }
    '^feature/.+'      { Write-Host "기능 브랜치: $Branch" }
    '^hotfix/.+'       { Write-Host "핫픽스 브랜치: $Branch" }
    default            { Write-Host "브랜치: $Branch" }
}

# foreach 반복
foreach ($env in $Environments) {
    Write-Host "환경: $env"
}

# for 반복
for ($i = 1; $i -le 5; $i++) {
    Write-Host "빌드 시도 #$i"
}

# while 반복 — 파일 라인 읽기
$lines = Get-Content "config.txt" -ErrorAction SilentlyContinue
foreach ($line in $lines) {
    if ($line -match '^\s*#' -or [string]::IsNullOrWhiteSpace($line)) { continue }
    Write-Host "처리: $line"
}
```

#### 2.3 함수와 고급 파라미터

```powershell
# 기본 함수
function Write-LogMessage {
    param(
        [ValidateSet("INFO", "WARN", "ERROR")]
        [string]$Level = "INFO",

        [Parameter(Mandatory)]
        [string]$Message
    )

    $Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $Color = switch ($Level) {
        "INFO"  { "White" }
        "WARN"  { "Yellow" }
        "ERROR" { "Red" }
    }
    Write-Host "[$Timestamp] [$Level] $Message" -ForegroundColor $Color
}

# 고급 함수 (Advanced Function)
function Get-ProjectInfo {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory, ValueFromPipeline)]
        [ValidateScript({ Test-Path $_ })]
        [string]$Path,

        [switch]$IncludeGit
    )

    process {
        $Info = [PSCustomObject]@{
            Path      = (Resolve-Path $Path).Path
            Name      = Split-Path $Path -Leaf
            FileCount = (Get-ChildItem $Path -File -Recurse | Measure-Object).Count
            SizeMB    = [math]::Round((Get-ChildItem $Path -File -Recurse |
                         Measure-Object -Property Length -Sum).Sum / 1MB, 2)
        }

        if ($IncludeGit) {
            Push-Location $Path
            $Info | Add-Member -NotePropertyName "Branch" -NotePropertyValue (
                git branch --show-current 2>$null
            )
            $Info | Add-Member -NotePropertyName "LastCommit" -NotePropertyValue (
                git log -1 --format="%h %s" 2>$null
            )
            Pop-Location
        }

        $Info
    }
}

# 호출
Write-LogMessage -Level "INFO" -Message "스크립트 시작"
Get-ProjectInfo -Path "." -IncludeGit
```

#### 2.4 파이프라인과 객체 활용

PowerShell의 핵심 강점은 **텍스트가 아닌 객체**가 파이프라인을 따라 흐른다는 점입니다.

```powershell
# 파이프라인 기본 — 프로세스 중 메모리 상위 5개
Get-Process |
    Sort-Object -Property WorkingSet64 -Descending |
    Select-Object -First 5 -Property Name, @{
        Name = "MemoryMB"
        Expression = { [math]::Round($_.WorkingSet64 / 1MB, 1) }
    } |
    Format-Table -AutoSize

# 파이프라인 필터링
Get-ChildItem -Path . -Recurse -File |
    Where-Object { $_.Extension -eq ".log" -and $_.Length -gt 1MB } |
    ForEach-Object {
        Write-Host "큰 로그 파일: $($_.FullName) ($([math]::Round($_.Length/1MB, 1)) MB)"
    }

# 그룹화 및 집계
Get-ChildItem -Recurse -File |
    Group-Object Extension |
    Sort-Object Count -Descending |
    Select-Object -First 10 Name, Count, @{
        Name = "TotalSizeMB"
        Expression = {
            [math]::Round(($_.Group | Measure-Object Length -Sum).Sum / 1MB, 2)
        }
    }
```

#### 2.5 모듈 제작

```powershell
# DevTools.psm1 — 모듈 파일

function Get-DevEnvironment {
    [CmdletBinding()]
    param()

    [PSCustomObject]@{
        OS           = $PSVersionTable.OS
        PSVersion    = $PSVersionTable.PSVersion.ToString()
        NodeVersion  = (node --version 2>$null) ?? "미설치"
        GitVersion   = (git --version 2>$null) ?? "미설치"
        DockerStatus = if (Get-Command docker -ErrorAction SilentlyContinue) {
                           (docker info --format '{{.ServerVersion}}' 2>$null) ?? "중지됨"
                       } else { "미설치" }
    }
}

function Invoke-ProjectSetup {
    [CmdletBinding(SupportsShouldProcess)]
    param(
        [Parameter(Mandatory)]
        [string]$ProjectName,

        [ValidateSet("node", "python", "dotnet")]
        [string]$Runtime = "node"
    )

    if ($PSCmdlet.ShouldProcess($ProjectName, "프로젝트 초기화")) {
        $ProjectPath = Join-Path (Get-Location) $ProjectName
        New-Item -Path $ProjectPath -ItemType Directory -Force | Out-Null

        Push-Location $ProjectPath
        git init

        switch ($Runtime) {
            "node"   { npm init -y }
            "python" { python -m venv .venv }
            "dotnet" { dotnet new console }
        }

        Pop-Location
        Write-Host "프로젝트 생성 완료: $ProjectPath" -ForegroundColor Green
    }
}

Export-ModuleMember -Function Get-DevEnvironment, Invoke-ProjectSetup
```

```powershell
# DevTools.psd1 — 모듈 매니페스트
@{
    ModuleVersion = '1.0.0'
    Author        = 'DevInterface'
    Description   = '개발 환경 관리 유틸리티'
    RootModule    = 'DevTools.psm1'
    FunctionsToExport = @('Get-DevEnvironment', 'Invoke-ProjectSetup')
}
```

#### 2.6 Bash와 PowerShell 변환 가이드

| 작업 | Bash | PowerShell |
|------|------|-----------|
| 변수 할당 | `NAME="value"` | `$Name = "value"` |
| 환경변수 | `export KEY=val` | `$env:KEY = "val"` |
| 조건문 | `if [[ cond ]]; then` | `if ($cond) {` |
| 파일 존재 | `[[ -f file ]]` | `Test-Path file -PathType Leaf` |
| 파일 읽기 | `cat file` | `Get-Content file` |
| 파일 쓰기 | `echo "text" > file` | `"text" \| Out-File file` |
| 찾기 | `find . -name "*.js"` | `Get-ChildItem -Recurse -Filter *.js` |
| 검색 | `grep "pattern" file` | `Select-String -Pattern "pattern" file` |
| 프로세스 | `ps aux \| grep node` | `Get-Process \| Where-Object Name -like "*node*"` |
| 파이프 카운트 | `wc -l` | `Measure-Object -Line` |
| 종료 코드 | `$?` | `$LASTEXITCODE` |
| Null 출력 | `> /dev/null 2>&1` | `*> $null` |
| 현재 디렉토리 | `pwd` | `Get-Location` (or `$PWD`) |

#### 2.7 실행 정책과 서명

```powershell
# 현재 실행 정책 확인
Get-ExecutionPolicy -List

# 실행 정책 변경 (관리자 권한 필요)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# 실행 정책 단계
# Restricted     : 스크립트 실행 불가 (Windows 기본값)
# AllSigned       : 서명된 스크립트만 실행
# RemoteSigned    : 로컬 스크립트 허용, 원격은 서명 필요 (권장)
# Unrestricted    : 모두 허용 (경고 표시)
# Bypass          : 제한 없음 (위험)

# 단일 스크립트 임시 실행
powershell -ExecutionPolicy Bypass -File .\script.ps1
```

### 실습 과제: PowerShell 시스템 관리 스크립트

> 시스템 상태를 점검하고 리포트를 생성하는 PowerShell 스크립트를 작성하세요.

```powershell
#Requires -Version 7.0

<#
.SYNOPSIS
    시스템 상태 점검 및 리포트 생성
.DESCRIPTION
    CPU, 메모리, 디스크, 네트워크 상태를 점검하고 HTML 리포트를 생성합니다.
.PARAMETER OutputPath
    리포트 저장 경로 (기본: ./system-report.html)
.EXAMPLE
    .\System-Report.ps1 -OutputPath "C:\Reports\daily.html"
#>

param(
    [string]$OutputPath = "./system-report.html",
    [switch]$OpenReport
)

$Report = [ordered]@{
    Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Hostname  = $env:COMPUTERNAME ?? (hostname)
}

# CPU 사용률
$CpuUsage = (Get-Counter '\Processor(_Total)\% Processor Time' -ErrorAction SilentlyContinue).CounterSamples.CookedValue
$Report["CPU"] = "$([math]::Round($CpuUsage, 1))%"

# 메모리
$OS = Get-CimInstance Win32_OperatingSystem -ErrorAction SilentlyContinue
if ($OS) {
    $TotalMem = [math]::Round($OS.TotalVisibleMemorySize / 1MB, 1)
    $FreeMem  = [math]::Round($OS.FreePhysicalMemory / 1MB, 1)
    $UsedMem  = $TotalMem - $FreeMem
    $Report["Memory"] = "$UsedMem / $TotalMem GB ({0:P0})" -f ($UsedMem / $TotalMem)
}

# 디스크
$Disks = Get-PSDrive -PSProvider FileSystem | ForEach-Object {
    [PSCustomObject]@{
        Drive    = $_.Name
        UsedGB   = [math]::Round($_.Used / 1GB, 1)
        FreeGB   = [math]::Round($_.Free / 1GB, 1)
        TotalGB  = [math]::Round(($_.Used + $_.Free) / 1GB, 1)
        UsedPct  = if (($_.Used + $_.Free) -gt 0) {
                       [math]::Round($_.Used / ($_.Used + $_.Free) * 100, 1)
                   } else { 0 }
    }
}

# 리포트 출력
$Report | Format-Table -AutoSize
$Disks | Format-Table -AutoSize

Write-Host "리포트 저장 완료: $OutputPath" -ForegroundColor Green
```

---

## 3. 자동화 스크립트 실전

### 학습 목표

- 실무에서 바로 활용 가능한 Bash 자동화 스크립트 5가지를 익힌다
- PowerShell 기반 Windows 관리 스크립트 3가지를 작성한다
- 크로스 플랫폼 자동화 전략을 이해한다

### 상세 설명

#### 3.1 Bash 실전 스크립트 5가지

**스크립트 1: 자동 백업**

```bash
#!/bin/bash
set -euo pipefail

# 프로젝트 자동 백업 스크립트
BACKUP_DIR="/backup/projects"
SOURCE_DIR="${1:-.}"
MAX_BACKUPS=7
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
PROJECT_NAME=$(basename "$(cd "$SOURCE_DIR" && pwd)")
BACKUP_FILE="${BACKUP_DIR}/${PROJECT_NAME}_${TIMESTAMP}.tar.gz"

mkdir -p "$BACKUP_DIR"

# 제외 패턴
EXCLUDE_PATTERNS=(
    --exclude='node_modules'
    --exclude='.git'
    --exclude='__pycache__'
    --exclude='.venv'
    --exclude='dist'
    --exclude='build'
)

echo "백업 시작: $SOURCE_DIR -> $BACKUP_FILE"
tar -czf "$BACKUP_FILE" "${EXCLUDE_PATTERNS[@]}" -C "$(dirname "$SOURCE_DIR")" "$PROJECT_NAME"

# 오래된 백업 정리
BACKUP_COUNT=$(ls -1 "${BACKUP_DIR}/${PROJECT_NAME}_"*.tar.gz 2>/dev/null | wc -l)
if [[ $BACKUP_COUNT -gt $MAX_BACKUPS ]]; then
    ls -1t "${BACKUP_DIR}/${PROJECT_NAME}_"*.tar.gz | tail -n +$((MAX_BACKUPS + 1)) | xargs rm -f
    echo "오래된 백업 정리 완료 (최대 ${MAX_BACKUPS}개 유지)"
fi

BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
echo "백업 완료: $BACKUP_FILE ($BACKUP_SIZE)"
```

**스크립트 2: 로그 분석**

```bash
#!/bin/bash
set -euo pipefail

# 웹 서버 로그 분석 스크립트
LOG_FILE="${1:-/var/log/nginx/access.log}"

[[ -f "$LOG_FILE" ]] || { echo "로그 파일 없음: $LOG_FILE"; exit 1; }

echo "=== 로그 분석 리포트 ==="
echo "파일: $LOG_FILE"
echo "기간: $(head -1 "$LOG_FILE" | awk '{print $4}') ~ $(tail -1 "$LOG_FILE" | awk '{print $4}')"
echo ""

echo "--- 상태 코드별 요청 수 ---"
awk '{print $9}' "$LOG_FILE" | sort | uniq -c | sort -rn | head -10

echo ""
echo "--- 상위 IP 주소 ---"
awk '{print $1}' "$LOG_FILE" | sort | uniq -c | sort -rn | head -10

echo ""
echo "--- 가장 많이 요청된 URL ---"
awk '{print $7}' "$LOG_FILE" | sort | uniq -c | sort -rn | head -10

echo ""
echo "--- 시간대별 요청 분포 ---"
awk -F'[' '{print $2}' "$LOG_FILE" | awk -F: '{print $2":00"}' | sort | uniq -c | sort -k2
```

**스크립트 3: 일괄 이미지 변환**

```bash
#!/bin/bash
set -euo pipefail

# 이미지 일괄 변환 및 최적화
INPUT_DIR="${1:-.}"
OUTPUT_DIR="${2:-./optimized}"
QUALITY=85
MAX_WIDTH=1920

command -v convert >/dev/null 2>&1 || { echo "ImageMagick이 필요합니다"; exit 1; }

mkdir -p "$OUTPUT_DIR"

total=0
processed=0

for img in "$INPUT_DIR"/*.{jpg,jpeg,png,webp} 2>/dev/null; do
    [[ -f "$img" ]] || continue
    ((total++))

    filename=$(basename "$img")
    output="$OUTPUT_DIR/${filename%.*}.webp"

    convert "$img" -resize "${MAX_WIDTH}x>" -quality $QUALITY "$output"

    orig_size=$(du -k "$img" | cut -f1)
    new_size=$(du -k "$output" | cut -f1)
    savings=$(( (orig_size - new_size) * 100 / orig_size ))

    echo "[$((++processed))/$total] $filename -> $(basename "$output") (${savings}% 절약)"
done

echo "=== 완료: $processed개 파일 변환됨 ==="
```

**스크립트 4: 시스템 모니터링**

```bash
#!/bin/bash
set -euo pipefail

# 시스템 자원 모니터링 (임계치 초과 시 알림)
CPU_THRESHOLD=80
MEM_THRESHOLD=85
DISK_THRESHOLD=90

check_cpu() {
    local cpu_usage
    cpu_usage=$(top -bn1 | grep "Cpu(s)" | awk '{print int($2 + $4)}')
    if [[ $cpu_usage -gt $CPU_THRESHOLD ]]; then
        echo "[경고] CPU 사용률: ${cpu_usage}% (임계치: ${CPU_THRESHOLD}%)"
        return 1
    fi
    echo "[정상] CPU 사용률: ${cpu_usage}%"
}

check_memory() {
    local mem_usage
    mem_usage=$(free | awk '/Mem:/ {printf("%d", $3/$2 * 100)}')
    if [[ $mem_usage -gt $MEM_THRESHOLD ]]; then
        echo "[경고] 메모리 사용률: ${mem_usage}% (임계치: ${MEM_THRESHOLD}%)"
        return 1
    fi
    echo "[정상] 메모리 사용률: ${mem_usage}%"
}

check_disk() {
    local alerts=0
    while read -r usage mount; do
        usage=${usage%\%}
        if [[ $usage -gt $DISK_THRESHOLD ]]; then
            echo "[경고] 디스크 사용률: ${usage}% at ${mount} (임계치: ${DISK_THRESHOLD}%)"
            ((alerts++))
        fi
    done < <(df -h --output=pcent,target | tail -n +2 | awk '{print $1, $2}')

    [[ $alerts -eq 0 ]] && echo "[정상] 모든 디스크 사용률 정상"
}

echo "=== 시스템 모니터링 $(date '+%Y-%m-%d %H:%M:%S') ==="
check_cpu
check_memory
check_disk
```

**스크립트 5: 배포 스크립트**

```bash
#!/bin/bash
set -euo pipefail

# Git 기반 간단 배포 스크립트
DEPLOY_BRANCH="main"
DEPLOY_DIR="/var/www/app"
BACKUP_DIR="/var/www/backups"

log() { echo "[$(date '+%H:%M:%S')] $*"; }

# 현재 브랜치 확인
CURRENT_BRANCH=$(git branch --show-current)
if [[ "$CURRENT_BRANCH" != "$DEPLOY_BRANCH" ]]; then
    echo "오류: $DEPLOY_BRANCH 브랜치에서만 배포할 수 있습니다 (현재: $CURRENT_BRANCH)"
    exit 1
fi

# 미커밋 변경사항 확인
if ! git diff --quiet HEAD; then
    echo "오류: 커밋되지 않은 변경사항이 있습니다"
    exit 1
fi

log "배포 시작..."

# 백업 생성
log "현재 버전 백업 중..."
BACKUP_NAME="backup_$(date +%Y%m%d_%H%M%S).tar.gz"
tar -czf "$BACKUP_DIR/$BACKUP_NAME" -C "$DEPLOY_DIR" . 2>/dev/null || true

# 빌드
log "빌드 실행 중..."
npm ci --production
npm run build

# 배포
log "파일 배포 중..."
rsync -avz --delete ./dist/ "$DEPLOY_DIR/"

# 헬스체크
log "헬스체크 중..."
sleep 2
if curl -sf http://localhost:3000/health > /dev/null; then
    log "배포 성공"
else
    log "경고: 헬스체크 실패 — 롤백을 검토하세요"
    exit 1
fi
```

#### 3.2 PowerShell 실전 스크립트 3가지

**스크립트 1: Active Directory 사용자 관리**

```powershell
#Requires -Modules ActiveDirectory

<#
.SYNOPSIS
    CSV 파일에서 AD 사용자 일괄 생성/수정
#>
param(
    [Parameter(Mandatory)]
    [string]$CsvPath,
    [switch]$WhatIf
)

$Users = Import-Csv $CsvPath -Encoding UTF8

foreach ($User in $Users) {
    $Params = @{
        Name              = "$($User.LastName) $($User.FirstName)"
        SamAccountName    = $User.Username
        UserPrincipalName = "$($User.Username)@company.local"
        GivenName         = $User.FirstName
        Surname           = $User.LastName
        Department        = $User.Department
        Title             = $User.Title
        Path              = "OU=$($User.Department),DC=company,DC=local"
        Enabled           = $true
    }

    $Existing = Get-ADUser -Filter "SamAccountName -eq '$($User.Username)'" -ErrorAction SilentlyContinue

    if ($Existing) {
        if ($WhatIf) {
            Write-Host "[미리보기] 수정: $($User.Username)" -ForegroundColor Yellow
        } else {
            Set-ADUser -Identity $Existing -Department $User.Department -Title $User.Title
            Write-Host "수정 완료: $($User.Username)" -ForegroundColor Cyan
        }
    } else {
        if ($WhatIf) {
            Write-Host "[미리보기] 생성: $($Params.Name)" -ForegroundColor Green
        } else {
            New-ADUser @Params -AccountPassword (ConvertTo-SecureString "TempP@ss123!" -AsPlainText -Force)
            Write-Host "생성 완료: $($Params.Name)" -ForegroundColor Green
        }
    }
}
```

**스크립트 2: 레지스트리 조작**

```powershell
<#
.SYNOPSIS
    개발 환경 레지스트리 설정 일괄 적용
#>

$DevSettings = @(
    @{
        Path  = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced"
        Name  = "HideFileExt"
        Value = 0
        Type  = "DWord"
        Desc  = "파일 확장자 표시"
    },
    @{
        Path  = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced"
        Name  = "Hidden"
        Value = 1
        Type  = "DWord"
        Desc  = "숨김 파일 표시"
    },
    @{
        Path  = "HKCU:\Console"
        Name  = "QuickEdit"
        Value = 1
        Type  = "DWord"
        Desc  = "콘솔 빠른 편집 모드"
    }
)

foreach ($Setting in $DevSettings) {
    if (-not (Test-Path $Setting.Path)) {
        New-Item -Path $Setting.Path -Force | Out-Null
    }

    $Current = Get-ItemProperty -Path $Setting.Path -Name $Setting.Name -ErrorAction SilentlyContinue

    if ($Current.$($Setting.Name) -ne $Setting.Value) {
        Set-ItemProperty -Path $Setting.Path -Name $Setting.Name -Value $Setting.Value -Type $Setting.Type
        Write-Host "[적용] $($Setting.Desc): $($Setting.Value)" -ForegroundColor Green
    } else {
        Write-Host "[유지] $($Setting.Desc): 이미 설정됨" -ForegroundColor Gray
    }
}
```

**스크립트 3: Windows 서비스 관리**

```powershell
<#
.SYNOPSIS
    개발 관련 Windows 서비스 일괄 관리
#>
param(
    [ValidateSet("Start", "Stop", "Status")]
    [string]$Action = "Status"
)

$DevServices = @(
    @{ Name = "docker"; Display = "Docker Desktop Service" },
    @{ Name = "W3SVC"; Display = "IIS (World Wide Web)" },
    @{ Name = "MSSQLSERVER"; Display = "SQL Server" },
    @{ Name = "PostgreSQL"; Display = "PostgreSQL" },
    @{ Name = "MongoDB"; Display = "MongoDB" }
)

foreach ($Svc in $DevServices) {
    $Service = Get-Service -Name $Svc.Name -ErrorAction SilentlyContinue

    if (-not $Service) {
        Write-Host "[-] $($Svc.Display): 미설치" -ForegroundColor DarkGray
        continue
    }

    switch ($Action) {
        "Status" {
            $Color = if ($Service.Status -eq 'Running') { 'Green' } else { 'Yellow' }
            Write-Host "[$($Service.Status)] $($Svc.Display)" -ForegroundColor $Color
        }
        "Start" {
            if ($Service.Status -ne 'Running') {
                Start-Service $Svc.Name -ErrorAction SilentlyContinue
                Write-Host "[시작] $($Svc.Display)" -ForegroundColor Green
            }
        }
        "Stop" {
            if ($Service.Status -eq 'Running') {
                Stop-Service $Svc.Name -Force -ErrorAction SilentlyContinue
                Write-Host "[중지] $($Svc.Display)" -ForegroundColor Yellow
            }
        }
    }
}
```

#### 3.3 크로스 플랫폼 자동화 전략

| 전략 | 도구 | 장점 | 단점 |
|------|------|------|------|
| **OS별 스크립트 분리** | .sh + .ps1 | 각 OS 네이티브 활용 | 유지보수 2배 |
| **셸 감지 분기** | 단일 스크립트 내 분기 | 파일 1개로 관리 | 복잡도 증가 |
| **Makefile / Taskfile** | make, task | 선언적, 간결 | Windows make 설치 필요 |
| **Node.js 스크립트** | package.json scripts | npm 통합, 크로스 플랫폼 | Node.js 의존 |
| **Python 스크립트** | subprocess, pathlib | 강력한 크로스 플랫폼 | Python 의존 |
| **Docker 래퍼** | docker run | 완벽한 환경 격리 | Docker 필요 |

### 실습 과제: 크로스 플랫폼 백업 스크립트 (Bash + PowerShell)

> 동일한 백업 로직을 Bash와 PowerShell 두 버전으로 작성하고, 래퍼 스크립트로 OS를 감지하여 적절한 버전을 호출하세요.

---

## 4. CLI 파이프라인과 데이터 처리

### 학습 목표

- Bash의 sed/awk/jq를 활용한 고급 데이터 변환 파이프라인을 설계한다
- PowerShell의 객체 파이프라인과 JSON 처리를 비교 학습한다
- 실무 로그 데이터를 통계 리포트로 변환하는 전체 파이프라인을 구축한다

### 상세 설명

#### 4.1 고급 파이프라인 설계 원칙

효과적인 CLI 파이프라인 설계의 핵심 원칙:

1. **단일 책임**: 각 파이프 단계는 하나의 변환만 수행
2. **스트리밍**: 전체 데이터를 메모리에 올리지 않고 스트림 처리
3. **재사용**: 중간 단계를 함수로 추출하여 재사용
4. **디버깅**: `tee` 또는 중간 파일로 파이프라인 단계별 확인

#### 4.2 sed / awk 활용

```bash
# sed — 스트림 편집기
# 패턴 치환
echo "Hello World" | sed 's/World/Shell/'

# 여러 치환 체이닝
cat config.template | sed \
    -e "s/{{HOST}}/$DB_HOST/g" \
    -e "s/{{PORT}}/$DB_PORT/g" \
    -e "s/{{NAME}}/$DB_NAME/g" > config.ini

# 특정 범위 추출 (10~20번째 줄)
sed -n '10,20p' large-file.log

# 패턴 사이 추출
sed -n '/BEGIN_CONFIG/,/END_CONFIG/p' app.conf

# awk — 필드 기반 텍스트 처리
# CSV 처리 — 2번째 필드 합계
awk -F',' '{sum += $2} END {print "합계:", sum}' sales.csv

# 조건부 필터링 및 포맷팅
awk '$3 > 100 {printf "%-20s %10.2f\n", $1, $3}' data.txt

# 복잡한 로그 분석
awk '
    /ERROR/ { errors++ }
    /WARN/  { warns++ }
    /INFO/  { infos++ }
    END {
        total = errors + warns + infos
        printf "ERROR: %d (%.1f%%)\n", errors, errors/total*100
        printf "WARN:  %d (%.1f%%)\n", warns, warns/total*100
        printf "INFO:  %d (%.1f%%)\n", infos, infos/total*100
    }
' application.log
```

#### 4.3 jq — JSON 처리

```bash
# 기본 필드 추출
echo '{"name":"app","version":"1.0"}' | jq '.name'

# 배열 처리
curl -s https://api.github.com/repos/microsoft/vscode/releases | jq '
    .[:5] | .[] | {
        tag: .tag_name,
        date: .published_at,
        assets: [.assets[] | .name]
    }
'

# 필터링 및 변환
cat packages.json | jq '
    [.dependencies | to_entries[] | select(.value | test("^\\^[0-9]"))] |
    sort_by(.key) |
    .[] | "\(.key): \(.value)"
'

# CSV 변환
cat data.json | jq -r '
    .[] | [.name, .email, .role] | @csv
' > output.csv

# 집계
cat logs.json | jq '
    group_by(.status) |
    map({
        status: .[0].status,
        count: length,
        avg_time: (map(.response_time) | add / length)
    }) |
    sort_by(-.count)
'
```

#### 4.4 PowerShell JSON 처리 비교

```powershell
# JSON 읽기/쓰기
$Data = Get-Content "data.json" | ConvertFrom-Json

# 필터링
$Data | Where-Object { $_.status -eq "active" } |
    Select-Object name, email |
    ConvertTo-Json -Depth 3

# API 호출 + JSON 처리
$Releases = Invoke-RestMethod "https://api.github.com/repos/microsoft/vscode/releases"
$Releases | Select-Object -First 5 |
    ForEach-Object {
        [PSCustomObject]@{
            Tag   = $_.tag_name
            Date  = $_.published_at
            Assets = ($_.assets | ForEach-Object { $_.name }) -join ", "
        }
    } | Format-Table -AutoSize

# JSON -> CSV 변환
$Data | Export-Csv -Path "output.csv" -NoTypeInformation -Encoding UTF8

# 집계
$Data | Group-Object status | ForEach-Object {
    [PSCustomObject]@{
        Status   = $_.Name
        Count    = $_.Count
        AvgTime  = ($_.Group | Measure-Object response_time -Average).Average
    }
} | Sort-Object -Property Count -Descending
```

#### 4.5 데이터 변환 체인 비교

| 작업 | Bash | PowerShell |
|------|------|-----------|
| JSON 파싱 | `jq '.field'` | `ConvertFrom-Json \| Select field` |
| CSV 파싱 | `awk -F','` | `Import-Csv` |
| 필터링 | `grep / awk 조건` | `Where-Object` |
| 정렬 | `sort -k2 -n` | `Sort-Object -Property col` |
| 중복 제거 | `sort \| uniq` | `Select-Object -Unique` |
| 집계 | `awk '{sum+=$1} END{...}'` | `Measure-Object -Sum` |
| 상위 N개 | `head -n 10` | `Select-Object -First 10` |
| 포맷 출력 | `printf / column` | `Format-Table` |

### 실습 과제: 로그 분석 파이프라인

> 웹 서버 로그 파일에서 다음 통계를 추출하는 파이프라인을 Bash와 PowerShell 양쪽으로 작성하세요.
>
> 1. 시간대별 요청 수 집계
> 2. HTTP 상태 코드별 분포
> 3. 가장 느린 응답 상위 10개
> 4. 결과를 JSON 리포트로 출력

```bash
#!/bin/bash
# Bash 버전 — 로그 분석 파이프라인
LOG_FILE="${1:-access.log}"

echo "{"

# 시간대별 요청 수
echo '  "hourly_requests":'
awk -F'[/: ]' '{print $5}' "$LOG_FILE" |
    sort | uniq -c | sort -rn |
    awk 'BEGIN{print "  ["} {printf "    {\"hour\": \"%s\", \"count\": %d}", $2, $1; if(NR>1) printf ","; print ""} END{print "  ],"}'

# 상태 코드 분포
echo '  "status_codes":'
awk '{print $9}' "$LOG_FILE" |
    sort | uniq -c | sort -rn |
    awk 'BEGIN{print "  ["} {printf "    {\"code\": \"%s\", \"count\": %d}", $2, $1; if(NR>1) printf ","; print ""} END{print "  ]"}'

echo "}"
```

---

## 5. 환경 변수와 시크릿 관리

### 학습 목표

- 시스템/사용자/프로세스 수준 환경변수의 차이를 이해한다
- .env 파일과 dotenv 패턴을 활용한 프로젝트별 설정 관리를 익힌다
- 시크릿 보안 원칙과 12-Factor App 방법론을 학습한다

### 상세 설명

#### 5.1 환경변수 계층 구조

```
시스템 환경변수 (모든 사용자)
  └── 사용자 환경변수 (현재 사용자)
        └── 셸 세션 환경변수 (현재 터미널)
              └── 프로세스 환경변수 (현재 프로그램)
```

**Bash에서의 환경변수:**

```bash
# 환경변수 설정
export DATABASE_URL="postgresql://localhost:5432/mydb"
export NODE_ENV="development"

# 단일 명령에만 적용
NODE_ENV=production npm start

# .bashrc / .zshrc에 영구 설정
echo 'export EDITOR="code --wait"' >> ~/.bashrc
source ~/.bashrc

# 환경변수 확인
env | grep NODE
printenv DATABASE_URL
echo $PATH
```

**PowerShell / Windows에서의 환경변수:**

```powershell
# 프로세스 수준 (현재 세션만)
$env:DATABASE_URL = "postgresql://localhost:5432/mydb"
$env:NODE_ENV = "development"

# 사용자 수준 (영구 — 현재 사용자)
[Environment]::SetEnvironmentVariable("EDITOR", "code --wait", "User")

# 시스템 수준 (영구 — 모든 사용자, 관리자 권한 필요)
[Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\Java\jdk-21", "Machine")

# 환경변수 확인
Get-ChildItem env: | Where-Object Name -like "*NODE*"
$env:PATH -split ';'

# 시스템 속성 GUI (Windows)
# Win+R -> sysdm.cpl -> 고급 -> 환경 변수
```

#### 5.2 .env 파일과 dotenv 패턴

```bash
# .env 파일 예시
# 주석은 # 으로
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:pass@localhost:5432/mydb
REDIS_URL=redis://localhost:6379
API_KEY=dev-key-not-for-production
JWT_SECRET=local-dev-secret-change-in-prod

# .env.example (커밋 대상 — 시크릿 값 제외)
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
API_KEY=your-api-key-here
JWT_SECRET=your-jwt-secret-here
```

```bash
# .env 로딩 스크립트
load_env() {
    local env_file="${1:-.env}"
    if [[ -f "$env_file" ]]; then
        set -a  # 자동 export 활성화
        source "$env_file"
        set +a
        echo ".env 파일 로드 완료: $env_file"
    else
        echo "경고: $env_file 파일이 없습니다" >&2
    fi
}

load_env ".env.local"  # 로컬 오버라이드 우선
load_env ".env"         # 기본 설정
```

```powershell
# PowerShell — .env 로딩
function Import-DotEnv {
    param([string]$Path = ".env")

    if (-not (Test-Path $Path)) {
        Write-Warning ".env 파일이 없습니다: $Path"
        return
    }

    Get-Content $Path | ForEach-Object {
        if ($_ -match '^\s*#' -or [string]::IsNullOrWhiteSpace($_)) { return }
        if ($_ -match '^([^=]+)=(.*)$') {
            $key = $Matches[1].Trim()
            $value = $Matches[2].Trim().Trim('"', "'")
            [Environment]::SetEnvironmentVariable($key, $value, "Process")
            Write-Verbose "설정: $key"
        }
    }
    Write-Host ".env 로드 완료: $Path" -ForegroundColor Green
}

Import-DotEnv ".env"
```

#### 5.3 시크릿 보안 원칙

> "시크릿은 코드에 넣지 않는다" — 실사용자 조언

**절대 하지 말아야 할 것:**

```bash
# 나쁜 예 — 코드에 시크릿 하드코딩
API_KEY="sk-1234567890abcdef"  # 절대 금지
git add . && git commit         # 시크릿이 Git 히스토리에 영구 기록됨
```

**올바른 시크릿 관리:**

```bash
# .gitignore에 반드시 추가
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
echo "*.pem" >> .gitignore
echo "*.key" >> .gitignore

# Git에 이미 커밋된 시크릿 제거
git filter-branch --force --index-filter \
    "git rm --cached --ignore-unmatch .env" HEAD
# 또는 더 안전한 BFG Repo-Cleaner 사용
```

#### 5.4 12-Factor App — 설정 원칙

12-Factor App 방법론의 3번째 요소(Config)는 설정을 환경변수로 관리할 것을 권장합니다.

| 원칙 | 설명 |
|------|------|
| 코드와 설정 분리 | 설정은 환경변수로, 코드에 하드코딩 금지 |
| 환경별 설정 | dev/staging/prod를 환경변수로 구분 |
| 시크릿 외부화 | API 키, DB 비밀번호는 시크릿 매니저 사용 |
| 기본값 제공 | 개발 환경용 합리적 기본값 설정 |
| 유효성 검증 | 애플리케이션 시작 시 필수 환경변수 검증 |

### 실습 과제: 프로젝트별 환경 변수 설정

> 개발/스테이징/프로덕션 3개 환경에 대한 .env 파일 세트를 구성하고, 환경별 로딩 스크립트를 작성하세요.

---

## 6. 개발 환경 설정 자동화

### 학습 목표

- dotfiles 관리 도구(stow, chezmoi)를 활용하여 설정을 버전 관리한다
- Windows 패키지 관리자(winget, scoop)로 개발 도구를 자동 설치한다
- 셸 프롬프트(Oh My Zsh, Starship)와 PowerShell 프로파일을 커스터마이즈한다

### 상세 설명

#### 6.1 dotfiles 관리

dotfiles는 `~/.bashrc`, `~/.gitconfig`, `~/.vimrc` 등 점(.)으로 시작하는 설정 파일을 통칭합니다. 이를 Git으로 관리하면 어떤 환경에서든 동일한 개발 환경을 즉시 복원할 수 있습니다.

**GNU Stow 방식:**

```bash
# dotfiles 저장소 구조
~/dotfiles/
├── bash/
│   └── .bashrc
│   └── .bash_aliases
├── git/
│   └── .gitconfig
│   └── .gitignore_global
├── vim/
│   └── .vimrc
└── starship/
    └── .config/
        └── starship.toml

# stow로 심볼릭 링크 생성
cd ~/dotfiles
stow bash      # ~/.bashrc -> ~/dotfiles/bash/.bashrc
stow git       # ~/.gitconfig -> ~/dotfiles/git/.gitconfig
stow vim
stow starship

# 전체 한번에 설치
for dir in */; do stow "$dir"; done
```

**chezmoi 방식 (크로스 플랫폼):**

```bash
# 설치
sh -c "$(curl -fsLS get.chezmoi.io)"

# 초기화
chezmoi init

# 파일 추가
chezmoi add ~/.bashrc
chezmoi add ~/.gitconfig

# 템플릿 활용 (머신별 설정 분기)
# ~/.local/share/chezmoi/dot_gitconfig.tmpl
# [user]
#   name = {{ .name }}
#   email = {{ .email }}

# 변경 사항 적용
chezmoi apply

# 원격 저장소에서 복원
chezmoi init --apply https://github.com/username/dotfiles.git
```

#### 6.2 Windows 패키지 관리

```powershell
# === winget (Windows 공식 패키지 관리자) ===

# 개발 도구 일괄 설치 스크립트
$DevPackages = @(
    "Microsoft.VisualStudioCode"
    "Git.Git"
    "OpenJS.NodeJS.LTS"
    "Python.Python.3.12"
    "Docker.DockerDesktop"
    "Microsoft.WindowsTerminal"
    "JanDeDobbeleer.OhMyPosh"
    "Starship.Starship"
)

foreach ($pkg in $DevPackages) {
    Write-Host "설치 중: $pkg" -ForegroundColor Cyan
    winget install --id $pkg --accept-source-agreements --accept-package-agreements
}

# 설치된 패키지 목록 내보내기/가져오기
winget export -o packages.json
winget import -i packages.json

# === scoop (개발자 친화적 패키지 관리자) ===

# scoop 설치
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
irm get.scoop.sh | iex

# 버킷 추가
scoop bucket add extras
scoop bucket add nerd-fonts

# CLI 도구 설치
scoop install fzf ripgrep bat delta fd jq yq
scoop install neovim lazygit

# NerdFont 설치 (터미널 아이콘)
scoop install FiraCode-NF
```

#### 6.3 셸 프롬프트 커스터마이즈

**Starship (크로스 플랫폼 프롬프트):**

```toml
# ~/.config/starship.toml

# 프롬프트 포맷
format = """
[╭─](bold green) $directory$git_branch$git_status$nodejs$python$docker_context
[╰─](bold green) $character"""

[character]
success_symbol = "[>](bold green)"
error_symbol = "[x](bold red)"

[directory]
truncation_length = 3
truncation_symbol = ".../"

[git_branch]
symbol = " "
format = "[$symbol$branch]($style) "

[git_status]
format = '([$all_status$ahead_behind]($style) )'

[nodejs]
symbol = " "
format = "[$symbol($version)]($style) "

[python]
symbol = " "
format = "[$symbol($version)]($style) "

[docker_context]
symbol = " "
format = "[$symbol$context]($style) "
```

#### 6.4 PowerShell 프로파일 ($PROFILE) 고급 설정

```powershell
# $PROFILE 파일 위치 확인
$PROFILE  # 현재 사용자, 현재 호스트

# 프로파일 파일 생성/편집
if (-not (Test-Path $PROFILE)) {
    New-Item -Path $PROFILE -ItemType File -Force
}
code $PROFILE

# === $PROFILE 내용 ===

# 모듈 로드
Import-Module posh-git       # Git 상태 표시
Import-Module Terminal-Icons  # 파일 아이콘

# Starship 프롬프트 초기화
Invoke-Expression (&starship init powershell)

# PSReadLine 고급 설정
Set-PSReadLineOption -PredictionSource HistoryAndPlugin
Set-PSReadLineOption -PredictionViewStyle ListView
Set-PSReadLineOption -EditMode Emacs
Set-PSReadLineKeyHandler -Key Tab -Function MenuComplete
Set-PSReadLineKeyHandler -Key UpArrow -Function HistorySearchBackward
Set-PSReadLineKeyHandler -Key DownArrow -Function HistorySearchForward

# 별칭 (Alias)
Set-Alias -Name g -Value git
Set-Alias -Name k -Value kubectl
Set-Alias -Name d -Value docker
Set-Alias -Name c -Value code
Set-Alias -Name which -Value Get-Command

# 커스텀 함수
function mkcd { param($dir) New-Item -ItemType Directory -Path $dir -Force | Set-Location }
function ll { Get-ChildItem -Force @args }
function gs { git status }
function glog { git log --oneline --graph -20 }
function ports { Get-NetTCPConnection | Where-Object State -eq Listen | Sort-Object LocalPort }

# 환경 설정
$env:EDITOR = "code --wait"
$env:LESS = "-R"

# 프로젝트 빠른 이동
function proj {
    param([string]$Name)
    $ProjectRoot = "$HOME\Projects"
    $Target = Join-Path $ProjectRoot $Name
    if (Test-Path $Target) {
        Set-Location $Target
    } else {
        Get-ChildItem $ProjectRoot -Directory |
            Where-Object Name -like "*$Name*" |
            Select-Object -First 1 |
            ForEach-Object { Set-Location $_.FullName }
    }
}

Write-Host "PowerShell 프로파일 로드 완료" -ForegroundColor Green
```

### 실습 과제: dotfiles + PowerShell 프로파일 자동화

> 1. dotfiles Git 저장소를 생성하고, 최소 3개 설정 파일을 관리하세요
> 2. PowerShell 프로파일에 자주 사용하는 별칭과 함수를 10개 이상 추가하세요
> 3. 새 PC 설정을 위한 부트스트랩 스크립트(setup.ps1)를 작성하세요

---

## 7. VS Code 고급 활용

### 학습 목표

- VS Code Remote 개발 환경(SSH, WSL, Containers)을 구성한다
- Dev Containers로 팀 공유 가능한 격리 개발 환경을 만든다
- tasks.json 고급 설정과 멀티루트 워크스페이스를 활용한다

### 상세 설명

#### 7.1 VS Code Remote 개발

VS Code의 Remote Development 확장 팩은 로컬 에디터에서 원격 환경의 코드를 편집할 수 있게 해줍니다.

| 확장 | 용도 | 사용 사례 |
|------|------|----------|
| **Remote - SSH** | SSH 서버 접속 | 원격 서버 개발, GPU 머신 활용 |
| **Remote - WSL** | Windows에서 WSL 접속 | Windows에서 Linux 개발 |
| **Dev Containers** | Docker 컨테이너 접속 | 격리된 개발 환경 |
| **Remote - Tunnels** | 터널 기반 원격 접속 | 방화벽 뒤 서버 접속 |

**Remote-SSH 설정:**

```
# ~/.ssh/config
Host dev-server
    HostName 192.168.1.100
    User developer
    Port 22
    IdentityFile ~/.ssh/id_ed25519
    ForwardAgent yes

Host gpu-server
    HostName gpu.company.com
    User ml-engineer
    IdentityFile ~/.ssh/id_ed25519
    LocalForward 8888 localhost:8888
    LocalForward 6006 localhost:6006
```

#### 7.2 Dev Containers (devcontainer.json)

```jsonc
// .devcontainer/devcontainer.json
{
    "name": "Node.js & TypeScript",
    "image": "mcr.microsoft.com/devcontainers/typescript-node:20",

    // 또는 커스텀 Dockerfile 사용
    // "build": {
    //     "dockerfile": "Dockerfile",
    //     "context": ".."
    // },

    // 기능 추가
    "features": {
        "ghcr.io/devcontainers/features/docker-in-docker:2": {},
        "ghcr.io/devcontainers/features/git:1": {},
        "ghcr.io/devcontainers/features/github-cli:1": {}
    },

    // VS Code 확장 (컨테이너 내 설치)
    "customizations": {
        "vscode": {
            "extensions": [
                "dbaeumer.vscode-eslint",
                "esbenp.prettier-vscode",
                "bradlc.vscode-tailwindcss",
                "ms-azuretools.vscode-docker"
            ],
            "settings": {
                "editor.defaultFormatter": "esbenp.prettier-vscode",
                "editor.formatOnSave": true,
                "editor.tabSize": 2,
                "terminal.integrated.defaultProfile.linux": "zsh"
            }
        }
    },

    // 포트 포워딩
    "forwardPorts": [3000, 5432, 6379],
    "portsAttributes": {
        "3000": { "label": "App", "onAutoForward": "openBrowser" },
        "5432": { "label": "PostgreSQL", "onAutoForward": "silent" }
    },

    // 생명주기 스크립트
    "postCreateCommand": "npm install",
    "postStartCommand": "npm run dev",

    // 마운트
    "mounts": [
        "source=${localEnv:HOME}/.ssh,target=/home/node/.ssh,type=bind,readonly",
        "source=${localEnv:HOME}/.gitconfig,target=/home/node/.gitconfig,type=bind,readonly"
    ],

    // 환경변수
    "containerEnv": {
        "NODE_ENV": "development"
    },

    // 사용자 설정
    "remoteUser": "node"
}
```

#### 7.3 tasks.json 고급 설정

```jsonc
// .vscode/tasks.json
{
    "version": "2.0.0",
    "tasks": [
        {
            "label": "빌드",
            "type": "shell",
            "command": "npm run build",
            "group": {
                "kind": "build",
                "isDefault": true
            },
            "problemMatcher": ["$tsc"],
            "presentation": {
                "reveal": "silent",
                "panel": "shared"
            }
        },
        {
            "label": "테스트",
            "type": "shell",
            "command": "npm test",
            "group": {
                "kind": "test",
                "isDefault": true
            },
            "problemMatcher": []
        },
        {
            "label": "개발 서버",
            "type": "shell",
            "command": "npm run dev",
            "isBackground": true,
            "problemMatcher": {
                "pattern": {
                    "regexp": ".",
                    "file": 1,
                    "location": 2,
                    "message": 3
                },
                "background": {
                    "activeOnStart": true,
                    "beginsPattern": "Starting development server",
                    "endsPattern": "ready in \\d+ms"
                }
            }
        },
        {
            "label": "Docker 빌드 & 실행",
            "dependsOn": ["Docker 빌드", "Docker 실행"],
            "dependsOrder": "sequence"
        },
        {
            "label": "Docker 빌드",
            "type": "shell",
            "command": "docker build -t ${input:imageName} .",
            "problemMatcher": []
        },
        {
            "label": "Docker 실행",
            "type": "shell",
            "command": "docker run -p ${input:port}:3000 ${input:imageName}",
            "problemMatcher": []
        }
    ],
    "inputs": [
        {
            "id": "imageName",
            "type": "promptString",
            "description": "Docker 이미지 이름",
            "default": "my-app"
        },
        {
            "id": "port",
            "type": "pickString",
            "description": "포트 선택",
            "options": ["3000", "8080", "8443"],
            "default": "3000"
        }
    ]
}
```

#### 7.4 멀티루트 워크스페이스

```jsonc
// project.code-workspace
{
    "folders": [
        {
            "name": "Frontend",
            "path": "./frontend"
        },
        {
            "name": "Backend API",
            "path": "./backend"
        },
        {
            "name": "Shared Libraries",
            "path": "./packages/shared"
        },
        {
            "name": "Infrastructure",
            "path": "./infra"
        }
    ],
    "settings": {
        "files.exclude": {
            "**/node_modules": true,
            "**/dist": true
        },
        "search.exclude": {
            "**/node_modules": true,
            "**/coverage": true
        }
    },
    "extensions": {
        "recommendations": [
            "dbaeumer.vscode-eslint",
            "esbenp.prettier-vscode"
        ]
    }
}
```

#### 7.5 VS Code 프로파일 관리

VS Code 프로파일을 사용하면 프로젝트 유형별로 확장, 설정, 키바인딩을 분리 관리할 수 있습니다.

| 프로파일 | 확장 | 테마 | 용도 |
|---------|------|------|------|
| **Web Dev** | ESLint, Prettier, Tailwind | One Dark Pro | 프론트엔드 |
| **Python** | Pylance, Jupyter, Black | Dracula | 데이터/백엔드 |
| **DevOps** | Docker, YAML, Terraform | GitHub Dark | 인프라 |
| **Writing** | Markdown, Spell Check | Solarized Light | 문서 작성 |

```bash
# CLI로 프로파일 지정하여 VS Code 실행
code --profile "Web Dev" ./frontend
code --profile "DevOps" ./infra
```

### 실습 과제: Dev Container로 격리 개발 환경 구축

> 1. Node.js + PostgreSQL 개발 환경을 devcontainer.json으로 정의하세요
> 2. docker-compose.yml과 연동하여 DB 서비스를 함께 구동하세요
> 3. 팀원이 `code .`만으로 동일한 환경을 재현할 수 있도록 구성하세요

---

## 8. Docker 기반 개발 환경

### 학습 목표

- Dockerfile 작성과 멀티스테이지 빌드를 이해한다
- docker-compose로 멀티 서비스 개발 환경을 구성한다
- 볼륨 마운트, 네트워크, VS Code 연동을 실습한다

### 상세 설명

#### 8.1 Dockerfile 작성

```dockerfile
# === Node.js 애플리케이션 Dockerfile ===

# 멀티스테이지 빌드 — Stage 1: 의존성 설치
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Stage 2: 빌드
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 3: 프로덕션 이미지
FROM node:20-alpine AS runner
WORKDIR /app

# 보안: 비루트 사용자
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 appuser

# 프로덕션 의존성만 복사
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

# 환경변수
ENV NODE_ENV=production
ENV PORT=3000

# 포트 노출
EXPOSE 3000

# 비루트 사용자로 실행
USER appuser

# 헬스체크
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -qO- http://localhost:3000/health || exit 1

CMD ["node", "dist/server.js"]
```

#### 8.2 docker-compose 개발 환경

```yaml
# docker-compose.yml
version: "3.9"

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
      target: builder  # 개발 시 builder 스테이지 사용
    ports:
      - "3000:3000"
      - "9229:9229"  # Node.js 디버거
    volumes:
      - .:/app
      - /app/node_modules  # node_modules는 컨테이너 것 사용
    environment:
      NODE_ENV: development
      DATABASE_URL: postgresql://postgres:postgres@db:5432/myapp
      REDIS_URL: redis://redis:6379
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_started
    command: npm run dev

  db:
    image: postgres:16-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: myapp
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./scripts/init.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redisdata:/data

  adminer:
    image: adminer
    ports:
      - "8080:8080"
    depends_on:
      - db

volumes:
  pgdata:
  redisdata:
```

#### 8.3 Docker 개발 실전 명령어

```bash
# 개발 환경 시작
docker compose up -d

# 로그 확인
docker compose logs -f app

# 컨테이너 내부 진입
docker compose exec app sh

# 개발 DB 리셋
docker compose down -v  # 볼륨 삭제
docker compose up -d

# 이미지 빌드 (캐시 없이)
docker compose build --no-cache

# 프로덕션 빌드 테스트
docker build --target runner -t myapp:latest .
docker run --rm -p 3000:3000 myapp:latest
```

```powershell
# PowerShell에서도 동일한 Docker 명령어 사용 가능
docker compose up -d
docker compose logs -f app
docker compose exec app sh

# Windows 특화: WSL2 백엔드 확인
wsl --list --verbose
# Docker Desktop은 WSL2 백엔드를 사용하여 성능 향상
```

#### 8.4 VS Code Dev Containers와 Docker 연동

```jsonc
// .devcontainer/devcontainer.json — docker-compose 연동
{
    "name": "Full Stack Dev",
    "dockerComposeFile": "../docker-compose.yml",
    "service": "app",
    "workspaceFolder": "/app",

    "customizations": {
        "vscode": {
            "extensions": [
                "dbaeumer.vscode-eslint",
                "ms-azuretools.vscode-docker",
                "cweijan.vscode-postgresql-client2"
            ]
        }
    },

    "forwardPorts": [3000, 5432, 8080],
    "postCreateCommand": "npm install"
}
```

### 실습 과제: Node.js 앱 Docker화 + VS Code 연동

> 1. Express.js + PostgreSQL 앱을 멀티스테이지 Dockerfile로 작성하세요
> 2. docker-compose.yml로 앱, DB, Redis를 구성하세요
> 3. devcontainer.json을 작성하여 VS Code에서 컨테이너 내부 개발을 구성하세요

---

## 9. 배포와 CI/CD

### 학습 목표

- Makefile/Taskfile로 빌드 명령을 선언적으로 관리한다
- GitHub Actions YAML을 작성하여 CI/CD 파이프라인을 구축한다
- 자동 테스트, 빌드, 배포의 전체 흐름을 이해한다

### 상세 설명

#### 9.1 Makefile

```makefile
# Makefile — 프로젝트 빌드 자동화

.PHONY: all install dev build test lint clean deploy

# 기본 타겟
all: install lint test build

# 의존성 설치
install:
	npm ci

# 개발 서버
dev:
	npm run dev

# 빌드
build:
	npm run build

# 테스트
test:
	npm test

# 테스트 (커버리지 포함)
test-coverage:
	npm test -- --coverage

# 린트
lint:
	npm run lint
	npm run type-check

# 포맷팅
format:
	npx prettier --write "src/**/*.{ts,tsx,css}"

# Docker
docker-build:
	docker build -t myapp:$(shell git rev-parse --short HEAD) .

docker-run:
	docker run --rm -p 3000:3000 myapp:$(shell git rev-parse --short HEAD)

# 정리
clean:
	rm -rf dist node_modules .next coverage

# 배포
deploy: lint test build
	@echo "배포 시작..."
	rsync -avz --delete dist/ server:/var/www/app/
	@echo "배포 완료"

# 도움말
help:
	@echo "사용 가능한 명령:"
	@echo "  make install   - 의존성 설치"
	@echo "  make dev       - 개발 서버 시작"
	@echo "  make build     - 프로덕션 빌드"
	@echo "  make test      - 테스트 실행"
	@echo "  make deploy    - 배포 (lint+test+build+deploy)"
```

#### 9.2 GitHub Actions CI/CD

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '20'
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  # 1단계: 린트 & 타입 체크
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Node.js 설정
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: 의존성 설치
        run: npm ci

      - name: ESLint 실행
        run: npm run lint

      - name: TypeScript 타입 체크
        run: npm run type-check

  # 2단계: 테스트
  test:
    runs-on: ubuntu-latest
    needs: lint

    services:
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
          POSTGRES_DB: testdb
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v4

      - name: Node.js 설정
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: 의존성 설치
        run: npm ci

      - name: 테스트 실행
        run: npm test -- --coverage
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/testdb

      - name: 커버리지 리포트 업로드
        uses: actions/upload-artifact@v4
        with:
          name: coverage-report
          path: coverage/

  # 3단계: 빌드 & Docker 이미지
  build:
    runs-on: ubuntu-latest
    needs: test
    if: github.ref == 'refs/heads/main'

    permissions:
      contents: read
      packages: write

    steps:
      - uses: actions/checkout@v4

      - name: Docker Buildx 설정
        uses: docker/setup-buildx-action@v3

      - name: 레지스트리 로그인
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Docker 메타데이터
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=sha,prefix=
            type=raw,value=latest

      - name: Docker 이미지 빌드 & 푸시
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  # 4단계: 배포
  deploy:
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    environment: production

    steps:
      - name: 서버 배포
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.DEPLOY_HOST }}
          username: ${{ secrets.DEPLOY_USER }}
          key: ${{ secrets.DEPLOY_KEY }}
          script: |
            cd /opt/app
            docker compose pull
            docker compose up -d
            docker compose exec -T app npm run migrate
            echo "배포 완료: $(date)"
```

#### 9.3 PowerShell 기반 Windows 배포 스크립트

```powershell
<#
.SYNOPSIS
    Windows 서버 배포 스크립트
#>
param(
    [ValidateSet("staging", "production")]
    [string]$Environment = "staging",

    [switch]$SkipTests,
    [switch]$WhatIf
)

$ErrorActionPreference = "Stop"

$Config = @{
    staging    = @{ Server = "staging.company.com"; Path = "C:\inetpub\staging" }
    production = @{ Server = "prod.company.com"; Path = "C:\inetpub\production" }
}

$Target = $Config[$Environment]

Write-Host "=== 배포 시작: $Environment ===" -ForegroundColor Cyan
Write-Host "서버: $($Target.Server)"
Write-Host "경로: $($Target.Path)"

# 1. 테스트
if (-not $SkipTests) {
    Write-Host "`n[1/4] 테스트 실행 중..." -ForegroundColor Yellow
    npm test
    if ($LASTEXITCODE -ne 0) {
        Write-Error "테스트 실패 — 배포를 중단합니다"
        exit 1
    }
}

# 2. 빌드
Write-Host "`n[2/4] 빌드 중..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Error "빌드 실패"
    exit 1
}

# 3. 백업
Write-Host "`n[3/4] 현재 버전 백업 중..." -ForegroundColor Yellow
$BackupPath = "$($Target.Path)_backup_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
if ($WhatIf) {
    Write-Host "[미리보기] 백업: $($Target.Path) -> $BackupPath"
} else {
    Invoke-Command -ComputerName $Target.Server -ScriptBlock {
        param($src, $dst)
        if (Test-Path $src) { Copy-Item $src $dst -Recurse }
    } -ArgumentList $Target.Path, $BackupPath
}

# 4. 배포
Write-Host "`n[4/4] 파일 배포 중..." -ForegroundColor Yellow
if ($WhatIf) {
    Write-Host "[미리보기] 배포: ./dist -> $($Target.Server):$($Target.Path)"
} else {
    $Session = New-PSSession -ComputerName $Target.Server
    Copy-Item -Path "./dist/*" -Destination $Target.Path -ToSession $Session -Recurse -Force
    Remove-PSSession $Session
}

Write-Host "`n=== 배포 완료 ===" -ForegroundColor Green
```

### 실습 과제: GitHub Actions 워크플로 작성

> 1. PR 생성 시 자동으로 린트, 테스트, 빌드를 실행하는 CI 워크플로를 작성하세요
> 2. main 브랜치 병합 시 Docker 이미지를 빌드하고 레지스트리에 푸시하세요
> 3. 배포 승인 후 프로덕션 서버에 자동 배포되는 CD 단계를 추가하세요

---

## 10. 종합 프로젝트

### 학습 목표

- 지금까지 학습한 모든 기술을 통합하여 크로스 플랫폼 자동화 파이프라인을 구축한다
- Shell Script(Bash + PowerShell) + Docker + VS Code Dev Containers + CI/CD를 하나의 프로젝트에서 활용한다

### 미션: 크로스 플랫폼 자동화 파이프라인 구축

전체 프로젝트 구조를 설계하고, 각 구성 요소를 통합하세요.

#### 프로젝트 구조

```
my-fullstack-app/
├── .devcontainer/
│   └── devcontainer.json          # VS Code Dev Container 설정
├── .github/
│   └── workflows/
│       ├── ci.yml                 # CI 파이프라인
│       └── deploy.yml             # CD 파이프라인
├── .vscode/
│   ├── tasks.json                 # 빌드 태스크
│   └── settings.json              # 프로젝트 설정
├── scripts/
│   ├── setup.sh                   # Linux/macOS 환경 설정 (Bash)
│   ├── setup.ps1                  # Windows 환경 설정 (PowerShell)
│   ├── backup.sh                  # 백업 스크립트 (Bash)
│   ├── backup.ps1                 # 백업 스크립트 (PowerShell)
│   ├── health-check.sh            # 헬스체크 (Bash)
│   └── deploy.ps1                 # Windows 배포 (PowerShell)
├── docker/
│   ├── Dockerfile                 # 멀티스테이지 빌드
│   └── docker-compose.yml         # 개발 환경
├── src/                           # 애플리케이션 소스
├── tests/                         # 테스트
├── Makefile                       # 빌드 자동화
├── .env.example                   # 환경변수 템플릿
├── .gitignore
└── README.md
```

#### 단계별 진행

**1단계: 프로젝트 초기화 (Bash + PowerShell)**

```bash
#!/bin/bash
# scripts/setup.sh — 프로젝트 초기화 (Linux/macOS)
set -euo pipefail

echo "=== 프로젝트 환경 설정 (Linux/macOS) ==="

# 필수 도구 확인
for cmd in git node npm docker; do
    command -v "$cmd" >/dev/null 2>&1 || {
        echo "오류: $cmd 가 설치되어 있지 않습니다"
        exit 1
    }
done

# 환경변수 설정
if [[ ! -f .env ]]; then
    cp .env.example .env
    echo ".env 파일 생성 완료"
fi

# 의존성 설치
npm ci
echo "Node.js 의존성 설치 완료"

# Docker 환경 시작
docker compose -f docker/docker-compose.yml up -d
echo "Docker 서비스 시작 완료"

echo "=== 설정 완료 ==="
```

```powershell
# scripts/setup.ps1 — 프로젝트 초기화 (Windows)
$ErrorActionPreference = "Stop"

Write-Host "=== 프로젝트 환경 설정 (Windows) ===" -ForegroundColor Cyan

# 필수 도구 확인
$RequiredTools = @("git", "node", "npm", "docker")
foreach ($tool in $RequiredTools) {
    if (-not (Get-Command $tool -ErrorAction SilentlyContinue)) {
        Write-Error "$tool 이(가) 설치되어 있지 않습니다"
        exit 1
    }
}

# 환경변수 설정
if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host ".env 파일 생성 완료" -ForegroundColor Green
}

# 의존성 설치
npm ci
Write-Host "Node.js 의존성 설치 완료" -ForegroundColor Green

# Docker 환경 시작
docker compose -f docker/docker-compose.yml up -d
Write-Host "Docker 서비스 시작 완료" -ForegroundColor Green

Write-Host "=== 설정 완료 ===" -ForegroundColor Cyan
```

**2단계: 자동 백업 스크립트 (Bash + PowerShell)**

```bash
#!/bin/bash
# scripts/backup.sh
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
BACKUP_DIR="${BACKUP_DIR:-$HOME/backups}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/project_${TIMESTAMP}.tar.gz"

mkdir -p "$BACKUP_DIR"

tar -czf "$BACKUP_FILE" \
    --exclude='node_modules' \
    --exclude='.git' \
    --exclude='dist' \
    -C "$(dirname "$PROJECT_DIR")" \
    "$(basename "$PROJECT_DIR")"

echo "백업 완료: $BACKUP_FILE ($(du -h "$BACKUP_FILE" | cut -f1))"
```

```powershell
# scripts/backup.ps1
param([string]$BackupDir = "$HOME\backups")

$ProjectDir = Split-Path $PSScriptRoot -Parent
$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$BackupFile = Join-Path $BackupDir "project_${Timestamp}.zip"

New-Item -Path $BackupDir -ItemType Directory -Force | Out-Null

$ExcludePatterns = @("node_modules", ".git", "dist")
$TempDir = Join-Path $env:TEMP "backup_$Timestamp"

Copy-Item $ProjectDir $TempDir -Recurse -Exclude $ExcludePatterns
Compress-Archive -Path "$TempDir\*" -DestinationPath $BackupFile
Remove-Item $TempDir -Recurse -Force

$Size = [math]::Round((Get-Item $BackupFile).Length / 1MB, 1)
Write-Host "백업 완료: $BackupFile ($Size MB)" -ForegroundColor Green
```

**3단계: CI/CD + Docker + Dev Containers 통합**

위 섹션 7, 8, 9에서 작성한 devcontainer.json, Dockerfile, docker-compose.yml, ci.yml을 하나의 프로젝트에 통합합니다.

#### 완성 기준 체크리스트

| 항목 | 확인 |
|------|------|
| Bash 설정 스크립트가 Linux/macOS에서 정상 동작 | [ ] |
| PowerShell 설정 스크립트가 Windows에서 정상 동작 | [ ] |
| Docker 개발 환경이 `docker compose up`으로 실행됨 | [ ] |
| VS Code Dev Container로 컨테이너 내부 개발 가능 | [ ] |
| GitHub Actions CI가 PR에서 자동 실행됨 | [ ] |
| main 브랜치 병합 시 자동 배포 파이프라인 동작 | [ ] |
| 백업 스크립트가 양쪽 OS에서 동작 | [ ] |
| .env.example에 모든 환경변수가 문서화됨 | [ ] |

---

## 11. 바이브코딩 도구 연계 심화

### 학습 목표

- CLAUDE.md, .cursor/rules 등 AI 도구 설정 파일의 고급 작성법을 익힌다
- MCP(Model Context Protocol) 서버 개념과 활용법을 이해한다
- AI 도구와 셸 스크립트를 통합한 자동화 워크플로를 설계한다

### 상세 설명

#### 11.1 CLAUDE.md / .cursor/rules 고급 작성

CLAUDE.md(Claude Code용)와 .cursor/rules(Cursor용)는 AI 도구에게 프로젝트 컨텍스트를 제공하는 설정 파일입니다. 잘 작성하면 AI의 코드 품질이 크게 향상됩니다.

**CLAUDE.md 고급 구조:**

```markdown
# CLAUDE.md

## 프로젝트 개요
- 프로젝트명, 목적, 기술 스택

## 파일 구조
- 디렉토리 구조와 각 파일의 역할

## 개발 규칙
- 코딩 컨벤션, 네이밍 규칙
- Git 커밋 메시지 규칙
- 테스트 규칙

## 개발 워크플로우
- 단계별 작업 순서 (계획 -> 구현 -> 검증 -> 배포)

## 주의사항
- 금지 사항, 보안 규칙
```

**.cursor/rules 디렉토리 구조:**

```
.cursor/
└── rules/
    ├── global.mdc           # 전체 프로젝트 규칙
    ├── frontend.mdc         # 프론트엔드 규칙
    ├── backend.mdc          # 백엔드 규칙
    ├── testing.mdc          # 테스트 규칙
    └── deployment.mdc       # 배포 규칙
```

```markdown
<!-- .cursor/rules/backend.mdc -->
---
description: 백엔드 API 개발 규칙
globs: ["src/api/**", "src/services/**"]
---

## 백엔드 규칙

### API 설계
- RESTful 규칙 준수
- 에러 응답은 RFC 7807 Problem Details 형식
- 모든 엔드포인트에 입력 유효성 검사 (zod)

### 데이터베이스
- ORM: Prisma 사용
- 마이그레이션은 반드시 리뷰 후 적용
- N+1 쿼리 방지 (include/join 활용)
```

#### 11.2 MCP 서버 개념

MCP(Model Context Protocol)는 AI 도구가 외부 시스템(파일시스템, DB, API)과 상호작용하기 위한 프로토콜입니다.

| MCP 서버 | 기능 | 사용 사례 |
|---------|------|----------|
| **filesystem** | 파일 읽기/쓰기/검색 | 프로젝트 파일 조작 |
| **github** | GitHub API 연동 | PR 생성, 이슈 관리 |
| **postgres** | DB 쿼리 실행 | 데이터 조회, 스키마 확인 |
| **brave-search** | 웹 검색 | 최신 문서 검색 |
| **memory** | 지식 그래프 저장 | 프로젝트 컨텍스트 유지 |

```json
// Claude Code MCP 설정 예시 (~/.claude/settings.json)
{
    "mcpServers": {
        "filesystem": {
            "command": "npx",
            "args": ["-y", "@anthropic/mcp-server-filesystem", "/home/user/projects"]
        },
        "github": {
            "command": "npx",
            "args": ["-y", "@anthropic/mcp-server-github"],
            "env": {
                "GITHUB_TOKEN": "ghp_xxxx"
            }
        }
    }
}
```

#### 11.3 AI + 셸 통합 워크플로

```bash
#!/bin/bash
# AI 코드 리뷰 자동화 스크립트
set -euo pipefail

# 변경된 파일 목록 추출
CHANGED_FILES=$(git diff --name-only HEAD~1 HEAD -- '*.ts' '*.tsx')

if [[ -z "$CHANGED_FILES" ]]; then
    echo "변경된 TypeScript 파일이 없습니다"
    exit 0
fi

echo "=== AI 코드 리뷰 대상 파일 ==="
echo "$CHANGED_FILES"

# 변경 내용을 컨텍스트로 준비
DIFF_CONTENT=$(git diff HEAD~1 HEAD -- $CHANGED_FILES)

# Claude Code에 리뷰 요청 (Claude Code CLI 활용)
echo "$DIFF_CONTENT" | claude -p "
다음 코드 변경사항을 리뷰해주세요:
1. 버그 가능성
2. 성능 이슈
3. 보안 취약점
4. 개선 제안
"
```

```powershell
# PowerShell — AI 기반 Git 커밋 메시지 생성
function New-AICommitMessage {
    $Diff = git diff --staged

    if ([string]::IsNullOrWhiteSpace($Diff)) {
        Write-Warning "스테이징된 변경사항이 없습니다"
        return
    }

    # Claude Code CLI를 통한 커밋 메시지 생성
    $Message = $Diff | claude -p "이 변경사항에 대한 한국어 커밋 메시지를 작성해주세요. 첫 줄은 50자 이내로."

    Write-Host "제안된 커밋 메시지:" -ForegroundColor Yellow
    Write-Host $Message

    $Confirm = Read-Host "`n이 메시지로 커밋하시겠습니까? (y/n)"
    if ($Confirm -eq 'y') {
        git commit -m $Message
    }
}
```

#### 11.4 VS Code에서 AI 도구 통합 패턴

| 도구 | VS Code 연동 | 활용 |
|------|-------------|------|
| **Claude Code** | 터미널에서 실행, VS Code 확장 | 멀티파일 편집, 리팩토링 |
| **Cursor** | 네이티브 IDE (VS Code 포크) | Tab 자동완성, Agent |
| **GitHub Copilot** | VS Code 확장 | 인라인 코드 제안 |
| **Continue** | VS Code 확장 (오픈소스) | 로컬 LLM 연동 |

### 실습 과제: AI 도구 자동화 연동

> 1. CLAUDE.md를 작성하여 프로젝트 컨텍스트를 정의하세요
> 2. Git 훅(pre-commit)에 AI 기반 코드 검사를 통합하세요
> 3. CI 파이프라인에 AI 코드 리뷰 단계를 추가하세요

---

## 12. 다음 단계

### 인프라/플랫폼 엔지니어링 경로

이 교안을 완료한 후, 다음 영역으로 확장할 수 있습니다:

| 단계 | 영역 | 핵심 기술 |
|------|------|----------|
| **Level 1** | 컨테이너 오케스트레이션 | Kubernetes, Helm, Kustomize |
| **Level 2** | 인프라 as 코드 | Terraform, Pulumi, AWS CDK |
| **Level 3** | 관측성(Observability) | Prometheus, Grafana, Loki, OpenTelemetry |
| **Level 4** | 보안(DevSecOps) | Trivy, Snyk, SAST/DAST, OPA |
| **Level 5** | 플랫폼 엔지니어링 | Internal Developer Platform, Backstage |

### 심화 학습 방향

**셸 스크립팅 심화:**
- Advanced Bash-Scripting Guide (TLDP)
- PowerShell in Action (Manning)
- zx (Google) — JavaScript로 셸 스크립트 작성

**컨테이너 심화:**
- Kubernetes 공식 튜토리얼 (kubernetes.io)
- Docker Deep Dive (Nigel Poulton)
- Podman — Docker 대안 (rootless 컨테이너)

**CI/CD 심화:**
- GitHub Actions 고급 — 재사용 가능한 워크플로, composite actions
- ArgoCD — GitOps 기반 Kubernetes 배포
- Dagger — 프로그래밍 가능한 CI/CD 엔진

**AI 도구 심화:**
- Claude Code 에이전트형 워크플로 (SDK 활용)
- Cursor Background Agent 활용
- MCP 서버 직접 개발

### 마무리

> "좋은 개발자는 코드를 작성하고, 뛰어난 개발자는 자동화를 구축한다" — 실사용자 조언

이 교안에서 다룬 내용을 요약하면:

1. **Bash와 PowerShell**: 양쪽 OS에서 자동화 스크립트를 작성할 수 있는 능력
2. **CLI 파이프라인**: 데이터를 효율적으로 변환하고 처리하는 파이프라인 설계
3. **환경 관리**: 환경변수, 시크릿, dotfiles를 체계적으로 관리
4. **VS Code + Docker**: 격리된 개발 환경을 팀과 공유
5. **CI/CD**: 테스트, 빌드, 배포를 자동화하는 파이프라인
6. **AI 도구 연계**: 바이브코딩 도구와 CLI를 통합한 생산성 극대화

반복적인 작업은 스크립트로, 환경 설정은 코드로, 배포는 파이프라인으로 자동화하세요. 이것이 개발자의 생산성을 근본적으로 높이는 방법입니다.

---

## 출처

| 출처 | 설명 |
|------|------|
| The Missing Semester of CS (MIT) | 셸, 에디터, Git 등 개발 환경 기초 강의 |
| GNU Bash Reference Manual | Bash 공식 레퍼런스 |
| Microsoft PowerShell Documentation | PowerShell 공식 문서 |
| Docker Documentation | Docker 공식 가이드 |
| GitHub Actions Documentation | CI/CD 워크플로 가이드 |
| VS Code Remote Development | VS Code 원격 개발 공식 문서 |
| 12-Factor App (12factor.net) | 현대적 앱 개발 방법론 |
| 러버블 바이브코딩 카톡방 (2026.3.8) | 실사용자 의견 및 경험 |
