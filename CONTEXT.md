# kim-1

kim-1 is a personal knowledge assistant instance: an atomic typed-markdown knowledge graph, versioned locally in git, projected one-way to a Google Spreadsheet that a phone Gemini reads for graph lookup. Derived from the `kim` product, run entirely locally (no CI).

## Language

**Vault**:
The atomic typed-markdown knowledge graph — each node a small markdown file with typed frontmatter, connected by typed edges. Borrows the infinite-brain *structure* only; the Obsidian app is out of scope. The **source of truth**.
_Avoid_: notes, Obsidian vault, database

**Node**:
One atomic markdown file, of one typed kind (concept, fact, decision, event, source, …). Knowledge is decomposed into nodes, never stored as long documents.
_Avoid_: note, document, page

**Derived repo**:
This `kim-1` git repository — an instance derived from the `kim` product. Git is only versioned local storage for the vault; it runs no GitHub Actions and no remote automation.
_Avoid_: fork, clone

**Knowledge store**:
An independent body of knowledge a person can access — e.g. `kim-1` (personal), `kim-2`, a team store. One person may hold several. **One project manages exactly one store** (this project = `kim-1`). The store name is the top-level targeting key.
_Avoid_: vault (that's the local files), project, workspace

**Node sheet**:
The Google Spreadsheet projection of **one** node — a strict **1:1** with the markdown node (one node → one sheet document). The read surface the phone Gemini queries; generated one-way, never edited by hand, never synced back. There is **no aggregated sheet** — unlike eb/k4, nothing is gathered into a single CSV/spreadsheet, and there is no Cloudflare/Pages publish.
_Avoid_: graph sheet, mirror, aggregate, export

**Document naming convention**:
Because Gemini Live ignores which Drive folder a sheet lives in, targeting is encoded in the document *name*: `{store}_{no}_{visibility}_{namespace}_{title}` (e.g. `kim-1_7_private_concepts_...`). This is how "only kim-1 knowledge" is selected among all of a person's Google docs. Sheets are also organized on disk as `kim-1/{namespace}/{document}` — folders are for **human browsing only**, never for targeting.
_Avoid_: path targeting, folder targeting

**id**:
A node's original, stable identifier (from the infinite-brain node itself). Never changes. What edges reference.
_Avoid_: no, key

**no**:
kim-1's own sequential number for a node — **globally unique within the store, regardless of namespace** (1, 2, 3, …). Distinct from `id`. Immutable once assigned. Appears in **both** the local markdown filename and the `{no}` slot of the sheet document name.
_Avoid_: id, index, docNumber

**Namespace**:
A node-type partition of the store, taken from the infinite-brain folders (`concepts`, `facts`, `decisions`, `events`, `sources`, `hypotheses`, `patterns`, `playbooks`, `pillars`, `questions`, `contacts`, `references`, `bookmarks`, `logs`, `notes`, `tasks`, `custom`, …). A default set ships; new namespaces can be added. The graph sheet is partitioned into documents by namespace.
_Avoid_: category, tag, folder (the folder IS the namespace, but the concept is the type)

**Visibility**:
A per-node public/private flag (the "access modifier") carried in both filenames. **Immutable once set** — chosen so it never breaks the full document names embedded in edges.
_Avoid_: access control, permission

**Phone Gemini**:
The phone-side Gemini (incl. Gemini Live). A read-only **consumer** that reads individual node sheets by name and follows edges to traverse — it does not produce or edit knowledge (kim-1 is not bidirectional).
_Avoid_: producer, agent, watcher

**Knowledge work**:
A session of building or maintaining the vault (decomposing raw material into nodes, querying, organizing, health checks) done locally in Claude Code. Finishing a knowledge-work session is what triggers the sync to Drive/the graph sheet.
_Avoid_: sync, task, job
