# 03 — Edge resolution (id → full document name)

Status: ready-for-agent

Resolve each edge's `to` (a target `id`) to the target's current full document name and
title, across the whole vault. Implements ADR-0002 at projection time.

## Module
`scripts/lib/resolve-edges.mjs`
- `buildIndex(nodes): {idToName, idToTitle}`
- `resolveEdges(node, index): [{rel, targetName, targetTitle, resolved:boolean}]`

## Acceptance (test-first — `resolve-edges.test.mjs`)
- `buildIndex` maps every node `id` → its `docName` and `title`.
- A resolvable edge yields `{targetName: <docName>, targetTitle, resolved:true}`.
- An edge to an unknown id yields `targetName: "(미해석: <id>)"`, `resolved:false`,
  `targetTitle: ""` — never dropped.
- Uses the slugged `docName` from issue 02 (so `복리 공식` edge → `..._복리-공식`).
- On the 3 vault nodes: 복리 resolves both edges (→ `_2_단리`, `_3_..복리-공식`),
  zero unresolved.

## Notes
Depends on 02 (`docName`). Resolution reads only the in-memory index — no I/O.
