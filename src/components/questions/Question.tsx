import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CheckCircle2, XCircle } from "lucide-react";

export interface Question {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

interface QuestionComponentProps {
  questions: Question[];
  mode: "practice" | "test";
  onRestart: () => void;
}

export const QuestionComponent: React.FC<QuestionComponentProps> = ({
  questions,
  mode,
  onRestart,
}) => {
  // Shuffle array utility
  function shuffle<T>(array: T[]): T[] {
    const arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Shuffle questions and options once per quiz
  const [quizSeed] = useState(() => Math.random());
  const shuffledQuestions = useMemo(() => {
    // Seeded shuffle for reproducibility if needed
    const shuffled = shuffle(questions);
    return shuffled.map((q) => {
      const optionShuffle = shuffle(q.options);
      // Find new index of correct answer
      const newAnswer = optionShuffle.findIndex(
        (opt) => opt === q.options[q.answer]
      );
      return {
        ...q,
        options: optionShuffle,
        answer: newAnswer,
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions, quizSeed]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, number>
  >({});
  const [quizFinished, setQuizFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleAnswerSelect = (answerIndex: number) => {
    const updatedAnswers = {
      ...selectedAnswers,
      [currentQuestionIndex]: answerIndex,
    };
    setSelectedAnswers(updatedAnswers);

    if (mode === "practice") {
      setShowFeedback(true);
    } else {
      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
          finishQuiz(updatedAnswers);
        }
      }, 300);
    }
  };

  const finishQuiz = (finalAnswers = selectedAnswers) => {
    let finalScore = 0;
    shuffledQuestions.forEach((question, index) => {
      if (finalAnswers[index] === question.answer) {
        ++finalScore;
      }
    });
    setScore(finalScore);
    setQuizFinished(true);
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setQuizFinished(false);
    setScore(0);
    setShowFeedback(false);
    onRestart();
  };

  if (!shuffledQuestions || shuffledQuestions.length === 0) {
    return <div>Loading questions...</div>;
  }

  const progress =
    ((currentQuestionIndex + 1) / shuffledQuestions.length) * 100;

  const cardVariants = {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50 },
  };

  return (
    <div className="flex flex-col items-center w-2/3 justify-center px-1 py-2 md:p-8">
      <AnimatePresence mode="wait">
        {quizFinished ? (
          <motion.div
            key="results"
            variants={cardVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.5 }}
            className="w-full max-w-2xl"
          >
            <Card>
              <CardHeader>
                <CardTitle>Quiz Results</CardTitle>
                <CardDescription>
                  You scored {score} out of {shuffledQuestions.length}!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {shuffledQuestions.map((question, index) => {
                    const userAnswer = selectedAnswers[index];
                    const isCorrect = userAnswer === question.answer;
                    return (
                      <AccordionItem value={`item-${index}`} key={index}>
                        <AccordionTrigger>
                          <div className="flex items-center gap-2">
                            {isCorrect ? (
                              <CheckCircle2 className="text-green-500" />
                            ) : (
                              <XCircle className="text-red-500" />
                            )}
                            <span className="text-left">
                              {question.question}
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <p>Your answer: {question.options[userAnswer]}</p>
                          {!isCorrect && (
                            <p className="text-green-500">
                              Correct answer:{" "}
                              {question.options[question.answer]}
                            </p>
                          )}
                          <p className="mt-2 text-sm text-muted-foreground">
                            <strong>Explanation:</strong> {question.explanation}
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </CardContent>
              <CardFooter>
                <Button onClick={restartQuiz}>Restart Quiz</Button>
              </CardFooter>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key={currentQuestionIndex}
            variants={cardVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="w-full max-w-2xl"
          >
            <Card>
              <CardHeader>
                <CardTitle>
                  Question {currentQuestionIndex + 1} of{" "}
                  {shuffledQuestions.length}
                </CardTitle>
                <CardDescription className="pt-4 text-lg">
                  {shuffledQuestions[currentQuestionIndex].question}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {shuffledQuestions[currentQuestionIndex].options.map(
                  (option, index) => {
                    const selected =
                      selectedAnswers[currentQuestionIndex] === index;
                    const correct =
                      shuffledQuestions[currentQuestionIndex].answer === index;
                    return (
                      <Button
                        key={index}
                        variant="outline"
                        className={`cursor-pointer justify-start h-auto py-3 text-left whitespace-normal ${
                          showFeedback && selected
                            ? correct
                              ? "border-green-500"
                              : "border-red-500"
                            : ""
                        }`}
                        onClick={() =>
                          !showFeedback && handleAnswerSelect(index)
                        }
                        disabled={showFeedback}
                      >
                        {option}
                        {showFeedback && selected && (
                          <span
                            className={`ml-2 font-bold ${
                              correct ? "text-green-500" : "text-red-500"
                            }`}
                          >
                            {correct ? " (Correct)" : " (Wrong)"}
                          </span>
                        )}
                      </Button>
                    );
                  }
                )}
                {mode === "practice" && showFeedback && (
                  <div className="mt-4">
                    {(() => {
                      const userAnswer = selectedAnswers[currentQuestionIndex];
                      const correctAnswer =
                        shuffledQuestions[currentQuestionIndex].answer;
                      if (userAnswer !== correctAnswer) {
                        return (
                          <p className="text-green-500 mb-2">
                            Correct answer:{" "}
                            {
                              shuffledQuestions[currentQuestionIndex].options[
                                correctAnswer
                              ]
                            }
                          </p>
                        );
                      }
                      return null;
                    })()}
                    <p className="text-sm text-muted-foreground">
                      <strong>Explanation:</strong>{" "}
                      {shuffledQuestions[currentQuestionIndex].explanation}
                    </p>
                    <Button
                      className="mt-2"
                      onClick={() => {
                        setShowFeedback(false);
                        if (
                          currentQuestionIndex <
                          shuffledQuestions.length - 1
                        ) {
                          setCurrentQuestionIndex(currentQuestionIndex + 1);
                        } else {
                          finishQuiz(selectedAnswers);
                        }
                      }}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex-col items-start gap-2">
                <p className="text-sm text-muted-foreground">
                  Select an answer to proceed.
                </p>
                <Progress value={progress} className="w-full" />
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
