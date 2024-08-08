const { Book } = require('../models');
const { Op } = require('sequelize');

exports.addBook = async (req, res) => {
    try {
        const { title, author, ISBN, quantity, shelf_location } = req.body;
        
        if (!title || !author || !ISBN || !quantity) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        
        const newBook = await Book.create({
            title,
            author,
            ISBN,
            quantity,
            shelf_location
        });
        
        res.status(201).json({ message: 'Book added successfully', id: newBook.id });
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
        
        const [updatedRows] = await Book.update(
            { title, author, ISBN, quantity, shelf_location },
            { where: { id } }
        );
        
        if (updatedRows === 0) {
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
        
        const deletedRows = await Book.destroy({ where: { id } });
        
        if (deletedRows === 0) {
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
        const books = await Book.findAll();
        res.json(books);
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
        
        const books = await Book.findAll({
            where: {
                [Op.or]: [
                    { title: { [Op.like]: `%${query}%` } },
                    { author: { [Op.like]: `%${query}%` } },
                    { ISBN: { [Op.like]: `%${query}%` } }
                ]
            }
        });
        
        res.json(books);
    } catch (error) {
        console.error('Error searching books:', error);
        res.status(500).json({ message: 'An error occurred while searching for books' });
    }
};