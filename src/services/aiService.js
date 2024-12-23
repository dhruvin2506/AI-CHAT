require('dotenv').config();
const OpenAI = require('openai');

class AIService {
    constructor() {
        if (!process.env.OPENAI_API_KEY) {
            console.error('Environment variables:', process.env); // Debug log
            throw new Error('OPENAI_API_KEY is not defined in environment variables');
        }
        
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
    }

    async generateResponse(message) {
        try {
            console.log('Attempting to generate response for:', message); // Debug log

            const completion = await this.openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "You are a helpful assistant that provides clear and concise responses."
                    },
                    {
                        role: "user",
                        content: message
                    }
                ],
                max_tokens: 150
            });

            if (!completion.choices || !completion.choices[0]) {
                throw new Error('Invalid response from OpenAI');
            }

            return completion.choices[0].message.content;
        } catch (error) {
            console.error('Detailed error in generateResponse:', error); // Detailed error log
            
            if (error.response) {
                // OpenAI API error
                console.error('OpenAI API Error:', error.response.data);
                throw new Error(`OpenAI API Error: ${error.response.data.error.message}`);
            }
            
            throw new Error('Failed to generate AI response. Please try again.');
        }
    }
}

module.exports = new AIService();