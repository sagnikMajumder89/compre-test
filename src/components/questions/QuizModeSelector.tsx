import React from "react";

interface QuizModeSelectorProps {
  onSelectMode: (mode: "practice" | "test") => void;
}

export const QuizModeSelector: React.FC<QuizModeSelectorProps> = ({
  onSelectMode,
}) => {
  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <h2 className="text-2xl font-bold mb-4">Select Quiz Mode</h2>
      <button
        className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => onSelectMode("practice")}
      >
        Practice Mode
      </button>
      <button
        className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600"
        onClick={() => onSelectMode("test")}
      >
        Test Mode
      </button>
    </div>
  );
};
