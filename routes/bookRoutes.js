const express = require('express');
const router = express.Router();

const bookController = require('../controllers/bookController');

router.post('/', bookController.addBook);
router.put('/:id', bookController.updateBook);
router.delete('/:id', bookController.deleteBook);
router.get('/', bookController.listBooks);
router.get('/search', bookController.searchBooks);

module.exports = router;