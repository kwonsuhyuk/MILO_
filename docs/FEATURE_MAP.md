# MILO 기능 관계도

## 문서 목적

MILO의 주요 기능과 데이터 연결 관계를 한눈에 확인하기 위한 문서다.
세부 요구사항과 우선순위는 [`PRD.md`](PRD.md)를 기준으로 하며,
기술 구성과 데이터 흐름은 [`ARCHITECTURE.md`](ARCHITECTURE.md)에서 별도로 정의한다.

## 범례

- **MVP 핵심**: 첫 출시에서 구현할 기능
- **MVP 권장**: 핵심 흐름을 해치지 않는 범위에서 구현할 기능
- **후속 단계**: MVP 검증 이후 구현할 기능

## 기능 관계

```mermaid
flowchart TD
    USER[사용자] --> AUTH[Google·Kakao 소셜 로그인]

    AUTH --> APPLICATION[기업 지원 기록]
    AUTH --> DOCUMENT[제출 문서 관리]

    subgraph DOCUMENTS["MVP 핵심 · 이력서 및 자기소개서"]
        DOCUMENT --> FAMILY[문서]
        FAMILY --> VERSION[문서 버전]
        VERSION --> PDF[비공개 PDF 보관]
        VERSION --> CHANGE[버전명 및 변경 내용]
        VERSION --> COMPARE["MVP 권장 · PDF 나란히 비교"]
    end

    subgraph APPLICATIONS["MVP 핵심 · 기업 지원 관리"]
        APPLICATION --> COMPANY[기업 · 직무 · 채용공고]
        APPLICATION --> CURRENT[현재 단계 및 전체 결과]
        APPLICATION --> EVENTS[상태 변경 이벤트]
        APPLICATION --> SCHEDULE[일정 · 다음 할 일]
        APPLICATION --> NOTE[메모]

        CURRENT --> STAGE[서류 → 테스트/과제 → 면접 → 처우 협의]
        CURRENT --> RESULT[진행 중 · 합격 · 불합격 · 종료]
        EVENTS --> UNDO[변경 추적 및 되돌리기]
    end

    VERSION -->|실제로 제출한 버전 연결| APPLICATION

    subgraph DASHBOARD["MVP 핵심 · 대시보드 및 통계"]
        APPLICATION --> STATUS[지원 현황]
        SCHEDULE --> UPCOMING[예정 일정]
        APPLICATION --> STATS[재현 가능한 기본 통계]
        VERSION --> STATS

        STATS --> RATE[단계별 합격률 및 전환율]
        STATS --> NO_REPLY[미응답률]
        STATS --> TREND[기간별 지원 추이]
        STATS --> VERSION_RESULT[문서 버전별 결과]
    end

    subgraph LATER[후속 단계]
        STATS --> AI_INSIGHT[AI 취업 활동 인사이트]
        VERSION_RESULT --> AI_INSIGHT
        AI_INSIGHT --> ACTION[강점 · 부족한 단계 · 개선 행동]
        AI_INSIGHT --> EVIDENCE[분석 기간 · 표본 수 · 근거 지표]

        SCHEDULE --> INTERVIEW_AI[AI 면접 준비 자료]
        EMAIL[이메일 연동] --> EVENTS
        DOCUMENT --> COMMUNITY[익명 공유 · 피드백 · 첨삭]
        APPLICATION --> RELATION_GRAPH[관계 그래프]
        VERSION --> RELATION_GRAPH
    end
```

## 구조 해석

기업 지원 기록이 서비스의 중심이다. 사용자는 문서 없이도 지원 기록을 먼저 만들 수 있고,
이력서나 자기소개서가 있다면 실제로 제출한 특정 버전을 나중에 연결할 수 있다.

대시보드의 기본 통계는 AI 없이 동일한 규칙으로 다시 계산할 수 있어야 한다.
AI는 MVP 이후 이 통계와 문서 버전별 결과를 해석하되, 분석 기간과 표본 수를 근거로
제시하고 결과의 인과관계를 단정하지 않는다.

