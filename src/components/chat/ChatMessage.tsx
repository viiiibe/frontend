import type { Message } from '../../types/chat';

export const ChatMessage = ({ message }: { message: Message }) => {
  const isUser = message.role === 'user';
  const isProblem = message.type === 'problem';
  const alignment = isUser ? 'justify-end' : 'justify-start';
  const colors = isUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800';

  // Special rendering for problem type
  if (isProblem) {
    return (
      <div className="flex justify-center">
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-6 py-4 max-w-2xl w-full">
          <div className="flex items-center mb-2">
            <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-blue-800 font-semibold">Problem Description</h3>
          </div>
          <div className="text-blue-700 whitespace-pre-wrap text-sm">
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
            return <span key={index}>{part}</span>;
          } else if (index % 3 === 1) {
            // Language identifier
            return null;
          } else {
            // Code content
            return (
              <pre key={index} className="bg-gray-800 text-green-400 p-3 rounded-md my-2 overflow-x-auto text-sm">
                <code>{part}</code>
              </pre>
            );
          }
        });
      }
      return content;
    }
    return JSON.stringify(content);
  };

  return (
    <div className={`flex ${alignment}`}>
      <div className={`rounded-lg px-4 py-2 max-w-lg ${colors}`}>
        {renderContent(message.content)}
      </div>
    </div>
  );
}; 