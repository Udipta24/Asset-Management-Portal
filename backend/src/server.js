require("dotenv").config();           // ✅ load .env BEFORE anything else

const app = require("./app");
const db = require("./config/db");

const PORT = process.env.PORT || 5000;

db.pool.connect()
  .then(() => {
    console.log("Connected to PostgreSQL");
    app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
  })
  .catch(err => {
    console.error("Failed to connect to DB:", err);
    process.exit(1);
  });
