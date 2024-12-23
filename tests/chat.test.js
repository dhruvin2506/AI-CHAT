const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const ChatMessage = require('../src/models/chatModel');

describe('Chat API Endpoints', () => {
    beforeAll(async () => {
        try {
            // Connect to test database with connection options
            const testMongoUri = process.env.TEST_MONGODB_URI || 'mongodb://localhost:27017/chatbot_test';
            await mongoose.connect(testMongoUri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                serverSelectionTimeoutMS: 5000, // Reduce server selection timeout
                connectTimeoutMS: 10000, // Connection timeout
                socketTimeoutMS: 45000, // Socket timeout
            });
        } catch (error) {
            console.error('Database connection error:', error);
            throw error;
        }
    });

    afterAll(async () => {
        try {
            await mongoose.connection.dropDatabase();
            await mongoose.connection.close();
        } catch (error) {
            console.error('Error in afterAll:', error);
            throw error;
        }
    });

    beforeEach(async () => {
        // Clear the messages collection before each test
        await ChatMessage.deleteMany({});
    });

    describe('POST /api/chat/message', () => {
        it('should create a new chat message', async () => {
            const response = await request(app)
                .post('/api/chat/message')
                .send({
                    message: 'Hello, AI!'
                });

            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('success', true);
            expect(response.body).toHaveProperty('message');
        });

        it('should return 400 if message is missing', async () => {
            const response = await request(app)
                .post('/api/chat/message')
                .send({});

            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty('success', false);
        });
    });

    describe('GET /api/chat/history', () => {
        beforeEach(async () => {
            // Clear any existing messages
            await ChatMessage.deleteMany({});
            
            // Add test messages and wait for them to be saved
            await Promise.all([
                new ChatMessage({
                    user: 'user',
                    message: 'Test message 1',
                    response: 'Test response 1'
                }).save(),
                new ChatMessage({
                    user: 'user',
                    message: 'Test message 2',
                    response: 'Test response 2'
                }).save()
            ]);
        });
    
        it('should retrieve chat history', async () => {
            const response = await request(app)
                .get('/api/chat/history');
    
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('success', true);
            expect(response.body.history).toBeInstanceOf(Array);
            expect(response.body.history).toHaveLength(2);
        });
    });
    
    describe('DELETE /api/chat/history', () => {
        beforeEach(async () => {
            // Clear any existing messages
            await ChatMessage.deleteMany({});
            
            // Add a test message
            await new ChatMessage({
                user: 'user',
                message: 'Test message',
                response: 'Test response'
            }).save();
        });
    
        it('should clear chat history', async () => {
            // Verify message was added
            let messages = await ChatMessage.find();
            expect(messages).toHaveLength(1);
    
            const response = await request(app)
                .delete('/api/chat/history');
    
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('success', true);
    
            // Wait a moment for deletion to complete
            await new Promise(resolve => setTimeout(resolve, 100));
    
            // Verify that messages were deleted
            messages = await ChatMessage.find();
            expect(messages).toHaveLength(0);
        });
    });

    describe('API Health Check', () => {
        it('should return health status', async () => {
            const response = await request(app)
                .get('/api/health');

            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('status', 'OK');
        });
    });

    // Add test for error handling
    describe('Error Handling', () => {
        it('should handle 404 routes', async () => {
            const response = await request(app)
                .get('/api/nonexistent');

            expect(response.statusCode).toBe(404);
            expect(response.body).toHaveProperty('status', 'error');
        });
    });
});