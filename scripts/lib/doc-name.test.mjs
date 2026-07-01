import { test } from "node:test";
import assert from "node:assert/strict";
import { docName, titleSlug } from "./doc-name.mjs";

const node = (over) => ({ no: 1, namespace: "concepts", visibility: "private", title: "복리", ...over });

test("docName builds the 4-slot targeting name with store kim-1", () => {
  assert.equal(docName(node()), "kim-1_1_private_concepts_복리");
});

test("titleSlug collapses whitespace runs to a single hyphen", () => {
  assert.equal(titleSlug("복리 공식"), "복리-공식");
  assert.equal(titleSlug("a   b\tc"), "a-b-c");
});

test("titleSlug trims leading/trailing whitespace before slugging", () => {
  assert.equal(titleSlug("  복리 공식  "), "복리-공식");
});

test("titleSlug replaces underscores (they collide with slot separators)", () => {
  assert.equal(titleSlug("a_b"), "a-b");
});

test("titleSlug preserves korean/unicode letters", () => {
  assert.equal(titleSlug("복리"), "복리");
});

test("docName for the 3 vault nodes, including the spaced title", () => {
  assert.equal(docName(node()), "kim-1_1_private_concepts_복리");
  assert.equal(docName(node({ no: 2, title: "단리" })), "kim-1_2_private_concepts_단리");
  assert.equal(docName(node({ no: 3, namespace: "facts", title: "복리 공식" })), "kim-1_3_private_facts_복리-공식");
});
