const locationModel = require("../models/locationModel");

exports.listByFilters = async (req, res, next) => {
  try {
    const { suburb, city, district, state, country } = req.query;

    const locations = await locationModel.getLocationsByFilters({
      suburb,
      city,
      district,
      state,
      country,
    });

    res.json(locations);
  } catch (error) {
    next(error);
  }
};
exports.listCountries = async (req, res, next) => {
  try {
    res.json(await locationModel.getAllCountries());
  } catch (error) {
    next(error);
  }
};


exports.listStatesByCountry = async (req, res, next) => {
  try {
    const rows = await locationModel.getStatesByCountry();

    const result = {};
    rows.forEach((row) => {
      result[row.country] = row.states;
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
};

exports.listDistrictsByState = async (req, res, next) => {
  try {
    const rows = await locationModel.getDistrictsByState();

    const result = {};
    rows.forEach((row) => {
      result[row.state] = row.districts;
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
};

exports.listCitiesByDistrict = async (req, res, next) => {
  try {
    const rows = await locationModel.getCitiesByDistrict();

    const result = {};
    rows.forEach((row) => {
      result[row.district] = row.cities;
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
};

exports.listSuburbsByCity = async (req, res, next) => {
  try {
    const rows = await locationModel.getSuburbsByCity();

    const result = {};
    rows.forEach((row) => {
      result[row.city] = row.suburbs;
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
};
