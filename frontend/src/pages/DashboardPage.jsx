import { useState } from 'react';
import { ArrowLeft, FileText, FileDown } from 'lucide-react';
import TabNavigation from '../components/dashboard/TabNavigation';
import OverviewSection from '../components/dashboard/OverviewSection';
import TheorySection from '../components/dashboard/TheorySection';
import CodeSection from '../components/dashboard/CodeSection';
import InterviewSection from '../components/dashboard/InterviewSection';
import PracticeSection from '../components/dashboard/PracticeSection';

/**
 * The main study dashboard that displays structured notes.
 */
export default function DashboardPage({ result, onReset }) {
  const [activeTab, setActiveTab] = useState('overview');

  // Calculate counts for tab badges
  const counts = {
    overview: null,  // No count for overview
    theory: result.concepts?.length || 0,
    code: result.code_snippets?.length || 0,
    interview: result.interview_questions?.length || 0,
    practice: result.practice_questions?.length || 0,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={onReset}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Back to input"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {result.title}
                </h1>
                <p className="text-sm text-gray-500">
                  {result.subject}
                </p>
              </div>
            </div>

            {/* Export buttons (placeholder — functional in Phase 12-13) */}
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Markdown</span>
              </button>
              <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <FileDown className="w-4 h-4" />
                <span className="hidden sm:inline">PDF</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <TabNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        counts={counts}
      />

      {/* Tab Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {activeTab === 'overview' && <OverviewSection result={result} />}
        {activeTab === 'theory' && <TheorySection concepts={result.concepts} />}
        {activeTab === 'code' && <CodeSection snippets={result.code_snippets} />}
        {activeTab === 'interview' && <InterviewSection questions={result.interview_questions} />}
        {activeTab === 'practice' && <PracticeSection questions={result.practice_questions} />}
      </main>
    </div>
  );
}