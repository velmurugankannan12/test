import Login from '../components/login/login'
import Dashboard from '../components/home'
import React from 'react';
import { Routes, Route, BrowserRouter } from "react-router-dom";


function App() {
  return (
    <div className="App">

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
