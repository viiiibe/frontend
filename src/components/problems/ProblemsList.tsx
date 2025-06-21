"use client";
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import { useProblemsStore } from '../../store/problemsStore';
import { useChatStore } from '../../store/chatStore';
import { useRouter } from 'next/navigation';
import type { Problem } from '../../types/chat';

const getComplexityColor = (complexity: string) => {
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

export const ProblemsList = ({ searchTerm = '' }: { searchTerm?: string }) => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const router = useRouter();
  const { problems, isLoading, error, fetchProblems } = useProblemsStore();
  const { initializeProblemChat } = useChatStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchProblems(getAccessTokenSilently);
    }
  }, [isAuthenticated, fetchProblems, getAccessTokenSilently]);

  const handleProblemClick = (problem: Problem) => {
    initializeProblemChat(problem);
    router.push('/chat');
  };

  // Show loading state if not authenticated yet
  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Filter problems based on search term
  const filteredProblems = (problems || []).filter(problem =>
    problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    problem.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    problem.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
    problem.complexity.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-2">Error loading problems</div>
          <div className="text-gray-500">{error}</div>
        </div>
      </div>
    );
  }

  if (!problems || problems.length === 0) {
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredProblems.map((problem) => (
        <div
          key={problem.id}
          onClick={() => handleProblemClick(problem)}
          className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer border border-gray-200 overflow-hidden group"
        >
          <div className="p-6">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                {problem.title}
              </h3>
              {problem.isCustom && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                  Custom
                </span>
              )}
            </div>
            
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {problem.description}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getTopicColor(problem.topic)}`}>
                {problem.topic}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getComplexityColor(problem.complexity)}`}>
                {problem.complexity}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500">
                ID: {problem.id}
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
      ))}
    </div>
  );
}; 