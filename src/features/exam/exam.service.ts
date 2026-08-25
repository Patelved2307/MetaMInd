import type { ExamDifficulty, ExamQuestion, IssuedCertificate } from './exam.types';

const CERTIFICATES_STORAGE_KEY = 'metamind_user_certificates_v1';

export const examService = {
  getExamQuestions(topic: string, difficulty: ExamDifficulty): ExamQuestion[] {
    const isSql = topic.toLowerCase().includes('sql') || topic.toLowerCase().includes('join');

    if (isSql) {
      if (difficulty === 'easy') {
        return [
          {
            id: 'sql_e1',
            question: 'What is the primary function of an INNER JOIN in SQL?',
            options: [
              'Returns matching rows present in both joined tables',
              'Returns all rows from the left table only',
              'Deletes duplicate database rows',
              'Sorts output in ascending order',
            ],
            correctAnswer: 'Returns matching rows present in both joined tables',
            explanation: 'INNER JOIN returns records that satisfy the join condition in both tables.',
          },
          {
            id: 'sql_e2',
            question: 'What does a Primary Key guarantee in a database table?',
            options: [
              'Each row has a unique, non-null identifier',
              'Columns can store duplicate text values',
              'Foreign keys are not required',
              'The table is automatically encrypted',
            ],
            correctAnswer: 'Each row has a unique, non-null identifier',
            explanation: 'Primary keys enforce unique identification for every record.',
          },
          {
            id: 'sql_e3',
            question: 'Which value is populated in a LEFT JOIN when a right-table record has no match?',
            options: ['NULL', '0', 'EMPTY_STRING', 'UNDEFINED'],
            correctAnswer: 'NULL',
            explanation: 'LEFT JOIN yields NULL for missing right-side table columns.',
          },
          {
            id: 'sql_e4',
            question: 'Which clause specifies the matching condition between two tables in a JOIN?',
            options: ['ON', 'WHERE', 'HAVING', 'GROUP BY'],
            correctAnswer: 'ON',
            explanation: 'The ON clause defines the relational join predicate.',
          },
          {
            id: 'sql_e5',
            question: 'Which table retains ALL its rows during a LEFT JOIN operation?',
            options: ['The Left table', 'The Right table', 'Both tables', 'Neither table'],
            correctAnswer: 'The Left table',
            explanation: 'LEFT JOIN preserves every row from the left table specified before the JOIN clause.',
          },
        ];
      }

      if (difficulty === 'medium') {
        return [
          {
            id: 'sql_m1',
            question: 'Suppose Table A has 5 rows and Table B has 0 matching rows. How many rows does a LEFT JOIN return?',
            options: ['5 rows', '0 rows', '10 rows', 'Error'],
            correctAnswer: '5 rows',
            explanation: 'LEFT JOIN returns all 5 left-table rows, filling right columns with NULL.',
          },
          {
            id: 'sql_m2',
            question: 'What is the key difference between INNER JOIN and LEFT JOIN?',
            options: [
              'INNER JOIN excludes unmatched rows; LEFT JOIN keeps all left rows with NULL right fields',
              'LEFT JOIN is faster than INNER JOIN',
              'INNER JOIN only works on integer primary keys',
              'LEFT JOIN requires three tables',
            ],
            correctAnswer: 'INNER JOIN excludes unmatched rows; LEFT JOIN keeps all left rows with NULL right fields',
            explanation: 'LEFT JOIN preserves unmatched left rows, whereas INNER JOIN discards them.',
          },
          {
            id: 'sql_m3',
            question: 'What happens if you join two tables without specifying an ON condition?',
            options: ['A CROSS JOIN (Cartesian product) is produced', 'Syntax error always thrown', 'First row only returned', 'Tables are merged into one'],
            correctAnswer: 'A CROSS JOIN (Cartesian product) is produced',
            explanation: 'Omitting join predicates produces a Cartesian product matching every row to every row.',
          },
          {
            id: 'sql_m4',
            question: 'How do Foreign Keys maintain database integrity?',
            options: ['By referencing valid Primary Keys in parent tables', 'By forcing uppercase text', 'By automatically deleting tables', 'By indexing all columns'],
            correctAnswer: 'By referencing valid Primary Keys in parent tables',
            explanation: 'Foreign keys enforce referential integrity across related schemas.',
          },
          {
            id: 'sql_m5',
            question: 'Which query correctly counts students grouped by course using LEFT JOIN?',
            options: [
              'SELECT Courses.name, COUNT(Students.id) FROM Courses LEFT JOIN Students ON Courses.id = Students.course_id GROUP BY Courses.name',
              'SELECT * FROM Courses LEFT JOIN Students',
              'SELECT COUNT(*) FROM Courses',
              'SELECT Courses.name FROM Courses INNER JOIN Students ON 1=1',
            ],
            correctAnswer: 'SELECT Courses.name, COUNT(Students.id) FROM Courses LEFT JOIN Students ON Courses.id = Students.course_id GROUP BY Courses.name',
            explanation: 'Grouping by course name with LEFT JOIN ensures courses with 0 students show a count of 0.',
          },
        ];
      }

      // Hard difficulty
      return [
        {
          id: 'sql_h1',
          question: 'How can you simulate a FULL OUTER JOIN in database engines that do not natively support FULL OUTER JOIN?',
          options: [
            'Combine a LEFT JOIN and a RIGHT JOIN using UNION',
            'Use a CROSS JOIN with WHERE 1=1',
            'Nest three INNER JOIN clauses',
            'Use an aggregate HAVING clause',
          ],
          correctAnswer: 'Combine a LEFT JOIN and a RIGHT JOIN using UNION',
          explanation: 'UNION combines the distinct result sets of a LEFT JOIN and a RIGHT JOIN to emulate FULL OUTER JOIN.',
        },
        {
          id: 'sql_h2',
          question: 'What is a major performance risk when performing multi-table JOINs without indexed Foreign Keys?',
          options: [
            'Engine executes full table scans leading to O(N*M) time complexity',
            'Database deletes unindexed rows',
            'Foreign keys become primary keys',
            'Query results become corrupted',
          ],
          correctAnswer: 'Engine executes full table scans leading to O(N*M) time complexity',
          explanation: 'Unindexed join columns force costly full table scans over Cartesian pairs.',
        },
        {
          id: 'sql_h3',
          question: 'In a LEFT JOIN where `RightTable.id IS NULL` is added in the WHERE clause, what does the query effectively filter?',
          options: [
            'It filters for rows present in the Left table that have NO match in the Right table',
            'It returns only matching rows',
            'It throws a null pointer exception',
            'It returns empty result sets always',
          ],
          correctAnswer: 'It filters for rows present in the Left table that have NO match in the Right table',
          explanation: 'Checking `RightTable.id IS NULL` isolates left rows with zero right-side matches (anti-join pattern).',
        },
        {
          id: 'sql_h4',
          question: 'What is a Self-JOIN and when is it typically utilized?',
          options: [
            'Joining a table to itself to evaluate hierarchical or parent-child relationships',
            'Joining a table to a temporary view',
            'Joining two database instances',
            'An automated database repair script',
          ],
          correctAnswer: 'Joining a table to itself to evaluate hierarchical or parent-child relationships',
          explanation: 'Self-JOIN connects rows within the same table, useful for manager-employee or org chart hierarchies.',
        },
        {
          id: 'sql_h5',
          question: 'Why must caution be used when combining `LEFT JOIN` with `WHERE` conditions on the right table?',
          options: [
            'A WHERE clause on right-table columns can unintentionally convert a LEFT JOIN into an INNER JOIN if NULLs are filtered out',
            'It causes infinite recursion',
            'RIGHT JOIN is forced automatically',
            'Table indexes are disabled',
          ],
          correctAnswer: 'A WHERE clause on right-table columns can unintentionally convert a LEFT JOIN into an INNER JOIN if NULLs are filtered out',
          explanation: 'Non-null WHERE conditions on right table columns filter out NULLs, turning the query into an INNER JOIN.',
        },
      ];
    }

    // Default Generic Topic Questions
    return [
      {
        id: 'gen_1',
        question: `What is the primary step in mastering ${topic}?`,
        options: [
          'Deconstructing principles into prerequisite concepts',
          'Memorizing raw text without practical testing',
          'Skipping foundational checks',
          'Ignoring diagnostic feedback',
        ],
        correctAnswer: 'Deconstructing principles into prerequisite concepts',
        explanation: 'Deconstructing core principles is fundamental to deep comprehension.',
      },
      {
        id: 'gen_2',
        question: `How is practical mastery of ${topic} best demonstrated?`,
        options: [
          'Applying concepts to solve novel scenario problems',
          'Reading a single paper once',
          'Avoiding exam questions',
          'Guessing answers randomly',
        ],
        correctAnswer: 'Applying concepts to solve novel scenario problems',
        explanation: 'True mastery is proven through applied scenario problem solving.',
      },
      {
        id: 'gen_3',
        question: `What is the risk of skipping prerequisite knowledge when studying ${topic}?`,
        options: [
          'Forming misconceptions that hinder advanced comprehension',
          'Learning too quickly',
          'Improving exam scores automatically',
          'Reducing practice time',
        ],
        correctAnswer: 'Forming misconceptions that hinder advanced comprehension',
        explanation: 'Skipping prerequisites causes gaps that make complex concepts difficult.',
      },
      {
        id: 'gen_4',
        question: `Which approach ensures long-term retention of ${topic}?`,
        options: [
          'Spaced practice and targeted reassessment',
          'Cramming right before an exam',
          'Never reviewing weak concepts',
          'Reading without taking notes',
        ],
        correctAnswer: 'Spaced practice and targeted reassessment',
        explanation: 'Spaced review and targeted reassessment solidify long-term memory.',
      },
      {
        id: 'gen_5',
        question: `What passing score is required to earn a verified certificate in MetaMind?`,
        options: ['80% or higher', '50% or higher', '60% or higher', '100% only'],
        correctAnswer: '80% or higher',
        explanation: 'Certificates require demonstrating at least 80% mastery score on timed exams.',
      },
    ];
  },

  // Save certificate if student passes with >= 80%
  issueCertificate(
    userId: string,
    studentName: string,
    topic: string,
    subject: string,
    difficulty: ExamDifficulty,
    scorePercent: number,
    themeName: string
  ): IssuedCertificate | null {
    if (scorePercent < 80) return null; // STRICT PASS THRESHOLD

    const cert: IssuedCertificate = {
      id: `cert_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId,
      studentName,
      topic,
      subject,
      difficulty,
      scorePercent,
      issuedAt: new Date().toISOString(),
      verificationCode: `ATH-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      avatarThemeName: themeName,
    };

    const existing = this.getCertificates();
    const updated = [cert, ...existing.filter((c) => c.topic !== topic || c.difficulty !== difficulty)];
    localStorage.setItem(CERTIFICATES_STORAGE_KEY, JSON.stringify(updated));

    return cert;
  },

  getCertificates(): IssuedCertificate[] {
    const stored = localStorage.getItem(CERTIFICATES_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // ignore
      }
    }
    return [];
  },
};
