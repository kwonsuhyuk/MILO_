# MILO (마일로)

> 이력서·자기소개서 버전부터 기업 지원 결과까지 연결해 관리하고 분석하는 취업 관리 웹서비스

MILO는 취업 또는 이직을 준비하는 사용자가 제출 문서, 기업 지원 과정과 결과를
한곳에서 기록하고 다시 활용할 수 있도록 돕는 서비스입니다.

## 해결하려는 문제

- 기업마다 다르게 제출한 이력서와 자기소개서의 버전을 관리하기 어렵습니다.
- 어떤 기업에 어떤 문서를 제출했는지 시간이 지나면 확인하기 어렵습니다.
- 여러 기업의 전형 상태, 일정과 다음 할 일이 흩어집니다.
- 지원 결과가 누적되어도 유의미한 통계와 개선점을 파악하기 어렵습니다.

## 핵심 경험

1. 목적이 다른 이력서와 자기소개서를 독립된 문서로 관리합니다.
2. 같은 문서의 수정본은 버전으로 쌓고 변경 내용을 기록합니다.
3. 기업 지원 기록에 실제로 제출한 특정 문서 버전을 연결합니다.
4. 전형 상태, 결과, 일정과 변경 이력을 한곳에서 관리합니다.
5. 누적된 지원 기록을 통계와 연결 관계로 확인합니다.

## MVP 범위

- Google·Kakao 소셜 로그인
- PDF 이력서·자기소개서 업로드와 버전 관리
- 버전별 변경 내용 기록
- 선택한 두 PDF 나란히 비교(MVP 권장)
- 문서 없이도 생성할 수 있는 기업 지원 기록
- 제출 문서 버전과 지원 기록 연결
- 전형 상태, 결과와 변경 이력 관리
- 지원별 일정과 다음 할 일 관리
- 지원 현황 및 예정 일정 대시보드
- 기본 합격률, 단계 전환율과 미응답률 통계

AI 취업 활동 인사이트, AI 기업 분석, 이메일 자동 연동, 커뮤니티,
전체 관계 그래프와 데이터 내보내기는 MVP 이후 단계에서 개발합니다.

## 현재 상태

MVP PRD와 핵심 아키텍처를 정리했으며 Next.js 프로젝트 기반과 디자인 확인용
첫 화면을 구성했습니다. 현재 화면은 기능 구현 전 색상, 타이포그래피, 기본 UI와
데이터 표현 방식을 검토하기 위한 기준안입니다. Supabase의 브라우저·서버 클라이언트와
Drizzle의 서버 전용 데이터베이스 연결 기반을 구성했습니다. Supabase에는 MVP 핵심
테이블, 소유자 전용 RLS 정책과 프로필 생성 트리거까지 첫 마이그레이션을 적용했습니다.

## 로컬 실행

```bash
npm install
cp .env.example .env.local
npm run dev
```

Supabase 프로젝트를 생성한 뒤 `.env.local`에 프로젝트 URL, publishable key와
데이터베이스 연결 문자열을 입력합니다. 실제 환경변수 파일과 비밀키는 Git에
포함하지 않습니다.

품질 검사는 다음 명령으로 실행합니다.

```bash
npm run lint
npm run typecheck
npm run build
```

데이터베이스 스키마를 변경하면 마이그레이션을 생성하고 SQL을 검토한 뒤 적용합니다.

```bash
npm run db:generate
npm run db:migrate
```

## 문서

- [프로젝트 컨텍스트](docs/PROJECT_CONTEXT.md)
- [제품 요구사항](docs/PRD.md)
- [기능 관계도](docs/FEATURE_MAP.md)
- [디자인 시스템 초안](docs/DESIGN_SYSTEM.md)
- [아키텍처](docs/ARCHITECTURE.md)
- [의사결정 기록](docs/DECISIONS.md)
- [Codex 작업 지침](AGENTS.md)

## Repository Structure

```text
milo/
├── AGENTS.md
├── docs/
│   ├── PROJECT_CONTEXT.md
│   ├── PRD.md
│   ├── FEATURE_MAP.md
│   ├── DESIGN_SYSTEM.md
│   ├── ARCHITECTURE.md
│   └── DECISIONS.md
├── public/
│   └── milo-mark.svg
├── drizzle/
│   └── ...
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── db/
│   │   ├── schema/
│   │   └── index.ts
│   └── lib/
│       └── supabase/
│           ├── client.ts
│           ├── config.ts
│           └── server.ts
├── .env.example
├── biome.json
├── drizzle.config.ts
├── next.config.ts
├── postcss.config.mjs
├── tsconfig.json
├── package.json
└── README.md
```
