// Group Markdown at its natural headings without parsing it a second time.
// remark-rehype renders each container as a semantic section.
export function remarkReadingSections() {
  return (tree) => {
    const sections = [];
    let section;
    for (const node of tree.children) {
      if (!section || (node.type === "heading" && node.depth <= 2)) {
        section = { type: "readingSection", data: { hName: "section", hProperties: { className: ["reading-section"], "data-reading-reveal": "" } }, children: [] };
        sections.push(section);
      }
      section.children.push(node);
    }
    tree.children = sections;
  };
}
