const { Pool } = require('pg');
require('dotenv').config();

// pg library seedha ek connection string se connect ho jaati hai
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
