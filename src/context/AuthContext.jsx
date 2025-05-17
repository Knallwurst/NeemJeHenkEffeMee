import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import axios from "axios";
import isTokenValid from "../helpers/tokenValidation.js";
import avatar from "../assets/avatar.png"; // Default avatar

export const AuthContext = createContext({});

function AuthContextProvider({ children }) {
    const [isAuth, setIsAuth] = useState({ isAuth: false, user: {}, status: "pending" });
    const [profilePicture, setProfilePicture] = useState(avatar); // Profile picture state
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            const decoded = jwtDecode(token);

            if (isTokenValid(decoded)) {
                getUserDetails(decoded.sub, token).then();
                console.log(   "gamer")
                console.log(`Token is herkend, ${decoded.sub} is opnieuw ingelogd!`);
            } else {
                setIsAuth({
                    isAuth: false,
                    user: null,
                    status: "done"
                });
            }
        } else {
            setIsAuth({
                isAuth: false,
                user: null,
                status: "done",
            });
        }
    }, []);

    function login(accessToken) {
        localStorage.setItem("token", accessToken);
        const decoded = jwtDecode(accessToken);
        setIsAuth({
            isAuth: true,
            user: decoded.sub,
            status: "done"
        });
        getUserDetails(decoded.sub, accessToken).then();
        console.log("Gebruiker is ingelogd!");
    }

    function logOut() {
        localStorage.clear();
        setIsAuth({
            isAuth: false,
            user: null,
            status: "done"
        });
        setProfilePicture(avatar); // Reset profile picture to default
        console.log("Gebruiker is uitgelogd!");
        navigate("/");
        window.location.reload(); // Refresh the page after navigating
    }

    async function getUserDetails(username, token) {
        try {
            const userDetails = await axios.get(`https://api.datavortex.nl/neemjehenkffmee/users/${username}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            });

            
            try{
                // Fetch the user's profile picture
            const profilePicResponse = await axios.get(`https://api.datavortex.nl/neemjehenkffmee/users/${username}/download`, {
                headers: {
                    "X-Api-Key": import.meta.env.VITE_NOVI_BACKEND_API_KEY,
                    Authorization: `Bearer ${token}`,
                },
                responseType: "blob",
            });
            const imageBlob = profilePicResponse.data;
            const imageUrl = URL.createObjectURL(imageBlob);
            setProfilePicture(imageUrl); // Set profile picture
            }catch(error){
                console.log(error)
            }
           

            setIsAuth({
                ...isAuth,
                isAuth: true,
                user: {
                    username: userDetails.data.username,
                    email: userDetails.data.email,
                },
                status: "done"
            });
           
            navigate("/");
        } catch (error) {
            setIsAuth({
                isAuth: false,
                user: null,
                status: "done"
            });
            console.error("Error fetching user details or profile picture:", error);
        }
    }

    const contextData = {
        isAuth: isAuth.isAuth,
        user: isAuth.user,
        profilePicture, // Expose profile picture to context
        login,
        logOut,
    };

    return (
        <AuthContext.Provider value={contextData}>
            {isAuth.status === "done" ? children : <p>Loading...</p>}
        </AuthContext.Provider>
    );
}

export default AuthContextProvider;