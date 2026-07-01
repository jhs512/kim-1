// Resolve edges (id → full document name) at projection time. Pure. (issue 03, ADR-0002)

import { docName } from "./doc-name.mjs";

export function buildIndex(nodes) {
  const idToName = {}, idToTitle = {};
  for (const n of nodes) {
    idToName[n.id] = docName(n);
    idToTitle[n.id] = n.title;
  }
  return { idToName, idToTitle };
}

export function resolveEdges(node, { idToName, idToTitle }) {
  return (node.edges || []).map(({ rel, to }) => {
    const targetName = idToName[to];
    return targetName
      ? { rel, targetName, targetTitle: idToTitle[to], resolved: true }
      : { rel, targetName: `(미해석: ${to})`, targetTitle: "", resolved: false };
  });
}
