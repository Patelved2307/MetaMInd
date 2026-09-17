export interface ScenarioDifference {
  aspect: string;
  optionA: string;
  optionB: string;
}

export interface TopicScenarioData {
  conceptual?: {
    analogy: string;
    corePrinciples: string[];
  };
  comparison?: {
    comparedTo: string;
    differences: ScenarioDifference[];
    decisionRule: string;
  };
  debugging?: {
    commonError: string;
    rootCause: string;
    badCodeSnippet?: string;
    fixedCodeSnippet?: string;
    fixExplanation: string;
  };
  implementation?: {
    language: string;
    codeSnippet: string;
    keyLinesExplanation: string[];
  };
  interview?: {
    topQuestions: string[];
    interviewTrap: string;
    modelAnswer: string;
  };
  systemDesign?: {
    architecturePattern: string;
    tradeoffs: string;
    bottlenecksAndScaling: string;
  };
}

export interface TopicKnowledgeItem {
  id: string;
  topic: string;
  subject: string;
  keywords: string[];
  summary: string;
  principles: string[];
  codeOrDiagram?: string;
  weakness: string;
  strength: string;
  keyTakeaways: string[];
  followUpPrompts?: string[];
  scenarios?: TopicScenarioData;
  quickCheck: {
    id: string;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

export const ACADEMIC_DATASET: TopicKnowledgeItem[] = [
  // =========================================================================
  // 1. SQL JOINS & MISSING ROWS
  // =========================================================================
  {
    id: 'sql-joins',
    topic: 'SQL Joins (INNER, LEFT, RIGHT, FULL OUTER)',
    subject: 'Database Management Systems',
    keywords: ['join', 'joins', 'inner join', 'left join', 'right join', 'full join', 'missing rows', 'cartesian', 'on condition', 'null rows', 'sql join'],
    summary: 'SQL Joins correlate and combine rows from two or more relational tables based on related primary-foreign key column predicates.',
    principles: [
      '**INNER JOIN**: Strict intersection (A ∩ B). Rows only appear if the join condition matches in both tables.',
      '**LEFT (OUTER) JOIN**: Preserves 100% of rows from the left table (A). Unmatched right table attributes populate with NULL.',
      '**The "WHERE on NULL" Trap**: Placing right-table filter predicates in the WHERE clause instead of ON silently converts your LEFT JOIN into an INNER JOIN.',
      '**Orphaned Row Detection**: Execute `WHERE RightTable.id IS NULL` following a LEFT JOIN to instantly surface records lacking foreign references.',
    ],
    codeOrDiagram: `SELECT 
  u.name, 
  o.order_id, 
  o.total_amount
FROM Users u
LEFT JOIN Orders o ON u.id = o.user_id AND o.status = 'COMPLETED';`,
    weakness: 'Confusing LEFT JOIN NULL row preservation with INNER JOIN non-matching row exclusion.',
    strength: 'Clear grasp of relational table schemas and foreign key references.',
    keyTakeaways: [
      'INNER JOIN excludes rows that do not have corresponding entries in both tables.',
      'LEFT JOIN always keeps all records from the left table; unmatched right fields become NULL.',
      'Always filter secondary conditions in the ON clause to avoid dropping preserved rows.',
    ],
    followUpPrompts: [
      'Show me the WHERE vs ON bug with bad and fixed code',
      'Compare INNER JOIN vs LEFT JOIN with a visual decision matrix',
      'What are the top interview questions on SQL Joins?',
      'Give me another practice question on NULL handling',
    ],
    scenarios: {
      conceptual: {
        analogy: 'Think of a student roster (Left) and dorm room assignments (Right). A LEFT JOIN shows every enrolled student—those without assigned dorms still appear with "Dorm: NULL". An INNER JOIN deletes homeless students from the roster!',
        corePrinciples: [
          'Relational tables represent sets; joins compute set intersections and Cartesian subsets.',
          'Nullability indicates absence of corresponding related entity in foreign table.',
        ],
      },
      comparison: {
        comparedTo: 'INNER JOIN vs LEFT JOIN',
        differences: [
          { aspect: 'Row Retention', optionA: 'INNER: Keeps only matching pairs', optionB: 'LEFT: Keeps all Left rows unconditionally' },
          { aspect: 'Handling Nulls', optionA: 'INNER: Eliminates Null associations', optionB: 'LEFT: Fills missing Right columns with NULL' },
          { aspect: 'Use Case', optionA: 'INNER: Transactions that must have customers', optionB: 'LEFT: Reporting all users, even those with 0 orders' },
        ],
        decisionRule: 'If the business requirement says "Show all records regardless of whether they have data in Table B", ALWAYS use LEFT JOIN.',
      },
      debugging: {
        commonError: 'Missing Rows / Silent Conversion of LEFT JOIN to INNER JOIN',
        rootCause: 'Placing right-table filter predicates in the WHERE clause instead of the ON clause. Since NULL values fail comparison operators, preserved rows are discarded.',
        badCodeSnippet: `-- BUG: WHERE clause discards users with 0 orders because NULL = 'ACTIVE' evaluates to FALSE!
SELECT u.id, u.email, o.status
FROM Users u
LEFT JOIN Orders o ON u.id = o.user_id
WHERE o.status = 'ACTIVE';`,
        fixedCodeSnippet: `-- FIX: Move right-table filter into the ON clause
SELECT u.id, u.email, o.status
FROM Users u
LEFT JOIN Orders o ON u.id = o.user_id AND o.status = 'ACTIVE';`,
        fixExplanation: 'Moving the condition to the ON clause ensures non-matching rows are still kept with NULLs instead of being eliminated by WHERE.',
      },
      implementation: {
        language: 'SQL',
        codeSnippet: `-- Anti-Join Pattern to find users who have NEVER placed an order:
SELECT 
  u.id, 
  u.email,
  u.created_at
FROM Users u
LEFT JOIN Orders o ON u.id = o.user_id
WHERE o.id IS NULL;`,
        keyLinesExplanation: [
          'Line 6: LEFT JOIN pairs each user with all their orders (if any).',
          'Line 7: WHERE o.id IS NULL filters out everyone with at least 1 order, isolating pure orphans.',
        ],
      },
      interview: {
        topQuestions: [
          'What happens if you have duplicate keys on both sides of a JOIN?',
          'How does the query planner choose between Nested Loop, Hash Join, and Merge Join?',
          'Explain why COUNT(column) behaves differently from COUNT(*) on a LEFT JOIN.',
        ],
        interviewTrap: 'Interviewers often provide a LEFT JOIN with a `WHERE right_table.col = 5` filter and ask "How many rows are returned?". If candidates forget that NULL = 5 evaluates to UNKNOWN/FALSE, they get tricked!',
        modelAnswer: 'A LEFT JOIN guarantees preservation of the left table only until the WHERE clause evaluates. Any condition in WHERE referencing the right table must check for NULLs explicitly, or the join degrades to an INNER JOIN.',
      },
    },
    quickCheck: [
      {
        id: 'qc_joins_1',
        question: 'Why does a query with `FROM A LEFT JOIN B ON A.id = B.a_id WHERE B.status = 1` drop rows from table A?',
        options: [
          'Because WHERE predicates are evaluated after the join; when B has no match, B.status is NULL and NULL = 1 evaluates to UNKNOWN (filtered out)',
          'Because LEFT JOIN automatically removes NULL rows when a WHERE clause exists in SQL',
          'Because table B has an index that forces INNER JOIN behavior',
          'Because the SQL optimizer rearranges LEFT JOIN into RIGHT JOIN for optimization',
        ],
        correctIndex: 0,
        explanation: 'The WHERE clause executes after the LEFT JOIN generates NULLs. Since NULL = 1 evaluates to UNKNOWN, those preserved rows are discarded!',
      },
      {
        id: 'qc_joins_2',
        question: 'If Table A has 3 rows and Table B has 4 matching rows for every row in A, how many rows will `A INNER JOIN B` produce?',
        options: [
          '12 rows (Cartesian product of the matching subsets: 3 * 4 = 12)',
          '7 rows (3 + 4)',
          '4 rows (Maximum of the two)',
          '3 rows (Size of Table A)',
        ],
        correctIndex: 0,
        explanation: 'Joins correlate all matching key pairs. Since each of the 3 rows matches 4 rows in Table B, the result contains 3 * 4 = 12 rows.',
      },
      {
        id: 'qc_joins_3',
        question: 'How do you find customers who have NEVER placed an order using SQL Joins?',
        options: [
          'LEFT JOIN Customers with Orders and add `WHERE Orders.id IS NULL`',
          'INNER JOIN Customers with Orders and add `WHERE Orders.id = 0`',
          'RIGHT JOIN Customers with Orders and add `WHERE Customers.id IS NOT NULL`',
          'FULL OUTER JOIN without any WHERE clause',
        ],
        correctIndex: 0,
        explanation: 'This classic "Anti-Join" pattern pairs all customers with orders; filtering by `Orders.id IS NULL` retains only customers lacking any order record.',
      },
    ],
  },

  // =========================================================================
  // 2. SQL VS NOSQL ARCHITECTURE
  // =========================================================================
  {
    id: 'sql-vs-nosql',
    topic: 'Relational (SQL) vs NoSQL (Document, Key-Value, Columnar)',
    subject: 'Database Systems & Architecture',
    keywords: ['sql vs nosql', 'nosql', 'rdbms', 'mongodb', 'postgresql vs mongo', 'acid vs base', 'schemaless', 'sharding', 'relational vs non-relational'],
    summary: 'Contrasting structured relational database systems (ACID, schema-bound, normalized) with distributed NoSQL datastores (BASE, horizontal scale, flexible schema).',
    principles: [
      '**RDBMS (SQL)**: Optimizes for data integrity, strict relations, foreign keys, and complex analytical JOINs across tables.',
      '**Document NoSQL**: Embeds related sub-entities into single JSON/BSON documents to eliminate multi-table network roundtrips.',
      '**Scaling Modality**: SQL traditionally scales vertically (bigger CPU/RAM) or via read replicas; NoSQL scales horizontally across commodity clusters via auto-sharding.',
      '**ACID vs BASE**: SQL enforces Immediate Consistency; NoSQL typically operates under Basically Available, Soft-state, Eventual consistency.',
    ],
    codeOrDiagram: `// MongoDB Document representation of User + Orders in 1 atomic read:
{
  "_id": "usr_942",
  "name": "Sarah Connor",
  "email": "sarah@skynet.com",
  "orders": [
    { "id": "ord_101", "total": 249.99, "items": 3 },
    { "id": "ord_102", "total": 45.00, "items": 1 }
  ]
}`,
    weakness: 'Assuming NoSQL is always "faster" than SQL without considering duplication anomalies and transaction guarantees.',
    strength: 'Understanding when schema flexibility outweighs relational normalization.',
    keyTakeaways: [
      'Use SQL when transactional integrity, zero anomalies, and flexible multi-dimensional querying are mandatory.',
      'Use NoSQL when data access patterns are predetermined, schema evolves rapidly, and write throughput requires horizontal partition clusters.',
    ],
    followUpPrompts: [
      'Show me when to pick PostgreSQL over MongoDB with a decision tree',
      'What is the CAP Theorem tradeoff between MongoDB and Cassandra?',
      'Test me on SQL vs NoSQL architectural traps in interviews',
    ],
    scenarios: {
      comparison: {
        comparedTo: 'PostgreSQL vs MongoDB',
        differences: [
          { aspect: 'Data Model', optionA: 'SQL: Strict normalized tables with foreign keys', optionB: 'NoSQL: Hierarchical JSON documents or key-value pairs' },
          { aspect: 'Transaction Semantics', optionA: 'SQL: Strict ACID transactions across multiple tables', optionB: 'NoSQL: Single-document atomicity; multi-document transactions carry high overhead' },
          { aspect: 'Horizontal Sharding', optionA: 'SQL: Difficult; requires external partitioning or distributed SQL (CockroachDB)', optionB: 'NoSQL: Built-in native horizontal hash/range partitioning' },
        ],
        decisionRule: 'Choose SQL if you have complex relations, frequent joins, and financial transactional integrity. Choose NoSQL if data is hierarchical and reads demand single-key lookups.',
      },
      interview: {
        topQuestions: [
          'Can PostgreSQL do what MongoDB does using JSONB columns?',
          'What happens in a NoSQL database when you need to update a duplicated field across 1 million documents?',
          'Explain the difference between ACID and BASE.',
        ],
        interviewTrap: 'Candidates often say "SQL doesn\'t scale". Top engineers specify: SQL scales vertically with ease and horizontally for reads; write-sharding across tables is where relational constraints introduce distributed locking bottlenecks.',
        modelAnswer: 'Modern PostgreSQL supports indexed JSONB documents natively, blurring lines. Choose NoSQL when write volume exceeds single-node IOPS and access patterns align with a primary shard key.',
      },
    },
    quickCheck: [
      {
        id: 'qc_sql_nosql_1',
        question: 'Under which scenario is a Document NoSQL database (like MongoDB) fundamentally SUPERIOR to a relational SQL database?',
        options: [
          'When read queries consistently retrieve an entity along with all its nested child records by a single primary ID',
          'When the application requires complex financial ledger transfers joining 8 different tables with strict rollback',
          'When you need to perform ad-hoc aggregations across unrelated data dimensions with no predetermined queries',
          'When data storage space must be minimized by eliminating any duplicate data',
        ],
        correctIndex: 0,
        explanation: 'Document stores shine when the entire aggregate root (e.g. Order + OrderItems) is embedded and fetched in a single I/O seek without relational join costs.',
      },
      {
        id: 'qc_sql_nosql_2',
        question: 'What is the primary danger of denormalizing and duplicating user data across multiple NoSQL documents?',
        options: [
          'Data inconsistency anomalies when an update succeeds on some documents but fails or lags on others',
          'NoSQL databases crash if duplicate keys are detected',
          'JSON cannot store duplicated string attributes',
          'Queries become slower than SQL multi-table joins',
        ],
        correctIndex: 0,
        explanation: 'Denormalization trades storage and update complexity for read speed. Updating duplicated fields requires multi-document updates that risk stale/inconsistent reads.',
      },
    ],
  },

  // =========================================================================
  // 3. DATABASE NORMALIZATION (1NF, 2NF, 3NF, BCNF)
  // =========================================================================
  {
    id: 'db-normalization',
    topic: 'Database Normalization (1NF, 2NF, 3NF, BCNF)',
    subject: 'Database Management Systems',
    keywords: ['normalization', '1nf', '2nf', '3nf', 'bcnf', 'functional dependency', 'transitive dependency', 'partial dependency', 'anomalies'],
    summary: 'The systematic process of organizing relational database schemas to minimize data redundancy and prevent insertion, update, and deletion anomalies.',
    principles: [
      '**1NF (First Normal Form)**: Atomic column values (no multi-valued lists or arrays) and a unique primary key.',
      '**2NF (Second Normal Form)**: Must be in 1NF and eliminate **Partial Dependencies** (no non-key attribute depends on a subset of a composite primary key).',
      '**3NF (Third Normal Form)**: Must be in 2NF and eliminate **Transitive Dependencies** (no non-key attribute depends on another non-key attribute: A → B and B → C).',
      '**BCNF (Boyce-Codd Normal Form)**: For every functional dependency X → Y, X must be a superkey.',
    ],
    codeOrDiagram: `-- 3NF Decomposed Schema eliminating Transitive Dependency (dept_id -> dept_name):
CREATE TABLE Departments (
  dept_id INT PRIMARY KEY,
  dept_name TEXT NOT NULL
);

CREATE TABLE Employees (
  emp_id INT PRIMARY KEY,
  emp_name TEXT NOT NULL,
  dept_id INT REFERENCES Departments(dept_id)
);`,
    weakness: 'Over-normalizing OLAP analytical workloads where joined queries cause latency, or failing to recognize transitive dependencies.',
    strength: 'Mastery of functional dependencies and anomaly prevention.',
    keyTakeaways: [
      '1NF: Atomic cells only.',
      '2NF: No partial composite key dependencies.',
      '3NF: No non-key dependencies (X → Y where X is not a candidate key).',
    ],
    followUpPrompts: [
      'Show me an example of an Update Anomaly in 2NF',
      'How does 3NF differ from BCNF with a real schema example?',
      'Why do data warehouses deliberately denormalize 3NF into Star Schemas?',
    ],
    scenarios: {
      debugging: {
        commonError: 'Update & Deletion Anomalies caused by 2NF Violation',
        rootCause: 'Storing Department Head in the Employee table creates redundant copies. If an employee leaves, the department information is accidentally deleted!',
        badCodeSnippet: `-- BUG: Deleting the last employee deletes the entire department!
CREATE TABLE Staff (
  emp_id INT,
  emp_name TEXT,
  dept_name TEXT,
  dept_budget NUMERIC,
  PRIMARY KEY(emp_id)
);`,
        fixedCodeSnippet: `-- FIX: Split into two 3NF relations
CREATE TABLE Department (
  dept_name TEXT PRIMARY KEY,
  dept_budget NUMERIC
);
CREATE TABLE Staff (
  emp_id INT PRIMARY KEY,
  emp_name TEXT,
  dept_name TEXT REFERENCES Department(dept_name)
);`,
        fixExplanation: 'Separating department attributes ensures department budgeting data persists independently of employee turnover.',
      },
      interview: {
        topQuestions: [
          'What is the difference between 3NF and BCNF?',
          'When is it acceptable or desirable to denormalize a database?',
          'Explain Insertion, Update, and Deletion anomalies with an example.',
        ],
        interviewTrap: 'Candidates often state that 3NF eliminates ALL redundancy. BCNF is stricter: in 3NF, the right-hand side can be a prime attribute; BCNF requires the determinant to always be a superkey.',
        modelAnswer: 'Normalization optimizes transactional write workloads (OLTP) by eliminating redundancy and anomalies. In read-heavy analytical reporting (OLAP), controlled denormalization into Star or Snowflake schemas reduces expensive joins.',
      },
    },
    quickCheck: [
      {
        id: 'qc_norm_1',
        question: 'In a table `StudentCourses(student_id, course_id, instructor_office)`, where `course_id -> instructor_office`, which normal form is violated?',
        options: [
          '2NF is violated because `instructor_office` depends on only part of the composite primary key `(student_id, course_id)`',
          '1NF is violated because student_id is not atomic',
          '3NF is violated because instructor_office is a foreign key',
          'BCNF is satisfied because instructor_office is unique',
        ],
        correctIndex: 0,
        explanation: 'The composite key is (student_id, course_id). `instructor_office` depends solely on `course_id` (a subset of the key), which is a Partial Key Dependency violating 2NF.',
      },
      {
        id: 'qc_norm_2',
        question: 'What is a Transitive Dependency in relational database theory?',
        options: [
          'When attribute A determines B, and B determines C, so non-key attribute C indirectly depends on primary key A through non-key B',
          'When primary key values change dynamically during an ongoing transaction',
          'When two foreign keys reference each other in a circular loop',
          'When a table contains more than 10 columns',
        ],
        correctIndex: 0,
        explanation: 'A Transitive Dependency occurs when A → B and B → C (where B is not a candidate key). 3NF strictly eliminates these dependencies by decomposing them into separate tables.',
      },
    ],
  },

  // =========================================================================
  // 4. DATABASE INDEXING (B-TREES & COMPOSITE INDEXES)
  // =========================================================================
  {
    id: 'db-indexing',
    topic: 'Database Indexing (B-Trees, B+ Trees, Hash Indexes)',
    subject: 'Database Performance & Optimization',
    keywords: ['indexing', 'b-tree', 'b+ tree', 'composite index', 'clustered index', 'table scan', 'explain analyze', 'index seek'],
    summary: 'Indexes are specialized auxiliary data structures (typically B+ Trees) that allow database engines to locate specific disk pages in logarithmic time O(log N) instead of full table scans O(N).',
    principles: [
      '**B+ Tree Structure**: Internal nodes store only routing keys; all actual table row pointers/records live in sorted leaf nodes linked as a doubly-linked list.',
      '**Clustered vs Non-Clustered**: A table can have only ONE Clustered Index because it defines physical on-disk row sorting order. Non-clustered indexes point back to the clustered key.',
      '**The Leftmost Prefix Rule**: A composite index `(A, B, C)` can serve queries filtering on `(A)`, `(A, B)`, or `(A, B, C)`, but CANNOT accelerate queries filtering exclusively on `(B)` or `(C)`.',
      '**Write Amplification**: Every index accelerates read queries but penalizes INSERT, UPDATE, and DELETE operations, as all B+ trees must rebalance.',
    ],
    codeOrDiagram: `-- Optimal Composite Index satisfying Leftmost Prefix rule:
CREATE INDEX idx_orders_user_created_status 
ON Orders (user_id, created_at DESC, status);

-- This query performs an ultra-fast B+ Tree Range Index Seek:
SELECT * FROM Orders 
WHERE user_id = 42 
  AND created_at >= '2026-01-01' 
ORDER BY created_at DESC;`,
    weakness: 'Over-indexing tables or creating composite indexes with columns in the wrong order, rendering them useless for range queries.',
    strength: 'Deep intuition of B+ Tree disk page lookups and EXPLAIN execution plans.',
    keyTakeaways: [
      'B+ Trees excel at range queries because all leaf nodes are sequentially linked.',
      'Always order composite index columns: [Equality Columns First] -> [Range/Sort Columns Second].',
      'Avoid wrapping indexed columns in functions (e.g., `WHERE LOWER(email) = ...`) because it invalidates index seeks.',
    ],
    followUpPrompts: [
      'Show me how wrapping a column in a function causes a full table scan',
      'Compare B-Tree vs B+ Tree internals with node structure diagrams',
      'How to read EXPLAIN ANALYZE index scan vs index seek output',
    ],
    scenarios: {
      debugging: {
        commonError: 'Index Invalidation by Function Wrapping',
        rootCause: 'Applying a function to an indexed column (e.g., `WHERE YEAR(created_at) = 2026`) prevents the optimizer from doing a direct B+ Tree binary search, forcing a full table scan.',
        badCodeSnippet: `-- BUG: Full Table Scan! B+ Tree index on created_at is bypassed:
SELECT * FROM Users WHERE DATE(created_at) = '2026-09-14';`,
        fixedCodeSnippet: `-- FIX: Keep column untouched using an sargable range:
SELECT * FROM Users 
WHERE created_at >= '2026-09-14 00:00:00' 
  AND created_at < '2026-09-15 00:00:00';`,
        fixExplanation: 'Using an inequality range preserves sargability (Search Argument Ability), allowing logarithmic B+ Tree traversal.',
      },
      interview: {
        topQuestions: [
          'Why do relational databases use B+ Trees instead of Binary Search Trees or Hash tables for indexing?',
          'What is a Covering Index and how does it prevent table lookups?',
          'Explain the difference between a Clustered and Secondary Index.',
        ],
        interviewTrap: 'Candidates often claim Hash indexes are better because O(1) < O(log N). Interviewers trap them by asking: "What happens when you run `WHERE age BETWEEN 20 AND 30`?". Hash indexes cannot do range scans!',
        modelAnswer: 'B+ Trees have high fanout (thousands of keys per disk page), keeping tree depth small (3–4 levels) to minimize costly disk I/O. Furthermore, linked leaf nodes enable lightning-fast sequential range scans.',
      },
    },
    quickCheck: [
      {
        id: 'qc_idx_1',
        question: 'Given a composite index on `(country, city, zip_code)`, which WHERE clause CANNOT utilize this index effectively?',
        options: [
          '`WHERE city = "Seattle"` (violates leftmost prefix rule)',
          '`WHERE country = "USA" AND city = "Seattle"`',
          '`WHERE country = "USA"`',
          '`WHERE country = "USA" AND city = "Seattle" AND zip_code = "98101"`',
        ],
        correctIndex: 0,
        explanation: 'Because the composite index is sorted by country first, filtering solely on `city` without `country` forces the engine to bypass the index or scan every entry.',
      },
      {
        id: 'qc_idx_2',
        question: 'Why do database storage engines prefer B+ Trees over Red-Black Binary Search Trees for disk storage?',
        options: [
          'B+ Trees have high branching factor (fanout), matching disk page block sizes to achieve shallow height (3-4 I/O reads) for millions of records',
          'Binary search trees cannot store string data',
          'B+ Trees take up zero storage memory on disk',
          'Binary trees cannot be sorted',
        ],
        correctIndex: 0,
        explanation: 'Disk reads are slow. High fanout B+ trees keep tree height to 3–4 levels for tens of millions of rows, requiring very few disk I/O seeks compared to deep binary trees.',
      },
    ],
  },

  // =========================================================================
  // 5. ACID TRANSACTIONS & ISOLATION LEVELS
  // =========================================================================
  {
    id: 'acid-transactions',
    topic: 'ACID Transactions & Concurrency Isolation Levels',
    subject: 'Database Management Systems',
    keywords: ['acid', 'transactions', 'dirty read', 'phantom read', 'non-repeatable read', 'isolation levels', 'serializable', 'mvcc', 'wal'],
    summary: 'The mathematical and operational guarantees ensuring reliable execution of concurrent database transactions in the presence of failures, race conditions, and crashes.',
    principles: [
      '**Atomicity**: All operations in a transaction succeed or all roll back (Write-Ahead Logging / WAL undo logs).',
      '**Consistency**: State transitions enforce all schema invariants, foreign keys, and check constraints.',
      '**Isolation**: Concurrently executing transactions cannot see uncommitted or mutating intermediate states.',
      '**Durability**: Once committed, changes survive power outages and system crashes (WAL flushed to non-volatile disk).',
      '**Isolation Tiers**: Read Uncommitted < Read Committed < Repeatable Read < Serializable.',
    ],
    codeOrDiagram: `-- Transactional money transfer with row-level pessimistic locking:
BEGIN TRANSACTION;

SELECT balance FROM Accounts WHERE id = 101 FOR UPDATE;
UPDATE Accounts SET balance = balance - 100 WHERE id = 101;

SELECT balance FROM Accounts WHERE id = 202 FOR UPDATE;
UPDATE Accounts SET balance = balance + 100 WHERE id = 202;

COMMIT;`,
    weakness: 'Misunderstanding the difference between Non-Repeatable Read (modified row) and Phantom Read (inserted rows).',
    strength: 'Deep understanding of Multi-Version Concurrency Control (MVCC) snapshots.',
    keyTakeaways: [
      'Dirty Read: Reading uncommitted, dirty data that might be rolled back.',
      'Non-repeatable Read: A row is updated/deleted by another transaction between two identical reads.',
      'Phantom Read: New matching rows are inserted by another transaction between two range queries.',
    ],
    followUpPrompts: [
      'Compare Repeatable Read vs Serializable isolation with a phantom read example',
      'How does MVCC (Multi-Version Concurrency Control) eliminate read locks in PostgreSQL?',
      'Top interview traps on Deadlocks and Isolation Levels',
    ],
    scenarios: {
      debugging: {
        commonError: 'Dirty Read Bug in Financial Balances',
        rootCause: 'Running under Read Uncommitted isolation allows Transaction A to read balance updates from Transaction B before B aborts or rolls back.',
        badCodeSnippet: `-- Transaction B crashes and rolls back:
UPDATE Balances SET amount = 5000 WHERE id = 1;
-- Transaction A concurrently reads $5000:
SELECT amount FROM Balances WHERE id = 1; -- Sees $5000!
-- B rolls back:
ROLLBACK; -- User withdrew phantom money!`,
        fixedCodeSnippet: `-- FIX: Use Read Committed or Repeatable Read isolation:
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
BEGIN;
SELECT amount FROM Balances WHERE id = 1 FOR UPDATE;
-- Only committed, verified data is visible!`,
        fixExplanation: 'Read Committed ensures no transaction ever observes dirty uncommitted mutations.',
      },
      interview: {
        topQuestions: [
          'How does MVCC allow reads to never block writes and writes to never block reads?',
          'What is the difference between Non-Repeatable Read and Phantom Read?',
          'What is Write-Skew and which isolation level prevents it?',
        ],
        interviewTrap: 'Many engineers assume Repeatable Read prevents Phantom Reads. In the SQL-92 standard, only Serializable prevents Phantom Reads (though PostgreSQL Repeatable Read prevents it via snapshot isolation).',
        modelAnswer: 'MVCC maintains multiple version tuples of a row tagged with transaction IDs (xmin, xmax). Readers read a consistent historical snapshot without taking locks, while writers write new row versions.',
      },
    },
    quickCheck: [
      {
        id: 'qc_acid_1',
        question: 'Which concurrency phenomenon occurs when Transaction A reads a range of rows, and Transaction B inserts a NEW row matching the filter before A commits?',
        options: [
          'Phantom Read',
          'Dirty Read',
          'Non-Repeatable Read',
          'Write-Skew',
        ],
        correctIndex: 0,
        explanation: 'A Phantom Read occurs when newly inserted rows suddenly appear in a subsequent identical range query within the same transaction.',
      },
      {
        id: 'qc_acid_2',
        question: 'How does PostgreSQL ensure Durability in ACID without synchronously writing entire table pages to disk on every commit?',
        options: [
          'By appending transaction records to an append-only Write-Ahead Log (WAL) on disk before acknowledging the commit',
          'By storing everything in cloud memory indefinitely',
          'By delaying commits until midnight',
          'By recreating tables from scratch upon crash',
        ],
        correctIndex: 0,
        explanation: 'Write-Ahead Logging (WAL) flushes compact sequential log records to disk before a commit returns. If the server crashes, it replays WAL during boot.',
      },
    ],
  },

  // =========================================================================
  // 6. CACHING STRATEGIES & REDIS
  // =========================================================================
  {
    id: 'sd-caching-redis',
    topic: 'Caching Strategies & Redis (Cache-Aside, Write-Through, Invalidation)',
    subject: 'System Design & High-Throughput Architecture',
    keywords: ['caching', 'redis', 'memcached', 'cache-aside', 'write-through', 'write-back', 'cache stampede', 'thundering herd', 'eviction lru'],
    summary: 'In-memory caching architectures utilized to offload relational databases, achieve sub-millisecond response latencies, and absorb traffic spikes.',
    principles: [
      '**Cache-Aside (Lazy Loading)**: Application queries cache first; on a cache miss, loads from DB, writes to cache, and returns. Simple and resilient to cache crashes.',
      '**Write-Through**: Application writes to cache; cache synchronously writes to DB before confirming. Ensures zero stale data at the expense of higher write latency.',
      '**Write-Back (Write-Behind)**: Application writes to cache; cache asynchronously batches updates to DB. Extreme write throughput, but risks data loss on cache node crash.',
      '**Cache Invalidation**: "There are only two hard things in Computer Science: cache invalidation and naming things."',
    ],
    codeOrDiagram: `// Production Cache-Aside Pattern in TypeScript:
async function getStudentProfile(userId: string): Promise<Profile> {
  const cacheKey = \`user:profile:\${userId}\`;
  
  // 1. Check Redis in-memory cache
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  // 2. Cache Miss: Query PostgreSQL
  const profile = await db.profiles.findUnique({ where: { id: userId } });
  if (profile) {
    // 3. Populate Redis with 1-hour TTL (Time-To-Live)
    await redis.setex(cacheKey, 3600, JSON.stringify(profile));
  }
  return profile;
}`,
    weakness: 'Failing to implement TTLs or mutex locks to mitigate Cache Stampedes (Thundering Herd).',
    strength: 'Mastery of distributed cache topologies and invalidation patterns.',
    keyTakeaways: [
      'Cache-Aside is the default pattern for read-heavy web applications.',
      'Always attach a TTL (Time To Live) to every cached key to prevent indefinitely stale data.',
      'Add jitter (randomized +/- delta) to TTLs to prevent simultaneous key expiration storms.',
    ],
    followUpPrompts: [
      'Show me how to prevent a Thundering Herd / Cache Stampede with Mutex locks',
      'Compare Redis vs Memcached architecture and multi-threading',
      'What are the best strategies for Redis Cache Eviction (LRU vs LFU)?',
    ],
    scenarios: {
      debugging: {
        commonError: 'Cache Stampede / Thundering Herd Collapse',
        rootCause: 'When a popular key expires, 10,000 concurrent requests simultaneously miss the cache and overwhelm the primary database with identical heavy queries.',
        badCodeSnippet: `// BUG: When key expires, 50,000 users query DB at once!
const data = await redis.get('homepage_feed');
if (!data) {
  const dbData = await db.heavyAggregation();
  await redis.set('homepage_feed', dbData);
}`,
        fixedCodeSnippet: `// FIX: Distributed lock / Mutex to allow only 1 DB re-computation:
let data = await redis.get('homepage_feed');
if (!data) {
  const acquiredLock = await redis.set('lock:homepage_feed', '1', 'NX', 'EX', 5);
  if (acquiredLock) {
    data = await db.heavyAggregation();
    await redis.setex('homepage_feed', 3600 + Math.floor(Math.random() * 60), data);
    await redis.del('lock:homepage_feed');
  } else {
    // Other threads sleep and retry cache
    await sleep(50);
    return getHomepageFeed();
  }
}`,
        fixExplanation: 'Using `SET NX` (Not Exists) ensures only one worker rebuilds the cache while others wait.',
      },
      interview: {
        topQuestions: [
          'What happens during Cache Penetration vs Cache Breakdown vs Cache Avalanche?',
          'Why is Redis single-threaded for command execution yet delivers 100k+ ops/sec?',
          'How would you handle cache consistency when updating user profiles?',
        ],
        interviewTrap: 'Candidates often say: "Update DB then update Cache". The correct pattern is: Update DB, then INVALIDATE (DELETE) the cache entry! Updating cache directly can lead to race condition overwrites.',
        modelAnswer: 'Redis achieves extreme speed via in-memory non-volatile RAM structures and non-blocking I/O multiplexing (epoll). In cache-aside, delete the cached key after updating the database.',
      },
    },
    quickCheck: [
      {
        id: 'qc_cache_1',
        question: 'What is the recommended best practice when modifying a record under the Cache-Aside pattern?',
        options: [
          'Update the database first, and then DELETE (invalidate) the key from the cache',
          'Update the cache first, and leave the database untouched indefinitely',
          'Update both cache and database concurrently without waiting for confirmation',
          'Never delete cache keys; only wait for server restart',
        ],
        correctIndex: 0,
        explanation: 'Deleting the cache key after DB mutation prevents race conditions where concurrent updates overwrite newer cache values with stale data.',
      },
      {
        id: 'qc_cache_2',
        question: 'Why should you add randomized "jitter" to cache key TTL expiration times?',
        options: [
          'To prevent Cache Avalanche where millions of keys expire at the exact same millisecond and crash the DB',
          'Because Redis clocks are inaccurate by several minutes',
          'To encrypt the cached data on disk',
          'To force browser cache refreshes',
        ],
        correctIndex: 0,
        explanation: 'Jitter spreads expiration times over a random window, smoothing out DB load and preventing simultaneous mass cache misses.',
      },
    ],
  },

  // =========================================================================
  // 7. DATA STRUCTURES: BINARY SEARCH & TWO POINTERS
  // =========================================================================
  {
    id: 'dsa-binary-search',
    topic: 'Binary Search & Two-Pointer Invariants',
    subject: 'Data Structures & Algorithms',
    keywords: ['binary search', 'two pointers', 'sorted array', 'log n', 'lower bound', 'upper bound', 'sliding window', 'overflow mid'],
    summary: 'Divide-and-conquer search strategy that slashes search space in half at each iteration, achieving O(log N) runtime on monotonically ordered domains.',
    principles: [
      '**Monotonicity Condition**: Binary search applies to ANY search space that can be partitioned into two monotonic regions: [FALSE, FALSE, ..., TRUE, TRUE].',
      '**Integer Overflow Prevention**: Always calculate midpoint as `mid = low + (high - low) // 2` instead of `(low + high) // 2` to prevent 32-bit integer overflow.',
      '**Loop Invariants**: Ensure `low <= high` (inclusive) or `low < high` (open bounds) matches how boundaries are updated (`mid + 1` vs `mid`).',
    ],
    codeOrDiagram: `def binary_search(nums: list[int], target: int) -> int:
    low, high = 0, len(nums) - 1
    
    while low <= high:
        mid = low + (high - low) // 2  # Overflow-safe
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
            
    return -1`,
    weakness: 'Off-by-one boundary errors causing infinite loops when `low = mid` without `+ 1`.',
    strength: 'Applying binary search on answer spaces (e.g. Koko Eating Bananas, Capacity To Ship Packages).',
    keyTakeaways: [
      'Time Complexity: O(log N); Space: O(1).',
      'Binary Search works on non-array problems where you can binary search on the solution domain.',
    ],
    followUpPrompts: [
      'Show me how to use Binary Search on Answer Spaces',
      'What is the template for Lower Bound vs Upper Bound (bisect_left vs bisect_right)?',
      'Test me on 2-pointer sliding window edge cases',
    ],
    scenarios: {
      debugging: {
        commonError: 'Infinite Loop from Integer Division Truncation',
        rootCause: 'Setting `low = mid` when `high = low + 1` causes `mid = low`, so `low` never advances, locking the while loop forever.',
        badCodeSnippet: `# BUG: Infinite loop when target not found or array length is 2!
while low < high:
    mid = (low + high) // 2
    if condition(mid):
        low = mid # Freezes loop!`,
        fixedCodeSnippet: `# FIX: Always shrink search space monotonically:
while low < high:
    mid = low + (high - low) // 2
    if condition(mid):
        low = mid + 1
    else:
        high = mid`,
        fixExplanation: 'Advancing `low = mid + 1` guarantees the range strictly contracts on every cycle.',
      },
      interview: {
        topQuestions: [
          'How do you find the minimum in a rotated sorted array in O(log N)?',
          'Explain how Binary Search on Answer works with an example.',
          'Find first and last position of element in sorted array.',
        ],
        interviewTrap: 'Interviewers will ask candidates to search for an element in an unknown-length stream. The trick: grow range exponentially by doubling step size (1, 2, 4, 8, 16...) until target < nums[high], then binary search!',
        modelAnswer: 'Binary search is not limited to arrays. If a function f(x) is monotonic (if f(k) is true, f(k+1) is true), we can binary search across the integer domain [min_ans, max_ans] in O(log(range) * cost(f)).',
      },
    },
    quickCheck: [
      {
        id: 'qc_bs_1',
        question: 'Why is `mid = low + (high - low) // 2` preferred over `(low + high) // 2` in standard programming languages?',
        options: [
          'It prevents integer overflow when low + high exceeds the maximum 32-bit signed integer value (2,147,483,647)',
          'It executes 10x faster at the CPU assembly register level',
          'It allows binary searching on negative numbers only',
          'It automatically rounds up instead of down',
        ],
        correctIndex: 0,
        explanation: 'In languages like Java, C++, and Go, if `low + high` exceeds 2^31 - 1, it overflows to a negative integer, triggering out-of-bounds memory crashes.',
      },
      {
        id: 'qc_bs_2',
        question: 'How many maximum comparisons does binary search require to locate an element in a sorted array of 1,000,000 items?',
        options: [
          '20 comparisons (log2(1,000,000) ≈ 19.93)',
          '1,000 comparisons',
          '500,000 comparisons',
          '100 comparisons',
        ],
        correctIndex: 0,
        explanation: 'Since 2^20 = 1,048,576, binary search will find the item or conclude it is missing in at most 20 comparisons.',
      },
    ],
  },

  // =========================================================================
  // 8. DATA STRUCTURES: BINARY SEARCH TREES & BALANCED AVL
  // =========================================================================
  {
    id: 'dsa-bst',
    topic: 'Binary Search Trees (BST) & Balanced AVL Trees',
    subject: 'Data Structures & Algorithms',
    keywords: ['bst', 'avl', 'binary search tree', 'tree traversal', 'inorder', 'tree height', 'rebalancing', 'rotations'],
    summary: 'A hierarchical node-based tree structure where the key in each node is greater than all keys in its left subtree and smaller than all keys in its right subtree.',
    principles: [
      '**BST Invariant**: LeftSubtree(node) < node.val < RightSubtree(node).',
      '**Degenerate Case Trap**: Inserting sorted data (1, 2, 3, 4, 5) into a naive BST degrades it into a linked list with O(N) lookup time.',
      '**AVL Self-Balancing**: Maintains balance factor = `Height(Left) - Height(Right) ∈ {-1, 0, 1}` via Left and Right rotations.',
      '**In-Order Traversal**: In-order traversal (Left -> Node -> Right) of a BST outputs items in strictly sorted ascending order.',
    ],
    codeOrDiagram: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def isValidBST(root: TreeNode, low=float('-inf'), high=float('inf')) -> bool:
    if not root:
        return True
    if not (low < root.val < high):
        return False
    return (isValidBST(root.left, low, root.val) and 
            isValidBST(root.right, root.val, high))`,
    weakness: 'Checking only immediate children (`node.left < node` and `node.right > node`) without verifying the whole ancestor subtree.',
    strength: 'Understanding recursive bounded invariants and self-balancing rotations.',
    keyTakeaways: [
      'BST validation requires passing min/max boundary constraints down recursive calls.',
      'In-order traversal always produces sorted output.',
    ],
    followUpPrompts: [
      'Show me the 4 AVL Tree Rotations (LL, RR, LR, RL) with diagrams',
      'How to delete a node with 2 children in a BST (In-order successor)',
      'Compare AVL Tree vs Red-Black Tree tradeoffs',
    ],
    scenarios: {
      debugging: {
        commonError: 'Local Child Check Failing Global Subtree Invariant',
        rootCause: 'Verifying only `root.left.val < root.val` misses when a right-child of the left-subtree has a value greater than the grand-parent!',
        badCodeSnippet: `# BUG: Passes tree [10, 5, 15, null, null, 6, 20] even though 6 < 10 is on the right!
def is_valid(node):
    if not node: return True
    if node.left and node.left.val >= node.val: return False
    if node.right and node.right.val <= node.val: return False
    return is_valid(node.left) and is_valid(node.right)`,
        fixedCodeSnippet: `# FIX: Pass bounded range limits down the call stack:
def is_valid(node, min_val=float('-inf'), max_val=float('inf')):
    if not node: return True
    if not (min_val < node.val < max_val): return False
    return (is_valid(node.left, min_val, node.val) and
            is_valid(node.right, node.val, max_val))`,
        fixExplanation: 'Every subtree node must strictly satisfy the inherited ancestors min and max limits.',
      },
    },
    quickCheck: [
      {
        id: 'qc_bst_1',
        question: 'What is the worst-case time complexity of searching for a value in an UNBALANCED Binary Search Tree?',
        options: [
          'O(N) when nodes are inserted in sorted order, creating a linear skewed linked list',
          'O(log N) always',
          'O(1)',
          'O(N log N)',
        ],
        correctIndex: 0,
        explanation: 'If inputs arrive sorted [1, 2, 3, 4, 5], each node has only a right child. The tree degenerates into a singly-linked list of depth N.',
      },
      {
        id: 'qc_bst_2',
        question: 'When deleting a BST node that has TWO children, what node replaces it to preserve the BST invariant?',
        options: [
          'The In-Order Successor (smallest node in the right subtree) or In-Order Predecessor (largest in the left subtree)',
          'The root node of the tree',
          'Any random leaf node',
          'The left child unconditionally',
        ],
        correctIndex: 0,
        explanation: 'The In-Order Successor is guaranteed to be greater than all left-subtree nodes and smaller than all remaining right-subtree nodes.',
      },
    ],
  },

  // =========================================================================
  // 9. DATA STRUCTURES: HEAPS & PRIORITY QUEUES
  // =========================================================================
  {
    id: 'dsa-heaps',
    topic: 'Heaps & Priority Queues (Min-Heap, Max-Heap, Top K)',
    subject: 'Data Structures & Algorithms',
    keywords: ['heap', 'priority queue', 'min-heap', 'max-heap', 'heapify', 'top k', 'kth largest'],
    summary: 'A complete binary tree satisfying the Heap Property: each parent node is smaller than (Min-Heap) or greater than (Max-Heap) its children, enabling O(1) peek and O(log N) extract.',
    principles: [
      '**Array Representation**: Stored in a flat array where for index `i`, `Left = 2*i + 1`, `Right = 2*i + 2`, and `Parent = (i - 1) // 2`.',
      '**Heapify Complexity**: Building a heap from an unordered array of N elements takes **O(N)** time, NOT O(N log N), via bottom-up sift-down.',
      '**Top-K Elements Pattern**: To find the K largest elements, maintain a **Min-Heap of size K**. If a new number exceeds the top, pop and push.',
    ],
    codeOrDiagram: `import heapq

def findKthLargest(nums: list[int], k: int) -> int:
    # Maintain a Min-Heap of size K
    min_heap = []
    for num in nums:
        heapq.heappush(min_heap, num)
        if len(min_heap) > k:
            heapq.heappop(min_heap)
            
    # The root of the Min-Heap is the K-th largest element
    return min_heap[0]`,
    weakness: 'Using a Max-Heap of size N to find K largest (O(N + K log N)) instead of a Min-Heap of size K (O(N log K)).',
    strength: 'Recognizing priority queue applications in real-time schedulers and streaming algorithms.',
    keyTakeaways: [
      'Peek: O(1); Push/Pop: O(log N); Build Heap: O(N).',
      'K largest items -> use Min-Heap of size K.',
      'K smallest items -> use Max-Heap of size K.',
    ],
    followUpPrompts: [
      'Why is building a heap O(N) instead of O(N log N)? Mathematical proof',
      'Implement Median of a Data Stream using two heaps (Min-Heap + Max-Heap)',
      'Top interview questions on Heaps',
    ],
    scenarios: {
      interview: {
        topQuestions: [
          'How does the Median from Data Stream problem use two heaps?',
          'Why does Python provide only `heapq` as a min-heap by default?',
          'Explain how Dijkstra algorithm uses a min-heap to achieve O((V + E) log V).',
        ],
        interviewTrap: 'Interviewers often ask: "Can you search for an arbitrary element in a heap in O(log N)?". No! A heap is NOT a BST; finding an arbitrary value requires a linear O(N) scan.',
        modelAnswer: 'A heap guarantees ordering only between parent and child, not between siblings. It excels exclusively at accessing the extreme element (minimum or maximum) in O(1).',
      },
    },
    quickCheck: [
      {
        id: 'qc_heap_1',
        question: 'What is the optimal time complexity to build a Min-Heap from an unsorted array of N integers?',
        options: [
          'O(N) using bottom-up sift-down heapify',
          'O(N log N) by inserting elements one by one',
          'O(N^2)',
          'O(log N)',
        ],
        correctIndex: 0,
        explanation: 'Bottom-up heapify processes nodes from bottom to top; because the majority of nodes are near the leaves where tree height is minimal, the mathematical summation converges to O(N).',
      },
      {
        id: 'qc_heap_2',
        question: 'To efficiently find the Top 10 Largest numbers in an infinite incoming data stream, what data structure should you maintain?',
        options: [
          'A Min-Heap of capacity 10',
          'A Max-Heap of capacity 10',
          'A sorted array of all elements',
          'A hash map',
        ],
        correctIndex: 0,
        explanation: 'A Min-Heap of size 10 holds the 10 largest seen so far. The root holds the 10th largest; any incoming number larger than root evicts it.',
      },
    ],
  },

  // =========================================================================
  // 10. DATA STRUCTURES: GRAPH TRAVERSAL (BFS & DFS)
  // =========================================================================
  {
    id: 'dsa-graphs',
    topic: 'Graph Traversal (Breadth-First Search & Depth-First Search)',
    subject: 'Data Structures & Algorithms',
    keywords: ['graph', 'bfs', 'dfs', 'breadth first search', 'depth first search', 'shortest path', 'connected components', 'topological sort'],
    summary: 'Foundational algorithmic techniques for exploring vertices and edges in unweighted/weighted, directed/undirected relational networks.',
    principles: [
      '**BFS (Queue / FIFO)**: Explores concentric neighbor rings. Guarantees finding the **shortest path in unweighted graphs**.',
      '**DFS (Stack / Recursion)**: Plunges deep down each branch before backtracking. Ideal for cycle detection, path existence, and topological sorting.',
      '**Visited Set Invariant**: In cyclic graphs, an unvisited check (`if neighbor not in visited`) is mandatory to prevent infinite loops.',
      '**Complexity**: Time: O(V + E); Space: O(V) for visited set and queue/recursion stack.',
    ],
    codeOrDiagram: `from collections import deque

def shortest_path_bfs(graph: dict, start: str, target: str) -> int:
    queue = deque([(start, 0)]) # (node, distance)
    visited = {start}
    
    while queue:
        node, dist = queue.popleft()
        if node == target:
            return dist
            
        for neighbor in graph.get(node, []):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append((neighbor, dist + 1))
                
    return -1`,
    weakness: 'Adding vertices to the `visited` set upon DEQUEUING instead of ENQUEUING, causing duplicate vertex additions and exponential queue bloat.',
    strength: 'Recognizing graph models in everyday problems (social networks, web crawlers, dependency resolution).',
    keyTakeaways: [
      'BFS: Queue, level-by-level, shortest path in unweighted graph.',
      'DFS: Stack/Recursion, backtracks, cycle detection, topological sort.',
      'Always mark nodes as visited the instant they are added to the queue.',
    ],
    followUpPrompts: [
      'Why must you mark visited when enqueuing, not dequeuing in BFS?',
      'How to do Topological Sort with Kahn Algorithm (indegree BFS)',
      'Compare Dijkstra vs BFS for shortest path',
    ],
    scenarios: {
      debugging: {
        commonError: 'Queue Memory Explosion from Delayed Visited Tagging',
        rootCause: 'Marking visited on `popleft()` allows the same vertex to be enqueued thousands of times from different neighbors before it gets processed!',
        badCodeSnippet: `# BUG: Memory Limit Exceeded! Nodes enqueued repeatedly:
while queue:
    node = queue.popleft()
    visited.add(node) # Too late!
    for nbr in graph[node]:
        if nbr not in visited:
            queue.append(nbr)`,
        fixedCodeSnippet: `# FIX: Mark visited immediately upon enqueuing:
while queue:
    node = queue.popleft()
    for nbr in graph[node]:
        if nbr not in visited:
            visited.add(nbr) # Instantly lock it!
            queue.append(nbr)`,
        fixExplanation: 'Marking visited immediately guarantees each vertex enters the queue exactly once.',
      },
    },
    quickCheck: [
      {
        id: 'qc_graph_1',
        question: 'Why does BFS guarantee the shortest path between two nodes in an unweighted graph, whereas DFS does not?',
        options: [
          'Because BFS explores all vertices at distance d before touching any vertex at distance d + 1',
          'Because BFS uses recursion while DFS uses loops',
          'Because DFS visits nodes in alphabetical order',
          'Because BFS sorts the edges by weight automatically',
        ],
        correctIndex: 0,
        explanation: 'BFS traverses level by level in monotonic distance order. The first time the target node is encountered, it is mathematically guaranteed to be via the shortest step path.',
      },
      {
        id: 'qc_graph_2',
        question: 'What happens if you run DFS on a cyclic undirected graph without maintaining a `visited` set?',
        options: [
          'It will bounce between adjacent nodes endlessly, resulting in a Stack Overflow crash',
          'It will successfully return the shortest path',
          'It terminates immediately with an error code',
          'The graph automatically deletes the cycle',
        ],
        correctIndex: 0,
        explanation: 'Without a visited set, node A calls neighbor B, and B immediately calls neighbor A, resulting in an infinite recursion loop and call stack overflow.',
      },
    ],
  },

  // =========================================================================
  // 11. DATA STRUCTURES: DIJKSTRA'S ALGORITHM
  // =========================================================================
  {
    id: 'dsa-dijkstra',
    topic: "Dijkstra's Shortest Path Algorithm",
    subject: 'Data Structures & Algorithms',
    keywords: ['dijkstra', 'shortest path', 'weighted graph', 'greedy', 'priority queue', 'relaxation', 'negative weights'],
    summary: "Greedy algorithm that finds the shortest path from a starting source node to all other vertices in a weighted graph with NON-NEGATIVE edge weights.",
    principles: [
      '**Greedy Choice**: Always expands the currently unvisited vertex with the lowest tentative cumulative distance.',
      '**Edge Relaxation**: If `dist[u] + weight(u, v) < dist[v]`, update `dist[v] = dist[u] + weight(u, v)` and push to min-heap.',
      '**Negative Weight Prohibition**: Dijkstra fails on negative edge weights (requires Bellman-Ford) because greedy finality assumptions break.',
      '**Time Complexity**: O((V + E) log V) using a Min-Heap priority queue.',
    ],
    codeOrDiagram: `import heapq

def dijkstra(graph: dict, start: str) -> dict:
    distances = {node: float('inf') for node in graph}
    distances[start] = 0
    pq = [(0, start)] # (cost, node)
    
    while pq:
        curr_dist, u = heapq.heappop(pq)
        
        if curr_dist > distances[u]:
            continue # Stale heap entry
            
        for v, weight in graph[u]:
            distance = curr_dist + weight
            if distance < distances[v]:
                distances[v] = distance
                heapq.heappush(pq, (distance, v))
                
    return distances`,
    weakness: 'Attempting to run Dijkstra on graphs with negative weights, or forgetting to skip stale duplicate heap entries.',
    strength: 'Understanding edge relaxation invariants and priority queue pruning.',
    keyTakeaways: [
      'Works ONLY with non-negative edge weights.',
      'Complexity: O((V + E) log V).',
      'Always check `if curr_dist > distances[u]: continue` to skip superseded entries.',
    ],
    followUpPrompts: [
      'Why does Dijkstra fail on negative edge weights? Give a counter-example',
      'Compare Dijkstra vs Bellman-Ford vs Floyd-Warshall',
      'How to reconstruct the exact path nodes in Dijkstra',
    ],
    scenarios: {
      interview: {
        topQuestions: [
          'Can adding a constant K to all edge weights allow Dijkstra to work with negative weights?',
          'What is the difference between Dijkstra and A* Search?',
          'How does the stale entry check `curr_dist > distances[u]` affect performance?',
        ],
        interviewTrap: 'Interviewers often ask: "If we add +10 to all edges to make them positive, does Dijkstra work?". NO! Paths with MORE edges are penalized more heavily than paths with FEWER edges, altering the true shortest path!',
        modelAnswer: 'Dijkstra assumes that once a node is popped from the min-heap, its shortest distance is finalized. Negative edges violate this greedy premise because a longer path could become shorter via a negative edge later.',
      },
    },
    quickCheck: [
      {
        id: 'qc_dijk_1',
        question: "Why can Dijkstra's algorithm NOT handle graphs with negative edge weights?",
        options: [
          'Because Dijkstra greedily assumes that once a node is extracted from the priority queue, its distance is final and cannot be improved',
          'Because min-heaps cannot store negative numbers',
          'Because negative edge weights make graphs disconnected',
          'Because Python raises an ArithmeticError',
        ],
        correctIndex: 0,
        explanation: 'Dijkstra marks a node visited once popped because adding positive weights only increases distance. Negative weights can decrease total distance after finalization, invalidating the greedy assumption.',
      },
      {
        id: 'qc_dijk_2',
        question: 'Which algorithm should you select if you need single-source shortest path on a graph that contains negative weights (and detect negative cycles)?',
        options: [
          "Bellman-Ford Algorithm",
          "Dijkstra's Algorithm",
          "Breadth-First Search",
          "Prim's Minimum Spanning Tree",
        ],
        correctIndex: 0,
        explanation: 'Bellman-Ford relaxes all E edges V-1 times, correctly finding shortest paths with negative weights and detecting negative weight cycles.',
      },
    ],
  },

  // =========================================================================
  // 12. DATA STRUCTURES: DYNAMIC PROGRAMMING
  // =========================================================================
  {
    id: 'dsa-dp',
    topic: 'Dynamic Programming (0/1 Knapsack, Memoization & Tabulation)',
    subject: 'Data Structures & Algorithms',
    keywords: ['dynamic programming', 'dp', 'knapsack', 'memoization', 'tabulation', 'optimal substructure', 'overlapping subproblems'],
    summary: 'Algorithmic optimization paradigm that solves complex optimization problems by breaking them down into overlapping subproblems, storing intermediate solutions to avoid redundant re-computation.',
    principles: [
      '**Two Mandatory Properties**: (1) **Overlapping Subproblems** and (2) **Optimal Substructure**.',
      '**Top-Down (Memoization)**: Natural recursive formulation cached via hash map / array.',
      '**Bottom-Up (Tabulation)**: Iterative computation filling a DP table from base cases up.',
      '**Space Optimization**: If state `dp[i]` depends only on `dp[i-1]`, collapse 2D array into 1D array to reduce space from O(N*W) to O(W).',
    ],
    codeOrDiagram: `def knapsack_01(weights: list[int], values: list[int], W: int) -> int:
    n = len(weights)
    # 1D space-optimized DP table:
    dp = [0] * (W + 1)
    
    for i in range(n):
        # Traverse capacity backwards to ensure each item is used at most once:
        for w in range(W, weights[i] - 1, -1):
            dp[w] = max(dp[w], dp[w - weights[i]] + values[i])
            
    return dp[W]`,
    weakness: 'Traversing the inner capacity loop forward in 0/1 Knapsack, which accidentally converts it into Unbounded Knapsack (using items multiple times).',
    strength: 'Identifying state variables and writing recurrence relations.',
    keyTakeaways: [
      '0/1 Knapsack space-optimized requires traversing backwards.',
      'Unbounded Knapsack traverses capacity forward.',
      'State definition is 80% of solving any DP problem.',
    ],
    followUpPrompts: [
      'Why does traversing backwards prevent using an item multiple times?',
      'Show the state transition for Longest Common Subsequence (LCS)',
      'Top 5 dynamic programming patterns asked in FAANG interviews',
    ],
    scenarios: {
      debugging: {
        commonError: 'Forward Iteration in 0/1 Knapsack Space Optimization',
        rootCause: 'Iterating capacity forward updates `dp[w]` using `dp[w - weight]` from the CURRENT iteration, allowing the same item to be chosen repeatedly!',
        badCodeSnippet: `# BUG: Item reused multiple times (Unbounded Knapsack behavior):
for i in range(n):
    for w in range(weights[i], W + 1):
        dp[w] = max(dp[w], dp[w - weights[i]] + values[i])`,
        fixedCodeSnippet: `# FIX: Loop backwards from W down to weight:
for i in range(n):
    for w in range(W, weights[i] - 1, -1):
        dp[w] = max(dp[w], dp[w - weights[i]] + values[i])`,
        fixExplanation: 'Looping backwards guarantees `dp[w - weights[i]]` represents state from the PREVIOUS item, ensuring single usage.',
      },
    },
    quickCheck: [
      {
        id: 'qc_dp_1',
        question: 'Why does the space-optimized 1D array implementation of 0/1 Knapsack traverse capacities in REVERSE (from W down to weight)?',
        options: [
          'To ensure values from the current item do not overwrite and reuse the same item multiple times in the same step',
          'Because Python lists can only be indexed backwards',
          'To avoid negative array index errors',
          'To sort the output values in ascending order',
        ],
        correctIndex: 0,
        explanation: 'By moving backwards, `dp[w - weight]` is guaranteed to come from the previous iteration i-1, preserving the 0/1 (at most once) restriction.',
      },
      {
        id: 'qc_dp_2',
        question: 'What are the two core prerequisites an optimization problem must satisfy for Dynamic Programming to be applicable?',
        options: [
          'Overlapping Subproblems and Optimal Substructure',
          'Sorted Inputs and Binary Trees',
          'Greedy Choice and Non-Negative Weights',
          'Hash Maps and Linked Lists',
        ],
        correctIndex: 0,
        explanation: 'DP applies when an optimal solution can be built from optimal solutions of subproblems (Optimal Substructure), and those subproblems recur repeatedly (Overlapping Subproblems).',
      },
    ],
  },

  // =========================================================================
  // 13. OPERATING SYSTEMS: DEADLOCKS & COFFMAN CONDITIONS
  // =========================================================================
  {
    id: 'os-deadlocks',
    topic: 'Operating System Deadlocks & Coffman Conditions',
    subject: 'Operating Systems & Concurrency',
    keywords: ['deadlock', 'deadlocks', 'coffman conditions', 'banker algorithm', 'circular wait', 'mutual exclusion', 'hold and wait', 'resource allocation'],
    summary: 'A system state where a set of concurrent processes are permanently blocked because each process holds a resource and waits for another resource held by another process.',
    principles: [
      '**The 4 Coffman Conditions (Must all be simultaneously present for deadlock)**:',
      '1. **Mutual Exclusion**: At least one resource is held in a non-shareable mode.',
      '2. **Hold and Wait**: A process holds at least one resource and is waiting to acquire additional resources held by others.',
      '3. **No Preemption**: Resources cannot be forcibly confiscated; they are released only voluntarily.',
      '4. **Circular Wait**: A closed chain of processes exists where each waits for a resource held by the next member: P0 → P1 → P2 → P0.',
      '**Prevention Strategy**: Breaking ANY ONE of the four Coffman conditions guarantees deadlock is mathematically impossible.',
    ],
    codeOrDiagram: `// Deadlock Prevention via Global Lock Ordering (Breaking Circular Wait):
void transferMoney(Account from, Account to, double amount) {
  // Always acquire locks in strictly sorted primary key order:
  Account firstLock = from.id < to.id ? from : to;
  Account secondLock = from.id < to.id ? to : from;

  synchronized(firstLock) {
    synchronized(secondLock) {
      from.debit(amount);
      to.credit(amount);
    }
  }
}`,
    weakness: 'Assuming deadlocks can only occur in database SQL queries rather than operating system threads, mutexes, and distributed locks.',
    strength: 'Applying Global Resource Ordering to eliminate Circular Wait.',
    keyTakeaways: [
      'Break Circular Wait by ordering all locks globally.',
      'Bankers Algorithm provides Deadlock Avoidance by simulating safe states before allocating.',
    ],
    followUpPrompts: [
      'Show how Banker Algorithm determines if a state is Safe',
      'Explain how Lock Ordering prevents Dining Philosophers deadlock',
      'Deadlock Detection vs Prevention vs Avoidance tradeoffs',
    ],
    scenarios: {
      debugging: {
        commonError: 'Dining Philosophers / Inverted Lock Order Deadlock',
        rootCause: 'Thread 1 locks Resource A then requests B. Thread 2 concurrently locks Resource B then requests A. Both freeze forever.',
        badCodeSnippet: `// Thread 1:
acquire(lockA);
acquire(lockB);

// Thread 2:
acquire(lockB); // Deadlock!
acquire(lockA);`,
        fixedCodeSnippet: `// FIX: Strict Global Lock Hierarchy:
// Both threads MUST acquire in identical order (A then B):
// Thread 1:
acquire(lockA);
acquire(lockB);

// Thread 2:
acquire(lockA);
acquire(lockB);`,
        fixExplanation: 'Enforcing a universal total ordering on lock acquisition eliminates the Circular Wait condition.',
      },
    },
    quickCheck: [
      {
        id: 'qc_dl_1',
        question: 'Which software engineering technique is universally used in production to eliminate the "Circular Wait" Coffman condition?',
        options: [
          'Enforce a strict global hierarchy/ordering on all lock acquisitions (e.g. acquire in order of increasing resource ID)',
          'Increase CPU core count to allow infinite threads',
          'Disable multi-threading entirely across all services',
          'Randomize thread sleep times using Math.random()',
        ],
        correctIndex: 0,
        explanation: 'If all threads acquire locks in the same global sequence (e.g., ID 1 before ID 2), a circular dependency cycle can never form.',
      },
      {
        id: 'qc_dl_2',
        question: 'What is the key difference between Deadlock Prevention and Deadlock Avoidance?',
        options: [
          'Prevention eliminates at least one Coffman condition statically; Avoidance dynamically evaluates safe allocation states at runtime (e.g. Banker Algorithm)',
          'Prevention is for hardware; Avoidance is for software',
          'Avoidance reboots the operating system automatically',
          'There is no difference between them',
        ],
        correctIndex: 0,
        explanation: 'Prevention designs the system so deadlocks are mathematically impossible. Avoidance checks remaining resources dynamically to ensure system remains in a safe state before granting.',
      },
    ],
  },

  // =========================================================================
  // 14. OPERATING SYSTEMS: PROCESSES VS THREADS
  // =========================================================================
  {
    id: 'os-process-thread',
    topic: 'Processes vs Threads & Context Switching',
    subject: 'Operating Systems & Concurrency',
    keywords: ['process vs thread', 'threads', 'processes', 'context switch', 'pcb', 'tcb', 'virtual memory', 'ipc', 'shared memory'],
    summary: 'A Process is an executing instance of a program with its own isolated virtual address space. A Thread is the smallest unit of execution scheduled by the OS, sharing memory space within a process.',
    principles: [
      '**Memory Isolation**: Processes have independent virtual memory (Page Tables, Heap, Global Data, File Descriptors). A crash in one process does not kill another.',
      '**Thread Sharing**: Threads within the same process share Code, Data, and Heap, but each thread has its OWN Private Stack, Program Counter (PC), and Registers.',
      '**Context Switch Overhead**: Process context switches require flushing TLBs (Translation Lookaside Buffers) and swapping page directory pointers (expensive). Thread context switches stay within the same page table (fast).',
      '**Inter-Process Communication (IPC)**: Processes must communicate via Pipes, Sockets, or Shared Memory segments.',
    ],
    codeOrDiagram: `/* Memory Layout Comparison:
+-----------------------------------------------------------+
| PROCESS A (Isolated Virtual Address Space)                |
|  [ Code Segment ]  [ Data Segment ]  [ Shared Heap ]      |
|  -------------------------------------------------------  |
|  Thread 1: [ Stack 1 ] [ PC 1 ] [ Registers 1 ]           |
|  Thread 2: [ Stack 2 ] [ PC 2 ] [ Registers 2 ]           |
+-----------------------------------------------------------+
                     || (IPC / Sockets)
+-----------------------------------------------------------+
| PROCESS B (Isolated Virtual Address Space)                |
|  [ Code Segment ]  [ Data Segment ]  [ Shared Heap ]      |
|  Thread 3: [ Stack 3 ] [ PC 3 ] [ Registers 3 ]           |
+-----------------------------------------------------------+
*/`,
    weakness: 'Assuming threads share everything, forgetting that each thread must maintain its own private execution stack and registers.',
    strength: 'Understanding the memory architecture and TLB invalidation costs during context switching.',
    keyTakeaways: [
      'Processes = Isolation + Safety + Heavy Context Switch.',
      'Threads = Shared Memory + Speed + Risk of Race Conditions.',
      'Each thread maintains its own independent call stack and CPU register state.',
    ],
    followUpPrompts: [
      'Why does a process context switch cost more than a thread context switch (TLB flush)?',
      'Compare Multi-Process architecture (Chrome) vs Multi-Threaded architecture (Firefox)',
      'What happens in memory when `fork()` is called with Copy-On-Write (COW)?',
    ],
    scenarios: {
      comparison: {
        comparedTo: 'Process vs Thread',
        differences: [
          { aspect: 'Memory Space', optionA: 'Process: Separate, isolated virtual address space', optionB: 'Thread: Shares heap, global variables, and code with sibling threads' },
          { aspect: 'Crash Impact', optionA: 'Process: Isolated; segfault kills only that process', optionB: 'Thread: Shared; unhandled segfault terminates the entire host process' },
          { aspect: 'Communication', optionA: 'Process: Heavy IPC (Unix sockets, pipes, shared memory)', optionB: 'Thread: Direct memory access (requires synchronization / mutex)' },
        ],
        decisionRule: 'Use separate processes when security isolation and fault tolerance are critical (e.g. browser tabs). Use threads when sharing large in-memory data with low context switch latency.',
      },
    },
    quickCheck: [
      {
        id: 'qc_pt_1',
        question: 'Which of the following memory segments is PRIVATE to an individual thread and NOT shared with other threads in the same process?',
        options: [
          'The Execution Call Stack and CPU Registers',
          'The Dynamically Allocated Heap Memory',
          'Global and Static Variables',
          'Open File Descriptors',
        ],
        correctIndex: 0,
        explanation: 'Each thread needs its own stack to track function invocations, local variables, and return pointers, alongside its CPU Program Counter (PC). Heap and globals are shared.',
      },
      {
        id: 'qc_pt_2',
        question: 'Why does Chrome use a multi-process architecture for browser tabs instead of single-process multi-threading?',
        options: [
          'Process isolation ensures a crash or malicious script in one tab cannot crash or steal memory from other tabs',
          'Processes consume zero RAM',
          'Threads cannot render HTML',
          'Operating systems do not support threads for graphical applications',
        ],
        correctIndex: 0,
        explanation: 'If a tab segfaults or runs an infinite loop in a multi-process model, only that tab process dies without bringing down the entire browser.',
      },
    ],
  },

  // =========================================================================
  // 15. OPERATING SYSTEMS: MUTEX VS SEMAPHORES & RACE CONDITIONS
  // =========================================================================
  {
    id: 'os-concurrency-locks',
    topic: 'Mutex, Semaphores, Spinlocks & Race Conditions',
    subject: 'Operating Systems & Concurrency',
    keywords: ['mutex', 'semaphore', 'race condition', 'critical section', 'spinlock', 'counting semaphore', 'binary semaphore', 'atomic operations'],
    summary: 'Concurrency primitives that coordinate simultaneous thread access to shared memory resources, preventing race conditions and data corruption.',
    principles: [
      '**Race Condition**: Flaw where output is non-deterministic because multiple threads access and mutate shared data without synchronization.',
      '**Mutex (Mutual Exclusion)**: Ownership-based binary lock. ONLY the specific thread that acquired the mutex can release it.',
      '**Counting Semaphore**: Signaling mechanism maintaining an integer permit count. Any thread can signal (increment) or wait (decrement). Used to limit concurrent pool access (e.g. max 10 DB connections).',
      '**Spinlock**: Repeatedly polls in a tight loop (`while(test_and_set)`) instead of sleeping. Efficient ONLY for ultra-short lock holding times where context switch overhead exceeds spin time.',
    ],
    codeOrDiagram: `// Classic Mutex Critical Section in Go:
var (
    mu      sync.Mutex
    balance int
)

func Deposit(amount int) {
    mu.Lock()         // Acquire exclusive ownership
    defer mu.Unlock() // Guaranteed release
    balance += amount // Safe atomic update
}`,
    weakness: 'Confusing Mutex (ownership lock) with Binary Semaphore (signaling mechanism), or holding spinlocks while doing I/O.',
    strength: 'Recognizing when to use Reader-Writer locks (`RWMutex`) for read-heavy workloads.',
    keyTakeaways: [
      'Mutex: Has ownership; lock and unlock must occur on same thread.',
      'Semaphore: No ownership; thread A can wait while thread B signals.',
      'Spinlock: Busy-waits; never use during I/O or long tasks.',
    ],
    followUpPrompts: [
      'Why should you never sleep or perform I/O while holding a spinlock?',
      'How does compare-and-swap (CAS) enable lock-free data structures?',
      'Compare Mutex vs RWMutex throughput under 90% read loads',
    ],
    scenarios: {
      interview: {
        topQuestions: [
          'Can a thread release a Mutex that was locked by another thread?',
          'What is the Producer-Consumer problem and how do Semaphores solve it?',
          'Explain Priority Inversion and how Priority Inheritance resolves it.',
        ],
        interviewTrap: 'Interviewers often ask: "Is a Binary Semaphore identical to a Mutex?". NO! A Mutex has an owner concept (only owner unlocks). Semaphores are signaling flags (one thread waits, another signals).',
        modelAnswer: 'Mutexes provide serialization for critical sections with ownership checks. Counting semaphores throttle access to finite resource pools like connection pools.',
      },
    },
    quickCheck: [
      {
        id: 'qc_lock_1',
        question: 'Under what specific condition is a Spinlock superior to a standard Mutex?',
        options: [
          'When the lock is held for extremely short durations (a few CPU cycles) where context-switching overhead exceeds the cost of busy-waiting',
          'When the thread is reading from a slow hard drive or network socket',
          'On single-core single-CPU processors',
          'When memory is exhausted',
        ],
        correctIndex: 0,
        explanation: 'Context switching puts a thread to sleep and wakes another (hundreds of CPU cycles). If the critical section takes 5 cycles, spinning is vastly faster.',
      },
      {
        id: 'qc_lock_2',
        question: 'What is a Race Condition in concurrent programming?',
        options: [
          'A bug where program correctness depends on the unpredictable interleaving or timing of concurrent threads accessing shared memory',
          'A benchmark competition between two algorithms',
          'When CPU fan speeds increase under load',
          'When two threads access independent non-shared variables',
        ],
        correctIndex: 0,
        explanation: 'Race conditions occur when multiple concurrent operations read/write shared data without synchronization, causing non-deterministic data corruption.',
      },
    ],
  },

  // =========================================================================
  // 16. COMPUTER NETWORKS: TCP VS UDP & 3-WAY HANDSHAKE
  // =========================================================================
  {
    id: 'cn-tcp-udp',
    topic: 'TCP vs UDP & The 3-Way Handshake',
    subject: 'Computer Networks',
    keywords: ['tcp vs udp', 'tcp', 'udp', 'three way handshake', 'syn ack', 'reliable transmission', 'congestion control', 'flow control'],
    summary: 'Transport layer protocols responsible for host-to-host end-to-end communication across the internet.',
    principles: [
      '**TCP (Transmission Control Protocol)**: Connection-oriented, guaranteed in-order packet delivery, error-checking, flow control (sliding window), and congestion control.',
      '**The 3-Way Handshake**: 1. Client sends `SYN` → 2. Server responds `SYN-ACK` → 3. Client sends `ACK`. Connection established.',
      '**UDP (User Datagram Protocol)**: Connectionless, lightweight, "fire-and-forget", zero handshake, no retransmissions, minimal 8-byte header overhead.',
      '**TCP 4-Way Teardown**: FIN → ACK → FIN → ACK with a `TIME_WAIT` period (typically 2 * MSL) to ensure lingering duplicate segments drain.',
    ],
    codeOrDiagram: `/* TCP 3-WAY HANDSHAKE FLOW:
Client                               Server
  |                                     |
  | -------- 1. SYN (seq=x) ----------> | (LISTEN -> SYN_RCVD)
  |                                     |
  | <--- 2. SYN-ACK (seq=y, ack=x+1) -- |
  |                                     |
  | -------- 3. ACK (ack=y+1) --------> | (ESTABLISHED)
  |                                     |
  V                                     V
*/`,
    weakness: 'Assuming UDP is "bad" because it loses packets, ignoring its critical necessity in video conferencing, real-time gaming, and DNS.',
    strength: 'Understanding sliding window flow control and congestion window backoff (AIMD).',
    keyTakeaways: [
      'TCP: Reliability, order guarantee, congestion control, heavier latency.',
      'UDP: Low latency, low overhead, no packet retransmission, ideal for real-time streams.',
    ],
    followUpPrompts: [
      'Why does TCP teardown require a TIME_WAIT state of 2*MSL?',
      'How does HTTP/3 build on UDP using QUIC to fix TCP Head-of-Line blocking?',
      'Top interview questions on TCP Congestion Control (Slow Start, Fast Retransmit)',
    ],
    scenarios: {
      comparison: {
        comparedTo: 'TCP vs UDP',
        differences: [
          { aspect: 'Connection State', optionA: 'TCP: Connection-oriented (3-Way Handshake before data)', optionB: 'UDP: Connectionless (immediate datagram broadcast)' },
          { aspect: 'Reliability & Order', optionA: 'TCP: Guarantees delivery via ACKs and retransmissions in exact sequence', optionB: 'UDP: Best-effort; packets may drop, duplicate, or arrive out of order' },
          { aspect: 'Header Size', optionA: 'TCP: 20–60 bytes (sequence numbers, flags, checksum, window size)', optionB: 'UDP: 8 bytes fixed (Source, Dest, Length, Checksum)' },
        ],
        decisionRule: 'Use TCP when data accuracy is non-negotiable (Websites, File transfers, Payments, Email). Use UDP when fresh data is valued over old data and latency is king (VoIP, Gaming, Video streaming).',
      },
    },
    quickCheck: [
      {
        id: 'qc_net_1',
        question: 'Why does online multiplayer gaming prefer UDP over TCP for player coordinate updates?',
        options: [
          'Because if a packet is lost, retransmitting old player coordinates in TCP introduces lag; players only care about the freshest position',
          'Because TCP cannot send numbers over the internet',
          'Because UDP encrypts gaming packets automatically',
          'Because TCP only operates on wired Ethernet cables',
        ],
        correctIndex: 0,
        explanation: 'In fast-paced games, a retransmitted position from 200ms ago is useless. Dropping the packet and rendering the next fresh frame prevents lag spikes.',
      },
      {
        id: 'qc_net_2',
        question: 'What is the exact purpose of the TIME_WAIT state during TCP connection termination?',
        options: [
          'To ensure the final ACK was received by the remote host and allow lingering delayed packets in the network to expire',
          'To download server security updates',
          'To keep the CPU busy while idling',
          'To restart the router hardware',
        ],
        correctIndex: 0,
        explanation: 'TIME_WAIT prevents delayed duplicate packets from an old connection being misdelivered and corrupting a newly opened connection on the same port.',
      },
    ],
  },

  // =========================================================================
  // 17. COMPUTER NETWORKS: DNS RESOLUTION FLOW
  // =========================================================================
  {
    id: 'cn-dns-resolution',
    topic: 'DNS Resolution Flow (Root, TLD, Authoritative)',
    subject: 'Computer Networks',
    keywords: ['dns', 'dns resolution', 'domain name system', 'root server', 'tld server', 'authoritative nameserver', 'recursive resolver'],
    summary: 'The hierarchical distributed naming system that translates human-readable domain names (e.g., `metamind.ai`) into numerical machine IP addresses (e.g., `76.76.21.21`).',
    principles: [
      '**1. Local Caches**: Browser Cache → OS DNS Cache → Router Cache.',
      '**2. Recursive Resolver (ISP / 8.8.8.8)**: Acts on behalf of the client to query hierarchical servers iteratively.',
      '**3. Root Nameserver (`.`))**: Directs the resolver to the appropriate Top-Level Domain (TLD) server (13 logical root server identities worldwide).',
      '**4. TLD Nameserver (`.ai` / `.com`)**: Directs the resolver to the domain authoritative nameserver.',
      '**5. Authoritative Nameserver**: Holds the authoritative DNS records (A, AAAA, CNAME) and returns the final IP address.',
    ],
    codeOrDiagram: `/* DNS LOOKUP HIERARCHY:
Browser -> Recursive Resolver (8.8.8.8)
                 |
                 +---> 1. Root Server (.) -> "Ask .ai TLD server"
                 |
                 +---> 2. TLD Server (.ai) -> "Ask Cloudflare NS"
                 |
                 +---> 3. Authoritative NS -> "metamind.ai = 76.76.21.21"
                 |
Browser <--------+ Final IP returned (Cached with TTL)
*/`,
    weakness: 'Confusing Recursive DNS queries (resolver does the work) with Iterative DNS queries (server replies with next referral).',
    strength: 'Understanding DNS records (A, AAAA, CNAME, MX, TXT) and Anycast routing.',
    keyTakeaways: [
      'Recursive query: "Give me the answer".',
      'Iterative query: "I dont know, ask this other server instead".',
      'DNS uses UDP port 53 for speed, falling back to TCP for large zone transfers.',
    ],
    followUpPrompts: [
      'Explain what happens when you type a URL into a browser address bar and hit enter',
      'Difference between CNAME and A records',
      'How does DNS Anycast routing handle millions of requests without DDOS collapse?',
    ],
    scenarios: {
      interview: {
        topQuestions: [
          'What happens when you type google.com in the browser and press Enter?',
          'Why does DNS use UDP port 53 by default?',
          'What is DNS propagation delay and how does TTL control it?',
        ],
        interviewTrap: 'Candidates often say DNS only uses UDP. Interviewers will check: when DNS responses exceed 512 bytes (DNSSEC) or during zone transfers, DNS automatically switches to TCP!',
        modelAnswer: 'DNS resolution traverses: Browser Cache -> OS Cache -> Recursive Resolver -> Root Nameserver -> TLD Server -> Authoritative Nameserver. Responses are cached according to their TTL.',
      },
    },
    quickCheck: [
      {
        id: 'qc_dns_1',
        question: 'Which nameserver holds the actual, final A/AAAA IP address mapping for a specific domain name like `metamind.ai`?',
        options: [
          'The Authoritative Nameserver for the domain',
          'The Root Nameserver',
          'The TLD (.ai) Nameserver',
          'The local Wi-Fi router',
        ],
        correctIndex: 0,
        explanation: 'Root and TLD servers only provide referrals. The Authoritative Nameserver (e.g. configured at your registrar/Cloudflare) stores the definitive A record.',
      },
      {
        id: 'qc_dns_2',
        question: 'What happens if a domain administrator updates an A record, but users around the world still reach the old server IP for hours?',
        options: [
          'Intermediate Recursive Resolvers and browser caches continue serving the old IP until the record TTL (Time To Live) expires',
          'The internet router cables take 24 hours to charge electricity',
          'The Root servers reject new domain names',
          'DNS only updates on Sundays',
        ],
        correctIndex: 0,
        explanation: 'DNS responses are cached throughout the global resolver hierarchy. Changes only propagate after the previous TTL window countdown reaches zero.',
      },
    ],
  },

  // =========================================================================
  // 18. COMPUTER NETWORKS: HTTP/1.1 VS HTTP/2 VS HTTP/3
  // =========================================================================
  {
    id: 'cn-http-evolution',
    topic: 'HTTP Evolution (HTTP/1.1 vs HTTP/2 vs HTTP/3 QUIC)',
    subject: 'Computer Networks & Web Architecture',
    keywords: ['http', 'http/1.1', 'http/2', 'http/3', 'quic', 'head of line blocking', 'multiplexing', 'hpack', 'streams'],
    summary: 'The historical evolution of the Hypertext Transfer Protocol from sequential single-request connections to multiplexed binary frames and UDP-based QUIC.',
    principles: [
      '**HTTP/1.1**: Text-based, keep-alive connections. Suffers from **Application Head-of-Line (HoL) Blocking** (requests in a pipeline must wait for the preceding response to finish).',
      '**HTTP/2**: Binary framing layer. Introduces **Multiplexing** over a single TCP connection (multiple requests/responses interleaved on concurrent streams). HPACK header compression.',
      '**The HTTP/2 Flaw (TCP HoL Blocking)**: If a single TCP packet drops on the wire, the entire TCP connection freezes while retransmitting, delaying ALL multiplexed streams.',
      '**HTTP/3**: Replaces TCP with **QUIC over UDP**. Solves TCP Head-of-Line blocking completely (dropped packets affect only their own individual stream). Zero-RTT connection resumption.',
    ],
    codeOrDiagram: `/* PROTOCOL COMPARISON:
HTTP/1.1: [ TCP ] -> 1 request at a time per socket (6 parallel limit)
HTTP/2:   [ TCP ] -> Multiplexed streams in 1 socket (TCP packet drop halts ALL)
HTTP/3:   [ UDP + QUIC ] -> Independent multiplexed streams (0 HoL blocking)
*/`,
    weakness: 'Believing HTTP/2 completely solved Head-of-Line blocking, unaware that TCP-level packet loss creates transport HoL blocking.',
    strength: 'Deep understanding of transport protocols, TLS 1.3 0-RTT handshakes, and binary framing.',
    keyTakeaways: [
      'HTTP/1.1: Text, 6 TCP connections per domain, HoL blocking.',
      'HTTP/2: Binary, 1 TCP connection, multiplexed streams, HPACK.',
      'HTTP/3: UDP + QUIC, independent streams, 0-RTT reconnection on mobile IP changes.',
    ],
    followUpPrompts: [
      'Explain how QUIC handles IP changes (Wi-Fi to LTE) without dropping calls',
      'How does HTTP/2 Server Push work and why was it deprecated?',
      'Compare TCP TLS 1.3 handshake with QUIC 0-RTT',
    ],
    scenarios: {
      comparison: {
        comparedTo: 'HTTP/2 vs HTTP/3',
        differences: [
          { aspect: 'Transport Layer', optionA: 'HTTP/2: Operates over TCP + TLS', optionB: 'HTTP/3: Operates over UDP with native embedded QUIC' },
          { aspect: 'Head-of-Line Blocking', optionA: 'HTTP/2: TCP packet drop blocks ALL parallel streams on that connection', optionB: 'HTTP/3: Packet drop impacts ONLY the specific stream that lost data' },
          { aspect: 'Connection Migration', optionA: 'HTTP/2: Switching Wi-Fi to 5G breaks socket (requires full reconnect)', optionB: 'HTTP/3: Connection ID migration maintains session smoothly across networks' },
        ],
        decisionRule: 'Adopt HTTP/3 for mobile, high-latency, and lossy cellular environments where TCP packet drops cause catastrophic streaming stutters.',
      },
    },
    quickCheck: [
      {
        id: 'qc_http_1',
        question: 'What major bottleneck in HTTP/2 was the primary motivation for creating HTTP/3 over QUIC/UDP?',
        options: [
          'TCP-level Head-of-Line blocking: when a single TCP packet drops, the entire TCP connection stalls all streams until retransmitted',
          'HTTP/2 could not send images',
          'HTTP/2 required passwords for every request',
          'HTTP/2 headers were uncompressed',
        ],
        correctIndex: 0,
        explanation: 'Because HTTP/2 funnels all streams through ONE single TCP socket, a single dropped TCP segment forces the OS TCP stack to pause delivery for all other concurrent streams.',
      },
      {
        id: 'qc_http_2',
        question: 'How does HTTP/3 handle seamless connection continuity when a smartphone switches from home Wi-Fi to cellular 5G?',
        options: [
          'By identifying connections with a 64-bit Connection ID independent of client IP/Port, allowing session migration without reconnecting',
          'By keeping both Wi-Fi and 5G connected forever',
          'By restarting the browser app',
          'By converting HTTP into SMS messages',
        ],
        correctIndex: 0,
        explanation: 'TCP connections are bound to a 4-tuple (src IP, src Port, dest IP, dest Port). When IP changes, TCP breaks. QUIC uses persistent Connection IDs, enabling seamless roaming.',
      },
    ],
  },

  // =========================================================================
  // 19. FRONTEND & FULLSTACK: REACT STATE & IMMUTABILITY
  // =========================================================================
  {
    id: 'react-state',
    topic: 'React State Immutability, Hooks & Component Lifecycle',
    subject: 'Web & Frontend Engineering',
    keywords: ['react', 'react state', 'immutability', 'usestate', 'useeffect', 'rerender', 'hooks', 'closure stale state'],
    summary: 'Core principles of React declarative UI: components are pure projections of state and props. Direct mutation breaks shallow equality diffing and halts UI re-rendering.',
    principles: [
      '**Shallow Reference Comparison (`Object.is`)**: React triggers a re-render ONLY if `new_state !== prev_state`. Mutating an existing object in place retains the same memory reference, so React skips re-rendering!',
      '**Functional Updates**: When new state depends on previous state, always use `setCount(prev => prev + 1)` to avoid asynchronous batching race conditions.',
      '**Stale Closures**: Hooks like `useEffect` or `useCallback` capture state variables in their lexical closure at creation time; omitting dependencies causes them to read frozen historical values.',
    ],
    codeOrDiagram: `// CORRECT Immutability update pattern:
// 1. Updating Array:
setItems(prev => [...prev, newItem]);

// 2. Updating Nested Object:
setUser(prev => ({
  ...prev,
  preferences: {
    ...prev.preferences,
    theme: 'dark'
  }
}));`,
    weakness: 'Directly mutating objects/arrays (e.g. `items.push(x); setItems(items);`) and wondering why the UI does not re-render.',
    strength: 'Mastery of shallow immutability and functional state transitions.',
    keyTakeaways: [
      'Never mutate state directly; always create a fresh object/array copy.',
      'Use functional setter `setVal(prev => ...)` when updating based on existing state.',
      'Always list all reactive dependencies in useEffect arrays.',
    ],
    followUpPrompts: [
      'Show me a classic Stale Closure bug in useEffect and how to fix it',
      'Explain React 18 automatic batching and startTransition',
      'Compare useMemo vs useCallback with performance benchmarks',
    ],
    scenarios: {
      debugging: {
        commonError: 'Direct State Mutation Bypassing Re-Render',
        rootCause: 'Mutating an array with `.push()` preserves the original memory reference pointer. React compares `prevRef === newRef` and concludes no change occurred.',
        badCodeSnippet: `// BUG: UI will NOT update!
const [list, setList] = useState(['Apple', 'Banana']);
const addItem = () => {
  list.push('Cherry'); // Direct in-place mutation!
  setList(list);       // Same memory pointer -> React skips re-render!
};`,
        fixedCodeSnippet: `// FIX: Spread into a fresh array reference:
const addItem = () => {
  setList(prev => [...prev, 'Cherry']); // New array memory reference created!
};`,
        fixExplanation: 'Creating a new array instance gives React a new pointer address, passing `Object.is` check and scheduling a re-render.',
      },
    },
    quickCheck: [
      {
        id: 'qc_react_1',
        question: 'Why does calling `items.push("New"); setItems(items);` in React fail to trigger a component re-render?',
        options: [
          'Because React checks `Object.is(prevState, newState)`; since the array memory reference did not change, React concludes state is identical and bails out',
          'Because the push method is deleted by React compiler',
          'Because React only supports strings, not arrays',
          'Because useState can only be called once in a component',
        ],
        correctIndex: 0,
        explanation: 'React relies on shallow reference equality. Mutating in-place preserves the memory address, so React considers the state unchanged and optimizes away the re-render.',
      },
      {
        id: 'qc_react_2',
        question: 'If you execute `setCount(count + 1)` three times synchronously inside an event handler, what is the net increment?',
        options: [
          'Count increases by only 1, because React batches updates and all three calls capture the same initial count value in their closure',
          'Count increases by 3',
          'Count doubles',
          'React crashes with infinite loop',
        ],
        correctIndex: 0,
        explanation: 'Due to batching and closure capture, all three evaluate `setCount(0 + 1)`. To increment by 3, you must use functional updates: `setCount(c => c + 1)`.',
      },
    ],
  },

  // =========================================================================
  // 20. FRONTEND & FULLSTACK: JAVASCRIPT EVENT LOOP
  // =========================================================================
  {
    id: 'web-event-loop',
    topic: 'JavaScript Event Loop (Call Stack, Microtasks, Macrotasks)',
    subject: 'Web & Fullstack Engineering',
    keywords: ['event loop', 'microtasks', 'macrotasks', 'call stack', 'promises', 'settimeout', 'async await', 'process.nexttick'],
    summary: 'The concurrency model behind single-threaded JavaScript engines that enables non-blocking asynchronous execution via the Call Stack, Microtask Queue, and Macrotask Queue.',
    principles: [
      '**Single-Threaded Call Stack**: JS executes one instruction at a time. Long-running synchronous loops block the entire UI thread.',
      '**Microtasks (High Priority)**: `Promise.then`, `catch`, `finally`, `queueMicrotask`, `process.nextTick`. The microtask queue is **drained completely** before any macrotask runs.',
      '**Macrotasks (Low Priority)**: `setTimeout`, `setInterval`, `setImmediate`, I/O events. Exactly one macrotask runs per event loop tick, followed immediately by draining all microtasks.',
      '**Render Phase**: Browser UI paint occurs after microtasks drain, before the next macrotask executes.',
    ],
    codeOrDiagram: `// Classic Event Loop Execution Order Drill:
console.log('1: Sync');

setTimeout(() => {
  console.log('2: Macrotask (setTimeout)');
}, 0);

Promise.resolve().then(() => {
  console.log('3: Microtask (Promise)');
});

console.log('4: Sync');

// OUTPUT ORDER:
// 1: Sync
// 4: Sync
// 3: Microtask (Promise)
// 2: Macrotask (setTimeout)`,
    weakness: 'Assuming `setTimeout(fn, 0)` executes immediately, unaware that pending microtasks and synchronous code always run first.',
    strength: 'Predicting asynchronous execution sequences and preventing main thread UI freezes.',
    keyTakeaways: [
      'Execution hierarchy: Synchronous Code -> Microtask Queue (all) -> Render -> Macrotask Queue (one).',
      'Promises are Microtasks; setTimeout is a Macrotask.',
    ],
    followUpPrompts: [
      'What happens if a microtask recursively spawns more microtasks (Microtask Starvation)?',
      'Explain how `requestAnimationFrame` fits into the event loop rendering step',
      'Test me on complex async/await output prediction questions',
    ],
    scenarios: {
      interview: {
        topQuestions: [
          'What is the difference between Microtasks and Macrotasks?',
          'What happens if a microtask enqueues another microtask indefinitely?',
          'Why is `setTimeout(fn, 0)` not guaranteed to execute after 0 milliseconds?',
        ],
        interviewTrap: 'Interviewers will ask: "What happens if a microtask recursively enqueues another microtask?". The event loop will never leave the microtask queue! The browser freezes, blocking UI render and setTimeout completely.',
        modelAnswer: 'JavaScript executes synchronous stack code, then empties the entire microtask queue (Promises). Only then does it allow UI painting and the execution of the next macrotask (setTimeout).',
      },
    },
    quickCheck: [
      {
        id: 'qc_el_1',
        question: 'In what order will this execute: `console.log(1); setTimeout(() => console.log(2), 0); Promise.resolve().then(() => console.log(3)); console.log(4);`?',
        options: [
          '1, 4, 3, 2 (Synchronous first, all Microtasks second, Macrotasks last)',
          '1, 2, 3, 4',
          '1, 3, 4, 2',
          '2, 3, 1, 4',
        ],
        correctIndex: 0,
        explanation: 'Synchronous statements print 1 and 4. Before picking the next macrotask (setTimeout 2), the engine drains all microtasks, printing 3. Finally, setTimeout prints 2.',
      },
      {
        id: 'qc_el_2',
        question: 'Why does generating an infinite recursive microtask loop (`function loop() { Promise.resolve().then(loop); }`) freeze the browser, while `setTimeout(loop, 0)` does not?',
        options: [
          'Because the engine refuses to run macrotasks or render UI until the microtask queue is 100% empty, starving the thread',
          'Because Promises use more RAM than setTimeout',
          'Because setTimeout is handled by a separate multi-core GPU',
          'Because browsers disable Promises after 100 calls',
        ],
        correctIndex: 0,
        explanation: 'The event loop contract stipulates that ALL microtasks in the queue must be cleared before moving to the next macrotask or browser layout/paint.',
      },
    ],
  },

  // =========================================================================
  // 21. FRONTEND & FULLSTACK: REST VS GRAPHQL
  // =========================================================================
  {
    id: 'web-rest-graphql',
    topic: 'RESTful APIs vs GraphQL (Over-fetching & Schema Contracts)',
    subject: 'Web & API Architecture',
    keywords: ['rest vs graphql', 'graphql', 'rest api', 'over-fetching', 'under-fetching', 'n+1 problem', 'resolvers', 'apollo', 'schema'],
    summary: 'Contrasting endpoint-oriented REST architectures (multiple HTTP verbs and static URLs) with declarative GraphQL query languages (single POST endpoint with client-specified field selection).',
    principles: [
      '**Over-fetching**: REST endpoints return fixed payloads containing dozens of unnecessary fields for mobile clients.',
      '**Under-fetching (N+1 HTTP calls)**: Fetching user details, followed by N separate calls to fetch their posts, then N calls for comments. GraphQL fetches the entire graph in 1 request.',
      '**The GraphQL Server N+1 Trap**: Client saves network roundtrips, but naive backend database resolvers execute N+1 SQL queries without **DataLoader** batching.',
      '**Caching**: REST leverages standard HTTP caching (304 Not Modified, CDNs, Varnish). GraphQL queries use HTTP POST, requiring application-level normalized client caches.',
    ],
    codeOrDiagram: `# Client requests ONLY specific fields needed for UI (Zero Over-fetching):
query GetUserProfile {
  user(id: "usr_42") {
    name
    avatarUrl
    enrolledCourses(limit: 3) {
      title
      progressPercent
    }
  }
}`,
    weakness: 'Ignoring the backend database N+1 problem introduced by naive GraphQL resolvers, or assuming GraphQL replaces SQL.',
    strength: 'Mastery of DataLoader batching and client-driven field projection.',
    keyTakeaways: [
      'Use REST when HTTP caching, simplicity, and uniform resource endpoints dominate.',
      'Use GraphQL when mobile clients require tailored data projections and aggregations across diverse microservices in 1 roundtrip.',
    ],
    followUpPrompts: [
      'How does Dataloader solve the GraphQL N+1 problem with batching and caching?',
      'Why is HTTP CDN caching much harder with GraphQL than REST?',
      'Compare GraphQL Subscriptions vs WebSockets for realtime updates',
    ],
    scenarios: {
      comparison: {
        comparedTo: 'REST vs GraphQL',
        differences: [
          { aspect: 'Data Fetching', optionA: 'REST: Fixed payload determined by backend endpoint', optionB: 'GraphQL: Client requests exact fields needed' },
          { aspect: 'Network Roundtrips', optionA: 'REST: Multiple roundtrips across endpoints (Under-fetching)', optionB: 'GraphQL: Single network request fetches nested relational graph' },
          { aspect: 'Caching Simplicity', optionA: 'REST: Native HTTP caching (ETags, Max-Age, CDN Edge)', optionB: 'GraphQL: Complex; uses POST requests requiring normalized client-side caches' },
        ],
        decisionRule: 'Choose REST for public APIs and write-heavy microservices with high CDN cacheability. Choose GraphQL for complex frontends querying multiple backend services simultaneously.',
      },
    },
    quickCheck: [
      {
        id: 'qc_gql_1',
        question: 'What is the "N+1 Problem" when executing queries in a naive GraphQL backend server?',
        options: [
          'The server executes 1 SQL query for the parent list, and then N separate SQL queries for each child record in a loop instead of batching',
          'The client makes N+1 HTTP POST requests to the server',
          'GraphQL databases can only store N+1 records',
          'Queries must have N+1 arguments to validate',
        ],
        correctIndex: 0,
        explanation: 'If 100 users are fetched and each resolver executes `SELECT * FROM posts WHERE user_id = ?`, it produces 1 + 100 = 101 database queries. DataLoader solves this by batching into an `IN (...)` query.',
      },
      {
        id: 'qc_gql_2',
        question: 'Why is edge CDN caching (e.g. Cloudflare) substantially more complex for GraphQL than for standard REST APIs?',
        options: [
          'Because GraphQL queries typically use HTTP POST requests targeting a single endpoint `/graphql`, preventing standard URL-based GET caching',
          'Because GraphQL responses cannot be formatted as JSON',
          'Because CDNs do not support HTTPS',
          'Because GraphQL queries are encrypted with proprietary keys',
        ],
        correctIndex: 0,
        explanation: 'REST routes like `GET /api/users/42` are uniquely identifiable URLs easily cached at the edge. GraphQL uses POST with arbitrary JSON query bodies, requiring customized hashed query caching.',
      },
    ],
  },

  // =========================================================================
  // 22. FRONTEND & FULLSTACK: JWT VS SESSION COOKIES
  // =========================================================================
  {
    id: 'web-auth-jwt',
    topic: 'JWT vs Session Cookies (Stateless vs Stateful, XSS & CSRF)',
    subject: 'Web Security & Authentication',
    keywords: ['jwt', 'session', 'cookies', 'authentication', 'xss', 'csrf', 'refresh token', 'stateless', 'token revocation'],
    summary: 'Architectural evaluation of stateful session IDs (stored in database/Redis with server-side revocation) versus self-contained cryptographically signed JWTs (stateless token verification).',
    principles: [
      '**Stateful Sessions**: Server generates a cryptographically random session ID, stores session state in Redis/DB, and sends ID via `HttpOnly; Secure; SameSite=Strict` cookie. Instant server-side revocation.',
      '**Stateless JWT (JSON Web Token)**: Contains Base64URL-encoded Header, Payload, and Signature (`HMAC-SHA256` or `RSA`). Verified statelessly without DB lookup.',
      '**The JWT Revocation Dilemma**: Once issued, a JWT is valid until expiration! Revoking a stolen JWT before expiry requires implementing a blacklist in Redis, which destroys its "stateless" advantage.',
      '**Security Storage**: Storing tokens in `localStorage` exposes them to theft via Cross-Site Scripting (XSS). Storing in `HttpOnly` cookies shields against XSS, but requires CSRF protection.',
    ],
    codeOrDiagram: `// Decoded JWT Structure (Header.Payload.Signature):
// HEADER:
{ "alg": "HS256", "typ": "JWT" }

// PAYLOAD (Claims):
{
  "sub": "usr_992",
  "name": "Alex Mercer",
  "role": "admin",
  "exp": 1789395000 // Expiration Timestamp
}

// SIGNATURE:
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  secret_key
)`,
    weakness: 'Storing sensitive authentication JWTs in browser `localStorage`, making them vulnerable to single-line XSS script theft.',
    strength: 'Implementing short-lived Access Tokens (15m) paired with rotating HttpOnly Refresh Tokens.',
    keyTakeaways: [
      'Never store access tokens in `localStorage` if XSS is possible; use `HttpOnly` cookies.',
      'JWTs cannot be revoked immediately without a server-side blacklist.',
      'Always keep JWT expiration times very short (e.g., 5–15 minutes).',
    ],
    followUpPrompts: [
      'How does Refresh Token Rotation detect token theft and revoke sessions?',
      'Compare XSS vs CSRF attacks and their respective defense mechanisms',
      'How does asymmetric RSA/ECDSA signing work for microservice auth?',
    ],
    scenarios: {
      interview: {
        topQuestions: [
          'How do you immediately log out a user if their JWT is stateless and valid for 1 hour?',
          'Why should you not store JWT tokens in localStorage?',
          'What is the difference between XSS and CSRF?',
        ],
        interviewTrap: 'Candidates often say: "JWT is better because it is stateless so we dont need Redis". Interviewers will immediately ask: "A user is banned for fraud. How do you revoke their access right now?". Silence or backpedaling follows!',
        modelAnswer: 'JWTs offer stateless horizontal verification across microservices. However, immediate revocation requires either maintaining a distributed Redis blocklist or using short-lived tokens (5-15 mins) with rotating refresh tokens stored in HttpOnly cookies.',
      },
    },
    quickCheck: [
      {
        id: 'qc_jwt_1',
        question: 'What is the primary security vulnerability when storing authentication JWT tokens in browser `localStorage`?',
        options: [
          'Any malicious JavaScript injected via Cross-Site Scripting (XSS) can access `window.localStorage` and exfiltrate the token to an attacker',
          'localStorage is cleared every 5 seconds by the browser',
          'localStorage only holds 10 characters',
          'localStorage encrypts data with public keys',
        ],
        correctIndex: 0,
        explanation: 'JavaScript has full access to `localStorage`. If an attacker injects a malicious script via XSS, they can steal the token. `HttpOnly` cookies cannot be accessed by JavaScript.',
      },
      {
        id: 'qc_jwt_2',
        question: 'Why is it difficult to immediately revoke a stateless JWT before its natural expiration timestamp?',
        options: [
          'Because any backend server holding the public key verifies the signature cryptographically without querying a central database',
          'Because JWTs cannot be read by backend servers',
          'Because JWTs are stored in the DNS system',
          'Because the client computer controls token expiration',
        ],
        correctIndex: 0,
        explanation: 'The defining trait of stateless JWTs is that servers verify signatures mathematically without database lookups. Revoking them requires checking a stateful blacklist, defeating the stateless design.',
      },
    ],
  },

  // =========================================================================
  // 23. SYSTEM DESIGN: MICROSERVICES VS MONOLITH
  // =========================================================================
  {
    id: 'sd-microservices',
    topic: 'Microservices vs Monolithic Architecture (The Saga Pattern)',
    subject: 'System Design & Distributed Scalability',
    keywords: ['microservices', 'monolith', 'system design', 'saga pattern', 'two phase commit', 'distributed transactions', 'api gateway', 'service mesh'],
    summary: 'Contrasting unified single-codebase architectures with distributed decoupled microservice networks communicating via network APIs or event streaming brokers.',
    principles: [
      '**Monolith**: Single codebase, unified deployment, in-process function calls, shared database with ACID transactions. Fast to develop, simple to test and deploy initially.',
      '**Microservices**: Autonomous loosely-coupled services organized around business domains. Enables independent scaling, heterogeneous technology stacks, and autonomous developer teams.',
      '**The Distributed Cost**: Network latency, partial failure modes, complex distributed observability (OpenTelemetry), and loss of ACID multi-table transactions.',
      '**The Saga Pattern**: Manages distributed transactions across microservices via a sequence of local transactions coordinated via choreographing events or an orchestrator with compensating rollback actions.',
    ],
    codeOrDiagram: `/* SAGA ORCHESTRATION WORKFLOW:
[ Order Service ] -> 1. Create Order (Pending)
       |
       v (Command)
[ Payment Service ] -> 2. Process Credit Card
       |
       +--> SUCCESS: [ Inventory Service ] -> 3. Reserve Stock -> Order COMPLETE
       |
       +--> FAILED: [ Order Service ] -> Compensating Action: CANCEL Order
*/`,
    weakness: 'Adopting microservices too early for small teams, resulting in distributed system overhead without organizational benefits.',
    strength: 'Mastery of distributed transaction patterns (Saga, Event Sourcing, Outbox Pattern).',
    keyTakeaways: [
      'Start with a modular monolith; migrate to microservices only when organizational scale demands it.',
      'Never share a single database across microservices (breaks autonomy).',
      'Use the Saga Pattern with compensating transactions instead of 2PC (Two-Phase Commit).',
    ],
    followUpPrompts: [
      'How does the Transactional Outbox Pattern prevent lost messages in microservices?',
      'Compare Saga Orchestration vs Saga Choreography',
      'What are the latency bottlenecks of an API Gateway and Service Mesh?',
    ],
    scenarios: {
      systemDesign: {
        architecturePattern: 'Event-Driven Microservices with Saga Orchestration',
        tradeoffs: 'High deployment autonomy and independent scaling at the expense of distributed complexity, eventual consistency, and complex tracing.',
        bottlenecksAndScaling: 'Database connections per service, network hops between services, and asynchronous event bus (Kafka) throughput.',
      },
      interview: {
        topQuestions: [
          'How do you maintain data consistency across microservices without distributed 2PC locking?',
          'What is the Transactional Outbox Pattern?',
          'When would you recommend a team transition from a Monolith to Microservices?',
        ],
        interviewTrap: 'Candidates often say: "Microservices make your app faster". Top interviewers will push back: microservices introduce network latency and serialization overhead. They scale TEAMS and independently scalable components, not single request speed!',
        modelAnswer: 'Microservices address organizational scale (Conways Law) and allow independent deployment pipelines. Distributed consistency is managed via Sagas with compensating transactions.',
      },
    },
    quickCheck: [
      {
        id: 'qc_ms_1',
        question: 'Why is the Two-Phase Commit (2PC) protocol rarely used in high-scale distributed microservices?',
        options: [
          'Because 2PC is a blocking protocol: if the coordinator or any participating node stalls, all locks remain held indefinitely, collapsing system throughput',
          'Because 2PC only works on single computers',
          'Because 2PC requires physical paper signatures',
          'Because 2PC is incompatible with JSON',
        ],
        correctIndex: 0,
        explanation: '2PC holds locks across all participating nodes during the prepare and commit phases. In high-throughput distributed architectures, node latency or failure cascades locks across the entire cluster.',
      },
      {
        id: 'qc_ms_2',
        question: 'What is a "Compensating Transaction" in the Saga Pattern?',
        options: [
          'An explicit undo operation executed to semantically reverse a previously committed local transaction when a subsequent step in the workflow fails',
          'A bonus payment paid to cloud providers for high traffic',
          'A retry loop that executes indefinitely until success',
          'An automatic system restart',
        ],
        correctIndex: 0,
        explanation: 'If a step (e.g. reserving inventory) fails in a Saga, the orchestrator triggers compensating transactions (e.g. refunding the credit card) to reverse earlier actions.',
      },
    ],
  },

  // =========================================================================
  // 24. SYSTEM DESIGN: CAP THEOREM & PACELC
  // =========================================================================
  {
    id: 'sd-cap-theorem',
    topic: 'CAP Theorem & PACELC Trade-offs',
    subject: 'System Design & Distributed Scalability',
    keywords: ['cap theorem', 'pacelc', 'consistency', 'availability', 'partition tolerance', 'eventual consistency', 'dynamo', 'cassandra'],
    summary: 'Fundamental distributed computing theorem stating that in the presence of a network partition, a distributed system can guarantee Consistency OR Availability, but NEVER both.',
    principles: [
      '**Consistency (Linearizability)**: Every read receives the most recent write or an error.',
      '**Availability**: Every non-failing node returns a non-error response for every request (no guarantee it is the most recent write).',
      '**Partition Tolerance**: System continues operating despite arbitrary packet loss or network splits between nodes. Network partitions are inevitable in real hardware networks!',
      '**The Real Choice: CP vs AP**: Since Partitions are unavoidable, the actual decision is: during a network partition, do you reject writes to preserve Consistency (CP), or accept writes and risk stale/divergent data to maintain Availability (AP)?',
      '**PACELC Extension**: If there is a Partition (P), how do you trade Consistency (C) and Availability (A)? ELSE (E), how do you trade Latency (L) and Consistency (C)?',
    ],
    codeOrDiagram: `/* PACELC DECISION MATRIX:
+-----------------------------------------------------------+
| IN PARTITION (P) -> Choose: Availability (A) or Consistency (C)
| ELSE NORMAL  (E) -> Choose: Latency (L)      or Consistency (C)
+-----------------------------------------------------------+
Examples:
- MongoDB:   PC/EC (Consistent during partitions, consistent normally)
- Cassandra: PA/EL (Available during partitions, low latency normally)
*/`,
    weakness: 'Believing you can pick "CA" (Consistency + Availability) without Partition Tolerance in a distributed network across multiple servers.',
    strength: 'Understanding quorum read/write mathematics: `R + W > N`.',
    keyTakeaways: [
      'You cannot "choose CA" across a network; network partitions are physical reality.',
      'CP: Banks, financial ledgers, inventory allocations (HBase, CockroachDB).',
      'AP: Social media feeds, likes, shopping carts, metrics (Cassandra, DynamoDB).',
    ],
    followUpPrompts: [
      'Explain Quorum consensus math: R + W > N with real server examples',
      'Why is "CA" a myth in real-world distributed systems?',
      'How does PACELC expand upon CAP Theorem?',
    ],
    scenarios: {
      systemDesign: {
        architecturePattern: 'Quorum-based AP Distributed Storage (Cassandra Model)',
        tradeoffs: 'Maximizes availability and fast writes across multiple data centers, resolving concurrent divergent writes with Last-Write-Wins (LWW) or Vector Clocks.',
        bottlenecksAndScaling: 'Anti-entropy background sync (read repair) and clock drift skew.',
      },
      interview: {
        topQuestions: [
          'Can a distributed database ever choose "CA"?',
          'What is the PACELC theorem?',
          'How does Quorum consistency ensure strong consistency in an AP datastore?',
        ],
        interviewTrap: 'Candidates often state: "You can pick any 2 of the 3". Eric Brewer himself clarified: network partitions are not a choice. When a cable is cut, you MUST choose between Consistency and Availability.',
        modelAnswer: 'Network partitions are unavoidable in distributed hardware. Therefore, the system designer must choose whether to stall requests to preserve consistency (CP) or serve potentially stale data to stay available (AP).',
      },
    },
    quickCheck: [
      {
        id: 'qc_cap_1',
        question: 'During a network partition between two data centers, what happens if a distributed system chooses AVAILABILITY (AP)?',
        options: [
          'Both data centers continue accepting reads and writes locally, but their data will temporarily diverge and become inconsistent',
          'Both data centers immediately shut down and reject all traffic',
          'The system guarantees 100% linearizable real-time consistency across both centers',
          'The network partition heals automatically in 0 milliseconds',
        ],
        correctIndex: 0,
        explanation: 'Choosing AP means nodes never refuse user requests. Since the network link is severed, writes on Center A cannot reach Center B, so data diverges until the partition heals.',
      },
      {
        id: 'qc_cap_2',
        question: 'In a distributed cluster with N = 5 replica nodes, what condition must Read Quorum (R) and Write Quorum (W) satisfy to guarantee strong consistency?',
        options: [
          'R + W > N (e.g. Write to 3 nodes, Read from 3 nodes: 3 + 3 = 6 > 5)',
          'R + W = N',
          'R * W < N',
          'R = 1 and W = 1',
        ],
        correctIndex: 0,
        explanation: 'By the Pigeonhole Principle, if R + W > N, the set of nodes written to and the set of nodes read from MUST overlap by at least one node containing the latest write.',
      },
    ],
  },

  // =========================================================================
  // 25. SYSTEM DESIGN: MESSAGE QUEUES (KAFKA VS RABBITMQ)
  // =========================================================================
  {
    id: 'sd-message-queues',
    topic: 'Message Queues & Event Streaming (Kafka vs RabbitMQ)',
    subject: 'System Design & Distributed Scalability',
    keywords: ['kafka', 'rabbitmq', 'message queue', 'pub sub', 'event streaming', 'amqp', 'consumer group', 'backpressure', 'idempotency'],
    summary: 'Asynchronous communication backbones used to decouple producers from consumers, smooth out traffic spikes, and buffer work in distributed architectures.',
    principles: [
      '**RabbitMQ (Smart Broker, Dumb Consumer)**: Traditional message broker (AMQP). Messages are pushed to consumers and deleted upon acknowledgment. Rich routing keys and exchanges.',
      '**Apache Kafka (Dumb Broker, Smart Consumer)**: Distributed, append-only commit log. Messages persist on disk according to retention policies (e.g. 7 days). Consumers pull messages and track their own offsets.',
      '**Replayability**: In Kafka, consumers can rewind offsets to re-process historical events; RabbitMQ cannot replay acknowledged messages.',
      '**Idempotency**: Distributed networks duplicate packets. Consumers MUST be idempotent (`WHERE transaction_id NOT IN (processed)`) to prevent double-processing.',
    ],
    codeOrDiagram: `/* ARCHITECTURE COMPARISON:
RabbitMQ: [ Producer ] -> ( Exchange ) -> [ Queue ] === Push ===> [ Consumer ] (Deleted on ACK)

Kafka:    [ Producer ] === Append ===> [ Partition Commit Log ] (Persisted for 7 days)
                                              ^
                                              |--- Consumer A (Offset: 104)
                                              |--- Consumer B (Offset: 89)
*/`,
    weakness: 'Assuming message queues guarantee exactly-once processing end-to-end without consumer deduplication logic.',
    strength: 'Designing idempotent consumers and partitioning strategies.',
    keyTakeaways: [
      'RabbitMQ: Complex routing, priority queues, task worker queues.',
      'Kafka: High-throughput event streaming, log persistence, replayability, real-time analytics.',
    ],
    followUpPrompts: [
      'How to achieve idempotency with a Unique Deduplication Key in database',
      'What happens when a Kafka consumer in a consumer group crashes (Rebalancing)?',
      'Compare At-Least-Once vs At-Most-Once vs Exactly-Once delivery semantics',
    ],
    scenarios: {
      comparison: {
        comparedTo: 'Kafka vs RabbitMQ',
        differences: [
          { aspect: 'Data Model', optionA: 'Kafka: Distributed append-only partition log (persisted on disk)', optionB: 'RabbitMQ: In-memory queue buffer (messages deleted once consumed)' },
          { aspect: 'Message Replay', optionA: 'Kafka: Replay historical messages by rewinding consumer offsets', optionB: 'RabbitMQ: Cannot replay; acknowledged messages are removed' },
          { aspect: 'Throughput', optionA: 'Kafka: Millions of messages/sec via sequential disk writes & zero-copy page cache', optionB: 'RabbitMQ: Tens of thousands of messages/sec with complex routing' },
        ],
        decisionRule: 'Choose RabbitMQ for granular task worker queues with complex routing rules. Choose Kafka for high-throughput event streaming, event sourcing, and data pipelines.',
      },
    },
    quickCheck: [
      {
        id: 'qc_mq_1',
        question: 'Why must consumers in a distributed event-driven system always be engineered to be IDEMPOTENT?',
        options: [
          'Because network retries and consumer crashes cause "At-Least-Once" delivery semantics, occasionally delivering the same event more than once',
          'Because message brokers delete consumers after 5 minutes',
          'Because JSON cannot validate numbers twice',
          'Because operating systems require idempotent memory buffers',
        ],
        correctIndex: 0,
        explanation: 'If a consumer processes a message and crashes right before committing the acknowledgment, the broker re-delivers it to another consumer. Idempotency prevents double-charging.',
      },
      {
        id: 'qc_mq_2',
        question: 'What architectural feature enables Apache Kafka to achieve millions of message writes per second on standard spinning hard drives?',
        options: [
          'Sequential append-only disk I/O and utilizing the OS Page Cache with Zero-Copy (`sendfile`) network transfer',
          'Storing all events exclusively in CPU registers',
          'Skipping all network protocols',
          'Deleting old data immediately upon receiving it',
        ],
        correctIndex: 0,
        explanation: 'Sequential disk writes are nearly as fast as RAM. Kafka avoids random disk seeks and uses the OS kernel page cache with `sendfile` to stream data directly to network sockets.',
      },
    ],
  },

  // =========================================================================
  // 26. SYSTEM DESIGN: RATE LIMITING ALGORITHMS
  // =========================================================================
  {
    id: 'sd-rate-limiting',
    topic: 'Rate Limiting Algorithms (Token Bucket vs Leaky Bucket vs Sliding Window)',
    subject: 'System Design & High-Throughput Architecture',
    keywords: ['rate limiting', 'token bucket', 'leaky bucket', 'sliding window', 'ddos protection', 'http 429', 'redis rate limiter'],
    summary: 'Defensive mechanisms deployed at API Gateways to throttle traffic, protect downstream services from cascading collapse, and enforce fair resource quotas.',
    principles: [
      '**Token Bucket**: Tokens are added to a bucket at a constant rate `r` up to capacity `b`. Each request consumes 1 token. If bucket is empty, request is rejected with `HTTP 429 Too Many Requests`. **Allows bursts**.',
      '**Leaky Bucket (Queue)**: Requests enter a queue and leak out at a strictly constant rate. Drops requests if queue overflows. **Smoothes traffic into a steady stream**.',
      '**Sliding Window Counter**: Tracks request timestamps in Redis Sorted Sets (`ZREMRANGEBYSCORE`). Prevents boundary double-burst attacks that plague Fixed Window counters.',
      '**HTTP Headers**: Return `X-RateLimit-Limit`, `X-RateLimit-Remaining`, and `Retry-After`.',
    ],
    codeOrDiagram: `// Token Bucket Rate Limiting Algorithm in Python:
class TokenBucket:
    def __init__(self, capacity: int, refill_rate_per_sec: float):
        self.capacity = capacity
        self.tokens = capacity
        self.refill_rate = refill_rate_per_sec
        self.last_refill = time.time()
        
    def allow_request(self) -> bool:
        now = time.time()
        # Refill tokens based on elapsed time:
        elapsed = now - self.last_refill
        self.tokens = min(self.capacity, self.tokens + elapsed * self.refill_rate)
        self.last_refill = now
        
        if self.tokens >= 1.0:
            self.tokens -= 1.0
            return True # Allowed!
        return False # HTTP 429 Rate Limited!`,
    weakness: 'Using Fixed Window counters, which allow 2x traffic spikes at the boundary edge (e.g. 100 requests at 11:59:59 and 100 at 12:00:01).',
    strength: 'Implementing distributed rate limiting with Redis Lua scripts to prevent race conditions.',
    keyTakeaways: [
      'Token Bucket: Simple, memory-efficient, supports bursts of traffic (Used by AWS, Stripe).',
      'Leaky Bucket: Enforces smooth constant egress rate.',
      'Always use atomic Redis Lua scripts to prevent distributed race conditions.',
    ],
    followUpPrompts: [
      'Show me the Redis Lua script for an atomic Token Bucket rate limiter',
      'Explain the boundary double-burst flaw in Fixed Window counters',
      'Compare Client-side vs Server-side rate limiting techniques',
    ],
    scenarios: {
      interview: {
        topQuestions: [
          'How does the Token Bucket algorithm differ from the Leaky Bucket algorithm?',
          'How do you implement a distributed rate limiter across 20 web servers without race conditions?',
          'What HTTP status code and headers are returned when a user is rate limited?',
        ],
        interviewTrap: 'Interviewers often ask: "Why not just use a Redis `GET` and `INCR`?". That is a race condition! Multiple servers can read the same count concurrently. You must use an atomic Redis Lua script or Redis `MULTI/EXEC`.',
        modelAnswer: 'Token Bucket allows bursts of traffic while enforcing average rate limits. In distributed systems, token state is stored in Redis and updated via atomic Lua scripts to prevent race conditions.',
      },
    },
    quickCheck: [
      {
        id: 'qc_rl_1',
        question: 'What is the primary advantage of the Token Bucket algorithm over the Leaky Bucket algorithm?',
        options: [
          'Token Bucket allows sudden short bursts of traffic up to the bucket capacity, while Leaky Bucket forces a rigid constant output rate',
          'Token Bucket never drops requests',
          'Token Bucket requires zero CPU to execute',
          'Token Bucket only runs on mobile devices',
        ],
        correctIndex: 0,
        explanation: 'If a user has been idle, the Token Bucket accumulates tokens up to its capacity, allowing a quick burst of legitimate requests before throttling.',
      },
      {
        id: 'qc_rl_2',
        question: 'Which HTTP status code must an API gateway return when a client exceeds their permitted request rate quota?',
        options: [
          'HTTP 429 Too Many Requests',
          'HTTP 500 Internal Server Error',
          'HTTP 403 Forbidden',
          'HTTP 301 Moved Permanently',
        ],
        correctIndex: 0,
        explanation: 'RFC 6585 specifies `HTTP 429 Too Many Requests`, accompanied by `Retry-After: <seconds>` indicating when the client may retry.',
      },
    ],
  },

  // =========================================================================
  // 27. MACHINE LEARNING: BIAS-VARIANCE TRADEOFF & OVERFITTING
  // =========================================================================
  {
    id: 'ml-bias-variance',
    topic: 'Machine Learning Bias-Variance Tradeoff & Overfitting',
    subject: 'Machine Learning & AI Engineering',
    keywords: ['bias variance', 'overfitting', 'underfitting', 'regularization', 'l1 l2', 'lasso', 'ridge', 'cross validation', 'generalization'],
    summary: 'The central tension in supervised machine learning between a models ability to capture true underlying trends (low bias) versus its sensitivity to random noise in the training set (low variance).',
    principles: [
      '**Total Prediction Error** = `Bias² + Variance + Irreducible Error (Noise)`.',
      '**High Bias (Underfitting)**: Model is overly simplistic (e.g. fitting linear line to quadratic data). Fails on both training and test data.',
      '**High Variance (Overfitting)**: Model is overly complex (e.g. degree 20 polynomial memorizing noise). Near-zero training error, but catastrophic test error.',
      '**Regularization Guardrails**: Penalty terms added to the loss function to penalize large weights: **L1 Lasso** (`λ Σ|w|`) forces sparse feature selection; **L2 Ridge** (`λ Σw²`) shrinks weights smoothly.',
    ],
    codeOrDiagram: `/* REGULARIZATION LOSS FUNCTIONS:
Standard MSE Loss:
  L = (1/N) * Σ (y - ŷ)²

L2 Ridge Regularization (Weight Decay):
  L_ridge = MSE + λ * Σ (w_i)²      // Shrinks weights close to 0

L1 Lasso Regularization (Feature Selector):
  L_lasso = MSE + λ * Σ |w_i|       // Drives useless feature weights to EXACTLY 0!
*/`,
    weakness: 'Confusing high variance with high bias, or using L1 Lasso without recognizing that it zeroes out correlated features.',
    strength: 'Diagnosing learning curves and applying appropriate regularization techniques.',
    keyTakeaways: [
      'High Training Error + High Test Error = High Bias (Underfitting). Solution: More complex model, more features.',
      'Low Training Error + High Test Error = High Variance (Overfitting). Solution: Regularization, more data, dropout.',
    ],
    followUpPrompts: [
      'Why does L1 Lasso drive weights to exact zero while L2 Ridge only shrinks them?',
      'How does K-Fold Cross Validation prevent overfitting during hyperparameter tuning?',
      'Compare Bagging (Random Forest) vs Boosting (XGBoost) bias-variance impact',
    ],
    scenarios: {
      interview: {
        topQuestions: [
          'If a deep neural net achieves 99% accuracy on training data but 68% on validation data, what is the problem and how do you fix it?',
          'What is the geometric difference between L1 and L2 regularization contours?',
          'How does Dropout in neural networks reduce variance?',
        ],
        interviewTrap: 'Candidates often say: "Collect more data to fix underfitting". NO! Collecting more data helps OVERFITTING (variance). To fix underfitting (bias), you need a more expressive model or richer features.',
        modelAnswer: 'Bias-Variance tradeoff balances model expressiveness against generalization. High variance (overfitting) is mitigated by regularization (L1/L2, dropout), data augmentation, and early stopping.',
      },
    },
    quickCheck: [
      {
        id: 'qc_ml_1',
        question: 'If your model has 99.5% accuracy on training data but only 65% on validation data, which problem are you facing and what is the optimal solution?',
        options: [
          'High Variance (Overfitting); apply regularization (L1/L2, dropout), collect more training data, or simplify model depth',
          'High Bias (Underfitting); make the model more complex with more parameters',
          'The dataset is missing all labels',
          'The computer has run out of RAM',
        ],
        correctIndex: 0,
        explanation: 'A huge gap between near-perfect training score and poor validation score is the textbook definition of Overfitting (memorizing noise). Regularization forces generalization.',
      },
      {
        id: 'qc_ml_2',
        question: 'Why does L1 Regularization (Lasso) lead to sparse models with many weights set to EXACTLY ZERO?',
        options: [
          'Because the L1 diamond constraint has sharp corners on the coordinate axes, where the loss contour ellipses naturally intersect at zero coordinates',
          'Because L1 multiplies weights by zero randomly',
          'Because Lasso only runs on binary data',
          'Because L1 deletes the training dataset',
        ],
        correctIndex: 0,
        explanation: 'Geometrically, the L1 norm forms a diamond (polytope) with sharp points along the axes. Optimization contours strike these axis corners first, driving coefficients to exact zero.',
      },
    ],
  },

  // =========================================================================
  // 28. MACHINE LEARNING: TRANSFORMERS & SELF-ATTENTION
  // =========================================================================
  {
    id: 'ml-transformers',
    topic: 'Transformers & Self-Attention Mechanism (LLM Architecture)',
    subject: 'Machine Learning & Artificial Intelligence',
    keywords: ['transformers', 'attention', 'self-attention', 'llm', 'query key value', 'multi-head attention', 'bert', 'gpt', 'positional encoding'],
    summary: 'The revolutionary neural network architecture replacing sequential RNNs/LSTMs with parallelized Scaled Dot-Product Attention, forming the backbone of modern Large Language Models (LLMs).',
    principles: [
      '**The Core Flaw of RNNs**: Recurrent networks process tokens sequentially (`t_1, t_2, ...`), preventing parallel GPU training and suffering from vanishing gradients over long horizons.',
      '**Self-Attention Intuition**: Allows every token in a sequence to look at and weigh the contextual relevance of every other token simultaneously.',
      '**Query, Key, Value (Q, K, V)**: Query (`What am I looking for?`), Key (`What content do I have?`), Value (`What information do I pass along?`).',
      '**Attention Formula**: `Attention(Q, K, V) = softmax((Q * K^T) / sqrt(d_k)) * V`.',
      '**Positional Encoding**: Because attention processes all tokens concurrently without inherent sequence order, sinusoidal or rotary positional embeddings (RoPE) inject token order.',
    ],
    codeOrDiagram: `/* SCALED DOT-PRODUCT ATTENTION:
Input Vector X -> Projections: Q = X*W_q, K = X*W_k, V = X*W_v

Score Matrix = (Q * K^T) / sqrt(d_k)
Weights      = Softmax(Score Matrix)  // Sum of attention weights across row = 1.0
Output       = Weights * V            // Weighted combination of values
*/`,
    weakness: 'Confusing why we divide by `sqrt(d_k)` (to prevent dot-products from growing large and pushing softmax into vanishing gradient regions).',
    strength: 'Understanding Multi-Head Attention and causal masking in decoder-only models (GPT).',
    keyTakeaways: [
      'Transformers eliminate sequential recurrence, unlocking massive parallel GPU pre-training.',
      'Quadratic Complexity O(N²) in sequence length N due to N*N attention matrix.',
    ],
    followUpPrompts: [
      'Why is the scaling factor sqrt(d_k) essential in Scaled Dot-Product Attention?',
      'Compare Encoder-Only (BERT) vs Decoder-Only (GPT) vs Encoder-Decoder (T5)',
      'How does Rotary Position Embedding (RoPE) work in modern LLMs like LLaMA?',
    ],
    scenarios: {
      interview: {
        topQuestions: [
          'Why do we divide by sqrt(d_k) in the Attention formula?',
          'What is the computational complexity of Self-Attention with sequence length N?',
          'How does Multi-Head Attention improve representation capacity over single-head attention?',
        ],
        interviewTrap: 'Interviewers will ask: "What happens if we remove the sqrt(d_k) scaling factor?". For large d_k, dot products grow huge, causing softmax outputs to saturate at 0 or 1 with vanishingly small gradients during backpropagation!',
        modelAnswer: 'Self-attention computes dynamic contextual representations via Q, K, V projections. Scaling by sqrt(d_k) stabilizes softmax gradients. Multi-head attention allows the model to jointly attend to information at different representation subspaces.',
      },
    },
    quickCheck: [
      {
        id: 'qc_tf_1',
        question: 'Why do Transformers divide the dot product `(Q * K^T)` by `sqrt(d_k)` before applying the Softmax function?',
        options: [
          'To prevent dot products from exploding in magnitude for large vector dimensions, which would cause Softmax gradients to become vanishingly tiny',
          'To convert negative floating-point numbers into positive integers',
          'To encrypt the attention weights for security',
          'To reduce sequence length from N to sqrt(N)',
        ],
        correctIndex: 0,
        explanation: 'For large d_k, dot products have variance d_k. Large values push softmax into saturated regions with near-zero gradients. Scaling by sqrt(d_k) maintains unit variance.',
      },
      {
        id: 'qc_tf_2',
        question: 'What is the computational and memory complexity of standard Self-Attention with respect to sequence length N?',
        options: [
          'O(N^2) quadratic complexity because every token computes dot-products against every other token',
          'O(N) linear complexity',
          'O(log N)',
          'O(1) constant complexity',
        ],
        correctIndex: 0,
        explanation: 'Computing the full attention matrix between N queries and N keys produces an N x N matrix, requiring quadratic O(N²) operations and memory.',
      },
    ],
  },
];
