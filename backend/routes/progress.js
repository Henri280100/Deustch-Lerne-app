const express = require("express");
const db = require("../db");
const { requireAuth } = require("../middleware/auth");
const { getLessonById } = require("../seed/lessons");

const router = express.Router();

router.get("/", requireAuth, (req, res) => {
  const rows = db
    .prepare("SELECT lesson_id, completed, score, updated_at FROM progress WHERE user_id = ?")
    .all(req.userId);
  res.json({ progress: rows });
});

router.post("/", requireAuth, (req, res) => {
  const { lessonId, completed, score } = req.body || {};

  if (!lessonId || !getLessonById(lessonId)) {
    return res.status(400).json({ error: "Unknown lesson." });
  }

  db.prepare(
    `INSERT INTO progress (user_id, lesson_id, completed, score, updated_at)
     VALUES (?, ?, ?, ?, datetime('now'))
     ON CONFLICT(user_id, lesson_id)
     DO UPDATE SET
       completed = MAX(excluded.completed, progress.completed),
       score = MAX(COALESCE(excluded.score, 0), COALESCE(progress.score, 0)),
       updated_at = datetime('now')`
  ).run(req.userId, lessonId, completed ? 1 : 0, typeof score === "number" ? score : null);

  const row = db
    .prepare("SELECT lesson_id, completed, score, updated_at FROM progress WHERE user_id = ? AND lesson_id = ?")
    .get(req.userId, lessonId);

  res.json({ progress: row });
});

module.exports = router;
