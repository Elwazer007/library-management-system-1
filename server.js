require("dotenv").config();
const { testConnection } = require("./config/database");
const { initDatabase } = require("./models");
const app = require("./app");

async function startServer() {
  try {
    await testConnection();

    await initDatabase();

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(
        `Server running in ${
          process.env.NODE_ENV || "development"
        } mode on port ${PORT}`
      );
    });
  } catch (error) {
    console.error("Unable to start server:", error);
    process.exit(1);
  }
}

startServer();
