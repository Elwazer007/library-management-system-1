const pool = require('../config/database');

exports.registerBorrower = async (req, res) => {
    try {
        const { name, email } = req.body;
        
        if (!name || !email) {
            return res.status(400).json({ message: 'Name and email are required' });
        }

        const [result] = await pool.query(
            'INSERT INTO Borrowers (name, email, registered_date) VALUES (?, ?, CURDATE())',
            [name, email]
        );

        res.status(201).json({ message: 'Borrower registered successfully', id: result.insertId });
    } catch (error) {
        console.error('Error registering borrower:', error);
        res.status(500).json({ message: 'An error occurred while registering the borrower' });
    }
};

exports.updateBorrower = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email } = req.body;

        if (!name && !email) {
            return res.status(400).json({ message: 'No fields to update' });
        }

        const [result] = await pool.query(
            'UPDATE Borrowers SET name = IFNULL(?, name), email = IFNULL(?, email) WHERE id = ?',
            [name, email, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Borrower not found' });
        }

        res.json({ message: 'Borrower updated successfully' });
    } catch (error) {
        console.error('Error updating borrower:', error);
        res.status(500).json({ message: 'An error occurred while updating the borrower' });
    }
};

exports.deleteBorrower = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await pool.query('DELETE FROM Borrowers WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Borrower not found' });
        }

        res.json({ message: 'Borrower deleted successfully' });
    } catch (error) {
        console.error('Error deleting borrower:', error);
        res.status(500).json({ message: 'An error occurred while deleting the borrower' });
    }
};

exports.listBorrowers = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Borrowers');
        res.json(rows);
    } catch (error) {
        console.error('Error listing borrowers:', error);
        res.status(500).json({ message: 'An error occurred while fetching borrowers' });
    }
};