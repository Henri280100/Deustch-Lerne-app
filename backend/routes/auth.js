const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { client } = require("../db");
const { requireAuth, JWT_SECRET } = require("../middleware/auth");

const router = express.Router();

function signToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "30d" });
}

function toPublicUser(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    currentLevel: row.current_level
  };
}

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email, and password are all required." });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters." });
  }

  const existing = await client.execute({
    sql: "SELECT id FROM users WHERE email = ?",
    args: [email.toLowerCase().trim()]
  });
  if (existing.rows.length > 0) {
    return res.status(409).json({ error: "An account with this email already exists." });
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  const inserted = await client.execute({
    sql: "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
    args: [name.trim(), email.toLowerCase().trim(), passwordHash]
  });

  const userId = Number(inserted.lastInsertRowid);
  const userResult = await client.execute({ sql: "SELECT * FROM users WHERE id = ?", args: [userId] });
  const user = userResult.rows[0];

  const token = signToken(user.id);
  res.status(201).json({ token, user: toPublicUser(user) });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const result = await client.execute({
    sql: "SELECT * FROM users WHERE email = ?",
    args: [email.toLowerCase().trim()]
  });
  const user = result.rows[0];

  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: "Incorrect email or password." });
  }

  const token = signToken(user.id);
  res.json({ token, user: toPublicUser(user) });
});

router.get("/me", requireAuth, async (req, res) => {
  const result = await client.execute({ sql: "SELECT * FROM users WHERE id = ?", args: [req.userId] });
  const user = result.rows[0];
  if (!user) return res.status(404).json({ error: "User not found." });
  res.json({ user: toPublicUser(user) });
});

router.put("/level", requireAuth, async (req, res) => {
  const { level } = req.body || {};
  if (!["beginner", "intermediate", "advanced"].includes(level)) {
    return res.status(400).json({ error: "Level must be beginner, intermediate, or advanced." });
  }
  await client.execute({
    sql: "UPDATE users SET current_level = ? WHERE id = ?",
    args: [level, req.userId]
  });
  const result = await client.execute({ sql: "SELECT * FROM users WHERE id = ?", args: [req.userId] });
  res.json({ user: toPublicUser(result.rows[0]) });
});

module.exports = router;