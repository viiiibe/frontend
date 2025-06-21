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
  topic: string;
  complexity: string;
  isCustom: boolean;
  // ...other fields as needed
}

export interface ApiMessagePair {
  id: string;
  message: string;
  response: string;
  isRead: boolean;
  createdAt: string;
} 