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
    <div className="h-full flex flex-col bg-gray-900 border-l border-gray-700">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-700 bg-gray-800">
        <div className="flex items-center space-x-4">
          <h3 className="text-white font-semibold text-lg">Code Editor</h3>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="rounded-md border border-gray-600 bg-gray-700 text-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value}>{lang.label}</option>
            ))}
          </select>
        </div>
        <div className="flex space-x-2">
          {!isComposer && onRun && (
            <button
              onClick={handleRun}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
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
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
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
              className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
      
      {/* Editor */}
      <div className="flex-1">
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