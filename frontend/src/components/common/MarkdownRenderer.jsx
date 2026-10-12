import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';

/**
 * Safe, beautiful Markdown renderer with code syntax highlighting,
 * GFM table support, and copy buttons for code fences.
 */
export default function MarkdownRenderer({ content, className = "" }) {
  if (!content) return null;

  return (
    <div className={`prose max-w-none text-gray-800 text-sm leading-relaxed ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Render multi-line code blocks or inline code safely
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';
            const codeString = String(children).replace(/\n$/, '');

            if (!inline && match) {
              return (
                <CodeBlockWithCopy language={language} code={codeString} />
              );
            }

            // Inline code snippet styling (e.g. `const x = 10`)
            return (
              <code
                className="bg-gray-100 text-purple-700 font-mono text-xs 
                           px-1.5 py-0.5 rounded border border-gray-200"
                {...props}
              >
                {children}
              </code>
            );
          },

          // Customize standard Markdown tags with Tailwind typography
          p({ children }) {
            return <p className="mb-2 last:mb-0">{children}</p>;
          },
          ul({ children }) {
            return <ul className="list-disc pl-5 mb-3 space-y-1">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="list-decimal pl-5 mb-3 space-y-1">{children}</ol>;
          },
          li({ children }) {
            return <li className="text-gray-700">{children}</li>;
          },
          blockquote({ children }) {
            return (
              <blockquote className="border-l-4 border-blue-500 pl-4 py-1 my-2 
                                     bg-blue-50/50 text-gray-700 italic text-xs rounded-r">
                {children}
              </blockquote>
            );
          },
          table({ children }) {
            return (
              <div className="overflow-x-auto my-3 border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 text-xs text-left">
                  {children}
                </table>
              </div>
            );
          },
          thead({ children }) {
            return <thead className="bg-gray-100 font-semibold text-gray-700">{children}</thead>;
          },
          th({ children }) {
            return <th className="px-3 py-2 border-b border-gray-200">{children}</th>;
          },
          td({ children }) {
            return <td className="px-3 py-2 border-b border-gray-100">{children}</td>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

/**
 * Sub-component for rendering Syntax Highlighted Code Blocks with a Copy Button
 */
function CodeBlockWithCopy({ language, code }) {
  const [copied, setCopied] = React.useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  }

  return (
    <div className="my-3 rounded-xl overflow-hidden border border-gray-800 bg-[#1e1e1e] text-xs">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-[#252526] border-b border-gray-800 text-gray-400 font-mono">
        <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
          {language || 'code'}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-[11px] hover:text-white transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-green-400" />
              <span className="text-green-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Syntax Highlighted Code */}
      <SyntaxHighlighter
        language={language || 'text'}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: '1rem',
          fontSize: '0.8125rem',
          lineHeight: '1.5',
          background: '#1e1e1e',
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}