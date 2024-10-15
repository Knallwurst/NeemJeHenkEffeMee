export const userDatabase = [
    {
        id: 1,
        name: "John Doe",
        location: { lat: 51.2413, lng: 4.9414 },
        address: "Lichtaartsebaan 52, Kasterlee, Belgium",
        email: "Johndoe@dummy.com",
        profession: "Car mechanic",
        experience: 15,
    },
    {
        id: 2,
        name: "Jane Doe",
        location: { lat: 51.2375, lng: 4.9507 },
        address: "Olensteenweg 45, Kasterlee, Belgium",
        email: "Janedoe@dummy.com",
        profession: "Automotive engineer",
        experience: 10,
    }
];

// Function to add a new user to the database
export function addNewUserToDatabase(name, location, address, email, profession, experience) {
    const newUser = {
        id: userDatabase.length + 1, // auto-increment ID
        name: name,
        location: location,
        address: address,
        email: email,
        profession: profession,
        experience: experience,
    };

    userDatabase.push(newUser); // Add user to database
    return newUser; // Return the new user object
}