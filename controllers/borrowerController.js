const { Borrower } = require('../models');

exports.registerBorrower = async (req, res) => {
    try {
        const { name, email } = req.body;
        
        if (!name || !email) {
            return res.status(400).json({ message: 'Name and email are required' });
        }
        
        const newBorrower = await Borrower.create({
            name,
            email,
            registered_date: new Date()
        });
        
        res.status(201).json({ message: 'Borrower registered successfully', id: newBorrower.id });
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
        
        const [updatedRows] = await Borrower.update(
            { name, email },
            { where: { id } }
        );
        
        if (updatedRows === 0) {
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
        
        const deletedRows = await Borrower.destroy({ where: { id } });
        
        if (deletedRows === 0) {
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
        const borrowers = await Borrower.findAll();
        res.json(borrowers);
    } catch (error) {
        console.error('Error listing borrowers:', error);
        res.status(500).json({ message: 'An error occurred while fetching borrowers' });
    }
};