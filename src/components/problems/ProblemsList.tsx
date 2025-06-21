"use client";
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useProblemsStore } from '../../store/problemsStore';
import { useChatStore } from '../../store/chatStore';
import { useRouter } from 'next/navigation';
import type { Problem } from '../../types/chat';

const getComplexityColor = (complexity: string) => {
  if (!complexity || typeof complexity !== 'string') return 'bg-white/10 text-white/70 border-white/20';
  
  switch (complexity.toLowerCase()) {
    case 'easy':
      return 'bg-success-500/20 text-success-300 border-success-400/30';
    case 'medium':
      return 'bg-warning-500/20 text-warning-300 border-warning-400/30';
    case 'hard':
      return 'bg-error-500/20 text-error-300 border-error-400/30';
    default:
      return 'bg-white/10 text-white/70 border-white/20';
  }
};

const getTopicColor = (topic: string) => {
  if (!topic || typeof topic !== 'string') return 'bg-white/10 text-white/70 border-white/20';
  
  const colors = [
    'bg-primary-500/20 text-primary-300 border-primary-400/30',
    'bg-secondary-500/20 text-secondary-300 border-secondary-400/30',
    'bg-accent-500/20 text-accent-300 border-accent-400/30',
    'bg-purple-500/20 text-purple-300 border-purple-400/30',
    'bg-pink-500/20 text-pink-300 border-pink-400/30',
  ];
  const index = topic.length % colors.length;
  return colors[index];
};

// Safe string access function
const safeString = (value: unknown, defaultValue: string = ''): string => {
  if (value === null || value === undefined) return defaultValue;
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return defaultValue;
};

// Safe boolean access function
const safeBoolean = (value: unknown, defaultValue: boolean = false): boolean => {
  if (value === null || value === undefined) return defaultValue;
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value.toLowerCase() === 'true';
  if (typeof value === 'number') return value !== 0;
  return defaultValue;
};

// Safe array access function
const safeArray = (value: unknown, defaultValue: string[] = []): string[] => {
  if (value === null || value === undefined) return defaultValue;
  if (Array.isArray(value)) {
    return value.map(item => safeString(item)).filter(item => item.length > 0);
  }
  return defaultValue;
};

export const ProblemsList = ({ searchTerm = '' }: { searchTerm?: string }) => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const router = useRouter();
  const { problems, isLoading, error: storeError, fetchProblems } = useProblemsStore();
  const { initializeProblemChat } = useChatStore();
  const hasFetched = useRef(false);
  
  // Pagination state
  const [displayedProblems, setDisplayedProblems] = useState<Problem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const problemsPerPage = 30;

  // Ensure problems is always an array - use useMemo to prevent unnecessary re-renders
  const safeProblems = useMemo(() => Array.isArray(problems) ? problems : [], [problems]);
  console.log('ProblemsList render - safeProblems length:', safeProblems.length);
  console.log('ProblemsList render - isLoading:', isLoading);
  console.log('ProblemsList render - storeError:', storeError);

  // Only fetch problems once when authenticated
  useEffect(() => {
    console.log('ProblemsList useEffect - isAuthenticated:', isAuthenticated, 'hasFetched:', hasFetched.current, 'problems length:', safeProblems.length);
    if (isAuthenticated && !hasFetched.current) {
      console.log('Fetching problems...');
      hasFetched.current = true;
      fetchProblems(getAccessTokenSilently).catch(console.error);
    }
  }, [isAuthenticated, fetchProblems, getAccessTokenSilently, safeProblems.length]); // Include necessary dependencies

  // Fallback: if authenticated but no problems loaded, try to fetch
  useEffect(() => {
    if (isAuthenticated && safeProblems.length === 0 && !isLoading && !storeError) {
      console.log('Fallback: Fetching problems because array is empty');
      fetchProblems(getAccessTokenSilently).catch(console.error);
    }
  }, [isAuthenticated, safeProblems.length, isLoading, storeError, fetchProblems, getAccessTokenSilently]);

  // Update displayed problems when problems or search term changes
  useEffect(() => {
    // Filter problems based on search term
    const filteredProblems = safeProblems.filter(problem => {
      try {
        if (!problem || typeof problem !== 'object') {
          console.log('Filtered out invalid problem:', problem);
          return false;
        }
        
        const searchLower = safeString(searchTerm).toLowerCase().trim();
        
        if (!searchLower) {
          return true;
        }
        
        const title = safeString(problem.title);
        const description = safeString(problem.description);
        const topics = safeArray(problem.topics);
        const complexity = safeString(problem.complexity);

        if (!title) {
          console.log('Filtered out problem without title:', problem);
          return false;
        }

        return (
          title.toLowerCase().includes(searchLower) ||
          description.toLowerCase().includes(searchLower) ||
          topics.some(topic => topic.toLowerCase().includes(searchLower)) ||
          complexity.toLowerCase().includes(searchLower)
        );
      } catch {
        return false;
      }
    });

    console.log('ProblemsList render - filteredProblems length:', filteredProblems.length);
    
    // Reset pagination when search term changes
    setCurrentPage(1);
    setDisplayedProblems(filteredProblems.slice(0, problemsPerPage));
    setHasMore(filteredProblems.length > problemsPerPage);
  }, [safeProblems, searchTerm]);

  const loadMoreProblems = useCallback(() => {
    if (isLoadingMore || !hasMore) return;
    
    setIsLoadingMore(true);
    
    // Simulate loading delay for better UX
    setTimeout(() => {
      const filteredProblems = safeProblems.filter(problem => {
        try {
          if (!problem || typeof problem !== 'object') return false;
          
          const searchLower = safeString(searchTerm).toLowerCase().trim();
          
          if (!searchLower) return true;
          
          const title = safeString(problem.title);
          const description = safeString(problem.description);
          const topics = safeArray(problem.topics);
          const complexity = safeString(problem.complexity);

          if (!title) return false;

          return (
            title.toLowerCase().includes(searchLower) ||
            description.toLowerCase().includes(searchLower) ||
            topics.some(topic => topic.toLowerCase().includes(searchLower)) ||
            complexity.toLowerCase().includes(searchLower)
          );
        } catch {
          return false;
        }
      });

      const nextPage = currentPage + 1;
      const startIndex = 0;
      const endIndex = nextPage * problemsPerPage;
      const newProblems = filteredProblems.slice(startIndex, endIndex);
      
      setDisplayedProblems(newProblems);
      setCurrentPage(nextPage);
      setHasMore(filteredProblems.length > endIndex);
      setIsLoadingMore(false);
    }, 500);
  }, [currentPage, hasMore, isLoadingMore, safeProblems, searchTerm]);

  const handleProblemClick = async (problem: Problem) => {
    try {
      await initializeProblemChat(problem, getAccessTokenSilently);
      router.push('/chat');
    } catch (error) {
      console.error('Error handling problem click:', error);
    }
  };

  // Show loading state if not authenticated yet
  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <div className="spinner w-12 h-12 mx-auto mb-4"></div>
          <p className="text-white/70">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <div className="spinner w-12 h-12 mx-auto mb-4"></div>
          <p className="text-white/70">Loading problems...</p>
        </div>
      </div>
    );
  }

  if (storeError) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <div className="w-16 h-16 bg-error-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-error-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-error-400 text-lg mb-2">Error loading problems</div>
          <div className="text-white/70">{storeError}</div>
          <button 
            onClick={() => {
              hasFetched.current = false;
              fetchProblems(getAccessTokenSilently).catch(console.error);
            }}
            className="btn-primary mt-4"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (safeProblems.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <div className="text-white/70 text-lg mb-2">No problems available</div>
          <div className="text-white/50">Check back later for new problems</div>
        </div>
      </div>
    );
  }

  if (displayedProblems.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div className="text-white/70 text-lg mb-2">No problems found</div>
          <div className="text-white/50">Try adjusting your search terms</div>
        </div>
      </div>
    );
  }

  // Render problems with maximum safety
  const renderProblems = () => {
    console.log('renderProblems called with', displayedProblems.length, 'problems');
    try {
      const renderedProblems = displayedProblems.map((problem, index) => {
        try {
          if (!problem || typeof problem !== 'object') {
            console.log('Rendering: Invalid problem at index', index, ':', problem);
            return null;
          }
          
          const id = safeString(problem.id, `problem-${index}`);
          const title = safeString(problem.title, 'Untitled Problem');
          const description = safeString(problem.description, 'No description available');
          const topics = safeArray(problem.topics, ['General']);
          const complexity = safeString(problem.complexity, 'Unknown');
          const isCustom = safeBoolean(problem.isCustom, false);

          if (!title || title === 'Untitled Problem') {
            console.log('Rendering: Problem without title at index', index, ':', problem);
            return null;
          }

          console.log('Rendering problem:', title, 'at index', index);
          return (
            <div
              key={id}
              onClick={() => handleProblemClick(problem)}
              className="glass-card rounded-2xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer group border border-white/10 hover:border-primary-400/30"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold text-neutral-100 group-hover:text-primary-300 transition-colors duration-300 line-clamp-2 flex-1 mr-4">
                  {title}
                </h3>
                {isCustom && (
                  <span className="bg-primary-500/20 text-primary-300 text-xs px-3 py-1 rounded-full font-medium border border-primary-400/30 flex-shrink-0">
                    Custom
                  </span>
                )}
              </div>
              
              <p className="text-neutral-300 text-sm mb-6 line-clamp-3 leading-relaxed">
                {description}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {topics.slice(0, 3).map((topic, topicIndex) => (
                  <span key={topicIndex} className={`px-3 py-1 rounded-full text-xs font-medium border ${getTopicColor(topic)}`}>
                    {topic}
                  </span>
                ))}
                {topics.length > 3 && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium border bg-white/10 text-neutral-300 border-white/20">
                    +{topics.length - 3} more
                  </span>
                )}
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getComplexityColor(complexity)}`}>
                  {complexity}
                </span>
              </div>
              
              <div className="flex items-center justify-end">
                <div className="flex items-center text-primary-300 text-sm font-semibold group-hover:text-primary-200 transition-colors duration-300">
                  <span>Start Chat</span>
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </div>
          );
        } catch (error) {
          console.log('Rendering: Error rendering problem at index', index, ':', error, problem);
          return null;
        }
      });
      
      const validProblems = renderedProblems.filter(p => p !== null);
      console.log('renderProblems: Rendered', validProblems.length, 'valid problems out of', displayedProblems.length);
      return renderedProblems;
    } catch (error) {
      console.log('renderProblems: Error in renderProblems:', error);
      return (
        <div className="col-span-full text-center text-error-400">
          Error rendering problems. Please try refreshing the page.
        </div>
      );
    }
  };

  const renderedProblems = renderProblems();

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {renderedProblems}
      </div>
      
      {hasMore && (
        <div className="flex justify-center pt-8">
          <button
            onClick={loadMoreProblems}
            disabled={isLoadingMore}
            className="btn-primary px-8 py-3 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoadingMore ? (
              <>
                <div className="spinner w-4 h-4"></div>
                <span>Loading...</span>
              </>
            ) : (
              <>
                <span>Load More Problems</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </>
            )}
          </button>
        </div>
      )}
      
      {!hasMore && displayedProblems.length > 0 && (
        <div className="text-center pt-8">
          <p className="text-white/50 text-sm">You&apos;ve reached the end of all problems</p>
        </div>
      )}
    </div>
  );
};