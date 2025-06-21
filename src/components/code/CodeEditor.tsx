"use client";
import { useState } from 'react';
import MonacoEditor from '@monaco-editor/react';

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'csharp', label: 'C#' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'typescript', label: 'TypeScript' },
];

interface CodeEditorProps {
  onRun?: (code: string, language: string) => void;
  onSend?: (code: string, language: string) => void;
  onClose?: () => void;
  isComposer?: boolean;
}

export const CodeEditor = ({ onRun, onSend, onClose, isComposer = false }: CodeEditorProps) => {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');

  const handleRun = () => {
    if (onRun) onRun(code, language);
  };

  const handleSend = () => {
    if (onSend && code.trim()) {
      onSend(code, language);
      setCode(''); // Clear the editor after sending
    }
  };

  return (
    <div className="h-full flex flex-col glass-card rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-white/10 bg-black/20">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">Code Editor</h3>
            <p className="text-white/50 text-sm">Write and test your solutions</p>
          </div>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="glass-card rounded-xl border border-white/20 text-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400/50 transition-all duration-300"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value}>{lang.label}</option>
            ))}
          </select>
        </div>
        <div className="flex space-x-3">
          {!isComposer && onRun && (
            <button
              onClick={handleRun}
              className="btn-primary px-4 py-2 text-sm flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Run</span>
            </button>
          )}
          {isComposer && onSend && (
            <button
              onClick={handleSend}
              disabled={!code.trim()}
              className="btn-primary px-6 py-2 text-sm flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              <span>Send</span>
            </button>
          )}
          {isComposer && onClose && (
            <button
              onClick={onClose}
              className="btn-secondary px-4 py-2 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
      
      {/* Editor */}
      <div className="flex-1 bg-black/40">
        <MonacoEditor
          height="100%"
          defaultLanguage={language}
          language={language}
          value={code}
          onChange={(val) => setCode(val || '')}
          theme="vs-dark"
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            wordWrap: 'on',
            lineNumbers: 'on',
            roundedSelection: false,
            scrollbar: {
              vertical: 'visible',
              horizontal: 'visible',
            },
            folding: true,
            foldingStrategy: 'indentation',
            showFoldingControls: 'always',
            renderLineHighlight: 'all',
            selectOnLineNumbers: true,
            glyphMargin: true,
            contextmenu: true,
            mouseWheelZoom: true,
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
          }}
        />
      </div>
    </div>
  );
}; 