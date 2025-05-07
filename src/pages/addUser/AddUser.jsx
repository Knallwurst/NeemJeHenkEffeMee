import { useState, useContext } from 'react';
import { addNewUserToDatabase } from '../../fictional database/db.js';
import { geocodeAddress } from '../../helpers/geocoder';
import { AuthContext } from "../../context/AuthContext.jsx";  // Import the AuthContext

function AddUser() {
    const [error, setError] = useState('');
    const { isAuth } = useContext(AuthContext);  // Access isAuth from AuthContext

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!isAuth) {
            setError("You must be signed in to add a user.");
            return;
        }

        const name = event.target.name.value;
        const address = event.target.address.value;
        const email = event.target.email.value;
        const profession = event.target.profession.value;
        const experience = event.target.experience.value;

        geocodeAddress(address, (location, addressComponents) => {
            if (!addressComponents) {
                setError("Could not retrieve address components.");
                return;
            }

            const formattedAddress = formatAddress(addressComponents);

            try {
                // Add new user to the fictional database
                addNewUserToDatabase(
                    name,
                    { lat: location.lat(), lng: location.lng() },
                    formattedAddress,
                    email,
                    profession,
                    experience
                );

                console.log("User added successfully to the fictional database.");
            } catch (error) {
                console.error("Error adding new user:", error);
                setError("Error adding new user.");
            }
        });

        event.target.reset(); // Clear the form after submission
    };

    const formatAddress = (addressComponents) => {
        let street = '';
        let number = '';
        let city = '';
        let country = '';

        addressComponents.forEach((component) => {
            if (component.types.includes("street_number")) {
                ({ long_name: number } = component);
            }
            if (component.types.includes("route")) {
                street = component.long_name;
            }
            if (component.types.includes("locality")) {
                city = component.long_name;
            }
            if (component.types.includes("country")) {
                country = component.long_name;
            }
        });

        return `${street} ${number}, ${city}, ${country}`;
    };

    return (
        <div>
            <h2>Add a New User</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Name" required />
                <input type="text" name="address" placeholder="Street + Number, City, Country" required />
                <input type="email" name="email" placeholder="Email" required />
                <input type="text" name="profession" placeholder="Profession" required />
                <input type="text" name="experience" placeholder="Years of experience" required />
                <button type="submit">Add User</button>
            </form>
        </div>
    );
}

export default AddUser;