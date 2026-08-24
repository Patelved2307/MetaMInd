import type {
  TopicAnalysisResult,
  AssessmentQuestion,
  AnswerAnalysisResult,
  KnowledgeAnalysis,
  LearningModuleContent,
  MasteryLevel,
} from './ai.types';

export const mockAiProvider = {
  async analyzeTopic(query: string): Promise<TopicAnalysisResult> {
    const q = query.toLowerCase();

    if (q.includes('sql') || q.includes('join')) {
      return {
        subject: 'Database Management Systems & SQL Architecture',
        topic: 'SQL JOINs & Table Relationships',
        description:
          'SQL JOINs allow relational databases to combine rows from multiple normalized tables by matching shared primary and foreign key values.',
        concepts: [
          { name: 'Database Tables & Normalization', type: 'prerequisite', description: 'Structured schema organizing entities into discrete tables' },
          { name: 'Primary Keys (PK)', type: 'prerequisite', description: 'Unique, non-null identifier for individual table rows' },
          { name: 'Foreign Keys (FK)', type: 'prerequisite', description: 'Column referencing a Primary Key in a parent table' },
          { name: 'SQL JOIN Clause', type: 'core', description: 'Query syntax used to merge rows across related tables' },
          { name: 'INNER JOIN', type: 'core', description: 'Returns only records where matching keys exist in both tables' },
          { name: 'LEFT JOIN (LEFT OUTER JOIN)', type: 'core', description: 'Returns ALL left table rows + matching right table rows (NULL if missing)' },
          { name: 'RIGHT & FULL OUTER JOIN', type: 'advanced', description: 'Complete cartesian and full-table outer join patterns' },
        ],
      };
    }

    if (q.includes('recursion')) {
      return {
        subject: 'Computer Science & Algorithm Design',
        topic: 'Recursion & Memory Call Stacks',
        description:
          'Recursion is a programming paradigm where a function solves a problem by calling smaller instances of itself until reaching a base condition.',
        concepts: [
          { name: 'Execution Call Stack', type: 'prerequisite', description: 'LIFO stack memory managing function call frames' },
          { name: 'Base Condition (Termination)', type: 'core', description: 'Mandatory exit rule preventing infinite recursion stack overflow' },
          { name: 'Recursive Step & Reduction', type: 'core', description: 'Reducing complex input parameters closer to the base case' },
          { name: 'Stack Unwinding & Return Values', type: 'core', description: 'Propagating evaluated values back up the call stack chain' },
          { name: 'Tail Call Optimization', type: 'advanced', description: 'Compiler optimization technique replacing stack frames' },
        ],
      };
    }

    if (q.includes('photosynthesis')) {
      return {
        subject: 'Biological Sciences & Plant Physiology',
        topic: 'Photosynthesis & Cellular Energy Transfer',
        description:
          'Photosynthesis converts solar light energy into stable chemical glucose by combining carbon dioxide and water within chloroplasts.',
        concepts: [
          { name: 'Chloroplast Structure & Thylakoids', type: 'prerequisite', description: 'Organelles and membranes containing chlorophyll pigments' },
          { name: 'Light-Dependent Reactions', type: 'core', description: 'Splitting H2O with photons to synthesize ATP and NADPH' },
          { name: 'Calvin Cycle (Light-Independent)', type: 'core', description: 'Fixing CO2 with RuBisCO enzyme to create G3P sugars' },
          { name: 'Transpiration & Gas Exchange', type: 'related', description: 'Stomata mechanisms regulating O2 and CO2 diffusion' },
        ],
      };
    }

    if (q.includes('machine learning') || q.includes('ml') || q.includes('ai')) {
      return {
        subject: 'Artificial Intelligence & Machine Learning',
        topic: 'Machine Learning Foundations',
        description:
          'Machine Learning focuses on algorithms that build statistical models from training data to make predictions without explicit hardcoded rules.',
        concepts: [
          { name: 'Vectors & Feature Matrices', type: 'prerequisite', description: 'Representing raw real-world data in numeric vector spaces' },
          { name: 'Supervised vs Unsupervised', type: 'core', description: 'Learning with labeled targets vs discovering latent structures' },
          { name: 'Loss Function & Gradient Descent', type: 'core', description: 'Quantifying prediction error and optimizing model parameters' },
          { name: 'Overfitting & Regularization', type: 'advanced', description: 'Preventing memorization to ensure generalizable predictions' },
        ],
      };
    }

    // Default Detailed Generic Topic Breakdown
    return {
      subject: 'Applied Technical & Scientific Foundations',
      topic: query.length > 35 ? query.substring(0, 35) + '...' : query,
      description: `Comprehensive AI adaptive learning journey deconstructing ${query} into core principles, prerequisites, and practical scenarios.`,
      concepts: [
        { name: 'Fundamental Prerequisites', type: 'prerequisite', description: 'Essential vocabulary and prerequisite building blocks' },
        { name: 'Core Mechanism', type: 'core', description: 'Primary working principles and execution rules' },
        { name: 'Practical Applications', type: 'core', description: 'Real-world scenarios and problem solving' },
        { name: 'Advanced Variations & Edge Cases', type: 'advanced', description: 'Edge cases and deep optimization techniques' },
      ],
    };
  },

  async generateAssessment(topic: string, _count = 4): Promise<AssessmentQuestion[]> {
    if (topic.toLowerCase().includes('sql') || topic.toLowerCase().includes('join')) {
      return [
        {
          id: 'q1_tables',
          conceptName: 'Database Tables & Keys',
          question: 'In a relational database schema, what is the specific role of a Foreign Key (FK)?',
          questionType: 'MULTIPLE_CHOICE',
          options: [
            'It enforces unique values in every column of its own table',
            'It establishes a relational link referencing the Primary Key of another table',
            'It automatically creates a backup copy of the database table',
            'It speeds up full-text search indexing',
          ],
          correctAnswer: 'It establishes a relational link referencing the Primary Key of another table',
          difficulty: 'beginner',
          explanation: 'Foreign keys establish relationships by referencing the primary key of a parent table, ensuring referential integrity.',
        },
        {
          id: 'q2_inner',
          conceptName: 'INNER JOIN',
          question: 'If Table A has 10 rows and Table B has 4 matching rows on `customer_id`, how many rows will an `INNER JOIN` query return?',
          questionType: 'MULTIPLE_CHOICE',
          options: ['14 rows', '10 rows', '4 rows', '0 rows'],
          correctAnswer: '4 rows',
          difficulty: 'intermediate',
          explanation: 'INNER JOIN filters out unmatched records and returns only rows that meet the join condition in both tables.',
        },
        {
          id: 'q3_left',
          conceptName: 'LEFT JOIN',
          question: 'When performing a `LEFT JOIN`, what happens to columns from the right table if a row in the left table has no matching right-side record?',
          questionType: 'MULTIPLE_CHOICE',
          options: [
            'The right-side columns are filled with NULL values',
            'The left-side row is discarded from the result set',
            'The database engine raises a runtime exception',
            'The columns display default empty strings ""',
          ],
          correctAnswer: 'The right-side columns are filled with NULL values',
          difficulty: 'intermediate',
          explanation: 'LEFT JOIN retains all left-table rows regardless of match status, returning NULL for unmatched right-side fields.',
        },
        {
          id: 'q4_scenario',
          conceptName: 'SQL JOIN Scenario',
          question: 'You need a report listing ALL registered users, including users who have NEVER placed an order. Which JOIN strategy is correct?',
          questionType: 'MULTIPLE_CHOICE',
          options: [
            'INNER JOIN (Users INNER JOIN Orders)',
            'LEFT JOIN (Users LEFT JOIN Orders)',
            'RIGHT JOIN (Orders RIGHT JOIN Users)',
            'CROSS JOIN (Users CROSS JOIN Orders)',
          ],
          correctAnswer: 'LEFT JOIN (Users LEFT JOIN Orders)',
          difficulty: 'advanced',
          explanation: 'LEFT JOIN ensures users with 0 orders are preserved in the result list with NULL order values.',
        },
      ];
    }

    return [
      {
        id: 'q1_gen',
        conceptName: 'Fundamental Principles',
        question: `What is the primary step required to thoroughly master ${topic}?`,
        questionType: 'MULTIPLE_CHOICE',
        options: [
          'Deconstructing complex mechanisms into fundamental prerequisite steps',
          'Memorizing raw definitions without practical scenario testing',
          'Skipping foundational concepts to read advanced papers',
          'Relying solely on intuition without structured verification',
        ],
        correctAnswer: 'Deconstructing complex mechanisms into fundamental prerequisite steps',
        difficulty: 'beginner',
        explanation: 'Deep mastery requires deconstructing core mechanisms step-by-step.',
      },
      {
        id: 'q2_gen',
        conceptName: 'Practical Scenario',
        question: `Which methodology best evaluates true comprehension of ${topic}?`,
        questionType: 'MULTIPLE_CHOICE',
        options: [
          'Solving novel real-world scenarios and analyzing edge cases',
          'Reading a single textbook chapter once',
          'Avoiding diagnostic questions',
          'Memorizing sample multiple choice answers',
        ],
        correctAnswer: 'Solving novel real-world scenarios and analyzing edge cases',
        difficulty: 'intermediate',
        explanation: 'Real comprehension is demonstrated when applying concepts to novel problem scenarios.',
      },
    ];
  },

  async analyzeAnswer(
    question: AssessmentQuestion,
    userAnswer: string
  ): Promise<AnswerAnalysisResult> {
    const isCorrect = userAnswer.trim() === question.correctAnswer.trim();

    if (isCorrect) {
      return {
        isCorrect: true,
        confidence: 'high',
        affectedConcepts: [question.conceptName],
        recommendedAction: 'Advance to higher-difficulty application scenarios.',
        newDifficultyEstimate: question.difficulty === 'beginner' ? 'intermediate' : 'advanced',
      };
    }

    let misconception = 'Needs clearer distinction between prerequisite keys and join output behavior.';
    if (question.conceptName.includes('LEFT JOIN')) {
      misconception = 'The student understands basic table matching, but confuses row preservation rules in LEFT JOIN vs INNER JOIN.';
    } else if (question.conceptName.includes('Database Tables')) {
      misconception = 'The student is confusing primary key uniqueness with foreign key reference links.';
    }

    return {
      isCorrect: false,
      confidence: 'medium',
      misconception,
      affectedConcepts: [question.conceptName],
      recommendedAction: 'Review unmatched row preservation using a visual side-by-side table diagram.',
      newDifficultyEstimate: 'beginner',
    };
  },

  async generateKnowledgeAnalysis(
    topic: string,
    scorePercent: number
  ): Promise<KnowledgeAnalysis> {
    if (scorePercent >= 75) {
      return {
        topic,
        strongConcepts: ['Database Tables & Primary Keys', 'INNER JOIN Syntax', 'Basic Relational Matching'],
        needsImprovementConcepts: ['Handling Unmatched Rows in LEFT JOIN', 'Multi-table Query Optimization'],
        mainKnowledgeGap: 'You have a great grasp of relational tables! Solidify how LEFT JOIN handles missing records using NULL fields.',
        recommendedPath: ['INNER JOIN Review', 'LEFT JOIN Null Handling', 'Real-world Multi-table Queries'],
      };
    }

    return {
      topic,
      strongConcepts: ['Database Tables', 'Entity Relationships'],
      needsImprovementConcepts: ['Primary Key vs Foreign Key Links', 'Difference between INNER JOIN & LEFT JOIN'],
      mainKnowledgeGap: 'You understand how tables store data, but you need to strengthen your understanding of how related rows behave when data is missing.',
      recommendedPath: [
        'Table Relationships & Foreign Keys',
        'INNER JOIN Mechanism',
        'LEFT JOIN with Real-world Worked Examples',
        'Targeted Practice & Reassessment',
      ],
    };
  },

  async generateModule(
    conceptName: string,
    level: MasteryLevel
  ): Promise<LearningModuleContent> {
    if (conceptName.toLowerCase().includes('left join') || conceptName.toLowerCase().includes('sql')) {
      return {
        conceptName: 'LEFT JOIN',
        explanationLevel: level,
        title: 'Understanding SQL LEFT JOIN Step-by-Step',
        explanation:
          'A LEFT JOIN returns ALL records from the left table (Table A), regardless of whether a matching record exists in the right table (Table B). When no match is found in the right table, SQL fills all right-table columns with NULL values rather than discarding the left-side row.',
        example: {
          title: 'Students & Course Enrolments Real-World Example',
          scenario:
            'Consider a university database with a `Students` table (Left) and an `Enrolments` table (Right). Alex is enrolled in SQL 101, Maya is enrolled in Web Dev, and Jordan has NOT enrolled in any course yet.',
          codeOrDiagram: `SELECT 
  Students.student_id, 
  Students.name, 
  Enrolments.course_name
FROM Students
LEFT JOIN Enrolments 
  ON Students.student_id = Enrolments.student_id;

-- QUERY OUTPUT:
-- ID | Name   | Course
-- ------------------------
-- 101 | Alex   | SQL 101
-- 102 | Maya   | Web Dev
-- 103 | Jordan | NULL   <-- Jordan is KEPT! Course is NULL.`,
          explanation:
            'An INNER JOIN would have completely excluded Jordan from the report. LEFT JOIN guarantees Jordan stays in your report, filling the missing course with NULL.',
        },
        keyIdea:
          'LEFT JOIN NEVER drops rows from the left table. Missing right-side data is always presented as NULL.',
        tryItQuestion: {
          question:
            'What happens to a registered student record with no enrolled courses when performing a LEFT JOIN between Students and Enrolments?',
          options: [
            'The student is removed from the query output',
            'The student is displayed with NULL for course details',
            'The database engine throws an error',
            'The query automatically creates dummy enrolment rows',
          ],
          answer: 'The student is displayed with NULL for course details',
          explanation:
            'Spot on! LEFT JOIN preserves all left-table rows and represents missing right-side data with NULL.',
        },
      };
    }

    return {
      conceptName,
      explanationLevel: level,
      title: `Mastering ${conceptName} Step-by-Step`,
      explanation: `Here is a personalized breakdown of ${conceptName} adapted to your learning background. We break down theoretical concepts into intuitive, step-by-step working mechanisms.`,
      example: {
        title: 'Real-World Worked Scenario',
        scenario: `Consider how ${conceptName} operates in real-world systems. Deconstructing input data into modular steps prevents unexpected errors.`,
        explanation: 'Notice how separating core rules from edge cases makes complex logic simple to follow.',
      },
      keyIdea: `Always verify prerequisite foundations before advancing in ${conceptName}.`,
      tryItQuestion: {
        question: `Which principle best describes the core mechanism of ${conceptName}?`,
        options: [
          'Deconstructing complex problems into simple, verifiable steps',
          'Ignoring input parameter contracts',
          'Memorizing code snippets without testing',
          'Expecting automatic error suppression',
        ],
        answer: 'Deconstructing complex problems into simple, verifiable steps',
        explanation: 'Correct! Systematic step-by-step breakdown ensures deep comprehension.',
      },
    };
  },
};
