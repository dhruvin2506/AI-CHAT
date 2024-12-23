const ChatMessage = require('../models/chatModel');
const aiService = require('../services/aiService');

class ChatController {
    constructor() {
        // Bind methods to ensure proper 'this' context
        this.handleMessage = this.handleMessage.bind(this);
        this.getChatHistory = this.getChatHistory.bind(this);
        this.clearHistory = this.clearHistory.bind(this);
    }

    async handleMessage(req, res) {
        try {
            const { message } = req.body;

            if (!message) {
                return res.status(400).json({
                    success: false,
                    error: 'Message is required'
                });
            }

            const aiResponse = await aiService.generateResponse(message);
            
            const chatMessage = new ChatMessage({
                user: 'user',
                message: message,
                response: aiResponse
            });
            await chatMessage.save();

            return res.status(200).json({
                success: true,
                message: "Message received",
                reply: aiResponse
            });

        } catch (error) {
            console.error('Error in handleMessage:', error);
            return res.status(500).json({
                success: false,
                error: error.message || 'Internal server error'
            });
        }
    }

    async getChatHistory(req, res) {
        try {
            const history = await ChatMessage.find()
                .sort({ timestamp: -1 })
                .limit(50);
            
            return res.status(200).json({
                success: true,
                history
            });

        } catch (error) {
            console.error('Error in getChatHistory:', error);
            return res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }

    async clearHistory(req, res) {
        try {
            await ChatMessage.deleteMany({});
            
            return res.status(200).json({
                success: true,
                message: 'Chat history cleared'
            });

        } catch (error) {
            console.error('Error in clearHistory:', error);
            return res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }
}

module.exports = ChatController;  // Export the class, not an instance