const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Issuance = require("./asset_issuance");
const Assets = sequelize.define(
  "Asset",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    serialNumber: { type: DataTypes.STRING, unique: true },
    uniqueId: { type: DataTypes.STRING, unique: true },
    quantity: DataTypes.STRING,
    model: DataTypes.STRING,
    status: DataTypes.STRING,
    visible: DataTypes.BOOLEAN,
  },
  {
    tableName: "Assets",
  }
);

Assets.hasMany(Issuance, { foreignKey: "assetId" });
Issuance.belongsTo(Assets, { foreignKey: "assetId" });

module.exports = Assets;
