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
        if(filters.suburb == "" && filters.city == "" && filters.district == "" && filters.state == "" && filters.country == "") return;
        const res = await API.get("/locations", { params: filters });
        setLocations(res.data);
        setAssetCount(res.data[0]?.asset_count || 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLocations();
  }, [filters]);
  const handleChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="max-w-full bg-white p-6 rounded shadow space-y-4">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Assets</h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 border px-4 py-2 rounded hover:bg-gray-100"
        >
          <FiFilter /> Filters
        </button>
      </div>
      {/* Filters panel */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 border p-4 rounded bg-orange-50">
          {/* Country */}
          <div className="border rounded p-2">
            <label className="font-medium">Countries</label>
            {reference.countries.map((cnt) => (
              <div key={cnt} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="country"
                  checked={filters.country === cnt}
                  onChange={() => handleChange("category", cnt)}
                />
                <span>{cnt}</span>
              </div>
            ))}
          </div>

          {/* State */}
          <div className="border rounded p-2">
            <label className="font-medium">States</label>
            {!filters.country && (
              <span className="text-sm block"> (Select Country first)</span>
            )}
            {(reference.states[filters.country] || []).map((st) => (
              <div key={st} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="state"
                  checked={filters.state === st}
                  onChange={() => handleChange("subcategory", st)}
                />
                <span>{st}</span>
              </div>
            ))}
          </div>

          {/* District */}
          <div className="border rounded p-2">
            <label className="font-medium">Districts</label>
            {!filters.state && (
              <span className="text-sm block"> (Select State first)</span>
            )}
            {(reference.districts[filters.state] || []).map((dt) => (
              <div key={dt} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="district"
                  checked={filters.district === dt}
                  onChange={() => handleChange("subcategory", dt)}
                />
                <span>{dt}</span>
              </div>
            ))}
          </div>

          {/* City */}
          <div className="border rounded p-2">
            <label className="font-medium">Cities</label>
            {!filters.district && (
              <span className="text-sm block"> (Select District first)</span>
            )}
            {(reference.cities[filters.district] || []).map((ct) => (
              <div key={ct} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="city"
                  checked={filters.city === ct}
                  onChange={() => handleChange("subcategory", ct)}
                />
                <span>{ct}</span>
              </div>
            ))}
          </div>

          {/* Suburb */}
          <div className="border rounded p-2 col-start-2">
            <label className="font-medium">Suburbs</label>
            {!filters.city && (
              <span className="text-sm block"> (Select City first)</span>
            )}
            {(reference.suburbs[filters.city] || []).map((sb) => (
              <div key={sb} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="suburb"
                  checked={filters.suburb === sb}
                  onChange={() => handleChange("subcategory", sb)}
                />
                <span>{sb}</span>
              </div>
            ))}
          </div>

          {/* clear button */}
          <div className="flex flex-col justify-end align-bottom">
            <button
              className="px-4 py-2 rounded text-sm font-semibold text-white bg-orange-400"
              onClick={() =>
                setFilters({
                  search: "",
                  category: "",
                  subcategory: "",
                  vendor: "",
                  status: "",
                  warranty_expiry_status: "",
                  warranty_expiry_from: "",
                  warranty_expiry_to: "",
                  sort_by: "",
                  sort_direction: "asc",
                  purchase_date_from: "",
                  purchase_date_to: "",
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
