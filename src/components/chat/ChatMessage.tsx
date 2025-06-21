import type { Message } from '../../types/chat';

export const ChatMessage = ({ message }: { message: Message }) => {
  const isUser = message.role === 'user';
  const alignment = isUser ? 'justify-end' : 'justify-start';
  const colors = isUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800';

  return (
    <div className={`flex ${alignment}`}>
      <div className={`rounded-lg px-4 py-2 max-w-lg ${colors}`}>
        {typeof message.content === 'string' ? message.content : JSON.stringify(message.content)}
      </div>
    </div>
  );
}; 