# 03 — 캘린더 작업 큐 I/O 셸

Status: ready-for-agent

`scripts/kim-cal.sh` 확장(gws). 결정적 로직은 task.mjs/schedule.mjs가, I/O만 여기.

## 명령
- `due` — 만기 `대기` 작업만 나열(start ≤ now, 상태=대기): eventId <TAB> 제목 <TAB> 설명.
- `enqueue "<요약>" "<요청>" [startISO]` — 새 `대기` 작업 생성(start 없으면 지금).
- `set <eventId> <상태> "<note>"` — 상태 전이: task.mjs로 제목 토큰 교체 + 이력 append 후 events.patch.
- `reenqueue <eventId>` — 설명 `반복:` 있으면 nextOccurrence로 새 `대기` 작업 생성.
- (기존 ensure/list/done은 유지 또는 새 명령으로 흡수 — 07에서 정리)

## 수용 / 실증
- `enqueue` → 캘린더에 `⏳[대기] …` 이벤트 생성(설명에 요청).
- `due`는 미래 start 작업을 제외.
- `set <id> 작업중 "착수"` → 제목 `🔄[작업중] …`, 설명 `이력:`에 1줄 추가(기존 불변).
- gws 응답의 `Using keyring backend:` 프리앰블 제거 후 JSON 파싱.
- 스토어(비서코드)는 `kim.config.json`에서 → `{비서코드}-calendar`.

## 주의
gws는 확장자 없는 네이티브 바이너리 → bash 셸에서 실행(Node spawn 회피). task.mjs 호출은 `node -e`/작은 러너로.
