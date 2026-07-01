# 지침
- kim은 서브 폴더이고 김비서의 원본 리포지터리 입니다.
- 지금 리포는 김비서의 /kim-setup 스킬로 세팅된 kim-1 비서 입니다.
- 이 프로젝트의 목표는 kim-1을 쓰면서 kim을 계속 개선

# 참고 프로젝트
- kim 서브모듈이 참고해야 할 프로젝트: ~/projects/eb
- 현재 프로젝트(kim-1)가 참고해야 할 프로젝트: ~/projects/k4 (eb로부터 생성됨)

## Agent skills

### Issue tracker

Issues and PRDs live as markdown files under `.scratch/<feature-slug>/`. See `docs/agents/issue-tracker.md`.

### Triage labels

Canonical vocabulary, unchanged: `needs-triage` / `needs-info` / `ready-for-agent` / `ready-for-human` / `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context — `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.

## gws (Google Workspace CLI)

kim 비서는 Google 접근을 **gws CLI**로 한다(claude.ai Google MCP은 headless/cron에서 인증이 빠지므로 회피). 셋업/재인증은 **`gws-setup` 스킬**을 쓴다(콘솔·Chrome 함정 우회법 포함). 현재 상태는 [[gws-cli-setup]] 메모리 참고.

```bash
gws auth status                                                # auth_method: oauth2 이면 정상
gws gmail users getProfile --params '{"userId":"me"}'          # 경로 파라미터는 --params
```
