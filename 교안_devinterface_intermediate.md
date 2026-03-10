# 개발 인터페이스 중급자편: CLI 기반 개발 워크플로와 협업

> **과정명**: CLI 기반 개발 워크플로와 협업
> **대상**: CLI/IDE 기본을 알고 개발 워크플로를 효율화하려는 분
> **목표**: CLI와 IDE를 활용하여 효율적인 개발 작업과 협업을 수행할 수 있다
> **주요 도구**: Bash, Git, Visual Studio Code
> **소요**: 약 4~5시간

---

## 어떤 교안을 봐야 할까요? (자가 진단)

이 교안은 **CLI/IDE 기본을 알고 있는 분**을 위한 중급 과정입니다.

| 항목 | 자가 점검 |
|------|----------|
| 터미널 기본 명령어 | `cd`, `ls`, `mkdir`, `rm` 등을 사용할 수 있다 |
| 텍스트 편집기/IDE | VS Code 또는 다른 편집기를 설치하고 파일을 열 수 있다 |
| Git 기초 | `git init`, `git add`, `git commit` 정도는 해봤다 |
| 경로 개념 | 절대 경로와 상대 경로의 차이를 안다 |

> 위 항목 중 2개 이상 해당하지 않는다면 → **초보자편** 교안을 먼저 보세요.
> 위 항목 모두 해당하고 쉘 스크립팅·CI/CD까지 다루고 싶다면 → **개발자편** 교안을 추천합니다.

---

### 추천 리소스

| 리소스 | 설명 | 링크 |
|--------|------|------|
| **Oh My Zsh** | Zsh 플러그인·테마 프레임워크 (macOS/Linux) | [ohmyz.sh](https://ohmyz.sh/) |
| **VS Code 공식 문서** | 확장, 디버깅, 단축키 전체 가이드 | [code.visualstudio.com/docs](https://code.visualstudio.com/docs) |
| **Pro Git (한국어)** | Git 완전 가이드 무료 도서 | [git-scm.com/book/ko/v2](https://git-scm.com/book/ko/v2) |
| **PowerShell 공식 문서** | Microsoft 공식 PowerShell 레퍼런스 | [learn.microsoft.com/powershell](https://learn.microsoft.com/ko-kr/powershell/) |
| **기획 도우미 Gem** | 제미나이 기반 프로젝트 기획 도우미 (peace 제작/공유) | [Gem 바로가기](https://gemini.google.com/gem/1yC701ZmuJgy_D4hkyNz0t50EqAnBj3kh) |

---

## 목차

1. [CLI 심화 명령어](#1-cli-심화-명령어)
2. [파일 검색과 텍스트 처리](#2-파일-검색과-텍스트-처리)
3. [PowerShell 중급 활용](#3-powershell-중급-활용)
4. [프로세스와 권한 관리](#4-프로세스와-권한-관리)
5. [VS Code 확장과 고급 설정](#5-vs-code-확장과-고급-설정)
6. [VS Code 디버깅 마스터](#6-vs-code-디버깅-마스터)
7. [Git branch와 협업](#7-git-branch와-협업)
8. [CLI 기반 프로그램 실행](#8-cli-기반-프로그램-실행)
9. [로그 분석과 모니터링](#9-로그-분석과-모니터링)
10. [개발 작업 자동화 기초](#10-개발-작업-자동화-기초)
11. [바이브코딩 도구 환경 설정](#11-바이브코딩-도구-환경-설정)
12. [트러블슈팅 & FAQ](#12-트러블슈팅--faq)
13. [다음 단계](#13-다음-단계)

---

## 1. CLI 심화 명령어

### 학습 목표

- 리다이렉션, 파이프, 명령어 체이닝을 이해하고 실무에 활용할 수 있다
- Bash와 PowerShell의 파이프라인 차이를 설명할 수 있다
- 여러 명령어를 조합하여 복잡한 파일 처리 작업을 수행할 수 있다

### 1-1. 리다이렉션 (Redirection)

리다이렉션은 명령어의 출력을 파일로 보내거나, 파일의 내용을 명령어의 입력으로 전달하는 기법입니다.

#### Bash 리다이렉션

```bash
# 출력을 파일로 저장 (덮어쓰기)
echo "Hello World" > output.txt

# 출력을 파일에 추가 (이어쓰기)
echo "추가 내용" >> output.txt

# 표준 에러(stderr)를 파일로 저장
ls /없는경로 2> error.log

# 표준 출력과 에러를 모두 파일로
npm install &> install.log

# 파일 내용을 명령어 입력으로
sort < names.txt

# 입력과 출력 동시 리다이렉션
sort < names.txt > sorted_names.txt
```

#### PowerShell 리다이렉션

```powershell
# 출력을 파일로 저장 (덮어쓰기)
"Hello World" > output.txt
# 또는 cmdlet 사용
"Hello World" | Out-File output.txt

# 출력을 파일에 추가
"추가 내용" >> output.txt
"추가 내용" | Out-File output.txt -Append

# 에러 스트림 리다이렉션
Get-Item "없는경로" 2> error.log

# 모든 스트림을 파일로
Get-Item "없는경로" *> all.log
```

#### Bash vs PowerShell 리다이렉션 비교

| 작업 | Bash | PowerShell |
|------|------|------------|
| 덮어쓰기 | `>` | `>` 또는 `Out-File` |
| 이어쓰기 | `>>` | `>>` 또는 `Out-File -Append` |
| 에러 리다이렉션 | `2>` | `2>` |
| 출력+에러 모두 | `&>` | `*>` |
| 입력 리다이렉션 | `<` | `Get-Content file \| cmd` |
| 출력 버리기 | `> /dev/null` | `> $null` 또는 `Out-Null` |

### 1-2. 파이프 (Pipe)

파이프(`|`)는 한 명령어의 출력을 다른 명령어의 입력으로 연결합니다.

#### Bash 파이프 (텍스트 스트림)

```bash
# 파일 목록에서 .js 파일만 필터링
ls -la | grep ".js"

# 프로세스 목록에서 node 프로세스 찾기
ps aux | grep node

# 파일 내용을 정렬하고 중복 제거
cat access.log | sort | uniq

# 파일 개수 세기
ls -1 | wc -l

# 디스크 사용량 상위 5개 확인
du -sh * | sort -rh | head -5
```

#### PowerShell 파이프 (객체 스트림)

```powershell
# 파일 목록에서 .js 파일만 필터링
Get-ChildItem | Where-Object { $_.Extension -eq ".js" }

# 프로세스 목록에서 node 프로세스 찾기
Get-Process | Where-Object { $_.ProcessName -eq "node" }

# 파일을 크기 순으로 정렬
Get-ChildItem | Sort-Object Length -Descending | Select-Object -First 5

# 파일 개수 세기
(Get-ChildItem).Count
```

> **핵심 차이**: Bash 파이프는 **텍스트 스트림**을 전달합니다. 각 명령어가 문자열을 주고받으며, `grep`이나 `awk`로 텍스트를 파싱합니다. PowerShell 파이프는 **.NET 객체**를 전달합니다. 속성(Property)에 직접 접근할 수 있어 구문 분석이 필요 없습니다.

#### 파이프 방식 비교 예시

동일한 작업을 두 셸에서 수행할 때의 차이를 보겠습니다.

```bash
# Bash: 텍스트를 파싱해야 한다
ps aux | awk '{print $2, $11}' | grep node
# 출력 예: "12345 node"  ← 텍스트 문자열

# 설명: ps 출력은 단순 텍스트이므로
# awk로 2번째(PID), 11번째(COMMAND) 컬럼을 추출한다
```

```powershell
# PowerShell: 객체 속성에 직접 접근
Get-Process | Where-Object ProcessName -eq "node" | Select-Object Id, ProcessName
# 출력 예:
#   Id ProcessName
# ---- -----------
# 12345 node        ← 구조화된 객체

# 설명: Get-Process 출력은 .NET 객체이므로
# 속성 이름으로 직접 접근한다
```

### 1-3. 명령어 체이닝 (Command Chaining)

```bash
# && : 앞 명령이 성공(exit code 0)하면 다음 실행
mkdir project && cd project && npm init -y

# || : 앞 명령이 실패하면 다음 실행
cd project || mkdir project

# ; : 성공/실패 관계없이 순서대로 실행
echo "시작"; npm install; echo "완료"

# 실전 활용: 빌드 후 테스트
npm run build && npm test && echo "빌드+테스트 성공!"
```

```powershell
# PowerShell에서의 체이닝
# ; 로 순차 실행
New-Item -ItemType Directory project; Set-Location project; npm init -y

# && 와 || (PowerShell 7+에서 지원)
npm run build && npm test && Write-Output "빌드+테스트 성공!"

# try-catch로 에러 처리 (PowerShell 5.1+)
try {
    npm run build
    npm test
    Write-Output "성공!"
} catch {
    Write-Error "실패: $_"
}
```

### 실습 과제 1: 명령어 조합으로 파일 처리

다음 작업을 Bash와 PowerShell 양쪽에서 수행해보세요.

```bash
# [Bash 과제]
# 1. project 폴더를 만들고 진입
mkdir -p ~/cli-practice && cd ~/cli-practice

# 2. 테스트 파일 10개 생성
for i in {1..10}; do echo "파일 내용 $i" > "file_$i.txt"; done

# 3. 모든 txt 파일의 내용을 하나로 합치기
cat file_*.txt > merged.txt

# 4. merged.txt의 줄 수 확인
wc -l merged.txt

# 5. "파일 내용 5"가 포함된 파일 찾기
grep -l "파일 내용 5" file_*.txt
```

```powershell
# [PowerShell 과제]
# 1. project 폴더를 만들고 진입
New-Item -ItemType Directory -Force ~/cli-practice; Set-Location ~/cli-practice

# 2. 테스트 파일 10개 생성
1..10 | ForEach-Object { "파일 내용 $_" | Out-File "file_$_.txt" }

# 3. 모든 txt 파일의 내용을 하나로 합치기
Get-Content file_*.txt | Out-File merged.txt

# 4. merged.txt의 줄 수 확인
(Get-Content merged.txt | Measure-Object -Line).Lines

# 5. "파일 내용 5"가 포함된 파일 찾기
Select-String -Path file_*.txt -Pattern "파일 내용 5" | Select-Object Filename -Unique
```

---

## 2. 파일 검색과 텍스트 처리

### 학습 목표

- `grep`/`find`(Bash)와 `Select-String`/`Get-ChildItem`(PowerShell)을 활용하여 파일과 텍스트를 검색할 수 있다
- 정규식 기초를 이해하고 검색에 적용할 수 있다
- `xargs`를 활용하여 검색 결과를 다른 명령어에 전달할 수 있다

### 2-1. 파일 이름으로 검색

#### Bash: find

```bash
# 현재 디렉토리 아래에서 .js 파일 찾기
find . -name "*.js"

# 특정 디렉토리에서 최근 7일 내 수정된 파일 찾기
find ./src -name "*.ts" -mtime -7

# 파일 크기가 1MB 이상인 파일 찾기
find . -size +1M -type f

# 빈 디렉토리 찾기
find . -type d -empty

# node_modules 제외하고 검색
find . -name "*.js" -not -path "*/node_modules/*"

# 찾은 파일 삭제 (주의!)
find . -name "*.tmp" -type f -delete
```

#### PowerShell: Get-ChildItem

```powershell
# 현재 디렉토리 아래에서 .js 파일 찾기
Get-ChildItem -Recurse -Filter "*.js"

# 최근 7일 내 수정된 .ts 파일 찾기
Get-ChildItem -Recurse -Filter "*.ts" |
    Where-Object { $_.LastWriteTime -gt (Get-Date).AddDays(-7) }

# 파일 크기가 1MB 이상인 파일 찾기
Get-ChildItem -Recurse -File |
    Where-Object { $_.Length -gt 1MB }

# 빈 디렉토리 찾기
Get-ChildItem -Recurse -Directory |
    Where-Object { (Get-ChildItem $_.FullName).Count -eq 0 }

# node_modules 제외하고 검색
Get-ChildItem -Recurse -Filter "*.js" |
    Where-Object { $_.FullName -notlike "*node_modules*" }
```

### 2-2. 파일 내용으로 검색

#### Bash: grep

```bash
# 기본 텍스트 검색
grep "TODO" src/*.js

# 재귀적으로 모든 하위 폴더 검색
grep -r "console.log" ./src

# 대소문자 무시
grep -ri "error" ./logs

# 줄 번호 포함
grep -rn "import React" ./src

# 매칭되는 파일 이름만 출력
grep -rl "useState" ./src

# 매칭 전후 컨텍스트 표시 (전 2줄, 후 3줄)
grep -rn -B 2 -A 3 "function" ./src

# 특정 파일 패턴에서만 검색
grep -rn --include="*.tsx" "useState" ./src

# 정규식으로 검색 (확장 정규식)
grep -rE "import .+ from" ./src
```

#### PowerShell: Select-String

```powershell
# 기본 텍스트 검색
Select-String -Path src/*.js -Pattern "TODO"

# 재귀적으로 모든 하위 폴더 검색
Get-ChildItem -Recurse -Filter "*.js" | Select-String "console.log"

# 대소문자 무시 (기본값이 대소문자 무시)
Get-ChildItem -Recurse -Filter "*.log" | Select-String "error"

# 줄 번호는 기본 포함됨
Get-ChildItem -Recurse -Filter "*.tsx" | Select-String "useState"

# 매칭 전후 컨텍스트 표시
Select-String -Path src/*.js -Pattern "function" -Context 2,3

# 정규식으로 검색
Get-ChildItem -Recurse -Filter "*.ts" |
    Select-String -Pattern "import .+ from"
```

### 2-3. 정규식(Regular Expression) 기초

코드 검색에 자주 사용되는 정규식 패턴입니다.

| 패턴 | 의미 | 예시 | 매칭 |
|------|------|------|------|
| `.` | 아무 문자 1개 | `f.le` | file, fale, fxle |
| `*` | 앞 문자 0회 이상 | `ab*c` | ac, abc, abbc |
| `+` | 앞 문자 1회 이상 | `ab+c` | abc, abbc (ac는 안됨) |
| `?` | 앞 문자 0~1회 | `colou?r` | color, colour |
| `^` | 줄의 시작 | `^import` | import로 시작하는 줄 |
| `$` | 줄의 끝 | `};$` | };로 끝나는 줄 |
| `[abc]` | a, b, c 중 하나 | `[Tt]est` | Test, test |
| `[0-9]` | 숫자 하나 | `v[0-9]+` | v1, v12, v999 |
| `\d` | 숫자 (= `[0-9]`) | `\d{3}` | 123, 456 |
| `\w` | 단어 문자 | `\w+` | hello, test_123 |
| `\s` | 공백 문자 | `a\s+b` | a b, a   b |
| `(a|b)` | a 또는 b | `(get|set)` | get, set |

#### 실전 정규식 활용 예시

```bash
# 이메일 주소 패턴 검색
grep -rE "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}" ./src

# console.log 구문 찾기 (삭제 대상)
grep -rn "console\.\(log\|warn\|error\)" ./src

# TODO/FIXME/HACK 주석 찾기
grep -rEn "(TODO|FIXME|HACK)" ./src

# 함수 선언 찾기
grep -rEn "^(export )?(async )?function \w+" ./src
```

### 2-4. xargs 활용

`xargs`는 표준 입력의 내용을 다른 명령어의 인자로 전달합니다.

```bash
# 찾은 파일을 wc로 줄 수 세기
find ./src -name "*.js" | xargs wc -l

# 찾은 파일에서 console.log 검색
find ./src -name "*.tsx" | xargs grep -l "console.log"

# 파일 이름에 공백이 있을 때 안전하게 처리
find . -name "*.txt" -print0 | xargs -0 wc -l

# 여러 파일의 권한 일괄 변경
find . -name "*.sh" | xargs chmod +x

# 찾은 .tmp 파일 일괄 삭제
find . -name "*.tmp" -type f | xargs rm -f
```

```powershell
# PowerShell에서 xargs 대신 ForEach-Object 사용
# 찾은 파일의 줄 수 세기
Get-ChildItem -Recurse -Filter "*.js" |
    ForEach-Object { "$($_.Name): $((Get-Content $_.FullName | Measure-Object -Line).Lines) 줄" }

# 찾은 파일에서 console.log 검색
Get-ChildItem -Recurse -Filter "*.tsx" |
    Select-String "console.log" |
    Select-Object Path -Unique
```

### 실습 과제 2: 프로젝트에서 특정 코드 검색

아무 프로젝트 폴더에서 다음을 수행해보세요. 프로젝트가 없다면 임의의 텍스트 파일을 만들어 연습합니다.

```bash
# [Bash]
# 1. 프로젝트 내 모든 TODO 주석 찾기
grep -rn "TODO" ./src --include="*.{js,ts,jsx,tsx}"

# 2. node_modules 제외, console.log가 있는 파일 목록
grep -rl "console.log" . --include="*.js" | grep -v node_modules

# 3. 최근 3일 내 수정된 JavaScript 파일 목록
find ./src -name "*.js" -mtime -3 -type f

# 4. 파일별 줄 수를 세고 상위 5개 출력
find ./src -name "*.js" | xargs wc -l | sort -rn | head -6
```

```powershell
# [PowerShell]
# 1. 프로젝트 내 모든 TODO 주석 찾기
Get-ChildItem -Recurse -Include "*.js","*.ts" |
    Where-Object { $_.FullName -notlike "*node_modules*" } |
    Select-String "TODO"

# 2. console.log가 있는 파일 목록
Get-ChildItem -Recurse -Filter "*.js" |
    Where-Object { $_.FullName -notlike "*node_modules*" } |
    Select-String "console.log" |
    Select-Object Path -Unique

# 3. 최근 3일 내 수정된 JavaScript 파일 목록
Get-ChildItem -Recurse -Filter "*.js" |
    Where-Object { $_.LastWriteTime -gt (Get-Date).AddDays(-3) }

# 4. 파일별 줄 수를 세고 상위 5개 출력
Get-ChildItem -Recurse -Filter "*.js" |
    Select-Object Name, @{N="Lines";E={(Get-Content $_.FullName | Measure-Object -Line).Lines}} |
    Sort-Object Lines -Descending |
    Select-Object -First 5
```

---

## 3. PowerShell 중급 활용

### 학습 목표

- PowerShell의 파이프라인 객체 전달 방식을 이해하고 활용할 수 있다
- `Where-Object`, `ForEach-Object`, `Sort-Object` 등 핵심 cmdlet을 사용할 수 있다
- PowerShell 모듈과 프로파일을 설정할 수 있다

### 3-1. 파이프라인 객체 전달 심화

PowerShell의 가장 큰 특징은 파이프라인을 통해 **텍스트가 아닌 객체**를 전달한다는 것입니다.

```powershell
# 파일 객체의 속성 확인
Get-ChildItem | Get-Member

# 파일 객체에서 원하는 속성만 선택
Get-ChildItem | Select-Object Name, Length, LastWriteTime

# 객체를 다양한 형태로 출력
Get-Process | Format-Table Name, Id, CPU -AutoSize
Get-Process | Format-List Name, Id, CPU
Get-Process | ConvertTo-Json | Out-File processes.json
Get-Process | Export-Csv processes.csv -NoTypeInformation
```

### 3-2. Where-Object / ForEach-Object / Sort-Object

```powershell
# Where-Object: 조건에 맞는 객체 필터링
# 1MB 이상인 파일만
Get-ChildItem -Recurse | Where-Object { $_.Length -gt 1MB }

# 간소화 구문 (PowerShell 3.0+)
Get-ChildItem -Recurse | Where-Object Length -gt 1MB

# ForEach-Object: 각 객체에 대해 작업 수행
Get-ChildItem *.txt | ForEach-Object {
    $content = Get-Content $_.FullName
    "$($_.Name): $($content.Count) 줄"
}

# Sort-Object: 정렬
Get-ChildItem | Sort-Object Length -Descending
Get-ChildItem | Sort-Object LastWriteTime -Descending | Select-Object -First 10

# Group-Object: 그룹화
Get-ChildItem -Recurse -File | Group-Object Extension |
    Sort-Object Count -Descending |
    Select-Object -First 10

# Measure-Object: 통계
Get-ChildItem -Recurse -File | Measure-Object -Property Length -Sum -Average -Maximum
```

### 3-3. PowerShell 모듈 설치

```powershell
# 사용 가능한 모듈 검색
Find-Module -Name "*git*"

# 모듈 설치 (관리자 권한 필요할 수 있음)
Install-Module posh-git -Scope CurrentUser
Install-Module PSReadLine -Scope CurrentUser -Force
Install-Module Terminal-Icons -Scope CurrentUser

# 설치된 모듈 확인
Get-InstalledModule

# 모듈 가져오기
Import-Module posh-git

# 모듈 업데이트
Update-Module posh-git
```

### 3-4. 프로파일 설정 ($PROFILE)

PowerShell 프로파일은 Bash의 `.bashrc`/`.zshrc`에 해당합니다.

```powershell
# 프로파일 경로 확인
$PROFILE
# 보통: C:\Users\사용자\Documents\PowerShell\Microsoft.PowerShell_profile.ps1

# 프로파일 파일이 없으면 생성
if (!(Test-Path -Path $PROFILE)) {
    New-Item -ItemType File -Path $PROFILE -Force
}

# 프로파일 편집
notepad $PROFILE
# 또는
code $PROFILE
```

프로파일에 추가할 내용 예시:

```powershell
# === $PROFILE 내용 예시 ===

# 모듈 자동 로드
Import-Module posh-git
Import-Module Terminal-Icons

# 별칭 설정
Set-Alias -Name g -Value git
Set-Alias -Name c -Value code
Set-Alias -Name ll -Value Get-ChildItem
Set-Alias -Name touch -Value New-Item

# 자주 쓰는 함수
function mkcd { param($dir) New-Item -ItemType Directory -Force $dir; Set-Location $dir }
function which { param($cmd) (Get-Command $cmd).Source }
function grep { param($pattern, $path) Select-String -Pattern $pattern -Path $path }

# 프롬프트 커스터마이징
function prompt {
    $path = (Get-Location).Path.Replace($HOME, "~")
    $branch = git branch --show-current 2>$null
    if ($branch) {
        "PS $path [$branch]> "
    } else {
        "PS $path> "
    }
}

# 환경변수 설정
$env:EDITOR = "code"
$env:NODE_ENV = "development"
```

### 3-5. Bash ↔ PowerShell 명령어 대응표 20선

| # | 작업 | Bash | PowerShell |
|---|------|------|------------|
| 1 | 현재 디렉토리 | `pwd` | `Get-Location` (별칭: `pwd`) |
| 2 | 디렉토리 이동 | `cd path` | `Set-Location path` (별칭: `cd`) |
| 3 | 파일 목록 | `ls -la` | `Get-ChildItem -Force` (별칭: `ls`, `dir`) |
| 4 | 파일 내용 보기 | `cat file.txt` | `Get-Content file.txt` (별칭: `cat`, `type`) |
| 5 | 파일 복사 | `cp src dest` | `Copy-Item src dest` (별칭: `cp`, `copy`) |
| 6 | 파일 이동/이름변경 | `mv src dest` | `Move-Item src dest` (별칭: `mv`, `move`) |
| 7 | 파일 삭제 | `rm file` | `Remove-Item file` (별칭: `rm`, `del`) |
| 8 | 디렉토리 생성 | `mkdir dir` | `New-Item -ItemType Directory dir` (별칭: `mkdir`) |
| 9 | 텍스트 검색 | `grep pattern file` | `Select-String -Pattern pattern -Path file` |
| 10 | 파일 찾기 | `find . -name "*.js"` | `Get-ChildItem -Recurse -Filter "*.js"` |
| 11 | 프로세스 목록 | `ps aux` | `Get-Process` (별칭: `ps`) |
| 12 | 프로세스 종료 | `kill PID` | `Stop-Process -Id PID` (별칭: `kill`) |
| 13 | 환경변수 확인 | `echo $PATH` | `$env:PATH` |
| 14 | 환경변수 설정 | `export VAR=val` | `$env:VAR = "val"` |
| 15 | 명령어 위치 | `which cmd` | `Get-Command cmd` |
| 16 | 명령어 히스토리 | `history` | `Get-History` (별칭: `history`) |
| 17 | 별칭 설정 | `alias ll='ls -la'` | `Set-Alias ll Get-ChildItem` |
| 18 | 줄 수 세기 | `wc -l file` | `(Get-Content file \| Measure-Object -Line).Lines` |
| 19 | 정렬 | `sort file` | `Get-Content file \| Sort-Object` |
| 20 | 중복 제거 | `sort file \| uniq` | `Get-Content file \| Sort-Object -Unique` |

> **참고**: PowerShell은 Bash 사용자를 위해 `ls`, `cd`, `cat`, `rm` 등의 별칭을 기본 제공합니다. 하지만 내부적으로는 PowerShell cmdlet이 실행되므로, 옵션 문법은 PowerShell 방식을 따라야 합니다. 예를 들어 `ls -la`는 PowerShell에서 동작하지 않고, `ls -Force`를 사용해야 합니다.

### 실습 과제 3: PowerShell로 시스템 정보 수집 스크립트

```powershell
# system-info.ps1 파일을 만들고 아래 내용을 작성하세요

# 1. 시스템 기본 정보
Write-Host "=== 시스템 정보 ===" -ForegroundColor Cyan
$os = Get-CimInstance Win32_OperatingSystem
"OS: $($os.Caption) $($os.Version)"
"컴퓨터명: $env:COMPUTERNAME"
"사용자: $env:USERNAME"

# 2. CPU 정보
Write-Host "`n=== CPU 정보 ===" -ForegroundColor Cyan
$cpu = Get-CimInstance Win32_Processor
"CPU: $($cpu.Name)"
"코어 수: $($cpu.NumberOfCores)"

# 3. 메모리 정보
Write-Host "`n=== 메모리 정보 ===" -ForegroundColor Cyan
$mem = Get-CimInstance Win32_OperatingSystem
$totalGB = [math]::Round($mem.TotalVisibleMemorySize / 1MB, 2)
$freeGB = [math]::Round($mem.FreePhysicalMemory / 1MB, 2)
"전체: ${totalGB}GB"
"사용 가능: ${freeGB}GB"
"사용률: $([math]::Round(($totalGB - $freeGB) / $totalGB * 100, 1))%"

# 4. 디스크 정보
Write-Host "`n=== 디스크 정보 ===" -ForegroundColor Cyan
Get-CimInstance Win32_LogicalDisk -Filter "DriveType=3" |
    ForEach-Object {
        $freeGB = [math]::Round($_.FreeSpace / 1GB, 2)
        $totalGB = [math]::Round($_.Size / 1GB, 2)
        "$($_.DeviceID) 전체: ${totalGB}GB, 사용 가능: ${freeGB}GB"
    }

# 5. 상위 CPU 사용 프로세스 5개
Write-Host "`n=== CPU 상위 프로세스 ===" -ForegroundColor Cyan
Get-Process | Sort-Object CPU -Descending |
    Select-Object -First 5 Name, Id, @{N="CPU(s)";E={[math]::Round($_.CPU,1)}} |
    Format-Table -AutoSize
```

---

## 4. 프로세스와 권한 관리

### 학습 목표

- 운영체제의 프로세스를 조회하고 관리할 수 있다
- 파일 권한 시스템(Linux/Windows)을 이해하고 설정할 수 있다
- PowerShell 실행 정책을 적절히 구성할 수 있다

### 4-1. 프로세스 조회와 관리

#### Bash (Linux/macOS)

```bash
# 전체 프로세스 목록
ps aux

# 실시간 프로세스 모니터링
top
htop    # 향상된 버전 (설치 필요)

# 특정 프로세스 찾기
ps aux | grep node
pgrep -l node

# 프로세스 종료
kill 12345           # 정상 종료 (SIGTERM)
kill -9 12345        # 강제 종료 (SIGKILL)
killall node         # 이름으로 종료

# 포트 사용 중인 프로세스 확인
lsof -i :3000
# 또는
ss -tlnp | grep 3000
```

#### PowerShell (Windows)

```powershell
# 전체 프로세스 목록
Get-Process

# 특정 프로세스 찾기
Get-Process -Name "node"
Get-Process | Where-Object { $_.ProcessName -like "*node*" }

# 상세 정보 포함
Get-Process node | Format-List *

# 프로세스 종료
Stop-Process -Id 12345
Stop-Process -Name "node" -Force

# 포트 사용 중인 프로세스 확인
Get-NetTCPConnection -LocalPort 3000 |
    Select-Object LocalPort, OwningProcess,
        @{N="ProcessName";E={(Get-Process -Id $_.OwningProcess).ProcessName}}

# 프로세스 실시간 모니터링 (간이)
while ($true) {
    Clear-Host
    Get-Process | Sort-Object CPU -Descending | Select-Object -First 10 Name, Id, CPU
    Start-Sleep -Seconds 2
}
```

#### 프로세스 관리 비교표

| 작업 | Bash | PowerShell |
|------|------|------------|
| 프로세스 목록 | `ps aux` | `Get-Process` |
| 실시간 모니터링 | `top` / `htop` | 기본 제공 없음 (스크립트 필요) |
| 이름으로 검색 | `pgrep -l name` | `Get-Process -Name "name"` |
| PID로 종료 | `kill PID` | `Stop-Process -Id PID` |
| 이름으로 종료 | `killall name` | `Stop-Process -Name "name"` |
| 강제 종료 | `kill -9 PID` | `Stop-Process -Id PID -Force` |
| 포트 확인 | `lsof -i :포트` | `Get-NetTCPConnection -LocalPort 포트` |

### 4-2. 파일 권한 관리

#### Linux/macOS: chmod

```bash
# 권한 확인
ls -la

# 권한 표기 이해
# -rwxr-xr-- 1 user group
# │├─┤├─┤├─┤
# │ │   │  └── 기타(Other): r-- (읽기만)
# │ │   └──── 그룹(Group): r-x (읽기+실행)
# │ └──────── 소유자(User): rwx (읽기+쓰기+실행)
# └────────── 파일 타입 (-: 일반 파일, d: 디렉토리)

# 숫자 방식으로 권한 설정
chmod 755 script.sh    # rwxr-xr-x (소유자: 전체, 나머지: 읽기+실행)
chmod 644 config.txt   # rw-r--r-- (소유자: 읽기+쓰기, 나머지: 읽기)
chmod 600 .env         # rw------- (소유자만 읽기+쓰기)

# 기호 방식으로 권한 설정
chmod +x script.sh     # 실행 권한 추가
chmod u+w file.txt     # 소유자에게 쓰기 권한 추가
chmod go-w file.txt    # 그룹+기타에서 쓰기 권한 제거
chmod -R 755 ./dist    # 하위 폴더 전체 재귀 적용

# 소유자 변경
chown user:group file.txt
chown -R user:group ./project
```

#### Windows: icacls / Set-Acl

```powershell
# 파일 권한 확인
icacls file.txt

# 사용자에게 전체 권한 부여
icacls file.txt /grant "사용자:(F)"

# 읽기 전용 설정
icacls file.txt /grant "사용자:(R)"

# 권한 제거
icacls file.txt /remove "사용자"

# PowerShell Set-Acl 사용
$acl = Get-Acl file.txt
$rule = New-Object System.Security.AccessControl.FileSystemAccessRule(
    "사용자", "FullControl", "Allow"
)
$acl.SetAccessRule($rule)
Set-Acl file.txt $acl

# 읽기 전용 속성 설정/해제
Set-ItemProperty file.txt -Name IsReadOnly -Value $true
Set-ItemProperty file.txt -Name IsReadOnly -Value $false
```

### 4-3. PowerShell 실행 정책 심화

```powershell
# 현재 실행 정책 확인
Get-ExecutionPolicy
Get-ExecutionPolicy -List    # 모든 범위 확인

# 실행 정책 종류
# Restricted    : 스크립트 실행 불가 (Windows 기본값)
# AllSigned     : 서명된 스크립트만 실행
# RemoteSigned  : 로컬 스크립트는 허용, 원격은 서명 필요
# Unrestricted  : 모든 스크립트 실행 (경고 표시)
# Bypass        : 제한 없음 (경고도 없음)

# 현재 사용자만 변경 (관리자 권한 불필요)
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser

# 프로세스 범위로 임시 변경 (현재 세션만)
Set-ExecutionPolicy Bypass -Scope Process

# 개발 환경 권장 설정
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
```

### 실습 과제 4: 프로세스 조회와 종료

```bash
# [Bash]
# 1. 현재 실행 중인 node 프로세스 확인
ps aux | grep node

# 2. 3000번 포트를 사용하는 프로세스 찾기
lsof -i :3000

# 3. 해당 프로세스 종료
kill $(lsof -t -i :3000)
```

```powershell
# [PowerShell]
# 1. 현재 실행 중인 node 프로세스 확인
Get-Process | Where-Object ProcessName -like "*node*"

# 2. 3000번 포트를 사용하는 프로세스 찾기
Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue |
    Select-Object LocalPort, OwningProcess,
        @{N="Name";E={(Get-Process -Id $_.OwningProcess).ProcessName}}

# 3. 해당 프로세스 종료
Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue |
    ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
```

---

## 5. VS Code 확장과 고급 설정

### 학습 목표

- 개발 생산성을 높이는 VS Code 확장을 선택하고 설치할 수 있다
- settings.json을 커스터마이징하여 개발 환경을 최적화할 수 있다
- 멀티 커서, 스니펫, Emmet 고급 기능을 활용할 수 있다

### 5-1. 필수 확장 15선 (카테고리별)

#### 코드 품질 (4개)

| 확장 | 설명 | 설치 ID |
|------|------|---------|
| **ESLint** | JavaScript/TypeScript 린팅 | `dbaeumer.vscode-eslint` |
| **Prettier** | 코드 자동 포매팅 | `esbenp.prettier-vscode` |
| **Error Lens** | 에러를 코드 옆에 인라인 표시 | `usernamehw.errorlens` |
| **Code Spell Checker** | 영문 오타 검출 | `streetsidesoftware.code-spell-checker` |

#### 개발 도구 (4개)

| 확장 | 설명 | 설치 ID |
|------|------|---------|
| **GitLens** | Git 히스토리, blame, 비교 | `eamodio.gitlens` |
| **Thunder Client** | VS Code 내 API 테스트 도구 | `rangav.vscode-thunder-client` |
| **Live Server** | 로컬 개발 서버 실행 | `ritwickdey.liveserver` |
| **Path Intellisense** | 파일 경로 자동완성 | `christian-kohler.path-intellisense` |

#### 생산성 (4개)

| 확장 | 설명 | 설치 ID |
|------|------|---------|
| **Auto Rename Tag** | HTML 태그 자동 쌍 수정 | `formulahendry.auto-rename-tag` |
| **Bracket Pair Colorizer** | 괄호 색상 구분 (내장됨) | VS Code 내장 설정 |
| **indent-rainbow** | 들여쓰기 레벨 색상 구분 | `oderwat.indent-rainbow` |
| **Todo Tree** | TODO/FIXME 주석 트리 뷰 | `gruntfuggly.todo-tree` |

#### 테마 및 외형 (3개)

| 확장 | 설명 | 설치 ID |
|------|------|---------|
| **Material Icon Theme** | 파일/폴더 아이콘 테마 | `pkief.material-icon-theme` |
| **One Dark Pro** | 인기 다크 테마 | `zhuangtongfa.material-theme` |
| **Korean Language Pack** | VS Code 한국어 팩 | `ms-ceintl.vscode-language-pack-ko` |

#### CLI로 확장 일괄 설치

```bash
# Bash / PowerShell 공통
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension eamodio.gitlens
code --install-extension usernamehw.errorlens
code --install-extension ritwickdey.liveserver
```

### 5-2. settings.json 커스터마이징

`Ctrl+Shift+P` → `Preferences: Open Settings (JSON)`으로 열 수 있습니다.

```jsonc
// settings.json 추천 설정
{
    // === 편집기 기본 ===
    "editor.fontSize": 14,
    "editor.fontFamily": "'D2Coding', 'Fira Code', Consolas, monospace",
    "editor.fontLigatures": true,
    "editor.tabSize": 2,
    "editor.wordWrap": "on",
    "editor.minimap.enabled": false,
    "editor.lineNumbers": "on",
    "editor.renderWhitespace": "boundary",
    "editor.bracketPairColorization.enabled": true,
    "editor.guides.bracketPairs": "active",
    "editor.linkedEditing": true,

    // === 저장 시 자동 작업 ===
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": "explicit"
    },
    "files.autoSave": "onFocusChange",
    "files.trimTrailingWhitespace": true,
    "files.insertFinalNewline": true,

    // === 터미널 설정 ===
    "terminal.integrated.defaultProfile.windows": "PowerShell",
    "terminal.integrated.fontSize": 13,

    // === 파일 탐색기 ===
    "explorer.confirmDelete": false,
    "explorer.confirmDragAndDrop": false,
    "files.exclude": {
        "**/node_modules": true,
        "**/.git": true,
        "**/.DS_Store": true
    },

    // === Emmet ===
    "emmet.includeLanguages": {
        "javascript": "javascriptreact"
    },

    // === Git ===
    "git.autofetch": true,
    "git.confirmSync": false
}
```

### 5-3. 키보드 단축키 커스터마이징

자주 사용하는 단축키와 커스터마이징 방법입니다.

#### 필수 단축키 정리

| 기능 | Windows/Linux | macOS |
|------|--------------|-------|
| 명령 팔레트 | `Ctrl+Shift+P` | `Cmd+Shift+P` |
| 파일 빠른 열기 | `Ctrl+P` | `Cmd+P` |
| 전체 검색 | `Ctrl+Shift+F` | `Cmd+Shift+F` |
| 터미널 토글 | `` Ctrl+` `` | `` Cmd+` `` |
| 사이드바 토글 | `Ctrl+B` | `Cmd+B` |
| 줄 이동 | `Alt+Up/Down` | `Option+Up/Down` |
| 줄 복제 | `Shift+Alt+Up/Down` | `Shift+Option+Up/Down` |
| 줄 삭제 | `Ctrl+Shift+K` | `Cmd+Shift+K` |
| 멀티 커서 추가 | `Ctrl+Alt+Up/Down` | `Cmd+Option+Up/Down` |
| 단어 선택 확장 | `Ctrl+D` | `Cmd+D` |
| 모든 동일 단어 선택 | `Ctrl+Shift+L` | `Cmd+Shift+L` |
| 정의로 이동 | `F12` | `F12` |
| 이름 바꾸기 | `F2` | `F2` |

#### keybindings.json 커스터마이징

`Ctrl+Shift+P` → `Preferences: Open Keyboard Shortcuts (JSON)`

```jsonc
// keybindings.json
[
    // 터미널에서 Ctrl+K로 화면 지우기
    {
        "key": "ctrl+k",
        "command": "workbench.action.terminal.clear",
        "when": "terminalFocus"
    },
    // Ctrl+Shift+D로 줄 복제
    {
        "key": "ctrl+shift+d",
        "command": "editor.action.copyLinesDownAction",
        "when": "editorTextFocus"
    }
]
```

### 5-4. 워크스페이스 설정 (.vscode/)

프로젝트별 설정은 `.vscode/` 폴더에 저장하여 팀원과 공유합니다.

```
프로젝트/
├── .vscode/
│   ├── settings.json        ← 프로젝트별 설정
│   ├── extensions.json      ← 추천 확장 목록
│   ├── launch.json          ← 디버그 설정
│   └── tasks.json           ← 작업 자동화
└── ...
```

```jsonc
// .vscode/settings.json (프로젝트별)
{
    "editor.tabSize": 2,
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "[python]": {
        "editor.tabSize": 4,
        "editor.defaultFormatter": "ms-python.black-formatter"
    },
    "search.exclude": {
        "**/node_modules": true,
        "**/dist": true,
        "**/build": true
    }
}
```

```jsonc
// .vscode/extensions.json (추천 확장 → 팀원에게 설치 권장 표시)
{
    "recommendations": [
        "dbaeumer.vscode-eslint",
        "esbenp.prettier-vscode",
        "eamodio.gitlens",
        "ritwickdey.liveserver"
    ]
}
```

### 5-5. 멀티 커서, 스니펫, Emmet 고급

#### 멀티 커서 활용

```
# 멀티 커서 사용 시나리오

1. 같은 변수명 모두 바꾸기:
   - 변수 위에 커서 → Ctrl+D 반복 → 동시 수정

2. 여러 줄에 동시 입력:
   - Alt+클릭으로 원하는 위치에 커서 추가
   - 또는 Ctrl+Alt+Down으로 아래에 커서 추가

3. 정규식 찾기/바꾸기:
   - Ctrl+H → 정규식 모드(.*) 활성화
   - 캡처 그룹 활용: (.+) → $1
```

#### 사용자 스니펫 만들기

`Ctrl+Shift+P` → `Snippets: Configure User Snippets`

```jsonc
// javascript.json (사용자 스니펫)
{
    "Console Log": {
        "prefix": "cl",
        "body": [
            "console.log('$1:', $1);"
        ],
        "description": "console.log 빠른 입력"
    },
    "Arrow Function": {
        "prefix": "af",
        "body": [
            "const ${1:name} = (${2:params}) => {",
            "  $0",
            "};"
        ],
        "description": "화살표 함수"
    },
    "React Function Component": {
        "prefix": "rfc",
        "body": [
            "import React from 'react';",
            "",
            "const ${1:Component} = () => {",
            "  return (",
            "    <div>",
            "      $0",
            "    </div>",
            "  );",
            "};",
            "",
            "export default ${1:Component};"
        ],
        "description": "React 함수형 컴포넌트"
    },
    "Try-Catch Block": {
        "prefix": "tc",
        "body": [
            "try {",
            "  $1",
            "} catch (error) {",
            "  console.error('Error:', error);",
            "  $0",
            "}"
        ],
        "description": "try-catch 블록"
    }
}
```

#### Emmet 고급 활용

```html
<!-- Emmet 축약 → Tab 키로 확장 -->

<!-- ul>li*5 -->
<ul>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
</ul>

<!-- div.container>header+main+footer -->
<div class="container">
    <header></header>
    <main></main>
    <footer></footer>
</div>

<!-- table>(thead>tr>th*3)+(tbody>tr*3>td*3) -->
<!-- 3열 3행 테이블 즉시 생성 -->

<!-- form>input:text+input:email+input:password+button[type=submit] -->
<!-- 폼 요소를 한 줄로 생성 -->

<!-- nav>ul>li*5>a[href="#section${$}"].nav-link{메뉴 $} -->
<!-- 번호 매기기와 텍스트 포함 -->
```

### 실습 과제 5: settings.json + 스니펫 만들기

1. VS Code의 `settings.json`을 열고 위의 추천 설정 중 3개 이상을 적용하세요
2. JavaScript용 사용자 스니펫을 2개 이상 만들어보세요
3. `.vscode/extensions.json`에 팀원에게 추천할 확장 3개를 등록하세요

---

## 6. VS Code 디버깅 마스터

### 학습 목표

- VS Code의 디버거 UI를 이해하고 중단점을 설정할 수 있다
- launch.json을 작성하여 다양한 런타임에서 디버깅할 수 있다
- 변수 감시, 콜스택 분석, 디버그 콘솔을 활용할 수 있다

### 6-1. 디버거 UI 이해

VS Code 좌측 사이드바의 **실행 및 디버그** 아이콘(벌레 모양)을 클릭하면 디버그 패널이 열립니다.

```
디버그 패널 구성:
┌─────────────────────┐
│  ▶ 실행 및 디버그      │  ← 시작 버튼
│                     │
│  📋 변수 (Variables) │  ← 현재 스코프의 변수 값
│  │ Local            │
│  │ Closure          │
│  │ Global           │
│                     │
│  👁 감시 (Watch)      │  ← 특정 표현식 감시
│  │ + 추가            │
│                     │
│  📚 호출 스택         │  ← 함수 호출 순서
│  │ main.js:15       │
│  │ handler.js:42    │
│                     │
│  🔴 중단점           │  ← 설정된 중단점 목록
│  │ main.js:15       │
│  │ app.js:23        │
└─────────────────────┘
```

#### 중단점 종류

| 종류 | 설정 방법 | 용도 |
|------|----------|------|
| **일반 중단점** | 줄 번호 옆 클릭 | 해당 줄에서 실행 중지 |
| **조건부 중단점** | 우클릭 → 조건 설정 | 조건이 참일 때만 중지 |
| **로그 중단점** | 우클릭 → 로그 메시지 | 중지 없이 로그만 출력 |
| **예외 중단점** | 중단점 패널에서 설정 | 예외 발생 시 중지 |

### 6-2. launch.json 설정

`.vscode/launch.json` 파일에 디버그 설정을 작성합니다.

#### Node.js 디버깅

```jsonc
// .vscode/launch.json
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "Node.js 실행",
            "program": "${workspaceFolder}/src/index.js",
            "console": "integratedTerminal",
            "skipFiles": ["<node_internals>/**"]
        },
        {
            "type": "node",
            "request": "launch",
            "name": "현재 파일 실행",
            "program": "${file}",
            "console": "integratedTerminal"
        },
        {
            "type": "node",
            "request": "launch",
            "name": "npm start 디버그",
            "runtimeExecutable": "npm",
            "runtimeArgs": ["start"],
            "console": "integratedTerminal"
        }
    ]
}
```

#### Python 디버깅

```jsonc
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Python: 현재 파일",
            "type": "debugpy",
            "request": "launch",
            "program": "${file}",
            "console": "integratedTerminal",
            "justMyCode": true
        },
        {
            "name": "Python: Flask",
            "type": "debugpy",
            "request": "launch",
            "module": "flask",
            "args": ["run", "--debug"],
            "env": {
                "FLASK_APP": "app.py"
            }
        }
    ]
}
```

#### Chrome 브라우저 디버깅

```jsonc
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "chrome",
            "request": "launch",
            "name": "Chrome에서 열기",
            "url": "http://localhost:3000",
            "webRoot": "${workspaceFolder}/src"
        }
    ]
}
```

### 6-3. 디버그 콘솔과 tasks.json

#### 디버그 콘솔 활용

디버그 중 하단의 **디버그 콘솔**에서 표현식을 직접 실행할 수 있습니다.

```javascript
// 디버그 콘솔에서 입력 가능한 예시
variable_name                    // 변수 값 확인
array.length                     // 배열 길이
JSON.stringify(object, null, 2)  // 객체를 보기 좋게 출력
object.property = newValue       // 변수 값 변경 (실시간)
```

#### tasks.json

`tasks.json`은 빌드, 테스트 등 반복 작업을 자동화합니다.

```jsonc
// .vscode/tasks.json
{
    "version": "2.0.0",
    "tasks": [
        {
            "label": "npm: build",
            "type": "npm",
            "script": "build",
            "group": {
                "kind": "build",
                "isDefault": true
            },
            "problemMatcher": ["$tsc"]
        },
        {
            "label": "npm: test",
            "type": "npm",
            "script": "test",
            "group": "test"
        },
        {
            "label": "npm: dev",
            "type": "npm",
            "script": "dev",
            "isBackground": true,
            "problemMatcher": []
        }
    ]
}
```

### 실습 과제 6: Node.js 프로그램 디버깅

```javascript
// debug-practice.js 파일을 만들고 디버깅하세요

function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

function processNumbers(numbers) {
    const results = [];
    for (const num of numbers) {
        const fib = fibonacci(num);
        results.push({ input: num, fibonacci: fib });
    }
    return results;
}

// 중단점을 설정하고 변수 값을 확인하세요
const numbers = [5, 10, 15, 20];
const results = processNumbers(numbers);
console.log(JSON.stringify(results, null, 2));
```

디버깅 연습 과정:
1. `fibonacci` 함수 안에 조건부 중단점 설정: `n > 10`
2. `processNumbers` 함수에서 `results.push` 줄에 일반 중단점 설정
3. F5로 디버그 시작 → 변수 패널에서 값 확인
4. F10(Step Over), F11(Step Into)로 코드 흐름 추적
5. 감시 표현식에 `results.length` 추가

---

## 7. Git branch와 협업

### 학습 목표

- Git 브랜치를 생성하고 전환하며 병합할 수 있다
- 병합 충돌을 이해하고 해결할 수 있다
- GitHub에서 Pull Request를 통해 협업할 수 있다

### 7-1. 브랜치 생성, 전환, 병합

```bash
# 브랜치 목록 확인
git branch              # 로컬 브랜치
git branch -a           # 로컬 + 원격 브랜치

# 새 브랜치 생성
git branch feature/login

# 브랜치 전환
git checkout feature/login
# 또는 (Git 2.23+)
git switch feature/login

# 생성과 전환을 동시에
git checkout -b feature/login
# 또는
git switch -c feature/login

# 브랜치에서 작업 후 커밋
git add .
git commit -m "로그인 기능 구현"

# main 브랜치로 돌아가기
git switch main

# 브랜치 병합 (main에서 실행)
git merge feature/login

# 브랜치 삭제 (병합 완료 후)
git branch -d feature/login
```

```powershell
# PowerShell에서도 Git 명령어는 동일합니다
# (Git은 크로스 플랫폼 도구)
git branch
git switch -c feature/login
git add .
git commit -m "로그인 기능 구현"
git switch main
git merge feature/login
```

### 7-2. 브랜치 전략 (Git Flow 간략)

```
main ──────────●──────────●──────────●──── (안정 버전)
                \        /            \
develop ────────●──●──●──●──────●──●──●── (개발 통합)
                    \      /        \
feature/login ──────●──●──●          \
                                      \
feature/profile ────────────────●──●──●
```

| 브랜치 | 용도 | 예시 |
|--------|------|------|
| `main` | 배포 가능한 안정 코드 | 운영 서버 배포 |
| `develop` | 개발 통합 브랜치 | 다음 릴리즈 준비 |
| `feature/*` | 새 기능 개발 | `feature/login` |
| `bugfix/*` | 버그 수정 | `bugfix/header-layout` |
| `hotfix/*` | 긴급 수정 (main에서 분기) | `hotfix/security-patch` |

### 7-3. 충돌 해결

```bash
# 충돌 발생 시나리오
git switch main
git merge feature/login
# Auto-merging src/app.js
# CONFLICT (content): Merge conflict in src/app.js
# Automatic merge failed; fix conflicts and then commit the result.

# 충돌 파일 확인
git status
# both modified: src/app.js

# 충돌 내용 (파일을 열면 이렇게 표시됨)
# <<<<<<< HEAD
# const title = "메인 페이지";
# =======
# const title = "로그인 페이지";
# >>>>>>> feature/login

# 해결 방법:
# 1. VS Code에서 파일을 열면 충돌 부분이 하이라이트됨
# 2. "Accept Current Change" / "Accept Incoming Change" /
#    "Accept Both Changes" 중 선택
# 3. 수동으로 편집 후 충돌 마커 제거

# 해결 후 커밋
git add src/app.js
git commit -m "merge conflict 해결: app.js 타이틀 통합"
```

> **팁**: VS Code의 **GitLens** 확장을 설치하면, 충돌 해결 UI가 더 직관적으로 제공됩니다. 3-way merge 에디터(`Ctrl+Shift+P` → "Merge Editor")를 활용하면 복잡한 충돌도 시각적으로 해결할 수 있습니다.

### 7-4. remote / push / pull

```bash
# 원격 저장소 확인
git remote -v

# 원격 저장소 추가
git remote add origin https://github.com/username/repo.git

# 로컬 브랜치를 원격에 푸시
git push -u origin feature/login

# 원격 변경사항 가져오기
git pull origin main

# 원격 브랜치 목록 갱신
git fetch --all

# 원격 브랜치 삭제
git push origin --delete feature/login
```

### 7-5. Pull Request (PR) 개념과 실습

PR은 코드 리뷰를 거쳐 브랜치를 병합하는 협업 방식입니다.

```bash
# PR 워크플로우
# 1. 기능 브랜치 생성
git switch -c feature/profile-page

# 2. 코드 작성 및 커밋
# ... 작업 ...
git add .
git commit -m "프로필 페이지 구현"

# 3. 원격에 푸시
git push -u origin feature/profile-page

# 4. GitHub에서 PR 생성
#    - github.com/username/repo → "Compare & pull request" 버튼
#    - 또는 CLI로:
gh pr create --title "프로필 페이지 구현" --body "프로필 조회/수정 기능"

# 5. 코드 리뷰 후 병합
#    - GitHub 웹에서 "Merge pull request" 클릭
#    - 또는 CLI로:
gh pr merge --squash

# 6. 로컬 정리
git switch main
git pull origin main
git branch -d feature/profile-page
```

### 실습 과제 7: 기능 브랜치 만들고 GitHub PR

1. 새 저장소를 만들거나 기존 저장소를 사용하세요
2. `feature/hello-page` 브랜치를 생성하세요
3. 간단한 HTML 파일을 추가하고 커밋하세요
4. GitHub에 푸시하고 PR을 만들어보세요
5. PR을 병합하고 로컬 브랜치를 정리하세요

```bash
# 전체 과정 예시
mkdir pr-practice && cd pr-practice
git init
echo "# PR Practice" > README.md
git add README.md
git commit -m "초기 커밋"

# GitHub 저장소 만들기 (gh CLI 사용)
gh repo create pr-practice --public --push --source=.

# 기능 브랜치 생성
git switch -c feature/hello-page
echo "<h1>Hello!</h1>" > hello.html
git add hello.html
git commit -m "hello 페이지 추가"

# 푸시 및 PR 생성
git push -u origin feature/hello-page
gh pr create --title "hello 페이지 추가" --body "Hello 페이지를 추가합니다."
```

---

## 8. CLI 기반 프로그램 실행

### 학습 목표

- Node.js와 Python 프로그램을 CLI에서 실행할 수 있다
- npm, pip 등 패키지 매니저를 심화 활용할 수 있다
- Windows 환경에서의 경로 및 인코딩 주의사항을 이해할 수 있다

### 8-1. Node.js 실행

```bash
# Node.js 버전 확인
node --version
npm --version

# JavaScript 파일 실행
node app.js

# REPL(대화형 모드) 실행
node
# > 1 + 2
# 3
# > .exit

# npm 스크립트 실행 (package.json에 정의된 것)
npm start
npm run dev
npm run build
npm test

# npx: 패키지를 설치하지 않고 실행
npx create-react-app my-app
npx ts-node script.ts
npx http-server    # 간이 웹 서버
```

### 8-2. Python 실행

```bash
# Python 버전 확인
python3 --version      # macOS/Linux
python --version        # Windows (보통 python 또는 py)
py --version            # Windows (Python Launcher)

# Python 파일 실행
python3 app.py          # macOS/Linux
python app.py           # Windows
py app.py               # Windows (Python Launcher)

# 가상환경 생성 및 활성화
python3 -m venv venv
source venv/bin/activate        # macOS/Linux
.\venv\Scripts\Activate.ps1     # Windows PowerShell
.\venv\Scripts\activate.bat     # Windows CMD

# pip로 패키지 관리
pip install flask
pip install -r requirements.txt
pip freeze > requirements.txt
pip list
```

### 8-3. 패키지 매니저 심화

#### npm 심화

```bash
# 프로젝트 초기화
npm init -y

# 패키지 설치
npm install express              # dependencies에 추가
npm install --save-dev nodemon   # devDependencies에 추가
npm install -g typescript        # 전역 설치

# 패키지 관리
npm list                         # 설치된 패키지 목록
npm list --depth=0               # 최상위만 표시
npm outdated                     # 업데이트 가능한 패키지
npm update                       # 패키지 업데이트
npm uninstall lodash             # 패키지 제거

# 캐시 관리
npm cache clean --force          # 캐시 삭제

# 보안 검사
npm audit                        # 취약점 확인
npm audit fix                    # 자동 수정
```

#### package.json scripts 활용

```json
{
    "scripts": {
        "start": "node src/index.js",
        "dev": "nodemon src/index.js",
        "build": "tsc",
        "test": "jest",
        "lint": "eslint src/",
        "format": "prettier --write src/",
        "clean": "rm -rf dist",
        "prebuild": "npm run clean",
        "postbuild": "echo 빌드 완료!"
    }
}
```

> **참고**: `pre`/`post` 접두어가 붙은 스크립트는 해당 스크립트 전/후에 자동으로 실행됩니다. 위 예시에서 `npm run build`를 실행하면 `prebuild` → `build` → `postbuild` 순서로 실행됩니다.

### 8-4. Windows에서의 경로 및 인코딩 주의사항

Windows에서 개발할 때 자주 발생하는 문제와 해결책입니다.

| 문제 | 원인 | 해결 |
|------|------|------|
| `ENOENT` 에러 | 경로 구분자 차이 (`\` vs `/`) | Node.js에서 `path.join()` 사용 |
| 한글 깨짐 | 인코딩 차이 (CP949 vs UTF-8) | 파일 저장 시 UTF-8 지정 |
| `npm start` 실패 | 경로에 한글/공백 포함 | 영문 경로 사용 권장 |
| 스크립트 실행 불가 | PowerShell 실행 정책 | `Set-ExecutionPolicy RemoteSigned` |
| 줄바꿈 차이 | CRLF(Windows) vs LF(macOS/Linux) | `.gitattributes` 또는 `git config core.autocrlf` |

```bash
# Git 줄바꿈 설정 (Windows)
git config --global core.autocrlf true

# .gitattributes 파일로 프로젝트별 설정
echo "* text=auto" > .gitattributes
echo "*.sh text eol=lf" >> .gitattributes
echo "*.bat text eol=crlf" >> .gitattributes
```

```powershell
# PowerShell 인코딩 설정
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$PSDefaultParameterValues['Out-File:Encoding'] = 'utf8'

# chcp로 콘솔 코드 페이지 변경
chcp 65001    # UTF-8
```

### 실습 과제 8: CLI로 개발 서버 실행

```bash
# 1. 간단한 Node.js Express 서버 만들기
mkdir server-practice && cd server-practice
npm init -y
npm install express

# 2. index.js 작성
cat << 'EOF' > index.js
const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    res.send('<h1>Hello from Express!</h1><p>CLI에서 실행한 서버입니다.</p>');
});

app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
EOF

# 3. 서버 실행
node index.js

# 4. 브라우저에서 http://localhost:3000 확인
# 5. Ctrl+C로 서버 종료
```

---

## 9. 로그 분석과 모니터링

### 학습 목표

- 서버 로그를 실시간으로 모니터링할 수 있다
- 로그 레벨을 이해하고 적절히 활용할 수 있다
- Bash와 PowerShell에서 로그 분석 명령어를 사용할 수 있다

### 9-1. 로그 실시간 모니터링

#### Bash

```bash
# 실시간 로그 모니터링
tail -f server.log

# 마지막 100줄만 보기
tail -n 100 server.log

# 특정 키워드만 필터링하면서 모니터링
tail -f server.log | grep "ERROR"

# 여러 파일을 동시에 모니터링
tail -f server.log error.log

# less로 로그 탐색 (검색, 스크롤 가능)
less server.log
# /keyword  → 검색
# n         → 다음 검색 결과
# G         → 파일 끝으로
# q         → 종료

# awk로 특정 컬럼 추출
# 로그 형식: [2026-03-09 10:30:00] ERROR 메시지
awk '/ERROR/ {print $1, $2, $4}' server.log

# 시간대별 에러 수 세기
grep "ERROR" server.log | awk '{print $1}' | sort | uniq -c | sort -rn
```

#### PowerShell

```powershell
# 실시간 로그 모니터링
Get-Content server.log -Wait

# 마지막 100줄만 보기
Get-Content server.log -Tail 100

# 특정 키워드만 필터링하면서 모니터링
Get-Content server.log -Wait | Select-String "ERROR"

# 특정 키워드를 색상으로 강조
Get-Content server.log -Wait | ForEach-Object {
    if ($_ -match "ERROR") { Write-Host $_ -ForegroundColor Red }
    elseif ($_ -match "WARN") { Write-Host $_ -ForegroundColor Yellow }
    else { Write-Host $_ }
}

# 로그에서 에러만 추출하여 파일로 저장
Select-String -Path server.log -Pattern "ERROR" | Out-File errors-only.log
```

#### 로그 모니터링 비교

| 작업 | Bash | PowerShell |
|------|------|------------|
| 실시간 모니터링 | `tail -f file` | `Get-Content file -Wait` |
| 마지막 N줄 | `tail -n 100 file` | `Get-Content file -Tail 100` |
| 키워드 필터링 | `tail -f file \| grep "ERROR"` | `Get-Content file -Wait \| Select-String "ERROR"` |
| 로그 탐색 | `less file` | VS Code에서 열기 |
| 컬럼 추출 | `awk '{print $1}'` | `ForEach-Object { $_.Split(" ")[0] }` |

### 9-2. 로그 레벨 이해

```
로그 레벨 체계 (심각도 순):

FATAL   ← 시스템이 더 이상 동작할 수 없는 치명적 오류
ERROR   ← 기능이 정상 동작하지 않는 오류
WARN    ← 주의가 필요하지만 동작은 계속됨
INFO    ← 일반적인 작업 진행 정보
DEBUG   ← 개발 시 디버깅용 상세 정보
TRACE   ← 가장 상세한 수준 (함수 호출 등)
```

```javascript
// Node.js에서 로그 레벨 활용 예시
const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',    // info 이상만 출력 (info, warn, error, fatal)
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'app.log' })
    ]
});

logger.info('서버가 시작되었습니다');
logger.warn('메모리 사용량이 80%를 초과했습니다');
logger.error('데이터베이스 연결에 실패했습니다');
```

### 실습 과제 9: 서버 로그 실시간 모니터링

```bash
# [Bash]
# 1. 테스트 로그 파일 생성 (백그라운드에서 로그를 계속 추가)
while true; do
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] INFO: 정상 요청 처리" >> test.log
    sleep 1
    if [ $((RANDOM % 5)) -eq 0 ]; then
        echo "[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: 요청 처리 실패" >> test.log
    fi
done &

# 2. 실시간 모니터링
tail -f test.log

# 3. ERROR만 필터링
tail -f test.log | grep --color "ERROR"

# 4. 백그라운드 프로세스 종료
kill %1
```

```powershell
# [PowerShell]
# 1. 테스트 로그 파일 생성 (별도 터미널에서 실행)
while ($true) {
    $time = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    "[$time] INFO: 정상 요청 처리" | Out-File test.log -Append
    Start-Sleep -Seconds 1
    if ((Get-Random -Maximum 5) -eq 0) {
        "[$time] ERROR: 요청 처리 실패" | Out-File test.log -Append
    }
}

# 2. 다른 터미널에서 실시간 모니터링
Get-Content test.log -Wait

# 3. ERROR만 색상 강조
Get-Content test.log -Wait | ForEach-Object {
    if ($_ -match "ERROR") { Write-Host $_ -ForegroundColor Red }
    else { Write-Host $_ }
}
```

---

## 10. 개발 작업 자동화 기초

### 학습 목표

- npm scripts로 개발 작업을 자동화할 수 있다
- Bash alias/함수와 PowerShell Set-Alias/함수를 등록할 수 있다
- 환경변수와 .env 파일을 활용할 수 있다

### 10-1. npm scripts 활용

```json
// package.json
{
    "scripts": {
        "start": "node src/index.js",
        "dev": "nodemon --watch src src/index.js",
        "build": "tsc && npm run copy-assets",
        "copy-assets": "cp -r src/assets dist/assets",
        "test": "jest --coverage",
        "test:watch": "jest --watch",
        "lint": "eslint 'src/**/*.{js,ts}'",
        "lint:fix": "eslint 'src/**/*.{js,ts}' --fix",
        "format": "prettier --write 'src/**/*.{js,ts,json}'",
        "clean": "rm -rf dist node_modules/.cache",
        "prepare": "husky install",
        "precommit": "npm run lint && npm run test"
    }
}
```

> **팁**: `npm run` 없이 직접 실행할 수 있는 스크립트는 `start`, `test`, `stop`, `restart` 4개뿐입니다. 나머지는 반드시 `npm run 스크립트명`으로 실행해야 합니다.

### 10-2. alias와 함수 등록

#### Bash (.bashrc / .zshrc)

```bash
# ~/.bashrc 또는 ~/.zshrc에 추가

# === 별칭 (alias) ===
alias ll='ls -la'
alias la='ls -A'
alias ..='cd ..'
alias ...='cd ../..'
alias g='git'
alias gs='git status'
alias ga='git add .'
alias gc='git commit -m'
alias gp='git push'
alias gl='git log --oneline -10'
alias gd='git diff'
alias c='code .'
alias ni='npm install'
alias nr='npm run'
alias ns='npm start'
alias nd='npm run dev'

# === 함수 ===
# 디렉토리 생성 후 진입
mkcd() {
    mkdir -p "$1" && cd "$1"
}

# Git add + commit + push
acp() {
    git add .
    git commit -m "$1"
    git push
}

# 특정 포트를 사용하는 프로세스 종료
killport() {
    local pid=$(lsof -t -i ":$1")
    if [ -n "$pid" ]; then
        kill -9 $pid
        echo "포트 $1 사용 프로세스(PID: $pid) 종료"
    else
        echo "포트 $1을 사용하는 프로세스 없음"
    fi
}

# 프로젝트 초기화 단축 함수
newproject() {
    mkcd "$1"
    git init
    npm init -y
    echo "node_modules/" > .gitignore
    echo ".env" >> .gitignore
    code .
}
```

```bash
# 적용
source ~/.bashrc    # 또는 source ~/.zshrc
```

#### PowerShell ($PROFILE)

```powershell
# $PROFILE 파일에 추가

# === 별칭 ===
Set-Alias -Name g -Value git
Set-Alias -Name c -Value code
Set-Alias -Name ll -Value Get-ChildItem
Set-Alias -Name np -Value notepad

# === 함수 ===
# 디렉토리 생성 후 진입
function mkcd {
    param([string]$dir)
    New-Item -ItemType Directory -Force $dir | Out-Null
    Set-Location $dir
}

# Git add + commit + push
function acp {
    param([string]$message)
    git add .
    git commit -m $message
    git push
}

# Git status 단축
function gs { git status }
function ga { git add . }
function gl { git log --oneline -10 }
function gd { git diff }

# npm 단축
function ni { npm install $args }
function nr { npm run $args }
function ns { npm start }
function nd { npm run dev }

# 특정 포트를 사용하는 프로세스 종료
function killport {
    param([int]$port)
    $conn = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($conn) {
        $conn | ForEach-Object {
            Stop-Process -Id $_.OwningProcess -Force
            Write-Host "포트 $port 사용 프로세스(PID: $($_.OwningProcess)) 종료" -ForegroundColor Green
        }
    } else {
        Write-Host "포트 $port 를 사용하는 프로세스 없음" -ForegroundColor Yellow
    }
}

# 프로젝트 초기화
function newproject {
    param([string]$name)
    mkcd $name
    git init
    npm init -y
    "node_modules/`n.env" | Out-File .gitignore -Encoding utf8
    code .
}
```

### 10-3. 환경변수와 .env 파일

```bash
# Bash: 환경변수 설정
export NODE_ENV=development
export PORT=3000
export API_KEY=your_api_key_here

# 현재 세션에서만 유효 (셸 종료 시 사라짐)
# 영구 저장하려면 ~/.bashrc에 추가

# 환경변수 확인
echo $NODE_ENV
printenv | grep NODE
```

```powershell
# PowerShell: 환경변수 설정
$env:NODE_ENV = "development"
$env:PORT = "3000"

# 영구 설정 (사용자 수준)
[Environment]::SetEnvironmentVariable("NODE_ENV", "development", "User")

# 환경변수 확인
$env:NODE_ENV
Get-ChildItem env: | Where-Object Name -like "NODE*"
```

#### .env 파일 활용

```bash
# .env 파일 (프로젝트 루트에 생성)
NODE_ENV=development
PORT=3000
DATABASE_URL=mongodb://localhost:27017/myapp
API_KEY=sk-abc123def456
SECRET_KEY=my-secret-key
```

```javascript
// Node.js에서 .env 파일 사용
// 1. dotenv 패키지 설치
// npm install dotenv

// 2. 코드 최상단에 추가
require('dotenv').config();

// 3. 환경변수 사용
const port = process.env.PORT || 3000;
const dbUrl = process.env.DATABASE_URL;
```

> **중요**: `.env` 파일은 반드시 `.gitignore`에 추가하세요. API 키나 비밀번호가 Git에 올라가면 보안 사고로 이어질 수 있습니다. 대신 `.env.example` 파일을 만들어 필요한 변수 이름만 공유합니다.

```bash
# .gitignore에 추가
echo ".env" >> .gitignore

# .env.example 작성 (값은 비우고 키만)
echo "NODE_ENV=
PORT=
DATABASE_URL=
API_KEY=" > .env.example
```

### 실습 과제 10: alias/함수 등록

```bash
# [Bash] ~/.bashrc 또는 ~/.zshrc에 다음을 추가하세요
# 1. 자주 쓰는 Git 별칭 3개 이상
# 2. mkcd 함수
# 3. acp 함수
# 적용: source ~/.bashrc
```

```powershell
# [PowerShell] $PROFILE에 다음을 추가하세요
# 1. 자주 쓰는 Git 별칭 3개 이상
# 2. mkcd 함수
# 3. killport 함수
# 적용: . $PROFILE
```

---

## 11. 바이브코딩 도구 환경 설정

### 학습 목표

- Cursor, Claude Code 등 바이브코딩 도구의 환경을 설정할 수 있다
- VS Code에서 각 도구를 연동하는 방법을 이해할 수 있다
- 도구별 필수 환경을 점검할 수 있다

### 11-1. Cursor 환경 설정

Cursor는 VS Code 기반 AI IDE로, `.cursor/rules` 파일을 통해 AI의 동작을 커스터마이징합니다.

```
프로젝트/
├── .cursor/
│   └── rules           ← AI 규칙 파일
├── .cursorignore        ← AI가 참조하지 않을 파일
└── ...
```

```markdown
<!-- .cursor/rules 파일 예시 -->
# 프로젝트 규칙

## 코드 스타일
- TypeScript를 사용합니다
- 함수형 컴포넌트를 사용합니다
- 변수명은 camelCase, 컴포넌트는 PascalCase
- import 순서: 라이브러리 → 컴포넌트 → 유틸리티 → 스타일

## 프로젝트 구조
- src/components/: React 컴포넌트
- src/hooks/: 커스텀 훅
- src/utils/: 유틸리티 함수
- src/types/: TypeScript 타입 정의

## 기술 스택
- React 18 + TypeScript
- Tailwind CSS
- React Router v6
- Zustand (상태 관리)

## 금지 사항
- any 타입 사용 금지
- console.log 커밋 금지
- 인라인 스타일 사용 금지
```

### 11-2. Claude Code CLI 환경 준비

```bash
# Claude Code 설치 (Node.js 18+ 필요)
npm install -g @anthropic-ai/claude-code

# 버전 확인
claude --version

# 초기 설정 (API 키 등록)
claude config set apiKey sk-ant-xxxxx

# CLAUDE.md 파일 생성 (프로젝트 루트)
# → Claude Code가 프로젝트 컨텍스트를 이해하는 데 사용

# 사용 시작
cd my-project
claude
```

### 11-3. VS Code에서 각 도구 연동법

| 도구 | VS Code 연동 방법 | 주요 설정 |
|------|-------------------|----------|
| **Cursor** | Cursor IDE 자체가 VS Code 포크 | `.cursor/rules`, `.cursorignore` |
| **Claude Code** | VS Code 터미널에서 `claude` 실행 | `CLAUDE.md`, API Key |
| **GitHub Copilot** | VS Code 확장 설치 | GitHub 계정 연동 |
| **Lovable** | 웹 기반 (VS Code 연동 불필요) | GitHub 연동으로 코드 동기화 |
| **AntiGravity** | 별도 데스크톱 앱 | VS Code에서 생성된 코드 편집 가능 |

### 11-4. 도구별 필수 환경 표

| 요구사항 | Cursor | Claude Code | Copilot | Lovable |
|---------|--------|-------------|---------|---------|
| **Node.js** | 권장 | 필수 (18+) | 불필요 | 불필요 |
| **Git** | 필수 | 필수 | 필수 | 선택 |
| **Python** | 선택 | 선택 | 선택 | 불필요 |
| **API Key** | 내장 | 필수 (Anthropic) | GitHub 계정 | 계정 로그인 |
| **OS** | Win/Mac/Linux | Win/Mac/Linux | Win/Mac/Linux | 웹 브라우저 |
| **RAM** | 8GB+ 권장 | 4GB+ | 4GB+ | 제한 없음 |
| **인터넷** | 필수 | 필수 | 필수 | 필수 |

### 실습 과제 11: 도구 환경 점검 체크리스트

아래 체크리스트를 터미널에서 하나씩 실행하여 환경을 점검하세요.

```bash
# === 기본 도구 점검 ===
echo "=== Node.js ==="
node --version 2>/dev/null || echo "미설치"

echo "=== npm ==="
npm --version 2>/dev/null || echo "미설치"

echo "=== Git ==="
git --version 2>/dev/null || echo "미설치"

echo "=== Python ==="
python3 --version 2>/dev/null || python --version 2>/dev/null || echo "미설치"

echo "=== VS Code ==="
code --version 2>/dev/null || echo "미설치"

# === Git 설정 점검 ===
echo "=== Git 사용자 ==="
git config --global user.name
git config --global user.email

# === 바이브코딩 도구 점검 ===
echo "=== Claude Code ==="
claude --version 2>/dev/null || echo "미설치"

echo "=== GitHub CLI ==="
gh --version 2>/dev/null || echo "미설치"
```

```powershell
# PowerShell 버전
Write-Host "=== PowerShell ===" -ForegroundColor Cyan
$PSVersionTable.PSVersion

Write-Host "=== Node.js ===" -ForegroundColor Cyan
try { node --version } catch { "미설치" }

Write-Host "=== npm ===" -ForegroundColor Cyan
try { npm --version } catch { "미설치" }

Write-Host "=== Git ===" -ForegroundColor Cyan
try { git --version } catch { "미설치" }

Write-Host "=== Python ===" -ForegroundColor Cyan
try { python --version } catch { "미설치" }

Write-Host "=== VS Code ===" -ForegroundColor Cyan
try { code --version } catch { "미설치" }

Write-Host "=== 실행 정책 ===" -ForegroundColor Cyan
Get-ExecutionPolicy

Write-Host "=== Git 사용자 ===" -ForegroundColor Cyan
git config --global user.name
git config --global user.email
```

---

## 12. 트러블슈팅 & FAQ

### 학습 목표

- 개발 환경에서 자주 발생하는 문제를 진단하고 해결할 수 있다
- FAQ를 참고하여 자주 묻는 질문에 답할 수 있다

### 트러블슈팅 6선

#### 문제 1: PATH에서 명령어를 찾을 수 없음

```
증상: 'node' is not recognized / command not found: node
원인: 해당 프로그램이 시스템 PATH에 등록되지 않음
```

```bash
# [Bash] PATH 확인
echo $PATH

# PATH에 경로 추가
export PATH="$PATH:/usr/local/bin"
# 영구 적용: ~/.bashrc에 위 줄 추가
```

```powershell
# [PowerShell] PATH 확인
$env:PATH -split ";"

# PATH에 경로 추가 (현재 세션)
$env:PATH += ";C:\Program Files\nodejs"

# 영구 추가 (사용자 수준)
[Environment]::SetEnvironmentVariable(
    "PATH",
    $env:PATH + ";C:\Program Files\nodejs",
    "User"
)
```

#### 문제 2: Git 병합 충돌 해결이 안 됨

```
증상: CONFLICT 표시 후 어떻게 해야 할지 모르겠음
```

```bash
# 1. 충돌 파일 확인
git status

# 2. VS Code에서 충돌 파일 열기 (시각적 도구 활용)
code 충돌파일.js

# 3. 충돌 마커 제거 후 원하는 내용으로 수정
#    <<<<<<< HEAD
#    =======
#    >>>>>>> branch-name

# 4. 해결 후 스테이징 및 커밋
git add 충돌파일.js
git commit -m "충돌 해결"

# 병합 취소하고 싶을 때
git merge --abort
```

#### 문제 3: 환경변수가 인식되지 않음

```
증상: process.env.API_KEY가 undefined
```

```bash
# 1. .env 파일이 프로젝트 루트에 있는지 확인
ls -la .env

# 2. dotenv 패키지 설치 여부 확인
npm list dotenv

# 3. 코드 최상단에 require('dotenv').config() 추가 확인

# 4. .env 파일 형식 확인 (= 주변에 공백 없어야 함)
# 올바름: API_KEY=value
# 잘못됨: API_KEY = value
```

#### 문제 4: SSH 키가 GitHub에서 인증 실패

```
증상: Permission denied (publickey)
```

```bash
# 1. SSH 키 존재 확인
ls -la ~/.ssh/

# 2. SSH 키 생성 (없는 경우)
ssh-keygen -t ed25519 -C "your_email@example.com"

# 3. SSH 에이전트에 키 추가
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# 4. 공개키를 GitHub에 등록
cat ~/.ssh/id_ed25519.pub
# → GitHub Settings → SSH and GPG keys → New SSH key

# 5. 연결 테스트
ssh -T git@github.com
```

```powershell
# Windows에서 SSH 키 생성
ssh-keygen -t ed25519 -C "your_email@example.com"

# 공개키 복사
Get-Content ~/.ssh/id_ed25519.pub | Set-Clipboard
# → GitHub Settings → SSH and GPG keys에 붙여넣기
```

#### 문제 5: Node.js/npm 버전 충돌

```
증상: 특정 패키지가 현재 Node 버전과 호환되지 않음
```

```bash
# nvm(Node Version Manager) 설치 후 버전 관리
# macOS/Linux
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 사용 가능한 버전 확인
nvm ls-remote

# 특정 버전 설치 및 사용
nvm install 18
nvm use 18
nvm alias default 18

# 프로젝트별 버전 고정
echo "18" > .nvmrc
nvm use    # .nvmrc의 버전으로 자동 전환
```

```powershell
# Windows에서는 nvm-windows 사용
# https://github.com/coreybutler/nvm-windows 에서 설치

nvm list available
nvm install 18.20.0
nvm use 18.20.0
```

#### 문제 6: PowerShell 한글 인코딩 깨짐

```
증상: PowerShell에서 한글이 깨져서 출력됨
```

```powershell
# 현재 인코딩 확인
[Console]::OutputEncoding
[Console]::InputEncoding

# UTF-8로 변경 (현재 세션)
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::InputEncoding = [System.Text.Encoding]::UTF8
chcp 65001

# 영구 적용: $PROFILE에 추가
# [Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# Windows Terminal 사용 시: 설정에서 기본 인코딩을 UTF-8로 변경
# Settings → Profiles → Defaults → "Starting directory" 아래
# 또는 Windows 설정 → 시간 및 언어 → 관리 언어 설정 →
# 시스템 로캘 변경 → "Beta: 전 세계 언어 지원을 위해 Unicode UTF-8 사용" 체크
```

### FAQ 8선

#### Q1. Bash와 PowerShell, 어떤 것을 배워야 하나요?

**Windows 사용자**: PowerShell을 먼저 배우되, Git Bash도 설치해두세요. 웹 개발 관련 자료 대부분이 Bash 기준이므로 두 가지 모두 알면 좋습니다.

**macOS/Linux 사용자**: Bash(또는 Zsh)를 주로 사용하고, PowerShell은 필요할 때 배우세요.

> **실사용자 조언**: "처음에는 하나에 집중하되, 다른 쪽도 기본은 알아두면 좋습니다. 터미널 자체에 익숙해지는 게 먼저예요." — 실사용자 후기

#### Q2. VS Code 확장을 너무 많이 설치하면 느려지나요?

네, 확장이 많으면 VS Code 시작 속도가 느려질 수 있습니다. 불필요한 확장은 비활성화하고, 워크스페이스별로 필요한 확장만 활성화하세요. `Ctrl+Shift+P` → "Show Running Extensions"로 각 확장의 로드 시간을 확인할 수 있습니다.

#### Q3. Git 커밋 메시지는 어떻게 쓰는 게 좋나요?

일반적인 규칙:
- **첫 줄**: 50자 이내로 변경 사항 요약
- **빈 줄**
- **본문**: 변경 이유, 영향 범위 등 상세 설명

```
feat: 로그인 페이지 구현

- 이메일/비밀번호 로그인 폼 추가
- 유효성 검사 로직 구현
- 로그인 API 연동
```

접두어: `feat`(기능), `fix`(버그), `docs`(문서), `style`(포매팅), `refactor`(리팩토링), `test`(테스트), `chore`(빌드/설정)

#### Q4. .gitignore에 뭘 넣어야 하나요?

```
# 일반적인 .gitignore
node_modules/          # npm 패키지
dist/                  # 빌드 결과물
build/                 # 빌드 결과물
.env                   # 환경변수 (비밀정보)
.env.local             # 로컬 환경변수
*.log                  # 로그 파일
.DS_Store              # macOS 메타데이터
Thumbs.db              # Windows 메타데이터
.vscode/settings.json  # 개인 IDE 설정 (팀 설정은 유지)
coverage/              # 테스트 커버리지
```

> **팁**: [gitignore.io](https://www.toptal.com/developers/gitignore)에서 프로젝트 유형에 맞는 `.gitignore`를 자동 생성할 수 있습니다.

#### Q5. Windows에서 Git Bash와 PowerShell 중 뭘 써야 하나요?

| 상황 | 추천 |
|------|------|
| 웹 개발 튜토리얼 따라할 때 | Git Bash (Linux 명령어 호환) |
| Windows 시스템 관리 | PowerShell |
| 바이브코딩 도구 사용 | 둘 다 가능 (도구 문서 확인) |
| 팀 프로젝트 | 팀 표준에 맞춤 |

#### Q6. VS Code 터미널에서 PowerShell과 Bash를 전환할 수 있나요?

네, 가능합니다. 터미널 패널 우측 상단의 `+` 옆 드롭다운에서 원하는 셸을 선택하세요. 기본 셸 변경은 `Ctrl+Shift+P` → `Terminal: Select Default Profile`에서 설정합니다.

#### Q7. 디버깅할 때 console.log보다 디버거가 나은 이유는?

| 비교 | console.log | 디버거 |
|------|-------------|--------|
| 코드 수정 | 필요 (코드에 추가) | 불필요 (중단점만 설정) |
| 실시간 변수 확인 | 불가 (출력된 것만 확인) | 가능 (모든 변수 확인) |
| 실행 흐름 추적 | 어려움 | Step Into/Over로 추적 |
| 조건부 확인 | 코드로 if문 추가 필요 | 조건부 중단점 설정 |
| 정리 | 디버깅 후 삭제 필요 | 중단점만 해제 |

#### Q8. Oh My Zsh는 뭔가요? 꼭 필요한가요?

Oh My Zsh는 Zsh 셸의 플러그인/테마 관리 프레임워크입니다. 필수는 아니지만, 설치하면 자동완성, 구문 강조, Git 브랜치 표시 등 터미널 사용이 훨씬 편리해집니다. macOS는 기본 셸이 Zsh이므로 바로 사용할 수 있고, Linux에서는 Zsh를 먼저 설치해야 합니다. Windows에서는 WSL(Windows Subsystem for Linux)을 통해 사용할 수 있습니다.

---

## 13. 다음 단계

### 이 교안을 마치셨다면

중급 과정을 완료하셨습니다. 다음 학습 경로를 참고하세요.

```
중급 과정 완료!
    │
    ├── 개발자편 교안으로 진행
    │   ├── 쉘 스크립팅 & 자동화
    │   ├── CI/CD 파이프라인
    │   ├── Docker & 컨테이너
    │   └── 고급 Git (rebase, cherry-pick, bisect)
    │
    ├── 바이브코딩 도구 심화
    │   ├── Cursor 개발자편 → Agent Mode, MCP
    │   ├── Claude Code 개발자편 → CLI 에이전트 워크플로우
    │   └── 안티그래비티 개발자편 → 에이전트 위임 개발
    │
    └── 실전 프로젝트
        ├── 팀 프로젝트에서 Git Flow 적용
        ├── 오픈소스 프로젝트 기여 (Issue → Fork → PR)
        └── 개인 프로젝트를 GitHub Pages/Vercel에 배포
```

### 바이브코딩 도구 심화 교안

| 도구 | 교안 | 내용 |
|------|------|------|
| **Cursor** | [Cursor 개발자편](cursor-developer.html) | Agent Mode, MCP |
| **Claude Code** | [Claude Code 개발자편](claude-code-developer.html) | CLI 에이전트 워크플로우 |

### 추천 학습 자료

| 자료 | 설명 | 링크 |
|------|------|------|
| **Pro Git (한국어)** | Git 완전 가이드 무료 도서 | [git-scm.com/book/ko/v2](https://git-scm.com/book/ko/v2) |
| **VS Code 공식 문서** | 확장, 디버깅, 단축키 전체 가이드 | [code.visualstudio.com/docs](https://code.visualstudio.com/docs) |
| **The Missing Semester** | MIT 개발 도구 강의 (영문) | [missing.csail.mit.edu](https://missing.csail.mit.edu/) |
| **Bash 가이드** | GNU Bash 레퍼런스 매뉴얼 | [gnu.org/software/bash](https://www.gnu.org/software/bash/manual/) |
| **PowerShell 학습 경로** | Microsoft 공식 학습 경로 | [learn.microsoft.com](https://learn.microsoft.com/ko-kr/training/paths/powershell/) |

---

## 출처

### 참고 자료

| 출처 | 설명 |
|------|------|
| [VS Code 공식 문서](https://code.visualstudio.com/docs) | Microsoft Visual Studio Code 문서 |
| [Pro Git Book](https://git-scm.com/book/ko/v2) | Scott Chacon, Ben Straub 저, 한국어판 |
| [PowerShell 공식 문서](https://learn.microsoft.com/ko-kr/powershell/) | Microsoft PowerShell 레퍼런스 |
| [GNU Bash Manual](https://www.gnu.org/software/bash/manual/) | GNU Bash 공식 매뉴얼 |
| [Oh My Zsh](https://ohmyz.sh/) | Zsh 프레임워크 |
| [Node.js 공식 문서](https://nodejs.org/docs/latest/api/) | Node.js API 레퍼런스 |
| [gitignore.io](https://www.toptal.com/developers/gitignore) | .gitignore 생성기 |
| 기획 도우미 Gem (peace 제작/공유) | [Gem 바로가기](https://gemini.google.com/gem/1yC701ZmuJgy_D4hkyNz0t50EqAnBj3kh) |
