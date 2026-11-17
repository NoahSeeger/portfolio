import SyntaxHighlighter from "react-syntax-highlighter/dist/esm/prism-light";
import vscDarkPlus from "react-syntax-highlighter/dist/esm/styles/prism/vsc-dark-plus";
import javascript from "react-syntax-highlighter/dist/esm/languages/prism/javascript";
import typescript from "react-syntax-highlighter/dist/esm/languages/prism/typescript";
import jsx from "react-syntax-highlighter/dist/esm/languages/prism/jsx";
import python from "react-syntax-highlighter/dist/esm/languages/prism/python";
import swift from "react-syntax-highlighter/dist/esm/languages/prism/swift";
import bash from "react-syntax-highlighter/dist/esm/languages/prism/bash";
import json from "react-syntax-highlighter/dist/esm/languages/prism/json";
import css from "react-syntax-highlighter/dist/esm/languages/prism/css";
import markup from "react-syntax-highlighter/dist/esm/languages/prism/markup";
import markdown from "react-syntax-highlighter/dist/esm/languages/prism/markdown";

SyntaxHighlighter.registerLanguage("javascript", javascript);
SyntaxHighlighter.registerLanguage("js", javascript);
SyntaxHighlighter.registerLanguage("typescript", typescript);
SyntaxHighlighter.registerLanguage("ts", typescript);
SyntaxHighlighter.registerLanguage("jsx", jsx);
SyntaxHighlighter.registerLanguage("tsx", jsx);
SyntaxHighlighter.registerLanguage("python", python);
SyntaxHighlighter.registerLanguage("py", python);
SyntaxHighlighter.registerLanguage("swift", swift);
SyntaxHighlighter.registerLanguage("bash", bash);
SyntaxHighlighter.registerLanguage("shell", bash);
SyntaxHighlighter.registerLanguage("json", json);
SyntaxHighlighter.registerLanguage("css", css);
SyntaxHighlighter.registerLanguage("html", markup);
SyntaxHighlighter.registerLanguage("markup", markup);
SyntaxHighlighter.registerLanguage("markdown", markdown);
SyntaxHighlighter.registerLanguage("md", markdown);

export default function HighlightedCode({ language, children }) {
  return (
    <SyntaxHighlighter
      style={vscDarkPlus}
      language={language}
      PreTag="pre"
      customStyle={{ margin: 0, padding: "1rem", background: "transparent", fontSize: "0.875rem", lineHeight: "1.5" }}
    >
      {children}
    </SyntaxHighlighter>
  );
}
