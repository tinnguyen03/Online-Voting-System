import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "../src/pages/Home";
import Register from "../src/pages/Register";
import Vote from "../src/pages/Vote";
import Login from "../src/pages/Login";
import Admin from "../src/pages/Admin";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/vote" element={<Vote />} />
      </Routes>
    </Router>
  );
}

export default App;
