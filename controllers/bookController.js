const pool = require('../config/database');

exports.addBook = async (req, res) => {
    try {
        const { title, author, ISBN, quantity, shelf_location } = req.body;
        
        if (!title || !author || !ISBN || !quantity) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const [result] = await pool.query(
            'INSERT INTO Books (title, author, ISBN, quantity, shelf_location) VALUES (?, ?, ?, ?, ?)',
            [title, author, ISBN, quantity, shelf_location]
        );

        res.status(201).json({ message: 'Book added successfully', id: result.insertId });
    } catch (error) {
        console.error('Error adding book:', error);
        res.status(500).json({ message: 'An error occurred while adding the book' });
    }
};

exports.updateBook = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, author, ISBN, quantity, shelf_location } = req.body;

        if (!title && !author && !ISBN && !quantity && !shelf_location) {
            return res.status(400).json({ message: 'No fields to update' });
        }

        const [result] = await pool.query(
            'UPDATE Books SET title = IFNULL(?, title), author = IFNULL(?, author), ISBN = IFNULL(?, ISBN), quantity = IFNULL(?, quantity), shelf_location = IFNULL(?, shelf_location) WHERE id = ?',
            [title, author, ISBN, quantity, shelf_location, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Book not found' });
        }

        res.json({ message: 'Book updated successfully' });
    } catch (error) {
        console.error('Error updating book:', error);
        res.status(500).json({ message: 'An error occurred while updating the book' });
    }
};

exports.deleteBook = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await pool.query('DELETE FROM Books WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Book not found' });
        }

        res.json({ message: 'Book deleted successfully' });
    } catch (error) {
        console.error('Error deleting book:', error);
        res.status(500).json({ message: 'An error occurred while deleting the book' });
    }
};

exports.listBooks = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Books');
        res.json(rows);
    } catch (error) {
        console.error('Error listing books:', error);
        res.status(500).json({ message: 'An error occurred while fetching books' });
    }
};

exports.searchBooks = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({ message: 'Search query is required' });
        }

        const [rows] = await pool.query(
            'SELECT * FROM Books WHERE title LIKE ? OR author LIKE ? OR ISBN LIKE ?',
            [`%${query}%`, `%${query}%`, `%${query}%`]
        );

        res.json(rows);
    } catch (error) {
        console.error('Error searching books:', error);
        res.status(500).json({ message: 'An error occurred while searching for books' });
    }
};