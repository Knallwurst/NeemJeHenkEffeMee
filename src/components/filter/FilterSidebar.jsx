import styles from './FilterSidebar.module.css';
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';

const FilterSidebar = ({ onApplyFilters }) => {
    const [location, setLocation] = useState('');
    const [radius, setRadius] = useState(50); // Standaardwaarde op 50 km

    useEffect(() => {
        const input = document.getElementById("location-input");

        const handlePlaceChange = (event) => {
            const place = event.detail;
            if (place && place.geometry) {
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
        };

        if (input) {
            input.addEventListener("gmp-placeautocomplete-placechanged", handlePlaceChange);
        }

        return () => {
            if (input) {
                input.removeEventListener("gmp-placeautocomplete-placechanged", handlePlaceChange);
            }
        };
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
                    className={styles['input-field']}
                    placeholder="Typ een locatie..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
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
                    className={styles['slider']}
                />
            </label>
            <button onClick={handleApplyFilters}>Zoek garages</button>
        </div>
    );
};

export default FilterSidebar;