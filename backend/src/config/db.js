const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on("error", (err) => {
  console.error("Unexpected PG client error:", err);
  // Optional: you can decide whether to process.exit(1) or just log
  // process.exit(1);
});
pool.query("SELECT current_database();")
  .then(res => console.log("Connected DB:", res.rows[0].current_database))
  .catch(console.error);
module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
