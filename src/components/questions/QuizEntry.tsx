import React, { useState } from "react";
import { QuizModeSelector } from "./QuizModeSelector";
import { QuizSetSelector } from "./QuizSetSelector";
import { QuestionComponent } from "./Question";
import type { Question } from "./Question";

const quizSets = [
  { label: "Set 1", file: "/assets/questions1.json" },
  { label: "Set 2", file: "/assets/questions2.json" },
  { label: "Set 3", file: "/assets/questions3.json" },
  { label: "Set 4", file: "/assets/questions4.json" },
  { label: "Set 5", file: "/assets/questions5.json" },
  { label: "Set 6", file: "/assets/questions6.json" },
  { label: "Set 7", file: "/assets/questions7.json" },
  { label: "Set 8", file: "/assets/questions8.json" },
  { label: "Set 9", file: "/assets/questions9.json" },
  { label: "Set 10", file: "/assets/questions10.json" },
  { label: "Set 11", file: "/assets/questions11.json" },
  { label: "Set 12", file: "/assets/questions12.json" },
  { label: "Set 13", file: "/assets/questions13.json" },
  { label: "Set 14", file: "/assets/questions14.json" },
  { label: "Set 15", file: "/assets/questions15.json" },
  { label: "Set 16", file: "/assets/questions16.json" },
  { label: "Set 17", file: "/assets/questions17.json" },
  { label: "Set 18", file: "/assets/questions18.json" },
  { label: "Set 19", file: "/assets/questions19.json" },
];

export const QuizEntry: React.FC = () => {
  const [mode, setMode] = useState<"practice" | "test" | null>(null);
  const [selectedSet, setSelectedSet] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSelectMode = (selectedMode: "practice" | "test") => {
    setMode(selectedMode);
  };

  const handleSelectSet = async (setLabel: string) => {
    setLoading(true);
    const setObj = quizSets.find((s) => s.label === setLabel);
    if (setObj) {
      try {
        const res = await fetch(setObj.file);
        const data = await res.json();
        setQuestions(data);
        setSelectedSet(setLabel);
      } catch {
        setQuestions([]);
      }
    }
    setLoading(false);
  };

  const handleRestart = () => {
    setMode(null);
    setSelectedSet(null);
    setQuestions([]);
  };

  if (!mode) {
    return <QuizModeSelector onSelectMode={handleSelectMode} />;
  }

  if (!selectedSet) {
    return (
      <QuizSetSelector
        sets={quizSets.map((s) => s.label)}
        onSelectSet={handleSelectSet}
      />
    );
  }

  if (loading) {
    return <div className="p-8 text-center">Loading questions...</div>;
  }

  return (
    <QuestionComponent
      questions={questions}
      mode={mode as "practice" | "test"}
      onRestart={handleRestart}
    />
  );
};
