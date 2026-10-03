import { useState } from 'react';
import { Sparkles, BookOpen, Code2, FileDown, Shield } from 'lucide-react';

/**
 * The landing page with transcript input.
 * Redesigned for a polished, professional look.
 */
export default function InputPage({ onSubmit, isLoading }) {
  const [transcript, setTranscript] = useState('');
  const charCount = transcript.length;
  const MIN_CHARS = 50;
  const MAX_CHARS = 100000;
  const isValid = charCount >= MIN_CHARS && charCount <= MAX_CHARS;

  function handleSubmit() {
    if (!isValid || isLoading) return;
    onSubmit(transcript);
  }

  function handleKeyDown(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit();
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <div className="max-w-3xl mx-auto px-4 pt-16 pb-8 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-sm font-medium px-3 py-1 rounded-full mb-6">
          <Sparkles className="w-4 h-4" />
          AI-Powered Study Tool
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          Turn AI Chats Into
          <span className="text-blue-600"> Study Notes</span>
        </h1>
        
        <p className="text-lg text-gray-500 max-w-xl mx-auto">
          Paste your ChatGPT, Gemini, or Claude conversations and get 
          beautifully organized notes with code, quizzes, and interview prep.
        </p>
      </div>

      {/* Input Section */}
      <div className="max-w-3xl mx-auto px-4 pb-8">
        <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 p-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Paste your AI conversation
          </label>
          
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`User: Explain Python decorators with examples and interview questions.\n\nAssistant: A decorator is a function that takes another function and extends its behavior...\n\nUser: Can you give me some practice problems?\n\nAssistant: Sure! Here are some exercises...`}
            className={`
              w-full h-56 p-4 rounded-xl border-2 resize-y
              font-mono text-sm leading-relaxed
              placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-blue-500/20
              transition-all duration-200
              ${isValid 
                ? 'border-green-300 bg-green-50/20' 
                : charCount > 0 
                  ? 'border-amber-300 bg-amber-50/20' 
                  : 'border-gray-200 bg-gray-50/50'
              }
              ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            disabled={isLoading}
          />
          
          <div className="flex justify-between items-center mt-2 px-1">
            <span className={`text-xs ${
              charCount > MAX_CHARS ? 'text-red-500' :
              charCount >= MIN_CHARS ? 'text-green-500' :
              'text-gray-400'
            }`}>
              {charCount.toLocaleString()} characters
              {charCount > 0 && charCount < MIN_CHARS && (
                <span className="ml-1">({MIN_CHARS - charCount} more needed)</span>
              )}
            </span>
            <span className="text-xs text-gray-400 hidden sm:inline">
              Ctrl+Enter to submit
            </span>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!isValid || isLoading}
            className={`
              w-full mt-4 py-3.5 px-6 rounded-xl font-semibold text-base
              transition-all duration-200
              ${isValid && !isLoading
                ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.99]'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analyzing with AI...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5" />
                Generate Study Notes
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="max-w-3xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FeatureCard
            icon={BookOpen}
            title="Organized Notes"
            description="Theory, definitions, and examples sorted by topic."
          />
          <FeatureCard
            icon={Code2}
            title="Code Snippets"
            description="Syntax-highlighted code with explanations and copy button."
          />
          <FeatureCard
            icon={FileDown}
            title="Export Anywhere"
            description="Download as Markdown or PDF for offline study."
          />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-gray-100">
      <div className="p-2 bg-blue-50 rounded-lg">
        <Icon className="w-5 h-5 text-blue-600" />
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
        <p className="text-gray-500 text-xs mt-0.5">{description}</p>
      </div>
    </div>
  );
}