import styles from "./FilterSidebar.module.css";
import { useState } from "react";

const FilterSidebar = ({ onApplyFilters }) => {
  const [location, setLocation] = useState("");
  const [radius, setRadius] = useState(50);
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleApplyFilters = () => {
    if (location.trim() === "") {
      alert("Vul een locatie in.");
      return;
    }

    setIsLoading(true);
    const geocoder = new window.google.maps.Geocoder();

    // Add "Belgium" to the search query if not already included
    const searchQuery = location.toLowerCase();

    geocoder.geocode({ address: searchQuery }, (results, status) => {
      setIsLoading(false);
      if (status === "OK" && results[0]) {
        const place = results[0];
        onApplyFilters({
          location: place.formatted_address,
          radius,
          coordinates: {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          },
          brands: brands,
        });
      } else {
        console.error("❌ Geocode mislukt:", status, results);
        alert("Kon de locatie niet vinden. Probeer een andere plaatsnaam.");
      }
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleApplyFilters();
    }
  };

  return (
    <div className={styles["filter-sidebar"]}>
      <h3>Filter Garages</h3>
      <label>
        Locatie
        <input
          type="text"
          id="location-input"
          placeholder="Typ een stad of dorp..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onKeyPress={handleKeyPress}
          className={styles["input-field"]}
        />
      </label>
      <label>
        Merken
        <select
          id="brands-select"
          value={brands}
          onChange={(e) => setBrands([e.target.value])}
          className={styles["input-field"]}
        >
          <option value="" disabled selected>Kies een merk</option>
          <option value="Audi">Audi</option>
          <option value="BMW">BMW</option>
          <option value="Citroën">Citroën</option>
          <option value="Dacia">Dacia</option>
          <option value="Fiat">Fiat</option>
          <option value="Ford">Ford</option>
          <option value="Hyundai">Hyundai</option>
          <option value="Kia">Kia</option>
          <option value="Mercedes">Mercedes</option>
          <option value="Opel">Opel</option>
          <option value="Peugeot">Peugeot</option>
          <option value="Renault">Renault</option>
          <option value="Seat">Seat</option>
          <option value="Skoda">Skoda</option>
          <option value="Toyota">Toyota</option>
          <option value="Volkswagen">Volkswagen</option>
          <option value="Volvo">Volvo</option>
        </select>
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
      <button onClick={handleApplyFilters} disabled={isLoading}>
        {isLoading ? "Zoeken..." : "Zoek garages"}
      </button>
    </div>
  );
};

export default FilterSidebar;
