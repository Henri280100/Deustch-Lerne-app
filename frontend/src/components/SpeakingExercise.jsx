import { useState, useRef } from "react";

const SpeechRecognitionCtor =
  typeof window !== "undefined" ? window.SpeechRecognition || window.webkitSpeechRecognition : null;
const supportsSpeechRecognition = !!SpeechRecognitionCtor;
const supportsSpeechSynthesis = typeof window !== "undefined" && "speechSynthesis" in window;

// Lightweight similarity: normalize punctuation/case, then compare word sets.
// Good enough to give encouraging, roughly-accurate feedback without a server.
function similarity(target, spoken) {
  const normalize = (s) =>
    s
      .toLowerCase()
      .replace(/[.,!?ß]/g, (m) => (m === "ß" ? "ss" : ""))
      .replace(/[^\wäöü\s]/g, "")
      .trim()
      .split(/\s+/)
      .filter(Boolean);

  const targetWords = normalize(target);
  const spokenWords = new Set(normalize(spoken));
  if (targetWords.length === 0) return 0;

  const matched = targetWords.filter((w) => spokenWords.has(w)).length;
  return Math.round((matched / targetWords.length) * 100);
}

export default function SpeakingExercise({ content, onFinish }) {
  const [index, setIndex] = useState(0);
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [score, setScore] = useState(null);
  const [scores, setScores] = useState([]);
  const recognitionRef = useRef(null);

  const phrase = content.phrases[index];
  const isLast = index === content.phrases.length - 1;

  function playPhrase() {
    if (!supportsSpeechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(phrase.de);
    utterance.lang = "de-DE";
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }

  function startRecording() {
    if (!supportsSpeechRecognition) return;
    const recognition = new SpeechRecognitionCtor();
    recognition.lang = "de-DE";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setRecording(true);
      setTranscript("");
      setScore(null);
    };
    recognition.onresult = (event) => {
      const said = event.results[0][0].transcript;
      setTranscript(said);
      setScore(similarity(phrase.de, said));
    };
    recognition.onerror = () => setRecording(false);
    recognition.onend = () => setRecording(false);

    recognitionRef.current = recognition;
    recognition.start();
  }

  function next() {
    const finalScores = score !== null ? [...scores, score] : scores;
    setScores(finalScores);

    if (isLast) {
      const avg = finalScores.length
        ? Math.round(finalScores.reduce((a, b) => a + b, 0) / finalScores.length)
        : 0;
      onFinish(avg);
    } else {
      setIndex((i) => i + 1);
      setTranscript("");
      setScore(null);
    }
  }

  return (
    <div>
      <p style={{ color: "var(--ink-soft)", marginBottom: 20 }}>{content.instructions}</p>

      {!supportsSpeechRecognition && (
        <p style={{ color: "var(--red)", marginBottom: 16 }}>
          Speech recognition isn't supported in this browser. Try Chrome on desktop or Android —
          you can still practice by listening and speaking along, just without automatic feedback.
        </p>
      )}

      <div className="phrase-card">
        <div className="lesson-status" style={{ marginBottom: 10 }}>
          Phrase {index + 1} of {content.phrases.length}
        </div>
        <div className="phrase-de">{phrase.de}</div>
        <div className="phrase-en">{phrase.en}</div>

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <button className="btn btn-outline" onClick={playPhrase} disabled={!supportsSpeechSynthesis}>
            ▶ Listen
          </button>
          <button
            className={`record-btn ${recording ? "recording" : ""}`}
            onClick={startRecording}
            disabled={!supportsSpeechRecognition || recording}
            aria-label="Record yourself"
            title="Record yourself"
          >
            ●
          </button>
          <span style={{ color: "var(--ink-soft)", fontSize: "0.85rem" }}>
            {recording ? "Listening…" : "Tap to record"}
          </span>
        </div>

        {transcript && (
          <div className="transcript-box">
            <strong>Heard:</strong> {transcript}
            {score !== null && (
              <div style={{ marginTop: 6 }}>Match: {score}%</div>
            )}
          </div>
        )}
      </div>

      <button className="btn btn-primary" onClick={next}>
        {isLast ? "Finish lesson" : "Next phrase"}
      </button>
    </div>
  );
}
