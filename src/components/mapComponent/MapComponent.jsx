if (!import.meta.env.VITE_MAP_COMPONENT_API_KEY) {
  console.error(
    "❌ Geen Google Maps API key gevonden. Controleer je .env bestand!"
  );
}
import {
  APIProvider,
  Map,
  InfoWindow,
  useMap,
  AdvancedMarker,
} from "@vis.gl/react-google-maps";
import { useState, useEffect, useContext } from "react";
import { userDatabase } from "../../fictional database/db";
import { StarIconSvg } from "./icons/StarIconSvg";
import { pullUserInfo, pushUserInfo } from "../../data/novi/UserInfoApi";
import { AuthContext } from "../../context/AuthContext";

// Positie van de kaart aanpast wanneer de coordinates veranderen
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

// Color mapping functie
const getInitialColor = (initial) => {
  const colors = {
    A: "#FF6B6B", // Coral Red
    B: "#4ECDC4", // Turquoise
    C: "#45B7D1", // Sky Blue
    D: "#96CEB4", // Sage Green
    E: "#FFEEAD", // Cream Yellow
    F: "#D4A5A5", // Dusty Rose
    G: "#9B59B6", // Purple
    H: "#3498DB", // Blue
    I: "#E67E22", // Orange
    J: "#2ECC71", // Emerald
    K: "#E74C3C", // Red
    L: "#F1C40F", // Yellow
    M: "#1ABC9C", // Teal
    N: "#34495E", // Dark Blue
    O: "#E84393", // Pink
    P: "#00B894", // Mint
    Q: "#6C5CE7", // Purple
    R: "#FD79A8", // Light Pink
    S: "#00CEC9", // Turquoise
    T: "#FDCB6E", // Yellow
    U: "#0984E3", // Blue
    V: "#6AB04C", // Green
    W: "#E17055", // Coral
    X: "#A29BFE", // Lavender
    Y: "#FF7675", // Salmon
    Z: "#74B9FF", // Light Blue
  };

  return colors[initial.toUpperCase()] || "#a31ab0"; // Default color als initial niet gevonden is
};

// Custom Marker Component
const CustomMarker = ({ user, onClick }) => {
  const initial = user.name.charAt(0);
  const backgroundColor = getInitialColor(initial);

  return (
    <div
      onClick={onClick}
      style={{
        cursor: "pointer",
        position: "relative",
        transform: "translate(-50%, -50%)",
      }}
    >
      <div
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          backgroundColor: backgroundColor,
          border: "2px solid white",
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          padding: "8px",
          fontSize: "24px",
          fontWeight: "bold",
        }}
      >
        {initial}
      </div>
    </div>
  );
};

function MapComponent({ filters }) {
  const [coordinates, setCoordinates] = useState({
    lat: 52.37280565269903,
    lng: 4.8954380555006285,
  });
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState(userDatabase);

  const handleContactClick = (email) => {
    window.open(`mailto:${email}`, "_blank");
  };

  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("token");
      

  // State to read and set starred garages
  const [starredGarages, setStarredGarages] = useState([]);
  const isSelectedMarkerStarred = selectedMarker ? starredGarages.includes(selectedMarker.id) : false;

  // Function to star a garage
  const handleStarOrUnstarGarage = async () => {
    const selectedGarageId = selectedMarker.id;

    // 1. Compute new list of starred garages
    let updatedStarredGarages;
    if (isSelectedMarkerStarred) {
      // Remove starred garage
      updatedStarredGarages = starredGarages.filter(starredGarageId => starredGarageId !== selectedGarageId);
    }
    else {
      // Add starred garage
      updatedStarredGarages = [...starredGarages, selectedGarageId];
    }

    // 2. Update UI
    setStarredGarages(updatedStarredGarages);

    // 3. Push updated data to cloud
    const updatedUserInfo = { starredGarages: updatedStarredGarages, defaultFilters: [] /* not important yet */ };
    try {
      await pushUserInfo(user.username, token, updatedUserInfo);
    } catch (error) {
      confirm("Failed to star garage. Please check the console for more details");
      console.error(error);
    }
  };

  // Effect to load starred garages
  useEffect(() => {
    const loadStarredGarages = async () => {
      if (!user?.username || !token) {
        return;
      }

      // 1. Fetch data from cloud
      const userInfo = await pullUserInfo(user.username, token);

      // 2. Update UI
      setStarredGarages(userInfo.starredGarages);
    };

    loadStarredGarages();
  }, [user?.username, token]);

  useEffect(() => {
    if (filters) {
      // Haversine formule voor afstand te berekenen
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
        return R * c; // Afstand in km's
      };

      // Filter users binnen een radius die voldoen aan filter eisen
      const usersInRadius = userDatabase.filter((user) => {
        const distance = calculateDistance(
          filters.coordinates.lat,
          filters.coordinates.lng,
          user.location.lat,
          user.location.lng
        );

        // Check user binnen radius
        const withinRadius = distance <= filters.radius;

        // Check als user brands heeft geselecteerd
        const hasMatchingBrands =
          filters.brands.length === 0 ||
          filters.brands.some((selectedBrand) =>
            (user.brands || []).some(
              (userBrand) =>
                userBrand.toLowerCase() === selectedBrand.toLowerCase()
            )
          );

        return withinRadius && hasMatchingBrands;
      });

      setFilteredUsers(usersInRadius);
      setCoordinates(filters.coordinates);
    } else {
      // Reset om alle gebruikers te tonen wanneer filters worden verwijderd
      setFilteredUsers(userDatabase);
      // Reset naar standaardcoördinaten of locatie van de gebruiker
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setCoordinates({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (error) => {
            console.log("Geolocation error:", error);
            // Behoud standaardcoördinaten als de gebruiker weigert of er een fout optreedt
          }
        );
      }
    }
  }, [filters]);

  return (
    <>
      <APIProvider
        apiKey={import.meta.env.VITE_MAP_COMPONENT_API_KEY}
        libraries={["places"]}
      >
        <div style={{ width: "100vw", height: "100vh" }}>
          <Map
            style={{ width: "100%", height: "100%" }}
            defaultCenter={coordinates}
            defaultZoom={8}
            mapId={import.meta.env.VITE_MAP_ID || "YOUR_MAP_ID"}
          >
            <MapController coordinates={coordinates} />
            {filteredUsers.map((user) => (
              <AdvancedMarker
                key={user.id}
                position={user.location}
                onClick={() => setSelectedMarker(user)}
              >
                <CustomMarker
                  user={user}
                  onClick={() => setSelectedMarker(user)}
                />
              </AdvancedMarker>
            ))}
            {selectedMarker && (
              <InfoWindow
                position={selectedMarker.location}
                onCloseClick={() => setSelectedMarker(null)}
              >
                <div style={{ padding: "8px", maxWidth: "300px" }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "5px",
                    }}
                  >
                    <img
                      src={"https://thispersondoesnotexist.com/"}
                      alt={selectedMarker.name}
                      style={{
                        width: "70px",
                        height: "70px",
                        objectFit: "cover",
                        borderRadius: "50%",
                        marginBottom: "8px",
                      }}
                    />
                    <h3 style={{ margin: "0 0 8px 0" }}>
                      {selectedMarker.name}
                    </h3>
                  </div>
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
                  <p style={{ margin: "4px 0" }}>
                    <strong>Brand:</strong>
                    {selectedMarker.brands.join(", ")}
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
                    Stuur me een bericht
                  </button>
                </div>
                <button
                  style={{
                    position: "absolute",
                    left: 20,
                    top: 20,
                    padding: 0,
                    background: "transparent"
                  }}
                  onClick={handleStarOrUnstarGarage}
                >
                  <StarIconSvg isSelected={isSelectedMarkerStarred} />
                </button>
              </InfoWindow>
            )}
          </Map>
        </div>
      </APIProvider>
    </>
  );
}

export default MapComponent;
