import { useState } from 'react';
import { PenTool, Eye, EyeOff, CheckCircle2, XCircle } from 'lucide-react';

/**
 * Displays practice questions with interactive answer checking.
 */
export default function PracticeSection({ questions = [] }) {
  if (questions.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <PenTool className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p className="text-sm">No practice questions were extracted.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500 mb-2">
        Test your understanding with these practice questions.
      </p>
      {questions.map((q, index) => (
        <PracticeCard key={index} question={q} number={index + 1} />
      ))}
    </div>
  );
}

function PracticeCard({ question, number }) {
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const isMCQ = question.question_type === 'mcq' && question.options?.length > 0;

  function handleOptionSelect(option) {
    setSelectedOption(option);
    setShowAnswer(true);
  }

  return (
    <div className="border border-gray-200 rounded-xl p-5">
      {/* Question header */}
      <div className="flex items-start gap-3 mb-3">
        <span className="flex-shrink-0 w-7 h-7 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center text-sm font-bold">
          {number}
        </span>
        <div className="flex-1">
          <p className="font-medium text-gray-900">{question.question}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
              {question.question_type || 'open-ended'}
            </span>
            {question.difficulty && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                {question.difficulty}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* MCQ Options */}
      {isMCQ && (
        <div className="ml-10 space-y-2 mb-3">
          {question.options.map((option, i) => {
            const isSelected = selectedOption === option;
            const isCorrect = option === question.answer;
            const showResult = showAnswer;

            let optionStyle = 'border-gray-200 hover:border-blue-300 hover:bg-blue-50';
            if (showResult && isCorrect) {
              optionStyle = 'border-green-400 bg-green-50';
            } else if (showResult && isSelected && !isCorrect) {
              optionStyle = 'border-red-400 bg-red-50';
            } else if (isSelected) {
              optionStyle = 'border-blue-400 bg-blue-50';
            }

            return (
              <button
                key={i}
                onClick={() => handleOptionSelect(option)}
                disabled={showAnswer}
                className={`w-full text-left p-3 rounded-lg border text-sm transition-colors ${optionStyle} ${showAnswer ? 'cursor-default' : 'cursor-pointer'}`}
              >
                <span className="font-mono text-gray-500 mr-2">
                  {String.fromCharCode(65 + i)}.
                </span>
                {option}
                {showResult && isCorrect && (
                  <CheckCircle2 className="inline w-4 h-4 text-green-500 ml-2" />
                )}
                {showResult && isSelected && !isCorrect && (
                  <XCircle className="inline w-4 h-4 text-red-500 ml-2" />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Show/Hide Answer Button (for non-MCQ) */}
      {!isMCQ && (
        <div className="ml-10">
          <button
            onClick={() => setShowAnswer(!showAnswer)}
            className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            {showAnswer ? (
              <>
                <EyeOff className="w-4 h-4" /> Hide Answer
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" /> Show Answer
              </>
            )}
          </button>
        </div>
      )}

      {/* Answer display */}
      {showAnswer && (
        <div className="ml-10 mt-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-blue-800 mb-1">Answer</h4>
          <p className="text-blue-900 text-sm">{question.answer}</p>
        </div>
      )}
    </div>
  );
}