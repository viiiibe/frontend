export interface Message {
  id: string;
  role: 'user' | 'assistant';
  type: 'text' | 'problem' | 'code-request' | 'result' | 'resource';
  content: unknown;
  metadata?: {
    problemId?: string;
    submissionId?: string;
    timestamp: string;
  };
}

export interface Problem {
  id: string;
  title: string;
  description: string;
  topics: string[];
  complexity: string;
  isCustom: boolean;
  createdByUserId?: string;
  createdAt?: string;
  updatedAt?: string;
  testCases?: unknown[];
}

export interface ApiMessagePair {
  id: string;
  message: string;
  response: string;
  isRead: boolean;
  createdAt: string;
}

export interface LeetCodeProblem {
  acRate: number;
  content: string;
  difficulty: string;
  freqBar: null;
  frontendQuestionId: string;
  hasSolution: boolean;
  hasVideoSolution: boolean;
  isFavor: boolean;
  paidOnly: boolean;
  status: string;
  title: string;
  titleSlug: string;
  topicTags: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  latestSubmission?: {
    flagType: string;
    frontendId: number;
    hasNotes: boolean;
    id: string;
    isPending: string;
    lang: {
      name: string;
      verboseName: string;
    };
    langName: string;
    memory: number;
    notes: string;
    runtime: number;
    status: number;
    statusDisplay: string;
    timestamp: number;
    title: string;
    titleSlug: string;
    topicTags: Array<{
      id: string;
      name: string;
      slug: string;
    }>;
    url: string;
    runtimeDisplay: string;
    runtimePercentile: number;
    runtimeDistribution: string;
    memoryDisplay: string;
    memoryPercentile: number;
    memoryDistribution: string;
    code: string;
    statusCode: number;
    user: {
      username: string;
      profile: {
        realName: string;
        userAvatar: string;
      };
    };
    question: {
      questionId: string;
      titleSlug: string;
      hasFrontendPreview: boolean;
    };
    runtimeError: null;
    compileError: null;
    lastTestcase: string;
    codeOutput: string;
    expectedOutput: string;
    totalCorrect: number;
    totalTestcases: number;
    fullCodeOutput: null;
    testDescriptions: null;
    testBodies: null;
    testInfo: null;
    stdOutput: string;
  };
}

export interface LeetCodeJsonData {
  problems: LeetCodeProblem[];
}

export interface SubmissionRequest {
  problemId: string;
  code: string;
  language: string;
} 