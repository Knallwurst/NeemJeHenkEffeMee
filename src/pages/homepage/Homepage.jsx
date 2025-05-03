import MapComponent from "../../components/mapComponent/MapComponent.jsx";
import FilterSidebar from "../../components/filter/FilterSidebar.jsx";

function Homepage() {
    return (
        <div>
            <FilterSidebar/>
            <MapComponent/>
        </div>
    );
}

export default Homepage;