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