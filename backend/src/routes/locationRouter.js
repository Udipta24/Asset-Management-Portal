const express = require("express");
const router = express.Router();
const locationController = require("../controllers/locationController");

router.get("/", locationController.listByFilters);
router.get("/countries", locationController.listCountries);
router.get("/states", locationController.listStatesByCountry);
router.get("/districts", locationController.listDistrictsByState);
router.get("/cities", locationController.listCitiesByDistrict);
router.get("/suburbs", locationController.listSuburbsByCity);

module.exports = router;
