import { create } from 'zustand';
import type { Problem } from '../types/chat';
import { getProblems, getProblemById } from '../lib/api';
import { GetTokenSilentlyOptions } from '@auth0/auth0-react';

interface ProblemsState {
  problems: Problem[];
  currentProblem: Problem | null;
  isLoading: boolean;
  error: string | null;
  fetchProblems: (getAccessTokenSilently: (options?: GetTokenSilentlyOptions) => Promise<string>) => Promise<void>;
  fetchProblemById: (id: string, getAccessTokenSilently: (options?: GetTokenSilentlyOptions) => Promise<string>) => Promise<void>;
  setCurrentProblem: (problem: Problem | null) => void;
  clearError: () => void;
}

export const useProblemsStore = create<ProblemsState>((set) => ({
  problems: [],
  currentProblem: null,
  isLoading: false,
  error: null,
  fetchProblems: async (getAccessTokenSilently) => {
    set({ isLoading: true, error: null });
    try {
      const data = await getProblems(getAccessTokenSilently);
      set({ problems: Array.isArray(data) ? data : [], isLoading: false });
    } catch (error) {
      console.error("Failed to fetch problems", error);
      set({ error: "Failed to load problems", isLoading: false, problems: [] });
    }
  },
  fetchProblemById: async (id, getAccessTokenSilently) => {
    set({ isLoading: true, error: null });
    try {
      const problem = await getProblemById(id, getAccessTokenSilently);
      set({ currentProblem: problem, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch problem", error);
      set({ error: "Failed to load problem", isLoading: false });
    }
  },
  setCurrentProblem: (problem) => set({ currentProblem: problem }),
  clearError: () => set({ error: null }),
})); 