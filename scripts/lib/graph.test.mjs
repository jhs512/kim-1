import { test } from "node:test";
import assert from "node:assert/strict";
import { searchNodes, neighbors, health } from "./graph.mjs";

const N = (o) => ({ tags: [], edges: [], body: "", summary: "", confidence: 1, ...o });
const nodes = [
  N({ id: "concept-compound", title: "복리", summary: "이자에 이자", tags: ["finance"], confidence: 0.95,
      edges: [{ target: "fact-formula", type: "related_to", weight: 0.8, note: "" }] }),
  N({ id: "concept-simple", title: "단리", summary: "원금에만", tags: ["finance"], confidence: 0.9,
      edges: [{ target: "concept-compound", type: "related_to", weight: 0.6, note: "" }] }),
  N({ id: "fact-formula", title: "복리 공식", summary: "A=P(1+r/n)^nt", tags: ["formula"], confidence: 1.0,
      edges: [{ target: "concept-compound", type: "supports", weight: 0.9, note: "" }] }),
  N({ id: "concept-orphan", title: "외톨이", summary: "연결 없음", tags: [], confidence: 0.3, edges: [] }),
];

test("searchNodes ranks by number of fields matching the query", () => {
  const r = searchNodes(nodes, "복리");
  assert.equal(r[0].id, "concept-compound"); // matches title + summary → higher than title only
  assert.ok(r.map((x) => x.id).includes("fact-formula"));
  assert.ok(!r.map((x) => x.id).includes("concept-simple"));
});

test("searchNodes is case-insensitive and matches tags/id", () => {
  assert.ok(searchNodes(nodes, "FINANCE").map((x) => x.id).includes("concept-compound"));
  assert.ok(searchNodes(nodes, "formula").map((x) => x.id).includes("fact-formula"));
});

test("neighbors traverses edges both directions up to depth", () => {
  const d1 = neighbors(nodes, "concept-compound", 1).sort();
  assert.deepEqual(d1, ["concept-simple", "fact-formula"]); // out: fact-formula; in: simple, formula
  const d2 = neighbors(nodes, "fact-formula", 2).sort();
  assert.ok(d2.includes("concept-compound") && d2.includes("concept-simple"));
  assert.ok(!d2.includes("fact-formula")); // never includes self
});

test("health flags orphans, low confidence, broken edges", () => {
  const withBroken = [...nodes, N({ id: "x", title: "x", confidence: 0.9, edges: [{ target: "ghost", type: "related_to", weight: 0.5, note: "" }] })];
  const h = health(withBroken);
  assert.ok(h.orphans.includes("concept-orphan"));
  assert.ok(h.lowConfidence.includes("concept-orphan")); // 0.3 < 0.5
  assert.ok(h.brokenEdges.some((e) => e.from === "x" && e.to === "ghost"));
});
