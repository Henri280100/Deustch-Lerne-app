require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { initDb } = require("./db");

const authRoutes = require("./routes/auth");
const lessonRoutes = require("./routes/lessons");
const progressRoutes = require("./routes/progress");

const app = express();
const PORT = process.env.PORT || 4000;
const allowedOrigins = [
  "https://deustch-lerne-app.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Blocked by CORS policy"));
      }
    },
    credentials: true,
  }),
);
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/auth", authRoutes);
app.use("/lessons", lessonRoutes);
app.use("/progress", progressRoutes);

app.use((req, res) => res.status(404).json({ error: "Not found." }));

async function start() {
  await initDb();
  app.listen(PORT, () => {
    console.log(`Deutsch Pfad API running on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
