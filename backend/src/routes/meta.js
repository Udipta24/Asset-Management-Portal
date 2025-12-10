const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/categories", async (req, res, next) => {
  try {
    const r = await db.query(
      "SELECT category_name FROM asset_categories ORDER BY category_name"
    );
    res.json(r.rows);
  } catch (err) { next(err); }
});

router.get("/subcategories", async (req, res, next) => {
  try {
    const { category_name } = req.query;
    if (!category_name) return res.json([]);

    const c = await db.query(
      "SELECT category_id FROM asset_categories WHERE category_name=$1",
      [category_name]
    );
    if (!c.rows.length) return res.json([]);

    const r = await db.query(
      "SELECT subcategory_name FROM sub_categories WHERE category_id=$1 ORDER BY subcategory_name",
      [c.rows[0].category_id]
    );
    res.json(r.rows);
  } catch (err) { next(err); }
});

router.get("/vendors", async (req, res, next) => {
  try {
    const r = await db.query(
      "SELECT vendor_name FROM vendors ORDER BY vendor_name"
    );
    res.json(r.rows);
  } catch (err) { next(err); }
});

router.get("/locations", async (req, res, next) => {
  try {
    const r = await db.query(
      "SELECT location_name FROM locations ORDER BY location_name"
    );
    res.json(r.rows);
  } catch (err) { next(err); }
});

router.get("/users", async (req, res, next) => {
  try {
    const r = await db.query(
      "SELECT full_name FROM users ORDER BY full_name"
    );
    res.json(r.rows);
  } catch (err) { next(err); }
});

module.exports = router;
