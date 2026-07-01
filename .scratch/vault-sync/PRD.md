# PRD: Vault → Drive node-sheet projection (`sync`)

## Problem

The `kim-1` vault is atomic typed-markdown nodes (source of truth). A phone Gemini
reads knowledge only as **Google node sheets** (one spreadsheet per node), entering by
full-text search and traversing by exact document name. Today that projection exists
only as a throwaway prototype (`scripts/sync-to-drive.mjs`) with no tests, no
validation, and no title-safety guarantees. We need a **reliable, test-driven `sync`
tool** so the vault can grow without silently producing broken sheets.

## Goal

A `sync` command that takes the local vault and produces/updates one Drive node sheet
per node — correctly, idempotently, and with the projection invariants (ADR-0001/0002/0003)
enforced and unit-tested. Built **test-first (TDD)**.

## Design anchors (already decided)

- **ADR-0001** one spreadsheet per node, targeted by document name — no aggregate sheet.
- **ADR-0002** edges embed the full target document name; `no` and `visibility` immutable.
- **ADR-0003** graph entry = full-text search of sheet contents; names carry traversal only.
- **Document name** = `{store}_{no}_{visibility}_{namespace}_{title}`; sheets filed under `kim-1/{namespace}/` (organizational only).
- **Sheet layout** = metadata block (`kind,no,namespace,visibility,id,title,aliases,summary`)
  + `body` cell + `── edges ──` table (`rel | target_doc_name | target_title`).

## Requirements

### R1 — Node parsing & schema (issue 01)
Parse a `.md` node into a typed object. Required frontmatter: `id, no, kind, namespace,
visibility, title`; optional: `aliases[], summary, edges[]`; body = post-frontmatter text.
Reject nodes missing required fields or with a non-integer `no` / invalid `visibility`
(`public|private`).

### R2 — Document naming + title safety (issue 02)
`docName(node)` builds the 4-slot name. The **title slot must be filesystem/URL-safe for
exact-name opening**: collapse whitespace to `-`, so `복리 공식 → 복리-공식`. Slugging is
applied only to the name slot; the human `title` field is unchanged. (Resolves the space
bug found in the prototype.)

### R3 — Edge resolution (issue 03)
Build an `id → docName` map across the whole vault and resolve each edge's `to` (an `id`)
to the target's **current full document name** + title. Unresolved targets are marked
explicitly (`(미해석: <id>)`), never silently dropped.

### R4 — Sheet values builder (issue 04)
Given a resolved node, produce the exact 2D cell array of the layout above. Pure function,
no I/O. `aliases` joined by `", "`; multi-line body kept as one cell with `\n`.

### R5 — Vault-level validation (issue 05)
Before any network call, fail loudly on: duplicate `no`, duplicate `id`, edge pointing to a
non-existent `id`, or a namespace/visibility that violates immutability against the last
synced state (if a manifest exists). Report all violations, not just the first.

### R6 — Drive sync driver + CLI (issue 06)
Thin imperative shell over gws: for each node, find the sheet by exact name → create if
absent, else clear+rewrite (full re-projection). Idempotent: re-running with no vault change
produces no diff. Exposed as one command (`node scripts/sync.mjs` / `kim sync`).

## Non-goals

- No read-back / bidirectional sync (phone Gemini is read-only).
- No aggregate index sheet, no Cloudflare/Pages publish (rejected in ADR-0001).
- No Obsidian integration.
- No automatic `no` assignment in this iteration — `no` is authored in frontmatter.

## Success criteria

- All pure modules (R1–R5) covered by `node:test` unit tests, red-green-refactored.
- `sync` re-run on the current 3-node vault is a no-op (idempotent).
- A node with a spaced title projects to a hyphenated, space-free document name.
- An edge to a missing id surfaces as a validation error, not a broken sheet.

## Test strategy

TDD with Node's built-in `node:test` + `node:assert`. Pure functions (R1–R5) are unit-tested
without network. The R6 driver is a thin shell verified by a manual idempotent-resync check
against Drive (documented in the issue), not unit-mocked.

## Comments

### 2026-07-01 — implemented (TDD)
All 6 issues done. Pure modules built test-first (`node:test`), 28/28 green.

- 01 `scripts/lib/parse-node.mjs` — parse + schema validation (9 tests)
- 02 `scripts/lib/doc-name.mjs` — `docName` + `titleSlug` (6 tests); resolves the spaced-title bug (`복리 공식 → 복리-공식`), recorded in ADR-0002
- 03 `scripts/lib/resolve-edges.mjs` — id→full-name resolution, unresolved marked (4 tests)
- 04 `scripts/lib/build-values.mjs` — node-sheet cell layout (2 tests)
- 05 `scripts/lib/validate-vault.mjs` — dup no/id, orphan edge, immutability (7 tests)
- 06 `scripts/build-payloads.mjs` (node) + `scripts/sync.sh` (bash I/O shell) — CLI is
  `bash scripts/sync.sh` (gws is an extensionless native binary that Node's Windows spawn
  can't launch, so the thin shell is bash). Prototype `sync-to-drive.mjs` removed.

Verified against Drive: 3 node sheets projected, edges resolved to slugged names; **idempotent**
(second run created 0 documents, manifest unchanged); stale spaced-name sheet trashed;
manifest persisted at `.sync/manifest.tsv` (drives the immutability check on next sync).
