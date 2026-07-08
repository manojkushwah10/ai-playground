const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');

// Chat endpoint for Chat, Summarize, Translate, and Grammar Fix
router.post('/', chatController.handleChatRequest);

module.exports = router;
