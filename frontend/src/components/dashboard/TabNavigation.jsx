import {
  LayoutDashboard,
  BookOpen,
  Code2,
  MessageCircleQuestion,
  PenTool,
} from 'lucide-react';

/**
 * Horizontal tab navigation for the dashboard.
 * 
 * Props:
 * - activeTab: string — which tab is currently selected
 * - onTabChange: function — called with the new tab name when user clicks
 * - counts: object — number of items in each section (for badges)
 */
const TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'theory', label: 'Theory', icon: BookOpen },
  { id: 'code', label: 'Code', icon: Code2 },
  { id: 'interview', label: 'Interview', icon: MessageCircleQuestion },
  { id: 'practice', label: 'Practice', icon: PenTool },
];

export default function TabNavigation({ activeTab, onTabChange, counts = {} }) {
  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="max-w-5xl mx-auto px-4">
        {/* 
          The tab list scrolls horizontally on mobile (overflow-x-auto)
          and displays normally on larger screens.
          -webkit-scrollbar-hide hides the scrollbar for a cleaner look.
        */}
        <div className="flex overflow-x-auto scrollbar-hide -mb-px">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const count = counts[tab.id];

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-3 text-sm font-medium
                  border-b-2 transition-colors whitespace-nowrap
                  ${isActive
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                
                {/* Badge showing count (e.g., "5" next to "Code") */}
                {count !== undefined && count > 0 && (
                  <span className={`
                    text-xs px-1.5 py-0.5 rounded-full
                    ${isActive 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-gray-100 text-gray-500'
                    }
                  `}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}