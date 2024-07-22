const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Issuance = sequelize.define(
  "Issuance",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    employeeId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Employees",
        key: "id",
      },
      allowNull: false,
    },
    assetId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Assets",
        key: "id",
      },
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantityHistory: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    issuedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    returnedAt: { type: DataTypes.DATE, allowNull: true },
  },
  {
    tableName: "Issuances",
  }
);

module.exports = Issuance;
