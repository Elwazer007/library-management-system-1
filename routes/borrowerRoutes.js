const express = require('express');
const router = express.Router();
const borrowerController = require('../controllers/borrowerController');
router.post('/', borrowerController.registerBorrower);
router.put('/:id', borrowerController.updateBorrower);
router.delete('/:id', borrowerController.deleteBorrower);
router.get('/', borrowerController.listBorrowers);

module.exports = router;