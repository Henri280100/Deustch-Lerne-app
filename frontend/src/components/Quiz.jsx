import { useState } from "react";

// questions: [{ question, options, answerIndex }]
// onFinish(scorePercent) is called once, when the learner submits.
export default function Quiz({ questions, onFinish }) {
  const [answers, setAnswers] = useState(() => Array(questions.length).fill(null));
  const [submitted, setSubmitted] = useState(false);

  const allAnswered = answers.every((a) => a !== null);

  function selectAnswer(qIndex, optionIndex) {
    if (submitted) return;
    setAnswers((prev) => {
      const next = [...prev];
      next[qIndex] = optionIndex;
      return next;
    });
  }

  function submit() {
    const correctCount = questions.reduce(
      (sum, q, i) => sum + (answers[i] === q.answerIndex ? 1 : 0),
      0
    );
    const pct = Math.round((correctCount / questions.length) * 100);
    setSubmitted(true);
    onFinish(pct);
  }

  return (
    <div>
      {questions.map((q, qIndex) => (
        <div className="quiz-question" key={qIndex}>
          <p className="q-text">{q.question}</p>
          {q.options.map((option, oIndex) => {
            let className = "quiz-option";
            if (answers[qIndex] === oIndex) className += " selected";
            if (submitted && oIndex === q.answerIndex) className += " correct";
            if (submitted && answers[qIndex] === oIndex && oIndex !== q.answerIndex) {
              className += " incorrect";
            }
            return (
              <div
                key={oIndex}
                className={className}
                onClick={() => selectAnswer(qIndex, oIndex)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && selectAnswer(qIndex, oIndex)}
              >
                {option}
              </div>
            );
          })}
        </div>
      ))}
      {!submitted && (
        <button className="btn btn-primary" onClick={submit} disabled={!allAnswered}>
          Check answers
        </button>
      )}
      {submitted && (
        <p style={{ color: "var(--ink-soft)" }}>
          Nice work — your result has been saved to your progress.
        </p>
      )}
    </div>
  );
}
