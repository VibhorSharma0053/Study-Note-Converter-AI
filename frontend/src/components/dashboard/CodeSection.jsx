import { useState } from 'react';
import { Code2, Copy, Check } from 'lucide-react';

/**
 * Displays code snippets with syntax highlighting placeholder
 * and copy-to-clipboard functionality.
 * 
 * Note: Full syntax highlighting will be added in Phase 10.
 * For now, we use a styled <pre> block.
 */
export default function CodeSection({ snippets = [] }) {
  if (snippets.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <Code2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p className="text-sm">No code snippets were extracted from this transcript.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {snippets.map((snippet, index) => (
        <CodeBlock key={index} snippet={snippet} />
      ))}
    </div>
  );
}

/**
 * A single code block with header, copy button, and code display.
 */
function CodeBlock({ snippet }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      // The Clipboard API lets us copy text to the user's clipboard
      await navigator.clipboard.writeText(snippet.code);
      setCopied(true);
      // Reset the "Copied!" indicator after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      {/* Header bar */}
      <div className="flex items-center justify-between bg-gray-800 px-4 py-2">
        <div className="flex items-center gap-2">
          {/* Language badge */}
          <span className="text-xs font-mono font-semibold text-gray-300 uppercase">
            {snippet.language || 'code'}
          </span>
          <span className="text-gray-600">•</span>
          <span className="text-sm text-gray-300">{snippet.title}</span>
        </div>
        
        {/* Copy button */}
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-gray-700"
          aria-label="Copy code to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-400" />
              <span className="text-green-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code content */}
      <pre className="bg-gray-900 p-4 overflow-x-auto">
        <code className="text-sm font-mono text-gray-100 leading-relaxed">
          {snippet.code}
        </code>
      </pre>

      {/* Explanation */}
      {snippet.explanation && (
        <div className="bg-gray-50 border-t border-gray-200 px-4 py-3">
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-gray-700">Explanation: </span>
            {snippet.explanation}
          </p>
        </div>
      )}
    </div>
  );
}