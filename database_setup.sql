USE library_management_system;

-- Books table
CREATE TABLE IF NOT EXISTS Books (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    ISBN VARCHAR(13) UNIQUE NOT NULL,
    quantity INT NOT NULL,
    shelf_location VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Borrowers table
CREATE TABLE IF NOT EXISTS Borrowers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    registered_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- BorrowingProcesses table
CREATE TABLE IF NOT EXISTS BorrowingProcesses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    book_id INT,
    borrower_id INT,
    checkout_date DATE NOT NULL,
    due_date DATE NOT NULL,
    return_date DATE,
    FOREIGN KEY (book_id) REFERENCES Books(id) ON DELETE CASCADE,
    FOREIGN KEY (borrower_id) REFERENCES Borrowers(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create indexes for improved query performance
CREATE INDEX idx_books_title ON Books(title);
CREATE INDEX idx_books_author ON Books(author);
CREATE INDEX idx_books_isbn ON Books(ISBN);
CREATE INDEX idx_borrowers_email ON Borrowers(email);
CREATE INDEX idx_borrowing_book_id ON BorrowingProcesses(book_id);
CREATE INDEX idx_borrowing_borrower_id ON BorrowingProcesses(borrower_id);
CREATE INDEX idx_borrowing_due_date ON BorrowingProcesses(due_date);