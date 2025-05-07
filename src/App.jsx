import './App.css'

import {Route, Routes} from "react-router-dom";
import Homepage from "./pages/homepage/Homepage.jsx";
import Register from "./pages/register/Register.jsx";
import Navigation from "./components/navigation/Navigation.jsx";
import Login from "./pages/logIn/Login.jsx";
import About from "./pages/about/About.jsx";
import AddUser from "./pages/addUser/AddUser.jsx";
import Profile from "./pages/profile/Profile.jsx";

function App() {

    return (
        <div className="page-container">
            <Navigation/>

            <Routes>
                <Route path="/" element={<Homepage/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/about" element={<About/>}/>
                <Route path="/add-user" element={<AddUser/>}/>
                <Route path="/profile" element={<Profile/>}/>
            </Routes>
        </div>
    )
}

export default App