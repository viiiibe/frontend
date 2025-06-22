"use client";
import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { UserProfile } from '@/components/auth/UserProfile';
import { SubmissionsList } from '@/components/profile/SubmissionsList';
import { getMySubmissions, getProblemById } from '@/lib/api';

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

interface Problem {
  id: string;
  title: string;
  description: string;
  complexity: string;
  topics: string[];
  isCustom: boolean;
}

export default function ProfilePage() {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [problemTitles, setProblemTitles] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchProblemTitles = async (submissionsData: Submission[]) => {
      if (!isAuthenticated) return;

      // Get unique problem IDs
      const uniqueProblemIds = [...new Set(submissionsData.map(s => s.problemId))];
      const titles: Record<string, string> = {};

      // Fetch problem details for each unique problem ID
      for (const problemId of uniqueProblemIds) {
        try {
          const problem: Problem = await getProblemById(problemId, getAccessTokenSilently);
          titles[problemId] = problem.title;
        } catch (err) {
          console.error(`Error fetching problem ${problemId}:`, err);
          titles[problemId] = `Problem ${problemId}`; // Fallback title
        }
      }

      setProblemTitles(titles);
    };

    const fetchSubmissions = async () => {
      if (!isAuthenticated) return;
      
      setIsLoading(true);
      
      try {
        const data = await getMySubmissions(getAccessTokenSilently);
        const submissionsData = Array.isArray(data) ? data : [];
        setSubmissions(submissionsData);
        
        // Fetch problem titles for unique problem IDs
        await fetchProblemTitles(submissionsData);
      } catch (err) {
        console.error('Error fetching submissions:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubmissions();
  }, [isAuthenticated, getAccessTokenSilently]);

  // Enhance submissions with problem titles
  const enhancedSubmissions = submissions.map(submission => ({
    ...submission,
    problemTitle: problemTitles[submission.problemId] || `Problem ${submission.problemId}`
  }));

  // Calculate stats from submissions
  const successfulSubmissions = enhancedSubmissions.filter(s => 
    s.status.toLowerCase() === 'accepted' || s.status.toLowerCase() === 'success'
  );
  const totalSubmissions = enhancedSubmissions.length;
  const successRate = totalSubmissions > 0 ? Math.round((successfulSubmissions.length / totalSubmissions) * 100) : 0;
  
  // Calculate days active (unique days with submissions)
  const uniqueDays = new Set(
    enhancedSubmissions.map(s => new Date(s.createdAt).toDateString())
  ).size;

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center space-x-3 mb-6">
            <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center shadow-2xl">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
          
          <h1 className="text-responsive-xl font-bold mb-4">
            <span className="gradient-text">Your Profile</span>
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            Track your progress, view your achievements, and manage your learning journey.
          </p>
        </div>

        {/* Profile Section */}
        <div className="mb-12 animate-slide-in">
          <div className="glass-card rounded-2xl p-8">
            <UserProfile />
          </div>
        </div>

        {/* Progress & Stats Section */}
        <div className="mb-12 animate-fade-in">
          <div className="glass-card rounded-2xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Progress & Stats</h2>
              <p className="text-white/70">Your learning journey at a glance</p>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-white/5 rounded-xl border border-white/10">
                <div className="w-12 h-12 gradient-bg rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-3xl font-bold gradient-text mb-2">{totalSubmissions}</div>
                <div className="text-white/70">Total Submissions</div>
              </div>
              
              <div className="text-center p-6 bg-white/5 rounded-xl border border-white/10">
                <div className="w-12 h-12 gradient-bg-alt rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-3xl font-bold gradient-text mb-2">{uniqueDays}</div>
                <div className="text-white/70">Days Active</div>
              </div>
              
              <div className="text-center p-6 bg-white/5 rounded-xl border border-white/10">
                <div className="w-12 h-12 gradient-bg rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="text-3xl font-bold gradient-text mb-2">{successRate}%</div>
                <div className="text-white/70">Success Rate</div>
              </div>
            </div>
          </div>
        </div>

        {/* Submissions Section */}
        <div className="animate-fade-in">
          <div className="glass-card rounded-2xl p-8">
            <SubmissionsList submissions={enhancedSubmissions} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </main>
  );
} 