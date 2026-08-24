export type ExamDifficulty = 'easy' | 'medium' | 'hard';

export interface ExamQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface ExamConfig {
  topic: string;
  subject: string;
  difficulty: ExamDifficulty;
  totalTimeSeconds: number; // Easy: 300s (5m), Medium: 600s (10m), Hard: 900s (15m)
  totalQuestions: number;
  initialLives: number; // Always 3 Lives ❤️❤️❤️
}

export interface IssuedCertificate {
  id: string;
  userId: string;
  studentName: string;
  topic: string;
  subject: string;
  difficulty: ExamDifficulty;
  scorePercent: number;
  issuedAt: string;
  verificationCode: string;
  avatarThemeName: string;
}
