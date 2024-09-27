const express = require('express');
const userRoutes = require('./routes/userRoutes'); // User routes

const app = express();
const PORT = 4999;

// Middleware to parse JSON request bodies
app.use(express.json());

// User routes
app.use('/api/users', userRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.send('Welcome to the User Management API');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
