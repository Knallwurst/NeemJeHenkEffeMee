import styles from './FilterSidebar.module.css';
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';

const FilterSidebar = ({ onApplyFilters }) => {
    const [location, setLocation] = useState('');
    const [radius, setRadius] = useState(50); // Standaardwaarde op 50 km
    const [, setAutocomplete] = useState(null);

    useEffect(() => {
        if (window.google && window.google.maps && window.google.maps.places) {
            const autocompleteInstance = new window.google.maps.places.Autocomplete(
                document.getElementById("location-input"),
                { types: ["geocode"] }
            );

            autocompleteInstance.addListener("place_changed", () => {
                const place = autocompleteInstance.getPlace();
                if (place.geometry) {
                    setLocation(place.formatted_address);
                    onApplyFilters({
                        location: place.formatted_address,
                        radius,
                        coordinates: {
                            lat: place.geometry.location.lat(),
                            lng: place.geometry.location.lng()
                        }
                    });
                }
            });

            setAutocomplete(autocompleteInstance);
        } else {
            console.error("Google Maps API is niet geladen");
        }
    }, [onApplyFilters, radius]);

    const handleApplyFilters = () => {
        onApplyFilters({ location, radius });
    };

    return (
        <div className={styles['filter-sidebar']}>
            <h3>Filter Garages</h3>
            <label>
                Locatie
                <input
                    type="text"
                    id="location-input"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Typ een stad of dorp..."
                    autoComplete="on"
                />
            </label>
            <label>
                Straal: <strong>{radius} km</strong> {}
                <input
                    type="range"
                    min="5"
                    max="250"
                    step="5"
                    value={radius}
                    onChange={(e) => setRadius(Number(e.target.value))}
                />
            </label>
            <button onClick={handleApplyFilters}>Zoek garages</button>
        </div>
    );
};

export default FilterSidebar;