// Build the targeting document name; make the title slot safe for exact-name
// opening (ADR-0002 traversal). Pure. (issue 02)

const STORE = "kim-1";

// Only whitespace and the slot-separator `_` are transformed; unicode letters kept.
export function titleSlug(title) {
  return title.trim().replace(/[\s_]+/g, "-");
}

export function docName(node) {
  return `${STORE}_${node.no}_${node.visibility}_${node.namespace}_${titleSlug(node.title)}`;
}
