const express = require("express");
const { Sequelize } = require("sequelize");
const bodyParser = require("body-parser");
const employeeRouter = require("./routes/employee");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "jade");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: "postgres",
});

sequelize
  .authenticate()
  .then(() => console.log("Database connected..."))
  .catch((err) => console.log("Error: " + err));

app.use("/", require("./routes/index"));
app.use("/employees", employeeRouter);
app.use("/assets", require("./routes/assets"));
app.use("/issuance", require("./routes/assetIssuance"));
app.use("/return", require("./routes/assetReturn"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
