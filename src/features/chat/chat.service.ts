import type {
  ChatSession,
  PluginId,
  ChatPlugin,
  CognitiveDiagnostic,
} from './chat.types';
import { ACADEMIC_DATASET, type TopicKnowledgeItem } from './academicDataset';
import {
  parseUserRequirement,
  extractCleanSubjectTopic,
  type UserRequirement,
} from './nlpPredictor';

const CHAT_STORAGE_KEY = 'metamind_chat_sessions_v1';

export const CHAT_PLUGINS: ChatPlugin[] = [
  {
    id: 'concept-explainer',
    name: 'Concept Tutor',
    icon: '🧠',
    description: 'Diagnoses doubts & deep explanations',
    badge: 'Core',
  },
  {
    id: 'code-debugger',
    name: 'Code & Syntax',
    icon: '💻',
    description: 'Finds logic bugs & syntax errors',
    badge: 'Dev',
  },
  {
    id: 'exam-coach',
    name: 'Exam Drills',
    icon: '🎯',
    description: 'High-yield exam test preparation',
    badge: 'Exam',
  },
  {
    id: 'math-logic',
    name: 'Math & Logic',
    icon: '📐',
    description: 'Step-by-step formula derivations',
    badge: 'Logic',
  },
];

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
      title: 'SQL Joins & Relational Logic',
      pluginId: 'concept-explainer',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: 'msg_welcome_ai',
          sender: 'assistant',
          content:
            "Hello! I am your MetaMind AI Cognitive Tutor. Ask any doubt, paste code, compare architectures, or troubleshoot a bug. I will automatically predict your question type, diagnose conceptual gaps, and generate customized study solutions!",
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

  /**
   * Main AI response generation with Question Scenario Prediction
   */
  generateCognitiveResponse(userPrompt: string, pluginId: PluginId = 'concept-explainer'): {
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

    // 2. DOUBT INTENT / READINESS (e.g. "i have doubt", "i have a doubt", "can you help me with a doubt")
    const isDoubtIntent =
      /^(i\s*have\s*(a\s*|some\s*)?(doubt|question|problem|query|issue|doubts|questions)|can\s*i\s*ask\s*(a\s*)?(doubt|question)|have\s*(a\s*)?doubt|got\s*(a\s*)?doubt|i\s*need\s*help(\s*with\s*(a\s*)?(doubt|question|my\s*doubt))?|need\s*help(\s*with\s*(a\s*)?(doubt|question))?|help\s*me(\s*with\s*(a\s*)?(doubt|question|my\s*doubt))?|can\s*you\s*help\s*me(\s*with\s*(a\s*)?(doubt|question|my\s*doubt))?|im\s*stuck|i\s*am\s*stuck|im\s*confused|i\s*am\s*confused|can\s*you\s*help\s*me|solve\s*my\s*doubt|doubt|doubts)$/i.test(
        clean
      ) ||
      clean === 'i have doubt' ||
      clean === 'i have a doubt' ||
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

    // Confident match threshold
    if (bestMatch && highestScore >= 20) {
      return this.buildScenarioDiagnosticResponse(userPrompt, bestMatch, req);
    }

    // =========================================================================
    // 9. DYNAMIC SCENARIO GENERATOR (For topics outside static dictionary)
    // =========================================================================
    return this.buildDynamicScenarioDiagnosticResponse(userPrompt, req);
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
