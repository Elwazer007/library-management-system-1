const express = require('express');
const router = express.Router();
const borrowingController = require('../controllers/borrowingController');

const {borrowLimiter} = require('../middleware/rateLimiter');

router.post('/checkout', borrowLimiter,  borrowingController.checkoutBook);
router.post('/return', borrowingController.returnBook);
router.get('/borrower/:id', borrowingController.getBorrowerBooks);
router.get('/overdue', borrowingController.getOverdueBooks);

module.exports = router;