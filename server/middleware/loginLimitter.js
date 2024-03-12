const { rateLimit } = require('express-rate-limit')

const loginLimitter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    message: {
        message: 'Too many login attempts from this IP, please try again after 1 minute.'
    },
    handler: (req, res, next, options) => {
        res.status(options.statusCode).send(options.message)
    },
    standardHeaders: true,
    legacyHeaders: true
})

module.exports = loginLimitter