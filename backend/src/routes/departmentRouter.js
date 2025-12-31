const express = require("express");
const router = express.Router();
const {authenticate} = require("../middlewares/auth");
const {authorize} = require("../middlewares/rbac");


const departmentController = require("../controllers/departmentController");

router.get("/", departmentController.listAll);
router.post("/",authenticate, authorize("admin"), departmentController.create);
router.patch("/:id",authenticate, authorize("admin"), departmentController.updateDesc);
router.delete("/:id",authenticate, authorize("admin"), departmentController.delete);

module.exports = router;
