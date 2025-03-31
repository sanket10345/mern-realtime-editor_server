const { Sequelize } = require("sequelize");

const sequelizeInstance = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: "mysql", // Change to your SQL dialect if needed (e.g., "postgres", "sqlite", etc.)
        logging: false,
    }
);

module.exports = sequelizeInstance;
