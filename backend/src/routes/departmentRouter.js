const express = require("express");
const router = express.Router();

const departmentController = require("../controllers/departmentController");

router.get("/", departmentController.listAll);
router.post("/", departmentController.create);
router.patch("/:id", departmentController.updateDesc);
router.delete("/:id", departmentController.delete);

module.exports = router;
