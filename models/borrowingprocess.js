const { DataTypes, Sequelize } = require("sequelize");
const { sequelize } = require("../config/database");

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

module.exports = { BorrowingProcess };
