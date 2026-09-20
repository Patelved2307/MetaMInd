import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { useAuth } from '@/features/auth';
import { getAvatarPresetByUrl, generateAvatarUrl } from '@/lib/avatarGenerator';
import { ChapterStudyView } from '@/components/learning/ChapterStudyView';

export const LearningModulePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const avatarUrl = profile?.avatar_url || generateAvatarUrl(user?.id || 'demo');
  const activePreset = getAvatarPresetByUrl(avatarUrl);
  const theme = activePreset.theme;

  const courseId = searchParams.get('course') || 'dbms';
  const chapterId = searchParams.get('chapter') || 'db-1';

  // Always scroll to top on chapter change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [courseId, chapterId]);

  const handleNavigateChapter = (newChapterId: string) => {
    setSearchParams({ course: courseId, chapter: newChapterId });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 relative selection:bg-blue-100 text-slate-800 pb-16">
      {/* Light Ambient Sheen */}
      <div
        className="fixed top-0 right-0 w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none opacity-20 z-0"
        style={{ background: theme.glow }}
      />

      {/* Top Header Navigation */}
      <div className="flex items-center justify-between gap-4 py-2 border-b border-slate-200/80 relative z-10">
        <button
          onClick={() => navigate('/app/learning-map')}
          className="flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-indigo-700 bg-white hover:bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 transition-all cursor-pointer shadow-2xs active:scale-95"
        >
          <ArrowLeft className="w-4 h-4 text-indigo-600" />
          <span>Back to Learning Map</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
          <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
          <span className="font-bold text-slate-700">Dedicated Study Reader</span>
          <span className="hidden sm:inline text-slate-400">• GFG & W3Schools Mode</span>
        </div>
      </div>

      {/* Dedicated Chapter Study View */}
      <div className="relative z-10">
        <ChapterStudyView
          courseId={courseId}
          chapterId={chapterId}
          onNavigateChapter={handleNavigateChapter}
          isModal={false}
        />
      </div>
    </div>
  );
};
