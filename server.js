// server.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());  // To parse JSON bodies

// Create a MySQL connection
// const db = mysql.createConnection({
//   host: 'localhost',    // Replace with your host
//   user: 'root',         // Replace with your MySQL username
//   password: 'ox1234', // Replace with your MySQL password
//   database: 'oxGame' // Replace with your database name
// });

// Connect to the MySQL database
// db.connect((err) => {
//   if (err) throw err;
//   console.log('MySQL connected...');
// });

// Route to get all users from the User table
app.get('/', async (req, res) => {
  const { email } = req.query;

  // Modify the query depending on whether an email is provided
  let query = 'SELECT * FROM User';
  const params = [];

  if (email) {
    query += ' WHERE email = ?';
    params.push(email);
  }

  try {
    // Execute the query and get the result
    const [rows] = await db.query(query, params);
    
    // Send the result back to the client
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

// API endpoint to handle login
app.post('/login', (req, res) => {
  const { email, name } = req.body;

  // Check if the user already exists
  const query = `SELECT * FROM User WHERE email = ?`;
  db.query(query, [email], (err, result) => {
    if (err) throw err;

    if (result.length > 0) {
      // User exists, send back the score
      res.json({ score: result[0].score });
    } else {
      // User does not exist, create a new one with score 0
      const insertQuery = `INSERT INTO User (email, score) VALUES (?, 0)`;
      db.query(insertQuery, [email], (insertErr, insertResult) => {
        if (insertErr) throw insertErr;

        res.json({ score: 0 });
      });
    }
  });
});

// Add a new route to update the user's score
app.put('/update-score', async (req, res) => {
  const { email, score } = req.body;
  console.log(req.body); // Debug log to check incoming request data

  try {
    await db.query(`UPDATE User SET score = ? WHERE email = ?`, [score, email]);
    res.status(200).send({ message: 'Score updated successfully' });
  } catch (error) {
    console.error('Error updating score:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

// Start the server
app.listen(5001, () => {
  console.log('Server running on port 5001');
});
