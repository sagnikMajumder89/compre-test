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
  { label: "Set 20", file: "/assets/questions20.json" },
  { label: "Set 21", file: "/assets/questions21.json" },
  { label: "Set 22", file: "/assets/questions22.json" },
  { label: "Set 23", file: "/assets/questions23.json" },
  { label: "Set 24", file: "/assets/questions24.json" },
  { label: "Set 25", file: "/assets/questions25.json" },
  { label: "Set 26", file: "/assets/questions26.json" },
  { label: "Set 27", file: "/assets/questions27.json" },
  { label: "Set 28", file: "/assets/questions28.json" },
  { label: "Set 29", file: "/assets/questions29.json" },
  { label: "Set 30", file: "/assets/questions30.json" },
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

  const handleLargeQuiz = async () => {
    setLoading(true);
    try {
      // Fetch all sets 1-20 in parallel
      const files = quizSets.slice(0, 20).map((s) => s.file);
      const responses = await Promise.all(files.map((file) => fetch(file)));
      const allQuestionsArrays = await Promise.all(responses.map((res) => res.json()));
      // Flatten all questions into one array
      const combinedQuestions = allQuestionsArrays.flat();
      setQuestions(combinedQuestions);
      setSelectedSet("Large Quiz (Sets 1-20)");
    } catch {
      setQuestions([]);
    }
    setLoading(false);
  };

  const handleRestart = () => {
    setMode(null);
    setSelectedSet(null);
    setQuestions([]);
  };

  if (!mode) {
    return (
      <div>
        <QuizModeSelector onSelectMode={handleSelectMode} />
      </div>
    );
  }

  if (!selectedSet) {
    return (
      <div>
        <QuizSetSelector
          sets={quizSets.map((s) => s.label)}
          onSelectSet={handleSelectSet}
          loading={loading}
        />
        <div className="mt-6 flex justify-center">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={handleLargeQuiz}
            disabled={loading}
          >
            {loading ? "Loading Large Quiz..." : "Take Large Quiz (Sets 1-20)"}
          </button>
        </div>
      </div>
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