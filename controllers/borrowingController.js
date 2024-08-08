const { Book, Borrower, BorrowingProcess, sequelize } = require("../models");

const checkoutBook = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { book_id, borrower_id, due_date } = req.body;

    if (!book_id || !borrower_id || !due_date) {
      return res
        .status(400)
        .json({ message: "Book ID, Borrower ID, and Due Date are required" });
    }

    // Check if the book is available
    const book = await Book.findByPk(book_id, { transaction: t });
    if (!book || book.quantity <= 0) {
      await t.rollback();
      return res.status(400).json({ message: "Book is not available" });
    }

    const borrower = await Borrower.findByPk(borrower_id, { transaction: t });
    if (!borrower) {
      await t.rollback();
      return res.status(400).json({ message: "Borrower not found" });
    }

    const isBookAlreadyCheckedOut = await BorrowingProcess.findOne({
      where: {
        book_id,
        borrower_id,
        return_date: null,
      },
      transaction: t,
    });

    const isDateValid = new Date(due_date) > new Date();

    if (!isDateValid) {
      await t.rollback();
      return res
        .status(400)
        .json({ message: "Due date must be in the future" });
    }

    if (isBookAlreadyCheckedOut) {
      await t.rollback();
      return res
        .status(400)
        .json({ message: "Book is already checked out by the borrower" });
    }

    // Insert into BorrowingProcesses
    await BorrowingProcess.create(
      {
        book_id,
        borrower_id,
        checkout_date: new Date(),
        due_date,
      },
      { transaction: t }
    );

    // Update book quantity
    await book.decrement("quantity", { transaction: t });

    await t.commit();
    res.status(201).json({ message: "Book checked out successfully" });
  } catch (error) {
    await t.rollback();
    console.error("Error checking out book:", error);
    res
      .status(500)
      .json({ message: "An error occurred while checking out the book" });
  }
};

const returnBook = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { borrower_id, book_id } = req.body;
    if (!borrower_id || !book_id) {
      return res
        .status(400)
        .json({ message: "Borrower ID and Book ID are required" });
    }

    const borrowingProcess = await BorrowingProcess.findOne({
      where: {
        book_id,
        borrower_id,
        return_date: null,
      },
      transaction: t,
    });

    if (!borrowingProcess) {
      await t.rollback();
      return res.status(404).json({
        message: "Borrowing process not found or book already returned",
      });
    }
    // Update BorrowingProcesses

    await borrowingProcess.update(
      {
        return_date: new Date(),
      },
      { transaction: t }
    );

    // Update book quantity
    await Book.increment("quantity", {
      where: { id: borrowingProcess.book_id },
      transaction: t,
    });

    await t.commit();
    res.json({ message: "Book returned successfully" });
  } catch (error) {
    await t.rollback();
    console.error("Error returning book:", error);
    res
      .status(500)
      .json({ message: "An error occurred while returning the book" });
  }
};

const getBorrowerBooks = async (req, res) => {
  try {
    const { id } = req.params;

    const borrowerBooks = await BorrowingProcess.findAll({
      where: {
        borrower_id: id,
        return_date: null,
      },
      include: [
        {
          model: Book,
          attributes: ["title", "author"],
        },
      ],
      attributes: ["checkout_date", "due_date"],
    });

    const formattedBooks = borrowerBooks.map((bp) => ({
      title: bp.Book.title,
      author: bp.Book.author,
      checkout_date: bp.checkout_date,
      due_date: bp.due_date,
    }));

    res.json(formattedBooks);
  } catch (error) {
    console.error("Error getting borrower books:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching borrower books" });
  }
};

const getOverdueBooks = async (req, res) => {
  try {
    const overdueBooks = await BorrowingProcess.findAll({
      where: {
        due_date: {
          [sequelize.Op.lt]: new Date(),
        },
        return_date: null,
      },
      include: [
        {
          model: Book,
          attributes: ["title", "author"],
        },
        {
          model: Borrower,
          attributes: ["name"],
        },
      ],
      attributes: ["checkout_date", "due_date"],
    });

    const formattedOverdueBooks = overdueBooks.map((bp) => ({
      title: bp.Book.title,
      author: bp.Book.author,
      borrower_name: bp.Borrower.name,
      checkout_date: bp.checkout_date,
      due_date: bp.due_date,
    }));

    res.json(formattedOverdueBooks);
  } catch (error) {
    console.error("Error getting overdue books:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching overdue books" });
  }
};

module.exports = {
  checkoutBook,
  returnBook,
  getBorrowerBooks,
  getOverdueBooks,
};
