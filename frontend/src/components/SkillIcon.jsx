// Monoline icons, all in ink color, so the skill cards are distinguished by
// shape rather than a rainbow of accent colors (see LevelShape for the one
// place we spend color as a signal).

const paths = {
  grammar: (
    <>
      <rect x="3" y="4" width="7" height="7" />
      <rect x="14" y="4" width="7" height="7" />
      <rect x="8.5" y="13" width="7" height="7" />
    </>
  ),
  reading: (
    <>
      <path d="M4 5c3 -1.5 6 -1.5 8 0c2 -1.5 5 -1.5 8 0v13c-3 -1.5 -6 -1.5 -8 0c-2 -1.5 -5 -1.5 -8 0z" />
      <line x1="12" y1="5" x2="12" y2="18" />
    </>
  ),
  writing: (
    <>
      <path d="M4 17.5V20h2.5L18 8.5l-2.5 -2.5z" />
      <line x1="13.5" y1="4.5" x2="16" y2="7" />
    </>
  ),
  listening: (
    <>
      <path d="M4 12c0 -4 3 -7 8 -7s8 3 8 7" />
      <path d="M4 12v3a2 2 0 0 0 2 2h1v-6H6a2 2 0 0 0 -2 2z" />
      <path d="M20 12v3a2 2 0 0 1 -2 2h-1v-6h1a2 2 0 0 1 2 2z" />
    </>
  ),
  speaking: (
    <>
      <path d="M4 5h13v9H9l-4 3v-3H4z" />
      <circle cx="9" cy="9.5" r="0.6" />
      <circle cx="12.5" cy="9.5" r="0.6" />
      <circle cx="16" cy="9.5" r="0.6" />
    </>
  )
};

export default function SkillIcon({ skill, size = 26 }) {
  return (
    <svg
      className="skill-icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[skill] || null}
    </svg>
  );
}
