import type { Problem } from '../../types/chat';

export const ProblemView = ({ problem }: { problem: Problem }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <h2 className="text-2xl font-bold mb-2">{problem.title}</h2>
      <div className="mb-2 text-gray-700">{problem.description}</div>
      <div className="flex gap-4 text-sm text-gray-500 mt-2">
        <span>Topic: {problem.topic}</span>
        <span>Complexity: {problem.complexity}</span>
        {problem.isCustom && <span className="text-blue-500">Custom</span>}
      </div>
    </div>
  );
}; 