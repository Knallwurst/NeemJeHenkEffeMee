import styles from './FilterSidebar.module.css';
import { useState } from 'react';

const FilterSidebar = ({ onApplyFilters }) => {
  const [location, setLocation] = useState('');
  const [radius, setRadius] = useState(50);

  const handleApplyFilters = () => {
    if (location.trim() === '') {
      alert('Vul een locatie in.');
      return;
    }

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: location }, (results, status) => {
      if (status === "OK" && results[0]) {
        const place = results[0];
        onApplyFilters({
          location: place.formatted_address,
          radius,
          coordinates: {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          }
        });
      } else {
        console.error("❌ Geocode mislukt:", status, results);
        alert("Kon de locatie niet vinden. Probeer een andere plaatsnaam.");
      }
    });
  };

  return (
    <div className={styles['filter-sidebar']}>
      <h3>Filter Garages</h3>
      <label>
        Locatie
        <input
          type="text"
          id="location-input"
          placeholder="Typ een stad of dorp..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className={styles['input-field']}
        />
      </label>
      <label>
        Straal: <strong>{radius} km</strong>
        <input
          type="range"
          min="5"
          max="100"
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
