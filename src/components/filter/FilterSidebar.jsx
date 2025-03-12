import styles from './FilterSidebar.module.css';

import React, { useState } from 'react';

const FilterSidebar = ({ onApplyFilters }) => {
    const [location, setLocation] = useState('');
    const [radius, setRadius] = useState(10);  // Default radius in km

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
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Voer een locatie in"
                />
            </label>
            <label>
                Straal (km)
                <input
                    type="number"
                    value={radius}
                    onChange={(e) => setRadius(e.target.value)}
                    min="1"
                />
            </label>
            <button onClick={handleApplyFilters}>Filters toepassen</button>
        </div>
    );
};

export default FilterSidebar;