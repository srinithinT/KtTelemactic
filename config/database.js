const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: "postgres",
});
console.log(process.env, process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, "env data");
module.exports = sequelize;
