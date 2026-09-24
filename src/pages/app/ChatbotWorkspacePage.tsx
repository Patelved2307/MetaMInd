import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { useAuth } from '@/features/auth';
import {
  chatService,
  CHAT_PLUGINS,
} from '@/features/chat/chat.service';
import type {
  ChatSession,
  ChatMessage,
  PluginId,
  ChatPlugin,
  ChatAttachment,
} from '@/features/chat/chat.types';
import { downloadStudyGuidePdf } from '@/features/chat/studyGuidePdf';
import { generateAvatarUrl, sanitizeAvatarUrl } from '@/lib/avatarGenerator';
import { GSAPAvatar } from '@/components/ui/GSAPAvatar';
import { FilePreviewModal } from '@/components/chat/FilePreviewModal';
import { PluginMarketplaceModal } from '@/components/chat/PluginMarketplaceModal';
import { ShareChatModal } from '@/components/chat/ShareChatModal';
import { AvatarContextualTour } from '@/components/ui/AvatarContextualTour';
import { useTour } from '@/lib/tourStore';
import {
  Search,
  LayoutDashboard,
  Trash2,
  PanelLeftClose,
  PanelLeft,
  FileDown,
  ArrowUp,
  Paperclip,
  Folder,
  SquarePen,
  Check,
  Copy,
  Brain,
  MoreVertical,
  Pin,
  Edit2,
  Share2,
  X,
  Eye,
  FileText,
  Image as ImageIcon,
  UploadCloud,
  Puzzle,
  Download,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import LoaderGrid from '@/components/ui/loader-grid';

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
              className="overflow-x-auto my-3 rounded-xl border border-slate-200 shadow-2xs"
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
              className="my-3 pl-3.5 py-1 border-l-3 border-indigo-500 bg-indigo-50/50 rounded-r-xl text-slate-700 italic text-xs leading-relaxed"
            >
              {renderInlineFormatted(quoteText)}
            </blockquote>
          );
        }

        // Headings
        if (trimmed.startsWith('### ')) {
          return (
            <h4
              key={pIdx}
              className="text-xs font-bold uppercase tracking-wider text-slate-900 mt-4 mb-1.5 flex items-center gap-1.5"
            >
              {renderInlineFormatted(trimmed.replace('### ', ''))}
            </h4>
          );
        }
        if (trimmed.startsWith('#### ')) {
          return (
            <h5
              key={pIdx}
              className="text-xs font-semibold text-indigo-700 mt-3 mb-1"
            >
              {renderInlineFormatted(trimmed.replace('#### ', ''))}
            </h5>
          );
        }

        // Bullet list
        if (
          trimmed
            .split('\n')
            .every((l) => l.trim().startsWith('•') || l.trim().startsWith('-'))
        ) {
          const listItems = trimmed
            .split('\n')
            .map((l) => l.replace(/^[•-]\s*/, ''));
          return (
            <ul key={pIdx} className="my-2 space-y-1 text-xs text-slate-700 pl-1">
              {listItems.map((li, liIdx) => (
                <li key={liIdx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                  <span>{renderInlineFormatted(li)}</span>
                </li>
              ))}
            </ul>
          );
        }

        // Regular paragraph
        return (
          <p
            key={pIdx}
            className="text-xs sm:text-sm text-slate-700 leading-relaxed my-2"
          >
            {renderInlineFormatted(trimmed)}
          </p>
        );
      })}
    </>
  );
};

const FormattedAiContent: React.FC<{ content: string }> = ({ content }) => {
  const parts = content.split(/(```[\s\S]*?```)/g);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-2">
      {parts.map((part, index) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const firstLineEnd = part.indexOf('\n');
          const language = part.slice(3, firstLineEnd).trim() || 'code';
          const code = part.slice(firstLineEnd + 1, -3);

          return (
            <div
              key={index}
              className="my-3 rounded-2xl overflow-hidden border border-slate-800 bg-[#0F172A] shadow-md text-white font-mono text-xs"
            >
              <div className="flex items-center justify-between px-4 py-2 bg-[#1E293B] border-b border-slate-700/80">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  {language}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyCode(code, index)}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  {copiedIndex === index ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy code</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 overflow-x-auto custom-scrollbar leading-relaxed text-slate-200">
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
  const location = useLocation();

  const registeredName =
    profile?.full_name?.trim() ||
    user?.user_metadata?.full_name?.trim() ||
    user?.email?.split('@')[0] ||
    'Student';

  const rawAvatarUrl = profile?.avatar_url || generateAvatarUrl(user?.id || 'demo');
  const avatarUrl = sanitizeAvatarUrl(rawAvatarUrl);

  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePlugin] = useState<PluginId>('concept-explainer');
  const [installedPlugins, setInstalledPlugins] = useState<ChatPlugin[]>(() =>
    chatService.getInstalledPlugins()
  );

  const [isAiThinking, setIsAiThinking] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<{ [msgId_qId: string]: number }>({});
  const [quizConfidence, setQuizConfidence] = useState<{ [msgId: string]: 'low' | 'medium' | 'high' }>({});
  const [isCalibratingMsgId, setIsCalibratingMsgId] = useState<string | null>(null);

  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [inputMessage, setInputMessage] = useState('');
  const selectedModel = 'MetaMind Neural Core';
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  // Modals & Menu States
  const [isPluginStoreOpen, setIsPluginStoreOpen] = useState(false);
  const [sharingSession, setSharingSession] = useState<ChatSession | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const { startTour, isAutoTourEnabled, hasSeenTour } = useTour();

  // Auto-launch avatar guide tutorial for new students on registration if enabled
  useEffect(() => {
    if (isAutoTourEnabled && !hasSeenTour) {
      const timer = setTimeout(() => {
        startTour(1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [startTour, isAutoTourEnabled, hasSeenTour]);
  const [previewAttachment, setPreviewAttachment] = useState<ChatAttachment | null>(null);

  // History 3-dots Menu & Inline Rename State
  const [activeMenuSessionId, setActiveMenuSessionId] = useState<string | null>(null);
  const [menuDirection, setMenuDirection] = useState<'up' | 'down'>('down');
  const [renamingSessionId, setRenamingSessionId] = useState<string | null>(null);
  const [renameTitle, setRenameTitle] = useState('');

  // Attachments in input composer
  const [currentAttachments, setCurrentAttachments] = useState<ChatAttachment[]>([]);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Projects
  const projects = [
    { id: 'db', name: 'Database Systems', count: '03' },
    { id: 'dsa', name: 'Data Structures', count: '02' },
    { id: 'web', name: 'Web Technology', count: '04' },
    { id: 'net', name: 'Computer Networks', count: '03' },
  ];

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

  // Handle incoming initial prompt or share import
  useEffect(() => {
    const state = location.state as { initialPrompt?: string } | null;
    if (state?.initialPrompt) {
      setInputMessage(state.initialPrompt);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Click outside to close 3-dots dropdown menu
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenuSessionId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];

  const lastAnimatedMsgIdRef = useRef<string | null>(null);
  const prevSessionIdRef = useRef<string | null>(null);

  // GSAP Staggered Message Cascade & Spring Reveal
  useEffect(() => {
    if (!activeSession?.messages || activeSession.messages.length === 0) return;

    // Case 1: Switched chat sessions -> stagger animate conversation thread
    if (prevSessionIdRef.current !== activeSession.id) {
      prevSessionIdRef.current = activeSession.id;
      const lastMsg = activeSession.messages[activeSession.messages.length - 1];
      lastAnimatedMsgIdRef.current = lastMsg?.id || null;

      requestAnimationFrame(() => {
        gsap.fromTo(
          '.chat-message-row',
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, stagger: 0.04, duration: 0.35, ease: 'power2.out' }
        );
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      });
      return;
    }

    // Case 2: New message arrived in current session
    const latestMessage = activeSession.messages[activeSession.messages.length - 1];
    if (latestMessage && latestMessage.id !== lastAnimatedMsgIdRef.current) {
      lastAnimatedMsgIdRef.current = latestMessage.id;

      requestAnimationFrame(() => {
        const msgRow = document.getElementById(`msg-${latestMessage.id}`);
        if (!msgRow) return;

        if (latestMessage.sender === 'user') {
          // User Message: Spring Reveal
          gsap.fromTo(
            msgRow,
            { opacity: 0, y: 16, scale: 0.96 },
            { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'back.out(1.4)' }
          );
        } else {
          // AI Reply: Choreographed Staggered Message Cascade
          const avatar = msgRow.querySelector('.ai-avatar');
          const bubble = msgRow.querySelector('.ai-bubble');
          const diagnostic = msgRow.querySelector('.ai-diagnostic');
          const quizItems = msgRow.querySelectorAll('.ai-quiz-item');
          const actions = msgRow.querySelector('.ai-actions');

          const tl = gsap.timeline();

          // Beat 1: Avatar Pop In with bounce
          if (avatar) {
            tl.fromTo(
              avatar,
              { scale: 0.6, opacity: 0 },
              { scale: 1, opacity: 1, duration: 0.35, ease: 'back.out(2)' }
            );
          }

          // Beat 2: Main Bubble Springs Up
          if (bubble) {
            tl.fromTo(
              bubble,
              { y: 22, opacity: 0, scale: 0.98 },
              { y: 0, opacity: 1, scale: 1, duration: 0.45, ease: 'power3.out' },
              avatar ? '-=0.2' : 0
            );
          }

          // Beat 3: Diagnostic Card Drawer Unfolds
          if (diagnostic) {
            tl.fromTo(
              diagnostic,
              { y: 18, opacity: 0, scale: 0.97 },
              { y: 0, opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(1.2)' },
              '-=0.15'
            );
          }

          // Beat 4: Quiz Challenge Cards Cascade in with Stagger
          if (quizItems && quizItems.length > 0) {
            tl.fromTo(
              quizItems,
              { y: 12, opacity: 0 },
              { y: 0, opacity: 1, stagger: 0.08, duration: 0.3, ease: 'power2.out' },
              '-=0.1'
            );
          }

          // Beat 5: Export / Followup Actions Slide In
          if (actions) {
            tl.fromTo(
              actions,
              { opacity: 0, y: 8 },
              { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' },
              '-=0.1'
            );
          }
        }

        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 50);
      });
    }
  }, [activeSession?.id, activeSession?.messages]);

  // Auto-scroll chat to bottom when thinking
  useEffect(() => {
    if (isAiThinking) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isAiThinking]);

  // Determine if the current session is fresh (empty or only has default greeting)
  const isFreshSession =
    !activeSession?.messages ||
    activeSession.messages.length === 0 ||
    (activeSession.messages.length === 1 && activeSession.messages[0].sender === 'assistant');

  const starterCards = [
    {
      badge: 'Concept Discovery',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: '🧠',
      title: 'SQL JOINs & Relational Logic',
      desc: 'Visual breakdown of INNER, LEFT, and FULL outer joins with diagrams',
      prompt: 'Explain SQL JOINs & table relationships with visual diagrams and examples',
    },
    {
      badge: 'Bug & Memory Diagnostics',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      icon: '💻',
      title: 'Recursion & Call Stacks',
      desc: 'Diagnose base case termination & prevent stack overflow errors',
      prompt: 'How do recursion call stack frames work and how to prevent stack overflow?',
    },
    {
      badge: 'Active Recall Quiz',
      badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      icon: '📝',
      title: 'Binary Search Tree Quiz',
      desc: 'Test your understanding with 3 adaptive diagnostic questions',
      prompt: 'Generate 3 interactive practice quiz questions on binary search trees',
    },
    {
      badge: 'Exam Prep Guide',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: '📑',
      title: 'Computer Networks Sheet',
      desc: 'Generate complete revision roadmap covering OSI layers & TCP/IP',
      prompt: 'Create a comprehensive exam study revision sheet for computer networks',
    },
  ];

  // GSAP Entrance for Centered Welcome Workspace
  useEffect(() => {
    if (isFreshSession) {
      requestAnimationFrame(() => {
        const tl = gsap.timeline();
        tl.fromTo(
          '.welcome-hero',
          { opacity: 0, y: 22, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.2)' }
        )
        .fromTo(
          '.welcome-prompt-box',
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
          '-=0.2'
        )
        .fromTo(
          '.welcome-chips button',
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, stagger: 0.05, duration: 0.35, ease: 'power1.out' },
          '-=0.15'
        )
        .fromTo(
          '.welcome-starter-card',
          { opacity: 0, y: 18, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, stagger: 0.08, duration: 0.45, ease: 'back.out(1.3)' },
          '-=0.1'
        );
      });
    }
  }, [isFreshSession, activeSession?.id]);

  // Attachment Handler
  const handleFilesAdded = (files: FileList | File[]) => {
    const newAttachments: ChatAttachment[] = Array.from(files).map((file) => ({
      id: `att_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: file.name,
      size: file.size,
      type: file.type || 'application/octet-stream',
      previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
    }));
    setCurrentAttachments((prev) => [...prev, ...newAttachments]);
  };

  const handleRemoveAttachment = (id: string) => {
    setCurrentAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleCreateNewChat = () => {
    const newSession = chatService.createSession(activePlugin);
    const updated = [newSession, ...sessions];
    setSessions(updated);
    chatService.saveSessions(updated);
    setActiveSessionId(newSession.id);
    setInputMessage('');
    setCurrentAttachments([]);
  };

  // Chat Actions
  const handleDeleteChat = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    setActiveMenuSessionId(null);
    if (!window.confirm('Are you sure you want to delete this discussion?')) return;

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

  const handleTogglePin = (sessionId: string, newPinned: boolean) => {
    const updated = chatService.pinSession(sessionId, newPinned);
    setSessions(updated);
    setActiveMenuSessionId(null);
  };

  const handleStartRename = (session: ChatSession) => {
    setRenamingSessionId(session.id);
    setRenameTitle(session.title);
    setActiveMenuSessionId(null);
  };

  const handleSaveRename = (sessionId: string) => {
    if (renameTitle.trim()) {
      const updated = chatService.renameSession(sessionId, renameTitle.trim());
      setSessions(updated);
    }
    setRenamingSessionId(null);
  };

  const handleOpenShare = (session: ChatSession) => {
    setSharingSession(session);
    setIsShareModalOpen(true);
    setActiveMenuSessionId(null);
  };

  const handleExportChat = (session: ChatSession) => {
    setActiveMenuSessionId(null);
    let markdown = `# ${session.title}\n\n`;
    markdown += `*Exported from MetaMind AI • Date: ${new Date(session.createdAt).toLocaleDateString()}*\n\n---\n\n`;
    session.messages.forEach((msg) => {
      const sender = msg.sender === 'user' ? 'Student' : 'MetaMind AI';
      markdown += `### ${sender} (${new Date(msg.timestamp).toLocaleTimeString()})\n\n`;
      if (msg.attachments && msg.attachments.length > 0) {
        markdown += `📎 Attached Files: ${msg.attachments.map((a) => a.name).join(', ')}\n\n`;
      }
      markdown += `${msg.content}\n\n---\n\n`;
    });

    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${session.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_discussion.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Send Message with Attachments & Active Plugins
  const handleSendMessage = async (textToSend?: string) => {
    const promptText = (textToSend !== undefined ? textToSend : inputMessage).trim();
    if ((!promptText && currentAttachments.length === 0) || !activeSession || isAiThinking) return;

    const messageAttachments = [...currentAttachments];
    const userMessage: ChatMessage = {
      id: `msg_user_${Date.now()}`,
      sender: 'user',
      content: promptText || (messageAttachments.length > 0 ? `Attached: ${messageAttachments.map((a) => a.name).join(', ')}` : ''),
      timestamp: new Date().toISOString(),
      attachments: messageAttachments.length > 0 ? messageAttachments : undefined,
    };

    const updatedMessages = [...(activeSession.messages || []), userMessage];
    const sessionWithUser = {
      ...activeSession,
      title:
        !activeSession.messages || activeSession.messages.length === 0
          ? promptText.slice(0, 32) || messageAttachments[0]?.name.slice(0, 32) || 'New Discussion'
          : activeSession.title,
      messages: updatedMessages,
      updatedAt: new Date().toISOString(),
    };

    const updatedSessions = sessions.map((s) => (s.id === activeSession.id ? sessionWithUser : s));
    setSessions(updatedSessions);
    chatService.saveSessions(updatedSessions);
    setInputMessage('');
    setCurrentAttachments([]);
    setIsAiThinking(true);

    try {
      const activeEnabledPlugins = installedPlugins.filter((p) => p.isEnabled).map((p) => p.id);
      const { content, diagnostic } = await chatService.generateCognitiveResponseAsync(
        promptText || 'Please analyze the attached document.',
        activePlugin,
        activeEnabledPlugins,
        messageAttachments
      );

      const aiMessage: ChatMessage = {
        id: `msg_ai_${Date.now()}`,
        sender: 'assistant',
        content,
        diagnostic,
        timestamp: new Date().toISOString(),
      };

      const finalMessages = [...updatedMessages, aiMessage];
      const sessionTopic = diagnostic?.topic;
      const finalSession = {
        ...sessionWithUser,
        title:
          (sessionWithUser.title === 'New Discussion' ||
            sessionWithUser.title === 'Welcome to MetaMind AI' ||
            sessionWithUser.title === 'Academic Chat' ||
            activeSession.messages.length <= 1) &&
          sessionTopic
            ? sessionTopic
            : sessionWithUser.title,
        messages: finalMessages,
        updatedAt: new Date().toISOString(),
      };

      const allSessions = updatedSessions.map((s) => (s.id === activeSession.id ? finalSession : s));
      setSessions(allSessions);
      chatService.saveSessions(allSessions);
    } catch (err) {
      console.error('AI generation error:', err);
    } finally {
      setIsAiThinking(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSelectQuizAnswer = (msgId: string, qId: string, optIndex: number) => {
    const newAnswers = {
      ...quizAnswers,
      [`${msgId}_${qId}`]: optIndex,
    };
    setQuizAnswers(newAnswers);
  };

  // Generate Tailored Explanation based on Diagnostic Quiz & Confidence
  const handleGenerateCalibratedExplanation = async (diagnosticMsg: ChatMessage) => {
    if (!diagnosticMsg.diagnostic || !activeSession || isCalibratingMsgId) return;

    const diag = diagnosticMsg.diagnostic;
    const confidence = quizConfidence[diagnosticMsg.id] || 'medium';
    setIsCalibratingMsgId(diagnosticMsg.id);

    try {
      // Find original student doubt prompt
      const msgIndex = activeSession.messages.findIndex((m) => m.id === diagnosticMsg.id);
      const userPromptMsg = msgIndex > 0 ? activeSession.messages[msgIndex - 1] : null;
      const originalQuery = userPromptMsg?.content || diag.topic || activeSession.title;

      // Extract user choices
      const userQuestionAnswers = diag.quickCheck.map((q) => {
        const chosenIdx = quizAnswers[`${diagnosticMsg.id}_${q.id}`];
        return {
          question: q.question,
          correctAnswer: q.options[q.correctIndex] || '',
          userAnswer: chosenIdx !== undefined ? q.options[chosenIdx] : 'Unanswered',
          isCorrect: chosenIdx === q.correctIndex,
        };
      });

      const primaryQ = userQuestionAnswers[0] || {
        question: `Understanding ${diag.topic}`,
        correctAnswer: 'Core Principles',
        userAnswer: 'Reviewed questions',
      };

      const res = await fetch('http://localhost:3001/api/ai/evaluate-and-explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: originalQuery,
          question: {
            question: primaryQ.question,
            correctAnswer: primaryQ.correctAnswer,
          },
          userAnswer: primaryQ.userAnswer,
          confidence,
        }),
      });

      let evalData: any;
      if (res.ok) {
        evalData = await res.json();
      } else {
        const correctCount = userQuestionAnswers.filter((a) => a.isCorrect).length;
        const totalCount = userQuestionAnswers.length || 1;
        const scorePercent = (correctCount / totalCount) * 100;
        evalData = {
          masteryLevel: scorePercent >= 100 ? 'COMPETENT' : scorePercent > 0 ? 'DEVELOPING' : 'NEEDS_FOUNDATION',
          misconception: scorePercent < 100 ? 'Clarify the distinction between foundational instructions and high-level syntax.' : null,
          tailoredExplanation: `Here is a detailed breakdown of **${diag.topic}** calibrated to your baseline knowledge.`,
          keyTakeaway: 'Always verify prerequisite mental models before diving into advanced code.',
        };
      }

      const masteryTitle = (evalData.masteryLevel || 'DEVELOPING').replace('_', ' ');

      const direct = evalData.directAnswer || evalData.tailoredExplanation || `Here is a comprehensive breakdown of **${diag.topic}**.`;
      const mechanicsSection = evalData.underlyingMechanics
        ? `\n\n#### ⚙️ Under-the-Hood Mechanics\n${evalData.underlyingMechanics}`
        : '';
      const relatedSection = evalData.relatedConcepts
        ? `\n\n#### 🌐 Surrounding Concepts & Big Picture\n${evalData.relatedConcepts}`
        : '';
      const codeSection = evalData.codeExample
        ? `\n\n#### 💻 Practical Example & Architecture\n${evalData.codeExample}`
        : '';
      const nextStepSection = evalData.nextStep
        ? `\n\n> 🗺️ **Recommended Next Step**: ${evalData.nextStep}`
        : '';

      const explanationContent = `### 🎯 Calibrated Explanation: ${masteryTitle}
*Adapted to your diagnostic quiz responses and **${confidence.toUpperCase()}** confidence level*

${evalData.misconception ? `> 💡 **Cognitive Gap Identified**: ${evalData.misconception}\n\n` : ''}

${direct}
${mechanicsSection}
${relatedSection}
${codeSection}
${nextStepSection}

---

**📌 Core Takeaway**: ${evalData.keyTakeaway || 'Master prerequisite concepts to solidify understanding.'}`;

      const aiExplanationMsg: ChatMessage = {
        id: `msg_ai_exp_${Date.now()}`,
        sender: 'assistant',
        content: explanationContent,
        diagnostic: {
          ...diag,
          weakness: evalData.misconception || diag.weakness,
          keyTakeaways: evalData.keyTakeaway
            ? [evalData.keyTakeaway, ...(diag.keyTakeaways || [])]
            : diag.keyTakeaways,
          isExplanation: true,
        },
        timestamp: new Date().toISOString(),
      };

      const updatedMessages = [...activeSession.messages, aiExplanationMsg];
      const updatedSession = {
        ...activeSession,
        messages: updatedMessages,
        updatedAt: new Date().toISOString(),
      };

      const allSessions = sessions.map((s) => (s.id === activeSession.id ? updatedSession : s));
      setSessions(allSessions);
      chatService.saveSessions(allSessions);
    } catch (err) {
      console.error('Failed to generate calibrated explanation:', err);
    } finally {
      setIsCalibratingMsgId(null);
    }
  };

  // Group sessions by Pinned, Today, Yesterday, Older
  const searchLower = searchQuery.toLowerCase().trim();
  const filteredSessions = sessions.filter((s) => {
    if (!searchLower) return true;
    const titleMatch = (s.title || '').toLowerCase().includes(searchLower);
    const messageMatch = s.messages.some((m) => m.content.toLowerCase().includes(searchLower));
    return titleMatch || messageMatch;
  });

  const pinnedSessions = filteredSessions.filter((s) => !!s.pinned);
  const unpinnedSessions = filteredSessions.filter((s) => !s.pinned);

  const todayStr = new Date().toDateString();
  const yesterdayStr = new Date(Date.now() - 86400000).toDateString();

  const todaySessions = unpinnedSessions.filter(
    (s) => new Date(s.createdAt).toDateString() === todayStr
  );
  const yesterdaySessions = unpinnedSessions.filter(
    (s) => new Date(s.createdAt).toDateString() === yesterdayStr
  );
  const olderSessions = unpinnedSessions.filter(
    (s) =>
      new Date(s.createdAt).toDateString() !== todayStr &&
      new Date(s.createdAt).toDateString() !== yesterdayStr
  );


  // Helper to render attachment chips in input box
  const renderAttachmentChips = () => {
    if (currentAttachments.length === 0) return null;
    return (
      <div className="flex flex-wrap gap-2 p-2 bg-indigo-50/70 rounded-xl border border-indigo-100 mb-2">
        {currentAttachments.map((att) => (
          <div
            key={att.id}
            className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white border border-indigo-200/80 text-xs text-indigo-900 shadow-2xs group"
          >
            {att.type.startsWith('image/') ? (
              <ImageIcon className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            ) : (
              <FileText className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            )}
            <span className="truncate max-w-[130px] font-medium">{att.name}</span>
            <span className="text-[10px] text-indigo-400 font-mono">
              ({(att.size / 1024).toFixed(1)} KB)
            </span>
            <button
              type="button"
              onClick={() => setPreviewAttachment(att)}
              className="p-0.5 text-indigo-500 hover:text-indigo-700 rounded transition-colors cursor-pointer"
              title="Preview attachment"
            >
              <Eye className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={() => handleRemoveAttachment(att.id)}
              className="p-0.5 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
              title="Remove attachment"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    );
  };

  // Helper to render each chat history item with 3-dots dropdown
  const renderSessionItem = (session: ChatSession) => {
    const isActive = session.id === activeSession?.id;
    const isMenuOpen = activeMenuSessionId === session.id;
    const isRenaming = renamingSessionId === session.id;

    return (
      <div
        key={session.id}
        onClick={() => {
          if (!isRenaming) setActiveSessionId(session.id);
        }}
        className={`group relative flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
          isActive
            ? 'bg-slate-100 text-slate-900 font-semibold'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
        }`}
      >
        <div className="flex items-center gap-1.5 min-w-0 pr-1 flex-1">
          {session.pinned && <Pin className="w-3 h-3 text-indigo-600 shrink-0 fill-indigo-100" />}

          {isRenaming ? (
            <input
              type="text"
              autoFocus
              value={renameTitle}
              onChange={(e) => setRenameTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveRename(session.id);
                if (e.key === 'Escape') setRenamingSessionId(null);
              }}
              onBlur={() => handleSaveRename(session.id)}
              className="w-full bg-white px-1.5 py-0.5 border border-indigo-400 rounded text-xs outline-none"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span className="truncate text-left">{session.title || 'Discussion'}</span>
          )}
        </div>

        {/* 3-DOTS ACTION TRIGGER */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (isMenuOpen) {
                setActiveMenuSessionId(null);
              } else {
                const rect = e.currentTarget.getBoundingClientRect();
                const spaceBelow = window.innerHeight - rect.bottom;
                setMenuDirection(spaceBelow < 230 ? 'up' : 'down');
                setActiveMenuSessionId(session.id);
              }
            }}
            className={`p-1 rounded-md transition-opacity cursor-pointer ${
              isMenuOpen ? 'opacity-100 bg-slate-200 text-slate-900' : 'opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-700 hover:bg-slate-200/70'
            }`}
            title="Chat options"
          >
            <MoreVertical className="w-3.5 h-3.5" />
          </button>

          {/* FLOATING 3-DOTS MENU */}
          {isMenuOpen && (
            <div
              ref={menuRef}
              onClick={(e) => e.stopPropagation()}
              className={`absolute right-0 ${
                menuDirection === 'up' ? 'bottom-7' : 'top-6'
              } w-44 bg-white border border-slate-200 rounded-xl shadow-xl p-1 z-50 space-y-0.5 animate-in fade-in zoom-in-95 duration-150`}
            >
              <button
                type="button"
                onClick={() => handleTogglePin(session.id, !session.pinned)}
                className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer transition-colors"
              >
                <Pin className={`w-3.5 h-3.5 ${session.pinned ? 'text-indigo-600 fill-indigo-100' : 'text-slate-400'}`} />
                <span>{session.pinned ? 'Unpin Discussion' : 'Pin Discussion'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleStartRename(session)}
                className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Rename Title</span>
              </button>

              <button
                type="button"
                onClick={() => handleOpenShare(session)}
                className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-indigo-700 hover:bg-indigo-50 font-medium flex items-center gap-2 cursor-pointer transition-colors"
              >
                <Share2 className="w-3.5 h-3.5 text-indigo-600" />
                <span>Share with Friends</span>
              </button>

              <button
                type="button"
                onClick={() => handleExportChat(session)}
                className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-slate-400" />
                <span>Export Notes (.md)</span>
              </button>

              <div className="border-t border-slate-100 my-1" />

              <button
                type="button"
                onClick={(e) => handleDeleteChat(e, session.id)}
                className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                <span>Delete Chat</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      className="h-screen w-full flex bg-[#F8FAFC] text-slate-800 font-sans overflow-hidden selection:bg-blue-100 relative"
      onDragOver={(e) => {
        e.preventDefault();
        setIsDraggingOver(true);
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setIsDraggingOver(false);
        }
      }}
      onDrop={(e) => {
        e.preventDefault();
        setIsDraggingOver(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          handleFilesAdded(e.dataTransfer.files);
        }
      }}
    >
      {/* DRAG AND DROP FULLSCREEN OVERLAY */}
      {isDraggingOver && (
        <div className="absolute inset-0 z-50 bg-indigo-950/20 backdrop-blur-xs border-2 border-dashed border-indigo-600 rounded-3xl m-4 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-150 pointer-events-none">
          <div className="w-16 h-16 rounded-2xl bg-white text-indigo-600 shadow-2xl flex items-center justify-center mb-3">
            <UploadCloud className="w-8 h-8 animate-bounce" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Drop files to attach</h3>
          <p className="text-xs text-slate-600 font-medium max-w-sm">
            Attach PDFs, assignments, code scripts, or diagram images. MetaMind AI will parse them directly in this discussion.
          </p>
        </div>
      )}

      {/* MODALS */}
      <PluginMarketplaceModal
        isOpen={isPluginStoreOpen}
        onClose={() => setIsPluginStoreOpen(false)}
        onPluginsUpdated={(updated) => setInstalledPlugins(updated)}
      />

      <ShareChatModal
        isOpen={isShareModalOpen}
        session={sharingSession}
        onClose={() => {
          setIsShareModalOpen(false);
          setSharingSession(null);
        }}
      />

      <FilePreviewModal
        attachment={previewAttachment}
        onClose={() => setPreviewAttachment(null)}
        onRemove={(id) => handleRemoveAttachment(id)}
      />

      <AvatarContextualTour
        avatarUrl={avatarUrl}
        userName={registeredName}
      />

      {/* Hidden Global File Input for Attachment Button */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleFilesAdded(e.target.files);
          }
        }}
      />

      {/* ========================================================= */}
      {/* LEFT SIDEBAR WITH HISTORY, SEARCH, AND PLUGINS STORE */}
      {/* ========================================================= */}
      <aside
        id="tour-chat-sidebar"
        className={`${
          isLeftSidebarOpen ? 'w-64' : 'w-0'
        } transition-all duration-300 ease-in-out bg-white border-r border-slate-200/80 flex flex-col h-full overflow-hidden shrink-0 select-none z-30`}
      >
        {/* TOP FIXED CONTROLS */}
        <div className="p-3.5 space-y-2.5 shrink-0 border-b border-slate-100 bg-white">
          {/* Header with Official Logo */}
          <div className="flex items-center justify-between px-0.5">
            <div className="flex items-center gap-2">
              <img
                src="/assets/brand/metamind_icon.png"
                alt="MetaMind"
                className="w-7 h-7 object-contain rounded-lg shadow-2xs"
              />
              <span className="font-display font-bold text-base text-slate-900 tracking-tight">
                MetaMind AI
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsLeftSidebarOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Close sidebar"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </div>

          {/* New Chat Button */}
          <button
            type="button"
            onClick={handleCreateNewChat}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-all cursor-pointer shadow-2xs"
          >
            <SquarePen className="w-4 h-4 text-slate-500" />
            <span>New Chat</span>
          </button>

          {/* Plugins Marketplace Entry Button */}
          <button
            type="button"
            onClick={() => setIsPluginStoreOpen(true)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-indigo-700 hover:text-indigo-900 bg-indigo-50/70 hover:bg-indigo-100/70 border border-indigo-100 transition-all cursor-pointer shadow-2xs group"
          >
            <div className="flex items-center gap-2">
              <Puzzle className="w-4 h-4 text-indigo-600 group-hover:rotate-12 transition-transform" />
              <span>Plugin Store</span>
            </div>
            <span className="px-1.5 py-0.5 rounded-full bg-indigo-200/80 text-[10px] font-mono font-bold text-indigo-800">
              {installedPlugins.filter((p) => p.isEnabled).length} Active
            </span>
          </button>

          {/* Search Chat Input with Clear Button */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-7 py-1.5 bg-slate-50 border border-slate-200/60 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:bg-white focus:border-indigo-500 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* MIDDLE SCROLLABLE BODY (Takes all remaining vertical space) */}
        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-3.5 space-y-4 pb-16">
          {/* Projects Section */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-medium text-slate-400 px-1 py-1">
              <span>Projects</span>
              <Folder className="w-3.5 h-3.5 text-slate-400" />
            </div>

            <div className="space-y-0.5">
              {projects.map((proj) => {
                const isSelected = selectedProject === proj.id;
                return (
                  <button
                    key={proj.id}
                    type="button"
                    onClick={() => {
                      setSelectedProject(isSelected ? null : proj.id);
                      handleSendMessage(`Let's study concepts from ${proj.name}`);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200/60'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Folder
                        className={`w-3.5 h-3.5 ${
                          isSelected ? 'text-indigo-600' : 'text-slate-400'
                        }`}
                      />
                      <span className="truncate">{proj.name}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">{proj.count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chat History with Time-Groups & 3-Dots Menus */}
          <div className="space-y-3 pt-1">
            {/* PINNED CHATS */}
            {pinnedSessions.length > 0 && (
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-indigo-600 uppercase tracking-wider px-1 flex items-center gap-1">
                  <Pin className="w-2.5 h-2.5 fill-indigo-500" />
                  <span>PINNED</span>
                </span>
                {pinnedSessions.map(renderSessionItem)}
              </div>
            )}

            {/* TODAY */}
            {todaySessions.length > 0 && (
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider px-1">
                  TODAY
                </span>
                {todaySessions.map(renderSessionItem)}
              </div>
            )}

            {/* YESTERDAY */}
            {yesterdaySessions.length > 0 && (
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider px-1">
                  YESTERDAY
                </span>
                {yesterdaySessions.map(renderSessionItem)}
              </div>
            )}

            {/* OLDER DISCUSSIONS */}
            {olderSessions.length > 0 && (
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider px-1">
                  PREVIOUS
                </span>
                {olderSessions.map(renderSessionItem)}
              </div>
            )}

            {filteredSessions.length === 0 && (
              <div className="text-center py-6 text-xs text-slate-400">
                No discussions found matching "{searchQuery}"
              </div>
            )}
          </div>
        </div>

        {/* User Profile Pill at Bottom (Fixed Dock) */}
        <div className="shrink-0 p-3 border-t border-slate-200/80 bg-slate-50/70">
          <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
            <div className="flex items-center gap-2.5 min-w-0 pr-1">
              <GSAPAvatar
                avatarId={avatarUrl}
                size="sm"
                interactive={false}
              />
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-800 truncate">{registeredName}</div>
                <div className="text-[10px] text-slate-400 font-mono">Free Plan</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate('/app/dashboard')}
              className="px-2.5 py-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg text-[10px] font-bold shadow-xs hover:opacity-95 cursor-pointer shrink-0"
            >
              Dashboard
            </button>
          </div>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* MAIN CHAT WORKSPACE CANVAS */}
      {/* ========================================================= */}
      <main className="flex-1 flex flex-col h-full bg-[#F8FAFC] relative overflow-hidden">
        {/* Workspace Top Header */}
        <header className="h-14 border-b border-slate-200/70 bg-white/80 backdrop-blur-xs flex items-center justify-between px-4 sm:px-6 shrink-0 z-20">
          <div className="flex items-center gap-3">
            {!isLeftSidebarOpen && (
              <button
                type="button"
                onClick={() => setIsLeftSidebarOpen(true)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                title="Open sidebar"
              >
                <PanelLeft className="w-4 h-4" />
              </button>
            )}

            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold text-slate-800 max-w-[200px] sm:max-w-xs truncate">
                {activeSession?.title || 'Academic Chat'}
              </span>

              {/* Active Plugin Indicator */}
              <button
                type="button"
                onClick={() => setIsPluginStoreOpen(true)}
                className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 text-[11px] font-semibold text-indigo-700 hover:bg-indigo-100 transition-colors cursor-pointer"
              >
                <Puzzle className="w-3 h-3 text-indigo-600" />
                <span>{CHAT_PLUGINS.find((p) => p.id === activePlugin)?.name || 'Concept Tutor'}</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Share Current Chat Button */}
            {activeSession && (
              <button
                type="button"
                onClick={() => handleOpenShare(activeSession)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:text-indigo-900 bg-indigo-50/80 hover:bg-indigo-100/80 border border-indigo-100 rounded-xl transition-all cursor-pointer shadow-2xs"
                title="Share this chat with friends"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Share</span>
              </button>
            )}

            <button
              id="tour-dashboard-btn"
              type="button"
              onClick={() => navigate('/app/dashboard')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-xl transition-colors cursor-pointer"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Dashboard</span>
            </button>

            <button
              type="button"
              onClick={handleCreateNewChat}
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              title="New Chat"
            >
              <SquarePen className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Conversational Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 relative z-10">
          {isFreshSession ? (
            /* CENTERED CREATIVE WELCOME WORKSPACE */
            <div className="max-w-3xl mx-auto py-8 sm:py-12 space-y-8">
              {/* Header Hero */}
              <div className="welcome-hero text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-linear-to-r from-indigo-50 via-purple-50 to-blue-50 border border-indigo-100/90 shadow-2xs">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
                  </span>
                  <span className="text-[11px] font-semibold tracking-wider text-indigo-700 uppercase font-mono">
                    MetaMind Cognitive Neural Workspace
                  </span>
                </div>

                <div className="space-y-2">
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
                    Good day, <span className="text-shimmer-gradient">{registeredName}</span>
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-lg mx-auto font-sans">
                    Ask any doubt, attach coursework files, or explore real-time diagnostic reasoning drills customized to your study pace.
                  </p>
                </div>
              </div>

              {/* Center Interactive Prompt Box */}
              <div id="tour-chat-prompt" className="welcome-prompt-box w-full bg-white border border-slate-200/90 focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-500/10 rounded-3xl p-3.5 sm:p-4 shadow-xl shadow-slate-200/40 space-y-3 text-left transition-all">
                {/* Attached File Chips */}
                {renderAttachmentChips()}

                <textarea
                  rows={3}
                  placeholder="Ask any question, paste code snippets, or drop study notes..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full text-sm sm:text-base text-slate-800 placeholder:text-slate-400 bg-transparent border-none outline-none resize-none px-2 pt-1 font-sans"
                />

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1.5">
                    {/* Attachment trigger button */}
                    <button
                      id="tour-chat-attach"
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors cursor-pointer"
                      title="Attach file (PDF, code, document)"
                    >
                      <Paperclip className="w-4 h-4 text-slate-400" />
                      <span className="hidden sm:inline">Attach</span>
                    </button>

                    {/* Plugin Store quick shortcut */}
                    <button
                      id="tour-chat-plugins"
                      type="button"
                      onClick={() => setIsPluginStoreOpen(true)}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors cursor-pointer"
                      title="Explore downloadable plugins"
                    >
                      <Puzzle className="w-4 h-4 text-indigo-600" />
                      <span>Plugins</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-mono text-slate-400 hidden sm:inline-flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-indigo-500" />
                      {selectedModel}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleSendMessage()}
                      disabled={!inputMessage.trim() && currentAttachments.length === 0}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-xs ${
                        inputMessage.trim() || currentAttachments.length > 0
                          ? 'bg-linear-to-r from-indigo-600 to-cyan-600 text-white hover:opacity-90 shadow-indigo-500/25 scale-100 active:scale-95'
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      }`}
                      title="Send prompt"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Topic Pills */}
              <div className="welcome-chips flex flex-wrap items-center justify-center gap-2">
                {[
                  { label: '⚡ SQL Optimization', prompt: 'How does database indexing work and how do B-Trees optimize SQL query performance?' },
                  { label: '🌳 Binary Search Trees', prompt: 'Explain the difference between Binary Search Trees and AVL self-balancing trees with search complexity.' },
                  { label: '🌐 TCP 3-Way Handshake', prompt: 'Explain the TCP 3-way handshake vs UDP with packet sequence diagrams.' },
                  { label: '🔄 Recursion & Stack Frames', prompt: 'How do recursive call stack frames work and how do you prevent stack overflow errors?' },
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(chip.prompt)}
                    className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:text-indigo-600 bg-white hover:bg-indigo-50/70 border border-slate-200/90 hover:border-indigo-300 rounded-full transition-all shadow-2xs hover:shadow-xs hover:-translate-y-0.5 cursor-pointer flex items-center gap-1.5"
                  >
                    <span>{chip.label}</span>
                  </button>
                ))}
              </div>

              {/* 4 Interactive Starter Capability Cards */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                    Suggested Diagnostic Workflows
                  </span>
                  <span className="text-xs text-indigo-600 font-medium">Click to run immediately</span>
                </div>

                <div id="tour-chat-starter-cards" className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {starterCards.map((card, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSendMessage(card.prompt)}
                      className="welcome-starter-card group relative p-4 bg-white hover:bg-linear-to-br hover:from-white hover:to-indigo-50/30 border border-slate-200/90 hover:border-indigo-300 rounded-2xl text-left transition-all duration-200 shadow-2xs hover:shadow-md hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${card.badgeColor}`}>
                            {card.badge}
                          </span>
                          <span className="text-xl group-hover:scale-115 transition-transform duration-200">
                            {card.icon}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors font-display">
                            {card.title}
                          </h3>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                            {card.desc}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-xs font-semibold text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity pt-3">
                        <span>Launch prompt</span>
                        <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* CONVERSATION THREAD */
            <div className="max-w-3xl mx-auto space-y-6 pb-24">
              {activeSession.messages.map((message) => {
                const isUser = message.sender === 'user';
                return (
                  <div
                    key={message.id}
                    id={`msg-${message.id}`}
                    className={`chat-message-row flex gap-3 sm:gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isUser && (
                      <img
                        src="/assets/brand/metamind_icon.png"
                        alt="MetaMind AI"
                        className="ai-avatar w-8 h-8 rounded-xl object-contain border border-indigo-100 bg-white shadow-2xs shrink-0 p-0.5 mt-1 will-change-transform"
                      />
                    )}

                    <div className="max-w-[88%] sm:max-w-[80%] space-y-2">
                      {/* Attached documents in message bubble */}
                      {message.attachments && message.attachments.length > 0 && (
                        <div
                          className={`flex flex-wrap gap-2 ${
                            isUser ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          {message.attachments.map((att) => (
                            <button
                              key={att.id}
                              type="button"
                              onClick={() => setPreviewAttachment(att)}
                              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 text-xs text-slate-800 transition-all cursor-pointer shadow-2xs group"
                            >
                              {att.type.startsWith('image/') ? (
                                <ImageIcon className="w-3.5 h-3.5 text-indigo-600" />
                              ) : (
                                <FileText className="w-3.5 h-3.5 text-indigo-600" />
                              )}
                              <span className="font-semibold truncate max-w-[150px]">
                                {att.name}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                ({(att.size / 1024).toFixed(1)} KB)
                              </span>
                              <Eye className="w-3 h-3 text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Main Bubble */}
                      <div
                        className={`ai-bubble p-4 sm:p-5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs will-change-transform ${
                          isUser
                            ? 'bg-slate-900 text-white rounded-br-xs font-sans'
                            : 'bg-white border border-slate-200/90 text-slate-800 rounded-bl-xs'
                        }`}
                      >
                        {isUser ? (
                          <div className="whitespace-pre-wrap">{message.content}</div>
                        ) : (
                          <FormattedAiContent content={message.content} />
                        )}
                      </div>

                      {/* Cognitive Diagnostic Card (only renders if message has diagnostic questions) */}
                      {!isUser &&
                        message.diagnostic &&
                        !message.diagnostic.isExplanation &&
                        message.diagnostic.quickCheck &&
                        message.diagnostic.quickCheck.length > 0 && (
                        <div className="ai-diagnostic p-4 rounded-2xl bg-indigo-50/40 border border-indigo-100 space-y-3 shadow-2xs will-change-transform">
                          <div className="flex items-center justify-between border-b border-indigo-100/80 pb-2">
                            <div className="flex items-center gap-2">
                              <Brain className="w-4 h-4 text-indigo-600" />
                              <span className="text-xs font-bold text-slate-900">
                                Diagnostic Gap: {message.diagnostic.topic}
                              </span>
                            </div>
                            <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-bold">
                              {message.diagnostic.confidenceLevel} Confidence
                            </span>
                          </div>

                          {/* Quick Check Questions */}
                          {message.diagnostic.quickCheck.map((q) => {
                            const selectedAns = quizAnswers[`${message.id}_${q.id}`];
                            const isAnswered = selectedAns !== undefined;

                            return (
                              <div
                                key={q.id}
                                className="ai-quiz-item p-3 bg-white rounded-xl border border-slate-200/70 space-y-2 text-xs will-change-transform"
                              >
                                <div className="font-semibold text-slate-800">
                                  {q.question}
                                </div>
                                <div className="space-y-1">
                                  {q.options.map((opt, optIdx) => {
                                    const isChosen = selectedAns === optIdx;
                                    const isCorrect = q.correctIndex === optIdx;

                                    return (
                                      <button
                                        key={optIdx}
                                        type="button"
                                        disabled={isAnswered}
                                        onClick={() =>
                                          handleSelectQuizAnswer(message.id, q.id, optIdx)
                                        }
                                        className={`w-full text-left p-2 rounded-lg text-xs transition-colors cursor-pointer ${
                                          !isAnswered
                                            ? 'hover:bg-slate-50 border border-slate-100'
                                            : isChosen && !isCorrect
                                            ? 'bg-rose-50 border border-rose-300 text-rose-800'
                                            : isCorrect
                                            ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                                            : 'bg-white border border-slate-100 text-slate-400'
                                        }`}
                                      >
                                        {opt}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}

                          {/* Interactive Confidence Meter & Calibrate Button (Always visible on diagnostic cards) */}
                          {message.diagnostic.quickCheck.length > 0 && (
                            <div className="mt-4 pt-3 border-t border-indigo-100/90 space-y-3 bg-white/90 p-3.5 rounded-xl border border-indigo-100 shadow-2xs">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div>
                                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                                    Confidence Meter
                                  </span>
                                  <p className="text-[11px] text-slate-500">
                                    How confident do you feel in this concept? (Select to calibrate depth)
                                  </p>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  {[
                                    { id: 'low', label: '🔴 Low' },
                                    { id: 'medium', label: '🟡 Moderate' },
                                    { id: 'high', label: '🟢 High' },
                                  ].map((lvl) => {
                                    const isSelected =
                                      (quizConfidence[message.id] || 'medium') === lvl.id;
                                    return (
                                      <button
                                        key={lvl.id}
                                        type="button"
                                        onClick={() =>
                                          setQuizConfidence((prev) => ({
                                            ...prev,
                                            [message.id]: lvl.id as any,
                                          }))
                                        }
                                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                                          isSelected
                                            ? 'bg-indigo-600 text-white shadow-2xs'
                                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                        }`}
                                      >
                                        {lvl.label}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>

                              <button
                                type="button"
                                disabled={isCalibratingMsgId === message.id}
                                onClick={() => handleGenerateCalibratedExplanation(message)}
                                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold text-xs shadow-xs transition-all cursor-pointer disabled:opacity-70"
                              >
                                {isCalibratingMsgId === message.id ? (
                                  <span>Llama 3.1 is Calibrating Explanation...</span>
                                ) : (
                                  <>
                                    <Sparkles className="w-4 h-4 text-amber-300" />
                                    <span>✨ Calibrate & Deepen My Explanation</span>
                                  </>
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {/* PDF Study Guide Action */}
                      {message.diagnostic && (
                        <div className="ai-actions mt-3 pt-2 border-t border-slate-100 flex justify-end will-change-transform">
                          <button
                            type="button"
                            onClick={() => {
                              const isExp = message.diagnostic?.isExplanation;
                              let realExp = isExp ? message.content : undefined;
                              let diagToUse = { ...message.diagnostic! };

                              if (!isExp) {
                                const subsequentExp = activeSession?.messages?.find(
                                  (m) => m.sender === 'assistant' && m.diagnostic?.isExplanation
                                );
                                if (subsequentExp) {
                                  realExp = subsequentExp.content;
                                }
                              } else {
                                if (!diagToUse.quickCheck || diagToUse.quickCheck.length === 0) {
                                  const turn1Msg = activeSession?.messages?.find(
                                    (m) => m.sender === 'assistant' && !m.diagnostic?.isExplanation && m.diagnostic?.quickCheck?.length
                                  );
                                  if (turn1Msg?.diagnostic?.quickCheck?.length) {
                                    diagToUse.quickCheck = turn1Msg.diagnostic.quickCheck;
                                  }
                                }
                              }

                              const resolvedTitle =
                                diagToUse.topic ||
                                (activeSession?.title && activeSession.title !== 'Welcome to MetaMind AI' ? activeSession.title : '') ||
                                'Academic Doubt';

                              downloadStudyGuidePdf(
                                resolvedTitle,
                                diagToUse,
                                registeredName,
                                undefined,
                                realExp
                              );
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                          >
                            <FileDown className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Export Study Guide PDF</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {isUser && (
                      <GSAPAvatar
                        avatarId={avatarUrl}
                        size="sm"
                        interactive={false}
                        className="shrink-0 shadow-2xs"
                      />
                    )}
                  </div>
                );
              })}

              {isAiThinking && (
                <div className="flex items-start gap-3">
                  <img
                    src="/assets/brand/metamind_icon.png"
                    alt="MetaMind AI"
                    className="w-8 h-8 rounded-xl object-contain border border-indigo-100 bg-white shadow-2xs shrink-0 animate-pulse p-0.5"
                  />
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex items-center gap-2">
                    <LoaderGrid size="0.4em" />
                    <span className="text-xs text-slate-500 font-medium">
                      MetaMind AI is reasoning...
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* BOTTOM DOCKED PROMPT INPUT (When in active conversation) */}
        {!isFreshSession && (
          <div className="p-4 bg-white/95 border-t border-slate-100 backdrop-blur-xs relative z-20">
            <div className="max-w-3xl mx-auto bg-white border border-slate-200/90 rounded-2xl p-2.5 sm:p-3 shadow-md space-y-2">
              {/* Attached file chips above input */}
              {renderAttachmentChips()}

              <textarea
                rows={1}
                placeholder="Ask a follow up question or attach notes..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 bg-transparent border-none outline-none resize-none px-2 font-sans"
              />

              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                    title="Attach file (PDF, code, doc)"
                  >
                    <Paperclip className="w-3.5 h-3.5" />
                  </button>

                  {/* Plugin Store quick trigger */}
                  <button
                    type="button"
                    onClick={() => setIsPluginStoreOpen(true)}
                    className="flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 rounded-md transition-colors cursor-pointer"
                  >
                    <Puzzle className="w-3 h-3 text-indigo-600" />
                    <span>Plugins ({installedPlugins.filter((p) => p.isEnabled).length})</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-400">{selectedModel}</span>
                  <button
                    type="button"
                    onClick={() => handleSendMessage()}
                    disabled={!inputMessage.trim() && currentAttachments.length === 0}
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                      inputMessage.trim() || currentAttachments.length > 0
                        ? 'bg-slate-900 text-white hover:bg-slate-800'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
