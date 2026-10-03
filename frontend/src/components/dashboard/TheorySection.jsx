import { BookOpen } from 'lucide-react';

/**
 * Displays concepts, definitions, and explanations.
 */
export default function TheorySection({ concepts = [] }) {
  if (!concepts || concepts.length === 0) {
    return <EmptyState message="No concepts were extracted from this transcript." />;
  }

  // Group concepts by topic
  const grouped = concepts.reduce((acc, concept) => {
    const topic = concept.topic || 'General';
    if (!acc[topic]) acc[topic] = [];
    acc[topic].push(concept);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      {Object.entries(grouped).map(([topic, items]) => (
        <div key={topic}>
          {/* Topic header */}
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-bold text-gray-900">{topic}</h3>
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
              {items.length} concept{items.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Concept cards */}
          <div className="space-y-3">
            {items.map((concept, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
              >
                <h4 className="font-semibold text-gray-900 text-base mb-2">
                  {concept.title}
                </h4>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {concept.definition}
                </p>
                {concept.example && (
                  <div className="mt-3 bg-gray-50 border border-gray-100 rounded-lg p-3">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Example
                    </span>
                    <p className="text-gray-700 text-sm mt-1">
                      {concept.example}
                    </p>
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

/**
 * Shown when a section has no data.
 * Notice: This is a internal helper component, so it does NOT have 'export default'.
 */
function EmptyState({ message }) {
  return (
    <div className="text-center py-12 text-gray-400">
      <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
      <p className="text-sm">{message}</p>
    </div>
  );
}