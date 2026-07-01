import { test } from "node:test";
import assert from "node:assert/strict";
import { buildIndex, resolveEdges } from "./resolve-edges.mjs";

const nodes = [
  { id: "cpt-compound", no: 1, namespace: "concepts", visibility: "private", title: "복리",
    edges: [{ rel: "contrasts_with", to: "cpt-simple" }, { rel: "defined_by", to: "fct-formula" }] },
  { id: "cpt-simple", no: 2, namespace: "concepts", visibility: "private", title: "단리", edges: [] },
  { id: "fct-formula", no: 3, namespace: "facts", visibility: "private", title: "복리 공식", edges: [] },
];

test("buildIndex maps every id to its docName and title", () => {
  const { idToName, idToTitle } = buildIndex(nodes);
  assert.equal(idToName["cpt-simple"], "kim-1_2_private_concepts_단리");
  assert.equal(idToName["fct-formula"], "kim-1_3_private_facts_복리-공식");
  assert.equal(idToTitle["fct-formula"], "복리 공식");
});

test("resolvable edges yield the target's slugged full name + title, resolved=true", () => {
  const idx = buildIndex(nodes);
  const r = resolveEdges(nodes[0], idx);
  assert.deepEqual(r, [
    { rel: "contrasts_with", targetName: "kim-1_2_private_concepts_단리", targetTitle: "단리", resolved: true },
    { rel: "defined_by", targetName: "kim-1_3_private_facts_복리-공식", targetTitle: "복리 공식", resolved: true },
  ]);
});

test("an edge to an unknown id is marked, never dropped", () => {
  const idx = buildIndex(nodes);
  const node = { edges: [{ rel: "cites", to: "src-missing" }] };
  assert.deepEqual(resolveEdges(node, idx), [
    { rel: "cites", targetName: "(미해석: src-missing)", targetTitle: "", resolved: false },
  ]);
});

test("복리 node resolves both edges with zero unresolved", () => {
  const idx = buildIndex(nodes);
  const r = resolveEdges(nodes[0], idx);
  assert.equal(r.filter((e) => !e.resolved).length, 0);
});
