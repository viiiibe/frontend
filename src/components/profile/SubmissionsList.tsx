"use client";
import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { getMySubmissions } from '@/lib/api';

interface Submission {
  id: string;
  problemId: string;
  problemTitle?: string;
  code: string;
  language: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface SubmissionsListProps {
  submissions?: Submission[];
  isLoading?: boolean;
}

export const SubmissionsList = ({ submissions: propSubmissions, isLoading: propIsLoading }: SubmissionsListProps = {}) => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use props if provided, otherwise fetch data
  const finalSubmissions = propSubmissions !== undefined ? propSubmissions : submissions;
  const finalIsLoading = propIsLoading !== undefined ? propIsLoading : isLoading;

  useEffect(() => {
    // Only fetch if props are not provided
    if (propSubmissions !== undefined) return;
    
    const fetchSubmissions = async () => {
      if (!isAuthenticated) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await getMySubmissions(getAccessTokenSilently);
        setSubmissions(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching submissions:', err);
        setError('Failed to load submissions');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubmissions();
  }, [isAuthenticated, getAccessTokenSilently, propSubmissions]);

  const getLanguageColor = (language: string) => {
    const colors: { [key: string]: string } = {
      'javascript': 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30',
      'python': 'bg-blue-500/20 text-blue-300 border-blue-400/30',
      'java': 'bg-red-500/20 text-red-300 border-red-400/30',
      'cpp': 'bg-purple-500/20 text-purple-300 border-purple-400/30',
      'c': 'bg-gray-500/20 text-gray-300 border-gray-400/30',
      'typescript': 'bg-blue-600/20 text-blue-400 border-blue-500/30',
    };
    return colors[language.toLowerCase()] || 'bg-white/10 text-white/70 border-white/20';
  };

  if (finalIsLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="spinner w-8 h-8 mx-auto mb-4"></div>
          <p className="text-white/70">Loading your submissions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-error-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-error-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="text-error-400 text-lg mb-2">Error loading submissions</div>
        <div className="text-white/70">{error}</div>
      </div>
    );
  }

  if (finalSubmissions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div className="text-white text-lg mb-2">No submissions yet</div>
        <div className="text-white/70">Start solving problems to see your submissions here</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">Your Submissions</h3>
        <div className="text-white/70 text-sm">
          {finalSubmissions.length} submission{finalSubmissions.length !== 1 ? 's' : ''}
        </div>
      </div>
      
      <div className="space-y-4">
        {finalSubmissions.map((submission) => (
          <div
            key={submission.id}
            className="glass-card rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-white mb-2">
                  {submission.problemTitle || `Problem ${submission.problemId}`}
                </h4>
                <div className="flex items-center space-x-4 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getLanguageColor(submission.language)}`}>
                    {submission.language}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="bg-black/20 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/70 text-sm font-medium">Code Preview</span>
                <span className="text-white/50 text-xs">
                  {submission.code.length} characters
                </span>
              </div>
              <pre className="text-white/80 text-sm overflow-x-auto whitespace-pre-wrap max-h-32 overflow-y-auto">
                {submission.code.length > 200 
                  ? `${submission.code.substring(0, 200)}...` 
                  : submission.code
                }
              </pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 