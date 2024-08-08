const { Sequelize, DataTypes, Op } = require("sequelize");
const { sequelize } = require("../config/database");

const { Book } = require("./book");
const { Borrower } = require("./borrower");
const { BorrowingProcess } = require("./borrowingprocess");
const { User } = require("./user");

Book.hasMany(BorrowingProcess, { foreignKey: "book_id" });
BorrowingProcess.belongsTo(Book, { foreignKey: "book_id" });

Borrower.hasMany(BorrowingProcess, { foreignKey: "borrower_id" });
BorrowingProcess.belongsTo(Borrower, { foreignKey: "borrower_id" });

async function initDatabase() {
  try {
    console.log("Initializing database...");
    await sequelize.sync({ alter: true });

    console.log("Database initialized. Tables synchronized:");

    // Log all table names
    const tables = await sequelize.getQueryInterface().showAllTables();
    console.log(tables);
  } catch (error) {
    console.error("Unable to initialize the database:", error);
    throw error;
  }
}

module.exports = {
  sequelize,
  Book,
  Borrower,
  BorrowingProcess,
  initDatabase,
  Op,
  User,
};
