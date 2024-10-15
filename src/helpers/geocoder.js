export const geocodeAddress = (address, callback) => {
    const {geocode} = new window.google.maps.Geocoder();

    geocode({ address }, (results, status) => {
        if (status === 'OK') {
            if (results.length > 0) {
                const {geometry} = results[0];
                const {location} = geometry;
                const {address_components: addressComponents} = results[0];

                if (addressComponents) {
                    // Pass both the location and the address components to the callback
                    callback(location, addressComponents);
                } else {
                    console.error("No address components found in geocoder response.");
                }
            } else {
                console.error("Geocode was not successful for the following reason: " + status);
            }
        } else {
            console.error("Geocode was not successful for the following reason: " + status);
        }
    });
};