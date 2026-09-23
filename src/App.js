import './App.css';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './i18n';
import Navbar from './Pages/Home/Navbar';
import Home from './Pages/Home/Homescreen';
import PrivacyPolicy from './Pages/Legal/PrivacyPolicy';
import TermsOfService from './Pages/Legal/TermsOfService';
import CookiesSettings from './Pages/Legal/CookiesSettings';

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<><Navbar /><Home /></>} />
        <Route path="/privacy-policy" element={<><Navbar /><PrivacyPolicy /></>} />
        <Route path="/terms-of-service" element={<><Navbar /><TermsOfService /></>} />
        <Route path="/cookies-settings" element={<><Navbar /><CookiesSettings /></>} />
        
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </div>
  );
}

export default App;
