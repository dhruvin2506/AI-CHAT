const express = require('express');
const router = express.Router();
const ChatController = require('../controllers/chatController');

// Create a single instance of the controller
const chatController = new ChatController();

// Define routes with proper function references
router.post('/message', chatController.handleMessage.bind(chatController));
router.get('/history', chatController.getChatHistory.bind(chatController));
router.delete('/history', chatController.clearHistory.bind(chatController));

module.exports = router;