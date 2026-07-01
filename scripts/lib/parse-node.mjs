// Parse one .md vault node into a typed object. Pure, no I/O. (issue 01)

export class NodeError extends Error {}

const REQUIRED = ["id", "no", "kind", "namespace", "visibility", "title"];
const stripComment = (s) => s.replace(/\s+#.*$/, "").trim();

export function parseNode(text) {
  const lines = text.split(/\r?\n/);
  if (lines[0].trim() !== "---") throw new NodeError("missing frontmatter");
  let j = 1;
  const fm = [];
  while (j < lines.length && lines[j].trim() !== "---") fm.push(lines[j++]);
  const body = lines.slice(j + 1).join("\n").trim();

  const node = { aliases: [], edges: [] };
  for (let k = 0; k < fm.length; k++) {
    const line = fm[k];
    if (/^\s*-\s*rel:/.test(line)) {
      const rel = stripComment(line.replace(/^\s*-\s*rel:\s*/, ""));
      const to = stripComment((fm[k + 1] || "").replace(/^\s*to:\s*/, ""));
      node.edges.push({ rel, to });
      k++;
      continue;
    }
    if (/^\s*edges:\s*$/.test(line)) continue;
    const m = line.match(/^(\w+):\s*(.*)$/);
    if (!m) continue;
    const key = m[1];
    const val = stripComment(m[2]);
    if (key === "aliases") {
      node.aliases = val.replace(/^\[|\]$/g, "").split(",").map((s) => s.trim()).filter(Boolean);
    } else {
      node[key] = val;
    }
  }

  for (const f of REQUIRED) {
    if (node[f] === undefined || node[f] === "") throw new NodeError(`missing required field: ${f}`);
  }
  if (!/^-?\d+$/.test(node.no)) throw new NodeError(`no must be an integer: ${node.no}`);
  node.no = Number(node.no);
  if (node.visibility !== "public" && node.visibility !== "private") {
    throw new NodeError(`visibility must be public|private: ${node.visibility}`);
  }

  return { ...node, body };
}
