const logger = require('./logger');

class ErrorHandler extends Error {
    constructor(statusCode, message) {
        super();
        this.statusCode = statusCode;
        this.message = message;
    }
}

const handleError = (err, req, res, next) => {
    const { statusCode = 500, message } = err;
    
    logger.error({
        status: 'error',
        statusCode,
        message,
        stack: err.stack,
        path: req.path,
        method: req.method
    });

    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message: statusCode === 500 ? 'Internal server error' : message
    });
};

module.exports = {
    ErrorHandler,
    handleError
};