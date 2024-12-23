require('dotenv').config(); // Add this at the very top
const app = require('./app');
const config = require('./config/config');
const connectDB = require('./config/database');
const logger = require('./utils/logger');

// Create logs directory if it doesn't exist
const fs = require('fs');
const path = require('path');
if (!fs.existsSync('logs')) {
    fs.mkdirSync('logs');
}

// Validate essential environment variables
if (!process.env.OPENAI_API_KEY) {
    logger.error('OPENAI_API_KEY is not defined in environment variables');
    process.exit(1);
}

if (!process.env.MONGODB_URI) {
    logger.error('MONGODB_URI is not defined in environment variables');
    process.exit(1);
}

// Connect to database
try {
    connectDB();
    logger.info('MongoDB connected successfully');
} catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
}

// Start server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    logger.error('Unhandled Rejection:', err);
    // Close server & exit process
    server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception:', err);
    // Close server & exit process
    server.close(() => process.exit(1));
});

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM received. Shutting down gracefully');
    server.close(() => {
        logger.info('Process terminated');
        process.exit(0);
    });
});