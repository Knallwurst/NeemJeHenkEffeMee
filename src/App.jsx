import "./App.css";

import { Route, Routes } from "react-router-dom";
import Homepage from "./pages/homepage/Homepage.jsx";
import Register from "./pages/register/Register.jsx";
import Navigation from "./components/navigation/Navigation.jsx";
import Login from "./pages/logIn/Login.jsx";
import About from "./pages/about/About.jsx";
import AddUser from "./pages/addUser/AddUser.jsx";
import Profile from "./pages/profile/Profile.jsx";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext.jsx";

function App() {
  const { isAuth } = useContext(AuthContext);

  return (
    <div className="page-container">
      <Navigation />

      <Routes>
        {isAuth ? (
          <>
            <Route path="/" element={<Homepage />} />
            <Route path="/home" element={<Homepage />} />
            <Route path="/profile" element={<Profile />} />
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
