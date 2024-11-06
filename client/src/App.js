// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import EntryScreen from './compoments/EntryScreen';
import Register from './compoments/Register' // Assuming Register component is in same folder

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<EntryScreen />} />
                <Route path="/register" element={<Register />} />
                {/* Add other routes here as needed */}
            </Routes>
        </Router>
    );
}

export default App;
