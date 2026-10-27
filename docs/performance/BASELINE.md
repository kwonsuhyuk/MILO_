# MILO 성능 기준선

## 측정 목적

성능 개선 전 상태를 보존하고 이후 같은 조건으로 재측정해 포트폴리오에서
개선 수치와 근거를 제시하기 위한 기준선이다.

## 측정 정보

- 측정 시각: 2026-10-27 17:36 KST
- 대상 커밋: `c69ef219cfc7e14bd23e76269e8d4377957b93ea`
- 대상 경로: `/login`
- 실행 환경: `next build` 후 `next start`로 실행한 로컬 프로덕션 빌드
- 측정 도구: Lighthouse 13.5.0
- 측정 횟수: 기기별 1회

Vercel Preview의 고유 배포 URL은 Deployment Protection으로 인해 헤드리스
Lighthouse가 Vercel 로그인 화면으로 이동했다. 잘못된 페이지의 점수를 기록하지 않기
위해 현재 브랜치의 프로덕션 빌드를 로컬에서 실행해 측정했다.

## 기준선 결과

| 구분 | Performance | Accessibility | Best Practices | SEO |
| --- | ---: | ---: | ---: | ---: |
| Mobile | 75 | 100 | 96 | 100 |
| Desktop | 90 | 100 | 96 | 100 |

| 핵심 지표 | Mobile | Desktop |
| --- | ---: | ---: |
| FCP | 0.8초 | 0.2초 |
| LCP | 12.1초 | 2.1초 |
| TBT | 30ms | 0ms |
| CLS | 0 | 0 |
| Speed Index | 0.8초 | 0.2초 |
| TTFB | 104ms | 15ms |

## 보관 자료

- `baseline-2026-10-27.json`: 비교 자동화에 사용할 구조화된 원본 요약
- `baseline-2026-10-27-scorecard.svg`: 포트폴리오에 바로 사용할 기준선 이미지
- `baseline-2026-10-27-mobile.jpg`: Lighthouse 모바일 최종 화면
- `baseline-2026-10-27-desktop.jpg`: Lighthouse 데스크톱 최종 화면

## 이후 비교 원칙

- 동일한 로컬 프로덕션 빌드 방식과 Lighthouse 버전을 사용한다.
- 캐시와 네트워크 편차를 줄이기 위해 개선 후에는 기기별 3회 측정하고 중앙값을 사용한다.
- Performance 점수만 비교하지 않고 LCP, TBT, CLS와 변경 원인을 함께 기록한다.
- 측정 조건이 달라지면 동일 선상의 전후 비교로 표현하지 않는다.

현재 가장 큰 개선 후보는 모바일 LCP다. 원인을 확인하기 전까지 특정 코드가 병목이라고
단정하지 않으며, 개선 작업 시 Lighthouse 트레이스와 LCP 요소를 함께 분석한다.
