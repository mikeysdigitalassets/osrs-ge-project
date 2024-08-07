import './App.css';
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import React, { useState, useEffect } from "react"; 
import Watchlist from "./components/Watchlist";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import Results from './components/Results';
import Home from './components/Home';
import Itemlist from './components/Itemlist';
import HighVolume from './components/HighVolume';
import HighestPrice from './components/HighestPrice';
import Footer from './components/Footer';
import Tracker from './components/Tracker'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.withCredentials = true;

function App() {
  const [selectedItemDetails, setSelectedItemDetails] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get('/api/user')
      .then(response => {
        console.log('User data fetched:', response.data);
        setUser(response.data);
      })
      .catch(error => console.error('Error fetching user data:', error));
  }, []);

  const handleItemSelected = (itemDetails) => {
    
    setSelectedItemDetails(itemDetails);
  };

  

  return (
    <Router>
      <div id="page-content-wrapper">
        <ToastContainer />
        <Header onItemSelected={handleItemSelected} />
        <div className="d-flex" id="wrapper">
          <Sidebar />
          <div className="content">
            <Routes>
              <Route path="/watchlist" element={user && <Watchlist userId={user.id}  />} />
              <Route path="/item/:itemId" element={ <Results userId={user ? user.id : null}   /> } />
              <Route path="/" element={ <Home /> } />
              <Route path="/itemlist" element={ <Itemlist userId={user ? user.id : null} /> } /> 
              <Route path="/highest-volume" element={ <HighVolume userId={user ? user.id : null} /> } />
              <Route path="/highest-price" element={ <HighestPrice userId={user ? user.id : null} /> } />
              <Route path="/tracker" element={ <Tracker userId={user ? user.id : null } /> } />
              
            </Routes>
            
          </div>
        </div>
        {/* <Footer /> */}
      </div>
    </Router>
  );
}

export default App;





