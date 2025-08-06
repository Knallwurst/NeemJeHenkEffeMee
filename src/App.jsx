import "./App.css";

import { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import Navigation from "./components/navigation/Navigation.jsx";
import { AuthContext } from "./context/AuthContext.jsx";
import About from "./pages/about/About.jsx";
import FavoriteGarages from "./pages/favoriteGarages/FavoriteGarages.jsx";
import Homepage from "./pages/homepage/Homepage.jsx";
import Login from "./pages/logIn/Login.jsx";
import Profile from "./pages/profile/Profile.jsx";
import Register from "./pages/register/Register.jsx";

function App() {
  const { isAuth } = useContext(AuthContext);

  return (
    <div className="page-container">
      <Navigation />

      <Routes>
        {isAuth ? (
          <>
            <Route path="/" element={<Homepage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/favorites" element={<FavoriteGarages />} />
          </>
        ) : (
          <>
            <Route path="/" element={<About />} />
            <Route path="/about" element={<About />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </>
        )}
      </Routes>
    </div>
  );
}

export default App;
