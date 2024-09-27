const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

// Route for login
router.post('/login', userController.login); 

// Routes for user operations
router.post('/', userController.createUser); // Create a new user
router.get('/', userController.getAllUsers); // Get all users
router.get('/:id', userController.getUserById); // Get a user by ID
router.get('/:email', userController.getUserByEmail); // Get a user by Email
router.put('/:id', userController.updateUserScore); // Update a user's score by ID
router.put('/:email', userController.updateScore); // Update user's score by Email
router.delete('/:id', userController.deleteUser); // Delete a user

module.exports = router;
