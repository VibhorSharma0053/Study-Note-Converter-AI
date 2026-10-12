import { Code2, Search } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import MarkdownRenderer from '../common/MarkdownRenderer';

export default function CodeSection({ snippets = [], searchQuery = "" }) {
  const filteredSnippets = snippets.filter((s) => {
    const query = searchQuery.toLowerCase();
    return (
      (s.title?.toLowerCase() ?? "").includes(query) ||
      (s.language?.toLowerCase() ?? "").includes(query) ||
      (s.explanation?.toLowerCase() ?? "").includes(query) ||
      (s.code?.toLowerCase() ?? "").includes(query)
    );
  });

  if (snippets.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
        <Code2 className="w-12 h-12 mx-auto text-gray-300 mb-3" />
        <p className="text-gray-500 text-sm">No code snippets were extracted from this transcript.</p>
      </div>
    );
  }

  if (filteredSnippets.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
        <Search className="w-10 h-10 mx-auto text-gray-300 mb-2" />
        <p className="text-gray-600 font-medium">No code snippets match "{searchQuery}"</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {filteredSnippets.map((snippet, index) => (
        <CodeCard key={index} snippet={snippet} />
      ))}
    </div>
  );
}

function CodeCard({ snippet }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(snippet.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-2xs">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-5 py-3 bg-[#252526] text-white">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-sm text-gray-200">{snippet.title}</span>
          <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-600/30 text-blue-400 border border-blue-500/30 rounded">
            {snippet.language || "code"}
          </span>
        </div>

        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs text-gray-300 hover:text-white hover:bg-white/10 rounded transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-400" />
              <span className="text-green-400 font-medium">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Syntax Highlighted Code Window */}
      <SyntaxHighlighter
        language={snippet.language?.toLowerCase() || 'text'}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: '1.25rem',
          fontSize: '0.85rem',
          lineHeight: '1.6',
          background: '#1e1e1e',
        }}
      >
        {snippet.code}
      </SyntaxHighlighter>

      {/* Code Explanation rendered via Markdown */}
      {snippet.explanation && (
        <div className="px-5 py-4 bg-gray-50 border-t border-gray-200 text-xs">
          <span className="font-semibold text-gray-700 uppercase tracking-wider block mb-1">
            Explanation
          </span>
          <MarkdownRenderer content={snippet.explanation} />
        </div>
      )}
    </div>
  );
}