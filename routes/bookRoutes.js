const express = require('express');
const router = express.Router();

const {searchLimiter} = require('../middleware/rateLimiter');
const {authenticateJWT} = require('../middleware/auth');

const bookController = require('../controllers/bookController');

router.post('/', authenticateJWT, bookController.addBook);
router.put('/:id', authenticateJWT,  bookController.updateBook);
router.delete('/:id',authenticateJWT ,bookController.deleteBook);
router.get('/', bookController.listBooks);
router.get('/search', searchLimiter, bookController.searchBooks);

module.exports = router;