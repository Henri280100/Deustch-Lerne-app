import { useState } from "react";
import Quiz from "./Quiz";

const supportsSpeech = typeof window !== "undefined" && "speechSynthesis" in window;

export default function ListeningExercise({ content, onFinish }) {
  const [playing, setPlaying] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);

  function play() {
    if (!supportsSpeech) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(content.text);
    utterance.lang = content.lang || "de-DE";
    utterance.rate = 0.95;
    utterance.onstart = () => setPlaying(true);
    utterance.onend = () => setPlaying(false);
    utterance.onerror = () => setPlaying(false);
    window.speechSynthesis.speak(utterance);
  }

  return (
    <div>
      <div className="explanation-box" style={{ textAlign: "center" }}>
        {!supportsSpeech && (
          <p style={{ color: "var(--red)" }}>
            Your browser doesn't support audio playback. Try Chrome or Edge, or reveal the
            transcript below.
          </p>
        )}
        <button className="btn btn-gold" onClick={play} disabled={!supportsSpeech || playing}>
          {playing ? "Playing…" : "▶ Play audio"}
        </button>
        <div style={{ marginTop: 14 }}>
          <button className="btn-text" onClick={() => setShowTranscript((s) => !s)}>
            {showTranscript ? "Hide transcript" : "Show transcript"}
          </button>
        </div>
        {showTranscript && (
          <p style={{ marginTop: 10, textAlign: "left", color: "var(--ink-soft)" }}>{content.text}</p>
        )}
      </div>
      <Quiz questions={content.quiz} onFinish={onFinish} />
    </div>
  );
}
