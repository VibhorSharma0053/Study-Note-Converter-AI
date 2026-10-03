import { useState } from 'react';

/**
 * The main input area where users paste their AI chat transcript.
 * 
 * Props:
 * - onSubmit: Function called with the transcript text when user clicks Generate
 * - isLoading: Boolean to disable the button during processing
 */
export default function TranscriptInput({ onSubmit, isLoading }) {
  // Local state for the textarea value
  const [transcript, setTranscript] = useState('');

  // Character count for user feedback
  const charCount = transcript.length;
  const MIN_CHARS = 50;
  const MAX_CHARS = 100000;
  const isValid = charCount >= MIN_CHARS && charCount <= MAX_CHARS;

  function handleSubmit() {
    if (!isValid || isLoading) return;
    onSubmit(transcript);
  }

  // Allow Ctrl+Enter / Cmd+Enter to submit
  function handleKeyDown(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit();
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          AI Study Notes Converter
        </h1>
        <p className="text-gray-500">
          Paste your AI chat transcript below and get organized study notes 
          with theory, code snippets, interview questions, and more.
        </p>
      </div>

      {/* Textarea */}
      <div className="relative">
        <textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Paste your AI conversation here...\n\nExample:\nUser: Explain Python decorators with examples.\nAssistant: A decorator is a function that...\nUser: Can you give me some interview questions?\nAssistant: Sure! Here are some common questions...`}
          className={`
            w-full h-64 p-4 rounded-lg border-2 resize-y
            font-mono text-sm leading-relaxed
            placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-blue-500
            transition-colors duration-200
            ${isValid 
              ? 'border-green-300 bg-green-50/30' 
              : charCount > 0 
                ? 'border-amber-300 bg-amber-50/30' 
                : 'border-gray-200 bg-white'
            }
            ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          disabled={isLoading}
          aria-label="AI chat transcript input"
        />
        
        {/* Character counter */}
        <div className="flex justify-between items-center mt-2 px-1">
          <span className={`text-xs ${
            charCount > MAX_CHARS ? 'text-red-500' :
            charCount >= MIN_CHARS ? 'text-green-500' :
            'text-gray-400'
          }`}>
            {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()} characters
            {charCount > 0 && charCount < MIN_CHARS && (
              <span className="ml-2 text-amber-500">
                (minimum {MIN_CHARS} characters)
              </span>
            )}
          </span>
          
          <span className="text-xs text-gray-400">
            Ctrl+Enter to submit
          </span>
        </div>
      </div>

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        disabled={!isValid || isLoading}
        className={`
          w-full mt-4 py-3 px-6 rounded-lg font-semibold text-lg
          transition-all duration-200
          ${isValid && !isLoading
            ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg active:scale-[0.98]'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }
        `}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Processing...
          </span>
        ) : (
          '✨ Generate Study Notes'
        )}
      </button>
    </div>
  );
}