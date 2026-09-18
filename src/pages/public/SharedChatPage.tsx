import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { chatService } from '@/features/chat/chat.service';
import type { ChatSession } from '@/features/chat/chat.types';
import {
  Sparkles,
  ArrowRight,
  Share2,
  Brain,
  CheckCircle2,
  FileText,
  Clock,
} from 'lucide-react';

export const SharedChatPage: React.FC = () => {
  const { shareId } = useParams<{ shareId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [session, setSession] = useState<ChatSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (shareId) {
      const dataParam = searchParams.get('data');
      const loaded = chatService.getSharedChat(shareId, dataParam);
      setSession(loaded);
      setLoading(false);
    }
  }, [shareId, searchParams]);

  const handleContinueDiscussion = () => {
    if (!session) return;
    chatService.forkSharedChat(session);
    // Navigate to the app chat workspace
    navigate('/app/chat');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-medium">Loading shared study discussion...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 shadow-sm border border-indigo-100">
          <Share2 className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
          Discussion Link Expired or Not Found
        </h1>
        <p className="text-sm text-slate-500 max-w-md mb-6">
          This shared study discussion may have been removed or the link format is invalid. You can start a fresh cognitive discussion in MetaMind.
        </p>
        <Link
          to="/app/chat"
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center gap-2"
        >
          <span>Open MetaMind AI Workspace</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <img
              src="/assets/brand/metamind_icon.png"
              alt="MetaMind"
              className="w-7 h-7 object-contain rounded-lg shadow-2xs"
            />
            <span className="font-display font-bold text-base text-slate-900 tracking-tight">
              MetaMind AI
            </span>
          </Link>
          <span className="hidden sm:inline-block text-slate-300">|</span>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
            <Share2 className="w-3 h-3" /> Shared Study Discussion
          </span>
        </div>

        {/* Primary Action Button */}
        <button
          type="button"
          onClick={handleContinueDiscussion}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-indigo-500/20 flex items-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Continue this Discussion in Workspace</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </header>

      {/* Main Conversation Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Banner Card */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider font-mono">
                Shared Conversation
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date(session.createdAt).toLocaleDateString()}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {session.title}
            </h1>
            <p className="text-xs text-slate-500">
              Shared by a fellow student. You can read the entire discussion history below and import it to continue asking follow-up questions.
            </p>
          </div>

          <button
            type="button"
            onClick={handleContinueDiscussion}
            className="px-4 py-2.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer shadow-xs flex items-center gap-2"
          >
            <span>Import & Continue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="space-y-6">
          {session.messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 sm:gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-1">
                    <Brain className="w-4 h-4" />
                  </div>
                )}

                <div className={`space-y-2 max-w-[85%] sm:max-w-[75%]`}>
                  {/* Attachments if any */}
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2 justify-end mb-1">
                      {msg.attachments.map((att) => (
                        <div
                          key={att.id}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-900 font-medium"
                        >
                          <FileText className="w-3.5 h-3.5 text-indigo-600" />
                          <span className="truncate max-w-[150px]">{att.name}</span>
                          <span className="text-[10px] text-indigo-500 font-mono">
                            ({(att.size / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div
                    className={`p-4 sm:p-5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs whitespace-pre-wrap font-sans ${
                      isUser
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-xs font-medium'
                        : 'bg-white border border-slate-200/90 text-slate-800 rounded-bl-xs'
                    }`}
                  >
                    {msg.content}
                  </div>

                  {/* Diagnostic Box if present */}
                  {!isUser && msg.diagnostic && (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs text-slate-700">
                      <div className="flex items-center gap-2 font-bold text-slate-900">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span>Cognitive Diagnostic Breakdown: {msg.diagnostic.topic}</span>
                      </div>
                      {msg.diagnostic.keyTakeaways && msg.diagnostic.keyTakeaways.length > 0 && (
                        <ul className="space-y-1 list-disc list-inside text-slate-600">
                          {msg.diagnostic.keyTakeaways.map((takeaway, i) => (
                            <li key={i}>{takeaway}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Call to Action */}
        <div className="pt-8 pb-12 text-center">
          <div className="p-8 rounded-3xl bg-gradient-to-b from-white to-indigo-50/50 border border-indigo-100 shadow-sm space-y-4 max-w-xl mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-md shadow-indigo-600/20">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Want to ask follow-up questions?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Import this conversation into your MetaMind workspace. You will be able to continue chatting with the AI cognitive tutor, run diagnostic quizzes, and generate study revision notes.
            </p>
            <button
              type="button"
              onClick={handleContinueDiscussion}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-indigo-500/20 inline-flex items-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>✦ Continue Discussion in Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
