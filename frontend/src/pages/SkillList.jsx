import { useEffect, useMemo, useState } from "react";
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
  const [query, setQuery] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setQuery("");
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

  const progressById = useMemo(
    () => Object.fromEntries(progress.map((p) => [p.lesson_id, p])),
    [progress]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return lessons;
    return lessons.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        l.summary.toLowerCase().includes(q) ||
        (l.topic && l.topic.toLowerCase().includes(q))
    );
  }, [lessons, query]);

  // Lessons with no `topic` (the hand-written core lessons) render as a flat
  // list up top; everything else groups under its topic heading so a skill
  // with 100+ generated lessons stays browsable.
  const { ungrouped, groups, groupOrder } = useMemo(() => {
    const ungrouped = [];
    const groups = {};
    const groupOrder = [];
    for (const lesson of filtered) {
      if (!lesson.topic) {
        ungrouped.push(lesson);
        continue;
      }
      if (!groups[lesson.topic]) {
        groups[lesson.topic] = [];
        groupOrder.push(lesson.topic);
      }
      groups[lesson.topic].push(lesson);
    }
    return { ungrouped, groups, groupOrder };
  }, [filtered]);

  if (loading) return <div className="container page-loading">Loading lessons…</div>;

  const completedCount = lessons.filter((l) => progressById[l.id]?.completed).length;

  function renderRow(lesson) {
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
  }

  return (
    <div className="container">
      <section style={{ paddingTop: 40, paddingBottom: 80 }}>
        <div className="breadcrumb">
          <Link to="/dashboard">Dashboard</Link> / {levelLabel(level)} /{" "}
          <span style={{ textTransform: "capitalize" }}>{skill}</span>
        </div>
        <h1 style={{ display: "flex", alignItems: "center", gap: 12, fontSize: "1.7rem", marginBottom: 8 }}>
          <LevelShape level={level} size={20} />
          <span style={{ textTransform: "capitalize" }}>{skill}</span> — {levelLabel(level)}
        </h1>
        <p style={{ color: "var(--ink-soft)", marginBottom: 24 }}>
          {lessons.length} lesson{lessons.length === 1 ? "" : "s"} in this section · {completedCount} completed
        </p>

        {lessons.length > 8 && (
          <div className="field" style={{ maxWidth: 360, marginBottom: 8 }}>
            <input
              placeholder="Search lessons or topics…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="empty-state">
            {lessons.length === 0 ? "No lessons here yet — check back soon." : "No lessons match your search."}
          </div>
        ) : (
          <div>
            {ungrouped.length > 0 && <div>{ungrouped.map(renderRow)}</div>}

            {groupOrder.map((topicName) => (
              <div key={topicName} style={{ marginTop: 28 }}>
                <h3 style={{ fontSize: "1.05rem", marginBottom: 4 }}>{topicName}</h3>
                <div>{groups[topicName].map(renderRow)}</div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
