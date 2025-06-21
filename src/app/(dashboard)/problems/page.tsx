"use client";
import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { ProblemsList } from '../../../components/problems/ProblemsList';
import { useProblemsStore } from '../../../store/problemsStore';
import { ErrorBoundary } from '../../../components/ErrorBoundary';

export default function ProblemsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isReady, setIsReady] = useState(false);
  const { isAuthenticated, isLoading: authLoading, getAccessTokenSilently } = useAuth0();
  const { problems, isLoading: problemsLoading, error, fetchProblems } = useProblemsStore();

  useEffect(() => {
    // Only set ready when auth is done and we have problems data
    if (!authLoading && isAuthenticated && (Array.isArray(problems) || problemsLoading || error)) {
      setIsReady(true);
    }
  }, [authLoading, isAuthenticated, problems, problemsLoading, error]);

  const handleManualFetch = async () => {
    console.log('Manual fetch triggered');
    try {
      await fetchProblems(getAccessTokenSilently);
    } catch (error) {
      console.error('Manual fetch failed:', error);
    }
  };

  if (!isReady) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center min-h-96">
            <div className="text-center">
              <div className="spinner w-12 h-12 mx-auto mb-4"></div>
              <p className="text-white/70">
                {authLoading ? 'Authenticating...' : 'Loading your coding problems...'}
              </p>
              {!authLoading && isAuthenticated && (
                <button 
                  onClick={handleManualFetch}
                  className="btn-primary mt-4"
                >
                  Debug: Load Problems
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-3 mb-6">
              <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center shadow-2xl">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
            </div>
            
            <h1 className="text-responsive-xl font-bold mb-4">
              <span className="gradient-text">Coding Problems</span>
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              Choose a problem to start practicing. Click on any problem to open a chat and discuss solutions with our AI assistant.
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                <svg className="h-6 w-6 text-white/50 group-focus-within:text-primary-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search problems by title, topic, or difficulty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-16 pr-6 py-4 glass-card rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400/50 transition-all duration-300"
              />
              <div className="absolute inset-y-0 right-0 pr-6 flex items-center">
                <div className="text-white/30 text-sm">
                  {searchTerm.length > 0 ? `${searchTerm.length} characters` : 'Type to search...'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Problems List */}
        <div>
          <ErrorBoundary>
            <ProblemsList searchTerm={searchTerm} />
          </ErrorBoundary>
        </div>
      </div>
    </main>
  );
} 