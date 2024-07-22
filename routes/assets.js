const express = require("express");
const router = express.Router();
const Assets = require("../models/assets");
const Employee = require("../models/employees");

router.get("/", async (req, res) => {
  try {
    const assets = await Assets.findAll();
    const employees = await Employee.findAll();
    res.render("assets", { assets, employees });
  } catch (err) {
    console.error("Error creating employee:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/add", async (req, res) => {
  try {
    const { serialNumber, uniqueId, quantity, model, status } = req.body;
    const assets = await Assets.create({ serialNumber, uniqueId, quantity, model, status });
    res.redirect("/assets");
  } catch (err) {
    console.error("Error creating employee:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
