const ChatMessage = require('../models/chatModel');
const config = require('../config/config');

class ChatService {
    constructor() {
        this.context = []; // Store conversation context if needed
    }

    async processMessage(message) {
        try {
            // Here you'll add your AI integration logic
            // This is where you'll make calls to your AI provider (e.g., OpenAI)
            
            // Placeholder for AI processing
            const aiResponse = await this.getAIResponse(message);

            // Save to database if you're using one
            const chatMessage = new ChatMessage({
                user: 'user',
                message: message,
                response: aiResponse
            });

            await chatMessage.save();

            return {
                success: true,
                response: aiResponse
            };

        } catch (error) {
            console.error('Error processing message:', error);
            throw error;
        }
    }

    async getAIResponse(message) {
        // Placeholder for AI API call
        // You'll implement your actual AI integration here
        return `Echo: ${message}`;
    }

    async getChatHistory(limit = 50) {
        try {
            const history = await ChatMessage.find()
                .sort({ timestamp: -1 })
                .limit(limit);
            return history;
        } catch (error) {
            console.error('Error getting chat history:', error);
            throw error;
        }
    }

    async clearChatHistory() {
        try {
            await ChatMessage.deleteMany({});
            this.context = []; // Clear context if you're maintaining it
            return true;
        } catch (error) {
            console.error('Error clearing chat history:', error);
            throw error;
        }
    }
}

module.exports = new ChatService();