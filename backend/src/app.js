// external modules
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
// internal modules
const db = require("./config/db");
const authRoutes = require("./routes/authRouter");
const assetRoutes = require("./routes/assetsRouter");
const userRoutes = require("./routes/usersRouter");
const errorHandler = require("./middlewares/errorHandler");
const categoryRoutes = require("./routes/categoryRouter");
const subcategoryRoutes = require("./routes/subcategoryRouter");
const departmentRoutes = require("./routes/departmentRouter");
const designationRoutes = require("./routes/designationRouter");
const vendorRoutes = require("./routes/vendorRouter");

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN,
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/user", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/subcategories", subcategoryRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/designations", designationRoutes);
app.use("/api/vendors", vendorRoutes);

app.use(errorHandler);

db.pool
  .connect()
  .then(() => {
    console.log("Connected to PostgreSQL");
    app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to connect to DB:", err);
    process.exit(1);
  });
