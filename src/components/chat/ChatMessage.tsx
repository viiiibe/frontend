import type { Message } from '../../types/chat';

export const ChatMessage = ({ message }: { message: Message }) => {
  const isUser = message.role === 'user';
  const isProblem = message.type === 'problem';
  const alignment = isUser ? 'justify-end' : 'justify-start';

  // Special rendering for problem type
  if (isProblem) {
    return (
      <div className="flex justify-center">
        <div className="glass-card rounded-2xl px-8 py-6 max-w-3xl w-full border border-primary-400/30">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center mr-4">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">Problem Description</h3>
              <p className="text-white/70 text-sm">Let&apos;s work on this together!</p>
            </div>
          </div>
          <div className="text-white/90 whitespace-pre-wrap text-base leading-relaxed">
            {typeof message.content === 'string' ? message.content : JSON.stringify(message.content)}
          </div>
        </div>
      </div>
    );
  }

  const renderContent = (content: unknown) => {
    if (typeof content === 'string') {
      // Check if content contains code blocks
      const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
      if (codeBlockRegex.test(content)) {
        return content.split(codeBlockRegex).map((part, index) => {
          if (index % 3 === 0) {
            // Regular text
            return <span key={index} className="text-white/90 leading-relaxed">{part}</span>;
          } else if (index % 3 === 1) {
            // Language identifier
            return null;
          } else {
            // Code content
            return (
              <div key={index} className="my-4">
                <div className="bg-black/40 rounded-t-xl px-4 py-2 border-b border-white/10">
                  <span className="text-white/60 text-sm font-mono">code</span>
                </div>
                <pre className="bg-black/60 text-green-400 p-4 rounded-b-xl overflow-x-auto text-sm font-mono border border-white/10">
                  <code>{part}</code>
                </pre>
              </div>
            );
          }
        });
      }
      return <span className="text-white/90 leading-relaxed">{content}</span>;
    }
    return <span className="text-white/90">{JSON.stringify(content)}</span>;
  };

  return (
    <div className={`flex ${alignment} mb-4`}>
      <div className={`max-w-2xl ${isUser ? 'order-2' : 'order-1'}`}>
        <div className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
          {/* Avatar */}
          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
            isUser ? 'gradient-bg' : 'bg-white/10'
          }`}>
            {isUser ? (
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            )}
          </div>
          
          {/* Message Content */}
          <div className={`glass-card rounded-2xl px-6 py-4 ${
            isUser ? 'bg-primary-500/20 border-primary-400/30' : 'bg-white/10 border-white/20'
          } border`}>
            <div className="flex items-center mb-2">
              <span className={`text-sm font-semibold ${
                isUser ? 'text-primary-300' : 'text-white/90'
              }`}>
                {isUser ? 'You' : 'AI Assistant'}
              </span>
              <span className="text-white/40 text-xs ml-2">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div className="prose prose-invert max-w-none">
              {renderContent(message.content)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 