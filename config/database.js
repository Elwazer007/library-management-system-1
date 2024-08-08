require("dotenv").config();
const { Sequelize } = require("sequelize");

const dbName = process.env.DB_NAME || "library_management_system";
const dbUser = process.env.DB_USER || "root";
const dbPassword = process.env.DB_PASSWORD || "rootpassword";
const dbHost = process.env.DB_HOST || "db";
const dbPort = process.env.DB_PORT || 3306;

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: "mysql",
  logging: process.env.NODE_ENV === "development" ? console.log : false,
});

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    throw error;
  }
}

module.exports = { sequelize, testConnection };
