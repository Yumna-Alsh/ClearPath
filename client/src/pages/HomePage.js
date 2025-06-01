import React, { useEffect, useState, useContext } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import LocationPopup from "../components/reviews/LocationPopup";
import BottomDrawer from "../components/BottomDrawer"; 
import { LoggedInUserContext } from "../contexts/LoggedInUserContext";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function FlyToLocation({ location }) {
  const map = useMap();

  useEffect(() => {
    if (location?.coordinates?.lat && location?.coordinates?.lng) {
      map.flyTo([location.coordinates.lat, location.coordinates.lng], 15);
    }
  }, [location, map]);

  return null;
}

const center = [45.5017, -73.5673];

export default function HomePage() {
  const [locations, setLocations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [filter, setFilter] = useState("");
  const { user } = useContext(LoggedInUserContext);

  if (user) {
    console.log("Logged in as:", user.username);
  }

  useEffect(() => {
    fetch("/locations")
      .then((res) => res.json())
      .then((data) => {
        console.log("Locations fetched:", data);
        if (Array.isArray(data.locations)) {
          setLocations(data.locations);
        } else {
          console.error("Invalid locations response:", data);
          setLocations([]); 
        }
      })
      .catch((err) => console.error("Error fetching locations:", err));
  }, []);

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
    <div className="flex flex-col md:flex-row gap-4 items-center">
      <div className="flex w-full md:w-2/3 gap-2">
        <input
          type="text"
          placeholder="Search by name or address..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-grow border border-[#216a78] p-2 rounded-lg shadow-sm focus:ring-2 focus:ring-[#216a78] outline-none"
        />
        <button
          onClick={() => {
            const firstMatch = locations.find(
              (loc) =>
                (loc.name || "").toLowerCase().includes(inputValue.toLowerCase()) ||
                (loc.address || "").toLowerCase().includes(inputValue.toLowerCase())
            );
            setSelected(firstMatch || null);
          }}
          className="bg-[#216a78] hover:bg-[#1b5965] text-white px-4 py-2 rounded-lg transition"
        >
          Search
        </button>
      </div>
  
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
  
    <div className="rounded-xl overflow-hidden shadow-lg ring-1 ring-[#216a78]">
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: "80vh", width: "100%", zIndex: 10 }}
      >
        <TileLayer
          attribution="© OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FlyToLocation location={selected} />
        {filteredLocations.map((loc) => (
          <Marker
            key={loc._id}
            position={[loc.coordinates.lat, loc.coordinates.lng]}
            eventHandlers={{ click: () => setSelected(loc) }}
          />
        ))}
      </MapContainer>
    </div>
  
    <BottomDrawer selected={selected} onClose={() => setSelected(null)}>
      <div className="space-y-2 text-sm text-[#202254] p-4">
        <p>
          <strong>Address:</strong>{" "}
          {`${selected?.address}, ${selected?.city}, ${selected?.province}, ${selected?.postalCode}, ${selected?.country}`}
        </p>
        <p>
          <strong>Accessibility:</strong> {selected?.accessibility}
        </p>
        <p>
          <strong>Type:</strong> {selected?.type}
        </p>
        <LocationPopup locationId={selected?._id} user={user} />
      </div>
    </BottomDrawer>
  </div>
  
  );
}
