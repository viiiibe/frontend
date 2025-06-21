"use client";
import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useChatStore } from '../../store/chatStore';
import { ChatMessage } from './ChatMessage';
import { ProblemView } from '../problems/ProblemView';
import { CodeEditor } from '../code/CodeEditor';

export const ChatInterface = () => {
  const [input, setInput] = useState('');
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const messages = useChatStore((s) => s.messages);
  const sendMessage = useChatStore((s) => s.sendMessage);
  const fetchMessages = useChatStore((s) => s.fetchMessages);
  const isLoading = useChatStore((s) => s.isLoading);
  const currentProblem = useChatStore((s) => s.currentProblem);
  const isEditorVisible = useChatStore((s) => s.isEditorVisible);

  useEffect(() => {
    if (isAuthenticated) {
      fetchMessages(getAccessTokenSilently);
    }
  }, [isAuthenticated, fetchMessages, getAccessTokenSilently]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input, getAccessTokenSilently);
    setInput('');
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Chat Messages */}
      <div className="flex-1 overflow-auto p-4 bg-gray-100">
        <div className="space-y-4">
          {messages.length === 0 && !isLoading ? (
            <div className="text-gray-400 text-center">Chat history will appear here.</div>
          ) : (
            messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)
          )}
          {isLoading && (
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>
      </div>
      {/* Problem View / Code Editor */}
      <div className="w-full border-t bg-white p-4 flex flex-col gap-4">
        {currentProblem && <ProblemView problem={currentProblem} />}
        {isEditorVisible && <CodeEditor />}
      </div>
      {/* Input Area */}
      <div className="border-t p-4 bg-gray-50 flex items-center gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full rounded-lg border p-2"
          placeholder="Type your message..."
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
        />
        <button
          className="rounded-lg bg-blue-500 px-4 py-2 text-white"
          onClick={handleSend}
          disabled={isLoading}
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
}; 