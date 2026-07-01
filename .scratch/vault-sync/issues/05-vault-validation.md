# 05 — Vault-level validation

Status: ready-for-agent

Fail loudly before any network call. Cross-node checks that a single-node parse can't do.
Reports **all** violations, not just the first.

## Module
`scripts/lib/validate-vault.mjs` → `validateVault(nodes, prevManifest?): Violation[]`.

## Acceptance (test-first — `validate-vault.test.mjs`)
- **Duplicate `no`** across nodes → one violation per collision, naming the nodes.
- **Duplicate `id`** across nodes → violation.
- **Orphan edge**: edge `to` not matching any node `id` → violation naming source + target.
- **Immutability** (when `prevManifest` given): a node whose `no`→name changed its
  `visibility` or `no` vs the previous sync → violation (ADR-0002 frozen slots).
- Clean 3-node vault → `[]` (no violations).
- Multiple simultaneous problems → all returned in one array.

## Notes
`prevManifest` = the `manifest.tsv`-equivalent persisted from the last sync (maps `no`→name).
Depends on 01 (Node shape). Immutability check is skippable if no prior manifest exists.
