const { DataTypes, Sequelize } = require("sequelize");
const { sequelize } = require("../config/database");

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

module.exports = { Borrower };
