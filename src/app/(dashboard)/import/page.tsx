"use client";
import { useState, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { createSubmission, getProblems } from '../../../lib/api';
import type { LeetCodeJsonData, LeetCodeProblem, Problem } from '../../../types/chat';

interface ImportResult {
  problemTitle: string;
  success: boolean;
  error?: string;
}

export default function ImportPage() {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [jsonData, setJsonData] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<ImportResult[]>([]);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [isLoadingProblems, setIsLoadingProblems] = useState(false);

  const fetchProblems = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setIsLoadingProblems(true);
    try {
      const problemsData = await getProblems(getAccessTokenSilently);
      setProblems(Array.isArray(problemsData) ? problemsData : []);
    } catch (error) {
      console.error('Failed to fetch problems:', error);
    } finally {
      setIsLoadingProblems(false);
    }
  }, [getAccessTokenSilently, isAuthenticated]);

  const findProblemId = (leetcodeProblem: LeetCodeProblem): string | null => {
    // Try to match by title first
    const matchingProblem = problems.find(p => 
      p.title.toLowerCase() === leetcodeProblem.title.toLowerCase()
    );
    
    if (matchingProblem) {
      return matchingProblem.id;
    }

    // Try to match by title slug
    const matchingBySlug = problems.find(p => 
      p.title.toLowerCase().replace(/[^a-z0-9]/g, '') === 
      leetcodeProblem.titleSlug.toLowerCase()
    );
    
    if (matchingBySlug) {
      return matchingBySlug.id;
    }

    return null;
  };

  const processJsonData = async () => {
    if (!jsonData.trim()) {
      alert('Please paste JSON data first');
      return;
    }

    if (problems.length === 0) {
      alert('Please fetch problems first to match problem IDs');
      return;
    }

    setIsProcessing(true);
    setResults([]);

    try {
      const parsedData: LeetCodeJsonData = JSON.parse(jsonData);
      const importResults: ImportResult[] = [];

      for (const leetcodeProblem of parsedData.problems) {
        // Only process problems that have code in their latest submission
        if (!leetcodeProblem.latestSubmission?.code) {
          importResults.push({
            problemTitle: leetcodeProblem.title,
            success: false,
            error: 'No code found in latest submission'
          });
          continue;
        }

        const problemId = findProblemId(leetcodeProblem);
        if (!problemId) {
          importResults.push({
            problemTitle: leetcodeProblem.title,
            success: false,
            error: 'Problem not found in database'
          });
          continue;
        }

        try {
          await createSubmission(
            problemId,
            leetcodeProblem.latestSubmission.code,
            leetcodeProblem.latestSubmission.lang.name,
            getAccessTokenSilently
          );

          importResults.push({
            problemTitle: leetcodeProblem.title,
            success: true
          });
        } catch (error) {
          importResults.push({
            problemTitle: leetcodeProblem.title,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }

      setResults(importResults);
    } catch (error) {
      alert('Invalid JSON format: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setJsonData(content);
    };
    reader.readAsText(file);
  };

  const successCount = results.filter(r => r.success).length;
  const failureCount = results.filter(r => !r.success).length;

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-3 mb-6">
              <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center shadow-2xl">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
              </div>
            </div>
            
            <h1 className="text-responsive-xl font-bold mb-4">
              <span className="gradient-text">Import LeetCode Submissions</span>
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              Paste your LeetCode JSON data to import submissions for problems that contain code.
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="glass-card rounded-2xl p-8 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Problems Status */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Problems Database</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Problems loaded:</span>
                  <span className="text-white font-medium">{problems.length}</span>
                </div>
                <button
                  onClick={fetchProblems}
                  disabled={isLoadingProblems || !isAuthenticated}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoadingProblems ? (
                    <div className="flex items-center gap-2">
                      <div className="spinner w-4 h-4"></div>
                      <span>Loading Problems...</span>
                    </div>
                  ) : (
                    'Fetch Problems'
                  )}
                </button>
              </div>
            </div>

            {/* File Upload */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Upload JSON File</h3>
              <div className="space-y-4">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="block w-full text-sm text-white/70 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-500/20 file:text-primary-300 hover:file:bg-primary-500/30 file:cursor-pointer"
                />
                <div className="flex items-center gap-2 text-sm">
                  <p className="text-white/50">
                    Or paste JSON data directly in the text area below
                  </p>
                  <a
                    href="/example-leetcode-import.json"
                    download
                    className="text-primary-300 hover:text-primary-200 underline"
                  >
                    Download example
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* JSON Input */}
        <div className="glass-card rounded-2xl p-8 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">JSON Data</h3>
          <textarea
            value={jsonData}
            onChange={(e) => setJsonData(e.target.value)}
            placeholder="Paste your LeetCode JSON data here..."
            className="w-full h-64 p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400/50 resize-none font-mono text-sm"
          />
        </div>

        {/* Process Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={processJsonData}
            disabled={isProcessing || !isAuthenticated || problems.length === 0}
            className="btn-primary px-8 py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <div className="flex items-center gap-3">
                <div className="spinner w-5 h-5"></div>
                <span>Processing Submissions...</span>
              </div>
            ) : (
              'Process Submissions'
            )}
          </button>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="glass-card rounded-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Import Results</h3>
              <div className="flex gap-4 text-sm">
                <span className="text-success-300">
                  ✓ {successCount} successful
                </span>
                <span className="text-error-300">
                  ✗ {failureCount} failed
                </span>
              </div>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl border ${
                    result.success
                      ? 'bg-success-500/10 border-success-400/30'
                      : 'bg-error-500/10 border-error-400/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-medium ${
                      result.success ? 'text-success-300' : 'text-error-300'
                    }`}>
                      {result.problemTitle}
                    </span>
                    <span className={`text-sm ${
                      result.success ? 'text-success-400' : 'text-error-400'
                    }`}>
                      {result.success ? '✓ Success' : '✗ Failed'}
                    </span>
                  </div>
                  {result.error && (
                    <p className="text-error-400 text-sm mt-2">{result.error}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
} 