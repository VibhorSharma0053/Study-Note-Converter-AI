import React, { useState } from 'react';
import { 
  RotateCcw, CheckCircle2, XCircle, ChevronLeft, 
  ChevronRight, Sparkles, Award, Eye 
} from 'lucide-react';
import MarkdownRenderer from '../common/MarkdownRenderer';

/**
 * Interactive 3D Flashcard Deck for Active Recall study sessions.
 */
export default function FlashcardDeck({ cards = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredIds, setMasteredIds] = useState(new Set());

  if (!cards || cards.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
        <Sparkles className="w-10 h-10 mx-auto text-gray-300 mb-2" />
        <p className="text-gray-500 text-sm">No flashcards available for this note set.</p>
      </div>
    );
  }

  const currentCard = cards[currentIndex];
  const isMastered = masteredIds.has(currentIndex);

  function handleNext() {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  }

  function handlePrev() {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  }

  function toggleMastered() {
    setMasteredIds((prev) => {
      const next = new Set(prev);
      if (next.has(currentIndex)) {
        next.delete(currentIndex);
      } else {
        next.add(currentIndex);
      }
      return next;
    });
  }

  function handleResetDeck() {
    setIsFlipped(false);
    setCurrentIndex(0);
    setMasteredIds(new Set());
  }

  const progressPercent = Math.round((masteredIds.size / cards.length) * 100);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header & Progress Bar */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-2xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-600" />
            <span className="font-semibold text-gray-900 text-sm">
              Flashcard Progress
            </span>
          </div>
          <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-100">
            {masteredIds.size} / {cards.length} Mastered ({progressPercent}%)
          </span>
        </div>

        {/* Progress bar line */}
        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-purple-600 h-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 3D Flashcard Container */}
      <div className="perspective-1000 w-full min-h-[280px] sm:min-h-[320px]">
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className={`
            relative w-full min-h-[280px] sm:min-h-[320px] cursor-pointer
            transition-transform duration-500 transform-style-3d
            ${isFlipped ? 'rotate-y-180' : ''}
          `}
        >
          {/* FRONT OF CARD */}
          <div className="
            absolute inset-0 w-full h-full bg-white border-2 border-gray-200 
            rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-sm 
            backface-hidden hover:border-purple-300 transition-colors
          ">
            <div className="flex items-center justify-between text-xs text-gray-400 font-medium">
              <span className="px-2.5 py-0.5 rounded-md bg-gray-100 text-gray-600 uppercase tracking-wider font-bold">
                {currentCard.category || 'Concept'}
              </span>
              <span>Card {currentIndex + 1} of {cards.length}</span>
            </div>

            <div className="my-auto text-center py-4">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-snug">
                {currentCard.front}
              </h3>
              <p className="text-xs text-purple-600 font-medium mt-3 flex items-center justify-center gap-1">
                <Eye className="w-3.5 h-3.5" /> Click card or spacebar to flip
              </p>
            </div>

            <div className="flex justify-between items-center text-xs text-gray-400 pt-2 border-t border-gray-100">
              <span>{isMastered ? '✓ Marked as Mastered' : 'Not Mastered Yet'}</span>
              <span className="text-purple-600 font-medium">Front Side</span>
            </div>
          </div>

          {/* BACK OF CARD */}
          <div className="
            absolute inset-0 w-full h-full bg-purple-50/90 border-2 border-purple-200 
            rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-sm 
            backface-hidden rotate-y-180
          ">
            <div className="flex items-center justify-between text-xs text-purple-700 font-medium">
              <span className="px-2.5 py-0.5 rounded-md bg-purple-100 uppercase tracking-wider font-bold">
                Answer / Explanation
              </span>
              <span>Card {currentIndex + 1} of {cards.length}</span>
            </div>

            <div className="my-auto py-2 overflow-y-auto max-h-[180px] text-sm text-purple-950">
              <MarkdownRenderer content={currentCard.back} />
            </div>

            <div className="flex justify-between items-center text-xs text-purple-500 pt-2 border-t border-purple-100">
              <span>Click again to flip back</span>
              <span className="font-bold">Back Side</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls & Navigation */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          onClick={handlePrev}
          className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 
                     bg-white border border-gray-200 rounded-xl hover:bg-gray-50 
                     active:scale-95 transition-all shadow-2xs"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>

        <button
          onClick={toggleMastered}
          className={`
            flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl
            transition-all active:scale-95 shadow-2xs
            ${isMastered 
              ? 'bg-green-100 text-green-800 border border-green-200 hover:bg-green-200' 
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }
          `}
        >
          {isMastered ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-green-600" /> Mastered
            </>
          ) : (
            <>
              <XCircle className="w-4 h-4 text-gray-400" /> Mark Mastered
            </>
          )}
        </button>

        <button
          onClick={handleNext}
          className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-white 
                     bg-purple-600 rounded-xl hover:bg-purple-700 
                     active:scale-95 transition-all shadow-2xs"
        >
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Deck Reset */}
      <div className="text-center pt-2">
        <button
          onClick={handleResetDeck}
          className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset Deck Progress
        </button>
      </div>
    </div>
  );
}