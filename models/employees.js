const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Issuance = require("./asset_issuance");

const Employee = sequelize.define(
  "Employee",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    department: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
  },
  {
    tableName: "Employees",
  }
);
Employee.hasMany(Issuance, { foreignKey: "employeeId" });
Issuance.belongsTo(Employee, { foreignKey: "employeeId" });
module.exports = Employee;
