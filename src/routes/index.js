const express = require('express');
const router = express.Router();
const chatRoutes = require('./chatRoutes');

// Mount chat routes
router.use('/', chatRoutes);

// Health check route
router.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is running' });
});

module.exports = router;