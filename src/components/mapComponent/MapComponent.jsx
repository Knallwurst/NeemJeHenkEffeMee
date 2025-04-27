/* global google */

import styles from "./MapComponent.module.css";
import { Loader } from "@googlemaps/js-api-loader";
import {useState, useEffect, useContext} from 'react';
import {userDatabase} from '../../fictional database/db.js'; // Import users from the fictional database
import {geocodeAddress} from '../..//helpers/geocoder.js'; // Helper function to geocode address
import {AuthContext} from "../../context/AuthContext.jsx";
import Button from "../button/Button.jsx";
import Input from "../input/Input.jsx";
import FilterSidebar from '../filter/FilterSidebar.jsx';

console.log("Google API Key:", import.meta.env.VITE_MAP_COMPONENT_API_KEY);
console.log("Google Maps API beschikbaar:", typeof google !== "undefined" ? google : "Niet geladen");

function MapComponent() {
    const {isAuth} = useContext(AuthContext); // Access isAuth from AuthContext
    const [map, setMap] = useState(null);
    const [markers, setMarkers] = useState([]);
    const [infoWindow, setInfoWindow] = useState(null); // Store a single info window instance


    // Preset fallback location (Neemjehenkffmee Office)
    const fallbackLocation = {lat: 51.232442, lng: 4.939239};
    const [filters, setFilters] = useState({});
    console.log("Huidige filters:", filters);

    useEffect(() => {
        const loader = new Loader({
            apiKey: import.meta.env.VITE_MAP_COMPONENT_API_KEY,
            version: "weekly",
            libraries: ["places"]
        });

        loader
            .load()
            .then(() => {
                console.log("Google Maps API geladen via @googlemaps/js-api-loader");
                getUserLocation();
            })
            .catch((err) => {
                console.error("Google Maps loader error:", err);
                alert("Failed to load Google Maps. Please try again later.");
            });
    }, []);

    // Removed loadScript function as it is no longer needed.

    // Use Geolocation API to get the user's current location, fallback if unavailable
    const getUserLocation = async () => {
        try {
            const waitForGoogle = () => {
                return new Promise((resolve, reject) => {
                    let attempts = 0;
                    const maxAttempts = 20;
                    const interval = setInterval(() => {
                        if (window.google && window.google.maps) {
                            clearInterval(interval);
                            resolve();
                        } else if (++attempts > maxAttempts) {
                            clearInterval(interval);
                            reject("Google Maps API not available after multiple attempts");
                        }
                    }, 200); // check elke 200ms
                });
            };

            await waitForGoogle();

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const userLocation = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        };
                        initMap(userLocation); // Initialize the map at the user's location
                    },
                    (error) => {
                        console.warn("Error getting user's location:", error);
                        initMap(fallbackLocation); // Fallback to default location
                    }
                );
            } else {
                console.warn("Geolocation is not supported by this browser.");
                initMap(fallbackLocation); // Fallback to default location
            }
        } catch (error) {
            console.error("Error waiting for Google Maps:", error);
            initMap(fallbackLocation); // Fallback to default location
        }
    };

    // Initialize the map at a given location
    const initMap = (location) => {
        try {
            const googleMap = new window.google.maps.Map(document.getElementById('map'), {
                zoom: 12, // Zoom level to see the area in detail
                center: location, // Center the map at the given location
                mapId: import.meta.env.VITE_MAP_ID_KEY, // Use the map ID from .env variable
                disableDefaultUI: true, // Add this line to disable all default UI controls
            });

            setMap(googleMap);

            // Create a single InfoWindow instance to be reused across markers
            const newInfoWindow = new window.google.maps.InfoWindow();
            setInfoWindow(newInfoWindow);

            if (isAuth) {
                // Only show markers when authenticated
                userDatabase.forEach((user) => {
                    addUserMarker(googleMap, user, newInfoWindow);
                });
            }
        } catch (error) {
            console.error("Error initializing the map:", error);
            alert("Failed to initialize the map. Please try again later.");
        }
    };

    // Function to add a pin marker for a user
    const addUserMarker = (mapInstance, user, infoWindow) => {
        try {
            // Create the marker at the user's location
            const marker = new window.google.maps.Marker({
                map: mapInstance,
                position: user.location,
                title: user.name,  // Tooltip that shows on hover
            });

            // Extract the class name from the CSS module
            const userInfoBalloonClass = styles["user-info-balloon"];

            // Create the content for the info window using the resolved class name
            const infoWindowContent = `
                <div>
                    <p class="${userInfoBalloonClass}"><strong>${user.name}</strong></p>
                    <p class="${userInfoBalloonClass}">Address: ${user.address}</p>
                    <p class="${userInfoBalloonClass}">Contact: ${user.email}</p>
                    <p class="${userInfoBalloonClass}">${user.profession} with ${user.experience} years of experience</p>
                </div>
            `;

            // Add a click listener to the marker to show the info window
            marker.addListener('click', () => {
                // Close any currently open info window
                infoWindow.close();

                // Set the content of the info window dynamically based on the clicked marker
                infoWindow.setContent(infoWindowContent);
                // Open the info window anchored to the clicked marker
                infoWindow.open(mapInstance, marker);
            });

            return marker;
        } catch (error) {
            console.error("Error adding marker:", error);
        }
    };

    // Function to clear existing markers
    const clearMarkers = () => {
        markers.forEach((marker) => marker.setMap(null)); // Remove each marker from the map
        setMarkers([]); // Reset the markers state
    };

    const handleApplyFilters = (newFilters) => {
        setFilters(newFilters);
        console.log('Toegepaste filters:', newFilters);

        if (newFilters.coordinates && map !== null) {
            map.setCenter(newFilters.coordinates);
            map.setZoom(14);

            // Zoek garages in de buurt met Google Places API
            findNearbyGarages(newFilters.coordinates, newFilters.radius);
        }
    };

    const findNearbyGarages = (location, radius) => {
        const service = new window.google.maps.places.PlacesService(map);

        const request = {
            location,
            radius: radius * 1000, // Omzetten naar meters
            type: ['car_repair'], // Zoeken naar garages / autoreparatiebedrijven
        };

        service.nearbySearch(request, (results, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                console.log("Gevonden garages:", results);

                clearMarkers(); // Verwijder oude markers

                const newMarkers = results.map(place => {
                    const marker = new window.google.maps.Marker({
                        map: map,
                        position: place.geometry.location,
                        title: place.name,
                    });

                    // Info-venster voor garage
                    const infoWindow = new window.google.maps.InfoWindow({
                        content: `<strong>${place.name}</strong><br>${place.vicinity}`
                    });

                    marker.addListener("click", () => {
                        infoWindow.open(map, marker);
                    });

                    return marker;
                });

                setMarkers(newMarkers);
            } else {
                console.error("Geen garages gevonden:", status);
            }
        });
    };

    // Function to calculate the distance between two locations (Haversine formula)
    const calculateDistance = (location1, location2) => {
        const toRadians = (degrees) => degrees * (Math.PI / 180);
        const R = 6371; // Radius of Earth in kilometers
        const dLat = toRadians(location2.lat - location1.lat);
        const dLng = toRadians(location2.lng - location1.lng);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadians(location1.lat)) * Math.cos(toRadians(location2.lat)) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in kilometers
    };

    return (
        <div className={styles["address-container"]}>
            {/* Sidebar voor filters */}
            <FilterSidebar onApplyFilters={handleApplyFilters} />

            <div id="map" className={styles["map-container"]}></div>
        </div>
    );
}

export default MapComponent;