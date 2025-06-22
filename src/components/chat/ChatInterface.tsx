"use client";
import { useState, useEffect, useRef } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useChatStore } from '../../store/chatStore';
import { ChatMessage } from './ChatMessage';
import { CodeEditor } from '../code/CodeEditor';

export const ChatInterface = () => {
  const [input, setInput] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const messages = useChatStore((s) => s.messages);
  const sendMessage = useChatStore((s) => s.sendMessage);
  const fetchMessages = useChatStore((s) => s.fetchMessages);
  const clearMessages = useChatStore((s) => s.clearMessages);
  const isLoading = useChatStore((s) => s.isLoading);
  const currentProblem = useChatStore((s) => s.currentProblem);
  const isCodeEditorMode = useChatStore((s) => s.isCodeEditorMode);
  const setCodeEditorMode = useChatStore((s) => s.setCodeEditorMode);
  const hasFetchedMessages = useRef(false);

  // Only fetch messages once when component mounts and user is authenticated
  useEffect(() => {
    if (isAuthenticated && !currentProblem && !hasFetchedMessages.current) {
      hasFetchedMessages.current = true;
      fetchMessages(getAccessTokenSilently).catch(console.error);
    }
  }, [isAuthenticated, currentProblem, fetchMessages, getAccessTokenSilently]);

  // Reset hasFetchedMessages when currentProblem changes
  useEffect(() => {
    hasFetchedMessages.current = false;
  }, [currentProblem]);

  // Handle clicking outside confirmation dialog
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showClearConfirm && !target.closest('.clear-chat-dialog')) {
        setShowClearConfirm(false);
      }
    };

    if (showClearConfirm) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showClearConfirm]);

  // Only trigger code editor mode for new assistant messages
  useEffect(() => {
    if (messages && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'assistant' && !isCodeEditorMode) {
        setCodeEditorMode(true);
      }
    }
  }, [messages, isCodeEditorMode, setCodeEditorMode]); // Only depend on messages length, not the full messages array

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    try {
      await sendMessage(input, getAccessTokenSilently);
      setInput('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleCodeSend = async (code: string, language: string) => {
    const codeMessage = `\`\`\`${language}\n${code}\n\`\`\``;
    try {
      await sendMessage(codeMessage, getAccessTokenSilently);
    } catch (error) {
      console.error('Failed to send code:', error);
    }
  };

  const handleCloseCodeEditor = () => {
    setCodeEditorMode(false);
  };

  const handleClearChat = async () => {
    try {
      await clearMessages(getAccessTokenSilently);
      setShowClearConfirm(false);
    } catch (error) {
      console.error('Failed to clear chat:', error);
    }
  };

  const chatContent = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="glass-card rounded-t-2xl p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 gradient-bg rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">AI Coding Assistant</h2>
              <p className="text-white/70 text-sm">
                {currentProblem ? `Working on: ${currentProblem.title}` : 'Ready to help you code!'}
              </p>
            </div>
          </div>
          
          {/* Clear Chat Button */}
          {messages && messages.length > 0 && (
            <div className="clear-chat-dialog relative">
              <button
                onClick={() => setShowClearConfirm(true)}
                className="flex items-center space-x-2 px-4 py-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-200 border border-white/20 hover:border-white/30"
                disabled={isLoading}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span className="text-sm font-medium">Clear Chat</span>
              </button>
              
              {/* Confirmation Dialog */}
              {showClearConfirm && (
                <div className="clear-chat-dialog absolute right-0 top-12 z-50 glass-card rounded-2xl p-6 border border-white/20 shadow-2xl min-w-80">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Clear Chat History</h3>
                      <p className="text-white/70 text-sm">This action cannot be undone.</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowClearConfirm(false)}
                      className="flex-1 px-4 py-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-200 border border-white/20 hover:border-white/30"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleClearChat}
                      className="flex-1 px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-xl transition-all duration-200 font-medium"
                    >
                      Clear All
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-auto p-6 bg-gradient-to-b from-transparent to-black/10">
        <div className="space-y-6 max-w-4xl mx-auto">
          {(!messages || messages.length === 0) && !isLoading ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 gradient-bg rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Start a Conversation</h3>
              <p className="text-white/70">Ask me anything about coding, algorithms, or interview preparation!</p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div key={msg.id} className={index === messages.length - 1 ? 'animate-slide-in' : ''}>
                <ChatMessage message={msg} />
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-center items-center py-8">
              <div className="flex items-center space-x-3 glass-card rounded-2xl px-6 py-4">
                <div className="spinner w-6 h-6"></div>
                <span className="text-white/90">AI is thinking...</span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Input Area */}
      <div className="glass-card rounded-b-2xl p-6 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end space-x-4">
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full input bg-white/10 border-white/20 text-white placeholder-white/50 resize-none rounded-2xl px-6 py-4 pr-12 focus:bg-white/15 focus:border-primary-400/50"
                placeholder="Type your message or ask a coding question..."
                rows={1}
                onKeyDown={(e) => { 
                  if (e.key === 'Enter' && !e.shiftKey) { 
                    e.preventDefault(); 
                    handleSend(); 
                  } 
                }}
                disabled={isLoading}
                style={{
                  minHeight: '60px',
                  maxHeight: '200px'
                }}
              />
              <div className="absolute bottom-3 right-3 text-white/50 text-xs">
                Enter to send, Shift+Enter for new line
              </div>
            </div>
            <button
              className="btn-primary px-6 py-4 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
            >
              {isLoading ? (
                <div className="spinner w-5 h-5"></div>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (isCodeEditorMode) {
    return (
      <div className="flex h-full">
        {/* Chat Section - 50% width */}
        <div className="w-1/2 border-r border-white/10 h-full">
          {chatContent}
        </div>
        
        {/* Code Editor Section - 50% width */}
        <div className="w-1/2 bg-black/20 h-full">
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
    <div className="flex flex-col h-full">
      {chatContent}
    </div>
  );
}; 