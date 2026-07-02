# 07 — 리팩토링 (기존 kim-cal 흡수·정리)

Status: ready-for-agent

새 작업 큐 모델로 기존 자산을 정리한다.

## 범위
- 기존 `scripts/kim-cal.sh`(ingest 전용: ensure/list/done/add)를 새 명령(due/enqueue/set/reenqueue)으로 **흡수·대체**. 옛 `done`(✅ 접두)은 상태머신 `성공`으로 통일.
- `kim-calendar` 스킬을 상태머신·능력경계 반영해 갱신(또는 `kim-work`로 승계, 관계 정리).
- 중복 제거: 캘린더 이름 도출/gws 프리앰블 처리/JSON 파싱 헬퍼 공용화.
- `docs/onboarding.md`·CONTEXT 참조 갱신(작업/상태/워커 용어 반영).
- kim **제품(서브모듈)**에도 동일 반영 후 커밋·푸시(별도 확인).

## 수용
- 옛/새 캘린더 인터페이스가 공존하지 않음(하나로).
- 전 스위트 GREEN 유지. sync·큐 실증 통과.
- 리팩토링은 동작 보존(테스트로 가드) 하에 진행.
