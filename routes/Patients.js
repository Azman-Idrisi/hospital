const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET all patients
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM patients");
    res.json(result.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});         

// POST new patient
router.post("/", async (req, res) => {
  const { name, age, gender } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO patients (name, age, gender) VALUES ($1, $2, $3) RETURNING *",
      [name, age, gender]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
