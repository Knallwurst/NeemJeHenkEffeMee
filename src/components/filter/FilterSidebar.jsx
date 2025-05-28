import styles from "./FilterSidebar.module.css";
import { useState, useEffect, useRef } from "react";

const FilterSidebar = ({ onApplyFilters }) => {
  const [location, setLocation] = useState("");
  const [radius, setRadius] = useState(50);
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const autocompleteRef = useRef(null);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const allBrands = [
    "Audi",
    "BMW",
    "Citroën",
    "Dacia",
    "Fiat",
    "Ford",
    "Hyundai",
    "Kia",
    "Mercedes",
    "Opel",
    "Peugeot",
    "Renault",
    "Seat",
    "Skoda",
    "Toyota",
    "Volkswagen",
    "Volvo",
  ];

  useEffect(() => {
    // Sluiten dropdown wanneer je buiten klikt
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    // Autocomplete
    const initializeAutocomplete = () => {
      if (!window.google || !window.google.maps || !window.google.maps.places) {
        console.warn("Google Maps API not loaded yet");
        return;
      }

      if (!inputRef.current) {
        console.warn("Input ref not available");
        return;
      }

      try {
        autocompleteRef.current = new window.google.maps.places.Autocomplete(
          inputRef.current,
          {
            componentRestrictions: { country: "nl" },
            fields: ["formatted_address", "geometry"],
            types: ["geocode"],
          }
        );

        autocompleteRef.current.addListener("place_changed", () => {
          const place = autocompleteRef.current.getPlace();
          if (place.geometry) {
            setLocation(place.formatted_address);
            onApplyFilters({
              location: place.formatted_address,
              radius,
              coordinates: {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
              },
              brands: brands,
            });
          }
        });
      } catch (error) {
        console.error("Error initializing autocomplete:", error);
      }
    };

    // Als Google Maps geladen is, probeer gelijk te initiaten
    initializeAutocomplete();

    // Stel een controle in om te initialiseren zodra Google Maps beschikbaar is
    const checkGoogleMaps = setInterval(() => {
      if (window.google && window.google.maps && window.google.maps.places) {
        initializeAutocomplete();
        clearInterval(checkGoogleMaps);
      }
    }, 1000);

    // Cleanup
    return () => {
      clearInterval(checkGoogleMaps);
      if (autocompleteRef.current) {
        window.google.maps.event.clearInstanceListeners(
          autocompleteRef.current
        );
      }
    };
  }, [onApplyFilters, radius, brands]);

  const handleApplyFilters = () => {
    if (location.trim() === "") {
      alert("Vul een locatie in.");
      return;
    }

    setIsLoading(true);
    const geocoder = new window.google.maps.Geocoder();

    geocoder.geocode({ address: location }, (results, status) => {
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

  const toggleBrand = (brand) => {
    setBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const removeBrand = (brandToRemove) => {
    setBrands(brands.filter((brand) => brand !== brandToRemove));
  };

  const resetFilters = () => {
    setLocation("");
    setRadius(50);
    setBrands([]);
    onApplyFilters(null);
  };

  return (
    <div className={styles["filter-sidebar"]}>
      <h3>Filter Garages</h3>
      <label>
        Locatie
        <input
          ref={inputRef}
          type="text"
          id="location-input"
          placeholder="Typ een stad of dorp..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onKeyPress={handleKeyPress}
          className={styles["input-field"]}
        />
      </label>
      <div className={styles["brand-select-container"]} ref={dropdownRef}>
        <label>Merken</label>
        <div
          className={styles["brand-select"]}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <div className={styles["selected-brands"]}>
            {brands.length > 0 ? (
              <div className={styles["brand-chips"]}>
                {brands.map((brand) => (
                  <div key={brand} className={styles["brand-chip"]}>
                    {brand}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeBrand(brand);
                      }}
                      className={styles["chip-remove"]}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <span className={styles["placeholder"]}>Selecteer merken</span>
            )}
          </div>
          <span className={styles["dropdown-arrow"]}>▼</span>
        </div>
        {isDropdownOpen && (
          <div className={styles["brand-dropdown"]}>
            {allBrands.map((brand) => (
              <div
                key={brand}
                className={`${styles["brand-option"]} ${
                  brands.includes(brand) ? styles["selected"] : ""
                }`}
                onClick={() => toggleBrand(brand)}
              >
                <input
                  type="checkbox"
                  checked={brands.includes(brand)}
                  onChange={() => {}}
                  className={styles["brand-checkbox"]}
                />
                {brand}
              </div>
            ))}
          </div>
        )}
      </div>
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
      <div className={styles["button-group"]}>
        <button onClick={handleApplyFilters} disabled={isLoading}>
          {isLoading ? "Zoeken..." : "Zoek garages"}
        </button>
        <button onClick={resetFilters} className={styles["reset-button"]}>
          Reset filters
        </button>
      </div>
    </div>
  );
};

export default FilterSidebar;
