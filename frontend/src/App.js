import React from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Comparison from "./components/Comparison";
import AlertSettings from "./components/AlertSettings";
import Notifications from "./components/Notifications";
import "./App.css";

function NavBar() {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <span className="nav-logo">🌬️</span>
        <span className="nav-title">AirQuality Monitor</span>
      </div>
      <ul className="nav-links">
        <li>
          <NavLink to="/" end className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            🏠 Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/comparison" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            📊 Compare
          </NavLink>
        </li>
        <li>
          <NavLink to="/settings" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            ⚙️ Settings
          </NavLink>
        </li>
        <li>
          <NavLink to="/notifications" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            🔔 Notifications
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default function App() {
  return (
    <Router>
      <div className="app">
        <NavBar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/comparison" element={<Comparison />} />
            <Route path="/settings" element={<AlertSettings />} />
            <Route path="/notifications" element={<Notifications />} />
          </Routes>
        </main>
        <footer className="footer">
          <p>
            Air Quality Monitor · Data from{" "}
            <a href="https://openweathermap.org/" target="_blank" rel="noopener noreferrer">
              OpenWeatherMap
            </a>
          </p>
        </footer>
      </div>
    </Router>
  );
}
