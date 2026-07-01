---
name: gws-setup
description: Install and OAuth-authenticate the gws (Google Workspace CLI) so kim can reach Gmail/Calendar/Drive from the terminal (incl. headless/cron). Use when the user wants to set up gws, connect Google Workspace to kim, add Gmail/Calendar/Drive CLI access, or fix a broken gws auth. Encodes the console/Chrome gotchas that otherwise waste an hour.
---

# gws setup (Google Workspace CLI)

Goal: `gws` on PATH, OAuth-authenticated, so kim can call Gmail/Calendar/Drive from the terminal — and it keeps working in headless/cron runs (where the claude.ai Google MCP's interactive auth drops out). That "works unattended" property is *why* kim uses gws over the MCP.

State/notes live in the [[gws-cli-setup]] memory; a condensed runbook is also in the repo `CLAUDE.md`.

## The three traps (this is the whole point of the skill)

Setup is short. What burns time is Google-console / Chrome behavior. Take the workaround **first**, don't discover it:

1. **`gws auth setup` cannot auto-create the OAuth client** (Google policy — even with gcloud). Go straight to manual creation in the console.
2. **The client secret is shown exactly once and is never in the DOM.** The console "download JSON" button is unreliable — a native "Save As" dialog can block it, Chrome blocks a page's *second* automatic download, and an SPA route change doesn't reset that counter. Do **not** rely on the download. Instead, when driving via browser automation, **intercept the create-client API response** with a fetch/XHR hook and read `clientSecrets[0].clientSecret`, then write the file yourself.
3. **The console "add test user" save silently fails.** Don't fight it. **Publish the app to Production** instead, then pass the unverified-app warning during consent.

## Prerequisites

```bash
gws --version          # already installed? (googleworkspace/cli). If not:
#   download gws.exe from github.com/googleworkspace/cli releases → ~/bin (on PATH)
gcloud --version       # if missing:  scoop bucket add extras && scoop install gcloud
```

## Steps

### 1. gcloud login (needed only to bootstrap; the real grant is step 5)
Interactive/browser. Run it and drive the Google consent, or have the user run `gcloud auth login`. Confirm with `gcloud auth list`. Note the active project (`gcloud config get-value project`); use it as `<PROJ>` below.

### 2. Configure the consent screen (Google Auth Platform)
Navigate `console.cloud.google.com/auth/overview?project=<PROJ>` → 시작하기.
- App name (e.g. "gws CLI"), support email = the user's account.
- Audience: **External** (personal Gmail can't use Internal).
- Contact email, agree to the Google API user-data policy, 만들기.

### 3. Create the OAuth client — Desktop app
Navigate `console.cloud.google.com/auth/clients/create?project=<PROJ>` → 애플리케이션 유형 **데스크톱 앱** → 만들기.

**Before clicking 만들기, install a response hook** so the secret is captured no matter what the download does:
```js
// mcp__claude-in-chrome__javascript_tool on the create page:
window.__net=[];const of=window.fetch;window.fetch=async function(...a){const u=String((a[0]&&a[0].url)||a[0]);const r=await of.apply(this,a);if(/clients|clientSecret/i.test(u)){try{const c=r.clone();c.text().then(t=>{if(/clientSecret|GOCSPX/.test(t))window.__net.push(t)})}catch(e){}}return r};'hook-installed'
```
After creating, read `window.__net[0]` → `JSON.parse(...)` → fields `clientId` and `clientSecrets[0].clientSecret`. **Do not print the secret in prose.** Write `~/.config/gws/client_secret.json` (installed-app format) with the Write tool:
```json
{"installed":{"client_id":"<clientId>","project_id":"<PROJ>","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"<secret>","redirect_uris":["http://localhost"]}}
```
Verify: `gws auth status` shows `client_config_exists: true`.

### 4. Publish to Production (skip test users)
Navigate `console.cloud.google.com/auth/audience?project=<PROJ>` → **앱 게시** → 확인. State becomes 프로덕션 단계.

### 5. gws auth login → consent
```bash
gws auth login -s gmail,calendar,drive   # prints an auth URL + waits on localhost:<port>
```
Launch this with the Bash tool's **`run_in_background`** (not a shell `&`) — the command runs a local server that must stay alive while you drive the browser; a backgrounded `&` job can be killed when the tool call returns, and you'd never get the redirect. Grep the log for the `https://accounts.google.com...` URL.

Open that URL in the controlled Chrome tab and drive it:
- Pick the account. **The first click only highlights the row — click it again to actually proceed.**
- Unverified-app warning → **고급** → **gws CLI(으)로 이동(안전하지 않음)** (it's the user's own app).
- **계속** on the identity screen → on scope summary click **모두 선택** → **계속**.
- Tab lands on `localhost:<port>/?...code=...` ("Success") and the background process exits 0. If it timed out, just relaunch step 5 (fresh port) and re-drive.

### 6. Verify
```bash
gws auth status                                              # auth_method: oauth2, storage: encrypted
gws gmail users getProfile --params '{"userId":"me"}'       # path params go through --params
```

## Browser-automation reliability notes
- This console is heavy Angular: screenshots often time out and the window resizes mid-flow. Prefer `find` (a11y) + element `ref` clicks and `javascript_tool` over coordinate clicks; re-screenshot only when needed.
- Material checkboxes don't toggle via programmatic `.click()` (needs a trusted event). Delete a client from its **detail page** (삭제 button → confirm) rather than list checkboxes.
- Downloads *do* land in `~/Downloads`, but only the first automatic one per real page load — don't depend on it; the response-hook path (step 3) is the reliable one.

## Cleanup
If multiple Desktop clients got created while iterating, keep only the one gws authenticated with (`gws auth status` → the client_id in `client_secret.json`) and delete the rest from each client's detail page.

## Usage after setup
- Raw API: `gws <service> <resource> <method> [--params '{...}'] [--format table]`
- Helpers: `gws +<name>` (e.g. inbox triage, standup) — syntax differs from raw calls; check `gws +<name> --help`.
