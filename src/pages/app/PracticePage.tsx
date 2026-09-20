import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import gsap from 'gsap';
import confetti from 'canvas-confetti';
import { useLearning } from '@/features/learning';
import {
  Check,
  Star,
  RotateCcw,
  Lightbulb,
  Code2,
  Info,
  HelpCircle,
  Trophy,
} from 'lucide-react';

export interface DistractorInsight {
  option: string;
  whyWrong: string;
}

export interface DetailedExplanation {
  coreReason: string;
  distractors?: DistractorInsight[];
  keyTakeaway: string;
}

export interface PracticeQuestionItem {
  id: string;
  conceptName: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  question: string;
  codeSnippet?: string;
  tableData?: { headers: string[]; rows: string[][] };
  options: string[];
  correctAnswer: string;
  hint: string;
  explanation: DetailedExplanation;
}

// =========================================================================
// COMPREHENSIVE MULTI-QUESTION PRACTICE BANK
// =========================================================================
const CHAPTER_PRACTICE_BANK: Record<string, PracticeQuestionItem[]> = {
  // -----------------------------------------------------------------------
  // 1. Introduction to Relational Models & Schemas
  // -----------------------------------------------------------------------
  'Introduction to Relational Models & Schemas': [
    {
      id: 'rel_1',
      conceptName: 'Entity Integrity Constraint',
      difficulty: 'Beginner',
      question:
        'In a relational database schema, which integrity constraint strictly forbids any attribute participating in the primary key from storing a NULL value?',
      options: [
        'Entity Integrity Constraint',
        'Referential Integrity Constraint',
        'Domain Integrity Constraint',
        'Cascade Constraint',
      ],
      correctAnswer: 'Entity Integrity Constraint',
      hint: 'Think about how tuples are uniquely addressed and identified in relational algebra.',
      explanation: {
        coreReason:
          'Entity Integrity mandates that Primary Key attributes cannot be NULL because a NULL value represents missing or unknown data, which makes it mathematically impossible to uniquely address and distinguish that specific tuple.',
        distractors: [
          { option: 'Referential Integrity Constraint', whyWrong: 'Governs foreign key relationships pointing to parent tables, not primary key uniqueness.' },
          { option: 'Domain Integrity Constraint', whyWrong: 'Restricts values to the valid data type and permitted range specified for a column.' },
          { option: 'Cascade Constraint', whyWrong: 'Refers to ON DELETE CASCADE behaviors in foreign keys, not primary key definitions.' },
        ],
        keyTakeaway: 'Rule: Primary Key = Unique + NOT NULL. Enforced by Entity Integrity.',
      },
    },
    {
      id: 'rel_2',
      conceptName: 'Relational Mathematical Terminology',
      difficulty: 'Beginner',
      question:
        'In formal relational algebra proposed by E.F. Codd, what are the exact mathematical terms corresponding to an everyday database "row" and "column"?',
      options: [
        'Tuple and Attribute',
        'Domain and Relation',
        'Record and Instance',
        'Cardinality and Degree',
      ],
      correctAnswer: 'Tuple and Attribute',
      hint: 'A row represents a single n-ary mathematical sequence of values.',
      explanation: {
        coreReason:
          'In Codd\'s relational model, a table is formally a "Relation", a row is an ordered list of elements called a "Tuple", and a column is a named property called an "Attribute".',
        distractors: [
          { option: 'Domain and Relation', whyWrong: 'Domain is the permitted set of atomic values; Relation is the whole table.' },
          { option: 'Record and Instance', whyWrong: 'Record and Instance are operational terminology, not formal mathematical terms.' },
          { option: 'Cardinality and Degree', whyWrong: 'Cardinality is the row count; Degree is the column count.' },
        ],
        keyTakeaway: 'Formal mappings: Relation = Table, Tuple = Row, Attribute = Column.',
      },
    },
    {
      id: 'rel_3',
      conceptName: 'Degree vs. Cardinality Calculation',
      difficulty: 'Intermediate',
      question:
        'Consider the relational schema: Students(student_id [PK], first_name, last_name, email, enroll_date, gpa). If this table currently contains 4,500 student records, what are its mathematical Degree and Cardinality?',
      tableData: {
        headers: ['student_id [PK]', 'first_name', 'last_name', 'email', 'enroll_date', 'gpa'],
        rows: [
          ['101', 'Alex', 'Rivera', 'alex@univ.edu', '2024-09-01', '3.85'],
          ['102', 'Maya', 'Chen', 'maya@univ.edu', '2024-09-01', '3.92'],
        ],
      },
      options: [
        'Degree = 6, Cardinality = 4,500',
        'Degree = 4,500, Cardinality = 6',
        'Degree = 1, Cardinality = 4,500',
        'Degree = 6, Cardinality = 6',
      ],
      correctAnswer: 'Degree = 6, Cardinality = 4,500',
      hint: 'Degree represents the width (attributes count), while Cardinality represents the height (tuples count).',
      explanation: {
        coreReason:
          'The schema has 6 attributes (student_id, first_name, last_name, email, enroll_date, gpa), making its Degree = 6. The relation instance contains 4,500 tuples, making its Cardinality = 4,500.',
        distractors: [
          { option: 'Degree = 4,500, Cardinality = 6', whyWrong: 'Reverses the definitions of Degree and Cardinality.' },
          { option: 'Degree = 1, Cardinality = 4,500', whyWrong: 'Mistakenly counts only the single primary key attribute.' },
          { option: 'Degree = 6, Cardinality = 6', whyWrong: 'Confuses cardinality with degree.' },
        ],
        keyTakeaway: 'Degree = Number of columns (Arity); Cardinality = Number of rows.',
      },
    },
    {
      id: 'rel_4',
      conceptName: 'Keys Hierarchy & Candidate Keys',
      difficulty: 'Intermediate',
      question:
        'Which statement correctly characterizes the mathematical relationship between Super Keys and Candidate Keys in a relation?',
      options: [
        'A Candidate Key is a minimal Super Key with no extraneous attributes',
        'Every Super Key is always a Candidate Key',
        'Candidate Keys can contain duplicate rows while Super Keys cannot',
        'A table may only have strictly one Candidate Key',
      ],
      correctAnswer: 'A Candidate Key is a minimal Super Key with no extraneous attributes',
      hint: 'Think about minimality: if you remove any attribute from a Candidate Key, it loses uniqueness.',
      explanation: {
        coreReason:
          'A Super Key is any set of attributes that uniquely identifies a row. A Candidate Key is a minimal super key; removing even a single attribute causes it to lose its uniqueness property.',
        distractors: [
          { option: 'Every Super Key is always a Candidate Key', whyWrong: 'A Super Key may contain redundant non-key attributes.' },
          { option: 'Candidate Keys can contain duplicate rows', whyWrong: 'All keys in relational algebra must guarantee absolute row uniqueness.' },
          { option: 'A table may only have strictly one Candidate Key', whyWrong: 'Tables frequently have multiple candidate keys (e.g. ID, SSN, and Email).' },
        ],
        keyTakeaway: 'Key Hierarchy: Super Key ⊇ Candidate Key ⊇ Primary Key.',
      },
    },
    {
      id: 'rel_5',
      conceptName: 'Referential Integrity & Foreign Keys',
      difficulty: 'Advanced',
      question:
        'Under standard ANSI SQL referential integrity, what are the ONLY two valid states for a Foreign Key attribute value in a child table?',
      codeSnippet: `CREATE TABLE Enrollments (
  enroll_id INT PRIMARY KEY,
  student_id INT, -- Foreign Key referencing Students(student_id)
  FOREIGN KEY (student_id) REFERENCES Students(student_id)
);`,
      options: [
        'It must either match an existing Primary Key in the referenced parent table OR be explicitly NULL',
        'It must strictly match an existing Primary Key and can NEVER be NULL',
        'It can contain any arbitrary integer value as long as it is positive',
        'It must match a candidate key from the same child table',
      ],
      correctAnswer: 'It must either match an existing Primary Key in the referenced parent table OR be explicitly NULL',
      hint: 'Can a student enrollment exist temporarily without an assigned student?',
      explanation: {
        coreReason:
          'Referential integrity dictates that foreign keys enforce valid relationships. A foreign key can either reference a real, existing primary key in the parent relation, or be NULL (indicating no relationship has been assigned yet).',
        distractors: [
          { option: 'It must strictly match an existing Primary Key and can NEVER be NULL', whyWrong: 'Foreign keys CAN be NULL unless explicitly created with a NOT NULL constraint.' },
          { option: 'It can contain any arbitrary integer value', whyWrong: 'Dangling pointers to non-existent parent rows are strictly prohibited.' },
          { option: 'It must match a candidate key from the same child table', whyWrong: 'Foreign keys typically reference another table (or self in recursive joins).' },
        ],
        keyTakeaway: 'Foreign Key rule: Matches valid parent Primary Key OR is NULL.',
      },
    },
  ],

  // -----------------------------------------------------------------------
  // 2. Entity Relationship (ER) Diagrams & Keys
  // -----------------------------------------------------------------------
  'Entity Relationship (ER) Diagrams & Keys': [
    {
      id: 'er_1',
      conceptName: 'Weak Entities & Discriminators',
      difficulty: 'Beginner',
      question:
        'In Peter Chen’s Entity-Relationship (ER) modeling, what uniquely characterizes a "Weak Entity" set?',
      options: [
        'It lacks sufficient attributes to form its own primary key and depends on an owner entity via an identifying relationship',
        'It cannot be physically converted into a relational database table',
        'It contains only textual attributes and zero numerical identifiers',
        'It is disconnected from the rest of the database schema',
      ],
      correctAnswer:
        'It lacks sufficient attributes to form its own primary key and depends on an owner entity via an identifying relationship',
      hint: 'Think of Employee Dependents or Building Rooms: room numbers only make sense relative to a building.',
      explanation: {
        coreReason:
          'A weak entity does not have enough attributes to form its own primary key. It relies on a partial key (discriminator) combined with the primary key of an identifying owner entity.',
        distractors: [
          { option: 'It cannot be physically converted into a relational table', whyWrong: 'Weak entities are converted by including the owner’s primary key as a composite key.' },
          { option: 'It contains only textual attributes', whyWrong: 'Weak entities can contain any valid data types.' },
          { option: 'It is disconnected from the rest of the schema', whyWrong: 'Weak entities are tightly coupled via identifying relationships.' },
        ],
        keyTakeaway: 'Weak Entity = Partial Key (dashed underline) + Identifying Owner PK.',
      },
    },
    {
      id: 'er_2',
      conceptName: 'Cardinality Ratios & Junction Tables',
      difficulty: 'Intermediate',
      question:
        'In relational database design, how is a Many-to-Many (M:N) relationship between Students and Courses correctly normalized into tables?',
      options: [
        'By creating an intermediate associative (junction) table containing Foreign Keys referencing both tables',
        'By storing comma-separated course IDs inside a single student column',
        'By duplicating student rows directly in the Courses table',
        'By merging Students and Courses into a single giant flat table',
      ],
      correctAnswer:
        'By creating an intermediate associative (junction) table containing Foreign Keys referencing both tables',
      hint: 'First Normal Form (1NF) forbids multi-valued arrays in table cells.',
      explanation: {
        coreReason:
          'Relational databases cannot natively represent M:N connections within two tables without violating 1NF. A bridge/junction table (e.g. Enrollments(student_id, course_id)) resolves the M:N into two 1:N relationships.',
        distractors: [
          { option: 'By storing comma-separated course IDs', whyWrong: 'Violates 1NF (atomicity rule).' },
          { option: 'By duplicating student rows directly in Courses', whyWrong: 'Causes massive update, insertion, and deletion anomalies.' },
          { option: 'By merging Students and Courses into a single flat table', whyWrong: 'Creates severe data redundancy and null anomalies.' },
        ],
        keyTakeaway: 'M:N relationships require an associative/bridge table in relational schemas.',
      },
    },
    {
      id: 'er_3',
      conceptName: 'Total vs. Partial Participation',
      difficulty: 'Advanced',
      question:
        'In Chen ER notation, if every Loan must belong to at least one Customer, but not all Customers have loans, how is this participation modeled?',
      options: [
        'Total participation for Loan (double line) and Partial participation for Customer (single line)',
        'Partial participation for both entities',
        'Total participation for Customer and Partial for Loan',
        'Multi-valued relationship with dashed borders',
      ],
      correctAnswer:
        'Total participation for Loan (double line) and Partial participation for Customer (single line)',
      hint: 'Total participation means existence dependency: every entity instance must participate.',
      explanation: {
        coreReason:
          'Because every Loan must be associated with a Customer, Loan has Total Participation (represented by a double line). Because some customers have no loans, Customer has Partial Participation (single line).',
        distractors: [
          { option: 'Partial participation for both entities', whyWrong: 'Fails to model the mandatory requirement for Loans.' },
          { option: 'Total participation for Customer and Partial for Loan', whyWrong: 'Reverses the constraint; customers are not required to take loans.' },
        ],
        keyTakeaway: 'Double Line = Total Participation (mandatory); Single Line = Partial (optional).',
      },
    },
  ],

  // -----------------------------------------------------------------------
  // 3. Asymptotic Analysis & Big-O Notation
  // -----------------------------------------------------------------------
  'Asymptotic Analysis & Big-O Notation': [
    {
      id: 'dsa_1',
      conceptName: 'Big-O Growth Hierarchy',
      difficulty: 'Beginner',
      question:
        'Which of the following computational time complexities exhibits the slowest rate of runtime growth as input size N tends toward infinity?',
      options: [
        'O(log N)',
        'O(N)',
        'O(N log N)',
        'O(N^2)',
      ],
      correctAnswer: 'O(log N)',
      hint: 'Think of binary search halving the search space each step.',
      explanation: {
        coreReason:
          'Logarithmic time O(log N) exhibits the slowest growth rate among the options: doubling the input N only increments runtime by a constant factor.',
        distractors: [
          { option: 'O(N)', whyWrong: 'Grows linearly, which is strictly faster than logarithmic growth.' },
          { option: 'O(N log N)', whyWrong: 'Grows super-linearly (typical for sorting algorithms).' },
          { option: 'O(N^2)', whyWrong: 'Quadratic growth grows far faster than logarithmic time.' },
        ],
        keyTakeaway: 'Growth hierarchy: O(1) < O(log N) < O(N) < O(N log N) < O(N^2) < O(2^N).',
      },
    },
    {
      id: 'dsa_2',
      conceptName: 'Master Theorem Recurrence',
      difficulty: 'Intermediate',
      question:
        'According to the Master Theorem, what is the asymptotic time complexity of the recurrence relation: T(N) = 2 * T(N / 2) + O(N)?',
      options: [
        'O(N log N)',
        'O(N)',
        'O(N^2)',
        'O(log N)',
      ],
      correctAnswer: 'O(N log N)',
      hint: 'This is the classic divide-and-conquer recurrence of MergeSort.',
      explanation: {
        coreReason:
          'Here a = 2, b = 2, and f(N) = O(N). Since log_b(a) = log_2(2) = 1, f(N) = Θ(N^{log_b(a)}). By Case 2 of the Master Theorem, T(N) = Θ(N log N).',
        distractors: [
          { option: 'O(N)', whyWrong: 'Applies when work done at the root dominates (Case 3).' },
          { option: 'O(N^2)', whyWrong: 'Overestimates the branching factor.' },
        ],
        keyTakeaway: 'MergeSort recurrence: T(N) = 2T(N/2) + O(N) = O(N log N).',
      },
    },
    {
      id: 'dsa_3',
      conceptName: 'Amortized Analysis of Dynamic Arrays',
      difficulty: 'Advanced',
      question:
        'When pushing elements into a dynamic array (such as std::vector or ArrayList) that doubles capacity upon filling, what is the AMORTIZED time complexity per push operation?',
      options: [
        'O(1) amortized',
        'O(N) amortized',
        'O(log N) amortized',
        'O(N^2) amortized',
      ],
      correctAnswer: 'O(1) amortized',
      hint: 'The expensive O(N) array copy happens exponentially less frequently.',
      explanation: {
        coreReason:
          'While the occasional resize operation takes O(N) to copy elements, doubling the array capacity ensures that copying occurs infrequently enough that N insertions take total O(N) work, yielding O(1) amortized cost per push.',
        distractors: [
          { option: 'O(N) amortized', whyWrong: 'O(N) is the worst-case single operation cost, not the amortized average.' },
        ],
        keyTakeaway: 'Geometric doubling yields O(1) amortized insertion cost.',
      },
    },
  ],
};

function getPracticeQuestionsForChapter(chapterName: string): PracticeQuestionItem[] {
  if (CHAPTER_PRACTICE_BANK[chapterName] && CHAPTER_PRACTICE_BANK[chapterName].length >= 3) {
    return CHAPTER_PRACTICE_BANK[chapterName];
  }

  const matchedKey = Object.keys(CHAPTER_PRACTICE_BANK).find(
    (k) => chapterName.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(chapterName.toLowerCase())
  );
  if (matchedKey && CHAPTER_PRACTICE_BANK[matchedKey] && CHAPTER_PRACTICE_BANK[matchedKey].length >= 3) {
    return CHAPTER_PRACTICE_BANK[matchedKey];
  }

  return [
    {
      id: 'dyn_1',
      conceptName: `${chapterName} - Core Invariants`,
      difficulty: 'Beginner',
      question: `In production systems implementing "${chapterName}", what is the primary invariant condition that must be maintained across state transitions?`,
      options: [
        'Ensuring structural consistency, deterministic bounds, and preventing undefined state corruption',
        'Bypassing prerequisite checks to accelerate runtime throughput',
        'Disregarding memory allocation constraints and thread safety',
        'Allowing arbitrary mutable side effects without serialization',
      ],
      correctAnswer: 'Ensuring structural consistency, deterministic bounds, and preventing undefined state corruption',
      hint: 'Consider what prevents system crashes when unexpected inputs are received.',
      explanation: {
        coreReason: `Systems implementing ${chapterName} require strict structural consistency and deterministic invariant checking to prevent corrupted states.`,
        distractors: [
          { option: 'Bypassing prerequisite checks', whyWrong: 'Leads to undefined memory faults and runtime exceptions.' },
          { option: 'Disregarding memory constraints', whyWrong: 'Triggers Out-Of-Memory (OOM) crashes and system halts.' },
        ],
        keyTakeaway: 'Invariant enforcement is the first line of defense in high-reliability software.',
      },
    },
    {
      id: 'dyn_2',
      conceptName: `${chapterName} - Computational Complexity`,
      difficulty: 'Intermediate',
      question: `When analyzing the runtime performance of "${chapterName}", which factor typically exerts the greatest influence on worst-case execution latency?`,
      options: [
        'Input scale N and the depth of nested operational traversals',
        'The aesthetic font family utilized in source code comments',
        'The physical screen resolution of the developer workstation',
        'Operating in debug mode versus production build only',
      ],
      correctAnswer: 'Input scale N and the depth of nested operational traversals',
      hint: 'Big-O notation measures operations as a mathematical function of input size N.',
      explanation: {
        coreReason:
          'Algorithmic latency is primarily driven by how operational iterations scale with input cardinality N and traversal depth across data structures.',
        distractors: [
          { option: 'The aesthetic font family', whyWrong: 'Comments are completely ignored by compilers and runtimes.' },
        ],
        keyTakeaway: 'Always analyze worst-case time complexity as a function of input scale N.',
      },
    },
    {
      id: 'dyn_3',
      conceptName: `${chapterName} - Boundary Edge Cases`,
      difficulty: 'Intermediate',
      question: `Which scenario represents the most critical edge case to evaluate when testing implementations of "${chapterName}"?`,
      options: [
        'Empty collections, single-element boundaries, and maximum capacity overflow conditions',
        'Executing on odd-numbered days of the week',
        'Using lowercase variable names instead of uppercase',
        'Testing with strictly average-case random inputs',
      ],
      correctAnswer: 'Empty collections, single-element boundaries, and maximum capacity overflow conditions',
      hint: 'Bugs in production almost always hide at the extrema: N=0, N=1, or N=MAX.',
      explanation: {
        coreReason:
          'Boundary conditions such as zero elements (empty states), off-by-one indices, and integer overflow are the most common source of production bugs.',
        distractors: [
          { option: 'Testing strictly average-case inputs', whyWrong: 'Misses edge case crashes that occur only at limits.' },
        ],
        keyTakeaway: 'Always write tests covering N=0, N=1, and capacity limits.',
      },
    },
    {
      id: 'dyn_4',
      conceptName: `${chapterName} - Architectural Trade-Offs`,
      difficulty: 'Advanced',
      question: `What fundamental engineering trade-off is typically encountered when optimizing "${chapterName}" for extreme throughput?`,
      options: [
        'Trading additional memory/space overhead (e.g. caching or auxiliary indexing) to achieve faster retrieval time',
        'Removing all unit tests to speed up the compiler',
        'Disabling CPU hardware cache lines',
        'Ignoring network transmission protocol specifications',
      ],
      correctAnswer: 'Trading additional memory/space overhead (e.g. caching or auxiliary indexing) to achieve faster retrieval time',
      hint: 'Space-time trade-off is the central axis of computer science optimization.',
      explanation: {
        coreReason:
          'Achieving sub-linear or O(1) retrieval times almost always requires allocating auxiliary memory structures (such as hash maps, lookup tables, or secondary indexes).',
        distractors: [],
        keyTakeaway: 'The Space-Time trade-off: speed is bought with memory.',
      },
    },
    {
      id: 'dyn_5',
      conceptName: `${chapterName} - Real-World Application`,
      difficulty: 'Advanced',
      question: `In modern scalable cloud infrastructure, why is deep mastery of "${chapterName}" indispensable for backend engineers?`,
      options: [
        'It allows designing fault-tolerant, low-latency services that scale efficiently under heavy concurrent loads',
        'It eliminates the need for software security audits',
        'It guarantees 100% network uptime regardless of infrastructure hardware failure',
        'It renders database indexes obsolete',
      ],
      correctAnswer: 'It allows designing fault-tolerant, low-latency services that scale efficiently under heavy concurrent loads',
      hint: 'Scalability depends on clean algorithmic foundations.',
      explanation: {
        coreReason:
          `Understanding the theoretical principles and practical nuances of ${chapterName} ensures that distributed services remain resilient, responsive, and predictable at scale.`,
        distractors: [],
        keyTakeaway: 'Mastery of core fundamentals separates senior system architects from novice coders.',
      },
    },
  ];
}

export const PracticePage: React.FC = () => {
  const { activeSession, completePracticeReassessment } = useLearning();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Query parameter or active session resolution
  const topicParam = searchParams.get('topic');
  const chapterName = topicParam || activeSession?.topic || 'Introduction to Relational Models & Schemas';

  // Resolve questions for this chapter
  const questionsList = useMemo<PracticeQuestionItem[]>(() => {
    return getPracticeQuestionsForChapter(chapterName);
  }, [chapterName]);

  // Session State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswersMap, setSelectedAnswersMap] = useState<Record<string, string>>({});
  const [submittedQuestionsMap, setSubmittedQuestionsMap] = useState<Record<string, boolean>>({});
  const [bookmarkedSet, setBookmarkedSet] = useState<Set<string>>(new Set());
  const [skipInputVal, setSkipInputVal] = useState<string>('');
  const [showHint, setShowHint] = useState(false);
  const [isCompletedSession, setIsCompletedSession] = useState(false);

  const currentQuestion = questionsList[currentIndex] || questionsList[0];
  const currentQId = currentQuestion.id;
  const currentSelectedAnswer = selectedAnswersMap[currentQId] || '';
  const isCurrentSubmitted = Boolean(submittedQuestionsMap[currentQId]);
  const isCurrentCorrect = currentSelectedAnswer === currentQuestion.correctAnswer;
  const isBookmarked = bookmarkedSet.has(currentQId);

  // Computed correct option letter (A, B, C, D)
  const correctOptionIndex = currentQuestion.options.indexOf(currentQuestion.correctAnswer);
  const correctOptionLetter = correctOptionIndex >= 0 ? String.fromCharCode(65 + correctOptionIndex) : 'A';

  // GSAP animations for question switch
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.practice-question-card',
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }
      );
      gsap.fromTo(
        '.practice-option-row',
        { opacity: 0, x: -14 },
        { opacity: 1, x: 0, duration: 0.35, stagger: 0.05, ease: 'power2.out', delay: 0.1 }
      );
    });
    return () => ctx.revert();
  }, [currentIndex]);

  // GSAP animation for answer submission reveal
  useEffect(() => {
    if (isCurrentSubmitted) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          '.practice-answer-card',
          { opacity: 0, y: 14, scale: 0.98 },
          { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.2)' }
        );
      });
      return () => ctx.revert();
    }
  }, [isCurrentSubmitted]);

  // Toggle Bookmark
  const handleToggleBookmark = () => {
    setBookmarkedSet((prev) => {
      const next = new Set(prev);
      if (next.has(currentQId)) {
        next.delete(currentQId);
      } else {
        next.add(currentQId);
      }
      return next;
    });
  };

  // Option selection
  const handleSelectOption = (option: string) => {
    if (isCurrentSubmitted) return;
    setSelectedAnswersMap((prev) => ({
      ...prev,
      [currentQId]: option,
    }));
  };

  // Submit/Save Answer
  const handleSaveAnswer = () => {
    if (!currentSelectedAnswer || isCurrentSubmitted) return;

    const isCorrect = currentSelectedAnswer === currentQuestion.correctAnswer;
    setSubmittedQuestionsMap((prev) => ({
      ...prev,
      [currentQId]: true,
    }));

    if (isCorrect) {
      confetti({
        particleCount: 45,
        spread: 55,
        origin: { y: 0.7 },
      });
    }
  };

  // Navigation handlers
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setShowHint(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < questionsList.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setShowHint(false);
    } else {
      // If at last question, complete assessment
      finalizeSession();
    }
  };

  const handlePreviousUnanswered = () => {
    for (let i = currentIndex - 1; i >= 0; i--) {
      if (!submittedQuestionsMap[questionsList[i].id]) {
        setCurrentIndex(i);
        setShowHint(false);
        return;
      }
    }
    // Loop around from end
    for (let i = questionsList.length - 1; i > currentIndex; i--) {
      if (!submittedQuestionsMap[questionsList[i].id]) {
        setCurrentIndex(i);
        setShowHint(false);
        return;
      }
    }
  };

  const handleNextUnanswered = () => {
    for (let i = currentIndex + 1; i < questionsList.length; i++) {
      if (!submittedQuestionsMap[questionsList[i].id]) {
        setCurrentIndex(i);
        setShowHint(false);
        return;
      }
    }
    // Loop around from beginning
    for (let i = 0; i < currentIndex; i++) {
      if (!submittedQuestionsMap[questionsList[i].id]) {
        setCurrentIndex(i);
        setShowHint(false);
        return;
      }
    }
  };

  const handleSkipToGo = (e: React.FormEvent) => {
    e.preventDefault();
    const targetNum = parseInt(skipInputVal.trim(), 10);
    if (!isNaN(targetNum) && targetNum >= 1 && targetNum <= questionsList.length) {
      setCurrentIndex(targetNum - 1);
      setShowHint(false);
      setSkipInputVal('');
    }
  };

  const handleRestart = () => {
    if (window.confirm('Restart practice test? All current answers will be reset.')) {
      setSelectedAnswersMap({});
      setSubmittedQuestionsMap({});
      setBookmarkedSet(new Set());
      setCurrentIndex(0);
      setIsCompletedSession(false);
      setShowHint(false);
    }
  };

  const finalizeSession = async () => {
    const totalCorrect = questionsList.filter(
      (q) => selectedAnswersMap[q.id] === q.correctAnswer
    ).length;
    const finalScorePercent = Math.round((totalCorrect / questionsList.length) * 100);

    try {
      await completePracticeReassessment(chapterName, finalScorePercent);
    } catch {
      // Handled
    }

    setIsCompletedSession(true);
  };

  // Score statistics
  const totalCorrectCount = questionsList.filter(
    (q) => selectedAnswersMap[q.id] === q.correctAnswer
  ).length;
  const finalScorePercent = questionsList.length > 0 ? Math.round((totalCorrectCount / questionsList.length) * 100) : 0;

  return (
    <div className="max-w-[1240px] mx-auto space-y-4 text-slate-800 pb-16 font-sans select-none">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER (Matching UWorld / Amboss Clinical Board Format) */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 pb-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Study Mode Test:</span>
            <span className="text-indigo-700">{chapterName}</span>
          </h1>

          <button
            onClick={handleRestart}
            className="text-[11px] font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 mt-1 uppercase tracking-wider cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Restart Practice</span>
          </button>
        </div>

        {/* Right: Skip To Question [  ] Of N  [ GO ] */}
        <form onSubmit={handleSkipToGo} className="flex items-center gap-2 text-xs text-slate-600 font-sans">
          <span className="font-semibold text-slate-500">Skip To Question</span>
          <input
            type="text"
            value={skipInputVal}
            onChange={(e) => setSkipInputVal(e.target.value)}
            placeholder={String(currentIndex + 1)}
            className="w-12 h-7 text-center font-mono font-bold text-xs bg-white border border-slate-300 rounded px-1 text-slate-800 focus:outline-none focus:border-indigo-600"
          />
          <span className="font-semibold text-slate-500">Of {questionsList.length}</span>
          <button
            type="submit"
            className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded font-bold text-xs cursor-pointer active:scale-95 transition-all"
          >
            GO
          </button>
        </form>
      </div>

      {/* ========================================================================= */}
      {/* 2. SUB-HEADER HORIZONTAL NAVIGATION STRIP */}
      {/* ========================================================================= */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-2 sm:p-2.5 flex flex-wrap items-center justify-between gap-2 shadow-2xs">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors shadow-2xs"
          >
            PREVIOUS
          </button>
          <button
            onClick={handlePreviousUnanswered}
            className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs uppercase tracking-wider cursor-pointer transition-colors shadow-2xs"
          >
            PREVIOUS UNANSWERED QUESTION
          </button>
        </div>

        {/* Center: Current of Total */}
        <div className="font-bold font-mono text-sm sm:text-base text-slate-900 px-4 py-1 bg-slate-50 rounded-lg border border-slate-200">
          {currentIndex + 1} / {questionsList.length}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleNextUnanswered}
            className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs uppercase tracking-wider cursor-pointer transition-colors shadow-2xs"
          >
            NEXT UNANSWERED QUESTION
          </button>
          <button
            onClick={handleNext}
            className="px-4 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs uppercase tracking-wider cursor-pointer transition-colors shadow-2xs"
          >
            {currentIndex === questionsList.length - 1 ? 'FINISH' : 'NEXT'}
          </button>
        </div>
      </div>

      {!isCompletedSession ? (
        <>
          {/* ========================================================================= */}
          {/* 3. TOP QUESTION CARD (Full-Width with Blue Ribbon Header) */}
          {/* ========================================================================= */}
          <div className="practice-question-card rounded-2xl border border-slate-200/90 bg-white shadow-xs overflow-hidden">
            {/* Ribbon Header Bar */}
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/50 px-4 py-2">
              <span className="bg-[#1E5B97] text-white font-bold font-display text-xs px-4 py-1 rounded-md shadow-2xs uppercase tracking-wider">
                Question
              </span>

              <button
                onClick={handleToggleBookmark}
                className={`flex items-center gap-1.5 text-xs font-semibold cursor-pointer px-2.5 py-1 rounded-lg transition-colors ${
                  isBookmarked
                    ? 'text-amber-600 bg-amber-50 font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Star className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-500 text-amber-500' : 'text-slate-400'}`} />
                <span>{isBookmarked ? 'Saved for later' : 'Save for later'}</span>
              </button>
            </div>

            {/* Question Statement Body */}
            <div className="p-6 sm:p-7 space-y-4">
              <p className="text-base sm:text-lg text-slate-900 font-sans leading-relaxed font-medium">
                {currentQuestion.question}
              </p>

              {/* Code Snippet if applicable */}
              {currentQuestion.codeSnippet && (
                <div className="rounded-xl overflow-hidden border border-slate-800 bg-[#0F172A] text-slate-200">
                  <div className="flex items-center justify-between px-3 py-1.5 bg-[#1E293B] border-b border-slate-700/80 text-[11px] font-mono text-slate-400">
                    <span>SCHEMA DEFINITION</span>
                    <Code2 className="w-3.5 h-3.5" />
                  </div>
                  <pre className="p-4 font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed">
                    {currentQuestion.codeSnippet}
                  </pre>
                </div>
              )}

              {/* Table Data if applicable */}
              {currentQuestion.tableData && (
                <div className="overflow-x-auto rounded-xl border border-slate-200 bg-slate-50/50 p-2">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="bg-slate-100 text-slate-800 border-b border-slate-200">
                        {currentQuestion.tableData.headers.map((h, i) => (
                          <th key={i} className="p-2 font-bold">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {currentQuestion.tableData.rows.map((r, rIdx) => (
                        <tr key={rIdx} className="hover:bg-white">
                          {r.map((c, cIdx) => (
                            <td key={cIdx} className="p-2 text-slate-800">{c}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 4. BOTTOM 2-COLUMN SPLIT (Exact Match to Screenshot) */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
            {/* ----------------------------------------------------------------------- */}
            {/* LEFT BOX: "Your Answer" */}
            {/* ----------------------------------------------------------------------- */}
            <div className="rounded-2xl border border-slate-200/90 bg-white shadow-xs overflow-hidden flex flex-col justify-between">
              <div>
                {/* Header Bar */}
                <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/50 px-4 py-2">
                  <span className="bg-[#1E5B97] text-white font-bold font-display text-xs px-4 py-1 rounded-md shadow-2xs uppercase tracking-wider">
                    Your Answer
                  </span>

                  <span className="text-xs text-slate-500 font-sans flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 text-blue-600" />
                    Select the correct answer below
                  </span>
                </div>

                {/* Options List */}
                <div className="p-5 sm:p-6 space-y-3.5">
                  {currentQuestion.options.map((option, idx) => {
                    const optionLetter = String.fromCharCode(65 + idx);
                    const isSelected = currentSelectedAnswer === option;
                    const isCorrectChoice = option === currentQuestion.correctAnswer;

                    let boxBorder = 'border-slate-300 bg-white hover:border-slate-400 hover:bg-slate-50/70';
                    let letterColor = 'text-slate-600';

                    if (isCurrentSubmitted) {
                      if (isCorrectChoice) {
                        boxBorder = 'border-2 border-emerald-500 bg-emerald-50/60 font-semibold text-emerald-950';
                        letterColor = 'text-emerald-700 font-bold';
                      } else if (isSelected && !isCorrectChoice) {
                        boxBorder = 'border-2 border-rose-500 bg-rose-50/60 font-semibold text-rose-950';
                        letterColor = 'text-rose-700 font-bold';
                      } else {
                        boxBorder = 'border-slate-200 bg-slate-50/40 text-slate-400';
                        letterColor = 'text-slate-400';
                      }
                    } else if (isSelected) {
                      boxBorder = 'border-2 border-indigo-600 bg-indigo-50/50 text-indigo-950 font-semibold shadow-2xs';
                      letterColor = 'text-indigo-700 font-black';
                    }

                    return (
                      <div
                        key={idx}
                        onClick={() => handleSelectOption(option)}
                        className="practice-option-row flex items-center gap-3.5 cursor-pointer group"
                      >
                        {/* Big Letter A, B, C, D */}
                        <span className={`text-xl sm:text-2xl font-display font-extrabold w-6 text-center shrink-0 ${letterColor}`}>
                          {optionLetter}
                        </span>

                        {/* Option Text Box */}
                        <div
                          className={`flex-1 p-3.5 sm:p-4 rounded-xl border text-xs sm:text-sm font-sans flex items-center justify-between gap-3 transition-all ${boxBorder}`}
                        >
                          <span className="leading-relaxed">{option}</span>

                          {/* Status Pill on Right */}
                          {isCurrentSubmitted && isCorrectChoice && (
                            <span className="bg-emerald-600 text-white font-bold font-mono text-[10px] px-2 py-0.5 rounded flex items-center gap-1 shrink-0">
                              <Check className="w-3 h-3 stroke-[3]" /> Correct
                            </span>
                          )}

                          {isCurrentSubmitted && isSelected && !isCorrectChoice && (
                            <span className="bg-rose-600 text-white font-bold font-mono text-[10px] px-2 py-0.5 rounded flex items-center gap-1 shrink-0">
                              ✕ Incorrect
                            </span>
                          )}

                          {!isCurrentSubmitted && (
                            <span
                              className={`w-4 h-4 rounded border shrink-0 transition-colors ${
                                isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'
                              }`}
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

                {/* Bottom Action Button (Save Answer) */}
              <div className="p-5 sm:p-6 pt-0">
                <button
                  type="button"
                  onClick={handleSaveAnswer}
                  disabled={!currentSelectedAnswer || isCurrentSubmitted}
                  className="px-6 py-2.5 rounded-lg bg-[#5D728A] hover:bg-[#475A70] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  {isCurrentSubmitted ? 'ANSWER SAVED' : 'SAVE ANSWER'}
                </button>
              </div>
            </div>

            {/* ----------------------------------------------------------------------- */}
            {/* RIGHT BOX: "The Answer Is" */}
            {/* ----------------------------------------------------------------------- */}
            <div className="practice-answer-card rounded-2xl border border-slate-200/90 bg-white shadow-xs overflow-hidden">
              {/* Header Bar */}
              <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/50 px-4 py-2">
                <span className="bg-[#1E5B97] text-white font-bold font-display text-xs px-4 py-1 rounded-md shadow-2xs uppercase tracking-wider">
                  The Answer Is
                </span>

                {isCurrentSubmitted ? (
                  isCurrentCorrect ? (
                    <span className="border border-emerald-300 bg-emerald-50 text-emerald-800 text-[11px] font-bold font-mono px-2.5 py-0.5 rounded">
                      ✓ You Answered Correctly
                    </span>
                  ) : (
                    <span className="border border-rose-300 bg-rose-50 text-rose-800 text-[11px] font-bold font-mono px-2.5 py-0.5 rounded">
                      ✕ You Answered Incorrectly
                    </span>
                  )
                ) : (
                  <span className="text-[11px] text-slate-400 font-mono">
                    Awaiting Answer Submission
                  </span>
                )}
              </div>

              {/* Body Content */}
              <div className="p-5 sm:p-6 space-y-4">
                {isCurrentSubmitted ? (
                  /* RATIONALE CONTAINER */
                  <div className="rounded-xl border border-slate-200 p-5 bg-slate-50/60 space-y-4 font-sans text-xs sm:text-sm leading-relaxed text-slate-700">
                    {/* Bold Header */}
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 font-display">
                      The Correct Answer Is {correctOptionLetter}
                    </h3>

                    {/* Main Core Explanation */}
                    <p className="text-slate-800 leading-relaxed font-sans">
                      {currentQuestion.explanation.coreReason}
                    </p>

                    {/* Systematic Breakdown for Each Distractor Option */}
                    {currentQuestion.explanation.distractors && currentQuestion.explanation.distractors.length > 0 && (
                      <div className="space-y-2.5 pt-2 border-t border-slate-200/80 text-xs">
                        {currentQuestion.explanation.distractors.map((d, dIdx) => (
                          <p key={dIdx} className="text-slate-600 leading-normal">
                            <strong className="text-slate-800">Answer {d.option} is incorrect: </strong>
                            {d.whyWrong}
                          </p>
                        ))}
                      </div>
                    )}

                    {/* Educational Objective / Key Takeaway */}
                    <div className="p-3 rounded-lg bg-white border border-slate-200 text-xs text-indigo-900 font-mono font-semibold">
                      💡 Educational Objective: {currentQuestion.explanation.keyTakeaway}
                    </div>
                  </div>
                ) : (
                  /* AWAITING ANSWER PLACEHOLDER */
                  <div className="py-12 px-6 text-center space-y-4 border border-dashed border-slate-200 rounded-xl bg-slate-50/40">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto text-slate-400">
                      <HelpCircle className="w-6 h-6" />
                    </div>

                    <div className="max-w-xs mx-auto space-y-1">
                      <p className="text-xs sm:text-sm font-bold text-slate-700">
                        Comprehensive Explanation Hidden
                      </p>
                      <p className="text-xs text-slate-500 font-sans">
                        Select an option on the left and click <strong>SAVE ANSWER</strong> to inspect the systematic solution breakdown and distractor analysis.
                      </p>
                    </div>

                    {/* Socratic Hint Toggle */}
                    <div>
                      <button
                        onClick={() => setShowHint(!showHint)}
                        className="text-xs font-semibold text-amber-800 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg border border-amber-200 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                        <span>{showHint ? 'Hide Hint' : 'Need a Hint First?'}</span>
                      </button>

                      {showHint && (
                        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 font-sans mt-3 text-left animate-in fade-in duration-200">
                          <strong>💡 Clue: </strong>
                          {currentQuestion.hint}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        /* ========================================================================= */
        /* 5. EXAM RESULTS & REVIEW SUMMARY */
        /* ========================================================================= */
        <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-12 text-center space-y-6 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600">
            <Trophy className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600">
              Practice Test Completed
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900">
              Score: {finalScorePercent}% ({totalCorrectCount} of {questionsList.length} Correct)
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              You have completed all {questionsList.length} questions in {chapterName}.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={handleRestart}
              className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 font-bold text-xs uppercase tracking-wider cursor-pointer"
            >
              Restart Test
            </button>
            <button
              onClick={() => navigate('/app/learning-map')}
              className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 font-bold text-xs uppercase tracking-wider cursor-pointer"
            >
              Back to Learning Map
            </button>
            <button
              onClick={() => navigate(`/app/module?chapter=db-1`)}
              className="px-6 py-2.5 rounded-xl bg-[#1E5B97] hover:bg-[#184878] text-white font-bold text-xs uppercase tracking-wider cursor-pointer shadow-xs"
            >
              Read Full Chapter Tutorial
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
