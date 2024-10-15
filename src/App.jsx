import './App.css'
import {Route, Routes} from "react-router-dom";
import Homepage from "../../neemjehenkffmee/src/pages/homepage/Homepage.jsx";
import Register from "../../neemjehenkffmee/src/pages/register/Register.jsx";
import Navigation from "../../neemjehenkffmee/src/components/navigation/Navigation.jsx";
import Login from "../../neemjehenkffmee/src/pages/logIn/Login.jsx";
import About from "../../neemjehenkffmee/src/pages/about/About.jsx";
import AddUser from "../../neemjehenkffmee/src/pages/addUser/AddUser.jsx";

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
          </Routes>
      </div>
  )
}

export default App