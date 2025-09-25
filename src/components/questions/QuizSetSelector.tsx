import React from "react";

interface QuizSetSelectorProps {
  sets: string[];
  onSelectSet: (set: string) => void;
}

export const QuizSetSelector: React.FC<QuizSetSelectorProps> = ({
  sets,
  onSelectSet,
}) => {
  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <h2 className="text-2xl font-bold mb-4">Select Quiz Set</h2>
      {sets.map((set, idx) => (
        <button
          key={set}
          className="px-6 py-3 bg-purple-500 text-white rounded hover:bg-purple-600"
          onClick={() => onSelectSet(set)}
        >
          Set {idx + 1}
        </button>
      ))}
    </div>
  );
};
