import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {BrowserRouter as Router} from 'react-router-dom';
import AuthContextProvider from "../../neemjehenkffmee/src/context/AuthContext.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <Router>
          <AuthContextProvider>
            <App />
          </AuthContextProvider>
      </Router>
  </StrictMode>,
)