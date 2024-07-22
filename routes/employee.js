const express = require("express");
const router = express.Router();
const Employee = require("../models/employees");
const Assets = require("../models/assets");
const Issuance = require("../models/asset_issuance");

router.get("/", async (req, res) => {
  try {
    const employees = await Employee.findAll();
    const totalAssets = await Assets.count();
    console.log(employees, "employees");
    res.render("employee", { employees, totalAssets });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    const assets = await Assets.findAll();
    const issuances = await Issuance.findAll({
      where: {
        employeeId: req.params.id,
      },
      include: Assets,
    });
    console.log(assets, issuances, req.params.id, "get assets");
    res.render("emp_details", { employee, assets, issuances });
  } catch (err) {
    console.error("Error fetching employee details:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/filter", async (req, res) => {
  try {
    let employees;
    const { status } = req.query;
    console.log(status, req.query, "filtering employees");

    const filter = {};
    if (status && status !== "all") {
      filter.status = status;
    }
    employees = await Employee.findAll({
      where: filter,
    });

    res.render("employee", { employees, status });
  } catch (err) {
    console.error("Error fetching employees:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/add", async (req, res) => {
  const { name, status, email, department, title, phoneNumber, address } = req.body;
  try {
    await Employee.create({ name, status, email, title, department, phoneNumber, address });
    const employees = await Employee.findAll();
    res.redirect("/employees");
  } catch (err) {
    console.error("Error creating employee:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/edit/:id", async (req, res) => {
  const { id } = req.params;
  const { name, status, title, email, department, phoneNumber, address } = req.body;
  console.log(id, name, status, "editing employee");
  try {
    await Employee.update({ name, status, email, department, title, phoneNumber, address }, { where: { id } });
    const employee = await Employee.findByPk(id);
    const assets = await Assets.findAll();
    const issuances = await Issuance.findAll({
      // where: {
      //   employeeId: req.params.id,
      // },
      include: Assets,
    });
    res.render("emp_details", { employee, assets, issuances });
  } catch (err) {
    console.error("Error updating employee:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
