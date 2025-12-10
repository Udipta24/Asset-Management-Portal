// src/controllers/documentController.js
const db = require("../config/db");

// uploads handled by multer in route; file info in req.file
exports.uploadDocument = async (req, res, next) => {
  try {
    const assetId = req.params.asset_id;
    const { document_type } = req.body;
    const file = req.file;
    if (!file) return res.status(400).json({ message: "No file uploaded" });

    const q = await db.query(
      `INSERT INTO asset_documents (asset_id, document_type, file_path, uploaded_by)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [assetId, document_type || null, file.path, req.user.user_id]
    );
    res.status(201).json(q.rows[0]);
  } catch (err) { next(err); }
};
