# 06 — Drive sync driver + CLI

Status: ready-for-agent

Thin imperative shell that wires the pure modules to gws and projects the vault to Drive.
Not unit-mocked (network); verified by a manual idempotent-resync check.

## Module
`scripts/sync.mjs` (replaces the prototype `sync-to-drive.mjs`).

Pipeline: `walk vault → parseNode(01) → validateVault(05) [abort on violations]
→ buildIndex/resolveEdges(03) → buildValues(04) → per node: find-by-name → create-or-clear+write`.

## Behavior / acceptance
- Reads all `vault/**/*.md`; aborts with a non-zero exit and prints every violation if
  `validateVault` is non-empty (no partial sync).
- For each node: exact-name Drive lookup → create if absent, else clear `A1:Z2000` + rewrite
  (full re-projection per ADR).
- Persists a manifest (`no → docName → spreadsheetId`) after a successful run, for the next
  run's immutability check and to avoid re-searching.
- **Idempotent**: second consecutive run on an unchanged vault writes the same cells and
  changes no document names (manual check documented here: run twice, diff manifest).
- Handles gws's `Using keyring backend:` stdout prefix when parsing JSON responses
  (prototype bug — strip non-JSON preamble before `JSON.parse`).
- gws auth failure (`auth_method != oauth2`) → clear error, exit non-zero, no writes.

## Manual verification steps
1. `node scripts/sync.mjs` on the 3-node vault → 3 sheets, edges resolved.
2. Re-read `A1:C14` of node 1 → matches `build-values` fixture.
3. Run again → manifest identical, no new documents created.

## Notes
Depends on 01–05. Keep the shell thin: all logic lives in the tested pure modules.
