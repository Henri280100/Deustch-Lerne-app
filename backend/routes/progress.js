const express = require("express");
const { client } = require("../db");
const { requireAuth } = require("../middleware/auth");
const { getLessonById } = require("../seed/lessons");

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  const result = await client.execute({
    sql: "SELECT lesson_id, completed, score, updated_at FROM progress WHERE user_id = ?",
    args: [req.userId],
  });
  res.json({ progress: result.rows });
});

router.post("/", requireAuth, async (req, res) => {
  const { lessonId, completed, score } = req.body || {};

  if (!lessonId || !getLessonById(lessonId)) {
    return res.status(400).json({ error: "Unknown lesson." });
  }

  await client.execute({
    sql: `INSERT INTO progress (user_id, lesson_id, completed, score, updated_at)
          VALUES (?, ?, ?, ?, datetime('now'))
          ON CONFLICT(user_id, lesson_id)
          DO UPDATE SET
            completed = MAX(excluded.completed, progress.completed),
            score = MAX(COALESCE(excluded.score, 0), COALESCE(progress.score, 0)),
            updated_at = datetime('now')`,
    args: [
      req.userId,
      lessonId,
      completed ? 1 : 0,
      typeof score === "number" ? score : null,
    ],
  });

  const result = await client.execute({
    sql: "SELECT lesson_id, completed, score, updated_at FROM progress WHERE user_id = ? AND lesson_id = ?",
    args: [req.userId, lessonId],
  });

  res.json({ progress: result.rows[0] });
});

module.exports = router;
