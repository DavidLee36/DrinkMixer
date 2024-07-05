import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import SecretListener from './pages/SecretListener';
import DrinkPage from './pages/DrinkPage'
import AdminLogin from './pages/AdminLogin';
import AdminPage from './pages/AdminPage';

const App = () => {

    return (
        <Router>
            <SecretListener/>
            <Routes>
                <Route path="/" element={<DrinkPage />} />
                <Route path="/login" element={<AdminLogin />} />
                <Route path="/adminpage" element={<AdminPage />} />
            </Routes>
        </Router>
        
    )
}

export default App