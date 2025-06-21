import type { Message } from '../../types/chat';

export const ChatMessage = ({ message }: { message: Message }) => {
  const isUser = message.role === 'user';
  const alignment = isUser ? 'justify-end' : 'justify-start';
  const colors = isUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800';

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