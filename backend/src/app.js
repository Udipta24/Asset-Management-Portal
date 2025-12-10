// src/app.js
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth");
const assetsRoutes = require("./routes/assets");
const documentsRoutes = require("./routes/documents");
const errorHandler = require("./middlewares/errorHandler");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cookieParser());

// CORS: allow frontend origin with credentials
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
  credentials: true
}));

app.use("/api/auth", authRoutes);
app.use("/api/assets", assetsRoutes);
app.use("/api/documents", documentsRoutes);

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// error handler
app.use(errorHandler);

module.exports = app;
