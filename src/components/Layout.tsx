import { Link, Outlet, useNavigate } from "react-router";
import "../App.css";
import { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import type { AuthState } from "../store/authStore";

export default function Layout() {
  const navigate = useNavigate();
  const logout = useAuthStore((s: AuthState) => s.logout);
  const token = useAuthStore((s: AuthState) => s.token);

  const [darkMode, setDarkMode] = useState<boolean>(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="app">
      <nav className="top-nav" style={{ padding: 12, display: "flex", gap: 12, alignItems: "center" }}>
        <Link to="/" className="nav-link nav-link--primary">Dashboard</Link>
        <Link to="/applicants" className="nav-link nav-link--primary">Applicants</Link>
        <Link to="/internships" className="nav-link nav-link--primary">Internships</Link>
        <div style={{ marginLeft: "auto" }}>
          {token ? (
            <button onClick={handleLogout} className="nav-link nav-link--primary" style={{ border: "none" }}>
              Logout
            </button>
          ) : (
            <Link to="/login" className="nav-link nav-link--primary">Login</Link>
          )}
        </div>
      </nav>

      <div className="header relative">
        <button
          onClick={() => setDarkMode((v) => !v)}
          className="dark-toggle"
          style={{ position: "absolute", right: 16, top: 16 }}
        >
          {darkMode ? "Light" : "Dark"}
        </button>

        <h1>Internship Application Tracker</h1>
        <h3>Jashia Deveza IT4B</h3>
      </div>

      <main style={{ padding: 16 }}>
        <div className="panel">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
