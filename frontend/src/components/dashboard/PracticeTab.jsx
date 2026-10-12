import React, { useState, useEffect } from 'react';
import { 
  BrainCircuit, Layers, CheckCircle2, XCircle, 
  Eye, RefreshCw, HelpCircle 
} from 'lucide-react';
import FlashcardDeck from './FlashcardDeck';
import MarkdownRenderer from '../common/MarkdownRenderer';

export default function PracticeTab({ result, searchQuery = "" }) {
  const [viewMode, setViewMode] = useState('quiz'); // 'quiz' or 'flashcards'
  const [scores, setScores] = useState({});

  const practiceQuestions = result.practice_questions ?? [];
  const concepts = result.concepts ?? [];
  const interviewQuestions = result.interview_questions ?? [];

  // Filter practice questions for Quiz View
  const filteredQuestions = practiceQuestions.filter((q) => {
    const query = searchQuery.toLowerCase();
    return (
      (q.question?.toLowerCase() ?? "").includes(query) ||
      (q.answer?.toLowerCase() ?? "").includes(query)
    );
  });

  // Assemble Flashcard Deck Items from Concepts + Questions
  const flashcardItems = [
    ...concepts.map((c) => ({
      front: c.title,
      back: `${c.definition}${c.example ? `\n\n**Example:**\n${c.example}` : ''}`,
      category: `Concept: ${c.topic || 'General'}`
    })),
    ...interviewQuestions.map((q) => ({
      front: q.question,
      back: `${q.answer}${q.explanation ? `\n\n**Explanation:**\n${q.explanation}` : ''}`,
      category: 'Interview Q&A'
    })),
    ...practiceQuestions.map((q) => ({
      front: q.question,
      back: q.answer,
      category: `Practice: ${q.question_type || 'Quiz'}`
    }))
  ];

  if (practiceQuestions.length === 0 && flashcardItems.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
        <BrainCircuit className="w-12 h-12 mx-auto text-gray-300 mb-3" />
        <p className="text-gray-500 text-sm">No practice questions or flashcards available.</p>
      </div>
    );
  }

  const answeredCount = Object.keys(scores).length;
  const correctCount = Object.values(scores).filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Top View Mode Switcher */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('quiz')}
            className={`
              flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl transition-all
              ${viewMode === 'quiz'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }
            `}
          >
            <HelpCircle className="w-4 h-4" /> Practice Quiz ({practiceQuestions.length})
          </button>

          <button
            onClick={() => setViewMode('flashcards')}
            className={`
              flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl transition-all
              ${viewMode === 'flashcards'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }
            `}
          >
            <Layers className="w-4 h-4" /> Flashcard Deck ({flashcardItems.length})
          </button>
        </div>

        {viewMode === 'quiz' && practiceQuestions.some(q => q.question_type === 'mcq') && (
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-green-700 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200">
              Score: {correctCount} / {answeredCount}
            </span>
            {answeredCount > 0 && (
              <button
                onClick={() => setScores({})}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                title="Reset Score"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* RENDER ACTIVE MODE */}
      {viewMode === 'flashcards' ? (
        <FlashcardDeck cards={flashcardItems} />
      ) : (
        <div className="space-y-4">
          {filteredQuestions.length === 0 ? (
            <p className="text-center text-gray-400 py-8 text-sm">No quiz questions match your search.</p>
          ) : (
            filteredQuestions.map((q, index) => (
              <PracticeCard
                key={index}
                question={q}
                index={index + 1}
                onAnswerResult={(isCorrect) => setScores(prev => ({ ...prev, [index]: isCorrect }))}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

function PracticeCard({ question, index, onAnswerResult }) {
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const isMCQ = question.question_type === 'mcq' && Array.isArray(question.options) && question.options.length > 0;

  function handleOptionSelect(option) {
    if (selectedOption !== null) return;
    setSelectedOption(option);
    setShowAnswer(true);

    const isCorrect = option.trim().toLowerCase() === (question.answer ?? "").trim().toLowerCase();
    onAnswerResult(isCorrect);
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-2xs">
      <div className="flex items-start gap-3 mb-4">
        <span className="w-7 h-7 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
          {index}
        </span>

        <div className="flex-1">
          <p className="font-semibold text-gray-900 text-base">{question.question}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
              {question.question_type || "open-ended"}
            </span>
            {question.difficulty && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                {question.difficulty}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Multiple Choice Options */}
      {isMCQ && (
        <div className="space-y-2 ml-10 mb-4">
          {question.options.map((option, optIdx) => {
            const isSelected = selectedOption === option;
            const isCorrectOption = option.trim().toLowerCase() === (question.answer ?? "").trim().toLowerCase();

            let btnStyle = "bg-white border-gray-200 text-gray-700 hover:bg-gray-50";
            if (showAnswer) {
              if (isCorrectOption) {
                btnStyle = "bg-green-50 border-green-300 text-green-800 font-medium";
              } else if (isSelected && !isCorrectOption) {
                btnStyle = "bg-red-50 border-red-300 text-red-800";
              }
            }

            return (
              <button
                key={optIdx}
                onClick={() => handleOptionSelect(option)}
                disabled={selectedOption !== null}
                className={`w-full text-left p-3 rounded-lg border text-sm transition-all flex items-center justify-between ${btnStyle}`}
              >
                <span>
                  <strong className="mr-2">{String.fromCharCode(65 + optIdx)}.</strong>
                  {option}
                </span>

                {showAnswer && isCorrectOption && <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />}
                {showAnswer && isSelected && !isCorrectOption && <XCircle className="w-4 h-4 text-red-500 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}

      {/* Open Ended Answer Toggle */}
      {!isMCQ && (
        <div className="ml-10">
          {!showAnswer ? (
            <button
              onClick={() => setShowAnswer(true)}
              className="inline-flex items-center gap-1.5 text-sm text-blue-600 font-medium hover:text-blue-700"
            >
              <Eye className="w-4 h-4" /> Reveal Answer
            </button>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <span className="text-xs font-bold text-green-700 uppercase tracking-wider block mb-1">
                Answer
              </span>
              <MarkdownRenderer content={question.answer} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}