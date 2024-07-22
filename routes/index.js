const express = require("express");
const Employee = require("../models/employees");
const Assets = require("../models/assets");
const Issuance = require("../models/asset_issuance");

const router = express.Router();

router.get("/", async (req, res) => {
  const totalEmployees = await Employee.count();

  const totalAssets = await Assets.count();
  const assetsInUse = await Issuance.count({ where: { returnedAt: null } });
  const availableAssets = await Assets.count({ where: { status: "available" } });
  res.render("dashboard", { totalEmployees, totalAssets, assetsInUse, availableAssets });
});

module.exports = router;
