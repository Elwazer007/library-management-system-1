const express = require('express');
const router = express.Router();
const borrowingController = require('../controllers/borrowingController');

router.post('/checkout', borrowingController.checkoutBook);
router.post('/return', borrowingController.returnBook);
router.get('/borrower/:id', borrowingController.getBorrowerBooks);
router.get('/overdue', borrowingController.getOverdueBooks);

module.exports = router;