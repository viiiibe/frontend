"use client";
import { LoginButton } from '@/components/auth/LoginButton';
import { UserProfile } from '@/components/auth/UserProfile';
import Link from 'next/link';
import { useAuth0 } from '@auth0/auth0-react';

export default function Home() {
  const { isAuthenticated, isLoading, error, user } = useAuth0();
  
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-6 py-12">
      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto animate-fade-in">
        <div className="mb-8">
          <div className="inline-flex items-center space-x-3 mb-6">
            <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center shadow-2xl">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
          </div>
          
          <h1 className="text-responsive-xl font-bold mb-6">
            <span className="gradient-text">Vibe AI</span>
            <br />
            <span className="text-white">Coding Interview Coach</span>
          </h1>
          
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Get a personalized, AI-powered path to FAANG coding interview success. 
            Practice, get hints, and track your progress—all tailored to you.
          </p>
        </div>

        {/* Auth Section */}
        <div className="mb-12">
          {!isAuthenticated ? (
            <div className="space-y-4">
              <LoginButton />
              <p className="text-white/70 text-sm">
                Join thousands of developers preparing for their dream jobs
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="glass-card rounded-2xl p-6 max-w-md mx-auto">
                <UserProfile />
              </div>
              <Link 
                href="/chat" 
                className="btn-primary inline-flex items-center space-x-2 text-lg px-8 py-4"
              >
                <span>Go to Dashboard</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto w-full mt-16">
        <div className="glass-card rounded-2xl p-8 text-center group hover:scale-105 transition-transform duration-300">
          <div className="w-16 h-16 gradient-bg-alt rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-4">AI-Powered Chat</h3>
          <p className="text-white/70 leading-relaxed">
            Get instant feedback and guidance from our advanced AI assistant. 
            Ask questions, discuss solutions, and learn from detailed explanations.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-8 text-center group hover:scale-105 transition-transform duration-300">
          <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-4">Curated Problems</h3>
          <p className="text-white/70 leading-relaxed">
            Access a carefully curated collection of coding problems from top tech companies. 
            Practice with real interview questions and track your progress.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-8 text-center group hover:scale-105 transition-transform duration-300">
          <div className="w-16 h-16 gradient-bg-alt rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-4">Progress Tracking</h3>
          <p className="text-white/70 leading-relaxed">
            Monitor your learning journey with detailed analytics and insights. 
            See your strengths, identify areas for improvement, and celebrate milestones.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      {isAuthenticated && (
        <div className="mt-16 w-full max-w-4xl mx-auto">
          <div className="glass-card rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Your Progress</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text mb-2">0</div>
                <div className="text-white/70">Problems Solved</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text mb-2">0</div>
                <div className="text-white/70">Days Active</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text mb-2">0%</div>
                <div className="text-white/70">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Debug Section - Only show in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 glass-card rounded-2xl p-6 max-w-2xl mx-auto">
          <h3 className="text-lg font-semibold text-white mb-4">Debug Info</h3>
          <div className="space-y-2 text-sm text-white/80">
            <p>Auth State: {isLoading ? 'Loading...' : isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</p>
            {error && <p className="text-error-400">Error: {error.message}</p>}
            {user && <p>User: {user.name} ({user.email})</p>}
          </div>
        </div>
      )}
    </main>
  );
}
