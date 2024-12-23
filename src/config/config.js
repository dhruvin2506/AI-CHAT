require('dotenv').config();

const config = {
    port: process.env.PORT || 3000,
    environment: process.env.NODE_ENV || 'development',
    // Add your AI model API key here
    aiApiKey: process.env.AI_API_KEY,
    // Add other configuration variables
    maxTokens: process.env.MAX_TOKENS || 100,
    temperature: process.env.TEMPERATURE || 0.7
};

module.exports = config;