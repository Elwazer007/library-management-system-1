const rateLimit = require('express-rate-limit');

// Create a limiter for book search: 100 requests per 15 minutes
const searchLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many search requests, please try again later.'
});

// Create a limiter for borrowing process creation: 5 requests per minute
const borrowLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many borrow requests, please try again later.'
});

module.exports = {
  searchLimiter,
  borrowLimiter
};