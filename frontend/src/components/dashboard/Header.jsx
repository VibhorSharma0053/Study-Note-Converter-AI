import { Search, Clock, ArrowLeft, FileText, FileDown } from 'lucide-react';
import { generateMarkdownString, downloadMarkdownFile } from '../../utils/markdownExport';

/**
 * Top banner of the dashboard showing title, subject, quick stats, 
 * search bar, and working Export buttons.
 */
export default function Header({ result, searchQuery, setSearchQuery, onReset }) {
  const conceptsCount = result.concepts?.length ?? 0;
  const codeCount = result.code_snippets?.length ?? 0;
  const interviewCount = result.interview_questions?.length ?? 0;
  const practiceCount = result.practice_questions?.length ?? 0;

  const totalItems = conceptsCount + codeCount + interviewCount + practiceCount;
  const estimatedReadTime = Math.max(2, Math.ceil(totalItems * 1.5));

  // Handler for Export Markdown
  function handleExportMarkdown() {
    const markdownContent = generateMarkdownString(result);
    const fileName = result.title || 'study_notes';
    downloadMarkdownFile(fileName, markdownContent);
  }

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-2xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        
        {/* Top row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-start gap-3">
            <button
              onClick={onReset}
              className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 
                         rounded-lg transition-colors mt-1 sm:mt-0"
              title="Parse a new transcript"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {result.title || "Untitled Study Notes"}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold 
                               bg-blue-50 text-blue-700 border border-blue-100">
                  {result.subject || "General"}
                </span>
              </div>
              
              <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  ~{estimatedReadTime} min study time
                </span>
                <span>•</span>
                <span>{totalItems} total study items</span>
              </div>
            </div>
          </div>

          {/* Actions & Search */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Search Bar */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 
                           rounded-xl focus:bg-white focus:outline-none focus:ring-2 
                           focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            {/* Export Markdown Button */}
            <button
              onClick={handleExportMarkdown}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold 
                         text-gray-700 bg-white border border-gray-200 rounded-xl 
                         hover:bg-gray-50 hover:border-gray-300 active:scale-95 
                         transition-all shadow-2xs shrink-0"
              title="Export as Markdown (.md)"
            >
              <FileText className="w-4 h-4 text-blue-600" />
              <span className="hidden sm:inline">Export MD</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}