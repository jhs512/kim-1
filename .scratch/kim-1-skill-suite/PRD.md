# PRD: kim-1 skill suite (eb 흡수 + 캘린더 큐)

## 목표

eb의 스킬 스위트(증류/조회/정제/건강)를 kim-1에 **흡수**하되, kim-1의 마크다운 vault +
infinite-brain 스키마 + gws 노드시트 투영에 맞게 각색한다. **모든 kim-1 스킬은 완전 한글**.
추가로 **`kim-calendar` Google 캘린더를 입력 큐로 삼아 이벤트를 루프로 증류·반영**한다.

## 원칙 (eb에서 가져오되 제외할 것)

- ✅ 가져옴: 스킬 네이밍(`kim-1-<동사>`), 온보딩, 도메인 어휘(증류/조회/정제/신뢰도), 그래프-인지 캡처(추가 전 조회).
- ❌ 제외: CSV 집계, 웹앱(`web/`), Cloudflare Pages 배포(eb-pages), GitHub Actions, 서비스계정 시트미러(eb-gcp/eb-sheets — kim-1은 gws 노드별 시트로 이미 함).
- mattpocock 범용 스킬(tdd 등 17개)은 **건드리지 않음**(외부 lock).

## 스킬 스위트 (전부 한글, `.claude/skills/kim-1-*/SKILL.md`)

| 스킬 | 역할 (eb 원본) |
|---|---|
| **kim-learn** | 증류: 원자료 → infinite-brain 노드(+엣지) 마크다운. 추가 전 조회로 중복/연결 확인 (eb-learn) |
| **kim-ask** | 조회: vault 그래프 탐색 → 관련 서브그래프 (eb-ask) |
| **kim-check** | 건강도 점검 → 리뷰 큐(저신뢰/고아/끊긴 엣지/빈 필드) (eb-check) |
| **kim-clean** | 정제: 중복 병합·고아 연결·촘촘화 (eb-clean) |
| **kim-sync** | 투영: `scripts/sync.sh` 래핑(knowledge-work 끝 → Drive) (신규) |
| **kim-calendar** | `kim-calendar` 캘린더 큐를 루프로 인제스트 (신규·요청) |

온보딩: `docs/onboarding.md`(한글) — 스위트 전체 흐름.

## 쿼리 엔진 (스킬들의 결정적 기반)

`scripts/kim.mjs` — vault(마크다운) 위의 결정적 그래프 CLI. 기존 순수 모듈(parse-node,
validate-vault, resolve-edges) 재사용.
- `list` / `search <질의>` / `node <id>` / `neighbors <id> [--depth N]` / `health`
- 순수 그래프 연산(search 랭킹, neighbors BFS, health)은 `scripts/lib/graph.mjs`로 분리해 TDD.

## kim-calendar 큐 (핵심 신규 기능)

- Google 캘린더 **`kim-calendar`** 를 입력 큐로 사용(gws로 접근).
- **이벤트 = 큐 아이템**: 제목/설명에 원자료 텍스트 또는 URL.
- 루프: 미처리 이벤트 순회 → `kim-learn` 증류(노드 생성) → `kim-sync` Drive 반영 →
  이벤트에 **비파괴 완료 표시**(제목 앞 `✅`; 삭제 안 함) → 다음.
- 처리 결과는 `log` 노드로 기록(감사 추적).

## Non-goals
- 미디어(유튜브/음성) 전사(ingest)는 이번 범위 밖(후속).
- 캘린더 이벤트 자동 생성(사람이 큐에 넣음). 루프는 소비만.

## 성공 기준
- kim-1-* 스킬 6종 + 온보딩, 전부 한글.
- `kim.mjs` 그래프 연산 TDD 통과.
- `kim-calendar` 캘린더 생성 + 이벤트 1개를 루프가 증류→노드→시트→완료표시까지 실증.

## Comments

### 2026-07-01 — 구현 완료
- 스킬 6종(전부 한글): `kim-learn/ask/check/clean/sync/calendar` + `docs/onboarding.md`
- 쿼리 엔진: `scripts/lib/graph.mjs`(search/neighbors/health, TDD) + `scripts/kim.mjs` CLI
- 캘린더 큐: `scripts/kim-cal.sh`(ensure/list/done/add) — `kim-calendar` 캘린더 생성됨(id는 `.sync/calendar-id`)
- **실증**: 큐 아이템 "복리의 72법칙" → 노드4(`fact-rule-of-72`, derived_from 복리) 증류 → 검증 → Drive 투영(`kim-1_4_personal_facts_public_72법칙`) → 이벤트 ✅ 완료표시 → 큐 소진. 전 스위트 33/33.
- 제외 준수: CSV/웹/Cloudflare/GitHub Actions/서비스계정 시트미러 없음. mattpocock 스킬 미변경.
- 후속: `log` 노드(축약 스키마)는 파서가 아직 필수필드 요구 → 미도입. 미디어 ingest 미도입.
