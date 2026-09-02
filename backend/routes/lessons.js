const express = require("express");
const { getLessonsFiltered, getLessonById } = require("../seed/lessons");

const router = express.Router();

// GET /api/lessons?level=beginner&skill=grammar
router.get("/", (req, res) => {
  const { level, skill } = req.query;
  const results = getLessonsFiltered({ level, skill });
  // Return lightweight metadata for list views; full content comes from /:id
  const summaries = results.map(({ content, ...meta }) => meta);
  res.json({ lessons: summaries });
});

router.get("/:id", (req, res) => {
  const lesson = getLessonById(req.params.id);
  if (!lesson) return res.status(404).json({ error: "Lesson not found." });
  res.json({ lesson });
});

module.exports = router;
