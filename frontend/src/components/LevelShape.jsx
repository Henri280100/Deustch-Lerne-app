// The three CEFR-ish levels are represented as the three Bauhaus primary
// shapes, in order of complexity: circle (beginner) -> square (intermediate)
// -> triangle (advanced). This is used consistently across the app as the
// one signature visual device, instead of icon-per-feature decoration.

const LEVEL_META = {
  beginner: { color: "var(--gold)", label: "Beginner" },
  intermediate: { color: "var(--slate)", label: "Intermediate" },
  advanced: { color: "var(--red)", label: "Advanced" }
};

export function levelLabel(level) {
  return LEVEL_META[level]?.label || level;
}

export default function LevelShape({ level, size = 18, filled = true }) {
  const color = LEVEL_META[level]?.color || "var(--ink)";
  const stroke = filled ? "none" : color;
  const fill = filled ? color : "none";
  const sw = filled ? 0 : 2;

  if (level === "beginner") {
    return (
      <svg className="level-shape" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="10" fill={fill} stroke={stroke} strokeWidth={sw} />
      </svg>
    );
  }
  if (level === "intermediate") {
    return (
      <svg className="level-shape" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" fill={fill} stroke={stroke} strokeWidth={sw} />
      </svg>
    );
  }
  return (
    <svg className="level-shape" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <polygon points="12,2 22,21 2,21" fill={fill} stroke={stroke} strokeWidth={sw} />
    </svg>
  );
}
