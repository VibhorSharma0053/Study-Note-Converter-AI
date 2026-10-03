/**
 * A simple preview of the parsed results.
 * 
 * This is a TEMPORARY component for Phase 3 to prove the pipeline works.
 * In Phase 4 and 9, we'll replace this with the full dashboard.
 */
export default function ResultsPreview({ result, onReset }) {
  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Header with reset button */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{result.title}</h2>
          <p className="text-gray-500">Subject: {result.subject}</p>
        </div>
        <button
          onClick={onReset}
          className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          ← New Transcript
        </button>
      </div>

      {/* Summary */}
      {result.summary && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-800 mb-1">Summary</h3>
          <p className="text-blue-700 text-sm">{result.summary}</p>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard label="Concepts" count={result.concepts?.length || 0} color="purple" />
        <StatCard label="Code Snippets" count={result.code_snippets?.length || 0} color="green" />
        <StatCard label="Interview Qs" count={result.interview_questions?.length || 0} color="blue" />
        <StatCard label="Practice Qs" count={result.practice_questions?.length || 0} color="orange" />
      </div>

      {/* Quick preview of concepts */}
      {result.concepts?.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Concepts Preview
          </h3>
          <div className="space-y-3">
            {result.concepts.map((concept, index) => (
              <div key={index} className="bg-white border rounded-lg p-4">
                <h4 className="font-semibold text-gray-900">{concept.title}</h4>
                <p className="text-gray-600 text-sm mt-1">{concept.definition}</p>
                {concept.example && (
                  <p className="text-gray-500 text-xs mt-2 italic">
                    Example: {concept.example}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Note about full dashboard */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
        <p className="text-amber-700 text-sm">
          🚧 This is a simple preview. The full interactive dashboard with 
          code highlighting, quizzes, and export will be built in upcoming phases.
        </p>
      </div>
    </div>
  );
}

/**
 * A small reusable stat card component.
 * Demonstrates component composition and props.
 */
function StatCard({ label, count, color }) {
  // Map color names to Tailwind classes
  const colorMap = {
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200',
  };

  return (
    <div className={`border rounded-lg p-3 text-center ${colorMap[color] || colorMap.blue}`}>
      <div className="text-2xl font-bold">{count}</div>
      <div className="text-xs font-medium mt-1">{label}</div>
    </div>
  );
}