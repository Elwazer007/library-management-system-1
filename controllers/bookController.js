const { Book } = require("../models");
const { Op } = require("sequelize");

const addBook = async (req, res) => {
  try {
    const { title, author, ISBN, quantity, shelf_location } = req.body;

    if (!title || !author || !ISBN || !quantity) {
      const missingFields = [];
      if (!title) missingFields.push("title");
      if (!author) missingFields.push("author");
      if (!ISBN) missingFields.push("ISBN");
      if (quantity == undefined) missingFields.push("quantity");
      return res
        .status(400)
        .json({ message: "Missing required fields", missingFields });
    }

    const foundBook = await Book.findOne({ where: { ISBN } });
    if (foundBook) {
      return res
        .status(400)
        .json({ message: "Book with the same ISBN already exists." });
    }

    if (quantity < 0) {
      return res
        .status(400)
        .json({ message: "Quantity must be a positive number." });
    }

    if (ISBN.length > 13) {
      return res
        .status(400)
        .json({ message: "ISBN must be less than 14 digits." });
    }

    const newBook = await Book.create({
      title,
      author,
      ISBN,
      quantity,
      shelf_location,
    });

    res
      .status(201)
      .json({ message: "Book added successfully", id: newBook.id });
  } catch (error) {
    console.error("Error adding book:", error);
    res
      .status(500)
      .json({ message: "An error occurred while adding the book" });
  }
};

const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, ISBN, quantity, shelf_location } = req.body;

    if (!title && !author && !ISBN && !quantity && !shelf_location) {
      return res.status(400).json({ message: "No fields to update" });
    }

    const [updatedRows] = await Book.update(
      { title, author, ISBN, quantity, shelf_location },
      { where: { id } }
    );

    if (updatedRows === 0) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json({ message: "Book updated successfully" });
  } catch (error) {
    console.error("Error updating book:", error);
    res
      .status(500)
      .json({ message: "An error occurred while updating the book" });
  }
};

const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedRows = await Book.destroy({ where: { id } });

    if (deletedRows === 0) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error("Error deleting book:", error);
    res
      .status(500)
      .json({ message: "An error occurred while deleting the book" });
  }
};

const listBooks = async (req, res) => {
  try {
    const books = await Book.findAll();
    res.json(books);
  } catch (error) {
    console.error("Error listing books:", error);
    res.status(500).json({ message: "An error occurred while fetching books" });
  }
};

const searchBooks = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const books = await Book.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.like]: `%${query}%` } },
          { author: { [Op.like]: `%${query}%` } },
          { ISBN: { [Op.like]: `%${query}%` } },
        ],
      },
    });

    res.json(books);
  } catch (error) {
    console.error("Error searching books:", error);
    res
      .status(500)
      .json({ message: "An error occurred while searching for books" });
  }
};

module.exports = { addBook, updateBook, deleteBook, listBooks, searchBooks };
