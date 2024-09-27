const db = require('../db');

// Controller for handling user login
exports.login = async (req, res) => {
    const { email, name } = req.body;
    
    try {
      // Check if the user already exists
      const query = 'SELECT * FROM `User` WHERE email = ?';
      const [result] = await db.execute(query, [email]);
  
      if (result.length > 0) {
        // User exists, send back the score
        res.status(200).json({ score: result[0].score });
      } else {
        // User does not exist, create a new one with score 0
        const insertQuery = 'INSERT INTO `User` (email, score) VALUES (?, 0)';
        const [insertResult] = await db.execute(insertQuery, [email]);
  
        // Send back the new score (0)
        res.status(201).json({ score: 0 });
      }
    } catch (err) {
      res.status(500).json({ error: 'Database error', details: err });
    }
};

// Controller to create a new user
exports.createUser = async (req, res) => {
  const { email, score } = req.body;
  try {
    const sql = 'INSERT INTO `User` (email, score) VALUES (?, ?)';
    const [result] = await db.execute(sql, [email, score]);
    res.status(201).json({ message: 'User created', userId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err });
  }
};

// Controller to get all users
exports.getAllUsers = async (req, res) => {
  try {
    const [users] = await db.execute('SELECT * FROM `User`');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err });
  }
};

// Controller to get a single user by ID
exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.execute('SELECT * FROM `User` WHERE userID = ?', [id]);
    if (rows.length > 0) {
      res.status(200).json(rows[0]);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err });
  }
};
// Controller to get a user by email
exports.getUserByEmail = async (req, res) => {
    const { email } = req.params;
    try {
      const sql = 'SELECT * FROM `User` WHERE email = ?';
      const [rows] = await db.execute(sql, [email]);
      if (rows.length > 0) {
        res.status(200).json(rows[0]);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (err) {
      res.status(500).json({ error: 'Database error', details: err });
    }
};

// Controller to update a user's score by ID
exports.updateUserScore = async (req, res) => {
  const { id } = req.params;
  const { score } = req.body;
  try {
    const sql = 'UPDATE `User` SET score = ? WHERE userID = ?';
    const [result] = await db.execute(sql, [score, id]);
    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'User score updated' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err });
  }
};

// Controller to update user's score by email
exports.updateScore = async (req, res) => {
    const {  email } = req.params;
    const { score } = req.body;
    console.log(req.body); // Debug log to check incoming request data
  
    try {
      // Update the user's score
      await db.execute('UPDATE `User` SET score = ? WHERE email = ?', [score, email]);
      res.status(200).json({ message: 'Score updated successfully' });
    } catch (error) {
      console.error('Error updating score:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

// Controller to delete a user
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.execute('DELETE FROM `User` WHERE userID = ?', [id]);
    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'User deleted' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err });
  }
};
