const express = require('express');
const router = express.Router();
const ReportsController = require('../controllers/reportsController');

router.get('/borrowing', ReportsController.getBorrowingReport);
router.get('/overdue-borrows', ReportsController.getOverdueBorrowsLastMonth);
router.get('/all-borrowing-processes-last-month', ReportsController.getAllBorrowingProcessesLastMonth);



module.exports = router;