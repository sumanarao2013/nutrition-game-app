"use client";

import React, { useState } from "react";
import { Star, RotateCcw } from "lucide-react";

const NutritionGame = () => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Set<number>>(new Set());
  const [gameCompleted, setGameCompleted] = useState(false);

  const levels = [
    {
      question: "Find the total Calories in this snack!",
      label: {
        servingSize: "1 cup (228g)",
        calories: 250,
        fat: "8g",
        protein: "12g",
      },
      options: [150, 250, 350],
      correct: 250,
      hint: "Look for the big number at the top of the label!",
    },
    {
      question: "How many servings are in this container?",
      label: {
        servingSize: "1 cup (228g)",
        servingsPerContainer: 2,
        calories: 250,
        fat: "8g",
      },
      options: [1, 2, 3],
      correct: 2,
      hint: "Check the 'Servings Per Container' line!",
    },
    {
      question: "Is this food high in protein?",
      label: {
        servingSize: "1 cup (228g)",
        calories: 250,
        protein: "20g",
        dailyValueProtein: "40%",
      },
      options: ["Yes!", "No"],
      correct: "Yes!",
      hint: "If it has more than 20% of your daily value, it's high!",
    },
    {
      question: "If you eat the whole container, how many calories will you consume?",
      label: {
        servingSize: "1 cup (228g)",
        servingsPerContainer: 2,
        calories: 250,
        sugar: "14g",
        totalFat: "8g",
      },
      options: [250, 400, 500],
      correct: 500,
      hint: "Remember to multiply calories by number of servings!",
    },
    {
      question: "This snack is low in sugar. True or False?",
      label: {
        servingSize: "1 cup (228g)",
        calories: 250,
        sugar: "14g",
        dailyValueSugar: "28%",
      },
      options: ["True", "False"],
      correct: "False",
      hint: "If daily value is more than 20%, it's considered high!",
    },
  ];

  const handleAnswer = (answer: number | string) => {
    const isAnswerCorrect = answer === levels[currentLevel].correct;
    setIsCorrect(isAnswerCorrect);
    setShowFeedback(true);

    if (isAnswerCorrect && !answeredCorrectly.has(currentLevel)) {
      setScore(score + 1);
      setAnsweredCorrectly((prev) => new Set(prev).add(currentLevel));
    }

    setTimeout(() => {
      setShowFeedback(false);
      if (currentLevel < levels.length - 1 && isAnswerCorrect) {
        setCurrentLevel(currentLevel + 1);
      } else if (currentLevel === levels.length - 1 && isAnswerCorrect) {
        setGameCompleted(true);
      }
    }, 2000);
  };

  const handleRestart = () => {
    setCurrentLevel(0);
    setScore(0);
    setShowFeedback(false);
    setIsCorrect(false);
    setAnsweredCorrectly(new Set());
    setGameCompleted(false);
  };

  const currentQuestion = levels[currentLevel];

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Star className="text-yellow-400" />
          <span className="text-xl font-bold">Score: {score}</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            Level {currentLevel + 1} of {levels.length}
          </div>
          <button
            onClick={handleRestart}
            className="flex items-center gap-1 px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Restart
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="bg-white p-4 rounded-lg border-2 border-gray-200 mb-4">
          <h3 className="text-lg font-bold mb-2">Nutrition Facts</h3>
          <div className="border-b-2 border-black pb-2">
            <div>Serving Size {currentQuestion.label.servingSize}</div>
            {currentQuestion.label.servingsPerContainer && (
              <div>Servings Per Container {currentQuestion.label.servingsPerContainer}</div>
            )}
          </div>
          <div className="text-3xl font-bold my-2">
            Calories {currentQuestion.label.calories}
          </div>
          <div className="border-t-2 border-black pt-2">
            {Object.entries(currentQuestion.label)
              .filter(([key]) => !["servingSize", "calories", "servingsPerContainer"].includes(key))
              .map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="capitalize">{key}</span>
                  <span>{value}</span>
                </div>
              ))}
          </div>
        </div>

        <div className="text-center mb-4">
          <h2 className="text-xl font-bold mb-2">{currentQuestion.question}</h2>
          <p className="text-sm text-gray-600">
            Hint: {currentQuestion.hint}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {currentQuestion.options.map((option) => (
            <button
              key={option}
              onClick={() => handleAnswer(option)}
              className={`p-4 text-lg rounded-lg text-white ${
                showFeedback && option === currentQuestion.correct
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {showFeedback && (
        <div
          className={`text-center p-4 rounded-lg ${
            isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            {isCorrect ? (
              // eslint-disable-next-line react/no-unescaped-entities
              <span className="font-bold">Great job! That's correct!</span>
            ) : (
              // eslint-disable-next-line react/no-unescaped-entities
              <span className="font-bold">Try again! You can do it!</span>
            )}
          </div>
        </div>
      )}

      {gameCompleted && score === levels.length && (
        <div className="text-center mt-4 p-4 bg-yellow-100 rounded-lg">
          <h3 className="text-xl font-bold text-yellow-800">🎉 Congratulations! 🎉</h3>
          <p>You're a Nutrition Label Expert!</p>
          <p className="mt-2">You got all {levels.length} questions correct!</p>
          <button
            onClick={handleRestart}
            className="mt-4 px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors flex items-center gap-2 mx-auto"
          >
            <RotateCcw className="w-4 h-4" />
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default NutritionGame;
