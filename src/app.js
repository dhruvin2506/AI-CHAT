const express = require('express');
const cors = require('cors');
const path = require('path');
const routes = require('./routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Handle favicon.ico requests
app.get('/favicon.ico', (req, res) => {
    res.status(204).end();
});

// Routes
app.use('/api/chat', routes);

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        error: 'Not Found'
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Internal Server Error'
    });
});

module.exports = app;