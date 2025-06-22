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
      <div className="text-center max-w-6xl mx-auto animate-fade-in">
        <div className="mb-12">
          <div className="inline-flex items-center space-x-3 mb-8">
            <div className="w-20 h-20 gradient-bg rounded-3xl flex items-center justify-center shadow-2xl">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
          </div>
          
          <h1 className="text-responsive-2xl font-bold mb-8">
            <span className="gradient-text">Revolutionary Education</span>
            <br />
            <span className="text-white">Tailored to Your Level</span>
          </h1>
          
          <p className="text-2xl text-white/90 mb-8 max-w-4xl mx-auto leading-relaxed">
            The future of education is personalized. Traditional materials assume a fixed knowledge level—either too basic or too advanced. 
            We break this barrier with AI that learns your exact capabilities and adapts in real-time.
          </p>
        </div>

        {/* Auth Section */}
        <div className="mb-16">
          {!isAuthenticated ? (
            <div className="space-y-6">
              <LoginButton />
              <p className="text-white/70 text-lg">
                Experience truly personalized learning that adapts to your knowledge level
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="glass-card rounded-2xl p-8 max-w-lg mx-auto">
                <UserProfile />
              </div>
              <Link 
                href="/chat" 
                className="btn-primary inline-flex items-center space-x-3 text-xl px-10 py-5"
              >
                <span>Start Your Personalized Journey</span>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* How It Works Section */}
      <div className="w-full max-w-7xl mx-auto mb-20">
        <h2 className="text-3xl font-bold text-white text-center mb-12">How Our Revolutionary System Works</h2>
        
        {/* System Architecture Diagram */}
        <div className="glass-card rounded-3xl p-8 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* User Input */}
            <div className="text-center">
              <div className="w-24 h-24 gradient-bg rounded-3xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">You & Your Knowledge</h3>
              <p className="text-white/70">
                Your current skill level, solved problems, and learning preferences
              </p>
            </div>

            {/* AI Brain */}
            <div className="text-center relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 gradient-bg-alt rounded-full opacity-20 animate-pulse"></div>
              </div>
              <div className="w-32 h-32 gradient-bg rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
                <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Adaptive AI</h3>
              <p className="text-white/70">
                Continuously learns and adapts to your exact knowledge level
              </p>
            </div>

            {/* Personalized Output */}
            <div className="text-center">
              <div className="w-24 h-24 gradient-bg rounded-3xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Perfect Fit Content</h3>
              <p className="text-white/70">
                Problems, explanations, and materials tailored exactly to your level
              </p>
            </div>
          </div>
        </div>

        {/* MCP Integrations Diagram */}
        <div className="glass-card rounded-3xl p-8">
          <h3 className="text-2xl font-bold text-white text-center mb-8">Powered by Advanced MCP Integrations</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* LeetCode Integration */}
            <div className="glass-card-alt rounded-2xl p-6 text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">LeetCode Sync</h4>
              <p className="text-white/70 text-sm">
                Real-time access to your solved problems and performance metrics
              </p>
            </div>

            {/* ACI.dev Integration */}
            <div className="glass-card-alt rounded-2xl p-6 text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Code Execution</h4>
              <p className="text-white/70 text-sm">
                Submit and test your solutions with instant feedback via aci.dev
              </p>
            </div>

            {/* Internal Knowledge Base */}
            <div className="glass-card-alt rounded-2xl p-6 text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Learning History</h4>
              <p className="text-white/70 text-sm">
                Track your progress and learning patterns over time
              </p>
            </div>

            {/* Free-form Chat */}
            <div className="glass-card-alt rounded-2xl p-6 text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Smart Chat</h4>
              <p className="text-white/70 text-sm">
                Natural conversation with context-aware AI assistance
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Benefits */}
      <div className="w-full max-w-6xl mx-auto mb-20">
        <h2 className="text-3xl font-bold text-white text-center mb-12">Why This Changes Everything</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="glass-card rounded-2xl p-8">
            <div className="w-16 h-16 gradient-bg-alt rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">No More One-Size-Fits-All</h3>
            <p className="text-white/70 leading-relaxed">
              Traditional materials assume everyone has the same knowledge level. Our AI continuously assesses your exact capabilities and adapts content accordingly.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-8">
            <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">Real-Time Adaptation</h3>
            <p className="text-white/70 leading-relaxed">
              As you learn and grow, our system instantly adjusts. No more getting stuck on problems that are too easy or too hard.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-8">
            <div className="w-16 h-16 gradient-bg-alt rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">Personalized Learning Path</h3>
            <p className="text-white/70 leading-relaxed">
              Every user gets a unique learning journey. The AI suggests topics, problems, and resources based on your specific needs and goals.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-8">
            <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">Natural Interaction</h3>
            <p className="text-white/70 leading-relaxed">
              Ask questions, submit code, request explanations—all through natural conversation. The AI understands context and provides relevant help.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      {isAuthenticated && (
        <div className="w-full max-w-4xl mx-auto mb-16">
          <div className="glass-card rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Your Learning Journey</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text mb-2">0</div>
                <div className="text-white/70">Problems Solved</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text mb-2">0</div>
                <div className="text-white/70">Topics Mastered</div>
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
