const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

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
    ],
  }
);

module.exports = { Book };