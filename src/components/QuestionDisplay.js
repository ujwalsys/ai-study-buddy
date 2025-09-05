import React, { useState } from 'react';

const QuestionDisplay = ({ questions }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswerSelect = (questionId, answer) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: answer
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correct_answer) {
        correct++;
      }
    });
    return correct;
  };

  if (questions.length === 0) {
    return <div>No questions generated yet.</div>;
  }

  const question = questions[currentQuestion];

  return (
    <div className="question-container">
      {!showResults ? (
        <>
          {/* Progress Bar */}
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Question Header */}
          <div className="question-header">
            <h3>Question {currentQuestion + 1} of {questions.length}</h3>
          </div>

          {/* Question Content */}
          <div className="question-content">
            <p className="question-text">{question.question}</p>

            {/* Answer Options */}
            <div className="options-container">
              {Object.entries(question.options).map(([key, value]) => (
                <label key={key} className="option-label">
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={key}
                    checked={selectedAnswers[question.id] === key}
                    onChange={() => handleAnswerSelect(question.id, key)}
                  />
                  <span className="option-text">{key}. {value}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="navigation-buttons">
            <button 
              onClick={handlePrevious} 
              disabled={currentQuestion === 0}
              className="nav-button"
            >
              Previous
            </button>

            {currentQuestion === questions.length - 1 ? (
              <button onClick={handleSubmit} className="submit-button">
                Submit Quiz
              </button>
            ) : (
              <button onClick={handleNext} className="nav-button">
                Next
              </button>
            )}
          </div>
        </>
      ) : (
        /* Results View */
        <div className="results-container">
          <h2>Quiz Results</h2>
          <div className="score-display">
            <p className="score-text">
              You scored {calculateScore()} out of {questions.length}
            </p>
            <p className="percentage">
              {Math.round((calculateScore() / questions.length) * 100)}%
            </p>
          </div>

          {/* Answer Review */}
          <div className="answer-review">
            {questions.map((q, index) => (
              <div key={q.id} className="review-item">
                <p className="review-question">
                  {index + 1}. {q.question}
                </p>
                <p className={`review-answer ${
                  selectedAnswers[q.id] === q.correct_answer ? 'correct' : 'incorrect'
                }`}>
                  Your answer: {selectedAnswers[q.id] || 'Not answered'} 
                  {selectedAnswers[q.id] !== q.correct_answer && 
                    ` (Correct: ${q.correct_answer})`
                  }
                </p>
                {q.explanation && (
                  <p className="review-explanation">
                    Explanation: {q.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>

          <button 
            onClick={() => window.location.reload()} 
            className="new-quiz-button"
          >
            Start New Quiz
          </button>
        </div>
      )}
    </div>
  );
};

export default QuestionDisplay;
