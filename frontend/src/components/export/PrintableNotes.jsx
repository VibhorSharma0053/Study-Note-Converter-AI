import React from 'react';
import MarkdownRenderer from '../common/MarkdownRenderer';

/**
 * Printable Document View.
 * Renders all sections in a continuous, clean format specifically 
 * optimized for Print and PDF saving.
 */
export default function PrintableNotes({ result }) {
  if (!result) return null;

  return (
    <div className="hidden print:block p-4 space-y-8 bg-white text-black font-sans">
      {/* PDF Cover Header */}
      <div className="border-b-2 border-gray-900 pb-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">
          {result.title || "Study Notes"}
        </h1>
        <div className="flex items-center justify-between text-xs text-gray-600 mt-2">
          <span><strong>Subject:</strong> {result.subject || "General"}</span>
          <span><strong>Date Generated:</strong> {new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Summary */}
      {result.summary && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 break-inside-avoid">
          <h2 className="text-base font-bold text-gray-900 mb-2">Summary</h2>
          <p className="text-sm text-gray-800 leading-relaxed">{result.summary}</p>
        </div>
      )}

      {/* Important Points */}
      {Array.isArray(result.important_points) && result.important_points.length > 0 && (
        <div className="break-inside-avoid">
          <h2 className="text-base font-bold text-gray-900 border-b border-gray-300 pb-1 mb-3">
            Key Takeaways
          </h2>
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-800">
            {result.important_points.map((pt, idx) => (
              <li key={idx}>{pt}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Core Concepts */}
      {Array.isArray(result.concepts) && result.concepts.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 border-b-2 border-gray-300 pb-1 mb-4">
            Core Theory & Concepts
          </h2>
          <div className="space-y-4">
            {result.concepts.map((concept, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-4 break-inside-avoid">
                <h3 className="font-bold text-gray-900 text-sm mb-1">{concept.title}</h3>
                <div className="text-xs text-gray-700">
                  <MarkdownRenderer content={concept.definition} />
                </div>
                {concept.example && (
                  <div className="mt-2 bg-gray-50 p-2.5 rounded border border-gray-100 text-xs">
                    <strong className="text-gray-600 block mb-0.5">Example:</strong>
                    <code className="text-gray-800">{concept.example}</code>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Code Snippets */}
      {Array.isArray(result.code_snippets) && result.code_snippets.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 border-b-2 border-gray-300 pb-1 mb-4">
            Code Snippets
          </h2>
          <div className="space-y-4">
            {result.code_snippets.map((snippet, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-4 break-inside-avoid">
                <div className="font-bold text-sm text-gray-900 mb-1 flex justify-between">
                  <span>{snippet.title}</span>
                  <span className="text-xs font-mono uppercase text-gray-500">{snippet.language}</span>
                </div>
                <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-x-auto font-mono my-2">
                  <code>{snippet.code}</code>
                </pre>
                {snippet.explanation && (
                  <p className="text-xs text-gray-600 mt-1">{snippet.explanation}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interview Questions */}
      {Array.isArray(result.interview_questions) && result.interview_questions.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 border-b-2 border-gray-300 pb-1 mb-4">
            Interview Preparation
          </h2>
          <div className="space-y-3">
            {result.interview_questions.map((q, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-4 break-inside-avoid">
                <p className="font-bold text-sm text-gray-900 mb-1">
                  Q{idx + 1}: {q.question}
                </p>
                <div className="bg-gray-50 p-3 rounded border border-gray-100 text-xs mt-2">
                  <strong className="text-gray-700 block mb-1">Answer:</strong>
                  <MarkdownRenderer content={q.answer} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Practice Questions */}
      {Array.isArray(result.practice_questions) && result.practice_questions.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 border-b-2 border-gray-300 pb-1 mb-4">
            Practice & Quizzes
          </h2>
          <div className="space-y-3">
            {result.practice_questions.map((pq, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-4 break-inside-avoid">
                <p className="font-bold text-sm text-gray-900 mb-1">
                  {idx + 1}. {pq.question}
                </p>
                {pq.question_type === 'mcq' && Array.isArray(pq.options) && (
                  <ul className="list-disc pl-5 text-xs text-gray-700 my-2 space-y-0.5">
                    {pq.options.map((opt, oIdx) => (
                      <li key={oIdx}>{opt}</li>
                    ))}
                  </ul>
                )}
                <p className="text-xs text-green-800 font-semibold mt-2">
                  Answer: {pq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}