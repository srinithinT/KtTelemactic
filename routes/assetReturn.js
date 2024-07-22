const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const Issuance = require("../models/asset_issuance");
const Assets = require("../models/assets");
const Employee = require("../models/employees");

router.get("/", async (req, res) => {
  try {
    const returns = await Issuance.findAll({
      where: {
        returnedAt: {
          [Op.ne]: null,
        },
      },
      include: [
        {
          model: Employee,
          attributes: ["name"],
        },
        {
          model: Assets,
          attributes: ["model"],
        },
      ],
      order: [["returnedAt", "DESC"]],
    });

    console.log("Fetched returns:", returns);

    if (returns.length > 0) {
      res.render("return", { returns });
    } else {
      res.render("return", { returns, message: "No returns available." });
    }
  } catch (error) {
    console.error("Error fetching issuance details:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
