import Quiz from "./Quiz";

export default function GrammarExercise({ content, onFinish }) {
  return (
    <div>
      <div className="explanation-box">
        <p>{content.explanation}</p>
        {content.examples?.map((ex, i) => (
          <div className="example-row" key={i}>
            <span className="example-de">{ex.de}</span>
            <span className="example-en">{ex.en}</span>
          </div>
        ))}
      </div>
      <Quiz questions={content.quiz} onFinish={onFinish} />
    </div>
  );
}
