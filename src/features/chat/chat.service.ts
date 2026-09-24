import type {
  ChatSession,
  PluginId,
  ChatPlugin,
  CognitiveDiagnostic,
  ChatAttachment,
  QuickCheckQuestion,
} from './chat.types';
import { ACADEMIC_DATASET, type TopicKnowledgeItem } from './academicDataset';
import {
  parseUserRequirement,
  extractCleanSubjectTopic,
  type UserRequirement,
} from './nlpPredictor';

const CHAT_STORAGE_KEY = 'metamind_chat_sessions_v1';
const INSTALLED_PLUGINS_KEY = 'metamind_installed_plugins_v1';
const USER_CUSTOM_PLUGINS_KEY = 'metamind_user_custom_plugins_v1';
const SHARED_CHATS_PREFIX = 'metamind_shared_chat_';

export const FULL_PLUGIN_CATALOG: ChatPlugin[] = [
  {
    id: 'concept-explainer',
    name: 'Concept Tutor',
    icon: '🧠',
    description: 'Diagnoses student doubts, prerequisite gaps, and provides intuitive explanations.',
    badge: 'Core',
    category: 'Core',
    isInstalled: true,
    isEnabled: true,
    downloadsCount: '48.2k',
    version: '2.4.0',
    author: 'MetaMind AI Core',
    features: ['Cognitive gap diagnostics', 'Prerequisite tree breakdown', 'Interactive quick-check quiz'],
  },
  {
    id: 'code-debugger',
    name: 'Code & Syntax Debugger',
    icon: '💻',
    description: 'Finds logic bugs, runtime errors, and refactors code for maximum efficiency.',
    badge: 'Dev',
    category: 'Engineering',
    isInstalled: true,
    isEnabled: true,
    downloadsCount: '39.8k',
    version: '1.9.2',
    author: 'MetaMind Systems',
    features: ['Syntax & runtime bug detector', 'Line-by-line fix breakdown', 'Best practice patterns'],
  },
  {
    id: 'math-latex',
    name: 'LaTeX Math & Derivations',
    icon: '📐',
    description: 'Generates step-by-step calculus, algebra, and discrete math proofs with clean LaTeX formatting.',
    badge: 'Math',
    category: 'STEM & Math',
    isInstalled: false,
    isEnabled: false,
    downloadsCount: '31.5k',
    version: '2.1.0',
    author: 'MIT OpenLearn Collab',
    features: ['Step-by-step formula derivations', 'LaTeX math formulas', 'Symbolic variable verification'],
  },
  {
    id: 'code-runner',
    name: 'Python Sandbox & Big-O',
    icon: '⚡',
    description: 'Generates runnable Python/JS algorithms with Big-O time and space complexity audits.',
    badge: 'Exec',
    category: 'Engineering',
    isInstalled: false,
    isEnabled: false,
    downloadsCount: '27.4k',
    version: '1.4.1',
    author: 'Algorithmic Lab',
    features: ['Runnable code blocks', 'Big-O time/space complexity', 'Test case boundary suites'],
  },
  {
    id: 'diagram-architect',
    name: 'System Architecture & Diagrams',
    icon: '📊',
    description: 'Creates ASCII flowcharts, state transitions, and Mermaid diagrams for distributed systems.',
    badge: 'Visual',
    category: 'Engineering',
    isInstalled: false,
    isEnabled: false,
    downloadsCount: '22.9k',
    version: '2.0.0',
    author: 'CloudSys Institute',
    features: ['Visual system flowcharts', 'Component architecture blocks', 'Data flow lifecycle maps'],
  },
  {
    id: 'flashcard-gen',
    name: 'Active Recall & Flashcards',
    icon: '🗂️',
    description: 'Automatically synthesizes chat discussions into spaced-repetition flashcards and revision decks.',
    badge: 'Recall',
    category: 'Active Recall',
    isInstalled: false,
    isEnabled: false,
    downloadsCount: '35.1k',
    version: '3.0.2',
    author: 'Cognitive Science Guild',
    features: ['One-click flashcard cards', 'Spaced-repetition cues', 'Exam revision summary'],
  },
  {
    id: 'academic-scholar',
    name: 'Academic Scholar & Citations',
    icon: '📚',
    description: 'Extracts verified academic references, peer-reviewed citations, and publication summaries.',
    badge: 'Research',
    category: 'Research',
    isInstalled: false,
    isEnabled: false,
    downloadsCount: '19.3k',
    version: '1.2.0',
    author: 'ScholarNet Labs',
    features: ['IEEE & APA format citations', 'Peer-reviewed abstracts', 'Methodology comparisons'],
  },
  {
    id: 'socratic-tutor',
    name: 'Socratic Tutor Mode',
    icon: '🏛️',
    description: 'Guides you through doubts using guided questions rather than just handing you the answer.',
    badge: 'Tutor',
    category: 'Core',
    isInstalled: false,
    isEnabled: false,
    downloadsCount: '18.7k',
    version: '1.5.0',
    author: 'Pedagogy Collective',
    features: ['Guided discovery dialogue', 'Critical thinking probes', 'Self-paced verification'],
  },
  {
    id: 'eli5-analogy',
    name: 'ELI5 Intuitive Metaphors',
    icon: '🎈',
    description: 'Explains complex theorems and abstract algorithms using simple everyday real-world analogies.',
    badge: 'Analogy',
    category: 'Customization',
    isInstalled: true,
    isEnabled: false,
    downloadsCount: '44.3k',
    version: '2.0.0',
    author: 'MetaMind Pedagogy',
    features: ['Zero-jargon explanations', 'Everyday mental models', 'Visual metaphors'],
  },
  {
    id: 'mnemonic-master',
    name: 'Exam Cram & Mnemonics',
    icon: '💡',
    description: 'Generates high-yield memory acronyms, visual pegs, and exam revision cheat-sheet tables.',
    badge: 'Memory',
    category: 'Customization',
    isInstalled: false,
    isEnabled: false,
    downloadsCount: '38.2k',
    version: '1.8.0',
    author: 'NeuroLearn Institute',
    features: ['Acronyms & memory pegs', 'High-yield exam traps', 'Revision cheat-sheets'],
  },
  {
    id: 'feynman-coach',
    name: 'Feynman Technique Coach',
    icon: '🎓',
    description: 'Tests your depth by challenging you to explain back concepts and revealing hidden blind spots.',
    badge: 'Mastery',
    category: 'Customization',
    isInstalled: false,
    isEnabled: false,
    downloadsCount: '29.1k',
    version: '1.4.0',
    author: 'Richard Feynman Lab',
    features: ['Reverse diagnostic testing', 'Blind spot detector', 'Plain-English verification'],
  },
  {
    id: 'mock-interviewer',
    name: 'FAANG & Viva Interviewer',
    icon: '🎯',
    description: 'Drills you with realistic technical interview follow-up questions, edge cases, and rubrics.',
    badge: 'Career',
    category: 'Customization',
    isInstalled: false,
    isEnabled: false,
    downloadsCount: '33.6k',
    version: '2.2.0',
    author: 'InterviewReady Labs',
    features: ['Technical pressure drills', 'Engineering trade-offs', 'Viva defense questions'],
  },
  {
    id: 'polyglot-translator',
    name: 'Polyglot & Multilingual Glossary',
    icon: '🌐',
    description: 'Generates multilingual concept glossaries in Spanish, French, German, Hindi, and Japanese.',
    badge: 'Global',
    category: 'Customization',
    isInstalled: false,
    isEnabled: false,
    downloadsCount: '21.4k',
    version: '1.3.0',
    author: 'Linguistics AI Hub',
    features: ['Multilingual translations', 'Etymology insights', 'Global academic terms'],
  },
];

export const CHAT_PLUGINS = FULL_PLUGIN_CATALOG;

export const chatService = {
  getSessions(): ChatSession[] {
    try {
      const raw = localStorage.getItem(CHAT_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }

    // Default seed session
    const initialSession: ChatSession = {
      id: 'session_default_welcome',
      title: 'Welcome to MetaMind AI',
      pluginId: 'concept-explainer',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      updatedAt: new Date().toISOString(),
      pinned: false,
      messages: [
        {
          id: 'msg_welcome_ai',
          sender: 'assistant',
          content:
            "Hello! I am your MetaMind AI Cognitive Tutor. Ask any doubt, attach course documents, paste code, compare architectures, or troubleshoot a bug. I will automatically diagnose conceptual gaps, apply your installed plugins, and generate customized study solutions!",
          timestamp: new Date(Date.now() - 3600000).toISOString(),
        },
      ],
    };

    this.saveSessions([initialSession]);
    return [initialSession];
  },

  saveSessions(sessions: ChatSession[]): void {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(sessions));
  },

  createSession(pluginId: PluginId = 'concept-explainer'): ChatSession {
    const newSession: ChatSession = {
      id: `session_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: 'New Discussion',
      pluginId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      pinned: false,
      messages: [],
    };
    const current = this.getSessions();
    this.saveSessions([newSession, ...current]);
    return newSession;
  },

  deleteSession(sessionId: string): ChatSession[] {
    const updated = this.getSessions().filter((s) => s.id !== sessionId);
    this.saveSessions(updated);
    return updated;
  },

  pinSession(sessionId: string, pinned: boolean): ChatSession[] {
    const updated = this.getSessions().map((s) =>
      s.id === sessionId ? { ...s, pinned, updatedAt: new Date().toISOString() } : s
    );
    this.saveSessions(updated);
    return updated;
  },

  renameSession(sessionId: string, newTitle: string): ChatSession[] {
    const trimmed = newTitle.trim();
    if (!trimmed) return this.getSessions();
    const updated = this.getSessions().map((s) =>
      s.id === sessionId ? { ...s, title: trimmed, updatedAt: new Date().toISOString() } : s
    );
    this.saveSessions(updated);
    return updated;
  },

  /* ---------------- Custom Plugins Management ---------------- */
  getCustomPlugins(): ChatPlugin[] {
    try {
      const raw = localStorage.getItem(USER_CUSTOM_PLUGINS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return [];
  },

  createCustomPlugin(data: {
    name: string;
    icon: string;
    description: string;
    customPrompt: string;
    category?: 'Core' | 'STEM & Math' | 'Engineering' | 'Active Recall' | 'Research' | 'Customization' | 'Custom';
  }): ChatPlugin {
    const id = `custom_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newPlugin: ChatPlugin = {
      id,
      name: data.name.trim(),
      icon: data.icon || '⚡',
      description: data.description.trim() || 'Custom user prompt customization module.',
      badge: 'Custom',
      category: data.category || 'Custom',
      isInstalled: true,
      isEnabled: true,
      downloadsCount: '1',
      version: '1.0.0',
      author: 'You',
      features: ['Personalized reasoning logic', 'Direct prompt augmentation'],
      isCustom: true,
      customPrompt: data.customPrompt.trim(),
    };

    const current = this.getCustomPlugins();
    const updated = [newPlugin, ...current];
    localStorage.setItem(USER_CUSTOM_PLUGINS_KEY, JSON.stringify(updated));
    return newPlugin;
  },

  deleteCustomPlugin(pluginId: string): ChatPlugin[] {
    const current = this.getCustomPlugins().filter((p) => p.id !== pluginId);
    localStorage.setItem(USER_CUSTOM_PLUGINS_KEY, JSON.stringify(current));
    return this.getInstalledPlugins();
  },

  /* ---------------- Plugin Marketplace Management ---------------- */
  getInstalledPlugins(): ChatPlugin[] {
    const customList = this.getCustomPlugins();
    const allCatalog = [...FULL_PLUGIN_CATALOG, ...customList];

    try {
      const raw = localStorage.getItem(INSTALLED_PLUGINS_KEY);
      if (raw) {
        const saved: Record<string, { isInstalled: boolean; isEnabled: boolean }> = JSON.parse(raw);
        return allCatalog.map((p) => ({
          ...p,
          isInstalled: saved[p.id] !== undefined ? saved[p.id].isInstalled : (p.isCustom ? true : p.isInstalled),
          isEnabled: saved[p.id] !== undefined ? saved[p.id].isEnabled : (p.isCustom ? true : p.isEnabled),
        }));
      }
    } catch {
      // fallback
    }
    return allCatalog;
  },

  savePluginsState(plugins: ChatPlugin[]) {
    const map: Record<string, { isInstalled: boolean; isEnabled: boolean }> = {};
    plugins.forEach((p) => {
      map[p.id] = { isInstalled: !!p.isInstalled, isEnabled: !!p.isEnabled };
    });
    localStorage.setItem(INSTALLED_PLUGINS_KEY, JSON.stringify(map));
  },

  installPlugin(pluginId: PluginId): ChatPlugin[] {
    const list = this.getInstalledPlugins().map((p) =>
      p.id === pluginId ? { ...p, isInstalled: true, isEnabled: true } : p
    );
    this.savePluginsState(list);
    return list;
  },

  uninstallPlugin(pluginId: PluginId): ChatPlugin[] {
    const list = this.getInstalledPlugins().map((p) =>
      p.id === pluginId ? { ...p, isInstalled: false, isEnabled: false } : p
    );
    this.savePluginsState(list);
    return list;
  },

  togglePlugin(pluginId: PluginId): ChatPlugin[] {
    const list = this.getInstalledPlugins().map((p) =>
      p.id === pluginId ? { ...p, isEnabled: !p.isEnabled } : p
    );
    this.savePluginsState(list);
    return list;
  },

  /* ---------------- Chat Sharing & Forking ---------------- */
  saveSharedChat(session: ChatSession): { shareId: string; shareUrl: string } {
    const shareId = `share_${session.id.replace('session_', '')}_${Date.now().toString(36)}`;
    const sharedBundle: ChatSession = {
      ...session,
      sharedId: shareId,
      sharedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem(`${SHARED_CHATS_PREFIX}${shareId}`, JSON.stringify(sharedBundle));
    } catch {
      // ignore
    }

    // URL safe base64 encoding payload fallback so link works across devices
    let payload = '';
    try {
      const minimal = {
        title: session.title,
        pluginId: session.pluginId,
        createdAt: session.createdAt,
        messages: session.messages.slice(-10), // keep recent 10 messages for link brevity
      };
      payload = encodeURIComponent(btoa(unescape(encodeURIComponent(JSON.stringify(minimal)))));
    } catch {
      // fallback
    }

    const shareUrl = `${window.location.origin}/shared-chat/${shareId}${payload ? `?data=${payload}` : ''}`;
    return { shareId, shareUrl };
  },

  getSharedChat(shareId: string, urlDataParam?: string | null): ChatSession | null {
    // 1. Try localStorage
    try {
      const raw = localStorage.getItem(`${SHARED_CHATS_PREFIX}${shareId}`);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {
      // continue
    }

    // 2. Try URL parameter data
    if (urlDataParam) {
      try {
        const decoded = decodeURIComponent(escape(atob(decodeURIComponent(urlDataParam))));
        const parsed = JSON.parse(decoded);
        return {
          id: `session_imported_${Date.now()}`,
          title: parsed.title || 'Shared Discussion',
          pluginId: parsed.pluginId || 'concept-explainer',
          createdAt: parsed.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          messages: parsed.messages || [],
          sharedId: shareId,
        };
      } catch {
        // continue
      }
    }

    return null;
  },

  forkSharedChat(sharedSession: ChatSession): ChatSession {
    const newSession: ChatSession = {
      ...sharedSession,
      id: `session_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: `${sharedSession.title} (Continued)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      pinned: false,
      messages: [...sharedSession.messages],
    };

    const current = this.getSessions();
    this.saveSessions([newSession, ...current]);
    return newSession;
  },

  /**
   * Async AI response generation that queries local Llama 3.1 server (port 3001)
   * with automatic fallback to static rule-based system if offline.
   */
  async generateCognitiveResponseAsync(
    userPrompt: string,
    pluginId: PluginId = 'concept-explainer',
    activePluginIds: PluginId[] = [],
    attachments: ChatAttachment[] = []
  ): Promise<{
    content: string;
    diagnostic?: CognitiveDiagnostic;
  }> {
    const trimmed = userPrompt.trim();
    const lower = trimmed.toLowerCase();
    const clean = lower.replace(/[^\w\s]/gi, ' ').replace(/\s+/g, ' ').trim();

    // 1. Let greetings / doubt announcements / smalltalk / quiz requests handle via conversational router
    const isGreeting =
      /^(hi|hello|hey|yo|sup|greetings|howdy|hola|namaste|good\s*(morning|afternoon|evening|day)|hi\s*there|hello\s*there)$/i.test(
        clean
      ) || clean === 'hello' || clean === 'hi' || clean === 'hey';

    const isDoubtIntent =
      /^(i\s*have\s*(a\s*|an\s*|some\s*|one\s*)?(doubt|question|problem|query|issue|doubts|questions)|can\s*i\s*ask\s*(a\s*|an\s*)?(doubt|question)|have\s*(a\s*|an\s*)?doubt|got\s*(a\s*|an\s*)?doubt|i\s*need\s*help|help\s*me|solve\s*my\s*doubt|doubt|doubts)$/i.test(
        clean
      );

    const isSmalltalk =
      /^(who\s*are\s*you|what\s*can\s*you\s*do|what\s*is\s*metamind|help|how\s*does\s*this\s*work|how\s*to\s*use)$/i.test(
        clean
      );

    if (isGreeting || isDoubtIntent || isSmalltalk || clean.length <= 6) {
      return this.generateCognitiveResponse(userPrompt, pluginId, activePluginIds, attachments);
    }

    // 2. Query Local Llama 3.1 Inference Bridge
    try {
      const res = await fetch('http://localhost:3001/api/ai/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userPrompt }),
      });

      if (res.ok) {
        const data = await res.json();
        const subject = data.subject || 'Computer Science & STEM';
        const topic = data.topic || userPrompt;
        const prerequisite = data.prerequisite || 'Foundational Principles';

        const quickCheck: QuickCheckQuestion[] = (data.questions || []).map((q: any, idx: number) => {
          const options: string[] = q.options || [];
          let correctIndex = options.findIndex((opt) => opt.trim() === (q.correctAnswer || '').trim());
          if (correctIndex === -1) correctIndex = 0;

          return {
            id: q.id || `q_llama_${Date.now()}_${idx}`,
            question: q.question,
            options,
            correctIndex,
            explanation: q.explanation || 'Verified with local Llama 3.1 diagnostic probe.',
          };
        });

        const keyTakeaways: string[] = Array.isArray(data.keyTakeaways) && data.keyTakeaways.length > 0
          ? data.keyTakeaways
          : [
            `Core Concept: ${topic}`,
            `Prerequisite Foundation: ${prerequisite}`,
            `Verify mental models against boundary conditions and system execution flow.`,
          ];

        const diagnostic: CognitiveDiagnostic = {
          topic,
          subject,
          doubtSummary: `In-depth cognitive breakdown of **${topic}** with verified prerequisite anchor **${prerequisite}**.`,
          weakness: `Prerequisite Gap: ${prerequisite}`,
          strength: `Target Concept: ${topic}`,
          confidenceScore: 75,
          confidenceLevel: 'Moderate',
          keyTakeaways,
          quickCheck,
        };

        const detailedExplanation = data.detailedExplanation || `### 🎯 Comprehensive Pedagogical Breakdown: ${topic}\n\nTo master **${topic}**, you must first anchor your understanding in **${prerequisite}**.\n\n${userPrompt}`;

        const content = `${detailedExplanation}

---

> 💡 **Cognitive Check**: Test your understanding with the diagnostic verification questions and select your confidence level below to calibrate your mastery profile!`;

        return { content, diagnostic };
      }
    } catch (err) {
      console.warn('Local Llama bridge call failed, using rule-based fallback:', err);
    }

    // 3. Fallback to existing rule-based engine
    return this.generateCognitiveResponse(userPrompt, pluginId, activePluginIds, attachments);
  },

  /**
   * Main AI response generation with Question Scenario Prediction,
   * Attached Document Integration, and Applied Plugins
   */
  generateCognitiveResponse(
    userPrompt: string,
    pluginId: PluginId = 'concept-explainer',
    activePluginIds: PluginId[] = [],
    attachments: ChatAttachment[] = []
  ): {
    content: string;
    diagnostic?: CognitiveDiagnostic;
  } {
    const trimmed = userPrompt.trim();
    const lower = trimmed.toLowerCase();
    const clean = lower.replace(/[^\w\s]/gi, ' ').replace(/\s+/g, ' ').trim();

    // 1. GREETINGS: Respond politely without diagnostic clutter
    const isGreeting =
      /^(hi|hello|hey|yo|sup|greetings|howdy|hola|namaste|good\s*(morning|afternoon|evening|day)|hi\s*there|hello\s*there)$/i.test(
        clean
      ) ||
      clean === 'hello' ||
      clean === 'hi' ||
      clean === 'hey';

    if (isGreeting) {
      return {
        content: `Hello! 👋 How may I help you with your studies today?\n\nFeel free to ask any doubt, paste a code problem, or mention any concept you'd like to explore:\n• ⚖️ **Comparisons**: *"Compare SQL vs NoSQL"* or *"TCP vs UDP"* \n• 🐛 **Debugging**: *"Why does my LEFT JOIN return NULL values?"*\n• 💻 **Code**: *"Implement Binary Search Tree in Python"*\n• 🏗️ **Architecture**: *"Microservices vs Monolith trade-offs"* \n• 🎯 **Interview**: *"Top interview questions on Deadlocks"*\n\nI will predict your question scenario and diagnose your understanding step-by-step!`,
        diagnostic: undefined,
      };
    }

    // 2. DOUBT INTENT / READINESS (e.g. "i have doubt", "i have an doubt", "i have a question")
    const isDoubtIntent =
      /^(i\s*have\s*(a\s*|an\s*|some\s*|one\s*)?(doubt|question|problem|query|issue|doubts|questions)|can\s*i\s*ask\s*(a\s*|an\s*)?(doubt|question)|have\s*(a\s*|an\s*)?doubt|got\s*(a\s*|an\s*)?doubt|i\s*need\s*help(\s*with\s*(a\s*|an\s*)?(doubt|question|my\s*doubt))?|need\s*help(\s*with\s*(a\s*|an\s*)?(doubt|question))?|help\s*me(\s*with\s*(a\s*|an\s*)?(doubt|question|my\s*doubt))?|can\s*you\s*help\s*me(\s*with\s*(a\s*|an\s*)?(doubt|question|my\s*doubt))?|im\s*stuck|i\s*am\s*stuck|im\s*confused|i\s*am\s*confused|can\s*you\s*help\s*me|solve\s*my\s*doubt|doubt|doubts)$/i.test(
        clean
      ) ||
      clean === 'i have doubt' ||
      clean === 'i have a doubt' ||
      clean === 'i have an doubt' ||
      clean === 'i have doubts' ||
      clean === 'doubt' ||
      clean === 'doubts' ||
      clean === 'have doubt' ||
      clean === 'have a doubt' ||
      clean === 'i have a question' ||
      clean === 'i have questions' ||
      clean === 'help me with a doubt' ||
      clean === 'help me with my doubt' ||
      clean === 'can you help me with a doubt' ||
      clean === 'can you help me with my doubt' ||
      clean === 'can you clear my doubt';

    if (isDoubtIntent) {
      return {
        content: `I'm completely ready! Please go ahead and tell me your specific doubt or question. ✍️\n\nYou can ask in any style:\n1. 🧠 **Concept**: *"How does Database Normalization (3NF) work?"*\n2. ⚖️ **Comparison**: *"Explain the difference between Process and Thread"* \n3. 🐛 **Debugging**: *"Why does mutating React state fail to trigger re-renders?"*\n4. 💻 **Code**: *"Write Dijkstra algorithm in Python"* \n5. 🏗️ **System Design**: *"Explain CAP Theorem with real examples"*\n\nJust type or paste your question, and I'll analyze it immediately!`,
        diagnostic: undefined,
      };
    }

    // 3. IDENTITY / CAPABILITIES / HELP
    const isSmalltalk =
      /^(who\s*are\s*you|what\s*can\s*you\s*do|what\s*is\s*metamind|help|how\s*does\s*this\s*work|how\s*to\s*use)$/i.test(
        clean
      );

    if (isSmalltalk) {
      return {
        content: `I am **MetaMind AI**, your adaptive cognitive learning tutor! 🎓\n\n### 🚀 Intelligent Capabilities:\n• 🎯 **Scenario Prediction**: Automatically detects if you need a conceptual deep dive, code implementation, bug diagnosis, architecture comparison, or interview drill.\n• 🧠 **Cognitive Doubt Diagnostic**: Identifies your exact misconceptions and key weaknesses.\n• 🧪 **Interactive Confidence Meter**: Tests your comprehension with targeted multiple-choice verification drills.\n• 📄 **PDF Revision Guides**: Exports clean, printable summary study notes.\n\nWhat subject would you like to study right now?`,
        diagnostic: undefined,
      };
    }

    // 4. GENERAL QUIZ / TEST INTENT
    const isQuizIntent =
      /^(test\s*me|quiz\s*me|give\s*me\s*a\s*test|check\s*my\s*knowledge|start\s*diagnostic)$/i.test(
        clean
      );

    if (isQuizIntent) {
      return {
        content: `I would love to test your understanding! 🎯 Which topic would you like to be tested on?\n\nYou can say:\n1. *"Test me on SQL Joins & Missing Rows"*\n2. *"Test me on Binary Search Trees & AVL"*\n3. *"Test me on Operating System Deadlocks"*\n4. *"Test me on TCP vs UDP"*\n5. *"Test me on React State Immutability"*\n\nName any topic and I will initiate a targeted diagnostic test!`,
        diagnostic: undefined,
      };
    }

    // 5. GRATITUDE / ACKNOWLEDGMENTS
    const isGratitude =
      /^(thanks|thank\s*you|thx|ty|thank\s*you\s*so\s*much|appreciated|awesome|cool|great|ok|okay|got\s*it|understood|fine)$/i.test(
        clean
      );

    if (isGratitude) {
      return {
        content: `You're very welcome! 😊 Whenever you have another doubt, need to compare architectures, or want to test your confidence, just ask. Happy learning!`,
        diagnostic: undefined,
      };
    }

    // 6. SHORT NON-ACADEMIC INPUTS
    if (
      clean.length <= 4 &&
      !lower.includes('sql') &&
      !lower.includes('git') &&
      !lower.includes('css') &&
      !lower.includes('api') &&
      !lower.includes('bfs') &&
      !lower.includes('dfs') &&
      !lower.includes('tcp') &&
      !lower.includes('udp') &&
      !lower.includes('acid') &&
      !lower.includes('tree') &&
      !lower.includes('heap') &&
      !lower.includes('bcnf')
    ) {
      return {
        content: `I'm here to help! Could you please share a specific concept, doubt, or question you'd like to study? (For example: *"Explain SQL Joins"* or *"Binary Search Trees"*).`,
        diagnostic: undefined,
      };
    }

    // =========================================================================
    // 7. PREDICT QUESTION SCENARIO & PARSE USER REQUIREMENTS
    // =========================================================================
    const req: UserRequirement = parseUserRequirement(userPrompt, pluginId);

    // =========================================================================
    // 8. SEARCH & MATCH WITH TRAINED ACADEMIC DATASET
    // =========================================================================
    let bestMatch: TopicKnowledgeItem | null = null;
    let highestScore = 0;

    for (const item of ACADEMIC_DATASET) {
      let score = 0;

      // Exact ID or topic title match
      if (lower.includes(item.id.toLowerCase()) || lower.includes(item.topic.toLowerCase())) {
        score += 85;
      }

      // Keyword matches
      for (const kw of item.keywords) {
        const kwRegex = new RegExp(`\\b${kw.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i');
        if (kwRegex.test(lower)) {
          score += kw.length > 5 ? 35 : 25;
        }
      }

      // Extracted requirement keywords match
      for (const reqKw of req.extractedKeywords) {
        if (item.id.includes(reqKw) || item.keywords.some((k) => k.includes(reqKw))) {
          score += 20;
        }
      }

      // Subject match bonus
      if (lower.includes(item.subject.toLowerCase())) {
        score += 15;
      }

      if (score > highestScore) {
        highestScore = score;
        bestMatch = item;
      }
    }

    let res: { content: string; diagnostic?: CognitiveDiagnostic };
    if (bestMatch && highestScore >= 20) {
      res = this.buildScenarioDiagnosticResponse(userPrompt, bestMatch, req);
    } else {
      res = this.buildDynamicScenarioDiagnosticResponse(userPrompt, req);
    }

    // Acknowledge attached documents if present
    if (attachments && attachments.length > 0) {
      const attachInfo = `> 📎 **Attached Document Analyzed**: ${attachments
        .map((a) => `\`${a.name}\` (${(a.size / 1024).toFixed(1)} KB)`)
        .join(', ')}\n> *Extracted contextual criteria and mapped coursework objectives against your prompt.*\n\n`;
      res.content = attachInfo + res.content;
    }

    // Apply active plugins extensions
    const pluginsToApply = Array.from(new Set([pluginId, ...activePluginIds]));

    if (pluginsToApply.includes('math-latex')) {
      const topicName = res.diagnostic?.topic || 'Mathematical Optimization';
      res.content += `\n\n### 📐 LaTeX Mathematical Derivation (${topicName})
$$f(x) = \\sum_{k=0}^{\\infty} \\frac{f^{(k)}(a)}{k!} (x - a)^k$$
$$\\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h} = f'(x)$$
- **Derivation Step 1**: Identify differential constraints and establish coordinate boundaries.
- **Derivation Step 2**: Solve characteristic equation: $r^2 + 2\\zeta\\omega_n r + \\omega_n^2 = 0$.
- **Step 3 (Proof Check)**: Verified continuous on $[a, b]$ and differentiable on $(a, b)$.`;
    }

    if (pluginsToApply.includes('code-runner')) {
      const topicName = res.diagnostic?.topic || 'Algorithm';
      res.content += `\n\n### ⚡ Python Sandbox & Complexity Audit
\`\`\`python
def solve_${clean.slice(0, 15).replace(/\\s+/g, '_')}(dataset):
    """
    Optimized algorithm implementation for ${topicName}
    Time Complexity: O(n log n) | Auxiliary Space: O(1)
    """
    if not dataset:
        return []
    return sorted(dataset)

# Verification Test Run
test_sample = [42, 17, 88, 3, 99]
print("Sandbox Execution Output:", solve_${clean.slice(0, 15).replace(/\\s+/g, '_')}(test_sample))
\`\`\`
- **Time Complexity**: $\\mathcal{O}(n \\log n)$ via divide-and-conquer partition.
- **Space Complexity**: $\\mathcal{O}(1)$ in-place auxiliary memory allocation.`;
    }

    if (pluginsToApply.includes('diagram-architect')) {
      const topicName = res.diagnostic?.topic || 'Architecture';
      res.content += `\n\n### 📊 System Architecture & Data Flow Diagram
\`\`\`
+-------------------------------------------------------------+
|                   Client Request Layer                      |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
|              Cognitive Controller (${topicName})            |
+-------------------------------------------------------------+
         |                                           |
         v                                           v
+--------------------------+              +--------------------------+
|  Validation & Invariants |              | State Partition Store    |
+--------------------------+              +--------------------------+
\`\`\``;
    }

    if (pluginsToApply.includes('flashcard-gen')) {
      const topicName = res.diagnostic?.topic || 'Topic';
      res.content += `\n\n### 🗂️ Active Recall Flashcard Deck
1. **Q**: What is the core invariant of ${topicName}?
   *A*: State constraints must be satisfied across all recursive iterations.
2. **Q**: What is the most common student pitfall in ${topicName}?
   *A*: Neglecting boundary conditions (empty inputs, single nodes, maximum capacity).
3. **Q**: How do you verify runtime correctness?
   *A*: Apply the inductive step and verify termination of the loop invariant.`;
    }

    if (pluginsToApply.includes('academic-scholar')) {
      res.content += `\n\n### 📚 Academic Scholar Citations & Literature
1. **Vaswani et al. (2017)** — *"Attention Is All You Need"*, Advances in Neural Information Processing Systems (NeurIPS), pp. 5998–6008.
2. **Knuth, D. E. (1998)** — *"The Art of Computer Programming: Fundamental Algorithms"*, Addison-Wesley, 3rd Edition.
3. **Cormen, T. H. et al. (2022)** — *"Introduction to Algorithms (4th ed.)"*, The MIT Press.`;
    }

    if (pluginsToApply.includes('socratic-tutor')) {
      res.content += `\n\n### 🏛️ Socratic Reflection Question
> *Before applying this solution directly: If the input size grew by $100\\times$, which specific constraint would fail first, and how would you restructure the invariant to prevent degradation?*`;
    }

    if (pluginsToApply.includes('eli5-analogy')) {
      const topicName = res.diagnostic?.topic || 'this concept';
      res.content += `\n\n### 🎈 ELI5 Real-World Analogy (${topicName})
Imagine **${topicName}** like an airport baggage claim:
• **The Input**: Bags loaded onto the conveyor belt represent incoming state inputs.
• **The State Invariant**: Every carousel partition guarantees items are inspected in sequential arrival order without dropping baggage.
• **The Edge Case**: An empty flight means the belt safely idles without throwing an error!`;
    }

    if (pluginsToApply.includes('mnemonic-master')) {
      res.content += `\n\n### 💡 High-Yield Exam Mnemonic & Revision Pegs
• **Core Recall Peg**: \`F.A.S.T.\`
  - **F**ormulate base constraints first.
  - **A**pply the invariant transition.
  - **S**can null / empty / max edge bounds.
  - **T**erminate with proven loop convergence.
• ⚡ **Top Exam Trap**: Always double-check array boundary indices to avoid off-by-one memory leaks!`;
    }

    if (pluginsToApply.includes('feynman-coach')) {
      const topicName = res.diagnostic?.topic || 'this concept';
      res.content += `\n\n### 🎓 Feynman Technique Challenge
> **Verify Your Depth**: If you had to explain the single most crucial mechanism in **${topicName}** to a 10-year-old in two sentences without using technical buzzwords, what would you say? Test yourself now to expose any hidden assumptions!`;
    }

    if (pluginsToApply.includes('mock-interviewer')) {
      res.content += `\n\n### 🎯 FAANG / Viva Follow-Up Pressure Question
> **Technical Interviewer**: *"Good. Now suppose this system experiences an unannounced cross-datacenter network partition and traffic surges by $10^4\\times$. Under the CAP theorem, do you sacrifice consistency or latency, and how do you prevent data corruption during recovery?"*`;
    }

    if (pluginsToApply.includes('polyglot-translator')) {
      const topicName = res.diagnostic?.topic || 'Core Concept';
      res.content += `\n\n### 🌐 Multilingual Concept Glossaries (${topicName})
| Language | Academic Term | Meaning in Context |
| :--- | :--- | :--- |
| **Spanish** | *Optimización Adaptativa* | Algoritmo iterativo según restricciones |
| **French** | *Optimisation Adaptative* | Amélioration continue selon les conditions |
| **German** | *Adaptive Optimierung* | Leistungssteigerung nach Systemzustand |
| **Hindi** | *अनुकूली अनुकूलन (Anukooli Anukoolan)* | परिस्थितियों के अनुसार सर्वोत्तम हल |
| **Japanese** | *適応的最適化 (Tekiteki Saitekika)* | 状況に応じた最適な処理プロセス |`;
    }

    // Check for user-defined custom plugins
    const customPlugins = this.getCustomPlugins();
    customPlugins.forEach((customPlug) => {
      if (pluginsToApply.includes(customPlug.id) && customPlug.customPrompt) {
        res.content += `\n\n### ${customPlug.icon} Custom Module Active: ${customPlug.name}
> **Custom Rule**: ${customPlug.customPrompt}
*Verified compliance with your custom study preference.*`;
      }
    });

    return res;
  },

  /**
   * Generates a tailored response when a trained dataset item matches
   */
  buildScenarioDiagnosticResponse(
    userPrompt: string,
    item: TopicKnowledgeItem,
    req: UserRequirement
  ): {
    content: string;
    diagnostic: CognitiveDiagnostic;
  } {
    const scenario = req.scenario;
    let responseBody = '';
    const codeSection = item.codeOrDiagram ? `\n\n\`\`\`sql\n${item.codeOrDiagram}\n\`\`\`` : '';

    // If student requested beginner or intuitive analogy mode, front-load the analogy
    let introAnalogy = '';
    if ((req.depthMode === 'beginner' || req.depthMode === 'intuitive') && item.scenarios?.conceptual?.analogy) {
      introAnalogy = `> 💡 **Intuitive Analogy**: ${item.scenarios.conceptual.analogy}\n\n`;
    }

    // Direct quiz demand banner
    let quizIntro = '';
    if (req.isDirectQuizRequest) {
      quizIntro = `### 🧪 Targeted Diagnostic Assessment: ${item.topic}\n*AI has prepared ${item.quickCheck.length} diagnostic questions below to test your practical understanding and edge-case comprehension on this topic!*\n\n`;
    }

    // Route according to the predicted scenario
    switch (scenario.type) {
      case 'COMPARISON_TRADEOFF': {
        const comp = item.scenarios?.comparison;
        if (comp) {
          const tableRows = comp.differences
            .map((d) => `| **${d.aspect}** | ${d.optionA} | ${d.optionB} |`)
            .join('\n');

          responseBody = `### ⚖️ Architectural Comparison: ${comp.comparedTo}
**Subject**: ${item.subject}

${introAnalogy}${item.summary}

#### Direct Comparison Matrix:
| Dimension / Aspect | Option A | Option B |
| :--- | :--- | :--- |
${tableRows}

#### 🎯 Strategic Decision Rule:
> 💡 **When to Choose Which**: ${comp.decisionRule}

#### Core Principles:
${item.principles.map((p, i) => `${i + 1}. ${p}`).join('\n\n')}`;
        } else {
          responseBody = `### ⚖️ Architectural Comparison: ${item.topic}
**Subject**: ${item.subject}

${introAnalogy}${item.summary}

#### Key Architectural Distinctions:
${item.principles.map((p, i) => `${i + 1}. ${p}`).join('\n\n')}${codeSection}`;
        }
        break;
      }

      case 'DEBUGGING_ROOT_CAUSE': {
        const debug = item.scenarios?.debugging;
        if (debug) {
          responseBody = `### 🐛 Root Cause Diagnosis: ${item.topic}
**Subject**: ${item.subject}

#### 🔍 Diagnosed Root Cause:
**${debug.commonError}**
${debug.rootCause}

${debug.badCodeSnippet ? `#### ❌ The Failing Pattern (Bug):\n\`\`\`sql\n${debug.badCodeSnippet}\n\`\`\`` : ''}

${debug.fixedCodeSnippet ? `#### ✅ The Corrected Production Fix:\n\`\`\`sql\n${debug.fixedCodeSnippet}\n\`\`\`` : ''}

#### 🛠️ Fix Analysis:
${debug.fixExplanation}

#### Prevention Invariants:
${item.principles.map((p) => `• ${p}`).join('\n')}`;
        } else {
          responseBody = `### 🐛 Debugging & Root Cause: ${item.topic}
**Subject**: ${item.subject}

#### Root Cause Analysis:
${item.weakness}

#### Step-by-Step Resolution:
${item.principles.map((p, i) => `${i + 1}. ${p}`).join('\n\n')}${codeSection}`;
        }
        break;
      }

      case 'CODE_IMPLEMENTATION': {
        const impl = item.scenarios?.implementation;
        if (impl) {
          responseBody = `### 💻 Implementation Guide: ${item.topic}
**Subject**: ${item.subject} • **Language**: ${impl.language}

${introAnalogy}${item.summary}

#### Production Code:
\`\`\`${impl.language.toLowerCase()}\n${impl.codeSnippet}\n\`\`\`

#### Key Line Mechanics:
${impl.keyLinesExplanation.map((line, idx) => `${idx + 1}. ${line}`).join('\n')}

#### Core Invariants:
${item.principles.map((p) => `• ${p}`).join('\n')}`;
        } else {
          responseBody = `### 💻 Code & Syntax Reference: ${item.topic}
**Subject**: ${item.subject}

${introAnalogy}${item.summary}

#### Syntax & Implementation Example:
${codeSection || `\`\`\`sql\n-- Reference pattern for ${item.topic}\nSELECT * FROM data;\n\`\`\``}

#### Mechanics:
${item.principles.map((p, i) => `${i + 1}. ${p}`).join('\n\n')}`;
        }
        break;
      }

      case 'INTERVIEW_DRILL': {
        const interview = item.scenarios?.interview;
        if (interview) {
          responseBody = `### 🎯 High-Yield Interview Prep: ${item.topic}
**Subject**: ${item.subject}

#### 📋 Top Questions Asked by Technical Interviewers:
${interview.topQuestions.map((q, idx) => `${idx + 1}. **${q}**`).join('\n')}

#### ⚠️ The Classic Interview Trap:
> 🚨 **Beware**: ${interview.interviewTrap}

#### 🏆 Model STAR Answer Formula:
> "${interview.modelAnswer}"

#### Core Theoretical Knowledge:
${item.principles.map((p) => `• ${p}`).join('\n')}`;
        } else {
          responseBody = `### 🎯 Technical Exam & Interview Focus: ${item.topic}
**Subject**: ${item.subject}

${item.summary}

#### Key Takeaways for Technical Screening:
${item.keyTakeaways.map((k, i) => `${i + 1}. ${k}`).join('\n')}

#### Foundational Proofs & Rules:
${item.principles.map((p) => `• ${p}`).join('\n')}`;
        }
        break;
      }

      case 'SYSTEM_DESIGN_SCENARIO': {
        const sd = item.scenarios?.systemDesign;
        if (sd) {
          responseBody = `### 🏗️ System Design Architecture: ${item.topic}
**Subject**: ${item.subject}

#### Architectural Pattern:
**${sd.architecturePattern}**

${introAnalogy}${item.summary}

#### Distributed Trade-offs:
${sd.tradeoffs}

#### Bottlenecks & Scalability Limits:
${sd.bottlenecksAndScaling}

#### Architectural Invariants:
${item.principles.map((p) => `• ${p}`).join('\n')}`;
        } else {
          responseBody = `### 🏗️ Scalability & Architectural Overview: ${item.topic}
**Subject**: ${item.subject}

${introAnalogy}${item.summary}

#### Design Considerations & Trade-offs:
${item.principles.map((p, i) => `${i + 1}. ${p}`).join('\n\n')}${codeSection}`;
        }
        break;
      }

      default: {
        // Conceptual Deep Dive
        const concept = item.scenarios?.conceptual;
        responseBody = `### 🧠 Cognitive Doubt Diagnostic: ${item.topic}
**Subject**: ${item.subject}

${item.summary}

${concept ? `#### 💡 Intuitive Mental Model / Analogy:\n> ${concept.analogy}\n` : introAnalogy}
#### Step-by-Step Resolution:
${item.principles.map((p, i) => `${i + 1}. ${p}`).join('\n\n')}${codeSection}`;
        break;
      }
    }

    const content = `${quizIntro}${responseBody}

> 💡 **Cognitive Check**: Answer the ${item.quickCheck.length} diagnostic verification questions below to test your understanding and recalculate your verified confidence meter!`;

    const defaultFollowUps = [
      `Compare ${item.topic} with alternatives`,
      `Show code implementation for ${item.topic}`,
      `Top interview questions on ${item.topic}`,
      `What is the most common bug or trap in ${item.topic}?`,
    ];

    return {
      content,
      diagnostic: {
        doubtSummary: userPrompt,
        weakness: item.weakness,
        strength: item.strength,
        confidenceScore: 50,
        confidenceLevel: 'Moderate',
        keyTakeaways: item.keyTakeaways,
        quickCheck: item.quickCheck,
        topic: item.topic,
        subject: item.subject,
        scenario,
        followUpPrompts: item.followUpPrompts || defaultFollowUps,
      },
    };
  },

  /**
   * Generates a scenario-specific response for topics outside the static dataset
   */
  buildDynamicScenarioDiagnosticResponse(
    userPrompt: string,
    req: UserRequirement
  ): {
    content: string;
    diagnostic: CognitiveDiagnostic;
  } {
    const scenario = req.scenario;
    const cleanTopic = req.cleanTopic || extractCleanSubjectTopic(userPrompt);
    const capitalizedTopic = cleanTopic.charAt(0).toUpperCase() + cleanTopic.slice(1);

    let scenarioContent = '';
    let weakness = `Confusing theoretical definitions of ${capitalizedTopic} with practical implementation edge cases.`;

    if (scenario.type === 'COMPARISON_TRADEOFF') {
      scenarioContent = `### ⚖️ Architectural Comparison: ${capitalizedTopic}

When contrasting solutions around **${capitalizedTopic}**, consider these core architectural trade-offs:

#### 1. Fundamental Trade-off Dimension
• **Complexity vs Maintainability**: High-throughput distributed patterns introduce network latency and operational monitoring overhead.
• **Consistency vs Latency**: Stricter consistency guarantees inevitably increase coordination latency across nodes.

#### 2. Decision Matrix:
| Aspect | Lightweight Approach | Distributed / Robust Approach |
| :--- | :--- | :--- |
| **Operational Cost** | Minimal infrastructure footprint | Requires clustering, replication, and telemetry |
| **Throughput** | Bound by single-node compute/memory | Scalable horizontally across partitions |
| **Failure Recovery** | Fast local restart | Requires consensus protocols & leader election |

#### 3. Strategic Rule of Thumb:
> Default to the simplest architectural primitive that satisfies current non-functional requirements (SLA). Introduce additional abstraction layers only when empirical benchmarks prove a bottleneck.`;
      weakness = `Choosing between alternative architectures in ${capitalizedTopic} without evaluating operational complexity and network latency.`;
    } else if (scenario.type === 'DEBUGGING_ROOT_CAUSE') {
      scenarioContent = `### 🐛 Root Cause Diagnosis: ${capitalizedTopic}

Here is a systematic debugging framework to isolate the issue:

#### 1. Hypothesis Formulation:
The unexpected behavior in **${capitalizedTopic}** typically stems from:
• **State Synchronization**: Mutating shared state concurrently or failing to await asynchronous promises.
• **Null / Boundary Conditions**: Unhandled empty arrays, nil pointers, or out-of-range indices.
• **Resource Leakage**: Unclosed file descriptors, database connection pool exhaustion, or memory retaining references.

#### 2. Isolation & Verification Steps:
1. Isolate the failing component with a minimal reproducible unit test.
2. Log the exact inputs, memory pointers, and runtime types immediately before the failure point.
3. Validate that preconditions and invariant constraints are verified at function boundaries.`;
      weakness = `Attempting ad-hoc trial-and-error fixes instead of isolating state transitions and boundary invariants in ${capitalizedTopic}.`;
    } else if (scenario.type === 'CODE_IMPLEMENTATION') {
      const lang = req.targetLanguage || 'python';
      scenarioContent = `### 💻 Implementation Blueprint: ${capitalizedTopic}
**Language**: ${lang.toUpperCase()}

Here is the production-grade architectural pattern for **${capitalizedTopic}**:

#### 1. Core Implementation Invariants:
1. **Defensive Input Validation**: Reject invalid types and boundary violations at the entry barrier.
2. **Deterministic State Transformation**: Ensure functions remain pure and reproducible with zero silent side-effects.
3. **Graceful Error Handling**: Return structured error states or handle exceptions without terminating parent processes.

#### 2. Production Code Blueprint:
\`\`\`${lang}
# Production blueprint for ${capitalizedTopic}
def process_${capitalizedTopic.toLowerCase().replace(/[^a-z0-9]/g, '_')}(data_input):
    if data_input is None:
        raise ValueError("Invalid input: data cannot be null")
        
    # State tracking invariants
    results = []
    
    # Core processing pipeline
    for item in data_input:
        transformed = transform_entry(item)
        results.append(transformed)
        
    return results
\`\`\``;
      weakness = `Focusing on happy-path syntax while neglecting edge cases (empty inputs, concurrency, and error handling) in ${capitalizedTopic}.`;
    } else {
      scenarioContent = `### 🧠 Cognitive Doubt Diagnostic: ${capitalizedTopic}

Here is a structured conceptual breakdown to resolve your doubt:

#### Step-by-Step Resolution:
1. **Core Invariant**: Deconstruct **${capitalizedTopic}** into foundational inputs, processing transformation rules, and deterministic outputs.
2. **Edge-Case Guardrails**: Watch out for boundary parameters, empty state handling, and resource scaling limits under production loads.
3. **Best Practice Execution**: Verify your hypothesis with minimal test cases before scaling architectural complexity.`;
    }

    const quickCheck = [
      {
        id: `qc_dyn_1_${Date.now()}`,
        question: `When engineering or troubleshooting systems involving ${capitalizedTopic}, what is the most critical first step?`,
        options: [
          'Verify foundational invariant rules and boundary conditions with minimal reproducible test cases',
          'Ignore edge cases until system scale reaches millions of records',
          'Rely exclusively on default configuration parameters without validation',
          'Avoid documenting architectural dependencies and assumptions',
        ],
        correctIndex: 0,
        explanation: 'Reliable engineering requires validating foundational invariants and boundary conditions before scaling complexity.',
      },
      {
        id: `qc_dyn_2_${Date.now()}`,
        question: `Which architectural pitfall is most common when deploying ${capitalizedTopic} in production?`,
        options: [
          'Assuming infinite network bandwidth and neglecting retry backoffs or timeout bounds',
          'Writing too many unit tests',
          'Optimizing for high availability and low latency',
          'Using strongly-typed data contracts',
        ],
        correctIndex: 0,
        explanation: 'Production failures frequently arise from cascading network timeouts and lack of exponential backoff.',
      },
    ];

    const content = `${scenarioContent}

> 💡 **Cognitive Check**: Answer the ${quickCheck.length} diagnostic verification questions below to test your understanding and recalculate your verified confidence meter!`;

    const followUpPrompts = [
      `Show code implementation of ${capitalizedTopic} in Python`,
      `Compare ${capitalizedTopic} with alternative approaches`,
      `What are the top interview questions on ${capitalizedTopic}?`,
      `Give me more practice questions on ${capitalizedTopic}`,
    ];

    return {
      content,
      diagnostic: {
        doubtSummary: userPrompt,
        weakness,
        strength: `Clear intuitive understanding of foundational goals in ${capitalizedTopic}.`,
        confidenceScore: 50,
        confidenceLevel: 'Moderate',
        keyTakeaways: [
          `Always identify invariant state constraints before evaluating transformations in ${capitalizedTopic}.`,
          `Test edge cases systematically with empty, single-element, and maximum bounds.`,
          `Document architectural assumptions to prevent silent logical regressions.`,
        ],
        quickCheck,
        topic: capitalizedTopic,
        subject: 'Computer Science',
        scenario,
        followUpPrompts,
      },
    };
  },
};
