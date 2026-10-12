import { Search, Clock, ArrowLeft, FileText, FileDown } from 'lucide-react';
import { generateMarkdownString, downloadMarkdownFile } from '../../utils/markdownExport';
import PrintableNotes from '../export/PrintableNotes';

export default function Header({ result, searchQuery, setSearchQuery, onReset }) {
  const conceptsCount = result.concepts?.length ?? 0;
  const codeCount = result.code_snippets?.length ?? 0;
  const interviewCount = result.interview_questions?.length ?? 0;
  const practiceCount = result.practice_questions?.length ?? 0;

  const totalItems = conceptsCount + codeCount + interviewCount + practiceCount;
  const estimatedReadTime = Math.max(2, Math.ceil(totalItems * 1.5));

  function handleExportMarkdown() {
    const markdownContent = generateMarkdownString(result);
    const fileName = result.title || 'study_notes';
    downloadMarkdownFile(fileName, markdownContent);
  }

  // Handler for Export PDF
  function handleExportPDF() {
    window.print();
  }

  return (
    <>
      {/* Hidden container that only becomes visible during window.print() */}
      <PrintableNotes result={result} />

      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-2xs no-print">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          
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
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-56">
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

              {/* Export MD */}
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

              {/* Export PDF */}
              <button
                onClick={handleExportPDF}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold 
                           text-white bg-blue-600 border border-blue-600 rounded-xl 
                           hover:bg-blue-700 active:scale-95 transition-all shadow-2xs shrink-0"
                title="Save as PDF"
              >
                <FileDown className="w-4 h-4" />
                <span className="hidden sm:inline">Export PDF</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}