import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "../store/authStore";
import type { AuthState } from "../store/authStore";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
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
        <Label htmlFor="username">Username</Label>
        <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username" />
        <Button type="submit">Login</Button>
      </form>
    </div>
  );
}
