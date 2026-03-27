import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Used to prevent double-submission
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await login(username, password);
      navigate("/");
    } catch (err) {
      const data = err.response?.data;
      setError("Invalid username or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="login">
      <div className="container">
        <h2>Login to Your Account</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            placeholder="Username"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="button" onClick={() => setShowPassword((prev) => !prev)}>
            {showPassword ? "Hide" : "Show"} Password
          </button>
          {error && <p role="alert">{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p>Don't have an account? <Link to="/register">Register here</Link></p>
        <p>Forgot your password?<Link to="/password-reset-request">Reset password</Link></p>
        
      </div>
    </section>
  );
}
