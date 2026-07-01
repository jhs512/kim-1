// Build the node-sheet 2D cell array from a resolved node. Pure, no I/O. (issue 04)

export function buildValues(node, resolvedEdges) {
  return [
    ["kind", node.kind],
    ["no", String(node.no)],
    ["namespace", node.namespace],
    ["visibility", node.visibility],
    ["id", node.id],
    ["title", node.title],
    ["aliases", (node.aliases || []).join(", ")],
    ["summary", node.summary || ""],
    ["body", node.body],
    [],
    ["── edges ──"],
    ["rel", "target_doc_name", "target_title"],
    ...resolvedEdges.map((e) => [e.rel, e.targetName, e.targetTitle]),
  ];
}
