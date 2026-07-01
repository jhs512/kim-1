# 02 — Document naming + title safety

Status: ready-for-agent

Build the targeting document name and make the title slot safe for exact-name opening.
Resolves the space bug (`kim-1_3_facts_private_복리 공식`) found in the prototype.

## Module
`scripts/lib/doc-name.mjs` → `docName(node): string`, `titleSlug(title): string`.

## Acceptance (test-first — `doc-name.test.mjs`)
- `docName` = `{store}_{no}_{visibility}_{namespace}_{titleSlug}` with store `kim-1`.
- `titleSlug` collapses runs of whitespace to a single `-`: `복리 공식 → 복리-공식`.
- Leading/trailing whitespace trimmed before slugging.
- Underscores in the raw title are rejected or replaced (they collide with the 4 slot
  separators) — pick replacement `-` and test it.
- Korean/unicode letters are preserved (only whitespace/underscore are transformed).
- `docName` for the 3 vault nodes: `kim-1_1_private_concepts_복리`,
  `kim-1_2_private_concepts_단리`, `kim-1_3_private_facts_복리-공식`.

## Notes
Only the **name slot** is slugged; the human `title` field in frontmatter/metadata cell
is untouched. Update ADR-0001/0002 wording if the slug rule needs to be recorded.
