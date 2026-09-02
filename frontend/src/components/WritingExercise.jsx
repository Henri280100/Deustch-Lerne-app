import { useState } from "react";

export default function WritingExercise({ content, onFinish }) {
  const [text, setText] = useState("");
  const [checked, setChecked] = useState(false);
  const [result, setResult] = useState(null);

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  function check() {
    const lower = text.toLowerCase();
    const keywordHits = content.keywords.filter((k) => lower.includes(k.toLowerCase())).length;
    const lengthOk = wordCount >= content.minWords;

    // Heuristic score: half for meeting the length target, half for using
    // expected vocabulary. This is a self-check, not a real grade — writing
    // is hard to grade automatically without a language model in the loop.
    const lengthScore = lengthOk ? 50 : Math.round((wordCount / content.minWords) * 50);
    const keywordScore = Math.round((keywordHits / content.keywords.length) * 50);
    const score = Math.min(100, lengthScore + keywordScore);

    setResult({ score, lengthOk, keywordHits });
    setChecked(true);
    onFinish(score);
  }

  return (
    <div>
      <div className="explanation-box">
        <p>{content.prompt}</p>
        <p style={{ marginBottom: 0, fontSize: "0.85rem", color: "var(--ink-soft)" }}>
          Aim for at least {content.minWords} words.
        </p>
      </div>

      <div className="field">
        <label htmlFor="writing-answer">Your answer</label>
        <textarea
          id="writing-answer"
          rows={8}
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={checked}
          placeholder="Schreibe hier auf Deutsch…"
        />
      </div>
      <div className="word-count">{wordCount} words</div>

      {!checked && (
        <button className="btn btn-primary" onClick={check} disabled={wordCount === 0}>
          Self-check my writing
        </button>
      )}

      {checked && result && (
        <>
          <p>
            {result.lengthOk
              ? "Good length."
              : `Try to write a bit more next time — you wrote ${wordCount} of the suggested ${content.minWords} words.`}{" "}
            You used {result.keywordHits} of {content.keywords.length} suggested words or
            structures.
          </p>
          <p style={{ color: "var(--ink-soft)", fontSize: "0.85rem" }}>
            This is an automated self-check on length and vocabulary, not a full grammar review —
            compare your writing with the sample answer below to spot mistakes yourself.
          </p>
          <div className="sample-answer">
            <strong>Sample answer</strong>
            <p style={{ marginTop: 10, marginBottom: 0 }}>{content.sampleAnswer}</p>
          </div>
        </>
      )}
    </div>
  );
}
