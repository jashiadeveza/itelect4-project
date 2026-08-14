import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "../store/authStore";
import type { AuthState } from "../store/authStore";
import "../App.css";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const login = useAuthStore((s: AuthState) => s.login);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // fake token
    login(`token-for-${username || "guest"}`);
    navigate("/");
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username" />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
