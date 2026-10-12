import { BookOpen, Search } from 'lucide-react';
import MarkdownRenderer from '../common/MarkdownRenderer';

export default function TheoryTab({ result, searchQuery = "" }) {
  const concepts = result.concepts ?? [];

  // Filter concepts based on search query
  const filteredConcepts = concepts.filter((c) => {
    const query = searchQuery.toLowerCase();
    return (
      (c.title?.toLowerCase() ?? "").includes(query) ||
      (c.topic?.toLowerCase() ?? "").includes(query) ||
      (c.definition?.toLowerCase() ?? "").includes(query)
    );
  });

  if (concepts.length === 0) {
    return <EmptyState message="No theory concepts were extracted from this transcript." />;
  }

  if (filteredConcepts.length === 0) {
    return <NoSearchResults query={searchQuery} />;
  }

  // Group filtered concepts by topic
  const grouped = filteredConcepts.reduce((acc, concept) => {
    const topic = concept.topic || 'General Concepts';
    if (!acc[topic]) acc[topic] = [];
    acc[topic].push(concept);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      {Object.entries(grouped).map(([topic, items]) => (
        <div key={topic}>
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-bold text-gray-900">{topic}</h2>
            <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full border border-purple-100 font-medium">
              {items.length}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((concept, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-gray-200 p-5 
                           hover:border-purple-200 hover:shadow-sm transition-all"
              >
                <h3 className="font-semibold text-gray-900 mb-2 text-base">
                  {concept.title}
                </h3>
                <MarkdownRenderer content={concept.definition} />
                

                {concept.example && (
                  <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 text-xs">
                    <span className="font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                      Example
                    </span>
                    <code className="text-gray-800 font-mono leading-normal block whitespace-pre-wrap">
                      {concept.example}
                    </code>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
      <BookOpen className="w-12 h-12 mx-auto text-gray-300 mb-3" />
      <p className="text-gray-500 text-sm">{message}</p>
    </div>
  );
}

function NoSearchResults({ query }) {
  return (
    <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
      <Search className="w-10 h-10 mx-auto text-gray-300 mb-2" />
      <p className="text-gray-600 font-medium">No concepts match "{query}"</p>
      <p className="text-xs text-gray-400 mt-1">Try searching for a different term.</p>
    </div>
  );
}