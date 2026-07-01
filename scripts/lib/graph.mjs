// Deterministic graph operations over the parsed vault. Pure, no I/O.
// The engine kim-1-ask / kim-1-check / kim-1-clean orchestrate.

const LOW_CONFIDENCE = 0.5;

// rank by number of fields (title, summary, tags, body, id) matching the query substring
export function searchNodes(nodes, query) {
  const q = query.toLowerCase();
  const scored = [];
  for (const n of nodes) {
    const fields = [n.id, n.title, n.summary, (n.tags || []).join(" "), n.body];
    const score = fields.filter((f) => (f || "").toLowerCase().includes(q)).length;
    if (score > 0) scored.push({ id: n.id, title: n.title, score });
  }
  return scored.sort((a, b) => b.score - a.score);
}

// ids reachable from `id` within `depth` hops, following edges in both directions (never self)
export function neighbors(nodes, id, depth = 1) {
  const out = new Map(); // id → set of target ids (outgoing)
  const inc = new Map(); // id → set of source ids (incoming)
  for (const n of nodes) {
    for (const e of n.edges || []) {
      (out.get(n.id) || out.set(n.id, new Set()).get(n.id)).add(e.target);
      (inc.get(e.target) || inc.set(e.target, new Set()).get(e.target)).add(n.id);
    }
  }
  const seen = new Set([id]);
  let frontier = [id];
  for (let d = 0; d < depth; d++) {
    const next = [];
    for (const cur of frontier) {
      for (const set of [out.get(cur), inc.get(cur)]) {
        for (const nb of set || []) if (!seen.has(nb)) { seen.add(nb); next.push(nb); }
      }
    }
    frontier = next;
  }
  seen.delete(id);
  return [...seen];
}

export function health(nodes) {
  const known = new Set(nodes.map((n) => n.id));
  const linked = new Set();
  for (const n of nodes) for (const e of n.edges || []) { linked.add(n.id); if (known.has(e.target)) linked.add(e.target); }
  const orphans = [], lowConfidence = [], emptySummary = [], brokenEdges = [];
  for (const n of nodes) {
    if (!linked.has(n.id)) orphans.push(n.id);
    if (typeof n.confidence === "number" && n.confidence < LOW_CONFIDENCE) lowConfidence.push(n.id);
    if (!n.summary) emptySummary.push(n.id);
    for (const e of n.edges || []) if (!known.has(e.target)) brokenEdges.push({ from: n.id, to: e.target });
  }
  return { orphans, lowConfidence, emptySummary, brokenEdges };
}
