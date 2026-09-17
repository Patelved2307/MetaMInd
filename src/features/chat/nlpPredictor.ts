import type { PluginId, PredictedScenario, QuestionScenarioType } from './chat.types';

export interface UserRequirement {
  scenario: PredictedScenario;
  targetLanguage?: 'python' | 'typescript' | 'javascript' | 'java' | 'cpp' | 'sql' | 'go' | 'rust';
  depthMode?: 'beginner' | 'intuitive' | 'standard' | 'deep_dive';
  isDirectQuizRequest: boolean;
  cleanTopic: string;
  extractedKeywords: string[];
}

interface ScenarioRule {
  type: QuestionScenarioType;
  label: string;
  badge: string;
  icon: string;
  reasoning: string;
  weight: number;
  patterns: RegExp[];
}

const SCENARIO_RULES: ScenarioRule[] = [
  // 1. COMPARISON & TRADEOFF
  {
    type: 'COMPARISON_TRADEOFF',
    label: 'Comparison & Architectural Trade-offs',
    badge: 'Comparison',
    icon: '⚖️',
    reasoning: 'User is contrasting two or more alternative concepts, protocols, or technologies to understand trade-offs and decision criteria.',
    weight: 95,
    patterns: [
      /\b(vs\.?|versus|difference between|compare|comparison|contrasted with|trade-?offs?|pros and cons|which is better|when to use .* (over|or|instead of)|advantages of .* over|better than)\b/i,
      /\b(left join vs inner join|tcp vs udp|sql vs nosql|bfs vs dfs|process vs thread|merge sort vs quick sort|rest vs graphql|docker vs vm|kafka vs rabbitmq|jwt vs session|token bucket vs leaky bucket|b tree vs b\+ tree)\b/i,
    ],
  },

  // 2. DEBUGGING & ROOT CAUSE ANALYSIS
  {
    type: 'DEBUGGING_ROOT_CAUSE',
    label: 'Debugging & Root Cause Diagnosis',
    badge: 'Debugging',
    icon: '🐛',
    reasoning: 'User has encountered a runtime error, logic bug, unexpected null/undefined state, or failing execution.',
    weight: 90,
    patterns: [
      /\b(why is my|why does my|error|bug|debug|troubleshoot|fix|fails?|failing|broken|not working|crash|exception|null pointer|undefined|infinite loop|segfault|memory leak|stack overflow|why am i getting|returns null|missing rows)\b/i,
      /\b(won't render|does not update|cannot find|failed to compile|syntax error|type error|undefined is not a function|maximum call stack|cors error|dirty read|deadlock detected)\b/i,
    ],
  },

  // 3. CODE IMPLEMENTATION & SYNTAX
  {
    type: 'CODE_IMPLEMENTATION',
    label: 'Code Implementation & Syntax Drill',
    badge: 'Implementation',
    icon: '💻',
    reasoning: 'User is requesting concrete programming syntax, function implementation, code snippet, or algorithm execution.',
    weight: 85,
    patterns: [
      /\b(how to code|how to implement|code example|syntax of|write a (function|query|program|script|class|decorator|routine)|code snippet|in python|in java|in c\+\+|in javascript|in sql|in typescript|implementation of|show me code)\b/i,
      /\b(give me code|write code for|show code|sample code|snippet|implement)\b/i,
    ],
  },

  // 4. SYSTEM DESIGN & ARCHITECTURE SCENARIO
  {
    type: 'SYSTEM_DESIGN_SCENARIO',
    label: 'System Design & Distributed Scalability',
    badge: 'System Design',
    icon: '🏗️',
    reasoning: 'User is addressing high-level system architecture, distributed scaling bottlenecks, capacity estimation, or infrastructure patterns.',
    weight: 85,
    patterns: [
      /\b(how to design|system design|architecture of|how to scale|scalability|high throughput|microservices|distributed systems?|sharding strategy|caching layer|cap theorem|load balancer architecture|event-driven architecture|rate limiter|message queue)\b/i,
      /\b(design a (url shortener|chat app|uber|netflix|rate limiter|distributed cache|payment system))\b/i,
    ],
  },

  // 5. TECHNICAL INTERVIEW DRILLS & TRAPS
  {
    type: 'INTERVIEW_DRILL',
    label: 'Technical Interview Drills & Traps',
    badge: 'Interview Prep',
    icon: '🎯',
    reasoning: 'User wants high-yield technical screening questions, common interview traps, or mock question evaluation.',
    weight: 80,
    patterns: [
      /\b(interview questions?|asked in interview|interview prep|mock interview|screening questions?|faang questions?|frequently asked in interview|interview traps?|how to answer .* in an interview|common pitfall)\b/i,
    ],
  },

  // 6. DIAGNOSTIC QUIZ & ASSESSMENT
  {
    type: 'DIAGNOSTIC_QUIZ',
    label: 'Adaptive Diagnostic Assessment',
    badge: 'Assessment',
    icon: '🧪',
    reasoning: 'User is explicitly prompting the AI to quiz or evaluate their grasp of a topic with practice questions.',
    weight: 90,
    patterns: [
      /\b(test me|quiz me|check my knowledge|give me a test|assess my|diagnostic test|ask me a question|verify my understanding|give me (some|a few|\d+) questions?|practice questions?)\b/i,
    ],
  },

  // 7. STEP-BY-STEP NUMERICAL & EXECUTION TRACE
  {
    type: 'STEP_BY_STEP_WALKTHROUGH',
    label: 'Step-by-Step Execution Trace',
    badge: 'Walkthrough',
    icon: '🐾',
    reasoning: 'User seeks sequential derivation, calculation, mathematical proof, or state trace for a specific input scenario.',
    weight: 75,
    patterns: [
      /\b(step-?by-?step|walk me through|trace the (execution|algorithm)|calculate the|derive|derivation|numerical problem|solve with example|dry run)\b/i,
    ],
  },

  // 8. BEST PRACTICES & SECURITY GUARDRAILS
  {
    type: 'BEST_PRACTICES_SECURITY',
    label: 'Best Practices & Security Guardrails',
    badge: 'Best Practice',
    icon: '🛡️',
    reasoning: 'User is asking about defensive programming, anti-patterns, clean code principles, or security vulnerabilities.',
    weight: 70,
    patterns: [
      /\b(best practices?|pitfalls|common mistakes?|anti-?patterns?|clean code|security vulnerabilities|is it safe to|code smells?|do's and don'ts|prevent sql injection|prevent xss)\b/i,
    ],
  },

  // 9. GENERAL LEARNING GUIDANCE & ROADMAP
  {
    type: 'GENERAL_LEARNING_GUIDANCE',
    label: 'Curriculum Roadmap & Learning Guide',
    badge: 'Roadmap',
    icon: '🧭',
    reasoning: 'User is looking for learning order, prerequisite dependencies, or study roadmaps.',
    weight: 65,
    patterns: [
      /\b(how to learn|study roadmap|learning path|prerequisites? for|where to start|syllabus|curriculum)\b/i,
    ],
  },

  // 10. CONCEPTUAL DEEP DIVE (Default academic baseline)
  {
    type: 'CONCEPTUAL_EXPLANATION',
    label: 'Conceptual Deep Dive & Intuition',
    badge: 'Concept',
    icon: '🧠',
    reasoning: 'User wants foundational clarity, conceptual definitions, intuitive mental models, and core mechanics.',
    weight: 50,
    patterns: [
      /\b(what is|explain|how does|why do we need|concept of|teach me|meaning of|overview of|intuition behind|definition of|tell me about)\b/i,
    ],
  },
];

/**
 * Predicts the primary question scenario / intent of the user prompt
 */
export function predictQuestionScenario(
  userPrompt: string,
  pluginId?: PluginId
): PredictedScenario {
  const clean = userPrompt.trim().toLowerCase();

  // Override by plugin if specifically selected
  if (pluginId === 'code-debugger') {
    if (!SCENARIO_RULES[0].patterns.some((p) => p.test(clean))) {
      return {
        type: 'DEBUGGING_ROOT_CAUSE',
        label: 'Debugging & Root Cause Diagnosis',
        badge: 'Debugging',
        icon: '🐛',
        confidenceScore: 92,
        reasoning: 'Code Debugger mode selected. AI is optimizing for root cause detection and bug resolution.',
      };
    }
  }

  if (pluginId === 'exam-coach') {
    if (clean.includes('interview') || clean.includes('question') || clean.includes('exam')) {
      return {
        type: 'INTERVIEW_DRILL',
        label: 'Technical Exam & Interview Drills',
        badge: 'Exam Drill',
        icon: '🎯',
        confidenceScore: 94,
        reasoning: 'Exam Coach mode active. Focusing on high-yield exam points, trap questions, and key takeaways.',
      };
    }
  }

  let bestMatch: ScenarioRule | null = null;
  let highestScore = 0;

  for (const rule of SCENARIO_RULES) {
    let score = 0;
    for (const pattern of rule.patterns) {
      if (pattern.test(clean)) {
        score += rule.weight;
      }
    }
    if (score > highestScore) {
      highestScore = score;
      bestMatch = rule;
    }
  }

  if (bestMatch && highestScore > 0) {
    const confidence = Math.min(98, Math.max(70, Math.round(highestScore * 0.95)));
    return {
      type: bestMatch.type,
      label: bestMatch.label,
      badge: bestMatch.badge,
      icon: bestMatch.icon,
      confidenceScore: confidence,
      reasoning: bestMatch.reasoning,
    };
  }

  // Fallback default: Conceptual Deep Dive
  return {
    type: 'CONCEPTUAL_EXPLANATION',
    label: 'Conceptual Deep Dive & Intuition',
    badge: 'Concept',
    icon: '🧠',
    confidenceScore: 80,
    reasoning: 'Analyzing theoretical foundations and core mechanics of the requested topic.',
  };
}

/**
 * Deeply parses user requirements: extracted language, explanation depth, and intent modifiers
 */
export function parseUserRequirement(
  userPrompt: string,
  pluginId?: PluginId
): UserRequirement {
  const clean = userPrompt.trim().toLowerCase();
  const scenario = predictQuestionScenario(userPrompt, pluginId);

  // 1. Language detection
  let targetLanguage: UserRequirement['targetLanguage'];
  if (/\b(in\s+python|python3?|py)\b/i.test(clean)) targetLanguage = 'python';
  else if (/\b(in\s+typescript|ts)\b/i.test(clean)) targetLanguage = 'typescript';
  else if (/\b(in\s+javascript|js)\b/i.test(clean)) targetLanguage = 'javascript';
  else if (/\b(in\s+java)\b/i.test(clean) && !clean.includes('javascript')) targetLanguage = 'java';
  else if (/\b(in\s+c\+\+|cpp)\b/i.test(clean)) targetLanguage = 'cpp';
  else if (/\b(in\s+sql|sql\s+query|postgres)\b/i.test(clean)) targetLanguage = 'sql';
  else if (/\b(in\s+go|golang)\b/i.test(clean)) targetLanguage = 'go';
  else if (/\b(in\s+rust)\b/i.test(clean)) targetLanguage = 'rust';

  // 2. Depth mode
  let depthMode: UserRequirement['depthMode'] = 'standard';
  if (/\b(beginner|simple|easy|eli5|like i'm 5|for kids|layman)\b/i.test(clean)) {
    depthMode = 'beginner';
  } else if (/\b(analogy|metaphor|intuition|mental model)\b/i.test(clean)) {
    depthMode = 'intuitive';
  } else if (/\b(in-?depth|deep dive|internals|under the hood|advanced|rigorous|comprehensive)\b/i.test(clean)) {
    depthMode = 'deep_dive';
  }

  // 3. Direct quiz demand
  const isDirectQuizRequest = /\b(test me|quiz me|give me (questions?|test|quiz)|practice questions?|ask me)\b/i.test(clean);

  // 4. Extracted keywords
  const cleanTopic = extractCleanSubjectTopic(userPrompt);
  const words = cleanTopic.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
  const synonyms = expandQuerySynonyms(words);

  return {
    scenario,
    targetLanguage,
    depthMode,
    isDirectQuizRequest,
    cleanTopic,
    extractedKeywords: Array.from(new Set([...words, ...synonyms])),
  };
}

/**
 * Expand query tokens with domain-specific synonyms and variants
 */
export function expandQuerySynonyms(tokens: string[]): string[] {
  const expansions: string[] = [];
  const joined = tokens.join(' ').toLowerCase();

  if (joined.includes('b tree') || joined.includes('b+ tree') || joined.includes('index') || joined.includes('b-tree')) {
    expansions.push('db-indexing', 'indexing', 'b-tree', 'b+ tree', 'composite index');
  }
  if (joined.includes('join') || joined.includes('missing rows') || joined.includes('left join')) {
    expansions.push('sql-joins', 'inner join', 'left join', 'null rows');
  }
  if (joined.includes('nosql') || joined.includes('mongo') || joined.includes('rdbms')) {
    expansions.push('sql-vs-nosql', 'dynamodb', 'document', 'relational');
  }
  if (joined.includes('norm') || joined.includes('3nf') || joined.includes('bcnf') || joined.includes('anomaly')) {
    expansions.push('db-normalization', 'normalization', 'functional dependency');
  }
  if (joined.includes('acid') || joined.includes('dirty read') || joined.includes('isolation') || joined.includes('transaction')) {
    expansions.push('acid-transactions', 'concurrency', 'mvcc', 'phantom read');
  }
  if (joined.includes('deadlock') || joined.includes('coffman') || joined.includes('banker')) {
    expansions.push('os-deadlocks', 'deadlock', 'circular wait', 'resource allocation');
  }
  if (joined.includes('thread') || joined.includes('process') || joined.includes('context switch')) {
    expansions.push('os-process-thread', 'multithreading', 'concurrency', 'pcb');
  }
  if (joined.includes('mutex') || joined.includes('semaphore') || joined.includes('race condition') || joined.includes('spinlock')) {
    expansions.push('os-concurrency-locks', 'critical section', 'synchronization');
  }
  if (joined.includes('tcp') || joined.includes('udp') || joined.includes('handshake') || joined.includes('syn')) {
    expansions.push('cn-tcp-udp', 'three way handshake', 'connectionless');
  }
  if (joined.includes('react') || joined.includes('usestate') || joined.includes('render') || joined.includes('immutable')) {
    expansions.push('react-state', 'immutability', 're-render', 'hooks');
  }
  if (joined.includes('virtual dom') || joined.includes('reconciliation') || joined.includes('diffing')) {
    expansions.push('react-virtual-dom', 'diffing algorithm', 'fiber');
  }
  if (joined.includes('event loop') || joined.includes('microtask') || joined.includes('macrotask') || joined.includes('call stack')) {
    expansions.push('web-event-loop', 'async', 'promise queue');
  }
  if (joined.includes('cap theorem') || joined.includes('partition') || joined.includes('pacelc')) {
    expansions.push('sd-cap-theorem', 'consistency', 'availability');
  }
  if (joined.includes('cache') || joined.includes('redis') || joined.includes('memcached') || joined.includes('cache aside')) {
    expansions.push('sd-caching-redis', 'caching', 'ttl', 'write-through');
  }
  if (joined.includes('dijkstra') || joined.includes('shortest path') || joined.includes('graph weight')) {
    expansions.push('dsa-dijkstra', 'shortest path', 'priority queue');
  }
  if (joined.includes('dp') || joined.includes('knapsack') || joined.includes('memoization') || joined.includes('dynamic programming')) {
    expansions.push('dsa-dp', 'dynamic programming', 'subproblems', 'tabulation');
  }
  if (joined.includes('binary search') || joined.includes('two pointer') || joined.includes('sliding window')) {
    expansions.push('dsa-binary-search', 'logarithmic', 'invariants');
  }
  if (joined.includes('kafka') || joined.includes('rabbitmq') || joined.includes('message queue') || joined.includes('pub sub')) {
    expansions.push('sd-message-queues', 'event streaming', 'broker');
  }
  if (joined.includes('rate limit') || joined.includes('token bucket') || joined.includes('leaky bucket')) {
    expansions.push('sd-rate-limiting', 'throttle', '429');
  }
  if (joined.includes('transformer') || joined.includes('attention') || joined.includes('self-attention') || joined.includes('llm')) {
    expansions.push('ml-transformers', 'multi-head', 'embeddings');
  }
  if (joined.includes('gradient descent') || joined.includes('backprop') || joined.includes('learning rate')) {
    expansions.push('ml-gradient-descent', 'optimization', 'loss function');
  }

  return expansions;
}

/**
 * Strips common question framing to isolate the pure subject terms
 */
export function extractCleanSubjectTopic(prompt: string): string {
  let cleaned = prompt
    .replace(/^(can you|please|could you|i want to|i need to|help me|tell me|give me|test me on|quiz me on)\s+/i, '')
    .replace(/^(explain|teach me|tell me about|what is|how does|why is|how to|describe|compare|difference between)\s+/i, '')
    .replace(/\b(work|mean|in simple words|step by step|with examples?|for interview|in python|in java|in cpp|in c\+\+|in typescript|in sql)\b/gi, '')
    .replace(/[?!.]+$/, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleaned) cleaned = prompt.trim();
  return cleaned;
}
