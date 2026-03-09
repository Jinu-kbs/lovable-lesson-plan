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

*이 교안의 후반부(섹션 6~10)에서는 CI/CD 파이프라인 고급, 무중단 배포 전략(Blue-Green, Canary), 모니터링과 로깅(Prometheus, Grafana, ELK), 보안과 시크릿 관리, 그리고 종합 프로젝트를 다룹니다.*
