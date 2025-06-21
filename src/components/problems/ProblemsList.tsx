"use client";
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import { useProblemsStore } from '../../store/problemsStore';
import { useChatStore } from '../../store/chatStore';
import { useRouter } from 'next/navigation';
import type { Problem } from '../../types/chat';

const getComplexityColor = (complexity: string) => {
  if (!complexity || typeof complexity !== 'string') return 'bg-gray-100 text-gray-800 border-gray-200';
  
  switch (complexity.toLowerCase()) {
    case 'easy':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'hard':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getTopicColor = (topic: string) => {
  if (!topic || typeof topic !== 'string') return 'bg-gray-100 text-gray-800 border-gray-200';
  
  const colors = [
    'bg-blue-100 text-blue-800 border-blue-200',
    'bg-purple-100 text-purple-800 border-purple-200',
    'bg-indigo-100 text-indigo-800 border-indigo-200',
    'bg-pink-100 text-pink-800 border-pink-200',
    'bg-teal-100 text-teal-800 border-teal-200',
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

export const ProblemsList = ({ searchTerm = '' }: { searchTerm?: string }) => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const router = useRouter();
  const { problems, isLoading, error: storeError, fetchProblems } = useProblemsStore();
  const { initializeProblemChat } = useChatStore();

  // Debug logging
  console.log('ProblemsList render - problems:', problems);
  console.log('ProblemsList render - isLoading:', isLoading);
  console.log('ProblemsList render - storeError:', storeError);
  console.log('ProblemsList render - searchTerm:', searchTerm);
  console.log('ProblemsList render - searchTerm type:', typeof searchTerm);
  console.log('ProblemsList render - searchTerm length:', searchTerm?.length);

  // Ensure problems is always an array
  const safeProblems = Array.isArray(problems) ? problems : [];
  console.log('ProblemsList render - safeProblems:', safeProblems);
  console.log('ProblemsList render - safeProblems.length:', safeProblems.length);
  
  // Log first problem structure if available
  if (safeProblems.length > 0) {
    console.log('ProblemsList render - first problem structure:', safeProblems[0]);
    console.log('ProblemsList render - first problem keys:', Object.keys(safeProblems[0]));
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchProblems(getAccessTokenSilently);
    }
  }, [isAuthenticated, fetchProblems, getAccessTokenSilently]);

  const handleProblemClick = async (problem: Problem) => {
    console.log('handleProblemClick called with problem:', problem.title);
    try {
      console.log('Calling initializeProblemChat...');
      await initializeProblemChat(problem, getAccessTokenSilently);
      console.log('initializeProblemChat completed, navigating to chat...');
      router.push('/chat');
    } catch (error) {
      console.error('Error handling problem click:', error);
    }
  };

  // Show loading state if not authenticated yet
  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Filter problems based on search term with maximum safety
  console.log('Starting filtering process with searchTerm:', searchTerm);
  
  const filteredProblems = safeProblems.filter(problem => {
    try {
      // Validate problem object before filtering
      if (!problem || typeof problem !== 'object') {
        console.error('Invalid problem object in filter:', problem);
        return false;
      }
      
      // If no search term, include all valid problems
      const searchLower = safeString(searchTerm).toLowerCase().trim();
      
      if (!searchLower) {
        return true; // Show all problems when no search term
      }
      
      // Safely extract properties
      const title = safeString(problem.title);
      const description = safeString(problem.description);
      const topic = safeString(problem.topic);
      const complexity = safeString(problem.complexity);

      // Only require title to be present for filtering
      if (!title) {
        console.error('Problem missing title in filter:', problem);
        return false;
      }

      // Search across all available properties (including empty topic)
      return (
        title.toLowerCase().includes(searchLower) ||
        description.toLowerCase().includes(searchLower) ||
        topic.toLowerCase().includes(searchLower) ||
        complexity.toLowerCase().includes(searchLower)
      );
    } catch (error) {
      console.error('Error filtering problem:', error, problem);
      return false;
    }
  });

  console.log('Filtered problems count:', filteredProblems.length);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (storeError) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-2">Error loading problems</div>
          <div className="text-gray-500">{storeError}</div>
        </div>
      </div>
    );
  }

  if (safeProblems.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <div className="text-gray-500 text-lg mb-2">No problems available</div>
          <div className="text-gray-400">Check back later for new problems</div>
        </div>
      </div>
    );
  }

  if (filteredProblems.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <div className="text-gray-500 text-lg mb-2">No problems found</div>
          <div className="text-gray-400">Try adjusting your search terms</div>
        </div>
      </div>
    );
  }

  // Render problems with maximum safety
  const renderProblems = () => {
    console.log('renderProblems called with filteredProblems:', filteredProblems.length);
    try {
      const renderedProblems = filteredProblems.map((problem, index) => {
        console.log('Rendering problem at index', index, ':', problem?.title);
        try {
          // Validate problem object
          if (!problem || typeof problem !== 'object') {
            console.error('Invalid problem object at index', index, ':', problem);
            return null;
          }
          
          // Safely extract all properties
          const id = safeString(problem.id, `problem-${index}`);
          const title = safeString(problem.title, 'Untitled Problem');
          const description = safeString(problem.description, 'No description available');
          const topic = safeString(problem.topic, 'General');
          const complexity = safeString(problem.complexity, 'Unknown');
          const isCustom = safeBoolean(problem.isCustom, false);

          console.log('Problem properties extracted:', { id, title, topic, complexity });

          // Check for minimum required properties
          if (!title || title === 'Untitled Problem') {
            console.error('Problem missing title at index', index, ':', problem);
            return null;
          }

          console.log('Rendering problem card for:', title);
          return (
            <div
              key={id}
              onClick={() => handleProblemClick(problem)}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer border border-gray-200 overflow-hidden group"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                    {title}
                  </h3>
                  {isCustom && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                      Custom
                    </span>
                  )}
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getTopicColor(topic)}`}>
                    {topic}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getComplexityColor(complexity)}`}>
                    {complexity}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    ID: {id}
                  </div>
                  <div className="flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-700 transition-colors duration-200">
                    <span>Start Chat</span>
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          );
        } catch (error) {
          console.error('Error rendering problem at index', index, ':', error, problem);
          return null;
        }
      });
      
      console.log('Rendered problems count:', renderedProblems.filter(p => p !== null).length);
      return renderedProblems;
    } catch (error) {
      console.error('Error in renderProblems:', error);
      return (
        <div className="col-span-full text-center text-red-500">
          Error rendering problems. Please try refreshing the page.
        </div>
      );
    }
  };

  console.log('About to render problems grid');
  const renderedProblems = renderProblems();
  console.log('Problems rendered, returning grid');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {renderedProblems}
    </div>
  );
};