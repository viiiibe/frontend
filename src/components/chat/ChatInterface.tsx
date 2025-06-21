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
  const isCodeEditorMode = useChatStore((s) => s.isCodeEditorMode);
  const setCodeEditorMode = useChatStore((s) => s.setCodeEditorMode);

  // Debug logging
  console.log('ChatInterface render - input:', input);
  console.log('ChatInterface render - isLoading:', isLoading);
  console.log('ChatInterface render - isCodeEditorMode:', isCodeEditorMode);
  console.log('ChatInterface render - messages count:', messages?.length);

  useEffect(() => {
    if (isAuthenticated) {
      // Always fetch messages when authenticated
      fetchMessages(getAccessTokenSilently);
    }
  }, [isAuthenticated, fetchMessages, getAccessTokenSilently]);

  // Trigger code editor mode for incoming assistant messages
  useEffect(() => {
    if (messages && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'assistant' && !isCodeEditorMode) {
        // For now, trigger code editor for all assistant messages
        setCodeEditorMode(true);
      }
    }
  }, [messages, isCodeEditorMode, setCodeEditorMode]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input, getAccessTokenSilently);
    setInput('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    console.log('Input change:', e.target.value);
    setInput(e.target.value);
  };

  const handleCodeSend = (code: string, language: string) => {
    // Append code to the current input instead of sending as a separate message
    const codeBlock = `\`\`\`${language}\n${code}\n\`\`\``;
    setInput(prev => prev + (prev ? '\n\n' : '') + codeBlock);
    setCodeEditorMode(false); // Close the code editor after appending
  };

  const handleCloseCodeEditor = () => {
    setCodeEditorMode(false);
  };

  const chatContent = (
    <div className="flex flex-col h-full">
      {/* Chat Messages */}
      <div className="flex-1 overflow-auto p-4 bg-gray-100">
        <div className="space-y-4">
          {(!messages || messages.length === 0) && !isLoading ? (
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
      
      {/* Problem View */}
      {currentProblem && (
        <div className="border-t bg-white p-4">
          <ProblemView problem={currentProblem} />
        </div>
      )}
      
      {/* Input Area - Always show */}
      <div className="border-t p-4 bg-gray-50 flex items-center gap-2">
        <textarea
          value={input}
          onChange={handleInputChange}
          className="w-full rounded-lg border p-2"
          placeholder="Type your message..."
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          onFocus={() => console.log('Textarea focused')}
          onBlur={() => console.log('Textarea blurred')}
          disabled={isLoading}
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

  if (isCodeEditorMode) {
    return (
      <div className="flex h-screen">
        {/* Chat Section - 50% width */}
        <div className="w-1/2 border-r border-gray-300">
          {chatContent}
        </div>
        
        {/* Code Editor Section - 50% width */}
        <div className="w-1/2">
          <CodeEditor 
            onSend={handleCodeSend}
            onClose={handleCloseCodeEditor}
            isComposer={true}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {chatContent}
    </div>
  );
}; 