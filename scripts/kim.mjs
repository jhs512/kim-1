// kim.mjs — kim-1 vault graph CLI (deterministic engine for kim-1-ask/check/clean).
// Reads the markdown vault; read-only. Usage:
//   node scripts/kim.mjs list
//   node scripts/kim.mjs search <질의>
//   node scripts/kim.mjs node <id>
//   node scripts/kim.mjs neighbors <id> [--depth N]
//   node scripts/kim.mjs health

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { parseNode } from "./lib/parse-node.mjs";
import { searchNodes, neighbors, health } from "./lib/graph.mjs";
import { docName } from "./lib/doc-name.mjs";

const VAULT = join(process.cwd(), "vault");

function walk(dir) {
  const out = [];
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (e.endsWith(".md")) out.push(p);
  }
  return out;
}

function loadVault() {
  return walk(VAULT).map((p) => parseNode(readFileSync(p, "utf8")));
}

const [cmd, ...rest] = process.argv.slice(2);
const nodes = loadVault();
const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));

function printNode(n) {
  console.log(`● ${n.id}  [${n.type}/${n.namespace}]  conf=${n.confidence ?? "?"}`);
  console.log(`  title: ${n.title}`);
  console.log(`  doc:   ${docName(n)}`);
  if (n.summary) console.log(`  summary: ${n.summary}`);
  for (const e of n.edges || []) console.log(`  → ${e.type}(${e.weight ?? "?"}) ${e.target}  ${e.note || ""}`);
  const backlinks = nodes.filter((m) => (m.edges || []).some((e) => e.target === n.id)).map((m) => m.id);
  if (backlinks.length) console.log(`  ← backlinks: ${backlinks.join(", ")}`);
}

switch (cmd) {
  case "list":
    for (const n of nodes) console.log(`${n.no}\t${n.type}\t${n.id}\t${n.title}`);
    break;
  case "search":
    for (const r of searchNodes(nodes, rest.join(" "))) console.log(`${r.score}\t${r.id}\t${r.title}`);
    break;
  case "node": {
    const n = byId[rest[0]];
    if (!n) { console.error(`no such node: ${rest[0]}`); process.exit(1); }
    printNode(n);
    break;
  }
  case "neighbors": {
    const di = rest.indexOf("--depth");
    const depth = di >= 0 ? Number(rest[di + 1]) : 1;
    const ids = neighbors(nodes, rest[0], depth);
    for (const id of ids) console.log(`${id}\t${byId[id]?.title ?? "?"}`);
    break;
  }
  case "health": {
    const h = health(nodes);
    console.log(`nodes: ${nodes.length}`);
    console.log(`orphans (${h.orphans.length}): ${h.orphans.join(", ") || "—"}`);
    console.log(`low confidence <0.5 (${h.lowConfidence.length}): ${h.lowConfidence.join(", ") || "—"}`);
    console.log(`empty summary (${h.emptySummary.length}): ${h.emptySummary.join(", ") || "—"}`);
    console.log(`broken edges (${h.brokenEdges.length}): ${h.brokenEdges.map((e) => `${e.from}→${e.to}`).join(", ") || "—"}`);
    break;
  }
  default:
    console.log("usage: kim.mjs <list|search|node|neighbors|health> ...");
    process.exit(cmd ? 1 : 0);
}
