const express = require("express");
const router = express.Router();

const designationController = require("../controllers/designationController");

router.get("/", designationController.listAll);
router.post("/", designationController.create);
router.patch("/:id", designationController.updateDesc);
router.delete("/:id", designationController.delete);

module.exports = router;