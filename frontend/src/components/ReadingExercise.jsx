import Quiz from "./Quiz";

export default function ReadingExercise({ content, onFinish }) {
  return (
    <div>
      <div className="passage-box">{content.passage}</div>
      <Quiz questions={content.quiz} onFinish={onFinish} />
    </div>
  );
}
