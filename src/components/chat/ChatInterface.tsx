"use client";
import { useState } from 'react';
import { useChatStore } from '../../store/chatStore';
import { ChatMessage } from './ChatMessage';
import { nanoid } from 'nanoid';
import { ProblemView } from '../problems/ProblemView';
import { CodeEditor } from '../code/CodeEditor';

export const ChatInterface = () => {
  const [input, setInput] = useState('');
  const messages = useChatStore((s) => s.messages);
  const addMessage = useChatStore((s) => s.addMessage);
  const currentProblem = useChatStore((s) => s.currentProblem);
  const isEditorVisible = useChatStore((s) => s.isEditorVisible);

  const handleSend = () => {
    if (!input.trim()) return;
    addMessage({
      id: nanoid(),
      type: 'text',
      content: input,
      metadata: { timestamp: new Date().toISOString() },
    });
    setInput('');
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Chat Messages */}
      <div className="flex-1 overflow-auto p-4 bg-gray-100">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-gray-400 text-center">Chat history will appear here.</div>
          ) : (
            messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)
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
        >
          Send
        </button>
      </div>
    </div>
  );
}; 