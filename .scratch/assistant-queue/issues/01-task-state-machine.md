# 01 — 작업 상태머신 순수 모듈

Status: ready-for-agent

캘린더 이벤트 ↔ 작업(Task) 상호변환 + 상태 전이. 순수, I/O 없음. (ADR-0004)

## 모듈
`scripts/lib/task.mjs`
- `STATES = ["대기","작업중","성공","실패","정보필요"]`, 아이콘 맵, 허용 전이표.
- `parseTask({summary, description})` → `{state, title, request, needInfo, history:[{at,state,note}]}` (제목의 `[상태]` 토큰 + 설명 `요청:/필요정보:/이력:` 파싱).
- `renderTask(task)` → `{summary, description}` (제목 `{아이콘}[{상태}] {title}`, 설명 3블록 재구성).
- `transition(task, toState, {at, note})` → 새 task (상태 교체 + `이력` append). **비파괴**(입력 불변).

## 수용 (test-first — `task.test.mjs`)
- `parseTask`가 제목 `⏳[대기] 메일 정리`에서 state=대기, title=메일 정리 추출.
- 설명의 `요청:/필요정보:/이력:` 블록을 각각 파싱(이력은 줄 배열 → {at,state,note}).
- `renderTask`는 상태별 올바른 아이콘 + `[상태]` 토큰. round-trip: parse(render(t)) 深동일.
- `transition(대기→작업중)` 허용, 이력 1줄 추가, 원본 불변. `성공→작업중` 같은 불허 전이는 throw.
- `정보필요` task의 `needInfo` 텍스트 파싱/렌더.
