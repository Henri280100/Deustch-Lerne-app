import { Link } from "react-router-dom";
import LevelShape, { levelLabel } from "../components/LevelShape";
import SkillIcon from "../components/SkillIcon";

const skills = [
  { id: "grammar", title: "Grammar", desc: "Build the rules that hold every sentence together." },
  { id: "reading", title: "Reading", desc: "Work through real passages, from short stories to essays." },
  { id: "writing", title: "Writing", desc: "Practice writing with prompts and a self-check on every draft." },
  { id: "listening", title: "Listening", desc: "Train your ear with spoken passages at every level." },
  { id: "speaking", title: "Speaking", desc: "Speak out loud and get instant feedback on pronunciation." }
];

export default function Landing() {
  return (
    <div className="container">
      <section className="hero">
        <h1>Learn German the way it's actually used — not just the way it's tested.</h1>
        <p className="lede">
          One path from your first "Hallo" to reading the newspaper: grammar, reading, writing,
          listening, and speaking, all in one place, all tracked as you go.
        </p>
        <Link to="/register" className="btn btn-gold">
          Start learning for free
        </Link>

        <div className="level-path">
          {["beginner", "intermediate", "advanced"].map((level, i) => (
            <div className="level-path-step" key={level}>
              {i > 0 && <div className="level-path-line" />}
              <LevelShape level={level} size={20} />
              <span className="level-path-label">{levelLabel(level)}</span>
            </div>
          ))}
        </div>
      </section>

      <section style={{ paddingBottom: 80 }}>
        <h2 className="section-heading">Five skills, one path</h2>
        <p className="section-sub">Every level covers all five, so nothing gets left behind.</p>
        <div className="skill-grid">
          {skills.map((s) => (
            <div className="skill-card" key={s.id} style={{ cursor: "default" }}>
              <SkillIcon skill={s.id} />
              <div className="skill-card-body">
                <div className="skill-card-title">{s.title}</div>
                <div className="skill-card-meta">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
