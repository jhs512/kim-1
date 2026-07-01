# 01 — Node parser & schema validation

Status: ready-for-agent

Parse one `.md` node file into a typed object and validate its schema. Pure, no I/O.

## Module
`scripts/lib/parse-node.mjs` → `parseNode(text): Node` (throws `NodeError` on invalid).

`Node = { id, no, kind, namespace, visibility, title, aliases[], summary, edges[{rel,to}], body }`

## Acceptance (test-first — `parse-node.test.mjs`)
- Parses required scalars `id,no,kind,namespace,visibility,title` from frontmatter.
- `no` is coerced to an **integer**; non-integer (`no: x`) throws.
- `visibility` must be `public|private`; anything else throws.
- Missing any required field throws `NodeError` naming the field.
- `aliases: [a, b, c]` → `["a","b","c"]`; absent → `[]`.
- `edges:` list of `- rel: … / to: …` pairs → `[{rel,to}]`; absent → `[]`.
- Trailing `# comment` on a scalar/edge line is stripped from the value.
- `body` = text after the closing `---`, trimmed; multi-line preserved.
- Round-trips all 3 existing vault nodes without error.

## Notes
Extract the prototype parser from `scripts/sync-to-drive.mjs` and harden it under tests.
