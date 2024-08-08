const { Sequelize, DataTypes, Op } = require("sequelize");
const { sequelize } = require("../config/database");
const bcrypt = require("bcryptjs");

const Book = sequelize.define(
  "Book",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    ISBN: {
      type: DataTypes.STRING(13),
      unique: true,
      allowNull: false,
      field: "ISBN",
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    shelf_location: {
      type: DataTypes.STRING(50),
    },
  },
  {
    tableName: "Books",
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ["title"] },
      { fields: ["author"] },
      { fields: ["ISBN"] },
    ],
  }
);

const Borrower = sequelize.define(
  "Borrower",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: false,
    },
    registered_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
  },
  {
    tableName: "Borrowers",
    timestamps: true,
    underscored: true,
    indexes: [{ fields: ["email"], unique: true }],
  }
);

const BorrowingProcess = sequelize.define(
  "BorrowingProcess",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    checkout_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
    due_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    return_date: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "BorrowingProcesses",
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ["book_id"] },
      { fields: ["borrower_id"] },
      { fields: ["due_date"] },
    ],
  }
);

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

const User = sequelize.define("User", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

User.beforeCreate(async (user) => {
  user.password = await bcrypt.hash(user.password, 10);
});

User.prototype.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = {
  sequelize,
  Book,
  Borrower,
  BorrowingProcess,
  initDatabase,
  Op,
  User,
};
