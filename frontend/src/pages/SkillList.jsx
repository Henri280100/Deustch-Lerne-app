import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../api";
import LevelShape, { levelLabel } from "../components/LevelShape";

export default function SkillList() {
  const { level, skill } = useParams();
  const { token } = useAuth();
  const [lessons, setLessons] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([api.listLessons(token, { level, skill }), api.getProgress(token)])
      .then(([lessonData, progressData]) => {
        if (cancelled) return;
        setLessons(lessonData.lessons);
        setProgress(progressData.progress);
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [token, level, skill]);

  if (loading) return <div className="container page-loading">Loading lessons…</div>;

  const progressById = Object.fromEntries(progress.map((p) => [p.lesson_id, p]));

  return (
    <div className="container">
      <section style={{ paddingTop: 40, paddingBottom: 80 }}>
        <div className="breadcrumb">
          <Link to="/dashboard">Dashboard</Link> / {levelLabel(level)} / <span style={{ textTransform: "capitalize" }}>{skill}</span>
        </div>
        <h1 style={{ display: "flex", alignItems: "center", gap: 12, fontSize: "1.7rem", marginBottom: 8 }}>
          <LevelShape level={level} size={20} />
          <span style={{ textTransform: "capitalize" }}>{skill}</span> — {levelLabel(level)}
        </h1>
        <p style={{ color: "var(--ink-soft)", marginBottom: 32 }}>
          {lessons.length} lesson{lessons.length === 1 ? "" : "s"} in this section.
        </p>

        {lessons.length === 0 ? (
          <div className="empty-state">No lessons here yet — check back soon.</div>
        ) : (
          <div>
            {lessons.map((lesson) => {
              const p = progressById[lesson.id];
              return (
                <Link className="lesson-row" to={`/lesson/${lesson.id}`} key={lesson.id}>
                  <div>
                    <div className="lesson-row-title">{lesson.title}</div>
                    <div className="lesson-row-summary">{lesson.summary}</div>
                  </div>
                  <div className={`lesson-status ${p?.completed ? "done" : ""}`}>
                    {p?.completed ? `Done · ${p.score ?? "—"}%` : "Not started"}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
