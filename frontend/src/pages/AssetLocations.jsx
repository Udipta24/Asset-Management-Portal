import { useEffect, useState } from "react";
import API from "../api/api";
import { FiFilter } from "react-icons/fi";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

export default function AssetLocations() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [assetCount, setAssetCount] = useState("");

  const [filters, setFilters] = useState({
    suburb: "",
    city: "",
    district: "",
    state: "Tripura",
    country: "India",
  });
  const [reference, setReference] = useState({
    countries: [],
    states: {},
    districts: {},
    cities: {},
    suburbs: {},
  });

  useEffect(() => {
    const fetchAllReferenceData = async () => {
      setLoading(true);
      try {
        const [countriesRes, statesRes, districtsRes, citiesRes, suburbsRes] =
          await Promise.all([
            API.get("/locations/countries"),
            API.get("/locations/states"),
            API.get("/locations/districts"),
            API.get("/locations/cities"),
            API.get("/locations/suburbs"),
          ]);

        setReference({
          countries: countriesRes.data,
          states: statesRes.data,
          districts: districtsRes.data,
          cities: citiesRes.data,
          suburbs: suburbsRes.data,
        });
      } catch (err) {
        console.error("Failed to load reference location data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllReferenceData();
  }, []);

  useEffect(() => {
    const fetchLocations = async () => {
      setLoading(true);
      try {
        if (
          filters.suburb == "" &&
          filters.city == "" &&
          filters.district == "" &&
          filters.state == "" &&
          filters.country == ""
        )
          return;
        const res = await API.get("/locations", { params: filters });
        setLocations(res.data);
        console.log("Data", locations);
        setAssetCount(res.data?.length || 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLocations();
  }, [filters]);

  console.log("Countries", reference.countries);
  console.log("States", reference.states);
  console.log("Districts", reference.districts);
  console.log("Cities", reference.cities);
  console.log("Suburbs", reference.suburbs);

  const handleChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="p-6 max-w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">
          Asset Locations
        </h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 border rounded px-3 py-2 bg-slate-100 text-slate-700
    dark:bg-slate-800/60 dark:text-slate-200 border-slate-200 dark:border-white/10 shadow-sm"
        >
          <FiFilter /> Filters
        </button>
      </div>
      {/* Filters panel */}
      {showFilters && (
        <div
          className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 rounded-2xl
  bg-slate-50 border border-slate-200
  dark:bg-slate-800/60 dark:border-white/10"
        >
          {/* Country */}
          <div
            className="p-4 rounded-xl border space-y-2
  bg-white border-slate-200
  dark:bg-slate-900 dark:border-white/10"
          >
            <label className="font-semibold text-slate-700 dark:text-slate-200">
              Countries
            </label>
            {reference.countries.map((cnt) => (
              <label
                key={cnt.country}
                className={`
                  flex items-center gap-2 px-2 py-1 rounded cursor-pointer transition
                  ${
                    filters.country === cnt.country
                      ? "bg-blue-100 text-blue-700 dark:bg-cyan-500/10 dark:text-cyan-400"
                      : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
                  }
                `}
              >
                <input
                  type="radio"
                  checked={filters.country === cnt.country}
                  onChange={() => handleChange("country", cnt.country)}
                />
                <span className="text-sm">{cnt.country}</span>
              </label>
            ))}
          </div>

          {/* State */}
          <div
            className="p-4 rounded-xl border space-y-2
  bg-white border-slate-200
  dark:bg-slate-900 dark:border-white/10"
          >
            <label className="font-semibold text-slate-700 dark:text-slate-200">
              States
            </label>
            {!filters.country && (
              <span className="text-sm block text-slate-500 dark:text-slate-400">
                {" "}
                (Select Country first)
              </span>
            )}
            {(reference.states[filters.country] || []).map((st) => (
              <label
                key={st}
                className={`
                  flex items-center gap-2 px-2 py-1 rounded cursor-pointer transition
                  ${
                    filters.state === st
                      ? "bg-blue-100 text-blue-700 dark:bg-cyan-500/10 dark:text-cyan-400"
                      : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
                  }
                `}
              >
                <input
                  type="radio"
                  checked={filters.state === st}
                  onChange={() => handleChange("state", st)}
                />
                <span className="text-sm">{st}</span>
              </label>
            ))}
          </div>

          {/* District */}
          <div
            className="p-4 rounded-xl border space-y-2
  bg-white border-slate-200
  dark:bg-slate-900 dark:border-white/10"
          >
            <label className="font-semibold text-slate-700 dark:text-slate-200">
              Districts
            </label>
            {!filters.state && (
              <span className="text-sm block text-slate-500 dark:text-slate-400">
                {" "}
                (Select State first)
              </span>
            )}
            {(reference.districts[filters.state] || []).map((dt) => (
              <label
                key={dt}
                className={`
                  flex items-center gap-2 px-2 py-1 rounded cursor-pointer transition
                  ${
                    filters.district === dt
                      ? "bg-blue-100 text-blue-700 dark:bg-cyan-500/10 dark:text-cyan-400"
                      : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
                  }
                `}
              >
                <input
                  type="radio"
                  checked={filters.district === dt}
                  onChange={() => handleChange("district", dt)}
                />
                <span className="text-sm">{dt}</span>
              </label>
            ))}
          </div>

          {/* City */}
          <div
            className="p-4 rounded-xl border space-y-2
  bg-white border-slate-200
  dark:bg-slate-900 dark:border-white/10"
          >
            <label className="font-semibold text-slate-700 dark:text-slate-200">
              Cities
            </label>
            {!filters.district && (
              <span className="text-sm block text-slate-500 dark:text-slate-400">
                {" "}
                (Select District first)
              </span>
            )}
            {(reference.cities[filters.district] || []).map((ct) => (
              <label
                key={ct}
                className={`
                  flex items-center gap-2 px-2 py-1 rounded cursor-pointer transition
                  ${
                    filters.city === ct
                      ? "bg-blue-100 text-blue-700 dark:bg-cyan-500/10 dark:text-cyan-400"
                      : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
                  }
                `}
              >
                <input
                  type="radio"
                  checked={filters.city === ct}
                  onChange={() => handleChange("city", ct)}
                />
                <span className="text-sm">{ct}</span>
              </label>
            ))}
          </div>

          {/* Suburb */}
          <div
            className="p-4 rounded-xl border space-y-2
  bg-white border-slate-200
  dark:bg-slate-900 dark:border-white/10"
          >
            <label className="font-semibold text-slate-700 dark:text-slate-200">
              Suburbs
            </label>
            {!filters.city && (
              <span className="text-sm block text-slate-500 dark:text-slate-400">
                {" "}
                (Select City first)
              </span>
            )}
            {(reference.suburbs[filters.city] || []).map((sb) => (
              <label
                key={sb}
                className={`
                  flex items-center gap-2 px-2 py-1 rounded cursor-pointer transition
                  ${
                    filters.suburb === sb
                      ? "bg-blue-100 text-blue-700 dark:bg-cyan-500/10 dark:text-cyan-400"
                      : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
                  }
                `}
              >
                <input
                  type="radio"
                  checked={filters.suburb === sb}
                  onChange={() => handleChange("suburb", sb)}
                />
                <span className="text-sm">{sb}</span>
              </label>
            ))}
          </div>

          {/* clear button */}
          <div className="flex flex-col justify-end align-bottom">
            <button
              className="px-4 py-2 rounded-xl font-semibold
    bg-red-500/10 text-red-600
    hover:bg-red-500 hover:text-white
    dark:text-red-400 dark:hover:bg-red-500 dark:hover:text-red-100
    transition"
              onClick={() =>
                setFilters({
                  suburb: "",
                  city: "",
                  district: "",
                  state: "Tripura",
                  country: "India",
                })
              }
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}
      {/* Map */}
      <MapContainer
        center={[23.8315, 91.2868]}
        zoom={6}
        className="h-96 w-full rounded"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {locations.map((loc) => (
          <Marker key={loc.public_id} position={[loc.latitude, loc.longitude]}>
            <Popup>
              <b>{loc.public_id}</b>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      {/* Count */}
      <div className="text-sm text-gray-700">
        {loading ? "Processing..." : `Showing ${assetCount} assets`}
      </div>
    </div>
  );
}
