const db = require("../config/db");

exports.getLocationsByFilters = async (filters) => {
  try {
    const conditions = [];
    const values = [];
    let idx = 1;

    if (filters.suburb) {
      conditions.push(`suburb = $${idx++}`);
      values.push(filters.suburb);
    }

    if (filters.city) {
      conditions.push(`city = $${idx++}`);
      values.push(filters.city);
    }

    if (filters.district) {
      conditions.push(`district = $${idx++}`);
      values.push(filters.district);
    }

    if (filters.state) {
      conditions.push(`state = $${idx++}`);
      values.push(filters.state);
    }

    if (filters.country) {
      conditions.push(`country = $${idx++}`);
      values.push(filters.country);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const query = `
      SELECT asset_id, latitude, longitude, count(*) OVER() as asset_count
      FROM locations
      ${whereClause}
    `;

    const result = await db.query(query, values);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

exports.getAllCountries = async () => {
  const result = await db.query(
    `SELECT DISTINCT country FROM locations ORDER BY country`
  );
  return result.rows;
};

exports.getStatesByCountry = async () => {
  const result = await db.query(
    `
    SELECT
      country,
      JSON_AGG(DISTINCT state ORDER BY state) AS states
    FROM locations
    WHERE state IS NOT NULL
    GROUP BY country
    `
  );
  return result.rows;
};

exports.getDistrictsByState = async () => {
  const result = await db.query(
    `
    SELECT
      state,
      JSON_AGG(DISTINCT district ORDER BY district) AS districts
    FROM locations
    WHERE district IS NOT NULL
    GROUP BY state
    `
  );
  return result.rows;
};

exports.getCitiesByDistrict = async () => {
  const result = await db.query(
    `
    SELECT
      district,
      JSON_AGG(DISTINCT city ORDER BY city) AS cities
    FROM locations
    WHERE city IS NOT NULL
    GROUP BY district
    `
  );
  return result.rows;
};

exports.getSuburbsByCity = async () => {
  const result = await db.query(
    `
    SELECT
      city,
      JSON_AGG(DISTINCT suburb ORDER BY suburb) AS suburbs
    FROM locations
    WHERE suburb IS NOT NULL
    GROUP BY city
    `
  );
  return result.rows;
};
