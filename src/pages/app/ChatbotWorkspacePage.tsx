import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth';
import {
  chatService,
  CHAT_PLUGINS,
} from '@/features/chat/chat.service';
import type {
  ChatSession,
  ChatMessage,
  PluginId,
} from '@/features/chat/chat.types';
import { downloadStudyGuidePdf } from '@/features/chat/studyGuidePdf';
import { generateAvatarUrl, sanitizeAvatarUrl } from '@/lib/avatarGenerator';
import {
  Plus,
  Search,
  HelpCircle,
  LayoutDashboard,
  Trash2,
  Bot,
  PanelLeftClose,
  PanelLeft,
  FileDown,
  Sparkles,
  ArrowUpRight,
  Check,
  Brain,
  MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import LoaderGrid from '@/components/ui/loader-grid';
import { PromptInputBox } from '@/components/ui/ai-prompt-box';

function renderInlineFormatted(str: string) {
  const parts = str.split(/(\*\*.*?\*\*|`.*?`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={i}
          className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-xs text-indigo-700 font-medium"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

const RenderMarkdownSection: React.FC<{ text: string }> = ({ text }) => {
  const paragraphs = text.split(/\n\n+/);

  return (
    <>
      {paragraphs.map((para, pIdx) => {
        const trimmed = para.trim();
        if (!trimmed) return null;

        // Check if markdown table
        const lines = trimmed.split('\n');
        if (
          lines.length >= 2 &&
          lines.every((l) => l.trim().startsWith('|') && l.trim().endsWith('|'))
        ) {
          const headerRow = lines[0].split('|').slice(1, -1).map((c) => c.trim());
          const bodyRows = lines
            .slice(2)
            .map((l) => l.split('|').slice(1, -1).map((c) => c.trim()));

          return (
            <div
              key={pIdx}
              className="overflow-x-auto my-3 rounded-xl border border-slate-200 shadow-sm"
            >
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-800">
                    {headerRow.map((h, i) => (
                      <th
                        key={i}
                        className="p-3 text-[11px] uppercase tracking-wider text-slate-600"
                      >
                        {renderInlineFormatted(h)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {bodyRows.map((row, rIdx) => (
                    <tr
                      key={rIdx}
                      className={rIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}
                    >
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="p-3 text-slate-700">
                          {renderInlineFormatted(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        // Blockquote
        if (trimmed.startsWith('>')) {
          const quoteText = trimmed.replace(/^>\s*/gm, '');
          return (
            <blockquote
              key={pIdx}
              className="my-3 pl-3.5 py-2 border-l-3 border-indigo-500 bg-indigo-50/50 rounded-r-xl text-slate-800 italic text-xs leading-relaxed"
            >
              {renderInlineFormatted(quoteText)}
            </blockquote>
          );
        }

        // Header 3
        if (trimmed.startsWith('### ')) {
          return (
            <h3
              key={pIdx}
              className="text-sm font-bold text-slate-900 mt-4 mb-1.5 flex items-center gap-1.5"
            >
              {renderInlineFormatted(trimmed.replace(/^###\s*/, ''))}
            </h3>
          );
        }

        // Header 4
        if (trimmed.startsWith('#### ')) {
          return (
            <h4
              key={pIdx}
              className="text-xs font-bold text-slate-800 uppercase tracking-wider mt-3 mb-1"
            >
              {renderInlineFormatted(trimmed.replace(/^####\s*/, ''))}
            </h4>
          );
        }

        // Standard paragraph
        return (
          <p key={pIdx} className="whitespace-pre-wrap leading-relaxed">
            {renderInlineFormatted(trimmed)}
          </p>
        );
      })}
    </>
  );
};

const RenderFormattedMessage: React.FC<{ content: string; isUser: boolean }> = ({
  content,
  isUser,
}) => {
  if (isUser) {
    return <div className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{content}</div>;
  }

  // Split code blocks
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-3.5 text-sm text-slate-800 leading-relaxed font-sans">
      {parts.map((part, index) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const lines = part.slice(3, -3).trim().split('\n');
          const firstLine = lines[0].trim();
          const hasLang = /^[a-zA-Z0-9_-]+$/.test(firstLine);
          const lang = hasLang ? firstLine : 'code';
          const code = hasLang ? lines.slice(1).join('\n') : lines.join('\n');

          return (
            <div
              key={index}
              className="rounded-xl overflow-hidden border border-slate-800 bg-[#14171F] text-slate-100 shadow-md my-3 text-left"
            >
              <div className="flex items-center justify-between px-3.5 py-1.5 bg-[#1C202B] border-b border-slate-800 text-[11px] font-mono text-slate-400">
                <span className="uppercase font-bold tracking-wider">{lang}</span>
                <span className="text-[10px] text-slate-400">Snippet</span>
              </div>
              <pre className="p-4 font-mono text-xs overflow-x-auto selection:bg-indigo-500 selection:text-white">
                <code>{code}</code>
              </pre>
            </div>
          );
        }

        return <RenderMarkdownSection key={index} text={part} />;
      })}
    </div>
  );
};

export const ChatbotWorkspacePage: React.FC = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const registeredName =
    profile?.full_name?.trim() ||
    user?.user_metadata?.full_name?.trim() ||
    user?.email?.split('@')[0] ||
    'Learner';

  const rawAvatarUrl = profile?.avatar_url || generateAvatarUrl(user?.id || 'demo');
  const avatarUrl = sanitizeAvatarUrl(rawAvatarUrl);

  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePlugin, setActivePlugin] = useState<PluginId>('concept-explainer');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<{ [msgId_qId: string]: number }>({});

  // Clean layout sidebar toggle
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat sessions
  useEffect(() => {
    const loadedSessions = chatService.getSessions();
    setSessions(loadedSessions);

    if (loadedSessions.length > 0) {
      setActiveSessionId(loadedSessions[0].id);
    } else {
      const newSession = chatService.createSession();
      setSessions([newSession]);
      setActiveSessionId(newSession.id);
    }
  }, []);

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];

  // Auto-scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeSession?.messages, isAiThinking]);

  const handleCreateNewChat = () => {
    const newSession = chatService.createSession(activePlugin);
    const updated = [newSession, ...sessions];
    setSessions(updated);
    chatService.saveSessions(updated);
    setActiveSessionId(newSession.id);
  };

  const handleDeleteChat = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    const updated = sessions.filter((s) => s.id !== sessionId);
    if (updated.length === 0) {
      const fallback = chatService.createSession(activePlugin);
      setSessions([fallback]);
      chatService.saveSessions([fallback]);
      setActiveSessionId(fallback.id);
    } else {
      setSessions(updated);
      chatService.saveSessions(updated);
      if (activeSessionId === sessionId) {
        setActiveSessionId(updated[0].id);
      }
    }
  };

  const handleSendMessage = (promptText: string, _files?: File[]) => {
    if (!promptText.trim() || !activeSession || isAiThinking) return;

    const userMessage: ChatMessage = {
      id: `msg_user_${Date.now()}`,
      sender: 'user',
      content: promptText.trim(),
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...(activeSession.messages || []), userMessage];
    const sessionWithUser = {
      ...activeSession,
      title: (!activeSession.messages || activeSession.messages.length === 0) 
        ? promptText.replace(/^\[(Search|Think|Canvas):\s*/, '').slice(0, 32) 
        : activeSession.title,
      messages: updatedMessages,
      updatedAt: new Date().toISOString(),
    };

    const updatedSessions = sessions.map((s) => (s.id === activeSession.id ? sessionWithUser : s));
    setSessions(updatedSessions);
    chatService.saveSessions(updatedSessions);
    setIsAiThinking(true);

    setTimeout(() => {
      const { content, diagnostic } = chatService.generateCognitiveResponse(promptText, activePlugin);

      const aiMessage: ChatMessage = {
        id: `msg_ai_${Date.now()}`,
        sender: 'assistant',
        content,
        diagnostic,
        timestamp: new Date().toISOString(),
      };

      const finalMessages = [...updatedMessages, aiMessage];
      const finalSession = {
        ...sessionWithUser,
        messages: finalMessages,
        updatedAt: new Date().toISOString(),
      };

      const allSessions = updatedSessions.map((s) => (s.id === activeSession.id ? finalSession : s));
      setSessions(allSessions);
      chatService.saveSessions(allSessions);
      setIsAiThinking(false);
    }, 850);
  };

  const handleSelectQuizAnswer = (msgId: string, qId: string, optIndex: number) => {
    const newAnswers = {
      ...quizAnswers,
      [`${msgId}_${qId}`]: optIndex,
    };
    setQuizAnswers(newAnswers);

    if (activeSession) {
      const targetMsg = activeSession.messages.find((m) => m.id === msgId);
      if (targetMsg?.diagnostic?.quickCheck) {
        const questions = targetMsg.diagnostic.quickCheck;
        let correctCount = 0;
        let answeredCount = 0;

        for (const q of questions) {
          const ans = newAnswers[`${msgId}_${q.id}`];
          if (ans !== undefined) {
            answeredCount++;
            if (ans === q.correctIndex) {
              correctCount++;
            }
          }
        }

        const accuracy = answeredCount > 0 ? correctCount / answeredCount : 0;
        const completionRatio = answeredCount / questions.length;
        const rawScore = Math.round((accuracy * 0.75 + completionRatio * 0.25) * 100);
        const updatedScore = Math.max(25, Math.min(100, rawScore));

        let updatedLevel: 'Low' | 'Moderate' | 'High' | 'Mastery' = 'Low';
        if (updatedScore >= 85) updatedLevel = 'Mastery';
        else if (updatedScore >= 70) updatedLevel = 'High';
        else if (updatedScore >= 50) updatedLevel = 'Moderate';

        const updatedMessages = activeSession.messages.map((m) => {
          if (m.id === msgId && m.diagnostic) {
            return {
              ...m,
              diagnostic: {
                ...m.diagnostic,
                confidenceScore: updatedScore,
                confidenceLevel: updatedLevel,
              },
            };
          }
          return m;
        });

        const updatedSession = {
          ...activeSession,
          messages: updatedMessages,
          updatedAt: new Date().toISOString(),
        };

        const all = sessions.map((s) => (s.id === activeSession.id ? updatedSession : s));
        setSessions(all);
        chatService.saveSessions(all);
      }
    }
  };

  const filteredSessions = sessions.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Creative Starter Cards (minimalist, human, inspiring)
  const starterPrompts = [
    {
      title: 'Explain SQL Joins',
      desc: 'Understand INNER, LEFT & RIGHT joins with clean diagrams',
      prompt: 'Can you explain SQL Joins (INNER, LEFT, RIGHT, FULL) with clear practical table examples?',
      tag: 'Database',
      icon: '⚡',
    },
    {
      title: 'Diagnose Binary Trees',
      desc: 'Test your grasp on traversal algorithms and complexities',
      prompt: 'Diagnose my understanding of Binary Search Tree insertions and edge cases with a quick diagnostic test.',
      tag: 'Algorithms',
      icon: '🌲',
    },
    {
      title: 'React Immutability',
      desc: 'Why state should never be mutated directly in React',
      prompt: 'Break down React State Immutability and why mutating state directly breaks rendering pipelines.',
      tag: 'Web Tech',
      icon: '⚛️',
    },
    {
      title: 'System Design 101',
      desc: 'Caching, horizontal scaling, and database replication',
      prompt: 'Walk me through core system design principles: when to use Redis caching vs Database indexing.',
      tag: 'Architecture',
      icon: '🏗️',
    },
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#FAFBFC] text-slate-800 font-sans selection:bg-indigo-600 selection:text-white">
      {/* ========================================================= */}
      {/* LEFT SIDEBAR: Clean, uncluttered, focused */}
      {/* ========================================================= */}
      <aside
        className={`h-full border-r border-slate-200/80 bg-white flex flex-col justify-between shrink-0 z-30 transition-all duration-300 ${
          isLeftSidebarOpen ? 'w-64' : 'w-18'
        }`}
      >
        {/* Top: Brand & New Chat */}
        <div className="p-4 border-b border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <div
              onClick={() => navigate('/app/dashboard')}
              className="flex items-center gap-2.5 overflow-hidden cursor-pointer group"
            >
              <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-sm group-hover:scale-105 transition-transform">
                <Brain className="w-4 h-4" />
              </div>
              {isLeftSidebarOpen && (
                <span className="font-bold text-slate-900 text-sm tracking-tight truncate">
                  MetaMind
                </span>
              )}
            </div>

            <button
              onClick={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer shrink-0"
              title={isLeftSidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
            >
              {isLeftSidebarOpen ? (
                <PanelLeftClose className="w-4 h-4" />
              ) : (
                <PanelLeft className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* New Chat Button */}
          <button
            onClick={handleCreateNewChat}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold text-white shadow-sm hover:opacity-95 transition-all cursor-pointer bg-slate-900 hover:bg-indigo-600"
            title="Start New Chat Session"
          >
            <Plus className="w-3.5 h-3.5" />
            {isLeftSidebarOpen && <span>New Thread</span>}
          </button>

          {/* Search bar */}
          {isLeftSidebarOpen && (
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search history..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-800"
              />
            </div>
          )}
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
          {/* Cognitive Persona Modes */}
          <div className="space-y-1">
            {isLeftSidebarOpen && (
              <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider px-2 py-0.5">
                AI Mode
              </div>
            )}
            {CHAT_PLUGINS.map((plugin) => {
              const isSelected = activePlugin === plugin.id;
              return (
                <button
                  key={plugin.id}
                  onClick={() => setActivePlugin(plugin.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-50/80 text-indigo-900 font-semibold border border-indigo-100 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                  title={plugin.name}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-sm shrink-0">{plugin.icon}</span>
                    {isLeftSidebarOpen && <span className="truncate">{plugin.name}</span>}
                  </div>
                  {isLeftSidebarOpen && (
                    <span className="text-[9px] font-mono text-slate-400">
                      {plugin.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Recent Study Threads */}
          <div className="space-y-1">
            {isLeftSidebarOpen && (
              <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider px-2 py-0.5">
                <span>Recent Chats</span>
                <span>({filteredSessions.length})</span>
              </div>
            )}

            {filteredSessions.slice(0, 10).map((session) => {
              const isActive = session.id === activeSession?.id;
              return (
                <div
                  key={session.id}
                  onClick={() => setActiveSessionId(session.id)}
                  className={`group flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                    isActive
                      ? 'bg-slate-100 text-slate-900 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                    {isLeftSidebarOpen && (
                      <span className="truncate max-w-[130px] text-left">
                        {session.title || 'Untitled Discussion'}
                      </span>
                    )}
                  </div>

                  {isLeftSidebarOpen && (
                    <button
                      onClick={(e) => handleDeleteChat(e, session.id)}
                      className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-rose-600 text-slate-400 transition-opacity shrink-0"
                      title="Delete thread"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom: Profile & Quick Links */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50 space-y-1.5">
          <button
            onClick={() => navigate('/app/dashboard')}
            className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-white border border-transparent hover:border-slate-200 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2 truncate">
              <img
                src={avatarUrl}
                alt={registeredName}
                className="w-7 h-7 rounded-lg border border-slate-200 object-cover bg-white shrink-0"
              />
              {isLeftSidebarOpen && (
                <div className="truncate text-left">
                  <div className="text-xs font-semibold text-slate-800 truncate">{registeredName}</div>
                  <div className="text-[10px] text-slate-400 truncate">Student Portal</div>
                </div>
              )}
            </div>
            {isLeftSidebarOpen && (
              <LayoutDashboard className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600" />
            )}
          </button>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* MAIN CONVERSATIONAL CANVAS */}
      {/* ========================================================= */}
      <main className="flex-1 h-full flex flex-col justify-between relative overflow-hidden bg-white">
        {/* Subtle Ambient Background Gradient */}
        <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-gradient-to-bl from-indigo-100/40 via-purple-50/20 to-transparent blur-3xl pointer-events-none" />

        {/* Top Minimal Header */}
        <header className="h-14 border-b border-slate-100 px-6 flex items-center justify-between bg-white/80 backdrop-blur-md relative z-10">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-semibold text-slate-800">
              {activeSession?.title || 'Interactive AI Tutor'}
            </h2>
            <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-medium text-slate-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{CHAT_PLUGINS.find((p) => p.id === activePlugin)?.name || 'Tutor Ready'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/app/dashboard')}
              className="text-xs font-medium text-slate-600 hover:text-slate-900 gap-1.5 rounded-lg border-slate-200"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Dashboard</span>
            </Button>

            <button
              onClick={handleCreateNewChat}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer"
              title="New Thread"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Center Stream / Canvas */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 relative z-10">
          {(!activeSession?.messages || activeSession.messages.length === 0) ? (
            /* SIMPLE & CREATIVE EMPTY HERO STATE */
            <div className="max-w-2xl mx-auto py-8 sm:py-16 text-center space-y-8 animate-in fade-in-50 duration-500">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 text-indigo-700 text-xs font-medium shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Interactive Cognitive Study Assistant</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  What would you like to master today?
                </h1>
                <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                  Ask a doubt, explore complex topics, or generate practice questions with instant step-by-step feedback.
                </p>
              </div>

              {/* Centered Integrated Prompt Input Box */}
              <div className="max-w-xl mx-auto text-left shadow-lg rounded-3xl">
                <PromptInputBox
                  onSend={(message, files) => handleSendMessage(message, files)}
                  isLoading={isAiThinking}
                  placeholder="Ask a question, paste code, or type a topic..."
                />
              </div>

              {/* Creative Minimalist Prompt Starters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left max-w-xl mx-auto pt-2">
                {starterPrompts.map((card, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSendMessage(card.prompt)}
                    className="p-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/80 hover:border-indigo-200 transition-all flex flex-col justify-between group cursor-pointer shadow-xs hover:shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-lg">{card.icon}</span>
                      <span className="text-[10px] font-mono text-slate-400 group-hover:text-indigo-600 transition-colors">
                        {card.tag}
                      </span>
                    </div>
                    <div className="mt-2.5">
                      <div className="text-xs font-bold text-slate-900 flex items-center justify-between">
                        <span>{card.title}</span>
                        <ArrowUpRight className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                        {card.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* CHAT CONVERSATION STREAM */
            <div className="max-w-3xl mx-auto space-y-6">
              {activeSession.messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {/* Avatar */}
                    {isUser ? (
                      <img
                        src={avatarUrl}
                        alt={registeredName}
                        className="w-7 h-7 rounded-lg border border-slate-200 object-cover shrink-0 shadow-xs"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Bot className="w-4 h-4 text-indigo-300" />
                      </div>
                    )}

                    {/* Message Bubble Content */}
                    <div className={`space-y-3 max-w-[85%] ${isUser ? 'text-right' : 'text-left'}`}>
                      <div
                        className={`p-4 sm:p-5 rounded-2xl text-sm leading-relaxed ${
                          isUser
                            ? 'bg-slate-900 text-white font-medium rounded-tr-xs shadow-xs'
                            : 'bg-white border border-slate-200/90 text-slate-800 rounded-tl-xs shadow-xs'
                        }`}
                      >
                        <RenderFormattedMessage content={msg.content} isUser={isUser} />
                      </div>

                      {/* DIAGNOSTIC CARD (Clean, Simple, Creative) */}
                      {msg.diagnostic && (
                        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 text-left text-slate-800">
                          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                              <span className="text-base">{msg.diagnostic.scenario?.icon || '🧠'}</span>
                              <div>
                                <span className="text-xs font-bold text-slate-900 block">
                                  {msg.diagnostic.scenario?.label || 'Knowledge Verification'}
                                </span>
                                <span className="text-[11px] text-slate-500">
                                  Topic: <strong className="text-slate-700">{msg.diagnostic.topic}</strong>
                                </span>
                              </div>
                            </div>

                            {/* Quick PDF button */}
                            <button
                              onClick={() =>
                                downloadStudyGuidePdf(
                                  msg.diagnostic!.topic,
                                  msg.diagnostic!,
                                  registeredName
                                )
                              }
                              className="text-xs font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100/70 px-2.5 py-1 rounded-lg border border-indigo-100 flex items-center gap-1.5 transition-all cursor-pointer"
                            >
                              <FileDown className="w-3.5 h-3.5" />
                              <span>Export Revision PDF</span>
                            </button>
                          </div>

                          {/* Diagnostic Questions */}
                          {msg.diagnostic.quickCheck && msg.diagnostic.quickCheck.length > 0 && (
                            <div className="space-y-3">
                              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                                <div className="flex items-center gap-1.5">
                                  <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
                                  <span>Concept Check</span>
                                </div>
                                <span className="text-[10px] font-mono text-slate-400">
                                  {msg.diagnostic.quickCheck.length} Question{msg.diagnostic.quickCheck.length > 1 ? 's' : ''}
                                </span>
                              </div>

                              {msg.diagnostic.quickCheck.map((questionItem, qIdx) => {
                                const selectedAnswer = quizAnswers[`${msg.id}_${questionItem.id}`];
                                const hasAnsweredThis = selectedAnswer !== undefined;

                                return (
                                  <div
                                    key={questionItem.id}
                                    className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-2.5"
                                  >
                                    <div className="text-xs font-medium text-slate-800">
                                      <span className="font-bold text-slate-500 mr-1.5">Q{qIdx + 1}.</span>
                                      {questionItem.question}
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                      {questionItem.options.map((opt, oIdx) => {
                                        const isSelected = selectedAnswer === oIdx;
                                        const isCorrect = oIdx === questionItem.correctIndex;

                                        let optClass =
                                          'bg-white border-slate-200 hover:bg-slate-100 text-slate-700';
                                        if (hasAnsweredThis) {
                                          if (isSelected && isCorrect) {
                                            optClass =
                                              'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold';
                                          } else if (isSelected && !isCorrect) {
                                            optClass =
                                              'bg-rose-50 border-rose-300 text-rose-900 font-semibold';
                                          } else if (isCorrect) {
                                            optClass =
                                              'bg-emerald-50/60 border-emerald-200 text-emerald-800';
                                          }
                                        }

                                        return (
                                          <button
                                            key={oIdx}
                                            onClick={() =>
                                              handleSelectQuizAnswer(msg.id, questionItem.id, oIdx)
                                            }
                                            className={`p-2 rounded-lg border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${optClass}`}
                                          >
                                            <span>{opt}</span>
                                            {hasAnsweredThis && isCorrect && (
                                              <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                                            )}
                                          </button>
                                        );
                                      })}
                                    </div>

                                    {hasAnsweredThis && (
                                      <p className="text-[11px] text-slate-600 bg-white p-2 rounded-lg border border-slate-200">
                                        💡 {questionItem.explanation}
                                      </p>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {/* Suggested Next Inquiries */}
                          {msg.diagnostic.followUpPrompts && msg.diagnostic.followUpPrompts.length > 0 && (
                            <div className="pt-2 border-t border-slate-100 space-y-1.5">
                              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                                Suggested Explorations
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {msg.diagnostic.followUpPrompts.map((promptText, pIdx) => (
                                  <button
                                    key={pIdx}
                                    onClick={() => handleSendMessage(promptText)}
                                    className="text-xs px-3 py-1 rounded-full bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-800 border border-slate-200 hover:border-indigo-200 transition-all cursor-pointer font-medium"
                                  >
                                    {promptText}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* AI Thinking Animation */}
              {isAiThinking && (
                <div className="flex items-center gap-3 text-slate-500 text-xs">
                  <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-indigo-300" />
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-2.5">
                    <LoaderGrid size="0.6em" />
                    <span className="animate-pulse font-medium text-slate-600 text-xs">
                      MetaMind is formulating a step-by-step explanation...
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* BOTTOM PROMPT DOCK (When conversation is active) */}
        {/* ========================================================= */}
        {activeSession?.messages && activeSession.messages.length > 0 && (
          <div className="p-4 bg-gradient-to-t from-white via-white/90 to-transparent relative z-20">
            <div className="max-w-3xl mx-auto space-y-2">
              <PromptInputBox
                onSend={(message, files) => handleSendMessage(message, files)}
                isLoading={isAiThinking}
                placeholder="Ask a follow-up doubt, test edge cases, or explore further..."
              />
              <p className="text-[11px] text-center text-slate-400 font-sans">
                MetaMind AI simplifies complex academic concepts with tailored diagnostics and revisions.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ChatbotWorkspacePage;
