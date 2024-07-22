const express = require("express");
const router = express.Router();
const Issuance = require("../models/asset_issuance");
const Assets = require("../models/assets");
const Employee = require("../models/employees");

router.post("/issue", async (req, res) => {
  const { employeeId, assetId, quantity } = req.body;
  try {
    const asset = await Assets.findByPk(assetId);
    console.log(
      asset,
      quantity,
      asset.quantity,
      "assetsss",
      asset.status === "Available",
      typeof asset.quantity,
      typeof quantity,
      asset.status === "Available" && Number(asset.quantity) >= Number(quantity)
    );
    if (asset.status === "Available" && Number(asset.quantity) >= Number(quantity)) {
      let issuance = await Issuance.findOne({
        where: {
          employeeId: employeeId,
          assetId: assetId,
          quantity,
          issuedAt: new Date(),
          returnedAt: null,
        },
      });
      console.log(issuance, "issuance--->");
      let issuanceResponse = "";
      if (issuance) {
        issuanceResponse = await Issuance.update({ quantity: issuance.quantity + quantity });
      } else {
        issuanceResponse = await Issuance.create({ employeeId, quantityHistory: quantity, assetId, quantity });
        console.log(issuanceResponse.id, "getIssuance");
      }

      await asset.update({ quantity: asset.quantity - quantity });
      if (asset.quantity === 0 || asset.quantity < 0) {
        await asset.update({ status: "Unavailable" });
      }
      const assets = await Assets.findAll();
      const employee = await Employee.findAll();
      const issuances = await Issuance.findByPk(issuanceResponse.id);
      console.log(issuances, "getIssuance");
      res.redirect(`/employees/${employeeId}`);
    } else {
      res.status(400).send("Not enough assets available");
    }
  } catch (error) {
    console.error("Error issuing asset:", error);
    res.status(500).send("Internal server error");
  }
});
router.get("/:employeeId/:assetId", async (req, res) => {
  const { employeeId, assetId } = req.params;
  console.log(employeeId, assetId, req.params, "ids for get issuance");
  try {
    const issuance = await Issuance.findByPk(assetId);

    console.log("issuance found", issuance.dataValues, issuance.quantity);
    if (issuance) {
      res.json({
        success: true,
        issuance: issuance,
      });
    } else {
      res.json({ success: false, message: "No active issuance found." });
    }
  } catch (error) {
    console.error("Error fetching issuance details:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.post("/return", async (req, res) => {
  const { issuanceId, quantity, reason } = req.body;
  try {
    const issuance = await Issuance.findByPk(issuanceId);
    if (!issuance) {
      return res.status(400).send("Issuance record not found");
    }

    if (issuance.returnedAt) {
      return res.status(400).send("Asset already returned");
    }
    console.log(quantity > issuance.quantity, quantity, issuance.quantity, "quantity > issuance.quantity");
    if (quantity <= 0) {
      return res.status(400).send("Invalid quantity");
    }

    issuance.quantity -= quantity;
    // if (issuance.quantity === 0) {
    issuance.returnedAt = new Date();
    // }
    await issuance.save();

    const asset = await Assets.findByPk(issuance.assetId);
    if (!asset) {
      return res.status(400).send("Asset not found");
    }
    asset.quantity = Number(asset.quantity) + Number(quantity);
    console.log(typeof asset.quantity, "asset quantity updated");
    if (asset.quantity > 0) {
      asset.status = "available";
    }
    await asset.save();

    res.redirect("/assets");
  } catch (error) {
    console.error("Error returning asset:", error);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
