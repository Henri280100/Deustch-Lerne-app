import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../api";
import LevelShape, { levelLabel } from "../components/LevelShape";
import SkillIcon from "../components/SkillIcon";
import ProgressBar from "../components/ProgressBar";

const LEVELS = ["beginner", "intermediate", "advanced"];
const SKILLS = ["grammar", "reading", "writing", "listening", "speaking"];

export default function Dashboard() {
  const { user, token, setLevel } = useAuth();
  const [lessons, setLessons] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeLevel, setActiveLevel] = useState("beginner");

  useEffect(() => {
    if (user) setActiveLevel(user.currentLevel);
  }, [user]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([api.listLessons(token), api.getProgress(token)])
      .then(([lessonData, progressData]) => {
        if (cancelled) return;
        setLessons(lessonData.lessons);
        setProgress(progressData.progress);
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [token]);

  if (loading) return <div className="container page-loading">Loading your dashboard…</div>;

  const completedIds = new Set(progress.filter((p) => p.completed).map((p) => p.lesson_id));
  const totalLessons = lessons.length;
  const totalCompleted = completedIds.size;
  const overallPct = totalLessons ? Math.round((totalCompleted / totalLessons) * 100) : 0;

  const currentStreakSkills = SKILLS.map((skill) => {
    const skillLessons = lessons.filter((l) => l.level === activeLevel && l.skill === skill);
    const done = skillLessons.filter((l) => completedIds.has(l.id)).length;
    return { skill, done, total: skillLessons.length };
  });

  async function handleLevelChange(level) {
    setActiveLevel(level);
    try {
      await setLevel(level);
    } catch {
      // non-critical if this fails, the UI still reflects the chosen level
    }
  }

  return (
    <div className="container">
      <section style={{ paddingTop: 48 }}>
        <h1 style={{ fontSize: "1.8rem", marginBottom: 6 }}>Welcome back, {user.name.split(" ")[0]}</h1>
        <p style={{ color: "var(--ink-soft)", marginBottom: 32 }}>Pick a level, then a skill, to continue.</p>

        <div className="stat-row">
          <div className="stat">
            <div className="stat-value">{totalCompleted}</div>
            <div className="stat-label">Lessons completed</div>
          </div>
          <div className="stat">
            <div className="stat-value">{overallPct}%</div>
            <div className="stat-label">Overall progress</div>
          </div>
          <div className="stat">
            <div className="stat-value">{totalLessons}</div>
            <div className="stat-label">Total lessons available</div>
          </div>
        </div>

        <div className="level-selector">
          {LEVELS.map((level) => (
            <button
              key={level}
              className={`level-pill ${activeLevel === level ? "active" : ""}`}
              onClick={() => handleLevelChange(level)}
            >
              <LevelShape level={level} size={14} />
              {levelLabel(level)}
            </button>
          ))}
        </div>

        <h2 className="section-heading">{levelLabel(activeLevel)} skills</h2>
        <p className="section-sub">Your progress in each skill at this level.</p>

        <div className="skill-grid" style={{ marginBottom: 60 }}>
          {currentStreakSkills.map(({ skill, done, total }) => (
            <Link className="skill-card" to={`/learn/${activeLevel}/${skill}`} key={skill}>
              <SkillIcon skill={skill} />
              <div className="skill-card-body">
                <div className="skill-card-title" style={{ textTransform: "capitalize" }}>
                  {skill}
                </div>
                <div className="skill-card-meta" style={{ marginBottom: 8 }}>
                  {done} of {total} lessons complete
                </div>
                <ProgressBar value={total ? (done / total) * 100 : 0} />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
