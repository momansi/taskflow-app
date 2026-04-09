const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.POSTGRES_USER || "postgres",
  host: process.env.POSTGRES_HOST || "postgres",
  database: process.env.POSTGRES_DB || "taskflow",
  password: process.env.POSTGRES_PASSWORD || "postgres",
  port: 5432
});

// ---------------- Auth middleware ----------------
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Access denied" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = user; // { userId, username }
    next();
  });
}

// ---------------- Auth routes ----------------
app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username",
      [username, hashedPassword]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: "Username already exists or invalid" });
  }
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    const user = result.rows[0];
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- Task routes ----------------

// GET tasks for current user
app.get("/api/tasks", authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  try {
    const result = await pool.query(
      "SELECT * FROM tasks WHERE user_id = $1 ORDER BY id DESC",
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE task for current user
app.post("/api/tasks", authenticateToken, async (req, res) => {
  const { title } = req.body;
  const userId = req.user.userId;

  if (!title) return res.status(400).json({ error: "Title is required" });

  try {
    const result = await pool.query(
      "INSERT INTO tasks (title, user_id) VALUES ($1, $2) RETURNING *",
      [title, userId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE task (only if it belongs to current user)
app.put("/api/tasks/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const userId = req.user.userId;

  if (!title) return res.status(400).json({ error: "Title is required" });

  try {
    const result = await pool.query(
      "UPDATE tasks SET title = $1 WHERE id = $2 AND user_id = $3 RETURNING *",
      [title, id, userId]
    );
    if (!result.rows[0]) return res.status(404).json({ error: "Task not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE task (only if it belongs to current user)
app.delete("/api/tasks/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const result = await pool.query(
      "DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, userId]
    );
    if (!result.rows[0]) return res.status(404).json({ error: "Task not found" });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// TOGGLE task completion (only if it belongs to current user)
app.patch("/api/tasks/:id/complete", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const result = await pool.query(
      "UPDATE tasks SET completed = NOT completed WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, userId]
    );
    if (!result.rows[0]) return res.status(404).json({ error: "Task not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("Backend running on port 3000"));