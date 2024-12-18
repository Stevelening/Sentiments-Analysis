const express = require("express");
const { WebSocketServer } = require("ws");
const sqlite3 = require("sqlite3").verbose();
const admin = require("./config")

// Initialize Express app and SQLite database
const app = express();
const PORT = 3000;
const db = new sqlite3.Database("chat.db");

// Drop the messages table if it exists and recreate it
db.run(`
  DROP TABLE IF EXISTS messages
`);

// Create the messages table with sender, recipient, message, timestamp, toxicity, and evaluated
db.run(`
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender TEXT,
    recipient TEXT,
    message TEXT,
    timestamp TEXT,
    toxicity REAL DEFAULT NULL,
    evaluated BOOLEAN DEFAULT FALSE
  )
`);

// Serve static files from the "public" directory
app.use(express.static("public"));
app.use(express.json()); // For parsing application/json

// Endpoint to retrieve all messages for a specific user (sender or recipient)
app.get("/messages/:username", (req, res) => {
  const { username } = req.params;

  db.all(
    `SELECT * FROM messages 
     WHERE sender = ? OR recipient = ? 
     ORDER BY timestamp ASC`,
    [username, username],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: "Failed to fetch messages" });
        return;
      }
      res.json(rows);
    }
  );
});

// Enpoint to get unevaluated messages
app.get("/messages", (req, res) => {
  db.all(
    "SELECT * FROM messages WHERE evaluated = FALSE ORDER BY timestamp ASC",
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: "Failed to fetch messages" });
        return;
      }
      res.json(rows);
    }
  );
});

// Enpoint to get evaluated messages
app.get("/evaluated-messages", (req, res) => {
  db.all(
    "SELECT * FROM messages WHERE evaluated = TRUE ORDER BY timestamp ASC",
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: "Failed to fetch messages" });
        return;
      }
      res.json(rows);
    }
  );
});

// Endpoint to evaluate a message (add toxicity and mark as evaluated)
app.post("/evaluate", (req, res) => {
  const { messageId, toxicity } = req.body;
  db.run(
    "UPDATE messages SET toxicity = ?, evaluated = TRUE WHERE id = ?",
    [toxicity, messageId],
    function (err) {
      if (err) {
        res.status(500).json({ error: "Failed to evaluate message" });
        return;
      }
      res.json({ success: true });
    }
  );
});

// Endpoint to verify if a user is an admin
app.post("/admin", (req, res) => {
  const { login, password } = req.body;
  if (login === admin.login && password === admin.password) {
    res.json({ success: true, message: "Credentials ok" });
  }
  else {
    res.json({ success: false, message: "Wrong credentials" });
  }
});

// Start the Express server
const server = app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// Create WebSocket server
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  let sender = null;

  // When a user connects, prompt them to set their username
  ws.send("Please enter your username:");

  // Handle incoming messages
  ws.on("message", (message) => {
    message = String(message); // Ensure the message is a string

    if (!sender) {
      // The first message is the username
      sender = message.trim();
      ws.send(`Hello, ${sender}! You can now send messages to others.`);
    } else {
      // After the username is set, the message format is: "recipient: message"
      const [recipient, messageText] = message.split(":");

      const timestamp = new Date().toISOString();
      const toxicity = null; // Initially set to null
      const evaluated = false; // Initially set to false

      // Insert the message into the database
      db.run(
        "INSERT INTO messages (sender, recipient, message, timestamp, toxicity, evaluated) VALUES (?, ?, ?, ?, ?, ?)",
        [sender, recipient.trim(), messageText.trim(), timestamp, toxicity, evaluated],
        function (err) {
          if (err) {
            console.error("Error saving message:", err.message);
          }
        }
      );

      // Forward the message to the recipient via WebSocket, including evaluation status and toxicity
      wss.clients.forEach((client) => {
        if (client !== ws && client.username === recipient.trim()) {
          client.send(JSON.stringify({
            sender,
            recipient: recipient.trim(),
            message: messageText.trim(),
            toxicity: toxicity,
            evaluated: evaluated
          }));
        }
      });
    }
  });

  // Disconnect handler
  ws.on("close", () => {
    console.log(`${sender} disconnected.`);
  });
});
