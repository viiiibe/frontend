import type { Message } from '../../types/chat';

export const ChatMessage = ({ message }: { message: Message }) => {
  // For now, just render the content as text
  return (
    <div className="rounded-lg bg-white p-3 shadow text-gray-800">
      {typeof message.content === 'string' ? message.content : JSON.stringify(message.content)}
    </div>
  );
}; 