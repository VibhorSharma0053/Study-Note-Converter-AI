import { useState } from 'react';
import Header from '../components/dashboard/Header';
import TabNavigation from '../components/dashboard/TabNavigation';
import OverviewSection from '../components/dashboard/OverviewSection';
import TheoryTab from '../components/dashboard/TheoryTab';
import CodeSection from '../components/dashboard/CodeSection';
import InterviewSection from '../components/dashboard/InterviewSection';
import PracticeTab from '../components/dashboard/PracticeTab';

export default function DashboardPage({ result, onReset }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');

  const counts = {
    overview: null,
    theory: result.concepts?.length ?? 0,
    code: result.code_snippets?.length ?? 0,
    interview: result.interview_questions?.length ?? 0,
    practice: result.practice_questions?.length ?? 0,
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Polished Header */}
      <Header
        result={result}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onReset={onReset}
      />

      {/* Tab Bar */}
      <TabNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        counts={counts}
      />

      {/* Active Section Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && <OverviewSection result={result} />}
        {activeTab === 'theory' && <TheoryTab result={result} searchQuery={searchQuery} />}
        {activeTab === 'code' && <CodeSection snippets={result.code_snippets} searchQuery={searchQuery} />}
        {activeTab === 'interview' && <InterviewSection questions={result.interview_questions} searchQuery={searchQuery} />}
        {activeTab === 'practice' && <PracticeTab result={result} searchQuery={searchQuery} />}
      </main>
    </div>
  );
}