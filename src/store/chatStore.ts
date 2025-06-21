import { create } from 'zustand';
import { nanoid } from 'nanoid';
import type { Message, Problem, ApiMessagePair } from '../types/chat';
import { getMessages, sendMessage as sendMessageApi } from '../lib/api';
import { GetTokenSilentlyOptions } from '@auth0/auth0-react';

interface ChatState {
  messages: Message[];
  currentProblem: Problem | null;
  isEditorVisible: boolean;
  isCodeEditorMode: boolean;
  isLoading: boolean;
  fetchMessages: (getAccessTokenSilently: (options?: GetTokenSilentlyOptions) => Promise<string>) => Promise<void>;
  sendMessage: (content: string, getAccessTokenSilently: (options?: GetTokenSilentlyOptions) => Promise<string>) => Promise<void>;
  setCurrentProblem: (problem: Problem | null) => void;
  toggleEditor: () => void;
  toggleCodeEditorMode: () => void;
  setCodeEditorMode: (mode: boolean) => void;
  initializeProblemChat: (problem: Problem) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  currentProblem: null,
  isEditorVisible: false,
  isCodeEditorMode: false,
  isLoading: false,
  fetchMessages: async (getAccessTokenSilently) => {
    set({ isLoading: true });
    try {
      const data = await getMessages(getAccessTokenSilently);
      const messages = data?.messages || [];
      const formattedMessages: Message[] = messages.flatMap((pair: ApiMessagePair) => [
        {
          id: nanoid(),
          role: 'user' as const,
          type: 'text' as const,
          content: pair.message,
          metadata: { timestamp: pair.createdAt },
        },
        {
          id: nanoid(),
          role: 'assistant' as const,
          type: 'text' as const,
          content: pair.response,
          metadata: { timestamp: new Date(new Date(pair.createdAt).getTime() + 1).toISOString() }, // ensure assistant message is after user
        },
      ]).sort((a: Message, b: Message) => new Date(a.metadata!.timestamp).getTime() - new Date(b.metadata!.timestamp).getTime());
      set({ messages: formattedMessages, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch messages", error);
      set({ messages: [], isLoading: false });
    }
  },
  sendMessage: async (content, getAccessTokenSilently) => {
    const userMessage: Message = {
      id: nanoid(),
      role: 'user',
      type: 'text',
      content,
      metadata: { timestamp: new Date().toISOString() },
    };
    set((state) => ({ messages: [...state.messages, userMessage], isLoading: true }));

    try {
      const response = await sendMessageApi(content, getAccessTokenSilently);
      const assistantMessage: Message = {
        id: nanoid(),
        role: 'assistant',
        type: 'text',
        content: response.response,
        metadata: { timestamp: new Date().toISOString() },
      };
      set((state) => ({
        messages: [...state.messages, assistantMessage],
        isLoading: false,
      }));
    } catch (error) {
      console.error("Failed to send message", error);
      const errorMessage: Message = {
        id: nanoid(),
        role: 'assistant',
        type: 'text',
        content: 'Sorry, I had trouble getting a response. Please try again.',
        metadata: { timestamp: new Date().toISOString() },
      };
      set((state) => ({
        messages: [...state.messages, errorMessage],
        isLoading: false,
      }));
    }
  },
  setCurrentProblem: (problem) => set({ currentProblem: problem }),
  toggleEditor: () =>
    set((state) => ({ isEditorVisible: !state.isEditorVisible })),
  toggleCodeEditorMode: () =>
    set((state) => ({ isCodeEditorMode: !state.isCodeEditorMode })),
  setCodeEditorMode: (mode) => set({ isCodeEditorMode: mode }),
  initializeProblemChat: (problem: Problem) => {
    set({ currentProblem: problem });
    
    // Create the problem description message
    const problemMessage = `Problem: ${problem.title}\n\nDescription: ${problem.description}\n\nTopic: ${problem.topic}\nComplexity: ${problem.complexity}${problem.isCustom ? '\nType: Custom Problem' : ''}\n\nLet's discuss this problem and work on a solution together!`;
    
    // Add the problem description as the first message
    const userMessage: Message = {
      id: nanoid(),
      role: 'user',
      type: 'text',
      content: problemMessage,
      metadata: { timestamp: new Date().toISOString() },
    };
    
    set({ messages: [userMessage] });
  },
})); 