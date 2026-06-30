# 배포 가이드 개발자편: 프로덕션 배포와 인프라

> **과정명**: 프로덕션 배포와 인프라
> **대상**: 프로덕션 환경 배포와 인프라 관리에 관심 있는 개발자
> **목표**: Docker 배포, 클라우드 인프라, IaC, 무중단 배포 전략을 익힌다
> **소요**: 약 5~6시간

---

## 어떤 교안을 봐야 할까요? (자가 진단)

이 교안은 **배포 경험이 있거나 인프라에 관심 있는 개발자**를 대상으로 합니다.

| 항목 | 필요 수준 |
|------|----------|
| 코딩 경험 | **필수** — 1개 이상 언어로 프로젝트 경험 |
| 터미널 사용 | **필수** — cd, ls, ssh, curl 등 기본 명령어 숙지 |
| Git/GitHub | **필수** — 커밋, 브랜치, PR, GitHub Actions 기초 |
| Docker 기초 | **권장** — docker run, docker build 경험 |
| 네트워크 기초 | **권장** — IP, 포트, DNS, HTTP/HTTPS 개념 |
| Linux 서버 | **권장** — 기본적인 서버 접속 및 관리 경험 |

> 위 항목 중 코딩 경험과 터미널 사용이 해당하지 않는다면, **배포 가이드 초보자편**으로 먼저 시작하세요.
> Docker가 처음이라면 **개발 인터페이스 개발자편**의 Docker 섹션을 먼저 학습하세요.

---

### 추천 리소스

| 리소스 | 설명 | 링크 |
|--------|------|------|
| **Docker 공식 문서** | 컨테이너 빌드 및 배포 가이드 | [docs.docker.com](https://docs.docker.com/) |
| **Kubernetes 공식 문서** | 쿠버네티스 개념 및 튜토리얼 | [kubernetes.io/docs](https://kubernetes.io/ko/docs/home/) |
| **Terraform 공식 문서** | HCL 문법 및 프로바이더 레퍼런스 | [developer.hashicorp.com/terraform](https://developer.hashicorp.com/terraform/docs) |
| **AWS Well-Architected** | 클라우드 아키텍처 모범 사례 | [aws.amazon.com/architecture](https://aws.amazon.com/architecture/well-architected/) |
| **The Twelve-Factor App** | SaaS 앱 개발 원칙 | [12factor.net](https://12factor.net/ko/) |
| **CNCF Landscape** | 클라우드 네이티브 생태계 지도 | [landscape.cncf.io](https://landscape.cncf.io/) |

---

## 목차

1. [프로덕션 아키텍처](#1-프로덕션-아키텍처)
2. [Docker 프로덕션 배포](#2-docker-프로덕션-배포)
3. [클라우드 플랫폼 비교와 활용](#3-클라우드-플랫폼-비교와-활용)
4. [IaC — Infrastructure as Code](#4-iac--infrastructure-as-code)
5. [쿠버네티스 입문](#5-쿠버네티스-입문)
6. [CI/CD 파이프라인 고급](#6-cicd-파이프라인-고급)
7. [무중단 배포 전략](#7-무중단-배포-전략)
8. [모니터링과 로깅](#8-모니터링과-로깅)
9. [보안과 시크릿 관리](#9-보안과-시크릿-관리)
10. [종합 프로젝트 — 프로덕션 배포 파이프라인 구축](#10-종합-프로젝트--프로덕션-배포-파이프라인-구축)
11. [프로덕션 백엔드와 풀스택 배포 (Supabase · Next.js · GitHub Actions)](#11-프로덕션-백엔드와-풀스택-배포-supabase--nextjs--github-actions)

---

## 1. 프로덕션 아키텍처

### 학습 목표

- 프로덕션 환경의 핵심 구성 요소(로드 밸런서, CDN, 오토 스케일링)를 이해한다
- 모놀리식과 마이크로서비스 아키텍처의 장단점을 비교한다
- 고가용성(HA) 아키텍처를 설계할 수 있다
- 프로덕션 인프라를 텍스트 다이어그램으로 표현할 수 있다

### 상세 설명

#### 1.1 프로덕션 환경이란?

개발 환경(Development)에서 작동하는 코드가 프로덕션(Production)에서 반드시 잘 동작하지는 않습니다. 프로덕션 환경은 실제 사용자가 접속하는 환경이며, 다음 요소들이 추가로 필요합니다.

| 요소 | 개발 환경 | 프로덕션 환경 |
|------|----------|-------------|
| 트래픽 | 개발자 1명 | 수백~수백만 사용자 |
| 가용성 | 중단 허용 | 99.9% 이상 업타임 |
| 보안 | 로컬 방화벽 | TLS, WAF, 네트워크 격리 |
| 데이터 | 테스트 데이터 | 실제 사용자 데이터 (백업 필수) |
| 로깅 | console.log | 구조화된 로깅 + 모니터링 |
| 배포 | 수동 (npm start) | 자동화된 CI/CD 파이프라인 |

#### 1.2 핵심 구성 요소

**로드 밸런서 (Load Balancer)**

로드 밸런서는 들어오는 트래픽을 여러 서버에 분산시킵니다. 단일 서버 장애 시에도 서비스를 유지할 수 있는 핵심 컴포넌트입니다.

```
                        ┌──────────────┐
                        │   사용자들    │
                        └──────┬───────┘
                               │
                        ┌──────▼───────┐
                        │  로드 밸런서  │
                        │  (L4/L7)     │
                        └──┬───┬───┬───┘
                           │   │   │
                    ┌──────┘   │   └──────┐
                    ▼          ▼          ▼
              ┌──────────┐ ┌──────────┐ ┌──────────┐
              │ Server 1 │ │ Server 2 │ │ Server 3 │
              │ (Active) │ │ (Active) │ │ (Active) │
              └──────────┘ └──────────┘ └──────────┘
```

로드 밸런싱 알고리즘 비교:

| 알고리즘 | 설명 | 적합한 경우 |
|---------|------|-----------|
| Round Robin | 순서대로 분배 | 서버 성능이 동일할 때 |
| Weighted Round Robin | 가중치 기반 분배 | 서버 성능이 다를 때 |
| Least Connections | 연결 수 적은 서버로 | 요청 처리 시간이 다양할 때 |
| IP Hash | 클라이언트 IP 기반 | 세션 유지가 필요할 때 |
| Least Response Time | 응답 속도 빠른 서버로 | 지연시간이 중요할 때 |

Nginx 로드 밸런서 설정 예시:

```nginx
# /etc/nginx/conf.d/loadbalancer.conf

upstream app_servers {
    # Least Connections 알고리즘
    least_conn;

    server 10.0.1.10:3000 weight=3;   # 고성능 서버
    server 10.0.1.11:3000 weight=2;   # 중간 성능
    server 10.0.1.12:3000 weight=1;   # 저성능 서버

    # 헬스체크 — 3번 실패 시 30초간 제외
    server 10.0.1.13:3000 max_fails=3 fail_timeout=30s;

    # 백업 서버 — 다른 서버 모두 실패 시 사용
    server 10.0.1.99:3000 backup;
}

server {
    listen 80;
    server_name myapp.example.com;

    # HTTPS 리다이렉트
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name myapp.example.com;

    ssl_certificate     /etc/ssl/certs/myapp.crt;
    ssl_certificate_key /etc/ssl/private/myapp.key;

    location / {
        proxy_pass http://app_servers;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # 타임아웃 설정
        proxy_connect_timeout 5s;
        proxy_read_timeout 60s;
        proxy_send_timeout 60s;
    }

    # 헬스체크 엔드포인트
    location /health {
        proxy_pass http://app_servers;
        access_log off;
    }
}
```

**CDN (Content Delivery Network)**

CDN은 정적 파일(이미지, CSS, JS)을 사용자와 가까운 엣지 서버에서 제공하여 응답 속도를 높입니다.

```
        한국 사용자 ──→ 서울 엣지 서버 (캐시 HIT → 즉시 응답)
                                        │
        미국 사용자 ──→ 버지니아 엣지   │ (캐시 MISS → 오리진 요청)
                                        │
                              ┌─────────▼──────────┐
                              │   오리진 서버       │
                              │   (S3 / 앱 서버)   │
                              └────────────────────┘
```

주요 CDN 서비스 비교:

| 서비스 | 무료 티어 | 특징 |
|--------|----------|------|
| Cloudflare | 무제한 대역폭 | DDoS 방어 포함, 가장 많이 사용 |
| AWS CloudFront | 1TB/월 (12개월) | S3 연동 우수, Lambda@Edge |
| Google Cloud CDN | 없음 | GCP 통합, Cloud Armor |
| Vercel Edge Network | 100GB/월 | Next.js 최적화, 자동 설정 |

**오토 스케일링 (Auto Scaling)**

트래픽에 따라 서버 수를 자동으로 조절합니다.

```
트래픽 변화와 서버 수 (시간축)

서버 수
  6 │                    ╭───╮
  5 │                 ╭──╯   ╰──╮
  4 │              ╭──╯         ╰──╮
  3 │           ╭──╯               ╰──╮
  2 │  ╭────────╯                      ╰────────╮
  1 │──╯                                        ╰──
    └────────────────────────────────────────────────
    00:00  06:00  09:00  12:00  15:00  18:00  24:00
          (새벽)  (출근)  (점심)  (오후)  (퇴근)  (새벽)
```

AWS Auto Scaling 정책 예시:

```json
{
  "AutoScalingGroupName": "my-app-asg",
  "MinSize": 2,
  "MaxSize": 10,
  "DesiredCapacity": 3,
  "TargetTrackingConfiguration": {
    "TargetValue": 70.0,
    "PredefinedMetricSpecification": {
      "PredefinedMetricType": "ASGAverageCPUUtilization"
    },
    "ScaleOutCooldown": 120,
    "ScaleInCooldown": 300
  }
}
```

#### 1.3 모놀리식 vs 마이크로서비스

**모놀리식 아키텍처**

```
┌─────────────────────────────────────┐
│           모놀리식 애플리케이션        │
│                                     │
│  ┌──────────┐  ┌──────────┐        │
│  │ 사용자    │  │ 상품     │        │
│  │ 모듈     │  │ 모듈     │        │
│  ├──────────┤  ├──────────┤        │
│  │ 주문     │  │ 결제     │        │
│  │ 모듈     │  │ 모듈     │        │
│  └──────────┘  └──────────┘        │
│                                     │
│        ┌──────────────┐            │
│        │  공유 DB      │            │
│        └──────────────┘            │
└─────────────────────────────────────┘
```

**마이크로서비스 아키텍처**

```
┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐
│ 사용자     │  │ 상품      │  │ 주문      │  │ 결제      │
│ 서비스    │  │ 서비스    │  │ 서비스    │  │ 서비스    │
│           │  │           │  │           │  │           │
│  ┌─────┐  │  │  ┌─────┐  │  │  ┌─────┐  │  │  ┌─────┐  │
│  │ DB  │  │  │  │ DB  │  │  │  │ DB  │  │  │  │ DB  │  │
│  └─────┘  │  │  └─────┘  │  │  └─────┘  │  │  └─────┘  │
└─────┬─────┘  └─────┬─────┘  └─────┬─────┘  └─────┬─────┘
      │              │              │              │
      └──────────────┴──────┬───────┴──────────────┘
                            │
                     ┌──────▼──────┐
                     │ API Gateway │
                     │ / 메시지 큐  │
                     └─────────────┘
```

비교표:

| 항목 | 모놀리식 | 마이크로서비스 |
|------|---------|-------------|
| 복잡도 | 낮음 (단일 코드베이스) | 높음 (분산 시스템) |
| 배포 | 전체 배포 | 서비스별 독립 배포 |
| 확장 | 전체 스케일링 | 서비스별 스케일링 |
| 기술 스택 | 단일 | 서비스별 다른 기술 가능 |
| 팀 구조 | 작은 팀 적합 | 팀별 서비스 소유 |
| 장애 범위 | 전체 영향 | 해당 서비스만 영향 |
| 초기 비용 | 낮음 | 높음 (인프라, 모니터링) |
| 추천 시점 | MVP, 소규모 | 대규모, 팀 분리 필요 시 |

> **실무 조언**: 처음부터 마이크로서비스로 시작하지 마세요. 모놀리식으로 시작하여 서비스 경계를 파악한 후 점진적으로 분리하는 것이 현실적입니다.

#### 1.4 프로덕션 인프라 전체 아키텍처

```
┌─────────────────────────────────────────────────────────────────────┐
│                        프로덕션 인프라 전체 구조                       │
│                                                                     │
│  사용자 → DNS(Route53) → CDN(CloudFront) → WAF                    │
│                                              │                      │
│                                    ┌─────────▼──────────┐          │
│                                    │   ALB (로드밸런서)   │          │
│                                    └────┬────┬────┬─────┘          │
│                                         │    │    │                 │
│                          ┌──────────────┘    │    └──────────┐     │
│                          ▼                   ▼               ▼     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    ECS / Kubernetes Cluster                  │   │
│  │                                                             │   │
│  │  ┌─────────┐    ┌─────────┐    ┌─────────┐                │   │
│  │  │ Task 1  │    │ Task 2  │    │ Task 3  │   Auto Scaling │   │
│  │  │ (App)   │    │ (App)   │    │ (App)   │                │   │
│  │  └─────────┘    └─────────┘    └─────────┘                │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                          │                                         │
│              ┌───────────┴───────────┐                             │
│              ▼                       ▼                             │
│     ┌──────────────┐      ┌──────────────┐                        │
│     │ RDS (Primary)│──────│ RDS (Replica)│                        │
│     └──────────────┘      └──────────────┘                        │
│              │                                                     │
│     ┌────────┴────────┐                                           │
│     ▼                 ▼                                           │
│  ┌────────┐    ┌───────────┐    ┌──────────────┐                  │
│  │ Redis  │    │ S3 Bucket │    │ CloudWatch   │                  │
│  │ Cache  │    │ (Storage) │    │ (Monitoring) │                  │
│  └────────┘    └───────────┘    └──────────────┘                  │
└─────────────────────────────────────────────────────────────────────┘
```

### 실습: 아키텍처 문서 작성

자신의 프로젝트(또는 가상 프로젝트)를 위한 아키텍처 문서를 작성해 보세요.

```markdown
# 프로젝트명: 온라인 쇼핑몰

## 요구 사항
- 동시 사용자: 최대 10,000명
- 가용성: 99.9% (연간 다운타임 8.76시간 이내)
- 응답 시간: P95 < 500ms
- 데이터 백업: 일 1회, 7일 보존

## 아키텍처 결정 사항
- [ ] 모놀리식 vs 마이크로서비스: ____________
- [ ] 로드밸런서 종류: ____________
- [ ] CDN 사용 여부: ____________
- [ ] 오토 스케일링 정책: ____________
- [ ] 데이터베이스 구성: ____________
```

### 체크포인트

- [ ] 로드 밸런서의 역할과 주요 알고리즘 3가지를 설명할 수 있다
- [ ] CDN의 동작 원리(캐시 HIT/MISS)를 이해한다
- [ ] 오토 스케일링의 Scale Out/In 개념을 설명할 수 있다
- [ ] 모놀리식과 마이크로서비스의 장단점을 비교할 수 있다
- [ ] 프로덕션 인프라의 전체 흐름(DNS → CDN → LB → App → DB)을 그릴 수 있다

---

## 2. Docker 프로덕션 배포

### 학습 목표

- 멀티스테이지 빌드를 사용하여 최적화된 프로덕션 이미지를 만든다
- Docker Compose로 프로덕션 환경을 구성한다
- 컨테이너 레지스트리(Docker Hub, GHCR)에 이미지를 배포한다
- 컨테이너 보안 모범 사례를 적용한다

### 상세 설명

#### 2.1 멀티스테이지 Dockerfile

멀티스테이지 빌드는 빌드 환경과 실행 환경을 분리하여 최종 이미지 크기를 최소화합니다.

**Node.js 앱 — 기본 vs 멀티스테이지 비교**

나쁜 예 (단일 스테이지):

```dockerfile
# 나쁜 예 — 이미지 크기 ~1.2GB
FROM node:20
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["node", "dist/server.js"]
# 문제: devDependencies, 소스코드, 빌드 도구가 모두 포함됨
```

좋은 예 (멀티스테이지):

```dockerfile
# ──────────────────────────────────────
# Stage 1: 의존성 설치 (Dependencies)
# ──────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app

# package.json만 먼저 복사 → 캐시 레이어 활용
COPY package.json package-lock.json ./
RUN npm ci --only=production

# ──────────────────────────────────────
# Stage 2: 빌드 (Build)
# ──────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ──────────────────────────────────────
# Stage 3: 실행 (Production)
# ──────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

# 보안: non-root 사용자 생성
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 appuser

# 프로덕션 의존성만 복사
COPY --from=deps /app/node_modules ./node_modules

# 빌드 결과물만 복사
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

# non-root 사용자로 전환
USER appuser

# 환경 변수
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# 헬스체크
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

CMD ["node", "dist/server.js"]
```

이미지 크기 비교:

| 방식 | 베이스 이미지 | 최종 크기 |
|------|-------------|----------|
| 단일 스테이지 (node:20) | ~1.1GB | ~1.3GB |
| 멀티스테이지 (node:20-alpine) | ~130MB | ~180MB |
| distroless 사용 | ~20MB | ~80MB |

**Next.js 앱 Dockerfile**

```dockerfile
# Stage 1: Dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
    if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
    else echo "Lockfile not found." && exit 1; \
    fi

# Stage 2: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js 텔레메트리 비활성화
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Next.js standalone output 활용
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

**Python(FastAPI) 앱 Dockerfile**

```dockerfile
# Stage 1: Build
FROM python:3.12-slim AS builder
WORKDIR /app

# 가상환경 생성
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Stage 2: Production
FROM python:3.12-slim AS runner
WORKDIR /app

# 보안: non-root 사용자
RUN groupadd --system appgroup && \
    useradd --system --gid appgroup appuser

# 가상환경만 복사
COPY --from=builder /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

COPY . .

USER appuser

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')" || exit 1

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]
```

#### 2.2 Docker Compose 프로덕션 구성

개발용 Compose와 프로덕션용 Compose를 분리합니다.

```yaml
# docker-compose.yml (기본 — 공통 설정)
version: "3.9"

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    environment:
      - NODE_ENV=production
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER} -d ${DB_NAME}"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
```

```yaml
# docker-compose.prod.yml (프로덕션 오버라이드)
version: "3.9"

services:
  app:
    restart: always
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: "1.0"
          memory: 512M
        reservations:
          cpus: "0.25"
          memory: 128M
      update_config:
        parallelism: 1
        delay: 10s
        order: start-first
    ports:
      - "3000:3000"
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  db:
    restart: always
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups:/backups
    deploy:
      resources:
        limits:
          cpus: "2.0"
          memory: 1G

  redis:
    restart: always
    command: redis-server --requirepass ${REDIS_PASSWORD} --maxmemory 256mb --maxmemory-policy allkeys-lru
    volumes:
      - redis_data:/data

  nginx:
    image: nginx:alpine
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/conf.d:/etc/nginx/conf.d:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
    depends_on:
      - app

volumes:
  postgres_data:
  redis_data:
```

프로덕션 실행 명령:

```bash
# 프로덕션 환경으로 실행
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# 로그 확인
docker compose -f docker-compose.yml -f docker-compose.prod.yml logs -f app

# 스케일링 (앱 인스턴스 5개로)
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --scale app=5

# 롤링 업데이트
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --no-deps app
```

#### 2.3 컨테이너 레지스트리

빌드한 이미지를 레지스트리에 푸시하여 어디서든 배포할 수 있게 합니다.

**Docker Hub**

```bash
# 로그인
docker login

# 이미지 태깅 (시맨틱 버전 + latest)
docker build -t myapp:latest .
docker tag myapp:latest myuser/myapp:1.2.3
docker tag myapp:latest myuser/myapp:latest

# 푸시
docker push myuser/myapp:1.2.3
docker push myuser/myapp:latest
```

**GitHub Container Registry (GHCR)**

```bash
# GitHub Personal Access Token으로 로그인
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin

# 이미지 태깅
docker tag myapp:latest ghcr.io/myuser/myapp:1.2.3

# 푸시
docker push ghcr.io/myuser/myapp:1.2.3
```

GitHub Actions로 자동 빌드 & 푸시:

```yaml
# .github/workflows/docker-publish.yml
name: Docker Build & Push

on:
  push:
    tags: ["v*.*.*"]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to GHCR
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}
            type=sha

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

#### 2.4 컨테이너 보안 모범 사례

```dockerfile
# 보안 체크리스트를 적용한 Dockerfile 예시

# 1. 최소 베이스 이미지 사용
FROM node:20-alpine

# 2. 패키지 업데이트 및 불필요 도구 제거
RUN apk update && apk upgrade && \
    apk add --no-cache dumb-init && \
    rm -rf /var/cache/apk/*

# 3. non-root 사용자 사용
RUN addgroup --system --gid 1001 appgroup && \
    adduser --system --uid 1001 --ingroup appgroup appuser

WORKDIR /app

# 4. 의존성만 먼저 설치 (캐시 최적화)
COPY --chown=appuser:appgroup package*.json ./
RUN npm ci --only=production && npm cache clean --force

# 5. 소스 코드 복사 (불필요 파일 .dockerignore로 제외)
COPY --chown=appuser:appgroup . .

# 6. 파일 권한 최소화
RUN chmod -R 550 /app

# 7. non-root로 전환
USER appuser

# 8. 시그널 처리를 위한 init 시스템
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]
```

`.dockerignore` 파일:

```
# .dockerignore
node_modules
npm-debug.log*
.git
.gitignore
.env
.env.*
Dockerfile
docker-compose*.yml
README.md
.vscode
.idea
coverage
tests
__tests__
*.test.js
*.spec.js
```

### 실습: 프로덕션 Docker 환경 구성

1. 자신의 프로젝트에 멀티스테이지 Dockerfile을 작성하세요.
2. Docker Compose로 앱 + DB + Redis + Nginx 구성을 만드세요.
3. GHCR에 이미지를 푸시하고 다른 머신에서 pull하여 실행해 보세요.

```bash
# 실습 순서

# 1. 프로젝트 디렉토리 생성
mkdir my-production-app && cd my-production-app

# 2. Dockerfile 작성 (위의 멀티스테이지 템플릿 활용)
vim Dockerfile

# 3. .dockerignore 작성
vim .dockerignore

# 4. 빌드 및 크기 확인
docker build -t my-app:v1 .
docker images my-app

# 5. 로컬 실행 테스트
docker run -p 3000:3000 --rm my-app:v1

# 6. Compose로 전체 스택 실행
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# 7. 헬스체크 확인
docker compose ps
curl http://localhost:3000/health
```

### 체크포인트

- [ ] 멀티스테이지 빌드의 장점과 구조를 설명할 수 있다
- [ ] 프로덕션용 Docker Compose 파일을 작성할 수 있다
- [ ] Docker Hub 또는 GHCR에 이미지를 푸시할 수 있다
- [ ] 컨테이너 보안 모범 사례 5가지를 나열할 수 있다
- [ ] GitHub Actions로 이미지 자동 빌드 파이프라인을 구성할 수 있다

---

## 3. 클라우드 플랫폼 비교와 활용

### 학습 목표

- AWS, GCP, Azure의 핵심 서비스를 비교하고 적합한 서비스를 선택한다
- 프리 티어를 활용하여 비용 없이 인프라를 구성한다
- 서버리스(Lambda, Cloud Run)와 컨테이너(ECS, GKE) 배포를 이해한다
- 월 비용을 예측하고 최적화할 수 있다

### 상세 설명

#### 3.1 3대 클라우드 플랫폼 비교

```
┌──────────────────────────────────────────────────────────────┐
│                    클라우드 시장 점유율 (2026)                  │
│                                                              │
│  AWS    ████████████████████████████████  31%                │
│  Azure  ██████████████████████████       25%                 │
│  GCP    ███████████████                  12%                 │
│  기타   ████████████████████████████████  32%                │
└──────────────────────────────────────────────────────────────┘
```

핵심 서비스 대응표:

| 카테고리 | AWS | GCP | Azure |
|---------|-----|-----|-------|
| **컴퓨팅 (VM)** | EC2 | Compute Engine | Virtual Machines |
| **컨테이너** | ECS / EKS | Cloud Run / GKE | ACI / AKS |
| **서버리스** | Lambda | Cloud Functions | Functions |
| **오브젝트 스토리지** | S3 | Cloud Storage | Blob Storage |
| **관계형 DB** | RDS / Aurora | Cloud SQL | Azure SQL |
| **NoSQL** | DynamoDB | Firestore | Cosmos DB |
| **캐시** | ElastiCache | Memorystore | Cache for Redis |
| **CDN** | CloudFront | Cloud CDN | Azure CDN |
| **DNS** | Route 53 | Cloud DNS | Azure DNS |
| **CI/CD** | CodePipeline | Cloud Build | Azure DevOps |
| **모니터링** | CloudWatch | Cloud Monitoring | Azure Monitor |
| **IAM** | IAM | Cloud IAM | Azure AD |

#### 3.2 AWS 핵심 서비스

**EC2 (Elastic Compute Cloud) — 가상 서버**

```bash
# AWS CLI로 EC2 인스턴스 생성
aws ec2 run-instances \
    --image-id ami-0c55b159cbfafe1f0 \
    --instance-type t3.micro \
    --key-name my-key-pair \
    --security-group-ids sg-0123456789abcdef0 \
    --subnet-id subnet-0123456789abcdef0 \
    --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=my-app-server}]' \
    --user-data file://init-script.sh

# init-script.sh — 서버 초기화 스크립트
#!/bin/bash
yum update -y
yum install -y docker
systemctl start docker
systemctl enable docker
docker pull ghcr.io/myuser/myapp:latest
docker run -d -p 80:3000 --restart=always ghcr.io/myuser/myapp:latest
```

EC2 인스턴스 타입 선택 가이드:

| 타입 | 용도 | vCPU | 메모리 | 월 비용 (서울) |
|------|------|------|--------|-------------|
| t3.micro | 테스트/개발 | 2 | 1GB | ~$11 |
| t3.small | 소규모 앱 | 2 | 2GB | ~$22 |
| t3.medium | 중규모 앱 | 2 | 4GB | ~$44 |
| m6i.large | 범용 | 2 | 8GB | ~$100 |
| c6i.large | CPU 집약 | 2 | 4GB | ~$89 |
| r6i.large | 메모리 집약 | 2 | 16GB | ~$132 |

**S3 (Simple Storage Service) — 오브젝트 스토리지**

```bash
# 버킷 생성
aws s3 mb s3://my-app-assets-2026 --region ap-northeast-2

# 정적 파일 업로드 (캐시 헤더 포함)
aws s3 sync ./dist s3://my-app-assets-2026/static \
    --cache-control "max-age=31536000,immutable" \
    --exclude "*.html"

# HTML 파일은 캐시 짧게
aws s3 sync ./dist s3://my-app-assets-2026 \
    --include "*.html" \
    --cache-control "max-age=60,must-revalidate"

# 정적 웹사이트 호스팅 설정
aws s3 website s3://my-app-assets-2026 \
    --index-document index.html \
    --error-document error.html
```

**Lambda — 서버리스 함수**

```javascript
// lambda/handler.js — API 핸들러 예시
export const handler = async (event) => {
    const { httpMethod, path, body, queryStringParameters } = event;

    try {
        switch (`${httpMethod} ${path}`) {
            case "GET /api/health":
                return response(200, { status: "healthy", timestamp: new Date().toISOString() });

            case "GET /api/items":
                const items = await getItemsFromDB(queryStringParameters);
                return response(200, items);

            case "POST /api/items":
                const newItem = JSON.parse(body);
                const created = await createItem(newItem);
                return response(201, created);

            default:
                return response(404, { error: "Not Found" });
        }
    } catch (error) {
        console.error("Error:", error);
        return response(500, { error: "Internal Server Error" });
    }
};

function response(statusCode, body) {
    return {
        statusCode,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(body),
    };
}
```

```yaml
# serverless.yml (Serverless Framework)
service: my-api

provider:
  name: aws
  runtime: nodejs20.x
  region: ap-northeast-2
  memorySize: 256
  timeout: 30
  environment:
    DB_HOST: ${env:DB_HOST}
    DB_NAME: ${env:DB_NAME}

functions:
  api:
    handler: handler.handler
    events:
      - httpApi:
          method: "*"
          path: /api/{proxy+}
    reservedConcurrency: 100
```

**ECS (Elastic Container Service) — 컨테이너 오케스트레이션**

```json
// ecs-task-definition.json
{
  "family": "my-app",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::123456789:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "app",
      "image": "ghcr.io/myuser/myapp:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        { "name": "NODE_ENV", "value": "production" }
      ],
      "secrets": [
        {
          "name": "DB_PASSWORD",
          "valueFrom": "arn:aws:ssm:ap-northeast-2:123456789:parameter/myapp/db-password"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/my-app",
          "awslogs-region": "ap-northeast-2",
          "awslogs-stream-prefix": "app"
        }
      },
      "healthCheck": {
        "command": ["CMD-SHELL", "wget -qO- http://localhost:3000/health || exit 1"],
        "interval": 30,
        "timeout": 5,
        "retries": 3,
        "startPeriod": 60
      }
    }
  ]
}
```

#### 3.3 GCP 핵심 서비스

**Cloud Run — 서버리스 컨테이너**

Cloud Run은 Docker 이미지만 있으면 자동으로 스케일링되는 서버리스 컨테이너 플랫폼입니다. 트래픽이 없으면 0으로 스케일 다운됩니다.

```bash
# Cloud Run 배포 (가장 간단한 방법)
gcloud run deploy my-app \
    --image ghcr.io/myuser/myapp:latest \
    --region asia-northeast3 \
    --platform managed \
    --port 3000 \
    --memory 512Mi \
    --cpu 1 \
    --min-instances 0 \
    --max-instances 10 \
    --concurrency 80 \
    --timeout 300 \
    --set-env-vars "NODE_ENV=production" \
    --set-secrets "DB_PASSWORD=db-password:latest" \
    --allow-unauthenticated
```

```yaml
# cloud-run-service.yaml (선언적 배포)
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: my-app
  annotations:
    run.googleapis.com/ingress: all
spec:
  template:
    metadata:
      annotations:
        autoscaling.knative.dev/minScale: "0"
        autoscaling.knative.dev/maxScale: "10"
        run.googleapis.com/cpu-throttling: "false"
    spec:
      containerConcurrency: 80
      timeoutSeconds: 300
      containers:
        - image: ghcr.io/myuser/myapp:latest
          ports:
            - containerPort: 3000
          resources:
            limits:
              cpu: "1"
              memory: 512Mi
          env:
            - name: NODE_ENV
              value: production
          startupProbe:
            httpGet:
              path: /health
              port: 3000
            initialDelaySeconds: 5
            periodSeconds: 10
```

#### 3.4 프리 티어 비교

| 서비스 | AWS 프리 티어 | GCP 프리 티어 | Azure 프리 티어 |
|--------|-------------|-------------|---------------|
| **가상 서버** | t2.micro 750시간/월 (12개월) | e2-micro 1개 (상시) | B1s 750시간/월 (12개월) |
| **서버리스** | Lambda 100만 요청/월 (상시) | Cloud Functions 200만 요청/월 | Functions 100만 요청/월 |
| **오브젝트 스토리지** | S3 5GB (12개월) | Cloud Storage 5GB (상시) | Blob 5GB (12개월) |
| **관계형 DB** | RDS 750시간/월 (12개월) | Cloud SQL 없음 | SQL DB 250GB (12개월) |
| **NoSQL** | DynamoDB 25GB (상시) | Firestore 1GB (상시) | Cosmos DB 1000 RU/s (상시) |
| **CDN** | CloudFront 1TB/월 (12개월) | 없음 | 없음 |
| **컨테이너** | 없음 | Cloud Run 200만 요청/월 (상시) | ACI 없음 |

> **비용 절약 팁**: 학습 목적이라면 GCP Cloud Run(상시 무료)과 AWS Lambda(상시 무료)를 적극 활용하세요.

#### 3.5 월 비용 예측

소규모 웹 서비스(일 1,000명 방문) 기준 월 비용 예측:

| 구성 | AWS | GCP | Azure |
|------|-----|-----|-------|
| 서버 (t3.small / e2-small) | ~$22 | ~$18 | ~$20 |
| DB (RDS / Cloud SQL) | ~$30 | ~$25 | ~$28 |
| 스토리지 (20GB) | ~$0.5 | ~$0.4 | ~$0.5 |
| CDN (100GB 전송) | ~$8.5 | ~$8 | ~$8 |
| **합계** | **~$61** | **~$51** | **~$57** |

서버리스 구성 (같은 트래픽):

| 구성 | AWS | GCP |
|------|-----|-----|
| 함수 (Lambda / Cloud Run) | ~$0 (프리 티어) | ~$0 (프리 티어) |
| DB (DynamoDB / Firestore) | ~$1 | ~$0 (프리 티어) |
| S3/Storage | ~$0.5 | ~$0.2 |
| CloudFront/CDN | ~$8.5 | $0 |
| **합계** | **~$10** | **~$0.2** |

> **핵심**: 소규모 프로젝트에서는 서버리스 구성이 압도적으로 저렴합니다.

### 실습: 클라우드 배포 체험

```bash
# 실습 A: GCP Cloud Run에 배포 (무료)

# 1. gcloud CLI 설치 및 로그인
gcloud auth login
gcloud config set project my-project-id

# 2. Dockerfile 빌드 & 배포
gcloud run deploy my-app \
    --source . \
    --region asia-northeast3 \
    --allow-unauthenticated

# 3. 배포 확인
gcloud run services describe my-app --region asia-northeast3

# 4. 로그 확인
gcloud run logs read my-app --region asia-northeast3 --limit 50
```

```bash
# 실습 B: AWS Lambda + API Gateway (무료 티어)

# 1. Serverless Framework 설치
npm install -g serverless

# 2. 프로젝트 생성
serverless create --template aws-nodejs --path my-api
cd my-api

# 3. 배포
serverless deploy --stage prod --region ap-northeast-2

# 4. 테스트
curl https://xxxxxxxxxx.execute-api.ap-northeast-2.amazonaws.com/prod/api/health
```

### 체크포인트

- [ ] AWS, GCP, Azure의 핵심 서비스를 각각 3개 이상 말할 수 있다
- [ ] EC2 vs Lambda vs ECS의 차이를 설명할 수 있다
- [ ] Cloud Run에 Docker 이미지를 배포할 수 있다
- [ ] 프리 티어를 활용한 비용 절약 전략을 설명할 수 있다
- [ ] 프로젝트 규모에 따른 클라우드 비용을 대략 예측할 수 있다

---

## 4. IaC — Infrastructure as Code

### 학습 목표

- IaC의 개념과 필요성을 이해한다
- Terraform의 HCL 문법(provider, resource, variable, output)을 익힌다
- Terraform으로 실제 인프라를 선언적으로 관리한다
- Pulumi와 Terraform의 차이를 이해한다
- 인프라 변경 사항을 코드 리뷰하고 버전 관리한다

### 상세 설명

#### 4.1 IaC란 무엇인가?

IaC는 인프라(서버, 네트워크, DB 등)를 코드로 정의하고 관리하는 방식입니다.

**수동 관리 vs IaC 비교**

```
수동 관리:
  1. AWS 콘솔 로그인
  2. EC2 → 인스턴스 시작 클릭
  3. 설정값 수동 입력
  4. 보안 그룹 설정
  5. ... (반복)

  문제점:
  - 재현 불가 ("그때 어떻게 했더라?")
  - 실수 가능 ("잘못된 포트를 열었다")
  - 버전 관리 불가 ("누가 언제 바꿨지?")
  - 환경 차이 ("스테이징과 프로덕션이 다르다")

IaC (Terraform):
  1. main.tf 파일 작성
  2. terraform plan → 변경 사항 미리 확인
  3. terraform apply → 자동 생성
  4. git commit → 변경 이력 추적

  장점:
  - 재현 가능 (같은 코드 → 같은 인프라)
  - 코드 리뷰 (PR로 인프라 변경 검토)
  - 버전 관리 (git log로 변경 이력)
  - 환경 일관성 (dev/staging/prod 동일 코드)
```

IaC 도구 비교:

| 도구 | 언어 | 방식 | 클라우드 | 특징 |
|------|------|------|---------|------|
| **Terraform** | HCL | 선언적 | 멀티 클라우드 | 가장 많이 사용 |
| **Pulumi** | TypeScript/Python/Go | 명령적 + 선언적 | 멀티 클라우드 | 프로그래밍 언어 사용 |
| **CloudFormation** | YAML/JSON | 선언적 | AWS 전용 | AWS 네이티브 |
| **CDK** | TypeScript/Python | 명령적 | AWS 전용 | CloudFormation 생성 |
| **Ansible** | YAML | 명령적 | 멀티 | 서버 설정에 강점 |

#### 4.2 Terraform 기초

**설치 및 초기화**

```bash
# macOS
brew tap hashicorp/tap
brew install hashicorp/tap/terraform

# Linux
wget https://releases.hashicorp.com/terraform/1.7.0/terraform_1.7.0_linux_amd64.zip
unzip terraform_1.7.0_linux_amd64.zip
sudo mv terraform /usr/local/bin/

# Windows (Chocolatey)
choco install terraform

# 버전 확인
terraform version
```

**HCL 기본 문법**

```hcl
# main.tf — Terraform 구성 파일

# ──────────────────────────────────────
# Provider 설정 — 어떤 클라우드를 사용할지
# ──────────────────────────────────────
terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # 상태 파일을 S3에 저장 (팀 협업 시 필수)
  backend "s3" {
    bucket         = "my-terraform-state-bucket"
    key            = "prod/terraform.tfstate"
    region         = "ap-northeast-2"
    dynamodb_table = "terraform-locks"
    encrypt        = true
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Environment = var.environment
      ManagedBy   = "terraform"
      Project     = var.project_name
    }
  }
}
```

```hcl
# variables.tf — 변수 정의

variable "aws_region" {
  description = "AWS 리전"
  type        = string
  default     = "ap-northeast-2"
}

variable "environment" {
  description = "배포 환경 (dev, staging, prod)"
  type        = string
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "environment는 dev, staging, prod 중 하나여야 합니다."
  }
}

variable "project_name" {
  description = "프로젝트 이름"
  type        = string
  default     = "my-app"
}

variable "instance_type" {
  description = "EC2 인스턴스 타입"
  type        = string
  default     = "t3.micro"
}

variable "min_capacity" {
  description = "최소 인스턴스 수"
  type        = number
  default     = 2
}

variable "max_capacity" {
  description = "최대 인스턴스 수"
  type        = number
  default     = 10
}

variable "db_password" {
  description = "데이터베이스 비밀번호"
  type        = string
  sensitive   = true  # plan/apply 출력에서 마스킹
}
```

```hcl
# network.tf — VPC 및 네트워크 구성

# VPC
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "${var.project_name}-${var.environment}-vpc"
  }
}

# 퍼블릭 서브넷 (2개 AZ)
resource "aws_subnet" "public" {
  count             = 2
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.${count.index + 1}.0/24"
  availability_zone = data.aws_availability_zones.available.names[count.index]

  map_public_ip_on_launch = true

  tags = {
    Name = "${var.project_name}-public-${count.index + 1}"
    Type = "public"
  }
}

# 프라이빗 서브넷 (2개 AZ)
resource "aws_subnet" "private" {
  count             = 2
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.${count.index + 10}.0/24"
  availability_zone = data.aws_availability_zones.available.names[count.index]

  tags = {
    Name = "${var.project_name}-private-${count.index + 1}"
    Type = "private"
  }
}

# 인터넷 게이트웨이
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id
}

# NAT 게이트웨이 (프라이빗 서브넷의 외부 통신용)
resource "aws_eip" "nat" {
  domain = "vpc"
}

resource "aws_nat_gateway" "main" {
  allocation_id = aws_eip.nat.id
  subnet_id     = aws_subnet.public[0].id
}

# 라우팅 테이블
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }
}

resource "aws_route_table" "private" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.main.id
  }
}

# 가용 영역 데이터
data "aws_availability_zones" "available" {
  state = "available"
}
```

```hcl
# compute.tf — EC2 및 보안 그룹

# 보안 그룹
resource "aws_security_group" "app" {
  name_prefix = "${var.project_name}-app-"
  vpc_id      = aws_vpc.main.id

  ingress {
    description     = "HTTP from ALB"
    from_port       = 3000
    to_port         = 3000
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_security_group" "alb" {
  name_prefix = "${var.project_name}-alb-"
  vpc_id      = aws_vpc.main.id

  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTP (redirect)"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# ALB (Application Load Balancer)
resource "aws_lb" "main" {
  name               = "${var.project_name}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = aws_subnet.public[*].id

  enable_deletion_protection = var.environment == "prod" ? true : false
}

resource "aws_lb_target_group" "app" {
  name        = "${var.project_name}-tg"
  port        = 3000
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id
  target_type = "ip"

  health_check {
    path                = "/health"
    port                = "traffic-port"
    healthy_threshold   = 2
    unhealthy_threshold = 3
    timeout             = 5
    interval            = 30
    matcher             = "200"
  }
}

resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_lb.main.arn
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-TLS13-1-2-2021-06"
  certificate_arn   = var.certificate_arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.app.arn
  }
}
```

```hcl
# database.tf — RDS 구성

resource "aws_db_subnet_group" "main" {
  name       = "${var.project_name}-db-subnet"
  subnet_ids = aws_subnet.private[*].id
}

resource "aws_security_group" "db" {
  name_prefix = "${var.project_name}-db-"
  vpc_id      = aws_vpc.main.id

  ingress {
    description     = "PostgreSQL from app"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.app.id]
  }
}

resource "aws_db_instance" "main" {
  identifier     = "${var.project_name}-${var.environment}"
  engine         = "postgres"
  engine_version = "16.1"
  instance_class = var.environment == "prod" ? "db.r6g.large" : "db.t3.micro"

  allocated_storage     = 20
  max_allocated_storage = 100
  storage_encrypted     = true

  db_name  = replace(var.project_name, "-", "_")
  username = "admin"
  password = var.db_password

  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.db.id]

  multi_az            = var.environment == "prod" ? true : false
  skip_final_snapshot = var.environment != "prod"
  backup_retention_period = var.environment == "prod" ? 7 : 1

  performance_insights_enabled = var.environment == "prod"

  tags = {
    Name = "${var.project_name}-db"
  }
}
```

```hcl
# outputs.tf — 출력값 정의

output "vpc_id" {
  description = "VPC ID"
  value       = aws_vpc.main.id
}

output "alb_dns_name" {
  description = "ALB DNS 이름"
  value       = aws_lb.main.dns_name
}

output "db_endpoint" {
  description = "RDS 엔드포인트"
  value       = aws_db_instance.main.endpoint
  sensitive   = true
}

output "public_subnets" {
  description = "퍼블릭 서브넷 ID 목록"
  value       = aws_subnet.public[*].id
}
```

**Terraform 워크플로우**

```bash
# 1. 초기화 — 프로바이더 다운로드, 백엔드 설정
terraform init

# 2. 포맷팅 — 코드 스타일 통일
terraform fmt -recursive

# 3. 검증 — 문법 오류 확인
terraform validate

# 4. 계획 — 변경 사항 미리 확인 (실제 변경 없음)
terraform plan -var-file="prod.tfvars" -out=tfplan

# 출력 예시:
# Plan: 15 to add, 0 to change, 0 to destroy.

# 5. 적용 — 인프라 생성/변경
terraform apply tfplan

# 6. 상태 확인
terraform state list
terraform state show aws_db_instance.main

# 7. 삭제 (주의!)
terraform destroy -var-file="prod.tfvars"
```

환경별 변수 파일:

```hcl
# dev.tfvars
environment    = "dev"
instance_type  = "t3.micro"
min_capacity   = 1
max_capacity   = 2

# prod.tfvars
environment    = "prod"
instance_type  = "t3.medium"
min_capacity   = 2
max_capacity   = 10
```

#### 4.3 Pulumi — 프로그래밍 언어로 IaC

Terraform이 HCL이라는 전용 언어를 사용하는 반면, Pulumi는 TypeScript, Python, Go 등 익숙한 프로그래밍 언어를 사용합니다.

```typescript
// index.ts — Pulumi로 AWS 인프라 정의 (TypeScript)
import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

const config = new pulumi.Config();
const environment = config.require("environment");
const projectName = config.get("projectName") || "my-app";

// VPC
const vpc = new aws.ec2.Vpc(`${projectName}-vpc`, {
    cidrBlock: "10.0.0.0/16",
    enableDnsHostnames: true,
    tags: { Name: `${projectName}-${environment}-vpc` },
});

// 서브넷 (반복문 사용 가능!)
const publicSubnets = [0, 1].map((i) =>
    new aws.ec2.Subnet(`${projectName}-public-${i}`, {
        vpcId: vpc.id,
        cidrBlock: `10.0.${i + 1}.0/24`,
        availabilityZone: `ap-northeast-2${i === 0 ? "a" : "c"}`,
        mapPublicIpOnLaunch: true,
    })
);

// 조건부 로직
const dbInstanceClass = environment === "prod"
    ? "db.r6g.large"
    : "db.t3.micro";

// RDS
const db = new aws.rds.Instance(`${projectName}-db`, {
    engine: "postgres",
    engineVersion: "16.1",
    instanceClass: dbInstanceClass,
    allocatedStorage: 20,
    dbName: projectName.replace(/-/g, "_"),
    username: "admin",
    password: config.requireSecret("dbPassword"),
    skipFinalSnapshot: environment !== "prod",
    multiAz: environment === "prod",
});

// 출력
export const vpcId = vpc.id;
export const dbEndpoint = db.endpoint;
```

Terraform vs Pulumi 비교:

| 항목 | Terraform | Pulumi |
|------|----------|--------|
| 언어 | HCL (전용 문법) | TypeScript, Python, Go, C# |
| 학습 곡선 | 새 문법 학습 필요 | 기존 언어 지식 활용 |
| 상태 관리 | S3/Consul/로컬 | Pulumi Cloud/S3/로컬 |
| 반복/조건 | count, for_each (제한적) | 일반 프로그래밍 (자유로움) |
| 테스트 | 외부 도구 필요 | 유닛 테스트 내장 |
| 생태계 | 매우 큼 (가장 많은 프로바이더) | 성장 중 |
| 가격 | 오픈소스 (무료) | 개인 무료, 팀 유료 |

#### 4.4 인프라 버전 관리

```
프로젝트 구조:
infrastructure/
├── modules/                  # 재사용 가능한 모듈
│   ├── vpc/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   ├── ecs/
│   └── rds/
├── environments/
│   ├── dev/
│   │   ├── main.tf          # 모듈 호출
│   │   ├── terraform.tfvars
│   │   └── backend.tf
│   ├── staging/
│   └── prod/
├── .github/
│   └── workflows/
│       └── terraform.yml     # PR 시 자동 plan
└── .gitignore
```

GitHub Actions로 Terraform PR 자동 검증:

```yaml
# .github/workflows/terraform.yml
name: Terraform Plan

on:
  pull_request:
    paths:
      - "infrastructure/**"

jobs:
  plan:
    runs-on: ubuntu-latest
    permissions:
      pull-requests: write

    steps:
      - uses: actions/checkout@v4

      - uses: hashicorp/setup-terraform@v3
        with:
          terraform_version: "1.7.0"

      - name: Terraform Init
        working-directory: infrastructure/environments/prod
        run: terraform init

      - name: Terraform Format Check
        run: terraform fmt -check -recursive infrastructure/

      - name: Terraform Validate
        working-directory: infrastructure/environments/prod
        run: terraform validate

      - name: Terraform Plan
        id: plan
        working-directory: infrastructure/environments/prod
        run: terraform plan -no-color -input=false
        continue-on-error: true

      - name: Comment PR
        uses: actions/github-script@v7
        with:
          script: |
            const output = `#### Terraform Plan 결과
            \`\`\`
            ${{ steps.plan.outputs.stdout }}
            \`\`\`
            `;
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: output
            });
```

### 실습: Terraform으로 인프라 구성

```bash
# 실습: 로컬에서 Terraform 체험

# 1. 프로젝트 디렉토리 생성
mkdir terraform-demo && cd terraform-demo

# 2. main.tf 작성 (위의 예제 파일 활용)
# 처음에는 VPC + 서브넷만 간단히 시작

# 3. 초기화
terraform init

# 4. 코드 검증
terraform fmt
terraform validate

# 5. 실행 계획 확인
terraform plan

# 6. 적용 (AWS 계정 필요)
terraform apply

# 7. 상태 확인
terraform state list
terraform output

# 8. 정리
terraform destroy
```

### 체크포인트

- [ ] IaC의 장점 3가지를 설명할 수 있다
- [ ] Terraform의 핵심 개념(provider, resource, variable, output)을 이해한다
- [ ] HCL 문법으로 기본적인 AWS 리소스를 정의할 수 있다
- [ ] terraform init → plan → apply 워크플로우를 수행할 수 있다
- [ ] Terraform과 Pulumi의 차이를 설명할 수 있다
- [ ] 인프라 변경을 PR로 관리하는 방법을 이해한다

---

## 5. 쿠버네티스 입문

### 학습 목표

- 쿠버네티스의 핵심 개념(Pod, Service, Deployment, Ingress)을 이해한다
- kubectl을 사용하여 클러스터를 관리한다
- Helm Charts로 애플리케이션을 패키징하고 배포한다
- minikube로 로컬 클러스터를 구성하여 실습한다

### 상세 설명

#### 5.1 쿠버네티스란?

쿠버네티스(Kubernetes, K8s)는 컨테이너 오케스트레이션 플랫폼입니다. Docker가 컨테이너 1개를 관리한다면, 쿠버네티스는 수백~수천 개의 컨테이너를 자동으로 배포, 확장, 관리합니다.

```
Docker만 사용할 때:
  "서버 3대에 컨테이너 10개를 수동 배포"
  "서버 1대 장애 → 수동으로 다른 서버에 재배포"
  "트래픽 증가 → 수동으로 컨테이너 추가"

쿠버네티스 사용:
  "컨테이너 10개가 필요하다고 선언"
  "서버 1대 장애 → 자동으로 다른 노드에 재배포"
  "CPU 70% 초과 → 자동으로 컨테이너 추가"
```

쿠버네티스 아키텍처:

```
┌──────────────────────────────────────────────────────────────────┐
│                     Kubernetes Cluster                           │
│                                                                  │
│  ┌────────────────────────────────────┐                         │
│  │         Control Plane (Master)      │                         │
│  │                                    │                         │
│  │  ┌──────────┐  ┌───────────────┐  │                         │
│  │  │ API      │  │ etcd          │  │                         │
│  │  │ Server   │  │ (상태 저장)    │  │                         │
│  │  └──────────┘  └───────────────┘  │                         │
│  │  ┌──────────┐  ┌───────────────┐  │                         │
│  │  │Scheduler │  │ Controller    │  │                         │
│  │  │          │  │ Manager       │  │                         │
│  │  └──────────┘  └───────────────┘  │                         │
│  └────────────────────────────────────┘                         │
│                      │                                           │
│         ┌────────────┴────────────┐                             │
│         ▼                         ▼                             │
│  ┌──────────────────┐   ┌──────────────────┐                   │
│  │   Worker Node 1   │   │   Worker Node 2   │                   │
│  │                    │   │                    │                   │
│  │  ┌──────┐┌──────┐│   │  ┌──────┐┌──────┐│                   │
│  │  │Pod A ││Pod B ││   │  │Pod C ││Pod D ││                   │
│  │  │┌────┐││┌────┐││   │  │┌────┐││┌────┐││                   │
│  │  ││ C1 ││││ C2 │││   │  ││ C3 ││││ C4 │││                   │
│  │  │└────┘││└────┘││   │  │└────┘││└────┘││                   │
│  │  └──────┘└──────┘│   │  └──────┘└──────┘│                   │
│  │                    │   │                    │                   │
│  │  ┌──────────────┐ │   │  ┌──────────────┐ │                   │
│  │  │   kubelet    │ │   │  │   kubelet    │ │                   │
│  │  │   kube-proxy │ │   │  │   kube-proxy │ │                   │
│  │  └──────────────┘ │   │  └──────────────┘ │                   │
│  └──────────────────┘   └──────────────────┘                   │
└──────────────────────────────────────────────────────────────────┘
```

핵심 용어:

| 용어 | 설명 |
|------|------|
| **Cluster** | 쿠버네티스가 관리하는 서버(노드)들의 집합 |
| **Node** | 컨테이너가 실행되는 물리/가상 서버 |
| **Pod** | 쿠버네티스의 최소 배포 단위 (1개 이상의 컨테이너) |
| **Service** | Pod에 대한 네트워크 접근점 (고정 IP/DNS) |
| **Deployment** | Pod의 배포와 스케일링을 관리 |
| **Ingress** | 외부 트래픽을 Service로 라우팅 (L7 로드 밸런서) |
| **ConfigMap** | 설정 데이터 저장 |
| **Secret** | 민감한 데이터 저장 (Base64 인코딩) |
| **Namespace** | 리소스 격리 단위 (가상 클러스터) |

#### 5.2 핵심 리소스 정의

**Pod**

```yaml
# pod.yaml — 기본 Pod 정의 (실무에서는 직접 사용하지 않음)
apiVersion: v1
kind: Pod
metadata:
  name: my-app
  labels:
    app: my-app
    version: v1
spec:
  containers:
    - name: app
      image: ghcr.io/myuser/myapp:1.2.3
      ports:
        - containerPort: 3000
      resources:
        requests:
          cpu: "100m"      # 0.1 CPU
          memory: "128Mi"
        limits:
          cpu: "500m"      # 0.5 CPU
          memory: "256Mi"
      livenessProbe:       # 컨테이너 생존 확인
        httpGet:
          path: /health
          port: 3000
        initialDelaySeconds: 10
        periodSeconds: 30
      readinessProbe:      # 트래픽 수신 준비 확인
        httpGet:
          path: /ready
          port: 3000
        initialDelaySeconds: 5
        periodSeconds: 10
      env:
        - name: NODE_ENV
          value: "production"
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: db-password
```

**Deployment — Pod의 배포와 관리**

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
  labels:
    app: my-app
spec:
  replicas: 3                    # Pod 3개 유지
  selector:
    matchLabels:
      app: my-app
  strategy:
    type: RollingUpdate          # 무중단 배포
    rollingUpdate:
      maxSurge: 1                # 최대 1개 추가 생성
      maxUnavailable: 0          # 항상 모든 Pod 가동
  template:
    metadata:
      labels:
        app: my-app
        version: v1.2.3
    spec:
      terminationGracePeriodSeconds: 30
      containers:
        - name: app
          image: ghcr.io/myuser/myapp:1.2.3
          ports:
            - containerPort: 3000
              protocol: TCP
          resources:
            requests:
              cpu: "100m"
              memory: "128Mi"
            limits:
              cpu: "500m"
              memory: "256Mi"
          livenessProbe:
            httpGet:
              path: /health
              port: 3000
            initialDelaySeconds: 15
            periodSeconds: 20
            failureThreshold: 3
          readinessProbe:
            httpGet:
              path: /ready
              port: 3000
            initialDelaySeconds: 5
            periodSeconds: 10
          env:
            - name: NODE_ENV
              value: "production"
            - name: PORT
              value: "3000"
          envFrom:
            - configMapRef:
                name: app-config
            - secretRef:
                name: app-secrets
```

**Service — 네트워크 접근점**

```yaml
# service.yaml
apiVersion: v1
kind: Service
metadata:
  name: my-app-service
spec:
  selector:
    app: my-app                  # 이 라벨을 가진 Pod에 트래픽 분배
  type: ClusterIP                # 클러스터 내부에서만 접근
  ports:
    - protocol: TCP
      port: 80                   # Service 포트
      targetPort: 3000           # Pod 포트
```

Service 타입 비교:

| 타입 | 접근 범위 | 용도 |
|------|----------|------|
| ClusterIP | 클러스터 내부 | 내부 서비스 간 통신 |
| NodePort | 노드 IP:포트 | 개발/테스트 |
| LoadBalancer | 외부 LB | 클라우드에서 외부 노출 |
| ExternalName | DNS 별칭 | 외부 서비스 연결 |

**Ingress — 외부 트래픽 라우팅**

```yaml
# ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: my-app-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  ingressClassName: nginx
  tls:
    - hosts:
        - myapp.example.com
        - api.example.com
      secretName: myapp-tls
  rules:
    - host: myapp.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: my-app-service
                port:
                  number: 80
    - host: api.example.com
      http:
        paths:
          - path: /api
            pathType: Prefix
            backend:
              service:
                name: api-service
                port:
                  number: 80
```

트래픽 흐름:

```
사용자 → DNS → Ingress Controller → Service → Pod
                    │
       myapp.example.com → my-app-service → Pod (app)
       api.example.com   → api-service    → Pod (api)
```

**ConfigMap과 Secret**

```yaml
# configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  APP_NAME: "my-app"
  LOG_LEVEL: "info"
  CACHE_TTL: "3600"
  DB_HOST: "db-service.default.svc.cluster.local"
  DB_PORT: "5432"

---
# secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
type: Opaque
stringData:                    # stringData는 자동으로 Base64 인코딩
  DB_PASSWORD: "super-secret-password"
  JWT_SECRET: "my-jwt-secret-key"
  API_KEY: "external-api-key-12345"
```

**HorizontalPodAutoscaler — 자동 스케일링**

```yaml
# hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: my-app-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: my-app
  minReplicas: 2
  maxReplicas: 20
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80
  behavior:
    scaleUp:
      stabilizationWindowSeconds: 60
      policies:
        - type: Pods
          value: 4
          periodSeconds: 60
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
        - type: Percent
          value: 10
          periodSeconds: 60
```

#### 5.3 kubectl 필수 명령어

```bash
# ──────────────────────────────────────
# 클러스터 정보
# ──────────────────────────────────────
kubectl cluster-info
kubectl get nodes
kubectl get nodes -o wide

# ──────────────────────────────────────
# 리소스 조회
# ──────────────────────────────────────
# Pod
kubectl get pods
kubectl get pods -o wide              # IP, 노드 정보 포함
kubectl get pods -l app=my-app        # 라벨로 필터
kubectl get pods --all-namespaces     # 모든 네임스페이스

# Deployment
kubectl get deployments
kubectl describe deployment my-app

# Service
kubectl get services
kubectl get svc

# 모든 리소스
kubectl get all

# ──────────────────────────────────────
# 리소스 생성/적용
# ──────────────────────────────────────
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
kubectl apply -f .                     # 현재 디렉토리의 모든 YAML

# ──────────────────────────────────────
# 배포 관리
# ──────────────────────────────────────
# 이미지 업데이트 (롤링 업데이트 자동 수행)
kubectl set image deployment/my-app app=ghcr.io/myuser/myapp:1.3.0

# 배포 상태 확인
kubectl rollout status deployment/my-app

# 배포 이력 확인
kubectl rollout history deployment/my-app

# 롤백 (이전 버전으로)
kubectl rollout undo deployment/my-app

# 특정 버전으로 롤백
kubectl rollout undo deployment/my-app --to-revision=3

# 스케일링
kubectl scale deployment/my-app --replicas=5

# ──────────────────────────────────────
# 디버깅
# ──────────────────────────────────────
# Pod 로그 확인
kubectl logs my-app-pod-abc123
kubectl logs -f my-app-pod-abc123     # 실시간 로그
kubectl logs --tail=100 my-app-pod    # 최근 100줄

# Pod 안에 접속
kubectl exec -it my-app-pod-abc123 -- /bin/sh

# Pod 상세 정보 (이벤트, 상태)
kubectl describe pod my-app-pod-abc123

# 리소스 사용량 확인
kubectl top pods
kubectl top nodes

# ──────────────────────────────────────
# 포트 포워딩 (로컬에서 접근)
# ──────────────────────────────────────
kubectl port-forward service/my-app-service 8080:80
# → http://localhost:8080 으로 접근 가능

# ──────────────────────────────────────
# 삭제
# ──────────────────────────────────────
kubectl delete -f deployment.yaml
kubectl delete pod my-app-pod-abc123
kubectl delete deployment my-app
```

#### 5.4 Helm Charts

Helm은 쿠버네티스의 패키지 매니저입니다. 여러 YAML 파일을 하나의 차트(Chart)로 묶어 관리합니다.

```bash
# Helm 설치
# macOS
brew install helm

# Linux
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

# 버전 확인
helm version
```

**Helm Chart 구조**

```
my-app-chart/
├── Chart.yaml              # 차트 메타데이터
├── values.yaml             # 기본 설정값
├── values-prod.yaml        # 프로덕션 오버라이드
├── templates/
│   ├── _helpers.tpl        # 템플릿 헬퍼 함수
│   ├── deployment.yaml     # Deployment 템플릿
│   ├── service.yaml        # Service 템플릿
│   ├── ingress.yaml        # Ingress 템플릿
│   ├── hpa.yaml            # HPA 템플릿
│   ├── configmap.yaml      # ConfigMap 템플릿
│   └── secret.yaml         # Secret 템플릿
└── charts/                 # 의존성 차트
```

```yaml
# Chart.yaml
apiVersion: v2
name: my-app
description: My Application Helm Chart
type: application
version: 0.1.0          # 차트 버전
appVersion: "1.2.3"     # 애플리케이션 버전
```

```yaml
# values.yaml — 기본 설정값
replicaCount: 2

image:
  repository: ghcr.io/myuser/myapp
  tag: "latest"
  pullPolicy: IfNotPresent

service:
  type: ClusterIP
  port: 80
  targetPort: 3000

ingress:
  enabled: true
  className: nginx
  hosts:
    - host: myapp.example.com
      paths:
        - path: /
          pathType: Prefix
  tls:
    - secretName: myapp-tls
      hosts:
        - myapp.example.com

resources:
  requests:
    cpu: 100m
    memory: 128Mi
  limits:
    cpu: 500m
    memory: 256Mi

autoscaling:
  enabled: true
  minReplicas: 2
  maxReplicas: 10
  targetCPUUtilizationPercentage: 70

env:
  NODE_ENV: production
  LOG_LEVEL: info
```

```yaml
# templates/deployment.yaml — Helm 템플릿
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "my-app.fullname" . }}
  labels:
    {{- include "my-app.labels" . | nindent 4 }}
spec:
  {{- if not .Values.autoscaling.enabled }}
  replicas: {{ .Values.replicaCount }}
  {{- end }}
  selector:
    matchLabels:
      {{- include "my-app.selectorLabels" . | nindent 6 }}
  template:
    metadata:
      labels:
        {{- include "my-app.selectorLabels" . | nindent 8 }}
    spec:
      containers:
        - name: {{ .Chart.Name }}
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
          imagePullPolicy: {{ .Values.image.pullPolicy }}
          ports:
            - containerPort: {{ .Values.service.targetPort }}
          resources:
            {{- toYaml .Values.resources | nindent 12 }}
          env:
            {{- range $key, $value := .Values.env }}
            - name: {{ $key }}
              value: {{ $value | quote }}
            {{- end }}
          livenessProbe:
            httpGet:
              path: /health
              port: {{ .Values.service.targetPort }}
            initialDelaySeconds: 15
            periodSeconds: 20
          readinessProbe:
            httpGet:
              path: /ready
              port: {{ .Values.service.targetPort }}
            initialDelaySeconds: 5
            periodSeconds: 10
```

```yaml
# values-prod.yaml — 프로덕션 오버라이드
replicaCount: 3

image:
  tag: "1.2.3"

resources:
  requests:
    cpu: 250m
    memory: 256Mi
  limits:
    cpu: "1"
    memory: 512Mi

autoscaling:
  enabled: true
  minReplicas: 3
  maxReplicas: 20
```

Helm 명령어:

```bash
# 차트 설치
helm install my-app ./my-app-chart

# 프로덕션 값으로 설치
helm install my-app ./my-app-chart -f values-prod.yaml

# 업그레이드 (배포 업데이트)
helm upgrade my-app ./my-app-chart -f values-prod.yaml

# install + upgrade 통합 (없으면 설치, 있으면 업그레이드)
helm upgrade --install my-app ./my-app-chart -f values-prod.yaml

# 릴리스 목록
helm list

# 릴리스 상태 확인
helm status my-app

# 릴리스 이력
helm history my-app

# 롤백
helm rollback my-app 1

# 삭제
helm uninstall my-app

# 템플릿 렌더링 확인 (실제 적용 없이)
helm template my-app ./my-app-chart -f values-prod.yaml

# 공개 차트 저장소 추가
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update

# 공개 차트 설치 (예: PostgreSQL)
helm install my-db bitnami/postgresql \
    --set auth.postgresPassword=mypassword \
    --set primary.persistence.size=10Gi
```

#### 5.5 minikube로 로컬 실습

```bash
# minikube 설치
# macOS
brew install minikube

# Linux
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube

# Windows (Chocolatey)
choco install minikube

# 클러스터 시작
minikube start --driver=docker --cpus=2 --memory=4096

# 상태 확인
minikube status
kubectl get nodes

# 대시보드 (웹 UI)
minikube dashboard

# Ingress 애드온 활성화
minikube addons enable ingress
minikube addons enable metrics-server
```

### 실습: minikube에서 앱 배포

```bash
# 1. minikube 클러스터 시작
minikube start

# 2. 네임스페이스 생성
kubectl create namespace my-app

# 3. ConfigMap 생성
kubectl apply -f configmap.yaml -n my-app

# 4. Secret 생성
kubectl create secret generic app-secrets \
    --from-literal=DB_PASSWORD=mypassword \
    --from-literal=JWT_SECRET=myjwtsecret \
    -n my-app

# 5. Deployment 배포
kubectl apply -f deployment.yaml -n my-app

# 6. Service 생성
kubectl apply -f service.yaml -n my-app

# 7. 배포 확인
kubectl get all -n my-app

# 8. 포트 포워딩으로 접근
kubectl port-forward service/my-app-service 8080:80 -n my-app

# 9. 테스트
curl http://localhost:8080/health

# 10. 스케일링 테스트
kubectl scale deployment/my-app --replicas=5 -n my-app
kubectl get pods -n my-app -w  # 실시간 변화 관찰

# 11. 롤링 업데이트 테스트
kubectl set image deployment/my-app app=ghcr.io/myuser/myapp:v2 -n my-app
kubectl rollout status deployment/my-app -n my-app

# 12. 롤백 테스트
kubectl rollout undo deployment/my-app -n my-app

# 13. 정리
kubectl delete namespace my-app
minikube stop
```

### 체크포인트

- [ ] Pod, Service, Deployment, Ingress의 역할을 각각 설명할 수 있다
- [ ] kubectl로 리소스를 조회, 생성, 삭제할 수 있다
- [ ] Deployment의 롤링 업데이트와 롤백을 수행할 수 있다
- [ ] Helm Chart의 구조(Chart.yaml, values.yaml, templates/)를 이해한다
- [ ] minikube로 로컬 클러스터를 구성하고 앱을 배포할 수 있다
- [ ] HPA를 설정하여 자동 스케일링을 구성할 수 있다

---

## 11. 프로덕션 백엔드와 풀스택 배포 (Supabase · Next.js · GitHub Actions)

> **최종 검토일**: 2026-06-28 · 근거: research/23_supabase.md(프로덕션 보안·환경 분리·2026 키 체계), research/22_se-practices.md(CI/CD·비밀키·환경변수), research/09_deployment.md(Vercel 프로덕션·프리뷰). 수치·정책은 분기마다 변동될 수 있으므로 공식 페이지에서 재확인하세요.

### 학습 목표

- Supabase를 프로덕션 수준으로 운영한다 — 환경 분리(dev/staging/prod), 커넥션 풀링, 2026 신규 키 체계
- Next.js를 Vercel에 프로덕션 배포한다 — 서버 컴포넌트·API 라우트·환경변수(서버/클라이언트 구분), 프리뷰/프로덕션 분리
- GitHub Actions로 "테스트 → 프리뷰 배포" 파이프라인을 구성한다 — 중급편 방명록 프로젝트를 프로덕션 수준으로 확장

> **이 절의 맥락**: **배포 중급편의 "방명록 앱"**(`교안_deployment_intermediate.md` — Supabase + 정적/번들 프론트)을 출발점으로 삼아, 같은 앱을 (1) 환경이 분리되고 (2) Next.js 풀스택으로 확장되며 (3) 자동 파이프라인으로 배포되는 프로덕션 형태로 끌어올립니다. 앞 섹션(Docker·IaC·K8s)이 "직접 서버를 운영하는 길"이라면, 이 절은 "관리형 백엔드(Supabase) + 관리형 호스팅(Vercel)으로 더 적은 운영부담으로 프로덕션에 가는 길"입니다. 두 경로는 배타적이지 않습니다.

---

### 11.1 프로덕션 백엔드 보강 — Supabase 운영

#### 11.1.1 환경 분리 (dev / staging / prod 프로젝트 분리)

프로덕션에서는 **개발용 데이터와 실사용자 데이터를 절대 같은 곳에 두지 않습니다.** Supabase는 "프로젝트 = 격리된 PostgreSQL 인스턴스 + 키 세트"이므로, **환경마다 별도 프로젝트를 만드는 것**이 표준입니다.

| 환경 | Supabase 프로젝트 | 용도 | 데이터 |
|------|-------------------|------|--------|
| **dev** | `myapp-dev` | 로컬 개발·실험 | 마음껏 깨뜨려도 되는 더미 데이터 |
| **staging** | `myapp-staging` | 배포 전 검증·QA | 프로덕션과 비슷한 구조의 테스트 데이터 |
| **prod** | `myapp-prod` | 실서비스 | 실사용자 데이터 (백업·RLS 필수) |

핵심 원칙:

- **환경마다 URL·키가 다르다.** 코드에 박지 말고 환경변수로 주입한다(11.2.3).
- **스키마 변경은 마이그레이션으로.** SQL을 dev에서 직접 만지지 말고 마이그레이션 파일로 관리해 staging → prod로 동일하게 승격(promote)한다.

```bash
# Supabase CLI — 환경별 프로젝트에 마이그레이션 적용
npm install -g supabase

# 마이그레이션 파일 생성 (dev에서 작성)
supabase migration new add_guestbook_table

# 특정 환경 프로젝트에 연결 후 적용 (staging → prod 순서로 승격)
supabase link --project-ref <staging-project-ref>
supabase db push

supabase link --project-ref <prod-project-ref>
supabase db push
```

> **함정**: "프로젝트 하나로 dev/prod 겸용"은 사고의 지름길입니다. 테스트 중 `delete`나 스키마 변경이 실사용자 데이터를 건드립니다. 무료 플랜은 조직당 활성 프로젝트 2개 제한이 있으므로, prod는 유료(Pro)로 분리하고 dev는 무료를 쓰는 식의 조합을 검토하세요.

#### 11.1.2 커넥션 풀링 (Supavisor / PgBouncer 개념)

PostgreSQL은 **연결(connection) 하나하나가 비싼 자원**입니다. 서버리스(Lambda·Vercel 함수·엣지)는 요청마다 새 연결을 열려는 경향이 있어, 트래픽이 몰리면 **연결 고갈(too many connections)**로 DB가 멈춥니다. 이를 막는 것이 **커넥션 풀러(connection pooler)**입니다.

```
풀러 없음 (위험):
  함수 인스턴스 200개 → 각자 DB 직접 연결 200개 → PostgreSQL 연결 한도 초과 → 장애

풀러 사용 (Supavisor):
  함수 인스턴스 200개 → 풀러가 소수의 실제 연결을 공유·재사용 → DB 안정
```

| 항목 | 직접 연결 (Direct) | 트랜잭션 풀링 (Transaction) | 세션 풀링 (Session) |
|------|--------------------|------------------------------|----------------------|
| 포트(관례) | 5432 | 6543 | 5432(풀러 경유) |
| 적합 환경 | 장수명 서버(상시 켜진 VM/컨테이너) | **서버리스·엣지(Vercel/Lambda)** | prepared statement가 필요한 경우 |
| 특징 | 연결 1:1 | 짧은 트랜잭션마다 연결 회수·재사용 | 클라이언트 세션 유지 |

- **Supabase의 풀러 = Supavisor**(과거 PgBouncer를 자체 구현으로 대체). 대시보드 `Project Settings → Database`에서 **Connection string**의 "Transaction" 모드 문자열을 제공한다.
- **서버리스/엣지에서는 반드시 트랜잭션 풀링 연결 문자열**을 쓴다. 직접 연결을 쓰면 트래픽 급증 시 연결 고갈로 장애가 난다.
- `@supabase/supabase-js`로 REST(PostgREST)만 호출하면 HTTP 기반이라 풀링 이슈가 작지만, **Prisma·Drizzle 등 직접 TCP로 PostgreSQL에 붙는 ORM**을 서버리스에서 쓸 때는 트랜잭션 풀러 문자열이 필수다.

> **교안 요약**: "서버리스에서 DB에 직접 줄을 200개 꽂지 마라. 풀러(Supavisor)가 소수의 줄을 돌려 쓰게 하라. 포트 6543(트랜잭션 모드)을 기억하라."

#### 11.1.3 비밀키 관리 (2026 sb_secret_ 체계)

2026년 신규 Supabase 프로젝트는 레거시 `anon`/`service_role` 대신 **`sb_publishable_...`(공개 가능) / `sb_secret_...`(비밀)** 키 체계와 비대칭 JWT를 기본으로 씁니다(research/23_supabase.md §2.1). 역할 개념은 동일합니다.

| 키 | 2026 신규 형식 | 레거시 | 역할 | 노출 |
|----|----------------|--------|------|------|
| **공개 키** | `sb_publishable_...` | `anon` | 브라우저·클라이언트용. **RLS 범위 내**에서만 동작 | **공개 가능**(단 RLS 필수) |
| **비밀 키** | `sb_secret_...` | `service_role` | 서버·엣지함수용. **RLS 우회(BYPASSRLS)** | **절대 노출 금지** |

프로덕션 운영 규칙:

1. **secret 키는 서버 전용.** 브라우저·모바일·CLI·깃허브에 절대 넣지 않는다. 공식 문구: "Never use in a browser, even on localhost."
2. **공개 키의 안전은 RLS가 전제.** RLS(행 수준 보안)를 끄고 배포하면 공개 키만으로 전체 DB가 무방비가 된다 — 바이브코딩 배포 사고 1순위.
3. **secret 키는 서버 사이드 환경변수·시크릿 매니저에만.** Vercel은 클라이언트 prefix(`NEXT_PUBLIC_`) **없이** 등록(11.2.3), GitHub Actions는 `secrets`로(11.3).
4. **2026 키 전송 주의**: 새 publishable/secret 키는 JWT가 아니므로 `apikey` 헤더로 보낸다. 최신 `@supabase/supabase-js`는 자동 처리하나 직접 fetch 시 주의.
5. **키 회전(rotation)**: 비대칭 JWT 서명 키로 전환되어 회전이 쉬워졌다. 노출 의심 시 즉시 회전한다.

```
공개해도 되는 것 : 프로젝트 URL, sb_publishable_(anon) 키  ← RLS가 검문
절대 공개 금지   : sb_secret_(service_role) 키, DB 비밀번호  ← 서버 금고에만
안전의 전제      : RLS가 켜져 있을 것
```

> **함정**: 서버 컴포넌트에서 편하다고 secret 키를 클라이언트로 흘려보내는 코드를 AI가 생성할 수 있습니다. `NEXT_PUBLIC_` 접두사가 붙은 변수는 브라우저로 새어 나갑니다 — secret 키에는 절대 그 접두사를 붙이지 마세요.

---

### 11.2 Next.js on Vercel 프로덕션

#### 11.2.1 서버 컴포넌트 vs 클라이언트 컴포넌트

Next.js App Router에서 컴포넌트는 기본이 **서버 컴포넌트(Server Component)**입니다. 서버에서 렌더링되어 브라우저로 HTML만 전달되므로, **secret 키·DB 호출을 안전하게 둘 수 있습니다.** 브라우저 상호작용(클릭·상태)이 필요할 때만 `"use client"`로 클라이언트 컴포넌트를 만듭니다.

```tsx
// app/guestbook/page.tsx — 서버 컴포넌트 (기본)
// 서버에서 실행되므로 secret 키를 안전하게 사용 가능
import { createClient } from '@supabase/supabase-js'

export default async function GuestbookPage() {
  // 서버 전용: NEXT_PUBLIC_ 없는 환경변수 (브라우저로 안 샘)
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!   // 서버에서만 — 절대 클라이언트로 전달 금지
  )

  const { data: entries } = await supabase
    .from('guestbook')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <main>
      <h1>방명록</h1>
      <GuestbookForm />        {/* 클라이언트 컴포넌트 */}
      <ul>
        {entries?.map((e) => (
          <li key={e.id}><b>{e.name}</b>: {e.message}</li>
        ))}
      </ul>
    </main>
  )
}
```

```tsx
// app/guestbook/GuestbookForm.tsx — 클라이언트 컴포넌트
"use client"
import { useState } from 'react'

export function GuestbookForm() {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // 서버 API 라우트로 전송 (secret 키는 서버에만 있음)
    await fetch('/api/guestbook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, message }),
    })
    setName(''); setMessage('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="이름" required />
      <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="메시지" required />
      <button type="submit">남기기</button>
    </form>
  )
}
```

#### 11.2.2 API 라우트 (Route Handler)

쓰기·외부 API 호출·secret 키가 필요한 작업은 **API 라우트(Route Handler)**에서 처리합니다. 서버에서만 실행되므로 안전합니다.

```ts
// app/api/guestbook/route.ts — 서버에서만 실행되는 API 라우트
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { name, message } = await request.json()

  // 서버 전용 secret 키 — RLS를 우회하므로 입력 검증을 직접 책임진다
  if (!name?.trim() || !message?.trim()) {
    return NextResponse.json({ error: '이름과 메시지는 필수입니다' }, { status: 400 })
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
  )

  const { error } = await supabase
    .from('guestbook')
    .insert({ name: name.trim(), message: message.trim() })

  if (error) {
    return NextResponse.json({ error: '저장 실패' }, { status: 500 })
  }
  return NextResponse.json({ ok: true }, { status: 201 })
}
```

> **보안 메모**: secret 키는 RLS를 우회하므로 "DB가 알아서 막아주겠지"가 통하지 않습니다. API 라우트가 **입력 검증·인가(authorization)의 최종 책임**을 집니다(research/22_se-practices.md §5.4 입력 검증). 클라이언트에서 직접 Supabase에 쓰는 구조라면 공개 키 + RLS 정책으로 막고, 서버 API를 거치는 구조라면 서버가 검증합니다 — 둘을 섞을 때 가장 사고가 납니다.

#### 11.2.3 환경변수 (서버/클라이언트 구분, 프리뷰/프로덕션 분리)

Next.js 환경변수 규칙은 단 하나로 요약됩니다: **`NEXT_PUBLIC_` 접두사 = 브라우저로 공개, 접두사 없음 = 서버 전용.**

| 변수 | 노출 범위 | 예시 값 |
|------|-----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | 브라우저(클라이언트) | `https://<id>.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | 브라우저(클라이언트) | `sb_publishable_...` (RLS로 보호) |
| `SUPABASE_URL` | 서버 전용 | 위와 동일하나 서버 코드용 |
| `SUPABASE_SECRET_KEY` | **서버 전용 — 절대 NEXT_PUBLIC_ 금지** | `sb_secret_...` |

Vercel은 **Production / Preview / Development 환경별로 다른 값**을 등록할 수 있습니다. dev/staging/prod Supabase 프로젝트(11.1.1)를 여기에 매핑합니다.

```bash
# Vercel CLI — 환경별 변수 등록 (프리뷰는 staging 프로젝트, 프로덕션은 prod 프로젝트)
vercel env add SUPABASE_SECRET_KEY preview      # staging 프로젝트의 secret 키
vercel env add SUPABASE_SECRET_KEY production    # prod 프로젝트의 secret 키

# 로컬로 환경변수 내려받기 (.env.local 생성)
vercel env pull --environment=preview
```

- **대시보드 경로**: Project → Settings → Environment Variables → 값마다 Production/Preview/Development 체크.
- **프리뷰 = staging 데이터, 프로덕션 = prod 데이터**로 묶으면, PR 프리뷰가 실사용자 데이터를 건드리지 않습니다.

> **함정**: `NEXT_PUBLIC_` 변수는 **빌드 시점에 번들로 구워집니다.** 빌드 후 값을 바꿔도 클라이언트에는 반영되지 않으니 재배포가 필요합니다. 또한 한번 공개로 구워진 값은 브라우저 누구나 볼 수 있으므로, secret을 잠깐이라도 `NEXT_PUBLIC_`으로 올렸다면 즉시 키를 회전하세요.

#### 11.2.4 프리뷰/프로덕션 배포 분리

Vercel은 Git 연동만으로 배포를 자동 분리합니다(research/09_deployment.md §2.2).

```
main 브랜치 push      → 프로덕션 배포 (myapp.com, prod 환경변수 = prod Supabase)
다른 브랜치/PR push   → 프리뷰 배포 (랜덤 URL, preview 환경변수 = staging Supabase)
```

- PR마다 **독립 프리뷰 URL**이 생겨 머지 전에 실물로 확인할 수 있습니다.
- 잘못 배포해도 **이전 배포로 클릭 한 번에 롤백**(배포 이력 보존).
- **Hobby(무료)는 비상업·개인용 전용**이며, 수익형 사이트는 Pro($20/월)가 필요합니다.

---

### 11.3 GitHub Actions 파이프라인 (테스트 → 프리뷰 배포 자동화)

중급편 방명록 프로젝트를 **프로덕션 파이프라인**으로 확장합니다: PR이 올라오면 자동으로 (1) 테스트를 돌리고 (2) 통과하면 프리뷰(staging)로 배포해 실물 확인 후 머지합니다. 머지(main)되면 프로덕션으로 승격합니다.

```yaml
# .github/workflows/deploy.yml
# 방명록 앱: 테스트 → 프리뷰(PR) → 프로덕션(main) 자동 배포
name: Test and Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

permissions:
  contents: read          # 최소 권한 원칙 (research/22 §4.3)

jobs:
  # 1) 테스트 — AI가 만든 코드도 여기서 걸러진다 (research/22 §3.4)
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@&lt;full-SHA&gt;     # 뮤터블 태그(@v4) 대신 전체 SHA 고정
      - uses: actions/setup-node@&lt;full-SHA&gt;
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm test

  # 2) 프리뷰 배포 — PR마다 staging 환경으로
  deploy-preview:
    needs: test
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    environment: preview
    steps:
      - uses: actions/checkout@&lt;full-SHA&gt;
      - name: Deploy Preview to Vercel
        run: npx vercel deploy --token=${{ secrets.VERCEL_TOKEN }}
        env:
          # staging Supabase 프로젝트 키 — GitHub Actions secrets에만 보관
          SUPABASE_SECRET_KEY: ${{ secrets.STAGING_SUPABASE_SECRET_KEY }}

  # 3) 프로덕션 배포 — main 머지 시 prod로 승격
  deploy-production:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://myapp.com
    steps:
      - uses: actions/checkout@&lt;full-SHA&gt;
      - name: Deploy Production to Vercel
        run: npx vercel deploy --prod --token=${{ secrets.VERCEL_TOKEN }}
        env:
          SUPABASE_SECRET_KEY: ${{ secrets.PROD_SUPABASE_SECRET_KEY }}
```

2026 GitHub Actions 보안 수칙(research/22_se-practices.md §4.3):

1. **모든 액션을 전체 SHA로 고정.** `@v4`·`@main`·`@latest` 같은 뮤터블 태그는 금지(태그 탈취 시 공급망 공격으로 CI에서 악성 코드 실행). 위 예시의 `@<full-SHA>`는 게재 시 실제 커밋 SHA로 대체합니다.
2. **최소 권한(least-privilege)** — `permissions`를 명시(`contents: read`).
3. **비밀키는 `secrets`로만.** dev/staging/prod 키를 각각 GitHub Secrets에 등록하고, 환경(Environment)별로 분리한다.
4. `pull_request_target`로 신뢰할 수 없는 코드를 실행하지 않는다.
5. **비밀 스캐닝 + push protection을 켠다.** AI 보조 커밋의 비밀키 유출률이 기준선의 2배 이상으로 보고된다(research/22 §1.2).

> **상호링크**: GitHub Actions 보안 7수칙·DORA 5지표·OWASP Top 10:2025의 상세는 [소프트웨어 엔지니어링 가이드](software-engineering.html)에서, Conventional Commits·브랜치 전략은 [Git/GitHub 개발자편](github-developer.html)에서 다룹니다.

---

### 실습: 방명록 앱을 프로덕션 풀스택으로 확장

중급편 방명록(Supabase + 정적 프론트)을 다음 단계로 끌어올립니다.

1. Supabase 프로젝트를 **dev / staging / prod 3개**로 분리하고, 마이그레이션으로 `guestbook` 테이블 + RLS 정책을 세 환경에 동일 적용한다.
2. 정적 프론트를 **Next.js(App Router)**로 옮긴다 — 목록은 서버 컴포넌트, 폼은 클라이언트 컴포넌트 + API 라우트.
3. Vercel에 연결하고 **환경변수를 Preview=staging, Production=prod**로 매핑한다(secret 키는 `NEXT_PUBLIC_` 없이).
4. **GitHub Actions 파이프라인**(테스트 → 프리뷰 → 프로덕션)을 붙인다.
5. PR을 열어 **프리뷰 URL**에서 staging 데이터로 동작을 확인하고, 머지해 프로덕션 배포를 관찰한다.

```bash
# 빠른 시작 골격
npx create-next-app@latest guestbook --typescript --app
cd guestbook
npm install @supabase/supabase-js

# Vercel 연결 및 환경변수
npx vercel link
vercel env add SUPABASE_SECRET_KEY preview
vercel env add SUPABASE_SECRET_KEY production

# 서버리스에서는 트랜잭션 풀러(포트 6543) 연결 문자열 사용 (ORM 직결 시)
```

### 체크포인트

- [ ] Supabase를 dev/staging/prod 프로젝트로 분리하고 마이그레이션으로 스키마를 승격할 수 있다
- [ ] 서버리스/엣지에서 커넥션 풀러(Supavisor, 트랜잭션 모드 포트 6543)를 써야 하는 이유를 설명할 수 있다
- [ ] 2026 키 체계(`sb_publishable_`/`sb_secret_`)의 역할과 노출 규칙을 구분하고, RLS가 공개 키 안전의 전제임을 안다
- [ ] Next.js 서버 컴포넌트·API 라우트에 secret 키를 두고, 클라이언트에는 `NEXT_PUBLIC_` 공개 변수만 노출할 수 있다
- [ ] Vercel 환경변수를 Preview=staging / Production=prod로 분리할 수 있다
- [ ] GitHub Actions로 "테스트 → 프리뷰 → 프로덕션" 파이프라인을 구성하고, 액션을 SHA로 고정할 수 있다

---

## 핵심 가정 + 검증 체크리스트 (P6)

### 핵심 가정 3줄

1. 본 11장은 **2026년 신규 Supabase 프로젝트가 `sb_publishable_`/`sb_secret_` 키 체계 + 비대칭 JWT를 기본**으로 한다고 가정했다(research/23_supabase.md §2.1). 2025년 이전 생성 프로젝트는 레거시 `anon`/`service_role`을 쓸 수 있어 학습자 화면과 다를 수 있다.
2. Vercel·Supabase의 가격·한도·포트 관례(트랜잭션 풀러 6543 등)는 2026-06 시점 기준이며, 분기마다 변동되므로 공식 페이지 재확인이 필요하다.
3. 실습은 "직접 Supabase 프로젝트 3개 + Next.js on Vercel + GitHub 연동" 시나리오를 전제로 한다. Lovable Cloud로만 작업하는 학습자는 키·대시보드 절차를 그대로 따를 수 없다(러버블이 대행).

### 검증 체크리스트 (PI 김병선 직접 확인)

- [ ] 신규 Supabase 프로젝트 대시보드에 `sb_publishable_`/`sb_secret_` 키가 그대로 노출되는지 실제 가입으로 확인
- [ ] Supavisor 트랜잭션 모드 연결 문자열(포트 6543) 표현이 현재 Supabase 대시보드와 일치하는지 확인
- [ ] Vercel 환경변수 Preview/Production 분리 화면이 현행 UI에 그대로 존재하는지 확인
- [ ] GitHub Actions YAML의 `@<full-SHA>` 자리표시자를 게재 시 실제 SHA 또는 안내 문구로 대체
- [ ] Next.js 코드 예시(App Router·Route Handler)가 현재 Next.js 버전에서 동작하는지 확인
- [ ] 상호링크 대상(`software-engineering.html`, `github-developer.html`) 파일 존재 및 앵커 확인
- [ ] 개인정보 보호 규칙 준수: 실명 인용 없음 / 제작자 크레딧만 허용

---

*이 교안의 섹션 6~10에서는 CI/CD 파이프라인 고급, 무중단 배포 전략(Blue-Green, Canary), 모니터링과 로깅(Prometheus, Grafana, ELK), 보안과 시크릿 관리, 종합 프로젝트를 다루며, 섹션 11에서 관리형 백엔드(Supabase)·풀스택(Next.js on Vercel)·자동 파이프라인(GitHub Actions) 경로를 다룹니다.*
