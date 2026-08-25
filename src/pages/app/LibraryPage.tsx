import React, { useState } from 'react';
import { useAuth } from '@/features/auth';
import { getAvatarPresetByUrl, generateAvatarUrl } from '@/lib/avatarGenerator';
import { Button } from '@/components/ui/Button';
import {
  Library,
  FileText,
  Bookmark,
  Search,
  ExternalLink,
} from 'lucide-react';

interface LibraryResource {
  id: string;
  title: string;
  category: 'Cheat-Sheet' | 'AI Summary' | 'Code Snippet' | 'Study Guide';
  subject: string;
  dateAdded: string;
  description: string;
  readTime: string;
  saved: boolean;
}

const INITIAL_RESOURCES: LibraryResource[] = [
  {
    id: 'res-1',
    title: 'SQL JOINs Complete Visual Mastery Guide',
    category: 'Cheat-Sheet',
    subject: 'Database Management Systems',
    dateAdded: '2 days ago',
    description: 'Comprehensive visual cheatsheet covering INNER, LEFT, RIGHT, FULL OUTER joins with Venn diagrams and performance optimization tips.',
    readTime: '5 min read',
    saved: true,
  },
  {
    id: 'res-2',
    title: 'Database Normalization (1NF to 3NF) AI Summary',
    category: 'AI Summary',
    subject: 'Database Management Systems',
    dateAdded: '3 days ago',
    description: 'Simplified AI breakdown of database normalization rules, functional dependencies, and primary key constraints.',
    readTime: '4 min read',
    saved: true,
  },
  {
    id: 'res-3',
    title: 'Data Structures: Binary Search Trees & Heaps',
    category: 'Study Guide',
    subject: 'Algorithms & Data Structures',
    dateAdded: '5 days ago',
    description: 'Interactive tree traversal cheatsheet with Python & C++ code snippets and complexity analysis.',
    readTime: '8 min read',
    saved: false,
  },
  {
    id: 'res-4',
    title: 'Operating Systems: Process Scheduling & Threads',
    category: 'Code Snippet',
    subject: 'Computer Architecture',
    dateAdded: '1 week ago',
    description: 'Round-robin and priority scheduling algorithms explained with step-by-step trace tables.',
    readTime: '6 min read',
    saved: false,
  },
];

export const LibraryPage: React.FC = () => {
  const { user, profile } = useAuth();
  const avatarUrl = profile?.avatar_url || generateAvatarUrl(user?.id || 'demo');
  const activePreset = getAvatarPresetByUrl(avatarUrl);
  const theme = activePreset.theme;

  const [searchQuery, setSearchQuery] = useState('');
  const [resources, setResources] = useState<LibraryResource[]>(INITIAL_RESOURCES);
  const [activeTab, setActiveTab] = useState<'all' | 'saved'>('all');

  const toggleSave = (id: string) => {
    setResources((prev) =>
      prev.map((r) => (r.id === id ? { ...r, saved: !r.saved } : r))
    );
  };

  const filtered = resources.filter((r) => {
    const matchesTab = activeTab === 'all' || r.saved;
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8 relative selection:bg-blue-100 text-slate-800 pb-12">
      {/* Light Radial Ambient Glow */}
      <div
        className="fixed top-0 right-0 w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none opacity-20 z-0"
        style={{ background: theme.glow }}
      />

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold font-mono flex items-center gap-1.5">
              <Library className="w-3.5 h-3.5 text-blue-600" /> Resource Hub
            </span>
            <span className="text-xs text-slate-500 font-mono">{resources.length} Saved Items</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Learning Resources & Reference Library
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-sans">
            Access saved AI doubt explanations, interactive cheatsheets, code snippets, and study guides.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setActiveTab('all')}
            className={`text-xs font-bold cursor-pointer ${
              activeTab === 'all' ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 border-slate-200'
            }`}
          >
            All Resources
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setActiveTab('saved')}
            className={`text-xs font-bold cursor-pointer ${
              activeTab === 'saved' ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 border-slate-200'
            }`}
            leftIcon={<Bookmark className="w-3.5 h-3.5 text-amber-500" />}
          >
            Bookmarks ({resources.filter((r) => r.saved).length})
          </Button>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="relative z-10">
        <div className="relative max-w-lg">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search saved doubts, cheat-sheets, or subjects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
          />
        </div>
      </div>

      {/* RESOURCES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="rounded-3xl p-6 sm:p-7 bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-mono font-bold uppercase">
                  {item.category}
                </span>

                <button
                  onClick={() => toggleSave(item.id)}
                  className="p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-400 hover:text-amber-500 cursor-pointer"
                  title="Bookmark"
                >
                  <Bookmark
                    className={`w-4 h-4 ${item.saved ? 'text-amber-500 fill-amber-500' : ''}`}
                  />
                </button>
              </div>

              <div>
                <span className="text-[11px] font-mono text-slate-400 block mb-0.5">{item.subject}</span>
                <h3 className="text-base font-bold text-slate-900 font-display hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                {item.description}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs font-mono text-slate-500">
              <div className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-blue-500" />
                <span>{item.readTime}</span>
              </div>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => alert(`Opening resource: "${item.title}"`)}
                className="text-xs bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100 font-semibold cursor-pointer shadow-xs"
                rightIcon={<ExternalLink className="w-3.5 h-3.5 text-slate-400" />}
              >
                Read Summary
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
