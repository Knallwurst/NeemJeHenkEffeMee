import { useState } from "react";
import MapComponent from "../../components/mapComponent/MapComponent.jsx";
import FilterSidebar from "../../components/filter/FilterSidebar.jsx";

function Homepage() {
  const [filters, setFilters] = useState(null);

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div>
      <FilterSidebar onApplyFilters={handleApplyFilters} />
      <MapComponent filters={filters} />
    </div>
  );
}

export default Homepage;
