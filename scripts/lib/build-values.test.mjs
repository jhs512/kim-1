import { test } from "node:test";
import assert from "node:assert/strict";
import { buildValues } from "./build-values.mjs";

const node1 = {
  kind: "concept", no: 1, namespace: "concepts", visibility: "private",
  id: "cpt-compound", title: "복리",
  aliases: ["복리", "이자에 이자"], summary: "이자에도 이자가 붙는다.",
  body: "첫 줄\n둘째 줄",
};
const edges1 = [
  { rel: "contrasts_with", targetName: "kim-1_2_concepts_private_단리", targetTitle: "단리" },
  { rel: "defined_by", targetName: "kim-1_3_facts_private_복리-공식", targetTitle: "복리 공식" },
];

test("builds the full node-sheet cell layout (metadata + body + edges table)", () => {
  assert.deepEqual(buildValues(node1, edges1), [
    ["kind", "concept"],
    ["no", "1"],
    ["namespace", "concepts"],
    ["visibility", "private"],
    ["id", "cpt-compound"],
    ["title", "복리"],
    ["aliases", "복리, 이자에 이자"],
    ["summary", "이자에도 이자가 붙는다."],
    ["body", "첫 줄\n둘째 줄"],
    [],
    ["── edges ──"],
    ["rel", "target_doc_name", "target_title"],
    ["contrasts_with", "kim-1_2_concepts_private_단리", "단리"],
    ["defined_by", "kim-1_3_facts_private_복리-공식", "복리 공식"],
  ]);
});

test("a node with no edges has the header rows but no edge rows", () => {
  const rows = buildValues({ ...node1, aliases: [] }, []);
  assert.deepEqual(rows[rows.length - 1], ["rel", "target_doc_name", "target_title"]);
  assert.equal(rows.find((r) => r[0] === "aliases")[1], "");
});
