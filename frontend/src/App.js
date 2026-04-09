import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [message, setMessage] = useState("");

  // Auth states
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isLoginPage, setIsLoginPage] = useState(true);

  const API_URL = "/api";

  // Show toast messages
  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => {
      setMessage("");
    }, 2500);
  };

  // ---------------- Auth functions ----------------
  const login = async () => {
    try {
      const res = await axios.post(`${API_URL}/login`, { username, password });
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      showMessage("✅ Logged in successfully");
      fetchTasks(res.data.token);
    } catch (err) {
      showMessage("❌ Invalid credentials");
    }
  };

  const register = async () => {
    try {
      await axios.post(`${API_URL}/register`, { username, password });
      showMessage("✅ Registered successfully! You can login now");
      setIsLoginPage(true);
    } catch (err) {
      showMessage("❌ Registration failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setTasks([]);
    setUsername("");
    setPassword("");
    showMessage("✅ Logged out successfully");
  };

  // ---------------- Task functions ----------------
  const fetchTasks = async (jwtToken = token) => {
    if (!jwtToken) return;
    try {
      const headers = { headers: { Authorization: `Bearer ${jwtToken}` } };
      const res = await axios.get(`${API_URL}/tasks`, headers);
      setTasks(res.data);
    } catch (err) {
      showMessage("❌ Failed to fetch tasks");
    }
  };

  const addTask = async () => {
    if (!newTask.trim()) return;
    try {
      const headers = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post(`${API_URL}/tasks`, { title: newTask }, headers);
      setNewTask("");
      fetchTasks();
      showMessage("✅ Task added successfully");
    } catch {
      showMessage("❌ Failed to add task");
    }
  };

  const deleteTask = async (id) => {
    try {
      const headers = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`${API_URL}/tasks/${id}`, headers);
      fetchTasks();
      showMessage("🗑️ Task deleted successfully");
    } catch {
      showMessage("❌ Failed to delete task");
    }
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditValue(task.title);
  };

  const saveEdit = async (id) => {
    if (!editValue.trim()) return;
    try {
      const headers = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(`${API_URL}/tasks/${id}`, { title: editValue }, headers);
      setEditingId(null);
      setEditValue("");
      fetchTasks();
      showMessage("✏️ Task updated successfully");
    } catch {
      showMessage("❌ Failed to edit task");
    }
  };

  const toggleComplete = async (id) => {
    try {
      const headers = { headers: { Authorization: `Bearer ${token}` } };
      await axios.patch(`${API_URL}/tasks/${id}/complete`, {}, headers);
      fetchTasks();
      showMessage("✅ Task status updated");
    } catch {
      showMessage("❌ Failed to update task status");
    }
  };

  useEffect(() => {
    if (token) fetchTasks();
  }, [token]);

  // ---------------- Render ----------------
  if (!token) {
    return (
      <div className="App">
        <h1>TaskFlow Auth</h1>
        {message && <div className="toast">{message}</div>}

        <div className="input-container">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="input-container">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="task-buttons">
          {isLoginPage ? (
            <>
              <button onClick={login}>Login</button>
              <button onClick={() => setIsLoginPage(false)}>Register</button>
            </>
          ) : (
            <>
              <button onClick={register}>Register</button>
              <button onClick={() => setIsLoginPage(true)}>Back to Login</button>
            </>
          )}
        </div>
      </div>
    );
  }

  // Logged-in tasks UI
  return (
    <div className="App">
      <div className="header">
        <h1>TaskFlow App</h1>
        <button className="logout-btn" onClick={logout}>Logout</button>
      </div>
      {message && <div className="toast">{message}</div>}

      <div className="input-container">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add new task..."
        />
        <button onClick={addTask}>Add</button>
      </div>

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {editingId === task.id ? (
              <>
                <input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                />
                <button onClick={() => saveEdit(task.id)}>Save</button>
              </>
            ) : (
              <>
                <span className={task.completed ? "completed-task" : ""}>
                  {task.title}
                </span>
                <div className="task-buttons">
                  <button onClick={() => toggleComplete(task.id)}>
                    {task.completed ? "Undo" : "Done"}
                  </button>
                  <button onClick={() => startEdit(task)}>Edit</button>
                  <button onClick={() => deleteTask(task.id)}>Delete</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;