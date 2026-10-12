import { useState } from 'react';
import { MessageCircleQuestion, ChevronDown, ChevronUp } from 'lucide-react';
import MarkdownRenderer from '../common/MarkdownRenderer';

/**
 * Displays interview questions with reveal/hide answers.
 */
export default function InterviewSection({ questions = [] }) {
  if (questions.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <MessageCircleQuestion className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p className="text-sm">No interview questions were extracted.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500 mb-2">
        Click on a question to reveal the answer. Try to answer it yourself first!
      </p>
      {questions.map((q, index) => (
        <InterviewCard key={index} question={q} number={index + 1} />
      ))}
    </div>
  );
}

function InterviewCard({ question, number }) {
  const [isOpen, setIsOpen] = useState(false);

  // Difficulty badge colors
  const difficultyColors = {
    easy: 'bg-green-100 text-green-700',
    medium: 'bg-amber-100 text-amber-700',
    hard: 'bg-red-100 text-red-700',
  };

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      {/* Question header — clickable */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-start gap-3 p-4 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="flex-shrink-0 w-7 h-7 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-bold">
          {number}
        </span>
        
        <div className="flex-1">
          <p className="font-medium text-gray-900">{question.question}</p>
          {question.difficulty && (
            <span className={`inline-block mt-1.5 text-xs px-2 py-0.5 rounded-full font-medium ${difficultyColors[question.difficulty] || 'bg-gray-100 text-gray-600'}`}>
              {question.difficulty}
            </span>
          )}
        </div>

        {/* Expand/collapse icon */}
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
        )}
      </button>

      {/* Answer — only shown when open */}
      {isOpen && (
        <div className="px-4 pb-4 pt-0 ml-10">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-green-800 mb-1">
              Answer
            </h4>
            <MarkdownRenderer content={question.answer} />
            
            {question.explanation && (
              <div className="mt-3 pt-3 border-t border-green-200">
                <h4 className="text-sm font-semibold text-green-800 mb-1">
                  Explanation
                </h4>
                <p className="text-green-700 text-sm leading-relaxed">
                  {question.explanation}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}