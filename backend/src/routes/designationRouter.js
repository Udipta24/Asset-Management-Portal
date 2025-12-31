const express = require("express");
const router = express.Router();
const {authenticate} = require("../middlewares/auth");
const {authorize} = require("../middlewares/rbac");


const designationController = require("../controllers/designationController");

router.get("/", designationController.listAll);
router.post("/",authenticate, authorize("admin"), designationController.create);
router.patch("/:id",authenticate, authorize("admin"), designationController.updateDesc);
router.delete("/:id",authenticate, authorize("admin"), designationController.delete);

module.exports = router;