import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { parseNode, NodeError } from "./parse-node.mjs";

const VAULT = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "vault");
const withFm = (fm) => `---\n${fm}\n---\nbody`;
const REQ = "id: a\nno: 1\nkind: concept\nnamespace: concepts\nvisibility: private\ntitle: t";

const MINIMAL = `---
id: cpt-x
no: 5
kind: concept
namespace: concepts
visibility: private
title: 엑스
---

본문 한 줄.`;

test("parses a minimal valid node's required fields, body, and empty defaults", () => {
  const n = parseNode(MINIMAL);
  assert.equal(n.id, "cpt-x");
  assert.equal(n.no, 5);
  assert.equal(n.kind, "concept");
  assert.equal(n.namespace, "concepts");
  assert.equal(n.visibility, "private");
  assert.equal(n.title, "엑스");
  assert.equal(n.body, "본문 한 줄.");
  assert.deepEqual(n.aliases, []);
  assert.deepEqual(n.edges, []);
});

test("no is coerced to integer; non-integer throws", () => {
  assert.equal(parseNode(withFm(REQ.replace("no: 1", "no: 42"))).no, 42);
  assert.throws(() => parseNode(withFm(REQ.replace("no: 1", "no: x"))), NodeError);
});

test("visibility must be public|private", () => {
  assert.equal(parseNode(withFm(REQ.replace("private", "public"))).visibility, "public");
  assert.throws(() => parseNode(withFm(REQ.replace("private", "secret"))), NodeError);
});

test("missing a required field throws NodeError naming it", () => {
  assert.throws(
    () => parseNode(withFm(REQ.replace("title: t", "").trim())),
    (e) => e instanceof NodeError && /title/.test(e.message),
  );
});

test("aliases inline array parses to trimmed list", () => {
  const n = parseNode(withFm(`${REQ}\naliases: [복리, 복리 이자, compound interest]`));
  assert.deepEqual(n.aliases, ["복리", "복리 이자", "compound interest"]);
});

test("edges list parses to {rel,to} pairs", () => {
  const n = parseNode(withFm(`${REQ}\nedges:\n  - rel: defined_by\n    to: fct-y\n  - rel: contrasts_with\n    to: cpt-z`));
  assert.deepEqual(n.edges, [
    { rel: "defined_by", to: "fct-y" },
    { rel: "contrasts_with", to: "cpt-z" },
  ]);
});

test("trailing # comments are stripped from scalar and edge values", () => {
  const n = parseNode(withFm(`${REQ.replace("no: 1", "no: 1  # 불변")}\nedges:\n  - rel: defines  # rel comment\n    to: cpt-z   # 대상`));
  assert.equal(n.no, 1);
  assert.deepEqual(n.edges, [{ rel: "defines", to: "cpt-z" }]);
});

test("body is text after closing ---, trimmed, multi-line preserved", () => {
  const n = parseNode(`---\n${REQ}\n---\n\n첫 줄\n둘째 줄\n`);
  assert.equal(n.body, "첫 줄\n둘째 줄");
});

test("all 3 existing vault nodes parse without error", () => {
  for (const rel of ["concepts/1_compound-interest.md", "concepts/2_simple-interest.md", "facts/3_compound-formula.md"]) {
    const n = parseNode(readFileSync(join(VAULT, rel), "utf8"));
    assert.ok(Number.isInteger(n.no) && n.id && n.title);
  }
});
