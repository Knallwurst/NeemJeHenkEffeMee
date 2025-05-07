if (!import.meta.env.VITE_MAP_COMPONENT_API_KEY) {
  console.error(
    "Geen Google Maps API key gevonden. Controleer je .env bestand!"
  );
}
import {
  APIProvider,
  Map,
  Marker,
  InfoWindow,
  useMap,
} from "@vis.gl/react-google-maps";
import styles from "./MapComponent.module.css";
import { useState, useEffect } from "react";
import { userDatabase } from "../../fictional database/db";
import { useNavigate } from "react-router-dom";

// Separate component to handle map movement
function MapController({ coordinates }) {
  const map = useMap();

  useEffect(() => {
    if (map && coordinates) {
      map.panTo(coordinates);
      map.setZoom(10);
    }
  }, [map, coordinates]);

  return null;
}

function MapComponent({ filters }) {
  const [coordinates, setCoordinates] = useState({
    lat: 52.37280565269903,
    lng: 4.8954380555006285,
  });
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState(userDatabase);
  const navigate = useNavigate();

  const handleContactClick = (email) => {
    const token = localStorage.getItem("token");
    if (!token) {
      // If not logged in, redirect to login page
      navigate("/login");
      return;
    }

    // If logged in, open email client in new tab
    window.open(`mailto:${email}`, "_blank");
  };

  useEffect(() => {
    if (filters) {
      // Calculate distance between two points using Haversine formula
      const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Radius of the earth in km
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(lat1 * (Math.PI / 180)) *
            Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in km
      };

      // Filter users within the specified radius
      const usersInRadius = userDatabase.filter((user) => {
        const distance = calculateDistance(
          filters.coordinates.lat,
          filters.coordinates.lng,
          user.location.lat,
          user.location.lng
        );
        return distance <= filters.radius;
      });

      setFilteredUsers(usersInRadius);
      setCoordinates(filters.coordinates);
    }
  }, [filters]);

  useEffect(() => {
    if (!filters && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.log("Geolocation error:", error);
          // Keep default coordinates if user denies or error occurs
        }
      );
    }
  }, [filters]);

  return (
    <>
      <APIProvider apiKey={import.meta.env.VITE_MAP_COMPONENT_API_KEY}>
        <div style={{ width: "100vw", height: "100vh" }}>
          <Map
            style={{ width: "100%", height: "100%" }}
            defaultCenter={coordinates}
            defaultZoom={8}
          >
            <MapController coordinates={coordinates} />
            {filteredUsers.map((user) => (
              <Marker
                key={user.id}
                position={user.location}
                title={user.name}
                onClick={() => setSelectedMarker(user)}
              />
            ))}
            {selectedMarker && (
              <InfoWindow
                position={selectedMarker.location}
                onCloseClick={() => setSelectedMarker(null)}
              >
                <div style={{ padding: "8px", maxWidth: "300px" }}>
                  <h3 style={{ margin: "0 0 8px 0" }}>{selectedMarker.name}</h3>
                  <p style={{ margin: "4px 0" }}>
                    <strong>Profession:</strong> {selectedMarker.profession}
                  </p>
                  <p style={{ margin: "4px 0" }}>
                    <strong>Experience:</strong> {selectedMarker.experience}{" "}
                    years
                  </p>
                  <p style={{ margin: "4px 0" }}>
                    <strong>Address:</strong> {selectedMarker.address}
                  </p>
                  <button
                    onClick={() => handleContactClick(selectedMarker.email)}
                    style={{
                      backgroundColor: "#4CAF50",
                      color: "white",
                      padding: "8px 16px",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      marginTop: "8px",
                      width: "100%",
                    }}
                  >
                    Contact Me
                  </button>
                </div>
              </InfoWindow>
            )}
          </Map>
        </div>
      </APIProvider>
    </>
  );
}

export default MapComponent;
