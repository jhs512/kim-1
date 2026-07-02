# 02 — 시각 게이트 + 반복 재등록 계산

Status: ready-for-agent

만기 판정과 반복 다음 시각 계산. 순수(now를 인자로 주입, Date.now 미사용). (ADR-0004)

## 모듈
`scripts/lib/schedule.mjs`
- `isDue(task, startISO, nowISO)` → boolean: `state==="대기" && start ≤ now`.
- `parseRepeat(text)` → 규칙 객체 (예 `평일 09:00` → `{days:[1..5], time:"09:00"}`, `매일`, `주 1회` 등 최소셋).
- `nextOccurrence(rule, fromISO)` → 다음 발생 ISO (from 이후 첫 매칭).

## 수용 (test-first — `schedule.test.mjs`)
- `isDue`: 대기 + start ≤ now → true; 미래 start → false; 비-대기 → false.
- `parseRepeat("평일 09:00")` → 평일(월~금) 09:00 규칙.
- `nextOccurrence(평일09:00, 금요일 10:00)` → 다음 **월요일** 09:00. (주말 건너뜀)
- `nextOccurrence(매일 07:00, 오늘 08:00)` → 내일 07:00.
- 모든 함수 순수: 같은 입력 → 같은 출력, now/from은 인자.

## 주의
`Date.now()`/`new Date()`(무인자)는 워크플로 제약과 별개로 **테스트 재현성**을 위해 인자 주입. 요일 계산은 주입된 ISO 기준.
