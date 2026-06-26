import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function MarkdownRenderer({ content = "" }) {
  if (!content) return null;

  // Split content by triple backticks to find code blocks
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-4 leading-relaxed text-sm text-surface-text">
      {parts.map((part, index) => {
        if (part.startsWith("```") && part.endsWith("```")) {
          // Extract language and code code snippet
          const match = part.match(/```(\w*)\n([\s\S]*?)```/);
          const language = match ? match[1] : "";
          const code = match ? match[2] : part.slice(3, -3).trim();

          return (
            <div key={index} className="overflow-hidden rounded-xl border border-surface-border my-4 shadow-sm">
              <div className="bg-surface-bg border-b border-surface-border px-4 py-2 flex justify-between items-center text-xs font-semibold text-surface-muted select-none">
                <span>{language || "code"}</span>
                <span className="uppercase text-[9px] tracking-wider bg-brand-500/10 text-brand-600 dark:text-brand-400 px-1.5 py-0.5 rounded-md">code</span>
              </div>
              <SyntaxHighlighter
                language={language || "javascript"}
                style={atomDark}
                customStyle={{
                  margin: 0,
                  padding: "1.25rem",
                  fontSize: "0.85rem",
                  lineHeight: "1.6",
                  backgroundColor: "#0d1117",
                }}
              >
                {code.trim()}
              </SyntaxHighlighter>
            </div>
          );
        } else {
          // Process inline code blocks `code`
          const subparts = part.split(/(`[^`\n]+`)/g);
          return (
            <p key={index} className="whitespace-pre-wrap leading-relaxed">
              {subparts.map((subpart, subIdx) => {
                if (subpart.startsWith("`") && subpart.endsWith("`")) {
                  return (
                    <code
                      key={subIdx}
                      className="px-1.5 py-0.5 mx-0.5 rounded-md bg-brand-50/50 dark:bg-brand-500/10 border border-brand-100 dark:border-brand-500/20 font-mono text-xs text-brand-600 dark:text-brand-400 font-bold"
                    >
                      {subpart.slice(1, -1)}
                    </code>
                  );
                }
                return subpart;
              })}
            </p>
          );
        }
      })}
    </div>
  );
}
