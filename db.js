const { Pool } = require("pg");
require("dotenv").config();

// Create a pool with Railway SSL settings
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // required for Railway cloud DB
  },
});

// Test the connection
pool.query("SELECT NOW()")
  .then(res => console.log("Connected to Railway PostgreSQL. Current time:", res.rows[0].now))
  .catch(err => console.error("DB connection error:", err.stack));

module.exports = pool;
