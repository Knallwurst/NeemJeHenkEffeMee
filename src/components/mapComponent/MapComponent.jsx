if (!import.meta.env.VITE_MAP_COMPONENT_API_KEY) {
  console.error('❌ Geen Google Maps API key gevonden. Controleer je .env bestand!');
}
import { APIProvider, Map } from '@vis.gl/react-google-maps';
import styles from './MapComponent.module.css';

function MapComponent({ filters }) {
  // const center = filters?.coordinates || { lat: 51.232442, lng: 4.939239 };
  // const zoom = filters?.coordinates ? 13 : 12;

  return (

      <>


              <APIProvider apiKey={import.meta.env.VITE_MAP_COMPONENT_API_KEY}>
                  <div style={{ width: '100vw', height: '100vh' }}>
                      <Map
                          style={{ width: '100%', height: '100%' }}
                          defaultCenter={{ lat: 51.508742, lng: -0.120850 }}
                          defaultZoom={10}
                          disableDefaultUI={true}
                      />
                  </div>

          </APIProvider>
      </>


  );
}

export default MapComponent;
