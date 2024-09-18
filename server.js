// server.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());  // To parse JSON bodies

// Create a MySQL connection
const db = mysql.createConnection({
  host: 'localhost',    // Replace with your host
  user: 'root',         // Replace with your MySQL username
  password: 'ox1234', // Replace with your MySQL password
  database: 'oxGame' // Replace with your database name
});

// Connect to the MySQL database
db.connect((err) => {
  if (err) throw err;
  console.log('MySQL connected...');
});

// API endpoint to handle login
app.post('/login', (req, res) => {
  const { email, name } = req.body;

  // Check if the user already exists
  const query = `SELECT * FROM User WHERE userName = ?`;
  db.query(query, [email], (err, result) => {
    if (err) throw err;

    if (result.length > 0) {
      // User exists, send back the score
      res.json({ score: result[0].score });
    } else {
      // User does not exist, create a new one with score 0
      const insertQuery = `INSERT INTO User (userName, score) VALUES (?, 0)`;
      db.query(insertQuery, [email], (insertErr, insertResult) => {
        if (insertErr) throw insertErr;

        res.json({ score: 0 });
      });
    }
  });
});

// Add a new route to update the user's score
app.post('/update-score', (req, res) => {
  const { email, score } = req.body;

  const updateQuery = `UPDATE User SET score = ? WHERE userName = ?`;
  db.query(updateQuery, [score, email], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (result.affectedRows > 0) {
      res.json({ message: 'Score updated successfully' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  });
});

// Start the server
app.listen(5001, () => {
  console.log('Server running on port 5001');
});
