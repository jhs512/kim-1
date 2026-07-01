# Knowledge is projected as one spreadsheet per node, targeted by document name

The vault (atomic typed-markdown nodes) is the source of truth; after each knowledge-work session it is projected one-way into Google Drive as **one spreadsheet document per node** (strict 1:1), which the phone Gemini reads. We deliberately reject the eb/k4 pattern of aggregating knowledge into a single CSV/spreadsheet, and reject any Cloudflare/Pages publish.

Because **Gemini Live ignores which Drive folder a sheet lives in**, a document cannot be targeted by folder; instead every document name encodes its targeting: `{store}_{no}_{visibility}_{namespace}_{title}` (e.g. `kim-1_7_private_concepts_...`). This is how "only kim-1 knowledge" is selected among all of a person's Google docs, and how one project maps to exactly one knowledge store. Sheets are nonetheless filed under `kim-1/{namespace}/` folders for human browsing — organizational only, not a targeting mechanism.

## Consequences

- Many small documents rather than one big sheet; sync creates/updates one sheet per node.
- Traversal is document-to-document by name (see ADR-0002), not row lookup in an index.
