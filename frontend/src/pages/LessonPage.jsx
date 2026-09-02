import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../api";
import { levelLabel } from "../components/LevelShape";
import GrammarExercise from "../components/GrammarExercise";
import ReadingExercise from "../components/ReadingExercise";
import ListeningExercise from "../components/ListeningExercise";
import SpeakingExercise from "../components/SpeakingExercise";
import WritingExercise from "../components/WritingExercise";

const EXERCISE_BY_SKILL = {
  grammar: GrammarExercise,
  reading: ReadingExercise,
  listening: ListeningExercise,
  speaking: SpeakingExercise,
  writing: WritingExercise
};

export default function LessonPage() {
  const { id } = useParams();
  const { token } = useAuth();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setResult(null);
    api
      .getLesson(token, id)
      .then((data) => !cancelled && setLesson(data.lesson))
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [token, id]);

  async function handleFinish(score) {
    setResult(score);
    try {
      await api.saveProgress(token, { lessonId: id, completed: true, score });
    } catch {
      // progress will simply not be saved this time; the learner still sees their result
    }
  }

  if (loading) return <div className="container page-loading">Loading lesson…</div>;
  if (error) return <div className="container"><div className="form-error" style={{ marginTop: 40 }}>{error}</div></div>;
  if (!lesson) return null;

  const Exercise = EXERCISE_BY_SKILL[lesson.skill];

  return (
    <div className="container">
      <div className="lesson-header">
        <div className="breadcrumb">
          <Link to="/dashboard">Dashboard</Link> /{" "}
          <Link to={`/learn/${lesson.level}/${lesson.skill}`}>
            {levelLabel(lesson.level)} · <span style={{ textTransform: "capitalize" }}>{lesson.skill}</span>
          </Link>
        </div>
        <h1 style={{ fontSize: "1.6rem" }}>{lesson.title}</h1>
      </div>

      <div className="lesson-body">
        {result !== null && (
          <div className="form-success">
            Lesson complete — score: {result}%.{" "}
            <Link to={`/learn/${lesson.level}/${lesson.skill}`}>Back to {lesson.skill} lessons</Link>
          </div>
        )}
        {Exercise ? (
          <Exercise content={lesson.content} onFinish={handleFinish} />
        ) : (
          <p>This lesson type isn't supported yet.</p>
        )}
      </div>
    </div>
  );
}
