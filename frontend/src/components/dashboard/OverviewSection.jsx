import { BookOpen, Code2, MessageCircleQuestion, PenTool, Lightbulb } from 'lucide-react';
import MarkdownRenderer from '../common/MarkdownRenderer';

/**
 * The Overview tab — shows summary stats and a high-level summary.
 */
export default function OverviewSection({ result }) {
  const stats = [
    {
      label: 'Concepts',
      count: result.concepts?.length || 0,
      icon: BookOpen,
      color: 'bg-purple-50 text-purple-600 border-purple-200',
    },
    {
      label: 'Code Snippets',
      count: result.code_snippets?.length || 0,
      icon: Code2,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    },
    {
      label: 'Interview Questions',
      count: result.interview_questions?.length || 0,
      icon: MessageCircleQuestion,
      color: 'bg-blue-50 text-blue-600 border-blue-200',
    },
    {
      label: 'Practice Questions',
      count: result.practice_questions?.length || 0,
      icon: PenTool,
      color: 'bg-orange-50 text-orange-600 border-orange-200',
    },
    {
      label: 'Key Points',
      count: result.important_points?.length || 0,
      icon: Lightbulb,
      color: 'bg-amber-50 text-amber-600 border-amber-200',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Summary Card */}
      {result.summary && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            📝 Summary
          </h3>
          <MarkdownRenderer content={result.summary} />
          
        </div>
      )}

      {/* Stats Grid */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          What's Inside
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className={`border rounded-xl p-4 text-center ${stat.color}`}
              >
                <Icon className="w-6 h-6 mx-auto mb-2" />
                <div className="text-2xl font-bold">{stat.count}</div>
                <div className="text-xs font-medium mt-1 opacity-80">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Important Points */}
      {result.important_points?.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            💡 Key Takeaways
          </h3>
          <div className="space-y-2">
            {result.important_points.map((point, index) => (
              <div
                key={index}
                className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg p-3"
              >
                <span className="text-amber-500 font-bold text-sm mt-0.5">
                  {index + 1}.
                </span>
                <p className="text-amber-800 text-sm">{point}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}