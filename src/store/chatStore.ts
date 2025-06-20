import { create } from 'zustand';
import type { Message, Problem } from '../types/chat';

interface ChatState {
  messages: Message[];
  currentProblem: Problem | null;
  isEditorVisible: boolean;
  addMessage: (message: Message) => void;
  setCurrentProblem: (problem: Problem | null) => void;
  toggleEditor: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  currentProblem: null,
  isEditorVisible: false,
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  setCurrentProblem: (problem) => set({ currentProblem: problem }),
  toggleEditor: () =>
    set((state) => ({ isEditorVisible: !state.isEditorVisible })),
})); 