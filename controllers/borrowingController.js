const pool = require('../config/database');

exports.checkoutBook = async (req, res) => {
    try {
        const { book_id, borrower_id, due_date } = req.body;

        if (!book_id || !borrower_id || !due_date) {
            return res.status(400).json({ message: 'Book ID, Borrower ID, and Due Date are required' });
        }

        // Check if the book is available
        const [bookResult] = await pool.query('SELECT quantity FROM Books WHERE id = ?', [book_id]);
        if (bookResult.length === 0 || bookResult[0].quantity <= 0) {
            return res.status(400).json({ message: 'Book is not available' });
        }

        // Start a transaction
        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            // Insert into BorrowingProcesses
            await connection.query(
                'INSERT INTO BorrowingProcesses (book_id, borrower_id, checkout_date, due_date) VALUES (?, ?, CURDATE(), ?)',
                [book_id, borrower_id, due_date]
            );

            // Update book quantity
            await connection.query('UPDATE Books SET quantity = quantity - 1 WHERE id = ?', [book_id]);

            await connection.commit();
            res.status(201).json({ message: 'Book checked out successfully' });
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error checking out book:', error);
        res.status(500).json({ message: 'An error occurred while checking out the book' });
    }
};

exports.returnBook = async (req, res) => {
    try {
        const { borrowing_process_id } = req.body;

        if (!borrowing_process_id) {
            return res.status(400).json({ message: 'Borrowing Process ID is required' });
        }

        // Start a transaction
        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            // Update BorrowingProcesses
            const [updateResult] = await connection.query(
                'UPDATE BorrowingProcesses SET return_date = CURDATE() WHERE id = ? AND return_date IS NULL',
                [borrowing_process_id]
            );

            if (updateResult.affectedRows === 0) {
                await connection.rollback();
                return res.status(404).json({ message: 'Borrowing process not found or book already returned' });
            }

            // Get book_id from BorrowingProcesses
            const [borrowingProcess] = await connection.query('SELECT book_id FROM BorrowingProcesses WHERE id = ?', [borrowing_process_id]);

            // Update book quantity
            await connection.query('UPDATE Books SET quantity = quantity + 1 WHERE id = ?', [borrowingProcess[0].book_id]);

            await connection.commit();
            res.json({ message: 'Book returned successfully' });
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error returning book:', error);
        res.status(500).json({ message: 'An error occurred while returning the book' });
    }
};

exports.getBorrowerBooks = async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await pool.query(
            `SELECT b.title, b.author, bp.checkout_date, bp.due_date
             FROM BorrowingProcesses bp
             JOIN Books b ON bp.book_id = b.id
             WHERE bp.borrower_id = ? AND bp.return_date IS NULL`,
            [id]
        );

        res.json(rows);
    } catch (error) {
        console.error('Error getting borrower books:', error);
        res.status(500).json({ message: 'An error occurred while fetching borrower books' });
    }
};

exports.getOverdueBooks = async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT b.title, b.author, br.name AS borrower_name, bp.checkout_date, bp.due_date
             FROM BorrowingProcesses bp
             JOIN Books b ON bp.book_id = b.id
             JOIN Borrowers br ON bp.borrower_id = br.id
             WHERE bp.due_date < CURDATE() AND bp.return_date IS NULL`
        );

        res.json(rows);
    } catch (error) {
        console.error('Error getting overdue books:', error);
        res.status(500).json({ message: 'An error occurred while fetching overdue books' });
    }
};