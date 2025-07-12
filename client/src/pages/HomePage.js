import React, { useEffect, useState, useContext } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import { useLocation } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import LocationPopup from "../components/reviews/LocationPopup";
import BottomDrawer from "../components/BottomDrawer";
import { LoggedInUserContext } from "../contexts/LoggedInUserContext";

// Override default Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Component to programmatically fly the map to a selected location
function FlyToLocation({ location }) {
  const map = useMap();

  useEffect(() => {
    // Fly to the coordinates of the selected location when it changes
    if (location?.coordinates?.lat && location?.coordinates?.lng) {
      map.flyTo([location.coordinates.lat, location.coordinates.lng], 15);
    }
  }, [location, map]);

  return null; // No UI rendered
}

// Default map center coordinates 
const center = [45.5017, -73.5673];

// Custom hook to parse URL query parameters
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function HomePage() {
  // State to hold list of all accessible locations
  const [locations, setLocations] = useState([]);
  // State to track currently selected location on the map
  const [selected, setSelected] = useState(null);
  // State for user input in search box
  const [inputValue, setInputValue] = useState("");
  // State for filtering locations by type
  const [filter, setFilter] = useState("");
  // Current logged-in user context
  const { user } = useContext(LoggedInUserContext);
  // Get query parameters from URL (to focus on a specific location)
  const query = useQuery();
  const focusId = query.get("focus");

  // Fetch all locations from server on component mount
  useEffect(() => {
    fetch("/locations")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.locations)) {
          setLocations(data.locations);
        }
      })
      .catch((err) => console.error("Error fetching locations:", err));
  }, []);

  // If URL contains a focusId, select that location after loading locations
  useEffect(() => {
    if (focusId && locations.length) {
      const found = locations.find((loc) => loc._id === focusId);
      if (found) {
        setSelected(found);
      }
    }
  }, [focusId, locations]);

  // Filter locations by search input and selected filter type
  const filteredLocations = locations.filter((loc) => {
    const matchesSearch = [
      loc.name,
      loc.address,
      loc.city,
      loc.postalCode,
      loc.province,
      loc.country,
    ].some((field) =>
      (field || "").toLowerCase().includes(inputValue.toLowerCase())
    );

    const matchesFilter = filter ? loc.type === filter : true;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-white text-[#202254] font-sans p-6 space-y-6">
      {/* Search and filter controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="flex w-full md:w-2/3 gap-2">
          {/* Search input */}
          <input
            type="text"
            placeholder="Search by name or address..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-grow border border-[#216a78] p-2 rounded-lg shadow-sm focus:ring-2 focus:ring-[#216a78] outline-none"
          />
          {/* Search button selects first matching location */}
          <button
            onClick={() => {
              const firstMatch = locations.find(
                (loc) =>
                  (loc.name || "")
                    .toLowerCase()
                    .includes(inputValue.toLowerCase()) ||
                  (loc.address || "")
                    .toLowerCase()
                    .includes(inputValue.toLowerCase())
              );
              setSelected(firstMatch || null);
            }}
            className="bg-[#216a78] hover:bg-[#1b5965] text-white px-4 py-2 rounded-lg transition"
          >
            Search
          </button>
        </div>

        {/* Filter dropdown to select location type */}
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-[#216a78] p-2 rounded-lg w-full md:w-1/3 shadow-sm focus:ring-2 focus:ring-[#216a78] outline-none"
        >
          <option value="">All Types</option>
          <option value="restroom">Restroom</option>
          <option value="restaurant">Restaurant</option>
          <option value="public building">Public Building</option>
        </select>
      </div>

      {/* Map container showing accessible locations */}
      <div className="rounded-xl overflow-hidden shadow-lg ring-1 ring-[#216a78]">
        <MapContainer
          center={center}
          zoom={13}
          scrollWheelZoom={false}
          style={{ height: "80vh", width: "100%", zIndex: 10 }}
        >
          {/* Map tiles */}
          <TileLayer
            attribution="© OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {/* Fly map to selected location */}
          <FlyToLocation location={selected} />
          {/* Render markers for all filtered locations */}
          {filteredLocations.map((loc) => (
            <Marker
              key={loc._id}
              position={[loc.coordinates.lat, loc.coordinates.lng]}
              eventHandlers={{ click: () => setSelected(loc) }}
            />
          ))}
        </MapContainer>
      </div>

      {/* Bottom drawer displaying details and reviews for selected location */}
      {selected && (
        <BottomDrawer selected={selected} onClose={() => setSelected(null)}>
          <div className="space-y-2 text-sm text-[#202254] p-4">
            <p>
              <strong>Address:</strong>{" "}
              {`${selected.address}, ${selected.city}, ${selected.province}, ${selected.postalCode}, ${selected.country}`}
            </p>
            <p>
              <strong>Type:</strong> {selected.type}
            </p>
            {/* LocationPopup component shows reviews and allows interactions */}
            <LocationPopup locationId={selected._id} user={user} />
          </div>
        </BottomDrawer>
      )}
    </div>
  );
}
