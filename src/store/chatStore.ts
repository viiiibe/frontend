import { create } from 'zustand';
import { nanoid } from 'nanoid';
import type { Message, Problem, ApiMessagePair } from '../types/chat';
import { getMessages, sendMessage as sendMessageApi, clearMessages } from '../lib/api';
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
  initializeProblemChat: (problem: Problem, getAccessTokenSilently?: (options?: GetTokenSilentlyOptions) => Promise<string>) => Promise<void>;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  currentProblem: null,
  isEditorVisible: false,
  isCodeEditorMode: false,
  isLoading: false,
  fetchMessages: async (getAccessTokenSilently) => {
    set({ isLoading: true, messages: [] });
    try {
      // Always clear messages on the backend before fetching
      await clearMessages(getAccessTokenSilently);
      const data = await getMessages(getAccessTokenSilently);
      const messagesArray = data?.messages || [];
      const formattedMessages: Message[] = messagesArray.flatMap((pair: ApiMessagePair) => [
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
      set({ isLoading: false, messages: [] });
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
    set((state) => ({ messages: [...(state.messages || []), userMessage], isLoading: true }));

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
        messages: [...(state.messages || []), assistantMessage],
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
        messages: [...(state.messages || []), errorMessage],
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
  initializeProblemChat: async (problem: Problem, getAccessTokenSilently?: (options?: GetTokenSilentlyOptions) => Promise<string>) => {
    console.log('initializeProblemChat called with problem:', problem.title);
    console.log('getAccessTokenSilently provided:', !!getAccessTokenSilently);
    
    set({ currentProblem: problem, messages: [] });
    console.log('Chat cleared and problem set');
    
    // Create the problem description message
    const problemMessage = `Problem: ${problem.title}\n\nDescription: ${problem.description}\n\nTopic: ${problem.topic}\nComplexity: ${problem.complexity}${problem.isCustom ? '\nType: Custom Problem' : ''}\n\nLet's discuss this problem and work on a solution together!`;
    console.log('Problem message created:', problemMessage.substring(0, 100) + '...');
    
    // Add the problem description as a problem message (not a user message)
    const problemMessageObj: Message = {
      id: nanoid(),
      role: 'user',
      type: 'problem',
      content: problemMessage,
      metadata: { timestamp: new Date().toISOString() },
    };
    
    set({ messages: [problemMessageObj], isLoading: true });
    console.log('Problem message added to chat');
    
    // If we have access to the token function, automatically send the message to get a response
    if (getAccessTokenSilently) {
      console.log('Sending initial message to API...');
      try {
        const response = await sendMessageApi(problemMessage, getAccessTokenSilently);
        console.log('API response received:', response.response.substring(0, 100) + '...');
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
        console.log('Assistant message added to chat');
      } catch (error) {
        console.error("Failed to send initial problem message", error);
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
    } else {
      console.log('No token function provided, skipping API call');
      // If no token function provided, just set loading to false
      set({ isLoading: false });
    }
  },
})); 