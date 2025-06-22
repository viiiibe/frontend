import { useState } from 'react';
import type { ThinkingProcessData, ThinkingTurn, ToolCall, ToolResult } from '../../types/chat';

interface ThinkingProcessProps {
  thinkingProcess: ThinkingProcessData;
}

export const ThinkingProcess = ({ thinkingProcess }: ThinkingProcessProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedTurns, setExpandedTurns] = useState<Set<string>>(new Set());

  const toggleTurn = (turnNumber: string | number) => {
    const newExpandedTurns = new Set(expandedTurns);
    const id = turnNumber.toString();
    if (newExpandedTurns.has(id)) {
      newExpandedTurns.delete(id);
    } else {
      newExpandedTurns.add(id);
    }
    setExpandedTurns(newExpandedTurns);
  };

  const formatProcessingTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const renderToolCall = (toolCall: ToolCall, toolResult: ToolResult, turnNumber: number, toolIndex: number) => {
    const uniqueId = `${turnNumber}-${toolIndex}`;
    const isExpanded = expandedTurns.has(uniqueId);
    
    return (
      <div key={toolCall.id} className="mb-3">
        <button
          onClick={() => toggleTurn(uniqueId)}
          className="w-full text-left flex items-center justify-between p-3 bg-black/30 rounded-lg hover:bg-black/40 transition-colors"
        >
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${toolResult.success ? 'bg-green-400' : 'bg-red-400'}`} />
            <span className="text-white/90 font-mono text-sm">{toolCall.function.name}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-white/50 text-xs">
              {toolResult.success ? 'Success' : 'Failed'}
            </span>
            <svg
              className={`w-4 h-4 text-white/50 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>
        
        {isExpanded && (
          <div className="mt-2 p-3 bg-black/20 rounded-lg border border-white/10">
            <div className="space-y-3">
              <div>
                <h4 className="text-white/80 text-sm font-semibold mb-1">Arguments:</h4>
                <pre className="text-xs text-white/60 bg-black/40 p-2 rounded overflow-x-auto">
                  {JSON.stringify(JSON.parse(toolCall.function.arguments), null, 2)}
                </pre>
              </div>
              
              <div>
                <h4 className="text-white/80 text-sm font-semibold mb-1">Result:</h4>
                <pre className="text-xs text-white/60 bg-black/40 p-2 rounded overflow-x-auto">
                  {JSON.stringify(toolResult.result, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderTurn = (turn: ThinkingTurn) => {
    const isExpanded = expandedTurns.has(turn.turnNumber.toString());
    
    return (
      <div key={turn.turnNumber} className="mb-4">
        <button
          onClick={() => toggleTurn(turn.turnNumber)}
          className="w-full text-left flex items-center justify-between p-3 bg-black/20 rounded-lg hover:bg-black/30 transition-colors border border-white/10"
        >
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-primary-500/20 rounded-full flex items-center justify-center">
              <span className="text-primary-300 text-xs font-bold">{turn.turnNumber}</span>
            </div>
            <div>
              <h3 className="text-white/90 font-semibold">Turn {turn.turnNumber}</h3>
              <p className="text-white/50 text-xs">
                {turn.toolCalls.length} tool calls • {new Date(turn.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
          <svg
            className={`w-5 h-5 text-white/50 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {isExpanded && (
          <div className="mt-3 space-y-4">
            {turn.assistantMessage && (
              <div className="p-3 bg-black/10 rounded-lg border border-white/5">
                <h4 className="text-white/80 text-sm font-semibold mb-2">Assistant Message:</h4>
                <p className="text-white/70 text-sm whitespace-pre-wrap">{turn.assistantMessage}</p>
              </div>
            )}
            
            {turn.toolCalls.length > 0 && (
              <div>
                <h4 className="text-white/80 text-sm font-semibold mb-2">Tool Calls:</h4>
                <div className="space-y-2">
                  {turn.toolCalls.map((toolCall, index) => 
                    renderToolCall(toolCall, turn.toolResults[index], turn.turnNumber, index)
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="mt-4 border-t border-white/10 pt-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left flex items-center justify-between p-3 bg-black/20 rounded-lg hover:bg-black/30 transition-colors border border-white/10"
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary-500/20 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h3 className="text-white/90 font-semibold">Thinking Process</h3>
            <p className="text-white/50 text-xs">
              {thinkingProcess.totalTurns} turns • {thinkingProcess.totalToolCalls} tool calls • {formatProcessingTime(thinkingProcess.processingTimeMs)}
            </p>
          </div>
        </div>
        <svg
          className={`w-5 h-5 text-white/50 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isExpanded && (
        <div className="mt-3 space-y-3">
          {thinkingProcess.turns.map(renderTurn)}
        </div>
      )}
    </div>
  );
}; 