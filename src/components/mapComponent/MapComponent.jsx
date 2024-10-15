import styles from "./MapComponent.module.css";
import {useState, useEffect, useContext} from 'react';
import {userDatabase} from '../../../../neemjehenkffmee/src/fictional database/db.js'; // Import users from the fictional database
import {geocodeAddress} from '../../../../neemjehenkffmee/src/helpers/geocoder.js'; // Helper function to geocode address
import {AuthContext} from "../../../../neemjehenkffmee/src/context/AuthContext.jsx";
import Button from "../button/Button.jsx";
import Input from "../input/Input.jsx";
import {useForm} from "react-hook-form"; // Import the AuthContext

function MapComponent() {
    const {isAuth} = useContext(AuthContext); // Access isAuth from AuthContext
    const [map, setMap] = useState(null);
    const [markers, setMarkers] = useState([]);
    const [infoWindow, setInfoWindow] = useState(null); // Store a single info window instance
    const {formState: {errors}, register} = useForm({mode: 'onChange'});


    // Preset fallback location (Neemjehenkffmee Office)
    const fallbackLocation = {lat: 51.232442, lng: 4.939239};

    useEffect(() => {
        // Load the Google Maps script asynchronously
        const loadGoogleMapsScript = async () => {
            if (!document.querySelector('script[src*="maps.googleapis.com"]')) {
                try {
                    // Load the Google Maps API with the map ID and marker library
                    await loadScript(`https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_MAP_COMPONENT_API_KEY}&map_ids=${import.meta.env.VITE_MAP_ID_KEY}&libraries=marker`);
                    await getUserLocation(); // Once script is loaded, initialize the map
                } catch (error) {
                    console.error("Error loading Google Maps script:", error);
                    alert("Failed to load Google Maps. Please try again later.");
                }
            } else {
                await getUserLocation(); // If script is already present, proceed with the map setup
            }
        };

        loadGoogleMapsScript().then(); // Load the script on mount
    }, []);

    // Helper function to load a script asynchronously
    const loadScript = (src) => {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.defer = true;
            script.onload = () => resolve();
            script.onerror = (err) => reject(err);
            document.head.appendChild(script);
        });
    };

    // Use Geolocation API to get the user's current location, fallback if unavailable
    const getUserLocation = async () => {
        try {
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
            console.error("Error in geolocation:", error);
            initMap(fallbackLocation); // Fallback to default location
        }
    };

    // Initialize the map at a given location
    const initMap = (location) => {
        try {
            const googleMap = new window.google.maps.Map(document.getElementById('map'), {
                zoom: 12, // Zoom level to see the area in detail
                center: location, // Center the map at the given location
                mapId: import.meta.env.VITE_MAP_ID_KEY // Use the map ID from .env variable
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

    // Function to handle search for closest users
    const handleSearch = async (event) => {
        event.preventDefault();
        const searchAddress = event.target.address.value;

        if (!isAuth) {
            alert("You must be authenticated to search for users.");
            return;
        }

        try {
            // Use the geocodeAddress helper function to convert the search address to coordinates
            geocodeAddress(searchAddress, (searchLocation) => {
                if (!searchLocation) {
                    console.error("Error retrieving search location");
                    return;
                }

                // Convert the searchLocation (Google LatLng object) to a plain object
                const searchCoordinates = {
                    lat: searchLocation.lat(),
                    lng: searchLocation.lng()
                };

                // Calculate the distance from the search location to all users, including newly added ones
                const distances = userDatabase.map((user) => {
                    const distance = calculateDistance(searchCoordinates, user.location);
                    return {...user, distance};
                });

                // Sort users by distance and select the closest ones
                const closestUsers = distances.sort((a, b) => a.distance - b.distance).slice(0, 5);

                // Get the closest user
                const closestUser = closestUsers[0];

                // Clear any existing markers before adding new ones
                clearMarkers();

                // Add markers for the closest users
                const newMarkers = closestUsers.map((user) => addUserMarker(map, user, infoWindow));
                setMarkers(newMarkers);

                // Center the map on the closest user's location
                map.setCenter(closestUser.location);

                map.setZoom(13); // Set zoom level to a more focused level for the closest user
            });
        } catch (error) {
            console.error("Error during geocoding or marker addition:", error);
        }

        event.target.reset(); // Reset the search input
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
            {/* Search Closest Users Form */}
            <form className={styles["search-form"]} onSubmit={handleSearch}>
                <Input
                    id="search-address-field"
                    type="text"
                    name="address"
                    register={register}
                    errors={errors}
                    placeholder="Search Henk by address..." required
                />

                <Button type="submit">Search</Button>
            </form>

            <div id="map" className={styles["map-container"]}></div>
        </div>
    );
}

export default MapComponent;