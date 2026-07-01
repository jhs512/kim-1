# 04 — Node-sheet values builder

Status: ready-for-agent

Turn a resolved node into the exact 2D cell array of the node-sheet layout. Pure, no I/O.

## Module
`scripts/lib/build-values.mjs` → `buildValues(node, resolvedEdges): string[][]`.

## Acceptance (test-first — `build-values.test.mjs`)
Rows, in order:
- `["kind",v] ["no",v] ["namespace",v] ["visibility",v] ["id",v] ["title",v]`
- `["aliases", aliases.join(", ")]`
- `["summary", summary]`
- `["body", body]`  — multi-line kept as a single cell (`\n` inside)
- `[]` (spacer)
- `["── edges ──"]`
- `["rel","target_doc_name","target_title"]`
- one row per edge: `[rel, targetName, targetTitle]`

Tests:
- Node with 0 edges → header rows present, no edge rows after them.
- `aliases` empty → cell is `""` (row still present).
- Cell array for vault node `no=1` deep-equals the expected fixture (incl. both edge rows).
- Function is pure: same input → identical output, no network/fs.

## Notes
Depends on 03 (resolved edges). This is the canonical layout — the prototype's inline
array should be replaced by this module.
