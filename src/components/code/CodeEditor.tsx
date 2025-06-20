"use client";
import { useState } from 'react';
import MonacoEditor from '@monaco-editor/react';

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
];

export const CodeEditor = ({ onRun }: { onRun?: (code: string, language: string) => void }) => {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');

  const handleRun = () => {
    if (onRun) onRun(code, language);
  };

  return (
    <div className="h-96 flex flex-col border rounded-lg overflow-hidden">
      <div className="flex justify-between items-center p-2 border-b bg-gray-50">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="rounded border p-1"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.value} value={lang.value}>{lang.label}</option>
          ))}
        </select>
        <button
          onClick={handleRun}
          className="bg-green-500 text-white px-4 py-1 rounded"
        >
          Run Code
        </button>
      </div>
      <div className="flex-1">
        <MonacoEditor
          height="100%"
          defaultLanguage={language}
          language={language}
          value={code}
          onChange={(val) => setCode(val || '')}
          theme="vs-dark"
          options={{ fontSize: 14, minimap: { enabled: false } }}
        />
      </div>
    </div>
  );
}; 