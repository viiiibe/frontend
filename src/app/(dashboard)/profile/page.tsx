"use client";
import { UserProfile } from '@/components/auth/UserProfile';

export default function ProfilePage() {
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
        <div className="animate-fade-in">
          <div className="glass-card rounded-2xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Progress & Stats</h2>
              <p className="text-white/70">Your learning journey at a glance</p>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-white/5 rounded-xl border border-white/10">
                <div className="w-12 h-12 gradient-bg rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-3xl font-bold gradient-text mb-2">0</div>
                <div className="text-white/70">Problems Solved</div>
              </div>
              
              <div className="text-center p-6 bg-white/5 rounded-xl border border-white/10">
                <div className="w-12 h-12 gradient-bg-alt rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-3xl font-bold gradient-text mb-2">0</div>
                <div className="text-white/70">Days Active</div>
              </div>
              
              <div className="text-center p-6 bg-white/5 rounded-xl border border-white/10">
                <div className="w-12 h-12 gradient-bg rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="text-3xl font-bold gradient-text mb-2">0%</div>
                <div className="text-white/70">Success Rate</div>
              </div>
            </div>
            
            {/* Learning Path */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white mb-4">Your Learning Path</h3>
              <div className="space-y-3">
                <div className="flex items-center p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white/50 text-sm">1</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium">Complete your first problem</div>
                    <div className="text-white/50 text-sm">Start with an easy problem to get familiar</div>
                  </div>
                  <div className="text-white/30">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                
                <div className="flex items-center p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white/50 text-sm">2</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium">Solve 10 problems</div>
                    <div className="text-white/50 text-sm">Build your confidence with consistent practice</div>
                  </div>
                  <div className="text-white/30">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                
                <div className="flex items-center p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white/50 text-sm">3</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium">Master advanced topics</div>
                    <div className="text-white/50 text-sm">Tackle complex algorithms and data structures</div>
                  </div>
                  <div className="text-white/30">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 