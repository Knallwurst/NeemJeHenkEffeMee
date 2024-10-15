import {createContext, useEffect, useState} from "react";
import {jwtDecode} from "jwt-decode";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import isTokenValid from "../../../neemjehenkffmee/src/helpers/tokenValidation.js";

export const AuthContext = createContext({});

function AuthContextProvider({children}) {
    const [isAuth, setIsAuth] = useState({isAuth: false, user: {}, status: "pending"});
    const navigate = useNavigate();

    useEffect( () => {
        const token = localStorage.getItem("token");

        if (token) {
            const decoded = jwtDecode(token);

            if (isTokenValid(decoded)) {
                getUserDetails(decoded.sub, token).then();
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
        console.error(error);
    }
}

const contextData = {
    isAuth: isAuth.isAuth,
    user: isAuth.user,
    "login": login,
    "logOut": logOut,
};

return (
    <AuthContext.Provider value={contextData}>
        { isAuth.status === "done" ? children : <p>Loading...</p> }
    </AuthContext.Provider>
);
}

export default AuthContextProvider;