const express = require("express");
const router = express.Router();
const locationController = require("../controllers/locationController");
const { authenticate } = require("../middlewares/auth");

router.get("/", authenticate, locationController.listByFilters);
router.get("/countries", authenticate, locationController.listCountries);
router.get("/states", authenticate, locationController.listStatesByCountry);
router.get("/districts", authenticate, locationController.listDistrictsByState);
router.get("/cities", authenticate, locationController.listCitiesByDistrict);
router.get("/suburbs", authenticate, locationController.listSuburbsByCity);

module.exports = router;
